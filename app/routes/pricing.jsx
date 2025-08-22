// app/routes/pricing.jsx
import { redirect } from "@remix-run/node";
import { useMemo, useEffect } from "react";
import { useLocation, useSearchParams } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { PLAN_HANDLES } from "../shopify.server";

// SERVER: vérifie et éventuellement déclenche la souscription si ?plan= présent
export async function loader({ request }) {
  const { billing } = await authenticate.admin(request);
  const url = new URL(request.url);
  const plan = url.searchParams.get("plan");

  // Déjà abonné ? on sort de /pricing
  const hasPayment = await billing.check({
    plans: Object.values(PLAN_HANDLES),
  });
  if (hasPayment) {
    return redirect(`/settings?${url.searchParams.toString()}`);
  }

  // La demande de souscription se fait dans /billing/activate (géré par un autre fichier)
  return null;
}

// CLIENT: UI inchangée (liens -> /billing/activate)
export default function Pricing() {
  const location = useLocation();
  const [params] = useSearchParams();

  // Bypass de test si tu veux (optionnel)
  useEffect(() => {
    if (params.get("billing") === "dev") {
      const shop = params.get("shop");
      const host = params.get("host");
      const rest = new URLSearchParams(location.search || "");
      rest.delete("billing");
      const qs = new URLSearchParams();
      if (shop) qs.set("shop", shop);
      if (host) qs.set("host", host);
      for (const [k, v] of rest.entries()) {
        if (k !== "shop" && k !== "host") qs.set(k, v);
      }
      window.location.replace(`/settings?${qs.toString()}`);
    }
  }, [params, location.search]);

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

  const cardStyle = {
    backgroundColor: "#0f0f0f",
    color: "#fff",
    padding: "24px",
    width: "320px",
    borderRadius: "12px",
    boxShadow: "0 0 24px rgba(0,0,0,0.4)",
    textAlign: "center",
    border: "1px solid #fff",
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
        <div style={cardStyle}>
          <h3 style={{ fontSize: "20px", marginBottom: "6px" }}>Premium Plan — Monthly</h3>
          <p style={priceStyle}>$4.99 <span style={{ fontSize: "13px" }}>/month</span></p>
          <p style={oldPriceStyle}>$14.99</p>

          <Features />

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
        </div>

        <div style={cardStyle}>
          <h3 style={{ fontSize: "20px", marginBottom: "6px" }}>Premium Plan — Annual</h3>
          <p style={priceStyle}>$39.99 <span style={{ fontSize: "13px" }}>/year</span></p>
          <p style={oldPriceStyle}>$89.99</p>

          <Features />

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
        </div>
      </div>
    </div>
  );
}
