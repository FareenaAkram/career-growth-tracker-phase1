"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart,
  Radar, PolarGrid, PolarAngleAxis, Legend,
} from "recharts";
import { careers } from "@/data/careers";
import { useAppStore } from "@/store/useAppStore";
import { XP_PER_MILESTONE } from "@/lib/constants";
import {
  ChartBarIcon, FireIcon, CheckCircleIcon, ExclamationTriangleIcon,
  BoltIcon, TrophyIcon, ArrowTrendingUpIcon, ClockIcon, AcademicCapIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckSolid } from "@heroicons/react/24/solid";

// ── Design tokens ────────────────────────────────────────────────────────────
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

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ ...card, padding: "10px 14px", fontSize: 12, backdropFilter: "blur(16px)" }}>
      <div style={{ color: "#94a3b8", marginBottom: 4 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color ?? "white", fontWeight: 700 }}>{p.name}: {p.value}{p.name?.includes("XP") ? "" : "%"}</div>
      ))}
    </div>
  );
}

function Ring({ pct, size = 120, color = "#6E58FF" }: { pct: number; size?: number; color?: string }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.07)" strokeWidth="10" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="10" fill="none"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 6px ${color}80)` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.22, fontWeight: 800, color: "white" }}>{pct}%</span>
        <span style={{ fontSize: size * 0.11, color: "#64748b", marginTop: 2 }}>complete</span>
      </div>
    </div>
  );
}

// Generate simulated weekly progress data
function buildWeeklyProgress(doneMilestones: number, totalMilestones: number) {
  const weeks = 8;
  const data = [];
  for (let w = 1; w <= weeks; w++) {
    const factor = Math.min(1, (w / weeks) * (w / weeks) * 1.5);
    const simDone = Math.min(doneMilestones, Math.round(doneMilestones * factor));
    const pct = totalMilestones > 0 ? Math.round((simDone / totalMilestones) * 100) : 0;
    data.push({ week: `W${w}`, progress: pct, xp: simDone * XP_PER_MILESTONE });
  }
  return data;
}

export default function AnalyticsPage() {
  const savedIds = useAppStore((s) => s.savedCareers);
  const progress  = useAppStore((s) => s.progress);
  const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null);
  const [animated, setAnimated] = useState(true);

  // Default to the career where the user has the most completed milestones
  const defaultCareerId = useMemo(() => {
    let best = savedIds[0] ?? "frontend-developer";
    let bestCount = 0;
    for (const c of careers) {
      const nodes = [...c.roadmap.beginner, ...c.roadmap.intermediate, ...c.roadmap.advanced];
      const count = nodes.reduce((sum, n) => sum + (progress[`${c.id}__${n.id}`] ?? []).length, 0);
      if (count > bestCount) { bestCount = count; best = c.id; }
    }
    return best;
  }, [progress, savedIds]);

  const activeCareerId = selectedCareerId ?? defaultCareerId;
  const activeCareer = careers.find(c => c.id === activeCareerId) ?? careers[0]!;

  const allNodes = [
    ...activeCareer.roadmap.beginner,
    ...activeCareer.roadmap.intermediate,
    ...activeCareer.roadmap.advanced,
  ];

  // Milestones: progress is now string[] of done milestone IDs per node key
  const totalMilestones = allNodes.reduce((s, n) => s + n.milestones.length, 0);
  const doneMilestones = allNodes.reduce((s, n) => {
    const key = `${activeCareerId}__${n.id}`;
    return s + (progress[key] ?? []).length;
  }, 0);
  const overallPct = totalMilestones > 0 ? Math.round((doneMilestones / totalMilestones) * 100) : 0;
  const totalXP = doneMilestones * XP_PER_MILESTONE;

  const nodeChartData = allNodes.map(n => {
    const key = `${activeCareerId}__${n.id}`;
    const done = (progress[key] ?? []).length;
    const total = n.milestones.length;
    return {
      name: n.title.length > 11 ? n.title.slice(0, 11) + "…" : n.title,
      fullName: n.title,
      pct: total > 0 ? Math.round((done / total) * 100) : 0,
      done, total,
    };
  });

  const stageBreakdown = useMemo(() => {
    const stages = [
      { name: "Beginner",     nodes: activeCareer.roadmap.beginner,     color: "#22c55e" },
      { name: "Intermediate", nodes: activeCareer.roadmap.intermediate, color: "#6E58FF" },
      { name: "Advanced",     nodes: activeCareer.roadmap.advanced,     color: "#f59e0b" },
    ];
    return stages.map(s => {
      const total = s.nodes.reduce((a, n) => a + n.milestones.length, 0);
      const done  = s.nodes.reduce((a, n) => a + (progress[`${activeCareerId}__${n.id}`] ?? []).length, 0);
      const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
      return { name: s.name, pct, total, done, color: s.color };
    });
  }, [activeCareer, progress, activeCareerId]);

  // Radar data: skill categories
  const radarData = useMemo(() => [
    { subject: "HTML/CSS",     A: nodeChartData.find(n => n.fullName.includes("HTML") || n.fullName.includes("CSS"))?.pct ?? 0 },
    { subject: "JavaScript",   A: nodeChartData.find(n => n.fullName.includes("JavaScript"))?.pct ?? 0 },
    { subject: "React",        A: nodeChartData.find(n => n.fullName.includes("React"))?.pct ?? 0 },
    { subject: "TypeScript",   A: nodeChartData.find(n => n.fullName.includes("TypeScript"))?.pct ?? 0 },
    { subject: "Responsive",   A: nodeChartData.find(n => n.fullName.includes("Responsive"))?.pct ?? 0 },
    { subject: "Architecture", A: nodeChartData.find(n => n.fullName.includes("Performance") || n.fullName.includes("Architecture"))?.pct ?? 0 },
  ].filter(d => d.A !== undefined), [nodeChartData]);

  const weeklyData = useMemo(() => buildWeeklyProgress(doneMilestones, totalMilestones), [doneMilestones, totalMilestones]);

  const completedMilestones = allNodes.flatMap(n => {
    const key = `${activeCareerId}__${n.id}`;
    const doneIds = progress[key] ?? [];
    return n.milestones.filter(m => doneIds.includes(m.id)).map(m => ({ ...m, nodeName: n.title }));
  });

  const weakNodes = [...nodeChartData].sort((a, b) => a.pct - b.pct).slice(0, 3).filter(n => n.pct < 100);
  const strongNodes = [...nodeChartData].sort((a, b) => b.pct - a.pct).slice(0, 2).filter(n => n.pct > 0);

  const statCards = [
    { icon: ArrowTrendingUpIcon, color: "#6E58FF", label: "Career Readiness",             value: `${overallPct}%` },
    { icon: CheckCircleIcon,     color: "#22c55e", label: "Milestones (this career)",     value: `${doneMilestones}/${totalMilestones}` },
    { icon: BoltIcon,            color: "#f59e0b", label: "XP (this career)",             value: `${totalXP.toLocaleString()} XP` },
    { icon: TrophyIcon,          color: "#f87171", label: "Modules Completed",            value: `${nodeChartData.filter(n => n.pct === 100).length}/${allNodes.length}` },
  ];

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>

        {/* Header + career selector */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
          <div>
            <h1 className="text-4xl font-bold" style={{ background: "linear-gradient(135deg,#60a5fa,#818cf8,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 8 }}>
              Progress Analytics
            </h1>
            <p style={{ fontSize: 14, color: "#94a3b8" }}>Insights into your learning journey — strengths, gaps, and momentum.</p>
          </div>
          <select value={activeCareerId} onChange={e => setSelectedCareerId(e.target.value)}
            style={{ padding: "9px 14px", borderRadius: 12, background: "rgba(10,16,32,0.65)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 13, outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
            {careers.map(c => (
              <option key={c.id} value={c.id} style={{ background: "#0a1020" }}>{c.title}</option>
            ))}
          </select>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
          {statCards.map(({ icon: Icon, color, label, value }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.025, 0.1) }}>
              <div style={{ ...card, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}15`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon style={{ width: 20, height: 20, color }} />
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "white" }}>{value}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>

          {/* LEFT column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Weekly progress line chart */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
              <div style={panel}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "white" }}>Progress Over Time</h3>
                  <span style={{ fontSize: 11, color: "#64748b" }}>Last 8 weeks</span>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={weeklyData} margin={{ top: 0, right: 10, bottom: 0, left: -25 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6E58FF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6E58FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(110,88,255,0.3)", strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="progress" name="Progress" stroke="#6E58FF" strokeWidth={2.5} fill="url(#areaGrad)" dot={{ fill: "#6E58FF", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#a78bfa" }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Skill module bar chart */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
              <div style={panel}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "white" }}>Module Progress</h3>
                  <Link href="/learning"><span style={{ fontSize: 12, color: "#6E58FF", textDecoration: "none" }}>View all →</span></Link>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={nodeChartData} margin={{ top: 0, right: 10, bottom: 0, left: -25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.025)" }} />
                    <Bar dataKey="pct" name="Progress" radius={[6, 6, 0, 0]}>
                      {nodeChartData.map((entry, i) => (
                        <Cell key={i} fill={entry.pct === 100 ? "#22c55e" : entry.pct > 0 ? "#6E58FF" : "rgba(255,255,255,0.06)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Stage breakdown */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
              <div style={panel}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 18 }}>Stage Breakdown</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {stageBreakdown.map(s => (
                    <div key={s.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                          <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{s.name}</span>
                          <span style={{ fontSize: 11, color: "#64748b" }}>{s.done}/{s.total} milestones</span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 800, color: s.color }}>{s.pct}%</span>
                      </div>
                      <div style={{ height: 7, borderRadius: 99, background: "rgba(255,255,255,0.06)" }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: animated ? `${s.pct}%` : 0 }} transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                          style={{ height: "100%", borderRadius: 99, background: `linear-gradient(90deg,${s.color},${s.color}80)`, boxShadow: `0 0 8px ${s.color}40` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Completed milestones */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
              <div style={panel}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "white" }}>Completed Milestones</h3>
                  <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 99, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ade80" }}>{completedMilestones.length} done</span>
                </div>
                {completedMilestones.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px 0" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
                    <div style={{ fontSize: 13, color: "#64748b" }}>No milestones completed yet. Start learning to track progress!</div>
                    <Link href="/learning">
                      <span style={{ display: "inline-block", marginTop: 12, padding: "8px 18px", borderRadius: 10, background: "rgba(110,88,255,0.12)", border: "1px solid rgba(110,88,255,0.25)", color: "#a78bfa", fontSize: 13, fontWeight: 600 }}>
                        Go to Learning Hub →
                      </span>
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 280, overflowY: "auto" }}>
                    {completedMilestones.map(m => (
                      <div key={m.id} style={{ ...card, padding: "11px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                        <CheckSolid style={{ width: 15, height: 15, color: "#22c55e", flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "white" }}>{m.text}</div>
                          <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>{m.nodeName}</div>
                        </div>
                        <span style={{ fontSize: 11, color: "#4ade80", fontWeight: 700 }}>+50 XP</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* RIGHT column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Career readiness ring */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div style={{ ...panel, textAlign: "center" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 16 }}>Career Readiness</h3>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                  <Ring pct={overallPct} size={130} color={overallPct >= 80 ? "#22c55e" : "#6E58FF"} />
                </div>
                <div style={{ fontSize: 14, color: "#94a3b8" }}>{activeCareer.title}</div>
                <div style={{ marginTop: 14, fontSize: 13, padding: "10px 14px", borderRadius: 12, background: "rgba(110,88,255,0.08)", border: "1px solid rgba(110,88,255,0.2)", color: "#a78bfa", lineHeight: 1.6 }}>
                  {overallPct >= 80 ? "🚀 You're nearly job-ready! Start applying." : overallPct >= 50 ? "📈 Great momentum! You're over halfway there." : overallPct > 0 ? "🌱 Keep going — consistency beats intensity." : "⚡ Start your first lesson to get going!"}
                </div>
                {overallPct < 100 && (
                  <Link href="/learning">
                    <span style={{ display: "block", marginTop: 10, padding: "10px", borderRadius: 12, background: "linear-gradient(135deg,rgba(110,88,255,0.2),rgba(168,85,247,0.2))", border: "1px solid rgba(110,88,255,0.3)", color: "#a78bfa", fontWeight: 700, fontSize: 13 }}>
                      Continue Learning →
                    </span>
                  </Link>
                )}
              </div>
            </motion.div>

            {/* Skill radar chart */}
            {radarData.length >= 3 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
                <div style={panel}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 12 }}>Skill Radar</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={radarData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 10 }} />
                      <Radar name="Skills" dataKey="A" stroke="#6E58FF" fill="#6E58FF" fillOpacity={0.2} strokeWidth={2} dot={{ fill: "#6E58FF", r: 3 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* XP distribution pie */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
              <div style={panel}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 14 }}>XP by Stage</h3>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                  <PieChart width={160} height={140}>
                    <Pie data={stageBreakdown} cx={75} cy={65} innerRadius={40} outerRadius={60} dataKey="pct" strokeWidth={0}>
                      {stageBreakdown.map((s, i) => <Cell key={i} fill={s.pct > 0 ? s.color : "rgba(255,255,255,0.05)"} />)}
                    </Pie>
                    <Tooltip content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      return <div style={{ ...card, padding: "8px 12px", fontSize: 11 }}><div style={{ color: "white" }}>{payload[0].name}: {payload[0].value}%</div></div>;
                    }} />
                  </PieChart>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {stageBreakdown.map(s => (
                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                      <span style={{ color: "#94a3b8", flex: 1 }}>{s.name}</span>
                      <span style={{ color: "white", fontWeight: 700 }}>{s.done * XP_PER_MILESTONE} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Weakness analysis */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
              <div style={panel}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <ExclamationTriangleIcon style={{ width: 15, height: 15, color: "#f59e0b" }} />
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "white" }}>Focus Areas</h3>
                </div>
                {weakNodes.length === 0 ? (
                  <div style={{ fontSize: 13, color: "#4ade80" }}>All modules complete! 🎉</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {weakNodes.map(n => (
                      <Link key={n.name} href={`/learn/${allNodes.find(node => node.title === n.fullName)?.id ?? ""}`}>
                        <div style={{ ...card, padding: "12px 14px", cursor: "pointer", transition: "all 0.15s" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,158,11,0.08)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "white" }}>{n.fullName}</span>
                            <span style={{ fontSize: 11, color: n.pct === 0 ? "#f87171" : "#f59e0b", fontWeight: 700 }}>{n.pct}%</span>
                          </div>
                          <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.08)" }}>
                            <div style={{ height: "100%", borderRadius: 99, width: `${n.pct}%`, background: n.pct === 0 ? "#ef4444" : "#f59e0b" }} />
                          </div>
                          <div style={{ fontSize: 11, color: "#6E58FF", marginTop: 6 }}>Start module →</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Strengths */}
            {strongNodes.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
                <div style={panel}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <TrophyIcon style={{ width: 15, height: 15, color: "#fbbf24" }} />
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "white" }}>Top Strengths</h3>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {strongNodes.map(n => (
                      <div key={n.name} style={{ ...card, padding: "12px 14px", borderLeft: "3px solid #22c55e" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "white" }}>{n.fullName}</span>
                          <span style={{ fontSize: 11, color: "#4ade80", fontWeight: 700 }}>{n.pct}%</span>
                        </div>
                        <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.08)" }}>
                          <div style={{ height: "100%", borderRadius: 99, width: `${n.pct}%`, background: "#22c55e" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Time invested */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
              <div style={panel}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <ClockIcon style={{ width: 15, height: 15, color: "#94a3b8" }} />
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "white" }}>Time Invested</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {allNodes.map(n => {
                    const key = `${activeCareerId}__${n.id}`;
                    const done = (progress[key] ?? []).length;
                    const hours = done * 3;
                    return (
                      <div key={n.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
                        <div style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          <span style={{ color: hours > 0 ? "#94a3b8" : "#475569" }}>{n.title}</span>
                        </div>
                        <span style={{ color: hours > 0 ? "white" : "#374151", fontWeight: 700, flexShrink: 0 }}>{hours}h</span>
                      </div>
                    );
                  })}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "#94a3b8" }}>Total</span>
                    <span style={{ color: "#6E58FF", fontWeight: 800 }}>{doneMilestones * 3}h estimated</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
