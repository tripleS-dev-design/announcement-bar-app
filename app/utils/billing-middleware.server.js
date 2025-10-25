// Middleware de vérification de facturation automatique
import { authenticate } from "../shopify.server";

/**
 * Vérification automatique du statut de facturation
 * Shopify gère automatiquement la transition après 7 jours d'essai
 */
export async function checkBillingStatus(request) {
  try {
    console.log("🔍 Vérification du statut de facturation...");
    
    const { admin, session, billing } = await authenticate.admin(request);
    
    // Utiliser la méthode billing.check() de Shopify qui gère automatiquement
    // - L'essai gratuit de 7 jours
    // - La transition automatique vers le paiement
    // - Le statut de l'abonnement
    const billingStatus = await billing.check();
    
    console.log("💳 Statut de facturation:", billingStatus);
    
    return {
      shop: session.shop,
      hasActivePayment: billingStatus.hasActivePayment,
      billingRequired: billingStatus.billingRequired,
      trialDaysRemaining: billingStatus.trialDaysRemaining || null,
      subscriptionStatus: billingStatus.subscriptionStatus || "unknown"
    };
    
  } catch (error) {
    console.error("❌ Erreur lors de la vérification de facturation:", error);
    return {
      shop: null,
      hasActivePayment: false,
      billingRequired: true,
      trialDaysRemaining: null,
      subscriptionStatus: "error",
      error: error.message
    };
  }
}

/**
 * Middleware pour protéger les routes qui nécessitent un abonnement actif
 */
export async function requireActiveBilling(request, redirectTo = "/app/pricing") {
  console.log("🔒 BILLING MIDDLEWARE: Début de la vérification obligatoire");
  
  try {
    const billingStatus = await checkBillingStatus(request);
    console.log("📊 BILLING MIDDLEWARE: Statut obtenu:", billingStatus);
    
    // SIMULATION MODE DÉVELOPPEMENT: Forcer le comportement pour un nouveau client
    // En production, ceci utiliserait les vraies données Shopify
    const isNewClient = !billingStatus.hasActivePayment && !billingStatus.trialDaysRemaining;
    
    if (isNewClient) {
      console.log("🆕 BILLING MIDDLEWARE: Nouveau client détecté - doit choisir un plan");
      return { 
        billingStatus: {
          ...billingStatus,
          hasActivePayment: false,
          trialDaysRemaining: 0,
          subscriptionStatus: "none",
          message: "Nouveau client - doit choisir un plan"
        }, 
        access: "denied", 
        redirectTo 
      };
    }
    
    // Si l'utilisateur a un paiement actif OU est encore en période d'essai, autoriser l'accès
    if (billingStatus.hasActivePayment || (billingStatus.trialDaysRemaining && billingStatus.trialDaysRemaining > 0)) {
      console.log("✅ BILLING MIDDLEWARE: Accès autorisé");
      return { billingStatus, access: "granted" };
    }
    
    // Sinon, rediriger vers la page de facturation
    console.log("🚫 BILLING MIDDLEWARE: Accès refusé - facturation requise");
    return { billingStatus, access: "denied", redirectTo };
    
  } catch (error) {
    console.error("❌ BILLING MIDDLEWARE: Erreur grave:", error);
    // En cas d'erreur, on force la redirection vers pricing pour sécurité
    return { 
      billingStatus: {
        shop: null,
        hasActivePayment: false,
        trialDaysRemaining: 0,
        subscriptionStatus: "error",
        message: "Erreur de vérification - accès refusé par sécurité"
      }, 
      access: "denied", 
      redirectTo 
    };
  }
}

/**
 * Créer une subscription Shopify avec essai gratuit de 7 jours
 */
export async function createShopifySubscription(request, plan = "monthly") {
  try {
    console.log("💳 Création d'abonnement Shopify pour le plan:", plan);
    
    const { admin, session } = await authenticate.admin(request);
    
    const mutation = `
      mutation appSubscriptionCreate($name: String!, $returnUrl: URL!, $test: Boolean, $lineItems: [AppSubscriptionLineItemInput!]!) {
        appSubscriptionCreate(name: $name, returnUrl: $returnUrl, test: $test, lineItems: $lineItems) {
          userErrors {
            field
            message
          }
          confirmationUrl
          appSubscription {
            id
            status
            trialDays
            currentPeriodEnd
          }
        }
      }
    `;
    
    const variables = {
      name: plan === "monthly" ? "Announcement Bar Pro - Mensuel" : "Announcement Bar Pro - Annuel",
      returnUrl: `${process.env.SHOPIFY_APP_URL}/api/billing/request/confirm`,
      test: process.env.NODE_ENV !== "production", // Test mode en développement
      lineItems: [
        {
          plan: {
            appRecurringPricingDetails: {
              price: { 
                amount: plan === "monthly" ? 4.99 : 39.99, 
                currencyCode: "USD" 
              },
              interval: plan === "monthly" ? "EVERY_30_DAYS" : "ANNUAL",
              trialDays: 7 // 7 jours d'essai gratuit
            }
          }
        }
      ]
    };
    
    console.log("📝 Variables de l'abonnement:", variables);
    
    const response = await admin.graphql(mutation, { variables });
    const responseJson = await response.json();
    
    console.log("📊 Réponse Shopify:", responseJson);
    
    if (responseJson.data?.appSubscriptionCreate?.userErrors?.length > 0) {
      throw new Error(`Erreurs Shopify: ${JSON.stringify(responseJson.data.appSubscriptionCreate.userErrors)}`);
    }
    
    const subscription = responseJson.data?.appSubscriptionCreate?.appSubscription;
    const confirmationUrl = responseJson.data?.appSubscriptionCreate?.confirmationUrl;
    
    if (!confirmationUrl) {
      throw new Error("Aucune URL de confirmation reçue de Shopify");
    }
    
    console.log("✅ Abonnement créé avec succès!");
    console.log("🔗 URL de confirmation:", confirmationUrl);
    console.log("📋 Abonnement ID:", subscription?.id);
    console.log("⏰ Essai gratuit:", subscription?.trialDays, "jours");
    
    return {
      success: true,
      confirmationUrl,
      subscription,
      trialDays: 7
    };
    
  } catch (error) {
    console.error("❌ Erreur lors de la création d'abonnement:", error);
    throw error;
  }
}
