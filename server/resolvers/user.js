const _ = require('lodash');
const { ApolloError } = require('apollo-server-express');
const { User } = require('../models/user');
const { AUTH_STATUS } = require('../lib/constants');

const user = async (parent, variables, { idTokenPayload }) => {
  const email = _.get(idTokenPayload, 'email');
  const authStatus = _.get(idTokenPayload, 'status');
  if (authStatus !== AUTH_STATUS.LOGGED_IN) {
    throw new ApolloError('unauthorized', 401);
  }
  const userDoc = await User.findOne({ email });
  if (!userDoc) {
    throw new ApolloError('user_not_found', 404);
  }
  return userDoc.getPublicInformation();
};

module.exports = {
  user,
};