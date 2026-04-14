import { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header.jsx";
import ResultCard from "../components/ResultCard.jsx";
import HistoryList from "../components/HistoryList.jsx";
import { generateCaption, getCaptions } from "../services/api.js";

const MOODS = [
  { value: "sunyi", label: "Sunyi" },
  { value: "malam", label: "Malam" },
  { value: "nostalgia", label: "Nostalgia" },
  { value: "kehilangan", label: "Kehilangan" },
  { value: "tenang", label: "Tenang" },
];

function useTypingText(fullText, { enabled, speedMs = 16 } = {}) {
  const [typed, setTyped] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setTyped(fullText || "");
      return;
    }

    const target = fullText || "";
    setTyped("");
    let i = 0;

    function tick() {
      i += 1;
      setTyped(target.slice(0, i));
      if (i >= target.length) return;
      timerRef.current = window.setTimeout(tick, speedMs);
    }

    timerRef.current = window.setTimeout(tick, speedMs);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [fullText, enabled, speedMs]);

  return typed;
}

export default function HomePage() {
  const [mood, setMood] = useState("malam");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [provider, setProvider] = useState("");
  const [enableTyping, setEnableTyping] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [historyOffset, setHistoryOffset] = useState(0);
  const [historyHasMore, setHistoryHasMore] = useState(true);
  const [historyLoadingMore, setHistoryLoadingMore] = useState(false);

  const typed = useTypingText(result, { enabled: enableTyping });
  const isTyping = enableTyping && typed !== result;
  const HISTORY_LIMIT = 20;

  const canSubmit = useMemo(() => {
    return Boolean(mood) && !loading;
  }, [mood, loading]);

  async function refreshHistory() {
    setHistoryError("");
    setHistoryLoading(true);
    try {
      const data = await getCaptions({ limit: HISTORY_LIMIT, offset: 0 });
      const items = Array.isArray(data.items) ? data.items : [];
      setHistory(items);
      setHistoryOffset(items.length);
      setHistoryHasMore(items.length >= HISTORY_LIMIT);
    } catch (err) {
      setHistoryError(err?.message || "Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  }

  async function loadMoreHistory() {
    if (historyLoading || historyLoadingMore || !historyHasMore) return;
    setHistoryError("");
    setHistoryLoadingMore(true);
    try {
      const data = await getCaptions({
        limit: HISTORY_LIMIT,
        offset: historyOffset,
      });
      const nextItems = Array.isArray(data.items) ? data.items : [];

      const seen = new Set(history.map((h) => h.id));
      const merged = [...history];
      for (const it of nextItems) {
        if (!seen.has(it.id)) merged.push(it);
      }

      setHistory(merged);
      setHistoryOffset(merged.length);
      setHistoryHasMore(nextItems.length >= HISTORY_LIMIT);
    } catch (err) {
      setHistoryError(err?.message || "Failed to load more history");
    } finally {
      setHistoryLoadingMore(false);
    }
  }

  useEffect(() => {
    refreshHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onGenerate(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult("");
    setProvider("");

    try {
      const data = await generateCaption({ mood, text: text.trim() || "" });
      setResult(data.result || "");
      setProvider(data.provider || "");
      refreshHistory();
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mw-app">
      <Header />

      <main className="mw-main">
        <section className="mw-hero">
          <h1>Cerita dalam satu kalimat.</h1>
          <p>AI-generated captions for every mood.</p>
        </section>

        <div className="mw-generator">
          <section className="mw-input-section">
            {/* Mood Selector */}
            <div className="mw-mood-section">
              <span className="mw-section-label">Mood</span>
              <div className="mw-mood-grid">
                {MOODS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    className={`mw-mood-btn ${mood === m.value ? "active" : ""}`}
                    onClick={() => setMood(m.value)}
                    disabled={loading}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Context Input */}
            <div className="mw-context-section">
              <span className="mw-section-label">Konteks</span>
              <div className="mw-textarea-wrapper">
                <textarea
                  className="mw-textarea"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Add context..."
                  disabled={loading}
                />
              </div>
              <span className="mw-textarea-hint">
                Optional. Add context for more personal results.
              </span>
            </div>

            {/* Generate Row */}
            <div className="mw-generate-row">
              <button
                type="button"
                className="mw-btn-primary"
                onClick={onGenerate}
                disabled={!canSubmit}
              >
                {loading ? (
                  <>
                    <span className="mw-spinner" />
                    Generating...
                  </>
                ) : (
                  "Generate"
                )}
              </button>

              <div className="mw-toggle-group">
                <label className="mw-toggle">
                  <input
                    type="checkbox"
                    checked={enableTyping}
                    onChange={(e) => setEnableTyping(e.target.checked)}
                    disabled={loading}
                  />
                  <span>Typing effect</span>
                </label>
              </div>
            </div>

            {error ? <div className="mw-error">{error}</div> : null}
          </section>

          <ResultCard
            text={typed}
            isTyping={isTyping}
            provider={provider}
            hasResult={Boolean(result)}
          />
        </div>

        <HistoryList
          items={history}
          loading={historyLoading}
          error={historyError}
          onRefresh={refreshHistory}
          onLoadMore={loadMoreHistory}
          canLoadMore={historyHasMore}
          loadingMore={historyLoadingMore}
        />
      </main>

      <footer className="mw-footer">
        <div className="mw-footer-inner">
          <span className="mw-footer-text">
            © {new Date().getFullYear()} MoodWrite
          </span>
        </div>
      </footer>
    </div>
  );
}

