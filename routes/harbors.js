const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");

const {getHarborStatusSchema, postHarborStatusSchema } = require("../validationSchema/harbors");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const requireAdmin = require("../middleware/requireAdmin");
const requireLogin = require("../middleware/requireLogin");


const {getHarbors, getHarborById, getHarborStatus, postHarborStatus} = require("../controllers/harbors.controller");

router.get("/", asyncHandler(getHarbors));

router.get("/:id", asyncHandler(getHarborById));

router.get("/:id/status", auth, requireLogin, validate(getHarborStatusSchema), asyncHandler(getHarborStatus));

router.patch("/:id/status", auth, requireAdmin, validate(postHarborStatusSchema), asyncHandler(postHarborStatus));

module.exports = router;