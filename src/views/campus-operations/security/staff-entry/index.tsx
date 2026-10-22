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
import StaffEntryModals from './modals/StaffEntryModals';
import type {
  CheckInPayload, CheckOutPayload, OverridePayload, StaffDraft, StaffModalId,
} from './modals/StaffEntryModals';
import type { Department, EntryStatus, StaffEntry, Verification } from './data/staffEntries.data';
import {
  DASH, QUICK_TOTALS, REGISTER_DATE, REGISTER_FROM, REGISTER_TIME, REGISTER_TO,
  SUMMARY_TOTALS, VIEW_TOTALS, attendancePairsOf, auditOf, checkInLabelOf, checkOutLabelOf,
  dateKey, departmentBadge, departmentOptions, durationLabel, gateOptions, isLate,
  minutesOf, movementLabelOf, movementTintOf, onSiteLabelOf, onSiteOf, panelStaffPairsOf,
  profilePairsOf, punctualityLabelOf, punctualityOf, punctualityTintOf, roleOptions,
  searchIndexOf, shiftBadge, shiftChoices, shiftOptions, shiftPairsOf, shiftWindowOf,
  staffEntries as initialRows, statusBadge, statusOf, statusOptions, statusPill,
  timelineOf, verificationIcon, verificationOptions, verificationPairsOf,
} from './data/staffEntries.data';

const routes = all_routes;

/** Ids and options are the template's own; the date window opens committed. */
const filterFields: FilterField[] = [
  { id: 'department', label: 'Department', kind: 'select', chipLabel: 'Dept', options: departmentOptions },
  { id: 'role', label: 'Role', kind: 'select', chipLabel: 'Role', options: roleOptions },
  { id: 'shift', label: 'Shift', kind: 'select', chipLabel: 'Shift', options: shiftOptions },
  { id: 'gate', label: 'Gate', kind: 'select', chipLabel: 'Gate', options: gateOptions },
  { id: 'entry-status', label: 'Entry Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'verification', label: 'Verification', kind: 'select', chipLabel: 'Verified', allLabel: 'Any', options: verificationOptions },
  {
    id: 'from-date', label: 'From Date', kind: 'date', chipLabel: 'Date',
    dateFormat: 'd-m-Y', initialValue: REGISTER_FROM,
  },
  {
    id: 'to-date', label: 'To Date', kind: 'date', chipLabel: 'To',
    dateFormat: 'd-m-Y', initialValue: REGISTER_TO,
  },
];

const sortOptions: SortOption[] = [
  { id: 'entry', label: 'Entry ID', icon: 'ti ti-hash' },
  { id: 'name', label: 'Staff name (A–Z)', icon: 'ti ti-abc' },
  { id: 'checkin', label: 'Check-in time', icon: 'ti ti-door-enter' },
  { id: 'onsite', label: 'Hours on site', icon: 'ti ti-clock' },
  { id: 'late', label: 'Minutes late', icon: 'ti ti-alert-triangle' },
];

const inputDateKey = (value: string): number => {
  const [day, month, year] = value.split('-').map(Number);
  return Number.isFinite(year) ? year * 10000 + month * 100 + day : 0;
};

/** A predicate for one derived status, used by the views, rail and strip. */
const isStatus = (status: EntryStatus) => (row: StaffEntry) => statusOf(row) === status;

/** Minutes late, which the sort menu orders by; zero when on time or absent. */
const minutesLateOf = (row: StaffEntry): number =>
  isLate(row) ? -punctualityOf(row) : 0;

const StaffEntryPage = () => {
  const [rows, setRows] = useState<StaffEntry[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<StaffModalId | null>(null);
  const [modalRow, setModalRow] = useState<StaffEntry | null>(null);
  const [panelRow, setPanelRow] = useState<StaffEntry | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: StaffEntry | null, modal: StaffModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: StaffEntry) => StaffEntry, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<StaffEntry>[]>(
    () => [
      {
        id: 'entry',
        label: 'Entry ID',
        sortable: true,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>{row.id}</ActionLink>
        ),
      },
      {
        id: 'staff-id',
        label: 'Staff ID',
        sortable: true,
        cellClassName: 'fs-13 text-nowrap',
        render: (row) => row.staffId,
      },
      {
        id: 'name',
        label: 'Staff Name',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            {row.avatar ? (
              <span className="dt-avatar">
                <ImageWithBasePath src={row.avatar} alt={row.name} />
              </span>
            ) : (
              <span className={`avatar avatar-md bg-${row.tint}-transparent text-${row.tint} rounded flex-shrink-0 me-2`}>
                <i className={row.icon} />
              </span>
            )}
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.name}</ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">{row.responsibility}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'department',
        label: 'Department',
        sortable: true,
        render: (row) => <span className={departmentBadge[row.department]}>{row.department}</span>,
      },
      {
        id: 'designation',
        label: 'Designation',
        sortable: true,
        cellClassName: 'fs-13 text-nowrap',
        render: (row) => row.designation,
      },
      {
        id: 'gate',
        label: 'Gate',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.gate}</span>
            <span className="fs-12 text-muted text-nowrap">{row.lane}</span>
          </>
        ),
      },
      {
        id: 'checkin',
        label: 'Check-In',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{checkInLabelOf(row)}</span>
            {/* The shift start less the scan — early, late or overdue. */}
            <span className={`fs-12 text-nowrap ${punctualityTintOf(row)}`}>
              {punctualityLabelOf(row)}
            </span>
          </>
        ),
      },
      {
        id: 'checkout',
        label: 'Check-Out',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{checkOutLabelOf(row)}</span>
            <span className={`fs-12 text-nowrap ${movementTintOf(row)}`}>{movementLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'shift',
        label: 'Shift',
        render: (row) => (
          <>
            <span className={shiftBadge[row.shift]}>{row.shift}</span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{shiftWindowOf(row)}</span>
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

  const workspace = useWorkspace<StaffEntry>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.department && row.department !== filters.department) return false;
      if (filters.role && !row.designation.startsWith(filters.role)) return false;
      if (filters.shift && row.shift !== filters.shift) return false;
      if (filters.gate && row.gate !== filters.gate) return false;
      if (filters['entry-status'] && statusOf(row) !== filters['entry-status']) return false;
      if (filters.verification && row.verification !== filters.verification) return false;
      if (filters['from-date'] && dateKey(REGISTER_DATE) < inputDateKey(filters['from-date'])) return false;
      if (filters['to-date'] && dateKey(REGISTER_DATE) > inputDateKey(filters['to-date'])) return false;
      return true;
    },
    /** The rail opens on All, which narrows nothing. */
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'Inside') return statusOf(row) === 'Inside Campus';
      if (quick === 'Late') return statusOf(row) === 'Late Arrival';
      if (quick === 'Missing') return statusOf(row) === 'Missing Check-Out';
      if (quick === 'Not Reported') return statusOf(row) === 'Not Reported';
      return statusOf(row) === 'Checked Out';
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'inside': return statusOf(row) === 'Inside Campus';
        case 'late': return statusOf(row) === 'Late Arrival';
        case 'missing': return statusOf(row) === 'Missing Check-Out';
        case 'night': return row.shift === 'Night';
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'checkin':
          return minutesOf(a.checkIn || '23:59') - minutesOf(b.checkIn || '23:59');
        case 'onsite':
          return onSiteOf(b) - onSiteOf(a) || a.id.localeCompare(b.id);
        case 'late':
          return minutesLateOf(b) - minutesLateOf(a) || a.id.localeCompare(b.id);
        // The `<th>`s sort on columns the menu does not offer.
        case 'staff-id':
          return a.staffId.localeCompare(b.staffId);
        case 'department':
          return a.department.localeCompare(b.department);
        case 'designation':
          return a.designation.localeCompare(b.designation);
        case 'gate':
          return a.gate.localeCompare(b.gate);
        case 'checkout':
          return minutesOf(a.checkOut || '23:59') - minutesOf(b.checkOut || '23:59');
        case 'entry':
        default:
          return a.id.localeCompare(b.id);
      }
    },
    defaultSort: 'entry',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: StaffEntry) => boolean) => rows.filter(test).length,
    [rows],
  );

  /** Template total − what it seeded + what the roster holds now. */
  const shift = useCallback(
    (base: number, test: (row: StaffEntry) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Staff Today', icon: 'ti ti-layout-list', count: shift(VIEW_TOTALS.all, () => true) },
      { id: 'inside', label: 'Currently Inside', icon: 'ti ti-user-check', count: shift(VIEW_TOTALS.inside, isStatus('Inside Campus')) },
      { id: 'late', label: 'Late Arrivals', icon: 'ti ti-clock', count: shift(VIEW_TOTALS.late, isStatus('Late Arrival')) },
      { id: 'missing', label: 'Missing Check-Outs', icon: 'ti ti-alert-triangle', count: shift(VIEW_TOTALS.missing, isStatus('Missing Check-Out')) },
      {
        id: 'night', label: 'Night Shift', icon: 'ti ti-shield-check',
        count: shift(VIEW_TOTALS.night, (row) => row.shift === 'Night'),
      },
    ],
    [shift],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: shift(QUICK_TOTALS.all, () => true) },
      { id: 'Inside', label: 'Inside', icon: 'ti ti-user-check', count: shift(QUICK_TOTALS.inside, isStatus('Inside Campus')) },
      { id: 'Checked Out', label: 'Checked Out', icon: 'ti ti-door-exit', count: shift(QUICK_TOTALS.checkedOut, isStatus('Checked Out')) },
      { id: 'Late', label: 'Late', icon: 'ti ti-clock', count: shift(QUICK_TOTALS.late, isStatus('Late Arrival')) },
      { id: 'Missing', label: 'Missing Out', icon: 'ti ti-alert-triangle', count: shift(QUICK_TOTALS.missing, isStatus('Missing Check-Out')) },
      { id: 'Not Reported', label: 'Not Reported', icon: 'ti ti-user-off', count: shift(QUICK_TOTALS.notReported, isStatus('Not Reported')) },
    ],
    [shift],
  );

  /**
   * The strip counts the whole day at every gate — 94 entries against the eight
   * this page lists — so the template's figures stand and the roster moves them.
   */
  const summary = useMemo<SummaryItem[]>(
    () => [
      {
        id: 'today', tint: 'primary', icon: 'ti ti-door-enter', label: 'Today’s Entries',
        value: String(shift(SUMMARY_TOTALS.today, (row) => Boolean(row.checkIn))),
        hint: `${REGISTER_DATE} · all gates`,
      },
      {
        id: 'inside', tint: 'success', icon: 'ti ti-user-check', label: 'Currently Inside',
        value: String(shift(SUMMARY_TOTALS.inside, isStatus('Inside Campus'))), hint: 'on campus now',
      },
      {
        id: 'out', tint: 'info', icon: 'ti ti-door-exit', label: 'Checked Out',
        value: String(shift(SUMMARY_TOTALS.checkedOut, isStatus('Checked Out'))), hint: 'shift completed',
      },
      {
        id: 'late', tint: 'warning', icon: 'ti ti-clock', label: 'Late Arrivals',
        value: String(shift(SUMMARY_TOTALS.late, isStatus('Late Arrival'))),
        hint: 'beyond the 10 minute grace',
      },
      {
        id: 'missing', tint: 'danger', icon: 'ti ti-alert-triangle', label: 'Missing Check-Outs',
        value: String(shift(SUMMARY_TOTALS.missing, isStatus('Missing Check-Out'))),
        hint: 'no exit scan recorded',
      },
    ],
    [shift],
  );

  /* -------------------------------- Mutations ------------------------------- */

  const recordEntry = useCallback(
    (draft: StaffDraft) => {
      if (!draft.staff) {
        push('Pick the staff member', 'warning');
        return;
      }
      const [name, staffId] = draft.staff.split('·').map((part) => part.trim());
      const chosen = shiftChoices.find((choice) => choice.label === draft.shift) ?? shiftChoices[1];
      const id = `STE-2026-09${56 + rows.length}`;
      setRows((current) => [
        {
          id, staffId: draft.staffId.trim() || staffId,
          name, icon: 'ti ti-user', tint: 'primary',
          responsibility: draft.designation.trim() || 'Not recorded',
          department: draft.department as Department,
          designation: draft.designation.trim() || 'Not recorded',
          contact: 'Not recorded', card: `${staffId}••••`, vehicle: draft.vehicle.trim(),
          gate: draft.gate, lane: `${draft.gate} · Lane 1`,
          shift: chosen.shift, shiftStart: chosen.start, shiftEnd: chosen.end,
          checkIn: draft.movement === 'Check-Out' ? '' : draft.checkIn,
          checkInDate: '',
          checkOut: draft.movement === 'Check-In' ? '' : draft.checkOut,
          verification: draft.method as Verification,
          override: draft.method === 'Manual override', overrideTicket: '',
          officer: draft.officer,
          gateRegister: draft.linkGate ? `GT-2026-08${80 + rows.length}` : '',
          camera: 'CAM-MG-03',
          history: [{ title: 'Entry recorded manually at the desk', meta: `${draft.checkIn} · ${draft.officer}` }],
          daysPresent: 1, daysInMonth: 22, monthLate: 0, monthMissing: 0,
          averageIn: draft.checkIn, averageOut: draft.checkOut,
          pastEntries: [], zones: [],
          reportsTo: 'Not recorded', officeLocation: draft.gate,
          notes: draft.notes.trim() || 'Recorded from the staff register.',
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} recorded for ${name}`);
    },
    [push, rows.length],
  );

  const updateEntry = useCallback(
    (draft: StaffDraft) => {
      const chosen = shiftChoices.find((choice) => choice.label === draft.shift) ?? shiftChoices[1];
      patchRow(
        (row) => ({
          ...row,
          staffId: draft.staffId.trim() || row.staffId,
          department: draft.department as Department,
          designation: draft.designation.trim() || row.designation,
          shift: chosen.shift, shiftStart: chosen.start, shiftEnd: chosen.end,
          gate: draft.gate,
          checkIn: draft.movement === 'Check-Out' ? row.checkIn : draft.checkIn,
          // Setting a check-out is what clears a missing check-out flag.
          checkOut: draft.movement === 'Check-In' ? row.checkOut : draft.checkOut,
          verification: draft.method as Verification,
          officer: draft.officer,
          vehicle: draft.vehicle.trim(),
          notes: draft.notes.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Entry'} updated`,
      );
    },
    [modalRow, patchRow],
  );

  const checkIn = useCallback(
    (payload: CheckInPayload) =>
      patchRow(
        (row) => ({
          ...row,
          checkIn: payload.time,
          gate: payload.gate,
          officer: payload.officer,
          verification: payload.method === 'Manual' ? 'Manual override'
            : payload.method === 'Biometric' ? 'Biometric scan' : 'ID card scan',
          override: payload.method === 'Manual',
          history: [
            { title: 'Checked in at the gate', meta: `${payload.time} · ${payload.officer}` },
            ...row.history,
          ],
          notes: payload.remarks.trim() || row.notes,
        }),
        `${modalRow?.name ?? 'Staff member'} checked in at ${payload.time}`,
      ),
    [modalRow, patchRow],
  );

  const checkOut = useCallback(
    (payload: CheckOutPayload) => {
      if (!modalRow?.checkIn) {
        push('This staff member has not checked in yet', 'warning');
        return;
      }
      const span = minutesOf(payload.time) - minutesOf(modalRow.checkIn);
      patchRow(
        (row) => ({
          ...row,
          checkOut: payload.time,
          gate: payload.gate,
          officer: row.officer,
          history: [
            { title: 'Checked out at the gate', meta: `${payload.time} · ${payload.approvedBy}` },
            ...row.history,
          ],
          notes: payload.remarks.trim() || row.notes,
        }),
        `${modalRow.name} checked out at ${payload.time} — on site ${durationLabel(span >= 0 ? span : span + 1440)}`,
      );
    },
    [modalRow, patchRow, push],
  );

  /** An override is what puts the row on the Override Granted pill. */
  const grantOverride = useCallback(
    (payload: OverridePayload) =>
      patchRow(
        (row) => ({
          ...row,
          override: true,
          verification: 'Manual override',
          overrideTicket: payload.raiseCard
            ? row.overrideTicket || `ACC-2026-01${18 + rows.length}` : row.overrideTicket,
          officer: payload.officer,
          checkIn: row.checkIn || REGISTER_TIME,
          history: [
            { title: `Manual override granted · ${payload.scope.toLowerCase()}`, meta: `${REGISTER_TIME} · ${payload.officer}` },
            ...row.history,
          ],
          notes: payload.remarks.trim() || row.notes,
        }),
        `Override granted for ${modalRow?.name ?? 'the staff member'} · ${payload.reason.toLowerCase()}`,
      ),
    [modalRow, patchRow, rows.length],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} staff records exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: StaffEntry) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View entry" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit entry" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Check in" onClick={() => openModal(row, 'checkin')}>
        <i className="ti ti-door-enter" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Check out" onClick={() => openModal(row, 'checkout')}>
        <i className="ti ti-door-exit" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Access override" onClick={() => openModal(row, 'override')}>
        <i className="ti ti-shield-check" />
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

  /** The expander's last card offers whatever this entry's state calls for. */
  const primaryAction = (row: StaffEntry) => {
    const status = statusOf(row);
    if (status === 'Not Reported') {
      return { modal: 'checkin' as StaffModalId, icon: 'ti ti-door-enter', label: 'Check-In' };
    }
    if (status === 'Override Granted') {
      return { modal: 'override' as StaffModalId, icon: 'ti ti-shield-check', label: 'Access Override' };
    }
    if (status === 'Checked Out') return null;
    return { modal: 'checkout' as StaffModalId, icon: 'ti ti-door-exit', label: 'Check-Out' };
  };

  const renderDetail = (row: StaffEntry) => {
    const primary = primaryAction(row);
    return (
      <div className="row g-4">
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-user text-primary me-1" />Staff Profile</h6>
          {pairList(profilePairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-calendar-event text-info me-1" />Shift Details</h6>
          {pairList(shiftPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-timeline text-success me-1" />Entry &amp; Exit Timeline</h6>
          {timelineOf(row).map((entry) => (
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
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-scan text-warning me-1" />Gate Verification</h6>
          <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
            <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
              <i className={verificationIcon[row.verification]} />
            </span>
            <div className="flex-fill overflow-hidden">
              <h6 className="fs-13 mb-0 text-truncate">{row.verification}</h6>
              <span className="fs-12 text-muted text-truncate d-block">{row.gate} · {row.lane}</span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
            <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
              <i className="ti ti-id-badge-2" />
            </span>
            <div className="flex-fill overflow-hidden">
              <h6 className="fs-13 mb-0 text-truncate">Card {row.card}</h6>
              <span className="fs-12 text-muted text-truncate d-block">Masked on the security register</span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
            <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
              <i className="ti ti-user" />
            </span>
            <div className="flex-fill overflow-hidden">
              <h6 className="fs-13 mb-0 text-truncate">{row.officer || 'No officer assigned'}</h6>
              <span className="fs-12 text-muted text-truncate d-block">
                {row.officer ? 'Verified the entry' : 'Awaiting the scan'}
              </span>
            </div>
          </div>
          {row.gateRegister ? (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-0">
              <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                <i className="ti ti-link" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">Gate register {row.gateRegister}</h6>
                <span className="fs-12 text-muted text-truncate d-block">{row.gate} · {REGISTER_DATE}</span>
              </div>
            </div>
          ) : null}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-history text-purple me-1" />Access History</h6>
          {row.history.map((entry) => (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${entry.title}-${entry.meta}`}>
              <span className="avatar avatar-sm bg-purple-transparent text-purple rounded flex-shrink-0">
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
          <h6 className="fs-14 mb-3"><i className="ti ti-checks text-danger me-1" />Attendance Summary</h6>
          {pairList(attendancePairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-note text-secondary me-1" />Security Notes</h6>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
            <span className={departmentBadge[row.department]}>{row.department}</span>
            <span className="badge badge-soft-secondary">{row.verification}</span>
          </div>
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
              <i className="ti ti-eye me-1" />View Entry
            </button>
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm"
              onClick={() => setPanelRow(row)}
            >
              <i className="ti ti-shield-check me-1" />Staff Entry Panel
            </button>
          </div>
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-files text-secondary me-1" />Audit Log</h6>
          {auditOf(row).map((entry) => (
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
            title="Staff Entry"
            section="Security"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(
                      rows.find((row) => row.checkIn && !row.checkOut) ?? rows[0] ?? null, 'checkout',
                    )}
                  >
                    <i className="ti ti-door-exit me-2" />Check-Out
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Print Staff Register" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'manual')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Manual Entry
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
            footerInfoSuffix={`register as at ${REGISTER_TIME}`}
            workspaceId="seWorkspace"
            searchPlaceholder="Search staff name, staff ID or entry ID…"
            searchLabel="Search staff entries"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="staff records"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Staff register refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-user-off"
            emptyTitle="No staff records match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Staff Entry Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Staff Entry Details"
            labelledById="se_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Staff Information</h6>
                <div className="d-flex align-items-center mb-3">
                  {panelRow.avatar ? (
                    <span className="avatar avatar-lg rounded flex-shrink-0">
                      <ImageWithBasePath src={panelRow.avatar} className="rounded" alt={panelRow.name} />
                    </span>
                  ) : (
                    <span
                      className={`avatar avatar-lg bg-${panelRow.tint}-transparent text-${panelRow.tint} rounded flex-shrink-0`}
                    >
                      <i className={`${panelRow.icon} fs-20`} />
                    </span>
                  )}
                  <div className="ms-2 overflow-hidden">
                    <h6 className="mb-0 text-truncate">{panelRow.name}</h6>
                    <span className="fs-12 text-muted">{panelRow.id} · {panelRow.staffId}</span>
                  </div>
                  <span className={`${statusBadge[statusOf(panelRow)]} ms-auto`}>{statusOf(panelRow)}</span>
                </div>
                <div className="border rounded p-3 mb-3">{pairList(panelStaffPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Department Details</h6>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                  <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
                    <i className="ti ti-building-store" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0 text-truncate">{panelRow.department}</h6>
                    <span className="fs-12 text-muted text-truncate d-block">{panelRow.officeLocation}</span>
                  </div>
                  <span className={departmentBadge[panelRow.department]}>{panelRow.reportsTo}</span>
                </div>

                <h6 className="fs-14 mb-2">Shift Schedule</h6>
                <div className="table-responsive mb-3">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th className="fs-12">Day</th>
                        <th className="fs-12">Shift</th>
                        <th className="fs-12">Window</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* The rostered week, built from the shift on this entry. */}
                      <tr>
                        <td className="fs-13">Monday to Friday</td>
                        <td className="fs-13">{panelRow.shift}</td>
                        <td className="fs-13 text-nowrap">{shiftWindowOf(panelRow)}</td>
                      </tr>
                      <tr>
                        <td className="fs-13">Saturday</td>
                        <td className="fs-13">Half Day</td>
                        <td className="fs-13 text-nowrap">
                          {panelRow.shiftStart} – {(() => {
                            const half = minutesOf(panelRow.shiftStart) + 300;
                            return `${String(Math.floor((half % 1440) / 60)).padStart(2, '0')}:${String(half % 60).padStart(2, '0')}`;
                          })()}
                        </td>
                      </tr>
                      <tr>
                        <td className="fs-13">Sunday</td>
                        <td className="fs-13">Off duty</td>
                        <td className="fs-13 text-nowrap">On call only</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h6 className="fs-14 mb-2">Entry History</h6>
                <div className="table-responsive mb-3">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th className="fs-12">Date</th>
                        <th className="fs-12">In</th>
                        <th className="fs-12">Out</th>
                        <th className="fs-12">Gate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Today first, then the days already on the record. */}
                      <tr>
                        <td className="fs-13 text-nowrap">{REGISTER_DATE}</td>
                        <td className="fs-13">{panelRow.checkIn || DASH}</td>
                        <td className="fs-13">{panelRow.checkOut || DASH}</td>
                        <td className="fs-13">{panelRow.gate}</td>
                      </tr>
                      {panelRow.pastEntries.map((entry) => (
                        <tr key={entry.date}>
                          <td className="fs-13 text-nowrap">{entry.date}</td>
                          <td className="fs-13">{entry.checkIn}</td>
                          <td className="fs-13">{entry.checkOut}</td>
                          <td className="fs-13">{entry.gate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h6 className="fs-14 mb-2">Access Permissions</h6>
                {panelRow.zones.length === 0 ? (
                  <p className="fs-13 text-muted mb-3">No zones recorded on this profile.</p>
                ) : (
                  panelRow.zones.map((zone) => (
                    <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={zone.zone}>
                      <span
                        className={`avatar avatar-sm bg-${zone.allowed ? 'success' : 'danger'}-transparent text-${zone.allowed ? 'success' : 'danger'} rounded flex-shrink-0`}
                      >
                        <i className="ti ti-shield-check" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <h6 className="fs-13 mb-0 text-truncate">{zone.zone}</h6>
                      </div>
                      <span className={`badge badge-soft-${zone.allowed ? 'success' : 'danger'}`}>
                        {zone.allowed ? 'Allowed' : 'Restricted'}
                      </span>
                    </div>
                  ))
                )}

                <h6 className="fs-14 mb-2 mt-3">Security Verification</h6>
                <div className="border rounded p-3 mb-3">{pairList(verificationPairsOf(panelRow))}</div>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                  <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                    <i className="ti ti-camera" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0 text-truncate">Gate camera capture</h6>
                    <span className="fs-12 text-muted text-truncate d-block">
                      {panelRow.camera} · {panelRow.checkIn || 'no capture'}
                    </span>
                  </div>
                  <span className="badge badge-soft-success">Stored</span>
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
                  {onSiteLabelOf(panelRow)} on site · {punctualityLabelOf(panelRow)}
                </p>

                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'checkout'); }}
                  >
                    <i className="ti ti-door-exit me-1" />Check-Out
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

      <StaffEntryModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onRecord={recordEntry}
        onUpdate={updateEntry}
        onCheckIn={checkIn}
        onCheckOut={checkOut}
        onOverride={grantOverride}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="seToasts" />
    </>
  );
};

export default StaffEntryPage;
