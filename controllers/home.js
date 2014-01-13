/*!
 * sfs - controllers/home.js
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

var HOME_PAGE = '<form action="/store" enctype="multipart/form-data" method="post">\
  filename: <input type="text" name="filename" value="foo.tgz" />\
  shasum: <input type="text" name="shasum" value="" />\
  file: <input type="file" name="file" /> <input type="submit" />\
</form>';

module.exports = function (req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.end(HOME_PAGE);
};
