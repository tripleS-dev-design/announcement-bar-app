// app/routes/settings.jsx
import React, { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server"; // ajuste si ton shopify.server est ailleurs
import { useAuthenticatedFetch } from "@shopify/shopify-app-remix/react"; // ✅ pour les session tokens

// ⚡️ NOMS EXACTS des plans comme définis dans ton Partner Dashboard
const PLANS = ["Premium Monthly Plan", "Premium Annual Plan"];

/**
 * Loader côté serveur :
 * - Sur DEV store -> passe sans facturation
 * - Sur client AVEC abonnement -> passe
 * - Sur client SANS abonnement -> redirect vers /pricing
 */
export const loader = async ({ request }) => {
  const { billing } = await authenticate.admin(request);
  const url = new URL(request.url);
  const qs = url.searchParams.toString(); // conserve shop, host, etc.

  try {
    await billing.require({ plans: PLANS });
    return null; // OK, affiche Settings
  } catch (e) {
    console.warn("Redirecting to /pricing: no valid subscription");
    return redirect(`/pricing?${qs}`);
  }
};

// === Ton composant React Settings inchangé ===

// Style constants
const BUTTON_BASE = {
  border: "none",
  borderRadius: "8px",
  padding: "12px 24px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
};
const CONTAINER_STYLE = {
  maxWidth: "85%",
  margin: "0 auto",
  transform: "scale(0.95)",
  transformOrigin: "top center",
  padding: "16px",
};
const CARD_STYLE = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "24px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  alignItems: "center",
};

// ----------------------
// ✅ Bouton de test API (session token) pour faire passer le contrôle Shopify
function PingButton() {
  const fetcher = useAuthenticatedFetch();

  async function test() {
    try {
      const res = await fetcher("/api/ping");
      const data = await res.json();
      console.log("API /api/ping ->", data);
      alert("Ping OK: " + JSON.stringify(data));
    } catch (e) {
      console.error(e);
      alert("Ping FAILED (voir console)");
    }
  }

  return (
    <button
      onClick={test}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        ...BUTTON_BASE,
        backgroundColor: "#111",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "10px",
      }}
    >
      Test API (session token)
    </button>
  );
}
// ----------------------

// … (tout ton code OpeningPopup, PreviewAnnouncementBar, PreviewPopup, PreviewCountdown,
// GLOBAL_STYLES, StyledTimer, etc. reste identique ici) …

export default function Settings() {
  const [lang, setLang] = useState("en");
  const shop = "selya11904";
  const baseEditorUrl = `https://${shop}.myshopify.com/admin/themes/current/editor?context=apps`;
  const blocks = [
    {
      id: "announcement-bar-premium",
      title: "Premium Announcement Bar",
      description: "Animated or multilingual bar to grab attention.",
      preview: <PreviewAnnouncementBar />,
    },
    {
      id: "popup-premium",
      title: "Premium Popup",
      description: "Modern popup with promo code and glow animation.",
      preview: <PreviewPopup />,
    },
    {
      id: "countdown-premium",
      title: "Premium Countdown",
      description: "Three dynamic countdown styles.",
      preview: <PreviewCountdown />,
    },
  ];

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <OpeningPopup />
      <div style={CONTAINER_STYLE}>
        {/* bannière d’accueil */}
        <div
          style={{
            background:
              "linear-gradient(120deg, #1f1f1f 30%, #2c2c2c 50%, #444 70%)",
            backgroundSize: "800px 100%",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "32px",
            color: "#fff",
            textAlign: "center",
            animation: "shimmer 3s infinite linear",
          }}
        >
          <p style={{ fontSize: "18px", fontWeight: "bold" }}>
            “Welcome to Triple Announcement Bar! Let’s boost your sales with
            powerful bars, popups, and countdowns.”
          </p>
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>

        {/* liste de tes blocs premium */}
        {blocks.map((block) => (
          <div key={block.id} style={CARD_STYLE}>
            <div style={{ flex: 1, minWidth: "220px" }}>
              <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
                {block.title}
              </h2>
              <p style={{ marginBottom: "12px", color: "#555" }}>
                {block.description}
              </p>
              <a
                href={`${baseEditorUrl}&addAppBlockId=be79dab79ff6bb4be47d4e66577b6c50/${block.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  style={{
                    ...BUTTON_BASE,
                    backgroundColor: "#000",
                    color: "#fff",
                  }}
                >
                  Add Premium Block
                </button>
              </a>
            </div>
            <div style={{ flex: 1, minWidth: "220px" }}>{block.preview}</div>
          </div>
        ))}
      </div>

      {/* bouton Pricing en bas */}
      <Link to="/pricing">
        <button
          style={{
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            ...BUTTON_BASE,
            backgroundColor: "#000",
            color: "#fff",
            padding: "12px 28px",
            borderRadius: "30px",
          }}
        >
          Pricing
        </button>
      </Link>

      {/* ✅ Bouton de test session token */}
      <PingButton />
    </>
  );
}
