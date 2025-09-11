const express = require("express");
const router = express.Router();

let fishSpecies = [
    { id: 1, name: "Tuna"},
    { id: 2, name: "Salmon"},
    { id: 3, name: "Cod"}
];

let fishSpeciesPrice = [
    { speciesId: 1, fishSpeciesId: 1, price: 15.00 },
    { speciesId: 2, fishSpeciesId: 2, price: 12.00 },
    { speciesId: 3, fishSpeciesId: 3, price: 10.00 },
    { speciesId: 1, fishSpeciesId: 1, price: 14.00 }
];

router.get("/species", (req, res) => {
    res.json(fishSpecies);
});

router.get("/prices", (req, res) =>{
    res.json({success:"true",
        date: "2025-09-10",
        items: fishSpeciesPrice
    });
})

router.get("/prices/:speciesId", (req, res) =>{
    let fishPrice = fishSpeciesPrice.filter(
        (fish) => fish.fishSpeciesId == parseInt(req.params.speciesId))
        .map((fish) => { return fish.price });

    if(!fishPrice.length){
        return res.status(404).json({message: "Fish species not found"});
    }
    res.json(fishPrice);

});

module.exports = router;
