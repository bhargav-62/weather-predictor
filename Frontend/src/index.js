import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Render the main app component into the root div
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register the service worker to enable offline capability and faster load
serviceWorker.register();
