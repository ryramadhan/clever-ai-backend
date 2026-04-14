const { generateCaptionWithGemini } = require("./gemini");
const { generateMockCaption } = require("./mockCaption");

function isQuotaOrBillingError(err) {
  const msg = String(err?.message || "").toLowerCase();
  return (
    err?.statusCode === 429 ||
    /quota|billing|rate limit|resource has been exhausted|too many requests/.test(
      msg
    )
  );
}

async function generateCaptionAny({ mood, text }) {
  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  if (provider !== "gemini") {
    const err = new Error("Invalid AI_PROVIDER. Use: gemini");
    err.statusCode = 500;
    throw err;
  }

  const fallbackMock =
    (process.env.AI_FALLBACK_MOCK || "true").toLowerCase() !== "false";

  try {
    const result = await generateCaptionWithGemini({ mood, text });
    return { result, provider: "gemini" };
  } catch (err) {
    if (fallbackMock && isQuotaOrBillingError(err)) {
      const result = generateMockCaption({ mood, text });
      return { result, provider: "mock" };
    }
    throw err;
  }
}

module.exports = {
  generateCaptionAny,
};

