// app/routes/settings.jsx
import React, { useState } from "react";
import { Link, useSearchParams } from "@remix-run/react";
import { redirect } from "@remix-run/node";

/**
 * 🔐 Server loader:
 * - exige un abonnement actif (plans = handles exacts)
 * - sinon -> redirige vers /pricing en conservant les query params
 */
export const loader = async ({ request }) => {
  const url = new URL(request.url);

  try {
    // ✅ import dynamique => jamais bundlé côté client
    const { authenticate } = await import("../shopify.server");
    const { billing } = await authenticate.admin(request);

    // ⚠️ Utiliser les HANDLES, pas les noms marketing
    await billing.require({ plans: ["premium-monthly", "premium-annual"] });
    return null;
  } catch (_e) {
    return redirect(`/pricing?${url.searchParams.toString()}`);
  }
};

/* ---------------- UI helpers (placeholders compila-bles) ---------------- */

const GLOBAL_STYLES = `
@keyframes shimmer {
  0% { background-position: 0 0; } 100% { background-position: 800px 0; }
}
`;

function OpeningPopup() {
  // Place-holder (si tu as ton vrai composant, remplace)
  return null;
}

function Card({ children, style }) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        alignItems: "center",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const BUTTON_BASE = {
  border: "none",
  borderRadius: 8,
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
  padding: 16,
};

// --- petites previews "fake" pour compiler proprement ---
function PreviewAnnouncementBar() {
  return (
    <div
      style={{
        background:
          "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(60,60,60,1) 100%)",
        color: "#fff",
        padding: 12,
        borderRadius: 8,
        textAlign: "center",
        width: 320,
      }}
    >
      Announcement Bar Preview
    </div>
  );
}

function PreviewPopup() {
  return (
    <div
      style={{
        width: 320,
        height: 160,
        borderRadius: 12,
        border: "1px solid #eee",
        display: "grid",
        placeItems: "center",
        background: "#fafafa",
      }}
    >
      Popup Preview
    </div>
  );
}

function PreviewCountdown() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {["12", "34", "56"].map((n) => (
        <div
          key={n}
          style={{
            width: 60,
            height: 60,
            borderRadius: 10,
            background: "#000",
            color: "#fff",
            display: "grid",
            placeItems: "center",
            fontWeight: "bold",
          }}
        >
          {n}
        </div>
      ))}
    </div>
  );
}

/* -------------------------------- Page -------------------------------- */

export default function Settings() {
  const [lang, setLang] = useState("en");
  const [params] = useSearchParams();

  // Récupère "shop" depuis l’URL (fourni par Shopify)
  const shopParam = params.get("shop") || "";
  const shopSub =
    shopParam.replace("https://", "").replace("http://", "").replace(".myshopify.com", "") ||
    ""; // ex: selya11904

  // Clé publique (client_id) — laisse la tienne ici
  const APP_KEY = "be79dab79ff6bb4be47d4e66577b6c50";

  // Lien éditeur de thème (si shop est présent)
  const baseEditorUrl = shopSub
    ? `https://${shopSub}.myshopify.com/admin/themes/current/editor?context=apps`
    : "#";

  const makeBlockUrl = (blockId) =>
    shopSub ? `${baseEditorUrl}&addAppBlockId=${APP_KEY}/${blockId}` : "#";

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
        {/* Bandeau d’accueil */}
        <div
          style={{
            background:
              "linear-gradient(120deg, #1f1f1f 30%, #2c2c2c 50%, #444 70%)",
            backgroundSize: "800px 100%",
            borderRadius: 12,
            padding: 24,
            marginBottom: 32,
            color: "#fff",
            textAlign: "center",
            animation: "shimmer 3s infinite linear",
          }}
        >
          <p style={{ fontSize: 18, fontWeight: "bold" }}>
            “Welcome to Triple Announcement Bar! Let’s boost your sales with
            powerful bars, popups, and countdowns.”
          </p>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>

        {/* Cartes des blocks */}
        {blocks.map((block) => (
          <Card key={block.id}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <h2 style={{ fontSize: 20, marginBottom: 8 }}>{block.title}</h2>
              <p style={{ marginBottom: 12, color: "#555" }}>
                {block.description}
              </p>

              <a
                href={makeBlockUrl(block.id)}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!shopSub}
              >
                <button
                  style={{
                    ...BUTTON_BASE,
                    backgroundColor: "#000",
                    color: "#fff",
                    opacity: shopSub ? 1 : 0.5,
                    cursor: shopSub ? "pointer" : "not-allowed",
                  }}
                  disabled={!shopSub}
                >
                  Add Premium Block
                </button>
              </a>
            </div>

            <div style={{ flex: 1, minWidth: 220 }}>{block.preview}</div>
          </Card>
        ))}
      </div>

      <Link to={`/pricing?${params.toString()}`}>
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
          }}
        >
          Pricing
        </button>
      </Link>
    </>
  );
}
