import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server"; // garde ce chemin si shopify.server est dans app/

// ⚠️ Mets ici exactement les mêmes noms que dans Partner -> Pricing
const PLAN_NAME = {
  monthly: "Premium Monthly Plan",
  annual:  "Premium Annual Plan",
};

export const loader = async ({ request }) => {
  try {
    const { billing, session } = await authenticate.admin(request);

    const url = new URL(request.url);
    const planKey = url.searchParams.get("plan") || "monthly";
    const shop = url.searchParams.get("shop");
    const host = url.searchParams.get("host");

    if (!shop || !host) {
      throw new Error("Missing 'shop' or 'host' query param.");
    }

    // 1) Si un abonnement actif existe déjà (mensuel ou annuel) -> OK
    // 2) Sinon -> on lance la demande pour le plan choisi avec 7 jours d'essai
    await billing.require({
      plans: Object.values(PLAN_NAME),
      onFailure: async () =>
        billing.request({
          plan: PLAN_NAME[planKey] || PLAN_NAME.monthly,
          trialDays: 7,               // essai gratuit
          // isTest: true,            // laisse true sur dev store, passe à false en prod
          returnUrl: `${process.env.SHOPIFY_APP_URL}/settings?shop=${shop}&host=${host}&billing=success`,
        }),
    });

    // Si on arrive ici, un abonnement valable existe déjà
    return redirect(`/settings?shop=${session.shop}&host=${host}&billing=active`);
  } catch (err) {
    console.error("Billing activation error:", err);
    return new Response("Billing activation failed", { status: 500 });
  }
};
