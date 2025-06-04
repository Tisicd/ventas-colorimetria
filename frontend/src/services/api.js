// frontend/src/services/api.js
import axios from "axios";

// Backend Flask
const BACKEND_BASE_URL = "http://<TU_IP_EC2>:5000";

// APIs externas
const COLOR_API_BASE = "https://www.thecolorapi.com/id";
const WEATHER_API_BASE = "https://api.openweathermap.org/data/2.5/weather";

export const getVentas = async () => {
  const res = await axios.get(`${BACKEND_BASE_URL}/api/sales`);
  return res.data;
};

export const getColorInfo = async (hex) => {
  const res = await axios.get(`${COLOR_API_BASE}?hex=${hex}`);
  return res.data;
};

export const getWeather = async (city) => {
  const res = await axios.get(`${BACKEND_BASE_URL}/api/weather?city=${city}`);
  return res.data;
};