# Career Growth Tracker - TODO

## Phase 1: Foundation (Next.js 15 + Tailwind + Theme)
- [ ] Add Tailwind + base styles in src/app/globals.css
- [ ] Update src/app/layout.tsx to import globals, set html/body attributes, and enable theme wrapper
- [ ] Add theme system (CSS variables + light/dark switching)

## Phase 2: App Shell + Navigation
- [ ] Implement responsive layout with Sidebar and Topbar
- [ ] Update existing placeholder Sidebar / StatCard components
- [ ] Ensure navigation links to /dashboard, /skills, /roadmap, /learning

## Phase 3: Data + Types
- [ ] Create src/data/careers.ts with sample careers dataset (skills, tools, roadmap by level, salary, time-to-ready)

## Phase 4: State (Zustand)
- [ ] Create src/store/useCareerStore.ts typed state for saved careers, selected career, roadmap progress, generated learning plan
- [ ] Persist progress to localStorage

## Phase 5: Career Explorer (/)
- [ ] Implement searchable/filterable careers grid with CareerCard components
- [ ] Route careers to /careers/[careerId]

## Phase 6: Career Detail (/careers/[careerId]) (VERY IMPORTANT)
- [ ] Interactive skill tree / roadmap visualization (Beginner → Intermediate → Advanced)
- [ ] Show required tools/technologies, salary range, time required
- [ ] Add Recharts visualization(s)

## Phase 7: Learning Roadmap Builder (/learning)
- [ ] Select a career + generate Week 1–4 learning plan from dataset
- [ ] Progress tracking UI (checkboxes + progress bar)
- [ ] Compute readiness score

## Phase 8: AI Career Advisor (mock) (embedded in /dashboard)
- [ ] Interests/skills/education form
- [ ] Deterministic mock AI response (suggested careers + why + roadmap summary)

## Phase 9: Dashboard (/dashboard)
- [ ] Saved careers list
- [ ] Progress overview + recommended next steps

## Phase 10: Optional Extras
- [ ] PDF/Print export (print-friendly view + button)
- [ ] Drag-and-drop roadmap builder (optional if time permits)

## Phase 11: Verification
- [ ] Install/verify dependencies
- [ ] Run lint/typecheck/build
- [ ] Smoke test routes and interactions

