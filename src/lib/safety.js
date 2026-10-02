// Keyword/pattern safety gate. It is still a prototype, NOT a clinical safety classifier: it exists so that
// the most serious situations never go to the AI model and instead point straight to real help.
// Used in the browser (instant feedback) AND on the server (api/guidance.js), because a client-side
// check alone can be bypassed by calling the API directly.
const PATTERNS = [
  // self-harm / suicide
  /\bsuicid\w*/,
  /\b(kill|killing|hurt|hurting|harm|harming|cut|cutting)\s+(him|her|them|my)self\b/,
  /\b(kill|killing)\s+(him|her|them)selves\b/,
  /\bself[\s-]?harm\w*/,
  /\bwant(s|ed)?\s+to\s+die\b/,
  /\bend(ing)?\s+(his|her|my|their)\s+life\b/,
  // sexual abuse
  /\bsexual(ly)?\s+(abus|assault|molest)\w*/,
  /\bmolest\w*/,
  /\brap(e|ed|ing|ist)\b/,
  /\bbeing\s+touched\b/,
  /\btouch(ed|es|ing)?\s+(him|her|them)\s+(inappropriately|in private|private parts)\b/,
  /\binappropriate(ly)?\s+touch\w*/,
  // physical abuse / neglect
  /\bbeat(s|en|ing)?\s+(him|her|them|the child|my child)\s+(badly|up|with)\b/,
  /\bbeaten\s+(badly|up)\b/,
  /\bhit(s|ting)?\s+(him|her|them)\s+with\b/,
  /\bburn(ed|t|s)?\s+(him|her|them)\b/,
  /\block(s|ed|ing)?\s+(him|her|them)\s+(in|up)\b/,
  /\bstarv(e|es|ed|ing)\s+(him|her|them)\b/,
  /\bwon'?t\s+stop\s+hitting\b/,
  // medical emergencies (this app cannot help with these)
  /\b(not\s+breathing|stopped\s+breathing|unconscious|seizure|overdos\w*|swallowed\s+(poison|pills|bleach|battery))\b/,
  /\bpoison(ed|ing)?\b/,
];

export function checkSafety(text) {
  const t = (text || "").toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, " ");
  return PATTERNS.some(rx => rx.test(t));
}
