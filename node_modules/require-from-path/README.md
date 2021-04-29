[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url] [![devDependency Status][daviddm-dev-image]][daviddm-dev-url]

# require from path

Create `require` that's binded to a directory different from where your code is located.

For example:

```js
const requireFrom = require("require-from-path")("/some/other/dir");
const foo = requireFrom("./foo.js");
const bar = requireFrom("bar");
```

Above code will:

- `require` the file `/some/other/dir/foo.js`
- Search and `require` the module `bar` starting at `/some/other/dir`.

## Purpose

Given the directory structure below with two NodeJS apps:

    app1
    |-+ foo
    | +-- index.js
    | +--+ node_modules
    |    +--+ x
    |       + ...
    app2
    |-+ bar
    | +-- index.js
    | +--+ node_modules
    |    +--+ y
    |       + ...

When you call `require("x")` in `/app1/foo/index.js`, NodeJS will search and find module `x` there.

Now from the same file, if you want to resolve the module `y` under the directory `/app2/bar`, you have to use an absolute or relative path directly pointing to `y`, and you may have to do some searching, probably re-implementing Node's module searching algorithm if you don't know exactly where `y` could be.

However, in the file `/app2/bar/index.js`, it can just do `require("y")` and Node would automatically find the module for it, because that file is at the location where `y` is under.

What if from the file `/app1/foo/index.js`, you can call `require` as if you were at the directory `/app2/bar`, then you would be able to utilize Node's module searching automatically.

To achieve this, most other implementations choose to re-implement Node's module searching algorithm.

This module's approach is to tap into Node's `module` and let it do the work.

## Install

    $ npm install require-from-path --save

## Usage

A single function is exported.

##### `requireFromPath(dir, [request])`

- If you call it with just `dir`, then it returns a `require` function that's been binded to the directory `dir`. You can use it to load any module as if you are at `dir`.
  - You can also call `require.resolve` with the same effect.
- If you call it with `dir` and a `request`, then it will load and return the module `request` as if at `dir`.

##### Example

```js
const requireFromPath = require("require-from-path");

// get back a require binded to /another/dir

const requireFromPathAnother = requireFromPath("/another/dir/");
const modXPath = requireFromPathAnother.resolve("modX");
const modX = requireFromPathAnother("modX");

// load modY at /another/yet/dir directly

const modY = requireFromPath("/another/yet/dir", "modY");
```

## License

Apache-2.0 © [Joel Chen](https://github.com/jchip)

[travis-image]: https://travis-ci.org/jchip/require-from-path.svg?branch=master
[travis-url]: https://travis-ci.org/jchip/require-from-path
[npm-image]: https://badge.fury.io/js/require-from-path.svg
[npm-url]: https://npmjs.org/package/require-from-path
[daviddm-image]: https://david-dm.org/jchip/require-from-path/status.svg
[daviddm-url]: https://david-dm.org/jchip/require-from-path
[daviddm-dev-image]: https://david-dm.org/jchip/require-from-path/dev-status.svg
[daviddm-dev-url]: https://david-dm.org/jchip/require-from-path?type=dev
