import { useAuth } from '@hooks/useAuth';
import { getViewAsRole } from './viewAs';

/** Roles that can only look, never add, edit or delete. */
const READ_ONLY_ROLES: readonly string[] = ['student', 'parent'];

/** The role whose rules apply on screen: an owner/admin previewing another role follows that role. */
export function useViewRole(): string | null {
  const { user } = useAuth();
  const viewAs = getViewAsRole();
  return user?.role === 'admin' && viewAs ? viewAs : user?.role ?? null;
}

/** True when the person on screen may only view (student, parent). */
export function useIsReadOnly(): boolean {
  const role = useViewRole();
  return role !== null && READ_ONLY_ROLES.includes(role);
}