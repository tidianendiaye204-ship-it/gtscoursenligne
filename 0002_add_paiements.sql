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
