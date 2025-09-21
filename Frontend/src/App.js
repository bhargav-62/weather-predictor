import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PrivacyPolicy from './PrivacyPolicy';
import WeatherWidget from './WeatherWidget';
import ThemeSwitcher from './ThemeSwitcher';
import Home from './Home';
import ImageLocationWeather from './ImageLocationWeather';
import './styles.css';

function App() {
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
            <Link to="/" style={{ color: '#8ecae6', marginRight: 20, fontWeight: 600, textDecoration: 'none' }}>Home</Link>
            <Link to="/weather" style={{ color: '#8ecae6', marginRight: 20, fontWeight: 600, textDecoration: 'none' }}>Weather</Link>
            <Link to="/image-weather" style={{ color: '#8ecae6', marginRight: 20, fontWeight: 600, textDecoration: 'none' }}>Image Weather</Link>
            <Link to="/privacy-policy" style={{ color: '#8ecae6', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</Link>
          </nav>
          <ThemeSwitcher />
        </header>

        <main style={{ flexGrow: 1, padding: 20 }}>
          {/* Static content visible on all pages to satisfy AdSense */}
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
            <p>Get accurate weather forecast and climate information for any location.</p>
            <h3>How to Use:</h3>
            <ul>
              <li>Enter city name or coordinates in the search bar.</li>
              <li>Click the "Get Weather" button.</li>
              <li>View current weather, suggested activities, motivational quotes, and playlists.</li>
              <li>Switch themes with the toggle in the header.</li>
            </ul>
            <h3>Sample Content:</h3>
            <p><b>Suggested Activity:</b> Take a walk in the park or try light gardening.</p>
            <p><b>Motivational Quote:</b> "Every day is a new opportunity to grow."</p>
            <p><b>Playlist:</b> Sunny Vibes – happy and energetic music.</p>
          </div>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/weather" element={<WeatherWidget />} />
            <Route path="/image-weather" element={<ImageLocationWeather />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
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
