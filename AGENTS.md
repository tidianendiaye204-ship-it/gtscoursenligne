# GTS Cours En Ligne - Directives Architecturales & Stack Technique

Ce projet est hébergé et propulsé **entièrement sur l'écosystème Cloudflare**.

## Stack Technique Obligatoire
- **Framework Web** : Next.js (App Router) + React + Tailwind CSS
- **Hébergement** : Cloudflare Workers via **OpenNext** (`@opennextjs/cloudflare`) — *Ne pas utiliser next-on-pages (déprécié)*
- **Base de données** : **Cloudflare D1** (binding : `DB` dans `wrangler.jsonc`)
- **Stockage Objets (PDFs, photos, médias)** : **Cloudflare R2** (binding : `FICHIERS` dans `wrangler.jsonc`)
- **Formulaire de contact** : **Web3Forms** (aucun serveur SMTP / backend email)
- **Domaine** : `gtscoursenligne.com` (non-www, redirection Cloudflare www vers non-www active)
- **Déploiement** : `npm run pages:deploy` (ou `opennextjs-cloudflare build && opennextjs-cloudflare deploy`)

## Règles Strictes pour l'Assistant
1. **Zéro service tiers redondant** : Ne JAMAIS proposer Vercel, Supabase, Firebase, AWS S3, etc.
2. **Compatibilité Cloudflare Workers** : Toute API route ou composant serveur doit être compatible avec l'environnement d'exécution Cloudflare Workers (edge/workerd) via OpenNext.
3. **Migrations D1** :
   - Local : `npm run db:migrate:local`
   - Production : `npm run db:migrate:remote`
