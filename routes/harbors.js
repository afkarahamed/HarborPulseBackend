const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");

let harbors = [
    { id: 1, name: "Tangalle", location: "Location A", status: "Danger" },
    { id: 2, name: "Mirissa", location: "Location B",status: "Moderate" },
    { id: 3, name: "Galle", location: "Location C", status: "Safe" }
];

router.get("/", asyncHandler(async (req, res) =>{
    res.locals.response = { success:true};
    const {response} = res.locals;
    const finalResponse = {...response, data: harbors};
    res.json(finalResponse);
}));

router.get("/:id/status", asyncHandler(async (req, res) =>{
    let harbor = harbors.find((harbor) => harbor.id === parseInt(req.params.id));
    if(!harbor){
        return res.status(404).json({message: "Harbor not found"});
    }
    res.json({success:true, data: harbor});
}));

router.post("/:id/status", asyncHandler(async (req, res) => {
    let harbor = harbors.find((harbor) => {return harbor.id == parseInt(req.params.id)});
    if(!harbor)
        return res.status(404).json({message: "Harbor not found"});
    harbor.status = req.body.status;
    res.json(harbor);
}));

module.exports = router;