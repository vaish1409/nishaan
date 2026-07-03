import { BANDS } from "../data/cases.js";

export default function AgeRuler({ selected, onToggle }) {
  const margin = 16;
  const gap = 6;
  const totalWidth = 768;
  const totalYears = BANDS.reduce((s, b) => s + b.years, 0);
  const availableWidth = totalWidth - margin * 2 - gap * (BANDS.length - 1);

  let cursor = margin;
  const rects = BANDS.map(b => {
    const w = (b.years / totalYears) * availableWidth;
    const r = { ...b, x: cursor, width: w };
    cursor += w + gap;
    return r;
  });

  return (
    <svg
      viewBox={`0 0 ${totalWidth} 108`}
      className="age-ruler-svg"
      role="group"
      aria-label="Filter by age"
    >
      <line x1={margin} y1={70} x2={totalWidth - margin} y2={70} stroke="var(--ink-light)" strokeWidth="1.5" />
      {rects.map(r => {
        const isSel = selected === r.key;
        const tickXs = Array.from({ length: r.years }, (_, i) => r.x + (r.width / r.years) * (i + 0.5));
        return (
          <g
            key={r.key}
            onClick={() => onToggle(r.key)}
            style={{ cursor: "pointer" }}
            data-cursor="pointer"
            role="button"
            tabIndex={0}
            aria-pressed={isSel}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggle(r.key);
              }
            }}
          >
            <rect
              x={r.x}
              y={30}
              width={r.width}
              height={62}
              rx={4}
              fill={isSel ? "var(--turmeric-soft)" : "transparent"}
              stroke={isSel ? "var(--turmeric)" : "transparent"}
              strokeWidth="1.5"
            />
            {tickXs.map((x, i) => (
              <line key={i} x1={x} y1={60} x2={x} y2={80} stroke={isSel ? "var(--ink)" : "var(--ink-light)"} strokeWidth="2" />
            ))}
            <text x={r.x + r.width / 2} y={22} textAnchor="middle" className="ruler-name" fill={isSel ? "var(--ink)" : "var(--ink-mid)"}>
              {r.name}
            </text>
            <text x={r.x + r.width / 2} y={98} textAnchor="middle" className="ruler-range">
              {r.range} yrs
            </text>
          </g>
        );
      })}
    </svg>
  );
}
