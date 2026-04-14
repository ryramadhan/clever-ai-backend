import { useState } from "react";

export default function ResultCard({ text, isTyping, provider, hasResult }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <section className="mw-result-section" aria-live="polite">
      <div className="mw-result-card">
        <div className="mw-result-header">
          <span className="mw-result-label">Caption</span>
          <div className="mw-result-actions">
            <button
              type="button"
              className="mw-btn-icon"
              onClick={handleCopy}
              disabled={!text}
              title="Copy to clipboard"
              aria-label="Copy result"
            >
              {copied ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="mw-result-content">
          {hasResult ? (
            <p className="mw-result-text">
              {text}
              {isTyping ? <span className="mw-caret" aria-hidden="true" /> : null}
            </p>
          ) : (
            <p className="mw-result-placeholder">
              Your caption will appear here
            </p>
          )}
        </div>

        {hasResult && (
          <div className="mw-result-meta">
            {provider && (
              <span className="mw-provider-badge">
                {provider === "gemini" ? "AI Generated" : "Mock"}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

