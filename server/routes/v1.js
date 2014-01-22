var express = require('express');
var users = require('./users');
var workouts = require('./workouts');

var app = module.exports = express();

/**
 * Helper function to authenticate.
 */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

app.get('/users', ensureAuthenticated, users.list);
app.get('/users/:user_id', ensureAuthenticated, users.get);
app.get('/workouts', ensureAuthenticated, workouts.list);
app.post('/workouts', ensureAuthenticated, workouts.save);
