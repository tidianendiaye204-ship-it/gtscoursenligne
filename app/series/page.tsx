import type { Metadata } from "next";
import Link from "next/link";
import { NIVEAUX, getAllSeries } from "@/lib/data";
import Parallax from "@/components/Parallax";
import RechercheSeries from "@/components/RechercheSeries";

export const metadata: Metadata = {
  title: "Séries d'exercices et corrections | GTS",
  description:
    "Séries d'exercices et corrections de mathématiques, physique-chimie et SVT pour la Seconde S, la Première S et la Terminale.",
  alternates: {
    canonical: "/series",
  },
};

export default async function SeriesPage() {
  const toutesLesSeries = await getAllSeries();

  return (
    <div className="bg-encre min-h-screen text-white">
      {/* Premium Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#040e21] to-[#0a2760] pt-40 pb-32">
        {/* Decorative Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-azur/20 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Floating Science Particles & Parallax */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
          <Parallax speed={0.15} className="absolute top-[20%] left-[15%]">
            <div className="text-white/10 font-display text-7xl animate-float">∫</div>
          </Parallax>
          <Parallax speed={-0.1} className="absolute top-[50%] right-[15%]">
            <div className="text-solaire/15 font-display text-8xl animate-float-reverse">∑</div>
          </Parallax>
        </div>

        <div className="relative mx-auto max-w-5xl px-6 text-center z-10 animate-fade-in-up">
          <span className="inline-block py-1 px-4 rounded-full bg-solaire/10 text-solaire font-mono text-sm uppercase tracking-widest font-bold mb-6 border border-solaire/20">
            Base de données GTS
          </span>
          <h1 className="font-display text-5xl md:text-7xl tracking-tight mb-8">
            Séries d'exercices & Corrigés
          </h1>
          <p className="font-body text-white/70 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            L'excellence s'acquiert par la pratique. Accédez à nos ressources exclusives classées par niveau pour vous entraîner de manière intensive.
          </p>
        </div>
      </section>

      <RechercheSeries seriesGlobales={toutesLesSeries}>
        {/* Cards Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-azur/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {NIVEAUX.map((n, i) => {
              return (
                <Link
                  key={n.slug}
                  href={`/series/${n.slug}`}
                  className="group relative flex flex-col justify-between p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-solaire/30 hover:-translate-y-3 transition-all duration-700 overflow-hidden min-h-[350px] shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(245,183,0,0.2)] animate-fade-in-up"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {/* Spotlight Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-solaire/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
                  {/* Glowing Top Line */}
                  <div className="absolute inset-x-0 -top-px h-[2px] bg-gradient-to-r from-transparent via-solaire/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Big Background Typography */}
                  <div className="absolute -right-4 -bottom-10 font-display text-[140px] leading-none text-white/[0.02] group-hover:text-white/[0.06] group-hover:-translate-x-4 group-hover:-translate-y-4 transition-all duration-700 pointer-events-none select-none">
                    {n.shortName.split(' ')[0]}
                  </div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-solaire/20 group-hover:border-solaire/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                      <span className="font-display text-2xl text-white font-bold group-hover:text-solaire transition-colors duration-500">
                        {n.shortName.split(' ')[0]}
                      </span>
                    </div>
                    <h2 className="font-display text-3xl text-white mb-4 group-hover:text-solaire transition-colors duration-500">{n.nom}</h2>
                    <p className="font-body text-white/50 leading-relaxed text-lg group-hover:text-white/70 transition-colors duration-500">
                      {n.description}
                    </p>
                  </div>
                  
                  {/* Animated Bottom Link */}
                  <div className="mt-12 relative z-10 flex items-center gap-3 font-body font-semibold text-white/60 group-hover:text-solaire transition-colors duration-500">
                    <span>Accéder aux séries</span>
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 group-hover:bg-solaire/20 transition-all duration-500 group-hover:translate-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      </RechercheSeries>
    </div>
  );
}
