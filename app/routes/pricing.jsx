// app/routes/pricing.jsx
import { useLocation } from "@remix-run/react";

export default function Pricing() {
  const location = useLocation();

  // Garder les paramètres (shop, host, etc.) pour revenir proprement à l’app
  const qs = location.search || "";
  const backToAppHref = `/settings${qs}`;

  const pageStyle = {
    background: "#F6F7F9",
    color: "#0f0f0f",
    minHeight: "100vh",
    padding: "32px 16px 40px",
    fontFamily: "'Inter', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Arial",
  };
  const shellStyle = { maxWidth: 800, margin: "0 auto" };

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

  const cardStyle = {
    background: "#fff",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 24px rgba(0,0,0,.08)",
    padding: 22,
  };

  const listStyle = { marginTop: 8, paddingLeft: 18, fontSize: 14, lineHeight: 1.5 };

  const backBtnWrap = { textAlign: "center", marginTop: 26 };
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
        <div style={headerStyle}>
          <h1 style={headerTitle}>Blocks: Bar, WhatsApp &amp; More is now 100% free</h1>
          <p style={headerSub}>
            All features are unlocked. No subscription, no billing, no trial — just install and use the blocks.
          </p>
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 10, fontSize: 17, fontWeight: 800 }}>
            What this means for your store
          </h2>
          <ul style={listStyle}>
            <li>✅ All premium blocks are included: bars, popups, countdowns, social icons, WhatsApp, scroller, gold products.</li>
            <li>✅ No monthly or annual payment — the app is completely free.</li>
            <li>✅ You can add blocks directly from the Theme Editor (Add block &gt; Apps).</li>
            <li>✅ You can uninstall at any time without any charge.</li>
          </ul>

          <p style={{ marginTop: 14, fontSize: 13, color: "#4b5563" }}>
            If you have ideas for new blocks or improvements, feel free to contact support from the main Settings page.
          </p>
        </div>

        <div style={backBtnWrap}>
          <a href={backToAppHref} style={{ textDecoration: "none", display: "inline-block" }}>
            <button style={backBtn}>Back to app</button>
          </a>
        </div>
      </div>
    </div>
  );
}
