import { json } from "@remix-run/node";
import { checkBillingStatus } from "../utils/billing-middleware.server";

/**
 * API pour vérifier le statut de facturation en temps réel
 * Cette route permet de savoir si l'utilisateur est toujours en essai gratuit
 * ou si Shopify a automatiquement activé la facturation
 */
export const loader = async ({ request }) => {
  console.log("🔍 API: Vérification du statut de facturation");
  
  try {
    const billingStatus = await checkBillingStatus(request);
    
    console.log("📊 Statut de facturation actuel:", billingStatus);
    
    // Déterminer le message approprié selon le statut
    let message = "";
    let status = "unknown";
    
    if (billingStatus.hasActivePayment) {
      message = "✅ Abonnement Premium actif - Toutes les fonctionnalités disponibles";
      status = "active_subscription";
    } else if (billingStatus.trialDaysRemaining && billingStatus.trialDaysRemaining > 0) {
      message = `🎁 Essai gratuit actif - ${billingStatus.trialDaysRemaining} jour(s) restant(s)`;
      status = "trial_active";
    } else if (billingStatus.trialDaysRemaining === 0) {
      message = "⏰ Essai gratuit expiré - Abonnement requis pour continuer";
      status = "trial_expired";
    } else if (billingStatus.billingRequired) {
      message = "💳 Abonnement requis pour accéder aux fonctionnalités premium";
      status = "billing_required";
    } else {
      message = "ℹ️ Statut de facturation indéterminé";
      status = "unknown";
    }
    
    return json({
      success: true,
      billing: {
        ...billingStatus,
        message,
        status,
        automaticBilling: true, // Shopify gère automatiquement
        trialPeriod: 7 // 7 jours d'essai
      }
    });
    
  } catch (error) {
    console.error("❌ Erreur lors de la vérification du statut:", error);
    
    return json({
      success: false,
      error: error.message,
      billing: {
        hasActivePayment: false,
        billingRequired: true,
        status: "error",
        message: "❌ Impossible de vérifier le statut de facturation"
      }
    }, { status: 500 });
  }
};

/**
 * POST pour forcer une vérification du statut
 */
export const action = async ({ request }) => {
  console.log("🔄 API: Actualisation forcée du statut de facturation");
  return loader({ request });
};

