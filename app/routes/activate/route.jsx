// app/routes/billing/activate/route.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

// Les noms DOIVENT correspondre EXACTEMENT à ceux de ta config billing dans shopify.server.js
const PLAN_KEYS = {
  monthly: "Premium Monthly",
  annual: "Premium Annual",
};

export const loader = async ({ request }) => {
  const { billing, session } = await authenticate.admin(request);

  const url = new URL(request.url);
  const input = url.searchParams.get("plan"); // "monthly" | "annual"
  const planName = PLAN_KEYS[input] ?? PLAN_KEYS.monthly; // défaut: monthly

  // 1) Vérifie un paiement actif sur l'un des plans acceptés
  // 2) S'il n'y en a pas, on redirige IMMÉDIATEMENT vers la page de paiement Shopify
  await billing.require({
    plans: Object.values(PLAN_KEYS),         // accepte si monthly OU annual déjà actif
    onFailure: async () =>
      billing.request({
        plan: planName,                      // le plan choisi
        // isTest: true,                     // <— active ça si tu testes sur un dev-store
        returnUrl: `${process.env.SHOPIFY_APP_URL}/premium`, // où revenir après paiement
      }),
  });

  // S'il y avait déjà un paiement actif, on vient ici :
  return redirect(`/premium?shop=${session.shop}&billing=active`);
};
