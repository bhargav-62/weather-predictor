import React, { useState, useEffect } from 'react';
import {
  fetchWeather,
  fetchWeatherByCoords,
  fetchForecast,
  fetchForecastByCoords,
} from './api';
import CommunityReports from './CommunityReports';

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

const getDayShort = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
};

const moodPlaylists = {
  rainy: 'https://open.spotify.com/playlist/37i9dQZF1DX1g0iEXLFycr', // Chill Rainy Day
  sunny: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd', // Upbeat Sunny Day
  default: 'https://open.spotify.com/playlist/37i9dQZF1DWUZl01Gp8zN2', // Relaxing Ambient
};

const getSuggestions = (condition, temperature) => {
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

  let activity = '';
  let playlistKey = 'default';
  let motivationalQuote = '';

  if (condition.toLowerCase().includes('rain')) {
    activity = `Cozy up and read a book this ${timeOfDay}.`;
    playlistKey = 'rainy';
    motivationalQuote = "Sometimes the rain speaks to your soul more than words ever could.";
  } else if (condition.toLowerCase().includes('clear') || condition.toLowerCase().includes('sunny')) {
    activity = `Perfect weather for a walk this ${timeOfDay}!`;
    playlistKey = 'sunny';
    motivationalQuote = "Let the sunshine inspire your bright ideas.";
  } else {
    activity = `Try meditating or yoga this ${timeOfDay}.`;
    motivationalQuote = "Peace comes from within, no matter the weather outside.";
  }

  if (temperature && temperature < 10) {
    activity += " Don't forget to dress warmly!";
  } else if (temperature && temperature > 30) {
    activity += ' Stay hydrated and cool.';
  }

  return {
    activity,
    playlistUrl: moodPlaylists[playlistKey],
    playlistName: playlistKey.charAt(0).toUpperCase() + playlistKey.slice(1) + ' Playlist',
    motivationalQuote,
  };
};

const WeatherWidget = () => {
  const [location, setLocation] = useState('');
  const [userCoords, setUserCoords] = useState(null);
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

  // Voice interaction states
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  // Setup Web Speech API recognition
  let recognition = null;
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = 'en-US';
  }

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const storedFavs = localStorage.getItem('favoriteCities');
    if (storedFavs) {
      setFavorites(JSON.parse(storedFavs));
    }

    const storedMood = localStorage.getItem('weatherAppUserMood');
    if (storedMood) {
      setUserMood(storedMood);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setUserCoords({ lat, lon });
          try {
            setError(null);
            const weatherData = await fetchWeatherByCoords(lat, lon);
            setWeather(weatherData);
            const forecastData = await fetchForecastByCoords(lat, lon);
            setForecast(forecastData.forecast);

            const newSuggestions = getSuggestions(weatherData.condition || '', weatherData.temperature || null);
            setSuggestions(newSuggestions);

            if (weatherData.alert && weatherData.alert !== 'None') {
              notifyUser(weatherData.alert);
            }
          } catch {
            setError('Failed to fetch weather for your location.');
          }
        },
        () => setError('Geolocation permission denied or unavailable.')
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteCities', JSON.stringify(favorites));
  }, [favorites]);

  const notifyUser = (alertMessage) => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification('Weather Alert', {
        body: alertMessage,
        icon:
          'https://icons.iconarchive.com/icons/icons-land/weather/256/Severe-Thunderstorm-icon.png',
      });
    }
  };

  const startListening = () => {
    if (!recognition) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const speechToText = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      setLocation(speechToText);
      if (event.results[0].isFinal) {
        recognition.stop();
        setListening(false);
        handleFetchWithSpeech(speechToText);
      }
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const handleFetchWithSpeech = async (spokenText) => {
    setError(null);
    setWeather(null);
    setForecast([]);
    setUserCoords(null);

    try {
      const weatherData = await fetchWeather(spokenText);
      setWeather(weatherData);
      const forecastData = await fetchForecast(spokenText);
      setForecast(forecastData.forecast);

      const newSuggestions = getSuggestions(weatherData.condition || '', weatherData.temperature || null);
      setSuggestions(newSuggestions);
      setSelectedDayIndex(0);

      if (weatherData.alert && weatherData.alert !== 'None') {
        notifyUser(weatherData.alert);
      }

      readWeatherAloud(weatherData, newSuggestions);
    } catch (err) {
      setError(err.error || 'Failed to fetch weather');
    }
  };

  const readWeatherAloud = (weatherData, suggestions) => {
    if (!('speechSynthesis' in window)) return;

    const text = `The current weather in ${weatherData.location} is ${weatherData.condition} 
      with a temperature of ${weatherData.temperature} degrees Celsius. 
      Suggested activity: ${suggestions.activity}. 
      Motivational quote: ${suggestions.motivationalQuote}`;

    const utterance = new SpeechSynthesisUtterance(text);
    setSpeaking(true);

    utterance.onend = () => {
      setSpeaking(false);
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleFetch = async () => {
    setError(null);
    setWeather(null);
    setForecast([]);
    setUserCoords(null);

    if (/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(location.trim())) {
      const [lat, lon] = location.split(',').map(Number);
      setUserCoords({ lat, lon });
      try {
        const weatherData = await fetchWeatherByCoords(lat, lon);
        setWeather(weatherData);
        const forecastData = await fetchForecastByCoords(lat, lon);
        setForecast(forecastData.forecast);

        const newSuggestions = getSuggestions(weatherData.condition || '', weatherData.temperature || null);
        setSuggestions(newSuggestions);

        setSelectedDayIndex(0);

        if (weatherData.alert && weatherData.alert !== 'None') {
          notifyUser(weatherData.alert);
        }
      } catch (err) {
        setError(err.error || 'Failed to fetch weather');
      }
      return;
    }

    try {
      const weatherData = await fetchWeather(location);
      setWeather(weatherData);
      const forecastData = await fetchForecast(location);
      setForecast(forecastData.forecast);

      const newSuggestions = getSuggestions(weatherData.condition || '', weatherData.temperature || null);
      setSuggestions(newSuggestions);

      setSelectedDayIndex(0);

      if (weatherData.alert && weatherData.alert !== 'None') {
        notifyUser(weatherData.alert);
      }
    } catch (err) {
      setError(err.error || 'Failed to fetch weather');
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
    setWeather(null);
    setForecast([]);
    setUserCoords(null);
    try {
      const weatherData = await fetchWeather(city);
      setWeather(weatherData);
      const forecastData = await fetchForecast(city);
      setForecast(forecastData.forecast);

      const newSuggestions = getSuggestions(weatherData.condition || '', weatherData.temperature || null);
      setSuggestions(newSuggestions);

      setSelectedDayIndex(0);

      if (weatherData.alert && weatherData.alert !== 'None') {
        notifyUser(weatherData.alert);
      }
    } catch (err) {
      setError(err.error || 'Failed to fetch weather');
    }
  };

  const selectDay = (index) => {
    setSelectedDayIndex(index);
  };

  const handleMoodSelect = (mood) => {
    setUserMood(mood);
    localStorage.setItem('weatherAppUserMood', mood);
  };

  const renderHourly = (hours) => {
    if (!hours || hours.length === 0)
      return (
        <p style={{ fontStyle: 'italic', color: '#666' }}>
          Hourly data not available for this day.
        </p>
      );
    return (
      <div style={{ display: 'flex', overflowX: 'auto', padding: '10px 0' }}>
        {hours.map((hour, idx) => (
          <div
            key={idx}
            style={{
              minWidth: '70px',
              marginRight: '15px',
              textAlign: 'center',
              border: '1px solid #ced6e0',
              borderRadius: '8px',
              background: '#f0f8ff',
              marginBottom: '2px',
              boxShadow: '0px 1px 4px #dde4ee',
              padding: '6px 4px',
              color: '#2f3542',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 13 }}>{hour.time}</div>
            <i
              className={`wi ${iconMap[hour.conditions] || 'wi-day-sunny'}`}
              style={{ fontSize: '30px', color: '#007acc' }}
            ></i>
            <div>{hour.temperature}°C</div>
            <div style={{ fontSize: 11 }}>{hour.conditions}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderForecastDays = () => {
    if (!forecast || forecast.length === 0) return null;
    return (
      <div
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          margin: '10px 0',
          overflowX: 'auto',
          paddingBottom: 7,
        }}
      >
        {forecast.slice(0, 5).map((day, idx) => (
          <div
            key={day.date}
            onClick={() => selectDay(idx)}
            style={{
              cursor: 'pointer',
              minWidth: '110px',
              maxWidth: '120px',
              padding: '12px 10px',
              borderRadius: '10px',
              border: idx === selectedDayIndex ? '2px solid #007acc' : '1px solid #ccc',
              background: idx === selectedDayIndex ? '#f3f8fd' : '#fbfdff',
              boxShadow: idx === selectedDayIndex ? '0px 4px 14px #d4e6fa70' : '0px 1px 4px #dde4ee',
              transition: 'all 0.25s',
            }}
          >
            <div style={{ fontWeight: 700, color: '#007acc', fontSize: 14 }}>{getDayShort(day.date)}</div>
            <div style={{ fontSize: 12, color: '#333' }}>{day.date}</div>
            <div style={{ margin: '8px 0' }}>
              <i
                className={`wi ${iconMap[day.conditions.split(',')[0]] || 'wi-day-sunny'}`}
                style={{ fontSize: '32px', color: '#007acc' }}
              ></i>
            </div>
            <div style={{ fontWeight: 600, fontSize: 16, color: '#333d53' }}>{day.temperature}°C</div>
            <div style={{ fontSize: 12, color: '#2488c9' }}>{day.conditions}</div>
          </div>
        ))}
      </div>
    );
  };

  const condition = weather?.condition || '';

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Enter city or coordinates (lat,lon)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            padding: '10px',
            width: '48%',
            marginRight: '8px',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={handleFetch}
          style={{
            backgroundColor: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 15px',
            cursor: 'pointer',
            fontWeight: '600',
            marginRight: '8px',
          }}
          disabled={listening || speaking}
        >
          Get Weather
        </button>
        <button
          onClick={addFavorite}
          disabled={!weather || listening || speaking}
          style={{
            backgroundColor: '#0a74da',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 20px',
            cursor: weather && !listening && !speaking ? 'pointer' : 'not-allowed',
            fontWeight: '700',
            boxShadow: '0 3px 6px rgba(10,116,218,0.4)',
            transition: 'background-color 0.25s ease',
          }}
          onMouseEnter={(e) => {
            if (weather && !listening && !speaking) e.currentTarget.style.backgroundColor = '#064e9d';
          }}
          onMouseLeave={(e) => {
            if (weather && !listening && !speaking) e.currentTarget.style.backgroundColor = '#0a74da';
          }}
          title={weather ? 'Add current location to favorites' : 'No location to add'}
        >
          Save to Favorites
        </button>
        <button
          onClick={startListening}
          disabled={listening || speaking}
          title={listening ? 'Listening...' : 'Speak location'}
          style={{
            marginLeft: 8,
            padding: '10px 14px',
            borderRadius: '8px',
            cursor: listening ? 'progress' : 'pointer',
            backgroundColor: listening ? '#555' : '#007acc',
            color: 'white',
            border: 'none',
          }}
        >
          {listening ? '🎙️ Listening...' : '🎤 Speak'}
        </button>
      </div>

      {favorites.length > 0 && (
        <div
          className="favorites"
          style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}
        >
          <h3 style={{ color: '#0a74da', fontWeight: '700', width: '100%' }}>Favorites</h3>
          {favorites.map((city) => (
            <button
              key={city}
              onClick={() => fetchFavorite(city)}
              style={{
                backgroundColor: '#0a74da',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                cursor: 'pointer',
                color: 'white',
                fontWeight: '700',
                boxShadow: '0 3px 6px rgba(10,116,218,0.4)',
                transition: 'background-color 0.25s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#064e9d')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0a74da')}
            >
              {city}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p
          className="error"
          style={{ color: '#b00020', fontWeight: '600', marginTop: '20px', textAlign: 'center' }}
        >
          {error}
        </p>
      )}

      {weather && (
        <div className="weather-info" style={{ margin: '30px 0 20px 0', textAlign: 'left' }}>
          {condition && iconMap[condition.split(',')[0]] && (
            <i
              className={`wi ${iconMap[condition.split(',')[0]]}`}
              style={{
                fontSize: '80px',
                color: '#007acc',
                display: 'block',
                textAlign: 'center',
                marginBottom: '10px',
              }}
            />
          )}
          <p>
            <strong>Location:</strong> {weather.location}
          </p>
          <p>
            <strong>Temperature:</strong> {weather.temperature} °C
          </p>
          <p>
            <strong>Condition:</strong> {condition}
          </p>
          <p>
            <strong>Alert:</strong> {weather.alert}
          </p>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast-info" style={{ marginTop: '30px' }}>
          <h3
            style={{
              fontWeight: '600',
              color: '#1681c2',
              marginBottom: '15px',
              textAlign: 'left',
            }}
          >
            5-Day Forecast
          </h3>
          {renderForecastDays()}
          <h4 style={{ marginTop: 25 }}>Hourly Forecast for {forecast[selectedDayIndex].date}</h4>
          {renderHourly(forecast[selectedDayIndex].hours)}
        </div>
      )}

      {/* Suggestions panel */}
      <div
        style={{
          marginTop: '30px',
          background: '#f1f7fc',
          padding: '15px 20px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px #c6dafc',
          opacity: suggestions.activity ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
      >
        <h3 style={{ color: '#1681c2' }}>Suggested Activity</h3>
        <p style={{ fontStyle: 'italic', fontWeight: '600' }}>{suggestions.activity || 'Loading activity...'}</p>

        <h3 style={{ color: '#1681c2' }}>Mood Playlist</h3>
        {suggestions.playlistUrl ? (
          <p>
            <a
              href={suggestions.playlistUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0a74da', fontWeight: '600', textDecoration: 'underline' }}
            >
              {suggestions.playlistName}
            </a>
          </p>
        ) : (
          <p style={{ color: '#0a74da', fontWeight: 600 }}>Loading playlist...</p>
        )}

        <h3 style={{ color: '#1681c2' }}>Motivational Quote</h3>
        <blockquote style={{ fontSize: '1.1em', fontStyle: 'italic', margin: '8px 0' }}>
          {suggestions.motivationalQuote || 'Loading quote...'}
        </blockquote>
      </div>

      {/* Community Reports */}
      <CommunityReports userLocation={userCoords} />

      {/* Mood Feedback Section */}
      <div
        style={{
          marginTop: '25px',
          padding: '15px 20px',
          borderRadius: '10px',
          background: '#eef4fb',
          boxShadow: '0 2px 8px #b3c9ee',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <label style={{ fontWeight: 700, fontSize: '1.1em', color: '#1681c2' }}>How are you feeling today?</label>
        {['😃', '🙂', '😐', '🙁'].map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleMoodSelect(emoji)}
            style={{
              fontSize: '28px',
              cursor: 'pointer',
              background: userMood === emoji ? '#0a74da' : 'transparent',
              border: userMood === emoji ? '2px solid #064e9d' : '2px solid transparent',
              borderRadius: '8px',
              padding: '5px 10px',
              transition: 'all 0.25s',
              color: userMood === emoji ? 'white' : '#222',
            }}
            title={`Select mood ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  );
};

export default WeatherWidget;
