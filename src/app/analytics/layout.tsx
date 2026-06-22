import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Deep-dive into your learning analytics — progress charts, skill breakdown, and weekly insights.",
  openGraph: { title: "Analytics | CareerViz", description: "Visualize your career progress with charts and insights." },
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
