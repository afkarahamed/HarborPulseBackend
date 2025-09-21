const express = require("express");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");

const {getHarborStatusSchema, postHarborStatusSchema } = require("../validationSchema/harbors");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const requireAdmin = require("../middleware/requireAdmin");
const requireLogin = require("../middleware/requireLogin");
const sendEmail = require("../services/email");

const {getHarbors, getHarborById, getHarborStatus, postHarborStatus} = require("../controllers/harbors.controller");

router.get("/", asyncHandler(getHarbors));

router.get("/test-email", async (req, res, next) => {
  try {
    await sendEmail({
      to: "afkar.net11@gmail.com", // where you want to receive
      subject: "HarborPulse Test",
      text: "Welcome to HarborPulse!",
      html: "<h1>Welcome to HarborPulse 🎉</h1><p>Your backend is sending real emails!</p>"
    });

    res.json({ success: true, message: "Test email sent!" });
  } catch (err) {
    next(err); // handled by your error middleware
  }
});

router.get("/:id", asyncHandler(getHarborById));

router.get("/:id/status", auth, requireLogin, validate(getHarborStatusSchema), asyncHandler(getHarborStatus));

router.patch("/:id/status", auth, requireAdmin, validate(postHarborStatusSchema), asyncHandler(postHarborStatus));

module.exports = router;