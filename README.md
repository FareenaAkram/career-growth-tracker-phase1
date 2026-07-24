# Career Growth Tracker

A career visualization web app that helps users explore career paths, build learning roadmaps, and get AI-driven guidance on their next steps.

Open [(https://career-growth-tracker-flax.vercel.app/)] to view it live
## Built With

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

- **Next.js (App Router)** — routing and server components
- **TypeScript** — type safety across the app
- **Tailwind CSS** — styling
- **Recharts** *(optional)* — data visualizations on career detail pages
- **@hello-pangea/dnd** *(optional)* — drag-and-drop roadmap builder

## Features

- 🔍 **Career Explorer** — browse a grid of career paths
- 📄 **Career Detail Pages** — interactive roadmap visualization per career
- 🗺️ **Learning Roadmap Builder** — build a 4-week plan with progress tracking, drag-and-drop reordering
- 🤖 **AI Career Advisor** — get personalized suggestions (mock mode by default, live mode via OpenAI)
- 📊 **Dashboard** — surfaced suggestions and progress overview
- 🌗 **Dark/Light Theme Toggle**

## Getting Started

```bash
# Clone the repo
git clone https://github.com/FareenaAkram/career-growth-tracker-phase1.git
cd career-growth-tracker-phase1

# Install dependencies
npm install

# Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Optional Enhancements

Install these to unlock charts, PDF export, and drag-and-drop:

```bash
npm install recharts html-to-image jspdf @hello-pangea/dnd
```

The app is built to degrade gracefully without them — charts and drag-and-drop simply fall back to simpler UI (e.g. move up/down buttons) if the packages aren't installed.

### Enabling the Live AI Advisor

By default, the AI Advisor runs in mock mode. To connect it to a real model:

1. Set `OPENAI_API_KEY` in your environment (server-side only — never commit this key)
2. Restart the dev server

The app proxies requests through a server route (`/api/advisor-live`) so the key is never exposed to the client.

## Project Structure

```
src/
├── app/
│   ├── api/advisor/route.ts       # Mock AI advisor API
│   └── learning/page.tsx          # Roadmap builder + advisor
├── components/
│   ├── ui/ThemeToggle.tsx
│   ├── advisor/AIAdvisor.tsx
│   └── learning/RoadmapBuilder.tsx
└── data/careers.ts                # Sample career data
```

## Contact

**Fareena Akram** — Frontend Engineer
📧 fareenaakram18@gmail.com
🔗 [LinkedIn](https://www.linkedin.com/in/fareena-akram-94a75b128/)

