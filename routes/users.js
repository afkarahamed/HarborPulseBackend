const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");

const {getUsers, postUsersRole} = require("../controllers/users.controller");

const auth = require("../middleware/auth");
const requireAdmin = require("../middleware/requireAdmin");

router.get("/", auth, requireAdmin, asyncHandler(getUsers));

router.patch("/:id/role", auth, requireAdmin, asyncHandler(postUsersRole));


module.exports = router;