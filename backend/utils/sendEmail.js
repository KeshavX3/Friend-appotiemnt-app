const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use 'smtp' and custom config
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

async function sendEmail(to, subject, text, html) {
  const mailOptions = {
    from: EMAIL_USER,
    to,
    subject,
    text,
    html,
  };
  return transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
