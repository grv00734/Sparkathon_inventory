const Order = require('../models/Order');

const validateQR = async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  //check if already delivered
  if (order.status === 'Delivered') {
    return res.status(400).json({ error: 'Order already delivered' });
  }

  req.order = order;
  next();
};

module.exports = validateQR;
