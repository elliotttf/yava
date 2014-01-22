/**
 * Workout routes.
 */

var path = require('path');
var mongoose = require('mongoose');

module.exports = function (config) {
  var connect = function () {
    var options = {
      server: {
        socketOptions: {
          keepAlive: 1
        }
      }
    };
    mongoose.connect(config.db, options);
  };
  connect();

  // Error handler
  mongoose.connection.on('error', function (err) {
    console.log(err);
  });

  // Reconnect when closed
  mongoose.connection.on('disconnected', function () {
    connect();
  });

  return {
    User: mongoose.model('User', require(path.join(__dirname, 'user'))),
    Workout: mongoose.model('Workout', require(path.join(__dirname, 'workout')))
  };
};

