// Vercel serverless function: POST /api/guidance
// Body: { query: string, matches: Array<{ id, ageLabel, category, situation, tried, outcome, outcomeType }> }
// Keeps ANTHROPIC_API_KEY server-side only — never sent to the browser.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query, matches } = req.body || {};

  if (!query || typeof query !== "string" || !Array.isArray(matches) || matches.length === 0) {
    return res.status(400).json({ error: "Missing query or matches" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is not set");
    return res.status(500).json({ error: "Server is not configured with an API key" });
  }

  const casesContext = matches
    .map(
      m =>
        `Case ${m.id} (${m.ageLabel || m.age}, ${m.category}):\nSituation: ${m.situation}\nWhat was tried: ${m.tried}\nOutcome (${m.outcomeType}): ${m.outcome}`
    )
    .join("\n\n");

  const systemPrompt = `You are a calm, non-judgmental parenting guidance assistant for an Indian audience, part of a prototype app called Nishaan. You must ONLY draw on the case notes provided below as grounding - do not invent new cases, statistics, or claims the notes don't support. Be specific and brief, and write directly to the parent. Respond with ONLY valid JSON and nothing else (no markdown fences, no preamble):
{"synthesis": "3-5 sentences, referencing which case id(s) it draws from in parentheses, e.g. (c09)", "considerations": ["short practical point", "short practical point"], "consult_professional": boolean}
Set consult_professional to true only if this genuinely seems to call for a pediatrician, counselor, or therapist beyond what peer case notes can offer.

Case notes:
${casesContext}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: query }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return res.status(502).json({ error: "Upstream API error" });
    }

    const data = await response.json();
    const textBlock = (data.content || []).find(b => b.type === "text");
    const raw = textBlock ? textBlock.text : "";
    const clean = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (parseErr) {
      console.error("Failed to parse model output as JSON:", raw);
      return res.status(502).json({ error: "Model returned an unexpected format" });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Guidance handler error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
