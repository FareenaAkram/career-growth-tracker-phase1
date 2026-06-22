"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { careers, type Career, type RoadmapNode } from "@/data/careers";
import { useAppStore } from "@/store/useAppStore";
import { nodeProgressKey } from "@/lib/utils";
import type { ProgressMap } from "@/types/app";
import {
  BoltIcon,
  FireIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  PresentationChartLineIcon,
  BriefcaseIcon,
  SparklesIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

// ── Design tokens (match roadmap page) ────────────────────────────────────────
const panel: React.CSSProperties = {
  background: "rgba(10,16,32,0.65)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(16px)",
  borderRadius: 20,
  padding: 20,
};
const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.025)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 14,
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function computeCareerProgress(career: Career, progress: ProgressMap): number {
  const nodes = [...career.roadmap.beginner, ...career.roadmap.intermediate, ...career.roadmap.advanced];
  let total = 0, done = 0;
  for (const node of nodes) {
    total += node.milestones.length;
    done += (progress[nodeProgressKey(career.id, node.id)] ?? []).length;
  }
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

function getNextNode(career: Career, progress: ProgressMap): RoadmapNode | null {
  const nodes = [...career.roadmap.beginner, ...career.roadmap.intermediate, ...career.roadmap.advanced];
  for (const node of nodes) {
    const doneIds = progress[nodeProgressKey(career.id, node.id)] ?? [];
    if (doneIds.length < node.milestones.length) return node;
  }
  return null;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconColor, label, value }: { icon: any; iconColor: string; label: string; value: string }) {
  return (
    <div style={{ ...card, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${iconColor}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon style={{ width: 20, height: 20, color: iconColor }} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "white" }}>{value}</div>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function CircularProgress({ pct, size = 64, stroke = 5, color = "#6E58FF" }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", display: "block" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.2, fontWeight: 700, color: "white" }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const progress     = useAppStore((s) => s.progress);
  const savedIds     = useAppStore((s) => s.savedCareers);
  const removeCareer = useAppStore((s) => s.removeCareer);
  const totalXP      = useAppStore((s) => s.getXp());

  const savedCareers = useMemo(() => careers.filter((c) => savedIds.includes(c.id)), [savedIds]);

  // Use same logic as Analytics: default to career with most completed milestones
  const activeCareerId = useMemo(() => {
    let best = savedIds[0] ?? "frontend-developer";
    let bestCount = 0;
    for (const c of careers) {
      const nodes = [...c.roadmap.beginner, ...c.roadmap.intermediate, ...c.roadmap.advanced];
      const count = nodes.reduce((sum, n) => sum + (progress[`${c.id}__${n.id}`] ?? []).length, 0);
      if (count > bestCount) { bestCount = count; best = c.id; }
    }
    return best;
  }, [progress, savedIds]);

  const activeCareer = careers.find((c) => c.id === activeCareerId) ?? careers.find((c) => c.id === "frontend-developer")!;
  const overallPct = computeCareerProgress(activeCareer, progress);
  const nextNode   = getNextNode(activeCareer, progress);

  // Total individual milestones done across ALL careers (for global stat card)
  const totalDone = Object.values(progress).reduce((s, arr) => s + arr.length, 0);

  const recommendedSteps = [
    {
      icon: BookOpenIcon,
      color: "#6E58FF",
      title: nextNode ? `Learn ${nextNode.title}` : "Start a Career Path",
      desc: nextNode?.description ?? "Pick a career and begin your learning journey.",
      time: nextNode?.estimatedTime ?? "2–4 weeks",
      href: nextNode ? `/careers/${activeCareerId}` : "/",
      impact: "High",
    },
    {
      icon: PresentationChartLineIcon,
      color: "#22c55e",
      title: "Review Your Analytics",
      desc: "See your skill progress and identify weak areas to improve faster.",
      time: "5 min",
      href: "/analytics",
      impact: "Medium",
    },
    {
      icon: BriefcaseIcon,
      color: "#f59e0b",
      title: "Check Job Matches",
      desc: "See how well your current skills match target job openings.",
      time: "10 min",
      href: "/jobs",
      impact: "High",
    },
  ];

  // Skills from active career, categorised
  const allNodes = [
    ...activeCareer.roadmap.beginner,
    ...activeCareer.roadmap.intermediate,
    ...activeCareer.roadmap.advanced,
  ];
  const skillsByNode = allNodes.map((n) => {
    const doneIds = progress[nodeProgressKey(activeCareer.id, n.id)] ?? [];
    const pct = n.milestones.length > 0 ? Math.round((doneIds.length / n.milestones.length) * 100) : 0;
    return { node: n, pct };
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold" style={{ background: "linear-gradient(135deg, #60a5fa, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Career Dashboard
            </h1>
            <p className="mt-2 text-sm" style={{ color: "#94a3b8" }}>
              Track your progress, skills, and career readiness all in one place.
            </p>
          </div>
          <Link href="/">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 14, background: "rgba(110,88,255,0.12)", border: "1px solid rgba(110,88,255,0.3)", color: "#a78bfa", fontSize: 14, fontWeight: 600 }}>
              Explore Careers <ArrowRightIcon style={{ width: 14, height: 14 }} />
            </span>
          </Link>
        </div>

        {/* ── Stats row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={BoltIcon} iconColor="#f59e0b" label="Total XP (all careers)" value={`${totalXP.toLocaleString()} XP`} />
          <StatCard icon={FireIcon} iconColor="#f97316" label="Day streak" value="12 days" />
          <StatCard icon={CheckCircleIcon} iconColor="#22c55e" label="Milestones done (all careers)" value={String(totalDone)} />
          <StatCard icon={SparklesIcon} iconColor="#a855f7" label={`${activeCareer.title} readiness`} value={`${overallPct}%`} />
        </div>

        {/* ── Main grid ──────────────────────────────────────────────────── */}
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">

          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Active career card */}
            <div style={panel}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Active Career Path</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: "white" }}>{activeCareer.title}</h2>
                    <CheckBadgeIcon style={{ width: 22, height: 22, color: "#60a5fa" }} />
                  </div>
                  <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>{activeCareer.description}</p>
                </div>
                <CircularProgress pct={overallPct} size={72} />
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>Progress to job-ready</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#6E58FF" }}>{overallPct}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.08)" }}>
                  <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #6E58FF, #a855f7)", width: `${overallPct}%`, transition: "width 0.6s ease" }} />
                </div>
              </div>

              {/* Next node */}
              {nextNode && (
                <div style={{ ...card, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>Next up</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{nextNode.title}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{nextNode.estimatedTime ?? "2–4 weeks"}</div>
                  </div>
                  <Link href={`/careers/${activeCareerId}`}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, background: "linear-gradient(135deg, #6E58FF, #a855f7)", color: "white", fontWeight: 600, fontSize: 12 }}>
                      Continue <ChevronRightIcon style={{ width: 13, height: 13 }} />
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* Skill overview */}
            <div style={panel}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "white" }}>Skill Overview</h3>
                <Link href={`/careers/${activeCareerId}`}><span style={{ fontSize: 12, color: "#6E58FF" }}>View roadmap →</span></Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {skillsByNode.map(({ node, pct }) => (
                  <div key={node.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "white" }}>{node.title}</span>
                      <span style={{ fontSize: 12, color: pct === 100 ? "#4ade80" : "#94a3b8", fontWeight: 600 }}>{pct}%</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 99, background: "rgba(255,255,255,0.08)" }}>
                      <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, transition: "width 0.5s ease", background: pct === 100 ? "#22c55e" : pct > 0 ? "linear-gradient(90deg, #6E58FF, #a855f7)" : "transparent" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved careers */}
            {savedCareers.length > 0 && (
              <div style={panel}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "white" }}>Saved Careers</h3>
                  <Link href="/" style={{ fontSize: 12, color: "#6E58FF", textDecoration: "none" }}>Browse more →</Link>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
                  {savedCareers.map((c) => {
                    const pct = computeCareerProgress(c, progress);
                    return (
                      <div key={c.id} style={{ ...card, padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</div>
                            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{c.category}</div>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#6E58FF", flexShrink: 0 }}>{pct}%</span>
                        </div>
                        <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.08)", marginTop: 10 }}>
                          <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: "linear-gradient(90deg, #6E58FF, #a855f7)" }} />
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                          <Link href={`/careers/${c.id}`} style={{ flex: 1, textAlign: "center", padding: "6px", borderRadius: 8, background: "rgba(110,88,255,0.12)", border: "1px solid rgba(110,88,255,0.25)", color: "#a78bfa", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                            Open
                          </Link>
                          <button onClick={() => removeCareer(c.id)} style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b", fontSize: 12, cursor: "pointer" }}>
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Recommended next steps */}
            <div style={panel}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 16 }}>Recommended Next Steps</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {recommendedSteps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <Link key={i} href={step.href} style={{ ...card, padding: "14px 16px", textDecoration: "none", display: "block", transition: "all 0.18s" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: `${step.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon style={{ width: 16, height: 16, color: step.color }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{step.title}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3, lineHeight: 1.5 }}>{step.desc}</div>
                          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}>
                              ⏱ {step.time}
                            </span>
                            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: step.impact === "High" ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", border: `1px solid ${step.impact === "High" ? "rgba(34,197,94,0.2)" : "rgba(245,158,11,0.2)"}`, color: step.impact === "High" ? "#4ade80" : "#fbbf24" }}>
                              {step.impact} impact
                            </span>
                          </div>
                        </div>
                        <ChevronRightIcon style={{ width: 14, height: 14, color: "#64748b", flexShrink: 0, marginTop: 2 }} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Job Match Preview */}
            <div style={panel}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 4 }}>Job Match</h3>
              <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>Based on your current skill set</p>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <CircularProgress pct={Math.min(overallPct + 10, 99)} size={100} stroke={7} color="#22c55e" />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>You match Frontend roles</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                    {Math.min(overallPct + 10, 99)}% match with Junior Frontend Developer
                  </div>
                </div>
                <Link href="/jobs" style={{ width: "100%", textAlign: "center", padding: "10px", borderRadius: 12, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ade80", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                  View Full Job Matches →
                </Link>
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 16, paddingTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 10 }}>Gap Skills</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {activeCareer.roadmap.intermediate.flatMap((n) => n.skills).slice(0, 4).map((s) => (
                    <span key={s} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.18)", color: "#fbbf24" }}>
                      {s}
                    </span>
                  ))}
                </div>
                <Link href="/jobs" style={{ display: "block", marginTop: 10, fontSize: 12, color: "#6E58FF", textDecoration: "none" }}>
                  Start learning missing skills →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
