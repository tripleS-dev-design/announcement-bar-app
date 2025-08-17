// app/routes/webhooks/app/uninstalled.jsx
import crypto from "crypto";

/**
 * Vérifie la signature HMAC du webhook Shopify.
 * Shopify signe le body brut (string) avec SHOPIFY_API_SECRET
 * et envoie la signature dans le header: x-shopify-hmac-sha256
 */
async function verifyWebhookHmac(request) {
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
  if (!hmacHeader) return false;

  // IMPORTANT : récupérer le body en texte brut AVANT de le parser
  const rawBody = await request.text();

  const digest = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
    .update(rawBody, "utf8")
    .digest("base64");

  // On doit renvoyer le body au routeur si tu veux le reconsommer ensuite.
  // Ici on n’en a pas besoin, donc on s’arrête là.
  return digest === hmacHeader;
}

/**
 * Shopify appelle cette route à la désinstallation de l'app
 * URI configurée dans shopify.app.toml => /webhooks/app/uninstalled
 */
export const action = async ({ request }) => {
  // 1) Vérif HMAC
  const ok = await verifyWebhookHmac(request);
  if (!ok) {
    return new Response("Invalid HMAC", { status: 401 });
  }

  // 2) Récupérer quelques headers utiles
  const shop = request.headers.get("x-shopify-shop-domain") || "unknown";
  const topic = request.headers.get("x-shopify-topic") || "";

  // 3) Traiter l’événement
  //    Ici, tu peux supprimer les données liées à ce shop de ta base.
  //    Exemple pseudo-code Prisma (si tu stockes des préférences par shop) :
  //
  // import prisma from "~/db.server";
  // await prisma.announcementSettings.deleteMany({ where: { shop } });
  //
  // Et si tu stockes des sessions custom, idem.

  console.log(`[WEBHOOK] ${topic} reçu pour ${shop}. Suppression des données…`);
  // TODO: supprimer les données du shop dans ta DB si tu en conserves.

  // 4) Répondre 200 OK
  return new Response("OK", { status: 200 });
};

// Shopify envoie ses webhooks en POST
export const loader = () => new Response("Not found", { status: 404 });
