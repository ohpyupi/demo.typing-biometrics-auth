const nodemailer = require('nodemailer');
const {
  google: {
    auth: {
      OAuth2,
    },
  },
} = require('googleapis');
const {
  BASE_URL,
  GMAIL_EMAIL,
  EMAIL_PROVIDER_HOST,
  EMAIL_PROVIDER_PORT,
  GOOGLE_OAUTH2_CLIENT_ID,
  GOOGLE_OAUTH2_SECRET,
  GOOGLE_OAUTH2_REDIRECT_URL,
  GOOGLE_OAUTH2_REFRESH_TOKEN,
} = require('../../../config/variables');
const { Challenge } = require('../../models/challenge');

const sendEmail = async (options) => {
  const oauth2Client = new OAuth2(
    GOOGLE_OAUTH2_CLIENT_ID,
    GOOGLE_OAUTH2_SECRET,
    GOOGLE_OAUTH2_REDIRECT_URL,
  );
  oauth2Client.setCredentials({
    refresh_token: GOOGLE_OAUTH2_REFRESH_TOKEN,
  });
  const accessToken = await oauth2Client.getAccessToken();
  const transporter = nodemailer.createTransport({
    host: EMAIL_PROVIDER_HOST,
    port: EMAIL_PROVIDER_PORT,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: GMAIL_EMAIL,
      clientId: GOOGLE_OAUTH2_CLIENT_ID,
      clientSecret: GOOGLE_OAUTH2_SECRET,
      refreshToken: GOOGLE_OAUTH2_REFRESH_TOKEN,
      accessToken,
    },
  });
  return transporter.sendMail(options);
};

const sendEmailChallengeCode = async ({ _id: userId, email }) => {
  const challenge = new Challenge({
    _userId: userId,
  });
  await challenge.save();
  await sendEmail({
    from: GMAIL_EMAIL,
    to: email,
    subject: 'Please enter the challenge code to log in.',
    text: `Please enter the challenge code: ${challenge.code}`,
  });
};

const sendEmailConfirmDeviceLink = async ({ email }, { _id: deviceId }) => {
  const challenge = new Challenge({
    _deviceId: deviceId,
  });
  await challenge.save();
  await sendEmail({
    from: GMAIL_EMAIL,
    to: email,
    subject: 'New device login is attempted!',
    text: `Please approve your device by clicking : ${BASE_URL}/confirm/device/${challenge.code}`,
  });
};

const sendEmailVerificationLink = async ({ _id: userId, email }) => {
  const challenge = new Challenge({
    _userId: userId,
  });
  await challenge.save();
  await sendEmail({
    from: GMAIL_EMAIL,
    to: email,
    subject: 'Please verify your email',
    text: `Please verify your email by clicking ${BASE_URL}/confirm/email/${challenge.code}`,
  });
};

module.exports = {
  sendEmail,
  sendEmailChallengeCode,
  sendEmailVerificationLink,
  sendEmailConfirmDeviceLink,
};
