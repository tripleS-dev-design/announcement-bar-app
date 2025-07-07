import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createRequestHandler } from "@remix-run/express";

dotenv.config();

if (!process.env.SHOPIFY_APP_URL) {
  process.env.SHOPIFY_APP_URL = "https://announcement-bar-app-production.up.railway.app";
}

// ✅ Fix undefined HOST
if (!process.env.HOST) {
  process.env.HOST = "announcement-bar-app-production.up.railway.app";
}

console.log("Loaded SHOPIFY_APP_URL:", process.env.SHOPIFY_APP_URL);
console.log("Loaded HOST:", process.env.HOST);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "build", "client")));

const remixBuild = await import("./build/server/index.js");

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
