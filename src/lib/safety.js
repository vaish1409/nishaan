// This is a minimal, illustrative keyword gate for a prototype — NOT a real
// safety classifier. It exists so the app never sends certain situations to
// the AI model at all, and instead points straight to real help. A production
// version of this would need a properly reviewed detection approach (and
// likely a second, careful model pass) rather than a hardcoded keyword list.
const SAFETY_FLAGS = [
  "suicide", "kill himself", "kill herself", "kill myself", "want to die", "wants to die",
  "self harm", "self-harm", "cutting himself", "cutting herself", "hurting himself", "hurting herself",
  "sexually abus", "molest", "rape", "being touched", "beaten badly", "beats him", "beats her",
  "locks him in", "locks her in", "won't stop hitting", "hits him with", "burned him", "burned her",
  "starving him", "starving her",
];

export function checkSafety(text) {
  const t = (text || "").toLowerCase();
  return SAFETY_FLAGS.some(flag => t.includes(flag));
}
