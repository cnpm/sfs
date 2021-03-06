/**!
 * sfs - routes/web.js
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

var multipart = require('connect-multiparty');
var file = require('../controllers/file');
var home = require('../controllers/home');
var config = require('../config');

var multipartMiddleware = multipart({uploadDir: config.uploadDir});

function routes(app) {
  app.get('/', home);
  app.get(/^\/file\/(.+)$/, file.get);
  app.delete(/^\/file\/(.+)$/, file.remove);
  app.delete(/^\/sync\/(.+)$/, file.removeOther);
  app.post('/store', multipartMiddleware, file.store);
  app.post('/sync', multipartMiddleware, file.sync);
}

module.exports = routes;
