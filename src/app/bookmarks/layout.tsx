import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "All your saved career paths, resources, and jobs in one place.",
  openGraph: { title: "Bookmarks | CareerViz", description: "Your saved careers, resources, and jobs." },
};

export default function BookmarksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
