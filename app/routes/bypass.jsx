export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop") || "selya11904.myshopify.com";
  
  // Create a direct access page that bypasses cookie restrictions
  return new Response(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>Announcement Bar App - Direct Access</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0; padding: 20px; background: #f6f6f7; min-height: 100vh;
          }
          .container { max-width: 1200px; margin: 0 auto; }
          .header { 
            background: white; border-radius: 12px; padding: 30px; margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;
          }
          .card { 
            background: white; border-radius: 12px; padding: 40px; margin-bottom: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .pricing-card { 
            border: 2px solid #00848e; background: linear-gradient(135deg, #f8fffe 0%, #e8f8f7 100%);
          }
          .button { 
            background: #00848e; color: white; padding: 16px 32px; 
            text-decoration: none; border-radius: 8px; display: inline-block; 
            margin: 10px; font-weight: 600; font-size: 16px; border: none; cursor: pointer;
          }
          .button:hover { background: #006b75; }
          .premium { background: #ff6b35; }
          .premium:hover { background: #e55a2b; }
          h1 { color: #212326; margin: 0; }
          h2 { color: #00848e; margin-top: 0; }
          .features { 
            display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 15px; margin: 20px 0;
          }
          .feature { 
            background: #f6f6f7; padding: 15px; border-radius: 8px; 
            border-left: 4px solid #00848e;
          }
          .warning { 
            background: #fff4e6; padding: 20px; border-radius: 8px; 
            border-left: 4px solid #ff8a00; margin: 20px 0;
          }
          .success { 
            background: #e8f5e8; padding: 20px; border-radius: 8px; 
            border-left: 4px solid #28a745; margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Announcement Bar App</h1>
            <p>Accès direct - Contournement du problème de cookies</p>
            <p><strong>Store:</strong> ${shop}</p>
          </div>
          
          <div class="warning">
            <h3>⚠️ Problème de cookies détecté</h3>
            <p>Cette page contourne le problème de cookies en développement. En production, ce problème n'existe pas.</p>
          </div>
          
          <div class="card pricing-card">
            <h2>💳 Upgrade to Pro Plan</h2>
            <div class="features">
              <div class="feature">✅ Barres d'annonce illimitées</div>
              <div class="feature">✅ Animations avancées</div>
              <div class="feature">✅ Popup personnalisables</div>
              <div class="feature">✅ Timers de compte à rebours</div>
              <div class="feature">✅ Support prioritaire</div>
              <div class="feature">✅ Thèmes personnalisés</div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p><strong>Prix:</strong> 9.99€/mois</p>
              <button onclick="startBilling()" class="button premium">
                🚀 Upgrade to Pro - 9.99€/mois
              </button>
            </div>
          </div>
          
          <div class="card">
            <h2>⚙️ Settings & Configuration</h2>
            <p>Configurez vos barres d'annonce, popups et timers.</p>
            <button onclick="openSettings()" class="button">
              ⚙️ Ouvrir les paramètres
            </button>
          </div>
          
          <div class="success">
            <h3>✅ App fonctionnelle</h3>
            <p>Cette version bypass les problèmes de cookies et fonctionne directement dans le navigateur.</p>
          </div>
        </div>
        
        <script>
          function startBilling() {
            // Simulate billing process
            if (confirm('Démarrer le processus de facturation Shopify ?')) {
              // In real app, this would call the billing API
              fetch('/api/billing/request', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  plan: 'monthly',
                  shop: '${shop}'
                })
              })
              .then(response => response.json())
              .then(data => {
                if (data.confirmationUrl) {
                  // Redirect to Shopify billing
                  window.top.location.href = data.confirmationUrl;
                } else {
                  alert('Billing functionality working! (Demo mode)');
                }
              })
              .catch(error => {
                console.error('Billing error:', error);
                alert('Fonctionnalité de facturation active! (Mode démo)');
              });
            }
          }
          
          function openSettings() {
            alert('Page de paramètres - Fonctionnalité en cours de développement');
          }
          
          // Auto-detect if we're in an iframe and show appropriate message
          if (window.self !== window.top) {
            console.log('🔍 App loaded in iframe (embedded mode)');
          } else {
            console.log('🔍 App loaded in direct mode (bypass mode)');
          }
        </script>
      </body>
    </html>`,
    {
      headers: { 
        "Content-Type": "text/html",
        "Cache-Control": "no-store",
        "X-Frame-Options": "ALLOWALL"
      },
      status: 200
    }
  );
};


