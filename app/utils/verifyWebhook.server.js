// app/utils/verifyWebhook.server.js
import crypto from "crypto";

/**
 * Vérifie la signature HMAC Shopify.
 * @param {string} hmacHeader    Valeur de l'en-tête 'X-Shopify-Hmac-Sha256'
 * @param {string} rawBody       Corps brut (string) de la requête
 * @param {string} secret        Clé secrète de l'app (SHOPIFY_API_SECRET)
 * @returns {boolean}
 */
export function verifyWebhookHmac(hmacHeader, rawBody, secret = process.env.SHOPIFY_API_SECRET) {
  if (!hmacHeader || !rawBody || !secret) return false;

  const computed = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");

  // comparaison sûre
  const safeA = Buffer.from(computed);
  const safeB = Buffer.from(hmacHeader);

  return safeA.length === safeB.length && crypto.timingSafeEqual(safeA, safeB);
}
