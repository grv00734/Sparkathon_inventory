import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Inventory from '../server/models/Inventory.js';
import Product from '../server/models/Product.js';
import Warehouse from '../server/models/Warehouse.js';

dotenv.config();

const THRESHOLD = 10;

const runAlertScan = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const lowStock = await Inventory.find({ quantity: { $lt: THRESHOLD } })
      .populate('productId')
      .populate('warehouseId');

    if (!lowStock || lowStock.length === 0) {
      console.log('No low stock warnings.');
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log('Low stock alerts:');
    lowStock.forEach(item => {
      const productName = item.productId?.name || 'Unknown Product';
      const warehouseName = item.warehouseId?.name || 'Unknown Warehouse';
      console.log(
        `- ${productName} in ${warehouseName}: ${item.quantity} left`
      );
    });

    // Optional: trigger alert system (email, Slack, etc.)

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error in low stock alert script:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

runAlertScan();