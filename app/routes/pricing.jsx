import { useState, useMemo, useEffect } from "react";
import { useLocation, useSearchParams } from "@remix-run/react";

// ✅ handles EXACTS comme dans le Partner Dashboard
const PLAN_HANDLES = {
  monthly: "premium-monthly",
  annual: "premium-annual",
};

export default function Pricing() {
  const [period, setPeriod] = useState("monthly");
  const location = useLocation();
  const [params] = useSearchParams();

  // 🚀 bypass billing sur dev store
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

  // ✅ conserve tous les params + ajoute plan=<handle>
  const activateHref = useMemo(() => {
    const qs = new URLSearchParams(location.search || "");
    qs.set("plan", PLAN_HANDLES[period]); // <-- handle réel
    return `/billing/activate?${qs.toString()}`;
  }, [location.search, period]);

  return (
    <div
      className="pricing-root"
      style={{
        background: "#ffffff",
        color: "#0f0f0f",
        minHeight: "100vh",
        padding: "40px 20px",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
      }}
    >
      {/* Barre lumineuse */}
      <div
        style={{
          background: "linear-gradient(90deg, #000000, #4b4b4b)",
          color: "#fff",
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
          marginBottom: "30px",
        }}
      >
        Unlock All Features with the Premium Plan
      </div>

      {/* Switch mensuel/annuel */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={() => setPeriod("monthly")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "bold",
            border: "1px solid #000",
            backgroundColor: period === "monthly" ? "#000" : "#fff",
            color: period === "monthly" ? "#fff" : "#000",
            boxShadow: period === "monthly" ? "0 0 10px #000" : "none",
            cursor: "pointer",
          }}
        >
          Monthly
        </button>
        <button
          onClick={() => setPeriod("annual")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "bold",
            border: "1px solid #000",
            backgroundColor: period === "annual" ? "#000" : "#fff",
            color: period === "annual" ? "#fff" : "#000",
            boxShadow: period === "annual" ? "0 0 10px #000" : "none",
            cursor: "pointer",
          }}
        >
          Annual <span style={{ fontSize: "12px" }}> (save 50%)</span>
        </button>
      </div>

      {/* Carte plan premium */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            backgroundColor: "#0f0f0f",
            color: "#fff",
            padding: "30px",
            width: "360px",
            borderRadius: "12px",
            boxShadow: "0 0 30px rgba(0,0,0,0.5)",
            textAlign: "center",
            border: "1px solid #fff",
          }}
        >
          <h3 style={{ fontSize: "22px", marginBottom: "8px" }}>Premium Plan</h3>
          <p style={{ fontSize: "30px", fontWeight: "bold", margin: "10px 0" }}>
            {period === "monthly" ? "$4.99" : "$39.99"}
            <span style={{ fontSize: "14px" }}>
              {period === "monthly" ? "/month" : "/year"}
            </span>
          </p>
          <p
            style={{
              textDecoration: "line-through",
              color: "#888",
              marginBottom: "20px",
            }}
          >
            {period === "monthly" ? "$14.99" : "$89.99"}
          </p>

          <div
            style={{
              textAlign: "left",
              color: "#fff",
              fontSize: "14px",
              marginBottom: "24px",
              lineHeight: 1.5,
            }}
          >
            <h4 style={{ marginBottom: "8px", fontWeight: "bold" }}>
              Premium Features
            </h4>

            <p style={{ margin: "4px 0", fontWeight: "bold" }}>
              Highly-customizable Announcement Bar
            </p>
            <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
              <li>Three styles: standard scrolling, multilingual carousel, professional light-glow</li>
              <li>Image or color background, semi-transparent overlay, adjustable text shadow</li>
              <li>Button positionable left, center, or right</li>
            </ul>

            <p style={{ margin: "12px 0 4px", fontWeight: "bold" }}>
              High-conversion Popup
            </p>
            <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
              <li>Three visuals: standard, simple light effect, pro radial-glow</li>
              <li>Image or solid color background, text alignment, font size/style adjustable</li>
              <li>Display delay, customizable call-to-action button</li>
            </ul>

            <p style={{ margin: "12px 0 4px", fontWeight: "bold" }}>
              Dynamic Countdown
            </p>
            <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
              <li>Three formats: simple, square, animated circle</li>
              <li>Fully customizable background, border & text colors</li>
              <li>Optional glowing effect, days/hours/minutes/seconds timer</li>
            </ul>

            <p style={{ margin: "12px 0 4px", fontWeight: "bold" }}>
              Seamless Integration
            </p>
            <ul style={{ paddingLeft: "20px", margin: "4px 0" }}>
              <li>Add and configure directly from Shopify Theme Editor</li>
              <li>Real-time preview of each block</li>
              <li>Zero code required, instant setup</li>
            </ul>
          </div>

          {/* Bouton: conserve les params & ouvre au top */}
          <a href={activateHref} target="_top" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <button
              style={{
                background: "linear-gradient(90deg, #000000, #4b4b4b)",
                color: "#fff",
                padding: "12px 20px",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "16px",
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
