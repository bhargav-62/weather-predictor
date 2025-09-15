import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h2>Welcome to Weather Predictor</h2>
      <p>
        Get accurate weather forecast and climate information for any location.
      </p>
      <Link
        to="/weather"
        style={{
          backgroundColor: '#219ebc',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
        }}
      >
        Go to Weather Dashboard
      </Link>
    </div>
  );
}

export default Home;
