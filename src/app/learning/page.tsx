"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { careers } from "@/data/careers";
import { useAppStore } from "@/store/useAppStore";
import { XP_PER_MILESTONE } from "@/lib/constants";
import {
  MagnifyingGlassIcon,
  ClockIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckSolid } from "@heroicons/react/24/solid";
import { FaHtml5, FaJs, FaReact, FaCss3Alt, FaPython, FaNodeJs } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import { ComputerDesktopIcon, RocketLaunchIcon, ServerIcon, CodeBracketIcon } from "@heroicons/react/24/solid";

type Stage = "all" | "beginner" | "intermediate" | "advanced";
type StatusFilter = "all" | "completed" | "in-progress" | "not-started";

function getIconCfg(title: string, skills: string[]) {
  const all = (title + " " + skills.join(" ")).toLowerCase();
  if (all.includes("html")) return { Icon: FaHtml5, isRI: true, color: "#e34c26", bg: "rgba(227,76,38,0.15)" };
  if (all.includes("javascript") || all.includes("dom")) return { Icon: FaJs, isRI: true, color: "#f0c400", bg: "rgba(240,196,0,0.15)" };
  if (all.includes("react")) return { Icon: FaReact, isRI: true, color: "#61dafb", bg: "rgba(97,218,251,0.15)" };
  if (all.includes("typescript")) return { Icon: SiTypescript, isRI: true, color: "#3178c6", bg: "rgba(49,120,198,0.15)" };
  if (all.includes("python")) return { Icon: FaPython, isRI: true, color: "#3776ab", bg: "rgba(55,118,171,0.15)" };
  if (all.includes("node") || all.includes("backend")) return { Icon: FaNodeJs, isRI: true, color: "#68a063", bg: "rgba(104,160,99,0.15)" };
  if (all.includes("css")) return { Icon: FaCss3Alt, isRI: true, color: "#264de4", bg: "rgba(38,77,228,0.15)" };
  if (all.includes("responsive")) return { Icon: ComputerDesktopIcon, isRI: false, color: "#a855f7", bg: "rgba(168,85,247,0.15)" };
  if (all.includes("performance")) return { Icon: RocketLaunchIcon, isRI: false, color: "#f59e0b", bg: "rgba(245,158,11,0.15)" };
  if (all.includes("api") || all.includes("state")) return { Icon: ServerIcon, isRI: false, color: "#14b8a6", bg: "rgba(20,184,166,0.15)" };
  return { Icon: CodeBracketIcon, isRI: false, color: "#6E58FF", bg: "rgba(110,88,255,0.15)" };
}

const stageColors: Record<string, { color: string; bg: string }> = {
  beginner:     { color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  intermediate: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  advanced:     { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
};

export default function LearningPage() {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<Stage>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const progress = useAppStore((s) => s.progress);

  const allNodes = useMemo(() => {
    const rows: {
      nodeId: string; careerId: string; careerTitle: string;
      title: string; skills: string[]; description: string;
      stage: "beginner" | "intermediate" | "advanced";
      estimatedTime?: string;
      milestones: number; done: number; status: "completed" | "in-progress" | "not-started";
    }[] = [];
    careers.forEach(career => {
      (["beginner", "intermediate", "advanced"] as const).forEach(s => {
        career.roadmap[s].forEach((node) => {
          const key = `${career.id}__${node.id}`;
          const doneMs = (progress[key] ?? []).length;
          const totalMs = node.milestones.length;
          const status = doneMs >= totalMs && totalMs > 0 ? "completed" : doneMs > 0 ? "in-progress" : "not-started";
          rows.push({
            nodeId: node.id, careerId: career.id, careerTitle: career.title,
            title: node.title, skills: node.skills, description: node.description ?? "",
            stage: s, estimatedTime: (node as any).estimatedTime,
            milestones: totalMs, done: doneMs, status,
          });
        });
      });
    });
    return rows;
  }, [progress]);

  const filtered = useMemo(() => allNodes.filter(n => {
    if (stage !== "all" && n.stage !== stage) return false;
    if (statusFilter !== "all" && n.status !== statusFilter) return false;
    if (query && !n.title.toLowerCase().includes(query.toLowerCase()) && !n.skills.join(" ").toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }), [allNodes, stage, statusFilter, query]);

  const totalMilestoneDone = allNodes.reduce((s, n) => s + n.done, 0);
  const stats = {
    total:      allNodes.length,
    completed:  allNodes.filter(n => n.status === "completed").length,
    inProgress: allNodes.filter(n => n.status === "in-progress").length,
    xp:         totalMilestoneDone * XP_PER_MILESTONE,  // matches Topbar & store
  };

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 className="text-4xl font-bold" style={{ background: "linear-gradient(135deg,#60a5fa,#818cf8,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 8 }}>
            Learning Hub
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 15 }}>Pick up where you left off or start something new.</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Total Modules",       value: stats.total,                          color: "#6E58FF", emoji: "📚" },
            { label: "Modules Done",         value: stats.completed,                      color: "#22c55e", emoji: "✅" },
            { label: "In Progress",          value: stats.inProgress,                     color: "#f59e0b", emoji: "🔥" },
            { label: "XP Earned",            value: `${stats.xp.toLocaleString()} XP`,   color: "#f59e0b", emoji: "⚡" },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(10,16,32,0.65)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", borderRadius: 16, padding: "18px 20px" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.emoji}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 180px" }}>
            <MagnifyingGlassIcon style={{ width: 15, height: 15, color: "#64748b", position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search modules, skills…"
              style={{ width: "100%", padding: "10px 14px 10px 36px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
          </div>
          <div style={{ display: "flex", gap: 5, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 4 }}>
            {(["all","beginner","intermediate","advanced"] as Stage[]).map(s => (
              <button key={s} onClick={() => setStage(s)}
                style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize",
                  background: stage === s ? "rgba(110,88,255,0.2)" : "transparent",
                  color: stage === s ? "#a78bfa" : "#64748b",
                  border: stage === s ? "1px solid rgba(110,88,255,0.3)" : "1px solid transparent" }}>
                {s === "all" ? "All Stages" : s}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 5, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 4 }}>
            {([{id:"all",l:"All"},{id:"completed",l:"✅ Done"},{id:"in-progress",l:"🔥 Active"},{id:"not-started",l:"⬜ Not Started"}] as {id:StatusFilter;l:string}[]).map(f => (
              <button key={f.id} onClick={() => setStatusFilter(f.id)}
                style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                  background: statusFilter === f.id ? "rgba(255,255,255,0.08)" : "transparent",
                  color: statusFilter === f.id ? "white" : "#64748b", border: "1px solid transparent" }}>
                {f.l}
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
          Showing <span style={{ color: "white", fontWeight: 700 }}>{filtered.length}</span> of {allNodes.length} modules
        </div>

        {/* Module grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
          {filtered.map((node, i) => {
            const { Icon, isRI, color, bg } = getIconCfg(node.title, node.skills);
            const sc = stageColors[node.stage];
            const pct = node.milestones > 0 ? Math.round((node.done / node.milestones) * 100) : 0;
            const isDone      = node.status === "completed";
            const isActive    = node.status === "in-progress";

            return (
              <motion.div key={`${node.careerId}-${node.nodeId}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.025, 0.1) }}>
                <Link href={`/learn/${node.nodeId}`} style={{ textDecoration: "none", display: "block" }}>
                  <div style={{
                    background: "rgba(10,16,32,0.65)",
                    border: `1px solid ${isDone ? "rgba(34,197,94,0.25)" : isActive ? `${color}30` : "rgba(255,255,255,0.08)"}`,
                    backdropFilter: "blur(16px)", borderRadius: 18, padding: 20, cursor: "pointer", transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = `${color}50`; el.style.transform = "translateY(-2px)"; el.style.boxShadow = `0 8px 30px ${color}15`; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = isDone ? "rgba(34,197,94,0.25)" : isActive ? `${color}30` : "rgba(255,255,255,0.08)"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 13, background: bg, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {isRI ? <Icon size={22} color={color} /> : <Icon style={{ width: 22, height: 22, color }} />}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 99, background: sc.bg, color: sc.color, textTransform: "capitalize" }}>{node.stage}</span>
                        {isDone
                          ? <CheckSolid style={{ width: 17, height: 17, color: "#22c55e" }} />
                          : <PlayCircleIcon style={{ width: 17, height: 17, color: isActive ? "#6E58FF" : "#334155" }} />}
                      </div>
                    </div>

                    <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 3 }}>{node.title}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>{node.careerTitle}</div>

                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
                      {node.skills.slice(0, 3).map(s => (
                        <span key={s} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#94a3b8" }}>{s}</span>
                      ))}
                      {node.skills.length > 3 && <span style={{ fontSize: 10, color: "#475569" }}>+{node.skills.length - 3} more</span>}
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 11, color: "#64748b" }}>{node.done}/{node.milestones} milestones</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: isDone ? "#22c55e" : color }}>{pct}%</span>
                      </div>
                      <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.06)" }}>
                        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: isDone ? "#22c55e" : `linear-gradient(90deg,${color},${color}80)`, transition: "width 0.5s" }} />
                      </div>
                    </div>

                    {node.estimatedTime && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10, fontSize: 11, color: "#64748b" }}>
                        <ClockIcon style={{ width: 12, height: 12 }} /> {node.estimatedTime}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#94a3b8" }}>No modules found</div>
            <div style={{ fontSize: 13, color: "#475569", marginTop: 6 }}>Try adjusting your filters or search query.</div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
