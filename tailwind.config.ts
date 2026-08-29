import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        encre: "#061A3D",     // Bleu sombre dominant sur le noir
        azur: "#1664DF",      // Bleu royal vif (comme le polo de M. Dioum)
        craie: "#FAFAFA",     // Blanc très pur pour le fond
        solaire: "#F5B700",   // Jaune GTS
        ardoise: "#334155",   // Texte gris foncé
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        "grain": "radial-gradient(circle at 1px 1px, rgba(247,245,239,0.06) 1px, transparent 0)",
      },
      keyframes: {
        'reveal-up': {
          '0%': { transform: 'translateY(120%)', opacity: '0', transformOrigin: 'bottom' },
          '100%': { transform: 'translateY(0)', opacity: '1', transformOrigin: 'bottom' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(10deg)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(20px) rotate(-10deg)' },
        }
      },
      animation: {
        'reveal-up': 'reveal-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 8s ease-in-out infinite',
        'float-reverse': 'float-reverse 10s ease-in-out infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
