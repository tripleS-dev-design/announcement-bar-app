import dotenv from "dotenv";
dotenv.config();

console.log("✅ Loaded SHOPIFY_APP_URL:", process.env.SHOPIFY_APP_URL);
console.log("✅ Loaded SHOPIFY_API_KEY:", process.env.SHOPIFY_API_KEY);

import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

// ✅ Configuration billing
export const billing = {
  "Premium Monthly": {
    amount: 4.99,
    currencyCode: "USD",
    interval: "EVERY_30_DAYS",
    trialDays: 14,
  },
  "Premium Annual": {
    amount: 39.99,
    currencyCode: "USD",
    interval: "ANNUAL",
    trialDays: 14,
  },
};

// ✅ Lecture sécurisée de l'app URL
const rawAppUrl =
  process.env.SHOPIFY_APP_URL ||
  process.env.APPURL ||
  process.env.appUrl;

if (!rawAppUrl) {
  throw new Error("❌ SHOPIFY_APP_URL is missing from environment variables.");
}

// 🟡 Si Shopify attend juste le hostname (sans protocole), décommente cette ligne :
const appUrl = rawAppUrl.replace(/^https?:\/\//, "");

// ✅ Création de l’app Shopify
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(","),
  appUrl, // 🟡 ici on passe le host sans https://
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  billing,
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
});

// ✅ Export Shopify utils
export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
