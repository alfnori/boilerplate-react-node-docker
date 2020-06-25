const mongoose = require('mongoose');

const { Schema } = mongoose;

const DepartmentsSchema = new Schema({
  name: String,
  tag: {
    type: String,
    required: true,
    unique: true,
  },
});

DepartmentsSchema.index({ tag: 1 }, { unique: true });

const Department = mongoose.model('Department', DepartmentsSchema);
module.exports = Department;
