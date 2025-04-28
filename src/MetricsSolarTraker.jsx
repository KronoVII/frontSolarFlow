import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MetricsSolarTracker = () => {
  const [metrics, setMetrics] = useState([]);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      axios.get('https://backsolarflow-production.up.railway.app/api/metrics')
        .then((res) => {
          setMetrics(res.data);
        })
        .catch((err) => {
          console.error('Error al obtener métricas:', err);
        });
    }, 5000); // 5 segundos

    // Obtener datos del clima desde Open-Meteo, incluyendo probabilidad de lluvia
    const fetchWeather = () => {
      axios.get('https://api.open-meteo.com/v1/forecast?latitude=6.1533&longitude=-75.3742&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,pressure_msl,precipitation_probability')
        .then((res) => {
          setWeather(res.data.current);
        })
        .catch((err) => {
          console.error('Error al obtener clima:', err);
        });
    };

    fetchWeather(); // Llamada inicial al clima
    const weatherInterval = setInterval(fetchWeather, 600000); // Actualiza cada 10 minutos

    return () => {
      clearInterval(intervalId);
      clearInterval(weatherInterval);
    };
  }, []);

  const getDaysSinceUpdate = (lastUpdateDate) => {
    const lastUpdate = new Date(lastUpdateDate);
    const now = new Date();
    const diffTime = Math.abs(now - lastUpdate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', color: 'white', background: '#222' }}>
      <h2 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#FFD700', // dorado como el sol
        textAlign: 'center',
        textShadow: '2px 2px 5px #000',
        marginBottom: '1rem'
      }}>
        Sun Tracker
      </h2>

      <h3>Historial de Pitch & Yaw</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #444' }}>
            <th style={{ padding: '8px' }}>Pitch (°)</th>
            <th style={{ padding: '8px' }}>Yaw (°)</th>
            <th style={{ padding: '8px' }}>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {metrics.slice(0, 10).map((m, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: '8px' }}>{m.pitch.toFixed(2)}</td>
              <td style={{ padding: '8px' }}>{m.yaw.toFixed(2)}</td>
              <td style={{ padding: '8px' }}>{new Date(m.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sección de clima con más detalles, incluyendo probabilidad de lluvia */}
      {weather && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Clima Actual</h3>
          <p><strong>Temperatura:</strong> {weather.temperature_2m}°C</p>
          <p><strong>Humedad:</strong> {weather.relative_humidity_2m}%</p>
          <p><strong>Velocidad del viento:</strong> {weather.wind_speed_10m} m/s</p>
          <p><strong>Dirección del viento:</strong> {weather.wind_direction_10m}°</p>
          <p><strong>Probabilidad de lluvia:</strong> {weather.precipitation_probability}%</p>
        </div>
      )}
      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#aaa' }}>
        <p>Versión de la Aplicación: 2.5.0v</p>
      </div>
    </div>



  );
};

export default MetricsSolarTracker;
