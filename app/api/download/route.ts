import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json(
      { error: "Paramètre 'path' manquant" },
      { status: 400 },
    );
  }

  // Prevent path traversal
  if (path.includes("..") || path.startsWith("/")) {
    return NextResponse.json(
      { error: "Chemin invalide" },
      { status: 400 },
    );
  }

  const { env } = await getCloudflareContext({ async: true });
  const object = await env.FICHIERS.get(path);

  if (!object) {
    return NextResponse.json(
      { error: "Fichier introuvable" },
      { status: 404 },
    );
  }

  // Use ?nom= for a human-readable filename, otherwise derive from the path
  const nom =
    searchParams.get("nom") || path.split("/").pop() || "document.pdf";
  const filename = nom.endsWith(".pdf") ? nom : `${nom}.pdf`;

  const headers = new Headers();
  headers.set("Content-Type", "application/pdf");
  headers.set(
    "Content-Disposition",
    `attachment; filename="${filename}"`,
  );
  // Allow browser to cache the download for 1 hour
  headers.set("Cache-Control", "private, max-age=3600");

  return new NextResponse(object.body as ReadableStream, { headers });
}
