// Calls our own serverless function (api/guidance.js), which holds the real Anthropic API key and does
// retrieval, reranking and answer verification on the server. The browser only sends the question and age.
export async function getGuidance(query, age) {
  const response = await fetch("/api/guidance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, age }),
  });

  if (!response.ok) {
    const err = new Error(`Request failed with status ${response.status}`);
    err.status = response.status;
    throw err;
  }

  return response.json();
}
