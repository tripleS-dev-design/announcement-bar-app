// app/routes/settings.jsx
import { useState, useEffect, useRef } from "react";
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
   COPY / LANGUES (version enrichie pour l'IA)
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
    heroTitle: "AI Block Studio",
    heroLine: "Describe the block you need – our AI generates it instantly.",
    heroQuote: "No code, no templates. Just describe and install.",
    openingTitle: "How to use the AI Block Studio",
    openingLine1: "Type what you want in the chat below.",
    openingLine2: "Preview the block, then click 'Add to theme'.",
    openingExtraTitle: "Free help from our team",
    openingExtraLine: "Click the chat button or ask for free installation.",
    openingButton: "Got it!",
    // IA Interface
    aiPlaceholder: "Example: 'Red announcement bar with 50% off and link to /sale' or 'WhatsApp floating button with message Hello'",
    aiGenerateBtn: "✨ Generate",
    aiGenerating: "Generating...",
    aiPreviewTitle: "Live Preview",
    aiAddBtn: "➕ Add this block to theme",
    aiSuccessMsg: "Block added successfully! Refresh your theme editor.",
    aiErrorMessage: "Error generating block. Please try again.",
    // messages par défaut
    welcomeMessage: "👋 Welcome to AI Block Studio. Describe the block you want (announcement bar, popup, countdown, WhatsApp button, circle scroller, gold products...).",
    // Suggestions rapides
    quickSuggestions: ["Announcement bar -50%", "WhatsApp sticky with custom message", "Popup with promo code SUMMER20", "Gold product grid from collection 'featured'"],
    // labels pour les boutons flottants
    youtubeLabel: "YouTube",
    chatLabel: "Chat",
    // installation gratuite
    installPopupTitle: "Free installation",
    installPopupText: "We can install the blocks and adapt the design to your current theme — at no extra cost.",
    installPopupSubtext: "Click below and we’ll receive your request directly in support.",
    installPopupButton: "Ask for help",
    installPopupSupportMessage: "Hello, I would like a free installation of the AI-generated blocks and a design adjustment. Please contact me at ktami.sami@icloud.com. Thank you!",
  },
  fr: {
    langLabel: "Langue",
    heroTitle: "Studio de blocs IA",
    heroLine: "Décrivez le bloc dont vous avez besoin – notre IA le génère instantanément.",
    heroQuote: "Zéro code, zéro template. Décrivez et installez.",
    openingTitle: "Comment utiliser le Studio IA",
    openingLine1: "Tapez ce que vous voulez dans le chat ci-dessous.",
    openingLine2: "Prévisualisez le bloc, puis cliquez sur 'Ajouter au thème'.",
    openingExtraTitle: "Aide gratuite",
    openingExtraLine: "Cliquez sur le bouton chat ou demandez une installation gratuite.",
    openingButton: "Compris !",
    aiPlaceholder: "Exemple : 'Barre d'annonce rouge avec -50% et lien /soldes' ou 'Bouton WhatsApp flottant avec message Bonjour'",
    aiGenerateBtn: "✨ Générer",
    aiGenerating: "Génération...",
    aiPreviewTitle: "Aperçu en direct",
    aiAddBtn: "➕ Ajouter ce bloc au thème",
    aiSuccessMsg: "Bloc ajouté ! Actualisez l'éditeur de thème.",
    aiErrorMessage: "Erreur lors de la génération. Veuillez réessayer.",
    welcomeMessage: "👋 Bienvenue dans le Studio IA. Décrivez le bloc souhaité (barre d'annonce, popup, compte à rebours, bouton WhatsApp, scroller circulaire, produits dorés...).",
    quickSuggestions: ["Barre d'annonce -50%", "WhatsApp flottant message perso", "Popup code promo ETE20", "Grille produits dorés collection 'vedettes'"],
    youtubeLabel: "YouTube",
    chatLabel: "Chat",
    installPopupTitle: "Installation gratuite",
    installPopupText: "Nous pouvons installer les blocs pour vous et adapter le design à votre thème actuel – gratuitement.",
    installPopupSubtext: "Cliquez ci-dessous pour envoyer votre demande au support.",
    installPopupButton: "Demander de l'aide",
    installPopupSupportMessage: "Bonjour, je souhaite une installation gratuite des blocs générés par IA et un ajustement du design. Merci de me contacter sur ktami.sami@icloud.com.",
  },
  es: {
    langLabel: "Idioma",
    heroTitle: "Estudio de bloques IA",
    heroLine: "Describe el bloque que necesitas – nuestra IA lo genera al instante.",
    heroQuote: "Sin código, sin plantillas. Solo describe e instala.",
    openingTitle: "Cómo usar el Estudio IA",
    openingLine1: "Escribe lo que quieras en el chat.",
    openingLine2: "Vista previa y haz clic en 'Añadir al tema'.",
    openingExtraTitle: "Ayuda gratuita",
    openingExtraLine: "Haz clic en el botón de chat o solicita instalación gratuita.",
    openingButton: "Entendido",
    aiPlaceholder: "Ejemplo: 'Barra de anuncio roja con 50% de descuento y enlace a /ofertas' o 'Botón WhatsApp flotante con mensaje Hola'",
    aiGenerateBtn: "✨ Generar",
    aiGenerating: "Generando...",
    aiPreviewTitle: "Vista previa",
    aiAddBtn: "➕ Añadir bloque al tema",
    aiSuccessMsg: "Bloque añadido. Refresca el editor de tema.",
    aiErrorMessage: "Error al generar. Inténtalo de nuevo.",
    welcomeMessage: "👋 Bienvenido al Estudio IA. Describe el bloque que quieras.",
    quickSuggestions: ["Barra anuncio -50%", "WhatsApp flotante mensaje personalizado", "Popup código PROMO20", "Cuadrícula dorada colección 'destacados'"],
    youtubeLabel: "YouTube",
    chatLabel: "Chat",
    installPopupTitle: "Instalación gratuita",
    installPopupText: "Podemos instalar los bloques por ti y adaptar el diseño a tu tema actual – sin coste.",
    installPopupSubtext: "Haz clic para enviar tu solicitud al soporte.",
    installPopupButton: "Pedir ayuda",
    installPopupSupportMessage: "Hola, me gustaría una instalación gratuita de los bloques generados por IA y un ajuste de diseño. Contáctame en ktami.sami@icloud.com. Gracias.",
  },
  it: {
    langLabel: "Lingua",
    heroTitle: "Studio blocchi IA",
    heroLine: "Descrivi il blocco che ti serve – la nostra IA lo genera subito.",
    heroQuote: "Nessun codice, nessun modello. Descrivi e installa.",
    openingTitle: "Come usare lo Studio IA",
    openingLine1: "Scrivi cosa vuoi nella chat qui sotto.",
    openingLine2: "Anteprima e clicca su 'Aggiungi al tema'.",
    openingExtraTitle: "Assistenza gratuita",
    openingExtraLine: "Clicca sul pulsante chat o richiedi installazione gratuita.",
    openingButton: "Ok",
    aiPlaceholder: "Esempio: 'Barra annuncio rossa con -50% e link /saldi' o 'Pulsante WhatsApp flottante con messaggio Ciao'",
    aiGenerateBtn: "✨ Genera",
    aiGenerating: "Generazione...",
    aiPreviewTitle: "Anteprima",
    aiAddBtn: "➕ Aggiungi al tema",
    aiSuccessMsg: "Blocco aggiunto! Aggiorna l'editor del tema.",
    aiErrorMessage: "Errore. Riprova.",
    welcomeMessage: "👋 Benvenuto nello Studio IA. Descrivi il blocco che desideri.",
    quickSuggestions: ["Barra annuncio -50%", "WhatsApp flottante messaggio personalizzato", "Popup codice ESTATE20", "Griglia prodotti dorati da collezione"],
    youtubeLabel: "YouTube",
    chatLabel: "Chat",
    installPopupTitle: "Installazione gratuita",
    installPopupText: "Possiamo installare i blocchi per te e adattare il design – senza costi.",
    installPopupSubtext: "Clicca per inviare la richiesta al supporto.",
    installPopupButton: "Chiedi aiuto",
    installPopupSupportMessage: "Ciao, vorrei un'installazione gratuita dei blocchi IA e un adattamento del design. Contattami su ktami.sami@icloud.com. Grazie.",
  },
  de: {
    langLabel: "Sprache",
    heroTitle: "KI-Block-Studio",
    heroLine: "Beschreibe den gewünschten Block – unsere KI generiert ihn sofort.",
    heroQuote: "Kein Code, keine Vorlagen. Beschreiben und installieren.",
    openingTitle: "So nutzt du das KI-Studio",
    openingLine1: "Schreibe unten in den Chat, was du brauchst.",
    openingLine2: "Vorschau ansehen und dann 'Zum Thema hinzufügen' klicken.",
    openingExtraTitle: "Kostenlose Hilfe",
    openingExtraLine: "Klicke auf den Chat-Button oder fordere eine kostenlose Installation an.",
    openingButton: "Verstanden",
    aiPlaceholder: "Beispiel: 'Rote Ankündigungsleiste mit -50% und Link /sale' oder 'WhatsApp-Button mit Nachricht Hallo'",
    aiGenerateBtn: "✨ Generieren",
    aiGenerating: "Generiere...",
    aiPreviewTitle: "Vorschau",
    aiAddBtn: "➕ Block zum Theme hinzufügen",
    aiSuccessMsg: "Block hinzugefügt! Theme-Editor aktualisieren.",
    aiErrorMessage: "Fehler bei Generierung. Bitte erneut versuchen.",
    welcomeMessage: "👋 Willkommen im KI-Block-Studio. Beschreibe deinen Wunschblock.",
    quickSuggestions: ["Ankündigungsleiste -50%", "WhatsApp-Sticky mit eigener Nachricht", "Popup mit Code SOMMER20", "Gold-Produktgrid aus Kollektion"],
    youtubeLabel: "YouTube",
    chatLabel: "Chat",
    installPopupTitle: "Kostenlose Installation",
    installPopupText: "Wir installieren die Blöcke und passen das Design an – kostenlos.",
    installPopupSubtext: "Klicke, um deine Anfrage an den Support zu senden.",
    installPopupButton: "Hilfe anfordern",
    installPopupSupportMessage: "Hallo, ich möchte eine kostenlose Installation der KI-Blöcke und eine Designanpassung. Kontaktiere mich bitte unter ktami.sami@icloud.com. Danke.",
  },
  ar: {
    langLabel: "اللغة",
    heroTitle: "استوديو البلوكات بالذكاء الاصطناعي",
    heroLine: "صِف البلوك الذي تريده – الذكاء الاصطناعي يولّده فوراً.",
    heroQuote: "لا حاجة لكتابة كود أو قوالب. فقط صِف وثبّت.",
    openingTitle: "كيفية استخدام استوديو الذكاء الاصطناعي",
    openingLine1: "اكتب ما تريده في الدردشة أدناه.",
    openingLine2: "شاهد المعاينة ثم اضغط 'إضافة إلى القالب'.",
    openingExtraTitle: "مساعدة مجانية",
    openingExtraLine: "انقر على زر الدردشة أو اطلب تثبيتاً مجانياً.",
    openingButton: "فهمت",
    aiPlaceholder: "مثال: 'شريط إعلان أحمر بخصم 50% ورابط /تخفيضات' أو 'زر واتساب عائم برسالة مرحباً'",
    aiGenerateBtn: "✨ توليد",
    aiGenerating: "جاري التوليد...",
    aiPreviewTitle: "معاينة مباشرة",
    aiAddBtn: "➕ إضافة هذا البلوك إلى القالب",
    aiSuccessMsg: "تمت إضافة البلوك بنجاح! حدّث محرر القالب.",
    aiErrorMessage: "خطأ في التوليد. حاول مرة أخرى.",
    welcomeMessage: "👋 مرحباً في استوديو الذكاء الاصطناعي. صِف البلوك الذي ترغب به.",
    quickSuggestions: ["شريط إعلان خصم 50%", "واتساب عائم برسالة مخصصة", "نافذة منبثقة بكود صيف20", "شبكة منتجات ذهبية من مجموعة"],
    youtubeLabel: "YouTube",
    chatLabel: "Chat",
    installPopupTitle: "تثبيت مجاني",
    installPopupText: "يمكننا تثبيت البلوكات وتعديل التصميم ليتناسب مع قالبك الحالي – بدون تكلفة إضافية.",
    installPopupSubtext: "انقر أدناه لإرسال طلبك مباشرة إلى الدعم.",
    installPopupButton: "طلب المساعدة",
    installPopupSupportMessage: "مرحباً، أود تثبيتاً مجانياً للبلوكات المولدة بالذكاء الاصطناعي وتعديل التصميم. يُرجى التواصل معي على ktami.sami@icloud.com. شكراً.",
  },
};

/* ==============================
   Styles globaux (inchangés)
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

const GLOBAL_STYLES = `
@keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
@keyframes popupGlowPro { 0%{box-shadow:0 0 12px rgba(59,130,246,.5)} 50%{box-shadow:0 0 30px rgba(59,130,246,.9)} 100%{box-shadow:0 0 12px rgba(59,130,246,.5)} }
@keyframes pulseSoft { 0%{opacity:.6} 50%{opacity:1} 100%{opacity:.6} }
`;

/* ==============================
   Crisp Chat (inchangé)
================================ */
const CRISP_WEBSITE_ID = "7ea27a85-6b6c-4a48-8381-6c0fdc94c1ea";

function useCrispChat(websiteId) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.$crisp = window.$crisp || [];
    window.CRISP_WEBSITE_ID = websiteId;
    if (document.getElementById("crisp-chat-script")) return;
    const s = document.createElement("script");
    s.id = "crisp-chat-script";
    s.type = "text/javascript";
    s.async = true;
    s.src = "https://client.crisp.chat/l.js";
    document.head.appendChild(s);
  }, [websiteId]);
}

function crispOpen() {
  if (typeof window === "undefined") return;
  window.$crisp = window.$crisp || [];
  window.$crisp.push(["do", "chat:open"]);
}

function crispSendText(text) {
  if (typeof window === "undefined") return;
  window.$crisp = window.$crisp || [];
  if (!text) return;
  window.$crisp.push(["do", "message:send", ["text", String(text)]]);
}

function crispSetSessionData(pairs = []) {
  if (typeof window === "undefined") return;
  window.$crisp = window.$crisp || [];
  window.$crisp.push(["set", "session:data", [pairs]]);
}

function crispSetUserEmail(email) {
  if (typeof window === "undefined") return;
  window.$crisp = window.$crisp || [];
  if (!email) return;
  window.$crisp.push(["set", "user:email", [email]]);
}

/* ==============================
   Deep link helpers (inchangé)
================================ */
function editorBase({ shopSub }) {
  return `https://admin.shopify.com/store/${shopSub}/themes/current/editor`;
}

function makeAddBlockLink({ shopSub, apiKey, template = "index", handle, target = "newAppsSection" }) {
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
   OpeningPopup (avec sélecteur langue, inchangé)
================================ */
function OpeningPopup({ lang, onChangeLang }) {
  const t = COPY[lang] || COPY.en;
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
          maxWidth: "420px",
          width: "90%",
          boxShadow: "0 0 30px rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, padding: "4px 8px", borderRadius: "999px", backgroundColor: "rgba(255,255,255,0.12)" }}>
            <span style={{ opacity: 0.9 }}>{t.langLabel}:</span>
            <select
              value={lang}
              onChange={(e) => onChangeLang && onChangeLang(e.target.value)}
              style={{ padding: "4px 12px", borderRadius: "999px", border: "1px solid rgba(0,0,0,0.15)", backgroundColor: "#ffffff", color: "#111111", fontSize: 12, cursor: "pointer", outline: "none", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}
            >
              {LANG_OPTIONS.map((opt) => (<option key={opt.code} value={opt.code}>{opt.label}</option>))}
            </select>
          </div>
        </div>
        <h2 style={{ marginBottom: "16px", fontSize: "22px" }}>{t.openingTitle}</h2>
        <p style={{ marginBottom: "12px", fontSize: "16px", color: "#ddd" }}>{t.openingLine1}</p>
        <p style={{ marginBottom: "16px", fontSize: "14px", color: "#ccc" }}>{t.openingLine2}</p>
        <div style={{ marginBottom: "24px", padding: "10px 12px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.16)", textAlign: "left" }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}><span>🤝</span><span>{t.openingExtraTitle}</span></div>
          <p style={{ fontSize: 12, margin: 0, color: "#e5e7eb", lineHeight: 1.5 }}>{t.openingExtraLine}</p>
        </div>
        <button onClick={() => setVisible(false)} style={{ ...BUTTON_BASE, backgroundColor: "#fff", color: "#000" }}>{t.openingButton}</button>
      </div>
    </div>
  );
}

/* ==============================
   InlineInstallHelper (inchangé)
================================ */
function InlineInstallHelper({ lang, onClickAsk }) {
  const t = COPY[lang] || COPY.en;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 10px", borderRadius: "999px", backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", maxWidth: 280 }}>
      <span style={{ fontSize: 12, color: "#f9fafb", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>🤝 {t.installPopupTitle}</span>
      <button type="button" onClick={onClickAsk} style={{ border: "none", borderRadius: "999px", padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", backgroundColor: "#f9fafb", color: "#111827", boxShadow: "0 2px 6px rgba(0,0,0,0.18)", whiteSpace: "nowrap" }}>{t.installPopupButton}</button>
    </div>
  );
}

/* ==============================
   COMPOSANT PRINCIPAL : Settings (refondu avec interface IA)
================================ */
export default function Settings() {
  const { shopSub, apiKey } = useLoaderData();
  const [lang, setLang] = useState("en");
  const t = COPY[lang] || COPY.en;

  useCrispChat(CRISP_WEBSITE_ID);

  // États pour l'IA
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBlock, setGeneratedBlock] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { role: "bot", content: t.welcomeMessage }
  ]);
  const [previewHtml, setPreviewHtml] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll automatique du chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Génération via l'IA
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    // Ajouter message utilisateur
    setChatMessages(prev => [...prev, { role: "user", content: prompt }]);
    setIsGenerating(true);
    setGeneratedBlock(null);
    setPreviewHtml("");

    try {
      const response = await fetch("/apps/proxy/generate-block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, lang })
      });
      if (!response.ok) throw new Error();
      const block = await response.json();
      setGeneratedBlock(block);
      // Générer aperçu HTML basé sur le type de bloc
      const preview = renderBlockPreview(block, lang);
      setPreviewHtml(preview);
      setChatMessages(prev => [...prev, { role: "bot", content: `✅ Bloc généré : **${block.type}**` }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: "bot", content: `❌ ${t.aiErrorMessage}` }]);
    } finally {
      setIsGenerating(false);
      setPrompt("");
    }
  };

  // Fonction d'aperçu (simplifiée mais adaptable)
  const renderBlockPreview = (block, lang) => {
    if (!block) return "";
    const tPreview = COPY[lang] || COPY.en;
    switch (block.type) {
      case "announcement_bar":
        return `<div style="background:${block.content.bg_color || '#000'}; color:${block.content.text_color || '#fff'}; padding:12px; text-align:center; border-radius:8px;">${block.content.text || "Sale!"} <a href="${block.content.cta_link || '#'}" style="color:inherit; font-weight:bold;">${block.content.cta_text || "Shop now"}</a></div>`;
      case "popup":
        return `<div style="background:linear-gradient(135deg,#1e3a8a,#3b82f6); color:white; padding:20px; border-radius:16px; text-align:center; box-shadow:0 10px 25px rgba(0,0,0,0.2);"><div style="font-size:24px;">🎁</div><div style="font-weight:bold;">${block.content.title || "Special Offer"}</div><div>${block.content.code ? `Code: ${block.content.code}` : ""}</div><button style="margin-top:12px; background:white; border:none; padding:8px 16px; border-radius:40px;">${block.content.button_text || "Apply"}</button></div>`;
      case "countdown":
        return `<div style="display:flex; gap:8px; justify-content:center;"><div style="background:#2d3748; color:white; padding:8px 12px; border-radius:8px;">${block.content.days || "00"}d</div><div style="background:#2d3748; color:white; padding:8px 12px; border-radius:8px;">${block.content.hours || "00"}h</div><div style="background:#2d3748; color:white; padding:8px 12px; border-radius:8px;">${block.content.minutes || "00"}m</div><div style="background:#2d3748; color:white; padding:8px 12px; border-radius:8px;">${block.content.seconds || "00"}s</div></div>`;
      case "whatsapp_button":
        return `<div style="display:flex; align-items:center; gap:12px;"><div style="background:#25D366; width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center;"><svg width="28" viewBox="0 0 448 512" fill="white"><path d="M380.9 97.1C339.4 55.6 283.3 32 224 32S108.6 55.6 67.1 97.1C25.6 138.6 2 194.7 2 254c0 45.3 13.5 89.3 39 126.7L0 480l102.6-38.7C140 481.5 181.7 494 224 494c59.3 0 115.4-23.6 156.9-65.1C422.4 370.6 446 314.5 446 254s-23.6-115.4-65.1-156.9z"/></svg></div><div><strong>WhatsApp</strong><div>${block.content.message || "Contact us"}</div></div></div>`;
      case "circle_scroller":
        return `<div style="display:flex; gap:12px; overflow-x:auto;"><div style="min-width:80px; height:80px; background:#ccc; border-radius:50%;"></div><div style="min-width:80px; height:80px; background:#ccc; border-radius:50%;"></div><div style="min-width:80px; height:80px; background:#ccc; border-radius:50%;"></div></div>`;
      case "gold_products":
        return `<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px;"><div style="background:#fef3c7; padding:8px; text-align:center;">✨ Gold product 1</div><div style="background:#fef3c7; padding:8px; text-align:center;">✨ Gold product 2</div><div style="background:#fef3c7; padding:8px; text-align:center;">✨ Gold product 3</div></div>`;
      default:
        return `<pre style="background:#f1f1f1; padding:12px; border-radius:8px;">${JSON.stringify(block, null, 2)}</pre>`;
    }
  };

  // Sauvegarde du bloc dans le thème
  const handleSaveBlock = async () => {
    if (!generatedBlock) return;
    try {
      const response = await fetch("/apps/proxy/save-block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ block: generatedBlock, shopSub })
      });
      if (response.ok) {
        alert(t.aiSuccessMsg);
        setGeneratedBlock(null);
        setPreviewHtml("");
      } else {
        throw new Error();
      }
    } catch (err) {
      alert("Error saving block.");
    }
  };

  // Suggestions rapides
  const quickSuggestionClick = (suggestion) => {
    setPrompt(suggestion);
    // Optionnel : auto-générer après un court délai
    setTimeout(() => handleGenerate(), 100);
  };

  // Gestion du chat support Crisp
  const openCrispSupport = (prefillText) => {
    crispSetSessionData([["source", "ai-studio"], ["shop", shopSub || ""], ["lang", lang || ""]]);
    crispSetUserEmail("ktami.sami@icloud.com");
    crispOpen();
    if (prefillText) crispSendText(prefillText);
  };

  const handleFreeInstallClick = () => {
    const msg = COPY[lang]?.installPopupSupportMessage || COPY.en.installPopupSupportMessage;
    openCrispSupport(msg);
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <style>{`
        @media (max-width: 768px){
          .settings-container{ max-width: 100% !important; padding: 12px !important; transform: none !important; }
          .ai-chat-window{ padding: 12px !important; }
          .quick-suggestions{ flex-wrap: wrap; }
        }
        .fixed-btn{ position: fixed; bottom: 24px; z-index: 999; }
        .fixed-btn.youtube{ left: 24px; }
        .fixed-btn.chat{ right: 24px; }
        @media (max-width: 380px){ .fixed-btn.youtube{ display: none; } }
      `}</style>

      <OpeningPopup lang={lang} onChangeLang={setLang} />

      <div className="settings-root">
        <div className="settings-container" style={CONTAINER_STYLE}>
          {/* Hero + langue + helper */}
          <div style={{ background: "linear-gradient(120deg, #1f1f1f 30%, #2c2c2c 50%, #444 70%)", backgroundSize: "800px 100%", borderRadius: "12px", padding: "24px", marginBottom: "32px", color: "#fff", animation: "shimmer 3s infinite linear" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <p style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>{t.heroTitle}</p>
              <InlineInstallHelper lang={lang} onClickAsk={handleFreeInstallClick} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", borderRadius: "999px", backgroundColor: "rgba(255,255,255,0.15)" }}>
                <span style={{ fontSize: 13, opacity: 0.95 }}>{t.langLabel}:</span>
                <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ padding: "6px 12px", borderRadius: "999px", border: "1px solid rgba(0,0,0,0.2)", backgroundColor: "#ffffff", color: "#111111", fontSize: 13, cursor: "pointer", outline: "none", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}>
                  {LANG_OPTIONS.map((opt) => (<option key={opt.code} value={opt.code}>{opt.label}</option>))}
                </select>
              </div>
            </div>
            <p style={{ fontSize: "14px", marginTop: 4, marginBottom: 6, opacity: 0.9 }}>{t.heroLine}</p>
            <p style={{ fontSize: "13px", margin: 0, opacity: 0.75, fontStyle: "italic" }}>“{t.heroQuote}”</p>
          </div>

          {/* Interface IA - remplacement total de l'ancienne grille */}
          <div className="ai-chat-window" style={{ background: "#f9fafb", borderRadius: "24px", padding: "1.5rem", boxShadow: "0 8px 20px rgba(0,0,0,0.05)" }}>
            {/* Zone de chat */}
            <div style={{ background: "white", borderRadius: "20px", padding: "1rem", maxHeight: "320px", overflowY: "auto", marginBottom: "1rem" }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ marginBottom: "12px", display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ maxWidth: "80%", background: msg.role === "user" ? "#1a56db" : "#eef2ff", color: msg.role === "user" ? "white" : "#1f2937", borderRadius: "18px", padding: "8px 16px", wordBreak: "break-word" }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{ background: "#eef2ff", borderRadius: "18px", padding: "8px 16px", color: "#1f2937" }}>⏳ {t.aiGenerating}</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions rapides */}
            <div className="quick-suggestions" style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
              {t.quickSuggestions.map((s, i) => (
                <button key={i} onClick={() => quickSuggestionClick(s)} style={{ background: "#e5e7eb", border: "none", borderRadius: "40px", padding: "6px 14px", fontSize: "12px", cursor: "pointer" }}>{s}</button>
              ))}
            </div>

            {/* Input + génération */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
              <textarea
                id="aiPrompt"
                rows="2"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.aiPlaceholder}
                style={{ flex: 1, borderRadius: "40px", border: "1px solid #ddd", padding: "0.75rem 1rem", fontSize: "0.95rem", resize: "vertical" }}
              />
              <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} style={{ ...BUTTON_BASE, backgroundColor: "#1a56db", color: "white", padding: "0 1.5rem" }}>{t.aiGenerateBtn}</button>
            </div>

            {/* Aperçu et sauvegarde */}
            {previewHtml && (
              <div style={{ marginTop: "1.5rem", borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{t.aiPreviewTitle}</h3>
                <div style={{ background: "white", borderRadius: "16px", padding: "1rem", border: "1px solid #e5e7eb" }} dangerouslySetInnerHTML={{ __html: previewHtml }} />
                <button onClick={handleSaveBlock} style={{ ...BUTTON_BASE, backgroundColor: "#0e9f6e", color: "white", marginTop: "1rem", width: "100%" }}>{t.aiAddBtn}</button>
              </div>
            )}
          </div>
        </div>

        {/* Boutons flottants YouTube et Chat */}
        <a href="https://youtu.be/NqKfbpymug8" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }} className="fixed-btn youtube">
          <button style={{ ...BUTTON_BASE, backgroundColor: "#000", color: "#fff", padding: "12px 20px", borderRadius: "30px", cursor: "pointer" }}>{t.youtubeLabel}</button>
        </a>
        <button className="fixed-btn chat" onClick={() => openCrispSupport("")} style={{ position: "fixed", bottom: "24px", right: "24px", ...BUTTON_BASE, backgroundColor: "#111", color: "#fff", borderRadius: "30px", zIndex: 999 }}>{t.chatLabel}</button>
      </div>
    </>
  );
}
