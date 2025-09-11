const express = require("express");
const router = express.Router();


router.post("/login", (req, res) =>{
    res.locals.response = { success:true};
    const {response} = res.locals;
    const finalResponse = {...response, ...req.body};
    res.json(finalResponse);
});

router.post("/logout", (req, res) =>{
    res.send(req.body);
});


module.exports = router;