import { useState, useMemo } from "react";
import { useLocation } from "@remix-run/react";

export default function Pricing() {
  const [period, setPeriod] = useState("monthly");
  const location = useLocation();

  // Conserve les params Shopify (shop, host, embedded, hmac, …) et ajoute plan
  const activateHref = useMemo(() => {
    const params = new URLSearchParams(location.search || "");
    params.set("plan", period); // "monthly" | "annual"
    return `/billing/activate?${params.toString()}`;
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
      {/* Banner */}
      <div
        style={{
          background: "linear-gradient(90deg, #000000, #4b4b4b)",
          color: "#fff",
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(255,255,255,.5)",
          marginBottom: "30px",
        }}
      >
        Unlock All Features with the Premium Plan
      </div>

      {/* Switch */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 30 }}>
        <button
          onClick={() => setPeriod("monthly")}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
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
            borderRadius: 8,
            fontWeight: "bold",
            border: "1px solid #000",
            backgroundColor: period === "annual" ? "#000" : "#fff",
            color: period === "annual" ? "#fff" : "#000",
            boxShadow: period === "annual" ? "0 0 10px #000" : "none",
            cursor: "pointer",
          }}
        >
          Annual <span style={{ fontSize: 12 }}>(save 50%)</span>
        </button>
      </div>

      {/* Card */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            backgroundColor: "#0f0f0f",
            color: "#fff",
            padding: 30,
            width: 360,
            borderRadius: 12,
            boxShadow: "0 0 30px rgba(0,0,0,.5)",
            textAlign: "center",
            border: "1px solid #fff",
          }}
        >
          <h3 style={{ fontSize: 22, marginBottom: 8 }}>Premium Plan</h3>
          <p style={{ fontSize: 30, fontWeight: "bold", margin: "10px 0" }}>
            {period === "monthly" ? "$4.99" : "$39.99"} <span style={{ fontSize: 14 }}>/month</span>
          </p>
          <p style={{ textDecoration: "line-through", color: "#888", marginBottom: 20 }}>
            {period === "monthly" ? "$14.99" : "$89.99"}
          </p>

          {/* features (inchangé) */}
          <div style={{ textAlign: "left", color: "#fff", fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
            <h4 style={{ marginBottom: 8, fontWeight: "bold" }}>Premium Features</h4>
            {/* … tes listes de features … */}
          </div>

          {/* Bouton: conserve les params & ouvre au top */}
          <a href={activateHref} target="_top" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <button
              style={{
                background: "linear-gradient(90deg, #000000, #4b4b4b)",
                color: "#fff",
                padding: "12px 20px",
                border: "none",
                borderRadius: 8,
                fontWeight: "bold",
                fontSize: 16,
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

      {/* Retour */}

    </div>
  );
}


