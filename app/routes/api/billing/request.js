import { authenticate, billing } from "../../../../shopify.server";

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const plan = url.searchParams.get("plan");

  if (!plan || !["monthly", "annual"].includes(plan)) {
    return new Response("Invalid plan specified", { status: 400 });
  }

  const selectedPlan = plan === "annual" 
    ? "Premium Annual" 
    : "Premium Monthly";

  try {
    const confirmationUrl = await billing.request({
      session,
      plan: selectedPlan,
      isTest: process.env.NODE_ENV !== "production",
    });

    return new Response(null, {
      status: 302,
      headers: { Location: confirmationUrl },
    });
  } catch (error) {
    console.error("Billing error:", error);
    return new Response(JSON.stringify({ 
      error: "Billing request failed",
      details: error.message 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Export vide car c'est une route API
export default function() { return null; }
