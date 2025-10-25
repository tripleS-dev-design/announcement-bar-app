import { json } from "@remix-run/node";

/**
 * Route de test pour simuler un client qui a activé son essai gratuit
 */
export const loader = async ({ request }) => {
  return {
    shop: "test-shop.myshopify.com",
    hasActivePayment: false, // Pas encore de paiement
    trialDaysLeft: 5, // 5 jours d'essai restants
    subscriptionStatus: "trial_active",
    billingMessage: "Essai gratuit actif - 5 jours restants",
    isDirect: false,
    testMode: true
  };
};

export default function TestEssaiActif({ loaderData }) {
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
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#f8f9fa",
        padding: "40px",
        borderRadius: "12px",
        border: "2px solid #dee2e6"
      }}>
        <h1 style={{ color: "#28a745", marginBottom: "20px" }}>
          🎁 Mode Test : Client avec Essai Actif
        </h1>
        
        <div style={{
          backgroundColor: "#d4edda",
          color: "#155724",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          border: "1px solid #c3e6cb"
        }}>
          <h2>✅ Essai Gratuit Actif</h2>
          <p><strong>Shop:</strong> {shop}</p>
          <p><strong>Paiement Actif:</strong> {hasActivePayment ? "✅ Oui" : "🎁 Essai en cours"}</p>
          <p><strong>Jours d'Essai Restants:</strong> {trialDaysLeft}</p>
          <p><strong>Statut:</strong> {subscriptionStatus}</p>
          <p><strong>Message:</strong> {billingMessage}</p>
        </div>

        <div style={{
          backgroundColor: "#d1ecf1",
          color: "#0c5460",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          border: "1px solid #bee5eb"
        }}>
          <h3>📋 Ce qui se passe maintenant :</h3>
          <ul style={{ textAlign: "left", margin: "15px 0" }}>
            <li>✅ <strong>Route principale (/app):</strong> Accès autorisé</li>
            <li>✅ <strong>Dashboard (/app/dashboard):</strong> Accès complet</li>
            <li>✅ <strong>Blocs premium:</strong> Boutons "Add Premium Block"</li>
            <li>✅ <strong>Accès éditeur de thème:</strong> Autorisé</li>
            <li>✅ <strong>API premium:</strong> Retourne 200 OK</li>
            <li>🎁 <strong>Message:</strong> "Accès essai (5j restants)"</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: "#fff3cd",
          color: "#856404",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          border: "1px solid #ffeaa7"
        }}>
          <h3>⏰ Dans 5 jours, Shopify va :</h3>
          <ul style={{ textAlign: "left", margin: "15px 0" }}>
            <li>🔔 Envoyer une notification de fin d'essai</li>
            <li>💳 Proposer le paiement automatiquement</li>
            <li>✅ Si accepté → Facturation mensuelle</li>
            <li>❌ Si refusé → Blocage des fonctionnalités</li>
          </ul>
        </div>

        <div style={{ marginTop: "40px" }}>
          <h3>🧪 Tester l'Accès</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            <a href="/app" style={{ textDecoration: "none" }}>
              <button style={{
                backgroundColor: "#28a745",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}>
                ✅ Test Route Principale
              </button>
            </a>
            
            <a href="/app/dashboard" style={{ textDecoration: "none" }}>
              <button style={{
                backgroundColor: "#28a745",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}>
                ✅ Test Dashboard
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
                🚫 Test Sans Paiement
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

