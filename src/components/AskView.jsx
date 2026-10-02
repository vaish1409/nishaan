import { useState } from "react";
import { MessageCircle, AlertTriangle, Loader2 } from "lucide-react";
import { BANDS } from "../data/cases.js";
import { checkSafety } from "../lib/safety.js";
import { getGuidance } from "../lib/guidance.js";
import CaseCard from "./CaseCard.jsx";
import SafetyPanel from "./SafetyPanel.jsx";
import Reveal from "./Reveal.jsx";

export default function AskView({ cases }) {
  const [ageFilter, setAgeFilter] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle"); // idle | flagged | loading | done | error | none
  const [matches, setMatches] = useState([]);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit() {
    if (!query.trim()) return;

    // Instant client-side check (the server runs the same check again before any model call).
    if (checkSafety(query)) {
      setStatus("flagged");
      return;
    }

    setMatches([]);
    setResult(null);
    setStatus("loading");
    setErrorMsg("");

    try {
      // Retrieval, reranking and answer verification now happen on the server.
      const data = await getGuidance(query, ageFilter);

      if (data.status === "blocked") {
        setStatus("flagged");
      } else if (data.status === "none" || data.status === "ungrounded") {
        setStatus("none");
      } else if (data.status === "ok") {
        setResult(data);
        setMatches(data.sources || []);
        setStatus("done");
      } else {
        throw new Error("Unexpected response");
      }
    } catch (e) {
      setErrorMsg(
        e.status === 429
          ? "That's a lot of questions in a short time. Please wait a minute and try again."
          : "Couldn't reach the guidance model just now. Please try again in a moment."
      );
      setStatus("error");
    }
  }

  return (
    <div className="ask-panel">
      <div className="chip-row">
        <button className={`chip ${!ageFilter ? "chip-active" : ""}`} onClick={() => setAgeFilter(null)} data-cursor="pointer">
          Any age
        </button>
        {BANDS.map(b => (
          <button
            key={b.key}
            className={`chip ${ageFilter === b.key ? "chip-active" : ""}`}
            onClick={() => setAgeFilter(ageFilter === b.key ? null : b.key)}
            data-cursor="pointer"
          >
            {b.name}
          </button>
        ))}
      </div>

      <textarea
        className="textarea"
        rows={4}
        placeholder="e.g. My 8-year-old won't start homework unless I sit right next to her the whole time."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={!query.trim() || status === "loading"}
        data-cursor="pointer"
      >
        {status === "loading" ? (
          <>
            <Loader2 size={16} className="spin" /> Finding grounded cases…
          </>
        ) : (
          <>
            <MessageCircle size={16} /> Get grounded guidance
          </>
        )}
      </button>

      {status === "flagged" && <SafetyPanel />}

      {status === "none" && (
        <div className="empty-state" style={{ marginTop: 16 }}>
          No close match in the case library yet for this one. Consider adding it below once you've navigated it —
          that helps the next parent.
        </div>
      )}

      {status === "error" && <div className="error-panel">{errorMsg}</div>}

      {status === "done" && result && (
        <div className="result-panel">
          <div className="result-label">Grounded response</div>
          <p className="result-synthesis">{result.synthesis}</p>
          {Array.isArray(result.considerations) && result.considerations.length > 0 && (
            <ul className="result-considerations">
              {result.considerations.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          )}
          {result.consult_professional && (
            <div className="consult-note">
              <AlertTriangle size={14} /> This one might be worth bringing to a pediatrician or counselor too — case
              notes alone may not be enough here.
            </div>
          )}
          <div className="cited-label">Cases this drew from</div>
          <div className="case-grid">
            {matches.map((c, i) => (
              <Reveal key={c.id} delay={i * 60}>
                <CaseCard c={c} />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
