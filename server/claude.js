// Server-only helper for calling the Claude API. Never import this from src/ (the browser).
// Model names can be overridden with env vars. Check the current model names in Anthropic's docs.
export const ANSWER_MODEL = process.env.ANSWER_MODEL || "claude-sonnet-5-5";
export const RERANK_MODEL = process.env.RERANK_MODEL || "claude-haiku-4-5-20251001";

export async function callClaude({ model, system, user, maxTokens = 800, timeoutMs = 25000 }) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({ model, max_tokens: maxTokens, system, messages: [{ role: "user", content: user }] }),
    });
    if (!response.ok) {
      throw new Error(`Anthropic API ${response.status}: ${await response.text()}`);
    }
    const data = await response.json();
    return (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
  } finally {
    clearTimeout(timer);
  }
}

export function parseJson(raw) {
  return JSON.parse(String(raw).replace(/```json|```/g, "").trim());
}
