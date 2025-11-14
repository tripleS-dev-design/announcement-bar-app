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
  scopes: process.env.SCOPES.split(","),
  hostName,
  appUrl: process.env.SHOPIFY_APP_URL,
  apiVersion: "2024-04",
  isEmbeddedApp: true,
  sessionStorage: new MemorySessionStorage(),
  // ❌ plus de "billing" ici
});

// ✅ uniquement les exports nécessaires, sans billing
export default shopify;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const sessionStorage = shopify.sessionStorage;
