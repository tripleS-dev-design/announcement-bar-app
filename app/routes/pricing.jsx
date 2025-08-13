import { useState, useMemo } from "react";
import { useLocation } from "@remix-run/react";

export default function Pricing() {
  const [period, setPeriod] = useState("monthly");
  const location = useLocation();

  // Conserver tous les paramètres Shopify (shop, host, etc.)
  const activateHref = useMemo(() => {
    const params = new URLSearchParams(location.search);
    params.set("plan", period); // monthly | annual
    return `/billing/activate?${params.toString()}`;
  }, [location.search, period]);

  return (
    <div
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
            <span style={{ fontSize: "14px" }}>/month</span>
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

          {/* Bouton */}
          <a
            href={activateHref}
            target="_top"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
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
