/*!
 * sfs - common/utils.js
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

var formstream = require('formstream');
var urllib = require('urllib');
var config = require('../config');

exports.sendfile = function (url, file, callback) {
  var form = formstream();
  form.file('file', file.path, file.name);
  form.field('filename', file.name)
    .field('shasum', file.shasum);
  var args = {
    type: 'POST',
    headers: form.headers(),
    stream: form,
    dataType: 'json',
    timeout: 600000, // 10 minutes
  };
  args.headers.Authorization = 'Basic ' +
    new Buffer(config.credentials.join(':')).toString('base64');
  urllib.request(url, args, callback);
};

exports.removefile = function (url, callback) {
  var args = {
    type: 'DELETE',
    headers: {},
    dataType: 'json',
    timeout: 20000,
  };
  args.headers.Authorization = 'Basic ' +
    new Buffer(config.credentials.join(':')).toString('base64');
  urllib.request(url, args, callback);
};
