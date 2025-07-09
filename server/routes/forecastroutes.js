import express from 'express';
import { runForecast } from '../controllers/forecastController.js';

const router = express.Router();

// Example: /api/forecast/:sku/:warehouse
router.get('/:sku/:warehouse', runForecast);

export default router;