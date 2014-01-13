/**!
 * sfs - test/sfs.test.js
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

var should = require('should');
var request = require('supertest');
var app = require('../servers/web');
var config = require('../config');

describe('sfs.test.js', function () {
  var auth = new Buffer(config.credentials.join(':')).toString('base64');

  before(function (done) {
    app.listen(0, done);
  });

  describe('GET /', function () {
    it('should 401 when not auth info', function (done) {
      request(app)
      .get('/')
      .expect(401, done);
    });

    it('should 200 show form', function (done) {
      request(app)
      .get('/')
      .set('Authorization', 'Basic ' + auth)
      .expect(200, done);
    });
  });
});
