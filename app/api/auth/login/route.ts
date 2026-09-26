import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json() as any;

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
    }

    const { env } = await getCloudflareContext({ async: true });
    
    // Récupérer l'utilisateur depuis la base de données
    const user = await env.DB.prepare(`SELECT * FROM users WHERE email = ?`)
      .bind(email)
      .first();

    if (!user) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user.password_hash as string);

    if (!isValid) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });
    }

    // Créer le token de session
    const token = await signToken({
      id: user.id as string,
      email: user.email as string,
      role: user.role as string,
    });

    // Créer la réponse et attacher le cookie
    const response = NextResponse.json({
      success: true,
      role: user.role,
    });

    response.cookies.set({
      name: "gts_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 heures
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Erreur de connexion:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
