// utils/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or "Outlook", "Yahoo", or SMTP settings
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    // user: "bhuvneshwari1801@gmail.com", // your email
    // pass: "uuec gloi roli vouk", // app password
  },
});

async function sendMail(to, subject, text, html) {
  return transporter.sendMail({
    from: `"HR Team" <bhuvneshwari1801@gmail.com>`,
    to,
    subject,
    text,
    html,
  });
}

module.exports = sendMail;
