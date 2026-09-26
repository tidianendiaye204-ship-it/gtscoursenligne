import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  // Supprimer le cookie de session
  response.cookies.delete("gts_session");
  
  return response;
}
