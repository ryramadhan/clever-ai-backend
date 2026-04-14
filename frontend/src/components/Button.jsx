export default function Button({ children, disabled, loading, ...props }) {
  return (
    <button
      className="mw-button"
      disabled={disabled || loading}
      {...props}
    >
      <span className="mw-button-content">{children}</span>
      {loading ? <span className="mw-spinner" aria-hidden="true" /> : null}
    </button>
  );
}

