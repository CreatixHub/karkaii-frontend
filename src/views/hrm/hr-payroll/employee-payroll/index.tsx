import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import PayrollModals from './modals/PayrollModals';
import type { PayrollDraft, PayrollModalId } from './modals/PayrollModals';
import { ActionLink } from '@components/workspace';
import type {
  BulkActionId,
  ColumnId,
  PayrollRow,
  PayrollStatus,
  SavedViewId,
  SortKey,
} from './data/employeePayroll.data';
import {
  bulkActions,
  filterChipLabels,
  filterChipTone,
  filterFields,
  grossSalary,
  money,
  netSalary,
  PAGE_SIZE,
  payrollRows as initialRows,
  savedViews,
  sortOptions,
  statusPill,
  summaryTiles,
  toggleableColumns,
} from './data/employeePayroll.data';

const routes = all_routes;

const EMPTY_FILTERS: Record<string, string> = Object.fromEntries(filterFields.map((f) => [f.id, '']));

const ALL_COLUMNS = toggleableColumns.reduce<Record<ColumnId, boolean>>(
  (acc, column) => {
    acc[column.id] = true;
    return acc;
  },
  {} as Record<ColumnId, boolean>,
);

type ToolbarMenu = 'filter' | 'sort' | 'views' | 'bulk' | 'columns' | 'export' | null;

const EmployeePayroll = () => {
  const [rows, setRows] = useState<PayrollRow[]>(initialRows);

  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>('employee');
  const [view, setView] = useState<SavedViewId>('all');
  const [columns, setColumns] = useState<Record<ColumnId, boolean>>(ALL_COLUMNS);
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [rowMenu, setRowMenu] = useState<string | null>(null);
  const [inspected, setInspected] = useState<PayrollRow | null>(null);

  const [activeModal, setActiveModal] = useState<PayrollModalId | null>(null);
  const [modalRow, setModalRow] = useState<PayrollRow | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = rows.filter((row) => {
      if (term && !`${row.name} ${row.id} ${row.designation}`.toLowerCase().includes(term)) return false;
      if (view === 'pending' && row.status !== 'Pending') return false;
      if (view === 'unpaid' && row.status !== 'Unpaid') return false;
      if (filters.campus && row.campus !== filters.campus) return false;
      if (filters.department && row.department !== filters.department) return false;
      if (filters.designation && row.designation !== filters.designation) return false;
      if (filters['employee-type'] && row.employeeType !== filters['employee-type']) return false;
      if (filters['payment-method'] && row.method.label !== filters['payment-method']) return false;
      if (filters['payment-status'] && row.status !== filters['payment-status']) return false;
      if (filters['payroll-status'] && row.status !== filters['payroll-status']) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      if (sort === 'net') return netSalary(b) - netSalary(a) || a.name.localeCompare(b.name);
      if (sort === 'department') return a.department.localeCompare(b.department) || a.name.localeCompare(b.name);
      if (sort === 'paymentDate') return b.paymentDate.localeCompare(a.paymentDate) || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
  }, [rows, search, view, filters, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const shown = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const chips = useMemo(
    () =>
      filterFields
        .filter((field) => filters[field.id])
        .map((field) => ({ id: field.id, value: filters[field.id], tone: filterChipTone[field.id] ?? 'primary' })),
    [filters],
  );

  const resetFilters = useCallback(() => {
    setDraft(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
    setSearch('');
    setView('all');
    setPage(1);
    push('Filters cleared');
  }, [push]);

  const setStatusFor = useCallback((ids: string[], status: PayrollStatus) => {
    setRows((current) =>
      current.map((row) =>
        ids.includes(row.id)
          ? {
              ...row,
              status,
              paymentDate: status === 'Paid' ? '28 Jul 2026' : row.paymentDate,
              lastUpdated: '28 Jul, 11:00 AM',
            }
          : row,
      ),
    );
  }, []);

  const runBulkAction = useCallback(
    (action: BulkActionId) => {
      if (action === 'print') {
        window.print();
        return;
      }
      if (selected.length === 0) {
        push('Select at least one employee first', 'warning');
        return;
      }
      const map: Partial<Record<BulkActionId, { status: PayrollStatus; message: string }>> = {
        process: { status: 'Processing', message: `${selected.length} payroll runs processing` },
        approve: { status: 'Approved', message: `${selected.length} payroll runs approved` },
        generate: { status: 'Paid', message: `${selected.length} payslips generated` },
        email: { status: 'Paid', message: `${selected.length} payslips emailed` },
      };
      const outcome = map[action];
      if (outcome) {
        setStatusFor(selected, outcome.status);
        push(outcome.message);
      } else {
        push(`${selected.length} records queued for export`);
      }
    },
    [selected, setStatusFor, push],
  );

  const openModal = (row: PayrollRow | null, modal: PayrollModalId) => {
    setModalRow(row);
    setActiveModal(modal);
    setRowMenu(null);
  };

  const saveDraft = useCallback(
    (values: PayrollDraft) => {
      if (!modalRow) return;
      const num = (value: string, fallback: number) => Number(value.replace(/[^0-9.]/g, '')) || fallback;
      setRows((current) =>
        current.map((row) =>
          row.id === modalRow.id
            ? {
                ...row,
                basic: num(values.basic, row.basic),
                allowances: num(values.allowances, row.allowances),
                deductions: num(values.deductions, row.deductions),
                bonus: num(values.bonus, row.bonus),
                method:
                  values.method === row.method.label
                    ? row.method
                    : { label: values.method, icon: 'ti ti-building-bank' },
                status: values.status,
                lastUpdated: '28 Jul, 11:00 AM',
              }
            : row,
        ),
      );
      setActiveModal(null);
      push('Payroll updated');
    },
    [modalRow, push],
  );

  const setModalStatus = useCallback(
    (status: PayrollStatus, message: string) => {
      if (modalRow) setStatusFor([modalRow.id], status);
      setActiveModal(null);
      push(message);
    },
    [modalRow, setStatusFor, push],
  );

  const confirmDelete = useCallback(() => {
    if (modalRow) {
      setRows((current) => current.filter((row) => row.id !== modalRow.id));
      setSelected((current) => current.filter((id) => id !== modalRow.id));
    }
    setActiveModal(null);
    push('Payroll record deleted');
  }, [modalRow, push]);

  const allShownSelected = shown.length > 0 && shown.every((row) => selected.includes(row.id));
  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const menuButton = (id: ToolbarMenu, icon: string, label: string, badge?: number) => (
    <button
      type="button"
      className="workspace-button dropdown-toggle"
      aria-expanded={openMenu === id}
      onClick={() => setOpenMenu(openMenu === id ? null : id)}
    >
      <i className={icon} />
      {label}
      {badge ? <span className="result-count">{badge}</span> : null}
    </button>
  );

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Employee Payroll</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">HRM</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Employee Payroll
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                onClick={() => openModal(rows[0] ?? null, 'payroll_history')}
              >
                <i className="ti ti-history me-1" />
                Payroll History
              </button>
              <button
                type="button"
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => openModal(rows[0] ?? null, 'process_payroll')}
              >
                <i className="ti ti-player-play me-1" />
                Process Payroll
              </button>
            </div>
          </div>
          {/* /Page Header */}

          <div className="card mb-0 data-workspace classes-workspace is-loaded" id="ep_card">
            {/* Sticky Payroll Toolbar */}
            <div className="card-header border-bottom sticky-top bg-white">
              <div className="page-toolbar">
                <div className="search-toolbar">
                  <i className="ti ti-search search-toolbar-icon" />
                  <input
                    type="text"
                    id="epSearch"
                    placeholder="Search employee, ID or designation…"
                    aria-label="Search payroll"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setPage(1);
                    }}
                  />
                  <span className="search-toolbar-kbd">⌘K</span>
                </div>

                <div className="dropdown">
                  {menuButton('filter', 'ti ti-adjustments-horizontal', 'Filters')}
                  <div className={`dropdown-menu p-3 filter-menu${openMenu === 'filter' ? ' show' : ''}`}>
                    <div className="row g-3">
                      {filterFields.map((field) => (
                        <div className="col-6" key={field.id}>
                          <label className="form-label mb-1" htmlFor={field.id}>
                            {field.label}
                          </label>
                          <select
                            className="form-select"
                            id={field.id}
                            value={draft[field.id] ?? ''}
                            onChange={(event) => setDraft((c) => ({ ...c, [field.id]: event.target.value }))}
                          >
                            <option value="">All</option>
                            {field.options.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                    <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
                      <span className="fs-12 text-muted">
                        <b>{filtered.length}</b> of {rows.length} records match
                      </span>
                      <div className="d-flex gap-2">
                        <button type="button" className="btn btn-light btn-sm" onClick={resetFilters}>
                          Reset
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setFilters(draft);
                            setPage(1);
                            setOpenMenu(null);
                            push('Filters applied');
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dropdown">
                  {menuButton('sort', 'ti ti-sort-ascending-2', 'Sort')}
                  <ul className={`dropdown-menu p-2${openMenu === 'sort' ? ' show' : ''}`}>
                    <li className="context-menu-head">Sort by</li>
                    {sortOptions.map((option) => (
                      <li key={option.id}>
                        <button
                          type="button"
                          className={`dropdown-item rounded-1${sort === option.id ? ' active' : ''}`}
                          onClick={() => {
                            setSort(option.id);
                            setOpenMenu(null);
                          }}
                        >
                          <i className={`${option.icon} me-2`} />
                          {option.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="dropdown">
                  {menuButton('views', 'ti ti-bookmark', 'Saved Views')}
                  <ul className={`dropdown-menu p-2${openMenu === 'views' ? ' show' : ''}`}>
                    <li className="context-menu-head">My Views</li>
                    {savedViews.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          className={`dropdown-item rounded-1${view === item.id ? ' active' : ''}`}
                          onClick={() => {
                            setView(item.id);
                            setPage(1);
                            setOpenMenu(null);
                          }}
                        >
                          <i className={`${item.icon} me-2`} />
                          {item.label}
                        </button>
                      </li>
                    ))}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item rounded-1 text-primary"
                        onClick={() => {
                          setOpenMenu(null);
                          push('Current view saved');
                        }}
                      >
                        <i className="ti ti-plus me-2" />
                        Save current view
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="dropdown">
                  {menuButton('bulk', 'ti ti-checkbox', 'Bulk Actions', selected.length)}
                  <ul className={`dropdown-menu p-2${openMenu === 'bulk' ? ' show' : ''}`}>
                    <li className="context-menu-head">Selected employees</li>
                    {bulkActions.map((action) => (
                      <li key={action.id}>
                        <button
                          type="button"
                          className="dropdown-item rounded-1"
                          onClick={() => {
                            runBulkAction(action.id);
                            setOpenMenu(null);
                          }}
                        >
                          <i className={`${action.icon} me-2`} />
                          {action.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="dropdown">
                  {menuButton('columns', 'ti ti-columns-3', 'Columns')}
                  <ul className={`dropdown-menu p-2${openMenu === 'columns' ? ' show' : ''}`}>
                    <li className="context-menu-head">Visible columns</li>
                    {toggleableColumns.map((column) => (
                      <li key={column.id}>
                        <label className="dropdown-item">
                          <input
                            className="form-check-input me-2 mt-0"
                            type="checkbox"
                            checked={columns[column.id]}
                            onChange={() => setColumns((c) => ({ ...c, [column.id]: !c[column.id] }))}
                          />
                          {column.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <span className="flex-grow-1" />

                <button
                  type="button"
                  className="workspace-button workspace-button-icon"
                  title="Refresh"
                  aria-label="Refresh"
                  onClick={() => {
                    setRows(initialRows);
                    push('Payroll refreshed');
                  }}
                >
                  <i className="ti ti-refresh" />
                </button>

                <div className="dropdown">
                  <button
                    type="button"
                    className="workspace-button workspace-button-icon"
                    title="Export"
                    aria-label="Export"
                    aria-expanded={openMenu === 'export'}
                    onClick={() => setOpenMenu(openMenu === 'export' ? null : 'export')}
                  >
                    <i className="ti ti-file-export" />
                  </button>
                  <ul className={`dropdown-menu dropdown-menu-end p-2${openMenu === 'export' ? ' show' : ''}`}>
                    {[
                      { id: 'pdf', icon: 'ti ti-file-type-pdf', label: 'Export as PDF' },
                      { id: 'excel', icon: 'ti ti-file-type-xls', label: 'Export as Excel' },
                      { id: 'csv', icon: 'ti ti-file-type-csv', label: 'Export as CSV' },
                    ].map((option) => (
                      <li key={option.id}>
                        <button
                          type="button"
                          className="dropdown-item rounded-1"
                          onClick={() => {
                            setOpenMenu(null);
                            push(`${option.label} started`);
                          }}
                        >
                          <i className={`${option.icon} me-2`} />
                          {option.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  className="workspace-button workspace-button-icon"
                  title="Print"
                  aria-label="Print"
                  onClick={() => window.print()}
                >
                  <i className="ti ti-printer" />
                </button>
              </div>

              <div className="quick-filters">
                <span className="text-muted fs-12 fw-semibold me-1">
                  <i className="ti ti-filter me-1" />
                  Filters:
                </span>
                {chips.map((chip) => (
                  <span className={`badge badge-soft-${chip.tone} d-inline-flex align-items-center`} key={chip.id}>
                    {filterChipLabels[chip.id] ?? chip.id} : {chip.value}{' '}
                    <button
                      type="button"
                      className={`ms-1 btn btn-link p-0 border-0 text-${chip.tone}`}
                      aria-label="Remove filter"
                      onClick={() => {
                        setDraft((c) => ({ ...c, [chip.id]: '' }));
                        setFilters((c) => ({ ...c, [chip.id]: '' }));
                      }}
                    >
                      <i className="ti ti-x" />
                    </button>
                  </span>
                ))}
                {chips.length > 0 ? (
                  <button type="button" className="btn btn-link btn-sm text-primary" onClick={resetFilters}>
                    Clear all
                  </button>
                ) : (
                  <span className="fs-12 text-muted">None applied</span>
                )}
              </div>
            </div>
            {/* /Sticky Payroll Toolbar */}

            {/* Payroll Summary Bar */}
            <div className="p-3 border-bottom">
              <div className="row g-3 align-items-center">
                {summaryTiles.map((tile) => (
                  <div className="col-xl col-md-3 col-6" key={tile.id}>
                    <div className="d-flex align-items-center gap-2 border-end-lg pe-xl-2">
                      <span className={`avatar avatar-md ${tile.tint} rounded flex-shrink-0`}>
                        <i className={`${tile.icon} fs-20`} />
                      </span>
                      <div>
                        <span className="fs-12 text-muted d-block">{tile.label}</span>
                        <span className="fw-semibold">{tile.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* /Payroll Summary Bar */}

            {/* Premium Employee Payroll Grid */}
            <div className="data-table dt-cards">
              <table className="table">
                <thead>
                  <tr>
                    <th className="dt-pin">
                      <input
                        type="checkbox"
                        className="dt-check"
                        aria-label="Select all"
                        checked={allShownSelected}
                        onChange={() => setSelected(allShownSelected ? [] : shown.map((row) => row.id))}
                      />
                    </th>
                    <th />
                    <th>Employee</th>
                    {columns.department ? <th>Department</th> : null}
                    {columns.designation ? <th>Designation</th> : null}
                    <th>Payroll Month</th>
                    {columns.basic ? <th className="text-end">Basic Salary</th> : null}
                    {columns.allowances ? <th className="text-end">Allowances</th> : null}
                    {columns.deductions ? <th className="text-end">Deductions</th> : null}
                    {columns.bonus ? <th className="text-end">Bonus</th> : null}
                    <th className="text-end">Net Salary</th>
                    {columns.method ? <th>Payment Method</th> : null}
                    <th>Payroll Status</th>
                    <th>Payment Date</th>
                    {columns.lastUpdated ? <th>Last Updated</th> : null}
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((row) => (
                    <tr className="dt-row" key={row.id}>
                      <td className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check"
                          aria-label={`Select ${row.name}`}
                          checked={selected.includes(row.id)}
                          onChange={() =>
                            setSelected((c) =>
                              c.includes(row.id) ? c.filter((id) => id !== row.id) : [...c, row.id],
                            )
                          }
                        />
                      </td>
                      <td />
                      <td>
                        <div className="dt-user">
                          <span className="dt-avatar">
                            <ImageWithBasePath src={row.avatar} alt={row.name} />
                          </span>
                          <span>
                            <ActionLink
                              className="dt-name"
                              onClick={() => openModal(row, 'payroll_breakdown')}
                            >
                              {row.name}
                            </ActionLink>
                            <span className="dt-sub">{row.id}</span>
                          </span>
                        </div>
                      </td>
                      {columns.department ? <td>{row.department}</td> : null}
                      {columns.designation ? <td>{row.designation}</td> : null}
                      <td>{row.month}</td>
                      {columns.basic ? <td className="text-end">{money(row.basic)}</td> : null}
                      {columns.allowances ? (
                        <td className="text-end text-success">+ {money(row.allowances)}</td>
                      ) : null}
                      {columns.deductions ? (
                        <td className="text-end text-danger">- {money(row.deductions)}</td>
                      ) : null}
                      {columns.bonus ? <td className="text-end text-success">+ {money(row.bonus)}</td> : null}
                      <td className="text-end fw-medium">{money(netSalary(row))}</td>
                      {columns.method ? (
                        <td>
                          <span className="d-inline-flex align-items-center">
                            <i className={`${row.method.icon} me-1 text-muted`} />
                            {row.method.label}
                          </span>
                        </td>
                      ) : null}
                      <td>
                        <span className={`dt-pill ${statusPill[row.status]}`}>
                          <span className="dt-pill-dot" />
                          {row.status}
                        </span>
                      </td>
                      <td>{row.paymentDate}</td>
                      {columns.lastUpdated ? <td className="fs-13 text-muted">{row.lastUpdated}</td> : null}
                      <td className="text-end">
                        <div className="dt-actions">
                          <ActionLink
                            className="dt-ib"
                            title="Inspect"
                            ariaLabel="Inspect"
                            onClick={() => {
                              setInspected(row);
                              setRowMenu(null);
                            }}
                          >
                            <i className="ti ti-eye" />
                          </ActionLink>
                          <ActionLink
                            className="dt-ib"
                            title="Edit Payroll"
                            ariaLabel="Edit Payroll"
                            onClick={() => openModal(row, 'edit_payroll')}
                          >
                            <i className="ti ti-edit" />
                          </ActionLink>
                          <ActionLink
                            className="dt-ib success"
                            title="Approve Payroll"
                            ariaLabel="Approve Payroll"
                            onClick={() => openModal(row, 'approve_payroll')}
                          >
                            <i className="ti ti-check" />
                          </ActionLink>
                          <div className="dropdown">
                            <ActionLink
                              className="dt-ib"
                              title="More"
                              ariaLabel="More actions"
                              ariaExpanded={rowMenu === row.id}
                              onClick={() => setRowMenu(rowMenu === row.id ? null : row.id)}
                            >
                              <i className="ti ti-dots-vertical" />
                            </ActionLink>
                            <ul className={`dropdown-menu dropdown-menu-end p-2${rowMenu === row.id ? ' show' : ''}`}>
                              {(
                                [
                                  ['payroll_breakdown', 'ti ti-report-money', 'Payroll Breakdown'],
                                  ['salary_structure', 'ti ti-file-dollar', 'Salary Structure'],
                                  ['payroll_history', 'ti ti-history', 'Payroll History'],
                                  ['process_payroll', 'ti ti-player-play', 'Process Payroll'],
                                  ['generate_payslip', 'ti ti-file-text', 'Generate Payslip'],
                                ] as [PayrollModalId, string, string][]
                              ).map(([id, icon, label]) => (
                                <li key={id}>
                                  <button
                                    type="button"
                                    className="dropdown-item rounded-1"
                                    onClick={() => openModal(row, id)}
                                  >
                                    <i className={`${icon} me-2`} />
                                    {label}
                                  </button>
                                </li>
                              ))}
                              <li>
                                <hr className="dropdown-divider" />
                              </li>
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item rounded-1 text-danger"
                                  onClick={() => openModal(row, 'delete')}
                                >
                                  <i className="ti ti-trash me-2" />
                                  Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* /Premium Employee Payroll Grid */}

            {/* Empty State */}
            <div className={`text-center py-5${filtered.length === 0 ? '' : ' d-none'}`} id="ep_empty">
              <span className="avatar avatar-xxl bg-primary-transparent text-primary rounded-circle flex-shrink-0 mb-3">
                <i className="ti ti-file-off fs-36" />
              </span>
              <h5 className="mb-1">No Payroll Records Found</h5>
              <p className="text-muted mb-0">No record matches the selected filters.</p>
            </div>

            {/* Pagination Footer */}
            <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
              <p className="mb-0 text-muted">
                Showing {rangeStart} to {rangeEnd} of {filtered.length} records
              </p>
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                    <button type="button" className="page-link" onClick={() => setPage((v) => Math.max(1, v - 1))}>
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                    <li className={`page-item${currentPage === number ? ' active' : ''}`} key={number}>
                      <button type="button" className="page-link" onClick={() => setPage(number)}>
                        {number}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item${currentPage === pageCount ? ' disabled' : ''}`}>
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => setPage((v) => Math.min(pageCount, v + 1))}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Payroll Inspector Offcanvas */}
          <Offcanvas
            open={inspected !== null}
            onClose={() => setInspected(null)}
            title="Payroll Inspector"
            labelledById="pay_inspector_lbl"
          >
            {inspected ? (
              <>
                <div className="d-flex align-items-center gap-2 pb-3 mb-3 border-bottom">
                  <span className="avatar avatar-lg">
                    <ImageWithBasePath src={inspected.avatar} className="rounded" alt={inspected.name} />
                  </span>
                  <div>
                    <h6 className="mb-0">{inspected.name}</h6>
                    <span className="fs-12 text-muted">
                      {inspected.id} · {inspected.designation} · {inspected.department}
                    </span>
                  </div>
                  <span className={`dt-pill ${statusPill[inspected.status]} ms-auto`}>
                    <span className="dt-pill-dot" />
                    {inspected.status}
                  </span>
                </div>

                <div className="row g-2 mb-3">
                  {[
                    { label: 'Gross', value: money(grossSalary(inspected)) },
                    { label: 'Deductions', value: money(inspected.deductions) },
                    { label: 'Net', value: money(netSalary(inspected)) },
                  ].map((tile) => (
                    <div className="col-4" key={tile.label}>
                      <div className="border rounded p-2 text-center">
                        <span className="fs-11 text-muted d-block">{tile.label}</span>
                        <h6 className="mb-0">{tile.value}</h6>
                      </div>
                    </div>
                  ))}
                </div>

                <ul className="list-unstyled mb-3">
                  {[
                    { label: 'Payroll Month', value: inspected.month },
                    { label: 'Payment Method', value: inspected.method.label },
                    { label: 'Payment Date', value: inspected.paymentDate },
                    { label: 'Campus', value: inspected.campus },
                    { label: 'Employee Type', value: inspected.employeeType },
                    { label: 'Last Updated', value: inspected.lastUpdated },
                  ].map((item, index, arr) => (
                    <li
                      className={`d-flex justify-content-between py-1 fs-13${index === arr.length - 1 ? '' : ' border-bottom'}`}
                      key={item.label}
                    >
                      <span className="text-muted">{item.label}</span>
                      <span className="text-dark">{item.value}</span>
                    </li>
                  ))}
                </ul>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-primary flex-fill"
                    onClick={() => {
                      const row = inspected;
                      setInspected(null);
                      openModal(row, 'payroll_breakdown');
                    }}
                  >
                    <i className="ti ti-report-money me-1" />
                    Breakdown
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white flex-fill"
                    onClick={() => {
                      const row = inspected;
                      setInspected(null);
                      openModal(row, 'edit_payroll');
                    }}
                  >
                    <i className="ti ti-edit me-1" />
                    Edit
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
          {/* /Payroll Inspector Offcanvas */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <PayrollModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onToast={push}
        onSave={saveDraft}
        onSetStatus={setModalStatus}
        onConfirmDelete={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="epToasts" />
    </>
  );
};

export default EmployeePayroll;
