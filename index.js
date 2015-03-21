var debug = require('debug')('weatherw:index');
var express = require('express');
var webRouter = require('./lib/web/router');

debug('setting up http server');
var app = express();
app.use(webRouter);
var port = process.env.PORT || 4000;
app.listen(port);
console.log('Weather-widget server lisetning on port', port);
