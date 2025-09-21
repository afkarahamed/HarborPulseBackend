function registrationOTPTemplate(otp, expiryMinutes) {
  const text = `
Hello,

Your HarborPulse verification code is: ${otp}
It will expire in ${expiryMinutes} minutes.

If you did not request this, please ignore this email.
Never share this code with anyone.

– The HarborPulse Team
  `;

  const html = `
  <h2>Welcome to HarborPulse</h2>
  <p>Your verification code is:</p>
  <h1>${otp}</h1>
  <p>This code will expire in <b>${expiryMinutes} minutes</b>.</p>
  <p style="color:red;">⚠️ Do not share this code with anyone. If you didn’t request it, ignore this email.</p>
  `;

  return { text, html };
}

module.exports = {
  registrationOTPTemplate
};