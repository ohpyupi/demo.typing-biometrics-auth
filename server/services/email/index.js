const nodemailer = require('nodemailer');
const {
  BASE_URL,
  GMAIL_EMAIL,
  GMAIL_PASSWORD,
  EMAIL_SENDER,
} = require('../../../config/variables');
const { Challenge } = require('../../models/challenge');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_EMAIL,
      pass: GMAIL_PASSWORD,
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
    from: EMAIL_SENDER,
    to: email,
    subject: 'Please enter the challenge code to log in.',
    text: `Please enter the challenge code: ${challenge.code}`,
  });
};

const sendEmailVerificationLink = async ({ _id: userId, email }) => {
  const challenge = new Challenge({
    _userId: userId,
  });
  await challenge.save();
  await sendEmail({
    from: EMAIL_SENDER,
    to: email,
    subject: 'Please verify your email',
    text: `Please verify your email by clicking ${BASE_URL}/confirm/${challenge.code}`,
  });
};

module.exports = {
  sendEmail,
  sendEmailChallengeCode,
  sendEmailVerificationLink,
};
