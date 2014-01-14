/**!
 * sfs - controllers/upload.js
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

var debug = require('debug')('sfs:controllers:file');
var eventproxy = require('eventproxy');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var crypto = require('crypto');
var onSocketError = require('on-socket-error');
var utils = require('../common/utils');
var logger = require('../common/logger');
var config = require('../config');

function storepath(filename) {
  // remove unsafe chars, like '../../../../etc/password'
  filename = path.join('/', filename);
  return path.join(config.rootDir, filename);
}

exports.get = function (req, res, next) {
  var filename = req.params && req.params[0] || '';
  if (!filename) {
    return next();
  }
  filename = storepath(filename);
  fs.stat(filename, function (err, stat) {
    if (err) {
      if (err.code === 'ENOENT') {
        return next();
      }
      return next(err);
    }
    // TODO: http headers
    res.setHeader('Content-Length', stat.size);
    var stream = fs.createReadStream(filename);
    stream.pipe(res);
    onSocketError(res, function () {
      stream.destroy();
    });
  });
};

var removefile = function (filename) {
  config.nodes.forEach(function (node) {
    if ((node.ip === '127.0.0.1' || node.ip === config.ip) && node.port === config.port) {
      // current server
      return;
    }
    var url = 'http://' + node.ip + ':' + node.port + '/sync/' + filename;
    debug('remove file %s', url);
    utils.removefile(url, function (err) {
      if (err) {
        logger.error(err);
      }
    });
  });
};

exports.remove = function (req, res, next) {
  var filename = req.params && req.params[0] || '';
  if (!filename) {
    return res.json(400, {message: 'filename missing'});
  }
  var filepath = storepath(filename);
  debug('delete file %s', filepath);
  fs.stat(filepath, function (err, stat) {
    if (err) {
      if (err.code === 'ENOENT') {
        removefile(filename);
        return res.json(404, {message: 'file not exists'});
      }
      return next(err);
    }
    removefile(filename);
    fs.unlink(filepath, function () {});
    res.json(200, {ok: true});
  });
};

exports.removeOther = function (req, res, next) {
  var filename = req.params && req.params[0] || '';
  if (!filename) {
    return res.json(400, {message: 'filename missing'});
  }
  filename = storepath(filename);
  fs.stat(filename, function (err, stat) {
    if (err) {
      if (err.code === 'ENOENT') {
        return res.json(404, {message: 'file not exists'});
      }
      return next(err);
    }
    fs.unlink(filename, function () {});
    res.json(200, {ok: true});
  });
};

var syncfile = function (node, file, callback) {
  var url = 'http://' + node.ip + ':' + node.port + '/sync';
  debug('sync file %j to %s', file, url);
  utils.sendfile(url, file, callback);
};

var savefile = function (req, callback) {
  req.body = req.body || {};
  var filename = req.body.filename;
  var shasum = req.body.shasum;
  if (filename) {
    filename = filename.trim();
  }
  if (shasum) {
    shasum = shasum.trim();
  }
  var file = req.files && req.files.file;
  var err;
  if (!filename || !file || !shasum) {
    err = new Error('params missing');
    err.statusCode = 400;
    return callback(err);
  }

  var savepath = storepath(filename);
  debug('save file: %s to %s, shasum: %s size: %s, name: %s, type: %s, path: %s',
    filename, savepath, shasum, file.size, file.name, file.type, file.path);

  mkdirp(path.dirname(savepath), function (err) {
    if (err) {
      return callback(err);
    }

    fs.rename(file.path, savepath, function (err) {
      if (err) {
        return callback(err);
      }
      var sha1 = crypto.createHash('sha1');
      var rs = fs.createReadStream(savepath);
      rs.on('data', function (data) {
        sha1.update(data);
      }).on('end', function () {
        sha1 = sha1.digest('hex');
        if (sha1 !== shasum) {
          return callback({
            statusCode: 400,
            message: 'shasum ' + shasum + ' not match server\'s ' + sha1
          });
        }
        callback(null, {
          name: filename,
          path: savepath,
          shasum: shasum
        });
      });
    });

  });
};

exports.store = function (req, res, next) {
  var ep = eventproxy.create();
  ep.fail(next);

  savefile(req, ep.doneLater('savefile'));

  ep.on('savefile', function (file) {
    // save to other nodes
    if (config.nodes.length === 0) {
      return ep.emit('done');
    }

    ep.after('syncfile', config.nodes.length, function () {
      ep.emit('done');
    });

    config.nodes.forEach(function (node) {
      if ((node.ip === '127.0.0.1' || node.ip === config.ip) && node.port === config.port) {
        // current server
        return ep.emit('syncfile');
      }
      var f = {
        name: file.name,
        path: file.path,
        shasum: file.shasum,
      };
      syncfile(node, f, ep.done(function (result) {
        if (!result || !result.ok) {
          var err = new Error('Sync ' + f.path + ' to ' + node.ip + ':' + node.port + ' fail: ' + result.message);
          err.name = 'SyncFileError';
          return ep.emit('error', err);
        }
        ep.emit('syncfile');
      }));
    });
  });

  ep.on('done', function () {
    res.json(201, {ok: true});
  });
};

exports.sync = function (req, res, next) {
  savefile(req, function (err) {
    if (err) {
      return next(err);
    }
    res.json(201, {ok: true});
  });
};
