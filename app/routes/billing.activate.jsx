// app/routes/billing.activate.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { PLAN_HANDLES } from "../shopify.server";

export async function loader({ request }) {
  const { billing } = await authenticate.admin(request);
  const url = new URL(request.url);
  const plan = url.searchParams.get("plan");

  const validPlans = Object.values(PLAN_HANDLES);
  if (!plan || !validPlans.includes(plan)) {
    return new Response("Unknown plan", { status: 400 });
  }

  const appOrigin = process.env.SHOPIFY_APP_URL || url.origin;
  const returnUrl = new URL(`/billing/confirm?${url.searchParams.toString()}`, appOrigin).toString();

  const confirmationUrl = await billing.request({
    plan,
    isTest: process.env.NODE_ENV !== "production",
    returnUrl,
  });

  return redirect(confirmationUrl);
}
