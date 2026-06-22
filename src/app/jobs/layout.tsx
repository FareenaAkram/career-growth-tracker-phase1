import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobs",
  description: "Browse real remote tech jobs matched to your skill level. One click to apply on the company site.",
  openGraph: { title: "Jobs | CareerViz", description: "Remote tech jobs matched to your career path." },
};

export default function JobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
