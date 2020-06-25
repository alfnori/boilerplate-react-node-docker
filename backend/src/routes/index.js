const departmentsRoutes = require('./department');
const statusRoutes = require('./status');
const employeeRoutes = require('./employee');
const userRoutes = require('./user');

const {
  notFoundResponse,
  httpResponse,
  jsonResponse,
} = require('../helpers/request');
const controller = require('../controllers/user');
const { logRequest } = require('../utils/logger');

let rootReached = 0;

const welcomeRoute = (req, res) => {
  rootReached += 1;
  logRequest(`/ reached ${rootReached} times!`);
  const data = `<!doctype HTML><html><head><title>Hello There (${rootReached})</title><meta charset="utf-8"></head><body><img src="https://i.imgflip.com/2084ea.jpg"/></body></html>`;
  httpResponse(data, res);
};

const counterRoute = (req, res) => {
  const rand = Math.floor(Math.random() * 100);
  jsonResponse(null, { counter: rand }, res);
};

const init = (app) => {
  app.get('/', welcomeRoute);
  app.get('/public/counter', counterRoute);
  app.use('/api/departments', departmentsRoutes);
  app.use('/api/status', statusRoutes);
  app.use('/api/employee', employeeRoutes);
  app.use('/api/auth', userRoutes);
  app.get('/api/user/current', controller.currentUser);
  app.get('*', notFoundResponse);
};

module.exports = init;
