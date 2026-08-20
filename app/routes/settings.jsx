// app/routes/settings.jsx
import React, { useState, useMemo } from "react";
import { useLocation, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";

/* ==============================
   LOADER : Authentification + Plan Payant
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
   UI & styles (Garde les mêmes bases)
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

/* ==============================
   PAGE Settings (Devenu AI Block Studio)
================================ */
export default function Settings() {
  const { shopSub } = useLoaderData();
  const location = useLocation();
  const pricingHref = useMemo(() => `/pricing${location.search || ""}`, [location.search]);

  // États pour l'IA
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/deepseek-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la génération IA.");
      }

      setResult(data);
      setPrompt(""); // Vider l'input après succès
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={CONTAINER_STYLE}>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(120deg, #1f1f1f 30%, #2c2c2c 50%, #444 70%)",
          borderRadius: "12px",
          padding: "32px",
          marginBottom: "32px",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "28px", fontWeight: "bold", margin: "0 0 12px 0" }}>
          AI Block Studio
        </h1>
        <p style={{ fontSize: "16px", opacity: 0.8, maxWidth: "600px", margin: "0 auto" }}>
          Décrivez le bloc dont vous avez besoin (barre d'annonce, popup, compte à rebours, etc.). 
          Notre IA générera une section sur mesure et l'installera directement dans votre thème.
        </p>
      </div>

      {/* Interface de Génération IA */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ display: "flex", gap: "12px" }}>
          <input
            type="text"
            placeholder="Ex: Une barre d'annonce rouge avec -50% sur la page d'accueil"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            style={{
              flex: 1,
              padding: "14px 20px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              fontSize: "16px",
              outline: "none",
              transition: "border 0.2s"
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            style={{
              ...BUTTON_BASE,
              backgroundColor: "#000",
              color: "#fff",
              padding: "14px 28px",
              fontSize: "16px",
              opacity: (isGenerating || !prompt.trim()) ? 0.6 : 1,
            }}
          >
            {isGenerating ? "Génération en cours..." : "Générer le bloc"}
          </button>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div
            style={{
              marginTop: "16px",
              padding: "12px",
              background: "#fde8e8",
              color: "#c53030",
              borderRadius: "6px",
              border: "1px solid #feb2b2",
            }}
          >
            {error}
          </div>
        )}

        {/* Affichage du succès */}
        {result && result.success && (
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              background: "#f0fff4",
              color: "#276749",
              borderRadius: "6px",
              border: "1px solid "#c6f6d5",
              textAlign: "center",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>
              ✅ Bloc généré avec succès !
            </h3>
            <p style={{ margin: "0 0 16px 0", color: "#4a5568" }}>
              Le fichier <code>{result.fileKey}</code> a été ajouté à votre thème. Ouvrez l'éditeur de thème pour l'ajouter à votre page.
            </p>
            <a
              href={`https://admin.shopify.com/store/${shopSub}/themes/current/editor`}
              target="_top"
              rel="noreferrer"
              style={{ textDecoration: "none" }}
            >
              <button
                style={{
                  ...BUTTON_BASE,
                  backgroundColor: "#38a169",
                  color: "#fff",
                }}
              >
                Ouvrir dans l'éditeur de thème
              </button>
            </a>
          </div>
        )}
      </div>

      {/* Boutons flottants (Pricing, YouTube, WhatsApp) - On garde les mêmes */}
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
    </div>
  );
}
