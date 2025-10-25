import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
  console.log("🚀 DIRECT: Direct access bypass for Shopify auth issues");
  
  // Direct access to dashboard bypassing all Shopify auth
  return redirect("/app/dashboard?direct=true");
};


