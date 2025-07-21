import { redirect } from "@remix-run/node";
import { shopify } from "~/shopify.server";

export const loader = async ({ request }) => {
  const session = await shopify.auth.loadCurrentSession(request);

  const url = new URL(request.url);
  const plan = url.searchParams.get("plan") || "monthly";

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

  const selectedPlan = plans[plan];

  const mutation = `
    mutation {
      appSubscriptionCreate(
        name: "${selectedPlan.name}",
        returnUrl: "https://announcement-bar-app.onrender.com/api/billing/confirm",
        test: true,
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                interval: ${selectedPlan.interval},
                price: { amount: ${selectedPlan.price}, currencyCode: USD }
              }
            }
          }
        ]
      ) {
        confirmationUrl
        userErrors {
          field
          message
        }
      }
    }
  `;

  const response = await shopify.api.graphqlProxy(session, {
    data: mutation,
  });

  const { appSubscriptionCreate } = response.data;

  if (appSubscriptionCreate.userErrors.length > 0) {
    console.error("Billing error:", appSubscriptionCreate.userErrors);
    throw new Error(appSubscriptionCreate.userErrors[0].message);
  }

  return redirect(appSubscriptionCreate.confirmationUrl);
};
