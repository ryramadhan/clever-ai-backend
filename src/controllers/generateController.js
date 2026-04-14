const { generateCaptionAny } = require("../services/ai");
const { insertCaption } = require("../services/captionsService");

const ALLOWED_MOODS = new Set([
  "lonely",
  "night",
  "nostalgic",
  "lost",
  "calm",
]);

function badRequest(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

// sanitize text input - remove potential harmful chars, limit length
function sanitizeText(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .replace(/[<>"']/g, "")
    .trim()
    .slice(0, 500);
}

async function generate(req, res) {
  const { mood, text } = req.body ?? {};

  if (typeof mood !== "string" || !mood.trim()) {
    throw badRequest("Field 'mood' is required");
  }
  const normalizedMood = mood.trim().toLowerCase();
  if (!ALLOWED_MOODS.has(normalizedMood)) {
    throw badRequest(
      "Invalid mood. Allowed: lonely, night, nostalgic, lost, calm"
    );
  }

  if (text != null && typeof text !== "string") {
    throw badRequest("Field 'text' must be a string when provided");
  }

  const startedAt = Date.now();
  const sanitizedText = sanitizeText(text);
  const { result, provider } = await generateCaptionAny({
    mood: normalizedMood,
    text: sanitizedText,
  });
  const latency = Date.now() - startedAt;

  await insertCaption({
    mood: normalizedMood,
    inputText: sanitizedText || null,
    result,
  });

  res.json({
    result,
    provider,
    mood: normalizedMood,
    latency,
  });
}

module.exports = {
  generate,
};

