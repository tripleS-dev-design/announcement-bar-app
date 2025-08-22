// app/routes/billing.activate.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server"; // server-only, OK ici

// ---- Helpers ---------------------------------------------------------
const truthy = (v) =>
  typeof v === "string" &&
  ["true", "1", "yes", "y", "on"].includes(v.toLowerCase());

function computeIsTest(shop, nodeEnv) {
  // 1) Si BILLING_TEST=true -> toujours test (utile en local)
  if (truthy(process.env.BILLING_TEST || "")) return true;

  // 2) Liste blanche de shops de dev (ex: "dev-a.myshopify.com,dev-b.myshopify.com")
  const devList = (process.env.DEV_STORES || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (devList.length && shop && devList.includes(shop.toLowerCase())) return true;

  // 3) En non-production (local), on force test
  if ((nodeEnv || "").toLowerCase() !== "production") return true;

  // 4) Par défaut: live (prod)
  return false;
}
// ---------------------------------------------------------------------

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop") || "";
  const host = url.searchParams.get("host") || "";
  const plan = url.searchParams.get("plan") || "premium-monthly";

  try {
    const { billing } = await authenticate.admin(request); // peut renvoyer Response(302)

    // URL de retour COURTE (<= 255 chars)
    const appUrl = process.env.SHOPIFY_APP_URL || url.origin;
    const returnUrl = new URL("/billing/confirm", appUrl);
    if (shop) returnUrl.searchParams.set("shop", shop);
    if (host) returnUrl.searchParams.set("host", host);

    // isTest = false par défaut en prod / true uniquement pour tes shops DEV
    const isTest = computeIsTest(shop, process.env.NODE_ENV);

    await billing.request({
      plan,
      isTest,
      returnUrl: returnUrl.toString(),
    });

    // Normalement, la ligne au-dessus provoque un 302 vers la page d’approbation Shopify.
    // Si jamais on “retombe” ici, renvoie sur /pricing.
    const fallback = new URL("/pricing", appUrl);
    if (shop) fallback.searchParams.set("shop", shop);
    if (host) fallback.searchParams.set("host", host);
    return redirect(fallback.toString());
  } catch (err) {
    // Redirection top-level hors iframe (auth ou page d’approbation)
    if (err instanceof Response && err.status === 302) {
      const appOrigin = process.env.SHOPIFY_APP_URL || url.origin;
      const loc = err.headers.get("Location") || "/auth/login";
      const finalTarget = new URL(loc, appOrigin).toString();

      const exit = new URL("/auth/exit-iframe", appOrigin);
      if (shop) exit.searchParams.set("shop", shop);
      if (host) exit.searchParams.set("host", host);
      exit.searchParams.set("exitIframe", finalTarget);

      return redirect(exit.toString());
    }

    console.error("billing.activate error:", err);
    return new Response("Billing activation failed", { status: 500 });
  }
};
