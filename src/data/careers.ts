export type RoadmapStage = "beginner" | "intermediate" | "advanced";

export type RoadmapNode = {
  id: string;
  title: string;
  description: string;
  skills: string[];
  tools: string[];
  prerequisites?: string[];
  resources?: {
    id: string;
    title: string;
    url?: string;
    type?: string;
    free?: boolean;
    level?: "Beginner" | "Intermediate" | "Advanced";
    source?: string;
    views?: string;
    duration?: string;
  }[];
  milestones: { id: string; text: string; description?: string }[];
  theme: "purple";
  estimatedTime?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  importance?: "Low" | "Medium" | "High";
};

export type Career = {
  id: string;
  title: string;
  category: "Engineering" | "Data" | "Design" | "Healthcare";
  description: string;
  skills: string[];
  tools: string[];
  salaryRange: { min: number; max: number };
  timeToJobReady: string;
  theme?: string;
  roadmap: {
    beginner: RoadmapNode[];
    intermediate: RoadmapNode[];
    advanced: RoadmapNode[];
  };
};

const node = (
  p: Omit<RoadmapNode, "milestones" | "theme"> & { milestones?: RoadmapNode["milestones"] }
): RoadmapNode => ({
  prerequisites: [],
  resources: [],
  ...p,
  theme: "purple",
  milestones: p.milestones ?? [{ id: `${p.id}-m1`, text: "Complete a capstone milestone." }],
});

export const careers: Career[] = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    category: "Engineering",
    description: "Build user-facing and backend systems with solid fundamentals and clean architecture.",
    skills: ["JavaScript", "TypeScript", "React", "APIs", "Databases", "Testing"],
    tools: ["Git", "Node.js", "PostgreSQL", "Docker"],
    salaryRange: { min: 90000, max: 170000 },
    timeToJobReady: "12–24 months",
    roadmap: {
      beginner: [
        node({
          id: "se-b-1",
          title: "Web fundamentals",
          description: "HTML/CSS, accessibility, responsive layouts, and basic JavaScript.",
          skills: ["HTML", "CSS", "JavaScript", "Accessibility"],
          tools: ["DevTools", "VS Code"],
          milestones: [
            { id: "se-b-1-m1", text: "Build 3 responsive pages" },
            { id: "se-b-1-m2", text: "Add keyboard navigation + ARIA basics" },
          ],
          estimatedTime: "3–4 weeks",
          difficulty: "Beginner",
          importance: "High",
        }),
        node({
          id: "se-b-2",
          title: "Modern JavaScript + TypeScript",
          description: "ES6+, typing strategy, and writing maintainable code.",
          skills: ["TypeScript", "Async patterns", "Testing basics"],
          tools: ["Jest/Vitest"],
          milestones: [
            { id: "se-b-2-m1", text: "Write typed utility library" },
            { id: "se-b-2-m2", text: "Add unit tests for core functions" },
          ],
          estimatedTime: "3–4 weeks",
          difficulty: "Beginner",
          importance: "High",
        }),
      ],
      intermediate: [
        node({
          id: "se-i-1",
          title: "React + state management",
          description: "Components, hooks, data fetching, and state patterns.",
          skills: ["React", "Hooks", "State management"],
          tools: ["React Query", "Zustand"],
          milestones: [
            { id: "se-i-1-m1", text: "Build a CRUD app with optimistic updates" },
            { id: "se-i-1-m2", text: "Implement reusable component library" },
          ],
          estimatedTime: "4–5 weeks",
          difficulty: "Intermediate",
          importance: "High",
        }),
        node({
          id: "se-i-2",
          title: "APIs + backend basics",
          description: "REST APIs, authentication basics, and data modeling.",
          skills: ["REST", "Auth", "Data modeling"],
          tools: ["Node.js", "PostgreSQL"],
          milestones: [
            { id: "se-i-2-m1", text: "Design API schema and implement endpoints" },
            { id: "se-i-2-m2", text: "Add integration tests" },
          ],
          estimatedTime: "4–5 weeks",
          difficulty: "Intermediate",
          importance: "High",
        }),
      ],
      advanced: [
        node({
          id: "se-a-1",
          title: "Architecture + system design",
          description: "Scalability, performance, and maintainable patterns.",
          skills: ["System design", "Performance", "Security"],
          tools: ["Caching", "Observability"],
          milestones: [
            { id: "se-a-1-m1", text: "Write a design doc for a service" },
            { id: "se-a-1-m2", text: "Optimize queries and measure improvements" },
          ],
          estimatedTime: "5–6 weeks",
          difficulty: "Advanced",
          importance: "High",
        }),
        node({
          id: "se-a-2",
          title: "Production-ready portfolio",
          description: "Ship polished projects, write docs, and prepare for interviews.",
          skills: ["Pragmatic testing", "Documentation", "Interview readiness"],
          tools: ["CI/CD", "Lighthouse"],
          milestones: [
            { id: "se-a-2-m1", text: "Ship a deployed app with monitoring" },
            { id: "se-a-2-m2", text: "Publish a portfolio README + demos" },
          ],
          estimatedTime: "4 weeks",
          difficulty: "Advanced",
          importance: "High",
        }),
      ],
    },
  },
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    category: "Engineering",
    description: "Design and implement user-facing applications with modern web tooling.",
    skills: ["HTML", "CSS", "JavaScript", "React", "TypeScript"],
    tools: ["VS Code", "React", "Vite"],
    salaryRange: { min: 80000, max: 150000 },
    timeToJobReady: "6–18 months",
    roadmap: {
      beginner: [
        node({
          id: "fe-b-1",
          title: "HTML & CSS",
          description: "Learn the structure of a web page using HTML and style it with CSS. Master layout, typography, colors, and responsive design basics.",
          skills: ["HTML", "CSS", "Responsive Design"],
          tools: ["Browser DevTools", "VS Code"],
          resources: [
            { id: "fe-r1", title: "HTML Crash Course", url: "#", type: "Video", free: true, source: "YouTube", views: "1.5M views", duration: "2h", level: "Beginner" },
            { id: "fe-r2", title: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Learn/HTML", type: "Article", free: true, source: "MDN", views: "Developer Docs", level: "Beginner" },
            { id: "fe-r3", title: "CSS Flexbox Guide", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", type: "Article", free: true, source: "css-tricks.com", level: "Beginner" },
          ],
          milestones: [
            { id: "fe-b-1-m1", text: "Build Your First Web Page", description: "Create a simple personal webpage using HTML & CSS." },
          ],
          estimatedTime: "2–3 weeks",
          difficulty: "Beginner",
          importance: "High",
        }),
        node({
          id: "fe-b-2",
          title: "JavaScript Basics",
          description: "Understand core JavaScript concepts including DOM manipulation, events, and modern ES6+ syntax.",
          skills: ["JavaScript", "DOM", "Events", "ES6+"],
          tools: ["Browser Console", "VS Code"],
          prerequisites: ["fe-b-1"],
          resources: [
            { id: "fe-r4", title: "JavaScript.info", url: "https://javascript.info/", type: "Article", free: true, source: "javascript.info", level: "Beginner" },
            { id: "fe-r5", title: "JS Crash Course", url: "#", type: "Video", free: true, source: "YouTube", views: "3.2M views", duration: "3.5h", level: "Beginner" },
          ],
          milestones: [
            { id: "fe-b-2-m1", text: "Build an interactive To-Do App", description: "Use JavaScript DOM manipulation to create a functional to-do list." },
            { id: "fe-b-2-m2", text: "Refactor with ES6+ features", description: "Convert your code to use arrow functions, destructuring, and modules." },
          ],
          estimatedTime: "3–4 weeks",
          difficulty: "Beginner",
          importance: "High",
        }),
        node({
          id: "fe-b-3",
          title: "Responsive Design",
          description: "Build layouts that work on all devices using CSS Grid, Flexbox, and media queries.",
          skills: ["CSS Grid", "Flexbox", "Media Queries"],
          tools: ["Chrome DevTools", "Responsively App"],
          prerequisites: ["fe-b-2"],
          resources: [
            { id: "fe-r6", title: "CSS Grid Guide", url: "https://css-tricks.com/snippets/css/complete-guide-grid/", type: "Article", free: true, source: "css-tricks.com", level: "Beginner" },
            { id: "fe-r7", title: "Responsive Design – MDN", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design", type: "Article", free: true, source: "MDN", level: "Beginner" },
          ],
          milestones: [
            { id: "fe-b-3-m1", text: "Build Your First Responsive Website", description: "Create a multi-device responsive website with mobile-first design." },
          ],
          estimatedTime: "2 weeks",
          difficulty: "Beginner",
          importance: "Medium",
        }),
        node({
          id: "fe-b-4",
          title: "React Fundamentals",
          description: "Build interactive UIs with React. Learn components, JSX, hooks, props, and basic state management.",
          skills: ["React", "JSX", "Hooks", "Props", "State"],
          tools: ["React DevTools", "Vite", "Create React App"],
          prerequisites: ["fe-b-3"],
          resources: [
            { id: "fe-r8", title: "React Official Docs", url: "https://react.dev/", type: "Article", free: true, source: "react.dev", level: "Beginner" },
            { id: "fe-r9", title: "React Full Course", url: "#", type: "Video", free: true, source: "YouTube", views: "2.1M views", duration: "4h", level: "Beginner" },
          ],
          milestones: [
            { id: "fe-b-4-m1", text: "Build a React counter + todo app", description: "Create stateful React components using useState and useEffect." },
            { id: "fe-b-4-m2", text: "Create a reusable component library", description: "Extract common UI patterns into reusable React components." },
          ],
          estimatedTime: "4–6 weeks",
          difficulty: "Beginner",
          importance: "High",
        }),
      ],
      intermediate: [
        node({
          id: "fe-i-1",
          title: "TypeScript Essentials",
          description: "Add type safety to your JavaScript with TypeScript. Learn interfaces, generics, and practical typing strategies.",
          skills: ["TypeScript", "Interfaces", "Generics", "Type Guards"],
          tools: ["TypeScript Compiler", "VS Code"],
          prerequisites: ["fe-b-4"],
          resources: [
            { id: "fe-r10", title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/", type: "Article", free: true, source: "typescriptlang.org", level: "Intermediate" },
          ],
          milestones: [
            { id: "fe-i-1-m1", text: "Type an existing React project", description: "Migrate a JavaScript React app to TypeScript." },
            { id: "fe-i-1-m2", text: "Build a typed utility library", description: "Create reusable typed utility functions with generics." },
          ],
          estimatedTime: "3–4 weeks",
          difficulty: "Intermediate",
          importance: "High",
        }),
        node({
          id: "fe-i-2",
          title: "State Management & APIs",
          description: "Manage complex application state and integrate with REST APIs using modern tools like Zustand and React Query.",
          skills: ["React Query", "Zustand", "REST APIs", "Async/Await"],
          tools: ["React Query", "Zustand", "Postman"],
          prerequisites: ["fe-i-1"],
          milestones: [
            { id: "fe-i-2-m1", text: "Build a CRUD app with real API", description: "Integrate a REST API with proper loading and error states." },
            { id: "fe-i-2-m2", text: "Implement global state with Zustand", description: "Manage complex app state across multiple components." },
          ],
          estimatedTime: "4 weeks",
          difficulty: "Intermediate",
          importance: "High",
        }),
      ],
      advanced: [
        node({
          id: "fe-a-1",
          title: "Performance & Architecture",
          description: "Optimize web app performance and apply scalable architecture patterns for production-grade applications.",
          skills: ["Code Splitting", "Lazy Loading", "Architecture Patterns", "Performance"],
          tools: ["Lighthouse", "Webpack Bundle Analyzer", "React Profiler"],
          prerequisites: ["fe-i-2"],
          milestones: [
            { id: "fe-a-1-m1", text: "Audit and optimize a real app", description: "Use Lighthouse to identify and fix performance bottlenecks." },
            { id: "fe-a-1-m2", text: "Implement code splitting and lazy loading", description: "Reduce bundle size with dynamic imports and React.lazy." },
          ],
          estimatedTime: "4–6 weeks",
          difficulty: "Advanced",
          importance: "High",
        }),
      ],
    },
  },
  {
    id: "backend-developer",
    title: "Backend Developer",
    category: "Engineering",
    description: "Build servers, APIs, and data systems.",
    skills: ["Node.js", "Databases", "APIs"],
    tools: ["PostgreSQL", "Node.js"],
    salaryRange: { min: 90000, max: 160000 },
    timeToJobReady: "12–24 months",
    roadmap: {
      beginner: [
        node({ id: "be-b-1", title: "Programming Basics", description: "Server-side fundamentals.", skills: ["JavaScript"], tools: ["Node"] }),
      ],
      intermediate: [
        node({ id: "be-i-1", title: "APIs & Databases", description: "REST, SQL, data modeling.", skills: ["SQL"], tools: ["Postgres"], prerequisites: ["be-b-1"] }),
      ],
      advanced: [
        node({ id: "be-a-1", title: "Scalable Systems", description: "Caching, queues, observability.", skills: ["System design"], tools: ["Redis"], prerequisites: ["be-i-1"] }),
      ],
    },
  },
  {
    id: "full-stack-developer",
    title: "Full Stack Developer",
    category: "Engineering",
    description: "Combine frontend and backend skills to deliver end-to-end products.",
    skills: ["React", "Node.js", "Databases"],
    tools: ["Git", "Postgres", "React"],
    salaryRange: { min: 95000, max: 180000 },
    timeToJobReady: "12–24 months",
    roadmap: {
      beginner: [
        node({ id: "fs-b-1", title: "Web Basics", description: "HTML/CSS/JS fundamentals.", skills: ["HTML", "CSS", "JS"], tools: ["VS Code"] }),
      ],
      intermediate: [
        node({ id: "fs-i-1", title: "Frontend Frameworks", description: "React/Next basics.", skills: ["React"], tools: ["React"], prerequisites: ["fs-b-1"] }),
        node({ id: "fs-i-2", title: "Backend Basics", description: "APIs and data storage.", skills: ["Node"], tools: ["Node.js"], prerequisites: ["fs-b-1"] }),
      ],
      advanced: [
        node({ id: "fs-a-1", title: "Deploy & Scale", description: "CI/CD and infra.", skills: ["Docker"], tools: ["Docker", "CI/CD"], prerequisites: ["fs-i-1", "fs-i-2"] }),
      ],
    },
  },
  {
    id: "mobile-developer",
    title: "Mobile Developer",
    category: "Engineering",
    description: "Build mobile applications for iOS and Android using native or cross-platform tools.",
    skills: ["Kotlin/Swift", "React Native"],
    tools: ["Xcode", "Android Studio", "React Native"],
    salaryRange: { min: 80000, max: 160000 },
    timeToJobReady: "12–30 months",
    roadmap: {
      beginner: [node({ id: "mb-b-1", title: "Mobile Basics", description: "Platform fundamentals.", skills: ["JS"], tools: ["Emulators"] })],
      intermediate: [node({ id: "mb-i-1", title: "Cross-platform", description: "React Native basics.", skills: ["React Native"], tools: ["React Native"], prerequisites: ["mb-b-1"] })],
      advanced: [node({ id: "mb-a-1", title: "Deployment", description: "App store releases.", skills: ["Release"], tools: ["App Stores"], prerequisites: ["mb-i-1"] })],
    },
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    category: "Engineering",
    description: "Automate deployments and maintain reliable infrastructure.",
    skills: ["CI/CD", "Containers", "Infrastructure as Code"],
    tools: ["Docker", "Kubernetes"],
    salaryRange: { min: 90000, max: 170000 },
    timeToJobReady: "12–30 months",
    roadmap: { beginner: [node({ id: "do-b-1", title: "Linux & Networking", description: "Basics of servers and networking.", skills: ["Linux"], tools: ["Bash"] })], intermediate: [node({ id: "do-i-1", title: "Containers", description: "Docker and orchestration.", skills: ["Docker"], tools: ["Docker"], prerequisites: ["do-b-1"] })], advanced: [node({ id: "do-a-1", title: "Kubernetes", description: "Clusters and scaling.", skills: ["K8s"], tools: ["Kubernetes"], prerequisites: ["do-i-1"] })] },
  },
  {
    id: "ai-engineer",
    title: "AI Engineer",
    category: "Data",
    description: "Build machine learning models and productionize them.",
    skills: ["Python", "ML", "Data pipelines"],
    tools: ["Python", "scikit-learn", "PyTorch"],
    salaryRange: { min: 100000, max: 200000 },
    timeToJobReady: "18–36 months",
    roadmap: { beginner: [node({ id: "ai-b-1", title: "Math & Python", description: "Linear algebra, calculus, Python basics.", skills: ["Python"], tools: ["Jupyter"] })], intermediate: [node({ id: "ai-i-1", title: "ML Basics", description: "Supervised learning and evaluation.", skills: ["ML"], tools: ["scikit-learn"], prerequisites: ["ai-b-1"] })], advanced: [node({ id: "ai-a-1", title: "Production ML", description: "MLOps and model deployment.", skills: ["MLOps"], tools: ["Docker"], prerequisites: ["ai-i-1"] })] },
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    category: "Data",
    description: "Turn data into decisions using statistics, ML fundamentals, and practical pipelines.",
    skills: ["Python", "Statistics", "Machine Learning", "SQL", "Visualization"],
    tools: ["Python", "Pandas", "SQL", "scikit-learn"],
    salaryRange: { min: 95000, max: 190000 },
    timeToJobReady: "12–30 months",
    roadmap: {
      beginner: [
        node({
          id: "ds-b-1",
          title: "Python + data workflow",
          description: "Learn to manipulate data and write clean scripts/notebooks.",
          skills: ["Python", "Pandas", "Data cleaning"],
          tools: ["Jupyter", "Git"],
          milestones: [
            { id: "ds-b-1-m1", text: "Clean and summarize 2 datasets" },
            { id: "ds-b-1-m2", text: "Write reusable data processing functions" },
          ],
        }),
      ],
      intermediate: [
        node({
          id: "ds-i-1",
          title: "Statistics + ML basics",
          description: "Build intuition with experiments, metrics, and baseline models.",
          skills: ["Statistics", "Model evaluation", "Feature engineering"],
          tools: ["scikit-learn"],
          milestones: [
            { id: "ds-i-1-m1", text: "Train and evaluate baseline models" },
            { id: "ds-i-1-m2", text: "Implement proper train/val/test split" },
          ],
        }),
      ],
      advanced: [
        node({
          id: "ds-a-1",
          title: "Production ML + storytelling",
          description: "Deploy pipelines and communicate insights effectively.",
          skills: ["MLOps basics", "Explainability", "Business communication"],
          tools: ["Docker", "MLflow (optional)"],
          milestones: [
            { id: "ds-a-1-m1", text: "Create an end-to-end pipeline" },
            { id: "ds-a-1-m2", text: "Write a stakeholder-ready report" },
          ],
        }),
      ],
    },
  },
  {
    id: "product-designer",
    title: "Product Designer",
    category: "Design",
    description: "Design intuitive experiences with strong UX, visual polish, and user research.",
    skills: ["UX", "UI", "Prototyping", "Research", "Design systems"],
    tools: ["Figma", "FigJam", "Usability testing"],
    salaryRange: { min: 70000, max: 145000 },
    timeToJobReady: "6–18 months",
    roadmap: {
      beginner: [
        node({
          id: "pd-b-1",
          title: "UX fundamentals",
          description: "User flows, information architecture, and usability basics.",
          skills: ["User research", "IA", "Wireframing"],
          tools: ["Figma"],
          milestones: [
            { id: "pd-b-1-m1", text: "Complete 2 usability tests" },
            { id: "pd-b-1-m2", text: "Build wireframes for a full feature" },
          ],
        }),
      ],
      intermediate: [
        node({
          id: "pd-i-1",
          title: "Interaction + visual UI",
          description: "Create polished interfaces and interactive prototypes.",
          skills: ["Typography", "Layout", "Interaction"],
          tools: ["Figma prototypes"],
          milestones: [
            { id: "pd-i-1-m1", text: "Prototype a complex flow" },
            { id: "pd-i-1-m2", text: "Design a component library" },
          ],
        }),
      ],
      advanced: [
        node({
          id: "pd-a-1",
          title: "Design systems + leadership",
          description: "Scale design with tokens, documentation, and collaboration.",
          skills: ["Design systems", "Accessibility", "Collaboration"],
          tools: ["Tokens", "WCAG"],
          milestones: [
            { id: "pd-a-1-m1", text: "Create a system with tokens" },
            { id: "pd-a-1-m2", text: "Write system usage docs" },
          ],
        }),
      ],
    },
  },
];

export function getCareerById(id: string) {
  return careers.find((c) => c.id === id);
}

export function getNodeById(nodeId: string): { career: Career; node: RoadmapNode; stage: RoadmapStage } | null {
  for (const career of careers) {
    for (const stage of ["beginner", "intermediate", "advanced"] as RoadmapStage[]) {
      const node = career.roadmap[stage].find((n) => n.id === nodeId);
      if (node) return { career, node, stage };
    }
  }
  return null;
}
