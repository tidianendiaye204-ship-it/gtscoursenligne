"use client";

import { useState, useEffect, useRef } from "react";

interface VisionneusePdfProps {
  url: string;
  titre: string;
  children: React.ReactNode;
  className?: string;
}

export default function VisionneusePdf({ url, titre, children, className }: VisionneusePdfProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    // Détection basique pour savoir si on est sur mobile
    if (window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      window.open(url, "_blank");
    } else {
      setIsOpen(true);
      setIsLoading(true);
    }
  };

  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

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

  return (
    <>
      <button
        onClick={handleClick}
        className={className ?? "inline-flex items-center justify-center px-6 py-3 bg-encre text-craie font-display font-medium rounded-full hover:bg-opacity-90 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-solaire focus:ring-offset-2"}
        aria-haspopup="dialog"
      >
        {children}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={titre}
          onClick={closeModal}
        >
          {/* Modal Container */}
          <div
            className="relative w-full h-full max-w-[1400px] bg-white rounded-xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header avec Titre et Bouton Fermer */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100 shrink-0">
              <h3 className="font-display text-encre text-lg font-medium line-clamp-1 pr-4">{titre}</h3>
              <button
                ref={closeButtonRef}
                onClick={closeModal}
                className="p-2 -mr-2 text-ardoise hover:text-encre hover:bg-black/5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-solaire"
                aria-label="Fermer"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Conteneur iFrame */}
            <div className="relative w-full flex-1 bg-white">
              {isLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white">
                  <div className="w-10 h-10 border-4 border-solaire/30 border-t-solaire rounded-full animate-spin mb-4"></div>
                  <p className="font-body text-ardoise text-sm animate-pulse">Chargement du document...</p>
                </div>
              )}
              <iframe
                src={`${url}#toolbar=1&navpanes=0&view=FitH`}
                className={`absolute inset-0 w-full h-full border-none transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                title={titre}
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
