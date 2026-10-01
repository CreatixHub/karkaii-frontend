/**
 * Lightweight toast queue.
 *
 * The teacher dashboard's HTML carried an empty `#tdToasts` container and
 * `data-success="…"` attributes on its submit buttons — the markup for a toast
 * system whose script was never shipped. This hook supplies that behaviour in
 * React: a submit pushes a message, and it auto-dismisses.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export type ToastVariant = 'success' | 'danger' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

export interface UseToastsResult {
  toasts: Toast[];
  push: (message: string, variant?: ToastVariant) => void;
  dismiss: (id: number) => void;
}

export function useToasts(autoDismissMs = 3500): UseToastsResult {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef<number[]>([]);

  // Clear any pending timers if the host unmounts mid-toast.
  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
    },
    [],
  );

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message: string, variant: ToastVariant = 'success') => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, message, variant }]);

      const timer = window.setTimeout(() => dismiss(id), autoDismissMs);
      timers.current.push(timer);
    },
    [autoDismissMs, dismiss],
  );

  return { toasts, push, dismiss };
}
