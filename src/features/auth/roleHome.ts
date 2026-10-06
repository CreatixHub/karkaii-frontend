import { all_routes } from '@/routes/all_routes';
import type { UserRole } from '@constants/app.constants';

/**
 * Where each role lands after signing in. Only four dashboards exist; every other staff role
 * (accountant, librarian, receptionist, warden, ...) uses the admin dashboard, which the server
 * allows for all staff roles (see `/dashboard/admin` in server/src/routes/index.js).
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
