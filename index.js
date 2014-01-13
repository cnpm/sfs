/**!
 * sfs - index.js
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

var config = require('./config');

exports.start = function (customConfig) {
  config.load(customConfig);
  require('./worker');
};
