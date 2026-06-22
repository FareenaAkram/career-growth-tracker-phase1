import { NextResponse } from "next/server";

export const revalidate = 3600; // cache 1 hour

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag") ?? "javascript";

  try {
    const res = await fetch(`https://remoteok.com/api?tag=${tag}`, {
      headers: {
        "User-Agent": "CareerGrowthTracker/1.0",
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("RemoteOK fetch failed");

    const raw = await res.json();
    // First element is metadata, rest are jobs
    const jobs = (Array.isArray(raw) ? raw.slice(1) : [])
      .filter((j: any) => j.position && j.company)
      .slice(0, 20)
      .map((j: any) => ({
        id: j.id ?? j.slug,
        title: j.position,
        company: j.company,
        location: j.location ?? "Remote",
        type: "Remote",
        salary: j.salary_min && j.salary_max
          ? `$${Math.round(j.salary_min / 1000)}k–$${Math.round(j.salary_max / 1000)}k`
          : j.salary ?? null,
        description: j.description
          ? j.description.replace(/<[^>]+>/g, "").slice(0, 240) + "…"
          : `${j.position} role at ${j.company}.`,
        tags: j.tags ?? [],
        url: j.url ?? `https://remoteok.com/remote-jobs/${j.slug}`,
        logo: j.company_logo ?? null,
        date: j.date,
      }));

    return NextResponse.json({ jobs });
  } catch (err) {
    // Return mock fallback data if RemoteOK is unavailable
    return NextResponse.json({ jobs: FALLBACK_JOBS, fallback: true });
  }
}

const FALLBACK_JOBS = [
  { id: "1", title: "Frontend Developer", company: "Vercel", location: "Remote", type: "Full-time", salary: "$90k–$130k", description: "Join the team building the future of web deployment. Work on Next.js, React, and TypeScript.", tags: ["React","TypeScript","Next.js"], url: "https://vercel.com/careers", logo: null, date: new Date().toISOString() },
  { id: "2", title: "React Engineer", company: "Linear", location: "Remote", type: "Full-time", salary: "$100k–$150k", description: "Build the fastest project management tool on earth. We care deeply about craft and speed.", tags: ["React","TypeScript","GraphQL"], url: "https://linear.app/careers", logo: null, date: new Date().toISOString() },
  { id: "3", title: "Full Stack Developer", company: "Supabase", location: "Remote (Global)", type: "Full-time", salary: "$80k–$120k", description: "Help build the open-source Firebase alternative. Work on Postgres, Next.js, and developer tooling.", tags: ["Node.js","React","PostgreSQL"], url: "https://supabase.com/careers", logo: null, date: new Date().toISOString() },
  { id: "4", title: "UI Engineer", company: "Figma", location: "San Francisco / Remote", type: "Full-time", salary: "$130k–$180k", description: "Work on the design tool used by millions. Focus on performance, accessibility, and beautiful interactions.", tags: ["React","CSS","TypeScript","Performance"], url: "https://www.figma.com/careers/", logo: null, date: new Date().toISOString() },
  { id: "5", title: "JavaScript Developer", company: "Netlify", location: "Remote", type: "Full-time", salary: "$85k–$125k", description: "Build the platform powering millions of web experiences. Work on build tooling and developer experience.", tags: ["JavaScript","Node.js","React"], url: "https://www.netlify.com/careers/", logo: null, date: new Date().toISOString() },
  { id: "6", title: "TypeScript Engineer", company: "Prisma", location: "Remote (Berlin / SF)", type: "Full-time", salary: "$90k–$140k", description: "Build the next-generation ORM for TypeScript developers. Shape how developers interact with databases.", tags: ["TypeScript","Node.js","Rust"], url: "https://www.prisma.io/careers", logo: null, date: new Date().toISOString() },
  { id: "7", title: "Frontend Engineer", company: "Stripe", location: "Remote / NYC", type: "Full-time", salary: "$140k–$200k", description: "Build financial infrastructure for the internet. Work on complex dashboards, developer docs, and payment UIs.", tags: ["React","TypeScript","CSS"], url: "https://stripe.com/jobs", logo: null, date: new Date().toISOString() },
  { id: "8", title: "Software Engineer — Web", company: "Notion", location: "San Francisco / Remote", type: "Full-time", salary: "$120k–$170k", description: "Build the all-in-one workspace that teams love. Focus on performance, real-time collaboration, and rich text editing.", tags: ["React","TypeScript","Electron"], url: "https://www.notion.so/careers", logo: null, date: new Date().toISOString() },
];
