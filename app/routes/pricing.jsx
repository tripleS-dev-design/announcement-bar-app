import { useEffect, useMemo } from "react";
import { useLocation, useSearchParams } from "@remix-run/react";

// ✅ handles EXACTS comme dans le Partner Dashboard
const PLAN_HANDLES = {
  monthly: "premium-monthly",
  annual: "premium-annual",
};

export default function Pricing() {
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

  // ✅ util pour fabriquer le lien d’activation avec tous les params + plan=<handle>
  const makeActivateHref = useMemo(() => {
    return (planHandle) => {
      const qs = new URLSearchParams(location.search || "");
      qs.set("plan", planHandle); // <-- handle réel attendu par le backend
      return `/billing/activate?${qs.toString()}`;
    };
  }, [location.search]);

  // Petites données d’affichage pour chaque plan
  const PLANS = [
    {
      key: "monthly",
      title: "Premium – Monthly",
      priceLine: "$4.99",
      sub: "/month",
      strike: "$14.99",
      badge: null,
      handle: PLAN_HANDLES.monthly,
    },
    {
      key: "annual",
      title: "Premium – Annual",
      priceLine: "$39.99",
      sub: "/year",
      strike: "$89.99",
      badge: "Save 50%",
      handle: PLAN_HANDLES.annual,
    },
  ];

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

      {/* Deux cartes côte à côte (wrap sur petit écran) */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        {PLANS.map((p) => (
          <div
            key={p.key}
            style={{
              backgroundColor: "#0f0f0f",
              color: "#fff",
              padding: "24px",
              width: "320px", // plus petit pour tenir à 2 sur desktop
              borderRadius: "12px",
              boxShadow: "0 0 24px rgba(0,0,0,0.45)",
              textAlign: "center",
              border: "1px solid #fff",
            }}
          >
            <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>{p.title}</h3>

            {p.badge && (
              <div
                style={{
                  display: "inline-block",
                  marginBottom: "10px",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: "#ffffff",
                  color: "#000",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {p.badge}
              </div>
            )}

            <p style={{ fontSize: "26px", fontWeight: "bold", margin: "8px 0" }}>
              {p.priceLine} <span style={{ fontSize: "13px" }}>{p.sub}</span>
            </p>

            <p
              style={{
                textDecoration: "line-through",
                color: "#888",
                marginBottom: "16px",
                fontSize: "14px",
              }}
            >
              {p.strike}
            </p>

            {/* Liste des fonctionnalités (identiques pour les deux cartes) */}
            <div
              style={{
                textAlign: "left",
                color: "#ffff",
                fontSize: "13px",
                marginBottom: "18px",
                lineHeight: 1.5,
              }}
            >
              <h4 style={{ marginBottom: "6px", fontWeight: "bold" }}>
                Premium Features
              </h4>

              <p style={{ margin: "4px 0", fontWeight: "bold" }}>
                Highly-customizable Announcement Bar
              </p>
              <ul style={{ paddingLeft: "18px", margin: "4px 0" }}>
                <li>
                  Three styles: standard scrolling, multilingual carousel,
                  professional light-glow
                </li>
                <li>
                  Image or color background, semi-transparent overlay, adjustable
                  text shadow
                </li>
                <li>Button positionable left, center, or right</li>
              </ul>

              <p style={{ margin: "10px 0 4px", fontWeight: "bold" }}>
                High-conversion Popup
              </p>
              <ul style={{ paddingLeft: "18px", margin: "4px 0" }}>
                <li>
                  Three visuals: standard, simple light effect, pro radial-glow
                </li>
                <li>
                  Image or solid color background, text alignment, font size/style
                  adjustable
                </li>
                <li>Display delay, customizable call-to-action button</li>
              </ul>

              <p style={{ margin: "10px 0 4px", fontWeight: "bold" }}>
                Dynamic Countdown
              </p>
              <ul style={{ paddingLeft: "18px", margin: "4px 0" }}>
                <li>Three formats: simple, square, animated circle</li>
                <li>Fully customizable background, border & text colors</li>
                <li>
                  Optional glowing effect, days/hours/minutes/seconds timer
                </li>
              </ul>

              <p style={{ margin: "10px 0 4px", fontWeight: "bold" }}>
                Seamless Integration
              </p>
              <ul style={{ paddingLeft: "18px", margin: "4px 0" }}>
                <li>Add and configure directly from Shopify Theme Editor</li>
                <li>Real-time preview of each block</li>
                <li>Zero code required, instant setup</li>
              </ul>
            </div>

            {/* Bouton: conserve les params & ouvre au top avec le bon handle */}
            <a
              href={makeActivateHref(p.handle)}
              target="_top"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
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
                  boxShadow: "0 0 10px #fff",
                }}
              >
                Activate {p.title}
              </button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
