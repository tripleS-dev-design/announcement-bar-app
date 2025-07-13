import shopify from "~/shopify.server";

export const action = async ({ request }) => {
  try {
    // Shopify demande l'effacement des données client
    // Récupère le body de la requête si besoin et traite la suppression
    // Pour l'instant, on retourne un 200 OK
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error in customer data erase webhook:", error);
    return new Response(null, { status: 500 });
  }
};
