import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import socketIOClient from 'socket.io-client';

// Use environment variable for socket URL
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
const socket = socketIOClient(SOCKET_URL);

const LiveTrackingPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [agentLocations, setAgentLocations] = useState({});

  useEffect(() => {
    // Listen for delivery status updates
    socket.on('deliveryStatusUpdate', (data) => {
      setDeliveries(prev => 
        prev.map(delivery => 
          delivery.id === data.deliveryId 
            ? { ...delivery, status: data.status, location: data.location, timestamp: data.timestamp }
            : delivery
        )
      );
    });

    // Listen for agent location updates
    socket.on('agentLocation', (data) => {
      setAgentLocations(prev => ({
        ...prev,
        [data.agentId]: data
      }));
    });

    return () => {
      socket.off('deliveryStatusUpdate');
      socket.off('agentLocation');
    };
  }, []);

  return (
    <div>
      <h2>Live Delivery Tracking</h2>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '500px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {Object.values(agentLocations).map((agent) => (
          <Marker key={agent.agentId} position={[agent.lat, agent.lon]}>
            <Popup>
              Agent: {agent.agentId}<br />
              Last seen: {new Date(agent.timestamp).toLocaleString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LiveTrackingPage;
