# Career Growth Tracker Phase 1

This project is a Career Visualization web app built with Next.js (App Router), TypeScript, and Tailwind CSS.

Features included in this workspace:

- Career Explorer (grid of careers)
- Career Detail pages with interactive roadmap visualization
- Learning Roadmap Builder (4-week plan with progress tracking)
- AI Career Advisor (mock API)
- Dashboard (mock suggestions)
- Theme toggle (dark/light)

Run locally:

```bash
npm install
npm run dev
```

Open http://localhost:3000

Key files added/modified:

- src/app/api/advisor/route.ts — mock AI advisor API
- src/components/ui/ThemeToggle.tsx — theme switcher
- src/components/advisor/AIAdvisor.tsx — advisor UI
- src/components/learning/RoadmapBuilder.tsx — roadmap builder and progress
- src/app/learning/page.tsx — integrated builder + advisor

The project uses `src/data/careers.ts` for sample career data.

Optional extra packages used by enhancements:

```bash
npm install recharts html-to-image jspdf
# or if you prefer maintained DnD: npm install @hello-pangea/dnd
```

Notes:
- The PDF export uses dynamic imports (`html-to-image` and `jspdf`) so the app won't fail to build if you don't install the optional packages, but to enable download you should install them.
- Charts in the career detail page use `recharts`; install it to see the visualizations.

Live AI Advisor:

1. Set `OPENAI_API_KEY` in your environment (server-side). Example on Windows PowerShell:

```powershell
$env:OPENAI_API_KEY = "sk-...yourkey..."
npm run dev
```

2. The app proxies requests to OpenAI via the server route `/api/advisor-live`.

Drag-and-drop roadmap:

- Drag-and-drop editing uses `@hello-pangea/dnd` when installed. If you don't install it, the builder falls back to move-up/down buttons.

Install optional packages for full functionality:

```bash
npm install recharts html-to-image jspdf @hello-pangea/dnd
```
