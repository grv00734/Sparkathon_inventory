import express from 'express';
import axios from 'axios';

const router = express.Router();

// 1. PREDICT route for individual forecast
router.post('/predict', async (req, res) => {
  try {
    const { productId, warehouseId } = req.body;

    // Check both are present
    if (!productId || !warehouseId) {
      return res.status(400).json({ error: 'productId and warehouseId are required' });
    }

    // POST to ML engine with what it needs
    const mlResponse = await axios.post('http://192.168.8.132:5002/forecast', {
      productId,
      warehouseId
    });

    res.json(mlResponse.data); // Pass ML engine's prediction to frontend

  } catch (error) {
    console.error('❌ ML engine error:', error.message);
    if (error.response && error.response.data) {
      return res.status(500).json(error.response.data);
    }
    res.status(500).json({ error: 'Failed to fetch forecast from ML engine' });
  }
});

// 2. SUMMARY route for the "Show All Warnings" button
router.post('/summary', (req, res) => {
  const { ordersData, inventoryData } = req.body;
  if (!ordersData || !inventoryData) {
    return res.status(400).json({ error: "Missing data" });
  }

  // Find all product+warehouse pairs
  const allPairs = {};
  for (const row of ordersData) {
    const key = `${row.sku_id}|${row.warehouse_id}`;
    if (!allPairs[key]) allPairs[key] = { sku_id: row.sku_id, warehouse_id: row.warehouse_id, sales: [] };
    allPairs[key].sales.push(Number(row.quantity_sold));
  }

  // Attach current inventory, avg daily sales, and alert for each pair
  Object.values(allPairs).forEach(pair => {
    const inv = inventoryData.find(row => row.sku_id === pair.sku_id && row.warehouse_id === pair.warehouse_id);
    pair.current_inventory = inv ? Number(inv.current_inventory) : null;
    pair.avg_daily_sales = pair.sales.length
      ? (pair.sales.reduce((a,b)=>a+b,0) / pair.sales.length).toFixed(2)
      : 0;
    pair.alert = (pair.current_inventory !== null && pair.current_inventory < pair.avg_daily_sales * 2)
      ? "Low Stock"
      : "OK";
  });

  // Filter for low stock/high demand
  const lowStockList = Object.values(allPairs).filter(pair => pair.alert === "Low Stock");
  res.json({ lowStockList });
});

export default router;

