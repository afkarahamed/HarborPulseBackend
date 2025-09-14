const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");


const {getSpecies, getPrices, getPriceBySpeciesId} = require("../controllers/fish.controller");

router.get("/species", asyncHandler(getSpecies));

router.get("/prices", asyncHandler(getPrices));

router.get("/prices/:speciesId", asyncHandler(getPriceBySpeciesId));

module.exports = router;
