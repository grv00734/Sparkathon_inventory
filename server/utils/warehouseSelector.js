const Warehouse = require('../models/Warehouse');
const Inventory = require('../models/Inventory');

exports.selectBestWarehouse = async (productId, deliveryLocation) => {
  const inventories = await Inventory.find({ product: productId }).populate('warehouse');
  let closest = null;
  let minDistance = Infinity;

  for (const inv of inventories) {
    if (inv.quantity > 0 && inv.warehouse?.location) {
      const dist = Math.sqrt(
        Math.pow(inv.warehouse.location.lat - deliveryLocation.lat, 2) +
        Math.pow(inv.warehouse.location.lon - deliveryLocation.lon, 2)
      );
      if (dist < minDistance) {
        closest = inv.warehouse;
        minDistance = dist;
      }
    }
  }
  return closest;
};
