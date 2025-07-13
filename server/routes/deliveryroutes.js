import express from 'express';
import {
  getAllDeliveries,
  trackDelivery,
  updateDeliveryStatus,
  getOptimizedRoute
} from '../controllers/deliveryController.js';

const router = express.Router();

// Get all deliveries
router.get('/', getAllDeliveries);

// Track specific delivery
router.get('/:deliveryId/track', trackDelivery);

// Update delivery status
router.put('/:deliveryId/status', updateDeliveryStatus);

// Get optimized route for multiple deliveries
router.post('/optimize-route', getOptimizedRoute);

export default router;