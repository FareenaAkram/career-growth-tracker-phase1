"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { careers } from "@/data/careers";
import {
  MapPinIcon, CurrencyDollarIcon, BriefcaseIcon,
  CheckCircleIcon, XCircleIcon, MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon, BookmarkIcon, ArrowPathIcon,
  SparklesIcon, BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid, CheckCircleIcon as CheckSolid } from "@heroicons/react/24/solid";

// ── Design tokens ────────────────────────────────────────────────────────────
const panel: React.CSSProperties = {
  background: "rgba(10,16,32,0.65)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(16px)",
  borderRadius: 20,
  padding: 20,
};

interface Job {
  id: string; title: string; company: string; location: string;
  type: string; salary: string | null; description: string;
  tags: string[]; url: string; logo: string | null; date: string;
}

const TECH_TAGS = [
  { id: "javascript", label: "JavaScript" },
  { id: "react", label: "React" },
  { id: "typescript", label: "TypeScript" },
  { id: "nodejs", label: "Node.js" },
  { id: "python", label: "Python" },
  { id: "css", label: "CSS" },
  { id: "frontend", label: "Frontend" },
];

// Match ring SVG
function MatchRing({ pct, size = 68 }: { pct: number; size?: number }) {
  const color = pct >= 80 ? "#22c55e" : pct >= 60 ? "#6E58FF" : "#f59e0b";
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.07)" strokeWidth="6" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="6" fill="none"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.195, fontWeight: 800, color }}>{pct}%</span>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [fallback, setFallback] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [progress, setProgress] = useState<Record<string, string[]>>({});
  const [query, setQuery] = useState("");
  const [techTag, setTechTag] = useState("javascript");
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [showBookmarked, setShowBookmarked] = useState(false);

  // Load saved jobs from localStorage
  useEffect(() => {
    try {
      setProgress(JSON.parse(localStorage.getItem("cgt-progress") || "{}"));
      const bks = JSON.parse(localStorage.getItem("cgt-bookmarks-jobs") || "[]");
      setBookmarked(bks);
    } catch {}
  }, []);

  const fetchJobs = useCallback(async (tag: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs?tag=${tag}`);
      const data = await res.json();
      setJobs(data.jobs ?? []);
      setFallback(data.fallback ?? false);
      if (!selectedJob && data.jobs?.length > 0) setSelectedJob(data.jobs[0]);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(techTag); }, [techTag]);

  // Compute acquired skills from progress
  const acquiredSkills = useMemo(() => {
    const set = new Set<string>();
    careers.forEach(career => {
      [...career.roadmap.beginner, ...career.roadmap.intermediate, ...career.roadmap.advanced].forEach(node => {
        const key = `${career.id}__${node.id}`;
        const done = (progress[key] ?? []).length;
        if (done > 0) node.skills.forEach(s => set.add(s.toLowerCase()));
      });
    });
    return set;
  }, [progress]);

  function getMatch(job: Job) {
    if (!job.tags || job.tags.length === 0) return 65;
    const matched = job.tags.filter(t => acquiredSkills.has(t.toLowerCase())).length;
    const base = Math.round((matched / Math.max(job.tags.length, 1)) * 100);
    return Math.max(40, Math.min(98, base + 40));
  }

  function toggleBookmark(id: string) {
    const next = bookmarked.includes(id) ? bookmarked.filter(x => x !== id) : [...bookmarked, id];
    setBookmarked(next);
    // Also save job data for the bookmarks page
    try {
      localStorage.setItem("cgt-bookmarks-jobs", JSON.stringify(next));
      const savedJobs = JSON.parse(localStorage.getItem("cgt-saved-jobs-data") || "{}");
      const job = jobs.find(j => j.id === id);
      if (job) savedJobs[id] = job;
      localStorage.setItem("cgt-saved-jobs-data", JSON.stringify(savedJobs));
    } catch {}
  }

  const filtered = useMemo(() => {
    let list = jobs;
    if (showBookmarked) list = list.filter(j => bookmarked.includes(j.id));
    if (query) list = list.filter(j =>
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.company.toLowerCase().includes(query.toLowerCase()) ||
      j.tags.join(" ").toLowerCase().includes(query.toLowerCase())
    );
    return list;
  }, [jobs, query, showBookmarked, bookmarked]);

  const selectedMatch = selectedJob ? getMatch(selectedJob) : 0;
  const matchedSkills = selectedJob?.tags.filter(t => acquiredSkills.has(t.toLowerCase())) ?? [];
  const gapSkills = selectedJob?.tags.filter(t => !acquiredSkills.has(t.toLowerCase())) ?? [];

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 className="text-4xl font-bold" style={{ background: "linear-gradient(135deg,#60a5fa,#818cf8,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 8 }}>
            Job Board
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 15 }}>
            Real remote jobs powered by RemoteOK. Click any job to see your skill match and apply.
            {fallback && <span style={{ fontSize: 12, color: "#f59e0b", marginLeft: 8 }}>⚠ Showing curated listings (live feed unavailable)</span>}
          </p>
        </div>

        {/* Tech tag filter + search */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 180px" }}>
            <MagnifyingGlassIcon style={{ width: 15, height: 15, color: "#64748b", position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search jobs, companies…"
              style={{ width: "100%", padding: "9px 14px 9px 34px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {TECH_TAGS.map(t => (
              <button key={t.id} onClick={() => { setTechTag(t.id); setSelectedJob(null); }}
                style={{ padding: "7px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                  background: techTag === t.id ? "rgba(110,88,255,0.15)" : "rgba(255,255,255,0.04)",
                  border: techTag === t.id ? "1px solid rgba(110,88,255,0.4)" : "1px solid rgba(255,255,255,0.1)",
                  color: techTag === t.id ? "#a78bfa" : "#64748b", fontFamily: "inherit" }}>
                {t.label}
              </button>
            ))}
          </div>
          <button onClick={() => setShowBookmarked(s => !s)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700, cursor: "pointer",
              background: showBookmarked ? "rgba(110,88,255,0.12)" : "rgba(255,255,255,0.04)",
              border: showBookmarked ? "1px solid rgba(110,88,255,0.3)" : "1px solid rgba(255,255,255,0.1)",
              color: showBookmarked ? "#a78bfa" : "#64748b", fontFamily: "inherit" }}>
            <BookmarkIcon style={{ width: 13, height: 13 }} /> Saved ({bookmarked.length})
          </button>
          <button onClick={() => fetchJobs(techTag)}
            style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", color: "#64748b" }}>
            <ArrowPathIcon style={{ width: 15, height: 15 }} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>

          {/* LEFT: Job list */}
          <div>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ ...panel, height: 100, opacity: 0.4 }}>
                    <div style={{ height: 12, width: "60%", borderRadius: 6, background: "rgba(255,255,255,0.1)", marginBottom: 10 }} />
                    <div style={{ height: 10, width: "40%", borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filtered.map((job, i) => {
                  const match = getMatch(job);
                  const isSelected = selectedJob?.id === job.id;
                  const isBk = bookmarked.includes(job.id);
                  const matchColor = match >= 80 ? "#22c55e" : match >= 60 ? "#6E58FF" : "#f59e0b";

                  return (
                    <motion.div key={job.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.025, 0.1) }}>
                      <div onClick={() => setSelectedJob(job)}
                        style={{ background: "rgba(10,16,32,0.65)", border: `1px solid ${isSelected ? "rgba(110,88,255,0.4)" : "rgba(255,255,255,0.08)"}`, backdropFilter: "blur(16px)", borderRadius: 16, padding: "16px 18px", cursor: "pointer", transition: "all 0.2s", boxShadow: isSelected ? "0 4px 24px rgba(110,88,255,0.12)" : "none" }}
                        onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.16)"; }}
                        onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)"; }}>

                        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          {/* Company logo/initial */}
                          <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16, fontWeight: 800, color: "#94a3b8" }}>
                            {job.logo ? <img src={job.logo} alt={job.company} style={{ width: 32, height: 32, objectFit: "contain", borderRadius: 6 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} /> : job.company[0]}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 2 }}>{job.title}</div>
                                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>{job.company}</div>
                              </div>
                              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <div style={{ fontSize: 13, fontWeight: 800, color: matchColor }}>{match}%</div>
                                <button onClick={e => { e.stopPropagation(); toggleBookmark(job.id); }}
                                  style={{ background: "none", border: "none", cursor: "pointer", color: isBk ? "#6E58FF" : "#475569", padding: 4 }}>
                                  {isBk ? <BookmarkSolid style={{ width: 15, height: 15 }} /> : <BookmarkIcon style={{ width: 15, height: 15 }} />}
                                </button>
                              </div>
                            </div>

                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
                                <MapPinIcon style={{ width: 12, height: 12 }} /> {job.location}
                              </div>
                              {job.salary && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
                                <CurrencyDollarIcon style={{ width: 12, height: 12 }} /> {job.salary}
                              </div>}
                              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
                                <BriefcaseIcon style={{ width: 12, height: 12 }} /> {job.type}
                              </div>
                            </div>

                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                              {job.tags.slice(0, 4).map(t => (
                                <span key={t} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: acquiredSkills.has(t.toLowerCase()) ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.04)", border: `1px solid ${acquiredSkills.has(t.toLowerCase()) ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.07)"}`, color: acquiredSkills.has(t.toLowerCase()) ? "#4ade80" : "#64748b" }}>{t}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                {filtered.length === 0 && (
                  <div style={{ textAlign: "center", padding: "50px 20px", color: "#475569" }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>No jobs found</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Sticky job detail */}
          {selectedJob && (
            <div style={{ position: "sticky", top: 20, display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Match score */}
              <div style={panel}>
                <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
                  <MatchRing pct={selectedMatch} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "white" }}>{selectedJob.title}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{selectedJob.company}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{selectedJob.location}</div>
                  </div>
                </div>

                {selectedJob.salary && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#22c55e", fontWeight: 700, marginBottom: 14, padding: "8px 12px", borderRadius: 10, background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)" }}>
                    <CurrencyDollarIcon style={{ width: 15, height: 15 }} /> {selectedJob.salary}
                  </div>
                )}

                <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.65, marginBottom: 16 }}>{selectedJob.description}</p>

                {/* Matched skills */}
                {matchedSkills.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#22c55e", marginBottom: 8 }}>✅ You have these skills</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {matchedSkills.map(s => (
                        <span key={s} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80" }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gap skills */}
                {gapSkills.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", marginBottom: 8 }}>📚 Skills to learn</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {gapSkills.map(s => (
                        <span key={s} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#f59e0b" }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {gapSkills.length === 0 && matchedSkills.length > 0 && (
                  <div style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.2)", marginBottom: 14, fontSize: 13, color: "#4ade80", fontWeight: 600, textAlign: "center" }}>
                    🎉 You meet all the requirements!
                  </div>
                )}

                {/* Apply button */}
                <a href={selectedJob.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px", borderRadius: 14, background: "linear-gradient(135deg,#6E58FF,#a855f7)", color: "white", fontWeight: 700, fontSize: 14, textDecoration: "none", transition: "opacity 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                  <ArrowTopRightOnSquareIcon style={{ width: 16, height: 16 }} />
                  Apply Now
                </a>

                {gapSkills.length > 0 && (
                  <a href="/learning" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontWeight: 600, fontSize: 13, textDecoration: "none", marginTop: 8, transition: "all 0.15s" }}
                    onMouseEnter={e => { const el = e.currentTarget; el.style.background = "rgba(255,255,255,0.05)"; el.style.color = "white"; }}
                    onMouseLeave={e => { const el = e.currentTarget; el.style.background = "transparent"; el.style.color = "#94a3b8"; }}>
                    Learn Missing Skills →
                  </a>
                )}
              </div>

              {/* AI Match insight */}
              <div style={{ ...panel, background: "rgba(110,88,255,0.07)", border: "1px solid rgba(110,88,255,0.2)" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <SparklesIcon style={{ width: 15, height: 15, color: "#a78bfa" }} />
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#a78bfa" }}>AI Match Insight</div>
                </div>
                <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.65, margin: 0 }}>
                  {selectedMatch >= 80
                    ? `Strong match! You have most of the required skills. Focus on polishing your portfolio with ${selectedJob.tags[0] ?? "key"} projects before applying.`
                    : selectedMatch >= 60
                    ? `Good foundation! Learn ${gapSkills.slice(0, 2).join(" and ")} to significantly boost your match score.`
                    : `Start building your skills with ${gapSkills.slice(0, 2).join(" and ")} — check the Learning Hub for structured content.`}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
