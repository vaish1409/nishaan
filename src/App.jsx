import { useState, useEffect, useMemo, useRef } from "react";
import { BookOpen, MessageCircle, Plus } from "lucide-react";
import { SEED_CASES } from "./data/cases.js";
import { loadUserCases, saveUserCase } from "./lib/storage.js";
import CustomCursor from "./components/CustomCursor.jsx";
import Hero from "./components/Hero.jsx";
import Reveal from "./components/Reveal.jsx";
import BrowseView from "./components/BrowseView.jsx";
import AskView from "./components/AskView.jsx";
import SubmitView from "./components/SubmitView.jsx";

const TABS = [
  { key: "browse", label: "Browse cases", Icon: BookOpen },
  { key: "ask", label: "Ask about a situation", Icon: MessageCircle },
  { key: "submit", label: "Add a case", Icon: Plus },
];

export default function App() {
  const [tab, setTab] = useState("browse");
  const [userCases, setUserCases] = useState([]);
  const [ageFilter, setAgeFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [saving, setSaving] = useState(false);

  const tabRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    let cancelled = false;

    loadUserCases()
      .then(cases => {
        if (!cancelled) setUserCases(cases);
      })
      .catch(err => {
        console.error("Failed to load shared cases", err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const allCases = useMemo(() => [...SEED_CASES, ...userCases], [userCases]);

  useEffect(() => {
    const el = tabRefs.current[tab];
    if (el) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [tab, allCases.length]);

  useEffect(() => {
    function onResize() {
      const el = tabRefs.current[tab];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [tab]);

  async function handleAddCase(newCase) {
    setSaving(true);
    try {
      const savedCase = await saveUserCase(newCase);
      setUserCases(current => [savedCase, ...current]);
      return true;
    } catch (err) {
      console.error("Failed to save shared case", err);
      return false;
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="nishaan-root">
      <CustomCursor />

      <header className="app-header">
        <span className="brand-mark">Nishaan</span>
        <span className="brand-tagline">Case notes for parents figuring it out as they go</span>
      </header>

      <Hero caseCount={allCases.length} />

      <nav
        className="tabs"
        style={{ "--indicator-left": `${indicator.left}px`, "--indicator-width": `${indicator.width}px` }}
      >
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            ref={el => (tabRefs.current[key] = el)}
            className={`tab-btn ${tab === key ? "tab-active" : ""}`}
            onClick={() => setTab(key)}
            data-cursor="pointer"
          >
            <Icon size={15} /> {label}
          </button>
        ))}
        <span className="tab-indicator" aria-hidden="true" />
      </nav>

      <main className="app-main">
        <div key={tab} className="tab-panel-enter">
          {tab === "browse" && (
            <BrowseView
              cases={allCases}
              ageFilter={ageFilter}
              setAgeFilter={setAgeFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
            />
          )}
          {tab === "ask" && <AskView cases={allCases} />}
          {tab === "submit" && <SubmitView onAdd={handleAddCase} saving={saving} />}
        </div>
      </main>

      <Reveal as="footer" className="app-footer">
        Prototype only — case notes are illustrative, not verified expert advice. If a child's safety is at risk,
        call CHILDLINE <strong>1098</strong>.
      </Reveal>
    </div>
  );
}
