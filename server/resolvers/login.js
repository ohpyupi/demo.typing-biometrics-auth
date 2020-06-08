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
  const isSuspicious = !ksdna.success && !ksdna.failed;
  return {
    token: !isSuspicious ? Date.now() : null,
    authenticated: !isSuspicious,
    message: !isSuspicious ? 'Successfully logged in!' : 'Fraud attempt detected',
    ksdna,
  };
};

module.exports = { login };