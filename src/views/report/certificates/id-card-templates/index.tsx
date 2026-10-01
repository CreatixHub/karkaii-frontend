import { useCallback, useMemo, useState } from 'react';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink,
  ExportMenu,
  PageHeader,
  useWorkspace,
  WorkspaceShell,
} from '@components/workspace';
import type {
  ColumnDef,
  ExportFormat,
  FilterField,
  QuickFilter,
  SavedView,
  SortOption,
  SummaryItem,
  WorkspaceMenu,
} from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import TemplateModals from './modals/TemplateModals';
import type { TemplateModalId } from './modals/TemplateModals';
import type { Template } from './data/templates.data';
import {
  ACADEMIC_YEAR,
  ACTIVE_TEMPLATES,
  agoOf,
  ARCHIVED_TEMPLATES,
  assignedLabelOf,
  assignedNoteOf,
  cardSizeOptions,
  componentsLabelOf,
  countByStatus,
  countDefault,
  DEFAULT_TEMPLATES,
  defaultNoteOf,
  defaultOptions,
  detailActionsOf,
  DRAFT_TEMPLATES,
  iconOf,
  IN_REVIEW_TEMPLATES,
  lastUpdatedOf,
  orientationOptions,
  perSheetOf,
  photographFrameOf,
  RECIPIENT_TINT,
  recipientTypeOptions,
  revisionsLabelOf,
  RUN_DATE,
  searchIndexOf,
  sheetRunOf,
  sheetsOf,
  sidesOf,
  signatureBlockOf,
  sizeOf,
  statusNoteOf,
  statusOptions,
  statusPill,
  TEMPLATES_IN_USE,
  templates as seededTemplates,
  templateTypeOptions,
  tintOf,
  TOTAL_TEMPLATES,
  unassignedNoteOf,
  updatedByOf,
  versionOf,
} from './data/templates.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  {
    id: 'type',
    label: 'Template Type',
    kind: 'select',
    chipLabel: 'Type',
    options: templateTypeOptions,
  },
  {
    id: 'orientation',
    label: 'Card Orientation',
    kind: 'select',
    chipLabel: 'Orientation',
    options: orientationOptions,
  },
  {
    id: 'recipient',
    label: 'Recipient Type',
    kind: 'select',
    chipLabel: 'Recipient',
    options: recipientTypeOptions,
  },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'size', label: 'Card Size', kind: 'select', chipLabel: 'Size', options: cardSizeOptions },
  {
    id: 'default',
    label: 'Default',
    kind: 'select',
    chipLabel: 'Default',
    options: defaultOptions,
    allLabel: 'Any',
  },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Template name (A–Z)', icon: 'ti ti-abc' },
  { id: 'recipient', label: 'Recipient type', icon: 'ti ti-users' },
  { id: 'version', label: 'Version', icon: 'ti ti-git-commit' },
  { id: 'updated', label: 'Last updated', icon: 'ti ti-calendar-event' },
  { id: 'cards', label: 'Cards in use', icon: 'ti ti-id' },
];

const savedViews: SavedView[] = [
  { id: 'all', label: 'All Templates', icon: 'ti ti-layout-list', count: TOTAL_TEMPLATES },
  { id: 'default', label: 'Default Templates', icon: 'ti ti-star', count: DEFAULT_TEMPLATES },
  { id: 'drafts', label: 'Drafts', icon: 'ti ti-pencil', count: DRAFT_TEMPLATES },
  { id: 'review', label: 'Awaiting Sign Off', icon: 'ti ti-clock', count: IN_REVIEW_TEMPLATES },
  { id: 'archived', label: 'Archived', icon: 'ti ti-archive', count: ARCHIVED_TEMPLATES },
];

/**
 * The strip counts all 14 templates, not the eight the grid shows, so the five
 * totals stay register figures.
 */
const summary: SummaryItem[] = [
  {
    id: 'total',
    tint: 'primary',
    icon: 'ti ti-layout',
    label: 'Total Templates',
    value: String(TOTAL_TEMPLATES),
    hint: `academic year ${ACADEMIC_YEAR}`,
  },
  {
    id: 'active',
    tint: 'success',
    icon: 'ti ti-circle-check',
    label: 'Active Templates',
    value: String(ACTIVE_TEMPLATES),
    hint: 'published and printable',
  },
  {
    id: 'drafts',
    tint: 'warning',
    icon: 'ti ti-pencil',
    label: 'Draft Templates',
    value: String(DRAFT_TEMPLATES),
    hint: 'not yet published',
  },
  {
    id: 'default',
    tint: 'info',
    icon: 'ti ti-star',
    label: 'Default Templates',
    value: String(DEFAULT_TEMPLATES),
    hint: 'one per recipient group',
  },
  {
    id: 'inuse',
    tint: 'purple',
    icon: 'ti ti-id',
    label: 'Templates In Use',
    value: String(TEMPLATES_IN_USE),
    hint: `of ${ACTIVE_TEMPLATES} active templates`,
  },
];

/* ----------------------------- Detail helpers ---------------------------- */

const Line = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const Tile = ({
  title,
  note,
  icon,
  tint,
}: {
  title: string;
  note: string;
  icon: string;
  tint: string;
}) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
    <span className={`avatar avatar-sm bg-${tint}-transparent text-${tint} rounded flex-shrink-0`}>
      <i className={icon} />
    </span>
    <div className="flex-fill overflow-hidden">
      <h6 className="fs-13 mb-0 text-truncate">{title}</h6>
      <span className="fs-12 text-muted text-truncate d-block">{note}</span>
    </div>
  </div>
);

const IdCardTemplates = () => {
  const [rows, setRows] = useState<Template[]>(seededTemplates);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<TemplateModalId | null>(null);
  const [modalRow, setModalRow] = useState<Template | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Template | null, modal: TemplateModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const openPanel = useCallback((row: Template) => {
    setModalRow(row);
    setPanelOpen(true);
  }, []);

  const columns = useMemo<ColumnDef<Template>[]>(
    () => [
      {
        id: 'name',
        label: 'Template Name',
        sortable: true,
        toggleable: false,
        render: (row) => (
          <div className="dt-user">
            <span
              className={`avatar avatar-md bg-${tintOf(row)}-transparent text-${tintOf(row)} rounded flex-shrink-0 me-2`}
            >
              <i className={iconOf(row)} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>
                {row.name}
              </ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">
                {row.code} · {row.band} band
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'recipient',
        label: 'Recipient Type',
        sortable: true,
        render: (row) => (
          <span className={`badge badge-soft-${RECIPIENT_TINT[row.recipientType]}`}>
            {row.recipientType}
          </span>
        ),
      },
      {
        id: 'orientation',
        label: 'Orientation',
        render: (row) => (
          <span
            className={`badge badge-soft-${row.orientation === 'Portrait' ? 'info' : 'purple'}`}
          >
            {row.orientation}
          </span>
        ),
      },
      {
        id: 'size',
        label: 'Card Size',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.size}</span>
            <span className="fs-12 text-muted">{perSheetOf(row)} per A4 sheet</span>
          </>
        ),
      },
      {
        id: 'version',
        label: 'Version',
        sortable: true,
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{versionOf(row)}</span>
            <span className="fs-12 text-muted text-nowrap">{revisionsLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'updated',
        label: 'Last Updated',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 fw-medium text-nowrap">{lastUpdatedOf(row)}</span>
            <span className="fs-12 text-muted d-block text-nowrap">{agoOf(lastUpdatedOf(row))}</span>
            <span className="fs-12 text-muted text-nowrap">{updatedByOf(row)}</span>
          </>
        ),
      },
      {
        id: 'default',
        label: 'Default',
        render: (row) => (
          <>
            <span className={`badge badge-soft-${row.isDefault ? 'info' : 'secondary'}`}>
              {row.isDefault ? 'Default' : 'Not default'}
            </span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{defaultNoteOf(row)}</span>
          </>
        ),
      },
      {
        id: 'status',
        label: 'Status',
        render: (row) => (
          <>
            <span className={`dt-pill ${statusPill(row.status)}`}>
              <span className="dt-pill-dot" />
              {row.status}
            </span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{statusNoteOf(row)}</span>
          </>
        ),
      },
      {
        id: 'assigned',
        label: 'Assigned To',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{assignedLabelOf(row)}</span>
            <span className="fs-12 text-muted">{assignedNoteOf(row)}</span>
          </>
        ),
      },
    ],
    [openModal],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: TOTAL_TEMPLATES },
      {
        id: 'active',
        label: 'Active',
        icon: 'ti ti-circle-check',
        count: countByStatus(rows, 'Active'),
      },
      { id: 'default', label: 'Default', icon: 'ti ti-star', count: countDefault(rows) },
      { id: 'drafts', label: 'Drafts', icon: 'ti ti-pencil', count: countByStatus(rows, 'Draft') },
      {
        id: 'review',
        label: 'In Review',
        icon: 'ti ti-clock',
        count: countByStatus(rows, 'In Review'),
      },
      {
        id: 'archived',
        label: 'Archived',
        icon: 'ti ti-archive',
        count: countByStatus(rows, 'Archived'),
      },
    ],
    [rows],
  );

  const workspace = useWorkspace<Template>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.code,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.type && row.type !== filters.type) return false;
      if (filters.orientation && row.orientation !== filters.orientation) return false;
      if (filters.recipient && row.recipientType !== filters.recipient) return false;
      if (filters.status && row.status !== filters.status) return false;
      if (filters.size && row.size !== filters.size) return false;
      if (filters.default === 'Default only' && !row.isDefault) return false;
      if (filters.default === 'Not default' && row.isDefault) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'active') return row.status === 'Active';
      if (quick === 'default') return row.isDefault;
      if (quick === 'drafts') return row.status === 'Draft';
      if (quick === 'review') return row.status === 'In Review';
      if (quick === 'archived') return row.status === 'Archived';
      return true;
    },
    compare: (a, b, sort) => {
      if (sort === 'recipient') return a.recipientType.localeCompare(b.recipientType);
      if (sort === 'version') return versionOf(b).localeCompare(versionOf(a));
      if (sort === 'updated') return lastUpdatedOf(b).localeCompare(lastUpdatedOf(a));
      if (sort === 'cards') return b.cards - a.cards;
      return a.name.localeCompare(b.name);
    },
    defaultSort: 'name',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const renderDetail = useCallback(
    (row: Template) => (
      <div className="row g-4">
        <div className="col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3">
            <i className="ti ti-id text-primary me-1" />
            Template Preview
          </h6>
          <div className="border rounded p-3">
            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
              <span
                className={`avatar avatar-md bg-${tintOf(row)}-transparent text-${tintOf(row)} rounded flex-shrink-0`}
              >
                <i className="ti ti-school" />
              </span>
              <div className="overflow-hidden">
                <h6 className="fs-13 mb-0">PreSkool School</h6>
                <span className="fs-12 text-muted">
                  {row.recipientType} card · {ACADEMIC_YEAR}
                </span>
              </div>
              <span className={`badge badge-soft-${tintOf(row)} ms-auto`}>{row.band}</span>
            </div>
            <p className="fs-13 mb-1 fw-medium">Sample Name</p>
            <p className="fs-12 text-muted mb-3">{row.components[1]?.name ?? 'Name block'}</p>
            <Line label="Orientation" value={row.orientation} />
            <Line label="Card Size" value={row.size} last />
            <div className="d-flex align-items-center gap-2 border-top pt-2 mt-2">
              <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                <i className="ti ti-qrcode" />
              </span>
              <span className="fs-12 text-muted text-truncate">{row.qr}</span>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3">
            <i className="ti ti-layout text-info me-1" />
            Layout Configuration
          </h6>
          <Line label="Orientation" value={row.orientation} />
          <Line label="Card Size" value={row.size} />
          <Line label="Band Colour" value={row.band} />
          <Line label="Components" value={componentsLabelOf(row)} last />
          <div className="mt-2">
            {row.components.map((part) => (
              <Line key={part.name} label={part.name} value={part.place} />
            ))}
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3">
            <i className="ti ti-palette text-warning me-1" />
            Logo &amp; Branding
          </h6>
          <Line label="Logo" value={row.logo} />
          <Line label="Watermark" value={row.watermark} />
          <Line label="Band Colour" value={row.band} />
          <Line label="Signature Block" value={signatureBlockOf(row)} />
          <Line label="Photograph Frame" value={photographFrameOf(row)} last />
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3">
            <i className="ti ti-qrcode text-purple me-1" />
            QR &amp; Barcode Settings
          </h6>
          <Line label="QR Code" value={row.qr} />
          <Line label="Barcode" value={row.barcode} />
          <Line label="Encoded Data" value={row.encoded} />
          <Line label="Gate Reader" value={row.gateReader} />
          <Line label="Library Reader" value={row.libraryReader} last />
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3">
            <i className="ti ti-users text-success me-1" />
            Assigned Records
          </h6>
          {row.assignedTo ? (
            <>
              <Line label="Assigned To" value={row.assignedTo} />
              <Line label="Scope" value={row.scope ?? '—'} />
              <Line label="Cards Carrying This Template" value={String(row.cards)} />
              <Line label="Default For This Group" value={row.isDefault ? 'Yes' : 'No'} last />
              {row.cards > 0 ? (
                <div className="mt-2">
                  <Tile
                    title={row.assignedTo}
                    note={`${row.cards} cards printed to date`}
                    icon="ti ti-id"
                    tint={tintOf(row)}
                  />
                </div>
              ) : null}
            </>
          ) : (
            <Tile
              title="No records assigned"
              note={unassignedNoteOf(row)}
              icon="ti ti-users-off"
              tint="secondary"
            />
          )}
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3">
            <i className="ti ti-git-commit text-danger me-1" />
            Version History
          </h6>
          {row.history.map((entry) => (
            <Tile
              key={entry.version}
              title={`${entry.version} · ${entry.change}`}
              note={`${entry.date} · ${entry.by}`}
              icon="ti ti-git-commit"
              tint="purple"
            />
          ))}
          <Line label="Current Version" value={versionOf(row)} />
          <Line label="Revisions" value={String(row.history.length)} last />
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3">
            <i className="ti ti-printer text-info me-1" />
            Print Settings
          </h6>
          <Line label="Stock" value={sizeOf(row.size).stock} />
          <Line label="Cards Per A4 Sheet" value={String(perSheetOf(row))} />
          <Line label="Sides" value={sidesOf(row)} />
          <Line label="Bleed" value="3 mm on all edges" />
          <Line label="Sheets For Current Run" value={sheetRunOf(row)} last />
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3">
            <i className="ti ti-notes text-warning me-1" />
            Internal Notes
          </h6>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
            <span className={`badge badge-soft-${row.orientation === 'Portrait' ? 'info' : 'purple'}`}>
              {row.orientation}
            </span>
            <span className="badge badge-soft-secondary">{versionOf(row)}</span>
          </div>
          <p className="fs-13 text-muted">{row.notes}</p>
          <p className="fs-12 text-muted">
            {row.cards > 0 ? `${sheetsOf(row)} A4 sheets on the current run.` : 'Nothing queued.'}
          </p>
          <div className="d-flex align-items-center flex-wrap gap-2">
            {detailActionsOf(row).map((action) => (
              <ActionLink
                key={action.label}
                className={
                  action.primary
                    ? 'btn btn-primary btn-sm d-inline-flex align-items-center'
                    : 'btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center'
                }
                onClick={() => openModal(row, action.modal)}
              >
                <i className={`${action.icon} me-1`} />
                {action.label}
              </ActionLink>
            ))}
            <ActionLink
              className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
              onClick={() => openPanel(row)}
            >
              <i className="ti ti-layout me-1" />
              Template Panel
            </ActionLink>
          </div>
        </div>
      </div>
    ),
    [openModal, openPanel],
  );

  const rowActions = useCallback(
    (row: Template) => (
      <div className="dt-actions">
        <ActionLink className="dt-ib" ariaLabel="Preview template" onClick={() => openModal(row, 'preview')}>
          <i className="ti ti-photo" />
        </ActionLink>
        <ActionLink className="dt-ib" ariaLabel="Edit template" onClick={() => openModal(row, 'edit')}>
          <i className="ti ti-edit" />
        </ActionLink>
        <ActionLink
          className="dt-ib"
          ariaLabel="Duplicate template"
          onClick={() => openModal(row, 'duplicate')}
        >
          <i className="ti ti-copy" />
        </ActionLink>
        <ActionLink
          className="dt-ib success"
          ariaLabel="Set as default"
          onClick={() => openModal(row, 'default')}
        >
          <i className="ti ti-star" />
        </ActionLink>
        <ActionLink
          className="dt-ib"
          ariaLabel="Assign template"
          onClick={() => openModal(row, 'assign')}
        >
          <i className="ti ti-users" />
        </ActionLink>
      </div>
    ),
    [openModal],
  );

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="ID Card Templates"
            section="Students"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(rows[0] ?? null, 'preview')}
                  >
                    <i className="ti ti-photo me-2" />
                    Preview Template
                  </ActionLink>
                </div>
                <div className="me-2 mb-2">
                  <ExportMenu
                    printLabel="Print Template List"
                    onExport={(format: ExportFormat) => {
                      push(`Template register exported as ${format.toUpperCase()}`);
                    }}
                  />
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'create')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Create Template
                  </ActionLink>
                </div>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.code}
            totalCount={TOTAL_TEMPLATES}
            workspaceId="id-card-templates"
            searchPlaceholder="Search template name, code or band…"
            searchLabel="Search ID card templates"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="templates"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            footerVariant="card-foot"
            pageSizeOptions={[8, 25, 50, 100]}
            footerInfoSuffix={`register as at ${RUN_DATE}`}
            onRefresh={() => {
              setRows(seededTemplates);
              push('Templates refreshed');
            }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-layout-off"
            emptyTitle="No templates match your filters"
            emptyBody="Clear a filter or widen the recipient type to see more templates."
            summary={summary}
          />
        </div>
      </div>

      <TemplateModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        row={modalRow}
        panelOpen={panelOpen}
        onClosePanel={() => setPanelOpen(false)}
        onToast={push}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="idCardTemplatesToasts" />
    </>
  );
};

export default IdCardTemplates;
