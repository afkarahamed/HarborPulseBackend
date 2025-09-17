const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");

const {getUsers} = require("../controllers/users.controller");

const auth = require("../middleware/auth");
const requireAdmin = require("../middleware/requireAdmin");

router.get("/", auth, requireAdmin, asyncHandler(getUsers));