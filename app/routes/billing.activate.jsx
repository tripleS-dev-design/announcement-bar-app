// app/routes/billing.activate.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

// Conversion handle -> nom EXACT du plan dans shopify.server.js
const HANDLE_TO_PLAN = {
  "premium-monthly": "Premium Monthly",
  "premium-annual":  "Premium Annual",
};

export const loader = async ({ request }) => {
  try {
    const { billing, session } = await authenticate.admin(request);
    const url = new URL(request.url);

    // 1) Handle -> Nom de plan
    const handle = url.searchParams.get("plan");           // ex: premium-monthly
    const planName = HANDLE_TO_PLAN[handle];
    if (!planName) {
      console.error("Unknown plan handle:", handle);
      return new Response("Unknown plan handle", { status: 400 });
    }

    // 2) Shop (depuis la session; fallback sur le query param)
    const shop = session?.shop || url.searchParams.get("shop");
    if (!shop) {
      console.error("Missing shop in session and query");
      return new Response("Missing shop", { status: 400 });
    }

    // 3) URL de retour après acceptation
    const returnUrl = new URL("/billing/confirm", url.origin);
    returnUrl.searchParams.set("shop", shop);

    // 4) En dev store on garde isTest=true
    const isTest = true;

    console.log("Requesting billing", { shop, planName, isTest, returnUrl: returnUrl.toString() });

    const result = await billing.request({
      plan: planName,
      isTest,
      returnUrl: returnUrl.toString(),
    });

    const confUrl = result?.appSubscription?.confirmationUrl;
    if (!confUrl) {
      console.error("No confirmationUrl in billing.request result:", result);
      return new Response("Billing: missing confirmation URL", { status: 500 });
    }

    return redirect(confUrl);
  } catch (err) {
    console.error("billing.activate error:", err);
    // Évite une page blanche 500, renvoie un message explicite
    return new Response("Billing activation failed", { status: 500 });
  }
};
