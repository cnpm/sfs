/**!
 * sfs - test/controllers/file.test.js
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
var path = require('path');
var fs = require('fs');
var utils = require('../../common/utils')
var app = require('../../servers/web');
var config = require('../../config');

var fixtures = path.join(path.dirname(__dirname), 'support');

describe('controllers/file.test.js', function () {
  var auth = new Buffer(config.credentials.join(':')).toString('base64');

  before(function (done) {
    app = app.listen(0, function () {
      require('../support/master');
      setTimeout(done, 1000);
    });
  });

  describe('POST /store', function () {
    it('should 401 without no auth info', function (done) {
      request(app)
      .post('/store')
      .expect(401, done);
    });

    it('should 201 save file to /foo/foo-0.0.1.tgz', function (done) {
      var url = 'http://127.0.0.1:' + app.address().port + '/store';
      var filepath = path.join(fixtures, 'cov-0.0.2.tgz');
      var file = {
        path: filepath,
        name: '/cov/cov-0.0.1.tgz',
        shasum: '4e216f9041fea1af3aefc7a275883876efe5290c',
      };
      utils.sendfile(url, file, function (err, result, res) {
        should.not.exist(err);
        result.should.eql({ok: true});
        res.should.status(201);
        done();
      });
    });

    it('should 201 sync file to /foo/foo-0.0.2.tgz', function (done) {
      var url = 'http://127.0.0.1:' + app.address().port + '/sync';
      var filepath = path.join(fixtures, 'cov-0.0.2.tgz');
      var file = {
        path: filepath,
        name: '/cov/cov-0.0.2.tgz',
        shasum: '4e216f9041fea1af3aefc7a275883876efe5290c',
      };
      utils.sendfile(url, file, function (err, result, res) {
        should.not.exist(err);
        result.should.eql({ok: true});
        res.should.status(201);
        done();
      });
    });

    it('should 400 when shasum wrong', function (done) {
      var url = 'http://127.0.0.1:' + app.address().port + '/store';
      var filepath = path.join(fixtures, 'cov-0.0.2.tgz');
      var file = {
        path: filepath,
        name: '/cov/cov-0.0.1.tgz',
        shasum: '4e216f9041fea1af3aefc7a275883876efe529123',
      };
      utils.sendfile(url, file, function (err, result, res) {
        should.not.exist(err);
        result.should.eql({
          "message": "shasum 4e216f9041fea1af3aefc7a275883876efe529123 not match server's 4e216f9041fea1af3aefc7a275883876efe5290c"
        });
        res.should.status(400);
        done();
      });
    });

    it('should 201 and auto sync file to other nodes', function (done) {
      var url = 'http://127.0.0.1:7002/store';
      var filepath = path.join(fixtures, 'cov-0.0.2.tgz');
      var file = {
        path: filepath,
        name: '/cov/cov-0.0.1.tgz',
        shasum: '4e216f9041fea1af3aefc7a275883876efe5290c',
      };
      utils.sendfile(url, file, function (err, result, res) {
        should.not.exist(err);
        result.should.eql({
          ok: true
        });
        res.should.status(201);
        fs.statSync('/tmp/sfs_test3/cov/cov-0.0.1.tgz').size.should.equal(2864);
        fs.statSync('/tmp/sfs_test2/cov/cov-0.0.1.tgz').size.should.equal(2864);
        fs.statSync('/tmp/sfs_test4/cov/cov-0.0.1.tgz').size.should.equal(2864);
        done();
      });
    });
  });

  describe('GET /file/:filename', function () {
    it('should 200 get file content', function (done) {
      request(app)
      .get('/file/cov/cov-0.0.1.tgz')
      .set('Authorization', 'Basic ' + auth)
      .expect('Content-Length', '2864')
      .expect(200, done);
    });

    it('should 404 when file not exists', function (done) {
      request(app)
      .get('/file/cov/cov1-0.0.1.tgz')
      .set('Authorization', 'Basic ' + auth)
      .expect(404, done);
    });

    it('should 401 without no auth info', function (done) {
      request(app)
      .get('/file/foo/foo-0.0.1.tgz')
      .expect(401, done);
    });
  });

  describe('DELETE /file/:filename', function () {
    it('should 401 without no auth info', function (done) {
      request(app)
      .del('/file/cov/cov-0.0.1.tgz')
      .expect(401, done);
    });

    it('should remove file success', function (done) {
      request(app)
      .del('/file/cov/cov-0.0.2.tgz')
      .set('Authorization', 'Basic ' + auth)
      .expect(200, done);
    });

    it('should 200 and auto delete file to other nodes', function (done) {
      var url = 'http://127.0.0.1:7002/file/cov/cov-0.0.1.tgz';
      utils.removefile(url, function (err, result, res) {
        should.not.exist(err);
        result.should.eql({
          ok: true
        });
        res.should.status(200);
        setTimeout(function () {
          fs.existsSync('/tmp/sfs_test3/cov/cov-0.0.1.tgz').should.equal(false);
          fs.existsSync('/tmp/sfs_test2/cov/cov-0.0.1.tgz').should.equal(false);
          fs.existsSync('/tmp/sfs_test4/cov/cov-0.0.1.tgz').should.equal(false);
          done();
        }, 100);
      });
    });
  });
});
