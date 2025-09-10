// app/routes/billing.activate.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop") || "";
  const host = url.searchParams.get("host") || "";
  const plan = url.searchParams.get("plan") || "premium-monthly";

  try {
    // ⬇️ Récupère aussi "admin" pour interroger le plan du shop
    const { admin, billing } = await authenticate.admin(request);

    // URL de retour COURTE (<= 255 chars)
    const appUrl = process.env.SHOPIFY_APP_URL || url.origin;
    const returnUrl = new URL("/billing/confirm", appUrl);
    if (shop) returnUrl.searchParams.set("shop", shop);
    if (host) returnUrl.searchParams.set("host", host);

    // ⬇️ Vérifie avec Shopify si la boutique est un dev store
    const planRes = await admin.graphql(`{ shop { plan { partnerDevelopment } } }`);
    const planJson = await planRes.json();
    const isDevStore = planJson?.data?.shop?.plan?.partnerDevelopment === true;

    // ⬇️ RÈGLE FINALE : test UNIQUEMENT sur dev store
    const isTest = isDevStore;

    // (Optionnel mais conseillé) — si un abonnement test actif existe déjà, on l’annule avant de redemander
    // pour éviter d’être "couvert" par un abo test :
    /*
    const active = await admin.graphql(`{
      appSubscriptions(first: 20, status: ACTIVE) { edges { node { id test status } } }
    }`).then(r => r.json());
    for (const e of (active?.data?.appSubscriptions?.edges || [])) {
      if (e.node?.test === true) {
        await admin.graphql(
          `mutation($id: ID!){
            appSubscriptionCancel(id: $id) { appSubscription { id status } userErrors { message } }
          }`,
          { variables: { id: e.node.id } }
        );
      }
    }
    */

    await billing.request({
      plan,
      isTest, // ✅ false sur vraie boutique → plus de bannière "test"
      returnUrl: returnUrl.toString(),
      // trialDays: 14 // si tu le gères ici; sinon via ta config de billing
    });

    // Normalement, la ligne au-dessus 302 vers Shopify (page d’approbation)
    const fallback = new URL("/pricing", appUrl);
    if (shop) fallback.searchParams.set("shop", shop);
    if (host) fallback.searchParams.set("host", host);
    return redirect(fallback.toString());
  } catch (err) {
    // Redirection top-level hors iframe (auth ou page d’approbation)
    if (err instanceof Response && err.status === 302) {
      const appOrigin = process.env.SHOPIFY_APP_URL || url.origin;
      const loc = err.headers.get("Location") || "/auth/login";
      const finalTarget = new URL(loc, appOrigin).toString();

      const exit = new URL("/auth/exit-iframe", appOrigin);
      if (shop) exit.searchParams.set("shop", shop);
      if (host) exit.searchParams.set("host", host);
      exit.searchParams.set("exitIframe", finalTarget);

      return redirect(exit.toString());
    }

    console.error("billing.activate error:", err);
    return new Response("Billing activation failed", { status: 500 });
  }
};
