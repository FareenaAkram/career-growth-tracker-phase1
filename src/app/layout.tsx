import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/app-shell/AppShell";

/* ── Font (self-hosted at build, zero runtime network hit) ── */
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  preload: true,
});

/* ── Viewport ── */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050816",
};

/* ── Root metadata (each page overrides via template) ── */
export const metadata: Metadata = {
  metadataBase: new URL("https://careerviz.app"),
  title: {
    default: "CareerViz — Career Growth Tracker",
    template: "%s | CareerViz",
  },
  description:
    "Explore tech career paths, build personalized roadmaps, track your learning progress, and land your dream job with AI-powered guidance.",
  keywords: [
    "career paths",
    "tech roadmap",
    "learning tracker",
    "software engineer",
    "frontend developer",
    "career growth",
    "coding skills",
    "job search",
  ],
  authors: [{ name: "CareerViz" }],
  creator: "CareerViz",
  publisher: "CareerViz",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://careerviz.app",
    siteName: "CareerViz",
    title: "CareerViz — Career Growth Tracker",
    description:
      "AI-powered career roadmaps, progress tracking, and job matching for tech professionals.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CareerViz — Career Growth Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerViz — Career Growth Tracker",
    description: "AI-powered career roadmaps and progress tracking.",
    images: ["/og-image.png"],
    creator: "@careerviz",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  category: "education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={manrope.variable}
    >
      <head>
        {/* DNS prefetch for external APIs used at runtime */}
        <link rel="dns-prefetch" href="https://remoteok.com" />
        <link rel="dns-prefetch" href="https://logo.clearbit.com" />
      </head>
      <body className={`${manrope.className} min-h-screen antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
