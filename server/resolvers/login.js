const { ApolloError } = require('apollo-server-express');
const {
  getKsdnaApiAccessToken,
  getKsdnaScore,
} = require('../services/keystroke-dna');
const { getIpAddress } = require('../lib/utils');
const { User } = require('../models/user');

const login = async (parent, {
  publicCredential, privateCredential, typingBiometricSignature,
}, { req }) => {
  const user = await User.findOne({ email: publicCredential });
  if (!typingBiometricSignature || !user || !user.isValidPassword(privateCredential)) {
    throw new ApolloError('invalid_credentials', 400);
  }
  if (!user.isConfirmed) {
    throw new ApolloError('user_not_confirmed', 403);
  }
  const ksdnaToken = await getKsdnaApiAccessToken();
  const ksdna = await getKsdnaScore({
    accessToken: ksdnaToken.access_token,
    username: publicCredential,
    value: publicCredential,
    typingBiometricSignature,
    ipAddress: getIpAddress(req),
    userAgent: req.get('User-Agent'),
  });
  const isSuspicious = !ksdna.success && !ksdna.failed;
  return {
    token: !isSuspicious ? Date.now() : null,
    authenticated: !isSuspicious,
    message: !isSuspicious ? 'Successfully logged in!' : 'Fraud attempt detected',
    ksdna,
  };
};

module.exports = { login };
