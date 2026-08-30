"use client";

import { useState, useEffect } from "react";
import { type Serie, NIVEAUX, MATIERES } from "@/lib/data";
import SeriesCard from "@/components/SeriesCard";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function RechercheSeries({
  seriesGlobales,
  children,
}: {
  seriesGlobales: Serie[];
  children: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  const isSearching = debouncedQuery.trim().length > 0;

  let filteredSeries: Serie[] = [];
  if (isSearching) {
    const searchTerms = debouncedQuery
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    filteredSeries = seriesGlobales.filter((serie) => {
      const niveauNom = NIVEAUX.find((n) => n.slug === serie.niveau)?.nom || "";
      const matiereNom = MATIERES.find((m) => m.slug === serie.matiere)?.nom || "";
      
      const searchString = [
        serie.titre,
        serie.resume,
        niveauNom,
        matiereNom,
      ]
        .join(" ")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      return searchTerms.every((term) => searchString.includes(term));
    });
  }

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="mx-auto max-w-3xl px-6 mb-8 -mt-8 relative z-20">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-white/40 group-focus-within:text-solaire transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une série, un niveau, une matière..."
            className="w-full pl-12 pr-4 py-4 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-solaire focus:border-solaire backdrop-blur-md shadow-xl transition-all font-body text-base"
          />
        </div>
      </div>

      {!isSearching ? (
        children
      ) : (
        <section className="relative py-12 overflow-hidden min-h-[400px]">
          <div className="mx-auto max-w-7xl px-6 relative z-10 animate-fade-in-up">
            {filteredSeries.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSeries.map((s) => (
                  <SeriesCard key={`${s.niveau}-${s.matiere}-${s.slug}`} serie={s} highlightTerm={debouncedQuery.trim()} />
                ))}
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center max-w-2xl mx-auto backdrop-blur-sm">
                <h3 className="font-display text-2xl text-white mb-4">
                  Aucune série ne correspond à ta recherche
                </h3>
                <p className="font-body text-white/60 mb-8 leading-relaxed">
                  Essaie avec d'autres mots-clés (ex: "maths terminale s1", "cinématique"). 
                  Si tu ne trouves toujours pas, n'hésite pas à rejoindre notre groupe WhatsApp 
                  pour demander directement !
                </p>
                <WhatsAppButton />
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
