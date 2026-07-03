import { useState } from "react";
import { Plus } from "lucide-react";
import { BANDS, CATEGORIES } from "../data/cases.js";

const EMPTY_FORM = { age: "", category: "", situation: "", tried: "", outcome: "", outcomeType: "mixed", tags: "" };

export default function SubmitView({ onAdd, saving }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [savedMsg, setSavedMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  function update(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setSavedMsg("");

    if (!form.age || !form.category || !form.situation.trim() || !form.tried.trim() || !form.outcome.trim()) {
      setErrorMsg("Fill in the age, topic, situation, what you tried, and the outcome — those are what make a case useful to someone else.");
      return;
    }

    const tags = form.tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
    const newCase = {
      id: `user-${Date.now()}`,
      age: form.age,
      category: form.category,
      situation: form.situation.trim(),
      tried: form.tried.trim(),
      outcome: form.outcome.trim(),
      outcomeType: form.outcomeType,
      tags,
    };

    const ok = await onAdd(newCase);
    if (ok) {
      setSavedMsg("Added — saved in this browser so it'll be here next time you visit.");
      setForm(EMPTY_FORM);
    } else {
      setErrorMsg("Couldn't save that just now — please try again.");
    }
  }

  return (
    <form className="submit-form" onSubmit={handleSubmit}>
      <div className="field-row">
        <label className="field-label">
          Age
          <select className="select" value={form.age} onChange={e => update("age", e.target.value)}>
            <option value="">Select age</option>
            {BANDS.map(b => (
              <option key={b.key} value={b.key}>
                {b.name} ({b.range})
              </option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Topic
          <select className="select" value={form.category} onChange={e => update("category", e.target.value)}>
            <option value="">Select topic</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field-label">
        Situation
        <textarea className="textarea" rows={2} value={form.situation} onChange={e => update("situation", e.target.value)} placeholder="What happened?" />
      </label>

      <label className="field-label">
        What you tried
        <textarea className="textarea" rows={2} value={form.tried} onChange={e => update("tried", e.target.value)} placeholder="What did you actually do?" />
      </label>

      <label className="field-label">
        Outcome
        <textarea className="textarea" rows={2} value={form.outcome} onChange={e => update("outcome", e.target.value)} placeholder="What happened after — did it help?" />
      </label>

      <div className="field-row">
        <label className="field-label">
          Did it help?
          <select className="select" value={form.outcomeType} onChange={e => update("outcomeType", e.target.value)}>
            <option value="worked">Worked well</option>
            <option value="mixed">Mixed results</option>
            <option value="backfired">Didn't help</option>
          </select>
        </label>
        <label className="field-label">
          Tags (optional)
          <input className="text-input" value={form.tags} onChange={e => update("tags", e.target.value)} placeholder="bedtime, tablet, tantrum" />
        </label>
      </div>

      {errorMsg && <div className="error-panel">{errorMsg}</div>}
      {savedMsg && <div className="saved-note">{savedMsg}</div>}

      <button className="btn-primary" type="submit" disabled={saving} data-cursor="pointer">
        <Plus size={16} /> Add this case
      </button>
      <p className="storage-note">Stored in this browser only for now — see the README for how to make it shared.</p>
    </form>
  );
}
