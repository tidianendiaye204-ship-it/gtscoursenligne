import Link from "next/link";
import WhatsAppButton from "@/components/WhatsAppButton";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Parallax from "@/components/Parallax";
import { MATIERES, NIVEAUX, CONCOURS, TARIFS } from "@/lib/data";
import { MatiereCard } from "@/components/MatiereCard";

export default function AccueilPage() {
  return (
    <>
      {/* Hero Section Ultra Premium */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#040e21] to-[#0a2760] pt-32 pb-24 md:pt-48 md:pb-32">
        {/* Decorative Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-azur/30 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-solaire/10 blur-[100px] rounded-full pointer-events-none" />
        
        {/* Floating Science Particles & Parallax */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
          <Parallax speed={0.15} className="absolute top-[20%] left-[10%]">
            <div className="text-white/20 font-display text-7xl animate-float">∑</div>
          </Parallax>
          <Parallax speed={-0.1} className="absolute top-[60%] left-[5%]">
            <div className="text-white/25 font-display text-8xl animate-float-reverse">∫</div>
          </Parallax>
          <Parallax speed={0.25} className="absolute top-[15%] right-[15%]">
            <div className="text-white/20 font-display text-6xl animate-float-reverse">π</div>
          </Parallax>
          <Parallax speed={-0.15} className="absolute top-[70%] right-[8%]">
            <div className="text-solaire/20 font-display text-9xl animate-float">∞</div>
          </Parallax>
          <Parallax speed={0.2} className="absolute top-[40%] right-[25%]">
            <div className="text-azur/30 font-display text-5xl animate-float">Δ</div>
          </Parallax>
        </div>
        
        <div className="relative mx-auto max-w-6xl px-6 z-10 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(245,183,0,0.1)]">
            <span className="w-2 h-2 rounded-full bg-solaire animate-pulse" />
            <span className="font-mono text-xs text-white uppercase tracking-widest font-bold">
              Cours en ligne en direct
            </span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.1] max-w-5xl mx-auto text-white tracking-tight flex flex-col gap-2">
            <span className="overflow-hidden inline-block pb-2">
              <span className="inline-block animate-reveal-up translate-y-[120%] opacity-0">L'Excellence au Sénégal,</span>
            </span>
            <span className="overflow-hidden inline-block pb-2">
              <span className="inline-block animate-reveal-up translate-y-[120%] opacity-0 [animation-delay:200ms]">
                <span className="text-gradient font-bold">pour le Bac et les Concours.</span>
              </span>
            </span>
          </h1>
          
          <p className="font-body text-white/70 text-lg md:text-xl max-w-2xl mx-auto mt-8 font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            Maths, Physique-Chimie (PC) et SVT. Cours particuliers en direct sur WhatsApp, et des séries d'exercices d'excellence pour réussir au Sénégal.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <WhatsAppButton className="w-full sm:w-auto hover:scale-105 transition-transform" />
            <Link
              href="/series"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 text-white font-body font-semibold px-8 py-3 rounded-sm hover:bg-white/10 transition-colors"
            >
              Parcourir les séries
            </Link>
          </div>
        </div>
      </section>

      {/* Comment ça marche - Floating Premium Card */}
      <section className="relative z-20 -mt-16 md:-mt-24 mx-auto max-w-5xl px-6 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
        <div className="bg-[#0a1930]/90 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
          {/* Spotlight Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-solaire/10 via-transparent to-transparent opacity-100 pointer-events-none" />
          <div className="absolute inset-x-0 -top-px h-[2px] bg-gradient-to-r from-transparent via-solaire/50 to-transparent opacity-100" />
          <div className="absolute -bottom-6 -right-6 font-display text-[120px] text-white/[0.02] pointer-events-none select-none leading-none">
            GTS
          </div>
          
          <div className="flex-1 relative z-10">
            <span className="inline-block py-1 px-4 rounded-full bg-solaire/10 text-solaire font-mono text-xs uppercase tracking-widest font-bold mb-4 border border-solaire/20">
              Comment ça marche
            </span>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-4 text-white">
              Séries libres, corrections premium.
            </h2>
            <p className="font-body text-white/70 text-lg leading-relaxed">
              Consultez nos séries d'exercices librement avec <strong className="text-white font-medium">un exercice corrigé offert</strong> pour avoir un aperçu. Pour obtenir la correction complète et un accompagnement en direct, rejoignez nos cours privés sur WhatsApp.
            </p>
            <div className="flex flex-wrap items-center gap-6 mt-6">
               <div className="flex flex-col">
                 <span className="text-white/40 text-xs font-mono uppercase tracking-wider mb-1">Inscription</span>
                 <span className="text-solaire font-display text-2xl">{TARIFS.inscription}</span>
               </div>
               <div className="w-px h-10 bg-white/10" />
               <div className="flex flex-col">
                 <span className="text-white/40 text-xs font-mono uppercase tracking-wider mb-1">Mensualité</span>
                 <span className="text-solaire font-display text-2xl">{TARIFS.mensualite}</span>
               </div>
            </div>
          </div>
          <div className="relative z-10 shrink-0 w-full md:w-auto text-center">
            <WhatsAppButton label="Rejoindre les cours" className="w-full md:w-auto shadow-xl shadow-solaire/10 hover:scale-105 transition-transform" />
          </div>
        </div>
      </section>

      {/* Matières Section (Yellow Pop) */}
      <section className="bg-white py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-solaire/10 blur-[100px] rounded-bl-full pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl text-encre tracking-tight mb-4">
              L'excellence dans chaque matière
            </h2>
            <p className="font-body text-ardoise text-lg max-w-2xl mx-auto">
              Une pédagogie ciblée pour débloquer votre potentiel scientifique du lycée au bac.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {MATIERES.map((m, i) => (
              <MatiereCard
                key={m.slug}
                matiere={m}
                href="/series"
                delay={i * 150}
                variant="yellow"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Niveaux Section (Dark Premium) */}
      <section className="bg-encre text-white py-32 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-[300px] bg-azur/10 blur-[100px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-solaire/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center text-center mb-20">
            <span className="inline-block py-1 px-3 rounded-full bg-white/5 text-azur font-mono text-sm uppercase tracking-widest font-bold mb-4 border border-white/10">
              Parcours
            </span>
            <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-6">Choisissez votre niveau</h2>
            <p className="font-body text-white/60 text-lg max-w-xl">
              Un contenu sur-mesure pour construire des bases inébranlables ou viser l'excellence et la mention au bac.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {NIVEAUX.map((n, i) => {
              return (
                <Link
                  key={n.slug}
                  href={`/series/${n.slug}`}
                  className="group relative flex p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 hover:-translate-y-3 transition-all duration-700 overflow-hidden min-h-[320px] flex-col justify-between"
                >
                  {/* Spotlight Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-azur/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
                  {/* Glowing Top Line */}
                  <div className="absolute inset-x-0 -top-px h-[2px] bg-gradient-to-r from-transparent via-azur/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Big Background Typography */}
                  <div className="absolute -right-4 -top-4 font-display text-[150px] leading-none text-white/[0.03] group-hover:text-white/[0.08] group-hover:-translate-x-4 group-hover:translate-y-4 transition-all duration-700 pointer-events-none select-none">
                    {n.shortName.split(' ')[0]}
                  </div>

                  <div className="relative z-10">
                    <h3 className="font-display text-3xl text-white mb-4 group-hover:text-azur transition-colors duration-500">{n.nom}</h3>
                    <p className="font-body text-white/50 leading-relaxed text-lg group-hover:text-white/70 transition-colors duration-500">
                      {n.description}
                    </p>
                  </div>
                  
                  {/* Animated Button */}
                  <div className="mt-12 relative z-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 group-hover:w-full group-hover:bg-azur group-hover:border-azur transition-all duration-500 ease-out overflow-hidden relative">
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 font-body font-semibold text-white">
                        Explorer le programme
                      </span>
                      <svg className="w-5 h-5 text-white absolute group-hover:right-6 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Concours Section Grid */}
      <section className="bg-white py-32 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-20 animate-fade-in-up">
            <span className="inline-block py-1 px-3 rounded-full bg-encre/5 text-encre font-mono text-sm uppercase tracking-widest font-bold mb-4 border border-encre/10">
              Au-delà du bac
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-encre tracking-tight mb-4">
              Objectif Grandes Écoles
            </h2>
            <p className="font-body text-ardoise text-lg max-w-2xl mx-auto">
              Nous préparons les élèves les plus ambitieux aux concours d'entrée des écoles d'ingénieurs et de commerce.
            </p>
          </div>

          <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 pb-12">
            {CONCOURS.map((c, i) => (
              <div key={c.slug} className="group animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="bg-gradient-to-br from-[#061A3D] to-[#040e21] rounded-[2rem] p-8 border border-white/5 shadow-2xl hover:-translate-y-3 hover:shadow-[0_20px_60px_-15px_rgba(22,100,223,0.3)] hover:border-azur/30 transition-all duration-700 h-full flex flex-col justify-between relative overflow-hidden group/card">
                  {/* Spotlight effect */}
                  <div className="absolute inset-x-0 -top-px h-[2px] bg-gradient-to-r from-transparent via-azur/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(22,100,223,0.15),transparent_60%)] opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
                  {/* Big Background Typography */}
                  <div className="absolute -right-4 -bottom-6 font-display text-[120px] leading-none text-white/[0.02] group-hover/card:text-white/[0.05] group-hover/card:-translate-x-2 group-hover/card:-translate-y-2 transition-all duration-700 pointer-events-none select-none">
                    {c.slug}
                  </div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover/card:bg-azur/20 group-hover/card:border-azur/40 group-hover/card:scale-110 group-hover/card:rotate-3 transition-all duration-500 shadow-lg">
                      <span className="font-display text-xl text-white font-bold group-hover/card:text-azur transition-colors duration-500">{c.slug}</span>
                    </div>
                    <h3 className="font-display text-2xl text-white mb-4 group-hover/card:text-azur transition-colors duration-500">{c.nom}</h3>
                    <p className="font-body text-white/60 leading-relaxed text-sm sm:text-base group-hover/card:text-white/80 transition-colors duration-500">
                      {c.description}
                    </p>
                  </div>
                  <div className="mt-10 pt-6 border-t border-white/10 relative z-10 flex items-center justify-between">
                    <p className="font-mono text-solaire text-xs uppercase tracking-widest font-semibold group-hover/card:animate-pulse">En cours direct</p>
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 group-hover/card:bg-solaire/20 text-white/40 group-hover/card:text-solaire transition-all duration-500 group-hover/card:translate-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section (SEO Optimized) */}
      <section className="bg-gradient-to-b from-[#040e21] to-encre py-32 border-y border-white/5 relative overflow-hidden">
        {/* Decorative blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-azur/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="mx-auto max-w-4xl px-6 relative z-10">
          <div className="text-center mb-20 animate-fade-in-up">
            <span className="inline-block py-1 px-3 rounded-full bg-azur/10 text-azur font-mono text-sm uppercase tracking-widest font-bold mb-4 border border-azur/20">
              Des questions ?
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white tracking-tight mb-4">Questions fréquentes</h2>
            <p className="font-body text-white/60 text-lg">Tout ce que vous devez savoir avant de rejoindre nos cours d'excellence.</p>
          </div>
          
          <div className="space-y-6">
            <details className="group bg-blackboard/50 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300">
              <summary className="font-display text-lg text-white p-6 cursor-pointer list-none flex items-center justify-between group-open:bg-azur/10">
                <span className="font-semibold">Comment se déroulent les cours en direct de Mathématiques, PC et SVT ?</span>
                <span className="transition-transform duration-300 group-open:-rotate-180">
                  <svg className="w-5 h-5 text-azur" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
              </summary>
              <div className="p-6 pt-0 font-body text-white/70 leading-relaxed bg-azur/5">
                Sur <strong>gtscoursenligne</strong>, tous nos cours en direct se déroulent exclusivement via notre groupe WhatsApp privé. Une fois inscrit, vous recevez les liens des sessions en direct, les horaires pour les Mathématiques, la Physique-Chimie (PC) et les SVT, et vous pouvez interagir directement avec nos professeurs (M. Mbaye, M. Ndoye, M. Dioum).
              </div>
            </details>

            <details className="group bg-blackboard/50 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300">
              <summary className="font-display text-lg text-white p-6 cursor-pointer list-none flex items-center justify-between group-open:bg-solaire/10">
                <span className="font-semibold">Comment puis-je payer mon inscription ou ma mensualité (1500F) ?</span>
                <span className="transition-transform duration-300 group-open:-rotate-180">
                  <svg className="w-5 h-5 text-solaire" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
              </summary>
              <div className="p-6 pt-0 font-body text-white/70 leading-relaxed bg-solaire/5">
                Le paiement de l'inscription (1500F) et de la mensualité (1500F) se fait très simplement par transfert d'argent (Wave, Orange Money, Free Money). Cliquez sur le bouton "Rejoindre le groupe WhatsApp" pour discuter avec l'administrateur GTS qui vous guidera dans la procédure rapide.
              </div>
            </details>

            <details className="group bg-blackboard/50 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300">
              <summary className="font-display text-lg text-white p-6 cursor-pointer list-none flex items-center justify-between group-open:bg-azur/10">
                <span className="font-semibold">GTS prépare-t-il vraiment aux concours (ESP, EPT, ENSA, EMS) ?</span>
                <span className="transition-transform duration-300 group-open:-rotate-180">
                  <svg className="w-5 h-5 text-azur" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
              </summary>
              <div className="p-6 pt-0 font-body text-white/70 leading-relaxed bg-azur/5">
                Absolument. En plus du programme officiel pour décrocher une mention au Bac, <strong>GTS (Groupe du Trio Scientifique)</strong> propose des exercices ciblés, des séries d'annales et des méthodes de résolution ultra-rapides spécialement conçus pour réussir les concours d'entrée aux grandes écoles comme l'ESP, l'EPT, l'ENSA (École Nationale Supérieure d'Agriculture), l'EMS ou l'IPLS.
              </div>
            </details>
            
            <details className="group bg-blackboard/50 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300">
              <summary className="font-display text-lg text-white p-6 cursor-pointer list-none flex items-center justify-between group-open:bg-solaire/10">
                <span className="font-semibold">Puis-je avoir accès à toutes les corrections complètes sur le site ?</span>
                <span className="transition-transform duration-300 group-open:-rotate-180">
                  <svg className="w-5 h-5 text-solaire" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
              </summary>
              <div className="p-6 pt-0 font-body text-white/70 leading-relaxed bg-solaire/5">
                Sur le site public, nous offrons la correction d'un seul exercice par série pour vous montrer la qualité de notre pédagogie. Les corrections complètes détaillées, ainsi que l'assistance 7j/7 pour vos questions bloquantes, sont des privilèges exclusivement réservés aux élèves inscrits dans nos groupes WhatsApp de cours en direct.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-solaire py-32 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <h2 className="font-display text-4xl md:text-6xl text-encre mb-8 tracking-tight">
            Prêt à viser l'excellence ?
          </h2>
          <p className="font-body text-encre/80 text-xl mb-12 max-w-2xl mx-auto font-medium">
            Rejoignez notre groupe WhatsApp pour suivre les cours en direct et poser toutes vos questions.
          </p>
          <div className="flex justify-center">
            <WhatsAppButton label="Rejoindre le groupe privé" className="scale-110 shadow-2xl shadow-encre/20 hover:scale-125 transition-all duration-300" />
          </div>
        </div>
      </section>
      <FloatingWhatsApp />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "item": {
                  "@type": "Course",
                  "name": "Cours d'excellence de Mathématiques - Lycée (Sénégal)",
                  "description": "Préparation intensive au Bac S et concours avec des séries d'exercices et des cours en direct.",
                  "provider": {
                    "@type": "EducationalOrganization",
                    "name": "Groupe du Trio Scientifique (GTS)",
                    "sameAs": "https://gtscoursenligne.com"
                  }
                }
              },
              {
                "@type": "ListItem",
                "position": 2,
                "item": {
                  "@type": "Course",
                  "name": "Cours d'excellence de Physique-Chimie (PC) - Lycée (Sénégal)",
                  "description": "Préparation intensive au Bac S et concours avec des séries d'exercices et des cours en direct.",
                  "provider": {
                    "@type": "EducationalOrganization",
                    "name": "Groupe du Trio Scientifique (GTS)",
                    "sameAs": "https://gtscoursenligne.com"
                  }
                }
              },
              {
                "@type": "ListItem",
                "position": 3,
                "item": {
                  "@type": "Course",
                  "name": "Cours d'excellence de SVT - Lycée (Sénégal)",
                  "description": "Préparation intensive au Bac S avec des séries d'exercices et des cours en direct.",
                  "provider": {
                    "@type": "EducationalOrganization",
                    "name": "Groupe du Trio Scientifique (GTS)",
                    "sameAs": "https://gtscoursenligne.com"
                  }
                }
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Comment se déroulent les cours en direct de Mathématiques, PC et SVT ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sur gtscoursenligne, tous nos cours en direct se déroulent exclusivement via notre groupe WhatsApp privé. Une fois inscrit, vous recevez les liens des sessions en direct, les horaires pour les Mathématiques, la Physique-Chimie (PC) et les SVT, et vous pouvez interagir directement avec nos professeurs (M. Mbaye, M. Ndoye, M. Dioum)."
                }
              },
              {
                "@type": "Question",
                "name": "Comment puis-je payer mon inscription ou ma mensualité (1500F) ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Le paiement de l'inscription (1500F) et de la mensualité (1500F) se fait très simplement par transfert d'argent (Wave, Orange Money, Free Money). Cliquez sur le bouton \"Rejoindre le groupe WhatsApp\" pour discuter avec l'administrateur GTS qui vous guidera dans la procédure rapide."
                }
              },
              {
                "@type": "Question",
                "name": "GTS prépare-t-il vraiment aux concours (ESP, EPT, ENSA, EMS) ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolument. En plus du programme officiel pour décrocher une mention au Bac, GTS (Groupe du Trio Scientifique) propose des exercices ciblés, des séries d'annales et des méthodes de résolution ultra-rapides spécialement conçus pour réussir les concours d'entrée aux grandes écoles comme l'ESP, l'EPT, l'ENSA (École Nationale Supérieure d'Agriculture), l'EMS ou l'IPLS."
                }
              },
              {
                "@type": "Question",
                "name": "Puis-je avoir accès à toutes les corrections complètes sur le site ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sur le site public, nous offrons la correction d'un seul exercice par série pour vous montrer la qualité de notre pédagogie. Les corrections complètes détaillées, ainsi que l'assistance 7j/7 pour vos questions bloquantes, sont des privilèges exclusivement réservés aux élèves inscrits dans nos groupes WhatsApp de cours en direct."
                }
              }
            ]
          })
        }}
      />
    </>
  );
}
