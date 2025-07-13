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
import forecastRoutes  from './routes/forecastroutes.js'; //  Correct spelling and casing
import userRoutes      from './routes/userRoutes.js';     // Optional if you have user routes
import testRoute from './routes/testRoute.js';
app.use('/api/test', testRoute);

// Mount routes
app.use('/api/orders',    orderRoutes);
app.use('/api/delivery',  deliveryRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/forecast',  forecastRoutes);  // ✅ Your ML API
app.use('/api/users',     userRoutes);      // Optional

// Root route
app.get('/', (req, res) => {
  res.send('🚀 Smart Delivery System API is running...');
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

