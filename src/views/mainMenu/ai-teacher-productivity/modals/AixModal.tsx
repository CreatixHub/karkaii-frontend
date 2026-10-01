import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { AixFormModal } from '../data/modals.data';
import { formDefaults } from '../data/modals.data';
import type { ProductivityTeacher } from '../data/teachers.data';

export interface AixModalProps {
  open: boolean;
  onClose: () => void;
  /** The template's element id, kept so the markup still reads the same. */
  id: string;
  eyebrow: string;
  title: string;
  /** Extra `.modal-dialog` class, e.g. `modal-lg`. */
  dialogClass?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  footer: ReactNode;
}

export const AixModal = ({
  open,
  onClose,
  id,
  eyebrow,
  title,
  dialogClass = '',
  onSubmit,
  children,
  footer,
}: AixModalProps) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    // Bootstrap adds this class to stop the page behind from scrolling.
    document.body.classList.add('modal-open');

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
    };
  }, [open, onClose]);

  if (!open) return null;

  const body = (
    <>
      {children}
      {footer}
    </>
  );

  return (
    <>
      <div
        className="modal fade aix-modal show d-block"
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div className={`modal-dialog modal-dialog-centered ${dialogClass}`.trim()}>
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <span className="aix-eyebrow">{eyebrow}</span>
                <h5 className="modal-title mb-0">{title}</h5>
              </div>
              <button
                type="button"
                className="btn-close custom-btn-close"
                aria-label="Close"
                onClick={onClose}
              >
                <i className="ti ti-x" />
              </button>
            </div>
            {onSubmit ? <form onSubmit={onSubmit}>{body}</form> : body}
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};

export interface ModalIdentityProps {
  teacher: ProductivityTeacher;
  subtitle: string;
}

/** The grey identity strip repeated at the top of every dialog body. */
export const ModalIdentity = ({ teacher, subtitle }: ModalIdentityProps) => (
  <div className="d-flex align-items-center gap-3 p-3 mb-3 rounded bg-light">
    <span className="avatar avatar-md avatar-rounded flex-shrink-0">
      <ImageWithBasePath src={teacher.avatar} alt={teacher.name} />
    </span>
    <div className="flex-fill overflow-hidden">
      <p className="fs-13 fw-medium text-dark mb-0">
        {teacher.name} · {teacher.department}
      </p>
      <p className="fs-12 text-muted mb-0">{subtitle}</p>
    </div>
    <span className="tch-pill is-ai flex-shrink-0">
      <i className="ti ti-sparkles" />
      AI draft
    </span>
  </div>
);

export interface AixFormDialogProps {
  modal: AixFormModal;
  teacher: ProductivityTeacher;
  onClose: () => void;
  onToast: (message: string) => void;
}

/** One of the eight template forms, rendered from its field description. */
export const AixFormDialog = ({ modal, teacher, onClose, onToast }: AixFormDialogProps) => {
  const [values, setValues] = useState<Record<string, string>>(() => formDefaults(modal));

  const set = (id: string, value: string) => setValues((current) => ({ ...current, [id]: value }));

  return (
    <AixModal
      open
      onClose={onClose}
      id={modal.id}
      eyebrow={modal.eyebrow}
      title={modal.title}
      dialogClass={modal.dialogClass}
      onSubmit={(event) => {
        event.preventDefault();
        onToast(modal.toast);
        onClose();
      }}
      footer={
        <div className="modal-footer">
          <button type="button" className="btn btn-light me-2" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary d-inline-flex align-items-center">
            <i className={`${modal.submitIcon} me-1`} />
            {modal.submitLabel}
          </button>
        </div>
      }
    >
      <div className="modal-body">
        <ModalIdentity teacher={teacher} subtitle={modal.subtitle} />
        <div className="row g-3">
          {modal.fields.map((field) => (
            <div className={field.width} key={field.id}>
              <label className="form-label" htmlFor={field.id}>
                {field.label}
              </label>
              {field.kind === 'select' ? (
                <select
                  className="form-select"
                  id={field.id}
                  value={values[field.id]}
                  onChange={(event) => set(field.id, event.target.value)}
                >
                  {field.options?.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              ) : null}
              {field.kind === 'text' ? (
                <input
                  type="text"
                  className="form-control"
                  id={field.id}
                  value={values[field.id]}
                  onChange={(event) => set(field.id, event.target.value)}
                />
              ) : null}
              {field.kind === 'textarea' ? (
                <textarea
                  rows={field.rows}
                  className="form-control"
                  id={field.id}
                  value={values[field.id]}
                  onChange={(event) => set(field.id, event.target.value)}
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </AixModal>
  );
};
