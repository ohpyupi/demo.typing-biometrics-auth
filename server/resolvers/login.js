const { ApolloError } = require('apollo-server-express');
const {
  getKsdnaApiAccessToken,
  getKsdnaScore,
} = require('../services/keystroke-dna');
const { getIpAddress } = require('../lib/utils');
const { createIdToken } = require('../lib/auth');
const {
  sendEmailChallengeCode,
  sendEmailConfirmDeviceLink,
} = require('../services/email');
const { IS_CHALLENGE_REQUIRED } = require('../../config/variables');
const { User } = require('../models/user');
const { Device } = require('../models/device');
const { AUTH_STATUS } = require('../lib/constants');
const {
  isNewDeviceLogin,
  isDangerousLogin,
} = require('../lib/keystroke-dna');

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

  if (isNewDeviceLogin(ksdna)) {
    const device = new Device({
      /* eslint-disable-next-line no-underscore-dangle  */
      _userId: user._id,
      deviceHash: ksdna.deviceHash,
    });
    await device.save();
    await sendEmailChallengeCode(user);
    await sendEmailConfirmDeviceLink(user, device);
    return {
      idToken: createIdToken({ email: publicCredential }),
      isChallengeRequired: true,
      isAuthenticated: false,
      message: 'New device is detected. Please solve the challenge to login!',
    };
  }

  if (IS_CHALLENGE_REQUIRED || isDangerousLogin(ksdna)) {
    await sendEmailChallengeCode(user);
    return {
      idToken: createIdToken({ email: publicCredential }),
      isChallengeRequired: true,
      isAuthenticated: false,
      message: 'Suspcious attempt is detected. Please solve the challenge to login!',
    };
  }

  return {
    idToken: createIdToken({ email: publicCredential, status: AUTH_STATUS.LOGGED_IN }),
    isChallengeRequired: false,
    isAuthenticated: true,
    message: 'Successfully logged in!',
  };
};

module.exports = { login };
