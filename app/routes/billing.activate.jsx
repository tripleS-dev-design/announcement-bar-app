// app/routes/billing.activate.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server"; // <- depuis app/routes/, remonte d'un niveau

const PLAN_KEYS = {
  monthly: "Premium Monthly",
  annual: "Premium Annual",
};

export const loader = async ({ request }) => {
  const { billing, session } = await authenticate.admin(request);

  const url = new URL(request.url);
  const input = url.searchParams.get("plan"); // "monthly" | "annual"
  const planName = PLAN_KEYS[input] ?? PLAN_KEYS.monthly;

  // 1) Si un des plans est déjà actif, on continue
  // 2) Sinon, on déclenche le paiement via onFailure -> billing.request(...)
  await billing.require({
    plans: Object.values(PLAN_KEYS), // accepte monthly OU annual si déjà actif
    onFailure: async () =>
      billing.request({
        plan: planName,
        // isTest: true, // active-le si tu testes sur un dev store
        returnUrl: `${process.env.SHOPIFY_APP_URL}/premium`,
      }),
  });

  // Si on arrive ici, un abonnement valable existe déjà
  return redirect(`/premium?shop=${session.shop}&billing=active`);
};
