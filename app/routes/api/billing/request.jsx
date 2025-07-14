// app/routes/api/billing/request.jsx
import { redirect } from "@remix-run/node";
import { authenticate, billing } from "../../../../shopify.server";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const planParam = url.searchParams.get("plan");
  
  const selectedPlan = planParam === "annual"
    ? "Premium Annual"
    : "Premium Monthly";

  const confirmationUrl = await billing.request({
    session,
    plan: selectedPlan,
    isTest: true,
  });

  return redirect(confirmationUrl);
}

// Composant vide car c'est juste une redirection
export default function BillingRequest() {
  return null;
}
