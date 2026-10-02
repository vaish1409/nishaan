// BM25 retrieval over case notes. Pure JavaScript, so the same file runs in the browser and on the server.
// Compared with the old keyword counter:
//  - rare words count for more than common ones (idf), and long cases are not unfairly favoured
//  - tags are matched as whole words (the old substring match made the tag "no" match "know")
//  - the age filter only boosts cases that ALREADY match; it can no longer create a match on its own
//  - small synonym map + simple stemming (cried/crying -> cry, hitting -> hit)

const STOPWORDS = new Set([
  "the","and","for","with","that","this","have","has","was","were","are","his","her","she","him","when","what","how",
  "does","did","not","but","you","your","yourself","about","into","than","then","just","only","also","from","they","them",
  "their","been","being","who","whom","which","would","could","should","will","shall","can","cant","dont","didnt","wont",
  "wasnt","isnt","its","our","out","off","own","yours","itself","because","while","after","before","again","more","most",
  "some","such","very","really","every","each","my","me","we","us","is","of","to","in","on","it","at","as","be","do","an",
  "if","so","or","he","up","get","gets","got","keep","keeps","kept","always","never","want","wants","wanted",
  "know","think","thing","things","nothing","something","anything","like","need","please","help","tell",
]);

// Small, general vocabulary bridge. Extend it when the eval shows a real miss.
const SYNONYMS = {
  ipad: "tablet", tab: "tablet", mobile: "phone", cellphone: "phone", smartphone: "phone", whatsapp: "chat",
  tv: "screen", television: "screen", youtube: "screen", cartoons: "screen", videogames: "screen", gaming: "screen",
  brother: "sibling", sister: "sibling", siblings: "sibling", bro: "sibling",
  kid: "child", kids: "child", son: "child", daughter: "child", boy: "child", girl: "child",
  scream: "meltdown", screaming: "meltdown", tantrums: "tantrum", shouting: "meltdown",
  lie: "lying", lies: "lying", lied: "lying", hide: "hiding", hid: "hiding", hidden: "hiding",
  hit: "hitting", hits: "hitting", slap: "hitting", push: "hitting", pinch: "hitting",
  scared: "fear", afraid: "fear", frightened: "fear", worried: "anxiety", nervous: "anxiety", anxious: "anxiety",
  rude: "backtalk", disrespectful: "backtalk", attitude: "backtalk", sassy: "backtalk",
  grades: "marks", scored: "marks",
  midnight: "night", "2am": "night", latenight: "night",
};

function stem(w) {
  if (w.length <= 3) return w;
  const rules = [["ied", "y", 2], ["ies", "y", 2], ["ing", "", 3], ["ed", "", 3], ["es", "", 3], ["s", "", 3], ["ly", "", 3]];
  for (const [suf, rep, minStem] of rules) {
    if (w.endsWith(suf) && w.length - suf.length >= minStem) {
      let base = w.slice(0, -suf.length) + rep;
      if ((suf === "ing" || suf === "ed") && /([b-df-hj-np-tv-z])\1$/.test(base)) base = base.slice(0, -1); // hitt -> hit
      return base;
    }
  }
  return w;
}

export function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOPWORDS.has(w))
    .map(w => stem(SYNONYMS[w] || w))
    .filter(w => w.length > 1 && !STOPWORDS.has(w));
}

// Field weights: a match in the tags or category says more than a match in the long prose.
const WEIGHTS = { tags: 3, category: 2, situation: 2, tried: 1, outcome: 1 };
const K1 = 1.4, B = 0.75;

function fieldText(c, f) {
  const v = c[f];
  return Array.isArray(v) ? v.join(" ") : v || "";
}

function buildIndex(cases) {
  const docs = cases.map(c => {
    const tf = new Map();
    let len = 0;
    for (const [field, weight] of Object.entries(WEIGHTS)) {
      for (const t of tokenize(fieldText(c, field))) {
        tf.set(t, (tf.get(t) || 0) + weight);
        len += weight;
      }
    }
    return { c, tf, len };
  });
  const N = docs.length || 1;
  const avgLen = docs.reduce((s, d) => s + d.len, 0) / N || 1;
  const df = new Map();
  docs.forEach(d => d.tf.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1)));
  return { docs, N, avgLen, df };
}

const cache = new WeakMap(); // reuse the index while the same cases array is used (React keeps it stable)
function getIndex(cases) {
  let idx = cache.get(cases);
  if (!idx) { idx = buildIndex(cases); cache.set(cases, idx); }
  return idx;
}

// Same signature as before. Returns [{...case, score}] sorted best-first.
export function retrieveTopMatches(query, ageFilter, cases, topN = 3, minScore = 1.2) {
  const qTokens = [...new Set(tokenize(query))];
  if (qTokens.length === 0 || !cases || cases.length === 0) return [];
  const { docs, N, avgLen, df } = getIndex(cases);

  const scored = docs.map(({ c, tf, len }) => {
    let score = 0;
    for (const t of qTokens) {
      const f = tf.get(t);
      if (!f) continue;
      const n = df.get(t) || 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score += (idf * f * (K1 + 1)) / (f + K1 * (1 - B + (B * len) / avgLen));
    }
    if (score > 0 && ageFilter && c.age === ageFilter) score *= 1.3; // boost only; never creates a match
    return { ...c, score: Math.round(score * 100) / 100 };
  });

  return scored.filter(c => c.score >= minScore).sort((a, b) => b.score - a.score).slice(0, topN);
}
