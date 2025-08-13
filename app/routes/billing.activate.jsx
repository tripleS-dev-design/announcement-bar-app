import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

const PLAN_NAMES = {
  monthly: ["Premium Monthly", "Premium Monthly Plan"], // 1er = nom principal
  annual:  ["Premium Annual",  "Premium Annual Plan"],
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

    // noms possibles pour require (accepte monthly OU annual déjà actif)
    const allPlanOptions = [
      ...PLAN_NAMES.monthly,
      ...PLAN_NAMES.annual,
    ];

    // nom demandé pour request (priorité au premier de la liste)
    const requestedName =
      (PLAN_NAMES[planKey] && PLAN_NAMES[planKey][0]) || PLAN_NAMES.monthly[0];

    await billing.require({
      plans: allPlanOptions,
      onFailure: async () =>
        billing.request({
          plan: requestedName,
          // isTest: true, // active si tu testes sur un dev store
          trialDays: 7,
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
