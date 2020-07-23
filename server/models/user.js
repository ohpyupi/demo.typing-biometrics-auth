const _ = require('lodash');
const crypto = require('crypto');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  firstName: { type: String },
  lastName: { type: String },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  createdAt: { type: Number, default: Date.now },
  isConfirmed: { type: Boolean, default: false },
});

UserSchema.methods.setPassword = function setPassword(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt,
    1000, 64, 'sha512').toString('hex');
};

UserSchema.methods.isValidPassword = function validPassword(password) {
  const hash = crypto.pbkdf2Sync(password,
    this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.getPublicInformation = function getPublicInformation() {
  return _.pick(this, [
    'email',
    'firstName',
    'lastName',
    'createdAt',
    'isConfirmed',
  ]);
};

const User = mongoose.model('User', UserSchema);

module.exports = {
  User,
};
