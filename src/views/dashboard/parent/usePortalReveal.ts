import { useEffect, useState } from 'react';

const SKELETON_MS = 800;
const ANIMATE_DELAY_MS = 60;

export interface PortalReveal {
  loading: boolean;
  revealed: boolean;
}

export function usePortalReveal(): PortalReveal {
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const hideSkeleton = window.setTimeout(() => {
      setLoading(false);
      // A second tick so the browser paints the zero state before animating.
      window.setTimeout(() => setRevealed(true), ANIMATE_DELAY_MS);
    }, SKELETON_MS);

    return () => window.clearTimeout(hideSkeleton);
  }, []);

  return { loading, revealed };
}
