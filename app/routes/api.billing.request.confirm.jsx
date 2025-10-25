// app/routes/api/billing/request/confirm.jsx
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  try {
    console.log("🔄 Starting billing confirmation...");
    
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");
    const chargeId = url.searchParams.get("charge_id") || url.searchParams.get("id");
    
    console.log("📝 URL params - shop:", shop, "chargeId:", chargeId);

    // Authenticate the request with proper session handling
    const { admin, session } = await authenticate.admin(request);
    
    console.log("✅ Authentication successful for shop:", session.shop);

    // Always check current app installation status first
    const installationQuery = `#graphql
      {
        currentAppInstallation {
          activeSubscriptions {
            id
            name
            status
          }
        }
      }
    `;

    try {
      console.log("🔍 Checking current app installation...");
      const response = await admin.graphql(installationQuery);
      const data = await response.json();
      
      console.log("📊 Installation data:", JSON.stringify(data, null, 2));
      
      const activeSubscriptions = data.data?.currentAppInstallation?.activeSubscriptions || [];

      if (activeSubscriptions.length > 0) {
        const hasActiveSubscription = activeSubscriptions.some(sub => sub.status === "ACTIVE");
        
        if (hasActiveSubscription) {
          console.log("✅ Found active subscription, redirecting to internal pricing page...");
          // Has active subscription - redirect to internal pricing page with success
          return redirect("/app/settings?billing=success");
        } else {
          console.log("⚠️ Subscriptions found but none active");
        }
      } else {
        console.log("❌ No active subscriptions found");
      }

      // If specific charge ID provided, check that subscription
      if (chargeId) {
        console.log("🔍 Checking specific subscription:", chargeId);
        const subscriptionQuery = `#graphql
          query GetAppSubscription($id: ID!) {
            node(id: $id) {
              ... on AppSubscription {
                id
                status
                currentPeriodEnd
              }
            }
          }
        `;

        const variables = { id: chargeId.startsWith('gid://') ? chargeId : `gid://shopify/AppSubscription/${chargeId}` };

        try {
          const subResponse = await admin.graphql(subscriptionQuery, { variables });
          const subData = await subResponse.json();
          const subscription = subData.data?.node;

          console.log("📊 Subscription data:", JSON.stringify(subData, null, 2));

          if (subscription && subscription.status === "ACTIVE") {
            console.log("✅ Specific subscription is active, redirecting to internal pricing page...");
            return redirect("/app/settings?billing=success");
          }
        } catch (error) {
          console.error("❌ Error checking specific subscription:", error);
        }
      }

      // No active subscription found - redirect with failure
      console.log("❌ No active subscription found, redirecting with failure...");
      return redirect("/app/pricing?billing=failed");

    } catch (error) {
      console.error("❌ Error checking app installation:", error);
      // Fallback redirect to internal pricing page
      return redirect("/app/pricing?billing=error");
    }

  } catch (error) {
    console.error("💥 Billing confirmation error:", error);
    
    // If authentication failed, redirect to internal pricing page with auth error
    console.log("❌ Authentication failed, redirecting to pricing page with auth error");
    return redirect("/app/pricing?billing=auth_error");
  }
};
