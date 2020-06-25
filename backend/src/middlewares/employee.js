const {
  query, param, body,
  sanitizeQuery, sanitizeBody,
} = require('express-validator');

const { validateRequest } = require('../helpers/request');

const { isEmptyObject } = require('../utils/checker');
const { parseJSON, sanitize } = require('../utils/transformer');
const { logRequest } = require('../utils/logger');

const defaultLimit = 100;
const defaultSkip = 0;
const defaultPage = 1;
const minSearchLength = 3;

const getAllIsValid = (req, res, next) => {
  logRequest('GET ALL EMPLOYEE');
  logRequest(`FILTER: ${req.query.filter || '{}'}`);
  logRequest(`SEARCH: ${req.query.search || '""'}`);
  logRequest(`SORT: ${req.query.sort || '{}'}`);
  logRequest(`PAGE: ${req.query.page}`);
  logRequest(`LIMIT: ${req.query.limit}`);
  logRequest(`SKIP: ${req.query.skip}`);
  return validateRequest(req, res, next);
};

const getAllValidator = () => [
  query('filter').optional().isJSON(),
  query('search').optional().trim().isLength({ min: minSearchLength }),
  sanitizeQuery('sort').customSanitizer((value) => {
    let sort = parseJSON(value);
    if (isEmptyObject(sort) && value) {
      sort = { [sanitize(value, new RegExp(/\W/, 'g'))]: 'asc' };
    }
    return JSON.stringify(sort || {});
  }),
  query('sort').optional().isJSON(),
  sanitizeQuery('page').customSanitizer((value) => {
    let page = parseInt(value || defaultPage, 10);
    if (Number.isNaN(page) || page <= 0) page = defaultPage;
    return page;
  }),
  sanitizeQuery('limit').customSanitizer((value) => {
    let limit = parseInt(value || defaultLimit, 10);
    if (Number.isNaN(limit) || limit <= 0) limit = defaultLimit;
    return limit;
  }),
  sanitizeQuery('skip').customSanitizer((value) => {
    let skip = parseInt(value || defaultSkip, 10);
    if (Number.isNaN(skip) || skip < 0) skip = defaultSkip;
    return skip;
  }),
  query('page').optional().isInt(),
  query('limit').optional().isInt(),
  query('skip').optional().isInt(),
];

const idIsValid = (req, res, next) => {
  logRequest(`ID: ${req.params.id}`);
  return validateRequest(req, res, next);
};

const idValidator = () => [
  param('id').trim().isMongoId(),
];

const oneIsValid = (req, res, next) => {
  logRequest('EMPLOYEE');
  if (req.params.id) {
    logRequest(`ID: ${req.params.id}`);
  }
  logRequest(`DATA: ${JSON.stringify(req.body)}`);
  return validateRequest(req, res, next);
};

const oneValidator = () => [
  body('name').trim().escape().isLength({ min: 3 }),
  body('birthDate').trim().escape().isISO8601(),
  sanitizeBody('document').customSanitizer((value) => {
    let document = String(value || '').trim();
    if (document) {
      document = sanitize(document, new RegExp(/\W/, 'g'));
    }
    return document;
  }),
  body('document').trim().escape().isLength({ min: 3 }),
  sanitizeBody('phoneNumber').customSanitizer((value) => {
    let phone = String(value || '').trim();
    if (phone) {
      phone = sanitize(phone, new RegExp(/\D/, 'g'));
      if (phone.charAt(0) === '0') phone = phone.slice(1);
    }
    return phone;
  }),
  body('phoneNumber').isLength({ min: 10, max: 12 }).isMobilePhone(),
  body('email.work').trim().normalizeEmail().isEmail(),
  body('email.personal').trim().optional({ nullable: true }).normalizeEmail()
    .isEmail(),
  body('employmentStatus').optional({ nullable: true }).isMongoId(),
  body('employmentStatusObservation').optional({ nullable: true }),
  body('admissionDate').trim().escape().optional({ nullable: true })
    .isISO8601(),
  body('resignationDate').trim().escape().optional({ nullable: true })
    .isISO8601(),
  body('designation').trim().escape().optional({ nullable: true })
    .isLength({ min: 3 }),
  body('department').optional({ nullable: true }).isMongoId(),
  body('salary').trim().escape().optional({ nullable: true })
    .isFloat(),
];

module.exports = {
  getAllValidator,
  getAllIsValid,
  idValidator,
  idIsValid,
  oneValidator,
  oneIsValid,
};
