import Delivery from '../models/Delivery.js';
import Order from '../models/Order.js';

export const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate('order')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: deliveries
    });
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch deliveries'
    });
  }
};

export const trackDelivery = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    
    const delivery = await Delivery.findById(deliveryId)
      .populate('order')
      .populate('agent');
    
    if (!delivery) {
      return res.status(404).json({
        success: false,
        error: 'Delivery not found'
      });
    }
    
    res.json({
      success: true,
      data: delivery
    });
  } catch (error) {
    console.error('Error tracking delivery:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to track delivery'
    });
  }
};

export const updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { status, location, notes } = req.body;
    
    const delivery = await Delivery.findById(deliveryId);
    
    if (!delivery) {
      return res.status(404).json({
        success: false,
        error: 'Delivery not found'
      });
    }
    
    delivery.status = status;
    if (location) delivery.currentLocation = location;
    if (notes) delivery.notes = notes;
    delivery.lastUpdated = new Date();
    
    await delivery.save();
    
    // Emit socket event for real-time tracking
    const io = req.app.get('io');
    if (io) {
      io.emit('deliveryStatusUpdate', {
        deliveryId: delivery._id,
        status: delivery.status,
        location: delivery.currentLocation,
        timestamp: delivery.lastUpdated
      });
    }
    
    res.json({
      success: true,
      data: delivery
    });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update delivery status'
    });
  }
};

export const getOptimizedRoute = async (req, res) => {
  try {
    const { startLocation, deliveryIds } = req.body;
    
    if (!startLocation || !deliveryIds || !Array.isArray(deliveryIds)) {
      return res.status(400).json({
        success: false,
        error: 'startLocation and deliveryIds array are required'
      });
    }
    
    const deliveries = await Delivery.find({
      _id: { $in: deliveryIds }
    }).populate('order');
    
    if (deliveries.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No deliveries found'
      });
    }
    
    // Simple optimization: sort by distance (you can implement proper TSP algorithm)
    const optimizedRoute = deliveries.sort((a, b) => {
      // Simple sorting by delivery address for now
      // In a real implementation, you'd use a proper routing API
      return a.order.deliveryAddress.localeCompare(b.order.deliveryAddress);
    });
    
    res.json({
      success: true,
      data: {
        startLocation,
        optimizedRoute,
        estimatedDuration: optimizedRoute.length * 30, // 30 minutes per delivery
        totalDistance: optimizedRoute.length * 10 // 10 km per delivery (placeholder)
      }
    });
  } catch (error) {
    console.error('Error optimizing route:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to optimize route'
    });
  }
};