const nodemailer = require('nodemailer');
const { GMAIL_EMAIL, GMAIL_PASSWORD } = require('../../../config/variables');

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

module.exports = {
  sendEmail,
};
