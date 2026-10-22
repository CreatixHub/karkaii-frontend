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
import VisitModals from './modals/VisitModals';
import type {
  CheckInPayload, CheckOutPayload, PrintPayload, VisitDraft, VisitModalId,
} from './modals/VisitModals';
import type {
  HostDepartment, Visit, VisitStatus, VisitorType,
} from './data/visits.data';
import {
  PERIOD_FROM, PERIOD_TO, REGISTER_DATE, REGISTER_TIME, SUMMARY_TOTALS, VIEW_TOTALS,
  addMinutes, auditOf, checkInLabelOf, checkInSubLabelOf, checkOutLabelOf,
  checkOutSubLabelOf, contactPairsOf, dateKey, departmentBadge, departmentOptions,
  durationCellOf, durationLabelOf, durationOf, durationText, durationTintOf,
  frequencyLabelOf, frequencyOptions, gateOptions, hostPairsOf, identityPairsOf, isRepeat,
  matchesFrequency, minutesOf, profilePairsOf, purposeOptions, searchIndexOf, statusBadge,
  statusOf, statusOptions, statusPill, timelineOf, visitorBadge, visitorTypeOptions,
  visits as initialRows,
} from './data/visits.data';

const routes = all_routes;

/** Ids and options are the template's own; the July window opens committed. */
const filterFields: FilterField[] = [
  { id: 'visitor-type', label: 'Visitor Type', kind: 'select', chipLabel: 'Type', options: visitorTypeOptions },
  { id: 'host-department', label: 'Host Department', kind: 'select', chipLabel: 'Dept', options: departmentOptions },
  { id: 'visit-purpose', label: 'Visit Purpose', kind: 'select', chipLabel: 'Purpose', options: purposeOptions },
  { id: 'gate', label: 'Gate', kind: 'select', chipLabel: 'Gate', options: gateOptions },
  {
    id: 'from-date', label: 'From Date', kind: 'date', chipLabel: 'From',
    dateFormat: 'd-m-Y', initialValue: PERIOD_FROM,
  },
  {
    id: 'to-date', label: 'To Date', kind: 'date', chipLabel: 'To',
    dateFormat: 'd-m-Y', initialValue: PERIOD_TO,
  },
  { id: 'visit-status', label: 'Visit Status', kind: 'select', chipLabel: 'Status', allLabel: 'Any', options: statusOptions },
  { id: 'visit-frequency', label: 'Visit Frequency', kind: 'select', chipLabel: 'Frequency', allLabel: 'Any', options: frequencyOptions },
];

const sortOptions: SortOption[] = [
  { id: 'visit', label: 'Visit ID', icon: 'ti ti-hash' },
  { id: 'name', label: 'Visitor name (A–Z)', icon: 'ti ti-abc' },
  { id: 'checkin', label: 'Check-in time', icon: 'ti ti-door-enter' },
  { id: 'duration', label: 'Visit duration', icon: 'ti ti-clock' },
  { id: 'frequency', label: 'Visit frequency', icon: 'ti ti-users' },
];

const inputDateKey = (value: string): number => {
  const [day, month, year] = value.split('-').map(Number);
  return Number.isFinite(year) ? year * 10000 + month * 100 + day : 0;
};

/** "31-07-2026" → "31 Jul 2026", the way a row prints a date. */
const toRowDate = (value: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [day, month, year] = value.split('-');
  return months[Number(month) - 1] ? `${day} ${months[Number(month) - 1]} ${year}` : value;
};

/** A predicate for one derived status, used by the views, rail and strip. */
const isStatus = (status: VisitStatus) => (row: Visit) => statusOf(row) === status;

const VisitorLogPage = () => {
  const [rows, setRows] = useState<Visit[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<VisitModalId | null>(null);
  const [modalRow, setModalRow] = useState<Visit | null>(null);
  const [panelRow, setPanelRow] = useState<Visit | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Visit | null, modal: VisitModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: Visit) => Visit, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Visit>[]>(
    () => [
      {
        id: 'visit',
        label: 'Visit ID',
        sortable: true,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>{row.id}</ActionLink>
        ),
      },
      {
        id: 'name',
        label: 'Visitor Name',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className={`avatar avatar-md bg-${row.tint}-transparent text-${row.tint} rounded flex-shrink-0 me-2`}>
              <i className={row.icon} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.name}</ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">{row.reference}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'type',
        label: 'Visitor Type',
        sortable: true,
        render: (row) => (
          <>
            <span className={visitorBadge[row.visitorType]}>{row.visitorType}</span>
            {/* One visit on record is a first visit; more is a repeat. */}
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{frequencyLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'host',
        label: 'Host',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.host}</span>
            <span className="fs-12 text-muted text-nowrap">{row.hostRole}</span>
          </>
        ),
      },
      {
        id: 'department',
        label: 'Department',
        sortable: true,
        render: (row) => <span className={departmentBadge[row.department]}>{row.department}</span>,
      },
      {
        id: 'checkin',
        label: 'Check-In',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{checkInLabelOf(row)}</span>
            <span className="fs-12 text-muted text-nowrap">{checkInSubLabelOf(row)}</span>
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
            <span className="fs-12 text-muted text-nowrap">{checkOutSubLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'duration',
        label: 'Visit Duration',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 fw-medium text-nowrap">{durationCellOf(row)}</span>
            {/* Closed, running, over by, not started or refused. */}
            <span className={`fs-12 text-nowrap ${durationTintOf(row)}`}>{durationLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'purpose',
        label: 'Visit Purpose',
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.purpose}</span>
            <span className="fs-12 text-muted text-nowrap">{row.detail}</span>
          </>
        ),
      },
      {
        id: 'status',
        label: 'Visit Status',
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

  const workspace = useWorkspace<Visit>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['visitor-type'] && row.visitorType !== filters['visitor-type']) return false;
      if (filters['host-department'] && row.department !== filters['host-department']) return false;
      if (filters['visit-purpose'] && row.purpose !== filters['visit-purpose']) return false;
      if (filters.gate && row.gate !== filters.gate) return false;
      if (filters['from-date'] && dateKey(row.date) < inputDateKey(filters['from-date'])) return false;
      if (filters['to-date'] && dateKey(row.date) > inputDateKey(filters['to-date'])) return false;
      if (filters['visit-status'] && statusOf(row) !== filters['visit-status']) return false;
      if (filters['visit-frequency'] && !matchesFrequency(row, filters['visit-frequency'])) return false;
      return true;
    },
    /** The rail opens on All, which narrows nothing. */
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'Today') return row.date === REGISTER_DATE;
      if (quick === 'Inside') return statusOf(row) === 'In Progress';
      if (quick === 'Completed') return statusOf(row) === 'Completed';
      if (quick === 'Repeat') return isRepeat(row);
      return statusOf(row) === 'Cancelled';
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'today': return row.date === REGISTER_DATE;
        case 'inside': return statusOf(row) === 'In Progress';
        case 'repeat': return isRepeat(row);
        case 'overstayed': return statusOf(row) === 'Overstayed';
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'checkin':
          return dateKey(b.date) - dateKey(a.date)
            || minutesOf(a.checkIn || '23:59') - minutesOf(b.checkIn || '23:59');
        case 'duration':
          return durationOf(b) - durationOf(a) || a.id.localeCompare(b.id);
        case 'frequency':
          return b.visitsOnRecord - a.visitsOnRecord || a.name.localeCompare(b.name);
        // The `<th>`s sort on columns the menu does not offer.
        case 'type':
          return a.visitorType.localeCompare(b.visitorType);
        case 'host':
          return a.host.localeCompare(b.host);
        case 'department':
          return a.department.localeCompare(b.department);
        case 'checkout':
          return minutesOf(a.checkOut || '23:59') - minutesOf(b.checkOut || '23:59');
        case 'visit':
        default:
          return a.id.localeCompare(b.id);
      }
    },
    defaultSort: 'visit',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: Visit) => boolean) => rows.filter(test).length,
    [rows],
  );

  /** Template total − what it seeded + what the roster holds now. */
  const shift = useCallback(
    (base: number, test: (row: Visit) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Visits', icon: 'ti ti-layout-list', count: shift(VIEW_TOTALS.all, () => true) },
      {
        id: 'today', label: 'Today’s Visitors', icon: 'ti ti-calendar-event',
        count: shift(VIEW_TOTALS.today, (row) => row.date === REGISTER_DATE),
      },
      { id: 'inside', label: 'Currently Inside', icon: 'ti ti-door-enter', count: shift(VIEW_TOTALS.inside, isStatus('In Progress')) },
      { id: 'repeat', label: 'Repeat Visitors', icon: 'ti ti-users', count: shift(VIEW_TOTALS.repeat, isRepeat) },
      { id: 'overstayed', label: 'Overstayed Visits', icon: 'ti ti-alert-triangle', count: shift(VIEW_TOTALS.overstayed, isStatus('Overstayed')) },
    ],
    [shift],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: shift(VIEW_TOTALS.all, () => true) },
      {
        id: 'Today', label: 'Today', icon: 'ti ti-calendar-event',
        count: shift(VIEW_TOTALS.today, (row) => row.date === REGISTER_DATE),
      },
      { id: 'Inside', label: 'Inside', icon: 'ti ti-door-enter', count: shift(VIEW_TOTALS.inside, isStatus('In Progress')) },
      { id: 'Completed', label: 'Completed', icon: 'ti ti-circle-check', count: shift(SUMMARY_TOTALS.completed, isStatus('Completed')) },
      { id: 'Repeat', label: 'Repeat', icon: 'ti ti-users', count: shift(VIEW_TOTALS.repeat, isRepeat) },
      { id: 'Cancelled', label: 'Cancelled', icon: 'ti ti-circle-x', count: shift(VIEW_TOTALS.cancelled, isStatus('Cancelled')) },
    ],
    [shift],
  );

  /**
   * The strip counts the whole session — 1,284 visits against the eight this
   * page lists — so the template's figures stand and the roster moves them.
   */
  const summary = useMemo<SummaryItem[]>(
    () => [
      {
        id: 'total', tint: 'primary', icon: 'ti ti-history', label: 'Total Visits',
        value: shift(SUMMARY_TOTALS.total, () => true).toLocaleString('en-US'),
        hint: '2026 / 2027 to date',
      },
      {
        id: 'today', tint: 'info', icon: 'ti ti-calendar-event', label: 'Today’s Visitors',
        value: String(shift(SUMMARY_TOTALS.today, (row) => row.date === REGISTER_DATE)),
        hint: `${REGISTER_DATE} · all gates`,
      },
      {
        id: 'inside', tint: 'success', icon: 'ti ti-door-enter', label: 'Currently Inside',
        value: String(shift(SUMMARY_TOTALS.inside, isStatus('In Progress'))), hint: 'on campus now',
      },
      {
        id: 'completed', tint: 'secondary', icon: 'ti ti-circle-check', label: 'Completed Visits',
        value: shift(SUMMARY_TOTALS.completed, isStatus('Completed')).toLocaleString('en-US'),
        hint: 'checked in and out',
      },
      {
        id: 'repeat', tint: 'warning', icon: 'ti ti-users', label: 'Repeat Visitors',
        value: String(shift(SUMMARY_TOTALS.repeat, isRepeat)), hint: 'two or more visits',
      },
    ],
    [shift],
  );

  /* -------------------------------- Mutations ------------------------------- */

  const logVisit = useCallback(
    (draft: VisitDraft) => {
      if (!draft.name.trim()) {
        push('Give the visitor a name', 'warning');
        return;
      }
      const [host, hostRole] = draft.host.split('·').map((part) => part.trim());
      const scheduled = draft.logType === 'Scheduled';
      const id = `VST-2026-19${rows.length < 10 ? `0${rows.length}` : rows.length}`;
      setRows((current) => [
        {
          id, name: draft.name.trim(),
          icon: draft.visitorType === 'Vendor' ? 'ti ti-truck-delivery'
            : draft.visitorType === 'Contractor' ? 'ti ti-tool'
              : draft.visitorType === 'Guardian' ? 'ti ti-users'
                : draft.visitorType === 'Official' ? 'ti ti-school' : 'ti ti-user',
          tint: draft.visitorType === 'Vendor' ? 'purple'
            : draft.visitorType === 'Contractor' ? 'secondary'
              : draft.visitorType === 'Guardian' ? 'warning'
                : draft.visitorType === 'Official' ? 'info' : 'primary',
          reference: draft.organisation.trim() || 'Walk in · no organisation',
          visitorType: draft.visitorType as VisitorType,
          phone: draft.phone.trim() || 'Not recorded',
          email: 'Not provided',
          vehicle: draft.vehicle.trim() ? `Vehicle · ${draft.vehicle.trim()}` : '',
          host, hostRole: hostRole ?? 'Not recorded',
          department: draft.department as HostDepartment,
          purpose: draft.purpose.trim() || 'Not stated',
          detail: draft.detail.trim() || `Logged at the ${draft.gate.toLowerCase()}`,
          gate: draft.gate, lane: `${draft.gate} · Lane 1`,
          gateOfficer: scheduled ? '' : draft.officer,
          date: toRowDate(draft.visitDate),
          checkIn: scheduled ? '' : draft.checkIn,
          checkOut: scheduled ? '' : draft.checkOut,
          passNumber: scheduled ? '' : `VP-2026-09${rows.length}`,
          passUntil: scheduled ? '' : addMinutes(draft.checkIn, 120),
          refused: false, refusedAt: '', expected: scheduled ? draft.checkIn : '',
          idProof: draft.idProof, idNumber: 'Masked on the register',
          verification: 'Not linked',
          gateRegister: draft.linkGate ? `GT-2026-09${rows.length}` : '',
          escort: 'Escort not required',
          visitsOnRecord: 1, pastVisits: [], documents: [],
          notes: draft.notes.trim() || 'Logged from the visitor register.',
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} logged for ${draft.name.trim()}`);
    },
    [push, rows.length],
  );

  const updateVisit = useCallback(
    (draft: VisitDraft) => {
      const [host, hostRole] = draft.host.split('·').map((part) => part.trim());
      patchRow(
        (row) => ({
          ...row,
          name: draft.name.trim() || row.name,
          visitorType: draft.visitorType as VisitorType,
          phone: draft.phone.trim() || row.phone,
          host, hostRole: hostRole ?? row.hostRole,
          department: draft.department as HostDepartment,
          purpose: draft.purpose.trim() || row.purpose,
          detail: draft.detail.trim() || row.detail,
          date: toRowDate(draft.visitDate),
          checkIn: draft.logType === 'Scheduled' ? '' : draft.checkIn,
          // Setting a check-out is what closes an overstayed visit.
          checkOut: draft.logType === 'Scheduled' ? '' : draft.checkOut,
          gate: draft.gate,
          gateOfficer: draft.officer,
          idProof: draft.idProof,
          vehicle: draft.vehicle.trim() ? `Vehicle · ${draft.vehicle.trim()}` : '',
          notes: draft.notes.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Visit'} updated`,
      );
    },
    [modalRow, patchRow],
  );

  /** Checking in starts the visit, which takes it off Scheduled. */
  const checkIn = useCallback(
    (payload: CheckInPayload) => {
      const minutes = payload.validity === '1 hour' ? 60
        : payload.validity === '2 hours' ? 120 : payload.validity === '4 hours' ? 240 : 600;
      patchRow(
        (row) => ({
          ...row,
          checkIn: payload.time,
          gate: payload.gate,
          gateOfficer: payload.officer,
          passNumber: row.passNumber || `VP-2026-09${rows.length}`,
          passUntil: addMinutes(payload.time, minutes),
          gateRegister: row.gateRegister || `GT-2026-09${rows.length}`,
          escort: payload.escort,
          notes: payload.remarks.trim() || row.notes,
        }),
        `${modalRow?.name ?? 'Visitor'} checked in at ${payload.time}`,
      );
    },
    [modalRow, patchRow, rows.length],
  );

  /** Checking out closes the visit and settles its duration. */
  const checkOut = useCallback(
    (payload: CheckOutPayload) => {
      if (!modalRow?.checkIn) {
        push('This visitor has not checked in yet', 'warning');
        return;
      }
      const span = Math.max(0, minutesOf(payload.time) - minutesOf(modalRow.checkIn));
      patchRow(
        (row) => ({
          ...row,
          checkOut: payload.time,
          gate: payload.gate,
          gateOfficer: payload.officer,
          notes: payload.remarks.trim() || row.notes,
          documents: [
            { name: 'Exit Scan Record.pdf', meta: `${payload.time} · ${payload.officer}` },
            ...row.documents,
          ],
        }),
        `${modalRow.name} checked out at ${payload.time} — on site ${durationText(span)}`,
      );
    },
    [modalRow, patchRow, push],
  );

  const printPass = useCallback(
    (payload: PrintPayload) => {
      setActiveModal(null);
      push(
        `${payload.copies} × ${modalRow?.passNumber || 'visit record'} sent to ${payload.printer} as ${payload.format}`,
        'info',
      );
    },
    [modalRow, push],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} visits exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Visit) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View visit" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit visit" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Check in" onClick={() => openModal(row, 'checkin')}>
        <i className="ti ti-door-enter" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Check out" onClick={() => openModal(row, 'checkout')}>
        <i className="ti ti-door-exit" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Print pass" onClick={() => openModal(row, 'print')}>
        <i className="ti ti-printer" />
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

  /** The expander's last card offers whatever this visit's state calls for. */
  const primaryAction = (row: Visit) => {
    const status = statusOf(row);
    if (status === 'Scheduled') {
      return { modal: 'checkin' as VisitModalId, icon: 'ti ti-door-enter', label: 'Check-In' };
    }
    if (status === 'In Progress' || status === 'Overstayed') {
      return { modal: 'checkout' as VisitModalId, icon: 'ti ti-door-exit', label: 'Check-Out' };
    }
    if (status === 'Completed') {
      return { modal: 'print' as VisitModalId, icon: 'ti ti-printer', label: 'Print Pass' };
    }
    return null;
  };

  const renderDetail = (row: Visit) => {
    const primary = primaryAction(row);
    return (
      <div className="row g-4">
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-user text-primary me-1" />Visitor Profile</h6>
          {pairList(profilePairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-phone text-info me-1" />Contact Information</h6>
          {pairList(contactPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-id text-purple me-1" />Identity Verification</h6>
          {pairList(identityPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-users text-success me-1" />Host &amp; Meeting Details</h6>
          {pairList(hostPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-timeline text-warning me-1" />Entry &amp; Exit Timeline</h6>
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
          <h6 className="fs-14 mb-3"><i className="ti ti-history text-secondary me-1" />Previous Visit History</h6>
          {row.pastVisits.length === 0 ? (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
              <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                <i className="ti ti-user" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">First recorded visit</h6>
                <span className="fs-12 text-muted text-truncate d-block">
                  No prior entry on the register
                </span>
              </div>
            </div>
          ) : (
            row.pastVisits.map((visit) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={visit.date}>
                <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                  <i className="ti ti-history" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{visit.date} · {visit.purpose}</h6>
                  <span className="fs-12 text-muted text-truncate d-block">
                    In {visit.checkIn} · Out {visit.checkOut}
                  </span>
                </div>
              </div>
            ))
          )}
          <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top">
            <span className="fs-13 fw-medium">Visits On Record</span>
            <span className="fs-13 fw-semibold">{row.visitsOnRecord}</span>
          </div>
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-note text-danger me-1" />Security Notes</h6>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
            <span className={visitorBadge[row.visitorType]}>{row.visitorType}</span>
            <span className="badge badge-soft-secondary">{row.gate}</span>
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
              <i className="ti ti-eye me-1" />View Visit
            </button>
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm"
              onClick={() => setPanelRow(row)}
            >
              <i className="ti ti-history me-1" />Visit Log Panel
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
          {row.documents.map((document) => (
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
            title="Visitor Log"
            section="Security"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(rows.find((row) => row.passNumber) ?? rows[0] ?? null, 'print')}
                  >
                    <i className="ti ti-printer me-2" />Print Pass
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Print Visitor Log" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'log')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Log New Visit
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
            workspaceId="vlWorkspace"
            searchPlaceholder="Search visitor, pass ID or visit ID…"
            searchLabel="Search visits"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="visits"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Visitor log refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-history-off"
            emptyTitle="No visits match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Visit Log Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Visit Log Details"
            labelledById="vl_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Visitor Information</h6>
                <div className="d-flex align-items-center mb-3">
                  <span
                    className={`avatar avatar-lg bg-${panelRow.tint}-transparent text-${panelRow.tint} rounded flex-shrink-0`}
                  >
                    <i className={`${panelRow.icon} fs-20`} />
                  </span>
                  <div className="ms-2 overflow-hidden">
                    <h6 className="mb-0 text-truncate">{panelRow.name}</h6>
                    <span className="fs-12 text-muted">{panelRow.id} · {panelRow.visitorType}</span>
                  </div>
                  <span className={`${statusBadge[statusOf(panelRow)]} ms-auto`}>{statusOf(panelRow)}</span>
                </div>
                <div className="border rounded p-3 mb-3">{pairList(profilePairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Contact Information</h6>
                <div className="border rounded p-3 mb-3">{pairList(contactPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Identity &amp; Pass</h6>
                <div className="border rounded p-3 mb-3">{pairList(identityPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Host &amp; Meeting</h6>
                <div className="border rounded p-3 mb-3">{pairList(hostPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Entry &amp; Exit Timeline</h6>
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

                <h6 className="fs-14 mb-2 mt-3">Visit History</h6>
                <div className="table-responsive mb-3">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th className="fs-12">Date</th>
                        <th className="fs-12">In</th>
                        <th className="fs-12">Out</th>
                        <th className="fs-12">Purpose</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* This visit first, then the ones already on the register. */}
                      <tr>
                        <td className="fs-13 text-nowrap">{panelRow.date}</td>
                        <td className="fs-13">{panelRow.checkIn || '—'}</td>
                        <td className="fs-13">{panelRow.checkOut || '—'}</td>
                        <td className="fs-13">{panelRow.purpose}</td>
                      </tr>
                      {panelRow.pastVisits.map((visit) => (
                        <tr key={visit.date}>
                          <td className="fs-13 text-nowrap">{visit.date}</td>
                          <td className="fs-13">{visit.checkIn}</td>
                          <td className="fs-13">{visit.checkOut}</td>
                          <td className="fs-13">{visit.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                  {durationCellOf(panelRow)} on site · {frequencyLabelOf(panelRow).toLowerCase()}
                </p>

                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'print'); }}
                  >
                    <i className="ti ti-printer me-1" />Print Pass
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

      <VisitModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onLog={logVisit}
        onUpdate={updateVisit}
        onCheckIn={checkIn}
        onCheckOut={checkOut}
        onPrint={printPass}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="vlToasts" />
    </>
  );
};

export default VisitorLogPage;
