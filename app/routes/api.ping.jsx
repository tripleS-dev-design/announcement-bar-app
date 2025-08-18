// app/routes/api.ping.jsx
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  // 🔐 Exige une session valide (et accepte les session tokens / JWT)
  await authenticate.admin(request);
  return json({ ok: true, time: new Date().toISOString() });
};

export default function ApiPing() {
  // route API -> pas d'UI
  return null;
}
