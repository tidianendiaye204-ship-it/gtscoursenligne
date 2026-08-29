import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = { 
  metadataBase: new URL("https://gtscoursenligne.com"), 
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Groupe Trio Scientifique (GTS) - Cours d'Excellence au Sénégal (Maths, PC, SVT) & Concours",
    template: "%s | Groupe Trio Scientifique",
  },
  description: "Le Groupe Trio Scientifique (GTS) offre les meilleurs cours en ligne au Sénégal en Mathématiques, Physique-Chimie et SVT. Préparation intensive au Bac et aux grandes écoles (ESP, EPT, ENSA, EMS).",
  keywords: ["groupe trio scientifique", "maths senegal", "pc senegal", "physique chimie senegal", "svt senegal", "cours en ligne senegal", "préparation bac senegal", "concours esp senegal", "concours ept senegal", "concours ensa senegal", "ensa école nationale supérieure d'agriculture", "gts cours en ligne"],
  openGraph: {
    title: "Groupe Trio Scientifique (GTS) - Cours d'Excellence (Maths, PC, SVT) au Sénégal",
    description: "Rejoignez l'élite. Cours particuliers en direct et séries d'exercices exclusifs en Maths, PC et SVT pour le Bac et les concours au Sénégal.",
    url: "https://gtscoursenligne.com",
    siteName: "Groupe Trio Scientifique",
    images: [
      {
        url: "https://gtscoursenligne.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Groupe Trio Scientifique - Cours d'Excellence en Maths, PC et SVT au Sénégal",
      }
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Groupe Trio Scientifique - L'Excellence Scientifique au Sénégal",
    description: "Rejoignez l'élite. Cours d'excellence en Mathématiques, Physique-Chimie et SVT au Sénégal.",
    images: ["https://gtscoursenligne.com/og-image.jpg"],
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="font-body antialiased selection:bg-azur selection:text-white">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-0SJ2NBYPX2" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-0SJ2NBYPX2');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Groupe du Trio Scientifique (GTS)",
              "url": "https://gtscoursenligne.com",
              "logo": "https://gtscoursenligne.com/icon.png",
              "description": "Cours d'excellence en Mathématiques, Physique-Chimie et SVT au Sénégal. Préparation au Bac et aux concours d'entrée aux grandes écoles.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "SN"
              }
            })
          }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
