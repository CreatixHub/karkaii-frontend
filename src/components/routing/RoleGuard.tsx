/**
 * Restricts a branch of the route tree, or a piece of UI, to specific roles or
 * permissions.
 *
 * Like `ProtectedRoute`, this is inert while `VITE_AUTH_ENABLED` is false.
 *
 * As a layout route:      <Route element={<RoleGuard roles={['admin']} />}>
 * Around a button:        <RoleGuard permission="students.create">...</RoleGuard>
 *
 * Route mode: a user without access is sent to their OWN dashboard (or `redirectTo`).
 */

import { Navigate, Outlet, useLocation } from 'react-router';
import type { ReactNode } from 'react';
import { env } from '@config/env';
import type { UserRole } from '@constants/app.constants';
import { useAuth } from '@hooks/useAuth';
import { all_routes } from '@/routes/all_routes';
import { roleHomeRoute } from '@features/auth/roleHome';

export interface RoleGuardProps {
  roles?: UserRole | UserRole[];
  permission?: string;
  /** Rendered instead of `children` when access is denied. */
  fallback?: ReactNode;
  /** Route mode only: where to send a user who lacks access. Defaults to their own dashboard. */
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
  const { hasRole, hasPermission, user } = useAuth();
  const location = useLocation();

  const isRouteMode = children === undefined;

  if (!env.authEnabled) {
    return isRouteMode ? <Outlet /> : <>{children}</>;
  }

  const roleOk = roles ? hasRole(roles) : true;
  const permissionOk = permission ? hasPermission(permission) : true;
  const allowed = roleOk && permissionOk;

  if (!allowed) {
    if (isRouteMode) {
      const target = redirectTo ?? (user ? roleHomeRoute(user.role) : all_routes.login);
      // never redirect to the page we are already on (would loop forever)
      if (target !== location.pathname) return <Navigate to={target} replace />;
    }
    return <>{fallback}</>;
  }

  return isRouteMode ? <Outlet /> : <>{children}</>;
};

export default RoleGuard;