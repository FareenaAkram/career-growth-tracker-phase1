"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { careers } from "@/data/careers";

export default function DashboardClient() {
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cgt-saved") || "[]";
      setSaved(JSON.parse(raw));
    } catch (e) {
      setSaved([]);
    }
  }, []);

  function remove(id: string) {
    try {
      const next = saved.filter((s) => s !== id);
      localStorage.setItem("cgt-saved", JSON.stringify(next));
      setSaved(next);
    } catch (e) {}
  }

  const items = useMemo(() => careers.filter((c) => saved.includes(c.id)), [saved]);

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <div className="text-lg font-semibold">No saved careers</div>
        <div className="mt-2 text-sm text-muted-foreground">Save careers from the detail page to track progress here.</div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => (
        <div key={c.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Saved</div>
              <div className="mt-1 text-lg font-semibold">{c.title}</div>
            </div>
            <div className="flex flex-col items-end">
              <Link href={`/careers/${c.id}`} className="text-sm text-primary">Open</Link>
              <button onClick={() => remove(c.id)} className="mt-2 rounded-md border border-border px-2 py-1 text-xs">Remove</button>
            </div>
          </div>
          <div className="mt-3 text-sm text-muted-foreground">Next step</div>
          <div className="mt-1 text-sm font-medium">{c.roadmap.beginner[0]?.title}</div>
        </div>
      ))}
    </div>
  );
}
