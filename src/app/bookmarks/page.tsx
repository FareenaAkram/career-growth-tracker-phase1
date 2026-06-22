"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { careers } from "@/data/careers";
import { useAppStore } from "@/store/useAppStore";
import {
  MagnifyingGlassIcon, BookmarkIcon, TrashIcon,
  ArrowTopRightOnSquareIcon, BriefcaseIcon, AcademicCapIcon,
  DocumentTextIcon, ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";

// ── Design tokens ────────────────────────────────────────────────────────────
const panel: React.CSSProperties = {
  background: "rgba(10,16,32,0.65)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(16px)",
  borderRadius: 20,
  padding: 24,
};

type Tab = "all" | "careers" | "resources" | "jobs";

interface CareerBk { type: "career"; id: string; title: string; description: string; category: string; skills: string[] }
interface ResourceBk { type: "resource"; id: string; title: string; description: string; url: string; rtype: string; free: boolean }
interface JobBk { type: "job"; id: string; title: string; company: string; location: string; salary: string | null; url: string; tags: string[] }
type Bookmark = CareerBk | ResourceBk | JobBk;

// Curated sample resources that can be bookmarked
const SAMPLE_RESOURCES: ResourceBk[] = [
  { type: "resource", id: "mdn", title: "MDN Web Docs", description: "The definitive reference for web technologies.", url: "https://developer.mozilla.org/", rtype: "Documentation", free: true },
  { type: "resource", id: "react-docs", title: "React Documentation", description: "Official React docs with interactive examples.", url: "https://react.dev/", rtype: "Documentation", free: true },
  { type: "resource", id: "js-info", title: "JavaScript.info", description: "The Modern JavaScript Tutorial.", url: "https://javascript.info/", rtype: "Course", free: true },
  { type: "resource", id: "odin", title: "The Odin Project", description: "Free, open-source full-stack curriculum.", url: "https://www.theodinproject.com/", rtype: "Course", free: true },
  { type: "resource", id: "fcc", title: "freeCodeCamp", description: "600+ hours of free interactive coding lessons.", url: "https://www.freecodecamp.org/", rtype: "Course", free: true },
  { type: "resource", id: "fireship", title: "Fireship YouTube", description: "Fast-paced, high-quality web dev content.", url: "https://www.youtube.com/@Fireship", rtype: "Video", free: true },
];

export default function BookmarksPage() {
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const resourceData: ResourceBk[] = SAMPLE_RESOURCES;

  const savedCareerIds     = useAppStore((s) => s.savedCareers);
  const savedJobIds        = useAppStore((s) => s.bookmarkedJobIds);
  const savedJobData       = useAppStore((s) => s.savedJobsData);
  const savedResourceIds   = useAppStore((s) => s.bookmarkedResourceIds);
  const removeCareerStore  = useAppStore((s) => s.removeCareer);
  const toggleJob          = useAppStore((s) => s.toggleJobBookmark);
  const toggleResource     = useAppStore((s) => s.toggleResourceBookmark);

  function removeCareer(id: string) { removeCareerStore(id); }
  function removeJob(id: string)    { toggleJob(id); }
  function removeResource(id: string)    { toggleResource(id); }
  function bookmarkResource(id: string)  { toggleResource(id); }

  // Build combined list
  const allBookmarks = useMemo<Bookmark[]>(() => {
    const careerBks: CareerBk[] = savedCareerIds
      .map(id => careers.find(c => c.id === id))
      .filter(Boolean)
      .map(c => ({ type: "career" as const, id: c!.id, title: c!.title, description: c!.description, category: c!.category ?? "General", skills: c!.skills }));

    const jobBks: JobBk[] = savedJobIds
      .filter(id => savedJobData[id])
      .map(id => {
        const j = savedJobData[id];
        return { type: "job" as const, id: j.id, title: j.title, company: j.company, location: j.location, salary: j.salary ?? null, url: j.url, tags: j.tags ?? [] };
      });

    const resourceBks: ResourceBk[] = savedResourceIds
      .map(id => resourceData.find(r => r.id === id))
      .filter(Boolean) as ResourceBk[];

    return [...careerBks, ...jobBks, ...resourceBks];
  }, [savedCareerIds, savedJobIds, savedJobData, savedResourceIds, resourceData]);

  const filtered = useMemo(() => {
    let list = allBookmarks;
    if (tab === "careers") list = list.filter(b => b.type === "career");
    if (tab === "resources") list = list.filter(b => b.type === "resource");
    if (tab === "jobs") list = list.filter(b => b.type === "job");
    if (query) list = list.filter(b => b.title.toLowerCase().includes(query.toLowerCase()) || (b.type === "job" && b.company.toLowerCase().includes(query.toLowerCase())));
    return list;
  }, [allBookmarks, tab, query]);

  const counts = { careers: savedCareerIds.length, resources: savedResourceIds.length, jobs: savedJobIds.length };

  const TABS: { id: Tab; label: string; count: number; icon: any }[] = [
    { id: "all",       label: "All",       count: allBookmarks.length, icon: BookmarkIcon },
    { id: "careers",   label: "Careers",   count: counts.careers,      icon: AcademicCapIcon },
    { id: "resources", label: "Resources", count: counts.resources,    icon: DocumentTextIcon },
    { id: "jobs",      label: "Jobs",      count: counts.jobs,         icon: BriefcaseIcon },
  ];

  return (
    <div style={{ padding: "32px 24px", maxWidth: 900, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 className="text-4xl font-bold" style={{ background: "linear-gradient(135deg,#60a5fa,#818cf8,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 8 }}>
            Bookmarks
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 15 }}>Your saved careers, resources, and job listings in one place.</p>
        </div>

        {/* Tabs + Search */}
        <div style={{ ...panel, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {/* Tab buttons */}
            <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 4, flex: "1 1 auto" }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 12px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                    background: tab === t.id ? "rgba(110,88,255,0.2)" : "transparent",
                    color: tab === t.id ? "#a78bfa" : "#64748b",
                    border: tab === t.id ? "1px solid rgba(110,88,255,0.3)" : "1px solid transparent", fontFamily: "inherit" }}>
                  <t.icon style={{ width: 14, height: 14 }} />
                  {t.label}
                  {t.count > 0 && <span style={{ fontSize: 11, padding: "1px 6px", borderRadius: 99, background: "rgba(255,255,255,0.1)", color: tab === t.id ? "white" : "#475569" }}>{t.count}</span>}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: "relative" }}>
              <MagnifyingGlassIcon style={{ width: 14, height: 14, color: "#64748b", position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search bookmarks…"
                style={{ width: 200, padding: "9px 12px 9px 32px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
            </div>
          </div>
        </div>

        {/* Discover Resources to Bookmark */}
        {(tab === "all" || tab === "resources") && (
          <div style={{ ...panel, marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 14 }}>📌 Save Resources</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 10 }}>
              {SAMPLE_RESOURCES.map(r => {
                const isSaved = savedResourceIds.includes(r.id);
                return (
                  <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: isSaved ? "rgba(110,88,255,0.08)" : "rgba(255,255,255,0.025)", border: `1px solid ${isSaved ? "rgba(110,88,255,0.25)" : "rgba(255,255,255,0.06)"}`, transition: "all 0.15s" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</div>
                      <div style={{ fontSize: 10, color: "#64748b" }}>{r.rtype} · {r.free ? "Free" : "Paid"}</div>
                    </div>
                    <button onClick={() => bookmarkResource(r.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: isSaved ? "#a78bfa" : "#475569", padding: 4, flexShrink: 0 }}>
                      {isSaved ? <BookmarkSolid style={{ width: 15, height: 15 }} /> : <BookmarkIcon style={{ width: 15, height: 15 }} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bookmarks list */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔖</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#94a3b8" }}>No bookmarks yet</div>
              <div style={{ fontSize: 13, color: "#475569", marginTop: 6, marginBottom: 20 }}>
                {tab === "careers" ? "Save careers from the Explorer page." : tab === "jobs" ? "Save jobs from the Job Board." : "Save resources above or jobs from the Job Board."}
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <Link href="/"><span style={{ padding: "9px 18px", borderRadius: 12, background: "rgba(110,88,255,0.12)", border: "1px solid rgba(110,88,255,0.25)", color: "#a78bfa", fontSize: 13, fontWeight: 700, display: "inline-block" }}>Explore Careers</span></Link>
                <Link href="/jobs"><span style={{ padding: "9px 18px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: 13, fontWeight: 700, display: "inline-block" }}>Browse Jobs</span></Link>
              </div>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map((bk, i) => (
                <motion.div key={`${bk.type}-${bk.id}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.025, 0.1) }}>

                  {/* Career bookmark */}
                  {bk.type === "career" && (
                    <div style={{ background: "rgba(10,16,32,0.65)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", borderRadius: 16, padding: "18px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "rgba(110,88,255,0.12)", color: "#a78bfa" }}>CAREER</span>
                            <span style={{ fontSize: 11, color: "#64748b" }}>{bk.category}</span>
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{bk.title}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <Link href={`/careers/${bk.id}`}>
                            <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8, background: "rgba(110,88,255,0.1)", border: "1px solid rgba(110,88,255,0.2)", color: "#a78bfa", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                              View <ChevronRightIcon style={{ width: 12, height: 12 }} />
                            </button>
                          </Link>
                          <button onClick={() => removeCareer(bk.id)}
                            style={{ padding: "6px 8px", borderRadius: 8, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", cursor: "pointer" }}>
                            <TrashIcon style={{ width: 13, height: 13 }} />
                          </button>
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: "0 0 10px" }}>{bk.description}</p>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {bk.skills.slice(0, 5).map(s => (
                          <span key={s} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#94a3b8" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Resource bookmark */}
                  {bk.type === "resource" && (
                    <div style={{ background: "rgba(10,16,32,0.65)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", borderRadius: 16, padding: "18px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "rgba(34,197,94,0.1)", color: "#4ade80" }}>RESOURCE</span>
                            <span style={{ fontSize: 11, color: "#64748b" }}>{bk.rtype} · {bk.free ? "Free" : "Paid"}</span>
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 4 }}>{bk.title}</div>
                          <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{bk.description}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 12 }}>
                          <a href={bk.url} target="_blank" rel="noopener noreferrer">
                            <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#4ade80", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                              Open <ArrowTopRightOnSquareIcon style={{ width: 12, height: 12 }} />
                            </button>
                          </a>
                          <button onClick={() => removeResource(bk.id)}
                            style={{ padding: "6px 8px", borderRadius: 8, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", cursor: "pointer" }}>
                            <TrashIcon style={{ width: 13, height: 13 }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Job bookmark */}
                  {bk.type === "job" && (
                    <div style={{ background: "rgba(10,16,32,0.65)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", borderRadius: 16, padding: "18px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>JOB</span>
                            <span style={{ fontSize: 11, color: "#64748b" }}>{bk.location}</span>
                            {bk.salary && <span style={{ fontSize: 11, color: "#22c55e" }}>{bk.salary}</span>}
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 2 }}>{bk.title}</div>
                          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}>{bk.company}</div>
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                            {bk.tags.slice(0, 4).map(t => (
                              <span key={t} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#64748b" }}>{t}</span>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 12 }}>
                          <a href={bk.url} target="_blank" rel="noopener noreferrer">
                            <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8, background: "linear-gradient(135deg,rgba(110,88,255,0.2),rgba(168,85,247,0.2))", border: "1px solid rgba(110,88,255,0.3)", color: "#a78bfa", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                              Apply <ArrowTopRightOnSquareIcon style={{ width: 12, height: 12 }} />
                            </button>
                          </a>
                          <button onClick={() => removeJob(bk.id)}
                            style={{ padding: "6px 8px", borderRadius: 8, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171", cursor: "pointer" }}>
                            <TrashIcon style={{ width: 13, height: 13 }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
