export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const returnUrl = url.searchParams.get("return") || "/app";
  
  return new Response(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>Activation des cookies - Announcement Bar App</title>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            max-width: 600px; 
            margin: 50px auto; 
            padding: 20px;
            background: #fafbfb;
            line-height: 1.6;
          }
          .card { 
            background: white; 
            border-radius: 12px; 
            padding: 40px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            border: 1px solid #e1e3e5;
          }
          .button { 
            background: #00848e; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 6px; 
            display: inline-block; 
            margin: 10px 5px;
            border: none;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          }
          .button:hover { background: #006b75; }
          .success { background: #008060; }
          .success:hover { background: #006953; }
          .steps { 
            background: #f6f6f7; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            border-left: 4px solid #00848e;
          }
          .warning { 
            background: #fff4e6; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
            border-left: 4px solid #ff8a00;
          }
          h1 { color: #212326; margin-bottom: 10px; }
          h3 { color: #212326; margin-top: 25px; }
          .icon { font-size: 48px; text-align: center; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">🍪</div>
          <h1>Activation des cookies requise</h1>
          <p>Votre app Shopify a besoin d'autoriser les cookies tiers pour fonctionner correctement dans l'environnement embedded.</p>
          
          <div class="warning">
            <strong>⚠️ Problème détecté:</strong> Les cookies tiers sont bloqués par votre navigateur, ce qui empêche l'app de se charger.
          </div>
          
          <div class="steps">
            <h3>🔧 Solutions rapides:</h3>
            <ol>
              <li><strong>Chrome:</strong> 
                <ul>
                  <li>Paramètres → Confidentialité et sécurité → Cookies tiers</li>
                  <li>Sélectionner "Autoriser les cookies tiers"</li>
                </ul>
              </li>
              <li><strong>Mode Incognito:</strong> Ctrl+Shift+N puis accéder à l'app</li>
              <li><strong>Firefox:</strong> Généralement fonctionne mieux</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <button onclick="testCookies()" class="button">
              🧪 Tester les cookies
            </button>
            <a href="${returnUrl}" class="button success">
              ✅ Réessayer l'app
            </a>
          </div>
          
          <p style="text-align: center; color: #637381; font-size: 14px;">
            💡 Ce problème n'affecte que le développement. En production, il n'y a pas de problème.
          </p>
        </div>
        
        <script>
          function testCookies() {
            // Test cookie support
            document.cookie = "test=1; SameSite=None; Secure";
            const cookieEnabled = document.cookie.indexOf("test=1") !== -1;
            
            if (cookieEnabled) {
              alert("✅ Cookies activés ! Vous pouvez maintenant utiliser l'app.");
              window.location.href = "${returnUrl}";
            } else {
              alert("❌ Cookies toujours bloqués. Veuillez suivre les étapes ci-dessus.");
            }
            
            // Clean up test cookie
            document.cookie = "test=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }
          
          // Auto-redirect after 5 seconds if cookies work
          setTimeout(() => {
            document.cookie = "autotest=1; SameSite=None; Secure";
            if (document.cookie.indexOf("autotest=1") !== -1) {
              console.log("🍪 Cookies work! Auto-redirecting...");
              window.location.href = "${returnUrl}";
            }
          }, 5000);
        </script>
      </body>
    </html>`,
    {
      headers: { 
        "Content-Type": "text/html",
        "X-Frame-Options": "ALLOWALL",
        "Set-Cookie": "shopify_app_test=1; SameSite=None; Secure; Path=/",
        "Cross-Origin-Embedder-Policy": "unsafe-none"
      },
      status: 200
    }
  );
};


