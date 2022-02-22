#!/bin/bash -e

# When testing the web worker you can't run the script from file://.
# Python provides a convenient webserver to serve files easily.

# To test the PWA app you have to serve the page from https://.
# Use nginx.sh to do that instead of this.

echo "http://localhost:8000/"
set -x
python3 -m http.server
