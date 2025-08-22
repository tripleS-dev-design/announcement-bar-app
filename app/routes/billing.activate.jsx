// app/routes/billing.activate.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { billing as BILLING_CONFIG } from "../shopify.server";

export const loader = async ({ request }) => {
  const { billing, session } = await authenticate.admin(request);
  const url = new URL(request.url);

  const handle = url.searchParams.get("plan");
  if (!handle) return new Response("Missing plan handle", { status: 400 });
  if (!Object.prototype.hasOwnProperty.call(BILLING_CONFIG, handle)) {
    return new Response("Unknown plan handle", { status: 400 });
  }

  const shop = session?.shop || url.searchParams.get("shop");
  if (!shop) return new Response("Missing shop", { status: 400 });

  const appUrl = process.env.SHOPIFY_APP_URL || process.env.HOST || url.origin;
  const returnUrl = new URL("/billing/confirm", appUrl);
  returnUrl.searchParams.set("shop", shop);

  const isTest = process.env.BILLING_TEST === "1";

  // ⚠️ Le SDK renvoie souvent directement une Response (302 -> /auth/exit-iframe?...).
  const result = await billing.request({
    plan: handle,
    isTest,
    returnUrl: returnUrl.toString(),
  });

  // 👉 Si c'est une Response, on la retourne telle quelle (la redirection se fera correctement)
  if (result instanceof Response) return result;

  // Fallback si une URL de confirmation est renvoyée sous forme d'objet
  const confUrl = result?.confirmationUrl ?? result?.appSubscription?.confirmationUrl;
  if (confUrl) return redirect(confUrl);

  return new Response("Billing: missing confirmation URL", { status: 500 });
};
