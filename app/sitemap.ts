import type { MetadataRoute } from "next";
export const dynamic = "force-dynamic";
import { NIVEAUX, MATIERES, getAllSeries } from "@/lib/data";

const BASE_URL = "https://gtscoursenligne.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const pagesFixes = ["", "/series", "/professeurs", "/contact"].map((p) => ({
    url: `${BASE_URL}${p}`,
    lastModified: now,
  }));

  const pagesNiveau = NIVEAUX.map((n) => ({
    url: `${BASE_URL}/series/${n.slug}`,
    lastModified: now,
  }));

  const pagesMatiere = NIVEAUX.flatMap((n) =>
    MATIERES.map((m) => ({
      url: `${BASE_URL}/series/${n.slug}/${m.slug}`,
      lastModified: now,
    }))
  );

  // Wrap D1 query in try/catch so sitemap still returns static URLs
  // even if the database is temporarily unavailable (cold start, timeout, etc.)
  let pagesSerie: MetadataRoute.Sitemap = [];
  try {
    const series = await getAllSeries();
    pagesSerie = series.map((s) => ({
      url: `${BASE_URL}/series/${s.niveau}/${s.matiere}/${s.slug}`,
      lastModified: now,
    }));
  } catch (error) {
    console.error("[sitemap] Failed to fetch series from D1:", error);
  }

  return [...pagesFixes, ...pagesNiveau, ...pagesMatiere, ...pagesSerie];
}
