import { useCallback, useMemo, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink,
  ExportMenu,
  PageHeader,
  WorkspaceShell,
  useWorkspace,
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
import ServiceModals, { toRowDate } from './modals/ServiceModals';
import type {
  CompletePayload, CostPayload, ServiceDraft, ServiceModalId, TechnicianPayload,
} from './modals/ServiceModals';
import type { MaintenanceType, ServiceRecord, ServiceStatus } from './data/services.data';
import {
  SCHEDULED_FROM, SCHEDULED_TO, SUMMARY_TOTALS, VIEW_TOTALS, assetPairsOf, auditOf,
  categoryOptions, costBandOf, costOptions, costPairsOf, cycleLabelOf,
  daysOverdueOf, daysSinceLastOf, dateKey, documentsOf, estimateOf, historyRowsOf,
  lineTotalOf, maintenancePairsOf, money, money0, nextServiceLabelOf, panelCostPairsOf,
  partLabelOf, partsTotalOf, placeOf, scheduleLabelOf, schedulePairsOf,
  scheduleTintOf, searchIndexOf, services as initialRows, statusBadge, statusOf,
  statusOptions, statusPill, technicianPairsOf, timelineOf, typeBadge, typeOptions,
  vendorOptions, warrantyBadgeOf, warrantyDateLabelOf, warrantyOptions, warrantyPairsOf,
  warrantyStateOf,
} from './data/services.data';

const routes = all_routes;

/**
 * Ids and options are the template's own; the two date fields open committed,
 * which is what puts chips on the rail at load.
 */
const filterFields: FilterField[] = [
  { id: 'asset-category', label: 'Asset Category', kind: 'select', chipLabel: 'Category', options: categoryOptions },
  { id: 'maintenance-type', label: 'Maintenance Type', kind: 'select', chipLabel: 'Type', options: typeOptions },
  { id: 'service-vendor', label: 'Service Vendor', kind: 'select', chipLabel: 'Vendor', options: vendorOptions },
  { id: 'maintenance-status', label: 'Maintenance Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  {
    id: 'scheduled-from', label: 'Scheduled From', kind: 'date', chipLabel: 'From',
    dateFormat: 'd-m-Y', initialValue: SCHEDULED_FROM,
  },
  {
    id: 'scheduled-to', label: 'Scheduled To', kind: 'date', chipLabel: 'To',
    dateFormat: 'd-m-Y', initialValue: SCHEDULED_TO,
  },
  { id: 'warranty-status', label: 'Warranty Status', kind: 'select', chipLabel: 'Warranty', allLabel: 'Any', options: warrantyOptions },
  { id: 'estimated-cost', label: 'Estimated Cost', kind: 'select', chipLabel: 'Cost', allLabel: 'Any', options: costOptions },
];

const sortOptions: SortOption[] = [
  { id: 'service', label: 'Service ID', icon: 'ti ti-hash' },
  { id: 'asset', label: 'Asset name (A–Z)', icon: 'ti ti-abc' },
  { id: 'scheduled', label: 'Scheduled date', icon: 'ti ti-calendar-event' },
  { id: 'cost', label: 'Estimated cost', icon: 'ti ti-currency-dollar' },
  { id: 'overdue', label: 'Days overdue', icon: 'ti ti-alert-triangle' },
];

const inputDateKey = (value: string): number => {
  const [day, month, year] = value.split('-').map(Number);
  return Number.isFinite(year) ? year * 10000 + month * 100 + day : 0;
};

/** A predicate for one derived status, used by the views, rail and strip. */
const isStatus = (status: ServiceStatus) => (row: ServiceRecord) => statusOf(row) === status;

const toNumber = (value: string, fallback = 0): number => {
  const parsed = Number(String(value).replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) && String(value).trim() !== '' ? parsed : fallback;
};

const AssetMaintenance = () => {
  const [rows, setRows] = useState<ServiceRecord[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<ServiceModalId | null>(null);
  const [modalRow, setModalRow] = useState<ServiceRecord | null>(null);
  const [panelRow, setPanelRow] = useState<ServiceRecord | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: ServiceRecord | null, modal: ServiceModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: ServiceRecord) => ServiceRecord, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<ServiceRecord>[]>(
    () => [
      {
        id: 'service',
        label: 'Service ID',
        sortable: true,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openModal(row, 'history')}>{row.id}</ActionLink>
        ),
      },
      {
        id: 'asset',
        label: 'Asset',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className={`avatar avatar-md bg-${row.tint}-transparent text-${row.tint} rounded flex-shrink-0 me-2`}>
              <i className={row.icon} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'history')}>{row.assetName}</ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">{row.model}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'asset-id',
        label: 'Asset ID',
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.assetId}</span>
            <span className="fs-12 text-muted text-nowrap">{row.category}</span>
          </>
        ),
      },
      {
        id: 'type',
        label: 'Maintenance Type',
        sortable: true,
        render: (row) => (
          <>
            <span className={typeBadge[row.type]}>{row.type}</span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{row.summary}</span>
          </>
        ),
      },
      {
        id: 'scheduled',
        label: 'Scheduled Date',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.scheduled}</span>
            {/* Completed, held, started, overdue or due soon — one derivation. */}
            <span className={`fs-12 text-nowrap ${scheduleTintOf(row)}`}>{scheduleLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'vendor',
        label: 'Service Vendor',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="avatar avatar-md bg-secondary-transparent text-secondary rounded flex-shrink-0 me-2">
              <i className="ti ti-building-store" />
            </span>
            <div>
              <span className="dt-name">{row.vendor}</span>
              <div className="dt-sub flex-nowrap text-nowrap">{row.contract}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'cost',
        label: 'Estimated Cost',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 fw-semibold text-nowrap">{money(estimateOf(row))}</span>
            <span className="fs-12 text-muted text-nowrap">Parts {money(partsTotalOf(row))}</span>
          </>
        ),
      },
      {
        id: 'last',
        label: 'Last Service',
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.lastService}</span>
            <span className="fs-12 text-muted text-nowrap">{daysSinceLastOf(row)} days ago</span>
          </>
        ),
      },
      {
        id: 'next',
        label: 'Next Service',
        sortable: true,
        render: (row) => (
          <>
            <span className={`d-block fs-13 text-nowrap ${row.nextService ? '' : 'text-muted'}`}>
              {nextServiceLabelOf(row)}
            </span>
            <span className={`fs-12 text-nowrap ${row.nextService ? 'text-muted' : 'text-warning'}`}>
              {cycleLabelOf(row)}
            </span>
          </>
        ),
      },
      {
        id: 'status',
        label: 'Status',
        render: (row) => (
          <span className={`dt-pill ${statusPill[statusOf(row)]}`}>
            <span className="dt-pill-dot" />{statusOf(row)}
          </span>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<ServiceRecord>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['asset-category'] && row.category !== filters['asset-category']) return false;
      if (filters['maintenance-type'] && row.type !== filters['maintenance-type']) return false;
      if (filters['service-vendor'] && row.vendor !== filters['service-vendor']) return false;
      if (filters['maintenance-status'] && statusOf(row) !== filters['maintenance-status']) return false;
      if (filters['scheduled-from']
        && dateKey(row.scheduled) < inputDateKey(filters['scheduled-from'])) return false;
      if (filters['scheduled-to']
        && dateKey(row.scheduled) > inputDateKey(filters['scheduled-to'])) return false;
      if (filters['warranty-status'] && warrantyStateOf(row) !== filters['warranty-status']) return false;
      if (filters['estimated-cost'] && costBandOf(row) !== filters['estimated-cost']) return false;
      return true;
    },
    /** The rail opens on All, which narrows nothing. */
    quickMatch: (row, quick) => (!quick || quick === 'all' ? true : statusOf(row) === quick),
    viewMatch: (row, view) => {
      switch (view) {
        case 'month': return statusOf(row) === 'Scheduled';
        case 'overdue': return statusOf(row) === 'Overdue';
        case 'preventive': return row.type === 'Preventive Maintenance';
        case 'out': return statusOf(row) === 'Out of Service';
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'asset':
          return a.assetName.localeCompare(b.assetName);
        case 'scheduled':
          return dateKey(a.scheduled) - dateKey(b.scheduled) || a.id.localeCompare(b.id);
        case 'cost':
          return estimateOf(b) - estimateOf(a) || a.id.localeCompare(b.id);
        case 'overdue':
          return daysOverdueOf(b) - daysOverdueOf(a) || a.id.localeCompare(b.id);
        // The `<th>`s sort on columns the menu does not offer.
        case 'type':
          return a.type.localeCompare(b.type);
        case 'vendor':
          return a.vendor.localeCompare(b.vendor);
        case 'next':
          return (dateKey(a.nextService) || Number.MAX_SAFE_INTEGER)
            - (dateKey(b.nextService) || Number.MAX_SAFE_INTEGER);
        case 'service':
        default:
          return a.id.localeCompare(b.id);
      }
    },
    defaultSort: 'service',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: ServiceRecord) => boolean) => rows.filter(test).length,
    [rows],
  );

  /** Template total − what it seeded + what the roster holds now. */
  const shift = useCallback(
    (base: number, test: (row: ServiceRecord) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Services', icon: 'ti ti-layout-list', count: shift(VIEW_TOTALS.all, () => true) },
      {
        id: 'month', label: 'Scheduled This Month', icon: 'ti ti-calendar-event',
        count: shift(VIEW_TOTALS.thisMonth, isStatus('Scheduled')),
      },
      { id: 'overdue', label: 'Overdue Services', icon: 'ti ti-alert-triangle', count: shift(VIEW_TOTALS.overdue, isStatus('Overdue')) },
      {
        id: 'preventive', label: 'Preventive Only', icon: 'ti ti-shield-check',
        count: shift(VIEW_TOTALS.preventive, (row) => row.type === 'Preventive Maintenance'),
      },
      { id: 'out', label: 'Out of Service', icon: 'ti ti-tools-off', count: shift(VIEW_TOTALS.outOfService, isStatus('Out of Service')) },
    ],
    [shift],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: shift(VIEW_TOTALS.all, () => true) },
      { id: 'Scheduled', label: 'Scheduled', icon: 'ti ti-calendar-event', count: shift(SUMMARY_TOTALS.scheduled, isStatus('Scheduled')) },
      { id: 'In Progress', label: 'In Progress', icon: 'ti ti-progress', count: shift(SUMMARY_TOTALS.inProgress, isStatus('In Progress')) },
      { id: 'Completed', label: 'Completed', icon: 'ti ti-circle-check', count: shift(SUMMARY_TOTALS.completed, isStatus('Completed')) },
      { id: 'Overdue', label: 'Overdue', icon: 'ti ti-alert-triangle', count: shift(SUMMARY_TOTALS.overdue, isStatus('Overdue')) },
      { id: 'Out of Service', label: 'Out of Service', icon: 'ti ti-tools-off', count: shift(SUMMARY_TOTALS.outOfService, isStatus('Out of Service')) },
    ],
    [shift],
  );

  /**
   * The strip counts the whole service register — 239 records against the eight
   * this page lists — so the template's figures stand and the roster moves them.
   * The oldest-overdue hint is the one figure the page can compute honestly.
   */
  const summary = useMemo<SummaryItem[]>(() => {
    const oldest = rows.reduce((worst, row) => Math.max(worst, daysOverdueOf(row)), 0);
    const onSite = countBy(isStatus('In Progress'));
    return [
      {
        id: 'scheduled', tint: 'primary', icon: 'ti ti-calendar-event', label: 'Scheduled Services',
        value: String(shift(SUMMARY_TOTALS.scheduled, isStatus('Scheduled'))), hint: 'next 30 days',
      },
      {
        id: 'progress', tint: 'info', icon: 'ti ti-progress', label: 'In Progress',
        value: String(shift(SUMMARY_TOTALS.inProgress, isStatus('In Progress'))),
        hint: onSite === 1 ? 'technician on site' : `${onSite} technicians on site`,
      },
      {
        id: 'completed', tint: 'success', icon: 'ti ti-circle-check', label: 'Completed',
        value: String(shift(SUMMARY_TOTALS.completed, isStatus('Completed'))), hint: '2026 / 2027 to date',
      },
      {
        id: 'overdue', tint: 'danger', icon: 'ti ti-alert-triangle', label: 'Overdue Services',
        value: String(shift(SUMMARY_TOTALS.overdue, isStatus('Overdue'))),
        hint: oldest > 0 ? `oldest ${oldest} days late` : 'nothing outstanding',
      },
      {
        id: 'out', tint: 'warning', icon: 'ti ti-tools-off', label: 'Out of Service',
        value: String(shift(SUMMARY_TOTALS.outOfService, isStatus('Out of Service'))),
        hint: 'awaiting parts or decision',
      },
    ];
  }, [countBy, rows, shift]);

  /* -------------------------------- Mutations ------------------------------- */

  const scheduleService = useCallback(
    (draft: ServiceDraft) => {
      if (!draft.asset) {
        push('Pick the asset to service', 'warning');
        return;
      }
      const [assetName, assetId] = draft.asset.split('·').map((part) => part.trim());
      const [technicianName, technicianId] = draft.technician === 'Assign later'
        ? ['Not assigned', 'Pending']
        : draft.technician.split('·').map((part) => part.trim());
      const scheduled = toRowDate(draft.scheduled);
      const id = `SRV-2026-04${54 + rows.length}`;
      const cycleMonths = draft.cycle === 'Quarterly' ? 3
        : draft.cycle === 'Half yearly' ? 6 : draft.cycle === 'Annual' ? 12 : 0;
      const nextService = cycleMonths === 0 ? '' : (() => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const [day, month, year] = draft.scheduled.split('-').map(Number);
        const moved = new Date(Date.UTC(year, month - 1 + cycleMonths, day));
        return `${moved.getUTCDate()} ${monthNames[moved.getUTCMonth()]} ${moved.getUTCFullYear()}`;
      })();
      setRows((current) => [
        {
          id, assetId, assetName, icon: 'ti ti-tool', tint: 'primary',
          model: assetName, category: 'IT Equipment',
          location: 'Main Block', spot: 'Store', custodian: 'Estates Office',
          type: draft.type as MaintenanceType,
          summary: draft.summary.trim() || `${draft.type} · ${draft.cycle.toLowerCase()}`,
          scheduled, lastService: scheduled, nextService,
          vendor: draft.vendor, contract: 'Pay per call · no contract',
          technician: {
            name: technicianName, role: 'Field Service Technician',
            id: technicianId ?? 'Pending', contact: 'Not recorded',
          },
          specialisation: 'Computer hardware',
          labour: toNumber(draft.estimate), consumables: 0, callOut: 0, parts: [],
          actualCost: null,
          completedOn: '', startedOn: '', onHold: false, holdReason: '',
          purchasedOn: scheduled, purchaseValue: 0,
          warrantyUntil: scheduled, warrantyTerm: 'as quoted',
          warrantyNote: 'Cover to be confirmed against the purchase order.',
          costCentre: draft.costCentre, priority: draft.priority,
          pastServices: [], lifetimeServices: 1, lifetimeSpend: toNumber(draft.estimate),
          uptime: '100%', observations: [],
          notes: draft.notes.trim() || 'Raised from the maintenance register.',
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} scheduled for ${scheduled}`);
    },
    [push, rows.length],
  );

  const updateService = useCallback(
    (draft: ServiceDraft) =>
      patchRow(
        (row) => ({
          ...row,
          type: draft.type as MaintenanceType,
          summary: draft.summary.trim() || row.summary,
          scheduled: toRowDate(draft.scheduled),
          vendor: draft.vendor,
          // Re-estimating moves the labour line; the parts stay as recorded.
          labour: Math.max(
            0,
            toNumber(draft.estimate, estimateOf(row)) - partsTotalOf(row) - row.consumables - row.callOut,
          ),
          costCentre: draft.costCentre,
          priority: draft.priority,
          notes: draft.notes.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Service'} updated`,
      ),
    [modalRow, patchRow],
  );

  /** Completing closes the record, which is what flips the pill to Completed. */
  const completeService = useCallback(
    (payload: CompletePayload) => {
      const completed = toRowDate(payload.completedOn);
      patchRow(
        (row) => ({
          ...row,
          completedOn: completed,
          startedOn: row.startedOn || completed,
          onHold: payload.backInService ? false : row.onHold,
          holdReason: payload.backInService ? '' : row.holdReason,
          actualCost: toNumber(payload.actualCost, estimateOf(row)),
          lastService: completed,
          nextService: payload.nextService ? toRowDate(payload.nextService) : row.nextService,
          pastServices: [
            {
              id: row.id, title: payload.work.trim() || `${row.type} completed`, date: completed,
              type: row.type, vendor: row.vendor,
              cost: toNumber(payload.actualCost, estimateOf(row)), outcome: payload.outcome,
            },
            ...row.pastServices,
          ],
          lifetimeServices: row.lifetimeServices + 1,
          lifetimeSpend: row.lifetimeSpend + toNumber(payload.actualCost, estimateOf(row)),
        }),
        `${modalRow?.id ?? 'Service'} completed — ${payload.outcome.toLowerCase()} on ${completed}`,
      );
    },
    [modalRow, patchRow],
  );

  const assignTechnician = useCallback(
    (payload: TechnicianPayload) => {
      const [name, id] = payload.technician.split('·').map((part) => part.trim());
      const visit = toRowDate(payload.visitDate);
      patchRow(
        (row) => ({
          ...row,
          technician: { ...row.technician, name, id: id ?? row.technician.id },
          specialisation: payload.specialisation,
          scheduled: visit,
        }),
        `${name} assigned to ${modalRow?.id ?? 'the service'} on ${visit}`,
      );
    },
    [modalRow, patchRow],
  );

  /** The recorded cost is the three lines added up, which sets the variance. */
  const recordCost = useCallback(
    (payload: CostPayload) => {
      const actual = toNumber(payload.labour) + toNumber(payload.parts) + toNumber(payload.consumables);
      patchRow(
        (row) => ({
          ...row,
          actualCost: Number(actual.toFixed(2)),
          costCentre: payload.costCentre,
          notes: payload.reason.trim() || row.notes,
        }),
        `${money(actual)} recorded against ${modalRow?.id ?? 'the service'}`,
      );
    },
    [modalRow, patchRow],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} service records exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: ServiceRecord) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="Service history" onClick={() => openModal(row, 'history')}>
        <i className="ti ti-history" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit maintenance" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Complete service" onClick={() => openModal(row, 'complete')}>
        <i className="ti ti-circle-check" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Assign technician" onClick={() => openModal(row, 'technician')}>
        <i className="ti ti-user-cog" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Record cost" onClick={() => openModal(row, 'cost')}>
        <i className="ti ti-receipt" />
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

  /** The expander's last card offers whatever this record's state calls for. */
  const primaryAction = (row: ServiceRecord) => {
    const status = statusOf(row);
    if (status === 'Completed') {
      return { modal: 'cost' as ServiceModalId, icon: 'ti ti-receipt', label: 'Record Cost' };
    }
    if (status === 'In Progress' || status === 'Overdue') {
      return { modal: 'complete' as ServiceModalId, icon: 'ti ti-circle-check', label: 'Complete Service' };
    }
    return { modal: 'technician' as ServiceModalId, icon: 'ti ti-user-cog', label: 'Assign Technician' };
  };

  const renderDetail = (row: ServiceRecord) => {
    const primary = primaryAction(row);
    const warranty = warrantyBadgeOf(row);
    return (
      <div className="row g-4">
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-package text-primary me-1" />Asset Information</h6>
          {pairList(assetPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-calendar-event text-info me-1" />Maintenance Schedule</h6>
          {pairList(schedulePairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-tool text-warning me-1" />Service History</h6>
          {row.pastServices.length === 0 ? (
            <p className="fs-13 text-muted mb-0">No service recorded against this asset yet.</p>
          ) : (
            // The two most recent; the Service History dialog shows the rest.
            row.pastServices.slice(0, 2).map((entry) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${entry.id}-${entry.date}`}>
                <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
                  <i className="ti ti-tool" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
                  <span className="fs-12 text-muted text-truncate d-block">
                    {entry.date} · {entry.cost === null ? entry.note ?? 'no cost' : money0(entry.cost)} · {entry.vendor}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-settings-cog text-purple me-1" />Spare Parts Used</h6>
          {row.parts.length === 0 ? (
            <p className="fs-13 text-muted mb-0">No parts on this job sheet.</p>
          ) : (
            <>
              {row.parts.map((part) => (
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={part.name}>
                  <span className="avatar avatar-sm bg-purple-transparent text-purple rounded flex-shrink-0">
                    <i className="ti ti-settings-cog" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0 text-truncate">{part.name}</h6>
                    <span className="fs-12 text-muted text-truncate d-block">{partLabelOf(part)}</span>
                  </div>
                  <span className="fs-13 fw-medium text-nowrap">{money(lineTotalOf(part))}</span>
                </div>
              ))}
              <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top">
                <span className="fs-13 fw-medium">Parts Total</span>
                <span className="fs-13 fw-semibold">{money(partsTotalOf(row))}</span>
              </div>
            </>
          )}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-user-cog text-success me-1" />Technician Details</h6>
          {pairList(technicianPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-receipt text-danger me-1" />Cost Breakdown</h6>
          {pairList(costPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-shield-check text-info me-1" />Warranty Status</h6>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
            <span className={`badge badge-soft-${warranty.tint}`}>{warranty.label}</span>
            <span className="badge badge-soft-secondary">{warrantyDateLabelOf(row)}</span>
          </div>
          {pairList(warrantyPairsOf(row))}
          <p className="fs-13 text-muted mb-0 mt-2">{row.warrantyNote}</p>
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-note text-secondary me-1" />Internal Notes</h6>
          <p className="fs-13 text-muted mb-3">{row.notes}</p>
          <div className="d-flex align-items-center flex-wrap gap-2">
            <button
              type="button" className="btn btn-primary btn-sm"
              onClick={() => openModal(row, primary.modal)}
            >
              <i className={`${primary.icon} me-1`} />{primary.label}
            </button>
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm"
              onClick={() => openModal(row, 'history')}
            >
              <i className="ti ti-history me-1" />Service History
            </button>
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm"
              onClick={() => setPanelRow(row)}
            >
              <i className="ti ti-tool me-1" />Maintenance Panel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Asset Maintenance"
            section="Assets"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(rows.find((row) => row.completedOn) ?? rows[0] ?? null, 'cost')}
                  >
                    <i className="ti ti-receipt me-2" />Record Cost
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Print Service Register" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'schedule')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Schedule Maintenance
                  </ActionLink>
                </div>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={VIEW_TOTALS.all - initialRows.length + rows.length}
            summary={summary}
            footerVariant="card-foot"
            pageSizeOptions={[8, 25, 50, 100]}
            workspaceId="amWorkspace"
            searchPlaceholder="Search asset, service ID or vendor…"
            searchLabel="Search service records"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="service records"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Service register refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-tools-off"
            emptyTitle="No service records match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Maintenance Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Maintenance Details"
            labelledById="am_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Asset Details</h6>
                <div className="d-flex align-items-center mb-3">
                  <span
                    className={`avatar avatar-lg bg-${panelRow.tint}-transparent text-${panelRow.tint} rounded flex-shrink-0`}
                  >
                    <i className={`${panelRow.icon} fs-20`} />
                  </span>
                  <div className="ms-2 overflow-hidden">
                    <h6 className="mb-0 text-truncate">{panelRow.assetName}</h6>
                    <span className="fs-12 text-muted">{panelRow.assetId} · {panelRow.id}</span>
                  </div>
                  <span className={`${statusBadge[statusOf(panelRow)]} ms-auto`}>{statusOf(panelRow)}</span>
                </div>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Category', value: panelRow.category },
                    { label: 'Model', value: panelRow.model },
                    { label: 'Location', value: placeOf(panelRow) },
                    { label: 'Custodian', value: panelRow.custodian },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Maintenance Information</h6>
                <div className="border rounded p-3 mb-3">{pairList(maintenancePairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Vendor Details</h6>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
                  <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                    <i className="ti ti-building-store" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0 text-truncate">{panelRow.vendor}</h6>
                    <span className="fs-12 text-muted text-truncate d-block">{panelRow.contract}</span>
                  </div>
                  <span className="badge badge-soft-success">
                    {/AMC-/i.test(panelRow.contract) ? 'On contract' : 'Pay per call'}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                  <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
                    <i className="ti ti-user-cog" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0 text-truncate">{panelRow.technician.name}</h6>
                    <span className="fs-12 text-muted text-truncate d-block">
                      {panelRow.technician.id} · {panelRow.technician.contact}
                    </span>
                  </div>
                </div>

                <h6 className="fs-14 mb-2">Service Timeline</h6>
                {timelineOf(panelRow).map((entry) => (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${entry.title}-${entry.meta}`}>
                    <span className={`avatar avatar-sm bg-${entry.tint}-transparent text-${entry.tint} rounded flex-shrink-0`}>
                      <i className={entry.icon} />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
                      <span className="fs-12 text-muted text-truncate d-block">{entry.meta}</span>
                    </div>
                  </div>
                ))}

                <h6 className="fs-14 mb-2 mt-3">Cost Summary</h6>
                <div className="border rounded p-3 mb-3">{pairList(panelCostPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Attached Documents</h6>
                {documentsOf(panelRow).map((document) => (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={document.name}>
                    <span className="avatar avatar-sm bg-danger-transparent text-danger rounded flex-shrink-0">
                      <i className="ti ti-file-type-pdf" />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0 text-truncate">{document.name}</h6>
                      <span className="fs-12 text-muted text-truncate d-block">{document.meta}</span>
                    </div>
                    <ActionLink
                      className="dt-ib" ariaLabel="Download document"
                      onClick={() => push(`${document.name} downloaded`, 'info')}
                    >
                      <i className="ti ti-download" />
                    </ActionLink>
                  </div>
                ))}

                <h6 className="fs-14 mb-2 mt-3">Audit History</h6>
                {auditOf(panelRow).map((entry) => (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${entry.title}-${entry.meta}`}>
                    <span className={`avatar avatar-sm bg-${entry.tint}-transparent text-${entry.tint} rounded flex-shrink-0`}>
                      <i className={entry.icon} />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
                      <span className="fs-12 text-muted text-truncate d-block">{entry.meta}</span>
                    </div>
                  </div>
                ))}

                <p className="fs-12 text-muted mb-0 mt-2">
                  {historyRowsOf(panelRow).length} records on file · {panelRow.uptime} uptime
                </p>

                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'complete'); }}
                  >
                    <i className="ti ti-circle-check me-1" />Complete Service
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'edit'); }}
                  >
                    <i className="ti ti-edit me-1" />Edit
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <ServiceModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onSchedule={scheduleService}
        onUpdate={updateService}
        onComplete={completeService}
        onAssign={assignTechnician}
        onRecordCost={recordCost}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="amToasts" />
    </>
  );
};

export default AssetMaintenance;
