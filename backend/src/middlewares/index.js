
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const { logError } = require('../utils/logger');
const jwtMiddleware = require('../middlewares/jwt');

const criticalError = (err, req, res, next) => {
  // Log error message in our server's console
  // If err has no specified error code, set error code to 'Internal Server Error (500)'
  // All HTTP requests must have a response,
  // so let's send back an error with its status code and message
  const message = err.message || 'Something got terrible wrong!';
  const code = err.statusCode || 500;
  logError('CRITICAL FAILURE!');
  logError(message);
  res.status(code).send(message);
  next(err);
};

const invalidToken = (err, req, res, next) => {
  if (err && err.name === 'UnauthorizedError') {
    res.status(401).send({ statusCode: 401, message: 'Invalid Credentials!', error: 'UnauthorizedError' });
  } else {
    next(req);
  }
};

const init = (app) => {
  app.use(morgan('tiny', { skip(req, res) { return res.statusCode < 400; } }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
  });
  app.use(jwtMiddleware().unless({ path: [/\/auth\/\w*/i, /^\/$/i, /\/public\/\w*/i, /^\/$/i] }));
  app.use(invalidToken);
  app.use(criticalError);
};

module.exports = init;
