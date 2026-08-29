import type { Metadata } from "next";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
import {
  NIVEAUX,
  MATIERES,
  getSerie,
  TARIFS,
  type Niveau,
  type Matiere,
} from "@/lib/data";
import WhatsAppButton from "@/components/WhatsAppButton";
import VisionneusePdf from "@/components/VisionneusePdf";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ niveau: string; matiere: string; serie: string }>;
}): Promise<Metadata> {
  const { niveau: niveauSlug, matiere: matiereSlug, serie: serieSlug } = await params;
  const niveau = NIVEAUX.find((n) => n.slug === niveauSlug);
  const matiere = MATIERES.find((m) => m.slug === matiereSlug);
  const serie = niveau && matiere
    ? await getSerie(niveau.slug as Niveau, matiere.slug as Matiere, serieSlug)
    : undefined;
  if (!serie || !niveau || !matiere) return {};
  return {
    title: `${serie.titre} — ${matiere.nom} ${niveau.nom}`,
    description: serie.resume,
    alternates: {
      canonical: `/series/${niveauSlug}/${matiereSlug}/${serieSlug}`,
    },
  };
}

export default async function SeriePage({
  params,
}: {
  params: Promise<{ niveau: string; matiere: string; serie: string }>;
}) {
  const { niveau: niveauSlug, matiere: matiereSlug, serie: serieSlug } = await params;
  const niveau = NIVEAUX.find((n) => n.slug === niveauSlug);
  const matiere = MATIERES.find((m) => m.slug === matiereSlug);
  const serie = niveau && matiere
    ? await getSerie(niveau.slug as Niveau, matiere.slug as Matiere, serieSlug)
    : undefined;
  if (!serie || !niveau || !matiere) notFound();

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <p className="font-mono text-xs text-azur uppercase tracking-wider mb-2">
        {niveau.nom} · {matiere.nom}
      </p>
      <h1 className="font-display text-3xl text-encre mb-4">{serie.titre}</h1>
      <p className="font-body text-ardoise mb-10">{serie.resume}</p>

      <div className="bg-white rounded-3xl p-6 md:p-8 mb-8 border border-encre/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-2 h-full bg-azur rounded-l-3xl" />
        <div className="flex items-center justify-between mb-6 pl-4">
          <h2 className="font-display text-2xl text-encre">Énoncé de la série</h2>
          <span className="bg-azur/10 text-azur text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Aperçu gratuit
          </span>
        </div>
        {serie.contenu.type === "pdf" && serie.contenu.fichierUrl ? (
          <div className="flex flex-col items-center justify-center p-8 bg-[#f8f9fa] rounded-2xl border border-black/5">
            <VisionneusePdf url={serie.contenu.fichierUrl} titre={`Énoncé de ${serie.titre}`}>
              Lire l&apos;énoncé
            </VisionneusePdf>
            <a
              href={serie.contenu.fichierUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-sm text-ardoise hover:text-encre underline decoration-ardoise/30 hover:decoration-encre transition-colors"
            >
              Télécharger le PDF
            </a>
          </div>
        ) : serie.contenu.type === "texte" && serie.contenu.texte ? (
          <div className="w-full bg-[#f8f9fa] p-8 rounded-2xl border border-black/5">
            <p className="font-body text-ardoise whitespace-pre-line leading-relaxed">
              {serie.contenu.texte}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-[#f8f9fa] rounded-2xl border border-black/5 text-center">
            <p className="font-body text-ardoise/60 italic">Le fichier sera bientôt disponible.</p>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-[#061A3D] to-[#040e21] rounded-3xl p-6 md:p-8 mb-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-solaire/20 blur-[60px] rounded-full pointer-events-none" />
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-white">
            Corrigé d&apos;un exercice type
          </h2>
          <span className="bg-solaire/10 text-solaire text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Cadeau GTS
          </span>
        </div>
        
        {serie.corrigeExemple.type === "pdf" && serie.corrigeExemple.fichierUrl ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <VisionneusePdf url={serie.corrigeExemple.fichierUrl} titre={`Corrigé de ${serie.titre}`}>
              Lire le corrigé
            </VisionneusePdf>
            <a
              href={serie.corrigeExemple.fichierUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-sm text-white/60 hover:text-white underline decoration-white/30 hover:decoration-white transition-colors"
            >
              Télécharger le PDF
            </a>
          </div>
        ) : serie.corrigeExemple.type === "texte" && serie.corrigeExemple.texte ? (
          <div className="w-full bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
            <p className="font-body text-white/80 whitespace-pre-line leading-relaxed">
              {serie.corrigeExemple.texte}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm text-center">
            <p className="font-body text-white/40 italic">Le corrigé sera bientôt disponible.</p>
          </div>
        )}
      </div>

      <div className="border border-solaire bg-solaire/10 rounded-sm p-8 text-center mb-12">
        <h3 className="font-display text-xl text-encre mb-3">
          Envie de la correction complète ?
        </h3>
        <p className="font-body text-ardoise mb-6">
          Inscription {TARIFS.inscription}, mensualité {TARIFS.mensualite} — rejoins les cours en ligne sur WhatsApp pour avoir la correction de tous les exercices de cette série.
        </p>
        <WhatsAppButton />
      </div>
    </section>
  );
}
