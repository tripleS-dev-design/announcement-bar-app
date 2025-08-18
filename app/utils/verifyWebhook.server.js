// app/utils/verifyWebhook.server.js
import crypto from "crypto";

/**
 * Vérifie la signature HMAC d’un webhook Shopify.
 * @param {string} hmacHeader valeur de l’en-tête `x-shopify-hmac-sha256`
 * @param {string|Buffer} rawBody le corps BRUT du webhook (request.text())
 * @returns {boolean}
 */
export function verifyWebhookHmac(hmacHeader, rawBody) {
  const secret = process.env.SHOPIFY_API_SECRET || process.env.SHOPIFY_API_SECRET_KEY;
  if (!secret) {
    console.error("Missing SHOPIFY_API_SECRET.");
    return false;
  }

  const computed = crypto
    .createHmac("sha256", secret)
    .update(typeof rawBody === "string" ? Buffer.from(rawBody, "utf8") : rawBody)
    .digest("base64");

  // compare en timing-safe
  const a = Buffer.from(computed);
  const b = Buffer.from(hmacHeader || "");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
