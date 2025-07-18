// app/routes/api/billing/confirm.jsx

import { redirect } from "@remix-run/node";
import { shopify } from "~/shopify.server";

export const loader = async ({ request }) => {
  try {
    // Confirmer l'abonnement après paiement
    await shopify.billing.confirm(request);
    
    // Rediriger vers ton dashboard ou page premium
    return redirect("/premium"); 
  } catch (error) {
    console.error("Erreur de confirmation billing :", error);
    return redirect("/error-billing"); // Crée une page d'erreur si besoin
  }
};

