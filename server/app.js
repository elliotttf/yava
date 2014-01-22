
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

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
app.use(app.router);

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

var VERSIONS = {
  'Version 1': '/v1'
};

for (var k in VERSIONS) {
  app.use(VERSIONS[k], require(path.join(__dirname, 'routes', VERSIONS[k])));
}

module.exports = app;

