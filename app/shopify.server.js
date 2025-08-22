// shopify.server.js
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

// --- Vérifs des variables d'environnement indispensables ---
const requiredEnv = ["SHOPIFY_API_KEY", "SHOPIFY_API_SECRET", "SHOPIFY_APP_URL", "SCOPES"];
for (const k of requiredEnv) {
  if (!process.env[k] || process.env[k].trim() === "") {
    throw new Error(`Missing env var: ${k}`);
  }
}

const appUrl = process.env.SHOPIFY_APP_URL;

// ✅ Handles EXACTS (doivent correspondre aux “Handle” que tu vois dans le Partner Dashboard)
export const PLAN_HANDLES = {
  monthly: "premium-monthly",
  annual:  "premium-annual",
};

// ✅ Définition des plans de facturation : les CLÉS sont les handles
export const billing = {
  [PLAN_HANDLES.monthly]: {
    amount: 4.99,
    currencyCode: "USD",
    interval: "EVERY_30_DAYS",
    trialDays: 14,
  },
  [PLAN_HANDLES.annual]: {
    amount: 39.99,
    currencyCode: "USD",
    interval: "ANNUAL",
    trialDays: 14,
  },
};

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  apiVersion: ApiVersion.January25, // OK d'utiliser Jan 2025 pour l'Admin API
  scopes: process.env.SCOPES.split(",").map((s) => s.trim()).filter(Boolean),

  appUrl,
  authPathPrefix: "/auth",

  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,

  // Très important : on passe l'objet billing ci-dessus
  billing,

  // Active l’auth “jetons de visite” (session tokens) et retire le REST si tu n’en as pas besoin
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
