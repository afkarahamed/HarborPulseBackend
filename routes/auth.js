const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");

const {registerUser, loginUser} = require ("../controllers/auth.controller");

router.post("/register", asyncHandler(registerUser));

router.post("/login", asyncHandler(loginUser));

router.post("/logout", asyncHandler(async (req, res) =>{
    res.send(req.body);
}));


module.exports = router;