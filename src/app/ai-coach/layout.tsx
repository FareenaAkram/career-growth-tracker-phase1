import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Coach",
  description: "Get personalized career advice and learning path recommendations from your AI career coach.",
  openGraph: { title: "AI Coach | CareerViz", description: "AI-powered career coaching and skill recommendations." },
};

export default function AiCoachLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
