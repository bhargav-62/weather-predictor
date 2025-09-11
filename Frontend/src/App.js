import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PrivacyPolicy from './PrivacyPolicy';

// Import your existing components to add routes here
// import Home from './Home';
// import OtherComponent from './OtherComponent';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Example Header */}
        <header style={{ backgroundColor: '#282c34', padding: '10px', color: 'white' }}>
          <h1>Weather Predictor</h1>
          <nav>
            <Link to="/" style={{ color: 'white', marginRight: '15px' }}>Home</Link>
            <Link to="/privacy-policy" style={{ color: 'white' }}>Privacy Policy</Link>
          </nav>
        </header>

        {/* Main content area */}
        <main style={{ flexGrow: 1, padding: '20px' }}>
          <Routes>
            {/* Your existing routes */}
            {/* <Route path="/" element={<Home />} /> */}
            {/* Add other routes as necessary */}

            {/* Privacy Policy route */}
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer style={{ padding: '10px', textAlign: 'center', backgroundColor: '#f1f1f1' }}>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </footer>
      </div>
    </Router>
  );
}

export default App;
