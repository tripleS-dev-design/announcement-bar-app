import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { AppProvider } from "@shopify/shopify-app-remix/react";

// Expose l'API key côté client (pour construire activateAppId=API_KEY/EXT_ID)
export async function loader() {
  return { apiKey: process.env.SHOPIFY_API_KEY };
}

export default function App() {
  // dispo pour les routes enfants via useRouteLoaderData("root")
  const { apiKey } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {/* App Bridge provider (depuis @shopify/shopify-app-remix) */}
        <AppProvider>
          <Outlet />
        </AppProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
