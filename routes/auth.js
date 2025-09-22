const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");


const {registerUserSchema, loginUserSchema, verifyUserRegisterSchema, forgotPasswordSchema, resetPasswordSchema} = require("../validationSchema/auth");
const validate = require("../middleware/validate");
const {registerLimiter, forgotPasswordLimiter} = require("../middleware/rateLimit");

const auth = require("../middleware/auth");

const {registerUser, loginUser, verifyUser, forgotPassword, verifyForgotPasswordOTP, resetPassword} = require ("../controllers/auth.controller");

router.post("/register", registerLimiter, validate(registerUserSchema), asyncHandler(registerUser));

router.post("/register/verify", validate(verifyUserRegisterSchema), asyncHandler(verifyUser));

router.post("/login", validate(loginUserSchema), asyncHandler(loginUser));

router.post("/forgot-password", validate(forgotPasswordSchema), asyncHandler(forgotPassword));

router.post("/forgot-password/verify", asyncHandler(verifyForgotPasswordOTP));

router.patch("/reset-password", auth, validate(resetPasswordSchema), asyncHandler(resetPassword));

module.exports = router;