// src/ImageLocationWeather.js
import React, { useState } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';

function ImageLocationWeather() {
  const [imgURL, setImgURL] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImgURL(url);
    setLoading(true);

    const img = new window.Image();
    img.src = url;
    img.onload = async () => {
      const model = await mobilenet.load();
      const results = await model.classify(img);
      setPredictions(results);
      setLoading(false);
    };
  }

  async function fetchWeatherForLabel(label) {
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your OpenWeatherMap API key
    setWeather('Loading weather for ' + label + '...');
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${label}&units=metric&appid=${apiKey}`
      );
      const data = await response.json();
      if (data.main) {
        setWeather(`Temperature: ${data.main.temp}°C, Condition: ${data.weather[0].description}`);
      } else {
        setWeather(`Weather not found for "${label}"`);
      }
    } catch {
      setWeather('Error fetching weather');
    }
  }

  return (
    <div style={{ marginTop: 20 }}>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imgURL && (
        <img
          src={imgURL}
          alt="Selected"
          style={{ width: 300, marginTop: 20, borderRadius: 10, boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
        />
      )}
      {loading && <p>Analyzing image...</p>}

      {predictions.length > 0 && (
        <div style={{ marginTop: 15 }}>
          <strong>AI Suggestions:</strong>
          <ul>
            {predictions.map((pred) => (
              <li key={pred.className} style={{ margin: '6px 0' }}>
                <button
                  onClick={() => fetchWeatherForLabel(pred.className.split(',')[0])}
                  style={{
                    cursor: 'pointer',
                    background: '#007acc',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 12px',
                  }}
                >
                  {pred.className} ({Math.round(pred.probability * 100)}%)
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {weather && (
        <div style={{ marginTop: 20, fontWeight: '600', color: '#007acc' }}>
          <strong>Weather Info:</strong> {weather}
        </div>
      )}
    </div>
  );
}

export default ImageLocationWeather;
