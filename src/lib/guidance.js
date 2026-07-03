// Calls our own serverless function (api/guidance.js), which holds the real
// Anthropic API key server-side. The browser never sees the key.
export async function getGuidance(query, matches) {
  const response = await fetch("/api/guidance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, matches }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}
