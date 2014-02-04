/**
 * Stats routes and API.
 */

var Deferred = require('promised-io/promise').Deferred;
var Promise = require('promised-io/promise');
var moment = require('moment');

var Stats = {};
var StatsModel;
var WorkoutsModel;

/**
 * Helper function to update stats for a given range.
 *
 * @param {String} user_id
 *   The user ID to update stats for.
 * @param {StatsModel} stat
 *   The stat to update
 * @param {string} range
 *   The range variable to update, one of:
 *     - week
 *     - month
 *     - year
 */
function updateStats(user_id, stat, range) {
  var deferred = new Deferred();
  var updates = [];
  var expiresField = range + 'Expires';
  var hoursField = range + 'Hours';
  var workoutsField = range + 'Workouts';

  if (!stat.get(expiresField) || stat.get(expiresField) < new Date()) {
    stat.set(expiresField, moment().endOf(range).toDate());
  }

  var starts = moment(stat.get(expiresField)).startOf(range).toDate();
  var hoursPromise = new Deferred();
  updates.push(hoursPromise.promise);
  WorkoutsModel.aggregate(
    {
      $match: {
        user: user_id,
        date: {
          $gte: starts,
          $lt: stat.get(expiresField)
        }
      }
    },
    {
      $group: {
        _id: null,
        hours: { $sum: '$duration' }
      }
    },
    function (err, res) {
      if (err) {
        console.log(err);
        hoursPromise.reject(err);
        return;
      }
      else if (!res[0] || typeof res[0].hours === 'undefined') {
        stat.set(hoursField, 0);
        stat.save();
        hoursPromise.resolve();
        return;
      }
      stat.set(hoursField, res[0].hours);
      stat.save();
      hoursPromise.resolve();
    }
  );

  var workoutsPromise = new Deferred();
  updates.push(workoutsPromise.promise);
  WorkoutsModel.count(
    {
      user: user_id,
      date: {
        $gte: starts,
        $lt: stat.get(expiresField)
      }
    },
    function (err, count) {
      if (err) {
        console.log(err);
        workoutsPromise.reject(err);
        return;
      }
      stat.set(workoutsField, count);
      stat.save();
      workoutsPromise.resolve();
    }
  );

  var done = Promise.all(updates);
  done.then(
    function () {
      deferred.resolve();
    },
    function () {
      deferred.reject();
    }
  );

  return deferred.promise;
}

/**
 * REST callback for getting a stat.
 */
Stats.retrieve = function (req, res) {
  if (!req.params.stat_id) {
    res.send(400);
    return;
  }

  Stats.findOne(req.params.stat_id).then(
    function (stat) {
      if (!stat) {
        res.send(404);
        return;
      }
      res.json({ stat: stat });
    },
    function (err) {
      console.log(err);
      res.send(500);
    }
  );
};

/**
 * Internal API function for finding a single stat. Will upsert a stat
 * if one doesn't exist or has expired values.
 *
 * @param {string} id
 *   The stat ID to find.
 *
 * @return promise.
 */
Stats.findOne = function (id) {
  var deferred = new Deferred();

  StatsModel.findById(id, function (err, stat) {
    if (err) {
      deferred.reject(err);
      return;
    }

    var now = new Date();
    if (!stat) {
      deferred.resolve();
      return;
    }
    if (
      !stat.weekExpires || stat.weekExpires < now ||
      !stat.monthExpires || stat.monthExpires < now ||
      !stat.yearExpires || stat.yearExpires < now
    ) {
      Stats.updateStats(stat.user).then(
        function (updatedStat) {
          deferred.resolve(updatedStat);
        },
        function () {
          deferred.reject();
        }
      );
    }
    else {
      deferred.resolve(stat);
    }
  });

  return deferred.promise;
};

/**
 * Internal API function to create a new stat for a user.
 *
 * @param {string} user_id
 *   The user ID to create a stat for.
 *
 * @return promise
 */
Stats.createNew = function (user_id) {
  var deferred = new Deferred();

  StatsModel.create({ user: user_id }, function (err, savedStat) {
    if (err) {
      deferred.reject(err);
      return;
    }
    deferred.resolve(savedStat);
  });

  return deferred.promise;
};

/**
 * Internal API function to update a user's stats.
 *
 * @param {string} user_id
 *   The user ID to update stats for.
 *
 * @return promise.
 */
Stats.updateStats = function (user_id) {
  var deferred = new Deferred();
  var updates = [];

  StatsModel.findOne({ user: user_id }, function (err, stat) {
    if (err) {
      console.log(err);
      deferred.reject(err);
      return;
    }

    if (!stat) {
      console.log('Stats not found for ' + user_id);
      deferred.resolve();
      return;
    }

    // Update date stats.
    updates.push(updateStats(user_id, stat, 'week'));
    updates.push(updateStats(user_id, stat, 'month'));
    updates.push(updateStats(user_id, stat, 'year'));

    // Update total hours.
    var allHoursPromise = new Deferred();
    updates.push(allHoursPromise.promise);
    WorkoutsModel.aggregate(
      {
        $match: { user: user_id }
      },
      {
        $group: { _id: null, allHours: { $sum: '$duration' }}
      },
      function (err, res) {
        if (err) {
          console.log(err);
          allHoursPromise.reject(err);
          return;
        }
        else if (!res[0] || typeof res[0].allHours === 'undefined') {
          stat.set('allHours', 0);
          stat.save();
          allHoursPromise.resolve();
          return;
        }
        stat.set('allHours', res[0].allHours);
        stat.save();
        allHoursPromise.resolve();
      }
    );

    // Update total workouts.
    var allWorkoutsPromise = new Deferred();
    updates.push(allWorkoutsPromise.deferred);
    WorkoutsModel.count({ user: user_id }, function (err, count) {
      if (err) {
        console.log(err);
        allWorkoutsPromise.reject(err);
        return;
      }
      stat.set('allWorkouts', count);
      stat.save();
      allWorkoutsPromise.resolve();
    });

    var done = Promise.all(updates);
    done.then(
      function () {
        deferred.resolve(stat);
      },
      function () {
        deferred.reject();
      }
    );
  });


  return deferred.promise;
};

module.exports = function (statsModel, workoutsModel) {
  StatsModel = statsModel;
  WorkoutsModel = workoutsModel;
  return Stats;
};


