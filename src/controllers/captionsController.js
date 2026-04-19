const { 
  listCaptions, 
  renameCaption, 
  pinCaption, 
  deleteCaption 
} = require("../services/captionsService");

/**
 * Get captions with strict data separation:
 * - Guest (no token): Only see global/public data (user_id IS NULL)
 * - Logged in: Only see their own data (user_id = current_user_id)
 * - Pinned items appear first for authenticated users
 * - Never exposes data between users
 */
async function getCaptions(req, res) {
  const { limit, offset } = req.query ?? {};
  
  // Extract userId from JWT token (set by optionalAuth middleware)
  // null = guest mode, number/string = logged in user
  const userId = req.userId || null;
  
  const items = await listCaptions({ userId, limit, offset });
  
  // Return items + metadata untuk frontend conditional rendering
  res.json({ 
    items,
    meta: {
      isAuthenticated: Boolean(userId),
      isGuest: !userId,
      count: items.length
    }
  });
}

/**
 * Rename a specific caption
 * - Requires authentication
 * - User can only rename their own captions
 */
async function renameCaptionController(req, res) {
  const { id } = req.params;
  const { title } = req.body;
  const userId = req.userId;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    const err = new Error("Title is required and must be a non-empty string");
    err.statusCode = 400;
    throw err;
  }

  const trimmedTitle = title.trim();
  if (trimmedTitle.length > 255) {
    const err = new Error("Title must not exceed 255 characters");
    err.statusCode = 400;
    throw err;
  }

  const updated = await renameCaption({ 
    captionId: parseInt(id), 
    userId, 
    title: trimmedTitle 
  });

  res.json({ 
    success: true, 
    message: "Caption renamed successfully",
    item: updated 
  });
}

/**
 * Pin or unpin a specific caption
 * - Requires authentication
 * - User can only pin their own captions
 */
async function pinCaptionController(req, res) {
  const { id } = req.params;
  const { is_pinned } = req.body;
  const userId = req.userId;

  if (typeof is_pinned !== "boolean") {
    const err = new Error("is_pinned must be a boolean value");
    err.statusCode = 400;
    throw err;
  }

  const updated = await pinCaption({ 
    captionId: parseInt(id), 
    userId, 
    isPinned: is_pinned 
  });

  res.json({ 
    success: true, 
    message: is_pinned ? "Caption pinned" : "Caption unpinned",
    item: updated 
  });
}

/**
 * Delete a specific caption
 * - Requires authentication
 * - User can only delete their own captions
 * - Permanent deletion (cannot be undone)
 */
async function deleteCaptionController(req, res) {
  const { id } = req.params;
  const userId = req.userId;

  const result = await deleteCaption({ 
    captionId: parseInt(id), 
    userId 
  });

  res.json({ 
    success: true, 
    message: "Caption deleted successfully",
    deleted: result.deleted,
    id: result.id
  });
}

module.exports = {
  getCaptions,
  renameCaptionController,
  pinCaptionController,
  deleteCaptionController,
};

