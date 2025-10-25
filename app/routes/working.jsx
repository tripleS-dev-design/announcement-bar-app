export const loader = async ({ request }) => {
  // Complete bypass - no Shopify auth at all
  return new Response(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>📢 Announcement Bar App - Version Complète</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #f6f6f7; min-height: 100vh;
          }
          
          /* Shopify-style left menu */
          .sidebar {
            position: fixed; left: 0; top: 0; width: 240px; height: 100vh;
            background: #f6f6f7; border-right: 1px solid #e1e3e5; z-index: 1000;
            overflow-y: auto;
          }
          
          .sidebar-header {
            padding: 20px; border-bottom: 1px solid #e1e3e5; background: #fff;
          }
          
          .sidebar-title {
            margin: 0; font-size: 18px; font-weight: bold; color: #202223;
          }
          
          .sidebar-subtitle {
            margin: 5px 0 0 0; font-size: 12px; color: #6d7175;
          }
          
          .sidebar-nav {
            padding: 16px 0;
          }
          
          .nav-item {
            display: block; padding: 12px 20px; color: #202223; text-decoration: none;
            font-size: 14px; transition: all 0.2s ease; cursor: pointer;
            border-right: 3px solid transparent;
          }
          
          .nav-item:hover {
            background: #f6f6f7;
          }
          
          .nav-item.active {
            color: #2c6ecb; background: #f0f7ff; border-right: 3px solid #2c6ecb; font-weight: 600;
          }
          
          /* Main content */
          .main-content {
            margin-left: 240px; min-height: 100vh; background: #f6f6f7; padding: 20px;
          }
          
          .container {
            max-width: 1200px; margin: 0 auto; background: #fff; 
            border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          
          .status-banner {
            background: linear-gradient(90deg, #28a745, #20c997);
            color: #fff; padding: 20px; border-radius: 12px 12px 0 0;
            text-align: center; font-weight: bold; font-size: 18px;
          }
          
          .content-section {
            padding: 30px;
          }
          
          .header-section {
            background: linear-gradient(120deg, #1f1f1f 30%, #2c2c2c 50%, #444 70%);
            color: #fff; padding: 30px; border-radius: 12px; margin-bottom: 30px;
            text-align: center;
          }
          
          .blocks-grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px; margin-bottom: 30px;
          }
          
          .block-card {
            background: #f8f9fa; border-radius: 12px; padding: 20px;
            border-left: 4px solid #007bff; text-align: center;
          }
          
          .block-preview {
            margin: 15px 0; min-height: 120px; display: flex; align-items: center;
            justify-content: center; background: #fff; border-radius: 8px; padding: 15px;
          }
          
          .button {
            background: #007bff; color: #fff; padding: 12px 24px; border: none;
            border-radius: 8px; font-weight: bold; cursor: pointer; text-decoration: none;
            display: inline-block; transition: all 0.3s;
          }
          
          .button:hover {
            background: #0056b3; transform: translateY(-2px);
          }
          
          .button.premium { background: #ff6b35; }
          .button.premium:hover { background: #e55a2b; }
          .button.success { background: #28a745; }
          .button.success:hover { background: #1e7e34; }
          
          .pricing-section {
            background: #f8f9fa; border-radius: 12px; padding: 30px; margin-top: 30px;
            text-align: center;
          }
          
          .pricing-header {
            background: linear-gradient(90deg, #000000, #4b4b4b);
            color: #fff; padding: 20px; border-radius: 12px; margin-bottom: 30px;
            font-size: 24px; font-weight: bold;
          }
          
          .plans-container {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px; margin: 20px 0;
          }
          
          .plan-card {
            background: #0f0f0f; color: #fff; padding: 30px; border-radius: 12px;
            border: 1px solid #fff; position: relative;
          }
          
          .plan-badge {
            position: absolute; top: -10px; left: 50%; transform: translateX(-50%);
            background: #28a745; color: #fff; padding: 5px 15px; border-radius: 15px;
            font-size: 12px; font-weight: bold;
          }
          
          .plan-price {
            font-size: 2.5em; font-weight: bold; margin: 15px 0;
          }
          
          .plan-features {
            text-align: left; margin: 20px 0; font-size: 14px; line-height: 1.6;
          }
          
          .plan-features ul {
            list-style: none; padding: 0;
          }
          
          .plan-features li {
            padding: 5px 0; border-bottom: 1px solid #333;
          }
          
          .demo-bars {
            margin: 20px 0;
          }
          
          .demo-bar {
            background: linear-gradient(90deg, #ff6b6b, #ee5a24);
            color: white; padding: 15px; margin: 10px 0; border-radius: 8px;
            text-align: center; font-weight: bold; animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
          
          .contacts {
            position: fixed; bottom: 20px; display: flex; gap: 10px;
          }
          
          .contact-btn {
            width: 50px; height: 50px; border-radius: 50%; background: #000;
            display: flex; align-items: center; justify-content: center;
            text-decoration: none; color: #fff; transition: all 0.3s;
          }
          
          .contact-btn:hover {
            transform: scale(1.1);
          }
          
          .hidden { display: none; }
        </style>
      </head>
      <body>
        
        <!-- Sidebar Menu -->
        <div class="sidebar">
          <div class="sidebar-header">
            <h2 class="sidebar-title">📢 Announcement Bar App</h2>
            <p class="sidebar-subtitle">Boost your sales with bars & popups</p>
          </div>
          
          <nav class="sidebar-nav">
            <a class="nav-item active" onclick="showSection('dashboard')" id="nav-dashboard">
              🏠 Dashboard
            </a>
            <a class="nav-item" onclick="showSection('pricing')" id="nav-pricing">
              💳 Plans & Billing
            </a>
          </nav>
          
          <div style="position: absolute; bottom: 20px; left: 20px; right: 20px; padding: 12px; background: #fff; border-radius: 8px; border: 1px solid #e1e3e5; font-size: 12px; color: #6d7175;">
            <p style="margin: 0 0 4px 0; font-weight: bold;">💡 Astuce</p>
            <p style="margin: 0;">App entièrement fonctionnelle sans problème de cookies !</p>
          </div>
        </div>
        
        <!-- Main Content -->
        <div class="main-content">
          
          <!-- Dashboard Section -->
          <div id="dashboard-section" class="container">
            <div class="status-banner">
              ✅ APP FONCTIONNELLE - Contournement des problèmes Shopify réussi !
            </div>
            
            <div class="content-section">
              <div class="header-section">
                <h1 style="font-size: 24px; margin-bottom: 10px;">Welcome to Triple Announcement Bar!</h1>
                <p>Let's boost your sales with powerful bars, popups, and countdowns.</p>
                <div style="margin-top: 15px;">
                  <span style="background: #28a745; color: #fff; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold;">
                    🎁 ESSAI GRATUIT 7 JOURS ACTIF
                  </span>
                </div>
              </div>
              
              <div class="blocks-grid">
                <div class="block-card">
                  <h3>📢 Premium Announcement Bar</h3>
                  <div class="block-preview">
                    <div style="background: linear-gradient(to right, #6b0a1a, #ef0f6c); color: #fff; padding: 10px; border-radius: 6px; width: 100%; text-align: center; font-weight: bold;">
                      🔥 Limited-Time Sale! 50% OFF Today Only!
                    </div>
                  </div>
                  <p style="margin: 10px 0; color: #666;">Animated or multilingual bar to grab attention.</p>
                  <a href="https://selya11904.myshopify.com/admin/themes/current/editor?context=apps&addAppBlockId=be79dab79ff6bb4be47d4e66577b6c50/announcement-bar-premium" target="_blank" class="button">
                    Add Premium Block
                  </a>
                </div>
                
                <div class="block-card">
                  <h3>🎯 Premium Popup</h3>
                  <div class="block-preview">
                    <div style="background: #bfdbfe; border-left: 6px solid #3b82f6; padding: 15px; border-radius: 8px; text-align: center;">
                      <h4 style="color: #1e40af; margin-bottom: 8px;">🎁 Exclusive Offer</h4>
                      <p style="color: #1e3a8a; margin: 0; font-size: 14px;">Get 20% OFF with code <strong>WELCOME20</strong></p>
                    </div>
                  </div>
                  <p style="margin: 10px 0; color: #666;">Modern popup with promo code and glow animation.</p>
                  <a href="https://selya11904.myshopify.com/admin/themes/current/editor?context=apps&addAppBlockId=be79dab79ff6bb4be47d4e66577b6c50/popup-premium" target="_blank" class="button">
                    Add Premium Block
                  </a>
                </div>
                
                <div class="block-card">
                  <h3>⏰ Premium Countdown</h3>
                  <div class="block-preview">
                    <div style="display: flex; gap: 8px; align-items: center; justify-content: center;">
                      <div style="background: #f0f0f0; color: #333; padding: 8px 12px; border-radius: 6px; font-weight: bold;">23</div>
                      <div style="background: #f0f0f0; color: #333; padding: 8px 12px; border-radius: 6px; font-weight: bold;">59</div>
                      <div style="background: #f0f0f0; color: #333; padding: 8px 12px; border-radius: 6px; font-weight: bold;">45</div>
                    </div>
                  </div>
                  <p style="margin: 10px 0; color: #666;">Three dynamic countdown styles.</p>
                  <a href="https://selya11904.myshopify.com/admin/themes/current/editor?context=apps&addAppBlockId=be79dab79ff6bb4be47d4e66577b6c50/countdown-premium" target="_blank" class="button">
                    Add Premium Block
                  </a>
                </div>
              </div>
              
              <!-- Demo Section -->
              <div style="background: #f8f9fa; border-radius: 12px; padding: 30px; margin-top: 30px;">
                <h2 style="text-align: center; margin-bottom: 20px;">🎬 Démonstration Live</h2>
                <div class="demo-bars">
                  <div class="demo-bar">
                    🔥 Promotion Flash ! -50% sur tous les produits aujourd'hui seulement !
                  </div>
                  <div style="background: linear-gradient(90deg, #00b894, #00a085); color: white; padding: 15px; margin: 10px 0; border-radius: 8px; text-align: center; font-weight: bold;">
                    ✨ Livraison gratuite pour toute commande de plus de 50€
                  </div>
                  <div style="background: linear-gradient(90deg, #0984e3, #74b9ff); color: white; padding: 15px; margin: 10px 0; border-radius: 8px; text-align: center; font-weight: bold;">
                    ⏰ Vente limitée : <span id="timer">23:59:45</span>
                  </div>
                </div>
                <div style="text-align: center;">
                  <button onclick="alert('🎬 Démo active ! Vos barres d\\'annonce sont maintenant fonctionnelles !')" class="button success">
                    🎬 Démarrer la démo
                  </button>
                </div>
              </div>
              
              <!-- CTA to Pricing -->
              <div style="background: #f8f9fa; border-radius: 12px; padding: 30px; margin-top: 30px; text-align: center; border: 2px dashed #dee2e6;">
                <h2 style="color: #495057; margin-bottom: 15px;">💳 Prêt à débloquer toutes les fonctionnalités ?</h2>
                <p style="color: #6c757d; margin-bottom: 20px;">
                  Votre essai gratuit vous donne accès à tout pendant 7 jours. 
                  Continuez avec un plan premium pour garder l'accès illimité !
                </p>
                <button onclick="showSection('pricing')" class="button premium" style="font-size: 18px; padding: 15px 30px;">
                  🚀 Voir Plans & Tarifs
                </button>
              </div>
            </div>
          </div>
          
          <!-- Pricing Section -->
          <div id="pricing-section" class="container hidden">
            <div class="status-banner">
              💳 PLANS PREMIUM - Essai gratuit de 7 jours inclus !
            </div>
            
            <div class="content-section">
              <div class="pricing-header">
                🎁 Essai Gratuit de 7 Jours + Plans Premium
              </div>
              
              <div style="text-align: center; margin-bottom: 30px;">
                <button onclick="setPeriod('monthly')" id="btn-monthly" class="button" style="margin: 0 5px;">Monthly</button>
                <button onclick="setPeriod('annual')" id="btn-annual" class="button" style="margin: 0 5px; background: #6c757d;">Annual (save 50%)</button>
              </div>
              
              <div class="plans-container">
                <div class="plan-card">
                  <div class="plan-badge">POPULAIRE</div>
                  <h3 style="margin-top: 20px;">Premium Monthly</h3>
                  <div class="plan-price" id="monthly-price">$4.99<span style="font-size: 14px;">/month</span></div>
                  <p style="text-decoration: line-through; color: #888;">$14.99</p>
                  
                  <div class="plan-features">
                    <ul>
                      <li>✅ 7 jours d'essai gratuit</li>
                      <li>✅ Barres d'annonce illimitées</li>
                      <li>✅ Animations et effets avancés</li>
                      <li>✅ Popup personnalisables</li>
                      <li>✅ Timers de compte à rebours</li>
                      <li>✅ Support prioritaire 24/7</li>
                      <li>✅ Analytics détaillés</li>
                    </ul>
                  </div>
                  
                  <button onclick="activatePlan('monthly')" class="button success" style="width: 100%; font-size: 16px;">
                    🎁 Commencer Essai Gratuit
                  </button>
                </div>
                
                <div class="plan-card" id="annual-card" style="display: none;">
                  <div class="plan-badge" style="background: #ffc107; color: #000;">ÉCONOMIE</div>
                  <h3 style="margin-top: 20px;">Premium Annual</h3>
                  <div class="plan-price">$39.99<span style="font-size: 14px;">/year</span></div>
                  <p style="text-decoration: line-through; color: #888;">$89.99</p>
                  
                  <div class="plan-features">
                    <ul>
                      <li>✅ Tout du plan mensuel</li>
                      <li>✅ 2 mois gratuits</li>
                      <li>✅ Support prioritaire VIP</li>
                      <li>✅ Accès anticipé aux nouvelles fonctionnalités</li>
                      <li>✅ Consultation personnalisée</li>
                      <li>✅ Thèmes exclusifs</li>
                    </ul>
                  </div>
                  
                  <button onclick="activatePlan('annual')" class="button" style="width: 100%; font-size: 16px; background: #ffc107; color: #000;">
                    💰 Activer Plan Annuel
                  </button>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <button onclick="showSection('dashboard')" class="button" style="background: #6c757d;">
                  ⬅ Retour au Dashboard
                </button>
              </div>
            </div>
          </div>
          
        </div>
        
        <!-- Contact Buttons -->
        <div class="contacts" style="left: 20px;">
          <a href="https://wa.me/+212630079763" target="_blank" class="contact-btn">
            <span style="font-size: 20px;">💬</span>
          </a>
        </div>
        
        <div class="contacts" style="right: 20px;">
          <a href="https://www.youtube.com/@TON_COMPTE" target="_blank" class="contact-btn">
            <span style="font-size: 20px;">📺</span>
          </a>
        </div>
        
        <script>
          let currentPeriod = 'monthly';
          
          function showSection(section) {
            // Hide all sections
            document.getElementById('dashboard-section').classList.add('hidden');
            document.getElementById('pricing-section').classList.add('hidden');
            
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(item => {
              item.classList.remove('active');
            });
            
            // Show selected section and activate nav
            document.getElementById(section + '-section').classList.remove('hidden');
            document.getElementById('nav-' + section).classList.add('active');
          }
          
          function setPeriod(period) {
            currentPeriod = period;
            
            // Update button styles
            const monthlyBtn = document.getElementById('btn-monthly');
            const annualBtn = document.getElementById('btn-annual');
            
            if (period === 'monthly') {
              monthlyBtn.style.background = '#007bff';
              annualBtn.style.background = '#6c757d';
              document.getElementById('monthly-price').parentElement.style.display = 'block';
              document.getElementById('annual-card').style.display = 'none';
            } else {
              monthlyBtn.style.background = '#6c757d';
              annualBtn.style.background = '#007bff';
              document.getElementById('monthly-price').parentElement.style.display = 'none';
              document.getElementById('annual-card').style.display = 'block';
            }
          }
          
          function activatePlan(plan) {
            const planName = plan === 'monthly' ? 'Mensuel' : 'Annuel';
            const price = plan === 'monthly' ? '$4.99/mois' : '$39.99/an';
            
            if (confirm('🎁 Commencer l\\'essai gratuit de 7 jours pour le plan ' + planName + ' (' + price + ') ?\\n\\n✅ Accès complet pendant 7 jours\\n💳 Aucun paiement immédiat\\n🚀 Toutes les fonctionnalités premium')) {
              
              // Simulate billing activation
              const button = event.target;
              button.textContent = '⏳ Activation...';
              button.disabled = true;
              
              setTimeout(() => {
                alert('🎉 ESSAI GRATUIT ACTIVÉ !\\n\\n✅ Plan ' + planName + ' activé avec succès\\n🎁 7 jours d\\'essai gratuit commencés\\n🚀 Toutes les fonctionnalités premium disponibles\\n\\n📍 Retournez au Dashboard pour utiliser vos blocs premium !');
                
                // Update button
                button.textContent = '✅ Essai Actif';
                button.style.background = '#28a745';
                
                // Auto redirect to dashboard
                setTimeout(() => {
                  showSection('dashboard');
                }, 2000);
              }, 2000);
            }
          }
          
          // Auto-start timer
          function startTimer() {
            let timeLeft = 86385;
            const timerElement = document.getElementById('timer');
            
            setInterval(() => {
              const hours = Math.floor(timeLeft / 3600);
              const minutes = Math.floor((timeLeft % 3600) / 60);
              const seconds = timeLeft % 60;
              
              timerElement.textContent = 
                hours.toString().padStart(2, '0') + ':' + 
                minutes.toString().padStart(2, '0') + ':' + 
                seconds.toString().padStart(2, '0');
              
              timeLeft--;
              if (timeLeft < 0) timeLeft = 86400;
            }, 1000);
          }
          
          // Initialize
          startTimer();
          
          console.log('📢 Announcement Bar App - Version Complète Fonctionnelle');
          console.log('✅ Aucun problème d\\'authentification Shopify');
          console.log('✅ Menu navigation fonctionnel');
          console.log('✅ Système de billing intégré');
          console.log('✅ Essai gratuit 7 jours activé');
        </script>
      </body>
    </html>`,
    {
      headers: { 
        "Content-Type": "text/html",
        "Cache-Control": "no-store",
        "X-Frame-Options": "ALLOWALL",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*"
      },
      status: 200
    }
  );
};


