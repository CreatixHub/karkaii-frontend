import { useEffect } from 'react';
import type { ReactNode } from 'react';

export type OffcanvasPlacement = 'start' | 'end' | 'top' | 'bottom';

export interface OffcanvasProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Which edge the panel slides in from. Defaults to the right. */
  placement?: OffcanvasPlacement;
  /** Extra classes on the panel itself, e.g. a width utility. */
  className?: string;
  /** Rendered below the body, outside the scrolling area. */
  footer?: ReactNode;
  /** Ties the panel to its heading for assistive tech. */
  labelledById?: string;
  /**
   * The panel's `id`. Two of these panels have a stylesheet scoped to that id —
   * `#ev_detail`, `#nb_detail` — so it has to be the id the template carries or
   * none of the rules match.
   */
  id?: string;
  /**
   * Rendered directly under the title, e.g. the Holiday panel's category badge.
   * Mirrors `titleAccessory` on Modal; when set, the title takes the template's
   * `mb-1` and the pair is wrapped so the close button still sits opposite.
   */
  titleAccessory?: ReactNode;
  /**
   * Replaces `.offcanvas-header` outright. The AI workspaces ship their own
   * head — an avatar, the case figures and the close button on one row — so
   * they pass it here rather than fighting the default. `title` still names the
   * panel for assistive tech, and the header is responsible for its own close
   * control.
   */
  header?: ReactNode;
  /**
   * Rendered between the header and the scrolling body, e.g. the stage rail the
   * AI workspaces pin above their panes.
   */
  beforeBody?: ReactNode;
}

const Offcanvas = ({
  open,
  onClose,
  title,
  children,
  placement = 'end',
  className = '',
  footer,
  labelledById,
  titleAccessory,
  header,
  beforeBody,
  id,
}: OffcanvasProps) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    // Bootstrap sets this to stop the page behind from scrolling.
    document.body.classList.add('offcanvas-open');

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('offcanvas-open');
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        id={id}
        className={`offcanvas offcanvas-${placement} show ${className}`.trim()}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledById}
        style={{ visibility: 'visible' }}
      >
        {header ?? (
        <div className="offcanvas-header border-bottom">
          {titleAccessory ? (
            <div>
              <h5 className="offcanvas-title mb-1" id={labelledById}>
                {title}
              </h5>
              {titleAccessory}
            </div>
          ) : (
            <h5 className="offcanvas-title" id={labelledById}>
              {title}
            </h5>
          )}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onClose}
          />
        </div>
        )}

        {beforeBody}

        <div className="offcanvas-body">{children}</div>

        {footer}
      </div>

      <div
        className="offcanvas-backdrop fade show"
        onMouseDown={onClose}
        aria-hidden="true"
      />
    </>
  );
};

export default Offcanvas;
