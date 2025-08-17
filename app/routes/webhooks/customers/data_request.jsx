import { verifyWebhookHmac } from "~/utils/verifyWebhook.server";

export const action = async ({ request }) => {
  const { ok, rawBody } = await verifyWebhookHmac(request);
  if (!ok) return new Response("Invalid HMAC", { status: 401 });

  // Optionnel: traiter la demande (ex: log)
  const shop = request.headers.get("x-shopify-shop-domain") || "unknown";
  console.log("[WEBHOOK] customers/data_request for", shop, rawBody);

  return new Response("OK", { status: 200 });
};

export const loader = () => new Response("Not found", { status: 404 });
