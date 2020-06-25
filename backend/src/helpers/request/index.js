const { validationResult } = require('express-validator');
const { logRequest, logError } = require('../../utils/logger');
const { isEmptyObject } = require('../../utils/checker');
const { transformRequestErrors } = require('../../utils/transformer');

const assembleError = (data = {}) => transformRequestErrors({
  msg: data.message || data.msg || 'Invalid resource!',
  value: data.value || '',
  location: data.path || data.location || '',
  param: data.param || data.key || 'resource',
});

const httpResponse = (data, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(data);
  res.end();
};

const jsonResponse = (error, entity, res) => {
  if (error && !isEmptyObject(error)) {
    res.status(500).send({ error });
    logError(error);
  } else {
    res.send(entity);
  }
};

const validateRequest = (req, res, next) => {
  let error = validationResult(req);
  let nextRequest = next;
  if (error && error.isEmpty && !error.isEmpty()) {
    error = transformRequestErrors(error);
    res.status(422).send({ error });
    res.end();
    logRequest('Invalid Request!');
    nextRequest = null;
  }
  if (nextRequest) {
    nextRequest();
  }
};

const notFoundResponse = (req, res) => {
  logRequest(`Got 404 on ${req ? req.url : ''}`);
  res.status(404).send({ statusCode: 404, message: 'Invalid Resource!' });
};

module.exports = {
  assembleError,
  jsonResponse,
  validateRequest,
  notFoundResponse,
  httpResponse,
};
