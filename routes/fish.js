const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");
const upload = require("../middleware/upload");

const auth = require("../middleware/auth");
const requireAdmin = require("../middleware/requireAdmin");

const {getSpecies, getPrices, getPriceBySpeciesId, uploadFishPrices, testExcelRead} = require("../controllers/fish.controller");

router.get("/species", asyncHandler(getSpecies));

router.get("/prices", asyncHandler(getPrices));

router.get("/prices/:speciesId", asyncHandler(getPriceBySpeciesId));

router.post("/upload", auth, requireAdmin, upload.single("file"), asyncHandler(uploadFishPrices));

module.exports = router;
