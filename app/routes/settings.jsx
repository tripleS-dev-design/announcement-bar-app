// app/routes/settings.jsx
import React, { useState } from "react";
import { Link } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { authenticate, PLAN_HANDLES } from "../shopify.server";

// ⚠️ Utiliser les HANDLES définis dans shopify.server.js
const REQUIRED_PLANS = [PLAN_HANDLES.monthly, PLAN_HANDLES.annual];

/**
 * - Si abonnement actif -> on affiche Settings
 * - Sinon -> redirect vers /pricing en conservant les query params
 */
export const loader = async ({ request }) => {
  const { billing } = await authenticate.admin(request);
  const url = new URL(request.url);
  const qs = url.searchParams.toString();

  try {
    await billing.require({ plans: REQUIRED_PLANS });
    return null; // OK
  } catch {
    return redirect(`/pricing?${qs}`);
  }
};

// ====== UI (ta mise en page) ======

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

// Si tes composants d’aperçu ne sont pas présents, on évite un crash de rendu
const Fallback = ({ height = 120 }) => (
  <div style={{ height, background: "#f5f5f5", borderRadius: 8 }} />
);

const PreviewAnnouncementBar =
  globalThis?.PreviewAnnouncementBar || (() => <Fallback />);
const PreviewPopup = globalThis?.PreviewPopup || (() => <Fallback />);
const PreviewCountdown = globalThis?.PreviewCountdown || (() => <Fallback />);
const OpeningPopup = globalThis?.OpeningPopup || (() => null);
const GLOBAL_STYLES = globalThis?.GLOBAL_STYLES || "";

export default function Settings() {
  const [lang, setLang] = useState("en");

  // ⚠️ si tu veux un lien "Ajouter le block" qui marche sur n'importe quel shop,
  // ne hardcode pas le nom de boutique
  const baseEditorUrl = `/admin/themes/current/editor?context=apps`;
  const appId = "be79dab79ff6bb4be47d4e66577b6c50";

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
              <a
                href={`${baseEditorUrl}&addAppBlockId=${appId}/${block.id}`}
                target="_top"
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
    </>
  );
}
