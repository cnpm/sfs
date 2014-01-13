/*!
 * sfs - servers/web.js
 *
 * Copyright(c) 2014
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var connect = require('connect');
var http = require('http');

require('response-patch');
var path = require('path');
var http = require('http');
var connect = require('connect');
var urlrouter = require('urlrouter');
var bodyParser = require('body-parser');
var routes = require('../routes/web');
var logger = require('../common/logger');
var config = require('../config');
var baseauth = require('../middlewares/baseauth');
var app = connect();

var rootdir = path.dirname(__dirname);

app.use(function (req, res, next) {
  res.req = req;
  next();
});
app.use(bodyParser());
app.use(baseauth());

/**
 * Routes
 */

app.use(urlrouter(routes));

/**
 * Error handler
 */

app.use(function (err, req, res, next) {
  err.url = err.url || req.url;
  console.error(err.stack);
  logger.error(err);
  if (config.debug) {
    return next(err);
  }
  res.statusCode = 500;
  res.send('Server has some problems. :(');
});

app = http.createServer(app);

module.exports = app;
