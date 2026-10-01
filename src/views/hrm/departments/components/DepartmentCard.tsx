import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { ColumnId, DepartmentModalId, DepartmentRow } from '../data/departments.data';
import { rowMenuItems } from '../data/departments.data';

export interface DepartmentCardProps {
  department: DepartmentRow;
  active: boolean;
  selected: boolean;
  /** Card fields the Fields menu is currently showing. */
  columns: Record<ColumnId, boolean>;
  onSelect: (id: string) => void;
  onActivate: (id: string) => void;
  onModal: (modal: DepartmentModalId, department: DepartmentRow) => void;
  onAction: (action: string, department: DepartmentRow) => void;
}

const DepartmentCard = ({
  department,
  active,
  selected,
  columns,
  onSelect,
  onActivate,
  onModal,
  onAction,
}: DepartmentCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const d = department;

  return (
    <div
      className={`card card-hover mb-0 dept-item${active ? ' border-primary border-2 active' : ''}`}
      tabIndex={0}
      aria-current={active ? 'true' : undefined}
      onClick={() => onActivate(d.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onActivate(d.id);
        }
      }}
    >
      <div className="card-body">
        <div className="d-flex align-items-start">
          <div className="form-check me-2">
            <input
              className="form-check-input dept-check"
              type="checkbox"
              aria-label={`Select ${d.name}`}
              checked={selected}
              onClick={(event) => event.stopPropagation()}
              onChange={() => onSelect(d.id)}
            />
          </div>
          <span className={`avatar avatar-lg bg-${d.tone}-transparent text-${d.tone} rounded me-3 flex-shrink-0`}>
            <i className={`${d.icon} fs-24`} />
          </span>
          <div className="flex-fill overflow-hidden">
            <div className="d-flex align-items-center justify-content-between">
              <h6 className="mb-0 text-truncate">{d.name}</h6>
              <div className="dropdown" ref={menuRef} onClick={(event) => event.stopPropagation()}>
                <Link
                  to="#"
                  className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                  aria-label="Department menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <i className="ti ti-dots-vertical" />
                </Link>
                <ul className={`dropdown-menu dropdown-menu-end p-2${menuOpen ? ' show' : ''}`}>
                  {rowMenuItems.map((item) => (
                    <li key={item.id}>
                      {item.divider ? <hr className="dropdown-divider" /> : null}
                      <Link
                        className={`dropdown-item rounded-1${item.danger ? ' text-danger' : ''}`}
                        to="#"
                        onClick={() => {
                          setMenuOpen(false);
                          if (item.modal) onModal(item.modal, d);
                          else onAction(item.id, d);
                        }}
                      >
                        <i className={`${item.icon} me-2`} />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <span className="fs-12 text-muted">{d.code}</span>

            {columns.hod ? (
              <div className="d-flex align-items-center mt-2 mb-2 dept-f-hod">
                <span className="avatar avatar-xs me-1">
                  <ImageWithBasePath src={d.hodAvatar} className="rounded-circle flex-shrink-0" alt={d.hod} />
                </span>
                <span className="fs-12 text-dark">HoD: {d.hod}</span>
              </div>
            ) : null}

            <div className="d-flex align-items-center flex-wrap gap-2">
              {columns.staff ? (
                <span className="badge badge-soft-secondary d-inline-flex align-items-center dept-f-staff">
                  <i className="ti ti-users me-1" />
                  {d.staff} Staff
                </span>
              ) : null}
              {columns.teachers ? (
                <span className="badge badge-soft-info d-inline-flex align-items-center dept-f-teachers">
                  <i className="ti ti-school me-1" />
                  {d.teachers} Teachers
                </span>
              ) : null}
              <span
                className={`badge ${
                  d.status === 'Active' ? 'badge-soft-success' : 'badge-soft-danger'
                } d-inline-flex align-items-center`}
              >
                <i className="ti ti-circle-filled fs-5 me-1" />
                {d.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentCard;
