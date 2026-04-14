import { useMemo, useState } from "react";

export default function CopyButton({ text }) {
  const [status, setStatus] = useState("idle"); // idle | copied | error

  const label = useMemo(() => {
    if (status === "copied") return "Copied";
    if (status === "error") return "Failed";
    return "Copy";
  }, [status]);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text || "");
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1200);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 1200);
    }
  }

  return (
    <button
      type="button"
      className="mw-button mw-button-secondary"
      onClick={onCopy}
      disabled={!text}
    >
      {label}
    </button>
  );
}

