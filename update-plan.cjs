// Import fetch dynamiquement compatible avec .cjs
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// ✅ Remplace ici par tes infos Shopify
const shop = "TON-SHOP.myshopify.com";
const accessToken = "TON_ACCESS_TOKEN_ADMIN_API";
const themeId = "ID_DU_THEME_ACTIF"; // ← À modifier (ou récupérable dynamiquement aussi)

// 🧠 Requête pour injecter le plan dans settings_data.json
async function injectPlanSetting() {
  const url = `https://${shop}/admin/api/2023-10/themes/${themeId}/assets.json`;

  const payload = {
    asset: {
      key: "config/settings_data.json",
      value: JSON.stringify({
        current: "default",
        settings: {
          app_plan: "premium"  // ← Tu peux changer ici vers "free", "pro", etc.
        }
      })
    }
  };

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Erreur Shopify :", data);
    } else {
      console.log("✅ Plan injecté avec succès !");
    }
  } catch (err) {
    console.error("❌ Erreur système :", err);
  }
}

injectPlanSetting();
