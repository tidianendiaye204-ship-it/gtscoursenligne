// Ce fichier simule les tables Cloudflare D1 (voir schema.sql pour le schéma SQL).
// Pour brancher D1 : remplace les tableaux/fonctions ci-dessous par des requêtes
// `DB.prepare("SELECT ...").all()` sur le binding D1 — la forme des données
// retournées reste identique, donc les pages n'ont pas besoin de changer.
// Les fichierUrl doivent pointer vers le bucket R2 public (voir README.md).

export type Niveau = "seconde-s" | "premiere-s1" | "premiere-s2" | "terminale-s1" | "terminale-s2";
export type Matiere = "mathematiques" | "physique" | "chimie" | "svt";

export const NIVEAUX: { slug: Niveau; nom: string; shortName: string; description: string }[] = [
  { slug: "seconde-s", nom: "Seconde S", shortName: "2nde S", description: "Les bases du raisonnement scientifique." },
  { slug: "premiere-s1", nom: "Première S1", shortName: "1ère S1", description: "Approfondissement en mathématiques et sciences physiques." },
  { slug: "premiere-s2", nom: "Première S2", shortName: "1ère S2", description: "Équilibre scientifique avec un accent sur les SVT." },
  { slug: "terminale-s1", nom: "Terminale S1", shortName: "Term S1", description: "Préparation intensive avec spécialité mathématiques." },
  { slug: "terminale-s2", nom: "Terminale S2", shortName: "Term S2", description: "Préparation intensive avec spécialité SVT." },
];

export const MATIERES: { slug: Matiere; nom: string; abbr: string }[] = [
  { slug: "mathematiques", nom: "Mathématiques", abbr: "MATH" },
  { slug: "physique", nom: "Physique", abbr: "PHYS" },
  { slug: "chimie", nom: "Chimie", abbr: "CHIM" },
  { slug: "svt", nom: "SVT", abbr: "SVT" },
];

export type Categorie = "serie" | "synthese" | "concours";
export type Concours = "ESP" | "EPT" | "ENSA" | "EMS" | "IPLS" | "AUTRES";

export type Serie = {
  slug: string;
  titre: string;
  niveau: Niveau;
  matiere: Matiere;
  categorie: Categorie;
  concours?: Concours; // renseigné uniquement si categorie === "concours"
  resume: string; // texte pour le SEO, même quand la série est en PDF
  contenu: { type: "pdf" | "texte"; fichierUrl?: string; texte?: string };
  // Corrigé d'un seul exercice, offert en exemple. La correction complète n'est jamais publiée sur le site — elle est réservée aux élèves inscrits aux cours WhatsApp.
  corrigeExemple: { type: "pdf" | "texte"; fichierUrl?: string; texte?: string };
  created_at?: string;
};

export const CATEGORIES: { slug: Categorie; nom: string; nomCourt: string }[] = [
  { slug: "serie", nom: "Séries d'exercices", nomCourt: "Séries" },
  { slug: "synthese", nom: "Synthèses de fin d'année", nomCourt: "Synthèses" },
  { slug: "concours", nom: "Préparation aux concours", nomCourt: "Concours" },
];

// Contenu d'exemple — à remplacer depuis /admin une fois les PDF prêts.
import { getCloudflareContext } from "@opennextjs/cloudflare";

export type Professeur = {
  slug: string;
  nom: string;
  matieres: Matiere[];
  bio: string;
  photoUrl: string;
};

// Remplace les photoUrl par les vraies photos une fois ajoutées dans /public/profs
export const PROFESSEURS: Professeur[] = [
  {
    slug: "m-mbaye-alou",
    nom: "M. Mbaye \"Alou\"",
    matieres: ["mathematiques"],
    bio: "",
    photoUrl: "/profs/mbaye-alou.jpg",
  },
  {
    slug: "m-ndoye-chimere",
    nom: "M. Ndoye \"Chimère\"",
    matieres: ["physique", "chimie"],
    bio: "",
    photoUrl: "/profs/ndoye-chimere.jpg",
  },
  {
    slug: "m-dioum-methodes",
    nom: "M. Dioum \"Méthodes\"",
    matieres: ["svt"],
    bio: "",
    photoUrl: "/profs/dioum-methodes.jpg",
  },
];

export const NOM_GROUPE = "GTS — Groupe du Trio Scientifique";

// Tarifs des cours en direct sur WhatsApp (pas les séries gratuites du site)
export const TARIFS = { inscription: "1500F", mensualite: "1500F" };

export const WHATSAPP_GROUPE_URL = "https://wa.me/221788244692";

export const CONCOURS: { slug: Concours; nom: string; description: string }[] = [
  { slug: "ESP", nom: "ESP", description: "École Supérieure Polytechnique de Dakar" },
  { slug: "EPT", nom: "EPT", description: "École Polytechnique de Thiès" },
  { slug: "ENSA", nom: "ENSA", description: "École Nationale Supérieure d'Agriculture" },
  { slug: "EMS", nom: "EMS", description: "École Militaire de Santé" },
  { slug: "IPLS", nom: "IPLS", description: "Institut Polytechnique de Saint-Louis" },
  { slug: "AUTRES", nom: "Autres Concours", description: "Préparation ciblée pour d'autres écoles d'excellence et bourses d'études." },
];

async function mapRowsToSeries(results: any[]): Promise<Serie[]> {
  return results.map((row: any) => ({
    slug: row.slug,
    titre: row.titre,
    niveau: row.niveau_slug as Niveau,
    matiere: row.matiere_slug as Matiere,
    categorie: row.categorie as Categorie,
    concours: row.concours as Concours | undefined,
    resume: row.resume,
    contenu: {
      type: row.contenu_type,
      fichierUrl: row.contenu_fichier_url,
      texte: row.contenu_texte,
    },
    corrigeExemple: {
      type: row.corrige_exemple_type,
      fichierUrl: row.corrige_exemple_url,
      texte: row.corrige_exemple_texte,
    },
    created_at: row.created_at,
  }));
}

export async function getSeriesParNiveauEtMatiere(niveau: Niveau, matiere: Matiere) {
  const { env } = await getCloudflareContext({ async: true });
  const { results } = await env.DB.prepare(
    `SELECT s.*, n.slug as niveau_slug, m.slug as matiere_slug
     FROM series s
     JOIN niveaux n ON s.niveau_id = n.id
     JOIN matieres m ON s.matiere_id = m.id
     WHERE n.slug = ? AND m.slug = ?
     ORDER BY s.ordre ASC`
  ).bind(niveau, matiere).all();
  
  return mapRowsToSeries(results);
}

export async function getSerie(niveau: Niveau, matiere: Matiere, slug: string) {
  const { env } = await getCloudflareContext({ async: true });
  const { results } = await env.DB.prepare(
    `SELECT s.*, n.slug as niveau_slug, m.slug as matiere_slug
     FROM series s
     JOIN niveaux n ON s.niveau_id = n.id
     JOIN matieres m ON s.matiere_id = m.id
     WHERE n.slug = ? AND m.slug = ? AND s.slug = ?`
  ).bind(niveau, matiere, slug).all();
  
  if (results.length === 0) return undefined;
  const mapped = await mapRowsToSeries(results);
  return mapped[0];
}

export async function getContenuConcours() {
  const { env } = await getCloudflareContext({ async: true });
  const { results } = await env.DB.prepare(
    `SELECT s.*, n.slug as niveau_slug, m.slug as matiere_slug
     FROM series s
     JOIN niveaux n ON s.niveau_id = n.id
     JOIN matieres m ON s.matiere_id = m.id
     WHERE s.categorie = 'concours'
     ORDER BY s.ordre ASC`
  ).all();
  
  return mapRowsToSeries(results);
}

export async function getAllSeries() {
  const { env } = await getCloudflareContext({ async: true });
  const { results } = await env.DB.prepare(
    `SELECT s.*, n.slug as niveau_slug, m.slug as matiere_slug
     FROM series s
     JOIN niveaux n ON s.niveau_id = n.id
     JOIN matieres m ON s.matiere_id = m.id
     ORDER BY s.ordre ASC`
  ).all();
  
  return mapRowsToSeries(results);
}

export async function getRecentSeries(limit: number = 3) {
  const { env } = await getCloudflareContext({ async: true });
  const { results } = await env.DB.prepare(
    `SELECT s.*, n.slug as niveau_slug, m.slug as matiere_slug
     FROM series s
     JOIN niveaux n ON s.niveau_id = n.id
     JOIN matieres m ON s.matiere_id = m.id
     ORDER BY s.created_at DESC
     LIMIT ?`
  ).bind(limit).all();
  
  return mapRowsToSeries(results);
}
