const DEBUG_TAG = (name) => `${(process.env.DEBUG || 'DEBUG').replace(':*', '')}:${name}`;

const debug = require('debug');

const logger = debug(DEBUG_TAG('APP'));
const logDatabase = debug(DEBUG_TAG('MONGO'));
const logRequest = debug(DEBUG_TAG('REQUEST'));
const logError = debug(DEBUG_TAG('ERROR'));

// eslint-disable-next-line no-console
debug.log = console.log.bind(console);

module.exports = {
  logger,
  logDatabase,
  logRequest,
  logError,
};
