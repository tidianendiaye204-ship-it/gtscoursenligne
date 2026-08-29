import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#061A3D] to-[#040e21] text-white/50 font-body text-sm border-t border-white/5">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid md:grid-cols-2 justify-between gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-azur/20 to-solaire/20 border border-white/10">
                <svg className="w-5 h-5 text-solaire" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3l8 14H4l8-14z" />
                  <circle cx="12" cy="13" r="3" strokeWidth={1.5} className="text-azur" />
                </svg>
              </div>
              <div className="font-display text-2xl text-white font-bold tracking-tight">GTS</div>
            </div>
            <p className="max-w-xs">L'excellence scientifique en ligne pour les lycéens du Sénégal.</p>
          </div>
          <div className="flex flex-col md:items-end gap-2">
            <Link href="/series" className="hover:text-white transition-colors">Séries d'exercices</Link>
            <Link href="/professeurs" className="hover:text-white transition-colors">L'Équipe Pédagogique</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Nous Contacter</Link>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Groupe du Trio Scientifique. Tous droits réservés.</p>
          <p>Seconde S · Première S · Terminale</p>
        </div>
      </div>
    </footer>
  );
}
