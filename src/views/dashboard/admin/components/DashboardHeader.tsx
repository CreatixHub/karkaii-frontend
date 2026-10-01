import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import type { DropdownItem } from '../data/adminDashboard.data';
import {
  academicYearOptions,
  dateRangeOptions,
  exportOptions,
  quickAddOptions,
} from '../data/adminDashboard.data';

const routes = all_routes;

type MenuId = 'academicYear' | 'dateRange' | 'export' | 'quickAdd';

export interface DashboardHeaderProps {
  onRefresh?: () => void;
}

const DashboardHeader = ({ onRefresh }: DashboardHeaderProps) => {
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [academicYear, setAcademicYear] = useState(academicYearOptions[0].label);
  const [dateRange, setDateRange] = useState('This Month');
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleMenu = useCallback((menu: MenuId) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  }, []);

  // Clicking anywhere outside closes the open dropdown, matching Bootstrap.
  useEffect(() => {
    if (!openMenu) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(null);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openMenu]);

  const renderMenu = (
    id: MenuId,
    items: DropdownItem[],
    onSelect?: (item: DropdownItem) => void,
  ) => (
    <ul className={`dropdown-menu dropdown-menu-end p-2${openMenu === id ? ' show' : ''}`}>
      {items.map((item) => (
        <li key={item.label}>
          {item.to ? (
            <Link
              to={item.to}
              className="dropdown-item rounded-1"
              onClick={() => setOpenMenu(null)}
            >
              {item.icon ? <i className={`${item.icon} me-2`} /> : null}
              {item.label}
            </Link>
          ) : (
            <button
              type="button"
              className="dropdown-item rounded-1"
              onClick={() => {
                onSelect?.(item);
                setOpenMenu(null);
              }}
            >
              {item.icon ? <i className={`${item.icon} me-2`} /> : null}
              {item.label}
            </button>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-3">
      <div className="my-auto mb-2">
        <h3 className="page-title mb-1">Admin Dashboard</h3>
        <nav>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to={routes.adminDashboard}>Dashboard</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Admin Dashboard
            </li>
          </ol>
        </nav>
      </div>

      <div
        ref={containerRef}
        className="d-flex my-xl-auto right-content align-items-center flex-wrap justify-content-md-end gap-2"
      >
        <div className="dropdown mb-2">
          <button
            type="button"
            className="btn btn-white btn-3d fw-medium d-inline-flex align-items-center dropdown-toggle"
            aria-expanded={openMenu === 'academicYear'}
            onClick={() => toggleMenu('academicYear')}
          >
            <i className="ti ti-calendar me-1" />
            {academicYear}
          </button>
          {renderMenu('academicYear', academicYearOptions, (item) =>
            setAcademicYear(item.label),
          )}
        </div>

        <div className="dropdown mb-2">
          <button
            type="button"
            className="btn btn-white btn-3d fw-medium d-inline-flex align-items-center dropdown-toggle"
            aria-expanded={openMenu === 'dateRange'}
            onClick={() => toggleMenu('dateRange')}
          >
            <i className="ti ti-calendar-due me-1" />
            {dateRange}
          </button>
          {renderMenu('dateRange', dateRangeOptions, (item) => setDateRange(item.label))}
        </div>

        <div className="dropdown mb-2">
          <button
            type="button"
            className="btn btn-white btn-3d fw-medium d-inline-flex align-items-center dropdown-toggle"
            aria-expanded={openMenu === 'export'}
            onClick={() => toggleMenu('export')}
          >
            <i className="ti ti-download me-1" />
            Export
          </button>
          {renderMenu('export', exportOptions)}
        </div>

        <button
          type="button"
          className="btn btn-white btn-3d btn-icon mb-2"
          title="Refresh"
          aria-label="Refresh"
          onClick={onRefresh}
        >
          <i className="ti ti-refresh fs-16" />
        </button>

        <div className="dropdown mb-2">
          <button
            type="button"
            className="btn btn-primary btn-3d fw-medium d-inline-flex align-items-center dropdown-toggle"
            aria-expanded={openMenu === 'quickAdd'}
            onClick={() => toggleMenu('quickAdd')}
          >
            <i className="ti ti-square-rounded-plus me-1" />
            Quick Add
          </button>
          {renderMenu('quickAdd', quickAddOptions)}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
