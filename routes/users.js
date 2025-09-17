const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");

const {getUsers, postUsersRole} = require("../controllers/users.controller");

const auth = require("../middleware/auth");
const requireAdmin = require("../middleware/requireAdmin");

const {updateUserRoleSchema} = require("../validationSchema/users");
const validate = require("../middleware/validate");

router.get("/", auth, requireAdmin, asyncHandler(getUsers));

router.patch("/:id/role", auth, requireAdmin, validate(updateUserRoleSchema), asyncHandler(postUsersRole));


module.exports = router;