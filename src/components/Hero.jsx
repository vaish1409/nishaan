import { BANDS } from "../data/cases.js";

// Heights loosely echo the age bands getting "taller" left to right —
// literally the pencil marks on a doorframe this app is named after.
const MARKS = [18, 26, 34, 44, 56, 66, 80, 96];

export default function Hero({ caseCount }) {
  return (
    <section className="hero" aria-label="Nishaan introduction">
      <div className="hero-marks" aria-hidden="true">
        {MARKS.map((h, i) => (
          <span
            key={i}
            className="hero-mark"
            style={{
              "--h": `${h}px`,
              "--rot": `${(i % 2 === 0 ? -1 : 1) * (1 + (i % 3))}deg`,
              animationDelay: `${0.5 + i * 0.06}s`,
            }}
          />
        ))}
        <span className="hero-mark-line" />
      </div>

      <p className="hero-eyebrow">A doorframe, not a diagnosis</p>
      <h1 className="hero-title">
        Every parent
        <br />
        <em>measures</em> as they go.
      </h1>
      <p className="hero-sub">
        Nishaan — Hindi for &ldquo;mark,&rdquo; like the pencil lines tracking how tall a kid&rsquo;s gotten — is a
        case-note library built from real situations, not advice columns. Browse what other parents actually tried,
        or describe your own and get an answer grounded only in cases that match. Never invented.
      </p>

      <div className="hero-stats">
        <div className="hero-stat">
          <span className="hero-stat-num">{caseCount}</span>
          <span className="hero-stat-label">cases logged</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-num">{BANDS.length}</span>
          <span className="hero-stat-label">age bands</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-num">10</span>
          <span className="hero-stat-label">behaviour topics</span>
        </div>
      </div>
    </section>
  );
}
