import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Serie } from "@/lib/data";

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    
    const { results } = await env.DB.prepare(
      `SELECT s.*, n.slug as niveau_slug, m.slug as matiere_slug
       FROM series s
       JOIN niveaux n ON s.niveau_id = n.id
       JOIN matieres m ON s.matiere_id = m.id
       ORDER BY s.created_at DESC`
    ).all();

    // Map database results to Serie type
    const series: Serie[] = results.map((row: any) => ({
      slug: row.slug,
      titre: row.titre,
      niveau: row.niveau_slug,
      matiere: row.matiere_slug,
      categorie: row.categorie,
      concours: row.concours,
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
    }));

    return NextResponse.json(series);
  } catch (error) {
    console.error("Erreur lecture séries:", error);
    return NextResponse.json({ error: "Erreur lors de la lecture des séries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json() as any;
    
    if (!data.slug || !data.titre || !data.niveau || !data.matiere) {
      return NextResponse.json({ error: "Champs obligatoires manquants (slug, titre, niveau, matiere)" }, { status: 400 });
    }

    const { env } = await getCloudflareContext({ async: true });
    
    // We need to resolve niveau and matiere slugs to IDs based on initial data
    const { results: nResults } = await env.DB.prepare('SELECT id FROM niveaux WHERE slug = ?').bind(data.niveau).all();
    const { results: mResults } = await env.DB.prepare('SELECT id FROM matieres WHERE slug = ?').bind(data.matiere).all();
    
    const niveauId = nResults[0]?.id;
    const matiereId = mResults[0]?.id;

    if (!niveauId || !matiereId) {
      return NextResponse.json({ error: `Niveau "${data.niveau}" ou Matière "${data.matiere}" introuvable en base` }, { status: 400 });
    }

    const id = crypto.randomUUID();

    await env.DB.prepare(
      `INSERT INTO series (id, slug, titre, niveau_id, matiere_id, categorie, concours, resume, contenu_type, contenu_fichier_url, contenu_texte, corrige_exemple_type, corrige_exemple_url, corrige_exemple_texte, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    ).bind(
      id,
      data.slug,
      data.titre,
      niveauId,
      matiereId,
      data.categorie || 'serie',
      data.concours || null,
      data.resume || null,
      data.contenu?.type || 'pdf',
      data.contenu?.fichierUrl || null,
      data.contenu?.texte || null,
      data.corrigeExemple?.type || 'pdf',
      data.corrigeExemple?.fichierUrl || null,
      data.corrigeExemple?.texte || null
    ).run();

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("Erreur insertion série:", error);
    return NextResponse.json({ error: `Insertion échouée : ${error?.message || String(error)}` }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    
    if (!slug) {
      return NextResponse.json({ error: "Slug manquant" }, { status: 400 });
    }

    const { env } = await getCloudflareContext({ async: true });
    
    await env.DB.prepare('DELETE FROM series WHERE slug = ?').bind(slug).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression série:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression de la série" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json() as any;
    const { originalSlug, titre, niveau, matiere, categorie, concours, resume, slug: newSlug } = data;

    if (!originalSlug || !titre || !niveau || !matiere) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants (originalSlug, titre, niveau, matiere)" },
        { status: 400 },
      );
    }

    const { env } = await getCloudflareContext({ async: true });

    // Resolve niveau and matiere slugs to IDs
    const { results: nResults } = await env.DB.prepare('SELECT id FROM niveaux WHERE slug = ?').bind(niveau).all();
    const { results: mResults } = await env.DB.prepare('SELECT id FROM matieres WHERE slug = ?').bind(matiere).all();

    const niveauId = nResults[0]?.id;
    const matiereId = mResults[0]?.id;

    if (!niveauId || !matiereId) {
      return NextResponse.json(
        { error: `Niveau "${niveau}" ou Matière "${matiere}" introuvable en base` },
        { status: 400 },
      );
    }

    await env.DB.prepare(
      `UPDATE series
       SET slug = ?, titre = ?, niveau_id = ?, matiere_id = ?, categorie = ?, concours = ?, resume = ?
       WHERE slug = ?`
    ).bind(
      newSlug || originalSlug,
      titre,
      niveauId,
      matiereId,
      categorie || "serie",
      concours || null,
      resume || null,
      originalSlug,
    ).run();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erreur mise à jour série:", error);
    return NextResponse.json(
      { error: `Mise à jour échouée : ${error?.message || String(error)}` },
      { status: 500 },
    );
  }
}
