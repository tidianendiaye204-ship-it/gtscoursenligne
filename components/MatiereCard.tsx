import Link from "next/link";
import { IconeMaths, IconePC, IconeSVT } from "@/components/IconesMatiere";
import { Matiere } from "@/lib/data";

interface MatiereCardProps {
  matiere: { slug: Matiere; nom: string; abbr: string };
  href: string;
  delay?: number;
  variant?: 'dark' | 'yellow';
  description?: string;
}

export function MatiereCard({
  matiere,
  href,
  delay = 0,
  variant = 'dark',
  description
}: MatiereCardProps) {
  if (variant === 'yellow') {
    return (
      <div className="group relative animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
        <div className="absolute inset-0 bg-solaire rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
        <div className="relative h-full bg-solaire rounded-3xl p-10 overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-500">
          <div className="absolute -right-8 -top-8 font-display text-[200px] leading-none text-black/5 group-hover:rotate-12 transition-transform duration-700 pointer-events-none select-none">
            {matiere.abbr}
          </div>

          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000 -translate-x-full pointer-events-none skew-x-12" />

          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-6">
              {matiere.slug === 'mathematiques' && <IconeMaths className="w-10 h-10 text-encre" />}
              {(matiere.slug === 'physique' || matiere.slug === 'chimie') && <IconePC className="w-10 h-10 text-encre" />}
              {matiere.slug === 'svt' && <IconeSVT className="w-10 h-10 text-encre" />}
            </div>
            <div className="w-16 h-16 rounded-2xl bg-encre flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500">
              <span className="font-display text-2xl text-solaire font-bold">{matiere.abbr}</span>
            </div>
            
            <h3 className="font-display text-3xl text-encre mb-4 font-bold">{matiere.nom}</h3>
            
            <p className="font-body text-encre/80 leading-relaxed mb-10 text-lg font-medium">
              {description || "Des séries d'exercices structurées et des corrections détaillées pour comprendre en profondeur et maîtriser chaque notion."}
            </p>
            
            <div className="mt-auto">
              <Link href={href} className="inline-flex items-center gap-3 bg-encre text-white font-body font-semibold px-6 py-3 rounded-full group-hover:pr-4 transition-all">
                <span>Explorer</span>
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-solaire group-hover:text-encre transition-colors">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dark variant
  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-azur/40 hover:-translate-y-3 transition-all duration-500 overflow-hidden min-h-[280px] shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.2)] animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Spotlight Gradient on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-azur/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Glowing Top Line */}
      <div className="absolute inset-x-0 -top-px h-[2px] bg-gradient-to-r from-transparent via-azur/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Big Background Typography */}
      <div className="absolute -right-4 -bottom-6 font-display text-[120px] leading-none text-white/[0.02] group-hover:text-white/[0.05] group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all duration-500 pointer-events-none select-none">
        {matiere.abbr}
      </div>

      <div className="relative z-10">
        <div className="mb-6">
          {matiere.slug === 'mathematiques' && <IconeMaths className="w-10 h-10 text-solaire" />}
          {(matiere.slug === 'physique' || matiere.slug === 'chimie') && <IconePC className="w-10 h-10 text-solaire" />}
          {matiere.slug === 'svt' && <IconeSVT className="w-10 h-10 text-solaire" />}
        </div>
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-azur/20 group-hover:border-azur/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
          <span className="font-display text-xl text-white font-bold group-hover:text-azur transition-colors duration-500">
            {matiere.abbr}
          </span>
        </div>
        <h2 className="font-display text-2xl text-white mb-2 group-hover:text-azur transition-colors duration-500">{matiere.nom}</h2>
      </div>
      
      {/* Animated Bottom Link */}
      <div className="mt-8 relative z-10 flex items-center gap-3 font-body font-semibold text-white/50 group-hover:text-azur transition-colors duration-500">
        <span>Explorer les cours</span>
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 group-hover:bg-azur/20 transition-all duration-500 group-hover:translate-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </span>
      </div>
    </Link>
  );
}
