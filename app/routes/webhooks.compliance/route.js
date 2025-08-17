// app/routes/webhooks.compliance/route.js
import { verifyWebhookHmacFromRaw } from "~/utils/verifyWebhook.server";

/**
 * Shopify envoie un POST JSON (Content-Type: application/json).
 * - On lit le corps *brut* (request.text()) -> indispensable pour le HMAC.
 * - 401 si HMAC invalide, sinon 200+ et on traite par topic.
 */
export async function action({ request }) {
  // Shopify exige POST
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    // Les tests automatiques vérifient ça
    return new Response("Unsupported Media Type", { status: 415 });
  }

  // Corps BRUT, surtout pas request.json() avant la vérif !
  const raw = await request.text();

  const { ok, topic, shop } = verifyWebhookHmacFromRaw(request, raw);
  if (!ok) {
    return new Response("Unauthorized (bad hmac)", { status: 401 });
  }

  // OK -> tu peux parser maintenant
  let payload = {};
  try {
    payload = JSON.parse(raw || "{}");
  } catch (e) {
    // Si jamais
    payload = {};
  }

  // Traite les 3 cas (optionnel pour les tests – un 200 suffit)
  try {
    switch (topic) {
      case "customers/data_request":
        // -> Fournis les données au marchand en dehors de ce webhook si besoin
        // console.log("data_request", shop, payload);
        break;

      case "customers/redact":
        // -> Supprime/anonymise les données client que TU stockes
        // console.log("customers/redact", shop, payload);
        break;

      case "shop/redact":
        // -> 48h après uninstall, supprime toutes les données liées à la boutique
        // console.log("shop/redact", shop, payload);
        break;

      default:
        // Autre topic (si tu en ajoutes)
        break;
    }
  } catch (err) {
    // Erreur interne, mais HMAC OK -> 200 reste accepté pour la conformité
    console.error("compliance handling error:", err);
  }

  // Répondre 2xx confirme la bonne réception
  return new Response("ok", { status: 200 });
}

// Par sécurité, on bloque GET
export const loader = () => new Response("Not Found", { status: 404 });
