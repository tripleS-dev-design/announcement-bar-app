// app/routes/billing.activate.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { billing, session } = await authenticate.admin(request);

  const returnUrl = `${process.env.SHOPIFY_APP_URL}/billing/confirm?shop=${session.shop}`;

  try {
    // un seul plan "Premium" (handle EXACT créé côté Partner)
    await billing.request({
      plan: "Premium",
      isTest: true,            // store de dev => true
      returnUrl,               // Shopify retournera ici
    });
    // Si tout va bien, Shopify redirige automatiquement vers le checkout → pas besoin de return ici
    return null;
  } catch (e) {
    console.error("Billing activation error:", e);
    return new Response("Billing activation failed", { status: 500 });
  }
};
