"use client";

import Link from "next/link";
import type { Serie } from "@/lib/data";
import VisionneusePdf from "@/components/VisionneusePdf";

const LABELS_CATEGORIE: Record<Serie["categorie"], string> = {
  serie: "Série d'exercices",
  synthese: "Synthèse",
  concours: "Préparation concours",
};

export default function SeriesCard({ serie }: { serie: Serie }) {
  const detailHref = `/series/${serie.niveau}/${serie.matiere}/${serie.slug}`;
  const hasEnoncePdf =
    serie.contenu.type === "pdf" && !!serie.contenu.fichierUrl;
  const hasCorrigePdf =
    serie.corrigeExemple.type === "pdf" && !!serie.corrigeExemple.fichierUrl;

  return (
    <div className="fiche-serie group relative flex flex-col rounded-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Blue accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-azur to-azur/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Card body */}
      <div className="flex-1 p-6 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <p className="font-mono text-xs text-azur uppercase tracking-wider">
            {LABELS_CATEGORIE[serie.categorie]}
            {serie.concours ? ` · ${serie.concours}` : ""}
          </p>
        </div>

        <Link href={detailHref} className="block group/title">
          <h3 className="font-display text-lg text-encre mb-1 group-hover/title:text-azur transition-colors duration-200">
            {serie.titre}
          </h3>
        </Link>

        <p className="font-body text-xs text-azur mb-2">
          1 exercice corrigé offert
        </p>
        <p className="font-body text-sm text-ardoise leading-relaxed line-clamp-3">
          {serie.resume}
        </p>
      </div>

      {/* Action buttons — direct PDF access */}
      <div className="border-t border-encre/5 p-4 pt-3 flex flex-col gap-2">
        {/* PDF buttons row */}
        <div className="flex gap-2">
          {hasEnoncePdf ? (
            <VisionneusePdf
              url={serie.contenu.fichierUrl!}
              titre={`Énoncé — ${serie.titre}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-azur text-white text-xs font-body font-semibold rounded-lg hover:bg-azur/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-solaire focus:ring-offset-1"
            >
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Énoncé
              </span>
            </VisionneusePdf>
          ) : (
            <span className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-encre/5 text-ardoise/50 text-xs font-body rounded-lg cursor-not-allowed">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Bientôt
            </span>
          )}

          {hasCorrigePdf ? (
            <VisionneusePdf
              url={serie.corrigeExemple.fichierUrl!}
              titre={`Corrigé — ${serie.titre}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-encre text-craie text-xs font-body font-semibold rounded-lg hover:bg-encre/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-solaire focus:ring-offset-1"
            >
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Corrigé
              </span>
            </VisionneusePdf>
          ) : (
            <span className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-encre/5 text-ardoise/50 text-xs font-body rounded-lg cursor-not-allowed">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Bientôt
            </span>
          )}
        </div>

        {/* Download + Detail link row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-3">
            {hasEnoncePdf && (
              <a
                href={serie.contenu.fichierUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] text-ardoise/60 hover:text-azur uppercase tracking-wider transition-colors"
              >
                ↓ Télécharger l&apos;énoncé
              </a>
            )}
          </div>
          <Link
            href={detailHref}
            className="font-body text-xs text-azur hover:text-encre font-semibold transition-colors"
          >
            Détails →
          </Link>
        </div>
      </div>
    </div>
  );
}
