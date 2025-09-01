import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "@remix-run/react";
import { redirect } from "@remix-run/node";

/* ========================
   Loader: accès premium
======================== */
export const loader = async ({ request }) => {
  const { authenticate, PLAN_HANDLES } = await import("../shopify.server");
  const REQUIRED_PLANS = [PLAN_HANDLES.monthly, PLAN_HANDLES.annual];
  const { billing } = await authenticate.admin(request);
  const url = new URL(request.url);
  const qs = url.searchParams.toString();

  try {
    await billing.require({ plans: REQUIRED_PLANS });
    return null;
  } catch {
    return redirect(`/pricing?${qs}`);
  }
};

/* ========================
   Styles
======================== */
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

/* =========================================
   Deep-link vers Theme Editor (store courant)
========================================= */
/** ⚠️ Mets le VRAI UUID de ton extension (fichier extensions/.../shopify.extension.toml → uuid="...") */
const THEME_EXTENSION_ID = "be79dab79ff6bb4be47d4e66577b6c50";

/** Base64 URL-safe → texte */
function b64UrlDecode(s) {
  try {
    let str = s.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    return atob(str);
  } catch {
    return "";
  }
}

/** Renvoie "https://{store}.myshopify.com/admin" à partir de ?host= */
function getAdminBaseFromHost(location) {
  const hostParam = new URLSearchParams(location.search || "").get("host");
  if (!hostParam) return null;
  const decoded = b64UrlDecode(hostParam); // "storename.myshopify.com/admin"
  if (!decoded) return null;
  const clean = decoded.replace(/\/+$/, "");
  return `https://${clean}`;
}

/* ========================
   UI de démo / préviews
======================== */
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
          <strong>Add block</strong> in the App section.
        </p>
        <p style={{ marginBottom: "24px", fontSize: "14px", color: "#ccc" }}>
          Choose any premium block: Announcement Bar, Popup, or Countdown.
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
      text: "Limited-Time Sale! Enjoy up to 50% off",
      buttonText: "Shop Now",
      link: "#",
    },
    {
      bg: "linear-gradient(to right, #0f38ef, #89ffe1)",
      color: "#fff",
      text: "Flash Sale! Everything Must Go!",
      buttonText: "Grab Deal",
      link: "#",
    },
    {
      bg: "linear-gradient(to right, #13eb28, #a3e8ec)",
      color: "#000",
      text: "Clearance — Don’t miss out!",
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
        Get <strong>20% OFF</strong> with code <strong>WELCOME20</strong>
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

// Countdown helpers
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

/* ========================
   Page Settings
======================== */
export default function Settings() {
  const [lang, setLang] = useState("en");
  const location = useLocation();

  const pricingHref = useMemo(() => `/pricing${location.search || ""}`, [location.search]);
  const YOUTUBE_URL = "https://youtu.be/UJzd4Re21e0";

  // ⚠️ id = handle EXACT du fichier section .liquid (sans .liquid)
  const blocks = [
    { id: "announcement-bar-premium", title: "Premium Announcement Bar", description: "Animated or multilingual bar to grab attention.", template: "index", type: "section", preview: <PreviewAnnouncementBar /> },
    { id: "popup-premium",            title: "Premium Popup",            description: "Modern popup with promo code and glow animation.", template: "index", type: "section", preview: <PreviewPopup /> },
    { id: "countdown-premium",        title: "Premium Countdown",        description: "Three dynamic countdown styles.",                template: "index", type: "section", preview: <PreviewCountdown /> },
  ];

  // ✅ Ouvre l’éditeur du thème sur le store courant (sans activateAppId si ce n’est pas un embed)
  const openThemeEditor = (block) => {
    const qs = new URLSearchParams();
    qs.set("context", "apps");
    qs.set("template", block.template || "index");

    if (block.type === "section") {
      qs.set("addAppSectionId", `${THEME_EXTENSION_ID}/${block.id}`);
    } else if (block.type === "block") {
      qs.set("addAppBlockId", `${THEME_EXTENSION_ID}/${block.id}`);
    } else if (block.type === "embed") {
      // Seulement si tu as VRAIMENT un App Embed :
      // qs.set("activateAppId", `${THEME_EXTENSION_ID}`);
    }

    const adminBase = getAdminBaseFromHost(location);
    const targetUrl = adminBase
      ? `${adminBase}/themes/current/editor?${qs.toString()}`
      : `/admin/themes/current/editor?${qs.toString()}`;

    window.top.location.href = targetUrl;
  };

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

              <button
                onClick={() => openThemeEditor(block)}
                style={{ ...BUTTON_BASE, backgroundColor: "#000", color: "#fff" }}
              >
                Add Premium Block
              </button>
            </div>
            <div style={{ flex: 1, minWidth: "220px" }}>{block.preview}</div>
          </div>
        ))}
      </div>

      {/* Pricing */}
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
    </>
  );
}
