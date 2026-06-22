"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  HomeIcon, ChartBarIcon, BookOpenIcon, MapIcon, FolderIcon,
  BookmarkSquareIcon, SparklesIcon, BookmarkIcon,
  PresentationChartLineIcon, BriefcaseIcon, Cog6ToothIcon, XMarkIcon,
} from "@heroicons/react/24/outline";
import { careers } from "@/data/careers";
import { useAppStore, useActiveCareerId } from "@/store/useAppStore";
import { hexToRgb } from "@/lib/utils";
import { NAV_ACCENT } from "@/lib/constants";
import { useMobileNav } from "@/contexts/MobileNavContext";

type SidebarNavItem = { id: string; label: string; icon: React.ElementType; href: string; badge?: string };

const navGroups: { label: string; items: SidebarNavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { id: "explorer",  label: "Explorer",   icon: HomeIcon,                  href: "/" },
      { id: "dashboard", label: "Dashboard",  icon: ChartBarIcon,              href: "/dashboard" },
      { id: "analytics", label: "Analytics",  icon: PresentationChartLineIcon, href: "/analytics" },
    ],
  },
  {
    label: "Learn",
    items: [
      { id: "learning",  label: "Learning",   icon: BookOpenIcon,       href: "/learning" },
      { id: "roadmaps",  label: "Roadmaps",   icon: MapIcon,            href: "/roadmap" },
      { id: "projects",  label: "Projects",   icon: FolderIcon,         href: "/projects" },
      { id: "resources", label: "Resources",  icon: BookmarkSquareIcon, href: "/resources" },
      { id: "aicoach",   label: "AI Coach",   icon: SparklesIcon,       href: "/ai-coach", badge: "AI" },
    ],
  },
  {
    label: "Career",
    items: [
      { id: "jobs",      label: "Jobs",       icon: BriefcaseIcon, href: "/jobs" },
      { id: "bookmarks", label: "Bookmarks",  icon: BookmarkIcon,  href: "/bookmarks" },
    ],
  },
];

export function Sidebar() {
  const { open, close: onClose } = useMobileNav();
  const pathname      = usePathname();
  const activeCareerId = useActiveCareerId();
  const progress      = useAppStore((s) => s.progress);

  const activeCareer = careers.find((c) => c.id === activeCareerId);
  const allNodes = activeCareer
    ? [...activeCareer.roadmap.beginner, ...activeCareer.roadmap.intermediate, ...activeCareer.roadmap.advanced]
    : [];
  const totalMs = allNodes.reduce((s, n) => s + n.milestones.length, 0);
  const doneMs  = allNodes.reduce(
    (s, n) => s + (progress[`${activeCareerId}__${n.id}`] ?? []).length,
    0
  );
  const pct = totalMs > 0 ? Math.round((doneMs / totalMs) * 100) : 0;

  let nextNode: { title: string } | null = null;
  for (const node of allNodes) {
    const done = (progress[`${activeCareerId}__${node.id}`] ?? []).length;
    if (done < node.milestones.length) { nextNode = { title: node.title }; break; }
  }

  const r = 22, circ = 2 * Math.PI * r;

  return (
    <aside
      className={`sidebar-wrapper${open ? " sidebar-open" : ""}`}
      style={{
        background: "rgba(6,9,22,0.97)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        display: "flex", flexDirection: "column",
        backdropFilter: "blur(24px)",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Top ambient glow */}
      <div style={{
        position: "absolute", top: -60, left: -40, width: 300, height: 300,
        background: "radial-gradient(circle, rgba(110,88,255,0.12), transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Brand */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 14px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        position: "relative",
      }}>
        <Link href="/" onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 11,
            background: "linear-gradient(135deg, #6E58FF, #2DD4BF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 24px rgba(110,88,255,0.45), 0 0 8px rgba(45,212,191,0.2)",
            flexShrink: 0,
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M3 12a9 9 0 0118 0" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M12 3a9 9 0 010 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 5" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>
              <span style={{ color: "white" }}>Career</span>
              <span style={{ background: "linear-gradient(90deg,#6E58FF,#2DD4BF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Viz</span>
            </div>
            <div style={{ fontSize: 10, color: "#334155", fontWeight: 500, marginTop: 2 }}>Growth Platform</div>
          </div>
        </Link>

        {/* Mobile close */}
        <button onClick={onClose} className="mobile-only"
          style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", cursor: "pointer", color: "#475569", display: "none", alignItems: "center", justifyContent: "center" }}>
          <XMarkIcon style={{ width: 15, height: 15 }} />
        </button>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 10px", display: "flex", flexDirection: "column", gap: 22, scrollbarWidth: "none" }}>
        {navGroups.map(group => (
          <div key={group.label}>
            <div style={{
              fontSize: 9.5, fontWeight: 700, color: "#1e293b",
              letterSpacing: "0.1em", textTransform: "uppercase",
              padding: "0 10px", marginBottom: 5,
            }}>{group.label}</div>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 1 }}>
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                const accent = NAV_ACCENT[item.id] ?? "#6E58FF";
                const rgb = hexToRgb(accent);

                return (
                  <li key={item.id}>
                    <Link href={item.href} onClick={onClose}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "9px 10px", borderRadius: 11,
                        textDecoration: "none", position: "relative", overflow: "hidden",
                        background: isActive ? `rgba(${rgb},0.1)` : "transparent",
                        border: isActive ? `1px solid rgba(${rgb},0.22)` : "1px solid transparent",
                        color: isActive ? "white" : "#475569",
                        transition: "all 0.18s", fontSize: 13, fontWeight: isActive ? 600 : 500,
                      }}>

                      {/* Active left bar */}
                      {isActive && (
                        <span style={{
                          position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                          width: 3, height: "55%", borderRadius: "0 3px 3px 0",
                          background: accent, boxShadow: `0 0 10px ${accent}80`,
                        }} />
                      )}

                      {/* Icon box */}
                      <span style={{
                        width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: isActive ? `rgba(${rgb},0.15)` : "rgba(255,255,255,0.03)",
                        border: isActive ? `1px solid rgba(${rgb},0.28)` : "1px solid rgba(255,255,255,0.06)",
                        transition: "all 0.18s",
                      }}>
                        <Icon style={{ width: 14, height: 14, color: isActive ? accent : "#475569" }} />
                      </span>

                      <span style={{ flex: 1 }}>{item.label}</span>

                      {item.badge && (
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 99,
                          background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.22)",
                          color: "#ec4899",
                        }}>{item.badge}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Progress card */}
      <div style={{ padding: "0 10px 8px" }}>
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14, padding: "14px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", bottom: -20, right: -20, width: 100, height: 100,
            background: "radial-gradient(circle, rgba(110,88,255,0.08), transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.08em" }}>Your Progress</span>
            <Link href={activeCareer ? `/careers/${activeCareer.id}` : "/"} onClick={onClose}
              style={{ fontSize: 10.5, color: "#6E58FF", textDecoration: "none", fontWeight: 600 }}>View →</Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* SVG ring */}
            <div style={{ position: "relative", width: 54, height: 54, flexShrink: 0 }}>
              <svg width="54" height="54" style={{ transform: "rotate(-90deg)", display: "block" }}>
                <defs>
                  <linearGradient id="sidebarRing" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6E58FF" />
                    <stop offset="100%" stopColor="#2DD4BF" />
                  </linearGradient>
                </defs>
                <circle cx="27" cy="27" r={r} stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="none" />
                <circle cx="27" cy="27" r={r} stroke="url(#sidebarRing)" strokeWidth="4" fill="none"
                  strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 6px rgba(110,88,255,0.6))" }}
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "white" }}>{pct}%</span>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "white", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {activeCareer?.title ?? "Select a career"}
              </div>
              {nextNode && (
                <div style={{ fontSize: 10.5, color: "#475569", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  Next: <span style={{ color: "#64748b" }}>{nextNode.title}</span>
                </div>
              )}
              <div style={{ marginTop: 7, height: 3, borderRadius: 99, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 99, width: `${pct}%`,
                  background: "linear-gradient(90deg,#6E58FF,#2DD4BF)",
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Settings + Upgrade */}
      <div style={{ padding: "0 10px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
        <Link href="/settings" onClick={onClose}
          style={{
            display: "flex", alignItems: "center", gap: 10, padding: "9px 10px",
            borderRadius: 11, textDecoration: "none", fontSize: 13, fontWeight: 500,
            color: pathname === "/settings" ? "white" : "#475569",
            background: pathname === "/settings" ? "rgba(110,88,255,0.1)" : "transparent",
            border: pathname === "/settings" ? "1px solid rgba(110,88,255,0.22)" : "1px solid transparent",
            transition: "all 0.18s",
          }}>
          <span style={{ width: 30, height: 30, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <Cog6ToothIcon style={{ width: 14, height: 14 }} />
          </span>
          Settings
        </Link>

        <div style={{
          background: "linear-gradient(135deg,rgba(245,158,11,0.07),rgba(251,191,36,0.02))",
          border: "1px solid rgba(245,158,11,0.15)", borderRadius: 12, padding: "12px 12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 14 }}>⭐</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b" }}>Pro Plan</span>
          </div>
          <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.5 }}>Unlock all roadmaps & AI features</div>
          <button style={{
            marginTop: 9, width: "100%", padding: "7px", borderRadius: 9,
            background: "linear-gradient(135deg,#f59e0b,#fbbf24)", color: "#1a0800",
            fontWeight: 700, fontSize: 11, border: "none", cursor: "pointer", fontFamily: "inherit",
          }}>Upgrade Now</button>
        </div>
      </div>
    </aside>
  );
}
