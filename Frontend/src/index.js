import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Render the main React app component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Register service worker for offline caching and PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registered successfully with scope: ', registration.scope);
      })
      .catch(error => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
}
