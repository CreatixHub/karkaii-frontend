import { useEffect, useRef } from 'react';
import type { DocumentModalId } from '../data/documents.data';
import { rowMenu } from '../data/documents.data';

export interface DocumentRowMenuProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onOpenModal: (modal: DocumentModalId) => void;
  onFavourite: () => void;
  className?: string;
}

const DocumentRowMenu = ({
  open,
  onToggle,
  onClose,
  onOpenModal,
  onFavourite,
  className = '',
}: DocumentRowMenuProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose();
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open, onClose]);

  return (
    <div className={`dropdown ${className}`.trim()} ref={ref}>
      <button
        type="button"
        className="btn btn-icon btn-sm"
        aria-label="More actions"
        aria-expanded={open}
        onClick={onToggle}
      >
        <i className="ti ti-dots-vertical" />
      </button>
      <ul className={`dropdown-menu dropdown-menu-end p-2${open ? ' show' : ''}`}>
        {rowMenu.map((item) =>
          item.divider ? (
            <li key={item.id}>
              <hr className="dropdown-divider" />
            </li>
          ) : (
            <li key={item.id}>
              <button
                type="button"
                className={`dropdown-item rounded-1${item.danger ? ' text-danger' : ''}`}
                onClick={() => {
                  onClose();
                  if (item.modal) onOpenModal(item.modal);
                  else if (item.action === 'print') window.print();
                  else if (item.action === 'favourite') onFavourite();
                }}
              >
                <i className={`${item.icon} me-2`} />
                {item.label}
              </button>
            </li>
          ),
        )}
      </ul>
    </div>
  );
};

export default DocumentRowMenu;
