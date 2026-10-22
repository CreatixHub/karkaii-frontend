/**
 * Skeleton-then-reveal, the pattern several redesigned pages ship with.
 *
 * The templates render a `.skeleton-loader` and a script swaps it for the real
 * content after a fixed delay, then animates counters, rings and bars. Here the
 * delay is a timer and the two phases are state: `loading` renders the
 * skeleton, `revealed` starts the animations one frame later.
 */

import { useEffect, useState } from 'react';

export interface RevealState {
  loading: boolean;
  revealed: boolean;
}

export function useReveal(delayMs = 900): RevealState {
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reveal = window.setTimeout(() => {
      setLoading(false);
      // The script waits a beat for layout to settle before animating.
      window.setTimeout(() => setRevealed(true), 60);
    }, delayMs);

    return () => window.clearTimeout(reveal);
  }, [delayMs]);

  return { loading, revealed };
}
