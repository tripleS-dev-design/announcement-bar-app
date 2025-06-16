export default function Settings() {
  return (
    <div style={rowStyle}>
      <span style={blockNameStyle}>📢 Barre d’annonce</span>

      <a
        href="https://youtu.be/ton_lien_video"
        target="_blank"
        rel="noreferrer"
        style={youtubeLinkStyle}
        onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
        aria-label="Voir tutoriel YouTube"
      >
        <div style={youtubeBoxStyle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="20"
            viewBox="0 0 24 24"
            fill="#fff"
          >
            <path d="M19.615 3.184a4.141 4.141 0 0 1 2.91 2.918C23 8.489 23 12 23 12s0 3.511-.475 5.898a4.141 4.141 0 0 1-2.91 2.918C17.247 22 12 22 12 22s-5.247 0-7.615-.184a4.141 4.141 0 0 1-2.91-2.918C1 15.511 1 12 1 12s0-3.511.475-5.898a4.141 4.141 0 0 1 2.91-2.918C6.753 2 12 2 12 2s5.247 0 7.615.184zM10 8.5v7l6-3.5-6-3.5z" />
          </svg>
        </div>
      </a>
    </div>
  );
}

// --- Styles agrandis ---
const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "25px 40px",
  maxWidth: "700px",
  margin: "60px auto",
  background: "#fff",
  borderRadius: "14px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  fontFamily: "Arial, sans-serif"
};

const blockNameStyle = {
  fontSize: "22px",
  fontWeight: "bold",
  color: "#222"
};

const youtubeLinkStyle = {
  textDecoration: "none",
  display: "inline-block",
  transition: "transform 0.2s"
};

const youtubeBoxStyle = {
  width: 48,
  height: 32,
  backgroundColor: "#FF0000",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "6px",
  cursor: "pointer"
};
