export async function loadUserCases() {
  const response = await fetch("/api/cases-list");

  if (!response.ok) {
    throw new Error("Failed to load saved cases");
  }

  const data = await response.json();
  return Array.isArray(data.cases) ? data.cases : [];
}

export async function saveUserCase(newCase) {
  const response = await fetch("/api/cases-add", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ case: newCase }),
  });

  if (!response.ok) {
    throw new Error("Failed to save case");
  }

  const data = await response.json();
  return data.case;
}
