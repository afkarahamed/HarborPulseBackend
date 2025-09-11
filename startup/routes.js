const express =require("express");
const auth = require("../routes/auth");
const harbors = require("../routes/harbors");
const fish = require("../routes/fish");

module.exports = function(app){
    app.use(express.json());
    app.use("/auth", auth);
    app.use("/harbors", harbors);
    app.use("/fish", fish);
};