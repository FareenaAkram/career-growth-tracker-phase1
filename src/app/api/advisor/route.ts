import { NextResponse } from "next/server";
import { careers } from "@/data/careers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { interests = [], skills = [], education = "" } = body;

    // Very small heuristic: pick careers that share keywords with interests/skills
    const query = [...interests, ...skills].map(String).join(" ").toLowerCase();

    const matches = careers
      .map((c) => {
        const score = [c.title, c.description, ...c.skills, ...c.tools]
          .join(" ")
          .toLowerCase()
          .split(" ")
          .reduce((acc, token) => (query.includes(token) ? acc + 1 : acc), 0);
        return { career: c, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((r) => ({
        id: r.career.id,
        title: r.career.title,
        reason: `Matches skills/interests: ${r.score} keywords`,
        roadmapSummary: r.career.roadmap.beginner.map((n) => n.title).slice(0, 3),
      }));

    const fallback = careers.slice(0, 3).map((c) => ({
      id: c.id,
      title: c.title,
      reason: "Suggested based on broad fit",
      roadmapSummary: c.roadmap.beginner.map((n) => n.title).slice(0, 3),
    }));

    return NextResponse.json({ suggestions: matches.length ? matches : fallback });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
