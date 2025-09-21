import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PrivacyPolicy from './PrivacyPolicy';
import WeatherWidget from './WeatherWidget';
import ThemeSwitcher from './ThemeSwitcher';
import Home from './Home';
import ImageLocationWeather from './ImageLocationWeather';
import './styles.css';

// Firebase messaging imports
import { requestForToken, onMessageListener } from './firebase-messaging';

function App() {
  const [notification, setNotification] = useState({ title: '', body: '' });
  const [isTokenFound, setTokenFound] = useState(false);

  useEffect(() => {
    // Request notification permission and get FCM token
    requestForToken(setTokenFound);

    // Listener for foreground messages
    onMessageListener()
      .then(payload => {
        const { title, body } = payload.notification;
        setNotification({ title, body });
      })
      .catch(err => console.log('Failed to receive message: ', err));
  }, []);

  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            backgroundColor: '#1e2a38',
            padding: '15px 20px',
            color: '#fff',
            fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h1>Weather Predictor</h1>
          <nav>
            <Link to="/" style={{ color: '#8ecae6', marginRight: 20, fontWeight: 600, textDecoration: 'none' }}>
              Home
            </Link>
            <Link to="/weather" style={{ color: '#8ecae6', marginRight: 20, fontWeight: 600, textDecoration: 'none' }}>
              Weather
            </Link>
            <Link to="/image-weather" style={{ color: '#8ecae6', marginRight: 20, fontWeight: 600, textDecoration: 'none' }}>
              Image Weather
            </Link>
            <Link to="/privacy-policy" style={{ color: '#8ecae6', fontWeight: 600, textDecoration: 'none' }}>
              Privacy Policy
            </Link>
          </nav>
          <ThemeSwitcher />
        </header>

        <main style={{ flexGrow: 1, padding: 20 }}>
          {/* ---- Always-Visible Static Informational Content ---- */}
          <div
            style={{
              background: "#f7fafc",
              borderRadius: 8,
              marginBottom: 24,
              padding: 20,
              boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
              maxWidth: 700,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <h2>Welcome to Weather Predictor</h2>
            <p>
              Weather Predictor gives you live weather for any city or coordinates.
              Instantly get activity suggestions, motivational quotes, and music playlists for every weather type!
            </p>
            <h3>How to use:</h3>
            <ul>
              <li>Enter your city or coordinates in the search box below.</li>
              <li>Click <strong>Get Weather</strong>.</li>
              <li>View today's suggested activity and motivational quote.</li>
              <li>Enjoy a mood-based playlist for your weather!</li>
            </ul>
            <h3>Sample Content (always visible):</h3>
            <p><b>Suggested Activity:</b> Take a walk in the park or try light gardening.</p>
            <p><b>Mood Playlist:</b> Sunny Beats – happy and energetic hits.</p>
            <p><b>Motivational Quote:</b> "Every day is a chance to do something great."</p>
          </div>
          {/* ---- End Always-Visible Static Informational Content ---- */}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/weather" element={<WeatherWidget />} />
            <Route path="/image-weather" element={<ImageLocationWeather />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>

          {/* Notification permission and messages */}
          <div>
            {isTokenFound ? (
              <p style={{ color: 'green' }}>Notifications enabled!</p>
            ) : (
              <p style={{ color: 'red' }}>Please allow notifications to get alerts.</p>
            )}
          </div>
          {notification.title && (
            <div
              style={{
                border: '1px solid gray',
                borderRadius: '5px',
                padding: '10px',
                marginTop: '20px',
                backgroundColor: '#f0f8ff',
              }}
            >
              <h3>{notification.title}</h3>
              <p>{notification.body}</p>
            </div>
          )}
        </main>

        <footer style={{ padding: 10, textAlign: 'center', backgroundColor: '#f1f1f1' }}>
          <Link to="/privacy-policy" style={{ color: '#777', textDecoration: 'none' }}>
            Privacy Policy
          </Link>
        </footer>
      </div>
    </Router>
  );
}

export default App;
