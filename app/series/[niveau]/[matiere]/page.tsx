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
import SearchBar from "@/components/SearchBar";

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
  searchParams: Promise<{ categorie?: string; q?: string }>;
}) {
  const { niveau: niveauSlug, matiere: matiereSlug } = await params;
  const { categorie: categorieActive, q: query } = await searchParams;
  const niveau = NIVEAUX.find((n) => n.slug === niveauSlug);
  const matiere = MATIERES.find((m) => m.slug === matiereSlug);
  if (!niveau || !matiere) notFound();

  const toutesLesSeries = await getSeriesParNiveauEtMatiere(niveau.slug as Niveau, matiere.slug as Matiere);
  
  let series = toutesLesSeries;
  
  if (categorieActive) {
    series = series.filter((s) => s.categorie === categorieActive);
  }
  
  if (query) {
    const searchTerms = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    series = series.filter((serie) => {
      const searchString = [serie.titre, serie.resume]
        .join(" ")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      return searchTerms.every((term) => searchString.includes(term));
    });
  }

  return (
    <div className="bg-encre min-h-screen text-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-xs text-solaire uppercase tracking-wider mb-2">
          {niveau.nom} · {matiere.nom}
        </p>
        <h1 className="font-display text-3xl text-white mb-6">
          Séries de {matiere.nom.toLowerCase()}
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex overflow-x-auto whitespace-nowrap gap-2 pb-2 -mx-6 px-6 sm:mx-0 sm:px-0 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full md:w-auto">
            <Link
              href={`/series/${niveau.slug}/${matiere.slug}${query ? `?q=${query}` : ""}`}
              className={`font-body text-sm px-5 py-2.5 rounded-full border transition-colors ${
                !categorieActive
                  ? "bg-azur text-white border-azur shadow-sm"
                  : "border-white/10 text-white/60 hover:border-azur hover:text-white bg-white/5"
              }`}
            >
              Tout
            </Link>
            {CATEGORIES.filter((c) => 
              c.slug !== "concours" || niveau.slug.startsWith("terminale")
            ).map((c) => (
              <Link
                key={c.slug}
                href={`/series/${niveau.slug}/${matiere.slug}?categorie=${c.slug}${query ? `&q=${query}` : ""}`}
                className={`font-body text-sm px-5 py-2.5 rounded-full border transition-colors ${
                  categorieActive === c.slug
                    ? "bg-azur text-white border-azur shadow-sm"
                    : "border-white/10 text-white/60 hover:border-azur hover:text-white bg-white/5"
                }`}
              >
                {c.nomCourt}
              </Link>
            ))}
          </div>

          <div className="w-full md:w-64 shrink-0">
            <SearchBar initialQuery={query || ""} />
          </div>
        </div>

        {series.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white/[0.02] rounded-3xl border border-white/5 text-center">
            <p className="font-body text-white/60 mb-6">
              Aucune série n'est disponible pour cette recherche.
            </p>
            <a 
              href="https://wa.me/221788244692"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-body font-semibold px-6 py-3 rounded-full hover:bg-[#20b858] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              Rejoindre le groupe WhatsApp
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.map((s) => (
              <SeriesCard key={s.slug} serie={s} highlightTerm={query?.trim()} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
