/**
 * Global Zustand store for CareerViz.
 *
 * Single source of truth for: progress, saved careers, settings, bookmarks.
 * Uses `persist` middleware to sync with localStorage automatically.
 * Components read/write here instead of calling localStorage directly.
 *
 * Usage:
 *   const xp           = useAppStore(s => s.getXp());
 *   const toggleMs     = useAppStore(s => s.toggleMilestone);
 *   const savedCareers = useAppStore(s => s.savedCareers);
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AppStore, UserSettings, JobData, ProgressMap } from "@/types/app";
import { STORE_KEY, LEGACY_KEYS, XP_PER_MILESTONE } from "@/lib/constants";
import { computeXp, nodeProgressKey, toggleItem } from "@/lib/utils";

// ── Default state ─────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: UserSettings = {
  goal:  "frontend-developer",
  pace:  "balanced",
  theme: "dark",
  name:  "",
  email: "",
};

// ── Store ─────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ── Initial state ──────────────────────────────────────────────────────
      progress:              {},
      savedCareers:          [],
      settings:              DEFAULT_SETTINGS,
      bookmarkedJobIds:      [],
      bookmarkedResourceIds: [],
      savedJobsData:         {},

      // ── Derived helpers ────────────────────────────────────────────────────

      getXp: () => computeXp(get().progress, XP_PER_MILESTONE),

      getNodeDoneIds: (careerId, nodeId) =>
        get().progress[nodeProgressKey(careerId, nodeId)] ?? [],

      isJobBookmarked: (jobId) =>
        get().bookmarkedJobIds.includes(jobId),

      isResourceBookmarked: (resourceId) =>
        get().bookmarkedResourceIds.includes(resourceId),

      getCareerPct: (careerId, allNodes) => {
        const { progress } = get();
        const total = allNodes.reduce((s, n) => s + n.milestones.length, 0);
        if (total === 0) return 0;
        const done = allNodes.reduce(
          (s, n) => s + (progress[nodeProgressKey(careerId, n.id)] ?? []).length,
          0
        );
        return Math.round((done / total) * 100);
      },

      // ── Actions ────────────────────────────────────────────────────────────

      toggleMilestone: (careerId, nodeId, milestoneId) => {
        const key = nodeProgressKey(careerId, nodeId);
        set((state) => ({
          progress: {
            ...state.progress,
            [key]: toggleItem(state.progress[key] ?? [], milestoneId),
          },
        }));
      },

      saveCareer: (careerId) => {
        set((state) => ({
          savedCareers: state.savedCareers.includes(careerId)
            ? state.savedCareers
            : [careerId, ...state.savedCareers],
        }));
      },

      removeCareer: (careerId) => {
        set((state) => ({
          savedCareers: state.savedCareers.filter((id) => id !== careerId),
        }));
      },

      updateSettings: (partial) => {
        set((state) => ({
          settings: { ...state.settings, ...partial },
        }));
      },

      toggleJobBookmark: (jobId, data) => {
        set((state) => ({
          bookmarkedJobIds: toggleItem(state.bookmarkedJobIds, jobId),
          savedJobsData: data
            ? { ...state.savedJobsData, [jobId]: data }
            : state.savedJobsData,
        }));
      },

      toggleResourceBookmark: (resourceId) => {
        set((state) => ({
          bookmarkedResourceIds: toggleItem(state.bookmarkedResourceIds, resourceId),
        }));
      },

      clearAllData: () => {
        set({
          progress:              {},
          savedCareers:          [],
          settings:              DEFAULT_SETTINGS,
          bookmarkedJobIds:      [],
          bookmarkedResourceIds: [],
          savedJobsData:         {},
        });
      },
    }),

    // ── Persist config ───────────────────────────────────────────────────────
    {
      name:    STORE_KEY,
      storage: createJSONStorage(() => localStorage),

      /**
       * On first hydration, migrate data from the old per-key localStorage
       * format so users don't lose progress after the upgrade.
       */
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        try {
          // Progress
          if (Object.keys(state.progress).length === 0) {
            const old = localStorage.getItem(LEGACY_KEYS.PROGRESS);
            if (old) {
              const parsed: ProgressMap = JSON.parse(old);
              // Accept both old boolean-map and new string[] formats
              const migrated: ProgressMap = {};
              for (const [key, val] of Object.entries(parsed)) {
                if (Array.isArray(val)) {
                  migrated[key] = val as string[];
                } else if (typeof val === "object" && val !== null) {
                  // Old format: { careerId: { milestoneId: true } }
                  // Convert nested object keys to flat string[]
                  migrated[key] = Object.keys(val).filter(
                    (k) => (val as Record<string, boolean>)[k]
                  );
                }
              }
              state.progress = migrated;
            }
          }

          // Saved careers
          if (state.savedCareers.length === 0) {
            const old = localStorage.getItem(LEGACY_KEYS.SAVED_CAREERS);
            if (old) state.savedCareers = JSON.parse(old);
          }

          // Settings
          const oldSettings = localStorage.getItem(LEGACY_KEYS.SETTINGS);
          if (oldSettings) {
            const parsed = JSON.parse(oldSettings) as Partial<UserSettings>;
            state.settings = { ...DEFAULT_SETTINGS, ...parsed };
          }

          // Bookmarks
          if (state.bookmarkedJobIds.length === 0) {
            const old = localStorage.getItem(LEGACY_KEYS.BOOKMARKS_JOBS);
            if (old) state.bookmarkedJobIds = JSON.parse(old);
          }
          if (state.bookmarkedResourceIds.length === 0) {
            const old = localStorage.getItem(LEGACY_KEYS.BOOKMARKS_RESOURCES);
            if (old) state.bookmarkedResourceIds = JSON.parse(old);
          }

          // Saved jobs data
          const oldJobsData = localStorage.getItem(LEGACY_KEYS.SAVED_JOBS_DATA);
          if (oldJobsData && Object.keys(state.savedJobsData).length === 0) {
            state.savedJobsData = JSON.parse(oldJobsData);
          }
        } catch {
          // Silent — migration failures should never crash the app
        }
      },
    }
  )
);

// ── Selector hooks (memoized, prevent unnecessary re-renders) ─────────────────

/** Returns total XP. Re-renders only when XP changes. */
export const useXp = () => useAppStore((s) => s.getXp());

/** Returns progress for a specific node. */
export const useNodeProgress = (careerId: string, nodeId: string) =>
  useAppStore((s) => s.getNodeDoneIds(careerId, nodeId));

/** Returns the user's active (first saved) career ID. */
export const useActiveCareerId = () =>
  useAppStore((s) => s.savedCareers[0] ?? "frontend-developer");

/** Returns user settings. */
export const useSettings = () => useAppStore((s) => s.settings);
