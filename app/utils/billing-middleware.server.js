// app/utils/billing.server.js (version neutre, sans facturation réelle)

// Ne touche PAS à Shopify Billing ici, aucune API, aucun appSubscriptionCreate, rien.
export async function checkBillingStatus() {
  return {
    shop: null,
    hasActivePayment: true,       // on considère que c'est toujours OK
    billingRequired: false,
    trialDaysRemaining: null,
    subscriptionStatus: "not_used",
  };
}

// Middleware qui laisse toujours passer (app 100% gratuite)
export async function requireActiveBilling(request, redirectTo = "/") {
  return {
    billingStatus: await checkBillingStatus(),
    access: "granted",
  };
}

// Plus de création de subscription → on ne l'utilise plus
export async function createShopifySubscription() {
  throw new Error("Billing is disabled. The app is now fully free.");
}
