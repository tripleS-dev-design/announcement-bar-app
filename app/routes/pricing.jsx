import { json, redirect } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import { shopify } from "~/shopify.server";

const APP_BILLING = {
  monthly: {
    name: "Premium Monthly Plan",
    price: 4.99,
    interval: "EVERY_30_DAYS",
  },
  annual: {
    name: "Premium Annual Plan",
    price: 39.99,
    interval: "ANNUAL",
  }
};

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  
  const url = new URL(request.url);
  const plan = url.searchParams.get("plan") || "monthly";
  
  const billingConfig = APP_BILLING[plan];
  
  const response = await admin.graphql(`
    mutation appSubscriptionCreate {
      appSubscriptionCreate(
        name: "${billingConfig.name}",
        returnUrl: "${process.env.HOST}/api/billing/confirm",
        test: true,
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                interval: ${billingConfig.interval},
                price: { amount: ${billingConfig.price}, currencyCode: USD }
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
  `);

  const data = await response.json();
  const { confirmationUrl, userErrors } = data.data.appSubscriptionCreate;

  if (userErrors.length > 0) {
    console.error("Billing Errors:", userErrors);
    throw new Error(userErrors[0].message);
  }

  return redirect(confirmationUrl);
};
