import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning",
  description: "Browse all courses and skill modules. Filter by stage, track your progress, and earn XP.",
  openGraph: { title: "Learning | CareerViz", description: "Browse tech courses and skill modules." },
};

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
