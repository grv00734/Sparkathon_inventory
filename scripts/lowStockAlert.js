
const mongoose = require('mongoose');
require('dotenv').config();

const Inventory = require('../server/models/Inventory');

const THRESHOLD = 10; 

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB for low stock check');
  checkLowStock();
});

async function checkLowStock() {
  const lowStockItems = await Inventory.find({ quantity: { $lt: THRESHOLD } });

  if (lowStockItems.length > 0) {
    console.log('Low Stock Alerts:');
    lowStockItems.forEach((item) => {
      console.log(`🔻${item.sku} at ${item.warehouse}: Only ${item.quantity} left`);
    });
  } else {
    console.log('All stock levels are sufficient');
  }

  mongoose.disconnect();
}
