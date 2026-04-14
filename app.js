const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// Strict env validation at startup
const requiredEnv = ["GEMINI_API_KEY"];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length > 0) {
  // eslint-disable-next-line no-console
  console.error(`[FATAL] Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.json({
    name: "MoodWrite AI API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/health",
      generate: "POST /api/generate",
      captions: "GET /api/captions",
    },
    docs: "https://github.com/ryramadhan/moodwrite-ai-backend",
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const apiRoutes = require("./src/routes/generateRoutes");
app.use("/api", apiRoutes);
app.use(apiRoutes);

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const statusCode =
    typeof err.statusCode === "number" ? err.statusCode : 500;

  if (statusCode >= 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on :${PORT}`));

module.exports = app;
