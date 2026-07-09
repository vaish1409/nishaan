const TABLE = process.env.SUPABASE_CASES_TABLE || "cases";
const OUTCOME_TYPES = new Set(["worked", "mixed", "backfired"]);

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return { url: url.replace(/\/$/, ""), key };
}

function cleanText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function normalizeCase(input) {
  const candidate = input?.case || input || {};
  const age = cleanText(candidate.age, 20);
  const category = cleanText(candidate.category, 80);
  const situation = cleanText(candidate.situation, 1200);
  const tried = cleanText(candidate.tried, 1200);
  const outcome = cleanText(candidate.outcome, 1200);
  const outcomeType = OUTCOME_TYPES.has(candidate.outcomeType) ? candidate.outcomeType : "mixed";
  const tags = Array.isArray(candidate.tags)
    ? candidate.tags.map(tag => cleanText(tag, 40).toLowerCase()).filter(Boolean).slice(0, 12)
    : [];

  if (!age || !category || !situation || !tried || !outcome) {
    return null;
  }

  return {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    age,
    category,
    situation,
    tried,
    outcome,
    outcome_type: outcomeType,
    tags,
  };
}

function toClientCase(row) {
  return {
    id: row.id,
    age: row.age,
    category: row.category,
    situation: row.situation,
    tried: row.tried,
    outcome: row.outcome,
    outcomeType: row.outcome_type,
    tags: Array.isArray(row.tags) ? row.tags : [],
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const newCase = normalizeCase(req.body);
  if (!newCase) {
    return res.status(400).json({ error: "Missing required case fields" });
  }

  let config;
  try {
    config = getSupabaseConfig();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Database is not configured" });
  }

  try {
    const response = await fetch(
      `${config.url}/rest/v1/${TABLE}?select=id,age,category,situation,tried,outcome,outcome_type,tags`,
      {
        method: "POST",
        headers: {
          apikey: config.key,
          Authorization: `Bearer ${config.key}`,
          "content-type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(newCase),
      }
    );

    if (!response.ok) {
      const detail = await response.text();
      console.error("Supabase add error:", response.status, detail);
      return res.status(502).json({ error: "Could not save case" });
    }

    const rows = await response.json();
    return res.status(201).json({ case: toClientCase(rows[0]) });
  } catch (err) {
    console.error("Cases add handler error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
