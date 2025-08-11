// app/routes/billing.activate.jsx   (ou app/routes/billing/activate/route.jsx)
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server"; // <- ajuste le chemin (.. ou ../../..) selon ton fichier

const PLAN_KEYS = { monthly: "Premium Monthly", annual: "Premium Annual" };

export const loader = async ({ request }) => {
  const { billing, session } = await authenticate.admin(request);

  const url = new URL(request.url);
  const planName = PLAN_KEYS[url.searchParams.get("plan")] ?? PLAN_KEYS.monthly;

  await billing.require({
    plans: Object.values(PLAN_KEYS),
    onFailure: async () =>
      billing.request({
        plan: planName,
        returnUrl: `${process.env.SHOPIFY_APP_URL}/premium`,
      }),
  });

  return redirect(`/premium?shop=${session.shop}&billing=active`);
};
