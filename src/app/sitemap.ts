import type { MetadataRoute } from "next";
import { careers } from "@/data/careers";

const BASE = "https://careerviz.app";
const now = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                  lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/dashboard`,   lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${BASE}/learning`,    lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/analytics`,   lastModified: now, changeFrequency: "weekly",  priority: 0.75 },
    { url: `${BASE}/jobs`,        lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/projects`,    lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/resources`,   lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/ai-coach`,    lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/bookmarks`,   lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${BASE}/roadmap`,     lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const careerRoutes: MetadataRoute.Sitemap = careers.map((c) => ({
    url: `${BASE}/careers/${c.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...careerRoutes];
}
