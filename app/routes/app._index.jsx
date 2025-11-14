// app/routes/app._index.jsx
import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const qs = new URLSearchParams(url.search); // garde shop / host / etc.

  // 🔁 Quand le marchand ouvre l'app, on le redirige juste vers la page principale
  //    SANS aucune vérification de billing.
  return redirect(`/settings?${qs.toString()}`);
};

export default function AppIndex() {
  return null;
}
