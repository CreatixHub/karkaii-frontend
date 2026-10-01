/**
 * Constructs Bootstrap tooltips and popovers for the current page.
 *
 * The HTML template does this once on load (assets/js/script.js):
 *
 *   qsa('[data-bs-toggle="popover"]').forEach(el => new bootstrap.Popover(el));
 *   qsa('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
 *
 * That single pass is not enough here. Pages arrive through lazy imports, so
 * the layout's effect runs before the view exists; triggers also appear later
 * inside modals, tab panes and rows rendered after a fetch. So the scan runs
 * once up front and then again whenever nodes are added, driven by a
 * MutationObserver. Already-wired triggers are skipped, and every instance is
 * disposed on cleanup so navigation leaves no orphaned popper nodes.
 *
 * The named ESM exports are imported rather than the UMD bundle: bundlers do
 * not run the UMD's global side effect, so `window.bootstrap` is undefined and
 * `new window.bootstrap.Tooltip(...)` would silently never happen.
 */

import { useEffect } from 'react';

const TOOLTIP = '[data-bs-toggle="tooltip"]';
const POPOVER = '[data-bs-toggle="popover"]';

export function useBootstrapTooltips(pathname: string): void {
  useEffect(() => {
    let cancelled = false;
    let observer: MutationObserver | null = null;
    let frame = 0;
    const instances: { dispose: () => void }[] = [];

    // Loaded lazily: Bootstrap touches `document` when it evaluates.
    import('bootstrap')
      .then(({ Tooltip, Popover }) => {
        if (cancelled) return;

        const scan = () => {
          document.querySelectorAll(TOOLTIP).forEach((el) => {
            if (Tooltip.getInstance(el)) return;
            instances.push(new Tooltip(el));
          });
          document.querySelectorAll(POPOVER).forEach((el) => {
            if (Popover.getInstance(el)) return;
            instances.push(new Popover(el));
          });
        };

        scan();

        // Coalesce bursts of mutations into one scan per frame.
        observer = new MutationObserver(() => {
          if (frame) return;
          frame = window.requestAnimationFrame(() => {
            frame = 0;
            scan();
          });
        });
        observer.observe(document.body, { childList: true, subtree: true });
      })
      .catch(() => {
        // Bootstrap JS unavailable — tooltips simply stay inert.
      });

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      instances.forEach((i) => {
        try {
          i.dispose();
        } catch {
          // The element may already be gone with the unmounted view.
        }
      });
    };
  }, [pathname]);
}
