const { ApolloError } = require('apollo-server-express');
const {
  getKsdnaApiAccessToken,
  getKsdnaScore,
} = require('../services/keystroke-dna');
const { getIpAddress } = require('../lib/utils');
const { createIdToken } = require('../lib/auth');
const { sendEmailChallengeCode } = require('../services/email');
const {
  IS_TYPING_AUTH_REQUIRED,
  IS_CHALLENGE_REQUIRED,
} = require('../../config/variables');
const { User } = require('../models/user');
const { AUTH_STATUS } = require('../lib/constants');

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

  if (IS_CHALLENGE_REQUIRED) {
    await sendEmailChallengeCode(user);
    return {
      idToken: createIdToken({ email: publicCredential }),
      isChallengeRequired: true,
      isAuthenticated: false,
      message: 'Please solve the challenge to login!',
    };
  }

  if (!IS_TYPING_AUTH_REQUIRED) {
    return {
      idToken: createIdToken({ email: publicCredential, status: AUTH_STATUS.LOGGED_IN }),
      isChallengeRequired: false,
      isAuthenticated: true,
      message: 'Successfully logged in!',
    };
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
    idToken: !isSuspicious ? Date.now() : null,
    isAuthenticated: !isSuspicious,
    message: !isSuspicious ? 'Successfully logged in!' : 'Fraud attempt detected',
    ksdna,
  };
};

module.exports = { login };
