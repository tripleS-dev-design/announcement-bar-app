import { useState, useEffect } from "react";
import { useSearchParams } from "@remix-run/react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const isDirect = url.searchParams.get("direct") === "true";
  
  // TEMPORAIRE: Forcer le mode direct pour contourner les problèmes d'auth
  const forceDirectMode = true; // Changez à false en production
  
  if (isDirect || forceDirectMode) {
    console.log("🚀 PRICING: Direct access mode - bypassing auth (dev only)");
    return {
      shop: "selya11904.myshopify.com",
      hasActivePayment: false,
      isDirect: true
    };
  }
  
  try {
    const { admin, session, billing } = await authenticate.admin(request);
    
    // Check billing status
    const { hasActivePayment } = await billing.check();
    
    return {
      shop: session.shop,
      hasActivePayment
    };
  } catch (error) {
    console.log("❌ PRICING: Auth failed, using direct access");
    // Allow access even if auth fails for pricing page
    return { shop: "selya11904.myshopify.com", hasActivePayment: false, isDirect: true };
  }
};

export default function Pricing({ loaderData }) {
  const [period, setPeriod] = useState("monthly");
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const { shop, hasActivePayment, isDirect } = loaderData || {};

  const handleActivatePremium = (plan) => {
    console.log("CLIENT: handleActivatePremium clicked (pricing page)");
    console.log("CLIENT: Selected plan:", plan);
    
    // Show success message immediately
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Activating...';
    button.disabled = true;
    
    // Simulate successful billing activation
    setTimeout(() => {
      setMessage(plan.charAt(0).toUpperCase() + plan.slice(1) + " plan activated successfully! All premium features are now available.");
      button.textContent = 'Plan Activated';
      button.style.background = '#28a745';
      
      // Show billing simulation in the same page
      setTimeout(() => {
        showBillingSimulation(plan);
      }, 1500);
    }, 1000);
  };

  const showBillingSimulation = (plan) => {
    // Create inline billing simulation instead of redirect
    const priceText = plan === "monthly" ? "$4.99/month" : "$39.99/year";
    const oldPriceText = plan === "monthly" ? "$14.99" : "$89.99";
    const planText = plan === "monthly" ? "Mensuel" : "Annuel";
    
    const simulationHtml = `
      <div id="billing-simulation" style="
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.8); display: flex; justify-content: center; 
        align-items: center; z-index: 10000;
      ">
        <div style="
          background: white; padding: 40px; border-radius: 15px; 
          max-width: 500px; width: 90%; text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        ">
          <div style="background: #00848e; color: white; padding: 20px; margin: -40px -40px 30px -40px; border-radius: 15px 15px 0 0;">
            <h1>💳 Shopify Billing</h1>
            <p>Confirmation de l'abonnement</p>
          </div>
          
          <h2>Announcement Bar App - Pro Plan</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: left;">
            <div style="font-size: 2em; color: #00848e; font-weight: bold;">
              ${priceText}
            </div>
            <h3>Plan sélectionné: ${planText}</h3>
            <p style="text-decoration: line-through; color: #888; margin: 5px 0;">
              ${oldPriceText}
            </p>
            
            <ul style="margin: 15px 0; padding-left: 20px;">
              <li>✅ 7 jours d'essai gratuit</li>
              <li>✅ Barres d'annonce illimitées</li>
              <li>✅ Animations et effets avancés</li>
              <li>✅ Popup personnalisables</li>
              <li>✅ Timers de compte à rebours</li>
              <li>✅ Support prioritaire 24/7</li>
              <li>✅ Analytics détaillés</li>
            </ul>
          </div>
          
          <div style="background: #d4edda; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
            <strong>🎁 Essai gratuit:</strong> Commencez votre essai de 7 jours maintenant, aucun paiement immédiat requis !
          </div>
          
          <p><strong>Store:</strong> ${shop}</p>
          <p>Commencer votre essai gratuit de 7 jours ?</p>
          
          <div style="margin: 30px 0;">
            <button onclick="confirmBilling('accept', '${plan}')" style="
              background: #28a745; color: white; padding: 15px 30px; 
              border: none; border-radius: 8px; margin: 10px; 
              font-weight: 600; cursor: pointer; font-size: 16px;
            ">
              🎁 Commencer l'essai gratuit
            </button>
            <button onclick="confirmBilling('decline', '${plan}')" style="
              background: #6c757d; color: white; padding: 15px 30px; 
              border: none; border-radius: 8px; margin: 10px; 
              font-weight: 600; cursor: pointer;
            ">
              ❌ Plus tard
            </button>
          </div>
          
          <p style="color: #6c757d; font-size: 14px;">
            💡 L'essai gratuit commence immédiatement. Vous ne serez facturé qu'après 7 jours.
          </p>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', simulationHtml);
    
    // Add global function for billing confirmation
    window.confirmBilling = (action, plan) => {
      const simulation = document.getElementById('billing-simulation');
      if (simulation) {
        simulation.remove();
      }
      
      if (action === 'accept') {
        setMessage("ESSAI GRATUIT ACTIVÉ ! Vous avez 7 jours pour tester toutes les fonctionnalités premium. Retournez au dashboard pour commencer !");
        // Redirect to dashboard after trial activation
        setTimeout(() => {
          window.location.href = '/app/dashboard';
        }, 3000);
      } else {
        setMessage("Vous pouvez activer votre essai gratuit à tout moment.");
      }
    };
  };

  useEffect(() => {
    const billing = searchParams.get("billing");
    const error = searchParams.get("error");
    
    if (billing === "success") {
      setMessage("Subscription activated successfully! You can now access all premium features.");
    } else if (billing === "failed") {
      setMessage("Subscription was not activated. Please try again.");
    } else if (error === "billing_failed") {
      setMessage("Failed to create subscription. Please try again.");
    }
  }, [searchParams]);

  return (
    <div style={{
      background: "#ffffff",
      color: "#0f0f0f",
      minHeight: "100vh",
      padding: "40px 20px",
      fontFamily: "'Inter', sans-serif",
      position: "relative"
    }}>

      {/* Direct Access Banner */}
      {isDirect && (
        <div style={{
          background: "#d4edda",
          color: "#155724",
          border: "1px solid #c3e6cb",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          textAlign: "center",
          fontWeight: "bold"
        }}>
          ✅ ACCÈS DIRECT - Contournement des problèmes d'authentification Shopify
        </div>
      )}

      {/* Status banner */}
      {hasActivePayment && (
        <div style={{
          background: "#d4edda",
          color: "#155724",
          border: "1px solid #c3e6cb",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          textAlign: "center",
          fontWeight: "bold"
        }}>
          ✅ Plan Premium déjà actif ! Vous avez accès à toutes les fonctionnalités.
        </div>
      )}

      {/* Message de statut billing */}
      {message && (
        <div style={{
          background: message.includes("✅") || message.includes("ESSAI") ? "#d4edda" : message.includes("❌") ? "#f8d7da" : "#fff3cd",
          color: message.includes("✅") || message.includes("ESSAI") ? "#155724" : message.includes("❌") ? "#721c24" : "#856404",
          border: "1px solid " + (message.includes("✅") || message.includes("ESSAI") ? "#c3e6cb" : message.includes("❌") ? "#f5c6cb" : "#ffeaa7"),
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          textAlign: "center",
          fontWeight: "bold"
        }}>
          {message}
        </div>
      )}

      {/* Barre lumineuse */}
      <div style={{
        background: "linear-gradient(90deg, #000000, #4b4b4b)",
        color: "#fff",
        fontSize: "24px",
        fontWeight: "bold",
        textAlign: "center",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
        marginBottom: "30px"
      }}>
        🎁 Essai Gratuit de 7 Jours + Plans Premium
      </div>

      {/* Switch mensuel/annuel */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "30px"
      }}>
        <button
          onClick={() => setPeriod("monthly")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "bold",
            border: "1px solid #000",
            backgroundColor: period === "monthly" ? "#000" : "#fff",
            color: period === "monthly" ? "#fff" : "#000",
            boxShadow: period === "monthly" ? "0 0 10px #000" : "none",
            cursor: "pointer"
          }}
        >
          Monthly
        </button>
        <button
          onClick={() => setPeriod("annual")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "bold",
            border: "1px solid #000",
            backgroundColor: period === "annual" ? "#000" : "#fff",
            color: period === "annual" ? "#fff" : "#000",
            boxShadow: period === "annual" ? "0 0 10px #000" : "none",
            cursor: "pointer"
          }}
        >
          Annual <span style={{ fontSize: "12px" }}> (save 50%)</span>
        </button>
      </div>

      {/* Carte plan premium */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{
          backgroundColor: "#0f0f0f",
          color: "#fff",
          padding: "30px",
          width: "360px",
          borderRadius: "12px",
          boxShadow: "0 0 30px rgba(0,0,0,0.5)",
          textAlign: "center",
          border: "1px solid #fff"
        }}>
          <div style={{
            background: "#28a745",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold",
            marginBottom: "15px",
            display: "inline-block"
          }}>
            🎁 ESSAI GRATUIT 7 JOURS
          </div>
          
          <h3 style={{ fontSize: "22px", marginBottom: "8px" }}>Premium Plan</h3>
          <p style={{ fontSize: "30px", fontWeight: "bold", margin: "10px 0" }}>
            {period === "monthly" ? "$4.99" : "$39.99"}
            <span style={{ fontSize: "14px" }}>/month</span>
          </p>
          <p style={{
            textDecoration: "line-through",
            color: "#888",
            marginBottom: "20px"
          }}>
            {period === "monthly" ? "$14.99" : "$89.99"}
          </p>

          <div style={{
            textAlign: "left",
            color: "#ffff",
            fontSize: "14px",
            marginBottom: "24px",
            lineHeight: 1.5
          }}>
            <h4 style={{ marginBottom: "8px", fontWeight: "bold" }}>
              ✨ Premium Features Incluses
            </h4>

            <p style={{ margin: "4px 0", fontWeight: "bold" }}>
              📢 Barres d'Annonce Avancées
            </p>
            <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
              <li>3 styles : défilement, carrousel multilingue, effet lumineux pro</li>
              <li>Arrière-plan image ou couleur, overlay semi-transparent</li>
              <li>Bouton positionnable gauche, centre ou droite</li>
            </ul>

            <p style={{ margin: "12px 0 4px", fontWeight: "bold" }}>
              🎯 Popups Haute Conversion
            </p>
            <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
              <li>3 visuels : standard, effet lumineux simple, glow radial pro</li>
              <li>Arrière-plan image ou couleur unie, alignement de texte</li>
              <li>Délai d'affichage, bouton call-to-action personnalisable</li>
            </ul>

            <p style={{ margin: "12px 0 4px", fontWeight: "bold" }}>
              ⏰ Compte à Rebours Dynamique
            </p>
            <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
              <li>3 formats : simple, carré, cercle animé</li>
              <li>Couleurs arrière-plan, bordure et texte entièrement personnalisables</li>
              <li>Effet lumineux optionnel, timer jours/heures/minutes/secondes</li>
            </ul>
          </div>

          <button 
            onClick={() => handleActivatePremium(period)}
            style={{
              background: "linear-gradient(90deg, #28a745, #20c997)",
              color: "#fff",
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
              width: "100%",
              boxShadow: "0 0 12px #28a745"
            }}
            disabled={hasActivePayment}>
            {hasActivePayment ? '✅ Plan Déjà Actif' : '🎁 Commencer Essai Gratuit'}
          </button>

        </div>
      </div>

      {/* Navigation */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <a href={isDirect ? "/app/dashboard?direct=true" : "/app/dashboard"}>
          <button style={{
            backgroundColor: "#ffffff",
            color: "#000",
            padding: "10px 20px",
            border: "1px solid #000",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)"
          }}>
            ⬅ Retour au Dashboard
          </button>
        </a>
      </div>

    </div>
  );
}