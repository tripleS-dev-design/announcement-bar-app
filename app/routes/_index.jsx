import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
  const search = new URL(request.url).search || "";
  return redirect(`/pricing${search}`);
};
