const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: `"HarborPulse" <${process.env.EMAIL_USER}>`, // sender name + email
      to,
      subject,
      text,
      html,
    });
    return true;
  } catch (err) {
    throw err; // let caller handle it
  }
}

module.exports = sendEmail;