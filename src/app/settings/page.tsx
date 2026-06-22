"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { careers } from "@/data/careers";
import { useAppStore } from "@/store/useAppStore";
import type { LearningPace, AppTheme } from "@/types/app";
import {
  UserCircleIcon,
  AcademicCapIcon,
  BoltIcon,
  SwatchIcon,
  TrashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const paceOptions: { id: LearningPace; label: string; desc: string; color: string }[] = [
  { id: "fast",     label: "⚡ Fast",     desc: "1–2 hours/day. Push hard, move quickly.",    color: "#f59e0b" },
  { id: "balanced", label: "🎯 Balanced", desc: "30–60 min/day. Steady, sustainable pace.",   color: "#6E58FF" },
  { id: "slow",     label: "🌱 Slow",     desc: "15–30 min/day. Learn at your own rhythm.",   color: "#22c55e" },
];

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel">
      <div className="section-header">
        <div className="icon-container">
          <Icon className="icon-sm icon-brand" />
        </div>
        <h2 className="section-title">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const settings       = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const clearAllData   = useAppStore((s) => s.clearAllData);

  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [goal,  setGoal]  = useState("frontend-developer");
  const [pace,  setPace]  = useState<LearningPace>("balanced");
  const [theme, setTheme] = useState<AppTheme>("dark");
  const [saved, setSaved] = useState(false);

  // Populate form from Zustand after client hydration
  useEffect(() => {
    if (settings.name)  setName(settings.name);
    if (settings.email) setEmail(settings.email);
    if (settings.goal)  setGoal(settings.goal);
    if (settings.pace)  setPace(settings.pace);
    if (settings.theme) setTheme(settings.theme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function save() {
    updateSettings({ name, email, goal, pace, theme });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleClearData() {
    if (typeof window === "undefined") return;
    const confirmed = window.confirm("This will delete all your progress and saved careers. Are you sure?");
    if (!confirmed) return;
    clearAllData();
    window.location.reload();
  }

  function applyTheme(t: AppTheme) {
    setTheme(t);
    document.documentElement.classList.toggle("light", t === "light");
  }

  const displayName = name || "User";

  return (
    <div className="page-container-sm">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>

        <div className="page-header">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your profile, learning preferences, and app settings.</p>
        </div>

        <div className="stack-lg">

          {/* Profile */}
          <Section icon={UserCircleIcon} title="Profile">
            <div className="profile-preview">
              <div className="avatar-lg">
                {displayName[0]?.toUpperCase() ?? "U"}
              </div>
              <div>
                <div className="profile-name">{displayName}</div>
                <div className="profile-meta">Career Growth Tracker</div>
              </div>
            </div>

            <div className="stack-md">
              <div>
                <label className="field-label">Display Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field-input"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="field-label">Email Address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field-input"
                  placeholder="you@example.com"
                  type="email"
                />
              </div>
            </div>
          </Section>

          {/* Career Goal */}
          <Section icon={AcademicCapIcon} title="Career Goal">
            <div>
              <label className="field-label">Target Career Path</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="field-input field-select"
              >
                {careers.map((c) => (
                  <option key={c.id} value={c.id} style={{ background: "#0a1020" }}>{c.title}</option>
                ))}
              </select>
            </div>
            <p className="goal-description">
              {careers.find((c) => c.id === goal)?.description}
            </p>
            <div className="skill-chips">
              {(careers.find((c) => c.id === goal)?.skills ?? []).slice(0, 4).map((s) => (
                <span key={s} className="badge badge-brand">{s}</span>
              ))}
            </div>
          </Section>

          {/* Learning Pace */}
          <Section icon={BoltIcon} title="Learning Pace">
            <div className="stack-sm">
              {paceOptions.map((opt) => {
                const isSelected = pace === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setPace(opt.id)}
                    className={`pace-option${isSelected ? " selected" : ""}`}
                    style={isSelected ? {
                      background: `${opt.color}10`,
                      borderColor: `${opt.color}35`,
                    } : {}}
                  >
                    <div>
                      <div className="pace-label">{opt.label}</div>
                      <div className="pace-desc">{opt.desc}</div>
                    </div>
                    {isSelected && <CheckCircleIcon style={{ width: 18, height: 18, color: opt.color, flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Theme */}
          <Section icon={SwatchIcon} title="Appearance">
            <div className="theme-grid">
              {(["dark", "light"] as const).map((t) => {
                const isSelected = theme === t;
                return (
                  <button
                    key={t}
                    onClick={() => applyTheme(t)}
                    className={`theme-option${isSelected ? " selected" : ""}`}
                  >
                    <div className="theme-emoji">{t === "dark" ? "🌙" : "☀️"}</div>
                    <div className={`theme-label${isSelected ? " active" : ""}`}>{t === "dark" ? "Dark Mode" : "Light Mode"}</div>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Danger zone */}
          <div className="danger-zone">
            <div className="danger-zone-header">
              <TrashIcon className="icon-sm icon-danger" />
              <h2 className="section-title">Danger Zone</h2>
            </div>
            <p className="danger-desc">
              Permanently delete all your learning progress, saved careers, and preferences. This cannot be undone.
            </p>
            <button onClick={handleClearData} className="btn btn-danger">
              <TrashIcon className="icon-xs" /> Clear All Data
            </button>
          </div>

          {/* Save button */}
          <div className="save-row">
            <button
              onClick={save}
              className={`btn btn-save${saved ? " saved" : ""}`}
            >
              {saved ? <><CheckCircleIcon className="icon-sm" /> Saved!</> : "Save Settings"}
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
