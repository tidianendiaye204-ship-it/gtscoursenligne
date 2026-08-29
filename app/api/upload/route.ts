import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const path = formData.get("path") as string | null;

    if (!file || !path) {
      return NextResponse.json({ error: "Fichier ou chemin manquant" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Seuls les fichiers PDF sont autorisés" }, { status: 400 });
    }

    // Limite de taille: 15 Mo
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "Le fichier dépasse la taille maximale autorisée (15 Mo)" }, { status: 400 });
    }

    const { env } = await getCloudflareContext({ async: true });
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Upload to R2
    await env.FICHIERS.put(path, arrayBuffer, {
      httpMetadata: { contentType: file.type },
    });

    // L'URL de base est définie par la variable d'environnement NEXT_PUBLIC_R2_URL
    // Si elle n'est pas définie, on utilise le domaine public R2 par défaut fourni
    const baseUrl = process.env.NEXT_PUBLIC_R2_URL || "https://pub-e5d22f2c4db84e46bb88d70849adae66.r2.dev";
    const publicUrl = `${baseUrl}/${path}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Erreur d'upload R2:", error);
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
  }
}
