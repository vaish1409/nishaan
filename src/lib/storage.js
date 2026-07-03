const KEY = "nishaan_user_cases";

// This uses localStorage, so submissions are only visible in the browser
// that made them, not shared across everyone who visits the deployed site.
// That keeps the project deployable with zero extra services.
//
// To make submissions shared across every visitor, swap the two functions
// below for calls to a real backend — e.g. Vercel KV, Upstash Redis, or a
// Supabase table — behind a couple of small /api routes (api/cases-list.js,
// api/cases-add.js) that this file calls with fetch() instead of touching
// localStorage. Nothing else in the app needs to change, since every
// component only ever calls loadUserCases() / saveUserCases().

export function loadUserCases() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load saved cases", e);
    return [];
  }
}

export function saveUserCases(cases) {
  try {
    localStorage.setItem(KEY, JSON.stringify(cases));
    return true;
  } catch (e) {
    console.error("Failed to save cases", e);
    return false;
  }
}
