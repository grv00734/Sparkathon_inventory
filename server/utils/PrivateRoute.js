import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const user = JSON.parse(localStorage.getItem('userInfo')); // Reuse from GitHub login
  return user && user.isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
