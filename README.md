typescript-dependency-util
==========================

[![Build Status](https://travis-ci.org/cybrown/typescript-dependency-util.svg?branch=master)](https://travis-ci.org/cybrown/typescript-dependency-util)

Features
--------

 - Sort typescript files in order of dependency.
 - Find exported elements (classes, modules, variables) in typescript files.
 - Find usage of exported elements in files.
 - Create a dependency graph.

Installation
------------

npm install --save-dev typescript-dependency-util

Usage
-----

``` javascript
var tdu = require('typescript-dependency-util');
var glob = require('glob');

var sourceFiles = glob.sync('./src/**/*.ts');
var sortedArrayOfTypescriptFiles = tdu.createSortedFileList(sourceFiles);
```
