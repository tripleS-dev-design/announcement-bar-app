// app/routes/api/billing/confirm.jsx
import { redirect } from "@remix-run/node";
import { authenticate, shopify } from "~/shopify.server";

export const loader = async ({ request }) => {
  const session = await shopify.auth.loadCurrentSession(request, true);
  if (!session) {
    // Pas de session : redirige vers l'accueil ou login
    return redirect("/");
  }

  const url = new URL(request.url);
  const chargeId = url.searchParams.get("charge_id") || url.searchParams.get("id");

  if (!chargeId) {
    throw new Response("Missing charge id", { status: 400 });
  }

  // Récupérer les détails de l'abonnement
  const query = `#graphql
    query GetAppSubscription($id: ID!) {
      node(id: $id) {
        ... on AppSubscription {
          id
          status
          currentPeriodEnd
        }
      }
    }
  `;

  const variables = { id: chargeId };

  const { admin } = await authenticate.admin(request);

  const data = await admin.graphql(query, { variables });

  const subscription = data.node;

  if (!subscription) {
    throw new Response("Subscription not found", { status: 404 });
  }

  if (subscription.status === "ACTIVE") {
    // Abonnement validé, tu peux ici enregistrer l'état en base, session, etc.
    // Puis rediriger vers la page premium ou tableau de bord
    return redirect("/premium?billing=success");
  } else {
    // Abonnement non validé (refusé, annulé, etc)
    return redirect("/premium?billing=failed");
  }
};
