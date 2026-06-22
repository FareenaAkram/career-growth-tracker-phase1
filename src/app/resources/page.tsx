"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon,
  BookOpenIcon,
  PlayCircleIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";

// ── Design tokens ────────────────────────────────────────────────────────────
const panel: React.CSSProperties = {
  background: "rgba(10,16,32,0.65)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(16px)",
  borderRadius: 20,
  padding: 24,
};

type RType = "Documentation" | "Course" | "Video" | "Book" | "Blog" | "Tool";
type RTech = "All" | "HTML/CSS" | "JavaScript" | "React" | "TypeScript" | "Node.js" | "Python" | "CSS" | "General";

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: RType;
  tech: RTech[];
  free: boolean;
  rating: number;
  author?: string;
  featured?: boolean;
}

const RESOURCES: Resource[] = [
  // Documentation
  { id: "r1", title: "MDN Web Docs", description: "The definitive reference for HTML, CSS, and JavaScript. Every web developer's bible for accurate, up-to-date documentation.", url: "https://developer.mozilla.org/", type: "Documentation", tech: ["HTML/CSS", "JavaScript", "CSS"], free: true, rating: 5, featured: true },
  { id: "r2", title: "React Documentation", description: "The official React docs — completely rewritten with interactive examples, hooks deep-dives, and best practices.", url: "https://react.dev/", type: "Documentation", tech: ["React"], free: true, rating: 5, featured: true },
  { id: "r3", title: "TypeScript Handbook", description: "Official TypeScript documentation covering type system basics, generics, utility types, and configuration.", url: "https://www.typescriptlang.org/docs/handbook/intro.html", type: "Documentation", tech: ["TypeScript"], free: true, rating: 5 },
  { id: "r4", title: "Node.js Docs", description: "Official Node.js documentation with API reference, guides, and best practices for server-side JavaScript.", url: "https://nodejs.org/docs/latest/api/", type: "Documentation", tech: ["Node.js"], free: true, rating: 4 },
  { id: "r5", title: "CSS-Tricks Almanac", description: "Complete reference for every CSS property and selector with examples and browser compatibility tables.", url: "https://css-tricks.com/almanac/", type: "Documentation", tech: ["CSS", "HTML/CSS"], free: true, rating: 4, author: "CSS-Tricks" },

  // Courses
  { id: "r6", title: "The Odin Project", description: "A free, open-source full-stack curriculum. Covers HTML, CSS, JavaScript, React, Node.js — project-based learning all the way.", url: "https://www.theodinproject.com/", type: "Course", tech: ["HTML/CSS", "JavaScript", "React", "Node.js"], free: true, rating: 5, featured: true },
  { id: "r7", title: "freeCodeCamp", description: "600+ hours of interactive coding lessons with certifications in responsive web design, JavaScript, React, and more.", url: "https://www.freecodecamp.org/", type: "Course", tech: ["HTML/CSS", "JavaScript", "React", "Python"], free: true, rating: 5, featured: true },
  { id: "r8", title: "Scrimba — Learn React", description: "Interactive coding environment where you can edit the instructor's code directly. Best React course for hands-on learners.", url: "https://scrimba.com/learn/learnreact", type: "Course", tech: ["React"], free: false, rating: 5, author: "Scrimba" },
  { id: "r9", title: "Full Stack Open", description: "University of Helsinki's free deep-dive into modern web development — React, Node, MongoDB, TypeScript, GraphQL.", url: "https://fullstackopen.com/en/", type: "Course", tech: ["React", "Node.js", "TypeScript"], free: true, rating: 5, author: "University of Helsinki" },
  { id: "r10", title: "Frontend Masters", description: "Premium video courses taught by industry experts. Covers React, TypeScript, CSS, performance, and everything frontend.", url: "https://frontendmasters.com/", type: "Course", tech: ["JavaScript", "React", "TypeScript", "CSS"], free: false, rating: 5, author: "Various Experts" },
  { id: "r11", title: "JavaScript.info", description: "The Modern JavaScript Tutorial — covers everything from basics to advanced topics like prototypes and async/await, beautifully written.", url: "https://javascript.info/", type: "Course", tech: ["JavaScript"], free: true, rating: 5, featured: true, author: "Ilya Kantor" },
  { id: "r12", title: "CS50x — Harvard", description: "Harvard's legendary intro to computer science — teaches problem-solving, algorithms, and programming fundamentals.", url: "https://cs50.harvard.edu/x/", type: "Course", tech: ["General", "Python"], free: true, rating: 5, author: "David Malan" },

  // Videos / YouTube
  { id: "r13", title: "Fireship", description: "High-quality, fast-paced YouTube channel covering modern web dev — React, TypeScript, Next.js, and tech news.", url: "https://www.youtube.com/@Fireship", type: "Video", tech: ["JavaScript", "React", "TypeScript"], free: true, rating: 5, author: "Jeff Delaney", featured: true },
  { id: "r14", title: "Kevin Powell — CSS", description: "The best YouTube channel for mastering CSS. Kevin makes complex layout concepts simple and approachable.", url: "https://www.youtube.com/@KevinPowell", type: "Video", tech: ["CSS", "HTML/CSS"], free: true, rating: 5, author: "Kevin Powell" },
  { id: "r15", title: "Traversy Media", description: "Brad Traversy's comprehensive crash courses on every web technology — great starting points for any new topic.", url: "https://www.youtube.com/@TraversyMedia", type: "Video", tech: ["JavaScript", "React", "Node.js", "HTML/CSS"], free: true, rating: 4, author: "Brad Traversy" },
  { id: "r16", title: "Jack Herrington", description: "Advanced React and TypeScript patterns, micro-frontends, and modern architecture concepts for senior developers.", url: "https://www.youtube.com/@jherr", type: "Video", tech: ["React", "TypeScript"], free: true, rating: 5, author: "Jack Herrington" },
  { id: "r17", title: "Theo — t3.gg", description: "Opinionated takes on modern TypeScript, React, and the T3 stack. Keeps you up to date with the ecosystem.", url: "https://www.youtube.com/@t3dotgg", type: "Video", tech: ["TypeScript", "React"], free: true, rating: 4, author: "Theo Browne" },
  { id: "r18", title: "Web Dev Simplified", description: "Explains complex web dev concepts simply. Great for beginners learning JavaScript, React, and CSS fundamentals.", url: "https://www.youtube.com/@WebDevSimplified", type: "Video", tech: ["JavaScript", "React", "CSS"], free: true, rating: 4, author: "Kyle Cook" },

  // Books
  { id: "r19", title: "Eloquent JavaScript", description: "A comprehensive JavaScript book that teaches programming concepts through JavaScript. Available free online.", url: "https://eloquentjavascript.net/", type: "Book", tech: ["JavaScript"], free: true, rating: 5, author: "Marijn Haverbeke", featured: true },
  { id: "r20", title: "You Don't Know JS", description: "Deep dive into the core mechanisms of JavaScript — scope, closures, 'this', types, async patterns.", url: "https://github.com/getify/You-Dont-Know-JS", type: "Book", tech: ["JavaScript"], free: true, rating: 5, author: "Kyle Simpson" },
  { id: "r21", title: "CSS Secrets", description: "Lesser-known CSS techniques and practical solutions to common design problems by CSS specification editor Lea Verou.", url: "https://www.oreilly.com/library/view/css-secrets/9781449372736/", type: "Book", tech: ["CSS"], free: false, rating: 5, author: "Lea Verou" },
  { id: "r22", title: "Clean Code", description: "Timeless principles for writing clean, readable, and maintainable code. A must-read for every professional developer.", url: "https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882", type: "Book", tech: ["General"], free: false, rating: 5, author: "Robert C. Martin" },

  // Blogs
  { id: "r23", title: "CSS-Tricks", description: "Beloved web design blog with tutorials, guides, and almanac. Particularly strong for CSS layout and design patterns.", url: "https://css-tricks.com/", type: "Blog", tech: ["CSS", "HTML/CSS", "JavaScript"], free: true, rating: 5, author: "CSS-Tricks Team", featured: true },
  { id: "r24", title: "web.dev by Google", description: "Google's official web development blog — performance, Core Web Vitals, progressive enhancement, and best practices.", url: "https://web.dev/", type: "Blog", tech: ["General", "JavaScript"], free: true, rating: 5, author: "Google" },
  { id: "r25", title: "Smashing Magazine", description: "Professional web design and development articles — UX, accessibility, React, CSS, and workflow tools.", url: "https://www.smashingmagazine.com/", type: "Blog", tech: ["General", "CSS", "React"], free: true, rating: 4 },
  { id: "r26", title: "Josh Comeau's Blog", description: "Beautiful interactive blog posts with deep dives into CSS, React, and JavaScript — some of the best writing in the space.", url: "https://www.joshwcomeau.com/", type: "Blog", tech: ["CSS", "React", "JavaScript"], free: true, rating: 5, author: "Josh Comeau", featured: true },
  { id: "r27", title: "Kent C. Dodds Blog", description: "Testing, React patterns, and epic web development insights from a top-tier educator and author.", url: "https://kentcdodds.com/blog", type: "Blog", tech: ["React", "JavaScript", "TypeScript"], free: true, rating: 5, author: "Kent C. Dodds" },

  // Tools
  { id: "r28", title: "Can I Use", description: "Check browser compatibility for any HTML, CSS, or JS feature before using it in production.", url: "https://caniuse.com/", type: "Tool", tech: ["HTML/CSS", "JavaScript", "CSS"], free: true, rating: 5 },
  { id: "r29", title: "CodePen", description: "Online code editor for front-end snippets. Great for experimenting with CSS, React, and HTML/CSS interactions.", url: "https://codepen.io/", type: "Tool", tech: ["HTML/CSS", "JavaScript", "CSS", "React"], free: true, rating: 4 },
  { id: "r30", title: "StackBlitz", description: "Full online IDE for Node.js and web projects. Instant dev environments with full npm support right in the browser.", url: "https://stackblitz.com/", type: "Tool", tech: ["JavaScript", "React", "TypeScript", "Node.js"], free: true, rating: 5, featured: true },
];

const TYPE_ICONS: Record<RType, any> = {
  Documentation: BookOpenIcon,
  Course:        AcademicCapIcon,
  Video:         PlayCircleIcon,
  Book:          BookOpenIcon,
  Blog:          DocumentTextIcon,
  Tool:          StarIcon,
};

const TYPE_COLORS: Record<RType, { color: string; bg: string }> = {
  Documentation: { color: "#6E58FF", bg: "rgba(110,88,255,0.12)" },
  Course:        { color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  Video:         { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
  Book:          { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  Blog:          { color: "#61dafb", bg: "rgba(97,218,251,0.12)" },
  Tool:          { color: "#a855f7", bg: "rgba(168,85,247,0.12)" },
};

const TYPES: (RType | "All")[] = ["All", "Documentation", "Course", "Video", "Book", "Blog", "Tool"];
const TECHS: RTech[] = ["All", "HTML/CSS", "CSS", "JavaScript", "React", "TypeScript", "Node.js", "Python", "General"];

export default function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<RType | "All">("All");
  const [tech, setTech] = useState<RTech>("All");
  const [freeOnly, setFreeOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const filtered = useMemo(() => RESOURCES.filter(r => {
    if (type !== "All" && r.type !== type) return false;
    if (tech !== "All" && !r.tech.includes(tech)) return false;
    if (freeOnly && !r.free) return false;
    if (featuredOnly && !r.featured) return false;
    if (query && !r.title.toLowerCase().includes(query.toLowerCase()) && !r.description.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }), [type, tech, freeOnly, featuredOnly, query]);

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 className="text-4xl font-bold" style={{ background: "linear-gradient(135deg,#60a5fa,#818cf8,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", marginBottom: 8 }}>
            Resource Library
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 15 }}>Hand-picked documentation, courses, videos, books and blogs from across the web.</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Total Resources", value: RESOURCES.length, color: "#6E58FF", emoji: "📚" },
            { label: "Free Resources", value: RESOURCES.filter(r => r.free).length, color: "#22c55e", emoji: "🆓" },
            { label: "Showing", value: filtered.length, color: "#f59e0b", emoji: "🎯" },
            { label: "Categories", value: 6, color: "#61dafb", emoji: "🗂️" },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(10,16,32,0.65)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", borderRadius: 16, padding: "16px 18px" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.emoji}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ ...panel, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
            <div style={{ position: "relative", flex: "1 1 200px" }}>
              <MagnifyingGlassIcon style={{ width: 15, height: 15, color: "#64748b", position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search resources…"
                style={{ width: "100%", padding: "9px 14px 9px 34px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
            <button onClick={() => setFreeOnly(f => !f)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", background: freeOnly ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.04)", border: freeOnly ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(255,255,255,0.1)", color: freeOnly ? "#4ade80" : "#64748b", fontFamily: "inherit" }}>
              🆓 Free Only
            </button>
            <button onClick={() => setFeaturedOnly(f => !f)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", background: featuredOnly ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.04)", border: featuredOnly ? "1px solid rgba(245,158,11,0.3)" : "1px solid rgba(255,255,255,0.1)", color: featuredOnly ? "#f59e0b" : "#64748b", fontFamily: "inherit" }}>
              ⭐ Featured
            </button>
          </div>

          {/* Type tabs */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {TYPES.map(t => {
              const tc = t !== "All" ? TYPE_COLORS[t as RType] : { color: "#6E58FF", bg: "rgba(110,88,255,0.12)" };
              const TypeIcon = t !== "All" ? TYPE_ICONS[t as RType] : BookOpenIcon;
              return (
                <button key={t} onClick={() => setType(t)}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                    background: type === t ? tc.bg : "rgba(255,255,255,0.03)",
                    border: type === t ? `1px solid ${tc.color}40` : "1px solid rgba(255,255,255,0.06)",
                    color: type === t ? tc.color : "#64748b", fontFamily: "inherit" }}>
                  {t !== "All" && <TypeIcon style={{ width: 12, height: 12 }} />} {t}
                </button>
              );
            })}
          </div>

          {/* Tech filter */}
          <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
            {TECHS.map(t => (
              <button key={t} onClick={() => setTech(t)}
                style={{ padding: "5px 12px", borderRadius: 99, fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                  background: tech === t ? "rgba(110,88,255,0.12)" : "rgba(255,255,255,0.02)",
                  border: tech === t ? "1px solid rgba(110,88,255,0.3)" : "1px solid rgba(255,255,255,0.05)",
                  color: tech === t ? "#a78bfa" : "#475569", fontFamily: "inherit" }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Resource grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(330px,1fr))", gap: 16 }}>
          {filtered.map((r, i) => {
            const tc = TYPE_COLORS[r.type];
            const TypeIcon = TYPE_ICONS[r.type];
            return (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.025, 0.1) }}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", height: "100%" }}>
                  <div style={{ background: "rgba(10,16,32,0.65)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", borderRadius: 18, padding: 20, height: "100%", boxSizing: "border-box", cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column" }}
                    onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = `${tc.color}40`; el.style.transform = "translateY(-3px)"; el.style.boxShadow = `0 12px 36px ${tc.color}12`; }}
                    onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "rgba(255,255,255,0.08)"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}>

                    {/* Header */}
                    <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: tc.bg, border: `1px solid ${tc.color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <TypeIcon style={{ width: 20, height: 20, color: tc.color }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            {r.featured && <div style={{ fontSize: 10, color: "#f59e0b", fontWeight: 700, marginBottom: 3 }}>⭐ FEATURED</div>}
                            <div style={{ fontSize: 14, fontWeight: 700, color: "white", lineHeight: 1.3 }}>{r.title}</div>
                          </div>
                          <ArrowTopRightOnSquareIcon style={{ width: 14, height: 14, color: "#475569", flexShrink: 0, marginLeft: 8 }} />
                        </div>
                        {r.author && <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>by {r.author}</div>}
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.65, flex: 1 }}>{r.description}</p>

                    {/* Footer */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: tc.bg, color: tc.color }}>{r.type}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: r.free ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.05)", color: r.free ? "#4ade80" : "#64748b" }}>{r.free ? "Free" : "Paid"}</span>
                      </div>
                      <div style={{ display: "flex", gap: 1 }}>
                        {Array.from({ length: 5 }).map((_, idx) => (
                          idx < r.rating
                            ? <StarSolid key={idx} style={{ width: 12, height: 12, color: "#f59e0b" }} />
                            : <StarIcon key={idx} style={{ width: 12, height: 12, color: "#374151" }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#94a3b8" }}>No resources found</div>
            <div style={{ fontSize: 13, color: "#475569", marginTop: 6 }}>Try clearing some filters.</div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
