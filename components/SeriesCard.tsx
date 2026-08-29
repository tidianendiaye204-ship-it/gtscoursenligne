"use client";

import Link from "next/link";
import { type Serie, WHATSAPP_GROUPE_URL } from "@/lib/data";
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

        {/* WhatsApp Reminder */}
        <div className="flex items-center gap-2 mt-1 mb-1 bg-[#25D366]/5 px-3 py-2 rounded-lg border border-[#25D366]/10">
          <svg className="w-4 h-4 text-[#25D366] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
          <a href={WHATSAPP_GROUPE_URL} target="_blank" rel="noopener noreferrer" className="flex-1 text-xs text-ardoise hover:text-encre leading-snug">
            <span className="font-semibold text-[#25D366]">Correction complète</span> sur WhatsApp
          </a>
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
