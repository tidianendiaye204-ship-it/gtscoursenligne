"use client";

import { useState, useEffect, useRef, useCallback } from "react";

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
  const modalContentRef = useRef<HTMLDivElement>(null);

  const openModal = useCallback(() => {
    setIsOpen(true);
    setIsLoading(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Détection basique pour savoir si on est sur mobile
    if (window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      window.open(url, "_blank");
    } else {
      openModal();
    }
  };

  // Close on backdrop mousedown (not click) to avoid iframe focus stealing issues
  const handleBackdropMouseDown = useCallback((e: React.MouseEvent) => {
    // Only close if the mousedown is directly on the backdrop, not on the modal
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }, [closeModal]);

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
  }, [isOpen, closeModal]);

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
        type="button"
        onClick={handleClick}
        className={className ?? "inline-flex items-center justify-center px-6 py-3 bg-encre text-craie font-display font-medium rounded-full hover:bg-opacity-90 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-solaire focus:ring-offset-2"}
        aria-haspopup="dialog"
      >
        {children}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
          role="dialog"
          aria-modal="true"
          aria-label={titre}
          onMouseDown={handleBackdropMouseDown}
        >
          {/* Modal Container */}
          <div
            ref={modalContentRef}
            className="relative w-full h-full max-w-[1400px] bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden animate-[scaleIn_200ms_ease-out]"
          >
            {/* Header avec Titre et Bouton Fermer */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100 h-[60px]">
              <h3 className="font-display text-encre text-lg font-medium line-clamp-1 pr-4">{titre}</h3>
              <button
                ref={closeButtonRef}
                type="button"
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
            <div className="relative w-full h-[calc(100%-60px)] bg-white">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-gray-200 border-t-azur rounded-full animate-spin" />
                    <p className="text-sm text-ardoise font-body">Chargement du PDF…</p>
                  </div>
                </div>
              )}
              <iframe
                src={`${url}#toolbar=1&navpanes=0&view=FitH`}
                className="absolute inset-0 w-full h-full border-none"
                title={titre}
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
