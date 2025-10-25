// app/routes/settings.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

/* ==============================
   LOADER: shop + plan + API KEY
================================ */
export const loader = async ({ request }) => {
  const { authenticate, PLAN_HANDLES } = await import("../shopify.server");
  const REQUIRED_PLANS = [PLAN_HANDLES.monthly, PLAN_HANDLES.annual];

  const { billing, session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const qs = url.searchParams.toString();

  try {
    await billing.require({ plans: REQUIRED_PLANS });
  } catch {
    return redirect(`/pricing?${qs}`);
  }

  const shopDomain = session.shop || "";
  const shopSub = shopDomain.replace(".myshopify.com", "");
  const apiKey = process.env.SHOPIFY_API_KEY || "";

  return json({ shopSub, apiKey });
};

/* ==============================
   UI & styles (unchanged)
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
   Deep link helpers (fixed)
   👉 addAppBlockId = {API_KEY}/{handle}
================================ */
function editorBase({ shopSub }) {
  return `https://admin.shopify.com/store/${shopSub}/themes/current/editor`;
}
function makeAddBlockLink({
  shopSub,
  apiKey,
  template = "index",
  handle,
  target = "newAppsSection",
}) {
  const base = editorBase({ shopSub });
  const p = new URLSearchParams({
    context: "apps",
    template,
    addAppBlockId: `${apiKey}/${handle}`,
    target,
    enable_app_theme_extension_dev_preview: "1",
  });
  return `${base}?${p.toString()}`;
}

/* ==============================
   Your components (existing)
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
          Go to your <strong>Theme Editor</strong> and click{" "}
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

/* ====== Existing countdown ====== */
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
   🔥 New block previews
================================ */

/** 1) Social icons — real brand colors */
function PreviewSocialIcons() {
  const Base = ({ children, title, href = "#", bg }) => (
    <a
      href={href}
      title={title}
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        background: bg,
        boxShadow: "0 6px 14px rgba(0,0,0,.2)",
        transition: "transform .15s ease, boxShadow .15s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      aria-label={title}
    >
      {children}
    </a>
  );

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      {/* Instagram (official gradient) */}
      <Base
        title="Instagram"
        bg="radial-gradient(45% 45% at 30% 30%, #feda77 0%, #f58529 25%, #dd2a7b 55%, #8134af 75%, #515BD4 100%)"
      >
        {/* Simple white camera over the gradient */}
        <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true">
          <rect x="10" y="10" width="44" height="44" rx="12" ry="12" fill="none" stroke="#fff" strokeWidth="4" />
          <circle cx="32" cy="32" r="10" fill="none" stroke="#fff" strokeWidth="4" />
          <circle cx="46" cy="18" r="3" fill="#fff" />
        </svg>
      </Base>

      {/* YouTube (red #FF0000) */}
      <Base title="YouTube" bg="#FF0000">
        <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
          <rect x="8" y="18" width="48" height="28" rx="8" ry="8" fill="none" stroke="#fff" strokeWidth="4" />
          <polygon points="30,24 44,32 30,40" fill="#fff" />
        </svg>
      </Base>

      {/* Facebook (blue #1877F2) */}
      <Base title="Facebook" bg="#1877F2">
        {/* stylized white “f” */}
        <svg width="22" height="22" viewBox="0 0 64 64" aria-hidden="true">
          <path
            d="M40 12H33c-7 0-11 4.3-11 11v7h-6v9h6v13h10V39h7l2-9h-9v-5c0-2.6 1.3-4 4-4h6V12z"
            fill="#fff"
          />
        </svg>
      </Base>

      {/* X (black) */}
      <Base title="X" bg="#000000">
        {/* white X (two diagonals) */}
        <svg width="24" height="24" viewBox="0 0 64 64" aria-hidden="true">
          <path d="M14 14 L50 50" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
          <path d="M50 14 L14 50" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </Base>

      {/* TikTok (black background, white note + cyan/pink accents) */}
      <Base title="TikTok" bg="#000000">
        <svg width="24" height="24" viewBox="0 0 64 64" aria-hidden="true">
          {/* stem (white) */}
          <path d="M28 16 v22 a10 10 0 1 1 -6 -9" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
          {/* cyan accent */}
          <path d="M28 22 a12 12 0 0 0 12 8" fill="none" stroke="#69C9D0" strokeWidth="6" strokeLinecap="round" />
          {/* pink accent */}
          <path d="M22 39 a10 10 0 0 1 6 -3" fill="none" stroke="#EE1D52" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </Base>

      {/* LinkedIn (blue #0A66C2) */}
      <Base title="LinkedIn" bg="#0A66C2">
        <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true">
          <rect x="12" y="12" width="40" height="40" rx="6" fill="none" stroke="#fff" strokeWidth="3" />
          {/* simplified “in” */}
          <circle cx="22" cy="31" r="3" fill="#fff" />
          <rect x="19" y="36" width="6" height="12" fill="#fff" rx="1" />
          <rect x="30" y="30" width="6" height="18" fill="#fff" rx="1" />
          <path d="M36 36 c0-3 2-6 6-6 s6 3 6 6 v12 h-6 v-10 c0-1.7-1.3-3-3-3 s-3 1.3-3 3 v10 h-6 V36" fill="#fff" />
        </svg>
      </Base>
    </div>
  );
}

/** 2) WhatsApp Sticky button (standalone block) */
function PreviewWhatsAppSticky() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          position: "relative",
          width: 64,
          height: 64,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 35%, rgba(255,255,255,.25), transparent 60%), #25D366",
          boxShadow: "0 10px 20px rgba(0,0,0,.15)",
          display: "grid",
          placeItems: "center",
        }}
        title="Sticky WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 448 512" fill="#fff">
          <path d="M380.9 97.1C339.4 55.6 283.3 32 224 32S108.6 55.6 67.1 97.1C25.6 138.6 2 194.7 2 254c0 45.3 13.5 89.3 39 126.7L0 480l102.6-38.7C140 481.5 181.7 494 224 494c59.3 0 115.4-23.6 156.9-65.1C422.4 370.6 446 314.5 446 254s-23.6-115.4-65.1-156.9z" />
        </svg>
      </div>
      <div>
        <div style={{ fontWeight: 700 }}>WhatsApp Sticky Button</div>
        <div style={{ color: "#555" }}>Quick contact — bottom corner (mobile & desktop)</div>
      </div>
    </div>
  );
}

/** 3) Circular image scroller (auto scroll) */
function PreviewCircleScroller() {
  const imgs = [
    "https://picsum.photos/seed/a/200",
    "https://picsum.photos/seed/b/200",
    "https://picsum.photos/seed/c/200",
    "https://picsum.photos/seed/d/200",
    "https://picsum.photos/seed/e/200",
  ];
  return (
    <div style={{ overflowX: "auto", display: "flex", gap: 12, paddingBottom: 6 }}>
      {imgs.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`circle-${i}`}
          width={88}
          height={88}
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            boxShadow: "0 4px 10px rgba(0,0,0,.12)",
            border: "2px solid rgba(0,0,0,.06)",
          }}
          loading="lazy"
          decoding="async"
        />
      ))}
    </div>
  );
}

// --- Admin preview styled like your "Gold Selection" — compact (3 cards aligned)
function PreviewGoldProductsStoreLike() {
  const items = [
    { title: "Elegant waterproof crossbody bag (anti-theft, USB charging)", price: "Dh 190.00 MAD", img: "https://picsum.photos/seed/gold1/800/600" },
    { title: "M10 TWS Wireless Earbuds",                                   price: "Dh 80.00 MAD",  img: "https://picsum.photos/seed/gold2/800/600" },
    { title: "Bulb camera WiFi HD 360° with remote control",                price: "Dh 185.00 MAD", img: "https://picsum.photos/seed/gold3/800/600" },
  ];

  return (
    <div style={{ padding: 10, borderRadius: 8, background: "#fff", border: "1px solid #eee" }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>Gold Products</div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 10,
          width: "100%",
        }}
      >
        {items.map((p, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 6px 12px rgba(0,0,0,.06)",
              border: "1px solid #e5e7eb",
            }}
          >
            {/* Smaller image */}
            <img
              src={p.img}
              alt={p.title}
              width={600}
              height={400}
              style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }}
              loading="lazy"
              decoding="async"
            />

            {/* Compact gold/beige band */}
            <div
              style={{
                background: "linear-gradient(0deg,#E9DFC8,#F1E6CF)",
                padding: "8px 10px",
                borderTop: "1px solid #e6d9b8",
                minHeight: 66,
              }}
            >
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "#1f2937",
                  lineHeight: 1.3,
                  marginBottom: 6,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {p.title}
              </div>

              <div style={{ fontSize: 12.5, fontWeight: 800, color: "#1f2937" }}>{p.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==============================
   PAGE: Settings
================================ */
export default function Settings() {
  const { shopSub, apiKey } = useLoaderData();
  const [lang, setLang] = useState("en");
  const location = useLocation();

  const pricingHref = useMemo(() => `/pricing${location.search || ""}`, [location.search]);
  const YOUTUBE_URL = "https://youtu.be/UJzd4Re21e0";

  // Existing blocks + new ones (same card UI)
  const blocks = [
    // === EXISTING ===
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

    // === NEW (under the first 3) ===
    // 1) Social icons
    {
      id: "social-icons-premium",
      title: "Social Icons",
      description: "Social icons with hover and clean style.",
      template: "index",
      preview: <PreviewSocialIcons />,
    },
    // 2) WhatsApp Sticky (standalone block)
    {
      id: "whatsapp-sticky-premium",
      title: "WhatsApp Sticky Button",
      description: "Floating quick-contact button (bottom corner).",
      template: "index",
      preview: <PreviewWhatsAppSticky />,
    },
    // 3) Circular image carousel
    {
      id: "circle-scroller-premium",
      title: "Circle Image Scroller",
      description: "Horizontal carousel of circular images (stories look).",
      template: "index",
      preview: <PreviewCircleScroller />,
    },
    // 4) Gold products showcase
    {
      id: "gold-products-premium",
      title: "Gold Products Showcase (Premium)",
      description: "Gold-style product grid from a collection.",
      template: "index",
      preview: <PreviewGoldProductsStoreLike />
    }
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
          <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}></div>
        </div>

        {blocks.map((block) => (
          <div key={block.id} style={CARD_STYLE}>
            <div style={{ flex: 1, minWidth: "220px" }}>
              <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>{block.title}</h2>
              <p style={{ marginBottom: "12px", color: "#555" }}>{block.description}</p>

              {/* ✅ Deep link: addAppBlockId = API_KEY/HANDLE */}
              <a
                href={makeAddBlockLink({
                  shopSub,
                  apiKey,
                  template: block.template || "index",
                  handle: block.id,
                  target: "newAppsSection",
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

      {/* Pricing button (center bottom) */}
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

      {/* YouTube button (bottom right) */}
      <a
        href={"https://youtu.be/UJzd4Re21e0"}
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

      {/* Global WhatsApp (existing). The “whatsapp-sticky-premium” block is separate */}
      <a
        href="https://wa.me/+212681570887"
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
