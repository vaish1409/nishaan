import { CATEGORIES } from "../data/cases.js";
import AgeRuler from "./AgeRuler.jsx";
import CaseCard from "./CaseCard.jsx";
import Reveal from "./Reveal.jsx";

export default function BrowseView({ cases, ageFilter, setAgeFilter, categoryFilter, setCategoryFilter }) {
  const filtered = cases.filter(
    c => (!ageFilter || c.age === ageFilter) && (!categoryFilter || c.category === categoryFilter)
  );

  return (
    <div>
      <Reveal>
        <AgeRuler selected={ageFilter} onToggle={k => setAgeFilter(ageFilter === k ? null : k)} />
      </Reveal>

      <Reveal delay={60} className="chip-row">
        <button
          className={`chip ${!categoryFilter ? "chip-active" : ""}`}
          onClick={() => setCategoryFilter(null)}
          data-cursor="pointer"
        >
          All topics
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`chip ${categoryFilter === cat ? "chip-active" : ""}`}
            onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
            data-cursor="pointer"
          >
            {cat}
          </button>
        ))}
      </Reveal>

      <div className="result-count">
        {filtered.length} case{filtered.length !== 1 ? "s" : ""}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">No cases match yet. Try widening the age or topic — or add one yourself.</div>
      ) : (
        <div className="case-grid">
          {filtered.map((c, i) => (
            <Reveal key={c.id} delay={Math.min(i, 10) * 45}>
              <CaseCard c={c} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
