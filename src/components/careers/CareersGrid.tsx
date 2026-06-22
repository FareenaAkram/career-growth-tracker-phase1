"use client";

import Link from "next/link";
import { memo, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CodeBracketIcon, ComputerDesktopIcon, ServerStackIcon, CircleStackIcon,
  DevicePhoneMobileIcon, CloudIcon, MagnifyingGlassIcon, ArrowRightIcon,
  BriefcaseIcon, UserGroupIcon, ChartBarIcon, ClockIcon,
} from "@heroicons/react/24/outline";
import { careers as allCareers, type Career } from "@/data/careers";
import { CATEGORY_THEME } from "@/lib/constants";
import { formatSalaryRange, matchesSearch, hexToRgb } from "@/lib/utils";

/* ── helpers ──────────────────────────────── */
// Re-exported from shared lib so this file stays DRY
type Theme = (typeof CATEGORY_THEME)[string];
const CAT = CATEGORY_THEME;
const DEFAULT_THEME = CAT.Engineering;

/* ── icon per career title ───────────────── */
function CareerIcon({ title }: { title: string }) {
  const l = title.toLowerCase();
  const s = { width: 22, height: 22, color: "white" };
  if (l.includes("frontend"))              return <ComputerDesktopIcon style={s} />;
  if (l.includes("backend"))              return <ServerStackIcon style={s} />;
  if (l.includes("full"))                 return <CircleStackIcon style={s} />;
  if (l.includes("mobile"))              return <DevicePhoneMobileIcon style={s} />;
  if (l.includes("devops")||l.includes("cloud")) return <CloudIcon style={s} />;
  if (l.includes("data"))                return <ChartBarIcon style={s} />;
  return <CodeBracketIcon style={s} />;
}

const CATEGORIES = ["All", "Engineering", "Data", "Design", "Healthcare"];

/* ── career card (memoized — only re-renders when career data changes) ── */
const CareerCard = memo(function CareerCard({ career }: { career: Career }) {
  const [hovered, setHovered] = useState(false);
  const theme = CAT[career.category] ?? DEFAULT_THEME;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", display: "flex", flexDirection: "column", gap: 16,
        background: "rgba(10,16,32,0.72)",
        border: `1px solid ${hovered ? theme.border : "rgba(255,255,255,0.06)"}`,
        borderRadius: 20, padding: "22px", height: "100%", boxSizing: "border-box",
        backdropFilter: "blur(14px)",
        transition: "all 0.26s ease",
        transform: hovered ? "translateY(-5px)" : "none",
        boxShadow: hovered
          ? `0 20px 60px rgba(0,0,0,0.45), 0 0 40px ${theme.glow}`
          : "0 4px 24px rgba(0,0,0,0.22)",
        overflow: "hidden", cursor: "pointer",
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 120,
        background: `radial-gradient(ellipse at 50% -10%, ${theme.glow.replace("0.28","0.1")}, transparent 75%)`,
        pointerEvents: "none", opacity: hovered ? 1 : 0.5, transition: "opacity 0.3s",
      }} />
      {/* Gradient border shimmer */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 20, pointerEvents: "none",
        background: `linear-gradient(135deg, ${theme.glow.replace("0.28","0.07")}, transparent 60%)`,
        opacity: hovered ? 1 : 0, transition: "opacity 0.3s",
      }} />

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, position: "relative" }}>
        <div style={{
          width: 46, height: 46, borderRadius: 13, flexShrink: 0,
          background: theme.gradient,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 6px 20px ${theme.glow}`,
        }}>
          <CareerIcon title={career.title} />
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, marginTop: 2,
          background: theme.pill, border: `1px solid ${theme.border}`,
          color: theme.accent, letterSpacing: "0.05em",
        }}>{career.category}</span>
      </div>

      {/* Text */}
      <div style={{ position: "relative" }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "white", margin: "0 0 6px", lineHeight: 1.3 }}>
          {career.title}
        </h2>
        <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
          {career.description.length > 96 ? career.description.slice(0, 96) + "…" : career.description}
        </p>
      </div>

      {/* Skills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, position: "relative" }}>
        {career.skills.slice(0, 4).map(skill => (
          <span key={skill} style={{
            fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8",
          }}>{skill}</span>
        ))}
        {career.skills.length > 4 && (
          <span style={{ fontSize: 10, color: "#334155", padding: "3px 6px" }}>+{career.skills.length - 4} more</span>
        )}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: "auto", paddingTop: 14,
        borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "relative",
      }}>
        <div>
          <div style={{ fontSize: 10, color: "#334155", marginBottom: 3 }}>Typical Salary</div>
          <div style={{ fontSize: 14, fontWeight: 800, background: theme.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {formatSalaryRange(career.salaryRange.min, career.salaryRange.max)}
          </div>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600,
          color: hovered ? "white" : "#475569", transition: "color 0.2s",
        }}>
          View roadmap
          <ArrowRightIcon style={{ width: 13, height: 13, transform: hovered ? "translateX(3px)" : "none", transition: "transform 0.22s" }} />
        </div>
      </div>
    </div>
  );
}); // end memo(CareerCard)

/* ── stat chip ───────────────────────────── */
function StatChip({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  const rgb = hexToRgb(color);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 38, height: 38, borderRadius: 11, flexShrink: 0,
        background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.2)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon style={{ width: 16, height: 16, color }} />
      </div>
      <div>
        <div style={{ fontSize: 19, fontWeight: 800, color: "white", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

/* ── main component ───────────────────────── */
export default function CareersGrid() {
  const [query,    setQuery]    = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => allCareers.filter((c) => {
    if (category !== "All" && c.category !== category) return false;
    return matchesSearch(`${c.title} ${c.description} ${c.skills.join(" ")}`, query);
  }), [query, category]);

  const clearFilters = useCallback(() => { setQuery(""); setCategory("All"); }, []);

  const avgSalary = Math.round(
    allCareers.reduce((s, c) => s + (c.salaryRange.min + c.salaryRange.max) / 2, 0) / allCareers.length / 1000
  );

  return (
    <div style={{ maxWidth: 1160, margin: "0 auto" }}>

      {/* ── Hero ── */}
      <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 40 }}>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 99, background: "rgba(110,88,255,0.08)", border: "1px solid rgba(110,88,255,0.22)", marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6E58FF", boxShadow: "0 0 8px #6E58FF", flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#a78bfa" }}>Career Intelligence Platform</span>
        </div>

        <h1 style={{ fontSize: "clamp(32px,5vw,58px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.06, margin: "0 0 14px" }}>
          Explore{" "}
          <span style={{ background: "linear-gradient(90deg,#6E58FF,#2DD4BF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Career Paths
          </span>
        </h1>
        <p style={{ fontSize: 15, color: "#475569", maxWidth: 500, lineHeight: 1.75, margin: 0 }}>
          Discover structured roadmaps, required skills, and real salary data for <strong style={{ color: "#64748b" }}>{allCareers.length}</strong> in-demand tech careers.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 32px", marginTop: 28 }}>
          <StatChip icon={BriefcaseIcon}  label="Career Paths"  value={String(allCareers.length)} color="#6E58FF" />
          <StatChip icon={ChartBarIcon}   label="Avg Salary"    value={`$${avgSalary}k`}           color="#2DD4BF" />
          <StatChip icon={UserGroupIcon}  label="Categories"    value="4"                          color="#f59e0b" />
          <StatChip icon={ClockIcon}      label="Avg Duration"  value="9 mo"                       color="#ec4899" />
        </div>
      </motion.div>

      {/* ── Filters ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.13 }} style={{ marginBottom: 32, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: 460 }}>
          <MagnifyingGlassIcon style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#334155" }} />
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search careers, skills, tools…"
            style={{
              width: "100%", height: 48, paddingLeft: 44, paddingRight: 16, borderRadius: 14,
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              color: "white", fontSize: 14, outline: "none", fontFamily: "inherit",
              transition: "border-color 0.2s, box-shadow 0.2s", boxSizing: "border-box",
            }}
            onFocus={e => { e.target.style.borderColor = "rgba(110,88,255,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(110,88,255,0.08)"; }}
            onBlur={e  => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          {CATEGORIES.map(cat => {
            const active = category === cat;
            const theme  = cat === "All" ? DEFAULT_THEME : (CAT[cat] ?? DEFAULT_THEME);
            const count  = cat === "All" ? allCareers.length : allCareers.filter(c => c.category === cat).length;
            return (
              <button key={cat} onClick={() => setCategory(cat)}
                style={{
                  padding: "7px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  border: active ? `1px solid ${theme.border}` : "1px solid rgba(255,255,255,0.07)",
                  background: active ? theme.pill : "rgba(255,255,255,0.03)",
                  color: active ? theme.accent : "#475569",
                  transition: "all 0.18s", fontFamily: "inherit",
                }}>
                {cat}
                <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.6 }}>({count})</span>
              </button>
            );
          })}
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#334155" }}>
            {filtered.length} path{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </motion.div>

      {/* ── Grid ── */}
      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#64748b" }}>No careers found</div>
            <div style={{ fontSize: 14, color: "#334155", marginTop: 8 }}>Try a different search or category</div>
            <button onClick={clearFilters}
              style={{ marginTop: 20, padding: "9px 22px", borderRadius: 10, background: "rgba(110,88,255,0.1)", border: "1px solid rgba(110,88,255,0.22)", color: "#a78bfa", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Clear filters
            </button>
          </motion.div>
        ) : (
          <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,300px),1fr))" }}>
            {filtered.map((career, i) => (
              <motion.div key={career.id}
                initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.28, delay: Math.min(i * 0.025, 0.1) }} layout
              >
                <Link href={`/careers/${career.id}`} style={{ display: "block", textDecoration: "none", height: "100%" }}>
                  <CareerCard career={career} />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
