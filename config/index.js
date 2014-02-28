/**!
 * sfs - config/index.js
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

var path = require('path');
var mkdirp = require('mkdirp');
var address = require('address');

var root = path.dirname(__dirname);
var tmpdir = path.join(root, '.tmp');

var config = {
  ip: address.ip(),
  enableCluster: false,
  port: 7001,
  nodes: [
    {ip: '127.0.0.1', port: 7002},
  ],
  credentials: ['sfsadmin', 'sfsadmin123'],
  rootDir: path.join(tmpdir, 'files'),
  logdir: path.join(tmpdir, 'logs'),
  // uploadDir: /tmp, upload tmp dir
};

mkdirp.sync(config.logdir);
mkdirp.sync(config.rootDir);

module.exports = config;

config.load = function (customConfig) {
  if (!customConfig) {
    return;
  }
  for (var key in customConfig) {
    config[key] = customConfig[key];
  }
};
