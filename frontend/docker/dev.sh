#!/bin/bash
export REACT_APP_API_URL="http://0.0.0.0:$SERVER_PORT"
export REACT_APP_PORT=$FRONTEND_PORT_DEV
export REACT_APP_NETWORK_GATEWAY=$NETWORK_GATEWAY
export PORT=$FRONTEND_PORT_DEV
echo "Executing npm start"
npm start