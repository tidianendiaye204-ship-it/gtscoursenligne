import Link from 'next/link';
import { getSortedPostsData } from '@/lib/blog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Actualités',
  description: 'Conseils, méthodologie et actualités pour réussir son Bac et ses concours scientifiques au Sénégal.',
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogIndex() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="min-h-screen bg-craie pt-32 pb-20">
      <div className="mx-auto max-w-4xl px-6">
        <header className="mb-16 animate-fade-in-up">
          <h1 className="font-display text-4xl md:text-5xl text-encre mb-4">Le Blog GTS</h1>
          <p className="font-body text-ardoise text-lg">
            Astuces, méthodologie et conseils d'experts pour viser l'excellence en série scientifique.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {allPostsData.map(({ slug, title, date, excerpt, coverImage }) => (
            <Link key={slug} href={`/blog/${slug}`} className="group block h-full">
              <article className="bg-white rounded-3xl border border-encre/10 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col hover:-translate-y-2">
                {coverImage ? (
                  <div className="aspect-[16/9] w-full overflow-hidden bg-encre/5">
                    <div className="w-full h-full bg-encre/10 group-hover:scale-105 transition-transform duration-700"></div>
                  </div>
                ) : (
                  <div className="aspect-[16/9] w-full bg-[#040e21] relative flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-azur/30 blur-[60px] rounded-full"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-solaire/20 blur-[60px] rounded-full"></div>
                    <span className="font-display text-white text-2xl tracking-widest uppercase opacity-90 relative z-10">
                      GTS <span className="text-azur">News</span>
                    </span>
                    <div className="w-12 h-1 bg-gradient-to-r from-azur to-solaire mt-4 rounded-full relative z-10"></div>
                  </div>
                )}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-azur/10 text-azur text-xs font-mono font-bold uppercase rounded-full">Conseils</span>
                    <span className="text-sm font-mono text-ardoise/60">{new Date(date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <h2 className="font-display text-2xl text-encre mb-3 group-hover:text-azur transition-colors leading-tight">{title}</h2>
                  <p className="font-body text-ardoise/80 line-clamp-3 mb-8 flex-1 leading-relaxed">{excerpt}</p>
                  <div className="text-sm font-bold font-display uppercase tracking-widest text-encre flex items-center mt-auto group-hover:text-azur transition-colors">
                    Lire l'article
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>
          ))}
          
          {allPostsData.length === 0 && (
            <div className="col-span-2 text-center py-20 bg-white rounded-2xl border border-encre/5">
              <p className="font-body text-ardoise">Aucun article publié pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
