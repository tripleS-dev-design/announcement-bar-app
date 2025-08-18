// app/routes/webhooks.compliance.jsx
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  // Vérifie automatiquement la signature HMAC et parse le webhook
  const { topic, shop, body } = await authenticate.webhook(request);

  // Log utile pour voir ce qui arrive
  console.log("✅ Compliance webhook reçu", { shop, topic, body });

  // Router selon le topic (facultatif pour les tests Shopify)
  switch (topic) {
    case "customers/data_request":
      // TODO: fournir les données demandées au marchand si nécessaire
      break;

    case "customers/redact":
      // TODO: effacer/anonymiser les données client
      break;

    case "shop/redact":
      // TODO: effacer les données liées au shop (48h après désinstallation)
      break;

    default:
      // autres topics ignorés sans erreur
      break;
  }

  // Répondre 200 pour confirmer la réception
  return json({ ok: true });
};

export const loader = () =>
  new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });

export default function WebhooksCompliance() {
  return null;
}
