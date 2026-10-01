import { Fragment, useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import LeaveModals from './modals/LeaveModals';
import type { LeaveDraft, LeaveModalId } from './modals/LeaveModals';
import type { BulkActionId, LeaveRequest, LeaveStatus, SavedViewId, SortKey } from './data/leaves.data';
import { ActionLink } from '@components/workspace';
import {
  approvalStatusOf,
  balancesFor,
  bulkActions,
  filterChipLabels,
  filterChipTone,
  filterFields,
  leaveRequests as initialLeaves,
  savedViews,
  sortOptions,
  statusBadge,
  statusPill,
  summaryOf,
} from './data/leaves.data';

const routes = all_routes;

const EMPTY_FILTERS: Record<string, string> = Object.fromEntries(filterFields.map((f) => [f.id, '']));

type ToolbarMenu = 'filter' | 'sort' | 'views' | 'bulk' | 'export' | null;

const ListLeaves = () => {
  const [rows, setRows] = useState<LeaveRequest[]>(initialLeaves);

  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>('employee');
  const [view, setView] = useState<SavedViewId>('all');
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [rowMenu, setRowMenu] = useState<string | null>(null);

  const [activeModal, setActiveModal] = useState<LeaveModalId | null>(null);
  const [modalRow, setModalRow] = useState<LeaveRequest | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = rows.filter((row) => {
      if (term && !`${row.name} ${row.staffId} ${row.leaveType}`.toLowerCase().includes(term)) return false;
      if (view === 'pending' && row.status !== 'Pending') return false;
      if (view === 'approved' && row.status !== 'Approved') return false;
      if (filters.employee && row.name !== filters.employee) return false;
      if (filters.department && row.department !== filters.department) return false;
      if (filters['leave-type'] && row.leaveType !== filters['leave-type']) return false;
      if (filters['leave-status'] && row.status !== filters['leave-status']) return false;
      if (filters['approval-status'] && approvalStatusOf(row.status) !== filters['approval-status']) return false;
      if (filters.branch && row.branch !== filters.branch) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      if (sort === 'days') return b.days - a.days || a.name.localeCompare(b.name);
      if (sort === 'applied') return b.applied.localeCompare(a.applied) || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
  }, [rows, search, view, filters, sort]);

  const summary = useMemo(() => summaryOf(rows), [rows]);

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
    push('Filters cleared');
  }, [push]);

  const setStatusFor = useCallback((ids: string[], status: LeaveStatus) => {
    setRows((current) => current.map((row) => (ids.includes(row.id) ? { ...row, status } : row)));
  }, []);

  const runBulkAction = useCallback(
    (action: BulkActionId) => {
      if (action === 'print') {
        window.print();
        return;
      }
      if (selected.length === 0) {
        push('Select at least one request first', 'warning');
        return;
      }
      if (action === 'approve') {
        setStatusFor(selected, 'Approved');
        push(`${selected.length} requests approved`);
      } else if (action === 'reject') {
        setStatusFor(selected, 'Rejected');
        push(`${selected.length} requests rejected`);
      } else {
        push(`${selected.length} requests queued for export`);
      }
    },
    [selected, setStatusFor, push],
  );

  const openModal = (row: LeaveRequest | null, modal: LeaveModalId) => {
    setModalRow(row);
    setActiveModal(modal);
    setRowMenu(null);
  };

  const createLeave = useCallback(
    (values: LeaveDraft) => {
      if (!values.name.trim() || !values.from.trim()) {
        push('Give the request an employee and a from date', 'warning');
        return;
      }
      const record: LeaveRequest = {
        id: `LV-${Date.now()}`,
        staffId: 'STF-NEW',
        name: values.name.trim(),
        avatar: 'assets/img/profiles/avatar-01.jpg',
        department: 'Administration',
        designation: '—',
        leaveType: values.leaveType,
        tint: 'primary',
        days: Number(values.days) || 1,
        from: values.from.trim(),
        to: values.to.trim() || values.from.trim(),
        applied: values.from.trim(),
        approver: 'Principal Office',
        status: 'Pending',
        hasAttachment: false,
        branch: 'Main Campus',
        reason: values.reason,
      };
      setRows((current) => [record, ...current]);
      setActiveModal(null);
      push(`Leave request added for ${record.name}`);
    },
    [push],
  );

  const updateLeave = useCallback(
    (values: LeaveDraft) => {
      if (!modalRow) return;
      setRows((current) =>
        current.map((row) =>
          row.id === modalRow.id
            ? {
                ...row,
                name: values.name.trim() || row.name,
                leaveType: values.leaveType,
                from: values.from.trim() || row.from,
                to: values.to.trim() || row.to,
                days: Number(values.days) || row.days,
                reason: values.reason,
              }
            : row,
        ),
      );
      setActiveModal(null);
      push('Leave request updated');
    },
    [modalRow, push],
  );

  const confirmDelete = useCallback(() => {
    if (modalRow) {
      setRows((current) => current.filter((row) => row.id !== modalRow.id));
      setSelected((current) => current.filter((id) => id !== modalRow.id));
    }
    setActiveModal(null);
    push('Leave request deleted');
  }, [modalRow, push]);

  const allShownSelected = visible.length > 0 && visible.every((row) => selected.includes(row.id));

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
              <h3 className="page-title mb-1">Leaves</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">HRM</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Leaves
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                onClick={() => openModal(null, 'import')}
              >
                <i className="ti ti-file-import me-1" />
                Import
              </button>
              <button
                type="button"
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => openModal(null, 'add')}
              >
                <i className="ti ti-square-rounded-plus me-1" />
                Add Leave
              </button>
            </div>
          </div>
          {/* /Page Header */}

          {/* Leave Workspace */}
          <div className="card mb-0 data-workspace classes-workspace is-loaded" id="lv_card">
            <div className="card-header border-bottom sticky-top bg-white">
              <div className="page-toolbar">
                <div className="search-toolbar">
                  <i className="ti ti-search search-toolbar-icon" />
                  <input
                    type="text"
                    id="lvSearch"
                    placeholder="Search employee, ID or leave type…"
                    aria-label="Search leave requests"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
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
                          {field.kind === 'date' ? (
                            <input
                              type="text"
                              className="form-control form-control-sm filter-datepicker"
                              id={field.id}
                              value={draft[field.id] ?? ''}
                              onChange={(event) => setDraft((c) => ({ ...c, [field.id]: event.target.value }))}
                            />
                          ) : (
                            <select
                              className="form-select"
                              id={field.id}
                              value={draft[field.id] ?? ''}
                              onChange={(event) => setDraft((c) => ({ ...c, [field.id]: event.target.value }))}
                            >
                              <option value="">All</option>
                              {field.options?.map((option) => (
                                <option key={option}>{option}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
                      <span className="fs-12 text-muted">
                        <b>{visible.length}</b> of {rows.length} requests match
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
                            setOpenMenu(null);
                          }}
                        >
                          <i className={`${item.icon} me-2`} />
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="dropdown">
                  {menuButton('bulk', 'ti ti-checkbox', 'Bulk Actions', selected.length)}
                  <ul className={`dropdown-menu p-2${openMenu === 'bulk' ? ' show' : ''}`}>
                    <li className="context-menu-head">Selected requests</li>
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

                <span className="flex-grow-1" />

                <button
                  type="button"
                  className="workspace-button workspace-button-icon"
                  title="Refresh"
                  aria-label="Refresh"
                  onClick={() => {
                    setRows(initialLeaves);
                    push('Leave list refreshed');
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

            {/* Summary bar */}
            <div className="p-3 border-bottom">
              <div className="row g-3 align-items-center">
                {summary.map((tile) => (
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

            {/* Table */}
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
                        onChange={() => setSelected(allShownSelected ? [] : visible.map((row) => row.id))}
                      />
                    </th>
                    <th className="card-expand-toggle" />
                    <th>Employee</th>
                    <th>Leave Details</th>
                    <th>Approval Details</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => {
                    const open = expanded.includes(row.id);
                    return (
                      <Fragment key={row.id}>
                        <tr className="dt-row">
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
                          <td className="card-expand-toggle">
                            <button
                              type="button"
                              className="dt-expand"
                              aria-expanded={open}
                              aria-label="Toggle leave details"
                              onClick={() =>
                                setExpanded((c) =>
                                  c.includes(row.id) ? c.filter((id) => id !== row.id) : [...c, row.id],
                                )
                              }
                            >
                              <i className="ti ti-chevron-right" />
                            </button>
                          </td>
                          <td>
                            <div className="dt-user">
                              <span className="dt-avatar">
                                <ImageWithBasePath src={row.avatar} alt={row.name} />
                              </span>
                              <span>
                                <ActionLink
                                  className="dt-name"
                                  onClick={() => openModal(row, 'view')}
                                >
                                  {row.name}
                                </ActionLink>
                                <span className="dt-sub">
                                  {row.staffId} · {row.department} · {row.designation}
                                </span>
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className={`badge badge-soft-${row.tint} mb-1`}>{row.leaveType}</span>
                            <div className="fs-12 text-muted">
                              <span className="fw-medium">
                                {row.days} {row.days === 1 ? 'day' : 'days'}
                              </span>{' '}
                              · From {row.from} to {row.to}
                            </div>
                          </td>
                          <td>
                            <div className="fs-13">{row.approver}</div>
                            <div className="fs-12 text-muted">
                              Applied {row.applied} ·{' '}
                              {row.hasAttachment ? (
                                <button
                                  type="button"
                                  className="btn btn-link p-0 border-0 fs-12"
                                  onClick={() => openModal(row, 'attachment')}
                                >
                                  Attachment
                                </button>
                              ) : (
                                <span className="badge badge-soft-secondary">No attachments</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className={`dt-pill ${statusPill[row.status]}`}>
                              <span className="dt-pill-dot" />
                              {row.status}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="dt-actions">
                              <ActionLink
                                className="dt-ib success"
                                title="Approve"
                                ariaLabel="Approve"
                                onClick={() => openModal(row, 'approve')}
                              >
                                <i className="ti ti-check" />
                              </ActionLink>
                              <ActionLink
                                className="dt-ib danger"
                                title="Reject"
                                ariaLabel="Reject"
                                onClick={() => openModal(row, 'reject')}
                              >
                                <i className="ti ti-x" />
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
                                      ['view', 'ti ti-eye', 'View Request'],
                                      ['edit', 'ti ti-edit', 'Edit Leave'],
                                      ['history', 'ti ti-history', 'Leave History'],
                                      ['attachment', 'ti ti-paperclip', 'Attachment'],
                                    ] as [LeaveModalId, string, string][]
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

                        <tr className={`dt-detail${open ? ' open' : ''}`}>
                          <td colSpan={7} className="p-0">
                            <div className={`collapse${open ? ' show' : ''}`}>
                              <div className="p-3">
                                <div className="row g-3">
                                  <div className="col-lg-4 col-md-6">
                                    <h6 className="fs-13 mb-2">
                                      <i className="ti ti-user text-primary me-1" />
                                      Employee Information
                                    </h6>
                                    <ul className="list-unstyled mb-0">
                                      {[
                                        { label: 'Staff ID', value: row.staffId },
                                        { label: 'Department', value: row.department },
                                        { label: 'Designation', value: row.designation },
                                        { label: 'Branch', value: row.branch },
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
                                  </div>
                                  <div className="col-lg-4 col-md-6">
                                    <h6 className="fs-13 mb-2">
                                      <i className="ti ti-calendar-stats text-success me-1" />
                                      Leave Balance
                                    </h6>
                                    <ul className="list-unstyled mb-0">
                                      {balancesFor(row).map((balance, index, arr) => (
                                        <li
                                          className={`d-flex justify-content-between py-1 fs-13${index === arr.length - 1 ? '' : ' border-bottom'}`}
                                          key={balance.type}
                                        >
                                          <span className="text-muted">{balance.type}</span>
                                          <span className="text-dark">
                                            {balance.total - balance.used} of {balance.total} left
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="col-lg-4 col-md-6">
                                    <h6 className="fs-13 mb-2">
                                      <i className="ti ti-align-left text-info me-1" />
                                      Reason
                                    </h6>
                                    <p className="fs-13 text-muted mb-2">{row.reason}</p>
                                    <span className={statusBadge[row.status]}>
                                      {approvalStatusOf(row.status)}
                                    </span>
                                  </div>
                                </div>
                                <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top">
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={() => openModal(row, 'history')}
                                  >
                                    <i className="ti ti-history me-1" />
                                    Leave History
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-outline-light bg-white btn-sm"
                                    onClick={() => openModal(row, 'view')}
                                  >
                                    <i className="ti ti-eye me-1" />
                                    View Request
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty state */}
            <div className={`text-center py-5${visible.length === 0 ? '' : ' d-none'}`} id="lv_empty">
              <span className="avatar avatar-xxl bg-primary-transparent text-primary rounded-circle flex-shrink-0 mb-3">
                <i className="ti ti-calendar-off fs-36" />
              </span>
              <h5 className="mb-1">No Leave Requests Found</h5>
              <p className="text-muted mb-3">No request matches the selected filters.</p>
              <button
                type="button"
                className="btn btn-primary d-inline-flex align-items-center"
                onClick={() => openModal(null, 'add')}
              >
                <i className="ti ti-square-rounded-plus me-1" />
                Add Leave
              </button>
            </div>

            {/* Footer */}
            <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
              <p className="mb-0 text-muted">
                Showing {visible.length} of {rows.length} leave requests
              </p>
            </div>
          </div>
          {/* /Leave Workspace */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <LeaveModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onToast={push}
        onCreate={createLeave}
        onUpdate={updateLeave}
        onApprove={(note) => {
          if (modalRow) setStatusFor([modalRow.id], 'Approved');
          setActiveModal(null);
          push(note.trim() ? `Leave approved — ${note.trim()}` : 'Leave approved');
        }}
        onReject={(reason) => {
          if (modalRow) setStatusFor([modalRow.id], 'Rejected');
          setActiveModal(null);
          push(reason.trim() ? `Leave rejected — ${reason.trim()}` : 'Leave rejected');
        }}
        onConfirmDelete={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="lvToasts" />
    </>
  );
};

export default ListLeaves;
