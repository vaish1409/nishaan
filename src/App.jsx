import { useState, useEffect, useMemo } from "react";
import { BookOpen, MessageCircle, Plus } from "lucide-react";
import { SEED_CASES } from "./data/cases.js";
import { loadUserCases, saveUserCase } from "./lib/storage.js";
import CustomCursor from "./components/CustomCursor.jsx";
import BrowseView from "./components/BrowseView.jsx";
import AskView from "./components/AskView.jsx";
import SubmitView from "./components/SubmitView.jsx";

export default function App() {
  const [tab, setTab] = useState("browse");
  const [userCases, setUserCases] = useState([]);
  const [ageFilter, setAgeFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [saving, setSaving] = useState(false);

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

      <nav className="tabs">
        <button className={`tab-btn ${tab === "browse" ? "tab-active" : ""}`} onClick={() => setTab("browse")} data-cursor="pointer">
          <BookOpen size={15} /> Browse cases
        </button>
        <button className={`tab-btn ${tab === "ask" ? "tab-active" : ""}`} onClick={() => setTab("ask")} data-cursor="pointer">
          <MessageCircle size={15} /> Ask about a situation
        </button>
        <button className={`tab-btn ${tab === "submit" ? "tab-active" : ""}`} onClick={() => setTab("submit")} data-cursor="pointer">
          <Plus size={15} /> Add a case
        </button>
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

      <footer className="app-footer">
        Prototype only — case notes are illustrative, not verified expert advice. If a child's safety is at risk,
        call CHILDLINE <strong>1098</strong>.
      </footer>
    </div>
  );
}
