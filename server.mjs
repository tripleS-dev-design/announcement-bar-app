import express from "express";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { createRequestHandler } from "@remix-run/express";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

console.log("🚀 ENVIRONMENT VARIABLES:");
console.log("SHOPIFY_API_KEY =", process.env.SHOPIFY_API_KEY);
console.log("SHOPIFY_API_SECRET =", process.env.SHOPIFY_API_SECRET);
console.log("PORT =", process.env.PORT);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildPath = path.join(__dirname, "build", "server", "index.js");

if (!fs.existsSync(buildPath)) {
  console.error("❌ Le build Remix est manquant. Lancez `remix build`.");
  process.exit(1);
}

const remixBuild = await import(pathToFileURL(buildPath).href);

const app = express();
const port = Number(process.env.PORT) || 8080;

console.log("✅ PORT utilisé =", port);

// Logger simple (optionnel)
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// Servir les fichiers statiques Remix
app.use(express.static(path.join(__dirname, "build", "client")));

// Gestion des routes Remix
app.all(
  "*",
  createRequestHandler({
    build: remixBuild,
    mode: process.env.NODE_ENV,
  })
);

// Middleware gestion d’erreurs (optionnel)
app.use((err, req, res, next) => {
  console.error("⚠️ Erreur serveur :", err);
  res.status(500).send("Internal Server Error");
});

// Lancer le serveur
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server is running on port ${port}`);
});
