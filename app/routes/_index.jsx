// app/routes/_index.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

// Ajuste ces noms pour correspondre EXACTEMENT
// aux clés que tu as déclarées dans `billing` dans shopify.server
const PLAN_NAMES = ["Premium Monthly", "Premium Annual"];

export const loader = async ({ request }) => {
  // On récupère tout ce qui vient de Shopify (shop, host, embedded, hmac, …)
  const url = new URL(request.url);
  const search = url.search || "";
  const shop = url.searchParams.get("shop");
  const host = url.searchParams.get("host");

  // S'authentifier et récupérer billing + session
  const { billing, session } = await authenticate.admin(request);

  // 1) Dev store → on saute le billing et on envoie vers /settings
  // La plupart du temps, Shopify met `session.isDev` = true sur les dev stores.
  // Si ton flag est différent (ex: plan_name === 'partner_test'), adapte la condition.
  if (session?.isDev) {
    const params = new URLSearchParams(search);
    params.set("billing", "dev");
    if (shop) params.set("shop", shop);
    if (host) params.set("host", host);
    return redirect(`/settings?${params.toString()}`);
  }

  // 2) Client : on exige un des plans; si absent, on enverra sur /pricing
  try {
    await billing.require({
      plans: PLAN_NAMES,
      // si pas d’abonnement valide, on redirige vers /pricing (on garde les params)
      onFailure: async () => redirect(`/pricing${search}`),
    });
    // si on arrive ici, abonnement actif
    return redirect(`/settings${search}`);
  } catch {
    // si une erreur arrive, fallback pricing
    return redirect(`/pricing${search}`);
  }
};
