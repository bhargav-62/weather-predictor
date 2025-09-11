import React, { useState, useEffect } from 'react';
import WeatherAppLayout from './WeatherAppLayout';
import {
  fetchWeather,
  fetchWeatherByCoords,
  fetchForecast,
  fetchForecastByCoords,
} from './api';

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

  const moodPlaylists = {
    rainy: 'https://open.spotify.com/playlist/37i9dQZF1DX1g0iEXLFycr',
    sunny: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd',
    default: 'https://open.spotify.com/playlist/37i9dQZF1DWUZl01Gp8zN2',
  };

  return {
    activity,
    playlistUrl: moodPlaylists[playlistKey],
    playlistName: playlistKey.charAt(0).toUpperCase() + playlistKey.slice(1) + ' Playlist',
    motivationalQuote,
  };
};

function App() {
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
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);

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

    const storedFavs = localStorage.getItem('favoriteCities');
    if (storedFavs) setFavorites(JSON.parse(storedFavs));

    const storedMood = localStorage.getItem('weatherAppUserMood');
    if (storedMood) setUserMood(storedMood);

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

  return (
    <WeatherAppLayout
      location={location}
      setLocation={setLocation}
      handleFetch={handleFetch}
      addFavorite={addFavorite}
      favorites={favorites}
      fetchFavorite={fetchFavorite}
      weather={weather}
      forecast={forecast}
      selectedDayIndex={selectedDayIndex}
      selectDay={selectDay}
      suggestions={suggestions}
      userMood={userMood}
      handleMoodSelect={handleMoodSelect}
      listening={listening}
      speaking={speaking}
      startListening={startListening}
      error={error}
      iconMap={iconMap}
      userCoords={userCoords}
    />
  );
}

export default App;
