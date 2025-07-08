import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import socketIOClient from 'socket.io-client';

const socket = socketIOClient(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');

const LiveTrackingPage = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    socket.on('agentLocation', (data) => {
      setAgents((prev) => {
        const existing = prev.find((a) => a.agentId === data.agentId);
        if (existing) {
          return prev.map((a) => (a.agentId === data.agentId ? data : a));
        }
        return [...prev, data];
      });
    });
    return () => socket.off('agentLocation');
  }, []);

  return (
    <div>
      <h2>Live Delivery Tracking</h2>
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '500px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {agents.map((agent) => (
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
