"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SparklesIcon, PaperAirplaneIcon, ArrowPathIcon,
  UserCircleIcon, LightBulbIcon, ChevronRightIcon,
} from "@heroicons/react/24/outline";

// ── Design tokens ────────────────────────────────────────────────────────────
const panel: React.CSSProperties = {
  background: "rgba(10,16,32,0.65)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(16px)",
  borderRadius: 20,
  padding: 24,
};

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestions?: { title: string; reason: string; roadmapSummary: string[] }[];
}

const QUICK_PROMPTS = [
  "I know HTML/CSS and JavaScript basics. What should I learn next?",
  "I want to become a full-stack developer in 6 months. Where do I start?",
  "What are the most in-demand frontend skills in 2024?",
  "How long does it take to get a React developer job?",
  "Compare TypeScript vs JavaScript for career growth.",
  "What skills do I need for a senior developer role?",
];

const STARTER_MESSAGE: Message = {
  role: "assistant",
  content: "Hi! I'm your AI Career Coach. Tell me about your current skills, interests, or career goals — and I'll give you personalized suggestions for your learning path. You can also ask me anything about tech careers, skills to learn, or how to level up.",
};

export default function AICoachPage() {
  const [messages, setMessages] = useState<Message[]>([STARTER_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [interests, setInterests] = useState("");
  const [skills, setSkills] = useState("");
  const [mode, setMode] = useState<"chat" | "advisor">("chat");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Build a prompt that guides the AI to give career advice
      const systemContext = `You are a friendly, expert career coach for software developers. Give clear, actionable advice about learning paths, skills, and career progression. Keep responses concise (2-4 paragraphs max). Use bullet points where helpful. End with one specific next action the user should take.`;

      const res = await fetch("/api/advisor-live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: [msg],
          skills: skills.split(",").map(s => s.trim()).filter(Boolean),
          education: "self-taught developer",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.suggestions && data.suggestions.length > 0) {
          setMessages(prev => [...prev, {
            role: "assistant",
            content: `Based on what you've shared, here are my top career path recommendations tailored to your background:`,
            suggestions: data.suggestions,
          }]);
        } else {
          setMessages(prev => [...prev, {
            role: "assistant",
            content: "I've analyzed your input. Here's my recommendation: start by solidifying your fundamentals in HTML, CSS, and JavaScript, then move to a framework like React. Consistent daily practice (even 30 min/day) beats sporadic long sessions. Would you like a more specific learning plan?",
          }]);
        }
      } else {
        // Fallback responses for when API isn't configured
        const fallbacks = [
          `Great question about "${msg}"! Here's my take:\n\n**Focus on fundamentals first.** Before diving into frameworks, make sure your HTML/CSS/JavaScript foundations are solid. This makes learning React, TypeScript, or Node.js 3× faster.\n\n**Build projects.** Every concept you learn should result in something you built. Even tiny projects count.\n\n**Consistency beats intensity.** 45 minutes daily > 8-hour Saturday sessions.\n\n**Next step:** Pick one skill from your list, spend 2 weeks on just that, then build one small project with it.`,
          `For "${msg}", the path typically looks like:\n\n• **Month 1-2:** HTML, CSS, JavaScript basics (plus DOM)\n• **Month 3-4:** React fundamentals and hooks\n• **Month 5-6:** TypeScript, testing, Git/GitHub\n• **Month 7+:** Portfolio projects and job applications\n\nThe key differentiator is the portfolio. 3 solid projects beat a resume full of courses.\n\n**Next step:** Check out the Learning Hub and start the beginner modules — they're designed to follow exactly this progression.`,
        ];
        setMessages(prev => [...prev, {
          role: "assistant",
          content: fallbacks[Math.floor(Math.random() * fallbacks.length)],
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I couldn't connect to the AI service right now. Please check your API key configuration or try again in a moment. In the meantime, check out the Learning Hub for structured content!",
      }]);
    } finally {
      setLoading(false);
    }
  }

  async function getAdvisorSuggestions() {
    if (!interests.trim() || loading) return;
    setLoading(true);
    const userMsg: Message = {
      role: "user",
      content: `My interests: ${interests}. My current skills: ${skills || "beginner"}. Give me career path suggestions.`,
    };
    setMessages(prev => [...prev, userMsg]);
    setMode("chat");

    try {
      const res = await fetch("/api/advisor-live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: interests.split(",").map(s => s.trim()),
          skills: skills.split(",").map(s => s.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "Based on your profile, here are my personalized career path recommendations:",
          suggestions: data.suggestions ?? [],
        }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "I'd recommend starting with Frontend Development — HTML, CSS, JavaScript, then React. It has the shortest path to your first job and the largest job market." }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Couldn't connect to the AI service. Try configuring your OPENAI_API_KEY in .env.local." }]);
    } finally {
      setLoading(false);
    }
  }

  function formatContent(text: string) {
    // Simple markdown-like formatting
    return text
      .split("\n\n")
      .map((para, i) => {
        if (para.startsWith("•") || para.startsWith("-")) {
          const items = para.split("\n").filter(l => l.trim());
          return (
            <ul key={i} style={{ margin: "8px 0", paddingLeft: 16 }}>
              {items.map((item, j) => (
                <li key={j} style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.65, marginBottom: 4 }}
                  dangerouslySetInnerHTML={{ __html: item.replace(/^[•\-]\s*/, "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
              ))}
            </ul>
          );
        }
        return (
          <p key={i} style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.65, margin: "0 0 8px" }}
            dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.+?)\*\*/g, "<strong style='color:white'>$1</strong>") }} />
        );
      });
  }

  return (
    <div style={{ padding: "32px 24px", maxWidth: 900, margin: "0 auto" }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg,#6E58FF,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <SparklesIcon style={{ width: 22, height: 22, color: "white" }} />
            </div>
            <h1 className="text-4xl font-bold" style={{ background: "linear-gradient(135deg,#a78bfa,#c084fc,#f0abfc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              AI Career Coach
            </h1>
          </div>
          <p style={{ color: "#94a3b8", fontSize: 15 }}>Personalized career guidance powered by AI. Ask anything about learning paths, skills, or tech careers.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>

          {/* LEFT: Chat */}
          <div>
            {/* Profile quick setup */}
            <div style={{ ...panel, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 12 }}>Your Profile (optional, improves suggestions)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 5 }}>Your interests</label>
                  <input value={interests} onChange={e => setInterests(e.target.value)} placeholder="e.g., design, data, games"
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 5 }}>Current skills</label>
                  <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g., HTML, Python, SQL"
                    style={{ width: "100%", padding: "9px 12px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                </div>
              </div>
              <button onClick={getAdvisorSuggestions} disabled={!interests.trim() || loading}
                style={{ marginTop: 10, padding: "9px 20px", borderRadius: 10, background: interests.trim() ? "linear-gradient(135deg,#6E58FF,#a855f7)" : "rgba(255,255,255,0.05)", border: "none", color: "white", fontWeight: 700, fontSize: 13, cursor: interests.trim() ? "pointer" : "not-allowed", opacity: interests.trim() ? 1 : 0.4, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
                <SparklesIcon style={{ width: 14, height: 14 }} /> Get AI Recommendations
              </button>
            </div>

            {/* Chat window */}
            <div style={{ ...panel, height: 460, display: "flex", flexDirection: "column" }}>
              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, paddingRight: 4 }}>
                <AnimatePresence>
                  {messages.map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                      {m.role === "user" ? (
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <div style={{ maxWidth: "75%", padding: "12px 16px", borderRadius: "16px 16px 4px 16px", background: "linear-gradient(135deg,#6E58FF,#a855f7)", fontSize: 14, color: "white", lineHeight: 1.6 }}>
                            {m.content}
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#6E58FF,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                            <SparklesIcon style={{ width: 15, height: 15, color: "white" }} />
                          </div>
                          <div style={{ flex: 1, maxWidth: "85%" }}>
                            <div style={{ padding: "12px 16px", borderRadius: "16px 16px 16px 4px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                              <div style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.65 }}>{formatContent(m.content)}</div>
                            </div>
                            {/* Suggestions */}
                            {m.suggestions && m.suggestions.length > 0 && (
                              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                                {m.suggestions.map((s, si) => (
                                  <div key={si} style={{ padding: "14px 16px", borderRadius: 14, background: "rgba(110,88,255,0.08)", border: "1px solid rgba(110,88,255,0.2)" }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 5 }}>{si + 1}. {s.title}</div>
                                    <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 8, lineHeight: 1.6 }}>{s.reason}</div>
                                    {s.roadmapSummary && s.roadmapSummary.length > 0 && (
                                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                        {s.roadmapSummary.slice(0, 4).map((step, j) => (
                                          <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#64748b" }}>
                                            <ChevronRightIcon style={{ width: 12, height: 12, color: "#6E58FF", flexShrink: 0, marginTop: 1 }} />
                                            {step}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#6E58FF,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <SparklesIcon style={{ width: 15, height: 15, color: "white" }} />
                    </div>
                    <div style={{ padding: "12px 16px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 6, alignItems: "center" }}>
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#6E58FF" }}
                          animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                      ))}
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ display: "flex", gap: 10, marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Ask about careers, skills, or learning paths…"
                  style={{ flex: 1, padding: "11px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "white", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                  style={{ width: 44, height: 44, borderRadius: 12, background: input.trim() ? "linear-gradient(135deg,#6E58FF,#a855f7)" : "rgba(255,255,255,0.05)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() ? "pointer" : "not-allowed", opacity: input.trim() ? 1 : 0.4 }}>
                  <PaperAirplaneIcon style={{ width: 18, height: 18, color: "white" }} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Quick prompts + tips */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={panel}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 12 }}>
                <LightBulbIcon style={{ width: 14, height: 14, display: "inline", marginRight: 6, color: "#f59e0b" }} />
                Quick Prompts
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {QUICK_PROMPTS.map((p, i) => (
                  <button key={i} onClick={() => sendMessage(p)}
                    style={{ padding: "9px 12px", borderRadius: 10, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", color: "#94a3b8", fontSize: 12, textAlign: "left", cursor: "pointer", lineHeight: 1.5, fontFamily: "inherit", transition: "all 0.15s" }}
                    onMouseEnter={e => { const el = e.currentTarget; el.style.background = "rgba(110,88,255,0.1)"; el.style.color = "white"; el.style.borderColor = "rgba(110,88,255,0.25)"; }}
                    onMouseLeave={e => { const el = e.currentTarget; el.style.background = "rgba(255,255,255,0.025)"; el.style.color = "#94a3b8"; el.style.borderColor = "rgba(255,255,255,0.06)"; }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ ...panel, background: "rgba(110,88,255,0.06)", border: "1px solid rgba(110,88,255,0.2)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa", marginBottom: 10 }}>💡 How to get the best advice</div>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {[
                  "Share your current skill level",
                  "Mention your timeline / availability",
                  "Describe your end goal (job type, role)",
                  "Ask specific questions for specific advice",
                ].map((tip, i) => (
                  <li key={i} style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.65, marginBottom: 4 }}>{tip}</li>
                ))}
              </ul>
            </div>

            <div style={panel}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 10 }}>🔗 Quick links</div>
              {[
                { label: "Learning Hub", href: "/learning" },
                { label: "View Roadmaps", href: "/" },
                { label: "Check Analytics", href: "/analytics" },
                { label: "Browse Projects", href: "/projects" },
              ].map(l => (
                <a key={l.href} href={l.href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", borderRadius: 8, marginBottom: 4, textDecoration: "none", color: "#94a3b8", fontSize: 13, transition: "all 0.15s" }}
                  onMouseEnter={e => { const el = e.currentTarget; el.style.background = "rgba(110,88,255,0.1)"; el.style.color = "white"; }}
                  onMouseLeave={e => { const el = e.currentTarget; el.style.background = "transparent"; el.style.color = "#94a3b8"; }}>
                  {l.label} <ChevronRightIcon style={{ width: 13, height: 13 }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
