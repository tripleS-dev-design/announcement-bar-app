import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createRequestHandler } from "@remix-run/express";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

console.log("🚀 ENVIRONMENT VARIABLES:");
console.log("SHOPIFY_API_KEY =", process.env.SHOPIFY_API_KEY);
console.log("SHOPIFY_API_SECRET =", process.env.SHOPIFY_API_SECRET);
console.log("SHOPIFY_ANNOUNCEMENT_BAR_ID =", process.env.SHOPIFY_ANNOUNCEMENT_BAR_ID);
console.log("SCOPES =", process.env.SCOPES);
console.log("SHOPIFY_APP_URL =", process.env.SHOPIFY_APP_URL);
console.log("HOST =", process.env.HOST);
console.log("DATABASE_URL =", process.env.DATABASE_URL);
console.log("PORT =", process.env.PORT);

if (!process.env.SHOPIFY_APP_URL) {
  process.env.SHOPIFY_APP_URL = "https://announcement-bar-app-production.up.railway.app";
}

if (!process.env.HOST) {
  process.env.HOST = process.env.SHOPIFY_APP_URL;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const buildPath = path.join(__dirname, "build", "server", "index.js");
if (!fs.existsSync(buildPath)) {
  console.error("❌ Le build Remix est manquant. Lancez `remix build`.");
  process.exit(1);
}

const remixBuild = await import(buildPath);

const app = express();
const port = Number(process.env.PORT) || 8080;

app.use(express.static(path.join(__dirname, "build", "client")));

app.all(
  "*",
  createRequestHandler({
    build: remixBuild,
    mode: process.env.NODE_ENV,
  })
);

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
