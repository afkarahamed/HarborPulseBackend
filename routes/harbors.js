const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");

const {getHarbors, getHarborStatus, postHarborStatus} = require("../controllers/harbors.controller");

router.get("/", asyncHandler(getHarbors));

router.get("/:id/status", asyncHandler(getHarborStatus));

router.post("/:id/status", asyncHandler(postHarborStatus));

module.exports = router;