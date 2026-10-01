import { useCallback, useMemo, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink, ExportMenu, PageHeader, WorkspaceShell, useWorkspace,
} from '@components/workspace';
import type {
  ColumnDef, ExportFormat, FilterField, QuickFilter, SavedView, SortOption, SummaryItem,
  WorkspaceMenu,
} from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import TemplateModals from './modals/TemplateModals';
import type {
  DuplicatePayload, SubmitPayload, TemplateDraft, TemplateModalId,
} from './modals/TemplateModals';
import type { Category, Encoding, Route, SmsTemplate } from './data/templates.data';
import {
  REGISTER_DATE, TOTAL_COUNT, authorOptions, categoryBadge, categoryIcon, categoryOptions,
  costPerSendOf, dateKey, detailPairsOf, encodingOptions, expandOf, fieldCountOf, fieldsOf,
  isMultiSegment, isUsable, lastUsedLabelOf, lengthOf, money, registrationPairsOf, remainingOf,
  routeBadge, routeOptions, searchIndexOf, senderOptions, statusBadge, statusOf, statusOptions,
  statusPill, statusSubLabelOf, templateSegmentsOf, templates as initialRows, usagePairsOf,
} from './data/templates.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'category', label: 'Category', kind: 'select', chipLabel: 'Category', options: categoryOptions },
  { id: 'route', label: 'Route Type', kind: 'select', chipLabel: 'Route', options: routeOptions },
  { id: 'status', label: 'Registration', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'sender', label: 'Sender ID', kind: 'select', chipLabel: 'Sender', options: senderOptions },
  { id: 'encoding', label: 'Encoding', kind: 'select', chipLabel: 'Encoding', options: encodingOptions },
  { id: 'author', label: 'Last Edited By', kind: 'select', chipLabel: 'Editor', options: authorOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Template name (A–Z)', icon: 'ti ti-abc' },
  { id: 'category', label: 'Category', icon: 'ti ti-tag' },
  { id: 'length', label: 'Longest message', icon: 'ti ti-ruler-measure' },
  { id: 'uses', label: 'Most used', icon: 'ti ti-send' },
  { id: 'updated', label: 'Recently edited', icon: 'ti ti-clock' },
];

const isPending = (row: SmsTemplate) => statusOf(row) === 'Pending registration';
const isRejected = (row: SmsTemplate) => statusOf(row) === 'Rejected';
const isDraft = (row: SmsTemplate) => statusOf(row) === 'Draft';
const isPromotional = (row: SmsTemplate) => row.route === 'Promotional';

const SmsTemplatesPage = () => {
  const [rows, setRows] = useState<SmsTemplate[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<TemplateModalId | null>(null);
  const [modalRow, setModalRow] = useState<SmsTemplate | null>(null);
  const [panelRow, setPanelRow] = useState<SmsTemplate | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: SmsTemplate | null, modal: TemplateModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: SmsTemplate) => SmsTemplate, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<SmsTemplate>[]>(
    () => [
      {
        id: 'template',
        label: 'Template',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="avatar avatar-md bg-primary-transparent text-primary rounded flex-shrink-0 me-2">
              <i className={categoryIcon[row.category]} />
            </span>
            <div className="overflow-hidden">
              <ActionLink className="dt-name" onClick={() => setPanelRow(row)}>{row.name}</ActionLink>
              <div className="dt-sub text-truncate">{row.id} · {row.senderId}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'category',
        label: 'Category',
        sortable: true,
        render: (row) => <span className={categoryBadge[row.category]}>{row.category}</span>,
      },
      {
        id: 'body',
        label: 'Message',
        render: (row) => (
          <>
            <span className="d-block fs-13">{row.body.slice(0, 64)}…</span>
            <span className="fs-12 text-muted d-block">
              {fieldCountOf(row)} merge field{fieldCountOf(row) === 1 ? '' : 's'}
            </span>
          </>
        ),
      },
      {
        id: 'length',
        label: 'Length',
        sortable: true,
        render: (row) => (
          <>
            {/* Counted at the longest merge expansion. */}
            <span className="d-block fs-13 text-nowrap">{lengthOf(row)} chars</span>
            <span className={`fs-12 text-nowrap ${isMultiSegment(row) ? 'text-warning' : 'text-muted'}`}>
              {templateSegmentsOf(row)} segment{templateSegmentsOf(row) === 1 ? '' : 's'} ·{' '}
              {money(costPerSendOf(row))}
            </span>
          </>
        ),
      },
      {
        id: 'route',
        label: 'Route',
        sortable: true,
        render: (row) => (
          <>
            <span className={routeBadge[row.route]}>{row.route}</span>
            <span className="d-block fs-12 text-muted mt-1">{row.encoding}</span>
          </>
        ),
      },
      {
        id: 'uses',
        label: 'Sends',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13">{row.uses.toLocaleString()}</span>
            <span className="fs-12 text-muted text-nowrap">{lastUsedLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'updated',
        label: 'Last Edited',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.updatedOn}</span>
            <span className="fs-12 text-muted text-nowrap">{row.updatedBy}</span>
          </>
        ),
      },
      {
        id: 'status',
        label: 'Registration',
        render: (row) => (
          <>
            <span className={`dt-pill ${statusPill[statusOf(row)]}`}>
              <span className="dt-pill-dot" />{statusOf(row)}
            </span>
            <span className="d-block fs-12 text-muted mt-1">{statusSubLabelOf(row)}</span>
          </>
        ),
      },
    ],
    [],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<SmsTemplate>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.category && row.category !== filters.category) return false;
      if (filters.route && row.route !== filters.route) return false;
      if (filters.status && statusOf(row) !== filters.status) return false;
      if (filters.sender && row.senderId !== filters.sender) return false;
      if (filters.encoding && row.encoding !== filters.encoding) return false;
      if (filters.author && row.updatedBy !== filters.author) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'approved') return isUsable(row);
      if (quick === 'pending') return isPending(row);
      if (quick === 'rejected') return isRejected(row) || isDraft(row);
      if (quick === 'multi') return isMultiSegment(row);
      return isPromotional(row);
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'approved': return isUsable(row);
        case 'pending': return isPending(row) || isDraft(row);
        case 'attention': return isRejected(row) || isMultiSegment(row);
        case 'popular': return row.uses >= 100;
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'category':
          return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
        case 'length':
          return lengthOf(b) - lengthOf(a) || a.name.localeCompare(b.name);
        case 'uses':
          return b.uses - a.uses || a.name.localeCompare(b.name);
        case 'updated':
          return dateKey(b.updatedOn) - dateKey(a.updatedOn) || a.name.localeCompare(b.name);
        case 'body':
        case 'route':
        case 'status':
          return statusOf(a).localeCompare(statusOf(b)) || a.name.localeCompare(b.name);
        case 'template':
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    },
    defaultSort: 'name',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: SmsTemplate) => boolean) => rows.filter(test).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Templates', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'approved', label: 'Registered', icon: 'ti ti-circle-check', count: countBy(isUsable) },
      {
        id: 'pending', label: 'Awaiting Registration', icon: 'ti ti-hourglass',
        count: countBy((row) => isPending(row) || isDraft(row)),
      },
      {
        id: 'attention', label: 'Needs Attention', icon: 'ti ti-alert-triangle',
        count: countBy((row) => isRejected(row) || isMultiSegment(row)),
      },
      { id: 'popular', label: 'Most Used', icon: 'ti ti-send', count: countBy((row) => row.uses >= 100) },
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'approved', label: 'Registered', icon: 'ti ti-circle-check', count: countBy(isUsable) },
      { id: 'pending', label: 'Pending', icon: 'ti ti-hourglass', count: countBy(isPending) },
      {
        id: 'rejected', label: 'Not Usable', icon: 'ti ti-ban',
        count: countBy((row) => isRejected(row) || isDraft(row)),
      },
      {
        id: 'multi', label: 'Multi-segment', icon: 'ti ti-ruler-measure',
        count: countBy(isMultiSegment),
      },
      { id: 'promo', label: 'Promotional', icon: 'ti ti-speakerphone', count: countBy(isPromotional) },
    ],
    [countBy, rows.length],
  );

  const summary = useMemo<SummaryItem[]>(() => {
    const sends = rows.reduce((total, row) => total + row.uses, 0);
    const multi = countBy(isMultiSegment);
    return [
      {
        id: 'total', tint: 'primary', icon: 'ti ti-template', label: 'Templates',
        value: String(rows.length), hint: `as at ${REGISTER_DATE}`,
      },
      {
        id: 'registered', tint: 'success', icon: 'ti ti-circle-check', label: 'Registered',
        value: String(countBy(isUsable)), hint: 'usable at the gateway',
      },
      {
        id: 'pending', tint: 'warning', icon: 'ti ti-hourglass', label: 'Awaiting Operator',
        value: String(countBy((row) => isPending(row) || isDraft(row))),
        hint: 'cannot be sent from yet',
      },
      {
        id: 'multi', tint: 'info', icon: 'ti ti-ruler-measure', label: 'Multi-segment',
        value: String(multi), hint: 'billed twice per recipient',
      },
      {
        id: 'sends', tint: 'purple', icon: 'ti ti-send', label: 'Sends This Year',
        value: sends.toLocaleString(), hint: 'across every template',
      },
    ];
  }, [countBy, rows]);

  /* -------------------------------- Mutations ------------------------------- */

  const createTemplate = useCallback(
    (draft: TemplateDraft) => {
      if (!draft.name.trim() || !draft.body.trim()) {
        push('A template needs a name and a body', 'warning');
        return;
      }
      const id = `TPL-0${13 + rows.length}`;
      setRows((current) => [
        {
          id,
          name: draft.name.trim(),
          category: draft.category as Category,
          body: draft.body.trim(),
          route: draft.route as Route,
          encoding: draft.encoding as Encoding,
          senderId: draft.senderId,
          // A new template is a draft until it is submitted.
          submittedOn: '', approvedOn: '', rejectedReason: '',
          updatedOn: REGISTER_DATE, updatedBy: authorOptions[0],
          uses: 0, lastUsed: '', shared: draft.shared,
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} saved as a draft — submit it for registration to send from it`);
    },
    [push, rows.length],
  );

  const updateTemplate = useCallback(
    (draft: TemplateDraft) => {
      const wasApproved = modalRow ? statusOf(modalRow) === 'Approved' : false;
      patchRow(
        (row) => ({
          ...row,
          name: draft.name.trim() || row.name,
          category: draft.category as Category,
          body: draft.body.trim() || row.body,
          route: draft.route as Route,
          encoding: draft.encoding as Encoding,
          senderId: draft.senderId,
          shared: draft.shared,
          updatedOn: REGISTER_DATE,
          updatedBy: authorOptions[0],
          // An edit withdraws the registration, as the gateway does.
          approvedOn: '',
          submittedOn: wasApproved ? REGISTER_DATE : row.submittedOn,
          rejectedReason: '',
        }),
        wasApproved
          ? `${modalRow?.name ?? 'Template'} updated and resubmitted for registration`
          : `${modalRow?.name ?? 'Template'} updated`,
      );
    },
    [modalRow, patchRow],
  );

  const submitForApproval = useCallback(
    (payload: SubmitPayload) =>
      patchRow(
        (row) => ({
          ...row,
          submittedOn: REGISTER_DATE,
          approvedOn: '',
          rejectedReason: '',
        }),
        payload.notify
          ? `${modalRow?.name ?? 'Template'} submitted — you will be told when it is registered`
          : `${modalRow?.name ?? 'Template'} submitted to the operator`,
      ),
    [modalRow, patchRow],
  );

  const duplicateTemplate = useCallback(
    (payload: DuplicatePayload) => {
      if (!modalRow) return;
      const id = `TPL-0${13 + rows.length}`;
      setRows((current) => [
        {
          ...modalRow,
          id,
          name: payload.name.trim() || `${modalRow.name} (copy)`,
          route: payload.copyRoute ? modalRow.route : 'Transactional',
          senderId: payload.copyRoute ? modalRow.senderId : senderOptions[0],
          // A registration never carries over to a copy.
          submittedOn: payload.submitNow ? REGISTER_DATE : '',
          approvedOn: '', rejectedReason: '',
          updatedOn: REGISTER_DATE, updatedBy: authorOptions[0],
          uses: 0, lastUsed: '',
        },
        ...current,
      ]);
      setActiveModal(null);
      push(
        payload.submitNow
          ? `${id} created and submitted for registration`
          : `${id} created as a draft`,
      );
    },
    [modalRow, push, rows.length],
  );

  const deleteTemplate = useCallback(() => {
    if (!modalRow) return;
    setRows((current) => current.filter((row) => row.id !== modalRow.id));
    setActiveModal(null);
    push(`${modalRow.name} deleted`);
  }, [modalRow, push]);

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} templates exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: SmsTemplate) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="Preview template" onClick={() => openModal(row, 'preview')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit template" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Duplicate template" onClick={() => openModal(row, 'duplicate')}>
        <i className="ti ti-copy" />
      </ActionLink>
      {/* Only an unregistered template can be submitted. */}
      {!isUsable(row) && !isPending(row) ? (
        <ActionLink className="dt-ib success" ariaLabel="Submit for registration" onClick={() => openModal(row, 'submit')}>
          <i className="ti ti-send" />
        </ActionLink>
      ) : null}
      <ActionLink className="dt-ib danger" ariaLabel="Delete template" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash-x" />
      </ActionLink>
    </div>
  );

  const pairList = (pairs: { label: string; value: string }[]) =>
    pairs.map((pair, index) => (
      <div
        className={`d-flex align-items-center justify-content-between ${index === pairs.length - 1 ? 'mb-0' : 'mb-2'}`}
        key={pair.label}
      >
        <span className="fs-13 text-muted">{pair.label}</span>
        <span className="fs-13 fw-medium text-end">{pair.value}</span>
      </div>
    ));

  const renderDetail = (row: SmsTemplate) => (
    <div className="row g-4">
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-template text-primary me-1" />Template Details</h6>
        {pairList(detailPairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-ruler-measure text-info me-1" />Length &amp; Cost</h6>
        {pairList(usagePairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-braces text-purple me-1" />Merge Fields</h6>
        {fieldsOf(row).length === 0 ? (
          <p className="fs-13 text-muted mb-0">No merge fields — every recipient gets the same words.</p>
        ) : (
          <div className="d-flex flex-wrap gap-2">
            {fieldsOf(row).map((token) => (
              <span className="badge badge-soft-secondary" key={token}>{token}</span>
            ))}
          </div>
        )}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-stamp text-success me-1" />Registration</h6>
        {pairList(registrationPairsOf(row))}
      </div>
      <div className="col-12 col-xl-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-message-2 text-secondary me-1" />As stored</h6>
        <div className="border rounded p-2 mb-2"><p className="fs-13 mb-0">{row.body}</p></div>
      </div>
      <div className="col-12 col-xl-6">
        <h6 className="fs-14 mb-3">
          <i className="ti ti-device-mobile text-primary me-1" />As one recipient sees it
        </h6>
        <div className="border rounded p-3">
          <span className="fs-12 text-muted d-block mb-2">{row.senderId} SMS · today</span>
          {/* Resolved at the longest values on record. */}
          <p className="fs-13 mb-2">{expandOf(row.body)}</p>
          <span className="fs-12 text-muted">
            {lengthOf(row)} characters · {templateSegmentsOf(row)} segment
            {templateSegmentsOf(row) === 1 ? '' : 's'} · {remainingOf(row)} left in the last
          </span>
        </div>
        <div className="d-flex align-items-center flex-wrap gap-2 mt-3">
          {isUsable(row) ? (
            <button
              type="button" className="btn btn-primary btn-sm"
              onClick={() => openModal(row, 'duplicate')}
            >
              <i className="ti ti-copy me-1" />Duplicate
            </button>
          ) : (
            <button
              type="button" className="btn btn-primary btn-sm"
              onClick={() => openModal(row, 'submit')}
            >
              <i className="ti ti-send me-1" />Submit for registration
            </button>
          )}
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => openModal(row, 'edit')}
          >
            <i className="ti ti-edit me-1" />Edit
          </button>
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => setPanelRow(row)}
          >
            <i className="ti ti-layout-sidebar-right-expand me-1" />Template Panel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="SMS Templates"
            section="Communication"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <ExportMenu printLabel="Print Template Library" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'create')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Create Template
                  </ActionLink>
                </div>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={TOTAL_COUNT - initialRows.length + rows.length}
            summary={summary}
            footerVariant="card-foot"
            pageSizeOptions={[8, 25, 50, 100]}
            footerInfoSuffix={`library as at ${REGISTER_DATE}`}
            workspaceId="tplWorkspace"
            searchPlaceholder="Search template, category or wording…"
            searchLabel="Search SMS templates"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="templates"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Template library refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-template-off"
            emptyTitle="No templates match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Template panel */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title={panelRow ? panelRow.name : 'Template'}
            labelledById="tpl_panel_lbl"
          >
            {panelRow ? (
              <>
                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                  <span className={categoryBadge[panelRow.category]}>{panelRow.category}</span>
                  <span className={routeBadge[panelRow.route]}>{panelRow.route}</span>
                  <span className={statusBadge[statusOf(panelRow)]}>{statusOf(panelRow)}</span>
                </div>
                <p className="fs-12 text-muted mb-3">{statusSubLabelOf(panelRow)}</p>

                <h6 className="fs-14 mb-2">As stored</h6>
                <div className="border rounded p-2 mb-3"><p className="fs-13 mb-0">{panelRow.body}</p></div>

                <h6 className="fs-14 mb-2">As one recipient sees it</h6>
                <div className="border rounded p-3 mb-3">
                  <span className="fs-12 text-muted d-block mb-2">{panelRow.senderId} SMS · today</span>
                  <p className="fs-13 mb-0">{expandOf(panelRow.body)}</p>
                </div>

                <h6 className="fs-14 mb-2">Template Details</h6>
                <div className="border rounded p-3 mb-3">{pairList(detailPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Length &amp; Cost</h6>
                <div className="border rounded p-3 mb-3">{pairList(usagePairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Registration</h6>
                <div className="border rounded p-3 mb-3">{pairList(registrationPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Merge Fields</h6>
                {fieldsOf(panelRow).length === 0 ? (
                  <p className="fs-13 text-muted mb-3">None — every recipient gets the same words.</p>
                ) : (
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {fieldsOf(panelRow).map((token) => (
                      <span className="badge badge-soft-secondary" key={token}>{token}</span>
                    ))}
                  </div>
                )}

                <div className="d-flex align-items-center flex-wrap gap-2">
                  <button
                    type="button" className="btn btn-primary btn-sm"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'edit'); }}
                  >
                    <i className="ti ti-edit me-1" />Edit
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white btn-sm"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'duplicate'); }}
                  >
                    <i className="ti ti-copy me-1" />Duplicate
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <TemplateModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onCreate={createTemplate}
        onUpdate={updateTemplate}
        onSubmitForApproval={submitForApproval}
        onDuplicate={duplicateTemplate}
        onDelete={deleteTemplate}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="tplToasts" />
    </>
  );
};

export default SmsTemplatesPage;
