// server/models/Delivery.js
const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  deliveredBy: {
    type: String,
    required: true,
    trim: true
  },
  deliveredAt: {
    type: Date,
    default: null // Will be set when delivery is completed
  },
  deliveryStatus: {
    type: String,
    enum: ['in-transit', 'delivered', 'failed'],
    default: 'in-transit'
  }
}, { timestamps: true });

module.exports = mongoose.model('Delivery', DeliverySchema);

