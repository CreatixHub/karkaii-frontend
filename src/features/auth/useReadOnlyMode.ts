import { useEffect } from 'react';

/**
 * Read-only screen mode for students and parents: every Add / Create / New / Edit / Delete / Remove control on the
 * page is greyed out and cannot be clicked. View buttons, filters, Upload and Import are left alone.
 *
 * Screen only. The API refuses those actions for these roles regardless of what the screen shows.
 */

const LOCK_ATTR = 'data-readonly-locked';
const ACTION_WORDS = /^(add|create|new|edit|delete|remove)\b/i;
const ACTION_ICONS = '.ti-edit, .ti-trash, .ti-plus, .ti-square-rounded-plus';
const SKIP_INSIDE = '.sidebar, .header, .modal';

function labelOf(el: Element): string {
  return (el.getAttribute('title') || el.getAttribute('aria-label') || el.textContent || '').trim();
}

function lock(el: HTMLElement): void {
  el.setAttribute(LOCK_ATTR, '1');
  el.setAttribute('aria-disabled', 'true');
  el.style.opacity = '0.45';
  el.style.pointerEvents = 'none';
  el.style.cursor = 'not-allowed';
}

function unlockAll(): void {
  document.querySelectorAll<HTMLElement>(`[${LOCK_ATTR}]`).forEach((el) => {
    el.removeAttribute(LOCK_ATTR);
    el.removeAttribute('aria-disabled');
    el.style.opacity = '';
    el.style.pointerEvents = '';
    el.style.cursor = '';
  });
}

function scan(): void {
  document.querySelectorAll<HTMLElement>('a, button').forEach((el) => {
    if (el.hasAttribute(LOCK_ATTR) || el.closest(SKIP_INSIDE)) return;
    if (el.querySelector(ACTION_ICONS) !== null || ACTION_WORDS.test(labelOf(el))) lock(el);
  });
}

// Stops clicks (and Enter on a focused link) on locked controls before React sees them.
function blockLockedClicks(event: Event): void {
  const target = event.target as Element | null;
  if (target?.closest(`[${LOCK_ATTR}]`)) {
    event.preventDefault();
    event.stopPropagation();
  }
}

export function useReadOnlyMode(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    const run = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    };

    run();
    // Pages render and re-render after this runs, so keep checking whenever the page content changes.
    const observer = new MutationObserver(run);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener('click', blockLockedClicks, true);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('click', blockLockedClicks, true);
      unlockAll();
    };
  }, [enabled]);
}