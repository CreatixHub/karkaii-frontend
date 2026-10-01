import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ActionLink } from '@components/workspace';

export type ContentExportFormat = 'pdf' | 'excel';

export interface ContentPageHeaderProps {
  title: string;
  /** The middle breadcrumb entry; Dashboard and the title are added around it. */
  section: string;
  dashboardTo: string;
  /** The primary button's label, e.g. "Add Page". */
  addLabel: string;
  onAdd: () => void;
  onRefresh: () => void;
  onExport: (format: ContentExportFormat) => void;
  /** Anything the page slots before the Add button. */
  extra?: ReactNode;
}

const FORMATS: { id: ContentExportFormat; label: string; icon: string }[] = [
  { id: 'pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
];

const ContentPageHeader = ({
  title,
  section,
  dashboardTo,
  addLabel,
  onAdd,
  onRefresh,
  onExport,
  extra,
}: ContentPageHeaderProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
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
    <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
      <div className="my-auto mb-2">
        <h3 className="page-title mb-1">{title}</h3>
        <nav>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to={dashboardTo}>Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="#">{section}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {title}
            </li>
          </ol>
        </nav>
      </div>
      <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
        <div className="pe-1 mb-2">
          <ActionLink
            className="btn btn-outline-light bg-white btn-icon me-1"
            ariaLabel="Refresh"
            onClick={onRefresh}
          >
            <i className="ti ti-refresh" />
          </ActionLink>
        </div>
        <div className="pe-1 mb-2">
          <button
            type="button"
            className="btn btn-outline-light bg-white btn-icon me-1"
            aria-label="Print"
            onClick={() => window.print()}
          >
            <i className="ti ti-printer" />
          </button>
        </div>
        <div className="dropdown me-2 mb-2" ref={rootRef}>
          <ActionLink
            className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center"
            ariaExpanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            <i className="ti ti-file-export me-2" />
            Export
          </ActionLink>
          <ul className={`dropdown-menu dropdown-menu-end p-3${open ? ' show' : ''}`}>
            {FORMATS.map((format) => (
              <li key={format.id}>
                <ActionLink
                  className="dropdown-item rounded-1"
                  onClick={() => {
                    setOpen(false);
                    onExport(format.id);
                  }}
                >
                  <i className={`${format.icon} me-1`} />
                  {format.label}
                </ActionLink>
              </li>
            ))}
          </ul>
        </div>
        {extra}
        <div className="mb-2">
          <ActionLink className="btn btn-primary d-flex align-items-center" onClick={onAdd}>
            <i className="ti ti-square-rounded-plus me-2" />
            {addLabel}
          </ActionLink>
        </div>
      </div>
    </div>
  );
};

export default ContentPageHeader;
