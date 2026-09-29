import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  
  // Real check: Must have a token in browser storage
  const token = localStorage.getItem('erp_auth_token');
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
