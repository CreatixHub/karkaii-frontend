import { all_routes } from '@/routes/all_routes';
import type { UserRole } from '@constants/app.constants';

/** A human label for a role code, e.g. "transport_manager" -> "Transport manager". */
export function roleLabel(role: UserRole | null | undefined): string {
  if (!role) return 'Member';
  return role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, ' ');
}

/**
 * Where each role lands after signing in. Only four dashboards exist; every other staff role
 * (accountant, librarian, receptionist, warden, ...) uses the admin dashboard.
 */
export function roleHomeRoute(role: UserRole): string {
  switch (role) {
    case 'teacher':
      return all_routes.teacherDashboard;
    case 'student':
      return all_routes.studentDashboard;
    case 'parent':
      return all_routes.parentDashboard;
    default:
      return all_routes.adminDashboard;
  }
}