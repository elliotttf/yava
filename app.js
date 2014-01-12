var http = require('http');
var express = require('express');
var path = require('path');
var app = require('./server/app');

app.use(express.static(path.join(__dirname, 'dist')));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

