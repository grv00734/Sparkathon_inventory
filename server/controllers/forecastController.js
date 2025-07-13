import fs from 'fs';
import csv from 'csv-parser';
import axios from 'axios';

export const getForecast = async (req, res) => {
  const { productId, warehouseId } = req.body;

  try {
    const salesHistory = [];

    fs.createReadStream('./forecast/orders.csv')
      .pipe(csv())
      .on('data', (row) => {
        if (row.sku_id === productId && row.warehouse_id === warehouseId) {
          salesHistory.push(Number(row.quantity_sold));
        }
      })
      .on('end', async () => {
        if (salesHistory.length === 0) {
          return res.status(404).json({ error: 'No sales data found for the given product and warehouse' });
        }

        // Send to ML engine
        const response = await axios.post('http://localhost:5002/forecast', {
          salesHistory,
        });

        return res.json(response.data);
      });

  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
};

