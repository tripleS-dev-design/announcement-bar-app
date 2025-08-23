// app/routes/pricing.jsx
import { useMemo } from "react";
import { Link, useLoaderData, useLocation, useSearchParams } from "@remix-run/react";
import { json } from "@remix-run/node";

// Handles EXACTS (identiques au Partner Dashboard)
const PLAN_HANDLES = {
  monthly: "premium-monthly",
  annual: "premium-annual",
};

// 🔎 SERVER: lire le plan actif SANS rediriger (juste pour marquer "Current")
export const loader = async ({ request }) => {
  const { authenticate } = await import("../shopify.server"); // import dynamique
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
    // lecture best-effort : on laisse currentHandle = null en cas d'erreur
  }

  return json({ currentHandle });
};

export default function Pricing() {
  const { currentHandle } = useLoaderData();
  const location = useLocation();
  const [params] = useSearchParams();

  // Lien d’activation: conserve tous les params et ajoute plan=<handle>
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

  // Retour page principale: ne garde que shop/host (pas d’auto-redir ici)
  const backToAppHref = useMemo(() => {
    const src = new URLSearchParams(location.search || "");
    const shop = src.get("shop");
    const host = src.get("host");
    const qs = new URLSearchParams();
    if (shop) qs.set("shop", shop);
    if (host) qs.set("host", host);
    return qs.toString() ? `/settings?${qs.toString()}` : "/settings";
  }, [location.search]);

  // --- UI ---
  const cardStyle = {
    backgroundColor: "#0f0f0f",
    color: "#fff",
    padding: "24px",
    width: "320px",
    borderRadius: "12px",
    boxShadow: "0 0 24px rgba(0,0,0,0.4)",
    textAlign: "center",
    border: "1px solid #fff",
    position: "relative",
  };
  const priceStyle = { fontSize: "28px", fontWeight: "bold", margin: "10px 0" };
  const oldPriceStyle = { textDecoration: "line-through", color: "#888", marginBottom: "16px" };

  const Features = () => (
    <div style={{ textAlign: "left", color: "#fff", fontSize: "13px", marginBottom: "20px", lineHeight: 1.5 }}>
      <h4 style={{ marginBottom: "8px", fontWeight: "bold" }}>Premium Features</h4>
      <p style={{ margin: "4px 0", fontWeight: "bold" }}>Highly-customizable Announcement Bar</p>
      <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
        <li>Three styles: standard scrolling, multilingual carousel, professional light-glow</li>
        <li>Image or color background, semi-transparent overlay, adjustable text shadow</li>
        <li>Button positionable left, center, or right</li>
      </ul>
      <p style={{ margin: "12px 0 4px", fontWeight: "bold" }}>High-conversion Popup</p>
      <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
        <li>Three visuals: standard, simple light effect, pro radial-glow</li>
        <li>Image or solid color background, text alignment, font size/style adjustable</li>
        <li>Display delay, customizable call-to-action button</li>
      </ul>
      <p style={{ margin: "12px 0 4px", fontWeight: "bold" }}>Dynamic Countdown</p>
      <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
        <li>Three formats: simple, square, animated circle</li>
        <li>Fully customizable background, border & text colors</li>
        <li>Optional glowing effect, days/hours/minutes/seconds timer</li>
      </ul>
      <p style={{ margin: "12px 0 4px", fontWeight: "bold" }}>Seamless Integration</p>
      <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
        <li>Add and configure directly from Shopify Theme Editor</li>
        <li>Real-time preview of each block</li>
        <li>Zero code required, instant setup</li>
      </ul>
    </div>
  );

  const TagCurrent = () => (
    <div
      style={{
        position: "absolute",
        top: "-10px",
        right: "-10px",
        background: "#22c55e",
        color: "#000",
        fontWeight: "bold",
        padding: "6px 10px",
        borderRadius: "9999px",
        boxShadow: "0 0 12px rgba(34,197,94,0.6)",
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#16a34a" />
        <path d="M7 12.5l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Current
    </div>
  );

  return (
    <div
      className="pricing-root"
      style={{
        background: "#ffffff",
        color: "#0f0f0f",
        minHeight: "100vh",
        padding: "32px 16px",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          background: "linear-gradient(90deg, #000000, #4b4b4b)",
          color: "#fff",
          fontSize: "22px",
          fontWeight: "bold",
          textAlign: "center",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
          marginBottom: "24px",
        }}
      >
        Unlock All Features with the Premium Plan
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "16px",
          justifyItems: "center",
          alignItems: "start",
        }}
      >
        {/* Monthly */}
        <div style={cardStyle}>
          {currentHandle === PLAN_HANDLES.monthly && <TagCurrent />}
          <h3 style={{ fontSize: "20px", marginBottom: "6px" }}>Premium Plan — Monthly</h3>
          <p style={priceStyle}>
            $4.99 <span style={{ fontSize: "13px" }}>/month</span>
          </p>
          <p style={oldPriceStyle}>$14.99</p>

          <Features />

          {currentHandle === PLAN_HANDLES.monthly ? (
            <button
              disabled
              style={{
                background: "#22c55e",
                color: "#000",
                padding: "10px 16px",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "15px",
                width: "100%",
                cursor: "not-allowed",
              }}
            >
              Current plan
            </button>
          ) : (
            <a href={activateMonthlyHref} target="_top" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button
                style={{
                  background: "linear-gradient(90deg, #000000, #4b4b4b)",
                  color: "#fff",
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "15px",
                  cursor: "pointer",
                  width: "100%",
                  boxShadow: "0 0 12px #fff",
                }}
              >
                Activate Premium Now
              </button>
            </a>
          )}
        </div>

        {/* Annual */}
        <div style={cardStyle}>
          {currentHandle === PLAN_HANDLES.annual && <TagCurrent />}
          <h3 style={{ fontSize: "20px", marginBottom: "6px" }}>Premium Plan — Annual</h3>
          <p style={priceStyle}>
            $39.99 <span style={{ fontSize: "13px" }}>/year</span>
          </p>
          <p style={oldPriceStyle}>$89.99</p>

          <Features />

          {currentHandle === PLAN_HANDLES.annual ? (
            <button
              disabled
              style={{
                background: "#22c55e",
                color: "#000",
                padding: "10px 16px",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "15px",
                width: "100%",
                cursor: "not-allowed",
              }}
            >
              Current plan
            </button>
          ) : (
            <a href={activateAnnualHref} target="_top" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <button
                style={{
                  background: "linear-gradient(90deg, #000000, #4b4b4b)",
                  color: "#fff",
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "15px",
                  cursor: "pointer",
                  width: "100%",
                  boxShadow: "0 0 12px #fff",
                }}
              >
                Activate Premium Now
              </button>
            </a>
          )}
        </div>
      </div>

      {/* Bouton retour page principale */}
      <div style={{ textAlign: "center", marginTop: "28px" }}>
        <Link to={backToAppHref}>
          <button
            style={{
              marginTop: "12px",
              background: "#000",
              color: "#fff",
              padding: "12px 20px",
              border: "none",
              borderRadius: "9999px",
              fontWeight: "bold",
              boxShadow: "0 0 12px rgba(0,0,0,0.4)",
              cursor: "pointer",
            }}
          >
            Back to app
          </button>
        </Link>
      </div>
    </div>
  );
}
