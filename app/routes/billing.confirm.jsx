// app/routes/billing.confirm.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop") || "";
  const host = url.searchParams.get("host") || "";

  try {
    const { billing } = await authenticate.admin(request); // peut renvoyer un Response(302)

    await billing.require({ plans: ["premium-monthly", "premium-annual"] });

    const appUrl = process.env.SHOPIFY_APP_URL || process.env.HOST || url.origin;
    const to = new URL("/settings", appUrl);
    if (shop) to.searchParams.set("shop", shop);
    if (host) to.searchParams.set("host", host);
    return redirect(to.toString());
  } catch (err) {
    // ✅ ré-auth top-level propre
    if (err instanceof Response && err.status === 302) {
      const appOrigin = process.env.SHOPIFY_APP_URL || url.origin;

      // 1) Destination demandée par Shopify (peut être /auth/login ou une URL admin absolue)
      const loc = err.headers.get("Location") || "/auth/login";
      const finalTarget = new URL(loc, appOrigin).toString();

      // 2) Sortir de l’iframe (⚠️ NE PAS encoder finalTarget)
      const exit = new URL("/auth/exit-iframe", appOrigin);
      if (shop) exit.searchParams.set("shop", shop);
      if (host) exit.searchParams.set("host", host);
      exit.searchParams.set("exitIframe", finalTarget); // <-- pas de encodeURIComponent

      return redirect(exit.toString());
    }

    console.error("billing.confirm error:", err);
    return new Response("Billing confirmation failed", { status: 500 });
  }
};
