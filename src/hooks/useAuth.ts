/**
 * Access to the current session.
 *
 * Throws when used outside `AuthProvider`, which turns a wiring mistake into a
 * clear error instead of a silent `null` user.
 */

import { useContext } from 'react';
import { AuthContext } from '@app/providers/auth-context';
import type { AuthContextValue } from '@app/providers/auth-context';

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>.');
  }

  return context;
}
