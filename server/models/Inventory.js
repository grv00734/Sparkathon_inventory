import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  quantity: { type: Number, required: true, default: 0 }
});

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;