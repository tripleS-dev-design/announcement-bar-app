import { redirect } from "@remix-run/node";
import { shopify } from "~/shopify.server"; // ton helper Shopify config

export const loader = async ({ request }) => {
  // Choix du plan, par défaut mensuel
  const url = new URL(request.url);
  const plan = url.searchParams.get("plan") || "monthly";

  // Configurations des plans
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

  // Mutation GraphQL pour créer l'abonnement
  const mutation = `
    mutation {
      appSubscriptionCreate(
        name: "${selectedPlan.name}",
        returnUrl: "${process.env.HOST}/api/billing/confirm",
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

  // Exécution de la mutation
  const response = await shopify.api.admin.graphql.request({
    data: mutation,
  });

  const { appSubscriptionCreate } = response.body.data;

  // Si erreurs, on arrête et on affiche une erreur simple
  if (appSubscriptionCreate.userErrors.length > 0) {
    throw new Error(appSubscriptionCreate.userErrors[0].message);
  }

  // Sinon on redirige vers la page Shopify pour payer
  return redirect(appSubscriptionCreate.confirmationUrl);
};
