import { useEffect } from 'react';
import type { ReactNode } from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Rendered in the footer; omit for a body-only modal. */
  footer?: ReactNode;
  /** Extra classes for `.modal-dialog`, e.g. "modal-lg". */
  dialogClassName?: string;
  /** Wraps body and footer in a form and submits through this handler. */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  /** The template nests some modals in an extra `.modal-wrapper` element. */
  wrapContent?: boolean;
  /** Tabler icon class rendered before the title, e.g. "ti ti-calendar-check". */
  titleIcon?: string;
  /** Extra classes for `.modal-content`, e.g. the parent portal's scope class. */
  contentClassName?: string;
  /** Extra classes for the wrapping form, e.g. the template's `validated-form`. */
  formClassName?: string;
  /** Extra classes for `.modal-body`, e.g. the centred confirmation dialogs. */
  bodyClassName?: string;
  /** Rendered beside the title, e.g. the admission-number badge. */
  titleAccessory?: ReactNode;
  /**
   * "custom" is the grey circle with a `ti-x` (the template's default);
   * "plain" is Bootstrap's own `.btn-close`, used by the student dialogs.
   */
  closeVariant?: 'custom' | 'plain';
  /** Some dialogs (the delete confirmation) are body-only in the template. */
  hideHeader?: boolean;
  /** Extra classes for the outer `.modal`, e.g. the AI pages' `aix-modal`. */
  className?: string;
  /**
   * A small caps line above the title — the AI dialogs' `.aix-eyebrow`, naming
   * the stage the dialog belongs to. Distinct from `titleAccessory`, which sits
   * beside the title rather than over it.
   */
  eyebrow?: ReactNode;
  /** A muted line under the title, saying what the dialog does. */
  subtitle?: ReactNode;
  /**
   * The avatar tile some dialogs put left of the title. `tint` is a Bootstrap
   * stem — "primary" expands to `bg-primary-transparent text-primary`.
   */
  headerAvatar?: { icon: string; tint: string };
}

const Modal = ({
  open,
  onClose,
  title,
  children,
  footer,
  dialogClassName = '',
  onSubmit,
  wrapContent = false,
  titleIcon,
  contentClassName = '',
  formClassName = '',
  bodyClassName = '',
  titleAccessory,
  closeVariant = 'custom',
  hideHeader = false,
  className = '',
  eyebrow,
  subtitle,
  headerAvatar,
}: ModalProps) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    // Bootstrap adds this class to prevent the page behind from scrolling.
    document.body.classList.add('modal-open');

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
    };
  }, [open, onClose]);

  if (!open) return null;

  const heading = (
    <h4 className={`modal-title ${eyebrow || subtitle ? 'mb-0' : ''}`.trim()}>
      {titleIcon ? <i className={`${titleIcon} me-2`} /> : null}
      {title}
    </h4>
  );

  const stack = (
    <div>
      {eyebrow}
      {heading}
      {subtitle ? <p className="mb-0 fs-12 text-muted">{subtitle}</p> : null}
    </div>
  );

  const header = (
    <div className={`modal-header ${headerAvatar ? 'align-items-start' : ''}`.trim()}>
      {headerAvatar ? (
        <div className="d-flex align-items-center gap-3">
          <span
            className={`avatar avatar-lg bg-${headerAvatar.tint}-transparent text-${headerAvatar.tint} rounded`}
          >
            <i className={`${headerAvatar.icon} fs-20`} />
          </span>
          {stack}
        </div>
      ) : eyebrow || subtitle ? (
        stack
      ) : titleAccessory ? (
        <div className="d-flex align-items-center">
          {heading}
          {titleAccessory}
        </div>
      ) : (
        heading
      )}
      <button
        type="button"
        className={closeVariant === 'plain' ? 'btn-close' : 'btn-close custom-btn-close'}
        aria-label="Close"
        onClick={onClose}
      >
        {closeVariant === 'plain' ? null : <i className="ti ti-x" />}
      </button>
    </div>
  );

  const body = <div className={`modal-body ${bodyClassName}`.trim()}>{children}</div>;
  const footerNode = footer ? <div className="modal-footer">{footer}</div> : null;

  const inner = onSubmit ? (
    <form className={formClassName || undefined} onSubmit={onSubmit} noValidate>
      {body}
      {footerNode}
    </form>
  ) : (
    <>
      {body}
      {footerNode}
    </>
  );

  const visibleHeader = hideHeader ? null : header;

  const content = wrapContent ? (
    <div className="modal-wrapper">
      {visibleHeader}
      {inner}
    </div>
  ) : (
    <>
      {visibleHeader}
      {inner}
    </>
  );

  return (
    <>
      <div
        className={`modal fade show d-block ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        // Clicking the backdrop (but not the dialog itself) closes the modal.
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div className={`modal-dialog modal-dialog-centered ${dialogClassName}`}>
          <div className={`modal-content ${contentClassName}`.trim()}>{content}</div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default Modal;
