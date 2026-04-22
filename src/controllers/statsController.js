const { getStats } = require("../services/statsService");

async function getStatsController(_req, res) {
  const stats = await getStats();
  res.json(stats);
}

module.exports = {
  getStatsController,
};
