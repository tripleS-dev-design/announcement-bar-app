import dotenv from "dotenv";
dotenv.config();

import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

// --- Sanity checks (évite des débogages incompréhensibles) ---
const requiredEnv = [
  "SHOPIFY_API_KEY",
  "SHOPIFY_API_SECRET",
  "SHOPIFY_APP_URL",
  "SCOPES",
];
for (const k of requiredEnv) {
  if (!process.env[k] || process.env[k].trim() === "") {
    throw new Error(`Missing env var: ${k}`);
  }
}

const appUrl = process.env.SHOPIFY_APP_URL;

// ✅ Billing (noms 100% identiques à ceux utilisés dans l’activation)
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

// ⚠️ L’API Admin peut rester sur Janvier 2025.
// (Ton shopify.app.toml pour les webhooks est sur 2025-04: OK, ce n’est pas obligé d’être identique)
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES.split(",").map((s) => s.trim()).filter(Boolean),

  appUrl,
  authPathPrefix: "/auth",

  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,

  billing, // ← plans de facturation

  // 🔑 Indispensable pour que Shopify détecte l’auth via "jetons de visite" (JWT)
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
});

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
