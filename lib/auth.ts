import { jwtVerify, SignJWT } from "jose";

// Dans une vraie application, mettez ça dans le fichier .env
const JWT_SECRET = process.env.JWT_SECRET || "GTS_SUPER_SECRET_KEY_2026_COURS_EN_LIGNE";
const key = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  id: string;
  email: string;
  role: string;
}

export async function signToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h") // Le token expire dans 24 heures
    .sign(key);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}
