import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Groupe Trio Scientifique (GTS)",
    short_name: "GTS",
    description: "Le Groupe Trio Scientifique (GTS) offre les meilleurs cours en ligne au Sénégal en Mathématiques, Physique-Chimie et SVT.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0056b3",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
