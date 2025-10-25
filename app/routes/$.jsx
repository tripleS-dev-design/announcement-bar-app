import { redirect } from "@remix-run/node";

// Catch-all route for any unmatched routes
export const loader = async ({ request }) => {
  console.log("🔄 GLOBAL CATCH-ALL: Unmatched route, redirecting to app");
  console.log("🔄 GLOBAL CATCH-ALL: Request URL:", request.url);
  
  // Extract shop parameter if present
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  
  if (shop) {
    console.log("🔄 GLOBAL CATCH-ALL: Shop found, redirecting to app with shop");
    return redirect(`/app?shop=${shop}`);
  }
  
  // Always redirect to app for any unmatched routes
  return redirect("/app");
};


