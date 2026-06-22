"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

type Milestone = { id: string; text: string };

export default function NodeDetails({
  careerId,
  node,
  onClose,
  onToggleComplete,
  completed,
}: {
  careerId: string;
  node: any;
  onClose: () => void;
  onToggleComplete: (nodeId: string) => void;
  completed: boolean;
}) {
  const [newMilestone, setNewMilestone] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>(node?.milestones ?? []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`cgt-milestones-${careerId}`) || "{}";
      const map = JSON.parse(raw);
      if (node && map[node.id]) setMilestones(map[node.id]);
      else setMilestones(node?.milestones ?? []);
    } catch (e) {
      setMilestones(node?.milestones ?? []);
    }
  }, [careerId, node]);

  function persist(ms: Milestone[]) {
    try {
      const raw = localStorage.getItem(`cgt-milestones-${careerId}`) || "{}";
      const map = JSON.parse(raw);
      map[node.id] = ms;
      localStorage.setItem(`cgt-milestones-${careerId}`, JSON.stringify(map));
      try {
        // notify other components in the same window/tab
        window.dispatchEvent(new CustomEvent("cgt-milestones-changed", { detail: { careerId, nodeId: node.id } }));
      } catch (e) {}
    } catch (e) {}
  }

  function addMilestone() {
    if (!newMilestone.trim()) return;
    const m = { id: `${node.id}-m-${Date.now()}`, text: newMilestone.trim() };
    const next = [...milestones, m];
    setMilestones(next);
    persist(next);
    setNewMilestone("");
  }

  function removeMilestone(id: string) {
    const next = milestones.filter((m) => m.id !== id);
    setMilestones(next);
    persist(next);
  }

  return (
    <motion.aside
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="w-full max-w-md"
    >
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold">{node?.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{node?.description}</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => onToggleComplete(node.id)}
              className={`rounded-md px-3 py-2 text-sm ${completed ? "bg-green-600 text-white" : "border border-border"}`}
            >
              {completed ? "Completed" : "Mark complete"}
            </button>
            <button onClick={onClose} className="text-sm text-muted-foreground">Close</button>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-sm font-semibold">What you'll learn</div>
          <div className="mt-2 text-sm text-muted-foreground">{node?.description}</div>
        </div>

        <div className="mt-4">
          <div className="text-sm font-semibold">Milestones & Projects</div>
          <ul className="mt-2 space-y-2">
            {milestones.map((m) => (
              <li key={m.id} className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm">
                <div>{m.text}</div>
                <button onClick={() => removeMilestone(m.id)} className="text-xs text-muted-foreground">Remove</button>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex gap-2">
            <input value={newMilestone} onChange={(e) => setNewMilestone(e.target.value)} placeholder="Add milestone or project" className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm" />
            <button onClick={addMilestone} className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">Add</button>
          </div>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          <div>Resources</div>
          <div className="mt-2">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="rounded-md border border-border px-3 py-1 text-sm bg-background">Open resources</DropdownMenu.Trigger>
              <DropdownMenu.Content className="mt-2 rounded-md border border-border bg-card p-2">
                <DropdownMenu.Item className="px-2 py-1 text-sm"><a href="#">Official docs</a></DropdownMenu.Item>
                <DropdownMenu.Item className="px-2 py-1 text-sm"><a href="#">Top YouTube tutorial</a></DropdownMenu.Item>
                <DropdownMenu.Item className="px-2 py-1 text-sm"><a href="#">Recommended course</a></DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

