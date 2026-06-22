"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BellIcon, MagnifyingGlassIcon, XMarkIcon, BookmarkIcon,
  AcademicCapIcon, BriefcaseIcon, ChartBarIcon, HomeIcon, Bars3Icon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useXp, useSettings } from "@/store/useAppStore";
import { useMobileNav } from "@/contexts/MobileNavContext";

const nav = [
  { href: "/",          label: "Explorer",  icon: HomeIcon },
  { href: "/dashboard", label: "Dashboard", icon: ChartBarIcon },
  { href: "/learning",  label: "Learning",  icon: AcademicCapIcon },
  { href: "/analytics", label: "Analytics", icon: ChartBarIcon },
  { href: "/jobs",      label: "Jobs",      icon: BriefcaseIcon },
];

const quickLinks = [
  { href: "/careers/frontend-developer", label: "Frontend Developer" },
  { href: "/careers/backend-developer",  label: "Backend Developer" },
  { href: "/projects",  label: "Projects" },
  { href: "/resources", label: "Resources" },
  { href: "/bookmarks", label: "Bookmarks" },
];

export default function Topbar() {
  const { toggle: onMenuClick } = useMobileNav();
  const pathname = usePathname();
  const [search, setSearch] = useState(false);
  const [query, setQuery]   = useState("");
  const xp       = useXp();
  const settings = useSettings();

  const initials = settings.name
    ? settings.name.trim().split(/\s+/).map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  const filtered = query.trim().length > 1
    ? quickLinks.filter(l => l.label.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.15 }}
      style={{
        height: 64, position: "sticky", top: 0, zIndex: 30,
        background: "rgba(6,9,22,0.88)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        display: "flex", alignItems: "center", paddingInline: "clamp(14px,2vw,24px)",
        gap: 12,
      }}
    >
      {/* Hamburger — mobile only */}
      <button onClick={onMenuClick} className="hamburger-btn btn-icon" style={{ display: "none" }}>
        <Bars3Icon className="icon-sm" />
      </button>

      {/* Logo — hidden on desktop (sidebar has it), shown on mobile */}
      <Link href="/" className="mobile-logo"
        style={{ display: "none", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg,#6E58FF,#2DD4BF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M3 12a9 9 0 0118 0" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M12 3a9 9 0 010 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 5" />
          </svg>
        </div>
        <span style={{ fontSize: 15, fontWeight: 800 }}>
          <span style={{ color: "white" }}>Career</span>
          <span style={{ background: "linear-gradient(90deg,#6E58FF,#2DD4BF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Viz</span>
        </span>
      </Link>

      {/* Desktop nav */}
      <nav className="topbar-desktop-nav" style={{ display: "flex", alignItems: "center", flex: 1, gap: 0 }}>
        {nav.map(it => (
          <Link key={it.href} href={it.href}
            className={`nav-link ${isActive(it.href) ? "active" : ""}`}
            style={{ paddingInline: 16, fontSize: 13, fontWeight: 600 }}>
            {it.label}
          </Link>
        ))}
      </nav>

      {/* Spacer on mobile */}
      <div style={{ flex: 1 }} className="topbar-desktop-nav-hidden" />

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <AnimatePresence>
            {search && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "clamp(160px,22vw,220px)", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: "hidden", position: "absolute", right: 42, top: "50%", transform: "translateY(-50%)" }}
              >
                <input
                  autoFocus value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search pages…"
                  style={{
                    width: "100%", padding: "8px 14px", borderRadius: 12,
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                    color: "white", fontSize: 13, outline: "none", fontFamily: "inherit",
                  }}
                />
                {filtered.length > 0 && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
                    background: "rgba(10,16,32,0.97)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12, backdropFilter: "blur(20px)", overflow: "hidden", zIndex: 99,
                  }}>
                    {filtered.map(l => (
                      <Link key={l.href} href={l.href}
                        onClick={() => { setSearch(false); setQuery(""); }}
                        style={{ display: "block", padding: "10px 14px", fontSize: 13, color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(110,88,255,0.12)"; e.currentTarget.style.color = "white"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
                      >{l.label}</Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => { setSearch(s => !s); setQuery(""); }} className="btn-icon" style={{ position: "relative", zIndex: 1 }}>
            {search ? <XMarkIcon className="icon-sm" /> : <MagnifyingGlassIcon className="icon-sm" />}
          </button>
        </div>

        {/* XP badge */}
        <div className="xp-badge" style={{
          padding: "5px 12px", borderRadius: 99,
          background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
          fontSize: 12, fontWeight: 700, color: "#f59e0b", whiteSpace: "nowrap",
        }}>⚡ {xp.toLocaleString()} XP</div>

        {/* Bookmarks */}
        <Link href="/bookmarks">
          <button className="btn-icon">
            <BookmarkIcon className="icon-sm" />
          </button>
        </Link>

        {/* Bell */}
        <div style={{ position: "relative" }}>
          <button className="btn-icon">
            <BellIcon className="icon-sm" />
          </button>
          <span style={{ position: "absolute", top: 7, right: 7, width: 6, height: 6, borderRadius: "50%", background: "#6E58FF", border: "2px solid #060916" }} />
        </div>

        {/* Avatar */}
        <Link href="/settings" className="avatar-sm">
          {initials}
        </Link>
      </div>
    </motion.header>
  );
}
