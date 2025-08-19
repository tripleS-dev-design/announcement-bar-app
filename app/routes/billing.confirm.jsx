// app/routes/billing.confirm.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { billing, session } = await authenticate.admin(request);

  try {
    await billing.confirm({ isTest: true }); // store de dev
    // retour dans ton app
    const url = new URL(request.url);
    const host = url.searchParams.get("host") || "";
    return redirect(`/settings?shop=${session.shop}&host=${host}`);
  } catch (e) {
    console.error("Billing confirm error:", e);
    return new Response("Billing confirm failed", { status: 500 });
  }
};
