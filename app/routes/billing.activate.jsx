// app/routes/billing.activate.jsx
import { redirect } from "@remix-run/node";
import { authenticate, PLAN_HANDLES } from "../shopify.server";

// Plans valides (handles EXACTS)
const VALID_PLANS = new Set(Object.values(PLAN_HANDLES));

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  // plan demandé (par défaut: monthly)
  const plan = url.searchParams.get("plan") || PLAN_HANDLES.monthly;

  // paramètres utiles UNIQUEMENT : shop & host
  const shop = url.searchParams.get("shop") || "";
  const host = url.searchParams.get("host") || "";

  if (!VALID_PLANS.has(plan)) {
    // plan invalide -> retour à /pricing avec message
    url.searchParams.set("error", "invalid_plan");
    return redirect(`/pricing?${url.searchParams.toString()}`);
  }

  const { billing } = await authenticate.admin(request);

  // URL courte pour la confirmation (< 255 chars)
  const appUrl = process.env.SHOPIFY_APP_URL || `${url.protocol}//${url.host}`;
  const confirm = new URL("/billing/confirm", appUrl);
  if (shop) confirm.searchParams.set("shop", shop);
  if (host) confirm.searchParams.set("host", host);

  const returnUrl = confirm.toString();
  const isTest = (process.env.BILLING_TEST || "").toLowerCase() === "true";

  try {
    // Redirige vers la page de confirmation Shopify (géré en top-level)
    return await billing.request({
      plan,
      returnUrl,
      isTest,
    });
  } catch (err) {
    // L’auth remix peut renvoyer un 302 (à renvoyer tel quel)
    if (err instanceof Response && err.status === 302) return err;

    console.error("billing.activate error:", err);
    return new Response("Billing activation failed", { status: 500 });
  }
};
