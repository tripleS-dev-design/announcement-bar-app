// app/routes/settings.jsx
import React, { useState, useEffect } from "react";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

/* ==============================
   LOADER: shop + API KEY (NO BILLING)
================================ */
export const loader = async ({ request }) => {
  const { authenticate } = await import("../shopify.server");

  const { session } = await authenticate.admin(request);

  const shopDomain = session.shop || "";
  const shopSub = shopDomain.replace(".myshopify.com", "");
  const apiKey = process.env.SHOPIFY_API_KEY || "";

  return json({ shopSub, apiKey });
};

/* ==============================
   COPY / LANGUES
================================ */

const LANG_OPTIONS = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
  { code: "de", label: "Deutsch" },
  { code: "ar", label: "العربية" },
];

const COPY = {
  en: {
    langLabel: "Language",
    heroTitle: "Triple Announcement Bar & Blocks",
    heroLine:
      "Set up premium bars, popups, countdowns, social icons, WhatsApp, image scroller and gold grid in a few clicks.",
    heroQuote:
      "Make your theme more engaging without writing a single line of code.",
    openingTitle: "How to use the premium blocks",
    openingLine1:
      "Open your Theme Editor and click “Add section” or “Add block” in the Apps area.",
    openingLine2:
      "Add any premium block, then customize text, colors and timing as you like.",
    openingButton: "Got it!",
    addBlockCta: "Add premium block",
    infoCta: "Suggest a block",
    comingSoonTitle: "New blocks in production",
    comingSoonItems: [
      "Product page enhancements (sticky ATC, badges, specs)",
      "FAQ / Accordion",
      "Stock / urgency bar",
      "Bundles & volume discounts",
      "Product tabs & specs",
    ],
    comingSoonFooter:
      "We ship new blocks regularly. Tell us what you would like next.",
    youtubeLabel: "YouTube",
    chatLabel: "Chat",
  },
  fr: {
    langLabel: "Langue",
    heroTitle: "Triple Announcement Bar & Blocs",
    heroLine:
      "Ajoutez des barres d’annonce, popups, compteurs, icônes sociales, WhatsApp, scroller d’images et grille dorée en quelques clics.",
    heroQuote:
      "Rendez votre thème plus engageant sans écrire une seule ligne de code.",
    openingTitle: "Comment utiliser les blocs Premium",
    openingLine1:
      "Ouvrez l’éditeur de thème et cliquez sur « Ajouter une section » ou « Ajouter un bloc » dans la zone Applications.",
    openingLine2:
      "Ajoutez un bloc premium, puis personnalisez le texte, les couleurs et le timing comme vous le souhaitez.",
    openingButton: "Compris !",
    addBlockCta: "Ajouter le bloc premium",
    infoCta: "Suggérer un bloc",
    comingSoonTitle: "Nouveaux blocs en préparation",
    comingSoonItems: [
      "Améliorations page produit (ATC sticky, badges, fiches)",
      "FAQ / Accordéon",
      "Barre de stock / urgence",
      "Bundles & remises de volume",
      "Onglets produit & caractéristiques",
    ],
    comingSoonFooter:
      "Nous publions régulièrement de nouveaux blocs. Dites-nous ce que vous voulez voir ensuite.",
    youtubeLabel: "YouTube",
    chatLabel: "Chat",
  },
  es: {
    langLabel: "Idioma",
    heroTitle: "Triple Announcement Bar & Bloques",
    heroLine:
      "Configura barras de anuncio, popups, contadores, iconos sociales, WhatsApp, carrusel circular e incluso una cuadrícula dorada en pocos clics.",
    heroQuote:
      "Haz tu tema más llamativo sin escribir nada de código.",
    openingTitle: "Cómo usar los bloques Premium",
    openingLine1:
      "Abre el editor de tema y haz clic en “Agregar sección” o “Agregar bloque” en el área de aplicaciones.",
    openingLine2:
      "Añade un bloque premium y personaliza texto, colores y tiempo como quieras.",
    openingButton: "Entendido",
    addBlockCta: "Añadir bloque premium",
    infoCta: "Sugerir un bloque",
    comingSoonTitle: "Nuevos bloques en camino",
    comingSoonItems: [
      "Mejoras en la página de producto (ATC fijo, badges, specs)",
      "FAQ / Acordeón",
      "Barra de stock / urgencia",
      "Bundles y descuentos por volumen",
      "Pestañas y especificaciones de producto",
    ],
    comingSoonFooter:
      "Publicamos nuevos bloques con frecuencia. Cuéntanos qué necesitas.",
    youtubeLabel: "YouTube",
    chatLabel: "Chat",
  },
  it: {
    langLabel: "Lingua",
    heroTitle: "Triple Announcement Bar & Blocchi",
    heroLine:
      "Aggiungi barre annuncio, popup, countdown, icone social, WhatsApp, scroller di immagini e griglia dorata in pochi clic.",
    heroQuote:
      "Rendi il tuo tema più coinvolgente senza scrivere codice.",
    openingTitle: "Come usare i blocchi Premium",
    openingLine1:
      "Apri il Theme Editor e clicca su “Aggiungi sezione” o “Aggiungi blocco” nell’area App.",
    openingLine2:
      "Aggiungi un blocco premium e personalizza testi, colori e tempi.",
    openingButton: "Ho capito",
    addBlockCta: "Aggiungi blocco premium",
    infoCta: "Suggerisci un blocco",
    comingSoonTitle: "Nuovi blocchi in arrivo",
    comingSoonItems: [
      "Migliorie pagina prodotto (ATC fisso, badge, schede)",
      "FAQ / Accordion",
      "Barra stock / urgenza",
      "Bundle e sconti quantità",
      "Tab e specifiche prodotto",
    ],
    comingSoonFooter:
      "Rilasciamo nuovi blocchi di continuo. Dicci cosa ti serve.",
    youtubeLabel: "YouTube",
    chatLabel: "Chat",
  },
  de: {
    langLabel: "Sprache",
    heroTitle: "Triple Announcement Bar & Blöcke",
    heroLine:
      "Füge Ankündigungsleisten, Popups, Countdowns, Social Icons, WhatsApp, Bild-Scroller und Gold-Produktgitter in wenigen Klicks hinzu.",
    heroQuote:
      "Mach dein Theme ansprechender – ganz ohne Code.",
    openingTitle: "So verwendest du die Premium-Blöcke",
    openingLine1:
      "Öffne den Theme-Editor und klicke auf „Abschnitt hinzufügen“ oder „Block hinzufügen“ im Apps-Bereich.",
    openingLine2:
      "Füge einen Premium-Block hinzu und passe Text, Farben und Timing an.",
    openingButton: "Alles klar",
    addBlockCta: "Premium-Block hinzufügen",
    infoCta: "Block vorschlagen",
    comingSoonTitle: "Neue Blöcke in Entwicklung",
    comingSoonItems: [
      "Produktseiten-Verbesserungen (Sticky ATC, Badges, Specs)",
      "FAQ / Akkordeon",
      "Bestands- / Dringlichkeitsleiste",
      "Bundles & Mengenrabatte",
      "Produkt-Tabs & Spezifikationen",
    ],
    comingSoonFooter:
      "Wir veröffentlichen regelmäßig neue Blöcke. Sag uns, was dir fehlt.",
    youtubeLabel: "YouTube",
    chatLabel: "Chat",
  },
  ar: {
    langLabel: "اللغة",
    heroTitle: "Triple Announcement Bar & Blocks",
    heroLine:
      "أضف شريط إعلان، نوافذ منبثقة، عدّ تنازلي، أيقونات اجتماعية، واتساب، سكرول دائري و شبكة منتجات ذهبية بسهولة.",
    heroQuote:
      "اجعل متجر Shopify أكثر جاذبية بدون كتابة كود.",
    openingTitle: "طريقة استخدام البلوكات البريميوم",
    openingLine1:
      "افتح محرر القالب ثم اختر «إضافة قسم» أو «إضافة بلوك» داخل قسم التطبيقات.",
    openingLine2:
      "اختر أي بلوك بريميوم ثم عدّل النصوص والألوان والتوقيت كما تريد.",
    openingButton: "فهمت",
    addBlockCta: "إضافة بلوك بريميوم",
    infoCta: "اقترح بلوك جديد",
    comingSoonTitle: "بلوكات جديدة قيد التطوير",
    comingSoonItems: [
      "تحسينات صفحة المنتج (زر ثابت، شارات، مواصفات)",
      "أسئلة شائعة / أكورديون",
      "شريط المخزون / الإلحاح",
      "بندلات وخصومات كمية",
      "تبويبات المنتج والمواصفات",
    ],
    comingSoonFooter:
      "نضيف بلوكات جديدة باستمرار، شاركنا أفكارك.",
    youtubeLabel: "YouTube",
    chatLabel: "Chat",
  },
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
@keyframes pulseSoft { 0%{opacity:.6} 50%{opacity:1} 100%{opacity:.6} }
`;

/* ✅ Two-per-row grid (desktop) */
const GRID_STYLE = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "24px",
};

/* ==============================
   Deep link helpers
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
   Components
================================ */

function OpeningPopup({ lang }) {
  const [visible, setVisible] = useState(true);
  const t = COPY[lang] || COPY.en;

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
        <h2 style={{ marginBottom: "16px", fontSize: "22px" }}>{t.openingTitle}</h2>
        <p style={{ marginBottom: "12px", fontSize: "16px", color: "#ddd" }}>
          {t.openingLine1}
        </p>
        <p style={{ marginBottom: "24px", fontSize: "14px", color: "#ccc" }}>
          {t.openingLine2}
        </p>
        <button
          onClick={() => setVisible(false)}
          style={{ ...BUTTON_BASE, backgroundColor: "#fff", color: "#000" }}
        >
          {t.openingButton}
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
      text: "Limited-time sale! Enjoy up to 50% off on your favorite items.",
      buttonText: "Shop now",
      link: "#",
    },
    {
      bg: "linear-gradient(to right, #0f38ef, #89ffe1)",
      color: "#fff",
      text: "Flash sale alert! Everything must go – save big before it’s gone.",
      buttonText: "Grab deal",
      link: "#",
    },
    {
      bg: "linear-gradient(to right, #13eb28, #a3e8ec)",
      color: "#000",
      text: "Clearance – prices slashed! Don’t miss out on major savings.",
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
        borderLeft: "6px solid #3b82f6", // ✅ corrigé
        borderRadius: "12px",
        animation: visible ? "popupGlowPro 0.5s infinite ease-in-out" : "none",
      }}
    >
      <h3 style={{ marginBottom: "8px", color: "#1e40af" }}>🎁 Exclusive offer</h3>
      <p style={{ margin: 0, fontSize: "14px", color: "#1e3a8a" }}>
        Get <strong>20% OFF</strong> with code{" "}
        <strong
          style={{
            backgroundColor: "#93c5fd",
            padding: "2px 4px",
            borderRadius: "4px",
          }}
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
        Apply now
      </button>
    </div>
  );
}

/* ====== Countdown ====== */

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
      border: "3px solid #2b6cb0", // ✅ corrigé
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
            style={{
              ...BUTTON_BASE,
              backgroundColor: "#000",
              color: "#fff",
              padding: "8px 16px",
            }}
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
}

/* ====== Social Icons ====== */

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
        transition: "transform .15s ease, box-shadow .15s ease",
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
      <Base
        title="Instagram"
        bg="radial-gradient(45% 45% at 30% 30%, #feda77 0%, #f58529 25%, #dd2a7b 55%, #8134af 75%, #515BD4 100%)"
      >
        <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true">
          <rect
            x="10"
            y="10"
            width="44"
            height="44"
            rx="12"
            ry="12"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
          />
          <circle
            cx="32"
            cy="32"
            r="10"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
          />
          <circle cx="46" cy="18" r="3" fill="#fff" />
        </svg>
      </Base>

      <Base title="YouTube" bg="#FF0000">
        <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
          <rect
            x="8"
            y="18"
            width="48"
            height="28"
            rx="8"
            ry="8"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
          />
          <polygon points="30,24 44,32 30,40" fill="#fff" />
        </svg>
      </Base>

      <Base title="Facebook" bg="#1877F2">
        <svg width="22" height="22" viewBox="0 0 64 64" aria-hidden="true">
          <path
            d="M40 12H33c-7 0-11 4.3-11 11v7h-6v9h6v13h10V39h7l2-9h-9v-5c0-2.6 1.3-4 4-4h6V12z"
            fill="#fff"
          />
        </svg>
      </Base>

      <Base title="X" bg="#000000">
        <svg width="24" height="24" viewBox="0 0 64 64" aria-hidden="true">
          <path d="M14 14 L50 50" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
          <path d="M50 14 L14 50" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </Base>

      <Base title="TikTok" bg="#000000">
        <svg width="24" height="24" viewBox="0 0 64 64" aria-hidden="true">
          <path
            d="M28 16 v22 a10 10 0 1 1 -6 -9"
            fill="none"
            stroke="#fff"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M28 22 a12 12 0 0 0 12 8"
            fill="none"
            stroke="#69C9D0"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M22 39 a10 10 0 0 1 6 -3"
            fill="none"
            stroke="#EE1D52"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </Base>

      <Base title="LinkedIn" bg="#0A66C2">
        <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true">
          <rect
            x="12"
            y="12"
            width="40"
            height="40"
            rx="6"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
          />
          <circle cx="22" cy="31" r="3" fill="#fff" />
          <rect x="19" y="36" width="6" height="12" fill="#fff" rx="1" />
          <rect x="30" y="30" width="6" height="18" fill="#fff" rx="1" />
          <path
            d="M36 36 c0-3 2-6 6-6 s6 3 6 6 v12 h-6 v-10 c0-1.7-1.3-3-3-3 s-3 1.3-3 3 v10 h-6 V36"
            fill="#fff"
          />
        </svg>
      </Base>
    </div>
  );
}

/* ====== WhatsApp Sticky ====== */

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 448 512"
          fill="#fff"
        >
          <path d="M380.9 97.1C339.4 55.6 283.3 32 224 32S108.6 55.6 67.1 97.1C25.6 138.6 2 194.7 2 254c0 45.3 13.5 89.3 39 126.7L0 480l102.6-38.7C140 481.5 181.7 494 224 494c59.3 0 115.4-23.6 156.9-65.1C422.4 370.6 446 314.5 446 254s-23.6-115.4-65.1-156.9z" />
        </svg>
      </div>
      <div>
        <div style={{ fontWeight: 700 }}>WhatsApp Sticky Button</div>
        <div style={{ color: "#555" }}>
          Quick contact — bottom corner (mobile & desktop)
        </div>
      </div>
    </div>
  );
}

/* ====== Circle Image Scroller ====== */

function PreviewCircleScroller() {
  const imgs = [
    "https://picsum.photos/seed/a/200",
    "https://picsum.photos/seed/b/200",
    "https://picsum.photos/seed/c/200",
    "https://picsum.photos/seed/d/200",
    "https://picsum.photos/seed/e/200",
  ];
  return (
    <div
      style={{
        overflowX: "auto",
        display: "flex",
        gap: 12,
        paddingBottom: 6,
      }}
    >
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

/* ====== Gold Products ====== */

function PreviewGoldProductsStoreLike() {
  const items = [
    {
      title: "Elegant waterproof crossbody bag (anti-theft, USB charging)",
      price: "Dh 190.00 MAD",
      img: "https://picsum.photos/seed/gold1/800/600",
    },
    {
      title: "M10 TWS Wireless Earbuds",
      price: "Dh 80.00 MAD",
      img: "https://picsum.photos/seed/gold2/800/600",
    },
    {
      title: "Bulb camera WiFi HD 360° with remote control",
      price: "Dh 185.00 MAD",
      img: "https://picsum.photos/seed/gold3/800/600",
    },
  ];

  return (
    <div
      style={{
        padding: 10,
        borderRadius: 8,
        background: "#fff",
        border: "1px solid #eee",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
        Gold Products
      </div>

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
            <img
              src={p.img}
              alt={p.title}
              width={600}
              height={400}
              style={{
                width: "100%",
                height: 140,
                objectFit: "cover",
                display: "block",
              }}
              loading="lazy"
              decoding="async"
            />
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
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: "#1f2937",
                }}
              >
                {p.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ====== Coming Soon Info Card ====== */

function PreviewComingSoon({ lang }) {
  const t = COPY[lang] || COPY.en;

  return (
    <div
      style={{
        width: "100%",
        padding: 14,
        borderRadius: 12,
        border: "1px dashed #e5e7eb",
        background:
          "linear-gradient(90deg, rgba(249,250,251,1) 0%, rgba(245,246,248,1) 50%, rgba(249,250,251,1) 100%)",
        backgroundSize: "600px 100%",
        animation: "shimmer 2.4s infinite linear",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#000",
            color: "#fff",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
          }}
          aria-hidden
        >
          ✨
        </span>
        <div style={{ fontWeight: 800 }}>{t.comingSoonTitle}</div>
      </div>

      <ul
        style={{
          margin: 0,
          paddingLeft: 18,
          color: "#374151",
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        {t.comingSoonItems.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <div
        style={{
          marginTop: 10,
          fontSize: 12,
          color: "#6b7280",
        }}
      >
        {t.comingSoonFooter}
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
  const t = COPY[lang] || COPY.en;

  // Blocks list
  const blocks = [
    {
      id: "announcement-premium",
      title: "Premium Announcement Bar",
      description: "Animated or multilingual bar to grab attention.",
      template: "index",
      preview: <PreviewAnnouncementBar />,
      kind: "installable",
    },
    {
      id: "popup-premium",
      title: "Premium Popup",
      description: "Modern popup with promo code and glow animation.",
      template: "index",
      preview: <PreviewPopup />,
      kind: "installable",
    },
    {
      id: "timer-premium",
      title: "Premium Countdown",
      description: "Three dynamic countdown styles.",
      template: "index",
      preview: <PreviewCountdown />,
      kind: "installable",
    },
    {
      id: "social-icons-premium",
      title: "Social Icons",
      description: "Social icons with hover and clean style.",
      template: "index",
      preview: <PreviewSocialIcons />,
      kind: "installable",
    },
    {
      id: "whatsapp-sticky-premium",
      title: "WhatsApp Sticky Button",
      description: "Floating quick-contact button (bottom corner).",
      template: "index",
      preview: <PreviewWhatsAppSticky />,
      kind: "installable",
    },
    {
      id: "circle-scroller-premium",
      title: "Circle Image Scroller",
      description: "Horizontal carousel of circular images (stories look).",
      template: "index",
      preview: <PreviewCircleScroller />,
      kind: "installable",
    },
    {
      id: "gold-products-premium",
      title: "Gold Products Showcase (Premium)",
      description: "Gold-style product grid from a collection.",
      template: "index",
      preview: <PreviewGoldProductsStoreLike />,
      kind: "installable",
    },
    {
      id: "coming-soon-info",
      title: "More blocks coming soon",
      description: "We add new blocks regularly. Tell us what you want next.",
      template: "index",
      preview: null, // géré plus bas via <PreviewComingSoon lang={lang} />
      kind: "info",
    },
  ];

  // CTA handlers
  const openTawk = () => {
    try {
      if (
        typeof window !== "undefined" &&
        window.Tawk_API &&
        typeof window.Tawk_API.maximize === "function"
      ) {
        window.Tawk_API.maximize();
        return;
      }
    } catch (e) {
      // ignore
    }
    if (typeof window !== "undefined") {
      window.location.href =
        "mailto:triple.s.dev.design@gmail.com?subject=Block%20request";
    }
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      {/* ✅ Mobile CSS only */}
      <style>{`
        @media (max-width: 768px){
          .settings-container{
            max-width: 100% !important;
            padding: 12px !important;
            transform: none !important;
          }
          .cards-grid{
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .settings-root img,
          .settings-root video,
          .settings-root iframe{
            max-width: 100%;
            height: auto;
            display: block;
          }
          .fixed-btn{
            bottom: calc(16px + env(safe-area-inset-bottom)) !important;
            z-index: 2147483647 !important;
          }
          .fixed-btn.pricing{
            bottom: calc(72px + env(safe-area-inset-bottom)) !important;
          }
          .fixed-btn.youtube{ left: 16px !important; }
          .fixed-btn.chat{   right: 16px !important; }
        }
        @media (max-width: 380px){
          .fixed-btn.youtube{ display: none !important; }
        }
      `}</style>

      <OpeningPopup lang={lang} />

      <div className="settings-root">
        <div className="settings-container" style={CONTAINER_STYLE}>
          {/* Hero + sélecteur de langue */}
          <div
            style={{
              background:
                "linear-gradient(120deg, #1f1f1f 30%, #2c2c2c 50%, #444 70%)",
              backgroundSize: "800px 100%",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "32px",
              color: "#fff",
              animation: "shimmer 3s infinite linear",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <p style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
                {t.heroTitle}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, opacity: 0.85 }}>
                  {t.langLabel}:
                </span>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "999px",
                    border: "1px solid rgba(255,255,255,0.4)",
                    background: "rgba(0,0,0,0.3)",
                    color: "#fff",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {LANG_OPTIONS.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p
              style={{
                fontSize: "14px",
                marginTop: 4,
                marginBottom: 6,
                opacity: 0.9,
              }}
            >
              {t.heroLine}
            </p>
            <p
              style={{
                fontSize: "13px",
                margin: 0,
                opacity: 0.75,
                fontStyle: "italic",
              }}
            >
              “{t.heroQuote}”
            </p>
          </div>

          {/* Grid des blocs */}
          <div className="cards-grid" style={GRID_STYLE}>
            {blocks.map((block) => (
              <div key={block.id} style={{ ...CARD_STYLE, marginBottom: 0 }}>
                <div style={{ flex: 1, minWidth: "220px" }}>
                  <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>
                    {block.title}
                  </h2>
                  <p style={{ marginBottom: "12px", color: "#555" }}>
                    {block.description}
                  </p>

                  {block.kind === "installable" ? (
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
                        {t.addBlockCta}
                      </button>
                    </a>
                  ) : (
                    <button
                      onClick={openTawk}
                      style={{
                        ...BUTTON_BASE,
                        backgroundColor: "#111",
                        color: "#fff",
                      }}
                    >
                      {t.infoCta}
                    </button>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: "220px" }}>
                  {block.id === "coming-soon-info" ? (
                    <PreviewComingSoon lang={lang} />
                  ) : (
                    block.preview
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* YouTube (bottom-left) */}
        <a
          href={"https://youtu.be/NqKfbpymug8"}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "fixed",
            bottom: "24px",
            left: "24px",
            textDecoration: "none",
            zIndex: 999,
          }}
          aria-label="YouTube tutorial"
        >
          <button
            className="fixed-btn youtube"
            style={{
              ...BUTTON_BASE,
              backgroundColor: "#000",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "30px",
              cursor: "pointer",
            }}
          >
            {t.youtubeLabel}
          </button>
        </a>

        {/* Tawk chat launcher (bottom-right) */}
        <button
          className="fixed-btn chat"
          onClick={() => {
            try {
              if (
                typeof window !== "undefined" &&
                window.Tawk_API &&
                typeof window.Tawk_API.maximize === "function"
              ) {
                window.Tawk_API.maximize();
                return;
              }
            } catch (e) {
              // ignore
            }
            if (typeof window !== "undefined") {
              window.location.href =
                "mailto:triple.s.dev.design@gmail.com?subject=Support%20request";
            }
          }}
          aria-label="Chat support"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            ...BUTTON_BASE,
            backgroundColor: "#111",
            color: "#fff",
            borderRadius: "30px",
            zIndex: 999,
          }}
        >
          {t.chatLabel}
        </button>
      </div>

      {/* Tawk.to embed */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
  var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
  s1.async=true;
  s1.src='https://embed.tawk.to/68fd2c098f570d1956b50811/1j8ef81r3';
  s1.charset='UTF-8';
  s1.setAttribute('crossorigin','*');
  s0.parentNode.insertBefore(s1,s0);
})();
        `,
        }}
      />
    </>
  );
}
