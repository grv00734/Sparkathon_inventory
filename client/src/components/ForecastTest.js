// client/src/components/ForecastTest.js
import React, { useState } from 'react';
import { getForecast } from '../services/forecastService';

function ForecastTest() {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const result = await getForecast([100, 120, 130, 110, 115, 140, 150]);
      setForecast(result);
    } catch (err) {
      console.error('Error fetching forecast:', err);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>📈 Forecast Checker</h2>
      <button onClick={handleClick}>Get Forecast</button>
      {loading && <p>Loading...</p>}
      <ul>
        {forecast.map((item, index) => (
          <li key={index}>
            {item.date}: {item.predicted}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ForecastTest;

