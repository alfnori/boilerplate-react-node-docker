const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const appSecretJWT = process.env.APP_JWT_SECRET;

const strongPassword = (password) => {
  const strongRegex = new RegExp(/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/, 'g');
  return strongRegex.test(password || '');
};

const generateSecrets = (password, callback) => {
  if (!password || password.length < 8) throw new Error('Invalid password!');
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) callback(err);
    bcrypt.hash(password, salt, (error, encypted) => callback(error, { salt, password: encypted }));
  });
};

const compareSecrets = (password, encrypted, callback) => {
  bcrypt.compare(password, encrypted, callback);
};

const generateJWT = (user) => {
  const {
    _id, name, email, role,
  } = user;
  const signature = appSecretJWT;
  const expiresIn = '1y';// long expiration for testing puposes
  return jwt.sign({
    _id, name, email, role,
  }, signature, { expiresIn });
};

module.exports = {
  appSecretJWT,
  strongPassword,
  generateSecrets,
  compareSecrets,
  generateJWT,
};
