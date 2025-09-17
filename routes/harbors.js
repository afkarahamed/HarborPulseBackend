const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");

const {getHarborStatusSchema, postHarborStatusSchema } = require("../validationSchema/harbors");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const requireAdmin = require("../middleware/requireAdmin");


const {getHarbors, getHarborStatus, postHarborStatus} = require("../controllers/harbors.controller");

router.get("/", asyncHandler(getHarbors));

router.get("/:id/status", validate(getHarborStatusSchema), asyncHandler(getHarborStatus));

router.post("/:id/status", auth, requireAdmin, validate(postHarborStatusSchema), asyncHandler(postHarborStatus));

module.exports = router;