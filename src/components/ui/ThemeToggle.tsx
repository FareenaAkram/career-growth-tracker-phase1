"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as "light" | "dark" | null;
      if (stored) {
        setTheme(stored);
        document.documentElement.classList.toggle("light", stored === "light");
        return;
      }
      // no stored preference -> use system preference
      const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
      const initial = prefersLight ? "light" : "dark";
      setTheme(initial);
      document.documentElement.classList.toggle("light", initial === "light");
    } catch (e) {
      // ignore
    }
  }, []);

  function toggle() {
    const next: "light" | "dark" = theme === "light" ? "dark" : "light";
    setTheme(next);
    try {
      localStorage.setItem("theme", next);
      document.documentElement.classList.toggle("light", next === "light");
    } catch (e) {
      // ignore
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="rounded-md border border-border px-3 py-2 text-sm hover:bg-secondary"
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
