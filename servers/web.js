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
 * 404
 */

app.use(function (req, res, next) {
  res.json(404, {
    message: 'not found'
  });
});

/**
 * Error handler
 */

app.use(function (err, req, res, next) {
  var statusCode = err.status || err.statusCode || 500;
  var data = {
    message: err.message
  };

  if (err.name) {
    data.error = err.name;
  }

  if (statusCode >= 500) {
    err.url = err.url || req.url;
    console.error(err.stack);
    logger.error(err);
    if (config.debug) {
      data.stack = err.stack;
    } else {
      data.message = 'Server has some problems. :(';
    }
  }

  res.json(statusCode, data);
});

app = http.createServer(app);

module.exports = app;
