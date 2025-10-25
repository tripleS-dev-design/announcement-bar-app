// app/routes/app._index.jsx
import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const qs = new URLSearchParams(url.search); // keep shop/host/etc.

  try {
    // ⬇️ import serveur UNIQUEMENT dans le loader (OK build)
    const { requireActiveBilling } = await import("../utils/billing-middleware.server");

    const billingCheck = await requireActiveBilling(request, "/app/pricing");

    if (billingCheck?.access === "denied") {
      qs.set("billing", "required");
      return redirect(`/app/pricing?${qs.toString()}`);
    }

    return redirect(`/app/dashboard?${qs.toString()}`);
  } catch {
    qs.set("error", "auth_failed");
    return redirect(`/app/pricing?${qs.toString()}`);
  }
};

export default function AppIndex() {
  return null;
}
