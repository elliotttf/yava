/**
 * Goals routes and API.
 */

var Deferred = require('promised-io/promise').Deferred;
var Promise = require('promised-io/promise');
var moment = require('moment');

var Goals = {};
var GoalsModel;
var WorkoutsModel;

function updateGoal(goal) {
  var deferred = new Deferred();

  // Update goal hours.
  if (goal.get('hoursTotal')) {
    WorkoutsModel.aggregate(
      {
        $match: {
          user: goal.get('user'),
          date: {
            $gte: goal.get('start'),
            $lt: goal.get('end')
          }
        }
      },
      {
        $group: { _id: null, hoursTotal: { $sum: '$duration' }}
      },
      function (err, res) {
        if (err) {
          console.log(err);
          deferred.reject(err);
          return;
        }
        else if (!res[0] || typeof res[0].hoursTotal === 'undefined') {
          goal.set('hoursProgress', 0);
          goal.save(function (err) {
            if (err) {
              deferred.reject(err);
              return;
            }
            deferred.resolve(goal);
          });
          return;
        }

        // Convert duration seconds to hours.
        var hoursProgress = (res[0].hoursTotal / 60 / 60);
        goal.set('hoursProgress', hoursProgress);

        if (hoursProgress >= goal.get('hoursTotal')) {
          goal.set('complete', true);
        }

        goal.save(function (err) {
          if (err) {
            deferred.reject(err);
            return;
          }
          deferred.resolve(goal);
        });
      }
    );
  }
  // Update goal workouts.
  else if (goal.get('workoutsTotal')) {
    WorkoutsModel.count(
      {
        user: goal.get('user'),
        date: {
          $gte: goal.get('start'),
          $lt: goal.get('end')
        }
      },
      function (err, count) {
        if (err) {
          console.log(err);
          deferred.reject(err);
          return;
        }
        goal.set('workoutsProgress', count);

        if (count >= goal.get('workoutsTotal')) {
          goal.set('complete', true);
        }

        goal.save(function (err) {
          if (err) {
            deferred.reject(err);
            return;
          }
          deferred.resolve(goal);
        });
      }
    );
  }

  return deferred.promise;
}

/**
 * REST list callback.
 */
Goals.list = function (req, res) {
  var params = GoalsModel.schema.paths;
  var query = {};
  var end;
  for (var param in params) {
    if (params.hasOwnProperty(param) && typeof req.query[param] !== 'undefined') {
      query[param] = req.query[param];

      if (param === 'complete') {
        if (query[param] === 'true') {
          query[param] = true;
        }
        else {
          query[param] = false;
        }
      }
    }
  }

  // Additional acceptable parameters.
  if (typeof req.query.endsAfter !== 'undefined') {
    end = moment(req.query.endsAfter);
    if (end.isValid()) {
      query.end = { $gte: end.toDate() };
    }
    else {
      res.send(400);
      return;
    }
  }

  if (typeof req.query.endsBefore !== 'undefined') {
    end = moment(req.query.endsBefore);
    if (end.isValid()) {
      query.end = { $lt: end.toDate() };
    }
    else {
      res.send(400);
      return;
    }
  }

  Goals.findAll(query).then(
    function found(goals) {
      res.json({ goals: goals });
    },
    function error(err) {
      console.log(err);
      res.send(500);
    }
  );
};

/**
 * REST callback for creating a goal.
 */
Goals.create = function (req, res) {
  if (!req.body.goal) {
    res.send(400);
    return;
  }

  Goals.save(req.body.goal).then(
    function (goal) {
      res.json({ goal: goal });
    },
    function (err) {
      console.log(err);
      res.send(500);
    }
  );
};

/**
 * REST callback for getting a goal.
 */
Goals.retrieve = function (req, res) {
  if (!req.params.goal_id) {
    res.send(400);
    return;
  }

  Goals.findOne(req.params.goal_id).then(
    function (goal) {
      if (!goal) {
        res.send(404);
        return;
      }
      res.json({ goal: goal });
    },
    function (err) {
      console.log(err);
      res.send(500);
    }
  );
};

/**
 * REST callback for deleteing a goal.
 */
Goals.delete = function (req, res) {
  if (!req.params.goal_id) {
    res.send(400);
    return;
  }

  Goals.remove(req.params.goal_id).then(
    function () {
      res.send(204);
    },
    function (err) {
      console.log(err);
      res.send(500);
    }
  );
};

/**
 * Internal API function to select all goals.
 *
 * @param {object} query
 *   The query parameters to pass through.
 *
 * @return promise
 */
Goals.findAll = function (query) {
  if (typeof query === 'undefined') {
    query = {};
  }

  var deferred = new Deferred();

  GoalsModel.find(
    query,
    {},
    {
      sort: {
        start: -1
      }
    },
    function (err, goals) {
    if (err) {
      deferred.reject(err);
      return;
    }

    deferred.resolve(goals);
  });

  return deferred.promise;
};

/**
 * Internal API function for finding a single goal. Will upsert a goal
 * if one doesn't exist or has expired values.
 *
 * @param {string} id
 *   The goal ID to find.
 *
 * @return promise.
 */
Goals.findOne = function (id) {
  var deferred = new Deferred();

  GoalsModel.findById(id, function (err, goal) {
    if (err) {
      deferred.reject(err);
      return;
    }

    if (!goal) {
      deferred.resolve();
      return;
    }
    deferred.resolve(goal);
  });

  return deferred.promise;
};

/**
 * Internal API function to update a user's goals.
 *
 * @param {WorkoutModel} workout
 *   The workout to update goals for.
 *
 * @return promise.
 */
Goals.updateGoals = function (workout) {
  var deferred = new Deferred();
  var updates = [];

  GoalsModel.find(
    {
      user: workout.get('user'),
      start: { $lte: workout.get('date') },
      end: { $gt : workout.get('date') }
    },
    function (err, goals) {
      if (err) {
        console.log(err);
        deferred.reject(err);
        return;
      }

      if (!goals) {
        deferred.resolve();
        return;
      }

      var goal;
      for (var i = 0; i < goals.length; i++) {
        goal = goals[i];

        updates.push(updateGoal(goal));

      }

      var done = Promise.all(updates);
      done.then(
        function () {
          deferred.resolve(goal);
        },
        function () {
          deferred.reject();
        }
      );
    }
  );


  return deferred.promise;
};

/**
 * Internal API function to save goal.
 */
Goals.save = function (goal, id) {
  var deferred = new Deferred();
  var savePromise = new Deferred();

  if (typeof id === 'undefined') {
    GoalsModel.create(goal, function (err, goal) {
      if (err) {
        savePromise.reject(err);
        return;
      }

      savePromise.resolve(goal);
    });
  }
  else {
    GoalsModel.findOne({ _id: id }, function (err, goalDoc) {
      if (err) {
        savePromise.reject(err);
        return;
      }

      if (!goalDoc) {
        savePromise.reject('Not found');
        return;
      }

      goalDoc.set(goal);
      goalDoc.save(function (err, goal) {
        if (err) {
          savePromise.reject(err);
          return;
        }

        savePromise.resolve(goal);
      });
    });
  }

  savePromise.promise.then(
    function (goalDoc) {
      updateGoal(goalDoc).then(
        function (goal) {
          deferred.resolve(goal.toObject());
        },
        function (err) {
          deferred.reject(err);
        }
      );
    },
    function (err) {
      deferred.reject(err);
    }
  );

  return deferred.promise;
};

/**
 * Internal API callback for removing a goal.
 *
 * @param {string} id
 *   The goal ID to remove.
 *
 * @return promise
 */
Goals.remove = function (id) {
  var deferred = new Deferred();

  GoalsModel.remove({ _id: id }, function (err) {
    if (err) {
      deferred.reject(err);
      return;
    }
    deferred.resolve();
  });

  return deferred.promise;
};

module.exports = function (goalsModel, workoutsModel) {
  GoalsModel = goalsModel;
  WorkoutsModel = workoutsModel;
  return Goals;
};

