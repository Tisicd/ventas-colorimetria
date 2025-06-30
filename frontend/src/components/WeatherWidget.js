// frontend/src/components/WeatherWidget.js
import React, { useEffect, useState } from "react";
import { getWeather } from "../services/api";

const WeatherWidget = ({ city }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!city) return;
    
    setLoading(true);
    getWeather(city)
      .then(data => {
        setWeather(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [city]);

  return (
    <div className="weather-widget">
      <h3>Clima en {city}</h3>
      {loading ? (
        <p>Cargando...</p>
      ) : weather ? (
        <div>
          <p>Temperatura: {weather.main?.temp}°C</p>
          <p>Humedad: {weather.main?.humidity}%</p>
          <p>Condición: {weather.weather?.[0]?.description}</p>
        </div>
      ) : (
        <p>No se pudo cargar el clima</p>
      )}
    </div>
  );
};

export default WeatherWidget;