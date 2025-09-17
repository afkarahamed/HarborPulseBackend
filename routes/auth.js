const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");


const {registerUserSchema, loginUserSchema} = require("../validationSchema/auth");
const validate = require("../middleware/validate");

const {registerUser, loginUser} = require ("../controllers/auth.controller");

router.post("/register", validate(registerUserSchema), asyncHandler(registerUser));

router.post("/login", validate(loginUserSchema), asyncHandler(loginUser));


module.exports = router;