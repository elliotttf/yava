
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'AjcvXrHDrtjz' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

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
    consumerKey: 'nM1Qme7AjcvXrHDrtjzDkg',
    consumerSecret: 'AVqHxDxlLij64OteIsTrWiF9OLftKrBygpp8b0G5SU',
    callbackURL: 'http://localhost:9001/auth/twitter/callback'
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
    res.redirect('/');
  }
);

var VERSIONS = {
  'Version 1': '/v1'
};

for (var k in VERSIONS) {
  app.use(VERSIONS[k], require(path.join(__dirname, 'routes', VERSIONS[k])));
}

module.exports = app;

