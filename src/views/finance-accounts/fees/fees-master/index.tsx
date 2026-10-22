import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { PageHeader } from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import type { FeeStructure } from './data/feesMaster.data';
import {
  allStructures, categoryOptions, classOptions, collectionPercentOf, commandMeta,
  frequencyOptions, initialChips, modeOptions, notifications, paymentTimeline, recentActivity,
  savedViewDefs, sectionOptions, statusChip, statusOptions, studentsPendingOf, upcomingCollections,
  yearOptions,
} from './data/feesMaster.data';

const routes = all_routes;

type FeeModalId =
  | 'structure' | 'invoice' | 'collect' | 'assign' | 'bulkamount' | 'remind' | 'approvals'
  | 'import' | 'advanced' | 'add' | 'delete';

const pageSizes = [4, 10, 25, 50];

const FeesMaster = () => {
  const [structures, setStructures] = useState<FeeStructure[]>(allStructures);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all');
  const [chips, setChips] = useState<string[]>(initialChips);
  const [filters, setFilters] = useState({
    year: yearOptions[0],
    category: categoryOptions[0],
    className: classOptions[0],
    section: sectionOptions[0],
    frequency: frequencyOptions[0],
    status: statusOptions[0],
    mode: modeOptions[0],
  });
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState(pageSizes[0]);
  const [page, setPage] = useState(1);
  const [activeModal, setActiveModal] = useState<FeeModalId | null>(null);
  const [modalRow, setModalRow] = useState<FeeStructure | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);
  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  /** The template shows a `/` hint in the search field; this makes it work. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
      if (event.key === '/' && !typing) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const openModal = useCallback((row: FeeStructure | null, modal: FeeModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const setFilter = useCallback((key: keyof typeof filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }, []);

  /* ------------------------------- Narrowing -------------------------------- */

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return structures.filter((row) => {
      if (term && !`${row.name} ${row.category} ${row.applicableClasses} ${row.code}`.toLowerCase().includes(term)) {
        return false;
      }
      if (filters.category !== categoryOptions[0] && row.category !== filters.category) return false;
      if (filters.frequency !== frequencyOptions[0]
        && row.frequency.toLowerCase() !== filters.frequency.toLowerCase()) return false;
      if (filters.status !== statusOptions[0] && row.status !== filters.status) return false;

      switch (view) {
        case 'due': return row.status === 'Due soon';
        case 'risk': return row.overdueAccounts > 10;
        case 'draft': return row.status === 'Draft';
        case 'archive': return row.status === 'Completed';
        default: return true;
      }
    });
  }, [filters, search, structures, view]);

  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const shown = visible.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const rangeStart = visible.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, visible.length);

  const toggleSelect = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));

  const toggleExpand = (id: string) =>
    setExpanded((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));

  const allShownSelected = shown.length > 0 && shown.every((row) => selected.includes(row.id));

  const clearFilters = useCallback(() => {
    setSearch('');
    setView('all');
    setChips([]);
    setFilters({
      year: yearOptions[0], category: categoryOptions[0], className: classOptions[0],
      section: sectionOptions[0], frequency: frequencyOptions[0], status: statusOptions[0],
      mode: modeOptions[0],
    });
    setPage(1);
    push('Filters cleared');
  }, [push]);

  const archiveSelected = useCallback(() => {
    setStructures((current) => current.filter((row) => !selected.includes(row.id)));
    push(`${selected.length} structure${selected.length === 1 ? '' : 's'} archived`);
    setSelected([]);
  }, [push, selected]);

  const removeSelected = useCallback(() => {
    const ids = selected.length > 0 ? selected : modalRow ? [modalRow.id] : [];
    setStructures((current) => current.filter((row) => !ids.includes(row.id)));
    setSelected([]);
    setActiveModal(null);
    push(`${ids.length} structure${ids.length === 1 ? '' : 's'} deleted`);
  }, [modalRow, push, selected]);

  /* ---------------------------------- Views --------------------------------- */

  const money = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  const quickActions: { id: FeeModalId | 'export'; label: string; icon: string; accent: string }[] = [
    { id: 'structure', label: 'Create Structure', icon: 'ti ti-layout-grid-add', accent: 'primary' },
    { id: 'invoice', label: 'Generate Invoices', icon: 'ti ti-file-invoice', accent: 'success' },
    { id: 'collect', label: 'Collect Payment', icon: 'ti ti-cash-register', accent: 'info' },
    { id: 'assign', label: 'Bulk Assign', icon: 'ti ti-users-plus', accent: 'purple' },
    { id: 'import', label: 'Import Structure', icon: 'ti ti-file-import', accent: 'warning' },
    { id: 'export', label: 'Export Reports', icon: 'ti ti-file-export', accent: 'teal' },
  ];

  const selectField = (
    label: string,
    key: keyof typeof filters,
    options: string[],
    ariaLabel: string,
  ) => (
    <label className="select-field">
      <span>{label}</span>
      <select
        aria-label={ariaLabel}
        value={filters[key]}
        onChange={(event) => setFilter(key, event.target.value)}
      >
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );

  const detailRow = (row: FeeStructure) => (
    <div className="row g-4 p-3">
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-calendar-repeat text-primary me-1" />Installment Schedule</h6>
        <ul className="list-unstyled fs-12 mb-0">
          {row.installments.map((item) => (
            <li className="d-flex align-items-center justify-content-between py-1 border-bottom" key={item.label}>
              <span>
                <b className="me-2">{item.label}</b>
                <span className="text-muted">{item.due}</span>
              </span>
              <span>
                <span className="fw-medium me-2">{item.amount}</span>
                <span className="status-chip soft">{item.state}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-alarm text-warning me-1" />Late Fee Rules</h6>
        <ul className="list-unstyled fs-12 text-muted mb-3">
          {row.lateFeeRules.map((rule) => (
            <li className="py-1" key={rule}><i className="ti ti-point me-1" />{rule}</li>
          ))}
        </ul>
        <h6 className="fs-14 mb-2"><i className="ti ti-school text-info me-1" />{row.scopeHeading}</h6>
        <div className="d-flex flex-wrap gap-1">
          {row.scopeItems.map((item) => (
            <span className="status-chip soft" key={item}>{item}</span>
          ))}
        </div>
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-discount text-purple me-1" />{row.discountHeading}</h6>
        <ul className="list-unstyled fs-12 text-muted mb-3">
          {row.discountRules.map((rule) => (
            <li className="py-1" key={rule}><i className="ti ti-point me-1" />{rule}</li>
          ))}
        </ul>
        <h6 className="fs-14 mb-2"><i className="ti ti-chart-line text-success me-1" />Collection Timeline</h6>
        <ul className="list-unstyled fs-12 mb-0">
          <li className="py-1">
            <b>{row.collected} collected</b>
            <span className="d-block text-muted">
              {row.studentsPaid.toLocaleString('en-IN')} of {row.assigned.toLocaleString('en-IN')} students paid
            </span>
          </li>
          <li className="py-1">
            <b>{row.pending} pending</b>
            <span className="d-block text-muted">{row.invoicesOutstanding} invoices outstanding</span>
          </li>
          <li className="py-1">
            <b>{row.overdue} overdue</b>
            <span className="d-block text-muted">
              {row.overdueAccounts > 0
                ? `${row.overdueAccounts} accounts past grace period`
                : 'Cycle closed · reconciled'}
            </span>
          </li>
        </ul>
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-receipt text-teal me-1" />Recent Payments</h6>
        {row.recentPayments.length === 0 ? (
          <p className="fs-12 text-muted mb-3">No payments recorded yet.</p>
        ) : (
          row.recentPayments.map((payment) => (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={payment.student}>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">{payment.student}</h6>
                <span className="fs-12 text-muted">{payment.meta}</span>
              </div>
              <span className="fw-semibold fs-13">{payment.amount}</span>
            </div>
          ))
        )}
        <div className="d-flex align-items-center justify-content-between mt-2">
          <span className="fs-12 text-muted">{row.footerNote}</span>
          <button
            type="button"
            className="toolbar-button toolbar-button-xs"
            onClick={() => openModal(row, 'remind')}
          >
            {row.footerAction}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Fees Master"
            section="Management"
            dashboardTo={routes.adminDashboard}
            actions={
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center mb-2"
                onClick={() => openModal(null, 'add')}
              >
                <i className="ti ti-square-rounded-plus me-2" />Add Fees Master
              </button>
            }
          />

          {loading ? (
            <div className="card">
              <div className="card-body">
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line skeleton-thin" />
                <div className="skeleton skeleton-line skeleton-thin" />
              </div>
            </div>
          ) : (
            <div className="live-flag">
              {/* ============ COMMAND HERO ============ */}
              <section className="command-bar" aria-label="Finance command center">
                <div className="command-bar-main">
                  <div className="command-bar-head">
                    <div>
                      <span className="eyebrow-text">
                        <i className="ti ti-building-bank" />Finance Command Center
                      </span>
                      <h3 className="command-bar-title">Fees Master</h3>
                      <div className="command-bar-meta">
                        <span className="choice-chip"><i className="ti ti-calendar" />{commandMeta.academicYear}</span>
                        <span className="choice-chip"><i className="ti ti-category" />{commandMeta.categoryCount}</span>
                        <span className="choice-chip"><i className="ti ti-stack-2" />{commandMeta.activeStructures}</span>
                        <span className="choice-chip warn">
                          <i className="ti ti-clock-hour-4" />{commandMeta.pendingApprovals}
                        </span>
                      </div>
                    </div>
                    <div className="command-bar-today">
                      <span className="live-flag-dot" />
                      <div>
                        <b>{money(commandMeta.collectedToday)}</b>
                        <span>Collected today · {commandMeta.receiptsToday} receipts</span>
                      </div>
                    </div>
                  </div>

                  <div className="summary-rail">
                    <div className="summary-rail-top">
                      <span>Collection vs target · this month</span>
                      <b>{commandMeta.targetPercent}%</b>
                    </div>
                    <div className="summary-rail-bar">
                      {commandMeta.segments.slice(0, 3).map((segment) => (
                        <span
                          className={`seg ${segment.id}`}
                          key={segment.id}
                          style={{ width: `${segment.width}%` }}
                          title={segment.label}
                        />
                      ))}
                      <i className="mk" style={{ left: `${commandMeta.targetPercent}%` }} title={`Target ${commandMeta.targetPercent}%`} />
                    </div>
                    <div className="summary-rail-keys">
                      {commandMeta.segments.map((segment) => (
                        <span className={segment.id} key={segment.id}><i />{segment.label}</span>
                      ))}
                    </div>
                  </div>

                  <div className="ai-panel">
                    <span className="ai-panel-orb"><i className="ti ti-sparkles" /></span>
                    <div className="ai-panel-body">
                      <div className="ai-panel-top">
                        <b>AI Financial Summary</b>
                        <span className="status-chip live">Live</span>
                      </div>
                      <p>
                        <mark>₹2.4M</mark> in fees collected this month across 1,284 invoices.{' '}
                        <mark>184 invoices</mark> remain pending and <mark>32 concessions</mark> await
                        approval. Collection performance is at <mark>96% of target</mark> — Grade VI-B and
                        IX-A are the two classes dragging the average down.
                      </p>
                      <div className="ai-panel-actions">
                        <button type="button" className="toolbar-button toolbar-button-xs" onClick={() => openModal(null, 'remind')}>
                          <i className="ti ti-bell" />Chase 184 invoices
                        </button>
                        <button type="button" className="toolbar-button toolbar-button-xs" onClick={() => openModal(null, 'approvals')}>
                          <i className="ti ti-checks" />Review 32 concessions
                        </button>
                        <button type="button" className="toolbar-button toolbar-button-xs" onClick={() => push('Forecast explained in the activity log')}>
                          <i className="ti ti-chart-dots" />Explain forecast
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <aside className="command-bar-side">
                  <div className="upload-block">
                    <div className="upload-block-head">
                      <b>Upcoming Collections</b><span>Next 30 days</span>
                    </div>
                    {upcomingCollections.map((item) => (
                      <div className={`upload-block-row accent-${item.accent}`} key={item.title}>
                        <span className="d"><b>{item.day}</b><span>{item.month}</span></span>
                        <div className="t"><b>{item.title}</b><span>{item.meta}</span></div>
                        <b className="v">{item.value}</b>
                      </div>
                    ))}
                  </div>

                  <div className="quick-actions">
                    <div className="quick-action-head"><b>Quick Actions</b></div>
                    <div className="quick-action-grid">
                      {quickActions.map((action) => (
                        <button
                          type="button"
                          className={`quick-action-item accent-${action.accent}`}
                          key={action.id}
                          onClick={() =>
                            action.id === 'export'
                              ? push('Reports exported')
                              : openModal(null, action.id as FeeModalId)
                          }
                        >
                          <span className="ic"><i className={action.icon} /></span>
                          <b>{action.label}</b>
                        </button>
                      ))}
                    </div>
                  </div>
                </aside>
              </section>

              {/* ============ SMART FILTER BAR ============ */}
              <section className="filter-bar" aria-label="Filters">
                <div className="view-toggle-group" role="group" aria-label="Saved views">
                  {savedViewDefs.map((definition) => (
                    <button
                      type="button"
                      className={`view-toggle${view === definition.id ? ' on' : ''}`}
                      key={definition.id}
                      aria-pressed={view === definition.id}
                      onClick={() => { setView(definition.id); setPage(1); }}
                    >
                      <i className={definition.icon} />{definition.label}<span>{definition.count}</span>
                    </button>
                  ))}
                  <button type="button" className="view-toggle add" onClick={() => push('Current view saved')}>
                    <i className="ti ti-plus" />Save current view
                  </button>
                </div>

                <div className="filter-row">
                  <div className="search-field">
                    <i className="ti ti-search" />
                    <input
                      type="search"
                      ref={searchRef}
                      placeholder="Search fee structures, categories, classes…"
                      aria-label="Search fee structures"
                      value={search}
                      onChange={(event) => { setSearch(event.target.value); setPage(1); }}
                    />
                    <kbd>/</kbd>
                  </div>
                  <div className="select-group">
                    {selectField('Year', 'year', yearOptions, 'Academic year')}
                    {selectField('Category', 'category', categoryOptions, 'Fee category')}
                    {selectField('Class', 'className', classOptions, 'Class')}
                    {selectField('Section', 'section', sectionOptions, 'Section')}
                    {selectField('Frequency', 'frequency', frequencyOptions, 'Frequency')}
                    {selectField('Status', 'status', statusOptions, 'Status')}
                    {selectField('Mode', 'mode', modeOptions, 'Payment mode')}
                    <button
                      type="button"
                      className="toolbar-button toolbar-button-sm"
                      onClick={() => openModal(null, 'advanced')}
                    >
                      <i className="ti ti-adjustments-alt" />More
                    </button>
                  </div>
                </div>

                <div className="chip-row">
                  <span className="sub-text">Applied</span>
                  {chips.map((chip) => (
                    <button
                      type="button"
                      className="filter-tag"
                      key={chip}
                      onClick={() => setChips((current) => current.filter((item) => item !== chip))}
                    >
                      {chip}<i className="ti ti-x" />
                    </button>
                  ))}
                  <button type="button" className="clear-button" onClick={clearFilters}>Clear all</button>
                </div>
              </section>

              {/* ============ FEE STRUCTURE CARDS ============ */}
              <div className="section-bar">
                <div>
                  <span className="eyebrow-text"><i className="ti ti-stack-2" />Workspace</span>
                  <h3 className="section-bar-title">Fee Structures</h3>
                </div>
                <span className="sub-text">Hover a card for actions</span>
              </div>

              <section className="card-grid" aria-label="Fee structures">
                {visible.map((row) => {
                  const percent = collectionPercentOf(row);
                  return (
                    <article className={`fee-record accent-${row.accent}`} key={row.id}>
                      <header className="fee-record-top">
                        <span className="avatar avatar-icon avatar-md avatar-accent-soft">
                          <i className={row.icon} />
                        </span>
                        <div className="fee-record-id">
                          <b>{row.name}</b>
                          <span>{row.subtitle}</span>
                        </div>
                        <span className={`status-chip ${statusChip[row.status]}`}>{row.status}</span>
                      </header>
                      <div className="fee-record-amount">
                        <b>{row.amount}</b><span>{row.cadence}</span>
                        <span className="status-chip soft">
                          {row.installmentCount} installment{row.installmentCount === 1 ? '' : 's'}
                        </span>
                      </div>
                      <dl className="fee-record-meta">
                        <div><dt>Due date</dt><dd>{row.dueDate}</dd></div>
                        <div><dt>Late fee</dt><dd>{row.lateFee}</dd></div>
                        <div><dt>Assigned</dt><dd>{row.assigned.toLocaleString('en-IN')} students</dd></div>
                        <div><dt>Concessions</dt><dd>{row.concessions}</dd></div>
                      </dl>
                      <div className="fee-record-progress">
                        <div className="fee-record-progress-top">
                          <span>Collection</span>
                          <b>{row.status === 'Draft' ? '—' : `${percent}%`}</b>
                        </div>
                        <div className="meter-bar"><span style={{ width: `${percent}%` }} /></div>
                        <div className="fee-record-progress-foot">
                          <span>{row.status === 'Draft' ? row.collected : `${row.collected} collected`}</span>
                          <span>{row.status === 'Draft' ? row.pending : `${row.pending} pending`}</span>
                        </div>
                      </div>
                      <footer className="fee-record-actions">
                        <button type="button" className="toolbar-icon-button" aria-label="Edit structure" title="Edit" onClick={() => openModal(row, 'structure')}>
                          <i className="ti ti-edit" />
                        </button>
                        <button type="button" className="toolbar-icon-button" aria-label="Generate invoices" title="Generate invoices" onClick={() => openModal(row, 'invoice')}>
                          <i className="ti ti-file-invoice" />
                        </button>
                        <button type="button" className="toolbar-icon-button" aria-label="Assign students" title="Assign students" onClick={() => openModal(row, 'assign')}>
                          <i className="ti ti-users-plus" />
                        </button>
                        <button type="button" className="toolbar-icon-button" aria-label="Duplicate" title="Duplicate" onClick={() => push(`${row.name} duplicated`)}>
                          <i className="ti ti-copy" />
                        </button>
                        <button
                          type="button"
                          className="toolbar-button toolbar-button-xs ms-auto"
                          onClick={() => { toggleExpand(row.id); push(`${row.name} opened`); }}
                        >
                          Open<i className="ti ti-chevron-right" />
                        </button>
                      </footer>
                    </article>
                  );
                })}
              </section>

              {/* ============ DETAIL TABLE ============ */}
              <section className="card mt-3">
                <div className="data-table">
                  <table className="table align-middle">
                    <caption className="visually-hidden">
                      Fee structures with category, classes, amounts and collection status
                    </caption>
                    <thead>
                      <tr>
                        <th className="dt-pin">
                          <input
                            type="checkbox"
                            className="dt-check"
                            aria-label="Select all structures"
                            checked={allShownSelected}
                            onChange={() =>
                              setSelected((current) =>
                                allShownSelected
                                  ? current.filter((id) => !shown.some((row) => row.id === id))
                                  : Array.from(new Set([...current, ...shown.map((row) => row.id)])),
                              )
                            }
                          />
                        </th>
                        <th>Fee Structure</th>
                        <th>Category</th>
                        <th>Applicable Classes</th>
                        <th className="text-center">Inst.</th>
                        <th className="text-end">Amount</th>
                        <th className="text-end">Students</th>
                        <th className="text-end">Collected</th>
                        <th className="text-end">Pending</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shown.map((row) => {
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
                                  onChange={() => toggleSelect(row.id)}
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-link p-0 border-0 text-reset text-start"
                                  onClick={() => toggleExpand(row.id)}
                                  aria-expanded={open}
                                >
                                  <span className="d-block fw-medium">{row.name}</span>
                                  <span className="fs-12 text-muted">{row.code} · {row.frequency}</span>
                                </button>
                              </td>
                              <td>{row.category}</td>
                              <td>
                                <span className="d-block fs-13">{row.applicableClasses}</span>
                                <span className="fs-12 text-muted">{row.applicableNote}</span>
                              </td>
                              <td className="text-center">{row.installmentCount}</td>
                              <td className="text-end fw-medium">{row.amount}</td>
                              <td className="text-end">{row.assigned.toLocaleString('en-IN')}</td>
                              <td className="text-end">{row.collected}</td>
                              <td className="text-end">{row.pending}</td>
                              <td>
                                <span className="d-block fs-13">{row.dueDate}</span>
                                <span className="fs-12 text-muted">{row.dueNote}</span>
                              </td>
                              <td><span className={`status-chip ${statusChip[row.status]}`}>{row.status}</span></td>
                              <td className="text-end">
                                <div className="dt-actions justify-content-end">
                                  <button type="button" className="toolbar-icon-button" aria-label="Edit structure" onClick={() => openModal(row, 'structure')}>
                                    <i className="ti ti-edit" />
                                  </button>
                                  <button type="button" className="toolbar-icon-button" aria-label="Collect payment" onClick={() => openModal(row, 'collect')}>
                                    <i className="ti ti-cash-register" />
                                  </button>
                                  <button type="button" className="toolbar-icon-button" aria-label="Delete structure" onClick={() => openModal(row, 'delete')}>
                                    <i className="ti ti-trash" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {open ? (
                              <tr className="dt-detail open">
                                <td colSpan={12} className="p-0">{detailRow(row)}</td>
                              </tr>
                            ) : null}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="workspace-footer">
                  <div className="workspace-footer-info">
                    Showing {rangeStart}–{rangeEnd} of {visible.length} structures
                  </div>
                  <div className="workspace-footer-size">
                    <label className="mb-0" htmlFor="fcc-rows">Rows</label>
                    <select
                      className="form-select"
                      id="fcc-rows"
                      aria-label="Rows per page"
                      value={pageSize}
                      onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }}
                    >
                      {pageSizes.map((size) => <option value={size} key={size}>{size}</option>)}
                    </select>
                  </div>
                  <nav className="workspace-pagination" aria-label="Fee structure pagination">
                    <button
                      type="button"
                      className="workspace-page-button"
                      aria-label="Previous page"
                      disabled={currentPage === 1}
                      onClick={() => setPage(Math.max(1, currentPage - 1))}
                    >
                      <i className="ti ti-chevron-left" />
                    </button>
                    <span className="workspace-page-numbers">
                      {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                        <button
                          type="button"
                          className={`workspace-page-button${number === currentPage ? ' active' : ''}`}
                          aria-current={number === currentPage ? 'page' : undefined}
                          key={number}
                          onClick={() => setPage(number)}
                        >
                          {number}
                        </button>
                      ))}
                    </span>
                    <button
                      type="button"
                      className="workspace-page-button"
                      aria-label="Next page"
                      disabled={currentPage === pageCount}
                      onClick={() => setPage(Math.min(pageCount, currentPage + 1))}
                    >
                      <i className="ti ti-chevron-right" />
                    </button>
                  </nav>
                </div>
              </section>

              {/* ============ LIVE FINANCE FEED ============ */}
              <div className="section-bar">
                <div>
                  <span className="eyebrow-text"><i className="ti ti-activity" />Operations</span>
                  <h3 className="section-bar-title">Live Finance Feed</h3>
                </div>
                <span className="sub-text">Updated a moment ago</span>
              </div>

              <section className="feed-list">
                <div className="side-panel">
                  <div className="side-panel-head">
                    <b><i className="ti ti-timeline" />Payment Timeline</b>
                    <button type="button" className="toolbar-button toolbar-button-xs" onClick={() => push('Timeline exported')}>
                      Export
                    </button>
                  </div>
                  <div className="timeline-rows">
                    {paymentTimeline.map((event) => (
                      <div className={`timeline-row-item accent-${event.accent}`} key={event.title}>
                        <span className="tm">{event.time}</span>
                        <span className="pt" />
                        <div className="bd"><b>{event.title}</b><p>{event.detail}</p></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="side-panel">
                  <div className="side-panel-head">
                    <b><i className="ti ti-history" />Recent Activity</b>
                    <button type="button" className="toolbar-button toolbar-button-xs" onClick={() => push('Opening the full audit log')}>
                      Full log
                    </button>
                  </div>
                  <div className="action-group">
                    {recentActivity.map((entry) => (
                      <div className="action-link" key={entry.actor}>
                        <ImageWithBasePath src={entry.avatar} alt={entry.actor} />
                        <div className="bd">
                          <b>{entry.actor}</b> {entry.action} <b>{entry.subject}</b>
                          <em>{entry.time}</em>
                        </div>
                        <span className={`status-chip ${entry.chipClass}`}>{entry.chip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="side-panel">
                  <div className="side-panel-head">
                    <b><i className="ti ti-bell" />Smart Notifications</b>
                    <button type="button" className="toolbar-button toolbar-button-xs" onClick={() => push('All notifications marked read')}>
                      Mark all read
                    </button>
                  </div>
                  <div className="notification-row mb-0">
                    {notifications.map((group) => (
                      <div className="notification-group" key={group.label}>
                        <span className="lbl">{group.label}</span>
                        {group.items.map((item) => (
                          <div className={`note-tag accent-${item.accent}`} key={item.title}>
                            <span className="ic"><i className={item.icon} /></span>
                            <div className="bd"><b>{item.title}</b><p>{item.detail}</p></div>
                            <span className={`status-chip ${item.chipClass}`}>{item.chip}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* ============ STICKY BULK TOOLBAR ============ */}
          <div className="bulk-bar" role="region" aria-label="Bulk actions" hidden={selected.length === 0}>
            <div className="bulk-bar-inner">
              <span className="bulk-bar-count"><b>{selected.length}</b> selected</span>
              <div className="bulk-bar-actions">
                <button type="button" className="toolbar-button toolbar-button-sm" onClick={() => openModal(null, 'assign')}>
                  <i className="ti ti-users-plus" />Assign Fees
                </button>
                <button type="button" className="toolbar-button toolbar-button-sm" onClick={() => openModal(null, 'bulkamount')}>
                  <i className="ti ti-currency-rupee" />Update Amount
                </button>
                <button type="button" className="toolbar-button toolbar-button-sm" onClick={() => openModal(null, 'invoice')}>
                  <i className="ti ti-file-invoice" />Generate Invoices
                </button>
                <button type="button" className="toolbar-button toolbar-button-sm" onClick={() => openModal(null, 'remind')}>
                  <i className="ti ti-bell" />Notify
                </button>
                <button type="button" className="toolbar-button toolbar-button-sm" onClick={() => push(`${selected.length} structures exported`)}>
                  <i className="ti ti-file-export" />Export
                </button>
                <button type="button" className="toolbar-button toolbar-button-sm" onClick={archiveSelected}>
                  <i className="ti ti-archive" />Archive
                </button>
                <button type="button" className="toolbar-button toolbar-button-sm text-danger" onClick={() => openModal(null, 'delete')}>
                  <i className="ti ti-trash" />Delete
                </button>
              </div>
              <button
                type="button"
                className="bulk-bar-close"
                aria-label="Clear selection"
                onClick={() => setSelected([])}
              >
                <i className="ti ti-x" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        open={activeModal === 'structure' || activeModal === 'add'}
        onClose={() => setActiveModal(null)}
        title={activeModal === 'add' ? 'Add Fees Master' : 'Fee Structure'}
        dialogClassName="modal-lg"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Fee structure saved'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Structure</button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="fm-name">Structure Name</label>
            <input type="text" className="form-control" id="fm-name" defaultValue={modalRow?.name ?? ''} placeholder="Term II Tuition Fee" />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="fm-category">Category</label>
            <select className="form-select" id="fm-category" defaultValue={modalRow?.category ?? categoryOptions[1]}>
              {categoryOptions.slice(1).map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="fm-amount">Amount per Student</label>
            <input type="text" className="form-control" id="fm-amount" defaultValue={modalRow?.amount ?? ''} placeholder="₹15,000" />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="fm-frequency">Frequency</label>
            <select className="form-select" id="fm-frequency" defaultValue={frequencyOptions[1]}>
              {frequencyOptions.slice(1).map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="fm-due">Due Date</label>
            <input type="text" className="form-control" id="fm-due" defaultValue={modalRow?.dueDate ?? ''} placeholder="25-12-2024" />
          </div></div>
          <div className="col-md-6"><div className="mb-0">
            <label className="form-label" htmlFor="fm-installments">Installments</label>
            <input type="text" className="form-control" id="fm-installments" defaultValue={modalRow ? String(modalRow.installmentCount) : '1'} />
          </div></div>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'invoice'}
        onClose={() => setActiveModal(null)}
        title="Generate Invoices"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Invoices generated'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Generate Invoices</button>
          </>
        }
      >
        <p className="fs-13 mb-3">
          {modalRow
            ? `Generate invoices for ${modalRow.name} — ${modalRow.assigned.toLocaleString('en-IN')} students assigned.`
            : `Generate invoices for ${selected.length || 'the selected'} structures.`}
        </p>
        <div className="mb-0">
          <label className="form-label" htmlFor="fm-inv-date">Invoice Date</label>
          <input type="text" className="form-control" id="fm-inv-date" placeholder="22-12-2024" />
        </div>
      </Modal>

      <Modal
        open={activeModal === 'collect'}
        onClose={() => setActiveModal(null)}
        title="Collect Payment"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Payment collected'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Collect Payment</button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="fm-collect-amount">Amount</label>
            <input type="text" className="form-control" id="fm-collect-amount" defaultValue={modalRow?.amount ?? ''} placeholder="₹0" />
          </div></div>
          <div className="col-md-6"><div className="mb-0">
            <label className="form-label" htmlFor="fm-collect-mode">Payment Mode</label>
            <select className="form-select" id="fm-collect-mode" defaultValue={modeOptions[1]}>
              {modeOptions.slice(1).map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'assign'}
        onClose={() => setActiveModal(null)}
        title="Bulk Assign Fees"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Fees assigned'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Assign Fees</button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="fm-assign-class">Class</label>
            <select className="form-select" id="fm-assign-class" defaultValue={classOptions[1]}>
              {classOptions.slice(1).map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-0">
            <label className="form-label" htmlFor="fm-assign-section">Section</label>
            <select className="form-select" id="fm-assign-section" defaultValue={sectionOptions[0]}>
              {sectionOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'bulkamount'}
        onClose={() => setActiveModal(null)}
        title="Bulk Update Amount"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push(`${selected.length} structures updated`); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Update Amount</button>
          </>
        }
      >
        <p className="fs-13 mb-3">Applies to {selected.length} selected structure{selected.length === 1 ? '' : 's'}.</p>
        <div className="mb-0">
          <label className="form-label" htmlFor="fm-bulk-amount">New Amount</label>
          <input type="text" className="form-control" id="fm-bulk-amount" placeholder="₹0" />
        </div>
      </Modal>

      <Modal
        open={activeModal === 'remind'}
        onClose={() => setActiveModal(null)}
        title="Send Payment Reminders"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Reminders sent'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary"><i className="ti ti-bell me-1" />Send Reminders</button>
          </>
        }
      >
        <p className="fs-13 mb-3">
          {modalRow
            ? `${modalRow.invoicesOutstanding} invoices outstanding on ${modalRow.name}.`
            : '184 invoices remain pending across all structures.'}
        </p>
        <div className="mb-0">
          <label className="form-label" htmlFor="fm-remind-channel">Channel</label>
          <select className="form-select" id="fm-remind-channel" defaultValue="SMS + Email">
            <option>SMS + Email</option>
            <option>SMS</option>
            <option>Email</option>
          </select>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'approvals'}
        onClose={() => setActiveModal(null)}
        title="Pending Concession Approvals"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => { setActiveModal(null); push('32 concessions approved'); }}>
              <i className="ti ti-checks me-1" />Approve All
            </button>
          </>
        }
      >
        <p className="fs-13 mb-3">
          32 concession requests totalling ₹3.8L. The oldest has been waiting 6 days.
        </p>
        <ul className="list-unstyled mb-0">
          <li className="d-flex justify-content-between py-2 border-bottom fs-13">
            <span>Merit scholarship — 15%</span><span className="text-muted">9 requests</span>
          </li>
          <li className="d-flex justify-content-between py-2 border-bottom fs-13">
            <span>Staff ward — 25%</span><span className="text-muted">12 requests</span>
          </li>
          <li className="d-flex justify-content-between py-2 fs-13">
            <span>Sibling discount — 5%</span><span className="text-muted">11 requests</span>
          </li>
        </ul>
      </Modal>

      <Modal
        open={activeModal === 'import'}
        onClose={() => setActiveModal(null)}
        title="Import Fee Structure"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Structures imported'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Import</button>
          </>
        }
      >
        <div className="mb-0">
          <label className="form-label" htmlFor="fm-import">CSV File</label>
          <input type="file" className="form-control" id="fm-import" accept=".csv" />
        </div>
      </Modal>

      <Modal
        open={activeModal === 'advanced'}
        onClose={() => setActiveModal(null)}
        title="Advanced Filters"
        dialogClassName="modal-lg"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Advanced filters applied'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Apply Filters</button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="fm-adv-scholarship">Scholarship</label>
            <select className="form-select" id="fm-adv-scholarship" defaultValue="Included">
              <option>Included</option><option>Excluded</option><option>Only scholarship holders</option>
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="fm-adv-overdue">Overdue Accounts</label>
            <select className="form-select" id="fm-adv-overdue" defaultValue="Any">
              <option>Any</option><option>More than 10</option><option>More than 25</option>
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="fm-adv-from">Due From</label>
            <input type="text" className="form-control" id="fm-adv-from" placeholder="01-12-2024" />
          </div></div>
          <div className="col-md-6"><div className="mb-0">
            <label className="form-label" htmlFor="fm-adv-to">Due To</label>
            <input type="text" className="form-control" id="fm-adv-to" placeholder="31-01-2025" />
          </div></div>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'delete'}
        onClose={() => setActiveModal(null)}
        title="Delete Fee Structure"
        onSubmit={(e) => { e.preventDefault(); removeSelected(); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-danger">Yes, Delete</button>
          </>
        }
      >
        <p className="fs-13 mb-0">
          {selected.length > 0
            ? `Delete ${selected.length} selected structures? Assigned students keep their existing invoices.`
            : `Delete ${modalRow?.name}? ${modalRow ? studentsPendingOf(modalRow) : 0} students still have pending invoices.`}
        </p>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="fmToasts" />
    </>
  );
};

export default FeesMaster;
