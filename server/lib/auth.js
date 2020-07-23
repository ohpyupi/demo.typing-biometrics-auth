const jwt = require('jsonwebtoken');
const {
  JWT_TOKEN_ALGORITHM,
  JWT_TOKEN_ISSUER,
  JWT_TOKEN_EXPIRES_IN,
  JWT_TOKEN_SECRET,
} = require('../../config/variables');
const { AUTH_STATUS } = require('./constants');

const createIdToken = ({
  email,
  status = AUTH_STATUS.PARTIALLY_AUTHENTICATED,
}) => jwt.sign({
  email,
  status,
}, JWT_TOKEN_SECRET, {
  algorithm: JWT_TOKEN_ALGORITHM,
  issuer: JWT_TOKEN_ISSUER,
  expiresIn: JWT_TOKEN_EXPIRES_IN,
});

const validateIdToken = (idToken) => {
  try {
    return jwt.verify(idToken, JWT_TOKEN_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = {
  createIdToken,
  validateIdToken,
};