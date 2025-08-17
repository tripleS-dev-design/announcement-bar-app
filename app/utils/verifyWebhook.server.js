// app/utils/verifyWebhook.server.js
import crypto from "crypto";

/**
 * Vérifie la signature HMAC Shopify à partir du corps *brut*.
 * - 401 requis si invalide.
 */
export function verifyWebhookHmacFromRaw(request, rawBody) {
  const secret = process.env.SHOPIFY_API_SECRET || "";
  const theirHmac = request.headers.get("x-shopify-hmac-sha256") || "";

  const ourHmac = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("base64");

  const ok =
    theirHmac.length > 0 &&
    crypto.timingSafeEqual(Buffer.from(ourHmac, "utf8"), Buffer.from(theirHmac, "utf8"));

  return {
    ok,
    topic: request.headers.get("x-shopify-topic") || "",
    shop: request.headers.get("x-shopify-shop-domain") || "",
  };
}
