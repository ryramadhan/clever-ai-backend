const { listCaptions } = require("../services/captionsService");

async function getCaptions(req, res) {
  const { limit, offset } = req.query ?? {};
  const items = await listCaptions({ limit, offset });
  res.json({ items });
}

module.exports = {
  getCaptions,
};

