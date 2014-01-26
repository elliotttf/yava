var Deferred = require('promised-io/promise').Deferred;

var Stats = {};
var StatsModel;
var WorkoutsModel;

Stats.retrieve = function (req, res) {
  if (!req.params.stat_id) {
    res.send(400);
    return;
  }

  Stats.findOne(req.params.stat_id).then(
    function (stat) {
      res.json({ stat: stat });
    },
    function (err) {
      console.log(err);
      res.send(500);
    }
  );
};

Stats.findOne = function (id) {
  var deferred = new Deferred();

  StatsModel.findById(id, function (err, stat) {
    if (err) {
      deferred.reject(err);
      return;
    }

    deferred.resolve(stat);
  });

  return deferred.promise;
};

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

Stats.update = function (user_id) {
  StatsModel.findOne({ user: user_id }, function (err, stat) {
    if (err) {
      console.log(err);
      return;
    }

    if (!stat) {
      console.log('Stats not found for ' + user_id);
      return;
    }

    // Update total hours.
    WorkoutsModel.aggregate(
      {
        $match: { user: user_id }
      },
      {
        $group: { _id: null, allHours: { $sum: '$duration' }}
      },
      function (err, res) {
        if (err || !res[0] || typeof res[0].allHours === 'undefined') {
          console.log(err);
          return;
        }
        stat.set('allHours', res[0].allHours);
        stat.save();
      }
    );

    // Update total workouts.
    WorkoutsModel.count({ user: user_id }, function (err, count) {
      if (err) {
        console.log(err);
        return;
      }
      stat.set('allWorkouts', count);
      stat.save();
    });
  });
};

module.exports = function (statsModel, workoutsModel) {
  StatsModel = statsModel;
  WorkoutsModel = workoutsModel;
  return Stats;
};


