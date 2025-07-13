import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/Homescreen';
import ForecastPage from './screens/ForecastPage';
import InventoryDashboard from './screens/InventoryDashboard';
import LiveTrackingPage from './screens/LiveTrackingPage';
import RouteOptimizer from './screens/RouteOptimizer';

const App = () => {
  return (
    <>
      <Header />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/forecast" element={<ForecastPage />} />
          <Route path="/inventory" element={<InventoryDashboard />} />
          <Route path="/live-tracking" element={<LiveTrackingPage />} />
          <Route path="/route-optimizer" element={<RouteOptimizer />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;

