#!/bin/bash

if [ -d "./node_modules" ]; then
    # Control will enter here if $DIRECTORY exists.
    echo "Skipping 'npm install' because 'node_modules already exists'. Delete 'node_modules' and restart the container if you want to reinstall binaries."
  else
    echo "Installing dependencies (this will only run the first time your container is created. If 'node_modules' already exists, this will be skipped for subsequent containers)..."
    npm install
fi

# Execute script for debug or run default start
if [ $RUN_MODE == 'debug' ]; then 
  echo "Ensure permission on file for debug"
  chmod +x docker/debug.sh
  npm run debug
else
  echo "Ensure permission on file for start"
  chmod +x docker/start.sh
  npm start
fi

exec "$@";