import { NextRequest, NextResponse } from "next/server";



// Clés API PayDunya (à configurer dans les variables d'environnement Cloudflare / .dev.vars)
// PAYDUNYA_MASTER_KEY
// PAYDUNYA_PRIVATE_KEY
// PAYDUNYA_TOKEN

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as any;
    const { action, eleveId, mois, nom, prenom, email } = body;

    // TODO: Récupérer les clés d'environnement depuis Cloudflare
    // En local avec OpenNext, ces variables devraient être accessibles via `process.env` ou `req.env`
    // const MASTER_KEY = process.env.PAYDUNYA_MASTER_KEY;
    // const PRIVATE_KEY = process.env.PAYDUNYA_PRIVATE_KEY;
    // const TOKEN = process.env.PAYDUNYA_TOKEN;

    if (action === "create_invoice") {
      // 1. Appel à l'API PayDunya pour créer une facture (checkout)
      // Doc PayDunya: https://paydunya.com/developers/api/checkout/invoices
      /*
      const response = await fetch("https://app.paydunya.com/api/v1/checkout-invoice/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "PAYDUNYA-MASTER-KEY": MASTER_KEY,
          "PAYDUNYA-PRIVATE-KEY": PRIVATE_KEY,
          "PAYDUNYA-TOKEN": TOKEN
        },
        body: JSON.stringify({
          invoice: {
            total_amount: 1500,
            description: `Mensualité ${mois} - GTS Cours en Ligne`
          },
          store: {
            name: "GTS Cours en Ligne"
          },
          custom_data: {
            eleve_id: eleveId,
            mois: mois
          },
          actions: {
            cancel_url: `${new URL(req.url).origin}/paiement-annule`,
            return_url: `${new URL(req.url).origin}/paiement-succes`,
            callback_url: `${new URL(req.url).origin}/api/paydunya-callback`
          }
        })
      });

      const data = await response.json();
      if (data.response_code === "00") {
        return NextResponse.json({ url: data.response_text }); // URL de redirection vers le guichet
      } else {
        return NextResponse.json({ error: "Erreur PayDunya" }, { status: 500 });
      }
      */
      
      // Stub pour le moment
      return NextResponse.json({ 
        message: "Endpoint préparé pour l'intégration PayDunya. Ajoutez vos clés API.",
        url: "https://paydunya.com/checkout/test"
      });
    }

    return NextResponse.json({ error: "Action non reconnue" }, { status: 400 });
  } catch (error) {
    console.error("Erreur PayDunya:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
