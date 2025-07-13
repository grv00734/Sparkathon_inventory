// client/src/services/forecastService.js
import axios from 'axios';

// Use environment variable for API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const forecastService = {
  async getPrediction(productId, warehouseId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/forecast/predict`, {
        productId,
        warehouseId
      });
      return response.data;
    } catch (error) {
      console.error('Forecast prediction error:', error);
      throw error;
    }
  },

  async getSummary(ordersData, inventoryData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/forecast/summary`, {
        ordersData,
        inventoryData
      });
      return response.data;
    } catch (error) {
      console.error('Forecast summary error:', error);
      throw error;
    }
  }
};

