import axios from 'axios';

const API_BASE = `${process.env.REACT_APP_API_URL}/api`;


export const fetchWeather = async (location) => {
  const response = await axios.get(`${API_BASE}/weather`, { params: { location } });
  return response.data;
};

export const fetchWeatherByCoords = async (lat, lon) => {
  const response = await axios.get(`${API_BASE}/weather`, { params: { lat, lon } });
  return response.data;
};

export const fetchForecast = async (location) => {
  const response = await axios.get(`${API_BASE}/forecast`, { params: { location } });
  return response.data;
};

export const fetchForecastByCoords = async (lat, lon) => {
  const response = await axios.get(`${API_BASE}/forecast`, { params: { lat, lon } });
  return response.data;
};
