import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function GET(req: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const { searchParams } = new URL(req.url);
    const mois = searchParams.get('mois'); // ex: "2026-09"
    const eleveId = searchParams.get('eleve_id');
    
    if (eleveId) {
      const historique = await env.DB.prepare(
        `SELECT mois, statut, date_paiement, montant 
         FROM paiements 
         WHERE eleve_id = ? 
         ORDER BY mois DESC`
      ).bind(eleveId).all();
      return NextResponse.json({ historique: historique.results });
    }

    if (!mois) {
      return NextResponse.json({ error: 'Mois manquant' }, { status: 400 });
    }

    const [elevesResult, niveauxResult] = await Promise.all([
      env.DB.prepare(
        `SELECT e.*, n.nom as niveau_nom, 
                p.id as paiement_id, p.statut as paiement_statut, p.date_paiement,
                COALESCE(p.montant, 1500) as paiement_montant
         FROM eleves e
         JOIN niveaux n ON e.niveau_id = n.id
         LEFT JOIN paiements p ON e.id = p.eleve_id AND p.mois = ?
         WHERE e.actif = 1
         ORDER BY n.nom, e.nom, e.prenom`
      ).bind(mois).all(),
      env.DB.prepare(`SELECT id, nom FROM niveaux ORDER BY nom`).all()
    ]);

    return NextResponse.json({
      eleves: elevesResult.results,
      niveaux: niveauxResult.results
    });
  } catch (error) {
    console.error('Erreur GET paiements', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const body = (await req.json()) as any;
    const { action, payload } = body;

    if (action === 'TOGGLE_PAIEMENT') {
      const { eleve_id, mois, statut } = payload;
      await env.DB.prepare(
        `INSERT INTO paiements (id, eleve_id, mois, statut, date_paiement, montant)
         VALUES (lower(hex(randomblob(16))), ?, ?, ?, CURRENT_TIMESTAMP, 1500)
         ON CONFLICT(eleve_id, mois) DO UPDATE SET statut = ?, date_paiement = CURRENT_TIMESTAMP`
      ).bind(eleve_id, mois, statut, statut).run();
      return NextResponse.json({ success: true });
    }

    if (action === 'ADD_ELEVE') {
      const { nom, prenom, numero_whatsapp, niveau_id } = payload;
      await env.DB.prepare(
        `INSERT INTO eleves (id, nom, prenom, numero_whatsapp, niveau_id, actif)
         VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, 1)`
      ).bind(nom, prenom, numero_whatsapp, niveau_id).run();
      return NextResponse.json({ success: true });
    }

    if (action === 'ARCHIVER_ELEVE') {
      const { eleve_id } = payload;
      await env.DB.prepare(
        `UPDATE eleves SET actif = 0 WHERE id = ?`
      ).bind(eleve_id).run();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Action inconnue' }, { status: 400 });
  } catch (error) {
    console.error('Erreur POST paiements', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
