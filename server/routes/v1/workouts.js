/**
 * Workouts routes and API.
 */

var Deferred = require('promised-io/promise').Deferred;
var path = require('path');

var Workout = {};
var WorkoutModel;
var Stats;
var Goals;
var Venues;
var config;

/**
 * REST index callback.
 */
Workout.list = function (req, res) {
  var params = WorkoutModel.schema.paths;
  var query = {};
  var page;
  for (var param in params) {
    if (params.hasOwnProperty(param) && typeof req.query[param] !== 'undefined') {
      query[param] = req.query[param];
    }
  }
  if (typeof req.query.page !== 'undefined') {
    page = req.query.page;
  }
  Workout.findAll(query, page).then(
    function found(workouts) {
      res.json({ workouts: workouts });
    },
    function error(err) {
      console.log(err);
      res.send(500);
    }
  );
};

/**
 * REST retrieve callback.
 */
Workout.retrieve = function (req, res) {
  if (!req.params.workout_id) {
    res.send(400);
    return;
  }

  Workout.findOne(req.params.workout_id).then(
    function found(workout) {
      res.json({
        workout: workout
      });
    },
    function error(err) {
      console.log(err);
      res.send(500);
    }
  );
};

/**
 * REST create callback.
 */
Workout.create = function (req, res) {
  if (!req.body.workout) {
    res.send(400);
    return;
  }

  Workout.save(req.body.workout).then(
    function saved(savedWorkout) {
      res.json({ workout: savedWorkout });
    },
    function error(err) {
      console.log(error);
      res.send(500);
    }
  );
};

/**
 * REST update callback.
 */
Workout.update = function (req, res) {
  if (!req.body.workout || !req.params.workout_id) {
    res.send(400);
    return;
  }

  Workout.save(req.body.workout, req.params.workout_id).then(
    function saved(savedWorkout) {
      res.json({ workout: savedWorkout });
    },
    function error(err) {
      console.log(error);
      res.send(500);
      return;
    }
  );
};

/**
 * REST delete callback.
 */
Workout.delete = function (req, res) {
  if (!req.params.workout_id) {
    res.send(400);
    return;
  }

  Workout.remove(req.params.workout_id).then(
    function () {
      res.send(204);
    },
    function (err) {
      console.log(err);
      res.send(500);
      return;
    }
  );
};

/**
 * Helper function to confirm whether or not a user is the owner of a workout.
 *
 * @param {string} accountId
 *   The ID to compare to the workout owner.
 * @param {string} workoutId
 *   The ID of the workout to check.
 *
 * @return promise
 */
Workout.isOwner = function (accountId, workoutId) {
  var deferred = new Deferred();

  WorkoutModel.findOne({ _id: workoutId, user: accountId }, function (err, workout) {
    if (err || !workout) {
      deferred.reject(err);
      return;
    }

    deferred.resolve();
  });

  return deferred.promise;
};

/**
 * Internal API function to select all workouts.
 *
 * @param {object} query
 *   The query parameters to pass through.
 *
 * @return promise
 */
Workout.findAll = function (query, page) {
  if (typeof query === 'undefined') {
    query = {};
  }

  var deferred = new Deferred();

  var skip = 0;
  if (page) {
    skip = config.pageLimit * page;
  }

  WorkoutModel
    .find(query)
    .sort({ date: -1 })
    .skip(skip)
    .limit(config.pageLimit)
    .exec(function (err, workouts) {
      if (err) {
        deferred.reject(err);
        return;
      }

      deferred.resolve(workouts);
    });

  return deferred.promise;
};

/**
 * Internal API function to select a single workout by id.
 *
 * @param {string} id
 *   The workout's ID.
 *
 * @return promise
 */
Workout.findOne = function (id) {
  var deferred = new Deferred();

  WorkoutModel.findById(id, function (err, workout) {
    if (err) {
      deferred.reject(err);
      return;
    }

    deferred.resolve(workout);
  });

  return deferred.promise;
};

/**
 * Internal API function to save workout.
 */
Workout.save = function (workout, id) {
  var deferred = new Deferred();

  if (typeof workout.venue) {
    Venues.findOne(workout.venue)
      .then(
        function (venue) {
        }
      );
  }

  if (typeof id === 'undefined') {
    WorkoutModel.create(workout, function (err, workout) {
      if (err) {
        deferred.reject(err);
        return;
      }

      deferred.resolve(workout.toObject());
      Stats.updateStats(workout.get('user'));
      Goals.updateGoals(workout);
    });
  }
  else {
    WorkoutModel.findOne({ _id: id }, function (err, workoutDoc) {
      if (err) {
        deferred.reject(err);
        return;
      }

      if (!workoutDoc) {
        deferred.reject('Not found');
        return;
      }

      workoutDoc.set(workout);
      workoutDoc.save(function (err, workout) {
        if (err) {
          deferred.reject(err);
          return;
        }

        deferred.resolve(workout.toObject());
        Stats.updateStats(workout.get('user'));
        Goals.updateGoals(workout);
      });
    });
  }

  return deferred.promise;
};

/**
 * Internal API method to remove a workout.
 *
 * @param {string} id
 *   The workout's id to be removed.
 *
 * @return promise
 */
Workout.remove = function (id) {
  var deferred = new Deferred();

  WorkoutModel.remove({ _id: id }, function (err, workout) {
    if (err) {
      deferred.reject(err);
      return;
    }

    deferred.resolve();
    delete workout._id;
    var workoutModel = new WorkoutModel(workout);
    Stats.updateStats(workout.get('user'));
    Goals.updateGoals(workout);
  });

  return deferred.promise;
};

module.exports = function (workoutModel, stats, goals, venues, cfg) {
  WorkoutModel = workoutModel;
  Goals = goals;
  Stats = stats;
  Venues = venues;
  config = cfg;
  return Workout;
};

