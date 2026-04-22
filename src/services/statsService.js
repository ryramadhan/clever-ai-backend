const { query } = require("./db");

async function getStats() {
  const { rows: captionRows } = await query(
    `SELECT COUNT(*) as total FROM captions`
  );

  const { rows: logRows } = await query(
    `SELECT AVG(duration_ms) as avg_ms FROM generate_logs WHERE created_at > NOW() - INTERVAL '7 days'`
  );

  const { rows: userRows } = await query(
    `SELECT COUNT(*) as total FROM users`
  );

  return {
    totalGenerated: parseInt(captionRows[0].total, 10),
    avgGenerateTime: Math.round(logRows[0].avg_ms) || 0,
    totalUsers: parseInt(userRows[0].total, 10),
  };
}

module.exports = {
  getStats,
};
