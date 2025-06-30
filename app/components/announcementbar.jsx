import { useEffect, useState } from 'react';

export default function AnnouncementBar() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch('/announcement')
      .then((res) => res.json())
      .then((data) => setSettings(data));
  }, []);

  if (!settings) {
    return <div>📢 Chargement de la barre d'annonce...</div>;
  }

  return (
    <div
      style={{
        backgroundColor: settings.bgColor,
        color: settings.textColor,
        border: `${settings.borderSize} solid ${settings.borderColor}`,
        fontSize: settings.fontSize,
        overflow: 'hidden',
        padding: '10px 0',
        position: 'relative',
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          animation: `scroll ${settings.speed} linear infinite`,
          paddingLeft: '100%',
        }}
      >
        {settings.text}
      </div>

      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
        `}
      </style>
    </div>
  );
}
