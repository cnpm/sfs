/*!
 * sfs - middlewares/baseauth.js
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

var config = require('../config');

module.exports = function basicAuth(realm) {
  realm = realm || "Authorization Required";

  function unauthorized(res) {
    res.writeHead(401, {"WWW-Authenticate": 'Basic realm="' + realm + '"'});
    res.end();
  }

  return function(req, res, next) {
    var authorization = req.headers.authorization;

    if (!authorization) {
      return unauthorized(res);
    }

    var parts = authorization.split(' ');
    var scheme      = parts[0];
    var credentials;
    try {
      credentials = new Buffer(parts[1], 'base64').toString().split(':');
    } catch (e) {
      return unauthorized(res);
    }

    if (scheme !== "Basic") {
      res.writeHead(400);
      return res.end();
    }

    if (credentials[0] === config.credentials[0] && credentials[1] === config.credentials[1]) {
      return next();
    }

    unauthorized(res);
  };
};
