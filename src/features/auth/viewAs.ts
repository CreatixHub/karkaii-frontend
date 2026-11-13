/**
 * The role an owner/admin chose in "Sign in as" for this browser tab (a preview of that role's panel).
 * Only the sidebar and page guard read it, and only for admins. Everyone else always sees the menu of their own role.
 * Kept in sessionStorage: survives a page refresh, disappears when the tab closes or on logout.
 */

const KEY = 'karkaii.viewAsRole';

export function getViewAsRole(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setViewAsRole(role: string | null): void {
  try {
    if (role) sessionStorage.setItem(KEY, role);
    else sessionStorage.removeItem(KEY);
  } catch {
    // storage unavailable: the preview just falls back to the full admin menu
  }
}