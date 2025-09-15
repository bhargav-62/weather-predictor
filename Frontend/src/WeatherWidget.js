import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import translations from './translations';
import {
  fetchWeather,
  fetchForecast,
} from './api';

const moodPlaylists = {
  rainy: 'https://open.spotify.com/playlist/37i9dQZF1DX1g0iEXLFycr',
  sunny: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd',
  default: 'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6',
};

const iconMap = {
  'Partly cloudy': 'wi-day-cloudy',
  Sunny: 'wi-day-sunny',
  Cloudy: 'wi-cloudy',
  Clear: 'wi-day-sunny',
  Rain: 'wi-rain',
  Thunderstorm: 'wi-thunderstorm',
  Snow: 'wi-snow',
  Mist: 'wi-fog',
  Overcast: 'wi-cloudy',
};

const getSuggestions = (condition, temperature, language) => {
  const t = translations[language] || translations.en;
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

  let activity = '';
  let playlistKey = 'default';
  let motivationalQuote = '';

  if (condition.toLowerCase().includes('rain')) {
    activity = `${t.cozyUp} ${timeOfDay}.`;
    playlistKey = 'rainy';
    motivationalQuote = t.rainQuote;
  } else if (condition.toLowerCase().includes('clear') || condition.toLowerCase().includes('sunny')) {
    activity = `${t.perfectWeather} ${timeOfDay}!`;
    playlistKey = 'sunny';
    motivationalQuote = t.sunQuote;
  } else {
    activity = `${t.meditate} ${timeOfDay}.`;
    motivationalQuote = t.peaceQuote;
  }

  if (temperature && temperature < 10) {
    activity += ` ${t.dressWarmly || "Don't forget to dress warmly!"}`;
  } else if (temperature && temperature > 30) {
    activity += ` ${t.stayHydrated || "Stay hydrated and cool."}`;
  }

  return {
    activity,
    playlistUrl: moodPlaylists[playlistKey],
    playlistName: playlistKey.charAt(0).toUpperCase() + playlistKey.slice(1) + ' Playlist',
    motivationalQuote,
  };
};

const WeatherWidget = () => {
  const [language, setLanguage] = useState('en');
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState({
    activity: '',
    playlistUrl: '',
    playlistName: '',
    motivationalQuote: '',
  });
  const [userMood, setUserMood] = useState(null);

  useEffect(() => {
    if (weather) {
      const newSuggestions = getSuggestions(weather.condition || '', weather.temperature || null, language);
      setSuggestions(newSuggestions);
    }
  }, [weather, language]);

  const handleFetch = async () => {
    setError(null);
    setWeather(null);
    setForecast([]);
    try {
      const weatherData = await fetchWeather(location);
      setWeather(weatherData);
      const forecastData = await fetchForecast(location);
      setForecast(forecastData.forecast);
      setSelectedDayIndex(0);
    } catch {
      setError('Failed to fetch weather');
    }
  };

  const addFavorite = () => {
    if (weather && weather.location && !favorites.includes(weather.location)) {
      setFavorites((prev) => [...prev, weather.location]);
    }
  };

  const fetchFavorite = async (city) => {
    setLocation(city);
    setError(null);
    try {
      const weatherData = await fetchWeather(city);
      setWeather(weatherData);
      const forecastData = await fetchForecast(city);
      setForecast(forecastData.forecast);
      setSelectedDayIndex(0);
    } catch {
      setError('Failed to fetch weather');
    }
  };

  const selectDay = (index) => {
    setSelectedDayIndex(index);
  };

  const readWeatherAloud = () => {
    if (!weather) return;
    if (!window.speechSynthesis) {
      alert('Speech synthesis not supported.');
      return;
    }
    const langVoiceMap = {
      en: 'en',
      te: 'te',
      hi: 'hi',
      ml: 'ml',
      ta: 'ta',
      kn: 'kn',
    };

    let text = '';
    switch (language) {
      case 'te':
        text = `[translate:${weather.location} లో వాతావరణం: ${weather.condition}, ఉష్ణోగ్రత: ${weather.temperature}°. ${suggestions.activity} ${suggestions.motivationalQuote}]`;
        break;
      case 'hi':
        text = `[translate:${weather.location} में मौसम: ${weather.condition}, तापमान: ${weather.temperature} डिग्री। ${suggestions.activity} ${suggestions.motivationalQuote}]`;
        break;
      case 'ml':
        text = `[translate:${weather.location}യിൽ കാലാവസ്ഥ: ${weather.condition}, താപനില: ${weather.temperature}°. ${suggestions.activity} ${suggestions.motivationalQuote}]`;
        break;
      case 'ta':
        text = `[translate:${weather.location} இல் வானிலை: ${weather.condition}, வெப்பம்: ${weather.temperature}°. ${suggestions.activity} ${suggestions.motivationalQuote}]`;
        break;
      case 'kn':
        text = `[translate:${weather.location} ನಲ್ಲಿ ಹವಾಮಾನ: ${weather.condition}, ತಾಪಮಾನ: ${weather.temperature}°. ${suggestions.activity} ${suggestions.motivationalQuote}]`;
        break;
      default:
        text = `The current weather in ${weather.location} is ${weather.condition}, with a temperature of ${weather.temperature} degrees Celsius. Suggested activity: ${suggestions.activity}. Motivational quote: ${suggestions.motivationalQuote}.`;
        break;
    }

    const utterance = new window.SpeechSynthesisUtterance(text);
    const langCode = language || 'en';
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang.toLowerCase().startsWith(langVoiceMap[langCode])) || voices[0];
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = 'en-US';
    }

    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      <div style={{ marginBottom: 15 }}>
        <label htmlFor="lang-select" style={{ marginRight: 10 }}>
          Select Language:
        </label>
        <select id="lang-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="te">Telugu</option>
          <option value="hi">Hindi</option>
          <option value="ml">Malayalam</option>
          <option value="ta">Tamil</option>
          <option value="kn">Kannada</option>
        </select>
      </div>

      <div style={{ marginBottom: 15 }}>
        <input
          type="text"
          placeholder="Enter city or coordinates (lat,lon)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ width: '60%', padding: 10, marginRight: 10, borderRadius: 8, border: '1px solid #ccc' }}
        />
        <button onClick={handleFetch} style={{ padding: '10px 20px', borderRadius: 8, background: '#007acc', color: 'white', border: 'none' }}>
          Get Weather
        </button>
        <button onClick={addFavorite} disabled={!weather} style={{ padding: '10px 20px', borderRadius: 8, marginLeft: 10, background: '#0a74da', color: 'white', border: 'none' }}>
          Save to Favorites
        </button>
        <button
          onClick={readWeatherAloud}
          disabled={!weather}
          style={{ marginLeft: 10, padding: '10px 20px', borderRadius: '8px', backgroundColor: '#007acc', color: 'white', border: 'none', cursor: weather ? 'pointer' : 'not-allowed' }}
        >
          🔊 Speak
        </button>
      </div>

      {favorites.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginBottom: 15 }}
        >
          <h3 style={{ color: '#0a74da' }}>Favorites</h3>
          {favorites.map((city) => (
            <button
              key={city}
              onClick={() => fetchFavorite(city)}
              style={{ margin: 5, padding: '8px 15px', borderRadius: 10, background: '#0a74da', color: 'white', border: 'none' }}
            >
              {city}
            </button>
          ))}
        </motion.div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weather && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 20 }}
        >
          <h2>{weather.location}</h2>
          <div>
            <i className={`wi ${iconMap[weather.condition] || 'wi-day-sunny'}`} style={{ fontSize: 60, color: '#007acc' }}></i>
          </div>
          <p><b>Temperature:</b> {weather.temperature} °C</p>
          <p><b>Condition:</b> {weather.condition}</p>
          <p><b>Alert:</b> {weather.alert}</p>
        </motion.div>
      )}

      {forecast.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3>5-Day Forecast</h3>
          <div style={{ display: 'flex', overflowX: 'auto', gap: 10 }}>
            {forecast.slice(0, 5).map((day, idx) => (
              <motion.div
                key={day.date}
                onClick={() => selectDay(idx)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                style={{
                  cursor: 'pointer',
                  padding: 10,
                  borderRadius: 12,
                  border: idx === selectedDayIndex ? '2px solid #007acc' : '1px solid #ccc',
                  background: idx === selectedDayIndex ? '#f3f8fd' : '#fbfdff',
                }}
              >
                <div><b>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</b></div>
                <div>{day.date}</div>
                <i className={`wi ${iconMap[day.conditions.split(',')[0]] || 'wi-day-sunny'}`} style={{ fontSize: 30, color: '#007acc' }}></i>
                <div>{day.temperature}°C</div>
                <div>{day.conditions}</div>
              </motion.div>
            ))}
          </div>
          <h4 style={{ marginTop: 15 }}>Hourly Forecast for {forecast[selectedDayIndex].date}</h4>
          <div style={{ display: 'flex', overflowX: 'auto', gap: 8 }}>
            {forecast[selectedDayIndex].hours.map((hour, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                style={{ minWidth: 70, padding: 6, border: '1px solid #ced6e0', borderRadius: 8, textAlign: 'center', background: '#f0f8ff', color: '#2f3542' }}
              >
                <div style={{ fontWeight: '600', fontSize: 13 }}>{hour.time}</div>
                <i className={`wi ${iconMap[hour.conditions] || 'wi-day-sunny'}`} style={{ fontSize: 30, color: '#007acc' }}></i>
                <div>{hour.temperature}°C</div>
                <div style={{ fontSize: 11 }}>{hour.conditions}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 25, padding: 20, background: '#e9f0f9', borderRadius: 12 }}>
        <h3>Suggested Activity</h3>
        <p><em>{suggestions.activity || 'Loading activity...'}</em></p>

        <h3>Mood Playlist</h3>
        {suggestions.playlistUrl ? (
          <p><a href={suggestions.playlistUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0a74da', fontWeight: '600' }}>{suggestions.playlistName}</a></p>
        ) : (
          <p>Loading playlist...</p>
        )}

        <h3>Motivational Quote</h3>
        <blockquote style={{ fontStyle: 'italic', marginTop: 5 }}>{suggestions.motivationalQuote || 'Loading quote...'}</blockquote>
      </div>

      <div style={{ marginTop: 25 }}>
        <label style={{ fontWeight: '700', fontSize: 16, color: '#1681c2' }}>How are you feeling today?</label>
        <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
          {['😃', '🙂', '😐', '🙁'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => setUserMood(emoji)}
              style={{
                fontSize: 28,
                cursor: 'pointer',
                background: userMood === emoji ? '#0a74da' : 'transparent',
                border: userMood === emoji ? '2px solid #064e9d' : '2px solid transparent',
                borderRadius: 8,
                padding: '5px 10px',
                color: userMood === emoji ? 'white' : '#222',
                transition: 'all 0.25s',
              }}
              title={`Select mood ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default WeatherWidget;

