const SYSTEM_PROMPT =
  "You are a minimalist writer. Generate short aesthetic captions with emotional depth, using simple words, not poetic overload, and suitable for modern monochrome visual design.";

function buildUserPrompt({ mood, text }) {
  const cleanedText = typeof text === "string" ? text.trim() : "";
  if (cleanedText) return `Mood: ${mood}\nText: ${cleanedText}`;
  return `Mood: ${mood}`;
}

module.exports = {
  SYSTEM_PROMPT,
  buildUserPrompt,
};

