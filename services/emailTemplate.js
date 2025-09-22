function registrationOTPTemplate(otp, expiryMinutes) {
  const text = `
Hello,

Welcome to HarborPulse!  
Your verification code is: ${otp}  
This code will expire in ${expiryMinutes} minutes.  

⚠️ Do not share this code with anyone.  
If you did not request this, please ignore this email.  

– The HarborPulse Team
  `;

  const html = `
  <h2>Welcome to HarborPulse</h2>
  <p>Your verification code is:</p>
  <h1 style="color:#004080;">${otp}</h1>
  <p>This code will expire in <b>${expiryMinutes} minutes</b>.</p>
  <p style="color:#d9534f;">⚠️ Do not share this code with anyone.</p>
  <p>If you didn’t request this, please ignore this email.</p>
  <br>
  <p>– The HarborPulse Team</p>
  `;

  return { text, html };
}

function forgotPasswordOTPTemplate(otp, expiryMinutes) {
  const text = `
Hello,

We received a request to reset your HarborPulse password.  
Your password reset code is: ${otp}  
This code will expire in ${expiryMinutes} minutes.  

⚠️ Do not share this code with anyone.  
If you did not request a password reset, you can safely ignore this email.  

– The HarborPulse Team
  `;

  const html = `
  <h2>Password Reset Request</h2>
  <p>We received a request to reset your HarborPulse password.</p>
  <p>Your password reset code is:</p>
  <h1 style="color:#d9534f;">${otp}</h1>
  <p>This code will expire in <b>${expiryMinutes} minutes</b>.</p>
  <p style="color:#d9534f;">⚠️ Do not share this code with anyone.</p>
  <p>If you didn’t request a password reset, you can safely ignore this email.</p>
  <br>
  <p>– The HarborPulse Team</p>
  `;

  return { text, html };
}

module.exports = {
  registrationOTPTemplate,
  forgotPasswordOTPTemplate
};