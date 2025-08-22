// app/routes/billing.confirm.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  try {
    const { billing } = await authenticate.admin(request); // peut lancer un redirect(Response)

    // ⚠️ Utiliser les HANDLES (clés de l’objet billing), pas des noms marketing
    await billing.require({ plans: ["premium-monthly", "premium-annual"] });

    const url = new URL(request.url);
    const appUrl = process.env.SHOPIFY_APP_URL || process.env.HOST || url.origin;
    const to = new URL("/settings", appUrl);

    // (optionnel) propager les params
    for (const [k, v] of url.searchParams) to.searchParams.set(k, v);

    return redirect(to.toString());
  } catch (err) {
    // ✅ Très important: si le SDK veut te ré-authentifier, il jette un Response(302).
    if (err instanceof Response) return err;

    console.error("billing.confirm error:", err);
    return new Response("Billing confirmation failed", { status: 500 });
  }
};
