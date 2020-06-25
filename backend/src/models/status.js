const mongoose = require('mongoose');

const { Schema } = mongoose;

const StatusSchema = new Schema({
  name: String,
  order: Number,
  tag: {
    type: String,
    required: true,
    unique: true,
  },
});

StatusSchema.index({ tag: 1 }, { unique: true });

const Status = mongoose.model('Status', StatusSchema);
module.exports = Status;
