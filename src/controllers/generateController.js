const {
  generateCaptionAny,
  generateCaptionAnyStream,
} = require("../services/ai");
const { insertCaption } = require("../services/captionsService");
const { insertGenerateLog } = require("../services/generateLogService");

function badRequest(message) {
  const err = new Error(message);
  err.statusCode = 400;
  return err;
}

// sanitize text input - remove potential harmful chars, limit length
function sanitizeContext(context) {
  if (!context || typeof context !== "string") return "";
  return context
    .replace(/[<>'"]/g, "")
    .trim()
    .slice(0, 2000);
}

async function generate(req, res) {
  const { context } = req.body ?? {};

  if (typeof context !== "string" || !context.trim()) {
    throw badRequest("Field 'context' is required");
  }

  const startedAt = Date.now();
  const sanitizedContext = sanitizeContext(context);
  const { result, provider } = await generateCaptionAny({
    context: sanitizedContext,
  });
  const latency = Date.now() - startedAt;

  // Data ownership assignment:
  // - Guest mode: NOT saved to DB (privacy-first)
  // - Logged in: saved to DB with user ID
  if (req.userId) {
    await insertCaption({
      userId: req.userId,
      context: sanitizedContext,
      result,
    });
  }

  // Non-blocking: log generation duration for stats
  insertGenerateLog(latency).catch(() => { });

  res.json({
    result,
    provider,
    context: sanitizedContext,
    latency,
  });
}

async function generateStream(req, res) {
  const { context } = req.body ?? {};
  const streamParam = req.query?.stream;

  if (typeof context !== "string" || !context.trim()) {
    throw badRequest("Field 'context' is required");
  }

  const sanitizedContext = sanitizeContext(context);
  const startedAt = Date.now();

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering

  let fullResult = "";
  let provider = "gemini";

  try {
    for await (const data of generateCaptionAnyStream({
      context: sanitizedContext,
    })) {
      fullResult += data.chunk;
      provider = data.provider;

      // Send chunk as SSE event
      res.write(
        `data: ${JSON.stringify({
          chunk: data.chunk,
          provider: data.provider,
          model: data.model,
        })}\n\n`
      );
    }

    // Send completion event
    const latency = Date.now() - startedAt;
    res.write(
      `data: ${JSON.stringify({
        done: true,
        result: fullResult,
        provider,
        context: sanitizedContext,
        latency,
      })}\n\n`
    );

    // Save to DB if authenticated
    if (req.userId) {
      await insertCaption({
        userId: req.userId,
        context: sanitizedContext,
        result: fullResult,
      });
    }

    // Non-blocking: log generation duration for stats
    insertGenerateLog(latency).catch(() => { });

    res.end();
  } catch (err) {
    // Send error as SSE event
    res.write(
      `data: ${JSON.stringify({
        error: true,
        message: err?.message || "Stream error",
        statusCode: err?.statusCode || 500,
      })}\n\n`
    );
    res.end();
  }
}

module.exports = {
  generate,
  generateStream,
};

