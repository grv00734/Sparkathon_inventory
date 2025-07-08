import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import LiveTrackingPage from './screens/LiveTrackingPage';
import ForecastPage from './screens/ForecastPage';
import InventoryDashboard from './screens/InventoryDashboard';
import QRVerificationPage from './screens/QRVerificationPage';
import RouteOptimizer from './screens/RouteOptimizer';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
      <Header />
      <main className="container py-3">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/live-tracking" element={<LiveTrackingPage />} />
          <Route path="/forecast" element={<ForecastPage />} />
          <Route path="/inventory" element={<InventoryDashboard />} />
          <Route path="/qr/:orderId" element={<QRVerificationPage />} />
          <Route path="/route-optimizer" element={<RouteOptimizer />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;