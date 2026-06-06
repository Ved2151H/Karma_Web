import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 min-h-[50vh]">
        <div className="text-sm font-bold text-neutral-400 uppercase tracking-widest animate-pulse">
          Verifying credentials...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, storing target path for post-login return
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
    // Redirect unauthorized roles back to landing page
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
