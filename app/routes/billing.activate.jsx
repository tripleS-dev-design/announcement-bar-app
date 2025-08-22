// app/routes/billing.activate.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { billing as BILLING_CONFIG } from "../shopify.server"; // pour valider le plan
// Si tu préfères, tu peux aussi importer PLAN_HANDLES et vérifier dessus.

export const loader = async ({ request }) => {
  try {
    const { billing, session } = await authenticate.admin(request);
    const url = new URL(request.url);

    // 1) Handle fourni par l’UI (premium-monthly | premium-annual)
    const handle = url.searchParams.get("plan"); // ex: "premium-monthly"
    if (!handle) return new Response("Missing plan handle", { status: 400 });

    // ✅ Valide que le handle existe bien dans ta config billing
    if (!Object.prototype.hasOwnProperty.call(BILLING_CONFIG, handle)) {
      console.error("Unknown plan handle:", handle);
      return new Response("Unknown plan handle", { status: 400 });
    }

    // 2) Shop (depuis la session; fallback sur le query param)
    const shop = session?.shop || url.searchParams.get("shop");
    if (!shop) {
      console.error("Missing shop in session and query");
      return new Response("Missing shop", { status: 400 });
    }

    // 3) URL de retour après acceptation (utilise l’URL d’app depuis l’ENV)
    const appUrl = process.env.SHOPIFY_APP_URL || process.env.HOST;
    if (!appUrl) return new Response("Missing SHOPIFY_APP_URL/HOST", { status: 500 });

    const returnUrl = new URL("/billing/confirm", appUrl);
    returnUrl.searchParams.set("shop", shop);

    // 4) isTest: vrai en dev/dev store
    const isTest = (process.env.BILLING_TEST === "1");

    // ⚠️ Certains SDK renvoient `confirmationUrl` à la racine, d’autres sous `appSubscription`.
    const result = await billing.request({
      plan: handle,          // Ici on passe la CLEF du plan (== handle)
      isTest,
      returnUrl: returnUrl.toString(),
    });

    const confUrl = result?.confirmationUrl ?? result?.appSubscription?.confirmationUrl;
    if (!confUrl) {
      console.error("No confirmationUrl in billing.request result:", result);
      return new Response("Billing: missing confirmation URL", { status: 500 });
    }

    return redirect(confUrl);
  } catch (err) {
    console.error("billing.activate error:", err);
    return new Response("Billing activation failed", { status: 500 });
  }
};
