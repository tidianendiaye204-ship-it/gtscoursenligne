# Site — Maths · PC · SVT (GTS)

Site vitrine + catalogue de séries d'exercices pour le GTS (Groupe du Trio
Scientifique) — M. Mbaye "Alou" (Maths), M. Ndoye "Chimère" (PC), M. Dioum
"Méthodes" (SVT), qui donnent des cours en direct sur WhatsApp. Niveaux
Seconde S / Première S / Terminale.

Stack : **Next.js + Cloudflare Pages (hébergement) + Cloudflare D1 (base de
données) + Cloudflare R2 (fichiers PDF et photos)** — tout sur un seul
compte Cloudflare, gratuit dans les volumes de ce projet.

## Ce qu'il reste à faire de ton côté

1. **Photos des profs** — dépose-les dans `public/profs/` sous les noms déjà
   prévus dans `lib/data.ts` (`mbaye-alou.jpg`, `ndoye-chimere.jpg`,
   `dioum-methodes.jpg`), ou change les noms si tu préfères.
2. **PDF des séries et corrections** — dès qu'ils sont prêts, upload-les sur
   R2 (voir plus bas) et mets à jour les URLs dans `lib/data.ts`.
3. **Nom de domaine** — remplace `https://exemple-a-remplacer.sn` dans
   `app/layout.tsx`, `app/sitemap.ts` et `app/robots.ts`.
4. **Numéro WhatsApp** — déjà branché (`wa.me/221788244692`), vérifie qu'il
   est correct.

## Lancer le projet en local

```bash
npm install
npm run dev
```

Le site tourne sur http://localhost:3000. Le contenu (séries, profs) vient
pour l'instant de `lib/data.ts` — pas besoin de D1 pour tester le design et
la navigation.

## Brancher Cloudflare D1 (base de données)

```bash
# Se connecter à Cloudflare (une seule fois)
npx wrangler login

# Créer la base D1
npx wrangler d1 create trio-scientifique-db
# → copie l'"id" renvoyé dans wrangler.toml (database_id)

# Appliquer le schéma
npm run db:migrate:local    # pour tester en local
npm run db:migrate:remote   # pour la vraie base en ligne
```

Le schéma complet (niveaux, matières, professeurs, séries, corrections) est
dans `schema.sql`, avec les 3 profs et les 3 niveaux déjà pré-remplis.

Ensuite, dans `lib/data.ts`, remplace les tableaux statiques par des
requêtes sur le binding D1 (`DB.prepare("SELECT * FROM series WHERE ...")`),
accessible depuis les routes/pages via `getRequestContext().env.DB`
(package `@cloudflare/next-on-pages`, déjà dans les dépendances).

## Brancher Cloudflare R2 (fichiers PDF et photos)

```bash
npx wrangler r2 bucket create trio-scientifique-fichiers
```

Active l'accès public au bucket (Dashboard Cloudflare → R2 → ton bucket →
Settings → Public Access), ou passe par un domaine personnalisé pour des
URLs propres type `https://fichiers.tondomaine.sn/series/derivees.pdf`.

Upload manuel rapide en attendant un vrai formulaire d'upload dans
`/admin` :

```bash
npx wrangler r2 object put trio-scientifique-fichiers/series/derivees.pdf --file=./derivees.pdf
```

**Pense à compresser les PDF scannés avant upload** (même si R2 est très
généreux, ça accélère le chargement pour les élèves) :

```bash
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
   -dNOPAUSE -dBATCH -sOutputFile=compresse.pdf original.pdf
```

## Protéger le backoffice `/admin`

`/admin` n'est pas protégé pour l'instant. Deux options simples avec
Cloudflare :
- **Cloudflare Access** (Zero Trust, gratuit jusqu'à 50 utilisateurs) —
  protège l'URL `/admin` avec ton email, sans écrire de code
- Ou une authentification classique dans Next.js (cookie de session + mot
  de passe stocké en variable d'environnement)

Cloudflare Access est le plus rapide à mettre en place puisque tu es déjà
sur Cloudflare.

## Déploiement sur Cloudflare Pages

```bash
npm run pages:deploy
```

Ou connecte le repo GitHub du projet directement dans le Dashboard
Cloudflare Pages pour un déploiement automatique à chaque `git push`.

## SEO — ce qui est déjà en place

- Métadonnées (title/description) dynamiques par page, y compris par série
  (`app/cours/[niveau]/[matiere]/[serie]/page.tsx`)
- `sitemap.xml` et `robots.txt` générés automatiquement — pense à mettre à
  jour le nom de domaine dans `app/sitemap.ts` et `app/robots.ts`
- Chaque série a un champ `resume` en texte, indexable par Google, même
  quand le contenu complet est en PDF
- URLs lisibles : `/cours/terminale/mathematiques/derivees-et-applications`

Pense à soumettre le site à Google Search Console une fois en ligne, et à
compléter une vraie bio pour chaque professeur (le contenu texte des pages
`/professeurs` compte aussi pour le référencement).
