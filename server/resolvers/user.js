const { ApolloError } = require('apollo-server-express');
const { User } = require('../models/user');
const { validateIdToken } = require('../lib/auth');

const user = async (parent, { idToken }) => {
  const decoded = validateIdToken(idToken);
  if (!decoded) {
    throw new ApolloError('unauthorized', 401);
  }
  const userDoc = await User.findOne({ email: decoded.email });
  if (!userDoc) {
    throw new ApolloError('user_not_found', 404);
  }
  return userDoc.getPublicInformation();
};

module.exports = {
  user,
};