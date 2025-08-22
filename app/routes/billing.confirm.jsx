// app/routes/billing.confirm.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop") || "";
  const host = url.searchParams.get("host") || "";

  try {
    const { billing } = await authenticate.admin(request); // peut renvoyer un Response(302)

    // Les HANDLES (clés de l'objet `billing`)
    await billing.require({ plans: ["premium-monthly", "premium-annual"] });

    const appUrl = process.env.SHOPIFY_APP_URL || process.env.HOST || url.origin;
    const to = new URL("/settings", appUrl);
    // (optionnel) propager les params utiles
    if (shop) to.searchParams.set("shop", shop);
    if (host) to.searchParams.set("host", host);

    return redirect(to.toString());
  } catch (err) {
    // 🛡️ Si le SDK demande login (302 vers /auth/login), on sort de l'iframe proprement
    if (err instanceof Response && err.status === 302) {
      const location = err.headers.get("Location") || "/auth/login";
      const loginUrl = new URL(location, process.env.SHOPIFY_APP_URL || url.origin);
      if (shop && !loginUrl.searchParams.get("shop")) loginUrl.searchParams.set("shop", shop);
      if (host && !loginUrl.searchParams.get("host")) loginUrl.searchParams.set("host", host);

      const exit = new URL("/auth/exit-iframe", process.env.SHOPIFY_APP_URL || url.origin);
      if (shop) exit.searchParams.set("shop", shop);
      if (host) exit.searchParams.set("host", host);
      exit.searchParams.set("exitIframe", encodeURIComponent(loginUrl.toString()));

      return redirect(exit.toString());
    }

    console.error("billing.confirm error:", err);
    return new Response("Billing confirmation failed", { status: 500 });
  }
};
