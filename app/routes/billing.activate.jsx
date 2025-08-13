import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server"; // ajuste le chemin si besoin

export const loader = async ({ request }) => {
  const { billing } = await authenticate.admin(request);

  const url = new URL(request.url);
  const planType = url.searchParams.get("plan") || "monthly";
  const shop = url.searchParams.get("shop");
  const host = url.searchParams.get("host");

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

  // Crée l'abonnement avec 7 jours d'essai gratuit
  const confirmationUrl = await billing.require({
    plans: [selectedPlan.name],
    trialDays: 7, // Essai gratuit
    isTest: true, // mettre sur false en prod
    returnUrl: `${process.env.SHOPIFY_APP_URL}/settings?shop=${shop}&host=${host}`,
  });

  return redirect(confirmationUrl);
};

