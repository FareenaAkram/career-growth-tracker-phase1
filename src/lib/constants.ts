/**
 * App-wide constants. Import from here instead of hardcoding magic values.
 */

// ── LocalStorage / persist keys ──────────────────────────────────────────────
export const STORE_KEY = "careerviz-store" as const;

// Legacy keys (kept so migration in the store can read old data)
export const LEGACY_KEYS = {
  PROGRESS:            "cgt-progress",
  SAVED_CAREERS:       "cgt-saved",
  SETTINGS:            "cgt-settings",
  BOOKMARKS_JOBS:      "cgt-bookmarks-jobs",
  SAVED_JOBS_DATA:     "cgt-saved-jobs-data",
  BOOKMARKS_RESOURCES: "cgt-bookmarks-resources",
} as const;

// ── XP / scoring ─────────────────────────────────────────────────────────────
export const XP_PER_MILESTONE = 50;
export const XP_PER_NODE_COMPLETE = 200; // bonus when all milestones in a node done

// ── Learning pace labels ──────────────────────────────────────────────────────
export const LEARNING_PACES = ["fast", "balanced", "slow"] as const;
export type LearningPace = (typeof LEARNING_PACES)[number];

// ── Career category colors ────────────────────────────────────────────────────
export const CATEGORY_THEME: Record<
  string,
  { gradient: string; glow: string; border: string; accent: string; pill: string }
> = {
  Engineering: {
    gradient: "linear-gradient(135deg,#6E58FF,#4f6bff)",
    glow:     "rgba(110,88,255,0.28)",
    border:   "rgba(110,88,255,0.22)",
    accent:   "#6E58FF",
    pill:     "rgba(110,88,255,0.1)",
  },
  Data: {
    gradient: "linear-gradient(135deg,#06b6d4,#0ea5e9)",
    glow:     "rgba(6,182,212,0.28)",
    border:   "rgba(6,182,212,0.22)",
    accent:   "#06b6d4",
    pill:     "rgba(6,182,212,0.1)",
  },
  Design: {
    gradient: "linear-gradient(135deg,#ec4899,#f43f5e)",
    glow:     "rgba(236,72,153,0.28)",
    border:   "rgba(236,72,153,0.22)",
    accent:   "#ec4899",
    pill:     "rgba(236,72,153,0.1)",
  },
  Healthcare: {
    gradient: "linear-gradient(135deg,#22c55e,#10b981)",
    glow:     "rgba(34,197,94,0.28)",
    border:   "rgba(34,197,94,0.22)",
    accent:   "#22c55e",
    pill:     "rgba(34,197,94,0.1)",
  },
};

// ── Nav item accent colors (sidebar) ─────────────────────────────────────────
export const NAV_ACCENT: Record<string, string> = {
  explorer:  "#6E58FF",
  dashboard: "#6E58FF",
  analytics: "#06b6d4",
  learning:  "#8b5cf6",
  roadmaps:  "#6E58FF",
  projects:  "#f59e0b",
  resources: "#22c55e",
  aicoach:   "#ec4899",
  jobs:      "#f97316",
  bookmarks: "#3b82f6",
};

// ── Design tokens (inline-style reuse) ───────────────────────────────────────
export const PANEL_STYLE: React.CSSProperties = {
  background:     "rgba(10,16,32,0.65)",
  border:         "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(16px)",
  borderRadius:   20,
  padding:        20,
};

export const CARD_STYLE: React.CSSProperties = {
  background:   "rgba(255,255,255,0.025)",
  border:       "1px solid rgba(255,255,255,0.06)",
  borderRadius: 14,
};

export const GLASS_SURFACE: React.CSSProperties = {
  background:     "rgba(10,16,32,0.7)",
  border:         "1px solid rgba(255,255,255,0.06)",
  backdropFilter: "blur(14px)",
  borderRadius:   20,
};

// ── API endpoints ─────────────────────────────────────────────────────────────
export const API_ROUTES = {
  JOBS:    "/api/jobs",
  ADVISOR: "/api/advisor-live",
} as const;

// ── Remote job tags ───────────────────────────────────────────────────────────
export const JOB_TAGS = [
  "javascript", "react", "typescript", "node", "python", "css", "frontend",
] as const;
