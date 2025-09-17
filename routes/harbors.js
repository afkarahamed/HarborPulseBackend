const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");

const {getHarborStatusSchema, postHarborStatusSchema } = require("../validationSchema/harbors");
const validate = require("../middleware/harbors.validate");


const {getHarbors, getHarborStatus, postHarborStatus} = require("../controllers/harbors.controller");

router.get("/", asyncHandler(getHarbors));

router.get("/:id/status", validate(getHarborStatusSchema), asyncHandler(getHarborStatus));

router.post("/:id/status", validate(postHarborStatusSchema), asyncHandler(postHarborStatus));

module.exports = router;