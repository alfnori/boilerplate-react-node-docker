const mongoose = require('mongoose');
const typeEmail = require('mongoose-type-email');

const { Schema } = mongoose;

const beautifyUnique = require('mongoose-beautiful-unique-validation');
const timestamps = require('mongoose-timestamp');

// const { isEmptyObject } = require('../utils/checker');
const { logDatabase } = require('../utils/logger');
const helpers = require('../helpers/models/user');

const nonUniqueMessage = '{VALUE} already exists.';

const UsersSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: typeEmail, lowercase: true, required: true, unique: true,
  },
  password: { type: String, required: true },
  salt: { type: String, required() { return this.password != null; } },
  role: { type: String, default: 'user' },
});

UsersSchema.index({ name: 1, email: 1 });
UsersSchema.index({ email: 1 }, { unique: true });

UsersSchema.plugin(beautifyUnique, {
  defaultMessage: nonUniqueMessage,
});

UsersSchema.plugin(timestamps);

const Users = mongoose.model('Users', UsersSchema);

// Methods

Users.generateSecrets = (password, callback) => helpers.generateSecrets(password, callback);
Users.compareSecrets = (pass, enc, callback) => helpers.compareSecrets(pass, enc, callback);
Users.generateJWT = (user) => helpers.generateJWT(user);

Users.getUserByEmail = (email, callback) => {
  logDatabase('QUERY: Executing findOne');
  Users.findOne({ email }, ['_id', 'name', 'email', 'role', 'password'])
    .exec(callback);
};

Users.createUser = (data, callback) => {
  logDatabase('MODEL: Executing create');
  Users.generateSecrets(data.password, (error, secrets) => {
    if (error) callback(error);
    else {
      const create = { ...data, ...secrets };
      Users.create(create, callback);
    }
  });
};

module.exports = Users;
