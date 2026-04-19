const { query } = require("./db");

async function insertCaption({ userId, context, result }) {
  const { rows } = await query(
    `INSERT INTO captions (user_id, context, result)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, context, result, created_at`,
    [userId || null, context, result]
  );
  return rows[0];
}

async function listCaptions({ userId, limit = 20, offset = 0 } = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 50);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  // PRODUCTION RULE: Strict data separation
  // Guest (no token) → Only see global/public data (user_id IS NULL)
  // Logged in → Only see their own data (user_id = current_user_id)
  // Pinned items always appear first
  // NEVER show all data without filter
  let queryText;
  let params;

  if (userId) {
    // User logged in → Only their data, pinned first
    queryText = `SELECT id, context, result, title, is_pinned, created_at
     FROM captions
     WHERE user_id = $1
     ORDER BY is_pinned DESC, created_at DESC, id DESC
     LIMIT $2 OFFSET $3`;
    params = [userId, safeLimit, safeOffset];
  } else {
    // Guest mode → Only global/public data (user_id IS NULL)
    queryText = `SELECT id, context, result, title, is_pinned, created_at
     FROM captions
     WHERE user_id IS NULL
     ORDER BY created_at DESC, id DESC
     LIMIT $1 OFFSET $2`;
    params = [safeLimit, safeOffset];
  }

  const { rows } = await query(queryText, params);

  return rows;
}

async function renameCaption({ captionId, userId, title }) {
  // Strict ownership check: only rename user's own captions
  const { rows } = await query(
    `UPDATE captions 
     SET title = $1
     WHERE id = $2 AND user_id = $3
     RETURNING id, user_id, context, result, title, is_pinned, created_at`,
    [title, captionId, userId]
  );

  if (rows.length === 0) {
    const err = new Error("Caption not found or access denied");
    err.statusCode = 404;
    throw err;
  }

  return rows[0];
}

async function pinCaption({ captionId, userId, isPinned }) {
  // Strict ownership check: only pin user's own captions
  const { rows } = await query(
    `UPDATE captions 
     SET is_pinned = $1
     WHERE id = $2 AND user_id = $3
     RETURNING id, user_id, context, result, title, is_pinned, created_at`,
    [isPinned, captionId, userId]
  );

  if (rows.length === 0) {
    const err = new Error("Caption not found or access denied");
    err.statusCode = 404;
    throw err;
  }

  return rows[0];
}

async function deleteCaption({ captionId, userId }) {
  // Strict ownership check: only delete user's own captions
  const { rowCount } = await query(
    `DELETE FROM captions 
     WHERE id = $1 AND user_id = $2`,
    [captionId, userId]
  );

  if (rowCount === 0) {
    const err = new Error("Caption not found or access denied");
    err.statusCode = 404;
    throw err;
  }

  return { deleted: true, id: captionId };
}

module.exports = {
  insertCaption,
  listCaptions,
  renameCaption,
  pinCaption,
  deleteCaption,
};

