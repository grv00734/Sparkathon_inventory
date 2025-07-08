import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ForecastPage = () => {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    axios.get('/api/forecast/sampleProduct/sampleWarehouse')
      .then((res) => setForecast(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Demand Forecast</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Forecast</th>
          </tr>
        </thead>
        <tbody>
          {forecast.map((entry) => (
            <tr key={entry.ds}>
              <td>{entry.ds}</td>
              <td>{Math.round(entry.yhat)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ForecastPage;
