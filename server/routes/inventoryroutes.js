import express from 'express';
import {
  getInventory,
  updateInventory,
  getLowStockItems
} from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/', getInventory);
router.put('/:productId/:warehouseId', updateInventory);
router.get('/low-stock', getLowStockItems);

export default router;