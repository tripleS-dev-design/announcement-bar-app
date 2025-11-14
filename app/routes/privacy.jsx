// app/routes/privacy.jsx
export const loader = () => null;

export default function Privacy() {
  return (
    <main style={{maxWidth: 840, margin: "40px auto", padding: 16, lineHeight: 1.7, fontFamily: "Inter, system-ui, sans-serif"}}>
      <h1 style={{marginBottom: 12}}>Privacy Policy — Triple Announcement Bar</h1>
      <p><strong>Last updated:</strong> {new Date().getFullYear()}</p>

      <h2 style={{marginTop: 24}}>What we collect</h2>
      <ul>
        <li>Shop identifier (domain) and app settings you configure</li>
        <li>Billing status (to deliver premium features)</li>
      </ul>
      <p>We do <strong>not</strong> access protected customer personal data (PII) or order contents.</p>

      <h2 style={{marginTop: 24}}>How we use data</h2>
      <ul>
        <li>Operate the app (apply your announcement bars, popups, countdowns)</li>
        <li>Process billing and provide support</li>
      </ul>

      <h2 style={{marginTop: 24}}>Storage & retention</h2>
      <p>Settings are stored securely. We retain only what’s necessary and delete data on request or after app uninstallation, subject to legal requirements.</p>

      <h2 style={{marginTop: 24}}>Sharing</h2>
      <p>We do not sell data. Shopify acts as a platform provider; data may transit through Shopify services to operate the app.</p>

      <h2 style={{marginTop: 24}}>Your rights</h2>
      <p>Contact us to access, correct, or delete your data related to this app.</p>

      <h2 style={{marginTop: 24}}>Contact</h2>
      <p>Email: <a href="mailto:ktami.sami@gmail.com">ktami.sami@gmail.com</a></p>
    </main>
  );
}
