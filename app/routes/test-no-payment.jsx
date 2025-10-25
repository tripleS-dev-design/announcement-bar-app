import { json } from "@remix-run/node";

/**
 * Route de test pour simuler un client sans paiement ni essai
 * Cette route simule ce qui se passe quand l'essai expire
 */
export const loader = async ({ request }) => {
  return {
    shop: "test-shop.myshopify.com",
    hasActivePayment: false,
    trialDaysLeft: 0, // Essai expiré
    subscriptionStatus: "expired",
    billingMessage: "Essai gratuit expiré - Abonnement requis",
    isDirect: false,
    testMode: true
  };
};

export default function TestNoPayment({ loaderData }) {
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
        <h1 style={{ color: "#dc3545", marginBottom: "20px" }}>
          🚫 Mode Test : Client Sans Paiement
        </h1>
        
        <div style={{
          backgroundColor: "#f8d7da",
          color: "#721c24",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          border: "1px solid #f5c6cb"
        }}>
          <h2>⏰ Essai Gratuit Expiré</h2>
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
          <h3>📋 Ce qui se passe quand un client n'a pas payé :</h3>
          <ul style={{ textAlign: "left", margin: "15px 0" }}>
            <li>✅ <strong>Route principale (/app):</strong> Redirige vers /app/pricing</li>
            <li>✅ <strong>Dashboard (/app/dashboard):</strong> Redirige vers /app/pricing</li>
            <li>✅ <strong>Blocs premium:</strong> Boutons "🔒 Abonnement Requis"</li>
            <li>✅ <strong>Accès éditeur de thème:</strong> Bloqué</li>
            <li>✅ <strong>API premium:</strong> Retourne 403 Forbidden</li>
          </ul>
        </div>

        <div style={{
          backgroundColor: "#d4edda",
          color: "#155724",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          border: "1px solid #c3e6cb"
        }}>
          <h3>💡 Shopify gère automatiquement :</h3>
          <ul style={{ textAlign: "left", margin: "15px 0" }}>
            <li>🔔 Notifications de fin d'essai</li>
            <li>💳 Propositions de paiement</li>
            <li>🔄 Renouvellements automatiques</li>
            <li>📊 Rapports de facturation</li>
            <li>💰 Gestion des impayés</li>
          </ul>
        </div>

        <div style={{ marginTop: "40px" }}>
          <h3>🧪 Tester les Redirections</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            <a href="/app" style={{ textDecoration: "none" }}>
              <button style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}>
                Test Route Principale
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
                Test Dashboard
              </button>
            </a>
            
            <a href="/app/pricing" style={{ textDecoration: "none" }}>
              <button style={{
                backgroundColor: "#ff6b35",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}>
                Page Pricing
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

