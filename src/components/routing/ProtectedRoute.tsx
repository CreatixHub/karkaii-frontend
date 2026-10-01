/**
 * Route guard for the authenticated area.
 *
 * CRITICAL: while `VITE_AUTH_ENABLED` is false this renders `<Outlet />`
 * immediately and unconditionally. That is the current behaviour of the static
 * template — every route stays directly reachable and nothing redirects — so
 * wrapping the app in this guard today changes nothing at all.
 *
 * Flip `VITE_AUTH_ENABLED=true` once a real auth API is connected and the same
 * component starts enforcing the session, with no other code change.
 */

import { Navigate, Outlet, useLocation } from 'react-router';
import { env } from '@config/env';
import { useAuth } from '@hooks/useAuth';
import LoadingState from '@components/ui/LoadingState';

export interface ProtectedRouteProps {
  /** Where to send unauthenticated visitors. */
  redirectTo?: string;
}

const ProtectedRoute = ({ redirectTo = '/login' }: ProtectedRouteProps) => {
  const { status } = useAuth();
  const location = useLocation();

  // Auth disabled — behave exactly as the template does today.
  if (!env.authEnabled) return <Outlet />;

  // Still restoring a stored session: render nothing decisive yet, otherwise
  // a refresh would bounce an authenticated user to the login screen.
  if (status === 'initializing') {
    return <LoadingState message="Checking your session..." size="lg" />;
  }

  if (status === 'unauthenticated') {
    // `state.from` lets the login page return the user where they were going.
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
