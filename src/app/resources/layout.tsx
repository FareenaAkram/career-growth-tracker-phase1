import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
  description: "Curated learning resources — MDN, freeCodeCamp, Fireship, Kevin Powell, and more.",
  openGraph: { title: "Resources | CareerViz", description: "Curated learning resources for tech careers." },
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
