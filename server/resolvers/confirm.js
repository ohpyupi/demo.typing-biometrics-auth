const { ApolloError } = require('apollo-server-express');
const { Token } = require('../models/token');
const { User } = require('../models/user');

const confirm = async (parent, { token }) => {
  if (!token) {
    throw new ApolloError('invalid_token', 400);
  }
  const { _userId } = await Token.findOne({ token }) || {};
  if (!_userId) {
    throw new ApolloError('invalid_token', 400);
  }
  const user = await User.findOne({ _id: _userId });
  if (!user) {
    throw new ApolloError('invalid_token', 400);
  }
  user.isConfirmed = true;
  await user.save();
  return {
    message: 'success',
  };
};

module.exports = {
  confirm,
};
