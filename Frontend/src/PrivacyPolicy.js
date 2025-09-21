import React from 'react';

function PrivacyPolicy() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h1>Privacy Policy</h1>
      <p>Effective date: September 2025</p>
      <p>
        Weather Predictor ("we", "our", or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li><strong>Location and Weather Data:</strong> Information you provide to get weather forecasts.</li>
        <li><strong>Usage Data and Cookies:</strong> Automatically collected data to improve your experience and site functionality.</li>
        <li><strong>Third-Party Cookies:</strong> We use third-party services like Google AdSense, which use cookies and similar technologies.</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To provide and improve weather forecast services and personalized content.</li>
        <li>To display relevant advertisements and personalize ads based on your preferences.</li>
        <li>To comply with legal requirements and obligations.</li>
      </ul>

      <h2>Third-Party Services</h2>
      <p>
        We partner with third-party service providers such as Google AdSense to serve ads. These providers may use cookies and other tracking technologies to collect information about your visits to our site and other websites to provide personalized advertising.
      </p>
      <p>
        Learn more about <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.
      </p>

      <h2>Your Choices and Rights</h2>
      <ul>
        <li>You can disable cookies in your browser settings, although some features of the site may not function properly.</li>
        <li>You can opt-out of personalized advertising through Google Ad Settings available at <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">https://www.google.com/settings/ads</a>.</li>
        <li>You may contact us at any time to request information or raise concerns regarding your data.</li>
      </ul>

      <h2>Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy or our data practices, please contact us at <a href="mailto:support@weatherpredictor.com">support@weatherpredictor.com</a>.
      </p>
    </div>
  );
}

export default PrivacyPolicy;
