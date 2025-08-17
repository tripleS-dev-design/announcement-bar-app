import { verifyWebhookHmac } from "~/utils/verifyWebhook.server";

export const action = async ({ request }) => {
  const { ok, rawBody } = await verifyWebhookHmac(request);
  if (!ok) return new Response("Invalid HMAC", { status: 401 });

  const shop = request.headers.get("x-shopify-shop-domain") || "unknown";
  console.log("[WEBHOOK] shop/redact for", shop, rawBody);

  // TODO: effacer toutes les données du shop si tu en stockes
  return new Response("OK", { status: 200 });
};

export const loader = () => new Response("Not found", { status: 404 });
