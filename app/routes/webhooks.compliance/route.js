// app/routes/webhooks.compliance/route.js
import { verifyWebhookHmac } from "../../utils/verifyWebhook.server";

export const loader = () =>
  // on refuse les GET (Shopify enverra des POST)
  new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
  }

  // Shopify envoie ces en-têtes
  const hmac = request.headers.get("x-shopify-hmac-sha256") || "";
  const topic = request.headers.get("x-shopify-topic") || "";
  const shopDomain = request.headers.get("x-shopify-shop-domain") || "";

  // ⚠️ Lire le corps BRUT (string). Ne pas faire request.json() ici.
  const rawBody = await request.text();

  // Vérification HMAC obligatoire
  const valid = verifyWebhookHmac(hmac, rawBody);
  if (!valid) {
    return new Response("Unauthorized", { status: 401 });
  }

  // (Optionnel) Traiter selon le topic — exige au minimum 200
  try {
    switch (topic) {
      case "customers/data_request":
        // TODO: Récupérer les données client et les fournir au marchand si nécessaire
        break;

      case "customers/redact":
        // TODO: Effacer/anonymiser les données client dans ta base
        break;

      case "shop/redact":
        // TODO: 48h après désinstallation, effacer les données du shop dans ta base
        break;

      default:
        // Autres topics ignorés sans erreur
        break;
    }

    // Important: répondre 200 à Shopify
    return new Response("OK", { status: 200 });
  } catch (e) {
    // En cas d'erreur interne, renvoyer 500
    console.error("Compliance webhook error:", e);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export default function WebhooksCompliance() {
  // Remix exige un composant par défaut pour les routes (même s'il ne s'affiche jamais ici)
  return null;
}
