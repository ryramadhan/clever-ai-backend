const express = require("express");
const rateLimit = require("express-rate-limit");
const { asyncHandler } = require("../utils/asyncHandler");
const { generate } = require("../controllers/generateController");
const { getCaptions } = require("../controllers/captionsController");

const router = express.Router();

const generateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: "Too many requests. Please wait a moment and try again.",
    },
  },
});

router.post("/generate", generateLimiter, asyncHandler(generate));
router.get("/captions", asyncHandler(getCaptions));

module.exports = router;

