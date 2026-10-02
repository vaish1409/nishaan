// Compares the OLD retrieval (eval/legacy-retrieval.js) with the NEW one on the golden set.
// Run:  npm run eval        (no API key needed: this tests retrieval only)
import { SEED_CASES } from "../src/data/cases.js";
import { golden } from "./golden.js";
import { retrieveTopMatches as oldRetrieve } from "./legacy-retrieval.js";
import { retrieveTopMatches as newRetrieve } from "../src/lib/retrieval.js";

function evaluate(name, retrieve, verbose) {
  let pos = 0, hit1 = 0, hit3 = 0, mrr = 0, traps = 0, trapOk = 0;
  const misses = [];
  for (const { q, age = null, expected } of golden) {
    const ids = retrieve(q, age, SEED_CASES, 3).map(c => c.id);
    if (expected.length === 0) {
      traps++;
      if (ids.length === 0) trapOk++;
      else misses.push(`TRAP   "${q}"${age ? ` [age ${age}]` : ""} -> returned ${ids.join(", ")}`);
      continue;
    }
    pos++;
    const rank = ids.findIndex(id => expected.includes(id));
    if (rank === 0) hit1++;
    if (rank !== -1) { hit3++; mrr += 1 / (rank + 1); }
    if (rank !== 0) misses.push(`MISS   "${q}" -> got [${ids.join(", ") || "none"}], expected [${expected.join(", ")}]`);
  }
  const pct = x => `${((100 * x) / pos).toFixed(0)}%`;
  console.log(`\n=== ${name} ===`);
  console.log(`questions with an expected case: ${pos}   traps: ${traps}`);
  console.log(`Hit@1 ${pct(hit1)}   Hit@3 ${pct(hit3)}   MRR ${(mrr / pos).toFixed(2)}   traps correctly empty: ${trapOk}/${traps}`);
  if (verbose) misses.forEach(m => console.log("  " + m));
}

const verbose = process.argv.includes("--verbose");
evaluate("OLD retrieval (before)", oldRetrieve, verbose);
evaluate("NEW retrieval (BM25)", newRetrieve, verbose);
if (!verbose) console.log("\nRun with --verbose to see every miss.");
