/**
 * GET workouts list.
 */

var Deferred = require('promised-io/promise').Deferred;

var Workout = {};
var WorkoutModel;

Workout.list = function (req, res) {
  Workout.findAll()
    .then(
      function found(workouts) {
        res.json({ workouts: workouts });
      },
      function error(err) {
        console.log(err);
        res.send(500);
      }
    );
};

Workout.create = function (req, res) {
  if (!req.body.workout) {
    res.send(400);
    return;
  }

  Workout.save(req.body.workout)
    .then(
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
 * Internal API function to select all workouts.
 *
 * @return promise
 */
Workout.findAll = function () {
  var deferred = new Deferred();

  WorkoutModel.find(function (err, workouts) {
    if (err) {
      deferred.reject(err);
      return;
    }

    deferred.resolve(workouts);
  });

  return deferred.promise;
};

/**
 * Internal API function to save workout.
 */
Workout.save = function (workout) {
  var deferred = new Deferred();

  WorkoutModel.create(workout, function (err, workout) {
    if (err) {
      deferred.reject(err);
      return;
    }

    deferred.resolve(workout.toObject());
  });

  return deferred.promise;
};

module.exports = function (workoutModel) {
  WorkoutModel = workoutModel;
  return Workout;
};

