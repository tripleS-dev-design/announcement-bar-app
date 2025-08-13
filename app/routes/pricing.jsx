import { useState, useMemo } from "react";
import { useLocation } from "@remix-run/react";

export default function Pricing() {
  const [period, setPeriod] = useState("monthly");
  const location = useLocation();

  // On récupère shop & host depuis l'iframe ou l'URL du parent
  const searchParams = new URLSearchParams(location.search);
  const shop = searchParams.get("shop") || "";
  const host = searchParams.get("host") || "";

  const activateHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set("plan", period);
    params.set("shop", shop);
    params.set("host", host);
    return `/billing.activate?${params.toString()}`;
  }, [shop, host, period]);

  return (
    <div style={{ padding: "40px", fontFamily: "'Inter', sans-serif" }}>
      <h1>Unlock All Features with Premium Plan</h1>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setPeriod("monthly")}>
          Monthly ($4.99)
        </button>
        <button onClick={() => setPeriod("annual")}>
          Annual ($39.99 - Save 50%)
        </button>
      </div>
      <a href={activateHref} target="_top" rel="noopener noreferrer">
        <button style={{ background: "#000", color: "#fff", padding: "12px 20px" }}>
          Activate Premium Now
        </button>
      </a>
    </div>
  );
}
