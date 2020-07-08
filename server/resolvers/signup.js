const { ApolloError } = require('apollo-server-express');
const { sendEmail } = require('../services/email');
const { User } = require('../models/user');
const { Token } = require('../models/token');
const { EMAIL_REGEX } = require('../lib/constants');
const { BASE_URL } = require('../../config/variables');

const signup = async (parent, {
  publicCredential, privateCredential,
}) => {
  if (!publicCredential.match(EMAIL_REGEX)) {
    throw new ApolloError('invalid_email_format', 403);
  }
  const users = await User.find({ email: publicCredential });
  if (users.length > 0) {
    throw new ApolloError('existing_email', 403);
  }
  const user = new User({
    email: publicCredential,
  });
  user.setPassword(privateCredential);
  await user.save();
  const token = new Token({
    /* eslint no-underscore-dangle: "off" */
    _userId: user._id,
  });
  await token.save();
  await sendEmail({
    from: 'no-reply@typing-biometrics.com',
    to: user.email,
    subject: 'Please verify your email',
    text: `Please verify your email by clicking ${BASE_URL}/confirm/${token.token}`,
  });
  return {
    message: 'Verify your email to login.',
  };
};

module.exports = { signup };
