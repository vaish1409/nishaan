const TABLE = process.env.SUPABASE_CASES_TABLE || "cases";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return { url: url.replace(/\/$/, ""), key };
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
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
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
      `${config.url}/rest/v1/${TABLE}?select=id,age,category,situation,tried,outcome,outcome_type,tags,created_at&order=created_at.desc`,
      {
        headers: {
          apikey: config.key,
          Authorization: `Bearer ${config.key}`,
        },
      }
    );

    if (!response.ok) {
      const detail = await response.text();
      console.error("Supabase list error:", response.status, detail);
      return res.status(502).json({ error: "Could not load cases" });
    }

    const rows = await response.json();
    return res.status(200).json({ cases: rows.map(toClientCase) });
  } catch (err) {
    console.error("Cases list handler error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
