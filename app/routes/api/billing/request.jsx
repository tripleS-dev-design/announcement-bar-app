import { authenticate, billing } from "../../../../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  const url = new URL(request.url);
  const selectedPlan = url.searchParams.get("plan") === "annual"
    ? "Premium Annual"
    : "Premium Monthly";

  const confirmationUrl = await billing.request({
    session,
    plan: selectedPlan,
    isTest: true, // Mets false en production
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: confirmationUrl,
    },
  });
};
