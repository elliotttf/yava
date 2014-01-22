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
User.get = function (req, res) {
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

module.exports = function (userModel) {
  UserModel = userModel;
  return User;
};

