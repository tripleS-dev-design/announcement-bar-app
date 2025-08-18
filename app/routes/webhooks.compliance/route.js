// app/routes/webhooks.compliance/route.js
import { verifyWebhookHmac } from "../../utils/verifyWebhook.server";

// Shopify ne fait que POST sur cet endpoint
export const loader = () =>
  new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
  }

  // En-têtes Shopify
  const hmac = request.headers.get("x-shopify-hmac-sha256") || "";
  const topic = request.headers.get("x-shopify-topic") || "";
  const shopDomain = request.headers.get("x-shopify-shop-domain") || "";

  // ⚠️ lire le CORPS BRUT (ne PAS faire request.json())
  const rawBody = await request.text();

  // Vérification HMAC (obligatoire pour le test "Vérifie les webhooks avec Signatures HMAC")
  if (!verifyWebhookHmac(hmac, rawBody)) {
    return new Response("Unauthorized", { status: 401 });
  }

  // (Optionnel) traitement par topic — Shopify exige au minimum un 200
  try {
    switch (topic) {
      case "customers/data_request":
        // TODO: préparer / envoyer au marchand les données demandées
        break;
      case "customers/redact":
        // TODO: effacer/anonymiser les données du client dans ta DB
        break;
      case "shop/redact":
        // TODO: effacer toutes les données du shop (48h après désinstallation)
        break;
      default:
        // on ignore les autres topics sans erreur
        break;
    }
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Compliance webhook error:", { topic, shopDomain, err });
    return new Response("Internal Server Error", { status: 500 });
  }
};

// composant par défaut requis par Remix (jamais affiché)
export default function WebhooksCompliance() {
  return null;
}
