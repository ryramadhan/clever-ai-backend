const express = require("express");
const rateLimit = require("express-rate-limit");
const { asyncHandler } = require("../utils/asyncHandler");
const { optionalAuth, authenticateToken } = require("../middleware/auth");
const { generate } = require("../controllers/generateController");
const { 
  getCaptions, 
  renameCaptionController, 
  pinCaptionController, 
  deleteCaptionController 
} = require("../controllers/captionsController");

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

// Optional auth: if token provided, captions linked to user; if not, public
router.post("/generate", generateLimiter, optionalAuth, asyncHandler(generate));
router.get("/captions", optionalAuth, asyncHandler(getCaptions));

// History item actions (requires authentication)
router.patch("/captions/:id", authenticateToken, asyncHandler(renameCaptionController));
router.patch("/captions/:id/pin", authenticateToken, asyncHandler(pinCaptionController));
router.delete("/captions/:id", authenticateToken, asyncHandler(deleteCaptionController));

module.exports = router;

