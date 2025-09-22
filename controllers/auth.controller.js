const {pool} = require("../database/db");
const bcrypt = require("bcryptjs");

const config = require("config");
const jwt = require("jsonwebtoken");

const jwtSecret = config.get("jwt.secret");
const jwtExpiresIn = config.get("jwt.expiresIn");

const sendEmail = require("../services/email");
const {registrationOTPTemplate, forgotPasswordOTPTemplate} = require("../services/emailTemplate");


function generateOTP(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

function generateOTPWithExpiry(minutes = 10) {
  const otp_code = generateOTP(6);
  const otp_expiry = new Date(Date.now() + minutes * 60 * 1000); // 2 min in ms
  return { otp_code, otp_expiry };
}

exports.registerUser = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error("Email and Password are required");
      err.status = 400;
      throw err;
    }

    const [existing] = await pool.query(
      `SELECT user_id, is_verified FROM users WHERE email = ?`,
      [email]
    );

    if (existing.length > 0 && existing[0].is_verified) {
      const err = new Error("Email already exists and is verified");
      err.status = 400;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { otp_code , otp_expiry } = generateOTPWithExpiry(10); // 10 min expiry



    if (existing.length > 0 && !existing[0].is_verified) {
      const [result] = await pool.query(
        `UPDATE users 
         SET password = ?, otp_code = ?, otp_expiry = ?
         WHERE email = ?`,
        [hashedPassword, otp_code, otp_expiry, email]
      );

      if (result.affectedRows === 0) {
        const err = new Error("Failed to update existing unverified user");
        err.status = 500;
        throw err;
      }
    } else {
      const [result] = await pool.query(
        `INSERT INTO users (email, password, otp_code, otp_expiry)
         VALUES (?, ?, ?, ?)`,
        [email, hashedPassword, otp_code, otp_expiry]
      );

      if (result.insertId === 0) {
        const err = new Error("Registration failed: could not insert user");
        err.status = 500;
        throw err;
      }
    }

    const { text, html } = registrationOTPTemplate(otp_code, 10);

    const success = await sendEmail(
      email,
      "[HarborPulse] Verify your email",
      text,
      html
  );

    if (!success) {
      const err = new Error("Failed to send verification email");
      err.status = 500;
      throw err;
    }

    res.status(201).json({
      success: true,
      message: "Registration OTP sent successfully",
    });
}

exports.verifyUser = async (req, res) => {
    const {email, otp} = req.body;

    const [rows] = await pool.query(`
      SELECT otp_code, otp_expiry
      FROM users
      WHERE email = ?
      `, [email]);

      if(!rows.length){
        const err = new Error("User Not Found");
        err.status = 404;
        throw err;
      }

      const user = rows[0];

      if(user.otp_code !== otp || new Date(user.otp_expiry) < new Date()){
        const err = new Error("Invalid or Expired OTP");
        err.status = 400;
        throw err;
      }

      const [result] = await pool.query(`
          UPDATE users
          SET is_verified = 1,
              otp_code = NULL,
              otp_expiry = NULL
          WHERE email = ?
      `, [email]);

      if (result.affectedRows === 0) {
        const err = new Error("Failed to verify user");
        err.status = 500;
        throw err;
      }

      res.json({
        success: true,
        message: "Email verified successfully"
      });

}

exports.loginUser = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        const err = new Error ("Invalid Credentials");
        err.status = 400;
        throw err;
    }

    const [rows] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
    if (!rows.length) {
        const err = new Error("Invalid credentials");
        err.status = 401;
        throw err;
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        const err = new Error("Invalid credentials");
        err.status = 401;
        throw err;
    }

    const token = jwt.sign(
        {userId: user.userId, role: user.role },
        jwtSecret,
        {expiresIn: jwtExpiresIn}
    );

    res.json({
        success: true,
        token,
        user: {
            user_id: user.user_id,
            email: user.email,
            role: user.role
        }
    });
}

exports.forgotPassword = async (req, res) => {
  const {email} = req.body;

  const [rows] = await pool.query(`
    SELECT user_id, is_verified
    FROM users
    WHERE email = ?
    `, [email]);

    if(!rows.length){
      const err = new Error("User Not Found");
      err.status = 404;
      throw err;
    }

    const user = rows[0];
    
    if(!user.is_verified){
      const err = new Error("User Not Verified");
      err.status = 400;
      throw err;
    }

    const { otp_code , otp_expiry } = generateOTPWithExpiry(10); // 10 min expiry

    const [result] = await pool.query(`
        UPDATE users 
        SET otp_code = ?, otp_expiry = ?
        WHERE email = ?`,
        [otp_code, otp_expiry, email]
    );
    
    if (result.affectedRows === 0) {
      const err = new Error("Failed to set OTP for password reset");
      err.status = 500;
      throw err;
    }

    const {text, html} = forgotPasswordOTPTemplate(otp_code, 10);

    const success = await sendEmail(
      email,
      "[HarborPulse] Password Reset Request",
      text,
      html
  );

    if (!success) {
      const err = new Error("Failed to send password reset email");
      err.status = 500;
      throw err;
    }

    res.json({
      success: true,
      message: "Password reset OTP sent successfully",
    });
}

exports.verifyForgotPasswordOTP = async (req, res) => {
  const {email, otp} = req.body;

  if(!email || !otp){
    const err = new Error("Email and OTP are required");
    err.status = 400;
    throw err;
  }

  const [rows] = await pool.query(`
    SELECT user_id, otp_code, otp_expiry 
    FROM users
    WHERE email = ?
    `, [email]);

    if(!rows.length){
      const err = new Error("User Not Found");
      err.status = 404;
      throw err;
    }

    const user = rows[0];

    if(user.otp_code !== otp || new Date(user.otp_expiry) < new Date()){
      const err = new Error("Invalid or Expired OTP");
      err.status = 400;
      throw err;
    }

    const [result] = await pool.query(`
      UPDATE users
      SET otp_code = NULL, otp_expiry = NULL
      WHERE email = ?
    `, [email]);

    if (result.affectedRows === 0) {
      const err = new Error("Failed to verify OTP");
      err.status = 500;
      throw err;
    }

    const token = jwt.sign(
        {email: email, 
          purpose: 'password_reset'
        },
        jwtSecret,
        {expiresIn: "10m"} //epxpires in 10 minutes
    );

    res.json({
      success: true,
      token,
      message: "OTP verified successfully"
    });
  }

  exports.resetPassword = async (req, res) => {
    const {newPassword} = req.body;

    const email = req.user.email;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await pool.query(`
      UPDATE users
      SET password = ?
      WHERE email = ?
    `, [hashedPassword, email]);

    if (result.affectedRows === 0) {
      const err = new Error("Failed to reset password");
      err.status = 500;
      throw err;
    }
    res.json({
      success: true,
      message: "Password reset successfully"
    });

  }