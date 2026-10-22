/**
 * Restricts a branch of the route tree, or a piece of UI, to specific roles or
 * permissions.
 *
 * Like `ProtectedRoute`, this is inert while `VITE_AUTH_ENABLED` is false.
 *
 * As a layout route:      <Route element={<RoleGuard roles={['admin']} />}>
 * Around a button:        <RoleGuard permission="students.create">...</RoleGuard>
 */

import { Navigate, Outlet } from 'react-router';
import type { ReactNode } from 'react';
import { env } from '@config/env';
import type { UserRole } from '@constants/app.constants';
import { useAuth } from '@hooks/useAuth';

export interface RoleGuardProps {
  roles?: UserRole | UserRole[];
  permission?: string;
  /** Rendered instead of `children` when access is denied. */
  fallback?: ReactNode;
  /** Route mode only: where to send a user who lacks access. */
  redirectTo?: string;
  /** Omit to use this as a layout route rendering an `<Outlet />`. */
  children?: ReactNode;
}

const RoleGuard = ({
  roles,
  permission,
  fallback = null,
  redirectTo,
  children,
}: RoleGuardProps) => {
  const { hasRole, hasPermission } = useAuth();

  const isRouteMode = children === undefined;

  if (!env.authEnabled) {
    return isRouteMode ? <Outlet /> : <>{children}</>;
  }

  const roleOk = roles ? hasRole(roles) : true;
  const permissionOk = permission ? hasPermission(permission) : true;
  const allowed = roleOk && permissionOk;

  if (!allowed) {
    if (isRouteMode && redirectTo) return <Navigate to={redirectTo} replace />;
    return <>{fallback}</>;
  }

  return isRouteMode ? <Outlet /> : <>{children}</>;
};

export default RoleGuard;
