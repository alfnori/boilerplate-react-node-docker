#!/bin/sh
export DEBUG=$DEBUG_TAG
export PORT=$SERVER_PORT
DEBUG=$DEBUG_TAG PORT=$PORT nodemon src/app.js