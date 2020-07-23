const _ = require('lodash');
const qs = require('querystring');
const axios = require('axios');
const {
  KEYSTROKE_DNA_HOST,
  KEYSTROKE_DNA_APP_ID,
  KEYSTROKE_DNA_APP_SECRET,
} = require('../../../config/variables');

const getKsdnaApiAccessToken = async () => {
  const result = await axios.post(`${KEYSTROKE_DNA_HOST}/oauth/token`, {}, {
    auth: {
      username: KEYSTROKE_DNA_APP_ID,
      password: KEYSTROKE_DNA_APP_SECRET,
    },
  });
  return _.get(result, 'data', {});
};

const getKsdnaScore = async ({
  accessToken, username, value, typingBiometricSignature, ipAddress, userAgent,
}) => {
  try {
    const result = await axios({
      method: 'post',
      url: `${KEYSTROKE_DNA_HOST}/trusted/identify`,
      data: qs.stringify({
        username,
        value,
        signature: typingBiometricSignature,
        user_agent: userAgent,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Forwarded-For': ipAddress,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return result.data;
  } catch (err) {
    return {};
  }
};

const approveKsdnaNewDevice = async (accessToken, { deviceHash }) => {
  try {
    await axios({
      method: 'put',
      url: `${KEYSTROKE_DNA_HOST}/api/devices/approve/hash/${deviceHash}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return {
      success: true,
    };
  } catch (err) {
    return {};
  }
};

module.exports = {
  getKsdnaApiAccessToken,
  getKsdnaScore,
  approveKsdnaNewDevice,
};