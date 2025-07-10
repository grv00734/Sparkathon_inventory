// server/server.js

import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Server as SocketIO } from 'socket.io';
import app from './app.js';

// Load environment variables and log the Mongo URI
dotenv.config();
console.log('→ Using MONGO_URI =', process.env.MONGO_URI);

// MongoDB connection string (fallback if .env not provided)
const MONGO_URI = process.env.MONGO_URI
  || 'mongodb://127.0.0.1:27017/smartdelivery';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Connect to MongoDB, then start the HTTP & WebSocket server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

// Initialize WebSocket (Socket.IO)
const io = new SocketIO(server, {
  cors: {
    origin: process.env.SOCKET_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Example: agent location updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('agentLocation', (data) => {
    io.emit('agentLocation', data); // broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Attach Socket.IO instance to app for route handlers if needed
app.set('io', io);

