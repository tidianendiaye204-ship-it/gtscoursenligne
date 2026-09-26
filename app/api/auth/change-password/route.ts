import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('gts_session')?.value;
    if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Session invalide" }, { status: 401 });

    const { currentPassword, newPassword } = await req.json() as any;
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const { env } = await getCloudflareContext({ async: true });
    
    // Vérifier l'utilisateur
    const user = await env.DB.prepare(`SELECT * FROM users WHERE id = ?`)
      .bind(payload.id)
      .first();

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Vérifier l'ancien mot de passe
    const isValid = await bcrypt.compare(currentPassword, user.password_hash as string);
    if (!isValid) {
      return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 401 });
    }

    // Hasher et mettre à jour le nouveau mot de passe
    const newHash = await bcrypt.hash(newPassword, 10);
    await env.DB.prepare(`UPDATE users SET password_hash = ? WHERE id = ?`)
      .bind(newHash, payload.id)
      .run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur change password:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
