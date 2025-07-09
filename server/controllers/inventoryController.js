import Inventory from '../models/Inventory.js';

// Get all inventory items
export const getInventory = async (req, res) => {
  try {
    const data = await Inventory.find().populate('product warehouse');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};

// Update inventory for a product in a warehouse
export const updateInventory = async (req, res) => {
  try {
    const { productId, warehouseId, quantity } = req.body;

    const inventory = await Inventory.findOneAndUpdate(
      { product: productId, warehouse: warehouseId },
      { $inc: { quantity } },
      { upsert: true, new: true }
    );

    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update inventory' });
  }
};

// Get low stock items (threshold can be passed as query param)
export const getLowStockItems = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 10;
    const items = await Inventory.find({ quantity: { $lt: threshold } }).populate('product warehouse');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch low stock items' });
  }
};