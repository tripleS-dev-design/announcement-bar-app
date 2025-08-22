// app/routes/billing.confirm.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  try {
    const { billing } = await authenticate.admin(request);

    // ✅ Les plans doivent être les CLEFS exactes de ton objet `billing`
    await billing.require({
      plans: ["premium-monthly", "premium-annual"],
    });

    // Retour vers l’UI (ta page settings)
    const url = new URL(request.url);
    const appUrl = process.env.SHOPIFY_APP_URL || process.env.HOST || url.origin;
    const to = new URL("/settings", appUrl);
    // repasse les query params si tu veux
    for (const [k, v] of url.searchParams) to.searchParams.set(k, v);

    return redirect(to.toString());
  } catch (err) {
    console.error("billing.confirm error:", err);
    return new Response("Billing confirmation failed", { status: 500 });
  }
};
