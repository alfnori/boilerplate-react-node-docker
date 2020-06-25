const express = require('express');

const statusRouter = express.Router();

const { logDatabase } = require('../utils/logger');
const { jsonResponse } = require('../helpers/request/index');

const StatusDB = require('../models/status');

statusRouter.get('/', (req, res) => {
  logDatabase('STATUS: Executing findAll');
  StatusDB.find({}, 'name tag order',
    (error, status) => jsonResponse(error, { status }, res))
    .sort({ order: 'asc' });
});

module.exports = statusRouter;
