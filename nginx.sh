#!/bin/bash -e

if grep -q 'root /path/to/' nginx.conf; then
  echo "Please update the \"root\" directive in nginx.conf to point to this directory ($PWD)."
  exit 1
fi

if [[ ! -f selfsigned.key ]]; then
  echo "Please generate a self-signed certificate."
  echo
  echo "Run: openssl req -x509 -nodes -days 36500 -newkey rsa:2048 -sha256 -keyout selfsigned.key -out selfsigned.crt -config openssl.cnf"
  echo
  echo "You may have to add the certificate to your system store (Chrome)."
  echo
  exit 1
fi

echo "https://localhost:4443/"
set -x
nginx -c $PWD/nginx.conf
