import shopify from "~/shopify.server";

export const action = async ({ request }) => {
  try {
    // Shopify envoie une requête POST ici pour demander les données du client
    // Répond avec un 200 OK si la route est active
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error in request data webhook:", error);
    return new Response(null, { status: 500 });
  }
};
