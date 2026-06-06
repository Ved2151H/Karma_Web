import React from 'react';
import { Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '../constants/roles';

export function UserRoutes() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER]}>
      <Outlet />
    </ProtectedRoute>
  );
}

export default UserRoutes;
