import { BAND_LABELS, OUTCOME_META } from "../data/cases.js";

export default function CaseCard({ c, delay = 0 }) {
  const meta = OUTCOME_META[c.outcomeType] || OUTCOME_META.mixed;
  return (
    <div
      className="case-card"
      style={{ animationDelay: `${delay}ms`, "--outcome-color": meta.color }}
      data-cursor="pointer"
    >
      <div className="case-card-top">
        <span className="case-id">{c.id}</span>
        <span className="case-age">{BAND_LABELS[c.age] || c.age}</span>
      </div>
      <div className="case-category">{c.category}</div>
      <p className="case-text"><strong>Situation — </strong>{c.situation}</p>
      <p className="case-text"><strong>Tried — </strong>{c.tried}</p>
      <p className="case-text"><strong>Outcome — </strong>{c.outcome}</p>
      <div className="case-outcome-row">
        <span className="outcome-dot" style={{ background: meta.color }} />
        <span className="outcome-label">{meta.label}</span>
      </div>
    </div>
  );
}
