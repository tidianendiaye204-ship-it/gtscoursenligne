import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NIVEAUX, MATIERES, type Niveau } from "@/lib/data";
import { MatiereCard } from "@/components/MatiereCard";

export function generateStaticParams() {
  return NIVEAUX.map((n) => ({ niveau: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ niveau: string }>;
}): Promise<Metadata> {
  const { niveau: niveauSlug } = await params;
  const niveau = NIVEAUX.find((n) => n.slug === niveauSlug);
  if (!niveau) return {};
  return {
    title: `Cours de Maths, PC, SVT — ${niveau.nom}`,
    description: `Séries d'exercices et corrections de mathématiques, physique-chimie et SVT pour la ${niveau.nom}.`,
    alternates: {
      canonical: `/series/${niveauSlug}`,
    },
  };
}

export default async function NiveauPage({
  params,
}: {
  params: Promise<{ niveau: string }>;
}) {
  const { niveau: niveauSlug } = await params;
  const niveau = NIVEAUX.find((n) => n.slug === niveauSlug);
  if (!niveau) notFound();

  return (
    <div className="bg-encre min-h-screen text-white pt-32 pb-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-azur/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-solaire/10 blur-[150px] rounded-full pointer-events-none" />

      <section className="mx-auto max-w-6xl px-6 relative z-10 animate-fade-in-up">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-4 rounded-full bg-solaire/10 text-solaire font-mono text-sm uppercase tracking-widest font-bold mb-4 border border-solaire/20">
            {niveau.nom}
          </span>
          <h1 className="font-display text-4xl md:text-6xl tracking-tight mb-6">
            Choisis une matière
          </h1>
          <p className="font-body text-white/60 text-lg max-w-2xl mx-auto">
            Sélectionnez la matière pour accéder aux séries d'exercices et corrigés détaillés.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {MATIERES.map((m, i) => (
            <MatiereCard
              key={m.slug}
              matiere={m}
              href={`/series/${niveau.slug}/${m.slug}`}
              delay={i * 100}
              variant="dark"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
