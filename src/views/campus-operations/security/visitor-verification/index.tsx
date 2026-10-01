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
import VerificationModals from './modals/VerificationModals';
import type {
  CheckInPayload, DecisionPayload, PassPayload, VerificationDraft, VerificationModalId,
} from './modals/VerificationModals';
import type {
  Approval, HostDepartment, Verification, VisitorType,
} from './data/verifications.data';
import {
  REGISTER_DATE, REGISTER_FROM, REGISTER_TIME, REGISTER_TO, SUMMARY_TOTALS,
  VIEW_TOTALS, addMinutes, appointmentLabelOf, appointmentPairsOf, appointmentSubLabelOf,
  appointmentTintOf, approvalBadge, approvalOf, approvalOptions, approvalPill, auditOf,
  checkBadge, checkIcon, checkSummaryOf, dateKey, departmentBadge, departmentOptions,
  durationLabel, gateBadge, gateLabelOf, gateOptions, gateStateOf, hostPairsOf, idBadge,
  idChip, idStateOf, idStateOptions, minutesUntilSlot, panelVerificationPairsOf,
  passPairsOf, passStateOf, profilePairsOf, purposeOptions, recordDateOf, searchIndexOf,
  timelineOf, verifications as initialRows, visitorBadge, visitorTypeOptions,
} from './data/verifications.data';

const routes = all_routes;

/** Ids and options are the template's own; the date window opens committed. */
const filterFields: FilterField[] = [
  { id: 'verification-status', label: 'Verification Status', kind: 'select', chipLabel: 'Identity', options: idStateOptions },
  { id: 'visit-purpose', label: 'Visit Purpose', kind: 'select', chipLabel: 'Purpose', options: purposeOptions },
  { id: 'host-department', label: 'Host Department', kind: 'select', chipLabel: 'Dept', options: departmentOptions },
  { id: 'gate', label: 'Gate', kind: 'select', chipLabel: 'Gate', options: gateOptions },
  {
    id: 'from-date', label: 'From Date', kind: 'date', chipLabel: 'Date',
    dateFormat: 'd-m-Y', initialValue: REGISTER_FROM,
  },
  {
    id: 'to-date', label: 'To Date', kind: 'date', chipLabel: 'To',
    dateFormat: 'd-m-Y', initialValue: REGISTER_TO,
  },
  { id: 'approval-status', label: 'Approval Status', kind: 'select', chipLabel: 'Approval', allLabel: 'Any', options: approvalOptions },
  { id: 'visitor-type', label: 'Visitor Type', kind: 'select', chipLabel: 'Type', allLabel: 'Any', options: visitorTypeOptions },
];

const sortOptions: SortOption[] = [
  { id: 'verification', label: 'Verification ID', icon: 'ti ti-hash' },
  { id: 'name', label: 'Visitor name (A–Z)', icon: 'ti ti-abc' },
  { id: 'appointment', label: 'Appointment time', icon: 'ti ti-calendar-event' },
  { id: 'department', label: 'Host department', icon: 'ti ti-users' },
  { id: 'approval', label: 'Approval status', icon: 'ti ti-shield-check' },
];

const inputDateKey = (value: string): number => {
  const [day, month, year] = value.split('-').map(Number);
  return Number.isFinite(year) ? year * 10000 + month * 100 + day : 0;
};

/** A predicate for one derived approval, used by the views, rail and strip. */
const isApproval = (approval: Approval) => (row: Verification) => approvalOf(row) === approval;

const VisitorVerificationPage = () => {
  const [rows, setRows] = useState<Verification[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<VerificationModalId | null>(null);
  const [modalRow, setModalRow] = useState<Verification | null>(null);
  const [panelRow, setPanelRow] = useState<Verification | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Verification | null, modal: VerificationModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: Verification) => Verification, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Verification>[]>(
    () => [
      {
        id: 'verification',
        label: 'Verification ID',
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
        render: (row) => <span className={visitorBadge[row.visitorType]}>{row.visitorType}</span>,
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
        id: 'appointment',
        label: 'Appointment Time',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{appointmentLabelOf(row)}</span>
            {/* Arrived early or late, due in, or the slot has passed. */}
            <span className={`fs-12 text-nowrap ${appointmentTintOf(row)}`}>
              {appointmentSubLabelOf(row)}
            </span>
          </>
        ),
      },
      {
        id: 'identity',
        label: 'ID Verification',
        render: (row) => (
          <>
            <span className={idBadge[idStateOf(row)]}>{idStateOf(row)}</span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{checkSummaryOf(row)}</span>
          </>
        ),
      },
      {
        id: 'approval',
        label: 'Approval Status',
        render: (row) => (
          <span className={`dt-pill ${approvalPill[approvalOf(row)]}`}>
            <span className="dt-pill-dot" />{approvalOf(row)}
          </span>
        ),
      },
      {
        id: 'gate-status',
        label: 'Gate Status',
        render: (row) => (
          <>
            <span className={gateBadge[gateStateOf(row)]}>{gateStateOf(row)}</span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{gateLabelOf(row)}</span>
          </>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Verification>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['verification-status'] && idStateOf(row) !== filters['verification-status']) return false;
      if (filters['visit-purpose'] && row.purpose !== filters['visit-purpose']) return false;
      if (filters['host-department'] && row.department !== filters['host-department']) return false;
      if (filters.gate && row.gate !== filters.gate) return false;
      if (filters['from-date']
        && dateKey(recordDateOf(row)) < inputDateKey(filters['from-date'])) return false;
      if (filters['to-date']
        && dateKey(recordDateOf(row)) > inputDateKey(filters['to-date'])) return false;
      if (filters['approval-status'] && approvalOf(row) !== filters['approval-status']) return false;
      if (filters['visitor-type'] && row.visitorType !== filters['visitor-type']) return false;
      return true;
    },
    /** The rail opens on All, which narrows nothing. */
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'Pending') return idStateOf(row) === 'Pending';
      if (quick === 'Verified') return idStateOf(row) === 'Verified';
      if (quick === 'Inside') return gateStateOf(row) === 'Checked In';
      return approvalOf(row) === 'Rejected';
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'pending': return idStateOf(row) === 'Pending';
        case 'rejected': return approvalOf(row) === 'Rejected';
        case 'appointments': return row.appointmentTime !== '';
        case 'inside': return gateStateOf(row) === 'Checked In';
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'appointment':
          return minutesUntilSlot(a) - minutesUntilSlot(b);
        case 'department':
          return a.department.localeCompare(b.department);
        case 'approval':
          return approvalOf(a).localeCompare(approvalOf(b)) || a.id.localeCompare(b.id);
        // The `<th>`s sort on columns the menu does not offer.
        case 'type':
          return a.visitorType.localeCompare(b.visitorType);
        case 'host':
          return a.host.localeCompare(b.host);
        case 'verification':
        default:
          return a.id.localeCompare(b.id);
      }
    },
    defaultSort: 'verification',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: Verification) => boolean) => rows.filter(test).length,
    [rows],
  );

  /** Template total − what it seeded + what the roster holds now. */
  const shift = useCallback(
    (base: number, test: (row: Verification) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Verifications', icon: 'ti ti-layout-list', count: shift(VIEW_TOTALS.all, () => true) },
      {
        id: 'pending', label: 'Pending Verification', icon: 'ti ti-clock',
        count: shift(VIEW_TOTALS.pending, (row) => idStateOf(row) === 'Pending'),
      },
      { id: 'rejected', label: 'Rejected Requests', icon: 'ti ti-shield-x', count: shift(VIEW_TOTALS.rejected, isApproval('Rejected')) },
      {
        id: 'appointments', label: 'Today’s Appointments', icon: 'ti ti-calendar-event',
        count: shift(VIEW_TOTALS.appointments, (row) => row.appointmentTime !== ''),
      },
      {
        id: 'inside', label: 'Visitors Inside', icon: 'ti ti-door-enter',
        count: shift(VIEW_TOTALS.inside, (row) => gateStateOf(row) === 'Checked In'),
      },
    ],
    [shift],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: shift(VIEW_TOTALS.all, () => true) },
      {
        id: 'Pending', label: 'Pending', icon: 'ti ti-clock',
        count: shift(SUMMARY_TOTALS.pending, (row) => idStateOf(row) === 'Pending'),
      },
      {
        id: 'Verified', label: 'Verified', icon: 'ti ti-user-check',
        count: shift(SUMMARY_TOTALS.verified, (row) => idStateOf(row) === 'Verified'),
      },
      {
        id: 'Inside', label: 'Inside', icon: 'ti ti-door-enter',
        count: shift(SUMMARY_TOTALS.inside, (row) => gateStateOf(row) === 'Checked In'),
      },
      { id: 'Rejected', label: 'Rejected', icon: 'ti ti-shield-x', count: shift(SUMMARY_TOTALS.rejected, isApproval('Rejected')) },
    ],
    [shift],
  );

  /**
   * The strip counts the whole register — 75 records against the eight this page
   * lists — so the template's figures stand and the roster moves them.
   */
  const summary = useMemo<SummaryItem[]>(
    () => [
      {
        id: 'pending', tint: 'warning', icon: 'ti ti-clock', label: 'Pending Verification',
        value: String(shift(SUMMARY_TOTALS.pending, (row) => idStateOf(row) === 'Pending')),
        hint: 'awaiting ID or host',
      },
      {
        id: 'verified', tint: 'success', icon: 'ti ti-user-check', label: 'Verified Visitors',
        value: String(shift(SUMMARY_TOTALS.verified, (row) => idStateOf(row) === 'Verified')),
        hint: REGISTER_DATE,
      },
      {
        id: 'rejected', tint: 'danger', icon: 'ti ti-shield-x', label: 'Rejected Requests',
        value: String(shift(SUMMARY_TOTALS.rejected, isApproval('Rejected'))),
        hint: 'access not authorised',
      },
      {
        id: 'inside', tint: 'primary', icon: 'ti ti-door-enter', label: 'Visitors Inside',
        value: String(shift(SUMMARY_TOTALS.inside, (row) => gateStateOf(row) === 'Checked In')),
        hint: `of ${SUMMARY_TOTALS.verified} verified`,
      },
      {
        id: 'appointments', tint: 'info', icon: 'ti ti-calendar-event', label: 'Today’s Appointments',
        value: String(shift(SUMMARY_TOTALS.appointments, (row) => row.appointmentTime !== '')),
        hint: 'booked in advance',
      },
    ],
    [shift],
  );

  /* -------------------------------- Mutations ------------------------------- */

  const runVerification = useCallback(
    (draft: VerificationDraft) => {
      if (!draft.name.trim()) {
        push('Give the visitor a name', 'warning');
        return;
      }
      const [host, hostRole] = draft.host.split('·').map((part) => part.trim());
      const id = `VVR-2026-06${59 + rows.length}`;
      setRows((current) => [
        {
          id, name: draft.name.trim(),
          icon: draft.visitorType === 'Vendor' ? 'ti ti-truck-delivery'
            : draft.visitorType === 'Contractor' ? 'ti ti-tool'
              : draft.visitorType === 'Guardian' ? 'ti ti-users' : 'ti ti-user',
          tint: draft.visitorType === 'Vendor' ? 'purple'
            : draft.visitorType === 'Contractor' ? 'secondary'
              : draft.visitorType === 'Guardian' ? 'warning' : 'primary',
          reference: draft.purpose.trim() || 'Walk in',
          visitorType: draft.visitorType as VisitorType,
          contact: draft.contact.trim() || 'Not recorded',
          email: draft.email.trim() || 'Not provided',
          host, hostRole: hostRole ?? 'Not recorded',
          department: draft.department as HostDepartment,
          gate: draft.gate, lane: `${draft.gate} · Lane 1`, gateOfficer: '',
          purpose: draft.purpose.trim() || 'Not stated',
          detail: `Raised at the ${draft.gate.toLowerCase()}`,
          appointmentTime: draft.appointmentTime, appointmentDate: '',
          arrival: '', departure: '',
          checks: [
            { label: draft.idProof, detail: draft.idNumber.trim() || 'Masked on the register', state: 'Passed' },
            { label: 'Photograph captured at the desk', detail: `${draft.gate} · ${REGISTER_TIME}`, state: 'Passed' },
            {
              label: 'Host confirmation',
              detail: draft.requestHost ? `Awaiting ${host}` : 'Confirmed at the desk',
              state: draft.requestHost ? 'Pending' : 'Passed',
            },
          ],
          approval: draft.requestHost ? 'Pending Host' : 'Approved',
          passNumber: '', passFrom: '', passUntil: '',
          gateRegister: '', clearance: 'Standard · escorted',
          screening: draft.screenList ? 'Screened against the restricted list' : 'Not screened',
          documents: [],
          notes: draft.notes.trim() || 'Raised from the verification register.',
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} raised for ${draft.name.trim()}`);
    },
    [push, rows.length],
  );

  const updateVerification = useCallback(
    (draft: VerificationDraft) => {
      const [host, hostRole] = draft.host.split('·').map((part) => part.trim());
      patchRow(
        (row) => ({
          ...row,
          name: draft.name.trim() || row.name,
          visitorType: draft.visitorType as VisitorType,
          contact: draft.contact.trim() || row.contact,
          email: draft.email.trim() || row.email,
          host, hostRole: hostRole ?? row.hostRole,
          department: draft.department as HostDepartment,
          purpose: draft.purpose.trim() || row.purpose,
          gate: draft.gate,
          appointmentTime: draft.appointmentTime,
          // Re-running the checks clears the failures the correction addresses.
          checks: draft.requestHost
            ? row.checks.map((check) =>
              check.state === 'Failed' ? { ...check, state: 'Pending' as const } : check)
            : row.checks,
          notes: draft.notes.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Verification'} updated`,
      );
    },
    [modalRow, patchRow],
  );

  /** The decision moves the approval, and can issue the pass with it. */
  const decide = useCallback(
    (payload: DecisionPayload) => {
      const rejecting = payload.decision === 'Reject';
      const holding = payload.decision === 'Hold';
      patchRow(
        (row) => ({
          ...row,
          approval: rejecting ? 'Rejected' : holding ? 'Pending Host' : 'Approved',
          host: payload.confirmedBy.split('·')[0].trim(),
          hostRole: payload.confirmedBy.split('·')[1]?.trim() ?? row.hostRole,
          clearance: rejecting ? 'Not granted' : payload.clearance,
          // Approving satisfies any host-confirmation check that was pending.
          checks: rejecting ? row.checks : row.checks.map((check) =>
            /host confirmation/i.test(check.label) && check.state === 'Pending'
              ? { ...check, detail: `${payload.method} · ${payload.decisionTime}`, state: 'Passed' as const }
              : check),
          passNumber: !rejecting && !holding && payload.issuePass
            ? row.passNumber || `VP-2026-08${89 + rows.length}` : row.passNumber,
          passFrom: !rejecting && !holding && payload.issuePass
            ? row.passFrom || payload.decisionTime : row.passFrom,
          passUntil: !rejecting && !holding && payload.issuePass
            ? row.passUntil || addMinutes(payload.decisionTime, 60) : row.passUntil,
          notes: payload.remarks.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Request'} ${rejecting ? 'rejected' : holding ? 'held' : 'approved'} at ${payload.decisionTime}`,
      );
    },
    [modalRow, patchRow, rows.length],
  );

  const issuePass = useCallback(
    (payload: PassPayload) =>
      patchRow(
        (row) => ({
          ...row,
          passNumber: payload.passNumber,
          passFrom: payload.validFrom,
          passUntil: payload.validUntil,
          gate: payload.gate,
          clearance: payload.zones,
          gateOfficer: payload.issuedBy,
          documents: [
            { name: `Visitor Pass ${payload.passNumber}.pdf`, meta: `Issued ${payload.validFrom} · valid to ${payload.validUntil}` },
            ...row.documents,
          ],
          notes: payload.remarks.trim() || row.notes,
        }),
        `${payload.passNumber} issued · valid ${payload.validFrom} to ${payload.validUntil}`,
      ),
    [patchRow],
  );

  /** Checking in stamps the arrival and completes the outstanding checks. */
  const checkIn = useCallback(
    (payload: CheckInPayload) => {
      const minutes = payload.validity === '1 hour' ? 60
        : payload.validity === '2 hours' ? 120 : payload.validity === '4 hours' ? 240 : 600;
      patchRow(
        (row) => ({
          ...row,
          arrival: payload.time,
          gate: payload.gate,
          gateOfficer: payload.officer,
          passNumber: row.passNumber || `VP-2026-08${89 + rows.length}`,
          passFrom: payload.time,
          passUntil: addMinutes(payload.time, minutes),
          gateRegister: row.gateRegister || `GT-2026-08${89 + rows.length}`,
          checks: payload.completion === 'Waived' ? row.checks : row.checks.map((check) =>
            check.state === 'Pending' ? { ...check, state: 'Passed' as const } : check),
          screening: payload.belongings.trim() || row.screening,
        }),
        `${modalRow?.name ?? 'Visitor'} checked in at ${payload.time}`,
      );
    },
    [modalRow, patchRow, rows.length],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} verification records exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Verification) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View details" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit visitor" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Approve or reject" onClick={() => openModal(row, 'decision')}>
        <i className="ti ti-circle-check" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Issue pass" onClick={() => openModal(row, 'pass')}>
        <i className="ti ti-ticket" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Check in visitor" onClick={() => openModal(row, 'checkin')}>
        <i className="ti ti-door-enter" />
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
  const primaryAction = (row: Verification) => {
    if (approvalOf(row) === 'Rejected') {
      return { modal: 'edit' as VerificationModalId, icon: 'ti ti-id', label: 'Verify Identity' };
    }
    if (approvalOf(row) === 'Pending Host') {
      return { modal: 'decision' as VerificationModalId, icon: 'ti ti-circle-check', label: 'Approve / Reject' };
    }
    if (gateStateOf(row) === 'Awaiting Arrival') {
      return { modal: 'checkin' as VerificationModalId, icon: 'ti ti-door-enter', label: 'Check-In' };
    }
    if (gateStateOf(row) === 'Pass Expired') {
      return { modal: 'pass' as VerificationModalId, icon: 'ti ti-ticket', label: 'Issue Pass' };
    }
    return null;
  };

  const renderDetail = (row: Verification) => {
    const primary = primaryAction(row);
    return (
      <div className="row g-4">
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-user text-primary me-1" />Visitor Profile</h6>
          {pairList(profilePairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-id text-info me-1" />Identity Documents</h6>
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
          <h6 className="fs-14 mb-3"><i className="ti ti-users text-success me-1" />Host Information</h6>
          {pairList(hostPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-calendar-event text-warning me-1" />Appointment Details</h6>
          {pairList(appointmentPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-timeline text-purple me-1" />Verification Timeline</h6>
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
          <h6 className="fs-14 mb-3"><i className="ti ti-ticket text-danger me-1" />Gate Pass Information</h6>
          {row.passNumber ? pairList(passPairsOf(row)) : (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-0">
              <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                <i className="ti ti-ticket" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">
                  {approvalOf(row) === 'Rejected' ? 'Pass refused' : 'No pass issued'}
                </h6>
                <span className="fs-12 text-muted text-truncate d-block">
                  {approvalOf(row) === 'Rejected' ? 'Entry not authorised'
                    : approvalOf(row) === 'Pending Host' ? 'Issued once the host confirms'
                      : 'Issued on arrival at the gate'}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-note text-secondary me-1" />Security Notes</h6>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
            <span className={idBadge[idStateOf(row)]}>{idChip[idStateOf(row)]}</span>
            <span className="badge badge-soft-secondary">{row.clearance}</span>
          </div>
          <p className="fs-13 text-muted mb-1">{row.notes}</p>
          <p className="fs-12 text-muted mb-3">{row.screening}</p>
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
              <i className="ti ti-user-check me-1" />Verification Panel
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
            title="Visitor Verification"
            section="Security"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(
                      rows.find((row) => approvalOf(row) !== 'Rejected' && !row.passNumber) ?? rows[0] ?? null,
                      'pass',
                    )}
                  >
                    <i className="ti ti-ticket me-2" />Issue Pass
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Print Verification Register" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'verify')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Verify Visitor
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
            workspaceId="vvWorkspace"
            searchPlaceholder="Search visitor, host or verification ID…"
            searchLabel="Search verification records"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="verification records"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Verification register refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-user-off"
            emptyTitle="No verification records match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Verification Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Verification Details"
            labelledById="vv_panel_lbl"
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
                  <span className={`${approvalBadge[approvalOf(panelRow)]} ms-auto`}>
                    {approvalOf(panelRow)}
                  </span>
                </div>
                <div className="border rounded p-3 mb-3">{pairList(profilePairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Host Information</h6>
                <div className="border rounded p-3 mb-3">{pairList(hostPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Appointment Details</h6>
                <div className="border rounded p-3 mb-3">{pairList(appointmentPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Identity Documents</h6>
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

                <h6 className="fs-14 mb-2 mt-3">Verification Summary</h6>
                <div className="border rounded p-3 mb-3">{pairList(panelVerificationPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Gate Pass Information</h6>
                {panelRow.passNumber ? (
                  <div className="border rounded p-3 mb-3">{pairList(passPairsOf(panelRow))}</div>
                ) : (
                  <p className="fs-13 text-muted mb-3">
                    {approvalOf(panelRow) === 'Rejected'
                      ? 'Pass refused — entry not authorised.'
                      : 'No pass issued yet.'}
                  </p>
                )}

                <h6 className="fs-14 mb-2">Verification Timeline</h6>
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
                  {checkSummaryOf(panelRow)} · pass {passStateOf(panelRow).toLowerCase()}
                  {panelRow.appointmentTime && !panelRow.arrival
                    ? ` · slot ${minutesUntilSlot(panelRow) < 0 ? 'passed' : `in ${durationLabel(minutesUntilSlot(panelRow))}`}`
                    : ''}
                </p>

                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'pass'); }}
                  >
                    <i className="ti ti-ticket me-1" />Issue Pass
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

      <VerificationModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onVerify={runVerification}
        onUpdate={updateVerification}
        onDecide={decide}
        onIssuePass={issuePass}
        onCheckIn={checkIn}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="vvToasts" />
    </>
  );
};

export default VisitorVerificationPage;
