"use client";

import { useState } from "react";

export default function AIAdvisor() {
  const [interests, setInterests] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [useLive, setUseLive] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = useLive ? "/api/advisor-live" : "/api/advisor";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: interests.split(",").map((s) => s.trim()).filter(Boolean),
          skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
          education,
        }),
      });
      const data = await res.json();
      setResults(data.suggestions ?? data.suggestions ?? []);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI Career Advisor</h3>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={useLive} onChange={(e) => setUseLive(e.target.checked)} /> Live
        </label>
      </div>
      <form onSubmit={handleSubmit} className="mt-3 space-y-3">
        <div>
          <label className="text-sm text-muted-foreground">Interests (comma separated)</label>
          <input
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Skills (comma separated)</label>
          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Education / notes</label>
          <input
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {loading ? "Thinking…" : "Get suggestions"}
          </button>
        </div>
      </form>

      <div className="mt-4 space-y-3">
        {results.map((r) => (
          <div key={r.id} className="rounded-md border border-border bg-background p-3">
            <div className="font-semibold">{r.title}</div>
            <div className="text-sm text-muted-foreground">{r.reason}</div>
            <div className="mt-2 text-sm">Roadmap: {Array.isArray(r.roadmapSummary) ? r.roadmapSummary.join(", ") : "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
