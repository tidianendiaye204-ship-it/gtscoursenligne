"use client";

import { useState } from "react";
import Link from "next/link";

const liens = [
  { href: "/", label: "Accueil" },
  { href: "/series", label: "Séries d'exercices" },
  { href: "/professeurs", label: "Professeurs" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-[#061A3D]/95 to-azur/95 backdrop-blur-xl border-b border-white/10 shadow-lg" />
      <div className="relative mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
          {/* Logo Icon */}
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-azur/20 to-solaire/20 border border-white/10 group-hover:border-azur/50 transition-colors shadow-[0_0_15px_rgba(56,189,248,0.15)] group-hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]">
            <svg className="w-6 h-6 text-solaire group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {/* A stylized triangle for "Trio" */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3l8 14H4l8-14z" />
              {/* A stylized orbit/atom inside for "Scientifique" */}
              <circle cx="12" cy="13" r="3" strokeWidth={1.5} className="text-azur" />
            </svg>
          </div>
          
          {/* Logo Text */}
          <div className="flex flex-col">
            <span className="font-display text-white text-xl font-bold tracking-tight group-hover:text-azur transition-colors leading-none">
              GTS
            </span>
            <span className="font-body text-white/60 text-[10px] uppercase tracking-widest mt-1 group-hover:text-white/80 transition-colors leading-none">
              Maths <span className="text-azur">·</span> PC <span className="text-azur">·</span> SVT
            </span>
          </div>
        </Link>
        
        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-1 font-body text-sm font-medium">
          {liens.map((l) => (
            <Link 
              key={l.href} 
              href={l.href} 
              className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-encre/95 backdrop-blur-xl border-b border-white/10 shadow-2xl animate-fade-in-up">
          <nav className="flex flex-col p-4 font-body text-base">
            {liens.map((l) => (
              <Link 
                key={l.href} 
                href={l.href} 
                onClick={() => setIsOpen(false)}
                className="px-4 py-4 text-white/80 hover:text-white hover:bg-white/5 rounded-2xl transition-all duration-300"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
