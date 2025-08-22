import { redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const to = new URL("/settings", url.origin);
  for (const [k, v] of url.searchParams.entries()) to.searchParams.set(k, v);
  return redirect(to.toString());
};

export default function Index() {
  return null;
}
