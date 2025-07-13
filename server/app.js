// server/app.js

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));   
app.use(morgan('dev')); // Logs HTTP requests

// Import routes (make sure file names match exactly)
import orderRoutes     from './routes/orderRoutes.js';
import deliveryRoutes  from './routes/deliveryroutes.js';
import inventoryRoutes from './routes/inventoryroutes.js';
import forecastRoutes  from './routes/forecastroutes.js';
import userRoutes      from './routes/userRoutes.js';
import testRoute from './routes/testRoute.js';

// Mount routes
app.use('/api/orders',    orderRoutes);
app.use('/api/delivery',  deliveryRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/forecast',  forecastRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/test', testRoute);

// Root route
app.get('/', (req, res) => {
  res.send('🚀 Smart Delivery System API is running...');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Smart Delivery API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;

