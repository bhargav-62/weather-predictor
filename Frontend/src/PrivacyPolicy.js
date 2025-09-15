import React from 'react';

function PrivacyPolicy() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>Privacy Policy</h1>
      <p>Effective date: September 2025</p>
      <p>
        Weather Predictor ("we", "our", or "us") respects your privacy and is committed to protecting it.
      </p>
      <h2>Information We Collect</h2>
      <ul>
        <li>Location and weather data you provide.</li>
        <li>Automatically collected usage data and cookies.</li>
        <li>Third-party cookies such as Google AdSense.</li>
      </ul>
      <h2>How We Use Your Information</h2>
      <ul>
        <li>To provide and improve weather services.</li>
        <li>To personalize content and ads.</li>
        <li>To comply with legal obligations.</li>
      </ul>
      <h2>Third-Party Services</h2>
      <p>
        We use Google AdSense which may collect data via cookies and other technologies.
        See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.
      </p>
      <h2>Your Choices</h2>
      <ul>
        <li>You can disable cookies in browser settings.</li>
        <li>You can opt out of personalized advertising with Google Ad Settings.</li>
      </ul>
      <h2>Contact Us</h2>
      <p>If you have questions about this policy, email us at support@weatherpredictor.com.</p>
    </div>
  );
}

export default PrivacyPolicy;
