// app/routes/billing.activate.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

// Map handle -> nom EXACT du plan déclaré dans `billing` (shopify.server.js)
const HANDLE_TO_PLAN = {
  "premium-monthly": "Premium Monthly",
  "premium-annual":  "Premium Annual",
};

export const loader = async ({ request }) => {
  const { billing, session } = await authenticate.admin(request);

  const url = new URL(request.url);
  const handle = url.searchParams.get("plan"); // ex: "premium-monthly"

  const planName = HANDLE_TO_PLAN[handle];
  if (!planName) {
    return new Response("Unknown plan handle", { status: 400 });
  }

  // URL où Shopify doit te renvoyer après acceptation (pense à la créer aussi)
  const returnUrl = new URL("/billing/confirm", url.origin);
  returnUrl.searchParams.set("shop", session.shop);

  // Dev store => TRUE, en prod tu mettras false
  const isTest = true;

  // Demande d’activation auprès de Shopify
  const result = await billing.request({
    plan: planName,         // <-- "Premium Monthly" ou "Premium Annual"
    isTest,                 // dev = true
    returnUrl: returnUrl.toString(),
  });

  // Redirection vers l’écran d’acceptation de Shopify
  if (result.appSubscription?.confirmationUrl) {
    return redirect(result.appSubscription.confirmationUrl);
  }

  // Fallback
  return redirect("/settings");
};
