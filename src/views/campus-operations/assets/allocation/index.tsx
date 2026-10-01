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
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import AllocationModals, { toRowDate } from './modals/AllocationModals';
import type {
  AllocationDraft, AllocationModalId, DamagePayload, ReturnPayload, TransferPayload,
} from './modals/AllocationModals';
import type { AllocationStatus, Allocation, Condition, Department } from './data/allocations.data';
import {
  ALLOCATED_FROM, ALLOCATED_TO, SUMMARY_TOTALS, VIEW_TOTALS, allocateToOptions,
  allocations as initialRows, approvalPairsOf, assetLineOf, assetPairsOf, assigneePairsOf,
  auditOf, categoryOptions, categoryTint, checkedOnOf, conditionOptions, conditionPairsOf,
  conditionTint, dateKey, daysOverdueOf, departmentOptions, departmentTint, dueLabelOf,
  dueTintOf, expectedLabelOf, heldForOf, heldLabelOf, matchesReturnDue, panelAssetPairsOf,
  placeOf, returnDueOptions, returnPairsOf, schedulePairsOf, searchIndexOf, statusBadge,
  statusOf, statusOptions, statusPill, typeBadge, unitLineOf,
} from './data/allocations.data';

const routes = all_routes;

/**
 * Ids and options are the template's own; the two date fields open committed,
 * which is what puts chips on the rail at load.
 */
const filterFields: FilterField[] = [
  { id: 'asset-category', label: 'Asset Category', kind: 'select', chipLabel: 'Category', options: categoryOptions },
  { id: 'allocate-to', label: 'Allocate To', kind: 'select', chipLabel: 'Allocated to', options: allocateToOptions },
  { id: 'department', label: 'Department', kind: 'select', chipLabel: 'Dept', options: departmentOptions },
  { id: 'allocation-status', label: 'Allocation Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  {
    id: 'allocated-from', label: 'Allocated From', kind: 'date', chipLabel: 'From',
    dateFormat: 'd-m-Y', initialValue: ALLOCATED_FROM,
  },
  {
    id: 'allocated-to-date', label: 'Allocated To Date', kind: 'date', chipLabel: 'To',
    dateFormat: 'd-m-Y', initialValue: ALLOCATED_TO,
  },
  { id: 'condition', label: 'Condition', kind: 'select', chipLabel: 'Condition', options: conditionOptions },
  { id: 'return-due', label: 'Return Due', kind: 'select', chipLabel: 'Due', allLabel: 'Any', options: returnDueOptions },
];

const sortOptions: SortOption[] = [
  { id: 'allocation', label: 'Allocation ID', icon: 'ti ti-hash' },
  { id: 'asset', label: 'Asset name (A–Z)', icon: 'ti ti-abc' },
  { id: 'assignee', label: 'Allocated to', icon: 'ti ti-user' },
  { id: 'allocated', label: 'Allocated date', icon: 'ti ti-calendar-event' },
  { id: 'overdue', label: 'Days overdue', icon: 'ti ti-alert-triangle' },
];

/** "01-01-2026" → the sortable key the rows use. */
const inputDateKey = (value: string): number => {
  const [day, month, year] = value.split('-').map(Number);
  return Number.isFinite(year) ? year * 10000 + month * 100 + day : 0;
};

/** A predicate for one derived status, used by the views, rail and strip. */
const isStatus = (status: AllocationStatus) => (row: Allocation) => statusOf(row) === status;

const toNumber = (value: string, fallback = 0): number => {
  const parsed = Number(String(value).replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) && String(value).trim() !== '' ? parsed : fallback;
};

const AssetAllocation = () => {
  const [rows, setRows] = useState<Allocation[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<AllocationModalId | null>(null);
  const [modalRow, setModalRow] = useState<Allocation | null>(null);
  const [panelRow, setPanelRow] = useState<Allocation | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Allocation | null, modal: AllocationModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: Allocation) => Allocation, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Allocation>[]>(
    () => [
      {
        id: 'allocation',
        label: 'Allocation ID',
        sortable: true,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>{row.id}</ActionLink>
        ),
      },
      {
        id: 'asset',
        label: 'Asset',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span
              className={`avatar avatar-md bg-${categoryTint[row.category]}-transparent text-${categoryTint[row.category]} rounded flex-shrink-0 me-2`}
            >
              <i className={row.icon} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.assetName}</ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">{assetLineOf(row)}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'asset-id',
        label: 'Asset ID',
        cellClassName: 'fs-13 text-nowrap',
        render: (row) => row.assetId,
      },
      {
        id: 'category',
        label: 'Category',
        sortable: true,
        render: (row) => (
          <span className={`badge badge-soft-${categoryTint[row.category]}`}>{row.category}</span>
        ),
      },
      {
        id: 'assignee',
        label: 'Allocated To',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            {row.assignee.avatar ? (
              <span className="dt-avatar">
                <ImageWithBasePath src={row.assignee.avatar} alt={row.assignee.name} />
              </span>
            ) : (
              <span
                className={`avatar avatar-md bg-${row.assignee.tint ?? 'primary'}-transparent text-${row.assignee.tint ?? 'primary'} rounded flex-shrink-0 me-2`}
              >
                <i className={row.assignee.icon ?? 'ti ti-user'} />
              </span>
            )}
            <div>
              <span className="dt-name">{row.assignee.name}</span>
              <div className="dt-sub flex-nowrap text-nowrap">{row.assignee.reference}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'department',
        label: 'Department / Class',
        sortable: true,
        render: (row) => (
          <>
            <span className={`badge badge-soft-${departmentTint[row.department]}`}>{row.department}</span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{placeOf(row)}</span>
          </>
        ),
      },
      {
        id: 'allocated',
        label: 'Allocated Date',
        sortable: true,
        cellClassName: 'fs-13 text-nowrap',
        render: (row) => row.allocatedOn,
      },
      {
        id: 'expected',
        label: 'Expected Return',
        sortable: true,
        render: (row) => (
          <>
            <span className={`d-block fs-13 text-nowrap ${row.expectedReturn ? '' : 'text-muted'}`}>
              {expectedLabelOf(row)}
            </span>
            {/* Returned, overdue, due soon or permanent — one derivation. */}
            <span className={`fs-12 text-nowrap ${dueTintOf(row)}`}>{dueLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'status',
        label: 'Current Status',
        render: (row) => (
          <span className={`dt-pill ${statusPill[statusOf(row)]}`}>
            <span className="dt-pill-dot" />{statusOf(row)}
          </span>
        ),
      },
      {
        id: 'condition',
        label: 'Condition',
        render: (row) => (
          <span className={`badge badge-soft-${conditionTint[row.condition]}`}>{row.condition}</span>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Allocation>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['asset-category'] && row.category !== filters['asset-category']) return false;
      if (filters['allocate-to'] && row.assignee.type !== filters['allocate-to']) return false;
      if (filters.department && row.department !== filters.department) return false;
      if (filters['allocation-status'] && statusOf(row) !== filters['allocation-status']) return false;
      if (filters['allocated-from']
        && dateKey(row.allocatedOn) < inputDateKey(filters['allocated-from'])) return false;
      if (filters['allocated-to-date']
        && dateKey(row.allocatedOn) > inputDateKey(filters['allocated-to-date'])) return false;
      if (filters.condition && row.condition !== filters.condition) return false;
      if (filters['return-due'] && !matchesReturnDue(row, filters['return-due'])) return false;
      return true;
    },
    /** The rail opens on All, which narrows nothing. */
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'Active') return statusOf(row) === 'Active';
      if (quick === 'Returned') return statusOf(row) === 'Returned';
      if (quick === 'Pending') return statusOf(row) === 'Pending Return';
      return statusOf(row) === 'Overdue Return';
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'active': return statusOf(row) === 'Active';
        case 'overdue': return statusOf(row) === 'Overdue Return';
        case 'students': return row.assignee.type === 'Student';
        case 'damage': return row.damage !== null;
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'asset':
          return a.assetName.localeCompare(b.assetName);
        case 'assignee':
          return a.assignee.name.localeCompare(b.assignee.name);
        case 'allocated':
          return dateKey(b.allocatedOn) - dateKey(a.allocatedOn) || a.id.localeCompare(b.id);
        case 'overdue':
          return daysOverdueOf(b) - daysOverdueOf(a) || a.id.localeCompare(b.id);
        // The `<th>`s sort on columns the menu does not offer.
        case 'category':
          return a.category.localeCompare(b.category);
        case 'department':
          return a.department.localeCompare(b.department);
        case 'expected':
          return (dateKey(a.expectedReturn) || Number.MAX_SAFE_INTEGER)
            - (dateKey(b.expectedReturn) || Number.MAX_SAFE_INTEGER);
        case 'allocation':
        default:
          return a.id.localeCompare(b.id);
      }
    },
    defaultSort: 'allocation',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: Allocation) => boolean) => rows.filter(test).length,
    [rows],
  );

  /** Template total − what it seeded + what the roster holds now. */
  const shift = useCallback(
    (base: number, test: (row: Allocation) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Allocations', icon: 'ti ti-layout-list', count: shift(VIEW_TOTALS.all, () => true) },
      { id: 'active', label: 'Active Allocations', icon: 'ti ti-circle-check', count: shift(VIEW_TOTALS.active, isStatus('Active')) },
      { id: 'overdue', label: 'Overdue Returns', icon: 'ti ti-alert-triangle', count: shift(VIEW_TOTALS.overdue, isStatus('Overdue Return')) },
      {
        id: 'students', label: 'Student Loans', icon: 'ti ti-school',
        count: shift(VIEW_TOTALS.studentLoans, (row) => row.assignee.type === 'Student'),
      },
      {
        id: 'damage', label: 'Damage Reported', icon: 'ti ti-tools',
        count: shift(VIEW_TOTALS.damage, (row) => row.damage !== null),
      },
    ],
    [shift],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: shift(SUMMARY_TOTALS.total, () => true) },
      { id: 'Active', label: 'Active', icon: 'ti ti-circle-check', count: shift(SUMMARY_TOTALS.active, isStatus('Active')) },
      { id: 'Returned', label: 'Returned', icon: 'ti ti-arrow-back-up', count: shift(SUMMARY_TOTALS.returned, isStatus('Returned')) },
      { id: 'Pending', label: 'Pending', icon: 'ti ti-clock', count: shift(SUMMARY_TOTALS.pending, isStatus('Pending Return')) },
      { id: 'Overdue', label: 'Overdue', icon: 'ti ti-alert-triangle', count: shift(SUMMARY_TOTALS.overdue, isStatus('Overdue Return')) },
    ],
    [shift],
  );

  /**
   * The strip counts the whole allocation register — 312 records against the
   * eight this page lists — so the template's figures stand and the roster moves
   * them. The one figure the page can compute honestly is the oldest overdue,
   * which it takes from its own rows.
   */
  const summary = useMemo<SummaryItem[]>(() => {
    const total = shift(SUMMARY_TOTALS.total, () => true);
    const active = shift(SUMMARY_TOTALS.active, isStatus('Active'));
    const oldest = rows.reduce((worst, row) => Math.max(worst, daysOverdueOf(row)), 0);
    return [
      {
        id: 'total', tint: 'primary', icon: 'ti ti-clipboard-list', label: 'Total Allocations',
        value: String(total), hint: SUMMARY_TOTALS.year,
      },
      {
        id: 'active', tint: 'success', icon: 'ti ti-circle-check', label: 'Active Allocations',
        value: String(active),
        hint: `${total === 0 ? 0 : Math.round((active / total) * 100)}% of the register`,
      },
      {
        id: 'returned', tint: 'info', icon: 'ti ti-arrow-back-up', label: 'Returned Assets',
        value: String(shift(SUMMARY_TOTALS.returned, isStatus('Returned'))),
        hint: SUMMARY_TOTALS.averageHeld,
      },
      {
        id: 'pending', tint: 'warning', icon: 'ti ti-clock', label: 'Pending Returns',
        value: String(shift(SUMMARY_TOTALS.pending, isStatus('Pending Return'))),
        hint: 'due within 30 days',
      },
      {
        id: 'overdue', tint: 'danger', icon: 'ti ti-alert-triangle', label: 'Overdue Returns',
        value: String(shift(SUMMARY_TOTALS.overdue, isStatus('Overdue Return'))),
        hint: oldest > 0 ? `oldest ${oldest} days late` : 'nothing outstanding',
      },
    ];
  }, [rows, shift]);

  /* -------------------------------- Mutations ------------------------------- */

  const allocateAsset = useCallback(
    (draft: AllocationDraft) => {
      if (!draft.asset) {
        push('Pick the asset to allocate', 'warning');
        return;
      }
      const [assetName, assetId] = draft.asset.split('·').map((part) => part.trim());
      const [name, , form] = draft.assignee.split('·').map((part) => part.trim());
      const id = `ALL-2026-03${57 + rows.length}`;
      const allocatedOn = toRowDate(draft.allocatedDate);
      setRows((current) => [
        {
          id, assetId, assetName, icon: 'ti ti-package',
          model: assetName, serial: 'Not recorded',
          units: Math.max(1, toNumber(draft.units, 1)),
          category: 'IT Equipment',
          assignee: {
            name,
            reference: form ? `${draft.department} · ${form}` : draft.department,
            type: draft.target as Allocation['assignee']['type'],
            icon: draft.target === 'Department' ? 'ti ti-building'
              : draft.target === 'Classroom' ? 'ti ti-school' : 'ti ti-user',
            tint: draft.target === 'Department' ? 'info' : 'primary',
          },
          department: draft.department as Department,
          location: draft.location, spot: draft.spot.trim() || 'Store',
          allocatedOn,
          expectedReturn: draft.expectedReturn ? toRowDate(draft.expectedReturn) : '',
          actualReturn: '',
          condition: draft.condition as Condition,
          damage: null,
          history: [{ title: `Allocated to ${name}`, meta: `${allocatedOn} · ${draft.location}` }],
          conditionNote: `Issued in ${draft.condition.toLowerCase()} condition.`,
          requestedBy: name, approvedBy: draft.approvedBy, approvedOn: allocatedOn,
          requestRef: draft.requestRef.trim() || 'Not recorded',
          approvalRoute: 'Department head → Estates',
          documents: draft.handover
            ? [{ name: 'Handover Form.pdf', meta: `${allocatedOn} · awaiting signature` }]
            : [],
          notes: draft.notes.trim() || 'Allocated from the allocation register.',
          lastVerified: allocatedOn, nextVerification: allocatedOn,
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} allocated to ${name}`);
    },
    [push, rows.length],
  );

  const updateAllocation = useCallback(
    (draft: AllocationDraft) =>
      patchRow(
        (row) => ({
          ...row,
          units: Math.max(1, toNumber(draft.units, row.units)),
          department: draft.department as Department,
          location: draft.location,
          spot: draft.spot.trim() || row.spot,
          allocatedOn: toRowDate(draft.allocatedDate),
          expectedReturn: draft.expectedReturn ? toRowDate(draft.expectedReturn) : '',
          condition: draft.condition as Condition,
          approvedBy: draft.approvedBy,
          requestRef: draft.requestRef.trim() || row.requestRef,
          notes: draft.notes.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Allocation'} updated`,
      ),
    [modalRow, patchRow],
  );

  /** A return closes the span, which is what flips the status to Returned. */
  const returnAsset = useCallback(
    (payload: ReturnPayload) => {
      const returned = toRowDate(payload.returnDate);
      patchRow(
        (row) => ({
          ...row,
          actualReturn: returned,
          condition: payload.condition as Condition,
          // A returned asset is back in the store, so any damage flag is closed with it.
          damage: null,
          history: [
            ...row.history,
            {
              title: `${payload.units} of ${row.units} returned to ${payload.returnTo}`,
              meta: `${returned} · ${payload.receivedBy}`,
            },
          ],
          conditionNote: payload.remarks.trim() || row.conditionNote,
          lastVerified: returned,
          documents: [...row.documents, { name: 'Return Note.pdf', meta: `${returned} · ${payload.receivedBy}` }],
        }),
        `${modalRow?.id ?? 'Allocation'} closed — returned ${returned} in ${payload.condition.toLowerCase()} condition`,
      );
    },
    [modalRow, patchRow],
  );

  /** A transfer reassigns the record rather than closing it. */
  const transferAllocation = useCallback(
    (payload: TransferPayload) => {
      const [name] = payload.to.split('·').map((part) => part.trim());
      const [location, spot] = payload.location.split('·').map((part) => part.trim());
      const effective = toRowDate(payload.effective);
      patchRow(
        (row) => ({
          ...row,
          assignee: { ...row.assignee, name, reference: `${payload.department} · transferred ${effective}` },
          department: payload.department as Department,
          location: location ?? row.location,
          spot: spot ?? row.spot,
          condition: payload.condition as Condition,
          history: [
            ...row.history,
            { title: `Transferred to ${name}`, meta: `${effective} · ${payload.reason}` },
          ],
          lastVerified: effective,
        }),
        `${modalRow?.id ?? 'Allocation'} transferred to ${name}`,
      );
    },
    [modalRow, patchRow],
  );

  /** Filing damage is what puts the row on the Damage Reported pill. */
  const reportDamage = useCallback(
    (payload: DamagePayload) => {
      const reported = toRowDate(payload.reportedOn);
      const reference = `DMG-2026-00${44 + rows.filter((row) => row.damage).length}`;
      patchRow(
        (row) => ({
          ...row,
          damage: {
            type: payload.type, severity: payload.severity, reportedOn: reported,
            reference, estimate: toNumber(payload.estimate), liability: payload.liability,
          },
          condition: /critical/i.test(payload.severity) ? 'Poor'
            : /major/i.test(payload.severity) ? 'Fair' : row.condition,
          history: [
            ...row.history,
            { title: `Damage reported — ${payload.type.toLowerCase()}`, meta: `${reported} · ${reference}` },
          ],
          conditionNote: payload.description.trim() || row.conditionNote,
          documents: [...row.documents, { name: 'Damage Report.pdf', meta: `${reported} · ${reference}` }],
          lastVerified: reported,
        }),
        `${reference} raised against ${modalRow?.id ?? 'the allocation'}`,
      );
    },
    [modalRow, patchRow, rows],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} allocations exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Allocation) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View allocation" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit allocation" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Return asset" onClick={() => openModal(row, 'return')}>
        <i className="ti ti-arrow-back-up" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Transfer allocation" onClick={() => openModal(row, 'transfer')}>
        <i className="ti ti-transfer" />
      </ActionLink>
      <ActionLink className="dt-ib danger" ariaLabel="Report damage" onClick={() => openModal(row, 'damage')}>
        <i className="ti ti-alert-triangle" />
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

  /** The expander's last card offers whatever this allocation's state calls for. */
  const primaryAction = (row: Allocation) => {
    const status = statusOf(row);
    if (status === 'Returned') return null;
    if (status === 'Damage Reported') {
      return { modal: 'damage' as AllocationModalId, icon: 'ti ti-alert-triangle', label: 'Report Damage' };
    }
    if (status === 'Overdue Return' || status === 'Pending Return') {
      return { modal: 'return' as AllocationModalId, icon: 'ti ti-arrow-back-up', label: 'Return Asset' };
    }
    return { modal: 'transfer' as AllocationModalId, icon: 'ti ti-transfer', label: 'Transfer' };
  };

  const renderDetail = (row: Allocation) => {
    const primary = primaryAction(row);
    return (
      <div className="row g-4">
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-package text-primary me-1" />Asset Information</h6>
          {pairList(assetPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-user text-success me-1" />Assignee Profile</h6>
          {pairList(assigneePairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-history text-info me-1" />Allocation History</h6>
          {row.history.map((entry) => (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${entry.title}-${entry.meta}`}>
              <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                <i className="ti ti-history" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
                <span className="fs-12 text-muted text-truncate d-block">{entry.meta}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-arrow-back-up text-warning me-1" />Return Information</h6>
          {pairList(returnPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-clipboard-check text-danger me-1" />Asset Condition</h6>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
            <span className={`badge badge-soft-${conditionTint[row.condition]}`}>{row.condition}</span>
            {/* Returned on that date, or looked at today while it is still out. */}
            <span className="badge badge-soft-secondary">Checked {checkedOnOf(row)}</span>
          </div>
          <p className="fs-13 text-muted mb-0">{row.conditionNote}</p>
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-checks text-success me-1" />Approval Details</h6>
          {pairList(approvalPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-files text-secondary me-1" />Supporting Documents</h6>
          {row.documents.length === 0 ? (
            <p className="fs-13 text-muted mb-0">No documents filed.</p>
          ) : (
            row.documents.map((document) => (
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
            ))
          )}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-note text-secondary me-1" />Internal Notes</h6>
          <p className="fs-13 text-muted mb-3">{row.notes}</p>
          <div className="d-flex align-items-center flex-wrap gap-2">
            {primary ? (
              <button
                type="button" className="btn btn-primary btn-sm"
                onClick={() => openModal(row, primary.modal)}
              >
                <i className={`${primary.icon} me-1`} />{primary.label}
              </button>
            ) : null}
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm"
              onClick={() => openModal(row, 'view')}
            >
              <i className="ti ti-eye me-1" />View Allocation
            </button>
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm"
              onClick={() => setPanelRow(row)}
            >
              <i className="ti ti-clipboard-list me-1" />Allocation Panel
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
            title="Asset Allocation"
            section="Assets"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(rows.find((row) => !row.actualReturn) ?? rows[0] ?? null, 'return')}
                  >
                    <i className="ti ti-arrow-back-up me-2" />Return Asset
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Print Allocation Register" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'allocate')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Allocate Asset
                  </ActionLink>
                </div>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={SUMMARY_TOTALS.total - initialRows.length + rows.length}
            summary={summary}
            footerVariant="card-foot"
            pageSizeOptions={[8, 25, 50, 100]}
            workspaceId="alWorkspace"
            searchPlaceholder="Search asset, assignee or allocation ID…"
            searchLabel="Search allocations"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="allocations"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Allocation register refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-clipboard-off"
            emptyTitle="No allocations match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Allocation Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Allocation Details"
            labelledById="al_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Asset Details</h6>
                <div className="d-flex align-items-center mb-3">
                  <span
                    className={`avatar avatar-lg bg-${categoryTint[panelRow.category]}-transparent text-${categoryTint[panelRow.category]} rounded flex-shrink-0`}
                  >
                    <i className={`${panelRow.icon} fs-20`} />
                  </span>
                  <div className="ms-2 overflow-hidden">
                    <h6 className="mb-0 text-truncate">{panelRow.assetName}</h6>
                    <span className="fs-12 text-muted">{panelRow.assetId} · {panelRow.id}</span>
                  </div>
                  <span className={`${statusBadge[statusOf(panelRow)]} ms-auto`}>{statusOf(panelRow)}</span>
                </div>
                <div className="border rounded p-3 mb-3">{pairList(panelAssetPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Assignee Information</h6>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                  {panelRow.assignee.avatar ? (
                    <span className="avatar avatar-md rounded flex-shrink-0">
                      <ImageWithBasePath
                        src={panelRow.assignee.avatar} className="rounded" alt={panelRow.assignee.name}
                      />
                    </span>
                  ) : (
                    <span
                      className={`avatar avatar-md bg-${panelRow.assignee.tint ?? 'primary'}-transparent text-${panelRow.assignee.tint ?? 'primary'} rounded flex-shrink-0`}
                    >
                      <i className={panelRow.assignee.icon ?? 'ti ti-user'} />
                    </span>
                  )}
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0 text-truncate">{panelRow.assignee.name}</h6>
                    <span className="fs-12 text-muted text-truncate d-block">
                      {panelRow.assignee.reference} · {placeOf(panelRow)}
                    </span>
                  </div>
                  <span className={typeBadge[panelRow.assignee.type]}>{panelRow.assignee.type}</span>
                </div>

                <h6 className="fs-14 mb-2">Allocation Timeline</h6>
                {panelRow.history.map((entry) => (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${entry.title}-${entry.meta}`}>
                    <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
                      <i className="ti ti-clipboard-list" />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
                      <span className="fs-12 text-muted text-truncate d-block">{entry.meta}</span>
                    </div>
                  </div>
                ))}

                <h6 className="fs-14 mb-2 mt-3">Return Schedule</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList(schedulePairsOf(panelRow))}
                  <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top">
                    <span className="fs-13 fw-medium">Held For</span>
                    <span className="fs-13 fw-semibold">{heldLabelOf(panelRow)}</span>
                  </div>
                </div>

                <h6 className="fs-14 mb-2">Current Condition</h6>
                <div className="border rounded p-3 mb-3">{pairList(conditionPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Approval Information</h6>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                  <span className="avatar avatar-sm bg-success-transparent text-success rounded flex-shrink-0">
                    <i className="ti ti-checks" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0 text-truncate">Approved by the {panelRow.approvedBy}</h6>
                    <span className="fs-12 text-muted text-truncate d-block">
                      {panelRow.approvedOn} · {panelRow.requestRef}
                    </span>
                  </div>
                  <span className="badge badge-soft-success">
                    {panelRow.documents.some((document) => /signed/i.test(document.meta)) ? 'Signed' : 'Pending'}
                  </span>
                </div>

                <h6 className="fs-14 mb-2">Audit History</h6>
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
                  {unitLineOf(panelRow)} · {heldForOf(panelRow).toLocaleString('en-US')} days held
                </p>

                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'transfer'); }}
                  >
                    <i className="ti ti-transfer me-1" />Transfer Asset
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'return'); }}
                  >
                    <i className="ti ti-arrow-back-up me-1" />Return
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <AllocationModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onAllocate={allocateAsset}
        onUpdate={updateAllocation}
        onReturn={returnAsset}
        onTransfer={transferAllocation}
        onDamage={reportDamage}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="alToasts" />
    </>
  );
};

export default AssetAllocation;
