import { redirect } from "@remix-run/node";

// Catch-all route for any unmatched /app/* routes
export const loader = async ({ request }) => {
  console.log("🔄 CATCH-ALL: Unmatched app route, redirecting to dashboard");
  console.log("🔄 CATCH-ALL: Request URL:", request.url);
  
  // Always redirect to dashboard for any unmatched app routes
  return redirect("/app/dashboard");
};


