// app/routes/pricing.jsx
import { useEffect, useMemo } from "react";
import { useLoaderData, useLocation, useSearchParams } from "@remix-run/react";
import { json } from "@remix-run/node";

/* ==============================
   PLAN HANDLES — NE PAS CHANGER
================================ */
const PLAN_HANDLES = {
  monthly: "premium-monthly",
  annual: "premium-annual",
};

/* ==============================
   LOADER — NE PAS CHANGER LA LOGIQUE
================================ */
export const loader = async ({ request }) => {
  const { authenticate } = await import("../shopify.server");
  const { admin } = await authenticate.admin(request);

  let currentHandle = null;
  try {
    const resp = await admin.graphql(`
      query AppActiveSubs {
        currentAppInstallation {
          activeSubscriptions {
            status
            lineItems {
              plan {
                pricingDetails {
                  __typename
                  ... on AppRecurringPricing {
                    interval
                  }
                }
              }
            }
          }
        }
      }
    `);
    const data = await resp.json();
    const subs = data?.data?.currentAppInstallation?.activeSubscriptions || [];
    const active = subs.find((s) => s.status === "ACTIVE");
    const interval = active?.lineItems?.[0]?.plan?.pricingDetails?.interval || null;

    if (interval === "ANNUAL") currentHandle = PLAN_HANDLES.annual;
    if (interval === "EVERY_30_DAYS") currentHandle = PLAN_HANDLES.monthly;
  } catch {
    // silencieux
  }

  return json({ currentHandle });
};

/* ==============================
   COMPOSANTS PURS UI (Design only)
================================ */
function CheckItem({ children }) {
  return (
    <li style={{ display: "grid", gridTemplateColumns: "18px 1fr", gap: 8, alignItems: "start", margin: "6px 0" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginTop: 2 }}>
        <circle cx="12" cy="12" r="11" stroke="#E5E7EB" strokeWidth="2" />
        <path d="M7 12.5l3 3 7-7" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{children}</span>
    </li>
  );
}

function FeaturesList() {
  return (
    <div style={{ textAlign: "left", color: "#0f0f0f", fontSize: 13, lineHeight: 1.55 }}>
      <h4 style={{ margin: "10px 0 8px", fontWeight: 800 }}>Premium Features</h4>

      <div style={{ fontWeight: 700, marginTop: 10 }}>Highly-customizable Announcement Bar</div>
      <ul style={{ listStyle: "none", paddingLeft: 0, margin: "6px 0 10px" }}>
        <CheckItem>3 styles : scrolling, multilingual carousel, light-glow</CheckItem>
        <CheckItem>Image ou couleur, overlay, ombre de texte</CheckItem>
        <CheckItem>CTA positionnable : gauche / centre / droite</CheckItem>
      </ul>

      <div style={{ fontWeight: 700, marginTop: 10 }}>High-conversion Popup</div>
      <ul style={{ listStyle: "none", paddingLeft: 0, margin: "6px 0 10px" }}>
        <CheckItem>3 visuels : standard, light effect, radial glow</CheckItem>
        <CheckItem>Image ou couleur, alignement & taille du texte</CheckItem>
        <CheckItem>Délai d’affichage + bouton d’appel à l’action</CheckItem>
      </ul>

      <div style={{ fontWeight: 700, marginTop: 10 }}>Dynamic Countdown</div>
      <ul style={{ listStyle: "none", paddingLeft: 0, margin: "6px 0 10px" }}>
        <CheckItem>3 formats : simple, carré, cercle animé</CheckItem>
        <CheckItem>Fond, bordure, texte : totalement personnalisables</CheckItem>
        <CheckItem>Mode glow optionnel, jours/ heures/ minutes/ secondes</CheckItem>
      </ul>

      <div style={{ fontWeight: 700, marginTop: 10 }}>Seamless Integration</div>
      <ul style={{ listStyle: "none", paddingLeft: 0, margin: "6px 0 0" }}>
        <CheckItem>Ajout direct depuis le Theme Editor Shopify</CheckItem>
        <CheckItem>Prévisualisation en temps réel</CheckItem>
        <CheckItem>Sans code, installation instantanée</CheckItem>
      </ul>
    </div>
  );
}

/* Rubans */
function Ribbon({ children, tone = "default" }) {
  const isBest = tone === "best";
  return (
    <div
      style={{
        position: "absolute",
        top: 14,
        right: -40,
        transform: "rotate(45deg)",
        background: isBest ? "#111" : "#111",
        color: "#fff",
        padding: "6px 60px",
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: 0.3,
        boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
      }}
    >
      {children}
    </div>
  );
}

function CurrentTag() {
  return (
    <div
      style={{
        position: "absolute",
        top: -10,
        left: -10,
        background: "#10B981",
        color: "#0a0a0a",
        fontWeight: 900,
        padding: "6px 10px",
        borderRadius: 999,
        boxShadow: "0 0 12px rgba(16,185,129,0.5)",
        display: "inline-grid",
        gridAutoFlow: "column",
        gap: 6,
        alignItems: "center",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17l-5-5" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Current
    </div>
  );
}

/* ==============================
   PRICING PAGE — UI ONLY CHANGED
================================ */
export default function Pricing() {
  const { currentHandle } = useLoaderData();
  const location = useLocation();
  const [params] = useSearchParams();

  // Bypass dev: /pricing?billing=dev&shop=...&host=...
  useEffect(() => {
    if (params.get("billing") === "dev") {
      const qs = new URLSearchParams(location.search || "");
      qs.delete("billing");
      window.location.replace(`/settings?${qs.toString()}`);
    }
  }, [params, location.search]);

  // liens d’activation → on garde tous les params + plan (LOGIQUE IDENTIQUE)
  const makeActivateHref = (handle) => {
    const qs = new URLSearchParams(location.search || "");
    qs.set("plan", handle);
    return `/billing/activate?${qs.toString()}`;
  };
  const activateMonthlyHref = useMemo(
    () => makeActivateHref(PLAN_HANDLES.monthly),
    [location.search]
  );
  const activateAnnualHref = useMemo(
    () => makeActivateHref(PLAN_HANDLES.annual),
    [location.search]
  );

  // Back to app — on garde TOUS les params, on enlève juste "plan" (LOGIQUE IDENTIQUE)
  const backToAppHref = useMemo(() => {
    const qs = new URLSearchParams(location.search || "");
    qs.delete("plan");
    return `/settings${qs.toString() ? `?${qs.toString()}` : ""}`;
  }, [location.search]);

  /* ======== STYLES ======== */
  const pageStyle = {
    background: "#F6F7F9",
    color: "#0f0f0f",
    minHeight: "100vh",
    padding: "32px 16px 40px",
    fontFamily: "'Inter', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Arial",
  };
  const shellStyle = { maxWidth: 1120, margin: "0 auto" };

  const headerStyle = {
    background: "#0b0b0b",
    color: "#fff",
    borderRadius: 16,
    padding: "22px 20px",
    boxShadow: "0 10px 30px rgba(0,0,0,.25)",
    textAlign: "center",
    marginBottom: 24,
    border: "1px solid #18181b",
  };
  const headerTitle = { margin: 0, fontSize: 20, fontWeight: 900, letterSpacing: 0.2 };
  const headerSub = { margin: "6px 0 0", color: "#d4d4d8", fontSize: 13 };

  const gridStyle = {
    display: "grid",
    gap: 18,
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    alignItems: "stretch",
  };
  const cardStyle = {
    position: "relative",
    background: "#fff",
    color: "#0f0f0f",
    padding: 22,
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 24px rgba(0,0,0,.08)",
  };
  const priceBlock = { display: "grid", gap: 6, margin: "8px 0 14px" };
  const priceValue = { fontSize: 34, fontWeight: 900, letterSpacing: 0.3 };
  const perText = { fontSize: 12, color: "#6b7280", fontWeight: 700 };

  const ctaPrimary = {
    background: "#111",
    color: "#fff",
    padding: "12px 16px",
    border: "none",
    borderRadius: 10,
    fontWeight: 900,
    fontSize: 15,
    cursor: "pointer",
    width: "100%",
    boxShadow: "0 10px 26px rgba(0,0,0,.2)",
  };
  const ctaDisabled = {
    ...ctaPrimary,
    background: "#10B981",
    color: "#0a0a0a",
    cursor: "not-allowed",
    boxShadow: "none",
  };

  const footStyle = { textAlign: "center", marginTop: 26 };
  const backBtn = {
    marginTop: 12,
    background: "#000",
    color: "#fff",
    padding: "12px 20px",
    border: "none",
    borderRadius: 9999,
    fontWeight: 900,
    boxShadow: "0 8px 24px rgba(0,0,0,.2)",
    cursor: "pointer",
  };

  return (
    <div style={pageStyle}>
      <div style={shellStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={headerTitle}>Unlock All Features — Premium Access</h1>
          <p style={headerSub}>Plans transparents, activation instantanée, annulation à tout moment.</p>
        </div>

        {/* Pricing grid */}
        <div style={gridStyle}>
          {/* Monthly */}
          <div style={cardStyle}>
            {currentHandle === PLAN_HANDLES.monthly && <CurrentTag />}
            <Ribbon>Monthly</Ribbon>

            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Premium — Monthly</h3>
            <div style={priceBlock}>
              <div style={priceValue}>$0.99</div>
              <div style={perText}>per month</div>
            </div>

            <FeaturesList />

            {currentHandle === PLAN_HANDLES.monthly ? (
              <button disabled style={ctaDisabled}>Current plan</button>
            ) : (
              <a href={activateMonthlyHref} style={{ textDecoration: "none", display: "block" }}>
                <button style={ctaPrimary}>Activate Premium Now</button>
              </a>
            )}
          </div>

          {/* Annual */}
          <div style={cardStyle}>
            {currentHandle === PLAN_HANDLES.annual && <CurrentTag />}
            <Ribbon tone="best">Best value</Ribbon>

            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Premium — Annual</h3>
            <div style={priceBlock}>
              <div style={priceValue}>$9.99</div>
              <div style={perText}>per year</div>
            </div>

            <FeaturesList />

            {currentHandle === PLAN_HANDLES.annual ? (
              <button disabled style={ctaDisabled}>Current plan</button>
            ) : (
              <a href={activateAnnualHref} style={{ textDecoration: "none", display: "block" }}>
                <button style={ctaPrimary}>Activate Premium Now</button>
              </a>
            )}
          </div>
        </div>

        {/* Back to app — garde TOUS les params */}
        <div style={footStyle}>
          <a href={backToAppHref} style={{ textDecoration: "none", display: "inline-block" }}>
            <button style={backBtn}>Back to app</button>
          </a>
        </div>
      </div>
    </div>
  );
}
