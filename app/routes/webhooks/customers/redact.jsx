import { verifyWebhookHmac } from "~/utils/verifyWebhook.server";

export const action = async ({ request }) => {
  const { ok, rawBody } = await verifyWebhookHmac(request);
  if (!ok) return new Response("Invalid HMAC", { status: 401 });

  const shop = request.headers.get("x-shopify-shop-domain") || "unknown";
  console.log("[WEBHOOK] customers/redact for", shop, rawBody);

  // TODO: effacer les données client si tu en stockes
  return new Response("OK", { status: 200 });
};

export const loader = () => new Response("Not found", { status: 404 });
