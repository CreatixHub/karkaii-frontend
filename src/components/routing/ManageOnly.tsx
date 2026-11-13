/**
 * Wraps an Add / Edit / Delete button (or any action) that only people who can manage the data should use.
 * For read-only roles (student, parent) it is hidden, or shown greyed out and unclickable with mode="disable".
 *
 *   <ManageOnly mode="disable"><Link to={...} className="btn btn-primary">Add Subject</Link></ManageOnly>
 *
 * This is for the screen only. The API refuses these actions for those roles regardless.
 * Inert while `VITE_AUTH_ENABLED` is false.
 */

import type { ReactNode } from 'react';
import { env } from '@config/env';
import { useIsReadOnly } from '@features/auth/useViewRole';

interface ManageOnlyProps {
  /** "hide" (default) removes it; "disable" keeps it visible but greyed out and unclickable. */
  mode?: 'hide' | 'disable';
  children: ReactNode;
}

const ManageOnly = ({ mode = 'hide', children }: ManageOnlyProps) => {
  const readOnly = useIsReadOnly();

  if (!env.authEnabled || !readOnly) return <>{children}</>;
  if (mode === 'hide') return null;

  return (
    <span
      className="d-inline-block"
      style={{ opacity: 0.5, pointerEvents: 'none', cursor: 'not-allowed' }}
      aria-disabled="true"
      title="You do not have permission to do this"
    >
      {children}
    </span>
  );
};

export default ManageOnly;