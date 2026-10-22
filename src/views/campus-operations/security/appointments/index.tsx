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
import AppointmentModals from './modals/AppointmentModals';
import type {
  AppointmentDraft, AppointmentModalId, DecisionPayload, PassPayload, ReschedulePayload,
} from './modals/AppointmentModals';
import type {
  AppointmentRequest, AppointmentType, ApprovalStatus, HostDepartment,
} from './data/appointments.data';
import {
  QUICK_TOTALS, REGISTER_DATE, REGISTER_TIME, REQUESTED_FROM, REQUESTED_TO, SUMMARY_TOTALS,
  VIEW_TOTALS, appointmentPairsOf, appointments as initialRows, auditOf,
  checkBadge, checkIcon, checkSummaryOf, dateKey, decisionLabelOf, departmentBadge,
  departmentOptions, durationOf, durationText, hostPairsOf, idBadge, idChip,
  idStateOf, matchesRequestedBetween, minutesOf, minutesToStartOf, partyLabelOf, passBadge,
  passLabelOf, passPairsOf, passStatusOptions, requestedBetweenOptions, requestedSubLabelOf,
  searchIndexOf, slotLabelOf, slotSubLabelOf, slotTintOf, statusBadge, statusOf,
  statusOptions, statusPill, timelineOf, typeBadge, typeIcon, typeOptions, visitorPairsOf,
} from './data/appointments.data';

const routes = all_routes;

/** Ids and options are the template's own; the request window opens committed. */
const filterFields: FilterField[] = [
  { id: 'host-department', label: 'Host Department', kind: 'select', chipLabel: 'Dept', options: departmentOptions },
  { id: 'appointment-type', label: 'Appointment Type', kind: 'select', chipLabel: 'Type', options: typeOptions },
  { id: 'approval-status', label: 'Approval Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'gate-pass-status', label: 'Gate Pass Status', kind: 'select', chipLabel: 'Pass', options: passStatusOptions },
  { id: 'visit-date', label: 'Visit Date', kind: 'date', chipLabel: 'Visit', dateFormat: 'd-m-Y' },
  {
    id: 'requested-between', label: 'Requested Between', kind: 'select', chipLabel: 'Window',
    allLabel: 'Any', options: requestedBetweenOptions,
  },
  {
    id: 'from-date', label: 'From Date', kind: 'date', chipLabel: 'From',
    dateFormat: 'd-m-Y', initialValue: REQUESTED_FROM,
  },
  {
    id: 'to-date', label: 'To Date', kind: 'date', chipLabel: 'To',
    dateFormat: 'd-m-Y', initialValue: REQUESTED_TO,
  },
];

const sortOptions: SortOption[] = [
  { id: 'request', label: 'Request ID', icon: 'ti ti-hash' },
  { id: 'visitor', label: 'Visitor name (A–Z)', icon: 'ti ti-abc' },
  { id: 'slot', label: 'Visit date and time', icon: 'ti ti-calendar-event' },
  { id: 'requested', label: 'Requested on', icon: 'ti ti-clock' },
  { id: 'status', label: 'Approval status', icon: 'ti ti-circle-check' },
];

const inputDateKey = (value: string): number => {
  const [day, month, year] = value.split('-').map(Number);
  return Number.isFinite(year) ? year * 10000 + month * 100 + day : 0;
};

/** "05-08-2026" → "5 Aug 2026", the way a row prints a date. */
const toRowDate = (value: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [day, month, year] = value.split('-');
  return months[Number(month) - 1] ? `${Number(day)} ${months[Number(month) - 1]} ${year}` : value;
};

/** Approved and Completed both count as approved on the strip and the rail. */
const isApproved = (row: AppointmentRequest) =>
  statusOf(row) === 'Approved' || statusOf(row) === 'Completed';

/** A predicate for one derived status, used by the views, rail and strip. */
const isStatus = (status: ApprovalStatus) => (row: AppointmentRequest) => statusOf(row) === status;

const AppointmentRequestsPage = () => {
  const [rows, setRows] = useState<AppointmentRequest[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<AppointmentModalId | null>(null);
  const [modalRow, setModalRow] = useState<AppointmentRequest | null>(null);
  const [panelRow, setPanelRow] = useState<AppointmentRequest | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: AppointmentRequest | null, modal: AppointmentModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: AppointmentRequest) => AppointmentRequest, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<AppointmentRequest>[]>(
    () => [
      {
        id: 'request',
        label: 'Request ID',
        sortable: true,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>{row.id}</ActionLink>
        ),
      },
      {
        id: 'visitor',
        label: 'Visitor Name',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="avatar avatar-md bg-primary-transparent text-primary rounded flex-shrink-0 me-2">
              <i className="ti ti-user" />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.visitor}</ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">{row.reference}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'type',
        label: 'Appointment Type',
        sortable: true,
        render: (row) => (
          <>
            <span className={typeBadge[row.appointmentType]}>
              <i className={`${typeIcon[row.appointmentType]} me-1`} />{row.appointmentType}
            </span>
            {/* Party size and escort, read off the request. */}
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{partyLabelOf(row)}</span>
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
        id: 'slot',
        label: 'Visit Date & Time',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.visitDate}</span>
            <span className="fs-12 text-muted text-nowrap">{slotLabelOf(row)}</span>
            {/* Starts in, ends in, ended, not admitted or slot released. */}
            <span className={`d-block fs-12 text-nowrap ${slotTintOf(row)}`}>{slotSubLabelOf(row)}</span>
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
        id: 'requested',
        label: 'Requested On',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.requestedOn}</span>
            <span className="fs-12 text-muted text-nowrap">{requestedSubLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'status',
        label: 'Approval Status',
        render: (row) => (
          <>
            <span className={`dt-pill ${statusPill[statusOf(row)]}`}>
              <span className="dt-pill-dot" />{statusOf(row)}
            </span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{decisionLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'pass',
        label: 'Gate Pass Status',
        render: (row) => (
          <>
            <span className={passBadge[row.passStatus]}>{row.passStatus}</span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{passLabelOf(row)}</span>
          </>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<AppointmentRequest>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['host-department'] && row.department !== filters['host-department']) return false;
      if (filters['appointment-type'] && row.appointmentType !== filters['appointment-type']) return false;
      if (filters['approval-status'] && statusOf(row) !== filters['approval-status']) return false;
      if (filters['gate-pass-status'] && row.passStatus !== filters['gate-pass-status']) return false;
      if (filters['visit-date'] && dateKey(row.visitDate) !== inputDateKey(filters['visit-date'])) return false;
      if (filters['requested-between'] && !matchesRequestedBetween(row, filters['requested-between'])) return false;
      if (filters['from-date']
        && dateKey(row.requestedOn) < inputDateKey(filters['from-date'])) return false;
      if (filters['to-date']
        && dateKey(row.requestedOn) > inputDateKey(filters['to-date'])) return false;
      return true;
    },
    /** The rail opens on All, which narrows nothing. */
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'Pending') return statusOf(row) === 'Pending Approval';
      if (quick === 'Approved') return statusOf(row) === 'Approved' || statusOf(row) === 'Completed';
      if (quick === 'Today') return row.visitDate === REGISTER_DATE;
      return statusOf(row) === quick;
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'pending': return statusOf(row) === 'Pending Approval';
        case 'today': return row.visitDate === REGISTER_DATE;
        case 'no-pass': return row.passNumber === '';
        case 'rejected': return statusOf(row) === 'Rejected' || statusOf(row) === 'Cancelled';
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'visitor':
          return a.visitor.localeCompare(b.visitor);
        case 'slot':
          return minutesToStartOf(a) - minutesToStartOf(b);
        case 'requested':
          return dateKey(b.requestedOn) - dateKey(a.requestedOn)
            || minutesOf(b.requestedAt) - minutesOf(a.requestedAt);
        case 'status':
          return statusOf(a).localeCompare(statusOf(b)) || a.id.localeCompare(b.id);
        // The `<th>`s sort on columns the menu does not offer.
        case 'type':
          return a.appointmentType.localeCompare(b.appointmentType);
        case 'host':
          return a.host.localeCompare(b.host);
        case 'department':
          return a.department.localeCompare(b.department);
        case 'request':
        default:
          return a.id.localeCompare(b.id);
      }
    },
    defaultSort: 'request',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: AppointmentRequest) => boolean) => rows.filter(test).length,
    [rows],
  );

  /** Template total − what it seeded + what the roster holds now. */
  const shift = useCallback(
    (base: number, test: (row: AppointmentRequest) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Requests', icon: 'ti ti-layout-list', count: shift(VIEW_TOTALS.all, () => true) },
      { id: 'pending', label: 'Awaiting My Approval', icon: 'ti ti-clock', count: shift(VIEW_TOTALS.pending, isStatus('Pending Approval')) },
      {
        id: 'today', label: 'Today’s Appointments', icon: 'ti ti-calendar-time',
        count: shift(VIEW_TOTALS.today, (row) => row.visitDate === REGISTER_DATE),
      },
      {
        id: 'no-pass', label: 'Gate Pass Not Issued', icon: 'ti ti-ticket',
        count: shift(VIEW_TOTALS.noPass, (row) => row.passNumber === ''),
      },
      {
        id: 'rejected', label: 'Rejected Requests', icon: 'ti ti-circle-x',
        count: shift(VIEW_TOTALS.rejected, (row) => statusOf(row) === 'Rejected' || statusOf(row) === 'Cancelled'),
      },
    ],
    [shift],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: shift(QUICK_TOTALS.all, () => true) },
      { id: 'Pending', label: 'Pending', icon: 'ti ti-clock', count: shift(QUICK_TOTALS.pending, isStatus('Pending Approval')) },
      { id: 'Approved', label: 'Approved', icon: 'ti ti-circle-check', count: shift(QUICK_TOTALS.approved, isApproved) },
      { id: 'Rescheduled', label: 'Rescheduled', icon: 'ti ti-calendar-time', count: shift(QUICK_TOTALS.rescheduled, isStatus('Rescheduled')) },
      { id: 'Rejected', label: 'Rejected', icon: 'ti ti-circle-x', count: shift(QUICK_TOTALS.rejected, isStatus('Rejected')) },
      {
        id: 'Today', label: 'Today', icon: 'ti ti-calendar-event',
        count: shift(QUICK_TOTALS.today, (row) => row.visitDate === REGISTER_DATE),
      },
    ],
    [shift],
  );

  /**
   * The strip counts the whole term — 146 requests against the eight this page
   * lists — so the template's figures stand and the roster moves them.
   */
  const summary = useMemo<SummaryItem[]>(() => {
    const total = shift(SUMMARY_TOTALS.total, () => true);
    const approved = shift(SUMMARY_TOTALS.approved, isApproved);
    return [
      {
        id: 'total', tint: 'primary', icon: 'ti ti-calendar-event', label: 'Total Requests',
        value: String(total), hint: 'this academic term',
      },
      {
        id: 'pending', tint: 'warning', icon: 'ti ti-clock', label: 'Pending Approval',
        value: String(shift(SUMMARY_TOTALS.pending, isStatus('Pending Approval'))),
        hint: 'awaiting a host decision',
      },
      {
        id: 'approved', tint: 'success', icon: 'ti ti-circle-check', label: 'Approved',
        value: String(approved),
        // The share moves with the roster rather than staying at the printed 71%.
        hint: `${total === 0 ? 0 : Math.round((approved / total) * 100)}% of all requests`,
      },
      {
        id: 'rejected', tint: 'danger', icon: 'ti ti-circle-x', label: 'Rejected',
        value: String(shift(SUMMARY_TOTALS.rejected, isStatus('Rejected'))),
        hint: SUMMARY_TOTALS.rejectedBreakdown,
      },
      {
        id: 'today', tint: 'info', icon: 'ti ti-calendar-time', label: 'Today’s Appointments',
        value: String(shift(SUMMARY_TOTALS.today, (row) => row.visitDate === REGISTER_DATE)),
        hint: `${REGISTER_DATE} · all gates`,
      },
    ];
  }, [shift]);

  /* -------------------------------- Mutations ------------------------------- */

  const scheduleAppointment = useCallback(
    (draft: AppointmentDraft) => {
      if (!draft.visitor.trim()) {
        push('Give the request a visitor', 'warning');
        return;
      }
      const [host, hostRole] = draft.host.split('·').map((part) => part.trim());
      const id = draft.requestId.trim() || `APT-2026-07${50 + rows.length}`;
      const appointmentType: AppointmentType = draft.quickType === 'Admission' ? 'Admission Interview'
        : draft.quickType === 'Vendor' ? 'Vendor Visit'
          : draft.quickType === 'Official' ? 'Official Visit' : 'Parent Meeting';
      setRows((current) => [
        {
          id, visitor: draft.visitor.trim(),
          reference: draft.reference.trim() || 'Raised at the office',
          personType: draft.personType,
          contact: draft.contact.trim() || 'Not recorded',
          idProof: draft.idProof, idNumber: draft.idNumber.trim() || 'Masked on the register',
          appointmentType,
          partySize: Number(draft.partySize.split(' ')[0]) || 1,
          escortRequired: draft.escort.startsWith('Required'),
          host, hostRole: hostRole ?? 'Not recorded',
          department: draft.department as HostDepartment,
          extension: 'Not recorded',
          visitDate: toRowDate(draft.visitDate),
          slotFrom: draft.slotFrom, slotUntil: draft.slotUntil,
          purpose: draft.purpose.trim() || 'Not stated',
          purposeDetail: draft.reference.trim() || 'No reference',
          requestedOn: REGISTER_DATE, requestedAt: REGISTER_TIME,
          decidedBy: '', decidedOn: '', decision: '', movedFrom: '',
          passStatus: draft.prepareDraftPass ? 'Draft Prepared' : 'Not Issued',
          passNumber: '', gate: draft.gate,
          checks: [
            { label: draft.idProof, detail: draft.idNumber.trim() || 'Masked on the register', state: 'Passed' },
            { label: 'Booking reference', detail: draft.reference.trim() || 'Not supplied', state: 'Passed' },
            {
              label: 'Host confirmation',
              detail: draft.sendToHost ? `Awaiting ${host}` : 'Confirmed at the office',
              state: draft.sendToHost ? 'Pending' : 'Passed',
            },
          ],
          documents: [],
          notes: draft.notes.trim() || 'Raised from the appointment register.',
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} raised for ${draft.visitor.trim()}`);
    },
    [push, rows.length],
  );

  const updateAppointment = useCallback(
    (draft: AppointmentDraft) => {
      const [host, hostRole] = draft.host.split('·').map((part) => part.trim());
      patchRow(
        (row) => ({
          ...row,
          visitor: draft.visitor.trim() || row.visitor,
          personType: draft.personType,
          contact: draft.contact.trim() || row.contact,
          visitDate: toRowDate(draft.visitDate),
          slotFrom: draft.slotFrom, slotUntil: draft.slotUntil,
          host, hostRole: hostRole ?? row.hostRole,
          department: draft.department as HostDepartment,
          purpose: draft.purpose.trim() || row.purpose,
          purposeDetail: draft.reference.trim() || row.purposeDetail,
          idProof: draft.idProof,
          idNumber: draft.idNumber.trim() || row.idNumber,
          partySize: Number(draft.partySize.split(' ')[0]) || row.partySize,
          escortRequired: draft.escort.startsWith('Required'),
          gate: draft.gate,
          notes: draft.notes.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Request'} updated`,
      );
    },
    [modalRow, patchRow],
  );

  /** The decision is what takes a request off Pending Approval. */
  const decide = useCallback(
    (payload: DecisionPayload) => {
      const rejecting = payload.decision === 'Reject';
      const holding = payload.decision === 'Hold';
      patchRow(
        (row) => ({
          ...row,
          decision: rejecting ? 'rejected' : holding ? '' : 'approved',
          decidedBy: payload.decidedBy.split('·')[0].trim(),
          decidedOn: REGISTER_DATE,
          slotFrom: rejecting ? row.slotFrom : payload.confirmedFrom,
          slotUntil: rejecting ? row.slotUntil : payload.confirmedUntil,
          // Approving satisfies the host-confirmation check that was pending.
          checks: rejecting ? row.checks : row.checks.map((check) =>
            /host confirmation/i.test(check.label) && check.state === 'Pending'
              ? { ...check, detail: `Confirmed ${REGISTER_TIME}`, state: 'Passed' as const } : check),
          passStatus: rejecting ? 'Blocked'
            : holding ? row.passStatus
              : payload.releasePass ? 'Ready to Issue' : row.passStatus,
          notes: payload.remarks.trim() || row.notes,
        }),
        rejecting
          ? `${modalRow?.id ?? 'Request'} rejected — ${payload.rejectionReason.toLowerCase()}`
          : `${modalRow?.id ?? 'Request'} ${holding ? 'held' : 'approved'} for ${payload.confirmedFrom} – ${payload.confirmedUntil}`,
      );
    },
    [modalRow, patchRow],
  );

  /** Moving the slot is what makes a request Rescheduled. */
  const reschedule = useCallback(
    (payload: ReschedulePayload) => {
      if (!modalRow) return;
      const [host, hostRole] = payload.host.split('·').map((part) => part.trim());
      patchRow(
        (row) => ({
          ...row,
          movedFrom: row.visitDate,
          visitDate: toRowDate(payload.newDate),
          slotFrom: payload.newFrom, slotUntil: payload.newUntil,
          host, hostRole: hostRole ?? row.hostRole,
          decidedBy: host, decidedOn: REGISTER_DATE,
          decision: 'approved',
          checks: payload.carryChecks ? row.checks : row.checks.map((check) => ({
            ...check, state: check.state === 'Passed' ? 'Pending' as const : check.state,
          })),
          notes: payload.remarks.trim() || row.notes,
        }),
        `${modalRow.id} moved to ${toRowDate(payload.newDate)} · ${payload.newFrom} – ${payload.newUntil}`,
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
          passStatus: payload.holdAtDesk ? 'Ready to Issue' : 'Issued',
          gate: payload.gate,
          documents: [
            {
              name: `Gate Pass ${payload.passNumber}.pdf`,
              meta: `Issued ${payload.validFrom} · valid to ${payload.validUntil}`,
            },
            ...row.documents,
          ],
        }),
        `${payload.passNumber} prepared · ${payload.validFrom} to ${payload.validUntil}`,
      ),
    [patchRow],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} appointment requests exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: AppointmentRequest) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View details" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit appointment" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Approve or reject" onClick={() => openModal(row, 'decision')}>
        <i className="ti ti-circle-check" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Reschedule" onClick={() => openModal(row, 'reschedule')}>
        <i className="ti ti-calendar-time" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Issue gate pass" onClick={() => openModal(row, 'pass')}>
        <i className="ti ti-ticket" />
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

  /** The expander's last card offers whatever this request's state calls for. */
  const primaryAction = (row: AppointmentRequest) => {
    const status = statusOf(row);
    if (status === 'Pending Approval') {
      return { modal: 'decision' as AppointmentModalId, icon: 'ti ti-circle-check', label: 'Approve / Reject' };
    }
    if (status === 'Approved' && !row.passNumber) {
      return { modal: 'pass' as AppointmentModalId, icon: 'ti ti-ticket', label: 'Issue Gate Pass' };
    }
    if (status === 'Rescheduled') {
      return { modal: 'reschedule' as AppointmentModalId, icon: 'ti ti-calendar-time', label: 'Reschedule' };
    }
    return null;
  };

  const renderDetail = (row: AppointmentRequest) => {
    const primary = primaryAction(row);
    return (
      <div className="row g-4">
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-user text-primary me-1" />Visitor Information</h6>
          {pairList(visitorPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-calendar-event text-info me-1" />Appointment Details</h6>
          {pairList(appointmentPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-users text-success me-1" />Host Information</h6>
          {pairList(hostPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-timeline text-purple me-1" />Approval Timeline</h6>
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
          <h6 className="fs-14 mb-3"><i className="ti ti-shield-check text-danger me-1" />Identity Verification</h6>
          {row.checks.map((check) => (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={check.label}>
              <span className="avatar avatar-sm bg-light text-muted rounded flex-shrink-0">
                <i className={checkIcon[check.state]} />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">{check.label}</h6>
                <span className="fs-12 text-muted text-truncate d-block">{check.detail}</span>
              </div>
              <span className={checkBadge[check.state]}>{check.state}</span>
            </div>
          ))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-ticket text-warning me-1" />Gate Pass Preparation</h6>
          {pairList(passPairsOf(row))}
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
          <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
            <span className={typeBadge[row.appointmentType]}>{row.appointmentType}</span>
            <span className={idBadge[idStateOf(row)]}>{idChip[idStateOf(row)]}</span>
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
              <i className="ti ti-eye me-1" />View Details
            </button>
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm"
              onClick={() => setPanelRow(row)}
            >
              <i className="ti ti-calendar-event me-1" />Appointment Panel
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
            title="Appointment Requests"
            section="Security"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(
                      rows.find((row) => statusOf(row) === 'Pending Approval') ?? rows[0] ?? null,
                      'decision',
                    )}
                  >
                    <i className="ti ti-circle-check me-2" />Approve Requests
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Print Appointment Sheet" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'schedule')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Schedule Appointment
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
            workspaceId="aptWorkspace"
            searchPlaceholder="Search request ID or visitor name…"
            searchLabel="Search appointment requests"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="requests"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Appointment register refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-calendar-off"
            emptyTitle="No appointment requests match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Appointment Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Appointment Details"
            labelledById="apt_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Visitor Information</h6>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar avatar-lg bg-primary-transparent text-primary rounded flex-shrink-0">
                    <i className={`${typeIcon[panelRow.appointmentType]} fs-20`} />
                  </span>
                  <div className="ms-2 overflow-hidden">
                    <h6 className="mb-0 text-truncate">{panelRow.visitor}</h6>
                    <span className="fs-12 text-muted">{panelRow.id} · {panelRow.appointmentType}</span>
                  </div>
                  <span className={`${statusBadge[statusOf(panelRow)]} ms-auto`}>{statusOf(panelRow)}</span>
                </div>
                <div className="border rounded p-3 mb-3">{pairList(visitorPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Appointment Details</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList(appointmentPairsOf(panelRow))}
                  <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top">
                    <span className="fs-13 fw-medium">Slot State</span>
                    <span className="fs-13 fw-semibold">{slotSubLabelOf(panelRow)}</span>
                  </div>
                </div>

                <h6 className="fs-14 mb-2">Host Information</h6>
                <div className="border rounded p-3 mb-3">{pairList(hostPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Identity Verification</h6>
                {panelRow.checks.map((check) => (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={check.label}>
                    <span className="avatar avatar-sm bg-light text-muted rounded flex-shrink-0">
                      <i className={checkIcon[check.state]} />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0 text-truncate">{check.label}</h6>
                      <span className="fs-12 text-muted text-truncate d-block">{check.detail}</span>
                    </div>
                    <span className={checkBadge[check.state]}>{check.state}</span>
                  </div>
                ))}

                <h6 className="fs-14 mb-2 mt-3">Gate Pass Preparation</h6>
                <div className="border rounded p-3 mb-3">{pairList(passPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Approval Timeline</h6>
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
                  {durationText(durationOf(panelRow))} slot · {checkSummaryOf(panelRow)} ·{' '}
                  requested {requestedSubLabelOf(panelRow)}
                </p>

                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'decision'); }}
                  >
                    <i className="ti ti-circle-check me-1" />Approve / Reject
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

      <AppointmentModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onSchedule={scheduleAppointment}
        onUpdate={updateAppointment}
        onDecide={decide}
        onReschedule={reschedule}
        onIssuePass={issuePass}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="aptToasts" />
    </>
  );
};

export default AppointmentRequestsPage;
