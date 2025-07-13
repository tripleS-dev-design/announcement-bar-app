export async function action({ request }) {
  const body = await request.text();
  console.log("🗑️ shop/redact webhook:", body);

  return new Response("Received shop/redact", { status: 200 });
}
