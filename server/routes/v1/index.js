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
    users.findOrCreate(profile.username)
      .then(
        function ok(user) {
          done(null, user);
        },
        function error(err) {
          done(err);
        }
      );
  }
));

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', function (req, res, next) {
  passport.authenticate('twitter', function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect('/login');
    }

    req.login(user, function (err) {
      if (err) {
        return next(err);
      }

      res.cookie('uid', user._id.toString());
      return res.redirect('/');
    });
  })(req, res, next);
});
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

/**
 * Helper function to authenticate.
 */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send(401);
}

/**
 * Helper function to grant access to owned resources.
 */
function ensureOwner(req, res, next) {
  var resource = null;
  var param = null;
  if (typeof req.params.user_id !== 'undefined') {
    resource = users;
    param = req.params.user_id;
  }
  else if (typeof req.params.workout_id !== 'undefined') {
    resource = workouts;
    param = req.params.workout_id;
  }

  if (resource) {
    resource.isOwner(req.user._id, param).then(
      function () {
        return next();
      },
      function () {
        res.send(401);
      }
    );
  }
  else {
    res.send(401);
  }
}

app.get('/users', ensureAuthenticated, users.list);
app.get('/users/:user_id', ensureAuthenticated, users.retrieve);

app.get('/workouts', ensureAuthenticated, workouts.list);
app.post('/workouts', ensureAuthenticated, workouts.create);
app.get('/workouts/:workout_id', ensureAuthenticated, workouts.retrieve);
app.put('/workouts/:workout_id', ensureAuthenticated, ensureOwner, workouts.update);
app.delete('/workouts/:workout_id', ensureAuthenticated, ensureOwner, workouts.delete);

