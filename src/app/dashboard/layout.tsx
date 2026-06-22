import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personalized career progress dashboard — XP, milestones, and active roadmaps at a glance.",
  openGraph: { title: "Dashboard | CareerViz", description: "Track your career progress in real time." },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
