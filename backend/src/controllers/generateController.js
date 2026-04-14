const { generateCaptionAny } = require("../services/ai");
const { insertCaption } = require("../services/captionsService");

const ALLOWED_MOODS = new Set([
  "sunyi",
  "malam",
  "nostalgia",
  "kehilangan",
  "tenang",
]);

function badRequest(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

async function generate(req, res) {
  const { mood, text } = req.body ?? {};

  if (typeof mood !== "string" || !mood.trim()) {
    throw badRequest("Field 'mood' is required");
  }
  const normalizedMood = mood.trim().toLowerCase();
  if (!ALLOWED_MOODS.has(normalizedMood)) {
    throw badRequest(
      "Invalid mood. Allowed: sunyi, malam, nostalgia, kehilangan, tenang"
    );
  }

  if (text != null && typeof text !== "string") {
    throw badRequest("Field 'text' must be a string when provided");
  }

  const startedAt = Date.now();
  const { result, provider } = await generateCaptionAny({
    mood: normalizedMood,
    text,
  });
  const latency = Date.now() - startedAt;

  await insertCaption({
    mood: normalizedMood,
    inputText: typeof text === "string" ? text.trim() : null,
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

