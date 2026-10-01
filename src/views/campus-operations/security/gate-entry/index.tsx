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
import EntryModals from './modals/EntryModals';
import type {
  CheckInPayload, CheckOutPayload, EntryDraft, EntryModalId, PassPayload,
} from './modals/EntryModals';
import type { EntryStatus, EntryType, GateEntry, PersonType } from './data/entries.data';
import {
  DASH, QUICK_TOTALS, REGISTER_DATE, REGISTER_FROM, REGISTER_TIME, REGISTER_TO,
  SUMMARY_TOTALS, VIEW_TOTALS, addMinutes, auditOf, checkBadge, checkIcon, checkInLabelOf,
  checkOutLabelOf, dateKey, durationLabel, entries as initialRows, entryBadge,
  entryTypeOptions, gateOptions, hostPairsOf, matchesVehicle, minutesOf, movementLabelOf,
  movementTintOf, onSiteLabelOf, onSiteOf, overstayOf, panelPersonPairsOf, panelVisitPairsOf,
  passBadge, passLineOf, passPairsOf, passStatusOf, passStatusOptions, personBadge,
  personPairsOf, personTypeOptions, searchIndexOf, statusBadge, statusOf, statusOptions,
  statusPill, timelineOf, vehicleOptions, vehiclePairsOf, verificationPairsOf, visitorPairsOf,
} from './data/entries.data';

const routes = all_routes;

/** Ids and options are the template's own; the date window opens committed. */
const filterFields: FilterField[] = [
  { id: 'entry-type', label: 'Entry Type', kind: 'select', chipLabel: 'Entry', options: entryTypeOptions },
  { id: 'person-type', label: 'Person Type', kind: 'select', chipLabel: 'Person', options: personTypeOptions },
  { id: 'gate', label: 'Gate', kind: 'select', chipLabel: 'Gate', options: gateOptions },
  { id: 'entry-status', label: 'Entry Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  {
    id: 'from-date', label: 'From Date', kind: 'date', chipLabel: 'Date',
    dateFormat: 'd-m-Y', initialValue: REGISTER_FROM,
  },
  {
    id: 'to-date', label: 'To Date', kind: 'date', chipLabel: 'To',
    dateFormat: 'd-m-Y', initialValue: REGISTER_TO,
  },
  { id: 'pass-status', label: 'Pass Status', kind: 'select', chipLabel: 'Pass', allLabel: 'Any', options: passStatusOptions },
  { id: 'vehicle', label: 'Vehicle', kind: 'select', chipLabel: 'Vehicle', allLabel: 'Any', options: vehicleOptions },
];

const sortOptions: SortOption[] = [
  { id: 'entry', label: 'Entry ID', icon: 'ti ti-hash' },
  { id: 'name', label: 'Name (A–Z)', icon: 'ti ti-abc' },
  { id: 'checkin', label: 'Check-in time', icon: 'ti ti-door-enter' },
  { id: 'onsite', label: 'Time on site', icon: 'ti ti-clock' },
  { id: 'overstay', label: 'Overstay duration', icon: 'ti ti-alert-triangle' },
];

const inputDateKey = (value: string): number => {
  const [day, month, year] = value.split('-').map(Number);
  return Number.isFinite(year) ? year * 10000 + month * 100 + day : 0;
};

/** A predicate for one derived status, used by the views, rail and strip. */
const isStatus = (status: EntryStatus) => (row: GateEntry) => statusOf(row) === status;

const GateEntryPage = () => {
  const [rows, setRows] = useState<GateEntry[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<EntryModalId | null>(null);
  const [modalRow, setModalRow] = useState<GateEntry | null>(null);
  const [panelRow, setPanelRow] = useState<GateEntry | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: GateEntry | null, modal: EntryModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: GateEntry) => GateEntry, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<GateEntry>[]>(
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
        id: 'name',
        label: 'Name',
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
              <div className="dt-sub flex-nowrap text-nowrap">{row.reference}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'person',
        label: 'Person Type',
        sortable: true,
        render: (row) => <span className={personBadge[row.personType]}>{row.personType}</span>,
      },
      {
        id: 'type',
        label: 'Entry Type',
        sortable: true,
        render: (row) => <span className={entryBadge[row.entryType]}>{row.entryType}</span>,
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
            <span className="fs-12 text-muted text-nowrap">{row.date}</span>
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
            {/* On site, over by, due or refused — one derivation. */}
            <span className={`fs-12 text-nowrap ${movementTintOf(row)}`}>{movementLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'purpose',
        label: 'Purpose',
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.purpose}</span>
            <span className="fs-12 text-muted text-nowrap">{row.purposeDetail}</span>
          </>
        ),
      },
      {
        id: 'pass',
        label: 'Pass Status',
        render: (row) => (
          <>
            <span className={passBadge[passStatusOf(row)]}>{passStatusOf(row)}</span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{passLineOf(row)}</span>
          </>
        ),
      },
      {
        id: 'status',
        label: 'Security Status',
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

  const workspace = useWorkspace<GateEntry>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['entry-type'] && row.entryType !== filters['entry-type']) return false;
      if (filters['person-type'] && row.personType !== filters['person-type']) return false;
      if (filters.gate && row.gate !== filters.gate) return false;
      if (filters['entry-status'] && statusOf(row) !== filters['entry-status']) return false;
      if (filters['from-date'] && dateKey(row.date) < inputDateKey(filters['from-date'])) return false;
      if (filters['to-date'] && dateKey(row.date) > inputDateKey(filters['to-date'])) return false;
      if (filters['pass-status'] && passStatusOf(row) !== filters['pass-status']) return false;
      if (filters.vehicle && !matchesVehicle(row, filters.vehicle)) return false;
      return true;
    },
    /** The rail opens on All, which narrows nothing. */
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'Inside') return statusOf(row) === 'Inside Campus';
      if (quick === 'Pending') return statusOf(row) === 'Pending Verification';
      if (quick === 'Denied') return statusOf(row) === 'Access Denied';
      return statusOf(row) === quick;
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'inside': return statusOf(row) === 'Inside Campus';
        case 'overstayed': return statusOf(row) === 'Overstayed';
        case 'vehicles': return row.vehicle !== null;
        case 'denied': return statusOf(row) === 'Access Denied';
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
        case 'overstay':
          return overstayOf(b) - overstayOf(a) || a.id.localeCompare(b.id);
        // The `<th>`s sort on columns the menu does not offer.
        case 'person':
          return a.personType.localeCompare(b.personType);
        case 'type':
          return a.entryType.localeCompare(b.entryType);
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
    (test: (row: GateEntry) => boolean) => rows.filter(test).length,
    [rows],
  );

  /** Template total − what it seeded + what the roster holds now. */
  const shift = useCallback(
    (base: number, test: (row: GateEntry) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Entries Today', icon: 'ti ti-layout-list', count: shift(VIEW_TOTALS.all, () => true) },
      { id: 'inside', label: 'Currently Inside', icon: 'ti ti-user-check', count: shift(VIEW_TOTALS.inside, isStatus('Inside Campus')) },
      { id: 'overstayed', label: 'Overstayed Passes', icon: 'ti ti-alert-triangle', count: shift(VIEW_TOTALS.overstayed, isStatus('Overstayed')) },
      {
        id: 'vehicles', label: 'Vehicle Entries', icon: 'ti ti-car',
        count: shift(VIEW_TOTALS.vehicles, (row) => row.vehicle !== null),
      },
      { id: 'denied', label: 'Access Denied', icon: 'ti ti-shield-x', count: shift(VIEW_TOTALS.denied, isStatus('Access Denied')) },
    ],
    [shift],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: shift(QUICK_TOTALS.all, () => true) },
      { id: 'Inside', label: 'Inside', icon: 'ti ti-user-check', count: shift(QUICK_TOTALS.inside, isStatus('Inside Campus')) },
      { id: 'Exited', label: 'Exited', icon: 'ti ti-door-exit', count: shift(QUICK_TOTALS.exited, isStatus('Exited')) },
      { id: 'Overstayed', label: 'Overstayed', icon: 'ti ti-alert-triangle', count: shift(QUICK_TOTALS.overstayed, isStatus('Overstayed')) },
      { id: 'Pending', label: 'Pending', icon: 'ti ti-clock', count: shift(QUICK_TOTALS.pending, isStatus('Pending Verification')) },
      { id: 'Denied', label: 'Denied', icon: 'ti ti-shield-x', count: shift(QUICK_TOTALS.denied, isStatus('Access Denied')) },
    ],
    [shift],
  );

  /**
   * The strip counts the whole day at every gate — 218 entries against the eight
   * this page lists — so the template's figures stand and the roster moves them.
   */
  const summary = useMemo<SummaryItem[]>(
    () => [
      {
        id: 'today', tint: 'primary', icon: 'ti ti-door-enter', label: 'Today’s Entries',
        value: String(shift(SUMMARY_TOTALS.today, () => true)),
        hint: `${REGISTER_DATE} · all gates`,
      },
      {
        id: 'inside', tint: 'success', icon: 'ti ti-user-check', label: 'Visitors Inside',
        value: String(shift(SUMMARY_TOTALS.visitorsInside, isStatus('Inside Campus'))),
        hint: `of ${SUMMARY_TOTALS.visitorEntries} visitor entries`,
      },
      {
        id: 'students', tint: 'info', icon: 'ti ti-school', label: 'Student Movements',
        value: String(shift(SUMMARY_TOTALS.studentMovements, (row) => row.personType === 'Student')),
        hint: 'exits and returns',
      },
      {
        id: 'staff', tint: 'warning', icon: 'ti ti-id-badge-2', label: 'Staff Entries',
        value: String(shift(SUMMARY_TOTALS.staffEntries, (row) => row.personType === 'Staff')),
        hint: 'ID card scans',
      },
      {
        id: 'vehicles', tint: 'danger', icon: 'ti ti-car', label: 'Vehicle Entries',
        value: String(shift(SUMMARY_TOTALS.vehicleEntries, (row) => row.vehicle !== null)),
        hint: `including ${SUMMARY_TOTALS.deliveries} deliveries`,
      },
    ],
    [shift],
  );

  /* -------------------------------- Mutations ------------------------------- */

  const createEntry = useCallback(
    (draft: EntryDraft) => {
      if (!draft.name.trim()) {
        push('Give the person a name', 'warning');
        return;
      }
      const id = `GT-2026-08${89 + rows.length}`;
      const onFoot = draft.vehicleType.startsWith('None');
      setRows((current) => [
        {
          id,
          name: draft.name.trim(),
          icon: draft.who === 'Student' ? 'ti ti-school'
            : draft.who === 'Staff' ? 'ti ti-id-badge-2'
              : draft.who === 'Vendor' ? 'ti ti-building-store' : 'ti ti-user',
          tint: draft.who === 'Student' ? 'info' : draft.who === 'Staff' ? 'success' : 'primary',
          reference: draft.host, contact: draft.contact.trim() || 'Not recorded',
          personType: draft.personType as PersonType,
          entryType: draft.entryType as EntryType,
          gate: draft.gate, lane: `${draft.gate} · Lane 1`,
          checkIn: REGISTER_TIME, checkOut: '', date: REGISTER_DATE,
          purpose: draft.purpose.trim() || 'Not stated',
          purposeDetail: `Registered at the ${draft.gate.toLowerCase()}`,
          idProof: draft.idProof, idNumber: draft.idNumber.trim() || 'Not recorded',
          host: draft.host, hostContact: `${draft.host} · reception`,
          hostLocation: draft.host, hostConfirmation: draft.notifyHost ? 'Notified' : 'Pending',
          vehicle: onFoot ? null : {
            type: draft.vehicleType,
            registration: draft.registration.trim() || 'Not recorded',
            details: `${draft.vehicleType} · logged at the barrier`,
            parking: 'Logged at entry',
          },
          passNumber: draft.issuePass ? `VP-2026-08${89 + rows.length}` : '',
          validFrom: draft.issuePass ? REGISTER_TIME : '',
          validUntil: draft.issuePass ? addMinutes(REGISTER_TIME, 60) : '',
          escort: 'Escort not required',
          denied: false, deniedAt: '', expected: '',
          checks: [{ label: `${draft.idProof} checked at the desk`, state: 'Verified' }],
          documents: [],
          notes: draft.notes.trim() || 'Registered at the gate.',
          pastVisits: [],
          openedBy: 'Mr. Samuel Roy · SEC-014', closedBy: '',
          camera: 'CAM-MG-02',
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} registered at the ${draft.gate.toLowerCase()}`);
    },
    [push, rows.length],
  );

  const updateEntry = useCallback(
    (draft: EntryDraft) =>
      patchRow(
        (row) => ({
          ...row,
          name: draft.name.trim() || row.name,
          contact: draft.contact.trim() || row.contact,
          personType: draft.personType as PersonType,
          entryType: draft.entryType as EntryType,
          idProof: draft.idProof,
          idNumber: draft.idNumber.trim() || row.idNumber,
          gate: draft.gate,
          host: draft.host,
          purpose: draft.purpose.trim() || row.purpose,
          vehicle: draft.vehicleType.startsWith('None') ? null : {
            type: draft.vehicleType,
            registration: draft.registration.trim() || row.vehicle?.registration || 'Not recorded',
            details: row.vehicle?.details ?? `${draft.vehicleType} · logged at the barrier`,
            parking: row.vehicle?.parking ?? 'Logged at entry',
          },
          // Clearing the overstay means giving the pass another hour from now.
          validUntil: draft.issuePass && overstayOf(row) > 0
            ? addMinutes(REGISTER_TIME, 60) : row.validUntil,
          notes: draft.notes.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Entry'} updated`,
      ),
    [modalRow, patchRow],
  );

  /** Checking in stamps the arrival and opens the pass window. */
  const checkIn = useCallback(
    (payload: CheckInPayload) => {
      const minutes = payload.validity === '1 hour' ? 60
        : payload.validity === '2 hours' ? 120 : payload.validity === '4 hours' ? 240 : 600;
      patchRow(
        (row) => ({
          ...row,
          checkIn: payload.time,
          gate: payload.gate,
          date: REGISTER_DATE,
          passNumber: row.passNumber || `VP-2026-0${row.id.slice(-4)}`,
          validFrom: payload.time,
          validUntil: addMinutes(payload.time, minutes),
          escort: payload.escort,
          openedBy: payload.officer,
          checks: row.checks.map((check) =>
            check.state === 'Pending' ? { ...check, state: 'Verified' as const } : check),
          notes: payload.belongings.trim() || row.notes,
        }),
        `${modalRow?.name ?? 'Visitor'} checked in at ${payload.time}`,
      );
    },
    [modalRow, patchRow],
  );

  /** Checking out closes the entry, which returns the pass with it. */
  const checkOut = useCallback(
    (payload: CheckOutPayload) => {
      patchRow(
        (row) => ({
          ...row,
          checkOut: payload.time,
          closedBy: payload.officer,
          escort: row.escort,
          notes: payload.remarks.trim() || row.notes,
          checks: row.checks.map((check) =>
            check.state === 'Pending'
              ? { ...check, label: `${check.label} · ${payload.passReturn.toLowerCase()}`, state: 'Cleared' as const }
              : check),
        }),
        `${modalRow?.name ?? 'Visitor'} checked out at ${payload.time} — on site ${
          durationLabel(Math.max(0, minutesOf(payload.time) - minutesOf(modalRow?.checkIn ?? payload.time)))
        }`,
      );
    },
    [modalRow, patchRow],
  );

  const issuePass = useCallback(
    (payload: PassPayload) =>
      patchRow(
        (row) => ({
          ...row,
          passNumber: payload.passNumber,
          validFrom: payload.validFrom,
          validUntil: payload.validUntil,
          gate: payload.gate,
          escort: payload.handoverTo
            ? `Handed over to ${payload.handoverTo}` : row.escort,
          documents: [
            { name: `Gate Pass ${payload.passNumber}.pdf`, meta: `Issued ${payload.validFrom} · valid to ${payload.validUntil}` },
            ...row.documents,
          ],
        }),
        `${payload.passNumber} issued · valid ${payload.validFrom} to ${payload.validUntil}`,
      ),
    [patchRow],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} gate entries exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: GateEntry) => (
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
      <ActionLink className="dt-ib" ariaLabel="Issue gate pass" onClick={() => openModal(row, 'pass')}>
        <i className="ti ti-id-badge-2" />
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
  const primaryAction = (row: GateEntry) => {
    const status = statusOf(row);
    if (status === 'Access Denied') {
      return { modal: 'pass' as EntryModalId, icon: 'ti ti-id-badge-2', label: 'Issue Gate Pass' };
    }
    if (status === 'Pending Verification') {
      return { modal: 'checkin' as EntryModalId, icon: 'ti ti-door-enter', label: 'Check In' };
    }
    if (status === 'Exited') return null;
    return { modal: 'checkout' as EntryModalId, icon: 'ti ti-door-exit', label: 'Check Out' };
  };

  const renderDetail = (row: GateEntry) => {
    const primary = primaryAction(row);
    return (
      <div className="row g-4">
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-user text-primary me-1" />Person Information</h6>
          {pairList(personPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-id text-info me-1" />Visitor Details</h6>
          {pairList(visitorPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-users text-success me-1" />Host / Department</h6>
          {pairList(hostPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-car text-warning me-1" />Vehicle Information</h6>
          {row.vehicle ? pairList(vehiclePairsOf(row)) : (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-0">
              <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                <i className="ti ti-car-off" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">Entered on foot</h6>
                <span className="fs-12 text-muted text-truncate d-block">
                  No vehicle logged at the barrier
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-id-badge-2 text-purple me-1" />Gate Pass Details</h6>
          {pairList(passPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-timeline text-info me-1" />Entry &amp; Exit Timeline</h6>
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
          <h6 className="fs-14 mb-3"><i className="ti ti-shield-check text-danger me-1" />Security Notes</h6>
          {row.checks.map((check) => (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={check.label}>
              <span className="avatar avatar-sm bg-light text-muted rounded flex-shrink-0">
                <i className={checkIcon[check.state]} />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0">{check.label}</h6>
              </div>
              <span className={checkBadge[check.state]}>{check.state}</span>
            </div>
          ))}
          <p className="fs-13 text-muted mb-0 mt-2">{row.notes}</p>
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-files text-secondary me-1" />Attached Documents</h6>
          {row.documents.length === 0 ? (
            <p className="fs-13 text-muted mb-3">No documents filed.</p>
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
          <div className="d-flex align-items-center flex-wrap gap-2 mt-2">
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
              <i className="ti ti-shield-check me-1" />Security Panel
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
            title="Gate Entry"
            section="Security"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(rows.find((row) => row.checkIn && !row.checkOut) ?? rows[0] ?? null, 'checkout')}
                  >
                    <i className="ti ti-door-exit me-2" />Check Out
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Print Gate Register" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'new')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />New Gate Entry
                  </ActionLink>
                </div>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={SUMMARY_TOTALS.today - initialRows.length + rows.length}
            summary={summary}
            footerVariant="card-foot"
            pageSizeOptions={[8, 25, 50, 100]}
            footerInfoSuffix={`register as at ${REGISTER_TIME}`}
            workspaceId="geWorkspace"
            searchPlaceholder="Search visitor, student, staff or entry ID…"
            searchLabel="Search gate entries"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="entries"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Gate register refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-door-off"
            emptyTitle="No gate entries match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Security Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Gate Entry Details"
            labelledById="ge_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Personal Information</h6>
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
                    <span className="fs-12 text-muted">{panelRow.id} · {panelRow.personType}</span>
                  </div>
                  <span className={`${statusBadge[statusOf(panelRow)]} ms-auto`}>{statusOf(panelRow)}</span>
                </div>
                <div className="border rounded p-3 mb-3">{pairList(panelPersonPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Visit Details</h6>
                <div className="border rounded p-3 mb-3">{pairList(panelVisitPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Host Information</h6>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                  <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
                    <i className="ti ti-users" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0 text-truncate">{panelRow.hostContact.split('·')[0].trim()}</h6>
                    <span className="fs-12 text-muted text-truncate d-block">{panelRow.hostLocation}</span>
                  </div>
                  <span className="badge badge-soft-success">{panelRow.hostConfirmation}</span>
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
                      {/* This visit first, then the person's earlier ones. */}
                      <tr>
                        <td className="fs-13 text-nowrap">{panelRow.date}</td>
                        <td className="fs-13">{panelRow.checkIn || DASH}</td>
                        <td className="fs-13">{panelRow.checkOut || DASH}</td>
                        <td className="fs-13">{panelRow.gate}</td>
                      </tr>
                      {panelRow.pastVisits.map((visit) => (
                        <tr key={visit.date}>
                          <td className="fs-13 text-nowrap">{visit.date}</td>
                          <td className="fs-13">{visit.checkIn}</td>
                          <td className="fs-13">{visit.checkOut}</td>
                          <td className="fs-13">{visit.gate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h6 className="fs-14 mb-2">Vehicle Details</h6>
                {panelRow.vehicle ? (
                  <div className="border rounded p-3 mb-3">{pairList(vehiclePairsOf(panelRow))}</div>
                ) : (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                    <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                      <i className="ti ti-car-off" />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0 text-truncate">Entered on foot</h6>
                      <span className="fs-12 text-muted text-truncate d-block">
                        No vehicle logged at the barrier
                      </span>
                    </div>
                  </div>
                )}

                <h6 className="fs-14 mb-2">Security Verification</h6>
                <div className="border rounded p-3 mb-3">{pairList(verificationPairsOf(panelRow))}</div>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                  <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                    <i className="ti ti-camera" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0 text-truncate">Gate camera capture</h6>
                    <span className="fs-12 text-muted text-truncate d-block">
                      {panelRow.camera} · {panelRow.checkIn || panelRow.deniedAt || 'no capture'}
                      {panelRow.checkOut ? ` and ${panelRow.checkOut}` : ''}
                    </span>
                  </div>
                  <span className="badge badge-soft-secondary">Stored</span>
                </div>

                <h6 className="fs-14 mb-2">Audit Trail</h6>
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
                  {onSiteLabelOf(panelRow)} on site · pass {passStatusOf(panelRow).toLowerCase()}
                </p>

                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'checkout'); }}
                  >
                    <i className="ti ti-door-exit me-1" />Check Out
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

      <EntryModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onCreate={createEntry}
        onUpdate={updateEntry}
        onCheckIn={checkIn}
        onCheckOut={checkOut}
        onIssuePass={issuePass}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="geToasts" />
    </>
  );
};

export default GateEntryPage;
