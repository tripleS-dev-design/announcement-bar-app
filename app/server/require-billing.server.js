import { shopifyApp } from "@shopify/shopify-app-remix/server";
import { MemorySessionStorage } from "@shopify/shopify-app-session-storage-memory";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES,
  hostName: process.env.HOST.replace(/^https?:\/\//, ""),
  appUrl: process.env.APP_URL,
  apiVersion: "2024-04",
  isEmbeddedApp: true,
  sessionStorage: new MemorySessionStorage(), // ✅ correct now
  billing: {
    required: true,
    charges: [
      {
        plan: "Premium Plan",
        amount: 4.99,
        currencyCode: "USD",
        interval: "EVERY_30_DAYS",
        trialDays: 14,
      },
    ],
  },
});

export const ensureBilling = shopify.ensureBilling;
export const requireBilling = shopify.ensureBilling; // ✅ C’est ça qu’il te manquait
