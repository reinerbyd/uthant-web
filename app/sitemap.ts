import type { MetadataRoute } from "next";
import { SITE, residenceSlugs } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const fixed = ["", "/the-quarter", "/investment"].map((p) => ({
    url: `${base}${p || "/"}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const residences = residenceSlugs.map((slug) => ({
    url: `${base}/collection/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...fixed, ...residences];
}
