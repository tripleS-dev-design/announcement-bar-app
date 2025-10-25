import React, { useState, useEffect } from "react";
import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { checkBillingStatus, requireActiveBilling } from "../utils/billing-middleware.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const isDirect = url.searchParams.get("direct") === "true";
  
  // DÉSACTIVÉ: Le mode direct contournait la facturation
  // Pour forcer la vérification de paiement, on supprime ce contournement
  console.log("🔒 DASHBOARD: Mode direct désactivé - vérification de facturation obligatoire");
  
  try {
    // Vérifier la facturation avec notre middleware
    const billingCheck = await requireActiveBilling(request, "/app/pricing");
    
    console.log("📊 DASHBOARD: Vérification de facturation:", billingCheck);
    
    // Si l'accès est refusé (pas de paiement ET pas d'essai), rediriger vers pricing
    if (billingCheck.access === "denied") {
      console.log("🚫 DASHBOARD: Accès refusé - redirection vers pricing");
      return redirect("/app/pricing?billing=required&reason=access_denied");
    }
    
    // Obtenir le statut détaillé pour affichage
    const billingStatus = billingCheck.billingStatus;
    
    return {
      shop: billingStatus.shop,
      hasActivePayment: billingStatus.hasActivePayment,
      trialDaysLeft: billingStatus.trialDaysRemaining || 0,
      subscriptionStatus: billingStatus.subscriptionStatus,
      billingMessage: billingStatus.message || "Statut de facturation vérifié",
      accessGranted: billingCheck.access === "granted"
    };
  } catch (error) {
    console.log("❌ DASHBOARD: Auth ou billing failed:", error.message);
    // En cas d'erreur, rediriger vers pricing pour commencer l'essai
    return redirect("/app/pricing?error=dashboard_auth_failed");
  }
};

// Style constants (same as before)
const BUTTON_BASE = {
  border: 'none',
  borderRadius: '8px',
  padding: '12px 24px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
};
const CONTAINER_STYLE = {
  maxWidth: '85%',
  margin: '0 auto',
  transform: 'scale(0.95)',
  transformOrigin: 'top center',
  padding: '16px',
};
const CARD_STYLE = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  alignItems: 'center',
};

// Keyframes for animations
const GLOBAL_STYLES = `
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
@keyframes popupGlowPro {
  0%   { box-shadow: 0 0 12px rgba(59,130,246,0.5); }
  50%  { box-shadow: 0 0 30px rgba(59,130,246,0.9); }
  100% { box-shadow: 0 0 12px rgba(59,130,246,0.5); }
}
`;

// Trial Status Banner avec gestion automatique Shopify
function TrialBanner({ trialDaysLeft, hasActivePayment, subscriptionStatus, billingMessage }) {
  if (hasActivePayment) {
    return (
      <div style={{
        background: 'linear-gradient(90deg, #28a745, #20c997)',
        color: '#fff',
        padding: '15px 20px',
        borderRadius: '12px',
        marginBottom: '20px',
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        ✅ Plan Premium Actif - Toutes les fonctionnalités débloquées !
        <br />
        <small style={{ opacity: 0.9 }}>🔄 Shopify gère automatiquement votre facturation</small>
      </div>
    );
  }

  if (trialDaysLeft > 0) {
    return (
      <div style={{
        background: 'linear-gradient(90deg, #ff6b35, #f7931e)',
        color: '#fff',
        padding: '15px 20px',
        borderRadius: '12px',
        marginBottom: '20px',
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        🎁 Essai Gratuit: {trialDaysLeft} jour(s) restant(s)
        <br />
        <small style={{ opacity: 0.9 }}>
          💳 Shopify activera automatiquement la facturation après 7 jours
        </small>
        <br />
        <a href="/app/pricing" style={{ color: '#fff', textDecoration: 'underline', marginTop: '5px', display: 'inline-block' }}>
          Voir Plans Premium
        </a>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(90deg, #dc3545, #fd7e14)',
      color: '#fff',
      padding: '15px 20px',
      borderRadius: '12px',
      marginBottom: '20px',
      textAlign: 'center',
      fontWeight: 'bold'
    }}>
      ⏰ Essai gratuit expiré - Abonnement requis
      <br />
      <small style={{ opacity: 0.9 }}>
        💡 Shopify gère automatiquement vos paiements et abonnements
      </small>
      <br />
      <a href="/app/pricing" style={{ color: '#fff', textDecoration: 'underline', marginTop: '5px', display: 'inline-block' }}>
        Activer votre abonnement maintenant
      </a>
    </div>
  );
}

// Opening popup
function OpeningPopup() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }} role="dialog" aria-modal="true">
      <div style={{ background: 'radial-gradient(circle at center, #1a1a1a, #000)', padding: '32px', borderRadius: '16px', textAlign: 'center', color: '#fff', maxWidth: '400px', width: '90%', boxShadow: '0 0 30px rgba(255,255,255,0.1)' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '22px' }}>🎉 Bienvenue dans votre essai gratuit !</h2>
        <p style={{ marginBottom: '12px', fontSize: '16px', color: '#ddd' }}>
          Vous avez <strong>7 jours gratuits</strong> pour tester toutes les fonctionnalités Premium.
        </p>
        <p style={{ marginBottom: '24px', fontSize: '14px', color: '#ccc' }}>
          Allez dans votre <strong>Theme Editor</strong> et ajoutez vos blocs premium !
        </p>
        <button onClick={() => setVisible(false)} style={{ ...BUTTON_BASE, backgroundColor: '#fff', color: '#000' }}>
          Commencer l'essai !
        </button>
      </div>
    </div>
  );
}

// All your preview components (same as before)
function PreviewAnnouncementBar() {
  const bars = [
    { bg: 'linear-gradient(to right, #6b0a1a, #ef0f6c)', color: '#fff', text: 'Limited-Time Sale! Enjoy up to 50% off on your favorite items', buttonText: 'Shop Now', link: '#' },
    { bg: 'linear-gradient(to right, #0f38ef, #89ffe1)', color: '#fff', text: 'Flash Sale Alert! Everything Must Go – Save Big Before It is Gone!', buttonText: 'Grab Deal', link: '#' },
    { bg: 'linear-gradient(to right, #13eb28, #a3e8ec)', color: '#000', text: 'Clearance – Prices Slashed! Do not Miss Out on Major Savings!', buttonText: 'Browse', link: '#' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {bars.map((bar, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: bar.bg, color: bar.color, padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold' }}>
          <a href={bar.link} style={{ ...BUTTON_BASE, backgroundColor: '#fff', color: '#333', padding: '8px 16px', fontSize: '14px', border: '1px solid rgba(0,0,0,0.1)' }}>
            {bar.buttonText}
          </a>
          <span style={{ flex: 1, marginLeft: '16px' }}>{bar.text}</span>
        </div>
      ))}
    </div>
  );
}

function PreviewPopup() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const show = () => { setVisible(true); setTimeout(() => setVisible(false), 2000); };
    show();
    const iv = setInterval(show, 4000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{
      position: 'relative',
      margin: '0 auto',
      transition: 'all 0.2s ease',
      transform: visible ? 'scale(1)' : 'scale(0.85)',
      opacity: visible ? 1 : 0,
      padding: '24px',
      maxWidth: '320px',
      backgroundColor: '#bfdbfe',
      borderLeft: '6px solid #3b82f6',
      borderRadius: '12px',
      animation: visible ? 'popupGlowPro 0.5s infinite ease-in-out' : 'none'
    }}>
      <h3 style={{ marginBottom: '8px', color: '#1e40af' }}>🎁 Exclusive Offer</h3>
      <p style={{ margin: 0, fontSize: '14px', color: '#1e3a8a' }}>
        Get <strong>20% OFF</strong> with code <strong style={{ backgroundColor: '#93c5fd', padding: '2px 4px', borderRadius: '4px' }}>WELCOME20</strong>
      </p>
      <button style={{ ...BUTTON_BASE, marginTop: '12px', backgroundColor: '#1e3a8a', color: '#bfdbfe' }}>
        Apply Now
      </button>
    </div>
  );
}

// Countdown helper and timer (same as before)
function calcRemaining(deadline) {
  const diff = Math.max(deadline - Date.now(), 0);
  const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function StyledTimer({ value, variant }) {
  const base = {
    fontFamily: 'sans-serif',
    padding: '8px 12px',
    minWidth: '40px',
    textAlign: 'center',
  };
  const styles = {
    standard: {
      ...base,
      backgroundColor: '#f0f0f0',
      color: '#333333',
      borderRadius: '6px',
      boxShadow: '0 0 8px rgba(59,130,246,0.3)',
    },
    rectangle: {
      ...base,
      backgroundColor: '#2d3748',
      color: '#e2e8f0',
      borderRadius: '4px',
      boxShadow: '0 0 10px rgba(107,146,255,0.4)',
    },
    circle: {
      ...base,
      border: '3px solid #2b6cb0',
      color: '#2b6cb0',
      borderRadius: '50%',
      boxShadow: '0 0 12px rgba(43,108,176,0.6)',
    },
  };
  return <div style={styles[variant]}>{value}</div>;
}

function PreviewCountdown() {
  const TWO_HOURS = 2 * 3600000;
  const deadline = Date.now() + TWO_HOURS;
  const [time, setTime] = useState(calcRemaining(deadline));

  useEffect(() => {
    const iv = setInterval(() => setTime(calcRemaining(deadline)), 1000);
    return () => clearInterval(iv);
  }, [deadline]);

  const parts = time.split(':');

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      maxWidth: '360px',
      margin: '0 auto'
    }}>
      {[
        ['Standard', 'standard'],
        ['Rectangle', 'rectangle'],
        ['Circle', 'circle'],
      ].map(([title, variant], i) => (
        <div
          key={i}
          style={{
            backgroundColor: '#f9f9f9',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            width: '100%',
          }}
        >
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#111' }}>
            {title}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {parts.map((p, idx) => (
              <StyledTimer key={idx} value={p} variant={variant} />
            ))}
          </div>
          <button style={{ ...BUTTON_BASE, backgroundColor: '#000', color: '#fff', padding: '8px 16px' }}>
            Add
          </button>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({ loaderData }) {
  const [lang, setLang] = useState('en');
  const { shop, hasActivePayment, trialDaysLeft, isDirect, subscriptionStatus, billingMessage } = loaderData || {};
  
  const baseEditorUrl = `https://${shop || 'selya11904'}.myshopify.com/admin/themes/current/editor?context=apps`;
  const blocks = [
    { id: 'announcement-bar-premium', title: 'Premium Announcement Bar', description: 'Animated or multilingual bar to grab attention.', preview: <PreviewAnnouncementBar /> },
    { id: 'popup-premium', title: 'Premium Popup', description: 'Modern popup with promo code and glow animation.', preview: <PreviewPopup /> },
    { id: 'countdown-premium', title: 'Premium Countdown', description: 'Three dynamic countdown styles.', preview: <PreviewCountdown /> },
  ];

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <OpeningPopup />
      <div style={CONTAINER_STYLE}>
        
        {/* Direct Access Banner */}
        {isDirect && (
          <div style={{
            background: 'linear-gradient(90deg, #28a745, #20c997)',
            color: '#fff',
            padding: '15px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            ✅ ACCÈS DIRECT ACTIVÉ - Contournement des problèmes d'authentification Shopify
          </div>
        )}
        
        {/* Trial Status Banner */}
        <TrialBanner 
          trialDaysLeft={trialDaysLeft} 
          hasActivePayment={hasActivePayment} 
          subscriptionStatus={subscriptionStatus}
          billingMessage={billingMessage}
        />
        
        <div style={{ background: 'linear-gradient(120deg, #1f1f1f 30%, #2c2c2c 50%, #444 70%)', backgroundSize: '800px 100%', borderRadius: '12px', padding: '24px', marginBottom: '32px', color: '#fff', textAlign: 'center', animation: 'shimmer 3s infinite linear' }}>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>"Welcome to Triple Announcement Bar! Let's boost your sales with powerful bars, popups, and countdowns."</p>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <select value={lang} onChange={e => setLang(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc' }}>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>
        
        {blocks.map(block => (
          <div key={block.id} style={CARD_STYLE}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>{block.title}</h2>
              <p style={{ marginBottom: '12px', color: '#555' }}>{block.description}</p>
              
              {/* Vérification d'accès premium avant redirection */}
              {hasActivePayment || trialDaysLeft > 0 ? (
                <a href={`${baseEditorUrl}&addAppBlockId=be79dab79ff6bb4be47d4e66577b6c50/${block.id}`} target="_blank" rel="noopener noreferrer">
                  <button style={{ ...BUTTON_BASE, backgroundColor: '#000', color: '#fff' }}>
                    ✅ Add Premium Block
                  </button>
                </a>
              ) : (
                <a href={`/app/pricing?billing=required&block=${block.id}`}>
                  <button style={{ ...BUTTON_BASE, backgroundColor: '#dc3545', color: '#fff', cursor: 'not-allowed' }}>
                    🔒 Abonnement Requis
                  </button>
                </a>
              )}
              
              {/* Message d'état pour chaque bloc */}
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#6c757d' }}>
                {hasActivePayment ? (
                  <span style={{ color: '#28a745' }}>✅ Accès Premium actif</span>
                ) : trialDaysLeft > 0 ? (
                  <span style={{ color: '#ff6b35' }}>🎁 Accès essai ({trialDaysLeft}j restant{trialDaysLeft > 1 ? 's' : ''})</span>
                ) : (
                  <span style={{ color: '#dc3545' }}>❌ Accès premium requis</span>
                )}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: '220px' }}>{block.preview}</div>
          </div>
        ))}

        {/* Pricing CTA Section - Separate from blocks */}
        {!hasActivePayment && (
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            padding: '30px',
            marginTop: '30px',
            textAlign: 'center',
            border: '2px dashed #dee2e6'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#495057' }}>
              💳 Prêt à débloquer toutes les fonctionnalités ?
            </h2>
            <p style={{ fontSize: '16px', color: '#6c757d', marginBottom: '20px' }}>
              Votre essai gratuit vous donne accès à tout pendant 7 jours. 
              Continuez avec un plan premium pour garder l'accès illimité !
            </p>
            <a href="/app/pricing">
              <button style={{
                ...BUTTON_BASE,
                backgroundColor: '#007bff',
                color: '#fff',
                fontSize: '18px',
                padding: '15px 30px'
              }}>
                🚀 Voir Plans & Tarifs
              </button>
            </a>
          </div>
        )}
      </div>
      
      {/* Contacts fixes */}
      <a href="https://wa.me/+212630079763" target="_blank" rel="noopener noreferrer" style={{ position: 'fixed', bottom: '24px', left: '24px', backgroundColor: '#000', borderRadius: '50%', padding: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#fff" viewBox="0 0 448 512">
          <path d="M380.9 97.1C339.4 55.6 283.3 32 224 32S108.6 55.6 67.1 97.1C25.6 138.6 2 194.7 2 254c0 45.3 13.5 89.3 39 126.7L0 480l102.6-38.7C140 481.5 181.7 494 224 494c59.3 0 115.4-23.6 156.9-65.1C422.4 370.6 446 314.5 446 254s-23.6-115.4-65.1-156.9zM224 438c-37.4 0-73.5-11.1-104.4-32l-7.4-4.9-61.8 23.3 23.2-60.6-4.9-7.6C50.1 322.9 38 289.1 38 254c0-102.6 83.4-186 186-186s186 83.4 186 186-83.4 186-186 186zm101.5-138.6c-5.5-2.7-32.7-16.1-37.8-17.9-5.1-1.9-8.8-2.7-12.5 2.7s-14.3 17.9-17.5 21.6c-3.2 3.7-6.4 4.1-11.9 1.4s-23.2-8.5-44.2-27.1c-16.3-14.5-27.3-32.4-30.5-37.9-3.2-5.5-.3-8.5 2.4-11.2 2.5-2.5 5.5-6.4 8.3-9.6 2.8-3.2 3.7-5.5 5.5-9.2s.9-6.9-.5-9.6c-1.4-2.7-12.5-30.1-17.2-41.3-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.6 1.4-14.6 6.9-19.2 18.7-19.2 45.7s19.7 53 22.4 56.7c2.7 3.7 38.6 59.1 93.7 82.8 13.1 5.7 23.3 9.1 31.3 11.7 13.1 4.2 25.1 3.6 34.6 2.2 10.5-1.6 32.7-13.4 37.3-26.3 4.6-12.7 4.6-23.5 3.2-25.7-1.4-2.2-5-3.6-10.5-6.2z"/>
        </svg>
      </a>
      <a href="https://www.youtube.com/@TON_COMPTE" target="_blank" rel="noopener noreferrer" style={{ position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#000', borderRadius: '50%', padding: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#fff" viewBox="0 0 576 512">
          <path d="M549.7 124.1c-6.3-23.7-24.9-42.3-48.6-48.6C458.2 64 288 64 288 64S117.8 64 74.9 75.5c-23.7 6.3-42.3 24.9-48.6 48.6C16 167 16 256 16 256s0 89 10.3 131.9c6.3 23.7 24.9 42.3 48.6 48.6C117.8 448 288 448 288 448s170.2 0 213.1-11.5c23.7-6.3 42.3-24.9 48.6-48.6C560 345 560 256 560 256s0-89-10.3-131.9zM232 334V178l142 78-142 78z"/>
        </svg>
      </a>
    </>
  );
}
