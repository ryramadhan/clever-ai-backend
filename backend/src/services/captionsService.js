const { query } = require("./db");

async function insertCaption({ mood, inputText, result }) {
  const { rows } = await query(
    `INSERT INTO captions (mood, input_text, result)
     VALUES ($1, $2, $3)
     RETURNING id, mood, input_text, result, created_at`,
    [mood, inputText ?? null, result]
  );
  return rows[0];
}

async function listCaptions({ limit = 20, offset = 0 } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const { rows } = await query(
    `SELECT id, mood, input_text, result, created_at
     FROM captions
     ORDER BY created_at DESC, id DESC
     LIMIT $1 OFFSET $2`,
    [safeLimit, safeOffset]
  );

  return rows;
}

module.exports = {
  insertCaption,
  listCaptions,
};

