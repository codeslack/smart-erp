import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { storage } from '@/utils/storage';

interface ProtectedRouteProps {
  requiredRole?: string;
  allowWithoutTenant?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
  allowWithoutTenant = false,
}) => {
  const location = useLocation();
  const { isAuthenticated, hasTenant, user } = useAppSelector((state) => state.auth);
  const token = storage.getToken();
  const storedTenant = storage.getTenant();

  const isAuthed = isAuthenticated || Boolean(token);
  const userHasTenant = hasTenant || Boolean(storedTenant);

  // 1. If not authenticated, redirect to /login
  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If authenticated but has NO tenant, redirect to /onboarding/tenant (unless route explicitly allows it)
  if (!userHasTenant && !allowWithoutTenant) {
    return <Navigate to="/onboarding/tenant" replace />;
  }

  // 3. If authenticated AND already has a tenant, redirect away from onboarding
  if (userHasTenant && location.pathname === '/onboarding/tenant') {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Role check if specified
  if (
    requiredRole &&
    user?.roles &&
    !user.roles.includes(requiredRole) &&
    !user.roles.includes('admin') &&
    !user.roles.includes('Super Admin')
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
