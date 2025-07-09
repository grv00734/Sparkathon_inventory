import express from 'express';
import {
  getAllDeliveries,
  trackDelivery,
  updateDeliveryStatus,
  getOptimizedRoute
} from '../controllers/deliveryController.js';

const router = express.Router();

router.get('/', getAllDeliveries);
router.get('/:deliveryId', trackDelivery);
router.put('/:deliveryId/status', updateDeliveryStatus);
router.get('/route', getOptimizedRoute);

export default router;