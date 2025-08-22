// app/routes/settings.jsx
import React, { useState } from "react";
import { Link, useLocation, useSearchParams } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { authenticate, PLAN_HANDLES } from "../shopify.server";

// ───────────────────────────────────────────────────────────────────────────────
// Loader: autorise uniquement les shops avec un abonnement actif.
// Redirige vers /pricing en conservant les paramètres (shop, host, etc.).
// ───────────────────────────────────────────────────────────────────────────────
export const loader = async ({ request }) => {
  const { billing } = await authenticate.admin(request);
  const url = new URL(request.url);
  const qs = url.searchParams.toString();

  const hasPayment = await billing.check({
    plans: Object.values(PLAN_HANDLES), // ["premium-monthly","premium-annual"]
  });

  if (!hasPayment) {
    return redirect(`/pricing?${qs}`);
  }

  return null;
};

// ====== le reste de TON composant inchangé (préviews, styles, etc.) ======

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

// ⚠️ Assure-toi que ces éléments existent dans ton projet :
/* global GLOBAL_STYLES, OpeningPopup, PreviewAnnouncementBar, PreviewPopup, PreviewCountdown */

export default function Settings() {
  const [lang, setLang] = useState("en");
  const location = useLocation();
  const [params] = useSearchParams();

  // shop: "example.myshopify.com" -> store = "example"
  const shopParam = params.get("shop") || "";
  const store = shopParam.replace(".myshopify.com", "");

  // Éditeur de thème (format admin.shopify.com recommandé)
  const baseEditorUrl = store
    ? `https://admin.shopify.com/store/${store}/themes/current/editor?context=apps`
    : "";

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

        {blocks.map((block) => (
          <div key={block.id} style={CARD_STYLE}>
            <div style={{ flex: 1, minWidth: "220px" }}>
              <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
                {block.title}
              </h2>
              <p style={{ marginBottom: "12px", color: "#555" }}>
                {block.description}
              </p>

              {baseEditorUrl ? (
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
              ) : (
                <button
                  disabled
                  title="Missing shop param"
                  style={{
                    ...BUTTON_BASE,
                    backgroundColor: "#999",
                    color: "#fff",
                  }}
                >
                  Add Premium Block
                </button>
              )}
            </div>
            <div style={{ flex: 1, minWidth: "220px" }}>{block.preview}</div>
          </div>
        ))}
      </div>

      <Link to={{ pathname: "/pricing", search: location.search }}>
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
    </>
  );
}
