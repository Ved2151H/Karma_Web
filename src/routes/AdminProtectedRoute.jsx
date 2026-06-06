import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export function AdminProtectedRoute({ children }) {
  const isAuth = localStorage.getItem('adminAuth') === 'true';
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

export default AdminProtectedRoute;
