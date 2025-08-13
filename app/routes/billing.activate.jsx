import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  try {
    const { billing } = await authenticate.admin(request);

    const url = new URL(request.url);
    const planType = url.searchParams.get("plan") || "monthly";
    const shop = url.searchParams.get("shop");
    const host = url.searchParams.get("host");

    if (!shop || !host) {
      throw new Error("Missing shop or host in URL params.");
    }

    const plans = {
      monthly: {
        name: "Premium Monthly Plan",
        price: 4.99,
        interval: "EVERY_30_DAYS",
      },
      annual: {
        name: "Premium Annual Plan",
        price: 39.99,
        interval: "ANNUAL",
      },
    };

    const selectedPlan = plans[planType];

    const confirmationUrl = await billing.require({
      plans: [selectedPlan.name],
      isTest: true, // mettre false en prod
      trialDays: 7, // 7 jours d'essai
      returnUrl: `${process.env.SHOPIFY_APP_URL}/settings?shop=${shop}&host=${host}`,
    });

    return redirect(confirmationUrl);
  } catch (error) {
    console.error("Billing activation error:", error);
    return new Response("Billing activation failed", { status: 500 });
  }
};
