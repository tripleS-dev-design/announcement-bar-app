import { useState } from "react";

export default function Settings() {
  const [selectedBlock, setSelectedBlock] = useState(null);

  const blocks = [
    {
      id: "announcement-bar",
      name: "📢 Barre d’annonce",
      description: "Affiche un message défilant ou statique en haut du site, idéal pour signaler une promotion ou livraison gratuite.",
      examples: [
        "🚚 Livraison gratuite aujourd’hui uniquement !",
        "🔥 -20% sur toute la boutique !",
        "🎁 Un cadeau offert dès 50€ d’achat !"
      ]
    },
    {
      id: "popup",
      name: "💬 Popup",
      description: "Une fenêtre qui s’ouvre automatiquement ou à l’action de l’utilisateur. Parfait pour des offres limitées, coupons ou formulaires.",
      examples: [
        "🎟️ -10% avec le code BIENVENUE10",
        "🕒 Offre limitée à 24h",
        "📧 Abonnez-vous à notre newsletter"
      ]
    },
    {
      id: "counter",
      name: "⏱️ Compteur",
      description: "Ajoute un compte à rebours pour inciter à l’achat rapide (ex. : fin de promotion, stock limité).",
      examples: [
        "⏳ Promotion se termine dans : 00:12:43",
        "🕐 Derniers stocks disponibles !",
        "📦 Offre expire aujourd’hui à minuit"
      ]
    }
  ];

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.title}>🎛️ Paramètres de l’application</h1>

      {blocks.map((block) => (
        <div
          key={block.id}
          style={styles.blockContainer}
          onClick={() =>
            setSelectedBlock(selectedBlock === block.id ? null : block.id)
          }
        >
          <div style={styles.blockHeader}>
            <span style={styles.blockName}>{block.name}</span>
            <div style={styles.youtubeBox}>
              <a
                href={`https://www.youtube.com/results?search_query=${block.name.replace(" ", "+")}`}
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#fff"
                >
                  <path d="M19.615 3.184a4.141 4.141 0 0 1 2.91 2.918C23 8.489 23 12 23 12s0 3.511-.475 5.898a4.141 4.141 0 0 1-2.91 2.918C17.247 22 12 22 12 22s-5.247 0-7.615-.184a4.141 4.141 0 0 1-2.91-2.918C1 15.511 1 12 1 12s0-3.511.475-5.898a4.141 4.141 0 0 1 2.91-2.918C6.753 2 12 2 12 2s5.247 0 7.615.184zM10 8.5v7l6-3.5-6-3.5z" />
                </svg>
              </a>
            </div>
          </div>

          {selectedBlock === block.id && (
            <div style={styles.description}>
              <p style={{ marginBottom: 10 }}>{block.description}</p>
              <ul>
                {block.examples.map((ex, i) => (
                  <li key={i}>✅ {ex}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif"
  },
  title: {
    fontSize: "24px",
    textAlign: "center",
    marginBottom: "40px"
  },
  blockContainer: {
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    padding: "20px 30px",
    marginBottom: "20px",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  blockHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  blockName: {
    fontSize: "20px",
    fontWeight: "bold"
  },
  youtubeBox: {
    width: 44,
    height: 28,
    backgroundColor: "#FF0000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px"
  },
  description: {
    marginTop: "15px",
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "6px",
    fontSize: "15px"
  }
};
