const { ApolloError } = require('apollo-server-express');
const { User } = require('../models/user');

const signup = async (parent, {
  publicCredential, privateCredential,
}) => {
  const users = await User.find({ email: publicCredential });
  if (users.length > 0) {
    throw new ApolloError('existing_email', 403);
  }
  const user = new User({
    email: publicCredential,
  });
  user.setPassword(privateCredential);
  await user.save();
  return {
    message: 'success',
  };
};

module.exports = { signup };
