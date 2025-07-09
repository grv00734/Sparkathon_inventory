// server/server.js

import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Server as SocketIO } from 'socket.io';
import app from './app.js';

dotenv.config();

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_delivery';

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

// Start HTTP + WebSocket server
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// WebSocket
const io = new SocketIO(server, {
  cors: {
    origin: process.env.SOCKET_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
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

// Attach Socket.IO instance to app if needed
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
