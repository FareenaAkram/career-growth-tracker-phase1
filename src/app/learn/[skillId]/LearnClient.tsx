"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getNodeById, type RoadmapNode } from "@/data/careers";
import { useAppStore } from "@/store/useAppStore";
import {
  BookOpenIcon, CodeBracketIcon, QuestionMarkCircleIcon, FolderOpenIcon,
  ChevronRightIcon, ChevronLeftIcon, SparklesIcon, ArrowTopRightOnSquareIcon,
  CheckCircleIcon, LightBulbIcon, ClipboardDocumentIcon, PlayIcon,
  TrophyIcon, ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckSolid } from "@heroicons/react/24/solid";
import { FaHtml5, FaJs, FaReact, FaCss3Alt, FaPython, FaNodeJs } from "react-icons/fa";
import { SiTypescript } from "react-icons/si";
import { ComputerDesktopIcon, RocketLaunchIcon, ServerIcon, CodeBracketIcon as CodeBracketSolid } from "@heroicons/react/24/solid";

// ── Design tokens ────────────────────────────────────────────────────────────
const panel: React.CSSProperties = {
  background: "rgba(10,16,32,0.65)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(16px)",
  borderRadius: 20,
  padding: 24,
};

type Tab = "concept" | "practice" | "quiz" | "projects";

// ── Icon helper ──────────────────────────────────────────────────────────────
function getIconCfg(node: RoadmapNode) {
  const t = (node.title + " " + node.skills.join(" ")).toLowerCase();
  if (t.includes("html"))      return { Icon: FaHtml5,    isRI: true,  color: "#e34c26", bg: "rgba(227,76,38,0.18)" };
  if (t.includes("javascript") || t.includes("dom")) return { Icon: FaJs, isRI: true, color: "#f0c400", bg: "rgba(240,196,0,0.18)" };
  if (t.includes("react"))     return { Icon: FaReact,    isRI: true,  color: "#61dafb", bg: "rgba(97,218,251,0.18)" };
  if (t.includes("typescript")) return { Icon: SiTypescript, isRI: true, color: "#3178c6", bg: "rgba(49,120,198,0.18)" };
  if (t.includes("python"))    return { Icon: FaPython,   isRI: true,  color: "#3776ab", bg: "rgba(55,118,171,0.18)" };
  if (t.includes("node") || t.includes("backend")) return { Icon: FaNodeJs, isRI: true, color: "#68a063", bg: "rgba(104,160,99,0.18)" };
  if (t.includes("css"))       return { Icon: FaCss3Alt,  isRI: true,  color: "#264de4", bg: "rgba(38,77,228,0.18)" };
  if (t.includes("responsive")) return { Icon: ComputerDesktopIcon, isRI: false, color: "#a855f7", bg: "rgba(168,85,247,0.18)" };
  if (t.includes("performance") || t.includes("architecture")) return { Icon: RocketLaunchIcon, isRI: false, color: "#f59e0b", bg: "rgba(245,158,11,0.18)" };
  if (t.includes("api") || t.includes("state")) return { Icon: ServerIcon, isRI: false, color: "#14b8a6", bg: "rgba(20,184,166,0.18)" };
  return { Icon: CodeBracketSolid, isRI: false, color: "#6E58FF", bg: "rgba(110,88,255,0.18)" };
}

// YouTube video IDs per topic
const VIDEO_MAP: Record<string, string> = {
  "html":        "qz0aGYrrlhU",
  "css":         "1Rs2ND1ryYc",
  "javascript":  "hdI2bqOjy3c",
  "react":       "w7ejDZ8SWv8",
  "typescript":  "BwuLxPi-BtI",
  "python":      "rfscVS0vtbw",
  "node":        "fBNz5xF-Kx4",
  "responsive":  "srvUrASNj0s",
  "performance": "0fONene3OIA",
  "state":       "35lXWfirsGQ",
  "api":         "35lXWfirsGQ",
};
function getVideoId(node: RoadmapNode): string {
  const t = (node.title + " " + node.skills.join(" ")).toLowerCase();
  for (const [key, vid] of Object.entries(VIDEO_MAP)) {
    if (t.includes(key)) return vid;
  }
  return "qz0aGYrrlhU";
}

// Rich concept content
function buildConcept(node: RoadmapNode) {
  const examples: Record<string, string> = {
    "HTML & CSS Fundamentals": `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <title>My First Page</title>\n    <link rel="stylesheet" href="styles.css">\n  </head>\n  <body>\n    <h1 class="title">Hello World!</h1>\n    <p>Welcome to HTML & CSS.</p>\n  </body>\n</html>`,
    "JavaScript Basics": `// Variables and functions\nconst greet = (name) => {\n  return \`Hello, \${name}!\`;\n};\n\n// Arrays and loops\nconst skills = ['HTML', 'CSS', 'JavaScript'];\nskills.forEach(skill => {\n  console.log(greet(skill));\n});`,
    "React Fundamentals": `import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(c => c + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}`,
    "TypeScript Essentials": `// Typed interfaces\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\n// Generic functions\nfunction getFirst<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\n\nconst users: User[] = [{ id: 1, name: 'Alice', email: 'alice@example.com' }];\nconsole.log(getFirst(users));`,
    "Responsive Design": `/* Mobile-first approach */\n.container {\n  width: 100%;\n  padding: 1rem;\n}\n\n/* Tablet */\n@media (min-width: 768px) {\n  .container { max-width: 768px; }\n}\n\n/* Desktop */\n@media (min-width: 1024px) {\n  .container { max-width: 1200px; }\n}`,
  };
  const code = examples[node.title] ?? `// ${node.title} example\nconsole.log("Learning ${node.title}!");`;
  return {
    overview: node.description ?? `${node.title} is a core skill in modern development. Master these concepts to level up your career.`,
    keyPoints: node.skills.map((s, i) => ({
      title: s,
      desc: [
        `Understand the core principles of ${s} and how they apply to real-world projects.`,
        `Practice ${s} through hands-on exercises and build muscle memory.`,
        `Apply ${s} in your projects to reinforce learning and showcase your skills.`,
        `Study best practices for ${s} used in production codebases.`,
      ][i % 4],
    })),
    tip: `Start by building a tiny project using just ${node.skills[0] ?? node.title}. Real projects accelerate learning 10× faster than tutorials alone.`,
    code,
    resources: node.resources ?? [],
  };
}

// Quiz questions
function buildQuiz(node: RoadmapNode) {
  return node.skills.slice(0, 4).map((skill) => ({
    q: `What best describes the role of ${skill} in ${node.title}?`,
    options: [
      `It provides the core functionality needed to implement ${node.title} features`,
      `It is an optional enhancement only used in advanced projects`,
      `It is a deprecated technology replaced by newer alternatives`,
      `It is only relevant when working with backend systems`,
    ],
    answer: 0,
    explanation: `${skill} is a fundamental building block of ${node.title}. Understanding it deeply allows you to build reliable, maintainable applications.`,
  }));
}

// Practice challenges
function buildChallenges(node: RoadmapNode) {
  return node.skills.slice(0, 3).map((skill, i) => ({
    title: `Challenge ${i + 1}: ${skill}`,
    description: `Write a working implementation that demonstrates your understanding of ${skill}. Focus on clarity and correctness.`,
    starter: `// Your ${skill} implementation here\n// Tip: Think about the core concept first\n\n`,
    hint: `Break the problem down — what does ${skill} need to accomplish? Start simple, then add complexity.`,
  }));
}

// Real project links per topic
const PROJECT_MAP: Record<string, { title: string; platform: string; url: string; difficulty: string; description: string }[]> = {
  html: [
    { title: "Build a Product Landing Page", platform: "Frontend Mentor", url: "https://www.frontendmentor.io/challenges/product-landing-page-RVooqkQnP", difficulty: "Beginner", description: "Create a product landing page that passes all the FreeCodeCamp tests." },
    { title: "Personal Portfolio Webpage", platform: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/build-a-personal-portfolio-webpage-project", difficulty: "Beginner", description: "Build a portfolio page with working navigation and project cards." },
    { title: "NFT Preview Card", platform: "Frontend Mentor", url: "https://www.frontendmentor.io/challenges/nft-preview-card-component-SbdUL_w0U", difficulty: "Beginner", description: "Build an NFT card with a hover overlay effect." },
  ],
  javascript: [
    { title: "Build a JavaScript Calculator", platform: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/front-end-development-libraries/front-end-development-libraries-projects/build-a-javascript-calculator", difficulty: "Intermediate", description: "Create a fully functional calculator with keyboard support." },
    { title: "Implement Array Methods", platform: "GreatFrontend", url: "https://www.greatfrontend.com/questions/javascript/array-filter", difficulty: "Intermediate", description: "Implement Array.prototype.filter, map, and reduce from scratch." },
    { title: "Debounce Function", platform: "GreatFrontend", url: "https://www.greatfrontend.com/questions/javascript/debounce", difficulty: "Intermediate", description: "Implement the debounce utility function from scratch." },
  ],
  react: [
    { title: "Build a Kanban Board", platform: "Frontend Mentor", url: "https://www.frontendmentor.io/challenges/kanban-task-management-web-app-wgQLt-HlbB", difficulty: "Advanced", description: "Full-featured Kanban with drag-and-drop, modals, and local storage." },
    { title: "Memory Card Game", platform: "GreatFrontend", url: "https://www.greatfrontend.com/questions/user-interface/memory-game", difficulty: "Intermediate", description: "Build a memory matching card game with React hooks." },
    { title: "Star Rating Component", platform: "GreatFrontend", url: "https://www.greatfrontend.com/questions/user-interface/star-rating", difficulty: "Beginner", description: "Build an interactive star rating component in React." },
  ],
  typescript: [
    { title: "Type Gymnastics", platform: "TypeHero", url: "https://typehero.dev/", difficulty: "Intermediate", description: "Solve TypeScript type challenges similar to LeetCode for types." },
    { title: "Implement Utility Types", platform: "GreatFrontend", url: "https://www.greatfrontend.com/questions/javascript/type-utilities", difficulty: "Advanced", description: "Implement Partial, Required, Pick, and Omit from scratch." },
    { title: "Build a Typed API Client", platform: "TypeScript Exercises", url: "https://typescript-exercises.github.io/", difficulty: "Intermediate", description: "Work through 18 progressive TypeScript exercises." },
  ],
  css: [
    { title: "CSS Battle Challenges", platform: "CSS Battle", url: "https://cssbattle.dev/", difficulty: "Intermediate", description: "Replicate target images using only CSS in the fewest characters." },
    { title: "Grid Layout Challenges", platform: "CSS Grid Garden", url: "https://cssgridgarden.com/", difficulty: "Beginner", description: "Learn CSS Grid by growing a garden through 28 levels." },
    { title: "Flexbox Froggy", platform: "Flexbox Froggy", url: "https://flexboxfroggy.com/", difficulty: "Beginner", description: "Help frogs get to their lily pads using Flexbox properties." },
  ],
};

function getProjects(node: RoadmapNode) {
  const t = (node.title + " " + node.skills.join(" ")).toLowerCase();
  for (const [key, projs] of Object.entries(PROJECT_MAP)) {
    if (t.includes(key)) return projs;
  }
  return PROJECT_MAP.javascript;
}

// Progress Ring
function Ring({ pct, size = 64, stroke = 6, color = "#6E58FF" }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.2, fontWeight: 800, color: "white" }}>{pct}%</span>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function LearnClient({ nodeId }: { nodeId: string }) {
  const result = getNodeById(nodeId);
  const [tab, setTab] = useState<Tab>("concept");
  const progress        = useAppStore((s) => s.progress);
  const toggleMilestone = useAppStore((s) => s.toggleMilestone);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [note, setNote] = useState("");
  const [codeValues, setCodeValues] = useState<Record<number, string>>({});
  const [copied, setCopied] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);

  useEffect(() => {
    try { setNote(localStorage.getItem(`cgt-note-${nodeId}`) || ""); } catch {}
  }, [nodeId]);

  if (!result) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
      <div style={{ textAlign: "center", color: "#94a3b8" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>Skill not found</div>
        <Link href="/learning" style={{ color: "#6E58FF", fontSize: 14, marginTop: 8, display: "block" }}>← Back to Learning Hub</Link>
      </div>
    </div>
  );

  const { career, node, stage } = result;
  const progKey = `${career.id}__${node.id}`;
  const doneIds = progress[progKey] ?? [];
  const totalMs = node.milestones.length;
  const doneMs = doneIds.length;
  const nodePct = totalMs > 0 ? Math.round((doneMs / totalMs) * 100) : 0;

  const allNodes = [...career.roadmap.beginner, ...career.roadmap.intermediate, ...career.roadmap.advanced];
  const currentIdx = allNodes.findIndex(n => n.id === nodeId);
  const prevNode = currentIdx > 0 ? allNodes[currentIdx - 1] : null;
  const nextNode = currentIdx < allNodes.length - 1 ? allNodes[currentIdx + 1] : null;

  const totalAll = allNodes.reduce((s, n) => s + n.milestones.length, 0);
  const doneAll = allNodes.reduce((s, n) => s + (progress[`${career.id}__${n.id}`] ?? []).length, 0);
  const careerPct = totalAll > 0 ? Math.round((doneAll / totalAll) * 100) : 0;

  function toggleMs(mid: string) {
    toggleMilestone(career.id, node.id, mid);
  }

  const { Icon, isRI, color, bg } = getIconCfg(node);
  const concept = buildConcept(node);
  const questions = buildQuiz(node);
  const challenges = buildChallenges(node);
  const projects = getProjects(node);
  const videoId = getVideoId(node);

  const quizScore = quizSubmitted
    ? questions.reduce((s, q, i) => s + (quizAnswers[i] === q.answer ? 1 : 0), 0)
    : 0;

  const tabList: { id: Tab; label: string; Icon: any }[] = [
    { id: "concept",   label: "Concept",   Icon: BookOpenIcon },
    { id: "practice",  label: "Practice",  Icon: CodeBracketIcon },
    { id: "quiz",      label: "Quiz",      Icon: QuestionMarkCircleIcon },
    { id: "projects",  label: "Projects",  Icon: FolderOpenIcon },
  ];

  function copyCode() {
    navigator.clipboard.writeText(concept.code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  const stageLabel: Record<string, string> = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1200, margin: "0 auto" }}>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20, fontSize: 13 }}>
        <Link href="/learning" style={{ color: "#64748b", textDecoration: "none" }}>Learning Hub</Link>
        <ChevronRightIcon style={{ width: 13, height: 13, color: "#475569" }} />
        <Link href={`/careers/${career.id}`} style={{ color: "#6E58FF", textDecoration: "none" }}>{career.title}</Link>
        <ChevronRightIcon style={{ width: 13, height: 13, color: "#475569" }} />
        <span style={{ color: "white" }}>{node.title}</span>
      </div>

      {/* Hero header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div style={{ ...panel, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: bg, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {isRI ? <Icon size={28} color={color} /> : <Icon style={{ width: 28, height: 28, color }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "white" }}>{node.title}</h1>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 99, background: stage === "beginner" ? "rgba(34,197,94,0.12)" : stage === "intermediate" ? "rgba(245,158,11,0.12)" : "rgba(248,113,113,0.12)", color: stage === "beginner" ? "#22c55e" : stage === "intermediate" ? "#f59e0b" : "#f87171", textTransform: "capitalize" }}>{stageLabel[stage]}</span>
              </div>
              <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 12, lineHeight: 1.65 }}>{node.description}</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {node.skills.map(s => (
                  <span key={s} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 99, background: `${color}12`, border: `1px solid ${color}25`, color }}>{s}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <Ring pct={nodePct} size={72} color={nodePct === 100 ? "#22c55e" : "#6E58FF"} />
              <div style={{ fontSize: 11, color: "#64748b" }}>{doneMs}/{totalMs} done</div>
            </div>
          </div>

          {/* Video thumbnail */}
          {!videoVisible ? (
            <div onClick={() => setVideoVisible(true)}
              style={{ marginTop: 20, height: 200, borderRadius: 14, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, cursor: "pointer", backgroundImage: `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)`, backgroundSize: "cover", backgroundPosition: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
              <div style={{ position: "relative", width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PlayIcon style={{ width: 24, height: 24, color: "#050816", marginLeft: 3 }} />
              </div>
              <span style={{ position: "relative", fontSize: 14, fontWeight: 600, color: "white" }}>Watch: {node.title} Crash Course</span>
            </div>
          ) : (
            <div style={{ marginTop: 20, borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
              <iframe width="100%" height="360" src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen style={{ display: "block" }} />
            </div>
          )}
        </div>

        {/* ── Two-column layout ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>

          {/* LEFT: Tabs */}
          <div style={panel}>
            {/* Tab bar */}
            <div style={{ display: "flex", gap: 2, marginBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 0 }}>
              {tabList.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{ position: "relative", display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", fontSize: 13, fontWeight: 600, background: "none", border: "none", cursor: "pointer", color: tab === t.id ? "white" : "#64748b", borderRadius: "8px 8px 0 0", transition: "color 0.15s" }}>
                  <t.Icon style={{ width: 15, height: 15 }} />
                  {t.label}
                  {tab === t.id && <motion.div layoutId="tabLine" style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${color},${color}80)`, borderRadius: 2 }} />}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* ── CONCEPT ── */}
              {tab === "concept" && (
                <motion.div key="concept" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                  <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.75, marginBottom: 24 }}>{concept.overview}</p>

                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 14 }}>What You'll Learn</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                    {concept.keyPoints.map((kp, i) => (
                      <div key={i} style={{ display: "flex", gap: 14, padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}15`, border: `1px solid ${color}25`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, fontWeight: 800, color }}>{i + 1}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 3 }}>{kp.title}</div>
                          <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{kp.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Code example */}
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 12 }}>Code Example</h3>
                  <div style={{ borderRadius: 14, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {["#f87171","#fbbf24","#4ade80"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                      </div>
                      <button onClick={copyCode} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: copied ? "#22c55e" : "#64748b", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                        <ClipboardDocumentIcon style={{ width: 13, height: 13 }} /> {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <pre style={{ margin: 0, padding: "16px", fontSize: 13, lineHeight: 1.7, color: "#e2e8f0", fontFamily: "'Fira Code', 'Courier New', monospace", overflowX: "auto" }}>{concept.code}</pre>
                  </div>

                  {/* Pro tip */}
                  <div style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderLeft: "3px solid #f59e0b", marginBottom: 24 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <LightBulbIcon style={{ width: 16, height: 16, color: "#f59e0b", marginTop: 1, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", marginBottom: 4 }}>Pro Tip</div>
                        <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6 }}>{concept.tip}</div>
                      </div>
                    </div>
                  </div>

                  {/* Resources */}
                  {concept.resources.length > 0 && (
                    <>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 12 }}>Resources</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {concept.resources.map((r, i) => (
                          <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", textDecoration: "none", transition: "all 0.15s" }}
                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(110,88,255,0.08)")}
                            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(110,88,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <BookOpenIcon style={{ width: 15, height: 15, color: "#a78bfa" }} />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{r.title}</div>
                              {(r as any).source && <div style={{ fontSize: 11, color: "#64748b" }}>{(r as any).source}</div>}
                            </div>
                            <ArrowTopRightOnSquareIcon style={{ width: 14, height: 14, color: "#475569" }} />
                          </a>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Milestones */}
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "white", marginTop: 24, marginBottom: 12 }}>Milestones</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {node.milestones.map(m => {
                      const done = doneIds.includes(m.id);
                      return (
                        <button key={m.id} onClick={() => toggleMs(m.id)}
                          style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: done ? "rgba(34,197,94,0.07)" : "rgba(255,255,255,0.025)", border: `1px solid ${done ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.06)"}`, cursor: "pointer", transition: "all 0.2s", width: "100%", textAlign: "left" }}>
                          {done
                            ? <CheckSolid style={{ width: 18, height: 18, color: "#22c55e", flexShrink: 0 }} />
                            : <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)", flexShrink: 0 }} />}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: done ? "#4ade80" : "white" }}>{m.text}</div>
                            {m.description && <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{m.description}</div>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── PRACTICE ── */}
              {tab === "practice" && (
                <motion.div key="practice" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                  <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 24, lineHeight: 1.65 }}>
                    Apply what you've learned by solving these coding challenges. Focus on understanding over speed.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {challenges.map((ch, i) => (
                      <div key={i} style={{ borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden" }}>
                        <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{ch.title}</div>
                          <div style={{ display: "flex", gap: 6 }}>
                            {["#f87171","#fbbf24","#4ade80"].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
                          </div>
                        </div>
                        <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.65, margin: 0 }}>{ch.description}</p>
                        </div>
                        <textarea
                          value={codeValues[i] ?? ch.starter}
                          onChange={e => setCodeValues(prev => ({ ...prev, [i]: e.target.value }))}
                          rows={8}
                          style={{ width: "100%", padding: "16px 18px", background: "rgba(0,0,0,0.4)", color: "#e2e8f0", fontFamily: "'Fira Code','Courier New',monospace", fontSize: 13, lineHeight: 1.7, border: "none", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                        />
                        <div style={{ padding: "10px 18px", background: "rgba(245,158,11,0.04)", borderTop: "1px solid rgba(245,158,11,0.1)" }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "flex-start", fontSize: 12, color: "#94a3b8" }}>
                            <LightBulbIcon style={{ width: 14, height: 14, color: "#f59e0b", flexShrink: 0, marginTop: 1 }} />
                            <span><strong style={{ color: "#f59e0b" }}>Hint:</strong> {ch.hint}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 12, background: "rgba(110,88,255,0.06)", border: "1px solid rgba(110,88,255,0.2)" }}>
                    <div style={{ fontSize: 13, color: "#a78bfa" }}>
                      <SparklesIcon style={{ width: 14, height: 14, display: "inline", marginRight: 6 }} />
                      <strong>Pro move:</strong> Once you finish a challenge, paste your solution into ChatGPT and ask it to review for best practices.
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── QUIZ ── */}
              {tab === "quiz" && (
                <motion.div key="quiz" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                  {quizSubmitted ? (
                    <div style={{ textAlign: "center", padding: "32px 20px" }}>
                      <div style={{ fontSize: 52, marginBottom: 12 }}>
                        {quizScore === questions.length ? "🏆" : quizScore >= questions.length / 2 ? "🎯" : "📚"}
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: quizScore === questions.length ? "#22c55e" : "#f59e0b", marginBottom: 8 }}>
                        {quizScore}/{questions.length} Correct
                      </div>
                      <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 24 }}>
                        {quizScore === questions.length ? "Perfect score! You've mastered this concept." : quizScore >= questions.length / 2 ? "Good progress! Review the missed questions." : "Keep studying — review the concept tab and try again."}
                      </div>
                      {questions.map((q, i) => (
                        <div key={i} style={{ marginBottom: 14, padding: "14px 16px", borderRadius: 12, background: quizAnswers[i] === q.answer ? "rgba(34,197,94,0.07)" : "rgba(248,113,113,0.07)", border: `1px solid ${quizAnswers[i] === q.answer ? "rgba(34,197,94,0.25)" : "rgba(248,113,113,0.25)"}`, textAlign: "left" }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: quizAnswers[i] === q.answer ? "#4ade80" : "#f87171", marginBottom: 6 }}>
                            {quizAnswers[i] === q.answer ? "✓ Correct" : "✗ Incorrect"} — Q{i + 1}
                          </div>
                          <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{q.explanation}</div>
                        </div>
                      ))}
                      <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}
                        style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 auto", padding: "10px 24px", borderRadius: 12, background: "rgba(110,88,255,0.15)", border: "1px solid rgba(110,88,255,0.3)", color: "#a78bfa", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                        <ArrowPathIcon style={{ width: 15, height: 15 }} /> Try Again
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 24 }}>
                        Answer all {questions.length} questions, then submit to see your score.
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {questions.map((q, qi) => (
                          <div key={qi} style={{ padding: "18px 20px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 14 }}>
                              Q{qi + 1}. {q.q}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              {q.options.map((opt, oi) => {
                                const selected = quizAnswers[qi] === oi;
                                return (
                                  <button key={oi} onClick={() => setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                                    style={{ padding: "11px 14px", borderRadius: 10, textAlign: "left", fontSize: 13, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
                                      background: selected ? "rgba(110,88,255,0.15)" : "rgba(255,255,255,0.025)",
                                      border: selected ? "1px solid rgba(110,88,255,0.4)" : "1px solid rgba(255,255,255,0.06)",
                                      color: selected ? "white" : "#94a3b8" }}>
                                    <span style={{ fontWeight: 700, color: selected ? "#a78bfa" : "#475569", marginRight: 8 }}>{["A","B","C","D"][oi]}.</span>
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setQuizSubmitted(true)} disabled={Object.keys(quizAnswers).length < questions.length}
                        style={{ marginTop: 20, width: "100%", padding: "13px", borderRadius: 12, background: Object.keys(quizAnswers).length < questions.length ? "rgba(110,88,255,0.2)" : "linear-gradient(135deg,#6E58FF,#a855f7)", border: "none", color: "white", fontWeight: 700, fontSize: 14, cursor: Object.keys(quizAnswers).length < questions.length ? "not-allowed" : "pointer", opacity: Object.keys(quizAnswers).length < questions.length ? 0.5 : 1, fontFamily: "inherit", transition: "all 0.2s" }}>
                        Submit Quiz ({Object.keys(quizAnswers).length}/{questions.length} answered)
                      </button>
                    </>
                  )}
                </motion.div>
              )}

              {/* ── PROJECTS ── */}
              {tab === "projects" && (
                <motion.div key="projects" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                  <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 20, lineHeight: 1.65 }}>
                    Build real projects to reinforce your skills. Click any project to open it on the platform and start building.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {projects.map((p, i) => (
                      <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                        <div style={{ padding: "18px 20px", borderRadius: 16, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer", transition: "all 0.2s" }}
                          onMouseEnter={e => { const el = e.currentTarget; el.style.background = "rgba(110,88,255,0.08)"; el.style.borderColor = "rgba(110,88,255,0.25)"; el.style.transform = "translateX(4px)"; }}
                          onMouseLeave={e => { const el = e.currentTarget; el.style.background = "rgba(255,255,255,0.025)"; el.style.borderColor = "rgba(255,255,255,0.07)"; el.style.transform = "translateX(0)"; }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{p.title}</div>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: p.difficulty === "Beginner" ? "rgba(34,197,94,0.12)" : p.difficulty === "Intermediate" ? "rgba(245,158,11,0.12)" : "rgba(248,113,113,0.12)", color: p.difficulty === "Beginner" ? "#22c55e" : p.difficulty === "Intermediate" ? "#f59e0b" : "#f87171" }}>{p.difficulty}</span>
                              <ArrowTopRightOnSquareIcon style={{ width: 14, height: 14, color: "#475569" }} />
                            </div>
                          </div>
                          <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 10 }}>{p.description}</div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#6E58FF" }}>{p.platform}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 12, background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)" }}>
                    <div style={{ fontSize: 13, color: "#4ade80" }}>
                      <TrophyIcon style={{ width: 14, height: 14, display: "inline", marginRight: 6 }} />
                      <strong>Track it:</strong> Complete a project externally, then come back and mark your milestones done to earn XP.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── RIGHT STICKY PANEL ── */}
          <div style={{ position: "sticky", top: 20, display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Progress card */}
            <div style={panel}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 16 }}>Your Progress</div>
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16 }}>
                <Ring pct={nodePct} size={64} color={nodePct === 100 ? "#22c55e" : "#6E58FF"} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{node.title}</div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{doneMs} of {totalMs} milestones</div>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 11, color: "#64748b" }}>
                  <span>Career progress</span>
                  <span style={{ fontWeight: 700, color: "white" }}>{careerPct}%</span>
                </div>
                <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.06)" }}>
                  <div style={{ height: "100%", width: `${careerPct}%`, borderRadius: 99, background: "linear-gradient(90deg,#6E58FF,#a855f7)", transition: "width 0.6s" }} />
                </div>
              </div>
            </div>

            {/* Lessons nav */}
            <div style={panel}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 14 }}>Course Modules</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 280, overflowY: "auto" }}>
                {allNodes.map((n, i) => {
                  const isCurrentNode = n.id === nodeId;
                  const nDone = (progress[`${career.id}__${n.id}`] ?? []).length;
                  const isDone = nDone >= n.milestones.length && n.milestones.length > 0;
                  return (
                    <Link key={n.id} href={`/learn/${n.id}`} style={{ textDecoration: "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, background: isCurrentNode ? "rgba(110,88,255,0.12)" : "transparent", border: isCurrentNode ? "1px solid rgba(110,88,255,0.25)" : "1px solid transparent", transition: "all 0.15s" }}
                        onMouseEnter={e => { if (!isCurrentNode) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)"; }}
                        onMouseLeave={e => { if (!isCurrentNode) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}>
                        {isDone
                          ? <CheckSolid style={{ width: 14, height: 14, color: "#22c55e", flexShrink: 0 }} />
                          : <div style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${isCurrentNode ? "#6E58FF" : "rgba(255,255,255,0.15)"}`, flexShrink: 0 }} />}
                        <span style={{ fontSize: 12, fontWeight: isCurrentNode ? 700 : 500, color: isCurrentNode ? "white" : "#64748b", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* AI Insight */}
            <div style={{ ...panel, background: "rgba(110,88,255,0.08)", border: "1px solid rgba(110,88,255,0.2)" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
                <SparklesIcon style={{ width: 16, height: 16, color: "#a78bfa" }} />
                <div style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa" }}>AI Insight</div>
              </div>
              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.65, margin: 0 }}>
                {nodePct === 100
                  ? `Great work completing ${node.title}! You're ready to move to ${nextNode?.title ?? "advanced topics"}.`
                  : `Focus on completing ${node.milestones[doneMs]?.text ?? "the next milestone"} to build momentum. ${Math.round((1 - nodePct / 100) * 100)}% left in this module.`}
              </p>
            </div>

            {/* Notes */}
            <div style={panel}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 10 }}>My Notes</div>
              <textarea value={note} onChange={e => { setNote(e.target.value); try { localStorage.setItem(`cgt-note-${nodeId}`, e.target.value); } catch {} }} rows={4} placeholder="Write your notes, questions, or key takeaways…"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0", fontSize: 13, fontFamily: "inherit", outline: "none", resize: "none", lineHeight: 1.6, boxSizing: "border-box" }} />
            </div>

            {/* Prev / Next */}
            <div style={{ display: "flex", gap: 10 }}>
              {prevNode && (
                <Link href={`/learn/${prevNode.id}`} style={{ flex: 1, textDecoration: "none" }}>
                  <div style={{ padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6 }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}>
                    <ChevronLeftIcon style={{ width: 14, height: 14, color: "#64748b" }} />
                    <div>
                      <div style={{ fontSize: 10, color: "#475569" }}>Previous</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 100 }}>{prevNode.title}</div>
                    </div>
                  </div>
                </Link>
              )}
              {nextNode && (
                <Link href={`/learn/${nextNode.id}`} style={{ flex: 1, textDecoration: "none" }}>
                  <div style={{ padding: "10px 12px", borderRadius: 12, background: "linear-gradient(135deg,rgba(110,88,255,0.2),rgba(168,85,247,0.2))", border: "1px solid rgba(110,88,255,0.3)", cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}
                    onMouseEnter={e => (e.currentTarget.style.background = "linear-gradient(135deg,rgba(110,88,255,0.35),rgba(168,85,247,0.35))")}
                    onMouseLeave={e => (e.currentTarget.style.background = "linear-gradient(135deg,rgba(110,88,255,0.2),rgba(168,85,247,0.2))")}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 10, color: "#a78bfa" }}>Next Lesson</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 100 }}>{nextNode.title}</div>
                    </div>
                    <ChevronRightIcon style={{ width: 14, height: 14, color: "#a78bfa" }} />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
