import express from 'express';
import axios from 'axios';

const router = express.Router();

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

export default router;

