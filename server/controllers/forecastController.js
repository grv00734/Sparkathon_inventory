import axios from 'axios';

export const runForecast = async (req, res) => {
  try {
    const { productId } = req.body;

    const response = await axios.post(
      `${process.env.ML_ENGINE_URL}`,
      { productId }
    );

    res.json(response.data);
  } catch (err) {
    console.error('ML Engine error:', err.message);
    res.status(500).json({ error: 'Failed to get forecast' });
  }
};
