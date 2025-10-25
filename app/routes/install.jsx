export const loader = async ({ request }) => {
  return new Response(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>Install Announcement Bar App</title>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            max-width: 600px; margin: 50px auto; padding: 20px; background: #f6f6f7;
          }
          .card { 
            background: white; border-radius: 12px; padding: 40px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center;
          }
          .button { 
            background: #00848e; color: white; padding: 16px 32px; 
            text-decoration: none; border-radius: 8px; display: inline-block; 
            margin: 15px; font-weight: 600; font-size: 16px;
          }
          .button:hover { background: #006b75; }
          .secondary { background: #6c757d; }
          .secondary:hover { background: #5a6268; }
          .success { background: #28a745; }
          .success:hover { background: #218838; }
          h1 { color: #212326; margin-bottom: 20px; }
          .steps { 
            text-align: left; background: #f8f9fa; padding: 20px; 
            border-radius: 8px; margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🎯 Announcement Bar App</h1>
          <p>Installation et configuration de votre app Shopify</p>
          
          <div class="steps">
            <h3>📋 Solutions pour le problème de cookies:</h3>
            <ol>
              <li><strong>Installer d'abord:</strong> Utilisez le lien d'installation</li>
              <li><strong>Mode bypass:</strong> Accès direct sans cookies</li>
              <li><strong>Nouvelle stratégie:</strong> Auth moderne activée</li>
            </ol>
          </div>
          
          <div style="margin: 30px 0;">
            <a href="https://partners.shopify.com/4250140/apps/259707437057/test" 
               class="button success" target="_top">
              📦 Installer l'App
            </a>
            
            <a href="/bypass?shop=selya11904.myshopify.com" 
               class="button" target="_top">
              🔄 Mode Bypass
            </a>
            
            <a href="https://selya11904.myshopify.com/admin/oauth/redirect_from_cli?client_id=be79dab79ff6bb4be47d4e66577b6c50" 
               class="button secondary" target="_top">
              🎯 Preview URL
            </a>
          </div>
          
          <p style="color: #6c757d; font-size: 14px;">
            💡 Une fois installée, l'app fonctionnera normalement sans problème de cookies.
          </p>
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


