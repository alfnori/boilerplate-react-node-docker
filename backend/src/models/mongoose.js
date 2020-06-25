// Connect to mongodb
const mongoose = require('mongoose');
const { logDatabase, logError } = require('../utils/logger');

// Enviroment variables
const DATABASE_URL = process.env.DATABASE_URL || '0.0.0.0:27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'nodecrud';

const init = () => {
  mongoose.set('useUnifiedTopology', true);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);
  mongoose.connect(`mongodb://${DATABASE_URL}/${DATABASE_NAME}`, { useNewUrlParser: true });

  // Got connection handler
  const db = mongoose.connection;

  // Retry on first error connect
  db.on('error', (error) => {
    // If first connect fails because server-database isn't up yet, try again.
    // This is only needed for first connect, not for runtime reconnects.
    // See: https://github.com/Automattic/mongoose/issues/5169
    if (error.message && error.message.match(/failed to connect to server .* on first connect/)) {
      setTimeout(() => {
        mongoose.connect(`mongodb://${DATABASE_URL}/${DATABASE_NAME}`, { useNewUrlParser: true }).catch(() => {
          // empty catch avoids unhandled rejections
        });
      }, 20 * 1000);
    } else {
      // Some other error occurred.  Log it.
      logError(String(error));
    }
  });

  // On open execute
  db.once('open', () => {
    logDatabase('Connection Succeeded!');
  });

  return db;
};

module.exports = init;
