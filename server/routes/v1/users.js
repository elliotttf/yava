/**
 * User routes.
 */

var Deferred = require('promised-io/promise').Deferred;

var User = {};
var UserModel;

/**
 * REST index callback.
 */
User.list = function (req, res) {
  // TODO - paging.
  User.findAll()
    .then(
      function found(users) {
        res.json({
          users: users
        });
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
User.retrieve = function (req, res) {
  if (!req.params.user_id) {
    res.send(400);
    return;
  }

  User.findOne(req.params.user_id)
    .then(
      function found(user) {
        if (user) {
          res.json({
            'user': user
          });
        }
        else {
          res.send(404);
        }
      },
      function error(err) {
        console.log(err);
        res.send(500);
      }
    );
};

/**
 * Helper function to confirm whether or not a user is the owner of a workout.
 *
 * @param {string} accountId
 *   The ID to compare to the workout owner.
 * @param {string} userId
 *   The ID of the workout to check.
 *
 * @return promise
 */
User.isOwner = function (accountId, userId) {
  var deferred = new Deferred();

  UserModel.findOne({ _id: userId, user: accountId }, function (err, workout) {
    if (err || !workout) {
      deferred.reject(err);
      return;
    }

    deferred.resolve();
  });

  return deferred.promise;
};

/**
 * Internal find callback.
 *
 * @param {string} id
 *   The record's ID to look up.
 *
 * @return promise
 *   A promise that resolves when the user is found and
 *   fails if the user is not found.
 */
User.findOne = function (id) {
  var deferred = new Deferred();
  UserModel.findById(id, function (err, user) {
    if (err) {
      deferred.reject(err);
      return;
    }
    deferred.resolve(user);
  });

  return deferred.promise;
};

/**
 * Internal find all callback.
 *
 * @return promise
 *   Resolves when query completes, rejects if error.
 */
User.findAll = function () {
  var deferred = new Deferred();

  UserModel.find(function (err, users) {
    if (err) {
      deferred.reject(err);
      return;
    }

    deferred.resolve(users);
  });

  return deferred.promise;
};

/**
 * Internal find or create method.
 *
 * @param {string} username
 *   The username to look up.
 *
 * @return promise
 */
User.findOrCreate = function (username) {
  var deferred = new Deferred();

  UserModel.findOne({ name: username }, function (err, user) {
    if (err) {
      deferred.reject(err);
      return;
    }

    if (user) {
      deferred.resolve(user);
    }
    else {
      user = new UserModel({ name: username });
      user.save(function (err) {
        if (err) {
          deferred.reject(err);
          return;
        }

        deferred.resolve(user);
      });
    }
  });

  return deferred.promise;
};

/**
 * Internal save method.
 *
 * @param {object} user
 *   The user object to update.
 * @param {string} id
 *   The user id to update.
 *
 * @return promise
 */
User.save = function (user, id) {
  var deferred = new Deferred();

  if (typeof id === 'undefined') {
  }
  else {
    UserModel.findOne(id, function (err, userDoc) {
      if (err) {
        deferred.reject(err);
        return;
      }

      if (!userDoc) {
        deferred.reject('Not found');
        return;
      }

      userDoc.set(user);
      userDoc.save(function (err, user) {
        if (err) {
          deferred.reject(err);
          return;
        }

        deferred.resolve(user.toObject());
      });
    });
  }

  return deferred.promise;
};

module.exports = function (userModel) {
  UserModel = userModel;
  return User;
};

