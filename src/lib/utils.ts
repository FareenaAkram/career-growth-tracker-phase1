/**
 * Pure utility functions — no React, no side-effects.
 * Import these instead of copy-pasting logic across files.
 */

// ── Formatting ────────────────────────────────────────────────────────────────

/** Format a dollar amount: 95000 → "$95,000" */
export function formatMoney(value: number): string {
  return `$${value.toLocaleString()}`;
}

/** Format a salary range: { min: 80000, max: 150000 } → "$80,000 – $150,000" */
export function formatSalaryRange(min: number, max: number): string {
  return `${formatMoney(min)} – ${formatMoney(max)}`;
}

/** Format an XP number with commas: 12500 → "12,500 XP" */
export function formatXp(xp: number): string {
  return `${xp.toLocaleString()} XP`;
}

/** Truncate text to N chars with ellipsis */
export function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

// ── Color ─────────────────────────────────────────────────────────────────────

/**
 * Convert a hex color string to "R,G,B" for use in rgba().
 * hexToRgb("#6E58FF") → "110,88,255"
 */
export function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
  if (!r) return "110,88,255";
  return `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}`;
}

/** Wrap a hex in rgba with given opacity */
export function hexAlpha(hex: string, alpha: number): string {
  return `rgba(${hexToRgb(hex)},${alpha})`;
}

// ── Progress ──────────────────────────────────────────────────────────────────

/** Build the localStorage key for node progress */
export function nodeProgressKey(careerId: string, nodeId: string): string {
  return `${careerId}__${nodeId}`;
}

/**
 * Compute overall completion % for a career from the progress map.
 * Returns 0–100.
 */
export function computeCareerPct(
  careerId: string,
  allNodes: { id: string; milestones: { id: string }[] }[],
  progress: Record<string, string[]>
): number {
  const total = allNodes.reduce((s, n) => s + n.milestones.length, 0);
  if (total === 0) return 0;
  const done = allNodes.reduce(
    (s, n) => s + (progress[nodeProgressKey(careerId, n.id)] ?? []).length,
    0
  );
  return Math.round((done / total) * 100);
}

/** Total XP from a progress map */
export function computeXp(
  progress: Record<string, string[]>,
  xpPerMilestone = 50
): number {
  return Object.values(progress).reduce(
    (sum, ids) => sum + ids.length * xpPerMilestone,
    0
  );
}

// ── String helpers ────────────────────────────────────────────────────────────

/** Slugify a string: "Frontend Developer" → "frontend-developer" */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Convert a slug back to Title Case: "frontend-developer" → "Frontend Developer" */
export function unslugify(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ── Array helpers ─────────────────────────────────────────────────────────────

/** Toggle an item in an array (add if missing, remove if present) */
export function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ── Date ──────────────────────────────────────────────────────────────────────

/** Format a Date as "Jun 11, 2026" */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Search ────────────────────────────────────────────────────────────────────

/**
 * Case-insensitive multi-token search.
 * All tokens in `query` must appear somewhere in `text`.
 */
export function matchesSearch(text: string, query: string): boolean {
  if (!query.trim()) return true;
  const lower = text.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((t) => lower.includes(t));
}
