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
   Crisp (same as Home)
   - same websiteId as Section0Home.jsx
================================ */
const CRISP_WEBSITE_ID = "7ea27a85-6b6c-4a48-8381-6c0fdc94c1ea";

/* Inject Crisp once */
function useCrispChat(websiteId) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.$crisp = window.$crisp || [];
    window.CRISP_WEBSITE_ID = websiteId;

    if (document.getElementById("crisp-chat-script")) return;

    const s = document.createElement("script");
    s.id = "crisp-chat-script";
    s.type = "text/javascript";
    s.src = "https://client.crisp.chat/l.js";
    s.async = true;
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
  window.$crisp.push(["do", "message:send", ["text", String(text || "")]]);
}

function crispSetSessionData(pairs = []) {
  if (typeof window === "undefined") return;
  window.$crisp = window.$crisp || [];
  // pairs format: [["key","value"], ...]
  window.$crisp.push(["set", "session:data", [pairs]]);
}

function crispSetUserEmail(email) {
  if (typeof window === "undefined") return;
  window.$crisp = window.$crisp || [];
  if (!email) return;
  window.$crisp.push(["set", "user:email", [email]]);
}

/* ============================== COPY / LANGUES ================================ */ const LANG_OPTIONS = [ { code: "en", label: "English" }, { code: "fr", label: "Français" }, { code: "es", label: "Español" }, { code: "it", label: "Italiano" }, { code: "de", label: "Deutsch" }, { code: "ar", label: "العربية" }, ]; const COPY = { en: { langLabel: "Language", heroTitle: "Triple Announcement Bar & Blocks", heroLine: "Add announcement bars, popups, countdowns, social icons, WhatsApp chat, circle scroller and gold product grid in a few clicks.", heroQuote: "Make your Shopify theme more engaging without writing a single line of code.", openingTitle: "How to use the premium blocks", openingLine1: "Open your Theme Editor and click “Add section” or “Add block” in the Apps area.", openingLine2: "Add any premium block, then customize text, colors and timing as you like.", openingExtraTitle: "Free help from our team", openingExtraLine: "If you prefer, you can request a free installation and design adaptation for your theme directly from the help badge in the top bar.", openingButton: "Got it!", blocks: { announcementTitle: "Premium Announcement Bar", announcementDesc: "Animated or multilingual bar to grab attention.", popupTitle: "Premium Popup", popupDesc: "Modern popup with promo code and glow animation.", countdownTitle: "Premium Countdown", countdownDesc: "Three dynamic countdown styles.", socialTitle: "Social Icons", socialDesc: "Social icons with hover and clean style.", whatsappTitle: "WhatsApp Sticky Button", whatsappDesc: "Floating quick-contact button (bottom corner).", circleTitle: "Circle Image Scroller", circleDesc: "Horizontal carousel of circular images (stories look).", goldTitle: "Gold Products Showcase (Premium)", goldDesc: "Gold-style product grid from a collection.", comingSoonCardTitle: "More blocks coming soon", comingSoonCardDesc: "We add new blocks regularly. Tell us what you want next.", }, bars: [ { button: "Shop now", text: "Limited-time sale! Enjoy up to 50% off on your favorite items.", }, { button: "Grab deal", text: "Flash sale alert! Everything must go — save big before it’s gone!", }, { button: "Browse", text: "Clearance — prices slashed! Don’t miss out on major savings.", }, ], popupPreviewTitle: "🎁 Exclusive offer", popupPreviewLine: "Get {discount} OFF with code {code}", popupPreviewDiscount: "20%", popupPreviewCode: "WELCOME20", popupPreviewButton: "Apply now", countdownLabels: { standard: "Standard", rectangle: "Rectangle", circle: "Circle", add: "Add", }, whatsappPreviewTitle: "WhatsApp Sticky Button", whatsappPreviewDesc: "Quick contact — bottom corner (mobile & desktop)", goldHeading: "Gold products", comingSoonTitle: "New blocks in production", comingSoonItems: [ "Product page enhancements (sticky ATC, badges, specs)", "FAQ / Accordion", "Stock / urgency bar", "Bundles & volume discounts", "Product tabs & specs", ], comingSoonFooter: "We ship new blocks regularly. Tell us what you would like next.", addBlockCta: "Add premium block", infoCta: "Suggest a block", youtubeLabel: "YouTube", chatLabel: "Chat", // Free install helper (top bar) installPopupTitle: "Free installation", installPopupText: "We can install the blocks and adapt the design to your current theme — at no extra cost.", installPopupSubtext: "Click below and we’ll receive your request directly in support.", installPopupButton: "Ask for help", installPopupSupportMessage: "Hello, I would like a free installation of the Blocks: Bar, WhatsApp & More app blocks and a design adjustment to match my theme. Please contact me at ktami.sami@icloud.com. Thank you!", }, fr: { langLabel: "Langue", heroTitle: "Triple Announcement Bar & Blocs", heroLine: "Ajoutez des barres d’annonce, popups, compteurs, icônes sociales, WhatsApp, scroller d’images et grille dorée en quelques clics.", heroQuote: "Rendez votre thème Shopify plus engageant sans écrire une seule ligne de code.", openingTitle: "Comment utiliser les blocs Premium", openingLine1: "Ouvrez l’éditeur de thème puis cliquez sur « Ajouter une section » ou « Ajouter un bloc » dans la zone Applications.", openingLine2: "Ajoutez un bloc premium puis personnalisez le texte, les couleurs et le timing comme vous le souhaitez.", openingExtraTitle: "Aide gratuite de notre équipe", openingExtraLine: "Vous pouvez demander une installation gratuite et un ajustement du design depuis le badge d’aide dans la barre en haut.", openingButton: "Compris !", blocks: { announcementTitle: "Premium Announcement Bar", announcementDesc: "Barre d’annonce animée ou multilingue pour capter l’attention.", popupTitle: "Premium Popup", popupDesc: "Popup moderne avec code promo et effet lumineux professionnel.", countdownTitle: "Premium Countdown", countdownDesc: "Trois styles de compte à rebours dynamiques.", socialTitle: "Social Icons", socialDesc: "Icônes sociales avec effet hover propre et moderne.", whatsappTitle: "WhatsApp Sticky Button", whatsappDesc: "Bouton de contact rapide en bas de l’écran (mobile & desktop).", circleTitle: "Circle Image Scroller", circleDesc: "Carrousel horizontal d’images circulaires type “stories”.", goldTitle: "Gold Products Showcase (Premium)", goldDesc: "Grille de produits dorée à partir d’une collection.", comingSoonCardTitle: "Encore plus de blocs bientôt", comingSoonCardDesc: "Nous ajoutons régulièrement de nouveaux blocs. Dites-nous ce que vous voulez voir ensuite.", }, bars: [ { button: "Voir la promo", text: "Promo limitée ! Profitez jusqu’à 50 % de réduction sur vos articles favoris.", }, { button: "Saisir l’offre", text: "Vente flash ! Tout doit disparaître — économisez avant la fin.", }, { button: "Découvrir", text: "Déstokage — prix cassés ! Ne ratez pas ces grosses économies.", }, ], popupPreviewTitle: "🎁 Offre exclusive", popupPreviewLine: "Obtenez {discount} de réduction avec le code {code}", popupPreviewDiscount: "20 %", popupPreviewCode: "WELCOME20", popupPreviewButton: "Appliquer maintenant", countdownLabels: { standard: "Standard", rectangle: "Rectangle", circle: "Cercle", add: "Ajouter", }, whatsappPreviewTitle: "Bouton WhatsApp Sticky", whatsappPreviewDesc: "Contact rapide — coin inférieur (mobile & desktop)", goldHeading: "Produits dorés", comingSoonTitle: "Nouveaux blocs en préparation", comingSoonItems: [ "Améliorations page produit (ATC sticky, badges, fiches)", "FAQ / Accordéon", "Barre de stock / d’urgence", "Bundles & remises de volume", "Onglets produit & caractéristiques", ], comingSoonFooter: "Nous publions régulièrement de nouveaux blocs. Dites-nous ce que vous voulez ensuite.", addBlockCta: "Ajouter le bloc premium", infoCta: "Suggérer un bloc", youtubeLabel: "YouTube", chatLabel: "Chat", installPopupTitle: "Installation gratuite", installPopupText: "Nous pouvons installer les blocs pour vous et adapter le design à votre thème — gratuitement.", installPopupSubtext: "Cliquez sur le bouton pour envoyer votre demande directement au support.", installPopupButton: "Demander de l’aide", installPopupSupportMessage: "Bonjour, je souhaite une installation gratuite des blocs de l’application Blocks: Bar, WhatsApp & More et un ajustement du design pour qu’il soit compatible avec mon thème. Vous pouvez me répondre sur ktami.sami@icloud.com. Merci !", }, es: { langLabel: "Idioma", heroTitle: "Triple Announcement Bar & Bloques", heroLine: "Configura barras de anuncio, popups, contadores, iconos sociales, chat de WhatsApp, carrusel circular y cuadrícula dorada en pocos clics.", heroQuote: "Haz tu tema de Shopify más atractivo sin escribir código.", openingTitle: "Cómo usar los bloques Premium", openingLine1: "Abre el editor de temas y haz clic en «Agregar sección» o «Agregar bloque» en el área de aplicaciones.", openingLine2: "Añade cualquier bloque premium y personaliza texto, colores y tiempos como quieras.", openingExtraTitle: "Ayuda gratuita de nuestro equipo", openingExtraLine: "Puedes solicitar instalación gratuita y ajuste de diseño desde el badge de ayuda en la barra superior.", openingButton: "Entendido", blocks: { announcementTitle: "Barra de anuncio Premium", announcementDesc: "Barra animada o multilingüe para captar la atención.", popupTitle: "Popup Premium", popupDesc: "Popup moderno con código promocional y efecto de brillo.", countdownTitle: "Cuenta regresiva Premium", countdownDesc: "Tres estilos de cuenta regresiva dinámicos.", socialTitle: "Iconos sociales", socialDesc: "Iconos sociales con hover limpio y profesional.", whatsappTitle: "Botón WhatsApp Sticky", whatsappDesc: "Botón de contacto rápido en la esquina inferior.", circleTitle: "Carrusel de imágenes circulares", circleDesc: "Carrusel horizontal de imágenes circulares tipo stories.", goldTitle: "Vitrina de productos dorados (Premium)", goldDesc: "Cuadrícula de productos con estilo dorado desde una colección.", comingSoonCardTitle: "Más bloques muy pronto", comingSoonCardDesc: "Añadimos nuevos bloques con frecuencia. Cuéntanos qué necesitas.", }, bars: [ { button: "Ver ofertas", text: "¡Oferta limitada! Disfruta hasta un 50 % de descuento en tus productos favoritos.", }, { button: "Aprovechar", text: "¡Venta relámpago! Todo debe irse — ahorra antes de que termine.", }, { button: "Explorar", text: "Liquidación — precios rebajados. No te pierdas estos ahorros.", }, ], popupPreviewTitle: "🎁 Oferta exclusiva", popupPreviewLine: "Consigue {discount} de descuento con el código {code}", popupPreviewDiscount: "20 %", popupPreviewCode: "WELCOME20", popupPreviewButton: "Aplicar ahora", countdownLabels: { standard: "Estándar", rectangle: "Rectangular", circle: "Circular", add: "Añadir", }, whatsappPreviewTitle: "Botón WhatsApp Sticky", whatsappPreviewDesc: "Contacto rápido — esquina inferior (móvil y escritorio)", goldHeading: "Productos dorados", comingSoonTitle: "Nuevos bloques en camino", comingSoonItems: [ "Mejoras en la página de producto (ATC fijo, badges, specs)", "FAQ / Acordeón", "Barra de stock / urgencia", "Bundles y descuentos por volumen", "Pestañas y especificaciones de producto", ], comingSoonFooter: "Publicamos nuevos bloques con frecuencia. Cuéntanos qué te gustaría ver.", addBlockCta: "Añadir bloque premium", infoCta: "Sugerir un bloque", youtubeLabel: "YouTube", chatLabel: "Chat", installPopupTitle: "Instalación gratuita", installPopupText: "Podemos instalar los bloques por ti y adaptar el diseño a tu tema actual, sin coste adicional.", installPopupSubtext: "Haz clic en el botón para enviar tu solicitud directamente al soporte.", installPopupButton: "Pedir ayuda", installPopupSupportMessage: "Hola, me gustaría una instalación gratuita de los bloques de la app Blocks: Bar, WhatsApp & More y un ajuste de diseño para que encaje con mi tema. Podéis responderme en ktami.sami@icloud.com. ¡Gracias!", }, it: { langLabel: "Lingua", heroTitle: "Triple Announcement Bar & Blocchi", heroLine: "Aggiungi barre annuncio, popup, countdown, icone social, chat WhatsApp, scroller di immagini e griglia dorata in pochi clic.", heroQuote: "Rendi il tuo tema Shopify più coinvolgente senza scrivere codice.", openingTitle: "Come usare i blocchi Premium", openingLine1: "Apri il Theme Editor e clicca su «Aggiungi sezione» o «Aggiungi blocco» nell’area App.", openingLine2: "Aggiungi un blocco premium e personalizza testi, colori e tempi come preferisci.", openingExtraTitle: "Assistenza gratuita", openingExtraLine: "Puoi richiedere installazione gratuita e adattamento del design tramite il badge di aiuto nella barra in alto.", openingButton: "Ho capito", blocks: { announcementTitle: "Barra annuncio Premium", announcementDesc: "Barra animata o multilingue per catturare l’attenzione.", popupTitle: "Popup Premium", popupDesc: "Popup moderno con codice sconto ed effetto glow.", countdownTitle: "Countdown Premium", countdownDesc: "Tre stili di conto alla rovescia dinamici.", socialTitle: "Icone social", socialDesc: "Icone social con hover pulito e professionale.", whatsappTitle: "Bottone WhatsApp Sticky", whatsappDesc: "Pulsante di contatto rapido nell’angolo in basso.", circleTitle: "Scroller di immagini circolari", circleDesc: "Carosello orizzontale di immagini circolari stile stories.", goldTitle: "Vetrina prodotti dorati (Premium)", goldDesc: "Griglia prodotti in stile dorato da una collection.", comingSoonCardTitle: "Altri blocchi in arrivo", comingSoonCardDesc: "Rilasciamo nuovi blocchi di continuo. Dicci cosa ti serve.", }, bars: [ { button: "Scopri ora", text: "Promo a tempo limitato! Fino al 50% di sconto sui tuoi prodotti preferiti.", }, { button: "Prendi l’offerta", text: "Flash sale! Tutto deve andare — risparmia finché puoi.", }, { button: "Esplora", text: "Saldo finale — prezzi ribassati. Non perdere questi sconti.", }, ], popupPreviewTitle: "🎁 Offerta esclusiva", popupPreviewLine: "Ottieni {discount} di sconto con il codice {code}", popupPreviewDiscount: "20%", popupPreviewCode: "WELCOME20", popupPreviewButton: "Applica ora", countdownLabels: { standard: "Standard", rectangle: "Rettangolare", circle: "Circolare", add: "Aggiungi", }, whatsappPreviewTitle: "Bottone WhatsApp Sticky", whatsappPreviewDesc: "Contatto rapido — angolo in basso (mobile & desktop)", goldHeading: "Prodotti dorati", comingSoonTitle: "Nuovi blocchi in sviluppo", comingSoonItems: [ "Migliorie pagina prodotto (ATC fisso, badge, schede)", "FAQ / Accordion", "Barra stock / urgenza", "Bundle e sconti quantità", "Tab e specifiche prodotto", ], comingSoonFooter: "Rilasciamo regolarmente nuovi blocchi. Facci sapere cosa manca.", addBlockCta: "Aggiungi blocco premium", infoCta: "Suggerisci un blocco", youtubeLabel: "YouTube", chatLabel: "Chat", installPopupTitle: "Installazione gratuita", installPopupText: "Possiamo installare i blocchi per te e adattare il design al tuo tema attuale — gratuitamente.", installPopupSubtext: "Clicca sul pulsante per inviare la tua richiesta direttamente al supporto.", installPopupButton: "Chiedi aiuto", installPopupSupportMessage: "Ciao, vorrei un’installazione gratuita dei blocchi dell’app Blocks: Bar, WhatsApp & More e un adattamento del design al mio tema. Potete contattarmi su ktami.sami@icloud.com. Grazie!", }, de: { langLabel: "Sprache", heroTitle: "Triple Announcement Bar & Blöcke", heroLine: "Füge Ankündigungsleisten, Popups, Countdowns, Social Icons, WhatsApp-Chat, Bild-Scroller und Gold-Produktgitter mit wenigen Klicks hinzu.", heroQuote: "Mach dein Shopify-Theme attraktiver – ganz ohne Code.", openingTitle: "So verwendest du die Premium-Blöcke", openingLine1: "Öffne den Theme-Editor und klicke auf „Abschnitt hinzufügen“ oder „Block hinzufügen“ im Bereich Apps.", openingLine2: "Füge einen Premium-Block hinzu und passe Texte, Farben und Zeiten an.", openingExtraTitle: "Kostenlose Hilfe", openingExtraLine: "Über das Hilfe-Badge in der oberen Leiste kannst du eine kostenlose Installation und Design-Anpassung anfragen.", openingButton: "Alles klar", blocks: { announcementTitle: "Premium Announcement Bar", announcementDesc: "Animierte oder mehrsprachige Leiste, um Aufmerksamkeit zu erzeugen.", popupTitle: "Premium Popup", popupDesc: "Modernes Popup mit Promo-Code und Glow-Effekt.", countdownTitle: "Premium Countdown", countdownDesc: "Drei dynamische Countdown-Stile.", socialTitle: "Social Icons", socialDesc: "Social-Icons mit sauberem Hover-Effekt.", whatsappTitle: "WhatsApp Sticky Button", whatsappDesc: "Schnellkontakt-Button in der unteren Ecke.", circleTitle: "Kreis-Bild-Scroller", circleDesc: "Horizontaler Scroller mit runden Bildern im Stories-Look.", goldTitle: "Gold Products Showcase (Premium)", goldDesc: "Produktgitter im Gold-Stil auf Basis einer Kollektion.", comingSoonCardTitle: "Weitere Blöcke folgen", comingSoonCardDesc: "Wir veröffentlichen regelmäßig neue Blöcke. Sag uns, was dir fehlt.", }, bars: [ { button: "Jetzt shoppen", text: "Nur für kurze Zeit! Spare bis zu 50 % auf deine Lieblingsartikel.", }, { button: "Angebot sichern", text: "Blitz-Sale! Alles muss raus – jetzt sparen, bevor es vorbei ist.", }, { button: "Entdecken", text: "Räumungsverkauf – stark reduzierte Preise. Verpasse diese Deals nicht.", }, ], popupPreviewTitle: "🎁 Exklusives Angebot", popupPreviewLine: "Erhalte {discount} Rabatt mit dem Code {code}", popupPreviewDiscount: "20 %", popupPreviewCode: "WELCOME20", popupPreviewButton: "Jetzt anwenden", countdownLabels: { standard: "Standard", rectangle: "Rechteckig", circle: "Kreis", add: "Hinzufügen", }, whatsappPreviewTitle: "WhatsApp Sticky Button", whatsappPreviewDesc: "Schnellkontakt – Ecke unten (mobil & Desktop)", goldHeading: "Gold-Produkte", comingSoonTitle: "Neue Blöcke in Entwicklung", comingSoonItems: [ "Produktseiten-Verbesserungen (Sticky ATC, Badges, Specs)", "FAQ / Akkordeon", "Bestands- / Dringlichkeits-Leiste", "Bundles & Mengenrabatte", "Produkt-Tabs & Spezifikationen", ], comingSoonFooter: "Wir liefern regelmäßig neue Blöcke. Sag uns, was du brauchst.", addBlockCta: "Premium-Block hinzufügen", infoCta: "Block vorschlagen", youtubeLabel: "YouTube", chatLabel: "Chat", installPopupTitle: "Kostenlose Installation", installPopupText: "Wir können die Blöcke kostenlos installieren und das Design an dein Theme anpassen.", installPopupSubtext: "Klicke auf den Button, um deine Anfrage direkt an den Support zu senden.", installPopupButton: "Hilfe anfragen", installPopupSupportMessage: "Hallo, ich hätte gern eine kostenlose Installation der Blöcke der App Blocks: Bar, WhatsApp & More sowie eine Designanpassung an mein Theme. Bitte kontaktiert mich unter ktami.sami@icloud.com. Danke!", }, ar: { langLabel: "اللغة", heroTitle: "Triple Announcement Bar & Blocks", heroLine: "أضِف شريط إعلان، نوافذ منبثقة، عدّ تنازلي، أيقونات اجتماعية، شات واتساب، سكرول دائري و شبكة منتجات ذهبية بسهولة.", heroQuote: "اجعل متجر Shopify أكثر جاذبية بدون كتابة أي سطر من الكود.", openingTitle: "طريقة استخدام البلوكات البريميوم", openingLine1: "افتح محرر القالب ثم اضغط «Add section» أو «Add block» داخل قسم التطبيقات.", openingLine2: "اختر أي بلوك بريميوم ثم عدّل النصوص، الألوان والتوقيت كما تريد.", openingExtraTitle: "مساعدة مجانية", openingExtraLine: "يمكنك طلب تنصيب مجاني وضبط للتصميم من خلال شارة المساعدة في الشريط العلوي.", openingButton: "فهمت", blocks: { announcementTitle: "شريط إعلان بريميوم", announcementDesc: "شريط إعلان متحرك أو متعدد اللغات لجذب الانتباه.", popupTitle: "نافذة منبثقة بريميوم", popupDesc: "بُوب أب عصري مع كود خصم و تأثير إضاءة احترافي.", countdownTitle: "عداد تنازلي بريميوم", countdownDesc: "ثلاثة أشكال مختلفة لعدّ تنازلي ديناميكي.", socialTitle: "أيقونات التواصل الاجتماعي", socialDesc: "أيقونات شبكات اجتماعية مع تأثير Hover أنيق.", whatsappTitle: "زر واتساب عائم", whatsappDesc: "زر تواصل سريع في أسفل الصفحة (موبايل وكمبيوتر).", circleTitle: "سكرول صور دائري", circleDesc: "شريط أفقي لصور دائرية بشكل قصص (Stories).", goldTitle: "شبكة منتجات ذهبية (بريميوم)", goldDesc: "شبكة عرض منتجات بتصميم ذهبي من كوليكشن محدد.", comingSoonCardTitle: "بلوكات جديدة قريباً", comingSoonCardDesc: "نُضيف بلوكات جديدة باستمرار. شارِكنا ما تحتاجه في الإصدار القادم.", }, bars: [ { button: "تسوق الآن", text: "عرض محدود! خصم يصل إلى 50٪ على أفضل منتجاتك.", }, { button: "احصل على العرض", text: "فلاش سيل! كل شيء يجب أن يُباع — لا تُفوّت التخفيضات.", }, { button: "اكتشف المزيد", text: "تصفية مخزون — أسعار منخفضة جداً. لا تضيع الفرصة.", }, ], popupPreviewTitle: "🎁 عرض حصري", popupPreviewLine: "احصل على خصم {discount} باستخدام الكود {code}", popupPreviewDiscount: "20٪", popupPreviewCode: "WELCOME20", popupPreviewButton: "تفعيل العرض", countdownLabels: { standard: "عادي", rectangle: "مستطيل", circle: "دائري", add: "إضافة", }, whatsappPreviewTitle: "زر واتساب عائم", whatsappPreviewDesc: "تواصل سريع من الزاوية السفلية (موبايل وكمبيوتر)", goldHeading: "منتجات ذهبية", comingSoonTitle: "بلوكات جديدة قيد التطوير", comingSoonItems: [ "تحسينات صفحة المنتج (زر ثابت، شارات، مواصفات)", "قسم الأسئلة الشائعة / أكورديون", "شريط المخزون / الإلحاح", "عروض الباندل وخصومات الكمية", "تبويبات المنتج والمواصفات", ], comingSoonFooter: "نضيف بلوكات جديدة بشكل منتظم، أخبرنا بما تحتاجه.", addBlockCta: "إضافة بلوك بريميوم", infoCta: "اقترح بلوك جديد", youtubeLabel: "YouTube", chatLabel: "Chat", installPopupTitle: "تنصيب مجاني", installPopupText: "يمكننا تنصيب البلوكات لك وضبط التصميم ليتماشى مع الثيم الحالي — مجاناً.", installPopupSubtext: "اضغط على الزر لإرسال طلبك مباشرة إلى الدعم.", installPopupButton: "طلب المساعدة", installPopupSupportMessage: "مرحباً، أود طلب تنصيب مجاني لبلوكات تطبيق Blocks: Bar, WhatsApp & More مع تعديل التصميم ليكون متوافقاً مع الثيم الخاص بي. يمكنكم التواصل معي على البريد: ktami.sami@icloud.com. شكراً لكم.", }, };

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

/* Two-per-row grid desktop */
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
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              padding: "4px 8px",
              borderRadius: "999px",
              backgroundColor: "rgba(255,255,255,0.12)",
            }}
          >
            <span style={{ opacity: 0.9 }}>{t.langLabel}:</span>
            <select
              value={lang}
              onChange={(e) => onChangeLang && onChangeLang(e.target.value)}
              style={{
                padding: "4px 12px",
                borderRadius: "999px",
                border: "1px solid rgba(0,0,0,0.15)",
                backgroundColor: "#ffffff",
                color: "#111111",
                fontSize: 12,
                cursor: "pointer",
                outline: "none",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
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

        <h2 style={{ marginBottom: "16px", fontSize: "22px" }}>
          {t.openingTitle}
        </h2>
        <p style={{ marginBottom: "12px", fontSize: "16px", color: "#ddd" }}>
          {t.openingLine1}
        </p>
        <p style={{ marginBottom: "16px", fontSize: "14px", color: "#ccc" }}>
          {t.openingLine2}
        </p>

        <div
          style={{
            marginBottom: "24px",
            padding: "10px 12px",
            borderRadius: "12px",
            backgroundColor: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.16)",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 4,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>🤝</span>
            <span>{t.openingExtraTitle}</span>
          </div>
          <p
            style={{
              fontSize: 12,
              margin: 0,
              color: "#e5e7eb",
              lineHeight: 1.5,
            }}
          >
            {t.openingExtraLine}
          </p>
        </div>

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

function InlineInstallHelper({ lang, onClickAsk }) {
  const t = COPY[lang] || COPY.en;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 10px",
        borderRadius: "999px",
        backgroundColor: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.18)",
        maxWidth: 280,
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: "#f9fafb",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        🤝 {t.installPopupTitle}
      </span>
      <button
        type="button"
        onClick={onClickAsk}
        style={{
          border: "none",
          borderRadius: "999px",
          padding: "4px 10px",
          fontSize: 11,
          fontWeight: 600,
          cursor: "pointer",
          backgroundColor: "#f9fafb",
          color: "#111827",
          boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
          whiteSpace: "nowrap",
        }}
      >
        {t.installPopupButton}
      </button>
    </div>
  );
}

/* ====== previews (inchangés) ====== */
/* ... Garde tous tes composants PreviewAnnouncementBar, PreviewPopup, PreviewCountdown,
   PreviewSocialIcons, PreviewWhatsAppSticky, PreviewCircleScroller, PreviewGoldProductsStoreLike,
   PreviewComingSoon EXACTEMENT comme tu les as (je ne les réécris pas ici pour raccourcir).
   => Dans ton projet, laisse-les tels quels. */

/* ==============================
   PAGE: Settings
================================ */

export default function Settings() {
  const { shopSub, apiKey } = useLoaderData();
  const [lang, setLang] = useState("en");
  const t = COPY[lang] || COPY.en;

  // ✅ Inject Crisp on this route too (same as Home)
  useCrispChat(CRISP_WEBSITE_ID);

  const blocks = [
    {
      id: "announcement-premium",
      title: t.blocks.announcementTitle,
      description: t.blocks.announcementDesc,
      template: "index",
      preview: <PreviewAnnouncementBar lang={lang} />,
      kind: "installable",
    },
    {
      id: "popup-premium",
      title: t.blocks.popupTitle,
      description: t.blocks.popupDesc,
      template: "index",
      preview: <PreviewPopup lang={lang} />,
      kind: "installable",
    },
    {
      id: "timer-premium",
      title: t.blocks.countdownTitle,
      description: t.blocks.countdownDesc,
      template: "index",
      preview: <PreviewCountdown lang={lang} />,
      kind: "installable",
    },
    {
      id: "social-icons-premium",
      title: t.blocks.socialTitle,
      description: t.blocks.socialDesc,
      template: "index",
      preview: <PreviewSocialIcons />,
      kind: "installable",
    },
    {
      id: "whatsapp-sticky-premium",
      title: t.blocks.whatsappTitle,
      description: t.blocks.whatsappDesc,
      template: "index",
      preview: <PreviewWhatsAppSticky lang={lang} />,
      kind: "installable",
    },
    {
      id: "circle-scroller-premium",
      title: t.blocks.circleTitle,
      description: t.blocks.circleDesc,
      template: "index",
      preview: <PreviewCircleScroller />,
      kind: "installable",
    },
    {
      id: "gold-products-premium",
      title: t.blocks.goldTitle,
      description: t.blocks.goldDesc,
      template: "index",
      preview: <PreviewGoldProductsStoreLike lang={lang} />,
      kind: "installable",
    },
    {
      id: "coming-soon-info",
      title: t.blocks.comingSoonCardTitle,
      description: t.blocks.comingSoonCardDesc,
      template: "index",
      preview: <PreviewComingSoon lang={lang} />,
      kind: "info",
    },
  ];

  const openSupportCrisp = (prefillText) => {
    // Optional: set session context so you can see where it comes from in Crisp
    crispSetSessionData([
      ["source", "settings"],
      ["shop", shopSub || ""],
      ["lang", lang || ""],
    ]);

    // Optional: set your email so Crisp keeps it
    crispSetUserEmail("ktami.sami@icloud.com");

    crispOpen();
    if (prefillText) crispSendText(prefillText);
  };

  const handleFreeInstallClick = () => {
    const langPack = COPY[lang] || COPY.en;
    const message =
      langPack.installPopupSupportMessage || COPY.en.installPopupSupportMessage;

    openSupportCrisp(message);
  };

  const handleSuggestBlock = () => {
    const text =
      lang === "fr"
        ? "Bonjour 👋 Je voudrais suggérer un nouveau bloc / une fonctionnalité. Voici mon idée :"
        : "Hi 👋 I would like to suggest a new block / feature. Here is my idea:";
    openSupportCrisp(text);
  };

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

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
          .fixed-btn.youtube{ left: 16px !important; }
          .fixed-btn.chat{   right: 16px !important; }
        }
        @media (max-width: 380px){
          .fixed-btn.youtube{ display: none !important; }
        }
      `}</style>

      <OpeningPopup lang={lang} onChangeLang={setLang} />

      <div className="settings-root">
        <div className="settings-container" style={CONTAINER_STYLE}>
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

              <InlineInstallHelper lang={lang} onClickAsk={handleFreeInstallClick} />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 8px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(255,255,255,0.15)",
                }}
              >
                <span style={{ fontSize: 13, opacity: 0.95 }}>
                  {t.langLabel}:
                </span>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "999px",
                    border: "1px solid rgba(0,0,0,0.2)",
                    backgroundColor: "#ffffff",
                    color: "#111111",
                    fontSize: 13,
                    cursor: "pointer",
                    outline: "none",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
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
                      onClick={handleSuggestBlock}
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

                <div style={{ flex: 1, minWidth: "220px" }}>{block.preview}</div>
              </div>
            ))}
          </div>
        </div>

        {/* YouTube button */}
        <a
          href="https://youtu.be/NqKfbpymug8"
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

        {/* Chat button (Crisp only) */}
        <button
          className="fixed-btn chat"
          onClick={() => openSupportCrisp("")}
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
    </>
  );
}
