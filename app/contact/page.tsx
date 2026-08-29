import type { Metadata } from "next";
import WhatsAppButton from "@/components/WhatsAppButton";
import Parallax from "@/components/Parallax";
import ContactForm from "@/components/ContactForm";
import { TARIFS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nous Contacter",
  description: "Contacte l'équipe pour t'inscrire aux cours en ligne de Maths, PC et SVT.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <section className="min-h-screen bg-encre text-white pt-32 pb-24 relative overflow-hidden flex items-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[500px] bg-azur/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Parallax particles */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <Parallax speed={0.15} className="absolute top-[20%] left-[10%]">
          <div className="text-white/10 font-display text-7xl animate-float">Δ</div>
        </Parallax>
        <Parallax speed={-0.1} className="absolute top-[70%] right-[10%]">
          <div className="text-solaire/15 font-display text-8xl animate-float-reverse">∑</div>
        </Parallax>
      </div>
      
      <div className="relative mx-auto max-w-6xl px-6 w-full animate-fade-in-up">
        <div className="text-center mb-16">
          <p className="font-mono text-solaire text-xs tracking-widest uppercase mb-4">Contact</p>
          <h1 className="font-display text-5xl md:text-7xl tracking-tight mb-6">Prêt à nous rejoindre ?</h1>
          <p className="font-body text-white/60 text-lg max-w-2xl mx-auto font-light">
            La façon la plus directe et efficace de nous joindre est via WhatsApp. C&apos;est également sur cette plateforme que se déroulent nos cours en direct.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* WhatsApp Card */}
          <div className="glass-card-dark rounded-3xl p-10 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center mb-8 shadow-lg shadow-[#25D366]/20">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/></svg>
              </div>
              <h2 className="font-display text-3xl mb-4">Groupe WhatsApp</h2>
              <p className="font-body text-white/60 mb-6">
                Inscription rapide, accès aux emplois du temps et contact direct avec l&apos;équipe pédagogique.
              </p>
              
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-body text-white/50 text-sm">Frais d&apos;inscription</span>
                  <span className="font-mono text-solaire">{TARIFS.inscription}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-white/50 text-sm">Mensualité</span>
                  <span className="font-mono text-solaire">{TARIFS.mensualite}</span>
                </div>
              </div>
            </div>
            
            <WhatsAppButton label="Rejoindre le groupe" />
          </div>

          {/* Form Card */}
          <div className="glass-card-dark rounded-3xl p-10 group">
            <h2 className="font-display text-2xl mb-2">Nous envoyer un message</h2>
            <p className="font-body text-white/50 text-sm mb-8">Pour toute question spécifique ou demande de partenariat.</p>
            
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

