const express = require('express');

const userRouter = express.Router();

const middleware = require('../middlewares/user');
const { logRequest } = require('../utils/logger');

const controller = require('../controllers/user');

userRouter.post('/sign/in',
  middleware.signIN(),
  middleware.signInIsValid,
  (req, res) => {
    logRequest('AUTHENTICATE USER');
    controller.authenticate(req, res);
  });

userRouter.post('/sign/up',
  middleware.signUP(),
  middleware.signUpIsValid,
  (req, res) => {
    logRequest('REGISTER USER');
    controller.register(req, res);
  });

module.exports = userRouter;
