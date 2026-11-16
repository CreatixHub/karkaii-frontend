/**
 * Route guard for the authenticated area.
 *
 * While `VITE_AUTH_ENABLED` is false this renders `<Outlet />` immediately.
 * When enabled it enforces the session, and also sends users whose password
 * is still temporary (`mustChangePassword`) to the "Set a new password" page.
 */

import { Navigate, Outlet, useLocation } from 'react-router';
import { env } from '@config/env';
import { useAuth } from '@hooks/useAuth';
import LoadingState from '@components/ui/LoadingState';

export interface ProtectedRouteProps {
  /** Where to send unauthenticated visitors. */
  redirectTo?: string;
}

const CHANGE_PASSWORD_ROUTE = '/change-password';

const ProtectedRoute = ({ redirectTo = '/login' }: ProtectedRouteProps) => {
  const { status, user } = useAuth();
  const location = useLocation();

  if (!env.authEnabled) return <Outlet />;

  if (status === 'initializing') {
    return <LoadingState message="Checking your session..." size="lg" />;
  }
  if (status === 'unauthenticated') {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }

  // Temporary password (e.g. a new student): must set a real one first.
  if (user?.mustChangePassword) {
    return <Navigate to={CHANGE_PASSWORD_ROUTE} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;