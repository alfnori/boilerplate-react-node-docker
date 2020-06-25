
const controller = {};

const { jsonResponse } = require('../helpers/request');
const { isEmptyObject } = require('../utils/checker');

const Employee = require('../models/employee');

controller.getAllEmployee = (req, res) => {
  Employee.getAllEmployee(req.query,
    (error, employees) => jsonResponse(error, { employees }, res));
};

controller.getOneEmployee = (req, res) => {
  Employee.getOneEmployee(req.params.id,
    (error, employee) => jsonResponse(error, { employee }, res));
};

controller.createEmployee = (req, res) => {
  Employee.createEmployee(req.body,
    (error, employee) => jsonResponse(error, { employee }, res));
};

controller.updateEmployee = (req, res) => {
  Employee.updateEmployee(req.params.id, req.body,
    (error, employee) => jsonResponse(error, { employee }, res));
};

controller.deleteEmployee = (req, res) => {
  Employee.deleteEmployee(req.params.id,
    (error, deleted) => {
      const isDeleted = (deleted && !isEmptyObject(deleted));
      jsonResponse(error, { deleted: isDeleted || false }, res);
    });
};

module.exports = controller;
