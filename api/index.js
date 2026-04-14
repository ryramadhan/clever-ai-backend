const app = require("../app.js");

// Vercel serverless handler
module.exports = (req, res) => {
  return app(req, res);
};
