const { generateCaptionWithGemini } = require("./gemini");

async function generateCaptionAny({ context }) {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  if (provider !== "gemini") {
    const err = new Error("Invalid AI_PROVIDER. Use: gemini");
    err.statusCode = 500;
    throw err;
  }

  try {
    const result = await generateCaptionWithGemini({ context });
    return { result, provider: "gemini" };
  } catch (err) {
    console.log("[AI Error]", err?.message, "Status:", err?.statusCode);
    throw err;
  }
}

module.exports = {
  generateCaptionAny,
};

