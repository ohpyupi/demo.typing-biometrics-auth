const _ = require('lodash');
const { ApolloError } = require('apollo-server-express');
const { Challenge } = require('../models/challenge');
const { User } = require('../models/user');
const { createIdToken } = require('../lib/auth');
const { AUTH_STATUS } = require('../lib/constants');

const solveChallenge = async (parent, { code }, { idTokenPayload }) => {
  const email = _.get(idTokenPayload, 'email');
  const authStatus = _.get(idTokenPayload, 'status');
  if (authStatus !== AUTH_STATUS.LOGGED_IN && authStatus !== AUTH_STATUS.PARTIALLY_AUTHENTICATED) {
    throw new ApolloError('unauthorized', 401);
  }
  const { _userId } = await Challenge.findOne({ code }) || {};
  if (!_userId) {
    throw new ApolloError('invalid_code', 400);
  }
  const user = await User.findOne({ _id: _userId });
  if (!user) {
    throw new ApolloError('invalid_code', 400);
  }
  if (user.email !== email) {
    throw new ApolloError('invalid_code', 400);
  }
  return {
    message: 'Successfully solved the challenge',
    idToken: createIdToken({ email, status: AUTH_STATUS.LOGGED_IN }),
  };
};

module.exports = {
  solveChallenge,
};