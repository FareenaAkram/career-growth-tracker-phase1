import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "Curated real-world projects on LeetCode, GreatFrontend, Frontend Mentor, and more.",
  openGraph: { title: "Projects | CareerViz", description: "Real-world project challenges to build your portfolio." },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
