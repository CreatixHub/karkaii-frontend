/**
 * Page-level version of the sidebar filter: a page that is in the menu but NOT allowed for the signed-in role
 * sends the visitor to their own dashboard. Uses the same rules as the menu (sidebarAccess.ts), so the two can
 * never disagree.
 *
 * Also switches the screen to read-only (Add / Edit / Delete greyed out) for students and parents.
 *
 * Owners/admins pass everywhere; while an owner previews another role ("Sign in as"), that role's rules apply.
 * Pages that are not in the menu (detail pages, profile, settings) are not blocked here - the API enforces
 * permissions on the data itself.
 *
 * Inert while `VITE_AUTH_ENABLED` is false.
 */

import { useMemo } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { env } from '@config/env';
import type { UserRole } from '@constants/app.constants';
import { useAuth } from '@hooks/useAuth';
import { roleHomeRoute } from '@features/auth/roleHome';
import { getViewAsRole } from '@features/auth/viewAs';
import { useIsReadOnly } from '@features/auth/useViewRole';
import { useReadOnlyMode } from '@features/auth/useReadOnlyMode';
import { SidebarData } from '@/core/data/json/sidebarData';
import { filterMenuItems } from '@/core/data/json/sidebarAccess';

interface MenuItem {
  label: string;
  link?: string;
  external?: boolean;
  submenuItems?: MenuItem[];
}

const sections = SidebarData as unknown as { submenuItems: MenuItem[] }[];
const allItems: MenuItem[] = sections.flatMap((s) => s.submenuItems);

/** Every internal page link in a menu tree. */
function collectLinks(items: MenuItem[]): string[] {
  const out: string[] = [];
  for (const item of items) {
    if (item.link && item.link !== '#' && !item.external) out.push(item.link);
    if (item.submenuItems) out.push(...collectLinks(item.submenuItems));
  }
  return out;
}

const ALL_MENU_PAGES = new Set(collectLinks(allItems));

const MenuAccessGuard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const readOnly = useIsReadOnly();

  // Students and parents can only look: grey out every Add / Edit / Delete control.
  useReadOnlyMode(env.authEnabled && readOnly);

  // The role whose rules apply: an admin previewing another role follows that role.
  const viewAs = getViewAsRole();
  const role = user?.role === 'admin' && viewAs ? viewAs : user?.role ?? null;

  const allowedPages = useMemo(
    () => new Set(collectLinks(filterMenuItems(allItems, role))),
    [role],
  );

  if (!env.authEnabled || !role || role === 'admin') return <Outlet />;

  const path = location.pathname;
  if (ALL_MENU_PAGES.has(path) && !allowedPages.has(path)) {
    return <Navigate to={roleHomeRoute(role as UserRole)} replace />;
  }

  return <Outlet />;
};

export default MenuAccessGuard;