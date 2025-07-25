// app/routes/api/billing/request.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

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

  const mutation = `#graphql
    mutation AppSubscriptionCreate($name: String!, $returnUrl: URL!, $trialDays: Int, $lineItems: [AppSubscriptionLineItemInput!]!) {
      appSubscriptionCreate(name: $name, returnUrl: $returnUrl, trialDays: $trialDays, lineItems: $lineItems) {
        userErrors {
          field
          message
        }
        appSubscription {
          id
        }
        confirmationUrl
      }
    }
  `;

  const variables = {
    name: selectedPlan.name,
    returnUrl: \`\${process.env.SHOPIFY_APP_URL}/api/billing/confirm\`,
    trialDays: 7, // Tu peux ajuster ici si besoin
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

  const data = await admin.graphql(mutation, { variables });

  const { appSubscriptionCreate } = data;

  if (appSubscriptionCreate.userErrors.length > 0) {
    console.error("Billing error:", appSubscriptionCreate.userErrors);
    throw new Error(appSubscriptionCreate.userErrors[0].message);
  }

  return redirect(appSubscriptionCreate.confirmationUrl);
};
