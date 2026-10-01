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
import type { ButtonKind, Category, WhatsappTemplate } from './data/templates.data';
import {
  REGISTER_DATE, TOTAL_COUNT, authorOptions, buttonOptions, categoryBadge, categoryOptions,
  dateKey, detailPairsOf, isAtRisk, isMultilingual, isUsable, languageOptions, lastUsedLabelOf,
  qualityBadge, qualityOptions, reviewAgeOf, reviewPairsOf, searchIndexOf, stateBadge, stateIcon,
  stateOf, stateOptions, statePill, statusSubLabelOf, templates as initialRows, usagePairsOf,
  variablesOf,
} from './data/templates.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'category', label: 'Category', kind: 'select', chipLabel: 'Category', options: categoryOptions },
  { id: 'state', label: 'Review State', kind: 'select', chipLabel: 'State', options: stateOptions },
  { id: 'quality', label: 'Quality Rating', kind: 'select', chipLabel: 'Quality', options: qualityOptions },
  { id: 'language', label: 'Language', kind: 'select', chipLabel: 'Language', options: languageOptions },
  { id: 'button', label: 'Button', kind: 'select', chipLabel: 'Button', options: buttonOptions },
  { id: 'author', label: 'Last Edited By', kind: 'select', chipLabel: 'Editor', options: authorOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Template name (A–Z)', icon: 'ti ti-abc' },
  { id: 'state', label: 'Review state', icon: 'ti ti-stamp' },
  { id: 'uses', label: 'Most broadcast', icon: 'ti ti-send' },
  { id: 'quality', label: 'Lowest quality', icon: 'ti ti-alert-triangle' },
  { id: 'updated', label: 'Recently edited', icon: 'ti ti-clock' },
];

const isInReview = (row: WhatsappTemplate) => stateOf(row) === 'In review';
const isRejected = (row: WhatsappTemplate) => stateOf(row) === 'Rejected';
const isDraft = (row: WhatsappTemplate) => stateOf(row) === 'Draft';

const qualityRank: Record<string, number> = { Low: 0, Medium: 1, 'Not rated': 2, High: 3 };

const WhatsappTemplatesPage = () => {
  const [rows, setRows] = useState<WhatsappTemplate[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<TemplateModalId | null>(null);
  const [modalRow, setModalRow] = useState<WhatsappTemplate | null>(null);
  const [panelRow, setPanelRow] = useState<WhatsappTemplate | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: WhatsappTemplate | null, modal: TemplateModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: WhatsappTemplate) => WhatsappTemplate, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<WhatsappTemplate>[]>(
    () => [
      {
        id: 'template',
        label: 'Template',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="avatar avatar-md bg-success-transparent text-success rounded flex-shrink-0 me-2">
              <i className="ti ti-brand-whatsapp" />
            </span>
            <div className="overflow-hidden">
              <ActionLink className="dt-name" onClick={() => setPanelRow(row)}>{row.label}</ActionLink>
              <div className="dt-sub text-truncate">{row.name}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'category',
        label: 'Category',
        sortable: true,
        render: (row) => (
          <>
            <span className={categoryBadge[row.category]}>{row.category}</span>
            <span className="d-block fs-12 text-muted mt-1">{row.languages.join(', ')}</span>
          </>
        ),
      },
      {
        id: 'body',
        label: 'Body',
        render: (row) => (
          <>
            <span className="d-block fs-13">{row.body.slice(0, 60)}…</span>
            {/* Counted from the body's own placeholders. */}
            <span className="fs-12 text-muted d-block">
              {variablesOf(row)} variable{variablesOf(row) === 1 ? '' : 's'}
              {row.button !== 'None' ? ` · ${row.button}` : ''}
            </span>
          </>
        ),
      },
      {
        id: 'quality',
        label: 'Quality',
        sortable: true,
        render: (row) => (
          <>
            <span className={qualityBadge[row.quality]}>{row.quality}</span>
            {isAtRisk(row) ? (
              <span className="d-block fs-12 text-warning mt-1 text-nowrap">At risk of pausing</span>
            ) : null}
          </>
        ),
      },
      {
        id: 'uses',
        label: 'Broadcasts',
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
        id: 'state',
        label: 'Review State',
        render: (row) => (
          <>
            <span className={`dt-pill ${statePill[stateOf(row)]}`}>
              <span className="dt-pill-dot" />{stateOf(row)}
            </span>
            <span className="d-block fs-12 text-muted mt-1">{statusSubLabelOf(row)}</span>
          </>
        ),
      },
    ],
    [],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<WhatsappTemplate>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.category && row.category !== filters.category) return false;
      if (filters.state && stateOf(row) !== filters.state) return false;
      if (filters.quality && row.quality !== filters.quality) return false;
      if (filters.language && !row.languages.includes(filters.language)) return false;
      if (filters.button && row.button !== filters.button) return false;
      if (filters.author && row.updatedBy !== filters.author) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'approved') return isUsable(row);
      if (quick === 'review') return isInReview(row);
      if (quick === 'rejected') return isRejected(row) || isDraft(row);
      if (quick === 'risk') return isAtRisk(row);
      return isMultilingual(row);
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'approved': return isUsable(row);
        case 'review': return isInReview(row) || isDraft(row);
        case 'attention': return isRejected(row) || isAtRisk(row);
        case 'popular': return row.uses >= 50;
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'state':
          return stateOf(a).localeCompare(stateOf(b)) || a.label.localeCompare(b.label);
        case 'uses':
          return b.uses - a.uses || a.label.localeCompare(b.label);
        case 'quality':
          return qualityRank[a.quality] - qualityRank[b.quality] || a.label.localeCompare(b.label);
        case 'updated':
          return dateKey(b.updatedOn) - dateKey(a.updatedOn) || a.label.localeCompare(b.label);
        case 'template':
        case 'category':
        case 'name':
        default:
          return a.label.localeCompare(b.label);
      }
    },
    defaultSort: 'name',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: WhatsappTemplate) => boolean) => rows.filter(test).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Templates', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'approved', label: 'Approved', icon: 'ti ti-circle-check', count: countBy(isUsable) },
      {
        id: 'review', label: 'Awaiting Meta', icon: 'ti ti-hourglass',
        count: countBy((row) => isInReview(row) || isDraft(row)),
      },
      {
        id: 'attention', label: 'Needs Attention', icon: 'ti ti-alert-triangle',
        count: countBy((row) => isRejected(row) || isAtRisk(row)),
      },
      { id: 'popular', label: 'Most Broadcast', icon: 'ti ti-send', count: countBy((row) => row.uses >= 50) },
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'approved', label: 'Approved', icon: 'ti ti-circle-check', count: countBy(isUsable) },
      { id: 'review', label: 'In review', icon: 'ti ti-hourglass', count: countBy(isInReview) },
      {
        id: 'rejected', label: 'Not usable', icon: 'ti ti-ban',
        count: countBy((row) => isRejected(row) || isDraft(row)),
      },
      { id: 'risk', label: 'Quality risk', icon: 'ti ti-alert-triangle', count: countBy(isAtRisk) },
      { id: 'multi', label: 'Multilingual', icon: 'ti ti-language', count: countBy(isMultilingual) },
    ],
    [countBy, rows.length],
  );

  const summary = useMemo<SummaryItem[]>(() => {
    const broadcasts = rows.reduce((total, row) => total + row.uses, 0);
    return [
      {
        id: 'total', tint: 'primary', icon: 'ti ti-template', label: 'Templates',
        value: String(rows.length), hint: `as at ${REGISTER_DATE}`,
      },
      {
        id: 'approved', tint: 'success', icon: 'ti ti-circle-check', label: 'Approved',
        value: String(countBy(isUsable)), hint: 'can open a conversation',
      },
      {
        id: 'review', tint: 'warning', icon: 'ti ti-hourglass', label: 'With Meta',
        value: String(countBy(isInReview)), hint: 'awaiting review',
      },
      {
        id: 'risk', tint: 'danger', icon: 'ti ti-alert-triangle', label: 'Quality Risk',
        value: String(countBy(isAtRisk)), hint: 'rated below High',
      },
      {
        id: 'broadcasts', tint: 'info', icon: 'ti ti-send', label: 'Broadcasts',
        value: broadcasts.toLocaleString(), hint: 'across every template',
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
      const id = `WAT-${11 + rows.length}`;
      setRows((current) => [
        {
          id,
          name: draft.name.trim(),
          label: draft.label.trim() || draft.name.trim(),
          category: draft.category as Category,
          languages: draft.languages.length > 0 ? draft.languages : ['English'],
          header: draft.header.trim(),
          body: draft.body.trim(),
          footer: draft.footer.trim(),
          button: draft.button as ButtonKind,
          headerMedia: '',
          // Nothing is with Meta until it is submitted.
          submittedOn: '', approvedOn: '', rejectedReason: '', paused: false,
          quality: 'Not rated', uses: 0, lastUsed: '',
          updatedOn: REGISTER_DATE, updatedBy: authorOptions[0],
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} saved as a draft — submit it for review to send from it`);
    },
    [push, rows.length],
  );

  const updateTemplate = useCallback(
    (draft: TemplateDraft) => {
      const wasApproved = modalRow ? isUsable(modalRow) : false;
      patchRow(
        (row) => ({
          ...row,
          name: draft.name.trim() || row.name,
          label: draft.label.trim() || row.label,
          category: draft.category as Category,
          languages: draft.languages.length > 0 ? draft.languages : row.languages,
          header: draft.header.trim(),
          body: draft.body.trim() || row.body,
          footer: draft.footer.trim(),
          button: draft.button as ButtonKind,
          updatedOn: REGISTER_DATE,
          updatedBy: authorOptions[0],
          // An edit withdraws the approval, as the platform does.
          approvedOn: '',
          submittedOn: wasApproved ? REGISTER_DATE : row.submittedOn,
          rejectedReason: '',
          paused: false,
        }),
        wasApproved
          ? `${modalRow?.label ?? 'Template'} updated and returned to Meta for review`
          : `${modalRow?.label ?? 'Template'} updated`,
      );
    },
    [modalRow, patchRow],
  );

  const submitForReview = useCallback(
    (payload: SubmitPayload) =>
      patchRow(
        (row) => ({
          ...row, submittedOn: REGISTER_DATE, approvedOn: '', rejectedReason: '',
        }),
        payload.notify
          ? `${modalRow?.label ?? 'Template'} submitted — you will be told either way`
          : `${modalRow?.label ?? 'Template'} submitted to Meta`,
      ),
    [modalRow, patchRow],
  );

  const duplicateTemplate = useCallback(
    (payload: DuplicatePayload) => {
      if (!modalRow) return;
      const id = `WAT-${11 + rows.length}`;
      setRows((current) => [
        {
          ...modalRow,
          id,
          name: payload.name.trim() || `${modalRow.name}_copy`,
          label: payload.label.trim() || `${modalRow.label} (copy)`,
          // A registration never carries over.
          submittedOn: payload.submitNow ? REGISTER_DATE : '',
          approvedOn: '', rejectedReason: '', paused: false,
          quality: 'Not rated', uses: 0, lastUsed: '',
          updatedOn: REGISTER_DATE, updatedBy: authorOptions[0],
        },
        ...current,
      ]);
      setActiveModal(null);
      push(payload.submitNow ? `${id} created and submitted to Meta` : `${id} created as a draft`);
    },
    [modalRow, push, rows.length],
  );

  const deleteTemplate = useCallback(() => {
    if (!modalRow) return;
    setRows((current) => current.filter((row) => row.id !== modalRow.id));
    setActiveModal(null);
    push(`${modalRow.label} deleted`);
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

  const rowActions = (row: WhatsappTemplate) => (
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
      {/* Only something not already with Meta can be submitted. */}
      {!isUsable(row) && !isInReview(row) ? (
        <ActionLink className="dt-ib success" ariaLabel="Submit for review" onClick={() => openModal(row, 'submit')}>
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

  const renderDetail = (row: WhatsappTemplate) => (
    <div className="row g-4">
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-template text-primary me-1" />Template</h6>
        {pairList(detailPairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-stamp text-warning me-1" />Meta review</h6>
        {pairList(reviewPairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-send text-success me-1" />Usage</h6>
        {pairList(usagePairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-brand-whatsapp text-success me-1" />As sent</h6>
        <div className="border rounded p-3">
          {row.header ? <h6 className="fs-13 mb-1">{row.header}</h6> : null}
          <p className="fs-13 mb-1">{row.body}</p>
          {row.footer ? <span className="fs-12 text-muted">{row.footer}</span> : null}
          {row.button !== 'None' ? (
            <div className="border-top mt-2 pt-2 text-center fs-13 text-primary">{row.button}</div>
          ) : null}
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
              disabled={isInReview(row)}
              onClick={() => openModal(row, 'submit')}
            >
              <i className="ti ti-send me-1" />
              {isInReview(row) ? `In review ${reviewAgeOf(row)}d` : 'Submit for review'}
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
            title="WhatsApp Templates"
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
            workspaceId="watWorkspace"
            searchPlaceholder="Search template, category or wording…"
            searchLabel="Search WhatsApp templates"
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
            title={panelRow ? panelRow.label : 'Template'}
            labelledById="wat_panel_lbl"
          >
            {panelRow ? (
              <>
                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                  <span className={categoryBadge[panelRow.category]}>{panelRow.category}</span>
                  <span className={stateBadge[stateOf(panelRow)]}>
                    <i className={`${stateIcon[stateOf(panelRow)]} me-1`} />{stateOf(panelRow)}
                  </span>
                  <span className={qualityBadge[panelRow.quality]}>{panelRow.quality}</span>
                </div>
                <p className="fs-12 text-muted mb-3">{statusSubLabelOf(panelRow)}</p>

                <h6 className="fs-14 mb-2">As sent</h6>
                <div className="border rounded p-3 mb-3">
                  {panelRow.header ? <h6 className="fs-13 mb-1">{panelRow.header}</h6> : null}
                  <p className="fs-13 mb-1">{panelRow.body}</p>
                  {panelRow.footer ? <span className="fs-12 text-muted">{panelRow.footer}</span> : null}
                  {panelRow.button !== 'None' ? (
                    <div className="border-top mt-2 pt-2 text-center fs-13 text-primary">
                      {panelRow.button}
                    </div>
                  ) : null}
                </div>

                <h6 className="fs-14 mb-2">Template</h6>
                <div className="border rounded p-3 mb-3">{pairList(detailPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Meta review</h6>
                <div className="border rounded p-3 mb-3">{pairList(reviewPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Usage</h6>
                <div className="border rounded p-3 mb-3">{pairList(usagePairsOf(panelRow))}</div>

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
        onSubmitForReview={submitForReview}
        onDuplicate={duplicateTemplate}
        onDelete={deleteTemplate}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="watToasts" />
    </>
  );
};

export default WhatsappTemplatesPage;
