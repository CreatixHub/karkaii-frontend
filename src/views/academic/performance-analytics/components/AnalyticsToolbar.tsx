import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import type { ClassFilterOption, ClassFilterValue } from '../data/performanceAnalytics.data';

const routes = all_routes;

export interface AnalyticsToolbarProps {
  options: ClassFilterOption[];
  value: ClassFilterValue;
  activeLabel: string;
  onChange: (value: ClassFilterValue) => void;
  onPrint: () => void;
  onExport: () => void;
}

const AnalyticsToolbar = ({
  options,
  value,
  activeLabel,
  onChange,
  onPrint,
  onExport,
}: AnalyticsToolbarProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) setOpen(false);
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

  const select = (next: ClassFilterValue) => {
    setOpen(false);
    onChange(next);
  };

  return (
    <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
      <div className="my-auto mb-2">
        <h3 className="page-title mb-1">Performance Analytics</h3>
        <nav>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to={routes.adminDashboard}>Dashboard</Link>
            </li>
            <li className="breadcrumb-item">Reports</li>
            <li className="breadcrumb-item active" aria-current="page">
              Performance Analytics
            </li>
          </ol>
        </nav>
      </div>
      <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
        <div className="dropdown me-2 mb-2" ref={dropdownRef}>
          <Link
            to="#"
            className="dropdown-toggle btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
            aria-expanded={open}
            onClick={(event) => {
              event.preventDefault();
              setOpen((current) => !current);
            }}
          >
            <i className="ti ti-filter me-2" />
            {activeLabel}
          </Link>
          <ul className={`dropdown-menu dropdown-menu-end p-3${open ? ' show' : ''}`}>
            {options.map((option) => (
              <li key={option.value}>
                <Link
                  to="#"
                  className={`dropdown-item rounded-1${option.value === value ? ' active' : ''}`}
                  onClick={(event) => {
                    event.preventDefault();
                    select(option.value);
                  }}
                >
                  {option.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <button type="button" className="btn btn-outline-light bg-white me-2 mb-2" onClick={onPrint}>
          <i className="ti ti-printer me-1" />
          Print
        </button>
        <Link
          to="#"
          className="btn btn-primary mb-2"
          onClick={(event) => {
            event.preventDefault();
            onExport();
          }}
        >
          <i className="ti ti-file-export me-1" />
          Export
        </Link>
      </div>
    </div>
  );
};

export default AnalyticsToolbar;
