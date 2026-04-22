const { query } = require("./db");

async function insertGenerateLog(durationMs) {
  return query(
    `INSERT INTO generate_logs (duration_ms) VALUES ($1)`,
    [Math.round(durationMs)]
  );
}

module.exports = {
  insertGenerateLog,
};
