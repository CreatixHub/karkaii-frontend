import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import PayslipModals from './modals/PayslipModals';
import type { PayslipModalId } from './modals/PayslipModals';
import type { BulkActionId, ColumnId, Payslip, SavedViewId, SortKey } from './data/payslips.data';
import { ActionLink } from '@components/workspace';
import {
  bulkActions,
  deductionComponents,
  earningComponents,
  filterChipLabels,
  filterChipTone,
  filterFields,
  money,
  netSalary,
  payslips as initialPayslips,
  PAYROLL_PERIOD,
  savedViews,
  sortOptions,
  statusPill,
  summaryTiles,
  toggleableColumns,
} from './data/payslips.data';

const routes = all_routes;

const EMPTY_FILTERS: Record<string, string> = {
  'payroll-month': 'July',
  'payroll-year': '2026',
  department: '',
  'employee-type': '',
  designation: '',
  status: '',
  'payment-method': '',
};

const ALL_COLUMNS = toggleableColumns.reduce<Record<ColumnId, boolean>>(
  (acc, column) => {
    acc[column.id] = true;
    return acc;
  },
  {} as Record<ColumnId, boolean>,
);

type ToolbarMenu = 'filter' | 'sort' | 'views' | 'bulk' | 'columns' | 'export' | null;

const Payslips = () => {
  const [rows, setRows] = useState<Payslip[]>(initialPayslips);

  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState<Record<string, string>>(EMPTY_FILTERS);
  const [filters, setFilters] = useState<Record<string, string>>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>('employee');
  const [view, setView] = useState<SavedViewId>('all');
  const [columns, setColumns] = useState<Record<ColumnId, boolean>>(ALL_COLUMNS);
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [rowMenu, setRowMenu] = useState<string | null>(null);
  const [preview, setPreview] = useState<Payslip | null>(null);

  const [activeModal, setActiveModal] = useState<PayslipModalId | null>(null);
  const [modalRow, setModalRow] = useState<Payslip | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = rows.filter((row) => {
      if (term && !`${row.name} ${row.id} ${row.designation}`.toLowerCase().includes(term)) return false;
      if (view === 'pending' && row.status !== 'Pending') return false;
      if (view === 'paid' && row.status !== 'Paid') return false;
      if (filters.department && row.department !== filters.department) return false;
      if (filters['employee-type'] && row.employeeType !== filters['employee-type']) return false;
      if (filters.designation && row.designation !== filters.designation) return false;
      if (filters.status && row.status !== filters.status) return false;
      if (filters['payment-method'] && row.method.label !== filters['payment-method']) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      if (sort === 'net') return netSalary(b) - netSalary(a) || a.name.localeCompare(b.name);
      if (sort === 'updated') return b.lastUpdated.localeCompare(a.lastUpdated) || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
  }, [rows, search, view, filters, sort]);

  const chips = useMemo(
    () =>
      filterFields
        .filter((field) => filters[field.id] && filters[field.id] !== EMPTY_FILTERS[field.id])
        .map((field) => ({ id: field.id, value: filters[field.id], tone: filterChipTone[field.id] ?? 'primary' })),
    [filters],
  );

  const resetFilters = useCallback(() => {
    setDraft(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
    setSearch('');
    setView('all');
    push('Filters cleared');
  }, [push]);

  /** Marking a payslip paid is what Regenerate and bulk Email both settle to. */
  const markPaid = useCallback((ids: string[]) => {
    setRows((current) =>
      current.map((row) =>
        ids.includes(row.id) && row.status !== 'Paid'
          ? { ...row, status: 'Paid', paymentDate: '28 Jul 2026', generatedBy: 'K. Larry', lastUpdated: '28 Jul 2026' }
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
        push('Select at least one payslip first', 'warning');
        return;
      }
      if (action === 'email') {
        markPaid(selected);
        push(`${selected.length} payslips emailed`);
      } else if (action === 'download') {
        push(`${selected.length} payslip PDFs queued`);
      } else {
        push(`${selected.length} payslips archived`);
      }
    },
    [selected, markPaid, push],
  );

  const openModal = (row: Payslip | null, modal: PayslipModalId) => {
    setModalRow(row);
    setActiveModal(modal);
    setRowMenu(null);
  };

  const confirmDelete = useCallback(() => {
    if (modalRow) {
      setRows((current) => current.filter((row) => row.id !== modalRow.id));
      setSelected((current) => current.filter((id) => id !== modalRow.id));
    }
    setActiveModal(null);
    push('Payslip deleted');
  }, [modalRow, push]);

  const allShownSelected = visible.length > 0 && visible.every((row) => selected.includes(row.id));

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Payroll &amp; Payslips</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">HRM</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Payslips
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
                onClick={() => {
                  markPaid(rows.map((row) => row.id));
                  push('Payroll processed for July 2026');
                }}
              >
                <i className="ti ti-player-play me-1" />
                Process Payroll
              </button>
            </div>
          </div>
          {/* /Page Header */}

          <div className="card mb-0 data-workspace classes-workspace is-loaded" id="pay_card">
            {/* Sticky Payroll Toolbar */}
            <div className="card-header border-bottom sticky-top bg-white">
              <div className="page-toolbar">
                <div className="search-toolbar">
                  <i className="ti ti-search search-toolbar-icon" />
                  <input
                    type="text"
                    id="paySearch"
                    placeholder="Search employee, ID or designation…"
                    aria-label="Search payslips"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <span className="search-toolbar-kbd">⌘K</span>
                </div>

                {/* Filters */}
                <div className="dropdown">
                  <button
                    type="button"
                    className="workspace-button dropdown-toggle"
                    aria-expanded={openMenu === 'filter'}
                    onClick={() => setOpenMenu(openMenu === 'filter' ? null : 'filter')}
                  >
                    <i className="ti ti-adjustments-horizontal" />
                    Filters
                  </button>
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
                            {field.noAllOption ? null : <option value="">All</option>}
                            {field.options.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                    <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
                      <span className="fs-12 text-muted">
                        <b>{visible.length}</b> of {rows.length} payslips match
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

                {/* Sort */}
                <div className="dropdown">
                  <button
                    type="button"
                    className="workspace-button dropdown-toggle"
                    aria-expanded={openMenu === 'sort'}
                    onClick={() => setOpenMenu(openMenu === 'sort' ? null : 'sort')}
                  >
                    <i className="ti ti-sort-ascending-2" />
                    Sort
                  </button>
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

                {/* Saved Views */}
                <div className="dropdown">
                  <button
                    type="button"
                    className="workspace-button dropdown-toggle"
                    aria-expanded={openMenu === 'views'}
                    onClick={() => setOpenMenu(openMenu === 'views' ? null : 'views')}
                  >
                    <i className="ti ti-bookmark" />
                    Saved Views
                  </button>
                  <ul className={`dropdown-menu p-2${openMenu === 'views' ? ' show' : ''}`}>
                    <li className="context-menu-head">My Views</li>
                    {savedViews.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          className={`dropdown-item rounded-1${view === item.id ? ' active' : ''}`}
                          onClick={() => {
                            setView(item.id);
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

                {/* Bulk Actions */}
                <div className="dropdown">
                  <button
                    type="button"
                    className="workspace-button dropdown-toggle"
                    aria-expanded={openMenu === 'bulk'}
                    onClick={() => setOpenMenu(openMenu === 'bulk' ? null : 'bulk')}
                  >
                    <i className="ti ti-checkbox" />
                    Bulk Actions
                    {selected.length > 0 ? <span className="result-count">{selected.length}</span> : null}
                  </button>
                  <ul className={`dropdown-menu p-2${openMenu === 'bulk' ? ' show' : ''}`}>
                    <li className="context-menu-head">Selected payslips</li>
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

                {/* Columns */}
                <div className="dropdown">
                  <button
                    type="button"
                    className="workspace-button dropdown-toggle"
                    aria-expanded={openMenu === 'columns'}
                    onClick={() => setOpenMenu(openMenu === 'columns' ? null : 'columns')}
                  >
                    <i className="ti ti-columns-3" />
                    Columns
                  </button>
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
                    setRows(initialPayslips);
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
                        setDraft((c) => ({ ...c, [chip.id]: EMPTY_FILTERS[chip.id] }));
                        setFilters((c) => ({ ...c, [chip.id]: EMPTY_FILTERS[chip.id] }));
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

            {/* Premium Payroll Grid */}
            <div className="data-table dt-cards">
              <table className="table">
                <thead>
                  <tr>
                    <th className="dt-pin">
                      <input
                        type="checkbox"
                        className="dt-check"
                        id="select-all"
                        aria-label="Select all payslips"
                        checked={allShownSelected}
                        onChange={() => setSelected(allShownSelected ? [] : visible.map((row) => row.id))}
                      />
                    </th>
                    <th />
                    <th>Employee</th>
                    {columns.department ? <th>Department</th> : null}
                    {columns.designation ? <th>Designation</th> : null}
                    <th>Payroll Month</th>
                    <th className="text-end">Basic Salary</th>
                    {columns.allowances ? <th className="text-end">Allowances</th> : null}
                    {columns.deductions ? <th className="text-end">Deductions</th> : null}
                    <th className="text-end">Net Salary</th>
                    {columns.method ? <th>Payment Method</th> : null}
                    <th>Payment Date</th>
                    <th>Payslip Status</th>
                    {columns.generatedBy ? <th>Generated By</th> : null}
                    {columns.lastUpdated ? <th>Last Updated</th> : null}
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => (
                    <tr className="dt-row" key={row.id}>
                      <td className="dt-pin">
                        <input
                          type="checkbox"
                          className="dt-check"
                          aria-label={`Select ${row.name}`}
                          checked={selected.includes(row.id)}
                          onChange={() =>
                            setSelected((current) =>
                              current.includes(row.id)
                                ? current.filter((id) => id !== row.id)
                                : [...current, row.id],
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
                              onClick={() => openModal(row, 'payroll_details')}
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
                      <td className="text-end">{money(row.basic)}</td>
                      {columns.allowances ? (
                        <td className="text-end text-success">+{money(row.allowances)}</td>
                      ) : null}
                      {columns.deductions ? (
                        <td className="text-end text-danger">−{money(row.deductions)}</td>
                      ) : null}
                      <td className="text-end fw-medium">{money(netSalary(row))}</td>
                      {columns.method ? (
                        <td>
                          <span className="d-inline-flex align-items-center">
                            <i className={`${row.method.icon} me-1 text-muted`} />
                            {row.method.label}
                          </span>
                        </td>
                      ) : null}
                      <td>{row.paymentDate}</td>
                      <td>
                        <span className={`dt-pill ${statusPill[row.status]}`}>
                          <span className="dt-pill-dot" />
                          {row.status}
                        </span>
                      </td>
                      {columns.generatedBy ? <td>{row.generatedBy}</td> : null}
                      {columns.lastUpdated ? <td>{row.lastUpdated}</td> : null}
                      <td className="text-end">
                        <div className="dt-actions">
                          <ActionLink
                            className="dt-ib"
                            title="Preview Payslip"
                            ariaLabel="Preview Payslip"
                            onClick={() => setPreview(row)}
                          >
                            <i className="ti ti-eye" />
                          </ActionLink>
                          <ActionLink
                            className="dt-ib"
                            title="Email Payslip"
                            ariaLabel="Email Payslip"
                            onClick={() => openModal(row, 'email_payslip')}
                          >
                            <i className="ti ti-mail" />
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
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item rounded-1"
                                  onClick={() => openModal(row, 'salary_breakdown')}
                                >
                                  <i className="ti ti-report-money me-2" />
                                  Salary Breakdown
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item rounded-1"
                                  onClick={() => openModal(row, 'earnings_deductions')}
                                >
                                  <i className="ti ti-arrows-up-down me-2" />
                                  Earnings &amp; Deductions
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item rounded-1"
                                  onClick={() => openModal(row, 'payroll_history')}
                                >
                                  <i className="ti ti-history me-2" />
                                  Payroll History
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item rounded-1"
                                  onClick={() => {
                                    setRowMenu(null);
                                    markPaid([row.id]);
                                    push(`${row.name}'s payslip regenerated`);
                                  }}
                                >
                                  <i className="ti ti-refresh me-2" />
                                  Regenerate
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item rounded-1"
                                  onClick={() => {
                                    setRowMenu(null);
                                    window.print();
                                  }}
                                >
                                  <i className="ti ti-printer me-2" />
                                  Print
                                </button>
                              </li>
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
            {/* /Premium Payroll Grid */}

            {/* Empty state */}
            <div className={`text-center py-5${visible.length === 0 ? '' : ' d-none'}`} id="pay_empty">
              <span className="avatar avatar-xxl bg-primary-transparent text-primary rounded-circle flex-shrink-0 mb-3">
                <i className="ti ti-file-off fs-36" />
              </span>
              <h5 className="mb-1">No Payslips Found</h5>
              <p className="text-muted mb-0">No payslip matches the selected filters.</p>
            </div>
          </div>

          {/* Payslip Preview Offcanvas */}
          <Offcanvas
            open={preview !== null}
            onClose={() => setPreview(null)}
            title="Payslip Preview"
            labelledById="payslip_preview_lbl"
            titleAccessory={
              preview ? <span className="badge badge-soft-primary">{PAYROLL_PERIOD}</span> : null
            }
          >
            {preview ? (
              <>
                <div className="d-flex align-items-center gap-2 pb-3 mb-3 border-bottom">
                  <span className="avatar avatar-lg">
                    <ImageWithBasePath src={preview.avatar} className="rounded" alt={preview.name} />
                  </span>
                  <div>
                    <h6 className="mb-0">{preview.name}</h6>
                    <span className="fs-12 text-muted">
                      {preview.id} · {preview.designation} · {preview.department}
                    </span>
                  </div>
                  <span className={`dt-pill ${statusPill[preview.status]} ms-auto`}>
                    <span className="dt-pill-dot" />
                    {preview.status}
                  </span>
                </div>

                <h6 className="fs-13 mb-2">Earnings</h6>
                <ul className="list-unstyled mb-3">
                  {earningComponents(preview).map((item) => (
                    <li className="d-flex justify-content-between py-1 fs-13 border-bottom" key={item.label}>
                      <span className="text-muted">{item.label}</span>
                      <span className="text-dark">{money(item.amount)}</span>
                    </li>
                  ))}
                </ul>

                <h6 className="fs-13 mb-2">Deductions</h6>
                <ul className="list-unstyled mb-3">
                  {deductionComponents(preview).map((item) => (
                    <li className="d-flex justify-content-between py-1 fs-13 border-bottom" key={item.label}>
                      <span className="text-muted">{item.label}</span>
                      <span className="text-dark">{money(item.amount)}</span>
                    </li>
                  ))}
                </ul>

                <div className="border rounded p-3 mb-3 d-flex justify-content-between align-items-center">
                  <span className="fw-medium">Net Salary</span>
                  <h5 className="mb-0">{money(netSalary(preview))}</h5>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-primary flex-fill"
                    onClick={() => {
                      const row = preview;
                      setPreview(null);
                      openModal(row, 'email_payslip');
                    }}
                  >
                    <i className="ti ti-mail me-1" />
                    Email
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white flex-fill"
                    onClick={() => window.print()}
                  >
                    <i className="ti ti-printer me-1" />
                    Print
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
          {/* /Payslip Preview Offcanvas */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <PayslipModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onToast={push}
        onConfirmDelete={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="payToasts" />
    </>
  );
};

export default Payslips;
