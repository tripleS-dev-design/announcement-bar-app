import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const plan = url.searchParams.get("plan") || "monthly";
  const shop = url.searchParams.get("shop") || "selya11904.myshopify.com";
  const action = url.searchParams.get("action");
  
  // If user accepted, redirect back to app
  if (action === "accept") {
    console.log("✅ BILLING SIMULATION: User accepted plan:", plan);
    return redirect(`http://localhost:61282/api/billing/request/confirm?shop=${shop}&plan=${plan}&status=success`);
  }
  
  // If user declined, redirect back to pricing
  if (action === "decline") {
    console.log("❌ BILLING SIMULATION: User declined plan:", plan);
    return redirect(`http://localhost:61282/api/billing/request/confirm?shop=${shop}&plan=${plan}&status=declined`);
  }
  
  // Show billing simulation page
  return new Response(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>Shopify Billing Simulation</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0; padding: 20px; background: #f6f6f7; min-height: 100vh;
          }
          .container { max-width: 600px; margin: 0 auto; }
          .card { 
            background: white; border-radius: 12px; padding: 40px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center;
          }
          .shopify-header { 
            background: #00848e; color: white; padding: 20px; 
            border-radius: 12px 12px 0 0; margin: -40px -40px 30px -40px;
          }
          .button { 
            background: #00848e; color: white; padding: 15px 30px; 
            text-decoration: none; border-radius: 8px; display: inline-block; 
            margin: 10px; font-weight: 600; font-size: 16px; border: none; cursor: pointer;
          }
          .button:hover { background: #006b75; }
          .button.success { background: #28a745; }
          .button.success:hover { background: #218838; }
          .button.danger { background: #dc3545; }
          .button.danger:hover { background: #c82333; }
          .plan-details { 
            background: #f8f9fa; padding: 20px; border-radius: 8px; 
            margin: 20px 0; text-align: left;
          }
          .price { font-size: 2em; color: #00848e; font-weight: bold; }
          .features { list-style: none; padding: 0; }
          .features li { padding: 8px 0; border-bottom: 1px solid #eee; }
          .features li:before { content: "✅ "; margin-right: 10px; }
          .warning { 
            background: #fff3cd; padding: 15px; border-radius: 8px; 
            border-left: 4px solid #ffc107; margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="shopify-header">
              <h1>💳 Shopify Billing</h1>
              <p>Confirmation de l'abonnement</p>
            </div>
            
            <h2>Announcement Bar App - Pro Plan</h2>
            
            <div class="plan-details">
              <div class="price">${plan === "monthly" ? "9.99€/mois" : "99.99€/an"}</div>
              <h3>Plan sélectionné: ${plan === "monthly" ? "Mensuel" : "Annuel"}</h3>
              
              <ul class="features">
                <li>Barres d'annonce illimitées</li>
                <li>Animations et effets avancés</li>
                <li>Popup personnalisables</li>
                <li>Timers de compte à rebours</li>
                <li>Support prioritaire 24/7</li>
                <li>Thèmes et designs personnalisés</li>
                <li>Analytics et rapports détaillés</li>
                <li>Intégrations API avancées</li>
              </ul>
            </div>
            
            <div class="warning">
              <strong>🧪 Mode simulation:</strong> Ceci est une simulation du processus de billing Shopify pour le développement. 
              En production, ceci serait la vraie page de paiement Shopify.
            </div>
            
            <p><strong>Store:</strong> ${shop}</p>
            <p>Voulez-vous confirmer cet abonnement ?</p>
            
            <div style="margin: 30px 0;">
              <a href="?plan=${plan}&shop=${shop}&action=accept" class="button success">
                ✅ Accepter l'abonnement
              </a>
              <a href="?plan=${plan}&shop=${shop}&action=decline" class="button danger">
                ❌ Annuler
              </a>
            </div>
            
            <p style="color: #6c757d; font-size: 14px;">
              💡 En cliquant "Accepter", vous serez redirigé vers votre app avec l'abonnement activé.
            </p>
          </div>
        </div>
      </body>
    </html>`,
    {
      headers: { 
        "Content-Type": "text/html",
        "X-Frame-Options": "ALLOWALL"
      },
      status: 200
    }
  );
};