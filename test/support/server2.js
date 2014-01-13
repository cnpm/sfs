/**!
 * sfs - test/support/server2.js
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

var clone = require('clone');
var config = require('../../config');

config.port = 7002;
config.rootDir = '/tmp/sfs_test2';
config.nodes = [
  {ip: '127.0.0.1', port: 7002},
  {ip: '127.0.0.1', port: 7003},
  {ip: '127.0.0.1', port: 7004}
];

require('../../servers/web').listen(config.port);
