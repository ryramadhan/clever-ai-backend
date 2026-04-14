const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const apiRoutes = require("./src/routes/generateRoutes");
// Backwards-compatible (no prefix)
app.use(apiRoutes);
// Production-friendly prefix (matches frontend default: /api)
app.use("/api", apiRoutes);

// Serve frontend build in production-like mode
const frontendDistPath = path.resolve(__dirname, "..", "frontend", "dist");
app.use(express.static(frontendDistPath));
// Express v5 doesn't accept "*" as a path; use a regex instead.
// This serves SPA routes while keeping API routes intact.
app.get(/^(?!\/(api|generate|captions)\b).*/, (req, res, next) => {
  // If the request isn't for HTML (e.g. asset), let static middleware handle it.
  if (path.extname(req.path)) return next();
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

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

// For local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Backend listening on :${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
