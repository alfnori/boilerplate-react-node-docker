const express = require('express');

const employeeRouter = express.Router();

const middleware = require('../middlewares/employee');
const { logRequest } = require('../utils/logger');

const controller = require('../controllers/employee');

employeeRouter.get('/',
  middleware.getAllValidator(),
  middleware.getAllIsValid,
  (req, res) => {
    logRequest('GET ALL EMPLOYEE');
    controller.getAllEmployee(req, res);
  });

employeeRouter.get('/:id',
  middleware.idValidator(),
  middleware.idIsValid,
  (req, res) => {
    logRequest('GET ONE EMPLOYEE');
    controller.getOneEmployee(req, res);
  });

employeeRouter.post('/create',
  middleware.oneValidator(),
  middleware.oneIsValid,
  (req, res) => {
    logRequest('CREATE ONE EMPLOYEE');
    controller.createEmployee(req, res);
  });

employeeRouter.put('/update/:id',
  middleware.idValidator(),
  middleware.idIsValid,
  middleware.oneValidator(),
  middleware.oneIsValid,
  (req, res) => {
    logRequest('UPDATE ONE EMPLOYEE');
    controller.updateEmployee(req, res);
  });

employeeRouter.delete('/delete/:id',
  middleware.idValidator(),
  middleware.idIsValid,
  (req, res) => {
    logRequest('DELETE AN EMPLOYEE');
    controller.deleteEmployee(req, res);
  });

module.exports = employeeRouter;
