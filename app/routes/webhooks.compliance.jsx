// app/routes/webhooks.compliance.jsx
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  console.log("🔐 Webhook reçu, début de la vérification HMAC...");

  try {
    // Cloner la requête pour HMAC
    const requestClone = request.clone();

    // Vérifier HMAC
    const { topic, shop, payload, session } = await authenticate.webhook(requestClone);
    console.log(`✅ Webhook validé : ${topic} pour ${shop}`);

    // Importer db uniquement côté serveur
    const db = (await import("../db.server")).default;

    // --- Gestion des webhooks ---
    switch (topic) {
      case "customers/data_request":
        console.log(`📋 Demande de données client : ${payload.customer?.email}`);
        // Si tu stockes des données, compile-les ici
        break;

      case "customers/redact":
        console.log(`🗑️ Suppression client : ${payload.customer?.email}`);
        console.log(`   Commandes à supprimer : ${payload.orders_to_redact}`);
        // Supprime ou anonymise les données si nécessaire
        break;

      case "shop/redact":
        console.log(`🏬 Suppression boutique : ${shop}`);
        await db.session.deleteMany({ where: { shop } });
        console.log("   ➡️ Sessions supprimées.");
        break;

      case "app/uninstalled":
        console.log(`🚨 App désinstallée : ${shop}`);
        await db.session.deleteMany({ where: { shop } });
        break;

      case "app/scopes_update":
        console.log(`🔄 Scopes mis à jour pour : ${shop}`);
        if (session && payload.current) {
          await db.session.update({
            where: { id: session.id },
            data: { scope: payload.current.toString() },
          });
          console.log("   ➡️ Scopes mis à jour en base.");
        }
        break;

      default:
        console.warn(`⚠️ Topic non géré : ${topic}`);
    }

    // Toujours répondre 200 OK
    return new Response(null, { status: 200 });

  } catch (error) {
    console.error("❌ Erreur webhook :", error.message);
    const status = error.message.includes("HMAC") ? 401 : 500;
    return new Response(error.message, { status });
  }
};

// Bloquer les GET
export const loader = () => new Response("Méthode non autorisée", { status: 405 });
