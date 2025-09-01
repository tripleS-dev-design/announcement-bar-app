// app/routes/settings.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

/* ==============================
   LOADER : shop + plan + UUID
================================ */
export const loader = async ({ request }) => {
  const { authenticate, PLAN_HANDLES } = await import("../shopify.server");
  const REQUIRED_PLANS = [PLAN_HANDLES.monthly, PLAN_HANDLES.annual];

  const { admin, billing, session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const qs = url.searchParams.toString();

  try {
    await billing.require({ plans: REQUIRED_PLANS });
  } catch {
    return redirect(`/pricing?${qs}`);
  }

  // shop courant (ex: "selya11904" à partir de "selya11904.myshopify.com")
  const shopDomain = session.shop || "";
  const shopSub = shopDomain.replace(".myshopify.com", "");

  // ✅ Toujours récupérer le **UUID de l’extension** côté Shopify
  // (ne pas utiliser le client_id d’app — ça cause "App embed does not exist")
  let extensionId = "";
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
    // essaie d'abord par handle connu, sinon prends n’importe quelle THEME_APP_EXTENSION
    const themeExt =
      nodes.find(n =>
        n.type === "THEME_APP_EXTENSION" &&
        (n.handle === "announcement-bar" ||
         n.handle === "announcement_bar" ||
         n.handle === "announcement-bar-app" ||
         n.handle === "announcement-bar-app-18")
      ) ||
      nodes.find(n => n.type === "THEME_APP_EXTENSION");

    if (themeExt?.uuid) {
      extensionId = themeExt.uuid;
    }
  } catch {
    // ignore, on tombera sur l'ENV si présent
  }

  // secours: ENV si jamais la requête GraphQL a échoué
  if (!extensionId) {
    extensionId = process.env.THEME_EXTENSION_ID || "";
  }

  return json({ shopSub, extensionId });
};

/* ==============================
   UI & styles
================================ */
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
const GLOBAL_STYLES = `
@keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
@keyframes popupGlowPro { 0%{box-shadow:0 0 12px rgba(59,130,246,.5)} 50%{box-shadow:0 0 30px rgba(59,130,246,.9)} 100%{box-shadow:0 0 12px rgba(59,130,246,.5)} }
`;

/* ==============================
   Deep-link helper (SECTION)
   (on garde addAppSectionId + target=newAppsSection)
================================ */
function makeThemeEditorLink({
  shopSub,             // ex: "selya11904"
  template = "index",
  extensionId,         // UUID (extensionRegistrations.uuid)
  handle,              // ex: "announcement-premium"
}) {
  const base = `https://${shopSub}.myshopify.com/admin/themes/current/editor`;
  const p = new URLSearchParams({
    context: "apps",
    template,
    target: "newAppsSection",
    addAppSectionId: `${extensionId}/${handle}`,
  });
  return `${base}?${p.toString()}`;
}

/* ==============================
   Tes composants (inchangés)
================================ */
function OpeningPopup() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          background: "radial-gradient(circle at center, #1a1a1a, #000)",
          padding: "32px",
          borderRadius: "16px",
          textAlign: "center",
          color: "#fff",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 0 30px rgba(255,255,255,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "16px", fontSize: "22px" }}>
          How to use the Premium Blocks
        </h2>
        <p style={{ marginBottom: "12px", fontSize: "16px", color: "#ddd" }}>
          Go to your <strong>Theme Editor</strong> and click on{" "}
          <strong>Add Block</strong> in the App section.
        </p>
        <p style={{ marginBottom: "24px", fontSize: "14px", color: "#ccc" }}>
          Choose any premium block: Announcement Bar, Popup, or Countdown, and
          customize it freely!
        </p>
        <button
          onClick={() => setVisible(false)}
          style={{ ...BUTTON_BASE, backgroundColor: "#fff", color: "#000" }}
        >
          Got it!
        </button>
      </div>
    </div>
  );
}

function PreviewAnnouncementBar() {
  const bars = [
    {
      bg: "linear-gradient(to right, #6b0a1a, #ef0f6c)",
      color: "#fff",
      text: "Limited-Time Sale! Enjoy up to 50% off on your favorite items",
      buttonText: "Shop Now",
      link: "#",
    },
    {
      bg: "linear-gradient(to right, #0f38ef, #89ffe1)",
      color: "#fff",
      text: "Flash Sale Alert! Everything Must Go – Save Big Before It’s Gone!",
      buttonText: "Grab Deal",
      link: "#",
    },
    {
      bg: "linear-gradient(to right, #13eb28, #a3e8ec)",
      color: "#000",
      text: "Clearance – Prices Slashed! Don't Miss Out on Major Savings!",
      buttonText: "Browse",
      link: "#",
    },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {bars.map((bar, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: bar.bg,
            color: bar.color,
            padding: "10px 16px",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          <a
            href={bar.link}
            style={{
              ...BUTTON_BASE,
              backgroundColor: "#fff",
              color: "#333",
              padding: "8px 16px",
              fontSize: "14px",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            {bar.buttonText}
          </a>
          <span style={{ flex: 1, marginLeft: "16px" }}>{bar.text}</span>
        </div>
      ))}
    </div>
  );
}

function PreviewPopup() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const show = () => {
      setVisible(true);
      setTimeout(() => setVisible(false), 2000);
    };
    show();
    const iv = setInterval(show, 4000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div
      style={{
        position: "relative",
        margin: "0 auto",
        transition: "all 0.2s ease",
        transform: visible ? "scale(1)" : "scale(0.85)",
        opacity: visible ? 1 : 0,
        padding: "24px",
        maxWidth: "320px",
        backgroundColor: "#bfdbfe",
        borderLeft: "6px solid #3b82f6",
        borderRadius: "12px",
        animation: visible ? "popupGlowPro 0.5s infinite ease-in-out" : "none",
      }}
    >
      <h3 style={{ marginBottom: "8px", color: "#1e40af" }}>🎁 Exclusive Offer</h3>
      <p style={{ margin: 0, fontSize: "14px", color: "#1e3a8a" }}>
        Get <strong>20% OFF</strong> with code{" "}
        <strong
          style={{ backgroundColor: "#93c5fd", padding: "2px 4px", borderRadius: "4px" }}
        >
          WELCOME20
        </strong>
      </p>
      <button
        style={{
          ...BUTTON_BASE,
          marginTop: "12px",
          backgroundColor: "#1e3a8a",
          color: "#bfdbfe",
        }}
      >
        Apply Now
      </button>
    </div>
  );
}

function calcRemaining(deadline) {
  const diff = Math.max(deadline - Date.now(), 0);
  const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
  return `${h}:${m}:${s}`;
}
function StyledTimer({ value, variant }) {
  const base = {
    fontFamily: "sans-serif",
    padding: "8px 12px",
    minWidth: "40px",
    textAlign: "center",
  };
  const styles = {
    standard: {
      ...base,
      backgroundColor: "#f0f0f0",
      color: "#333333",
      borderRadius: "6px",
      boxShadow: "0 0 8px rgba(59,130,246,0.3)",
    },
    rectangle: {
      ...base,
      backgroundColor: "#2d3748",
      color: "#e2e8f0",
      borderRadius: "4px",
      boxShadow: "0 0 10px rgba(107,146,255,0.4)",
    },
    circle: {
      ...base,
      border: "3px solid #2b6cb0",
      color: "#2b6cb0",
      borderRadius: "50%",
      boxShadow: "0 0 12px rgba(43,108,176,0.6)",
    },
  };
  return <div style={styles[variant]}>{value}</div>;
}
function PreviewCountdown() {
  const TWO_HOURS = 2 * 3600000;
  const deadline = Date.now() + TWO_HOURS;
  const [time, setTime] = useState(calcRemaining(deadline));
  useEffect(() => {
    const iv = setInterval(() => setTime(calcRemaining(deadline)), 1000);
    return () => clearInterval(iv);
  }, [deadline]);
  const parts = time.split(":");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "360px",
        margin: "0 auto",
      }}
    >
      {[
        ["Standard", "standard"],
        ["Rectangle", "rectangle"],
        ["Circle", "circle"],
      ].map(([title, variant], i) => (
        <div
          key={i}
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "12px",
            padding: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            width: "100%",
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: "bold", color: "#111" }}>
            {title}
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            {parts.map((p, idx) => (
              <StyledTimer key={idx} value={p} variant={variant} />
            ))}
          </div>
          <button
            style={{ ...BUTTON_BASE, backgroundColor: "#000", color: "#fff", padding: "8px 16px" }}
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
}

/* ==============================
   PAGE Settings
================================ */
export default function Settings() {
  const { shopSub, extensionId } = useLoaderData();
  const [lang, setLang] = useState("en");
  const location = useLocation();

  const pricingHref = useMemo(() => `/pricing${location.search || ""}`, [location.search]);
  const YOUTUBE_URL = "https://youtu.be/UJzd4Re21e0";

  // Tes 3 blocks (handles = fichiers .liquid)
  const blocks = [
    {
      id: "announcement-premium",
      title: "Premium Announcement Bar",
      description: "Animated or multilingual bar to grab attention.",
      template: "index",
      preview: <PreviewAnnouncementBar />,
    },
    {
      id: "popup-premium",
      title: "Premium Popup",
      description: "Modern popup with promo code and glow animation.",
      template: "index",
      preview: <PreviewPopup />,
    },
    {
      id: "timer-premium",
      title: "Premium Countdown",
      description: "Three dynamic countdown styles.",
      template: "index",
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
            background: "linear-gradient(120deg, #1f1f1f 30%, #2c2c2c 50%, #444 70%)",
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
          <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                background: "#fff",
                color: "#111",
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
              <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>{block.title}</h2>
              <p style={{ marginBottom: "12px", color: "#555" }}>{block.description}</p>

              {/* 🔗 Lien absolu vers l’éditeur + insertion automatique de SECTION */}
              <a
                href={makeThemeEditorLink({
                  shopSub,
                  template: block.template || "index",
                  extensionId,
                  handle: block.id,
                })}
                target="_top"
                rel="noreferrer"
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

      {/* Pricing au centre en bas */}
      <a href={pricingHref} style={{ textDecoration: "none" }}>
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
            cursor: "pointer",
            zIndex: 999,
          }}
        >
          Pricing
        </button>
      </a>

      {/* YouTube en bas à droite */}
      <a
        href={YOUTUBE_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          textDecoration: "none",
          zIndex: 999,
        }}
        aria-label="YouTube tutorial"
      >
        <button
          style={{
            ...BUTTON_BASE,
            backgroundColor: "#000",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "30px",
            cursor: "pointer",
          }}
        >
          YouTube
        </button>
      </a>

      {/* WhatsApp en bas à gauche */}
      <a
        href="https://wa.me/+212630079763"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: "24px",
          left: "24px",
          backgroundColor: "#000",
          borderRadius: "50%",
          padding: "14px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 999,
        }}
        aria-label="WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#fff" viewBox="0 0 448 512">
          <path d="M380.9 97.1C339.4 55.6 283.3 32 224 32S108.6 55.6 67.1 97.1C25.6 138.6 2 194.7 2 254c0 45.3 13.5 89.3 39 126.7L0 480l102.6-38.7C140 481.5 181.7 494 224 494c59.3 0 115.4-23.6 156.9-65.1C422.4 370.6 446 314.5 446 254s-23.6-115.4-65.1-156.9zM224 438c-37.4 0-73.5-11.1-104.4-32l-7.4-4.9-61.8 23.3 23.2-60.6-4.9-7.6C50.1 322.9 38 289.1 38 254c0-102.6 83.4-186 186-186s186 83.4 186 186-83.4 186-186 186zm101.5-138.6c-5.5-2.7-32.7-16.1-37.8-17.9-5.1-1.9-8.8-2.7-12.5 2.7s-14.3 17.9-17.5 21.6c-3.2 3.7-6.4 4.1-11.9 1.4s-23.2-8.5-44.2-27.1c-16.3-14.5-27.3-32.4-30.5-37.9-3.2-5.5-.3-8.5 2.4-11.2 2.5-2.5 5.5-6.4 8.3-9.6 2.8-3.2 3.7-5.5 5.5-9.2s.9-6.9-.5-9.6c-1.4-2.7-12.5-30.1-17.2-41.3-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.6 1.4-14.6 6.9-19.2 18.7-19.2 45.7 19.7 53 22.4 56.7c2.7 3.7 38.6 59.1 93.7 82.8 13.1 5.7 23.3 9.1 31.3 11.7 13.1 4.2 25.1 3.6 34.6 2.2 10.5-1.6 32.7-13.4 37.3-26.3 4.6-12.7 4.6-23.5 3.2-25.7-1.4-2.2-5-3.6-10.5-6.2z"/>
        </svg>
      </a>
    </>
  );
}
