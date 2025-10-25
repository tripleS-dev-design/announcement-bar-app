// app/root.jsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { json } from "@remix-run/node";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider as ShopifyAppProvider } from "@shopify/shopify-app-remix/react";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import en from "@shopify/polaris/locales/en.json";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

// Expose API key au client (Provider Shopify)
export async function loader() {
  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
}

// Feuilles de style & polices
export const links = () => [
  { rel: "stylesheet", href: polarisStyles },
  { rel: "preconnect", href: "https://cdn.shopify.com/" },
  { rel: "stylesheet", href: "https://cdn.shopify.com/static/fonts/inter/v4/styles.css" },
];

export default function Root() {
  const { apiKey } = useLoaderData();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* ⚙️ UN SEUL provider Shopify + Polaris au root */}
        <ShopifyAppProvider isEmbeddedApp apiKey={apiKey}>
          <PolarisProvider i18n={en}>
            <Outlet />
          </PolarisProvider>
        </ShopifyAppProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/* 🔒 BfS : en-têtes & error boundary recommandés par Shopify */
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}
export const headers = (args) => boundary.headers(args);
