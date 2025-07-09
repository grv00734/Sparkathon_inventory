# Smart Delivery & Inventory Management System

An intelligent logistics and inventory optimization platform for large-scale retailers and e-commerce operations. It provides QR-verified delivery tracking, inventory forecasting using machine learning, fallback warehouse logic, and live geolocation tracking via sockets.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [How to Run Locally](#how-to-run-locally)
- [API Endpoints](#api-endpoints)
- [Sample MongoDB Data](#sample-mongodb-data)
- [Deployment](#deployment)
- [Use Cases](#use-cases)
- [Contributing](#contributing)

---

## Features

- QR code-based delivery verification with geo-fencing
- Real-time delivery tracking via WebSockets
- Inventory monitoring dashboard with demand trends
- Facebook Prophet ML model for demand forecasting
- Auto-rebalancing engine for stock transfers
- Warehouse fallback selection based on proximity and cost
- Admin dashboard with logs and exception alerts
- RESTful APIs for orders, deliveries, and forecasts

---

## Tech Stack

**Frontend**
- React.js + React Router
- Redux Toolkit
- React Bootstrap
- Socket.IO Client

**Backend**
- Node.js + Express.js
- MongoDB with Mongoose
- WebSocket (Socket.IO)
- REST APIs

**ML Forecasting Engine**
- Python (FastAPI)
- Facebook Prophet
- MongoDB for historical data
- Uvicorn ASGI server

---

## System Architecture

+------------------+
| Customer |
+--------+---------+
|
v
+--------------------+
| Order Placement |
+--------+-----------+
|
| |
v v
+-------------------------+ +----------------------------+
| Warehouse Selection API |<-->| Nearby Fallback Finder |
+------------+------------+ +----------------------------+
|
v
+-----------------------------+
| Inventory Management Service|
+-------------+---------------+
|
v
+-----------------------------+
| QR Code Generator Module |
+-------------+---------------+
|
v
+-----------------------------+
| Delivery App (Agent device) |
| - QR Scanner |
| - Geo-Fencing Validation |
+-------------+---------------+
|
v
+-----------------------------+
| Delivery Logs + Tracking DB |
+-----------------------------+
          ^
          |
+-------------+---------------+
| Admin Dashboard |
| - QR logs, inventory maps |
| - Exception alerts |
+-----------------------------+
          ^
          |
+-------------+---------------+
| Auto Rebalancer Engine |
| - Prophet Forecast Engine |
| - Transfer Planner |
+-----------------------------+
|
v
+-----------------------------+
| Warehouse Database |
+-----------------------------+
          ^
          |
+-------------+---------------+
| Predictive Alert System |
| - Low stock triggers |
| - Restock warnings |
+-----------------------------+


