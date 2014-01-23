/**
 * GET workouts list.
 */

var Deferred = require('promised-io/promise').Deferred;

var Workout = {};
var WorkoutModel;

/**
 * REST index callback.
 */
Workout.list = function (req, res) {
  var params = WorkoutModel.schema.paths;
  var query = {};
  for (var param in params) {
    if (params.hasOwnProperty(param) && typeof req.query[param] !== 'undefined') {
      query[param] = req.query[param];
    }
  }
  Workout.findAll(query)
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

/**
 * REST retrieve callback.
 */
Workout.retrieve = function (req, res) {
  if (!req.params.workout_id) {
    res.send(400);
    return;
  }

  Workout.findOne(req.params.workout_id)
    .then(
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
 * @param {object} query
 *   The query parameters to pass through.
 *
 * @return promise
 */
Workout.findAll = function (query) {
  if (typeof query === 'undefined') {
    query = {};
  }

  var deferred = new Deferred();

  WorkoutModel.find(
    query,
    {},
    {
      sort: {
        date: -1
      }
    },
    function (err, workouts) {
    if (err) {
      deferred.reject(err);
      return;
    }

    deferred.resolve(workouts);
  });

  return deferred.promise;
};

/**
 * Internal PI function to select a single workout by id.
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

