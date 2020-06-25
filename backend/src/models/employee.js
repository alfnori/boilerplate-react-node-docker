
const mongoose = require('mongoose');
const typeEmail = require('mongoose-type-email');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const timestamps = require('mongoose-timestamp');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const StatusSchema = require('./status');
const DepartmentSchema = require('./department');

const helper = require('../helpers/models/employee');
const { logDatabase } = require('../utils/logger');

const nonUniqueMessage = '{VALUE} already exists.';

// Schema

const EmployeeSchema = new Schema({
  name: { type: String, require: true },
  document: { type: String, require: true, unique: true },
  birthDate: Date,
  phoneNumber: { type: String, require: true },
  email: {
    work: {
      type: typeEmail, required: true, unique: true, lowercase: true,
    },
    personal: {
      type: typeEmail, allowBlank: true, unique: true, lowercase: true,
    },
  },
  employmentStatus: {
    type: ObjectId,
    ref: StatusSchema,
  },
  employmentStatusObservation: String,
  admissionDate: Date,
  resignationDate: Date,
  designation: String,
  department: {
    type: ObjectId,
    ref: DepartmentSchema,
  },
  salary: Number,
});

// Indexes

EmployeeSchema.index({
  name: 1, document: 1, 'email.work': 1, 'email.personal': 1,
});
EmployeeSchema.index({ document: 1 }, { unique: true });
EmployeeSchema.index({ 'email.work': 1 }, { unique: true });
EmployeeSchema.index({ 'email.personal': 1 }, { unique: true });

// Plugins

EmployeeSchema.plugin(beautifyUnique, {
  defaultMessage: nonUniqueMessage,
});

EmployeeSchema.plugin(timestamps);

const Employee = mongoose.model('Employee', EmployeeSchema);

// Methods

Employee.getAllEmployee = (config, callback) => {
  logDatabase('QUERY: Executing findAll');
  Employee.find(helper.assertFilter(config))
    .sort(helper.assertOrder(config))
    .limit(helper.assertLimit(config))
    .skip(helper.assertSkip(config))
    .populate('employmentStatus', ['name', 'tag'])
    .populate('department')
    .exec(callback);
};

Employee.getOneEmployee = (id, callback) => {
  logDatabase('QUERY: Executing findOne');
  Employee.findById(id)
    .populate('employmentStatus', ['name', 'tag'])
    .populate('department')
    .exec(callback);
};

Employee.createEmployee = (data, callback) => {
  logDatabase('MODEL: Executing create');
  Employee.create(data, callback);
};

Employee.updateEmployee = (id, data, callback) => {
  logDatabase('MODEL: Executing update');
  Employee.findByIdAndUpdate(id, data, { new: true })
    .exec(callback);
};

Employee.deleteEmployee = (id, callback) => {
  logDatabase('MODEL: Executing deleteOne');
  Employee.findByIdAndDelete(id)
    .exec(callback);
};

module.exports = Employee;
