"use client";

import { BookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolid } from "@heroicons/react/24/solid";
import { useAppStore } from "@/store/useAppStore";

export default function SaveCareerButton({ careerId }: { careerId: string }) {
  const savedCareers = useAppStore((s) => s.savedCareers);
  const saveCareer   = useAppStore((s) => s.saveCareer);
  const removeCareer = useAppStore((s) => s.removeCareer);

  const saved = savedCareers.includes(careerId);

  function toggle() {
    if (saved) removeCareer(careerId);
    else saveCareer(careerId);
  }

  return (
    <button
      onClick={toggle}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "10px 20px", borderRadius: 14,
        background: saved ? "linear-gradient(135deg,#6E58FF,#a855f7)" : "rgba(110,88,255,0.12)",
        border: saved ? "none" : "1px solid rgba(110,88,255,0.4)",
        color: saved ? "white" : "#a78bfa",
        fontWeight: 600, fontSize: 14, cursor: "pointer",
        transition: "all 0.2s", whiteSpace: "nowrap",
        fontFamily: "inherit",
      }}
    >
      {saved
        ? <BookmarkSolid style={{ width: 16, height: 16 }} />
        : <BookmarkIcon  style={{ width: 16, height: 16 }} />}
      {saved ? "Saved" : "Save career"}
    </button>
  );
}
