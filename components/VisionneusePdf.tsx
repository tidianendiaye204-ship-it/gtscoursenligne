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

  const openModal = () => {
    setIsOpen(true);
    setIsLoading(true);
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
        onClick={openModal}
        className={className ?? "inline-flex items-center justify-center px-6 py-3 bg-encre text-craie font-display font-medium rounded-full hover:bg-opacity-90 transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-solaire focus:ring-offset-2"}
        aria-haspopup="dialog"
      >
        {children}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-2 sm:p-8 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={titre}
          onClick={closeModal}
        >
          {/* Close button on dark background */}
          <div className="w-full max-w-5xl flex justify-end mb-2 sm:mb-4">
            <button
              ref={closeButtonRef}
              onClick={closeModal}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-solaire"
              aria-label="Fermer"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Modal Container */}
          <div
            className="relative w-full h-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-solaire/30 border-t-solaire rounded-full animate-spin mb-4"></div>
                <p className="font-body text-ardoise text-sm animate-pulse">Chargement du document...</p>
              </div>
            )}
            <iframe
              src={`${url}#toolbar=0&navpanes=0&view=FitH`}
              className={`absolute inset-0 w-full h-full border-none transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              title={titre}
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
