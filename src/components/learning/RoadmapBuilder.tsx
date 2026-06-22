"use client";

import { useEffect, useMemo, useState } from "react";
import { careers, type Career } from "@/data/careers";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

type Milestone = { id: string; text: string };

type ProgressStore = Record<string, { [taskId: string]: boolean }>;

function buildWeeklyPlan(career: Career, milestonesMap?: Record<string, Milestone[]>) {
  // Create four weeks by flattening beginner nodes and their milestones
  const items = career.roadmap.beginner.flatMap((n) => {
    const nodeMilestones = milestonesMap?.[n.id] ?? n.milestones;
    const tasks = [
      { id: `${n.id}:read`, text: `Study: ${n.title}` },
      ...nodeMilestones.map((m) => ({ id: `${n.id}:${m.id}`, text: m.text })),
    ];
    return tasks;
  });

  // split into 4 buckets
  const weeks: { id: number; tasks: { id: string; text: string }[] }[] = [];
  const perWeek = Math.ceil(items.length / 4) || 1;
  for (let i = 0; i < 4; i++) {
    weeks.push({ id: i + 1, tasks: items.slice(i * perWeek, i * perWeek + perWeek) });
  }
  return weeks;
}

export default function RoadmapBuilder() {
  const [selected, setSelected] = useState<string>(careers[0].id);
  const career = useMemo(() => careers.find((c) => c.id === selected)!, [selected]);
  const [milestonesMap, setMilestonesMap] = useState<Record<string, Milestone[]>>({});
  const initialWeeks = useMemo(() => buildWeeklyPlan(career, milestonesMap), [career, milestonesMap]);
  const [weeksState, setWeeksState] = useState(() => initialWeeks);
  

  const [progress, setProgress] = useState<ProgressStore>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cgt-progress") || "{}";
      setProgress(JSON.parse(raw));
    } catch (e) {
      setProgress({});
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cgt-progress", JSON.stringify(progress));
    } catch (e) {
      // ignore
    }
  }, [progress]);

  useEffect(() => {
    // load stored milestone overrides for this career and reset weeks
    try {
      const raw = localStorage.getItem(`cgt-milestones-${career.id}`) || "{}";
      const map = JSON.parse(raw) as Record<string, Milestone[]>;
      setMilestonesMap(map);
      setWeeksState(buildWeeklyPlan(career, map));
    } catch (e) {
      setMilestonesMap({});
      setWeeksState(buildWeeklyPlan(career));
    }
  }, [career]);

  useEffect(() => {
    // rebuild if milestonesMap changes
    setWeeksState(buildWeeklyPlan(career, milestonesMap));
  }, [milestonesMap, career]);

  useEffect(() => {
    // listen for changes dispatched by NodeDetails or other writers
    function handler(e: Event) {
      try {
        const raw = localStorage.getItem(`cgt-milestones-${career.id}`) || "{}";
        const map = JSON.parse(raw) as Record<string, Milestone[]>;
        setMilestonesMap(map);
      } catch (err) {
        setMilestonesMap({});
      }
    }

    window.addEventListener("cgt-milestones-changed", handler as EventListener);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("cgt-milestones-changed", handler as EventListener);
      window.removeEventListener("storage", handler);
    };
  }, [career.id]);

  // DnD and export libs are imported statically to avoid dynamic-import warnings

  function toggleTask(taskId: string) {
    setProgress((prev) => {
      const copy = { ...prev };
      const careerProg = { ...(copy[career.id] ?? {}) };
      careerProg[taskId] = !careerProg[taskId];
      copy[career.id] = careerProg;
      return copy;
    });
  }

  function moveTask(weekIndex: number, taskIndex: number, dir: -1 | 1) {
    setWeeksState((prev) => {
      const copy = prev.map((w) => ({ ...w, tasks: [...w.tasks] }));
      const tasks = copy[weekIndex].tasks;
      const newIndex = taskIndex + dir;
      if (newIndex < 0 || newIndex >= tasks.length) return copy;
      const tmp = tasks[newIndex];
      tasks[newIndex] = tasks[taskIndex];
      tasks[taskIndex] = tmp;
      return copy;
    });
  }

  function onDragEnd(result: any) {
    if (!result.destination) return;
    const { source, destination } = result;
    setWeeksState((prev) => {
      const copy = prev.map((w) => ({ ...w, tasks: [...w.tasks] }));
      const [moved] = copy[source.droppableId].tasks.splice(source.index, 1);
      copy[destination.droppableId].tasks.splice(destination.index, 0, moved);
      return copy;
    });
  }

  const stats = useMemo(() => {
    const tasks = weeksState.flatMap((w) => w.tasks);
    const total = tasks.length;
    const done = tasks.filter((t) => progress[career.id]?.[t.id]).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, pct };
  }, [weeksState, progress, career]);

  async function downloadPDF() {
    const node = document.getElementById("roadmap-builder");
    if (!node) return;
    try {
      const dataUrl = await toPng(node);
      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${career.id}-roadmap.pdf`);
    } catch (e) {
      // ignore
    }
  }

  return (
    <div id="roadmap-builder" className="grid gap-6 lg:grid-cols-3">
      <div className="col-span-2 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Learning Roadmap Builder</h2>
            <div className="text-sm text-muted-foreground">Create a 4-week plan from a career.</div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              {careers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <button
              onClick={downloadPDF}
              className="rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
            >
              Download PDF
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {/* Render drag-and-drop interface */}
          <DragDropContext onDragEnd={onDragEnd}>
            {weeksState.map((w, wi) => (
              <Droppable droppableId={String(wi)} key={w.id}>
                {(provided: any) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="rounded-lg border border-border bg-background p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">Week {w.id}</div>
                      <div className="text-sm text-muted-foreground">{w.tasks.length} tasks</div>
                    </div>
                    <div className="mt-3 space-y-2">
                      {w.tasks.map((t, ti) => (
                        <Draggable key={t.id} draggableId={t.id} index={ti}>
                          {(prov: any) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className="flex items-center gap-3"
                            >
                              <input
                                type="checkbox"
                                checked={!!progress[career.id]?.[t.id]}
                                onChange={() => toggleTask(t.id)}
                                className="h-4 w-4"
                              />
                              <div className="text-sm flex-1">{t.text}</div>
                              <div className="text-xs text-muted-foreground">⠿</div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        </div>
      </div>

      <aside className="rounded-xl border border-border bg-card p-4">
        <div className="text-sm text-muted-foreground">Progress</div>
        <div className="mt-2 text-2xl font-semibold">{stats.pct}%</div>
        <div className="mt-3 text-sm">{stats.done} of {stats.total} tasks completed</div>
        <div className="mt-4 h-3 w-full rounded-full bg-background">
          <div
            className="h-3 rounded-full bg-primary"
            style={{ width: `${stats.pct}%` }}
          />
        </div>

        <div className="mt-4 text-sm text-muted-foreground">Career</div>
        <div className="mt-1 font-medium">{career.title}</div>
        <div className="mt-2 text-sm text-muted-foreground">Time to job-ready</div>
        <div className="mt-1">{career.timeToJobReady}</div>
      </aside>
    </div>
  );
}
