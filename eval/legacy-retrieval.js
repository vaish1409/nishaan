const STOPWORDS = new Set(["the", "and", "for", "with", "that", "this", "have", "has", "was", "were", "are", "his", "her", "she", "him", "when", "what", "how", "does", "did", "not", "but", "you", "your", "yourself", "about", "into", "than", "then", "just", "only", "also", "from", "they", "them", "their", "been", "being", "who", "whom", "which", "would", "could", "should", "will", "shall", "can", "cant", "dont", "didnt", "wont", "wasnt", "isnt", "its", "our", "out", "off", "own", "yours", "itself", "because", "while", "after", "before", "again", "more", "most", "some", "such", "very", "really", "every", "each"]);

export function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w));
}

function scoreCase(c, tokens, ageFilter) {
  let score = 0;
  const haystack = tokenize([c.category, c.situation, c.tried, c.outcome].join(" "));
  tokens.forEach(t => {
    if (haystack.includes(t)) score += 1;
  });
  (c.tags || []).forEach(tag => {
    const tagLower = tag.toLowerCase();
    if (tokens.some(t => tagLower.includes(t) || t.includes(tagLower))) score += 2;
  });
  if (ageFilter && c.age === ageFilter) score += 1.5;
  return score;
}

export function retrieveTopMatches(query, ageFilter, cases, topN = 3) {
  const tokens = tokenize(query);
  const scored = cases.map(c => ({ ...c, score: scoreCase(c, tokens, ageFilter) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.filter(c => c.score > 0).slice(0, topN);
}
