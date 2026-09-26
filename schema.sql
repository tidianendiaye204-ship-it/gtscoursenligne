-- Exécuter avec : npm run db:migrate:local (test) puis db:migrate:remote (prod)

CREATE TABLE niveaux (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  description TEXT
);

CREATE TABLE matieres (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  abbr TEXT NOT NULL
);

CREATE TABLE professeurs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  matiere_id TEXT REFERENCES matieres(id),
  bio TEXT,
  photo_url TEXT
);

CREATE TABLE series (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  titre TEXT NOT NULL,
  niveau_id TEXT REFERENCES niveaux(id),
  matiere_id TEXT REFERENCES matieres(id),
  categorie TEXT CHECK (categorie IN ('serie', 'synthese', 'concours')) NOT NULL DEFAULT 'serie',
  concours TEXT,
  resume TEXT,
  contenu_type TEXT CHECK (contenu_type IN ('pdf', 'texte')),
  contenu_fichier_url TEXT,
  contenu_texte TEXT,
  corrige_exemple_type TEXT CHECK (corrige_exemple_type IN ('pdf', 'texte')),
  corrige_exemple_url TEXT,
  corrige_exemple_texte TEXT,
  ordre INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Données de départ (niveaux et matières fixes)
INSERT INTO niveaux (id, slug, nom, description) VALUES
  ('n1', 'seconde-s', 'Seconde S', 'Les bases du raisonnement scientifique.'),
  ('n2', 'premiere-s1', 'Première S1', 'Approfondissement en mathématiques et sciences physiques.'),
  ('n3', 'premiere-s2', 'Première S2', 'Équilibre scientifique avec un accent sur les SVT.'),
  ('n4', 'terminale-s1', 'Terminale S1', 'Préparation intensive avec spécialité mathématiques.'),
  ('n5', 'terminale-s2', 'Terminale S2', 'Préparation intensive avec spécialité SVT.');

INSERT INTO matieres (id, slug, nom, abbr) VALUES
  ('m1', 'mathematiques', 'Mathématiques', 'MATH'),
  ('m2', 'physique', 'Physique', 'PHYS'),
  ('m3', 'chimie', 'Chimie', 'CHIM'),
  ('m4', 'svt', 'SVT', 'SVT');

INSERT INTO professeurs (id, slug, nom, matiere_id, bio, photo_url) VALUES
  ('p1', 'm-mbaye-alou', 'M. Mbaye "Alou"', 'm1', NULL, '/profs/mbaye-alou.jpg'),
  ('p2', 'm-ndoye-chimere', 'M. Ndoye "Chimère"', 'm2', NULL, '/profs/ndoye-chimere.jpg'),
  ('p3', 'm-dioum-methodes', 'M. Dioum "Méthodes"', 'm4', NULL, '/profs/dioum-methodes.jpg');

CREATE TABLE IF NOT EXISTS eleves (
  id TEXT PRIMARY KEY,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  numero_whatsapp TEXT NOT NULL,
  niveau_id TEXT REFERENCES niveaux(id),
  actif BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS paiements (
  id TEXT PRIMARY KEY,
  eleve_id TEXT REFERENCES eleves(id) ON DELETE CASCADE,
  mois TEXT NOT NULL, -- Format 'YYYY-MM'
  statut TEXT CHECK (statut IN ('payé', 'impayé', 'partiel')) DEFAULT 'impayé',
  date_paiement DATETIME,
  montant INTEGER DEFAULT 1500,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(eleve_id, mois)
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'prof')) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO users (id, email, password_hash, role) VALUES
  ('u1', 'gtsadmin1847', '$2b$10$p7XhAKnpxe0dxFpzWX8qeOhOCiydrAHWxZWogz2X9opgHH4CAthqu', 'admin'),
  ('u2', 'prof@gts.sn', '$2b$10$z9vUqS0fwoQ3iwflAaWOl.iIkARRP9PzmostZwhS.ti73CSeu/8Ym', 'prof');
