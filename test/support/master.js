/*!
 * sfs - test/support/master.js
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
var childProcess = require('child_process');

var w1 = childProcess.fork(path.join(__dirname, 'server1.js'));
var w2 = childProcess.fork(path.join(__dirname, 'server2.js'));
var w3 = childProcess.fork(path.join(__dirname, 'server3.js'));

process.on('exit', function () {
  w1.kill();
  w2.kill();
  w3.kill();
});
