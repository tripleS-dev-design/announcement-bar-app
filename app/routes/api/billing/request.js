// app/routes/api/billing/request.js
import { redirect } from "@remix-run/node";
import { shopify } from "~/shopify.server";

export const loader = async ({ request }) => {
  const session = await shopify.auth.loadCurrentSession(request);

  const url = new URL(request.url);
  const planType = url.searchParams.get("plan") || "monthly";

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

  const query = `
    mutation AppSubscriptionCreate($name: String!, $returnUrl: URL!, $lineItems: [AppSubscriptionLineItemInput!]!) {
      appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems) {
        userErrors {
          field
          message
        }
        confirmationUrl
      }
    }
  `;

  const variables = {
    name: selectedPlan.name,
    returnUrl: `${process.env.SHOPIFY_APP_URL}/api/billing/confirm`,
    lineItems: [
      {
        plan: {
          appRecurringPricingDetails: {
            interval: selectedPlan.interval,
            price: {
              amount: selectedPlan.price,
              currencyCode: "USD"
            }
          }
        }
      }
    ]
  };

  const client = new shopify.api.clients.Graphql({
    session
  });

  const response = await client.query({
    data: {
      query,
      variables
    }
  });

  const { appSubscriptionCreate } = response.body.data;

  if (appSubscriptionCreate.userErrors.length > 0) {
    console.error("Billing error:", appSubscriptionCreate.userErrors);
    throw new Error(appSubscriptionCreate.userErrors[0].message);
  }

  return redirect(appSubscriptionCreate.confirmationUrl);
};
