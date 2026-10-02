// Loads the cases on the SERVER, from trusted sources only: the seed cases in the repo plus the shared
// Supabase table. The browser no longer decides which cases the model sees (before, api/guidance.js
// trusted whatever "matches" the client sent, so anyone could POST fake cases to your API).
import { SEED_CASES } from "../src/data/cases.js";

const TABLE = process.env.SUPABASE_CASES_TABLE || "cases";
const TTL_MS = 60_000;
let cache = { at: 0, rows: [] };

function toCase(row) {
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

export async function loadAllCases() {
  const now = Date.now();
  if (now - cache.at < TTL_MS) return [...SEED_CASES, ...cache.rows];

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    try {
      const res = await fetch(
        `${url.replace(/\/$/, "")}/rest/v1/${TABLE}?select=id,age,category,situation,tried,outcome,outcome_type,tags,created_at&order=created_at.desc`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } }
      );
      if (res.ok) {
        cache = { at: now, rows: (await res.json()).map(toCase) };
      } else {
        console.error("Supabase list error:", res.status);
      }
    } catch (err) {
      console.error("Supabase fetch failed, using cached/seed cases:", err.message);
    }
  }
  return [...SEED_CASES, ...cache.rows];
}
