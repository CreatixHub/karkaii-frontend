import { useEffect, useRef, useState } from 'react';

export type ExportFormat = 'pdf' | 'excel' | 'csv' | 'print';

export interface ExportMenuProps {
  /** Copy on the trigger, e.g. "Export" or "Export Books". */
  label?: string;
  /** The trailing print item's label, e.g. "Print Gate Register". */
  printLabel?: string;
  /**
   * Its icon. The Communication templates end the menu with a report rather
   * than a print job — "Delivery report" under `ti ti-report`.
   */
  printIcon?: string;
  /** Family-A pages render the header buttons `btn-sm`. */
  small?: boolean;
  onExport: (format: ExportFormat) => void;
}

const formats: { id: ExportFormat; label: string; icon: string }[] = [
  { id: 'pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'csv', label: 'Export as CSV', icon: 'ti ti-file-type-csv' },
];

const ExportMenu = ({
  label = 'Export',
  printLabel,
  printIcon = 'ti ti-printer',
  small = false,
  onExport,
}: ExportMenuProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Outside click and Escape close the menu, as Bootstrap's own dropdown does.
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

  const choose = (format: ExportFormat) => () => {
    setOpen(false);
    onExport(format);
  };

  const size = small ? ' btn-sm' : '';

  return (
    <div className="dropdown me-2 mb-2" ref={rootRef}>
      <a
        className={`dropdown-toggle btn btn-outline-light bg-white${size} fw-medium d-inline-flex align-items-center`}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          setOpen((current) => !current);
        }}
      >
        <i className="ti ti-file-export me-2" />
        {label}
      </a>
      <ul className={`dropdown-menu dropdown-menu-end p-3${open ? ' show' : ''}`}>
        {formats.map((format) => (
          <li key={format.id}>
            <a className="dropdown-item rounded-1" role="button" tabIndex={0} onClick={choose(format.id)}>
              <i className={`${format.icon} me-2`} />
              {format.label}
            </a>
          </li>
        ))}
        {printLabel ? (
          <li>
            <a className="dropdown-item rounded-1" role="button" tabIndex={0} onClick={choose('print')}>
              <i className={`${printIcon} me-2`} />
              {printLabel}
            </a>
          </li>
        ) : null}
      </ul>
    </div>
  );
};

export default ExportMenu;
