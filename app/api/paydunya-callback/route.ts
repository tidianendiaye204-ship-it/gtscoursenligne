import { NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 1. PayDunya enverra le statut du paiement ici.
    // Doc: https://paydunya.com/developers/api/checkout/invoices (IPN / Webhooks)
    const { status, custom_data, invoice } = body;
    
    if (status === "completed") {
      const eleveId = custom_data?.eleve_id;
      const mois = custom_data?.mois;
      
      if (eleveId && mois) {
        // Mettre à jour la base de données
        const DB = getRequestContext().env.DB;
        
        await DB.prepare(`
          INSERT INTO paiements (id, eleve_id, mois, statut, date_paiement, montant)
          VALUES (lower(hex(randomblob(16))), ?, ?, 'payé', datetime('now'), 1500)
          ON CONFLICT(eleve_id, mois) 
          DO UPDATE SET statut = 'payé', date_paiement = datetime('now')
        `)
        .bind(eleveId, mois)
        .run();
        
        return NextResponse.json({ success: true, message: "Paiement validé" });
      }
    }
    
    return NextResponse.json({ success: false, message: "Paiement non complété" });
  } catch (error) {
    console.error("Erreur Webhook PayDunya:", error);
    return NextResponse.json({ error: "Erreur lors du traitement du callback" }, { status: 500 });
  }
}
