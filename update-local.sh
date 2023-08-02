#!/bin/bash -ex

# The local script files are only used for the worker option, because all of that have to be served from the same origin.
# It may take a while before jsdelivr realizes that there's a new version when "latest" is requested.

version=v0.0.6
# version=latest

curl -fsS -o QrDetector.min.js "https://cdn.jsdelivr.net/gh/stefansundin/qr-detector.js@$version/dist/QrDetector.min.js"
curl -fsS -o QrDetector.min.js.map "https://cdn.jsdelivr.net/gh/stefansundin/qr-detector.js@$version/dist/QrDetector.min.js.map"
