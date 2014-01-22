var path = require('path');

var express = require('express');

var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var app = module.exports = express();
var config = require(path.join(__dirname, '..', '..', 'config', 'config'))[app.get('env')];

var models = require(path.join(__dirname, '..', '..', 'models', 'v1'))(config);

var users = require(path.join(__dirname, 'users'))(models.User);
var workouts = require(path.join(__dirname, 'workouts'))(models.Workout);

app.use(passport.initialize());
app.use(passport.session());

// Auth.
// TODO - store in DB
// @see http://mherman.org/blog/2013/11/10/social-authentication-with-passport-dot-js/
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
passport.use(new TwitterStrategy(
  {
    consumerKey: config.twitter.key,
    consumerSecret: config.twitter.secret,
    callbackURL: config.twitter.callback
  },
  function (token, tokenSecret, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    //res.cookie('uid', 
    res.redirect('/');
  }
);

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
app.post('/workouts', ensureAuthenticated, workouts.create);
