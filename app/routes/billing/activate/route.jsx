import { redirect } from "@remix-run/node";
import { authenticate } from "../../shopify.server";

export const loader = async ({ request }) => {
  const { billing } = await authenticate.admin(request);

  const planType = new URL(request.url).searchParams.get("plan") || "monthly";

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

  // Active le billing via Shopify Billing API
  const confirmationUrl = await billing.require({
    plans: [selectedPlan.name],
    isTest: true, // Mets sur false en prod
    returnUrl: `${process.env.SHOPIFY_APP_URL}/settings`,
  });

  return redirect(confirmationUrl);
};
