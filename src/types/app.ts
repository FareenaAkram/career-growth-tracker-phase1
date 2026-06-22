/**
 * Application-level TypeScript types.
 * Domain types (Career, RoadmapNode) live in src/data/careers.ts.
 */

// ── User settings ─────────────────────────────────────────────────────────────

export type LearningPace = "fast" | "balanced" | "slow";
export type AppTheme     = "dark" | "light";

export interface UserSettings {
  /** Career path the user is focusing on */
  goal:  string;
  pace:  LearningPace;
  theme: AppTheme;
  /** Display name */
  name?: string;
  /** User email */
  email?: string;
}

// ── Progress ──────────────────────────────────────────────────────────────────

/**
 * Progress map: keys are "careerId__nodeId", values are arrays of completed milestone IDs.
 * Example: { "frontend-developer__html-css": ["intro", "selectors", "box-model"] }
 */
export type ProgressMap = Record<string, string[]>;

// ── Bookmarks ─────────────────────────────────────────────────────────────────

export interface JobData {
  id:       string;
  title:    string;
  company:  string;
  location: string;
  salary?:  string;
  tags:     string[];
  url:      string;
  logo?:    string;
}

export interface ResourceData {
  id:          string;
  title:       string;
  description: string;
  type:        ResourceType;
  url:         string;
  free?:       boolean;
  featured?:   boolean;
}

export type ResourceType = "Documentation" | "Course" | "Video" | "Book" | "Blog" | "Tool";

// ── Global Zustand store shape ────────────────────────────────────────────────

export interface AppStore {
  // ── State ──────────────────────────────────────────────────────────────────
  progress:             ProgressMap;
  savedCareers:         string[];
  settings:             UserSettings;
  bookmarkedJobIds:     string[];
  bookmarkedResourceIds: string[];
  savedJobsData:        Record<string, JobData>;

  // ── Derived helpers (getters, not stored) ──────────────────────────────────
  getXp:                 () => number;
  getNodeDoneIds:        (careerId: string, nodeId: string) => string[];
  isJobBookmarked:       (jobId: string) => boolean;
  isResourceBookmarked:  (resourceId: string) => boolean;
  getCareerPct:          (careerId: string, allNodes: { id: string; milestones: { id: string }[] }[]) => number;

  // ── Actions ────────────────────────────────────────────────────────────────
  toggleMilestone:       (careerId: string, nodeId: string, milestoneId: string) => void;
  saveCareer:            (careerId: string) => void;
  removeCareer:          (careerId: string) => void;
  updateSettings:        (partial: Partial<UserSettings>) => void;
  toggleJobBookmark:     (jobId: string, data?: JobData) => void;
  toggleResourceBookmark:(resourceId: string) => void;
  clearAllData:          () => void;
}

// ── Nav ───────────────────────────────────────────────────────────────────────

export interface NavItem {
  id:     string;
  label:  string;
  href:   string;
  badge?: string;
}

// ── Misc ──────────────────────────────────────────────────────────────────────

export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

export interface StatChipData {
  label: string;
  value: string | number;
  color: string;
}
