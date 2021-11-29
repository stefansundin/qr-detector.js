#!/bin/bash -e

# When testing the web worker you can't run the script from file://
# Python provides a very convenient webserver to serve files easily

echo "http://localhost:8000/"
python3 -m http.server
