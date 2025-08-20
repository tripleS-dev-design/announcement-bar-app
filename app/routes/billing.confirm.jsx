// app/routes/billing.confirm.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  try {
    const { billing } = await authenticate.admin(request);

    // Vérifie qu'un des deux plans est actif; sinon Shopify renverra vers l’acceptation
    await billing.require({
      plans: ["Premium Monthly", "Premium Annual"],
    });

    // Retour vers l’UI
    const url = new URL(request.url);
    const to = new URL("/settings", url.origin);
    for (const [k, v] of url.searchParams) to.searchParams.set(k, v);

    return redirect(to.toString());
  } catch (err) {
    console.error("billing.confirm error:", err);
    return new Response("Billing confirmation failed", { status: 500 });
  }
};
