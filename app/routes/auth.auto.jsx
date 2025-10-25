import { redirect } from "@remix-run/node";
import { login } from "../shopify.server";
import { loginErrorMessage } from "./auth.login/error.server";

export const loader = async ({ request }) => {
  console.log("🚀 AUTH AUTO: Automatic login for dev store");
  
  const shop = "selya11904.myshopify.com";
  console.log("🚀 AUTH AUTO: Using shop:", shop);
  
  // Create a request with the shop parameter
  const url = new URL(request.url);
  url.searchParams.set("shop", shop);
  
  const loginRequest = new Request(url.toString(), {
    method: "POST",
    headers: {
      ...Object.fromEntries(request.headers.entries()),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({ shop })
  });
  
  try {
    console.log("🚀 AUTH AUTO: Attempting automatic login...");
    const errors = loginErrorMessage(await login(loginRequest));
    
    if (errors.shop) {
      console.log("❌ AUTH AUTO: Login failed:", errors);
      return redirect(`/auth/login?shop=${shop}&error=${encodeURIComponent(errors.shop)}`);
    }
    
    // If we get here, login should have redirected
    console.log("✅ AUTH AUTO: Login successful, should have redirected");
    return redirect("/app");
    
  } catch (error) {
    console.log("❌ AUTH AUTO: Error during login:", error);
    return redirect(`/auth/login?shop=${shop}`);
  }
};


