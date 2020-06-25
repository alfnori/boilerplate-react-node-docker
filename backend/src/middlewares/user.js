const { body } = require('express-validator');
const { validateRequest } = require('../helpers/request');
const { strongPassword } = require('../helpers/models/user');
const { logRequest } = require('../utils/logger');

const signInIsValid = (req, res, next) => {
  logRequest('EXECUTING LOGIN');
  logRequest(`FOR: ${req.body.email}`);
  return validateRequest(req, res, next);
};

const signUpIsValid = (req, res, next) => {
  logRequest('EXECUTING REGISTRATION');
  logRequest(`FOR: ${req.body.email}`);
  return validateRequest(req, res, next);
};

const signIN = () => [
  body('email').trim().normalizeEmail().isEmail(),
  body('password').trim().isLength({ min: 8 }),
];

const signUP = () => [
  body('name').trim().escape().isLength({ min: 3 }),
  body('email').trim().normalizeEmail().isEmail(),
  body('password').trim().isLength({ min: 8 }).custom((value, { req }) => {
    if (!strongPassword(req.body.password)) {
      throw new Error('Weak password! Must contain at least: 1 uppcase, 1 lowercase, 1 number and 1 special character.');
    }
    return true;
  }),
  body('passwordConfirm').trim().custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
];

module.exports = {
  signIN,
  signInIsValid,
  signUP,
  signUpIsValid,
};
