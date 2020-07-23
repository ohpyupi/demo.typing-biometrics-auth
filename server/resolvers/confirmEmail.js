const { ApolloError } = require('apollo-server-express');
const { Challenge } = require('../models/challenge');
const { User } = require('../models/user');

const confirmEmail = async (parent, { code }) => {
  if (!code) {
    throw new ApolloError('invalid_code', 400);
  }
  const { _userId } = await Challenge.findOne({ code }) || {};
  if (!_userId) {
    throw new ApolloError('invalid_code', 400);
  }
  const user = await User.findOne({ _id: _userId });
  if (!user) {
    throw new ApolloError('invalid_code', 400);
  }
  user.isConfirmed = true;
  await user.save();
  return {
    message: 'Successfully verified your email, please login!',
  };
};

module.exports = {
  confirmEmail,
};
