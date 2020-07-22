const { ApolloError } = require('apollo-server-express');
const { sendEmailVerificationLink } = require('../services/email');
const { User } = require('../models/user');
const { EMAIL_REGEX } = require('../lib/constants');

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
  await sendEmailVerificationLink(user);
  return {
    message: 'Verify your email to login.',
  };
};

module.exports = { signup };
