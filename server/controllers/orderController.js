const Order = require('../models/Order');
const { generateDeliveryQR } = require('../utils/qrGenerator');

exports.placeOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    const qr = await generateDeliveryQR(order._id);
    order.qrCode = qr;
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};
