import { useEffect, useRef, useState } from 'react';
import { ActionLink } from '@components/workspace';

/* ------------------------------------------------------------------ *
 * Select                                                             *
 * ------------------------------------------------------------------ */

export interface SelectBoxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

export const SelectBox = ({ id, checked, onChange, label }: SelectBoxProps) => (
  <div className="form-check form-check-md">
    <input
      className="form-check-input"
      type="checkbox"
      id={id}
      checked={checked}
      aria-label={label}
      onChange={(event) => onChange(event.target.checked)}
    />
  </div>
);

/* ------------------------------------------------------------------ *
 * Status toggle                                                      *
 * ------------------------------------------------------------------ */

export interface StatusToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Named for assistive tech, since the template's label is a bare switch. */
  label: string;
}

export const StatusToggle = ({ id, checked, onChange, label }: StatusToggleProps) => (
  <div className="status-toggle modal-status">
    <input
      type="checkbox"
      id={id}
      className="check"
      checked={checked}
      aria-label={label}
      onChange={(event) => onChange(event.target.checked)}
    />
    <label htmlFor={id} className="checktoggle">
      {' '}
    </label>
  </div>
);

/* ------------------------------------------------------------------ *
 * Row menu                                                           *
 * ------------------------------------------------------------------ */

export interface RowMenuItem {
  id: string;
  label: string;
  icon: string;
  onSelect: () => void;
}

export interface RowMenuProps {
  items: RowMenuItem[];
  /** Names the row the menu belongs to, for assistive tech. */
  label: string;
}

export const RowMenu = ({ items, label }: RowMenuProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="d-flex align-items-center">
      <div className="dropdown" ref={ref}>
        <ActionLink
          className="btn btn-white btn-icon btn-sm d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 p-0"
          ariaLabel={label}
          ariaExpanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <i className="ti ti-dots-vertical fs-14" />
        </ActionLink>
        <ul className={`dropdown-menu dropdown-menu-right p-3${open ? ' show' : ''}`}>
          {items.map((item) => (
            <li key={item.id}>
              <ActionLink
                className="dropdown-item rounded-1"
                onClick={() => {
                  setOpen(false);
                  item.onSelect();
                }}
              >
                <i className={`${item.icon} me-2`} />
                {item.label}
              </ActionLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
