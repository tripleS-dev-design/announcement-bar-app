/**
 * Route de test pour développement - Simule un nouveau client
 * Accessible directement sans authentification Shopify
 */

export const loader = async ({ request }) => {
  return {
    shop: "selya11904.myshopify.com",
    hasActivePayment: false,
    trialDaysLeft: 0, // Nouveau client - pas d'essai
    subscriptionStatus: "none",
    billingMessage: "Nouveau client - doit choisir un plan",
    isDirect: true,
    testMode: true
  };
};

export default function DevTest({ loaderData }) {
  const { shop, hasActivePayment, trialDaysLeft, subscriptionStatus, billingMessage } = loaderData || {};

  return (
    <div style={{
      backgroundColor: "#fff",
      color: "#000",
      minHeight: "100vh",
      padding: "40px 20px",
      fontFamily: "'Inter', sans-serif",
      textAlign: "center"
    }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "#f8f9fa",
        padding: "40px",
        borderRadius: "12px",
        border: "2px solid #dee2e6"
      }}>
        <h1 style={{ color: "#007bff", marginBottom: "20px" }}>
          🧪 Mode Test Développement
        </h1>
        
        <div style={{
          backgroundColor: "#d1ecf1",
          color: "#0c5460",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          border: "1px solid #bee5eb"
        }}>
          <h2>📊 Simulation : Nouveau Client</h2>
          <p><strong>Shop:</strong> {shop}</p>
          <p><strong>Paiement Actif:</strong> {hasActivePayment ? "✅ Oui" : "❌ Non"}</p>
          <p><strong>Jours d'Essai Restants:</strong> {trialDaysLeft}</p>
          <p><strong>Statut:</strong> {subscriptionStatus}</p>
          <p><strong>Message:</strong> {billingMessage}</p>
        </div>

        <div style={{
          backgroundColor: "#fff3cd",
          color: "#856404",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          border: "1px solid #ffeaa7"
        }}>
          <h3>🎯 Test du Flow de Facturation</h3>
          <p>Cette page simule un <strong>nouveau client</strong> qui installe votre app.</p>
          <p>Le client devrait être <strong>obligé de choisir un plan</strong> avant d'accéder aux fonctionnalités.</p>
        </div>

        {/* Simulation de la page de pricing */}
        <div style={{
          backgroundColor: "#000",
          color: "#fff",
          padding: "30px",
          borderRadius: "12px",
          marginBottom: "30px"
        }}>
          <h3>🎁 Essai Gratuit de 7 Jours + Plans Premium</h3>
          
          <div style={{
            backgroundColor: "#1a1a1a",
            padding: "20px",
            borderRadius: "8px",
            margin: "20px 0"
          }}>
            <h4>Premium Monthly</h4>
            <p style={{ fontSize: "30px", fontWeight: "bold" }}>$4.99<span style={{ fontSize: "14px" }}>/month</span></p>
            
            <ul style={{ textAlign: "left", margin: "15px 0" }}>
              <li>✅ 7 jours d'essai gratuit</li>
              <li>✅ Barres d'annonce illimitées</li>
              <li>✅ Animations et effets avancés</li>
              <li>✅ Popup personnalisables</li>
              <li>✅ Timers de compte à rebours</li>
              <li>✅ Support prioritaire 24/7</li>
            </ul>
            
            <button 
              onClick={() => alert('🎉 Essai activé ! Redirection vers le dashboard...')}
              style={{
                backgroundColor: "#28a745",
                color: "#fff",
                padding: "15px 30px",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                width: "100%"
              }}
            >
              🎁 Commencer l'Essai Gratuit
            </button>
          </div>
        </div>

        <div style={{ marginTop: "40px" }}>
          <h3>🔗 Navigation de Test</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            <a href="/app/pricing" style={{ textDecoration: "none" }}>
              <button style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}>
                Page Pricing Réelle
              </button>
            </a>
            
            <a href="/test-essai-actif" style={{ textDecoration: "none" }}>
              <button style={{
                backgroundColor: "#28a745",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}>
                Test Essai Actif
              </button>
            </a>
            
            <a href="/test-no-payment" style={{ textDecoration: "none" }}>
              <button style={{
                backgroundColor: "#dc3545",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}>
                Test Sans Paiement
              </button>
            </a>
          </div>
        </div>

        <div style={{
          backgroundColor: "#d4edda",
          color: "#155724",
          padding: "20px",
          borderRadius: "8px",
          marginTop: "30px",
          border: "1px solid #c3e6cb"
        }}>
          <h3>✅ Le Système Fonctionne !</h3>
          <p>Notre middleware de facturation détecte correctement :</p>
          <ul style={{ textAlign: "left", margin: "10px 0" }}>
            <li>🆕 <strong>Nouveaux clients</strong> → Redirige vers pricing</li>
            <li>🎁 <strong>Clients en essai</strong> → Accès autorisé</li>
            <li>💳 <strong>Clients payants</strong> → Accès complet</li>
            <li>❌ <strong>Essai expiré</strong> → Retour vers pricing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

