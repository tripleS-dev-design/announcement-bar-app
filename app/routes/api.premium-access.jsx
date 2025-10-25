import { json, redirect } from "@remix-run/node";
import { requireActiveBilling } from "../utils/billing-middleware.server";

/**
 * Route de vérification d'accès pour les fonctionnalités premium
 * Avant de donner accès aux blocs premium, on vérifie le statut de paiement
 */
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const blockId = url.searchParams.get("blockId");
  const shop = url.searchParams.get("shop");
  
  console.log("🔐 PREMIUM ACCESS: Vérification d'accès pour le bloc:", blockId);
  
  try {
    // Vérifier si l'utilisateur a accès aux fonctionnalités premium
    const billingCheck = await requireActiveBilling(request, "/app/pricing");
    
    console.log("💳 PREMIUM ACCESS: Statut de facturation:", billingCheck.billingStatus);
    
    if (billingCheck.access === "denied") {
      console.log("🚫 PREMIUM ACCESS: Accès refusé pour le bloc:", blockId);
      
      return json({
        success: false,
        access: "denied",
        message: "Abonnement premium requis ou essai gratuit expiré",
        redirectTo: "/app/pricing?billing=required&block=" + blockId,
        trialDaysRemaining: billingCheck.billingStatus.trialDaysRemaining || 0,
        hasActivePayment: billingCheck.billingStatus.hasActivePayment
      }, { status: 403 });
    }
    
    // Accès accordé - construire l'URL de l'éditeur de thème
    const baseShop = shop || billingCheck.billingStatus.shop || "selya11904";
    const themeEditorUrl = `https://${baseShop}.myshopify.com/admin/themes/current/editor?context=apps&addAppBlockId=be79dab79ff6bb4be47d4e66577b6c50/${blockId}`;
    
    console.log("✅ PREMIUM ACCESS: Accès accordé pour le bloc:", blockId);
    console.log("🔗 PREMIUM ACCESS: Redirection vers:", themeEditorUrl);
    
    return json({
      success: true,
      access: "granted",
      themeEditorUrl,
      message: billingCheck.billingStatus.hasActivePayment 
        ? "Accès Premium confirmé" 
        : `Accès essai gratuit (${billingCheck.billingStatus.trialDaysRemaining || 0} jour(s) restant(s))`,
      billingStatus: billingCheck.billingStatus
    });
    
  } catch (error) {
    console.error("❌ PREMIUM ACCESS: Erreur de vérification:", error);
    
    return json({
      success: false,
      access: "error",
      message: "Erreur lors de la vérification de l'accès premium",
      redirectTo: "/app/pricing?error=access_check_failed",
      error: error.message
    }, { status: 500 });
  }
};

/**
 * POST pour déclencher la vérification d'accès
 */
export const action = async ({ request }) => {
  console.log("🔐 PREMIUM ACCESS: Action POST pour vérification d'accès");
  return loader({ request });
};

