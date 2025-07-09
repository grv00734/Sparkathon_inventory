
const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
require('dotenv').config();

const Inventory = require('../server/models/Inventory');

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB for rebalancing');
  runRebalance();
});

function runRebalance() {
  const transfers = [];

  fs.createReadStream('ml-engine/transfer_plan.csv')
    .pipe(csv())
    .on('data', (row) => {
      transfers.push(row);
    })
    .on('end', async () => {
      for (let transfer of transfers) {
        const { SKU, From, To, Quantity } = transfer;
        const qty = parseInt(Quantity);

        
        await Inventory.findOneAndUpdate(
          { sku: SKU, warehouse: From },
          { $inc: { quantity: -qty } },
          { upsert: true }
        );

        
        await Inventory.findOneAndUpdate(
          { sku: SKU, warehouse: To },
          { $inc: { quantity: qty } },
          { upsert: true }
        );

        console.log(`Transferred ${qty} of ${SKU} from ${From} to ${To}`);
      }

      console.log('Rebalancing completed');
      mongoose.disconnect();
    });
}
