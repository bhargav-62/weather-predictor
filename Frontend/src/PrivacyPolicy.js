import React from 'react';

function PrivacyPolicy() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>Privacy Policy</h1>

      <p>Effective date: September 2025</p>

      <p>
        Weather Predictor ("we", "our", or "us") values your privacy and is committed to protecting your personal information. This policy explains how we collect, use, and disclose information when you use our website and services.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li>Personal information you provide directly (e.g., location, preferences).</li>
        <li>Automatically collected data like IP address, device info, and usage patterns.</li>
        <li>Cookies and tracking technologies (including Google AdSense cookies for ads).</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To provide and improve our weather prediction services.</li>
        <li>To communicate with you and respond to your inquiries.</li>
        <li>To display personalized ads through trusted third-party services like Google AdSense.</li>
        <li>To comply with legal obligations and protect our rights.</li>
      </ul>

      <h2>Third-Party Services</h2>
      <p>
        We use Google AdSense to display ads on our site. Google may collect information via cookies and other tracking technologies. Please see <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a> for more details.
      </p>

      <h2>Your Choices</h2>
      <ul>
        <li>You can disable cookies in your browser settings, but this may affect site functionality.</li>
        <li>You can opt out of personalized ads via Google's ad settings.</li>
      </ul>

      <h2>Contact Us</h2>
      <p>If you have questions about this privacy policy, please contact us at support@weatherpredictor.com.</p>
    </div>
  );
}

export default PrivacyPolicy;
