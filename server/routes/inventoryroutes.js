import express from 'express';
import {
  getAllInventory,
  updateInventory,
  getLowStockItems
} from '../controllers/inventoryController.js';

const router = express.Router();

// Get all inventory items
router.get('/', getAllInventory);

// Update inventory for a specific item
router.put('/:itemId', updateInventory);

// Get low stock items
router.get('/low-stock', getLowStockItems);

export default router;