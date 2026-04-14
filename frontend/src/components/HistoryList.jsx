import { useState, useEffect } from "react";

function formatDate(iso) {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // ignore
  }
}

// Delayed loading to prevent flash for fast requests
function useDelayedLoading(loading, delay = 200) {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (!loading) {
      setShowLoading(false);
      return;
    }
    const timer = setTimeout(() => setShowLoading(true), delay);
    return () => clearTimeout(timer);
  }, [loading, delay]);

  return showLoading;
}

export default function HistoryList({
  items,
  loading,
  error,
  onRefresh,
  onLoadMore,
  canLoadMore,
  loadingMore,
}) {
  const showLoading = useDelayedLoading(loading, 200);
  const hasItems = items && items.length > 0;

  return (
    <section className="mw-history-section">
      <div className="mw-history-header">
        <h2 className="mw-history-title">History</h2>
        <button
          type="button"
          className="mw-btn-ghost"
          onClick={onRefresh}
          disabled={loading || loadingMore}
        >
          {loading ? (
            <span className="mw-spinner-sm" />
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          )}
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error ? <div className="mw-error">{error}</div> : null}

      {/* Show skeleton only after delay */}
      {showLoading && !hasItems && (
        <div className="mw-history-skeleton">
          <div className="mw-skeleton-item" />
          <div className="mw-skeleton-item" />
          <div className="mw-skeleton-item" />
        </div>
      )}

      {/* Empty state */}
      {!loading && !hasItems && (
        <div className="mw-empty-state">
          No history yet. Generate your first caption.
        </div>
      )}

      {/* History list with fade overlay when refreshing */}
      {hasItems && (
        <div className={`mw-history-list ${loading ? "is-refreshing" : ""}`}>
          {items.map((it, index) => (
            <article
              key={it.id}
              className="mw-history-item"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="mw-history-top">
                <div className="mw-history-meta-left">
                  <span className="mw-mood-tag">{it.mood}</span>
                  <span className="mw-history-date">{formatDate(it.created_at)}</span>
                </div>
                <button
                  type="button"
                  className="mw-btn-icon"
                  onClick={() => copyToClipboard(it.result)}
                  title="Copy caption"
                  aria-label="Copy caption"
                  disabled={loading}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>
              </div>

              {it.input_text ? (
                <div className="mw-history-input">"{it.input_text}"</div>
              ) : null}

              <div className="mw-history-result">{it.result}</div>
            </article>
          ))}
        </div>
      )}

      {canLoadMore && (
        <div className="mw-load-more">
          <button
            type="button"
            className="mw-btn-ghost"
            onClick={onLoadMore}
            disabled={loading || loadingMore}
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
}

