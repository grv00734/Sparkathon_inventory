import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import axios from 'axios';

const RouteOptimizer = () => {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    axios.get('/api/delivery/route')
      .then((res) => setRoute(res.data.polyline))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Optimized Delivery Route</h2>
      <MapContainer center={[20.5937, 78.9629]} zoom={6} style={{ height: '500px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Polyline positions={route} color="blue" />
      </MapContainer>
    </div>
  );
};

export default RouteOptimizer;
