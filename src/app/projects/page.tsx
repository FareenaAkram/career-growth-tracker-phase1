"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowTopRightOnSquareIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  TrophyIcon,
  FireIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

// ── Design tokens ────────────────────────────────────────────────────────────
const panel: React.CSSProperties = {
  background: "rgba(10,16,32,0.65)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(16px)",
  borderRadius: 20,
  padding: 24,
};

type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type Tech = "HTML/CSS" | "JavaScript" | "React" | "TypeScript" | "Node.js" | "Python" | "CSS" | "General";

interface Project {
  id: string;
  title: string;
  description: string;
  platform: string;
  url: string;
  difficulty: Difficulty;
  tech: Tech[];
  tags: string[];
  xp: number;
  time: string;
  featured?: boolean;
}

const PROJECTS: Project[] = [
  // HTML/CSS
  { id: "p1", title: "NFT Preview Card", description: "Build a responsive NFT card component with hover overlay effect and smooth transitions.", platform: "Frontend Mentor", url: "https://www.frontendmentor.io/challenges/nft-preview-card-component-SbdUL_w0U", difficulty: "Beginner", tech: ["HTML/CSS"], tags: ["Card", "Hover Effect", "Responsive"], xp: 100, time: "2-4 hrs", featured: true },
  { id: "p2", title: "Product Landing Page", description: "Create a fully responsive product landing page that passes all the FreeCodeCamp accessibility tests.", platform: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/build-a-product-landing-page-project", difficulty: "Beginner", tech: ["HTML/CSS"], tags: ["Landing Page", "Forms", "Navigation"], xp: 150, time: "4-6 hrs" },
  { id: "p3", title: "Order Summary Card", description: "Build an order summary card component with clear pricing table and CTA buttons.", platform: "Frontend Mentor", url: "https://www.frontendmentor.io/challenges/order-summary-component-QlAlSqfQJ", difficulty: "Beginner", tech: ["HTML/CSS"], tags: ["UI Component", "Card"], xp: 80, time: "1-2 hrs" },
  { id: "p4", title: "Blog Preview Card", description: "Build a blog preview card component with author avatar, category tag, and publication date.", platform: "Frontend Mentor", url: "https://www.frontendmentor.io/challenges/blog-preview-card-ckPaj01IcS", difficulty: "Beginner", tech: ["HTML/CSS"], tags: ["Blog", "Card", "Typography"], xp: 80, time: "1-2 hrs" },

  // CSS
  { id: "p5", title: "Flexbox Froggy", description: "Help frogs get to their lily pads by writing CSS Flexbox code through 24 progressive levels.", platform: "Flexbox Froggy", url: "https://flexboxfroggy.com/", difficulty: "Beginner", tech: ["CSS"], tags: ["Flexbox", "Game", "Interactive"], xp: 120, time: "1-3 hrs", featured: true },
  { id: "p6", title: "CSS Grid Garden", description: "Learn CSS Grid by growing a garden through 28 interactive levels.", platform: "CSS Grid Garden", url: "https://cssgridgarden.com/", difficulty: "Beginner", tech: ["CSS"], tags: ["Grid", "Game", "Layout"], xp: 120, time: "1-3 hrs" },
  { id: "p7", title: "CSS Battle #1", description: "Replicate a target image using only CSS in the fewest characters possible.", platform: "CSS Battle", url: "https://cssbattle.dev/play/1", difficulty: "Intermediate", tech: ["CSS"], tags: ["CSS Art", "Challenge", "Optimization"], xp: 200, time: "30 min+" },
  { id: "p8", title: "100 Days CSS Challenge", description: "Complete daily CSS snippets and animations — a great way to build CSS muscle memory.", platform: "100 Days CSS", url: "https://100dayscss.com/", difficulty: "Intermediate", tech: ["CSS", "HTML/CSS"], tags: ["Animation", "Daily Challenge"], xp: 500, time: "Ongoing" },

  // JavaScript
  { id: "p9", title: "JavaScript30", description: "Build 30 things in 30 days with vanilla JavaScript — no frameworks, no libraries, just JS.", platform: "Wes Bos", url: "https://javascript30.com/", difficulty: "Intermediate", tech: ["JavaScript"], tags: ["Vanilla JS", "DOM", "Projects"], xp: 800, time: "30 days", featured: true },
  { id: "p10", title: "Implement Array.filter()", description: "Implement Array.prototype.filter from scratch without using the built-in method.", platform: "GreatFrontend", url: "https://www.greatfrontend.com/questions/javascript/array-filter", difficulty: "Intermediate", tech: ["JavaScript"], tags: ["Arrays", "Polyfill", "Interview"], xp: 150, time: "30-60 min" },
  { id: "p11", title: "Debounce Function", description: "Implement the debounce utility function with leading/trailing options from scratch.", platform: "GreatFrontend", url: "https://www.greatfrontend.com/questions/javascript/debounce", difficulty: "Intermediate", tech: ["JavaScript"], tags: ["Utilities", "Performance", "Interview"], xp: 200, time: "45-90 min" },
  { id: "p12", title: "Promise.all() Polyfill", description: "Implement Promise.all() that takes an array of promises and resolves when all complete.", platform: "GreatFrontend", url: "https://www.greatfrontend.com/questions/javascript/promise-all", difficulty: "Advanced", tech: ["JavaScript"], tags: ["Promises", "Async", "Interview"], xp: 300, time: "1-2 hrs" },
  { id: "p13", title: "JavaScript Calculator", description: "Build a fully functional calculator with keyboard support and expression history.", platform: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/front-end-development-libraries/front-end-development-libraries-projects/build-a-javascript-calculator", difficulty: "Intermediate", tech: ["JavaScript"], tags: ["Calculator", "DOM", "Events"], xp: 250, time: "4-8 hrs" },

  // React
  { id: "p14", title: "Star Rating Component", description: "Build an interactive star rating component with hover effects and click selection.", platform: "GreatFrontend", url: "https://www.greatfrontend.com/questions/user-interface/star-rating", difficulty: "Beginner", tech: ["React"], tags: ["Components", "Hooks", "UI"], xp: 150, time: "1-2 hrs", featured: true },
  { id: "p15", title: "Memory Match Game", description: "Build a memory matching card game using React state and useEffect hooks.", platform: "GreatFrontend", url: "https://www.greatfrontend.com/questions/user-interface/memory-game", difficulty: "Intermediate", tech: ["React"], tags: ["Games", "State", "useEffect"], xp: 300, time: "3-6 hrs" },
  { id: "p16", title: "Todo List App", description: "Build a fully featured todo app with filters, drag-and-drop, and localStorage persistence.", platform: "Frontend Mentor", url: "https://www.frontendmentor.io/challenges/todo-app-Su1_KokOW", difficulty: "Intermediate", tech: ["React"], tags: ["CRUD", "LocalStorage", "Filters"], xp: 350, time: "6-10 hrs" },
  { id: "p17", title: "Kanban Board App", description: "Full-featured Kanban board with drag-and-drop, modals, responsive layout, and dark mode.", platform: "Frontend Mentor", url: "https://www.frontendmentor.io/challenges/kanban-task-management-web-app-wgQLt-HlbB", difficulty: "Advanced", tech: ["React"], tags: ["DnD", "Complex State", "Dark Mode"], xp: 800, time: "20-40 hrs" },
  { id: "p18", title: "Multi-step Form", description: "Build a multi-step subscription form with validation, progress steps, and summary.", platform: "Frontend Mentor", url: "https://www.frontendmentor.io/challenges/multistep-form-YVAnSdqQBJ", difficulty: "Intermediate", tech: ["React"], tags: ["Forms", "Validation", "UX"], xp: 400, time: "8-15 hrs" },

  // TypeScript
  { id: "p19", title: "TypeHero Challenges", description: "Solve TypeScript type challenges ranging from beginner to extreme difficulty.", platform: "TypeHero", url: "https://typehero.dev/", difficulty: "Intermediate", tech: ["TypeScript"], tags: ["Types", "Generics", "Utility Types"], xp: 500, time: "Ongoing", featured: true },
  { id: "p20", title: "TypeScript Exercises", description: "18 progressive TypeScript exercises that cover types, generics, and advanced patterns.", platform: "TypeScript Exercises", url: "https://typescript-exercises.github.io/", difficulty: "Intermediate", tech: ["TypeScript"], tags: ["Exercises", "Types", "Patterns"], xp: 400, time: "5-10 hrs" },
  { id: "p21", title: "Type Challenges", description: "Collection of TypeScript type system challenges — the LeetCode of TypeScript types.", platform: "Type Challenges", url: "https://github.com/type-challenges/type-challenges", difficulty: "Advanced", tech: ["TypeScript"], tags: ["Advanced Types", "Conditional Types"], xp: 600, time: "Ongoing" },

  // Node.js
  { id: "p22", title: "REST API with Express", description: "Build a RESTful API with CRUD operations, authentication middleware, and error handling.", platform: "The Odin Project", url: "https://www.theodinproject.com/lessons/nodejs-express-101", difficulty: "Intermediate", tech: ["Node.js"], tags: ["API", "Express", "REST"], xp: 400, time: "8-15 hrs", featured: true },
  { id: "p23", title: "Real-time Chat App", description: "Build a real-time chat application using Node.js and Socket.io with rooms and usernames.", platform: "Socket.io Docs", url: "https://socket.io/get-started/chat", difficulty: "Intermediate", tech: ["Node.js"], tags: ["WebSockets", "Real-time", "Socket.io"], xp: 500, time: "10-20 hrs" },
  { id: "p24", title: "URL Shortener", description: "Build a URL shortener service with custom slugs, analytics, and link expiration.", platform: "Project-based", url: "https://www.theodinproject.com/paths/full-stack-javascript", difficulty: "Intermediate", tech: ["Node.js"], tags: ["API", "Database", "Auth"], xp: 400, time: "8-12 hrs" },

  // Python
  { id: "p25", title: "Python Exercises", description: "100 Python exercises covering data structures, algorithms, and problem solving.", platform: "Exercism", url: "https://exercism.org/tracks/python", difficulty: "Beginner", tech: ["Python"], tags: ["Exercises", "Algorithms", "Data Structures"], xp: 500, time: "Ongoing", featured: true },
  { id: "p26", title: "Build a Web Scraper", description: "Build a Python web scraper using requests and BeautifulSoup to extract and store data.", platform: "Real Python", url: "https://realpython.com/beautiful-soup-web-scraper-python/", difficulty: "Intermediate", tech: ["Python"], tags: ["Scraping", "BeautifulSoup", "Data"], xp: 300, time: "4-8 hrs" },

  // General
  { id: "p27", title: "LeetCode Top 150", description: "Solve the top 150 interview questions on LeetCode — a must for any developer job search.", platform: "LeetCode", url: "https://leetcode.com/studyplan/top-interview-150/", difficulty: "Intermediate", tech: ["General"], tags: ["Algorithms", "DSA", "Interview"], xp: 1000, time: "Ongoing", featured: true },
  { id: "p28", title: "Build a CLI Tool", description: "Build a command-line tool in your language of choice — file organizer, code formatter, or task manager.", platform: "Project-based", url: "https://www.theodinproject.com/", difficulty: "Intermediate", tech: ["General"], tags: ["CLI", "Open Source", "Tools"], xp: 350, time: "5-10 hrs" },
];

const TECHS: { id: Tech | "All"; label: string; color: string }[] = [
  { id: "All", label: "All", color: "#6E58FF" },
  { id: "HTML/CSS", label: "HTML/CSS", color: "#e34c26" },
  { id: "CSS", label: "CSS", color: "#264de4" },
  { id: "JavaScript", label: "JavaScript", color: "#f0c400" },
  { id: "React", label: "React", color: "#61dafb" },
  { id: "TypeScript", label: "TypeScript", color: "#3178c6" },
  { id: "Node.js", label: "Node.js", color: "#68a063" },
  { id: "Python", label: "Python", color: "#3776ab" },
  { id: "General", label: "General", color: "#a855f7" },
];

const DIFFICULTIES: { id: Difficulty | "All"; label: string }[] = [
  { id: "All", label: "All Levels" },
  { id: "Beginner", label: "Beginner" },
  { id: "Intermediate", label: "Intermediate" },
  { id: "Advanced", label: "Advanced" },
];

const difficultyColors: Record<Difficulty, { color: string; bg: string }> = {
  Beginner:     { color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  Intermediate: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  Advanced:     { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
};

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [tech, setTech] = useState<Tech | "All">("All");
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const filtered = useMemo(() => PROJECTS.filter(p => {
    if (tech !== "All" && !p.tech.includes(tech as Tech)) return false;
    if (difficulty !== "All" && p.difficulty !== difficulty) return false;
    if (featuredOnly && !p.featured) return false;
    if (query && !p.title.toLowerCase().includes(query.toLowerCase()) && !p.description.toLowerCase().includes(query.toLowerCase()) && !p.tags.join(" ").toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }), [tech, difficulty, featuredOnly, query]);

  const totalXp = filtered.reduce((s, p) => s + p.xp, 0);

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 className="text-4xl font-bold" style={{ background: "linear-gradient(135deg,#60a5fa,#818cf8,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 8 }}>
            Project Library
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 15 }}>Curated real-world projects from LeetCode, GreatFrontend, Frontend Mentor and more.</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Total Projects", value: PROJECTS.length, color: "#6E58FF", emoji: "📦" },
            { label: "Showing", value: filtered.length, color: "#22c55e", emoji: "🎯" },
            { label: "Total XP Available", value: `${totalXp.toLocaleString()} XP`, color: "#f59e0b", emoji: "⚡" },
            { label: "Platforms", value: "8+", color: "#61dafb", emoji: "🌐" },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(10,16,32,0.65)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", borderRadius: 16, padding: "16px 18px" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.emoji}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={panel}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{ position: "relative", flex: "1 1 180px" }}>
              <MagnifyingGlassIcon style={{ width: 15, height: 15, color: "#64748b", position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search projects, tags…"
                style={{ width: "100%", padding: "9px 14px 9px 34px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>

            {/* Difficulty */}
            <div style={{ display: "flex", gap: 5, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: 3 }}>
              {DIFFICULTIES.map(d => (
                <button key={d.id} onClick={() => setDifficulty(d.id)}
                  style={{ padding: "6px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                    background: difficulty === d.id ? "rgba(255,255,255,0.1)" : "transparent",
                    color: difficulty === d.id ? "white" : "#64748b", border: "1px solid transparent" }}>
                  {d.label}
                </button>
              ))}
            </div>

            {/* Featured toggle */}
            <button onClick={() => setFeaturedOnly(f => !f)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                background: featuredOnly ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.04)",
                border: featuredOnly ? "1px solid rgba(245,158,11,0.3)" : "1px solid rgba(255,255,255,0.1)",
                color: featuredOnly ? "#f59e0b" : "#64748b", fontFamily: "inherit" }}>
              <TrophyIcon style={{ width: 13, height: 13 }} /> Featured
            </button>
          </div>

          {/* Tech filter */}
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            {TECHS.map(t => (
              <button key={t.id} onClick={() => setTech(t.id)}
                style={{ padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                  background: tech === t.id ? `${t.color}15` : "rgba(255,255,255,0.03)",
                  border: tech === t.id ? `1px solid ${t.color}40` : "1px solid rgba(255,255,255,0.06)",
                  color: tech === t.id ? t.color : "#64748b", fontFamily: "inherit" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects grid */}
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
          {filtered.map((p, i) => {
            const dc = difficultyColors[p.difficulty];
            const techColor = TECHS.find(t => t.id === p.tech[0])?.color ?? "#6E58FF";
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.025, 0.1) }}>
                <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
                  <div style={{ background: "rgba(10,16,32,0.65)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", borderRadius: 18, padding: 20, height: "100%", boxSizing: "border-box", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = `${techColor}40`; el.style.transform = "translateY(-3px)"; el.style.boxShadow = `0 12px 40px ${techColor}12`; }}
                    onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "rgba(255,255,255,0.08)"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}>

                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div style={{ flex: 1 }}>
                        {p.featured && (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: "#f59e0b", marginBottom: 6 }}>
                            <TrophyIcon style={{ width: 11, height: 11 }} /> FEATURED
                          </div>
                        )}
                        <div style={{ fontSize: 15, fontWeight: 700, color: "white", lineHeight: 1.3 }}>{p.title}</div>
                      </div>
                      <ArrowTopRightOnSquareIcon style={{ width: 15, height: 15, color: "#475569", flexShrink: 0, marginLeft: 8, marginTop: 2 }} />
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6, marginBottom: 14 }}>{p.description}</p>

                    {/* Tags */}
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
                      {p.tags.map(tag => (
                        <span key={tag} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#64748b" }}>{tag}</span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ display: "flex", gap: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 99, background: dc.bg, color: dc.color }}>{p.difficulty}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
                          <ClockIcon style={{ width: 12, height: 12 }} /> {p.time}
                        </div>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b" }}>⚡ {p.xp} XP</div>
                    </div>

                    <div style={{ marginTop: 10, fontSize: 11, color: techColor, fontWeight: 600 }}>📌 {p.platform}</div>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#94a3b8" }}>No projects found</div>
            <div style={{ fontSize: 13, color: "#475569", marginTop: 6 }}>Try adjusting your filters.</div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
