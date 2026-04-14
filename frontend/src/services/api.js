const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.error?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export async function generateCaption({ mood, text }) {
  return request("/generate", { method: "POST", body: { mood, text } });
}

export async function getCaptions({ limit = 20, offset = 0 } = {}) {
  const qs = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  }).toString();
  return request(`/captions?${qs}`);
}

