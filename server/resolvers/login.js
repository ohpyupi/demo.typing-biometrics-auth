const {
  getKsdnaApiAccessToken,
  getKsdnaScore,
} = require('../services/keystroke-dna');

const getIpAddress = (req) => {
  let ipAddr = req.headers['x-forwarded-for'];
  if (ipAddr) {
    const list = ipAddr.split(',');
    ipAddr = list[list.length - 1];
  } else {
    ipAddr = req.connection.remoteAddress;
  }
  return ipAddr;
};

const login = async (parent, {
  publicCredential, privateCredential, typingBiometricSignature,
}, { req }) => {
  if (publicCredential !== 'typing@biometric.com' || privateCredential !== '1234qwer') {
    return {
      authenticated: false,
      message: 'Invalid credentials',
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
  return {
    token: !ksdna.failed ? Date.now : null,
    authenticated: !ksdna.failed,
    message: !ksdna.failed ? 'Successfully logged in!' : 'Fraud attempt detected',
    ksdna,
  };
};

module.exports = { login };