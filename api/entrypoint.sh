#!/bin/sh
echo "Starting server $NODE_ENV mode"

if [ "$NODE_ENV" = "development" ]; then
  ./node_modules/.bin/nodemon api/server.js
else
  node api/server.js
fi