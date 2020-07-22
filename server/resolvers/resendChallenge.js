const _ = require('lodash');
const { ApolloError } = require('apollo-server-express');
const { User } = require('../models/user');
const { AUTH_STATUS } = require('../lib/constants');
const { sendEmailChallengeCode } = require('../services/email');

const resendChallenge = async (parent, variables, { idTokenPayload }) => {
  const email = _.get(idTokenPayload, 'email');
  const authStatus = _.get(idTokenPayload, 'status');
  if (authStatus !== AUTH_STATUS.LOGGED_IN && authStatus !== AUTH_STATUS.PARTIALLY_AUTHENTICATED) {
    throw new ApolloError('unauthorized', 401);
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApolloError('unauthorized', 401);
  }
  await sendEmailChallengeCode(user);
  return {
    message: 'Successfully sent a new challenge code!',
  };
};

module.exports = {
  resendChallenge,
};