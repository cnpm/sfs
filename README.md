sfs
=======

[![Build Status](https://secure.travis-ci.org/cnpm/sfs.png)](http://travis-ci.org/cnpm/sfs) [![Coverage Status](https://coveralls.io/repos/cnpm/sfs/badge.png)](https://coveralls.io/r/cnpm/sfs) [![Dependency Status](https://gemnasium.com/cnpm/sfs.png)](https://gemnasium.com/cnpm/sfs)

[![NPM](https://nodei.co/npm/sfs.png?downloads=true&stars=true)](https://nodei.co/npm/sfs/)

![logo](https://raw.github.com/cnpm/sfs/master/logo.png)

Simple file store.

## Install

```bash
$ npm install sfs
```

## Usage

Start two nodes sfs.

### Node#1

```js
var sfs = require('sfs');

sfs.start({
  enableCluster: true,
  rootDir: '/home/admin/sfs/files',
  logdir: '/home/admin/sfs/logs',
  port: 8081,
  nodes: [
    {ip: '127.0.0.1', port: 8081},
    {ip: '127.0.0.1', port: 8082},
  ],
});
```

### Node#2

```js
var sfs = require('sfs');

sfs.start({
  enableCluster: true,
  rootDir: '/home/admin/sfs/files',
  logdir: '/home/admin/sfs/logs',
  port: 8082,
  nodes: [
    {ip: '127.0.0.1', port: 8081},
    {ip: '127.0.0.1', port: 8082},
  ],
});
```

## License

(The MIT License)

Copyright (c) 2014 cnpmjs.org and other contributors

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
