export default function Header() {
  return (
    <header className="mw-header">
      <div className="mw-header-inner">
        <div className="mw-brand">
          <div className="mw-brand-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
            </svg>
          </div>
          <div className="mw-brand-text">
            <div className="mw-brand-title">MoodWrite</div>
            <div className="mw-brand-subtitle">Caption Generator</div>
          </div>
        </div>
      </div>
    </header>
  );
}

