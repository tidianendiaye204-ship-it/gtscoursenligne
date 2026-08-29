import type { Metadata } from "next";
import Image from "next/image";
import { PROFESSEURS, MATIERES } from "@/lib/data";
import Parallax from "@/components/Parallax";

export const metadata: Metadata = {
  title: "L'Équipe Pédagogique",
  description:
    "Les professeurs de mathématiques, physique-chimie et SVT qui animent les cours en ligne.",
  alternates: {
    canonical: "/professeurs",
  },
};

export default function ProfesseursPage() {
  return (
    <div className="bg-encre min-h-screen text-white">
      <section className="bg-gradient-to-br from-[#040e21] to-[#0a2760] pt-40 pb-32 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-azur/20 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Parallax particles */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
          <Parallax speed={0.15} className="absolute top-[20%] left-[10%]">
            <div className="text-white/10 font-display text-7xl animate-float">π</div>
          </Parallax>
          <Parallax speed={-0.1} className="absolute top-[60%] right-[10%]">
            <div className="text-solaire/15 font-display text-8xl animate-float-reverse">Δ</div>
          </Parallax>
        </div>

        <div className="relative mx-auto max-w-6xl px-6 text-center z-10 animate-fade-in-up">
          <p className="font-mono text-solaire text-xs tracking-widest uppercase mb-4">
            Notre Équipe
          </p>
          <h1 className="font-display text-4xl md:text-6xl tracking-tight mb-6">
            Des experts dédiés à votre réussite
          </h1>
          <p className="font-body text-white/70 text-lg max-w-2xl mx-auto font-light">
            Trois enseignants de haut niveau, chacun spécialiste de sa matière, réunis avec un seul objectif : vous préparer à exceller en Seconde S, Première S et Terminale.
          </p>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-azur/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            {PROFESSEURS.map((p, i) => {
              return (
                <div key={p.slug} className="group rounded-[2rem] overflow-hidden bg-white/[0.02] border border-white/5 hover:border-azur/30 hover:shadow-[0_20px_60px_-15px_rgba(22,100,223,0.2)] transition-all duration-700 animate-fade-in-up flex flex-col relative" style={{ animationDelay: `${i * 100}ms` }}>
                  
                  {/* Glowing Top Line */}
                  <div className="absolute inset-x-0 -top-px h-[2px] bg-gradient-to-r from-transparent via-azur/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20" />
                  
                  <div className="relative w-full aspect-[4/5] bg-azur/5 overflow-hidden">
                    <Image src={p.photoUrl} alt={p.nom} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-encre via-encre/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                    
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {p.matieres.map((matSlug) => {
                          const matiere = MATIERES.find((m) => m.slug === matSlug);
                          return (
                            <div key={matSlug} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 group-hover:border-solaire/50 transition-colors duration-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-solaire shadow-[0_0_8px_rgba(245,183,0,0.8)]" />
                              <span className="font-mono text-[10px] text-white uppercase tracking-widest font-bold">
                                {matiere?.nom}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <h2 className="font-display text-3xl text-white drop-shadow-md group-hover:text-solaire transition-colors duration-500">{p.nom}</h2>
                    </div>
                  </div>
                  {p.bio && (
                    <div className="p-8 flex-grow">
                      <p className="font-body text-white/60 leading-relaxed font-light group-hover:text-white/80 transition-colors duration-500">{p.bio}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
