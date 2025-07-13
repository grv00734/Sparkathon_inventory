// client/src/services/forecastService.js
import axios from 'axios';

export const getForecast = async (salesHistory) => {
  const response = await axios.post('http://localhost:5000/api/forecast', {
    salesHistory,
  });
  return response.data.forecast;
};

