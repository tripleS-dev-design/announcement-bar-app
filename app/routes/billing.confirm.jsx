// app/routes/billing.confirm.jsx
import { redirect } from "@remix-run/node";

export async function loader({ request }) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop") || "";
  const host = url.searchParams.get("host") || "";

  const appOrigin = process.env.SHOPIFY_APP_URL || url.origin;

  // Retour dans l’admin → onglet de l’app
  const store = shop.replace(".myshopify.com", "");
  const adminAppUrl =
    `https://admin.shopify.com/store/${store}/apps/${process.env.SHOPIFY_API_KEY}` +
    (shop || host ? `?${new URLSearchParams({ ...(shop && { shop }), ...(host && { host }) }).toString()}` : "");

  const exit = new URL("/auth/exit-iframe", appOrigin);
  if (shop) exit.searchParams.set("shop", shop);
  if (host) exit.searchParams.set("host", host);
  exit.searchParams.set("exitIframe", adminAppUrl); // ⚠️ pas d'encode ici

  return redirect(exit.toString());
}
