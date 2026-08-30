"use client";

import { useState, useEffect } from "react";

export default function ZenModeText({
  titre,
  texte,
  darkTheme = false,
}: {
  titre: string;
  texte: string;
  darkTheme?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const textColor = darkTheme ? "text-white/80" : "text-ardoise";
  const btnClasses = darkTheme 
    ? "bg-white/10 text-white hover:bg-white/20" 
    : "bg-encre/5 text-encre hover:bg-encre/10";

  return (
    <>
      <div className="relative group/zen">
        <p className={`font-body ${textColor} whitespace-pre-line leading-relaxed`}>
          {texte}
        </p>
        <button
          onClick={() => setIsOpen(true)}
          className={`absolute top-0 right-0 mt-2 mr-2 p-2 rounded-lg opacity-0 group-hover/zen:opacity-100 transition-all duration-200 ${btnClasses} flex items-center gap-2 text-sm font-semibold shadow-sm`}
          title="Mode Zen (lecture sans distraction)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          <span className="hidden sm:inline">Mode Zen</span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-encre overflow-y-auto">
          <div className="min-h-screen flex flex-col">
            <div className="sticky top-0 w-full bg-encre/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-display text-xl text-white line-clamp-1">{titre}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-white/10 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                title="Fermer le mode Zen"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 max-w-3xl mx-auto px-6 py-12 md:py-20 w-full">
              <p className="font-body text-xl md:text-2xl text-white/90 whitespace-pre-line leading-loose">
                {texte}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
