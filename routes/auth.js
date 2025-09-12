const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");


router.post("/login", asyncHandler(async (req, res) =>{
    res.locals.response = { success:true};
    const {response} = res.locals;
    const finalResponse = {...response, ...req.body};
    res.json(finalResponse);
}));

router.post("/logout", asyncHandler(async (req, res) =>{
    res.send(req.body);
}));


module.exports = router;