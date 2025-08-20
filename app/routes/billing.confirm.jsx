// app/routes/billing.confirm.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }) => {
  const { billing } = await authenticate.admin(request);

  // Si l’abonnement n’est pas actif, Shopify renverra vers l’acceptation
  await billing.require({
    plans: ["Premium Monthly", "Premium Annual"],
  });

  // Puis on renvoie vers l’UI (en conservant les query params utiles)
  const url = new URL(request.url);
  const to = new URL("/settings", url.origin);
  for (const [k, v] of url.searchParams) to.searchParams.set(k, v);

  return redirect(to.toString());
};
