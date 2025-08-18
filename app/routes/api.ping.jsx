// app/routes/api.ping.jsx
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server"; // <- import RELATIF depuis app/routes/

// Vérifie le session token côté serveur (devient vert dans les contrôles Shopify)
export const loader = async ({ request }) => {
  await authenticate.admin(request); // 401/redirect si pas de session valide
  return json({ ok: true, ts: Date.now() });
};

// Pas d’UI pour cette route
export default function ApiPing() {
  return null;
}
