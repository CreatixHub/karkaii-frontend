/**
 * Restricts one of the four role dashboards (/admin-dashboard, /teacher-dashboard, /student-dashboard,
 * /parent-dashboard) to the roles it's meant for. Unlike `RoleGuard`'s generic `redirectTo`, denial here
 * sends the visitor to *their own* dashboard (via `roleHomeRoute`) instead of a fixed page, so typing
 * another role's dashboard URL always lands somewhere sensible rather than a dead end.
 *
 * An owner / admin (role "admin") may open every dashboard: they can do everything in the school, and it lets
 * them preview each panel with "Sign in as". Teachers, students, parents and other staff stay on their own.
 *
 * Inert while `VITE_AUTH_ENABLED` is false, same as `RoleGuard` and `ProtectedRoute`.
 */

import { Navigate } from 'react-router';
import type { ReactNode } from 'react';
import { env } from '@config/env';
import type { UserRole } from '@constants/app.constants';
import { useAuth } from '@hooks/useAuth';
import { roleHomeRoute } from '@features/auth/roleHome';

export interface DashboardGuardProps {
  /** Allow only these roles (use for teacher/student/parent, which each have exactly one role). */
  roles?: UserRole | UserRole[];
  /**
   * Allow every role EXCEPT these (use for the admin dashboard, which every staff role other than
   * teacher/student/parent falls back to - see the comment in `roleHome.ts`).
   */
  exclude?: UserRole[];
  children: ReactNode;
}

const DashboardGuard = ({ roles, exclude, children }: DashboardGuardProps) => {
  const { user, hasRole } = useAuth();

  if (!env.authEnabled) return <>{children}</>;

  // Owners and admins may open any dashboard.
  if (hasRole('admin')) return <>{children}</>;

  const allowed = exclude ? !hasRole(exclude) : roles ? hasRole(roles) : true;
  if (allowed) return <>{children}</>;

  // Signed in with a role this dashboard isn't for: send them to the one that is theirs.
  return <Navigate to={roleHomeRoute(user?.role ?? 'admin')} replace />;
};

export default DashboardGuard;