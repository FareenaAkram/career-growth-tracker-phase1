"use client";

import { useMemo, useState, useEffect } from "react";
import { careers, type RoadmapNode } from "@/data/careers";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { useAppStore } from "@/store/useAppStore";
import {
  ChevronRightIcon,
  LockClosedIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  ArrowPathIcon,
  FolderOpenIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, ComputerDesktopIcon, ServerIcon, RocketLaunchIcon, DevicePhoneMobileIcon, CodeBracketIcon } from "@heroicons/react/24/solid";
import { FaHtml5, FaJs, FaReact, FaCss3Alt, FaPython, FaNodeJs } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";

// ─── Types ────────────────────────────────────────────────────────────────────

const stages = ["beginner", "intermediate", "advanced"] as const;
type Stage = (typeof stages)[number];
type DetailTab = "overview" | "skills" | "resources" | "projects" | "notes";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeUnlocked(node: RoadmapNode, career: any, progress: Record<string, boolean>) {
  if (node.prerequisites && node.prerequisites.length > 0) {
    return node.prerequisites.every((p) => progress[p]);
  }
  for (const s of ["beginner", "intermediate", "advanced"] as const) {
    const stageNodes: RoadmapNode[] = career?.roadmap?.[s] ?? [];
    const idx = stageNodes.findIndex((n) => n.id === node.id);
    if (idx >= 0) {
      if (idx > 0) {
        const prev = stageNodes[idx - 1];
        return (prev.milestones ?? []).every((m) => progress[m.id]);
      }
      if (s === "beginner") return true;
      const prevStage = s === "intermediate" ? "beginner" : "intermediate";
      const prevNodes: RoadmapNode[] = career?.roadmap?.[prevStage] ?? [];
      return prevNodes.every((pn) => (pn.milestones ?? []).every((m) => progress[m.id]));
    }
  }
  return true;
}

// ─── Icon config ──────────────────────────────────────────────────────────────

type IconCfg = { Icon: any; isReactIcon: boolean; color: string; bg: string };

function getIconCfg(node: RoadmapNode): IconCfg {
  const t = node.title.toLowerCase();
  const s = node.skills.map((x) => x.toLowerCase()).join(" ");
  const all = t + " " + s;

  if (all.includes("html")) return { Icon: FaHtml5, isReactIcon: true, color: "#e34c26", bg: "rgba(227,76,38,0.18)" };
  if (all.includes("javascript") || all.includes("js basic") || all.includes("dom")) return { Icon: FaJs, isReactIcon: true, color: "#f0c400", bg: "rgba(240,196,0,0.18)" };
  if (all.includes("react")) return { Icon: FaReact, isReactIcon: true, color: "#61dafb", bg: "rgba(97,218,251,0.18)" };
  if (all.includes("typescript")) return { Icon: SiTypescript, isReactIcon: true, color: "#3178c6", bg: "rgba(49,120,198,0.18)" };
  if (all.includes("python")) return { Icon: FaPython, isReactIcon: true, color: "#3776ab", bg: "rgba(55,118,171,0.18)" };
  if (all.includes("node") || all.includes("backend") || all.includes("server")) return { Icon: FaNodeJs, isReactIcon: true, color: "#68a063", bg: "rgba(104,160,99,0.18)" };
  if (all.includes("css") && !all.includes("responsive")) return { Icon: FaCss3Alt, isReactIcon: true, color: "#264de4", bg: "rgba(38,77,228,0.18)" };
  if (all.includes("responsive") || all.includes("grid") || all.includes("flexbox")) return { Icon: ComputerDesktopIcon, isReactIcon: false, color: "#a855f7", bg: "rgba(168,85,247,0.18)" };
  if (all.includes("performance") || all.includes("architecture") || all.includes("scale")) return { Icon: RocketLaunchIcon, isReactIcon: false, color: "#f59e0b", bg: "rgba(245,158,11,0.18)" };
  if (all.includes("api") || all.includes("rest") || all.includes("state management")) return { Icon: ServerIcon, isReactIcon: false, color: "#14b8a6", bg: "rgba(20,184,166,0.18)" };
  if (all.includes("mobile")) return { Icon: DevicePhoneMobileIcon, isReactIcon: false, color: "#8b5cf6", bg: "rgba(139,92,246,0.18)" };
  return { Icon: CodeBracketIcon, isReactIcon: false, color: "#6E58FF", bg: "rgba(110,88,255,0.18)" };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NodeIcon({ node, size = 44 }: { node: RoadmapNode; size?: number }) {
  const cfg = getIconCfg(node);
  const Icon = cfg.Icon;
  const iconSize = Math.round(size * 0.52);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.27),
        background: cfg.bg,
        border: `1px solid ${cfg.color}30`,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {cfg.isReactIcon ? (
        <Icon size={iconSize} color={cfg.color} />
      ) : (
        <Icon style={{ width: iconSize, height: iconSize, color: cfg.color }} />
      )}
    </div>
  );
}

function CircularProgress({
  pct,
  locked = false,
  color,
  size = 52,
  strokeWidth = 4,
}: {
  pct: number;
  locked?: boolean;
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <svg width={size} height={size} style={{ display: "block", transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} fill="none" />
        {!locked && pct > 0 && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        )}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {locked ? (
          <LockClosedIcon style={{ width: 14, height: 14, color: "rgba(255,255,255,0.3)" }} />
        ) : (
          <span style={{ fontSize: 11, fontWeight: 700, color: "white", lineHeight: 1 }}>{pct}%</span>
        )}
      </div>
    </div>
  );
}

function TimelineDot({ complete, inProgress }: { complete: boolean; inProgress: boolean }) {
  if (complete) {
    return (
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#22c55e",
          boxShadow: "0 0 0 4px rgba(34,197,94,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          zIndex: 10,
          position: "relative",
        }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  if (inProgress) {
    return (
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: "2px solid #3b82f6",
          background: "rgba(59,130,246,0.15)",
          boxShadow: "0 0 0 4px rgba(59,130,246,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          zIndex: 10,
          position: "relative",
        }}
      >
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3b82f6" }} />
      </div>
    );
  }
  return (
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.15)",
        background: "rgba(255,255,255,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        zIndex: 10,
        position: "relative",
      }}
    >
      <LockClosedIcon style={{ width: 9, height: 9, color: "rgba(255,255,255,0.25)" }} />
    </div>
  );
}

// ─── Panel styles ─────────────────────────────────────────────────────────────

const panelStyle: React.CSSProperties = {
  background: "rgba(10,16,32,0.65)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(16px)",
  borderRadius: 20,
  padding: 20,
};

const cardStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.025)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 14,
};

const pillStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 999,
  padding: "4px 12px",
  fontSize: 12,
  color: "rgba(255,255,255,0.8)",
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function RoadmapVisualization({ careerId }: { careerId: string }) {
  const career = careers.find((c) => c.id === careerId);
  const [activeStage, setActiveStage] = useState<Stage>("beginner");
  const [activeNodeId, setActiveNodeId] = useState<string>("");
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const storeProgress = useAppStore((s) => s.progress);
  const toggleMs      = useAppStore((s) => s.toggleMilestone);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    if (career) {
      const firstId = career.roadmap.beginner?.[0]?.id ?? "";
      setActiveNodeId(firstId);
    }
  }, [career]);

  const allNodes = useMemo(() => {
    if (!career) return [] as RoadmapNode[];
    return [...career.roadmap.beginner, ...career.roadmap.intermediate, ...career.roadmap.advanced];
  }, [career]);

  const displayedNodes = useMemo(() => {
    if (!career) return [] as RoadmapNode[];
    return career.roadmap[activeStage];
  }, [career, activeStage]);

  // Derive flat milestoneId→boolean map for computeUnlocked (preserves existing logic)
  const careerProg = useMemo<Record<string, boolean>>(() => {
    if (!career) return {};
    const map: Record<string, boolean> = {};
    for (const stage of ["beginner", "intermediate", "advanced"] as const) {
      for (const node of career.roadmap[stage]) {
        const doneIds = storeProgress[`${career.id}__${node.id}`] ?? [];
        for (const mid of doneIds) map[mid] = true;
      }
    }
    return map;
  }, [storeProgress, career]);

  function isNodeComplete(n: RoadmapNode) {
    return (n.milestones ?? []).every((m) => careerProg[m.id]);
  }

  function getNodePct(n: RoadmapNode) {
    const total = n.milestones?.length ?? 0;
    if (total === 0) return 0;
    const done = n.milestones.filter((m) => careerProg[m.id]).length;
    return Math.round((done / total) * 100);
  }

  function toggleMilestone(milestoneId: string) {
    if (!career || !activeNodeId) return;
    toggleMs(career.id, activeNodeId, milestoneId);
  }

  function toggleNodeCompletion(nodeId: string) {
    const node = allNodes.find((n) => n.id === nodeId);
    if (!node || !career) return;
    const complete = isNodeComplete(node);
    node.milestones.forEach((m) => {
      const isDone = !!careerProg[m.id];
      if (complete ? isDone : !isDone) toggleMs(career.id, node.id, m.id);
    });
  }

  // Load note for active node
  useEffect(() => {
    if (!career || !activeNodeId) return;
    try {
      setNoteText(localStorage.getItem(`cgt-note-${career.id}-${activeNodeId}`) || "");
    } catch { }
  }, [career, activeNodeId]);

  function saveNote(text: string) {
    setNoteText(text);
    if (!career) return;
    try { localStorage.setItem(`cgt-note-${career.id}-${activeNodeId}`, text); } catch { }
  }

  const activeNode = useMemo(
    () => allNodes.find((n) => n.id === activeNodeId) ?? allNodes[0],
    [allNodes, activeNodeId]
  );

  if (!career || !activeNode) return null;

  const totalNodes = allNodes.length;
  const activeNodeComplete = isNodeComplete(activeNode);
  const activeNodeUnlocked = computeUnlocked(activeNode, career, careerProg);

  const detailTabs: { id: DetailTab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "skills", label: "Skills", count: activeNode.skills.length },
    { id: "resources", label: "Resources", count: (activeNode.resources ?? []).length },
    { id: "projects", label: "Projects", count: activeNode.milestones.length },
    { id: "notes", label: "Notes" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="grid gap-5 lg:grid-cols-[1fr_420px]"
    >
      {/* ── LEFT: Roadmap list ───────────────────────────────────────────── */}
      <div style={panelStyle}>
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5" style={{ color: "#94a3b8" }} />
            <span className="font-semibold text-lg text-white">Roadmap</span>
            <button
              title="How the roadmap works"
              style={{ color: "#64748b", display: "flex", alignItems: "center", marginLeft: 2 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" />
                <path d="M8 11V7M8 5.2v.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {stages.map((s) => (
              <button
                key={s}
                onClick={() => setActiveStage(s)}
                className="transition-all text-sm font-medium px-4 py-1.5 rounded-full"
                style={
                  s === activeStage
                    ? { background: "#6E58FF", color: "white", boxShadow: "0 0 20px rgba(110,88,255,0.4)" }
                    : { color: "#94a3b8" }
                }
              >
                {s[0].toUpperCase() + s.slice(1)}
              </button>
            ))}
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all hover:bg-[#6E58FF]/10"
              style={{ border: "1px solid rgba(110,88,255,0.35)", color: "#a78bfa" }}
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              Visualize
              <span
                className="rounded-full text-white leading-none"
                style={{ background: "rgba(110,88,255,0.8)", fontSize: 10, padding: "2px 6px" }}
              >
                {totalNodes}
              </span>
            </button>
          </div>
        </div>

        {/* Timeline + node cards */}
        <div style={{ position: "relative" }}>
          {/* Vertical connecting line */}
          <div
            style={{
              position: "absolute",
              left: 10,
              top: 18,
              bottom: 18,
              width: 2,
              background: "linear-gradient(to bottom, rgba(34,197,94,0.5), rgba(59,130,246,0.3), rgba(255,255,255,0.06))",
              borderRadius: 1,
            }}
          />

          <div className="space-y-3">
            {displayedNodes.map((n) => {
              const unlocked = computeUnlocked(n, career, careerProg);
              const complete = isNodeComplete(n);
              const inProgress = unlocked && !complete;
              const pct = getNodePct(n);
              const isActive = n.id === activeNodeId;
              const circleColor = complete ? "#22c55e" : inProgress ? "#3b82f6" : "#475569";

              return (
                <div key={n.id} style={{ display: "flex", alignItems: "stretch", gap: 16 }}>
                  {/* Dot column */}
                  <div style={{ minWidth: 22, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ marginTop: 22 }}>
                      <TimelineDot complete={complete} inProgress={inProgress} />
                    </div>
                  </div>

                  {/* Card */}
                  <motion.button
                    whileHover={{ scale: 1.003 }}
                    onClick={() => { setActiveNodeId(n.id); setDetailTab("overview"); }}
                    disabled={!unlocked}
                    style={{
                      flex: 1,
                      borderRadius: 14,
                      padding: "14px 16px",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      border: isActive
                        ? "1px solid rgba(110,88,255,0.45)"
                        : "1px solid rgba(255,255,255,0.06)",
                      background: isActive
                        ? "rgba(110,88,255,0.1)"
                        : "rgba(255,255,255,0.025)",
                      opacity: unlocked ? 1 : 0.6,
                      cursor: unlocked ? "pointer" : "not-allowed",
                      transition: "all 0.2s",
                    }}
                  >
                    <NodeIcon node={n} size={44} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "white" }}>{n.title}</div>
                      <div
                        style={{ fontSize: 12, color: "#94a3b8", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                      >
                        {n.description}
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                        <span>{n.skills.length} skills</span>
                        <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
                        <span>{n.milestones.length} milestone{n.milestones.length !== 1 ? "s" : ""}</span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <CircularProgress pct={pct} locked={!unlocked} color={circleColor} size={52} />
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: complete ? "#4ade80" : inProgress ? "#60a5fa" : "#64748b",
                          }}
                        >
                          {complete ? "Completed" : inProgress ? "In Progress" : "Locked"}
                        </span>
                      </div>
                      <ChevronRightIcon
                        className="w-4 h-4 transition-colors"
                        style={{ color: isActive ? "#a78bfa" : "rgba(255,255,255,0.2)" }}
                      />
                    </div>
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Node details ──────────────────────────────────────────── */}
      <div style={{ ...panelStyle, display: "flex", flexDirection: "column" }}>
        {/* Node header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <NodeIcon node={activeNode} size={52} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 20, color: "white", lineHeight: 1.2 }}>
              {activeNode.title}
            </div>
            {activeNodeComplete ? (
              <div
                className="inline-flex items-center gap-1.5 mt-2"
                style={{
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  color: "#4ade80",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: 999,
                }}
              >
                Completed
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <circle cx="6.5" cy="6.5" r="6" fill="#22c55e" />
                  <path d="M3.5 6.5l2.2 2.2 3.8-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ) : activeNodeUnlocked ? (
              <div
                className="inline-flex items-center mt-2"
                style={{
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  color: "#60a5fa",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: 999,
                }}
              >
                In Progress
              </div>
            ) : (
              <div
                className="inline-flex items-center gap-1 mt-2"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: 999,
                }}
              >
                <LockClosedIcon style={{ width: 11, height: 11 }} />
                Locked
              </div>
            )}
          </div>
        </div>

        {/* Tab bar */}
        <div
          style={{
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            overflowX: "auto",
          }}
        >
          {detailTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDetailTab(tab.id)}
              style={{
                position: "relative",
                padding: "10px 12px",
                fontSize: 13,
                fontWeight: 500,
                whiteSpace: "nowrap",
                flexShrink: 0,
                color: detailTab === tab.id ? "white" : "#64748b",
                transition: "color 0.2s",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span style={{ marginLeft: 3, fontSize: 11, color: "#64748b" }}>({tab.count})</span>
              )}
              {detailTab === tab.id && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: "#6E58FF",
                    borderRadius: 2,
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflowY: "auto", marginTop: 16, minHeight: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={detailTab + activeNodeId}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {/* ── Overview ── */}
              {detailTab === "overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.65 }}>{activeNode.description}</p>

                  {/* Skills pills */}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 8 }}>Skills you'll learn</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {activeNode.skills.map((s) => (
                        <span key={s} style={pillStyle}>{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* Milestone highlight */}
                  {activeNode.milestones[0] && (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 8 }}>Milestone</div>
                      <div
                        style={{
                          ...cardStyle,
                          borderLeft: "3px solid #22c55e",
                          padding: "14px 16px",
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: 12,
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13, color: "white" }}>
                            {activeNode.milestones[0].text}
                          </div>
                          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                            {activeNode.milestones[0].description ?? "Complete this milestone to progress."}
                          </div>
                        </div>
                        {careerProg[activeNode.milestones[0].id] && (
                          <CheckCircleIcon style={{ width: 22, height: 22, color: "#22c55e", flexShrink: 0 }} />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Meta grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {[
                      { Icon: ClockIcon, label: "Estimated time", value: activeNode.estimatedTime ?? "2–4 weeks" },
                      { Icon: ChartBarIcon, label: "Difficulty", value: activeNode.difficulty ?? "Beginner" },
                      { Icon: ArrowTrendingUpIcon, label: "Importance", value: activeNode.importance ?? "High" },
                    ].map((item) => (
                      <div key={item.label} style={{ ...cardStyle, padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#64748b", marginBottom: 6 }}>
                          <item.Icon style={{ width: 13, height: 13 }} />
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.label}
                          </span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{item.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Resources preview */}
                  {(activeNode.resources ?? []).length > 0 && (
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>Recommended resources</div>
                        <button
                          onClick={() => setDetailTab("resources")}
                          style={{ fontSize: 12, fontWeight: 500, color: "#6E58FF", background: "none", border: "none", cursor: "pointer" }}
                        >
                          View all
                        </button>
                      </div>
                      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                        {(activeNode.resources ?? []).slice(0, 3).map((r) => (
                          <a
                            key={r.id}
                            href={r.url ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              ...cardStyle,
                              flexShrink: 0,
                              width: 136,
                              padding: "12px 14px",
                              display: "block",
                              textDecoration: "none",
                              transition: "all 0.18s",
                            }}
                          >
                            <div style={{ fontSize: 12, fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {r.title}
                            </div>
                            <div style={{ fontSize: 11, color: "#64748b", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {r.source ?? r.type ?? "Resource"}
                            </div>
                            {r.views && (
                              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{r.views}</div>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Skills ── */}
              {detailTab === "skills" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {activeNode.skills.map((s) => (
                    <div key={s} style={{ ...cardStyle, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6E58FF", flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: "white" }}>{s}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Resources ── */}
              {detailTab === "resources" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(activeNode.resources ?? []).length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0", fontSize: 13, color: "#64748b" }}>
                      No resources added yet.
                    </div>
                  ) : (
                    (activeNode.resources ?? []).map((r) => (
                      <a
                        key={r.id}
                        href={r.url ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          ...cardStyle,
                          padding: "12px 16px",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          textDecoration: "none",
                          transition: "all 0.18s",
                        }}
                      >
                        <BookOpenIcon style={{ width: 16, height: 16, color: "#6E58FF", flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {r.title}
                          </div>
                          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                            {r.type ?? "Resource"}{r.free ? " · Free" : ""}{r.level ? ` · ${r.level}` : ""}
                            {r.duration ? ` · ${r.duration}` : ""}
                          </div>
                        </div>
                        {r.views && (
                          <span style={{ fontSize: 11, color: "#64748b", flexShrink: 0 }}>{r.views}</span>
                        )}
                      </a>
                    ))
                  )}
                </div>
              )}

              {/* ── Projects / Milestones ── */}
              {detailTab === "projects" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {activeNode.milestones.map((m) => {
                    const done = !!careerProg[m.id];
                    return (
                      <button
                        key={m.id}
                        onClick={() => toggleMilestone(m.id)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                          padding: "13px 16px",
                          borderRadius: 14,
                          border: done ? "1px solid rgba(34,197,94,0.22)" : "1px solid rgba(255,255,255,0.06)",
                          background: done ? "rgba(34,197,94,0.07)" : "rgba(255,255,255,0.025)",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.18s",
                        }}
                      >
                        {done ? (
                          <CheckCircleIcon style={{ width: 18, height: 18, color: "#22c55e", flexShrink: 0, marginTop: 1 }} />
                        ) : (
                          <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)", flexShrink: 0, marginTop: 1 }} />
                        )}
                        <div>
                          <div style={{ fontSize: 13, color: done ? "rgba(255,255,255,0.5)" : "white", fontWeight: 500, textDecoration: done ? "line-through" : "none" }}>
                            {m.text}
                          </div>
                          {m.description && (
                            <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{m.description}</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ── Notes ── */}
              {detailTab === "notes" && (
                <div>
                  <textarea
                    value={noteText}
                    onChange={(e) => saveNote(e.target.value)}
                    placeholder="Add personal notes, resources, or ideas for this topic..."
                    style={{
                      width: "100%",
                      minHeight: 180,
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.03)",
                      padding: "14px 16px",
                      fontSize: 13,
                      color: "white",
                      resize: "vertical",
                      outline: "none",
                      caretColor: "#6E58FF",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action buttons */}
        <div
          style={{
            marginTop: 16,
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            gap: 10,
          }}
        >
          <button
            onClick={() => toggleNodeCompletion(activeNode.id)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "11px 0",
              borderRadius: 14,
              background: "linear-gradient(135deg, #6E58FF, #a855f7)",
              color: "white",
              fontWeight: 600,
              fontSize: 13,
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.18s",
            }}
          >
            <ArrowPathIcon style={{ width: 16, height: 16 }} />
            {activeNodeComplete ? "Review Again" : "Mark Complete"}
          </button>
          <button
            onClick={() => setDetailTab("projects")}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "11px 0",
              borderRadius: 14,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.18s",
            }}
          >
            <FolderOpenIcon style={{ width: 16, height: 16 }} />
            View Projects
          </button>
        </div>
      </div>
    </motion.div>
  );
}
