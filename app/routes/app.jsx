// app/routes/app.jsx
import { Outlet } from "@remix-run/react";
import { NavMenu } from "@shopify/app-bridge-react";

export default function AppLayout() {
  return (
    <>
      <NavMenu>
        {/* IMPORTANT: rel="home" */}
        <a href="/app" rel="home">Accueil</a>

        {/* Ta page actuelle */}
        <a href="/settings">Premium Blocks</a>

       
      </NavMenu>

      <Outlet />
    </>
  );
}
