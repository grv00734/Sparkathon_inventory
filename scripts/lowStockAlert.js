// scripts/lowStockAlert.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Inventory from '../server/models/Inventory.js';
import Product from '../server/models/Product.js';
import Warehouse from '../server/models/Warehouse.js';

dotenv.config();

const THRESHOLD = 10;

const runAlertScan = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const lowStock = await Inventory.find({ quantity: { $lt: THRESHOLD } })
      .populate('productId')
      .populate('warehouseId');

    if (lowStock.length === 0) {
      console.log('No low stock warnings.');
      return;
    }

    console.log('Low stock alerts:');
    lowStock.forEach(item => {
      console.log(
        `- ${item.productId.name} in ${item.warehouseId.name}: ${item.quantity} left`
      );
    });

    // Optional: trigger alert system (email, Slack, etc.)

    process.exit(0);
  } catch (error) {
    console.error('Error in low stock alert script:', error);
    process.exit(1);
  }
};

runAlertScan();

