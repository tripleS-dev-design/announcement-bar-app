// app/routes/settings.jsx
import React, { useMemo } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";

/* Loader: récupère le sous-domaine shop + fixe l'UUID de l'extension */
export const loader = async ({ request }) => {
  const { authenticate } = await import("../shopify.server");
  const { admin, session } = await authenticate.admin(request);

  const shopDomain = session.shop || "";                  // ex: selya11904.myshopify.com
  const shopSub = shopDomain.replace(".myshopify.com", ""); // ex: selya11904

  // Ton UUID (prioritaire), sinon .env, sinon GraphQL
  let extensionId = "be79dab79ff6bb4be47d4e66577b6c50" || process.env.THEME_EXTENSION_ID;

  if (!extensionId) {
    try {
      const resp = await admin.graphql(`
        query GetAppExtensions {
          currentAppInstallation {
            extensionRegistrations(first: 100) {
              nodes { uuid type handle }
            }
          }
        }
      `);
      const data = await resp.json();
      const nodes = data?.data?.currentAppInstallation?.extensionRegistrations?.nodes || [];
      const themeExt =
        nodes.find(n => n.type === "THEME_APP_EXTENSION" && n.handle === "announcement-bar") ||
        nodes.find(n => n.type === "THEME_APP_EXTENSION");
      if (themeExt?.uuid) extensionId = themeExt.uuid;
    } catch {}
  }

  return json({ shopSub, extensionId });
};

/* Helpers: liens vers l’éditeur + insertion automatique de SECTION */
function themeEditorBase({ shopSub, themeId }) {
  const themePart = themeId ? `themes/${themeId}` : "themes/current";
  return `https://${shopSub}.myshopify.com/admin/${themePart}/editor`;
}
function linkAddSection({ shopSub, template = "index", extensionId, handle, themeId }) {
  const base = themeEditorBase({ shopSub, themeId });
  const p = new URLSearchParams({
    context: "apps",
    template,
    target: "newAppsSection",
    addAppSectionId: `${extensionId}/${handle}`,
  });
  return `${base}?${p.toString()}`;
}

/* Styles (garde tes 3 boutons: Pricing / YouTube / WhatsApp) */
const BUTTON_BASE = {
  border: "none",
  borderRadius: "10px",
  padding: "12px 20px",
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(0,0,0,.18)",
};

const BLOCKS = [
  { handle: "announcement-premium", title: "Premium Announcement Bar", desc: "Animated or multilingual bar to grab attention.", template: "index" },
  { handle: "popup-premium",        title: "Premium Popup",            desc: "Modern popup with promo code and glow animation.", template: "index" },
  { handle: "timer-premium",        title: "Premium Countdown",        desc: "Three dynamic countdown styles.", template: "index" },
];

export default function Settings() {
  const { shopSub, extensionId } = useLoaderData();
  const location = useLocation();

  const pricingHref = useMemo(() => `/pricing${location.search || ""}`, [location.search]);
  const YOUTUBE_URL = "https://youtu.be/UJzd4Re21e0";

  return (
    <>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "18px 16px 90px" }}>
        <header
          style={{
            background: "linear-gradient(135deg,#0a0a0a 35%,#1a1a1a 60%,#2a2a2a 100%)",
            color: "#fff",
            borderRadius: 16,
            padding: 22,
            marginBottom: 18,
            border: "1px solid rgba(200,162,77,.35)",
          }}
        >
          <h2 style={{ margin: 0, fontWeight: 900 }}>Announcement-bar-app — Settings</h2>
          <p style={{ opacity: 0.9, marginTop: 6 }}>
            Click “Add Premium Block” to open the Theme Editor and <b>auto-insert</b> the section.
          </p>
        </header>

        {BLOCKS.map((b) => (
          <article
            key={b.handle}
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 18,
              marginBottom: 14,
              boxShadow: "0 2px 8px rgba(0,0,0,.08)",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 14,
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{b.title}</div>
              <div style={{ color: "#555", marginTop: 6 }}>{b.desc}</div>
            </div>

            {/* Bouton principal — ajoute la SECTION automatiquement */}
            <a
              href={linkAddSection({
                shopSub,
                template: b.template,
                extensionId,
                handle: b.handle,
              })}
              target="_top"
              rel="noreferrer"
            >
              <button style={{ ...BUTTON_BASE, background: "#000", color: "#fff" }}>
                Add Premium Block
              </button>
            </a>
          </article>
        ))}
      </div>

      {/* Pricing (centre bas) */}
      <a href={pricingHref} style={{ textDecoration: "none" }}>
        <button
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            ...BUTTON_BASE,
            backgroundColor: "#000",
            color: "#fff",
            padding: "12px 28px",
            borderRadius: 30,
            zIndex: 999,
          }}
        >
          Pricing
        </button>
      </a>

      {/* YouTube (bas droite) */}
      <a
        href={YOUTUBE_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{ position: "fixed", bottom: 24, right: 24, textDecoration: "none", zIndex: 999 }}
        aria-label="YouTube tutorial"
      >
        <button style={{ ...BUTTON_BASE, backgroundColor: "#000", color: "#fff", borderRadius: 30 }}>
          YouTube
        </button>
      </a>

      {/* WhatsApp (bas gauche) */}
      <a
        href="https://wa.me/+212630079763"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: 24,
          left: 24,
          backgroundColor: "#000",
          borderRadius: "50%",
          padding: 14,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 999,
        }}
        aria-label="WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#fff" viewBox="0 0 448 512">
          <path d="M380.9 97.1C339.4 55.6 283.3 32 224 32S108.6 55.6 67.1 97.1C25.6 138.6 2 194.7 2 254c0 45.3 13.5 89.3 39 126.7L0 480l102.6-38.7C140 481.5 181.7 494 224 494c59.3 0 115.4-23.6 156.9-65.1C422.4 370.6 446 314.5 446 254s-23.6-115.4-65.1-156.9zM224 438c-37.4 0-73.5-11.1-104.4-32l-7.4-4.9-61.8 23.3 23.2-60.6-4.9-7.6C50.1 322.9 38 289.1 38 254c0-102.6 83.4-186 186-186s186 83.4 186 186-83.4 186-186 186zm101.5-138.6c-5.5-2.7-32.7-16.1-37.8-17.9-5.1-1.9-8.8-2.7-12.5 2.7s-14.3 17.9-17.5 21.6c-3.2 3.7-6.4 4.1-11.9 1.4s-23.2-8.5-44.2-27.1c-16.3-14.5-27.3-32.4-30.5-37.9-3.2-5.5-.3-8.5 2.4-11.2 2.5-2.5 5.5-6.4 8.3-9.6 2.8-3.2 3.7-5.5 5.5-9.2s.9-6.9-.5-9.6c-1.4-2.7-12.5-30.1-17.2-41.3-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.6 1.4-14.6 6.9-19.2 18.7-19.2 45.7 19.7 53 22.4 56.7c2.7 3.7 38.6 59.1 93.7 82.8 13.1 5.7 23.3 9.1 31.3 11.7 13.1 4.2 25.1 3.6 34.6 2.2 10.5-1.6 32.7-13.4 37.3-26.3 4.6-12.7 4.6-23.5 3.2-25.7-1.4-2.2-5-3.6-10.5-6.2z" />
        </svg>
      </a>
    </>
  );
}
