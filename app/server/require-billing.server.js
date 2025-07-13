import { shopifyApp } from "@shopify/shopify-app-remix/server";
import { MemorySessionStorage } from "@shopify/shopify-app-session-storage-memory";

if (!process.env.SHOPIFY_API_KEY) throw new Error("Missing SHOPIFY_API_KEY");
if (!process.env.SHOPIFY_API_SECRET) throw new Error("Missing SHOPIFY_API_SECRET");
if (!process.env.SCOPES) throw new Error("Missing SCOPES");
if (!process.env.SHOPIFY_APP_URL) throw new Error("Missing SHOPIFY_APP_URL");

const hostName = new URL(process.env.SHOPIFY_APP_URL).host;

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES.split(","), // .split car SCOPES est chaîne CSV
  hostName,  // récupéré proprement du URL complet
  appUrl: process.env.SHOPIFY_APP_URL, // URL complète avec https://
  apiVersion: "2024-04",
  isEmbeddedApp: true,
  sessionStorage: new MemorySessionStorage(),
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
export const requireBilling = shopify.ensureBilling;
