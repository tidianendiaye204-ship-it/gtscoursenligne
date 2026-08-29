import type { Metadata } from "next";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  NIVEAUX,
  MATIERES,
  CATEGORIES,
  getSeriesParNiveauEtMatiere,
  type Niveau,
  type Matiere,
  type Categorie,
} from "@/lib/data";
import SeriesCard from "@/components/SeriesCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ niveau: string; matiere: string }>;
}): Promise<Metadata> {
  const { niveau: niveauSlug, matiere: matiereSlug } = await params;
  const niveau = NIVEAUX.find((n) => n.slug === niveauSlug);
  const matiere = MATIERES.find((m) => m.slug === matiereSlug);
  if (!niveau || !matiere) return {};
  return {
    title: `Exercices de ${matiere.nom} — ${niveau.nom}`,
    description: `Séries d'exercices de ${matiere.nom} et leurs corrections, niveau ${niveau.nom}. Entraîne-toi gratuitement.`,
    alternates: {
      canonical: `/series/${niveauSlug}/${matiereSlug}`,
    },
  };
}

export default async function MatierePage({
  params,
  searchParams,
}: {
  params: Promise<{ niveau: string; matiere: string }>;
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { niveau: niveauSlug, matiere: matiereSlug } = await params;
  const { categorie: categorieActive } = await searchParams;
  const niveau = NIVEAUX.find((n) => n.slug === niveauSlug);
  const matiere = MATIERES.find((m) => m.slug === matiereSlug);
  if (!niveau || !matiere) notFound();

  const toutesLesSeries = await getSeriesParNiveauEtMatiere(niveau.slug as Niveau, matiere.slug as Matiere);
  const series = categorieActive
    ? toutesLesSeries.filter((s) => s.categorie === categorieActive)
    : toutesLesSeries;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-mono text-xs text-azur uppercase tracking-wider mb-2">
        {niveau.nom} · {matiere.nom}
      </p>
      <h1 className="font-display text-3xl text-encre mb-6">
        Séries de {matiere.nom.toLowerCase()}
      </h1>

      <div className="flex flex-wrap gap-2 mb-10">
        <Link
          href={`/series/${niveau.slug}/${matiere.slug}`}
          className={`font-body text-sm px-4 py-2 rounded-sm border transition-colors ${
            !categorieActive
              ? "bg-encre text-craie border-encre"
              : "border-encre/20 text-ardoise hover:border-azur"
          }`}
        >
          Tout
        </Link>
        {CATEGORIES.filter((c) => 
          c.slug !== "concours" || niveau.slug.startsWith("terminale")
        ).map((c) => (
          <Link
            key={c.slug}
            href={`/series/${niveau.slug}/${matiere.slug}?categorie=${c.slug}`}
            className={`font-body text-sm px-4 py-2 rounded-sm border transition-colors ${
              categorieActive === c.slug
                ? "bg-encre text-craie border-encre"
                : "border-encre/20 text-ardoise hover:border-azur"
            }`}
          >
            {c.nomCourt}
          </Link>
        ))}
      </div>

      {series.length === 0 ? (
        <p className="font-body text-ardoise">
          Rien dans cette catégorie pour l&apos;instant. Rejoins le groupe WhatsApp pour être prévenu
          des ajouts.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {series.map((s) => (
            <SeriesCard key={s.slug} serie={s} />
          ))}
        </div>
      )}
    </section>
  );
}
