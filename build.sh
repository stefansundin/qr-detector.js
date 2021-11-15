#!/bin/bash -ex

# tsc compiles the files needed for other packages to import this library
tsc

# webpack builds dist/QrDetector.min.js which can be loaded directly by web browsers
webpack
