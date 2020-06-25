const express = require('express');

const departmentRouter = express.Router();

const { logDatabase } = require('../utils/logger');
const { jsonResponse } = require('../helpers/request/index');

const Department = require('../models/department');

departmentRouter.get('/', (req, res) => {
  logDatabase('DEPARTMENT: Executing findAll');
  Department.find({}, 'name tag',
    (error, departments) => jsonResponse(error, { departments }, res))
    .sort({ name: 'asc' });
});

module.exports = departmentRouter;
