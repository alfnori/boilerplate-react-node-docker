#!/bin/bash
: '
EMPTY=$(npm list -g @vue/cli | grep "(empty)" -c)

if [ "$EMPTY" -eq "1" ]; then
  echo "Install vue-cli globally"
  npm install -g @vue/cli
else
  echo "Vue CLI already installed"
fi
'

if [ "$DEPLOY" -eq "DEV" ]; then
  chown node:node -R .
  else
    echo "Production mode"
fi

if [ -d "./node_modules" ]; then
  # Control will enter here if $DIRECTORY exists.
  echo "Skipping 'npm install'..."
  else
    echo "Installing dependencies..."
    npm install
fi

echo "Ensure permission on file dev deploy"
chmod +x docker/dev.sh
echo "Ensure permission on file prod deploy"
chmod +x docker/build.sh

exec "$@";