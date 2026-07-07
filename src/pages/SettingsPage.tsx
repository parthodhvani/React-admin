import { useState } from "react";
import { useDashboardStore } from "../store/useDashboardStore";

const accentOptions = ["blue", "violet", "emerald", "orange"];

export function SettingsPage() {
  const theme = useDashboardStore((state) => state.theme);
  const toggleTheme = useDashboardStore((state) => state.toggleTheme);

  const [accent, setAccent] = useState(localStorage.getItem("nova-accent") || "blue");
  const [language, setLanguage] = useState(localStorage.getItem("nova-language") || "en");
  const [layout, setLayout] = useState(localStorage.getItem("nova-layout") || "comfortable");
  const [animationSpeed, setAnimationSpeed] = useState(localStorage.getItem("nova-motion") || "normal");

  const persist = (key: string, value: string, setter: (value: string) => void) => {
    localStorage.setItem(key, value);
    setter(value);
  };

  return (
    <section className="glass soft-card rounded-3xl p-6">
      <h1 className="gradient-text text-3xl font-semibold">Settings</h1>
      <p className="mt-2 text-slate-600">Control appearance, language, layout, and motion preferences.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white/70 p-4">
          <p className="text-sm font-semibold text-slate-800">Theme</p>
          <button onClick={toggleTheme} className="mt-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-700">
            Toggle ({theme})
          </button>
        </div>

        <div className="rounded-2xl bg-white/70 p-4">
          <p className="text-sm font-semibold text-slate-800">Accent</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {accentOptions.map((option) => (
              <button
                key={option}
                onClick={() => persist("nova-accent", option, setAccent)}
                className={`rounded-full px-3 py-1 text-xs ${accent === option ? "bg-blue-600 text-white" : "bg-white text-slate-600"}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white/70 p-4">
          <p className="text-sm font-semibold text-slate-800">Language</p>
          <select value={language} onChange={(event) => persist("nova-language", event.target.value, setLanguage)} className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>

        <div className="rounded-2xl bg-white/70 p-4">
          <p className="text-sm font-semibold text-slate-800">Layout</p>
          <select value={layout} onChange={(event) => persist("nova-layout", event.target.value, setLayout)} className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="comfortable">Comfortable</option>
            <option value="compact">Compact</option>
            <option value="wide">Wide</option>
          </select>
        </div>

        <div className="rounded-2xl bg-white/70 p-4 md:col-span-2">
          <p className="text-sm font-semibold text-slate-800">Animation Speed</p>
          <select value={animationSpeed} onChange={(event) => persist("nova-motion", event.target.value, setAnimationSpeed)} className="mt-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
          </select>
        </div>
      </div>
    </section>
  );
}
