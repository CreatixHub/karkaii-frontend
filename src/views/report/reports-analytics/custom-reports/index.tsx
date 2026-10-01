import { useCallback, useMemo, useState } from 'react';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink,
  ReportPageHeader,
  ReportWorkspaceShell,
  useWorkspace,
} from '@components/workspace';
import type {
  ColumnDef,
  FilterField,
  QuickFilter,
  ReportBulkAction,
  ReportScope,
  SavedView,
  SortOption,
  SummaryStripItem,
  WorkspaceMenu,
} from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import ReportBuilder from './ReportBuilder';
import CustomModals from './modals/CustomModals';
import type { CustomModalId } from './modals/CustomModals';
import type { BuildState, ReportState, SavedReport } from './data/customReports.data';
import {
  categoryOptions,
  exportOptions,
  initialBuild,
  isScheduledOf,
  isSharedOf,
  lastRunLabelOf,
  moduleOptions,
  ownerLabelOf,
  ownerOptions,
  REGISTER_TOTAL,
  savedReports as seededReports,
  scheduleOptions,
  searchIndexOf,
  stateOf,
  statePill,
  stateOptions,
  visibilityOptions,
} from './data/customReports.data';

const routes = all_routes;

/** Band 1's scope group, which the template calls "Show:" rather than "Report on:". */
const scopes: ReportScope[] = [
  { id: 'all', label: 'All', icon: 'ti ti-layout-list' },
  { id: 'saved', label: 'Saved', icon: 'ti ti-device-floppy' },
  { id: 'shared', label: 'Shared', icon: 'ti ti-share' },
  { id: 'scheduled', label: 'Scheduled', icon: 'ti ti-calendar-time' },
  { id: 'favorite', label: 'Favorites', icon: 'ti ti-star' },
];

const matchesScope = (row: SavedReport, scope: string) => {
  switch (scope) {
    case 'saved':
      return !row.archivedOn;
    case 'shared':
      return isSharedOf(row);
    case 'scheduled':
      return isScheduledOf(row);
    case 'favorite':
      return row.favorite;
    default:
      return true;
  }
};

const filterFields: FilterField[] = [
  {
    id: 'date-range',
    label: 'Date Range',
    kind: 'daterange',
    surface: 'band',
    span: 'col-xxl-3 col-lg-4 col-md-6',
    chipLabel: 'Range',
    rangeFormat: 'd M Y',
    initialValue: '01 Jul 2026 - 31 Jul 2026',
  },
  {
    id: 'module',
    label: 'Module',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Module',
    allLabel: 'All Modules',
    options: moduleOptions,
  },
  {
    id: 'category',
    label: 'Report Category',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Category',
    allLabel: 'All Categories',
    options: categoryOptions,
  },
  {
    id: 'owner',
    label: 'Owner',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Owner',
    allLabel: 'All Owners',
    options: ownerOptions,
  },
  {
    id: 'state',
    label: 'Report Status',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Status',
    allLabel: 'All Status',
    options: stateOptions,
  },
  {
    id: 'visibility',
    label: 'Visibility',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Visibility',
    allLabel: 'All Visibility',
    options: visibilityOptions,
  },
  {
    id: 'schedule',
    label: 'Schedule',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Schedule',
    allLabel: 'Any Schedule',
    options: scheduleOptions,
  },
  {
    id: 'format',
    label: 'Export Format',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Format',
    allLabel: 'All Formats',
    options: exportOptions,
  },

  { id: 'columns-from', label: 'Columns From', kind: 'number', chipLabel: 'Columns ≥', defaultValue: '0' },
  { id: 'columns-to', label: 'Columns To', kind: 'number', chipLabel: 'Columns ≤', defaultValue: '30' },
  { id: 'rows-from', label: 'Rows From', kind: 'number', chipLabel: 'Rows ≥', defaultValue: '0' },
  {
    id: 'favorites-only',
    label: 'Favorites',
    kind: 'toggle',
    chipLabel: 'Favorites',
    switchLabel: 'Only reports I have starred',
  },
  {
    id: 'needs-action',
    label: 'Needs action',
    kind: 'toggle',
    chipLabel: 'Action',
    switchLabel: 'Only reports still to be published or approved',
  },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Report name (A–Z)', icon: 'ti ti-abc' },
  { id: 'id', label: 'Report ID', icon: 'ti ti-hash' },
  { id: 'run', label: 'Last run', icon: 'ti ti-calendar-event' },
  { id: 'rows', label: 'Rows returned', icon: 'ti ti-list-numbers' },
  { id: 'columns', label: 'Columns', icon: 'ti ti-columns-3' },
];

const rails: { id: string; label: string; icon: string }[] = [
  { id: 'Published', label: 'Published', icon: 'ti ti-circle-check' },
  { id: 'Draft', label: 'Draft', icon: 'ti ti-file-pencil' },
  { id: 'Under Review', label: 'Under Review', icon: 'ti ti-eye-check' },
  { id: 'scheduled', label: 'Scheduled', icon: 'ti ti-calendar-time' },
  { id: 'Archived', label: 'Archived', icon: 'ti ti-archive' },
];

function matchesRail(row: SavedReport, rail: string | null): boolean {
  if (!rail) return true;
  if (rail === 'scheduled') return isScheduledOf(row);
  if (rail === 'shared') return isSharedOf(row);
  if (rail === 'favorite') return row.favorite;
  return stateOf(row) === (rail as ReportState);
}

const dayOf = (value: string) => {
  const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
  const [day, month, year] = value.split(' ');
  return Number(year) * 10000 + (months.indexOf(month) + 1) * 100 + Number(day);
};

const CustomReports = () => {
  const [rows, setRows] = useState<SavedReport[]>(seededReports);
  const [scope, setScope] = useState('all');
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<CustomModalId | null>(null);
  const [modalRow, setModalRow] = useState<SavedReport | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [build, setBuild] = useState<BuildState>(initialBuild);
  const [builderDirty, setBuilderDirty] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: SavedReport | null, modal: CustomModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const openPanel = useCallback((row: SavedReport | null) => {
    setModalRow(row);
    setPanelOpen(true);
  }, []);

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<SavedReport>[]>(
    () => [
      {
        id: 'name',
        label: 'Report',
        sortable: true,
        toggleable: false,
        render: (row) => (
          <div className="dt-user">
            <ActionLink
              className="dt-avatar d-inline-flex align-items-center justify-content-center bg-primary-transparent text-primary"
              ariaLabel={`View ${row.name}`}
              onClick={() => openModal(row, 'view')}
            >
              <i className="ti ti-file-analytics fs-20" />
            </ActionLink>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>
                {row.name}
              </ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">
                <span>{row.id}</span>
                <span className="dt-dot">•</span>
                <span>{row.columns} columns</span>
              </div>
              <div className="d-flex flex-wrap gap-1 mt-1">
                {row.favorite ? (
                  <span className="badge badge-soft-warning">
                    <i className="ti ti-star me-1" />
                    Favorite
                  </span>
                ) : null}
                {row.flag ? (
                  <span className={`badge badge-soft-${row.flag.tint}`}>{row.flag.label}</span>
                ) : null}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'module',
        label: 'Module',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.primaryModule}</span>
            <span className="fs-12 text-muted">{row.joinedModules}</span>
          </>
        ),
      },
      {
        id: 'category',
        label: 'Category',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.category}</span>
            <span className="fs-12 text-muted">{row.categoryNote}</span>
          </>
        ),
      },
      {
        id: 'owner',
        label: 'Owner',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.owner}</span>
            <span className="fs-12 text-muted">{row.ownerRole}</span>
          </>
        ),
      },
      {
        id: 'run',
        label: 'Last Run',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.lastRun}</span>
            <span className="fs-12 text-muted">
              {lastRunLabelOf(row)} · {row.rowsReturned.toLocaleString()} rows
            </span>
          </>
        ),
      },
      {
        id: 'schedule',
        label: 'Schedule',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.frequency}</span>
            <span className="fs-12 text-muted">{row.frequencyNote}</span>
          </>
        ),
      },
      {
        id: 'formats',
        label: 'Formats',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <div className="d-flex flex-wrap gap-1">
            {row.formats.map((format) => (
              <span className="badge badge-soft-secondary" key={format}>
                {format}
              </span>
            ))}
          </div>
        ),
      },
      {
        id: 'visibility',
        label: 'Visibility',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.visibility}</span>
            <span className="fs-12 text-muted">{row.visibilityNote}</span>
          </>
        ),
      },
      {
        id: 'state',
        label: 'Status',
        render: (row) => (
          <>
            <span className={`dt-pill ${statePill[stateOf(row)]}`}>
              <span className="dt-pill-dot" />
              {stateOf(row)}
            </span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{row.stateNote}</span>
          </>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<SavedReport>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.module && row.primaryModule !== filters.module) return false;
      if (filters.category && row.category !== filters.category) return false;
      if (filters.owner && ownerLabelOf(row) !== filters.owner && row.owner !== filters.owner.split(' · ')[0])
        return false;
      if (filters.state && stateOf(row) !== filters.state) return false;
      if (filters.visibility && row.visibility !== filters.visibility) return false;
      if (filters.schedule && row.frequency !== filters.schedule) return false;
      if (filters.format && !row.formats.includes(filters.format)) return false;
      if (filters['favorites-only'] && !row.favorite) return false;
      if (filters['needs-action'] && stateOf(row) === 'Published') return false;

      if (row.columns < Number(filters['columns-from'] || 0)) return false;
      if (row.columns > Number(filters['columns-to'] || 99)) return false;
      if (row.rowsReturned < Number(filters['rows-from'] || 0)) return false;

      return matchesScope(row, scope);
    },
    quickMatch: (row, quick) => matchesRail(row, quick),
    viewMatch: (row, view) => matchesRail(row, view === 'all' ? null : view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'id':
          return a.id.localeCompare(b.id);
        case 'run':
          return dayOf(b.lastRun) - dayOf(a.lastRun) || a.name.localeCompare(b.name);
        case 'rows':
          return b.rowsReturned - a.rowsReturned || a.name.localeCompare(b.name);
        case 'columns':
          return b.columns - a.columns || a.name.localeCompare(b.name);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    },
    defaultSort: 'run',
    pageSize: 8,
  });

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Reports', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'Published', label: 'Published', icon: 'ti ti-circle-check', count: rows.filter((r) => matchesRail(r, 'Published')).length },
      {
        id: 'scheduled',
        label: 'Scheduled',
        icon: 'ti ti-calendar-time',
        count: rows.filter((r) => matchesRail(r, 'scheduled')).length,
      },
      { id: 'shared', label: 'Shared', icon: 'ti ti-share', count: rows.filter((r) => matchesRail(r, 'shared')).length },
      { id: 'favorite', label: 'Favorites', icon: 'ti ti-star', count: rows.filter((r) => matchesRail(r, 'favorite')).length },
      { id: 'Archived', label: 'Archived', icon: 'ti ti-archive', count: rows.filter((r) => matchesRail(r, 'Archived')).length },
    ],
    [rows],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () =>
      [{ id: 'all', label: 'All', icon: 'ti ti-layout-list' }, ...rails].map((rail) => ({
        ...rail,
        count: rows.filter((row) => matchesRail(row, rail.id === 'all' ? null : rail.id)).length,
      })),
    [rows],
  );

  /* ------------------------------ Summary strip ------------------------------ */

  const summary = useMemo<SummaryStripItem[]>(() => {
    const shown = workspace.visible;
    const state = (name: ReportState) => shown.filter((row) => stateOf(row) === name).length;
    return [
      { id: 'total', accent: 'primary', icon: 'ti ti-files', value: `${shown.length}`, label: 'Total Reports' },
      {
        id: 'saved',
        accent: 'info',
        icon: 'ti ti-device-floppy',
        value: `${shown.filter((row) => !row.archivedOn).length}`,
        label: 'Saved Reports',
      },
      {
        id: 'shared',
        accent: 'teal',
        icon: 'ti ti-share',
        value: `${shown.filter(isSharedOf).length}`,
        label: 'Shared Reports',
      },
      {
        id: 'scheduled',
        accent: 'purple',
        icon: 'ti ti-calendar-time',
        value: `${shown.filter(isScheduledOf).length}`,
        label: 'Scheduled Reports',
      },
      {
        id: 'favorite',
        accent: 'warning',
        icon: 'ti ti-star',
        value: `${shown.filter((row) => row.favorite).length}`,
        label: 'Favorite Reports',
      },
      {
        id: 'rows',
        accent: 'slate',
        icon: 'ti ti-list-numbers',
        value: shown.reduce((total, row) => total + row.rowsReturned, 0).toLocaleString(),
        label: 'Rows Last Run',
      },
      { id: 'published', accent: 'success', icon: 'ti ti-circle-check', value: `${state('Published')}`, label: 'Published Reports' },
      { id: 'archived', accent: 'danger', icon: 'ti ti-archive', value: `${state('Archived')}`, label: 'Archived Reports' },
    ];
  }, [workspace.visible]);

  /* -------------------------------- Mutations -------------------------------- */

  const publish = useCallback(
    (ids: string[]) => {
      setRows((current) =>
        current.map((row) =>
          ids.includes(row.id) && !row.archivedOn
            ? {
                ...row,
                publishedOn: '31 Jul 2026',
                awaitingApproval: false,
                version: row.version + 1,
                stateNote: `v${row.version + 1} · live`,
                audit: [{ title: 'Published', detail: '31 Jul 2026 · Principal' }, ...row.audit],
              }
            : row,
        ),
      );
      workspace.clearSelection();
    },
    [workspace],
  );

  const duplicate = useCallback((id: string, name: string) => {
    setRows((current) => {
      const source = current.find((row) => row.id === id);
      if (!source) return current;
      const reference = `RPT-${String(Number(source.id.split('-')[1]) + 500).padStart(4, '0')}`;
      return [
        {
          ...source,
          id: reference,
          name,
          favorite: false,
          flag: undefined,
          version: 1,
          publishedOn: undefined,
          awaitingApproval: false,
          archivedOn: undefined,
          createdOn: '31 Jul 2026',
          stateNote: 'v1 · not published',
          visibility: 'Private',
          visibilityNote: 'Owner only',
          audit: [{ title: `Duplicated from ${source.id}`, detail: '31 Jul 2026' }],
        },
        ...current,
      ];
    });
  }, []);

  const remove = useCallback(
    (ids: string[]) => {
      setRows((current) => current.filter((row) => !ids.includes(row.id)));
      workspace.clearSelection();
    },
    [workspace],
  );

  const rename = useCallback((id: string, name: string, category: string) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, name, category } : row)));
  }, []);

  const bulkActions = useMemo<ReportBulkAction[]>(
    () => [
      { id: 'pdf', label: 'Bulk Export PDF', icon: 'ti ti-file-type-pdf', onClick: () => openModal(null, 'export') },
      { id: 'csv', label: 'Bulk Export CSV', icon: 'ti ti-file-type-csv', onClick: () => openModal(null, 'export') },
      { id: 'schedule', label: 'Schedule', icon: 'ti ti-calendar-time', onClick: () => openModal(null, 'schedule') },
      { id: 'publish', label: 'Publish', icon: 'ti ti-send', onClick: () => openModal(null, 'publish') },
      { id: 'delete', label: 'Delete', icon: 'ti ti-trash', onClick: () => openModal(null, 'delete') },
    ],
    [openModal],
  );

  /* --------------------------------- Detail ---------------------------------- */

  const renderDetail = (row: SavedReport) => (
    <div className="row g-4">
      <div className="col-xl-3 col-md-6">
        <h3 className="fs-14 mb-3 fw-medium">
          <i className="ti ti-adjustments text-primary me-1" />
          Report Configuration
        </h3>
        <ul className="list-unstyled fs-12 mb-3">
          {row.configuration.map((item) => (
            <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
              <span className="text-muted">{item.label}</span>
              <span className="fw-medium">{item.value}</span>
            </li>
          ))}
        </ul>

        <h6 className="details-heading">
          <i className="ti ti-columns-3" />
          Selected Data Fields
        </h6>
        <div className="d-flex flex-wrap gap-1 mb-2">
          {row.fields.map((field) => (
            <span className="badge badge-soft-primary" key={field}>
              {field}
            </span>
          ))}
          {row.fieldsMore > 0 ? (
            <span className="badge badge-soft-secondary">and {row.fieldsMore} more</span>
          ) : null}
        </div>
        <ul className="list-unstyled fs-12 mb-0">
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Total Columns</span>
            <span className="fw-medium">{row.columns}</span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Calculated Columns</span>
            <span className="fw-medium">{row.calculatedColumns}</span>
          </li>
        </ul>
      </div>

      <div className="col-xl-3 col-md-6">
        <h6 className="details-heading">
          <i className="ti ti-filter" />
          Applied Filters
        </h6>
        <div className="d-flex flex-wrap gap-1 mb-2">
          {row.filters.map((filter) => (
            <span className="badge badge-soft-warning" key={filter}>
              {filter}
            </span>
          ))}
        </div>
        <ul className="list-unstyled fs-12 mb-3">
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Match Rule</span>
            <span className="fw-medium">{row.matchRule}</span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Rows Returned</span>
            <span className="fw-medium">
              {row.rowsReturned.toLocaleString()}
              {row.rowsOf ? ` of ${row.rowsOf.toLocaleString()}` : ''}
            </span>
          </li>
        </ul>

        <h6 className="details-heading">
          <i className="ti ti-arrows-sort" />
          Grouping &amp; Sorting
        </h6>
        <ul className="list-unstyled fs-12 mb-0">
          {row.grouping.map((item) => (
            <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
              <span className="text-muted">{item.label}</span>
              <span className="fw-medium">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="col-xl-3 col-md-6">
        <h6 className="details-heading">
          <i className="ti ti-calendar-time" />
          Schedule Information
        </h6>
        <ul className="list-unstyled fs-12 mb-3">
          {row.schedule.map((item) => (
            <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
              <span className="text-muted">{item.label}</span>
              <span className="fw-medium">{item.value}</span>
            </li>
          ))}
        </ul>

        <h6 className="details-heading">
          <i className="ti ti-file-export" />
          Export Formats
        </h6>
        {row.exports.map((entry) => (
          <div className="border rounded p-2 mb-2" key={entry.title}>
            <h6 className="fs-13 mb-0 fw-medium">{entry.title}</h6>
            <span className="fs-12 text-muted">{entry.detail}</span>
          </div>
        ))}
        <ul className="list-unstyled fs-12 mb-0">
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Default Format</span>
            <span className="fw-medium">{row.formats[0]}</span>
          </li>
        </ul>
      </div>

      <div className="col-xl-3 col-md-6">
        <h6 className="details-heading">
          <i className="ti ti-users" />
          Sharing Permissions
        </h6>
        <ul className="list-unstyled fs-12 mb-3">
          {row.sharing.map((item) => (
            <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
              <span className="text-muted">{item.label}</span>
              <span className="fw-medium">{item.value}</span>
            </li>
          ))}
        </ul>

        <h6 className="details-heading">
          <i className="ti ti-history" />
          Generation History
        </h6>
        <ul className="list-unstyled fs-12 mb-3">
          {row.generation.map((item) => (
            <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
              <span className="text-muted">{item.label}</span>
              <span className="fw-medium">{item.value}</span>
            </li>
          ))}
        </ul>

        <h6 className="details-heading">
          <i className="ti ti-download" />
          Recent Downloads
        </h6>
        <ul className="list-unstyled fs-12 mb-3">
          {row.downloads.map((entry) => (
            <li className="d-flex align-items-center justify-content-between py-1" key={entry.title}>
              <span className="text-muted">{entry.title}</span>
              <span className="fw-medium">{entry.detail}</span>
            </li>
          ))}
        </ul>

        <h6 className="details-heading">
          <i className="ti ti-list-check" />
          Audit History
        </h6>
        {row.audit.map((entry) => (
          <div className="border rounded p-2 mb-2" key={`${entry.title}-${entry.detail}`}>
            <h6 className="fs-13 mb-0 fw-medium">{entry.title}</h6>
            <span className="fs-12 text-muted">{entry.detail}</span>
          </div>
        ))}

        <div className="d-flex gap-2 mt-3">
          {stateOf(row) === 'Under Review' ? (
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-sm flex-fill"
              onClick={() => openModal(row, 'publish')}
            >
              <i className="ti ti-check me-1" />
              Approve &amp; Publish
            </button>
          ) : stateOf(row) === 'Archived' ? (
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-sm flex-fill"
              onClick={() => openModal(row, 'duplicate')}
            >
              <i className="ti ti-copy me-1" />
              Duplicate
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-sm flex-fill"
              onClick={() => openModal(row, 'view')}
            >
              <i className="ti ti-file-text me-1" />
              Full Details
            </button>
          )}
          <button type="button" className="btn btn-primary btn-sm flex-fill" onClick={() => openPanel(row)}>
            <i className="ti ti-layout-sidebar-right-expand me-1" />
            Report Panel
          </button>
        </div>
      </div>
    </div>
  );

  const rowActions = (row: SavedReport) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Details" ariaLabel="View Details" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Edit Report" ariaLabel="Edit Report" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Duplicate" ariaLabel="Duplicate" onClick={() => openModal(row, 'duplicate')}>
        <i className="ti ti-copy" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Schedule" ariaLabel="Schedule" onClick={() => openModal(row, 'schedule')}>
        <i className="ti ti-calendar-time" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Publish" ariaLabel="Publish" onClick={() => openModal(row, 'publish')}>
        <i className="ti ti-send" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Share" ariaLabel="Share" onClick={() => openModal(row, 'share')}>
        <i className="ti ti-share" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Delete" ariaLabel="Delete" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash-x" />
      </ActionLink>
    </div>
  );

  const filterSummary = [
    workspace.filters['date-range'] || '1 – 31 Jul 2026',
    workspace.filters.module || 'all modules',
    workspace.filters.owner || 'all owners',
    workspace.filters.state || 'all statuses',
  ].join(' · ');

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <ReportPageHeader
            title="Custom Reports"
            section="Reports"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'schedule')}
                  >
                    <i className="ti ti-calendar-time me-2" />
                    Scheduled Runs
                  </ActionLink>
                </div>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => (rows[0] ? openModal(rows[0], 'view') : undefined)}
                  >
                    <i className="ti ti-file-text me-2" />
                    Report Details
                  </ActionLink>
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openPanel(null)}
                  >
                    <i className="ti ti-layout-sidebar-right-expand me-2" />
                    Details Panel
                  </ActionLink>
                </div>
              </>
            }
          />

          <ReportWorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={rows.length}
            workspaceId="customReports"
            showChips
            scopeLabel="Show:"
            scopeAriaLabel="Report scope"
            scopes={scopes}
            scope={scope}
            onScope={setScope}
            scopeCount={`${REGISTER_TOTAL} reports`}
            bandActions={
              <>
                <ActionLink
                  className="btn btn-sm btn-primary d-inline-flex align-items-center"
                  onClick={() => openModal(null, 'create')}
                >
                  <i className="ti ti-square-rounded-plus me-1" />
                  New Custom Report
                </ActionLink>
                <ActionLink
                  className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                  onClick={() => openModal(null, 'template')}
                >
                  <i className="ti ti-bookmark-plus me-1" />
                  Save Template
                </ActionLink>
                <ActionLink className="btn btn-sm btn-outline-light bg-white btn-icon" title="Export" ariaLabel="Export" onClick={() => openModal(null, 'export')}>
                  <i className="ti ti-file-export" />
                </ActionLink>
                <ActionLink className="btn btn-sm btn-outline-light bg-white btn-icon" title="Schedule" ariaLabel="Schedule" onClick={() => openModal(null, 'schedule')}>
                  <i className="ti ti-calendar-time" />
                </ActionLink>
                <ActionLink className="btn btn-sm btn-outline-light bg-white btn-icon" title="Share" ariaLabel="Share" onClick={() => openModal(null, 'share')}>
                  <i className="ti ti-share" />
                </ActionLink>
              </>
            }
            searchLabel="Search reports"
            searchPlaceholder="Report name, reference, module or owner"
            filterSummary={filterSummary}
            filterFields={filterFields}
            savedViews={savedViews}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="reports"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            betweenCards={
              <ReportBuilder
                build={build}
                dirty={builderDirty}
                onChange={(next) => {
                  setBuild(next);
                  setBuilderDirty(true);
                }}
                onReset={() => {
                  setBuild(initialBuild);
                  setBuilderDirty(false);
                  push('Builder reset');
                }}
                onSaveTemplate={() => openModal(null, 'template')}
                onRun={() => {
                  setBuilderDirty(false);
                  push(`${build.name || 'Report'} built with ${build.fields.length} columns`);
                }}
              />
            }
            summary={summary}
            bulkActions={bulkActions}
            selectionNoun="report"
            caption="Custom report register with module, category, owner, last run, schedule, formats, visibility and status"
            selectAllLabel="Select all reports"
            renderDetail={renderDetail}
            renderActions={rowActions}
            footerInfoSuffix="saved report register"
            emptyIcon="ti ti-file-off"
            emptyTitle="No reports match this view"
            emptyBody="Clear a filter, widen the module or switch what the register is showing."
            onRefresh={() => {
              setRows(seededReports);
              push('Register refreshed');
            }}
            onSaveView={() => openModal(null, 'template')}
            onToast={push}
            onResetExtra={() => setScope('all')}
          />
        </div>
      </div>
      {/* /Page Wrapper */}

      <CustomModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        row={modalRow}
        rows={workspace.visible}
        selected={rows.filter((row) => workspace.selected.includes(row.id))}
        panelOpen={panelOpen}
        onClosePanel={() => setPanelOpen(false)}
        onToast={push}
        onPublish={publish}
        onDuplicate={duplicate}
        onDelete={remove}
        onRename={rename}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="customReportsToasts" />
    </>
  );
};

export default CustomReports;
