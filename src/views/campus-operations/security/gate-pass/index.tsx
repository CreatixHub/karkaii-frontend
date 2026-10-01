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
import GatePassModals from './modals/GatePassModals';
import type {
  ApprovePayload, ExtendPayload, GatePassDraft, GatePassModalId, RevokePayload, VerifyPayload,
} from './modals/GatePassModals';
import type { GatePass, PassStatus, PassType, PersonType } from './data/passes.data';
import {
  QUICK_TOTALS, REGISTER_DATE, REGISTER_FROM, REGISTER_TIME, REGISTER_TO, SUMMARY_TOTALS,
  VIEW_TOTALS, auditOf, checkBadge, checkIcon, checkSummaryOf, dateKey, durationText,
  expiringOptions, gateOptions, gatePasses as initialRows, holderPairsOf, hostPairsOf,
  idBadge, idChip, idStateOf, matchesExpiring, minutesOf, minutesToExpiryOf, minutesToOpenOf,
  passPairsOf, passTypeBadge, passTypeOptions, personBadge, personTypeOptions, searchIndexOf,
  statusBadge, statusOf, statusOptions, statusPill, timelineOf, validUntilLabelOf,
  validUntilSubLabelOf, validUntilTintOf, vehiclePairsOf, verificationOptions, windowLabelOf,
  windowOf, windowPairsOf,
} from './data/passes.data';

const routes = all_routes;

/** Ids and options are the template's own; the date window opens committed. */
const filterFields: FilterField[] = [
  { id: 'pass-type', label: 'Pass Type', kind: 'select', chipLabel: 'Pass', options: passTypeOptions },
  { id: 'person-type', label: 'Person Type', kind: 'select', chipLabel: 'Person', options: personTypeOptions },
  { id: 'gate', label: 'Gate', kind: 'select', chipLabel: 'Gate', options: gateOptions },
  { id: 'pass-status', label: 'Pass Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  {
    id: 'from-date', label: 'From Date', kind: 'date', chipLabel: 'Date',
    dateFormat: 'd-m-Y', initialValue: REGISTER_FROM,
  },
  {
    id: 'to-date', label: 'To Date', kind: 'date', chipLabel: 'To',
    dateFormat: 'd-m-Y', initialValue: REGISTER_TO,
  },
  { id: 'verification', label: 'Verification', kind: 'select', chipLabel: 'Verified', allLabel: 'Any', options: verificationOptions },
  { id: 'expiring', label: 'Expiring', kind: 'select', chipLabel: 'Expiring', allLabel: 'Any', options: expiringOptions },
];

const sortOptions: SortOption[] = [
  { id: 'pass', label: 'Pass ID', icon: 'ti ti-hash' },
  { id: 'holder', label: 'Holder name (A–Z)', icon: 'ti ti-abc' },
  { id: 'from', label: 'Valid from', icon: 'ti ti-calendar-event' },
  { id: 'expiry', label: 'Time to expiry', icon: 'ti ti-clock' },
  { id: 'verification', label: 'Verification status', icon: 'ti ti-shield-check' },
];

const inputDateKey = (value: string): number => {
  const [day, month, year] = value.split('-').map(Number);
  return Number.isFinite(year) ? year * 10000 + month * 100 + day : 0;
};

/** A predicate for one derived status, used by the views, rail and strip. */
const isStatus = (status: PassStatus) => (row: GatePass) => statusOf(row) === status;

const GatePassPage = () => {
  const [rows, setRows] = useState<GatePass[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<GatePassModalId | null>(null);
  const [modalRow, setModalRow] = useState<GatePass | null>(null);
  const [panelRow, setPanelRow] = useState<GatePass | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: GatePass | null, modal: GatePassModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: GatePass) => GatePass, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<GatePass>[]>(
    () => [
      {
        id: 'pass',
        label: 'Pass ID',
        sortable: true,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>{row.id}</ActionLink>
        ),
      },
      {
        id: 'type',
        label: 'Pass Type',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className={`avatar avatar-md bg-${row.tint}-transparent text-${row.tint} rounded flex-shrink-0 me-2`}>
              <i className={row.icon} />
            </span>
            <div>
              <span className="dt-name">{row.passType}</span>
              {/* The valid-until less the valid-from. */}
              <div className="dt-sub flex-nowrap text-nowrap">{windowLabelOf(row)}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'holder',
        label: 'Name',
        sortable: true,
        render: (row) => (
          <>
            <ActionLink className="d-block fw-medium" onClick={() => openModal(row, 'view')}>
              {row.holder}
            </ActionLink>
            <span className="fs-12 text-muted text-nowrap">{row.reference}</span>
          </>
        ),
      },
      {
        id: 'person',
        label: 'Person Type',
        sortable: true,
        render: (row) => <span className={personBadge[row.personType]}>{row.personType}</span>,
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
        id: 'from',
        label: 'Valid From',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.validFrom}</span>
            <span className="fs-12 text-muted text-nowrap">{row.date}</span>
          </>
        ),
      },
      {
        id: 'until',
        label: 'Valid Until',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{validUntilLabelOf(row)}</span>
            {/* Returned, expires in, expired, opens in, revoked or on approval. */}
            <span className={`fs-12 text-nowrap ${validUntilTintOf(row)}`}>
              {validUntilSubLabelOf(row)}
            </span>
          </>
        ),
      },
      {
        id: 'issuer',
        label: 'Issued By',
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.issuedBy}</span>
            <span className="fs-12 text-muted text-nowrap">{row.issuerRole}</span>
          </>
        ),
      },
      {
        id: 'status',
        label: 'Pass Status',
        render: (row) => (
          <span className={`dt-pill ${statusPill[statusOf(row)]}`}>
            <span className="dt-pill-dot" />{statusOf(row)}
          </span>
        ),
      },
      {
        id: 'verification',
        label: 'Verification Status',
        render: (row) => (
          <>
            <span className={idBadge[idStateOf(row)]}>{idStateOf(row)}</span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{checkSummaryOf(row)}</span>
          </>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<GatePass>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['pass-type'] && row.passType !== filters['pass-type']) return false;
      if (filters['person-type'] && row.personType !== filters['person-type']) return false;
      if (filters.gate && row.gate !== filters.gate) return false;
      if (filters['pass-status'] && statusOf(row) !== filters['pass-status']) return false;
      if (filters['from-date'] && dateKey(row.date) < inputDateKey(filters['from-date'])) return false;
      if (filters['to-date'] && dateKey(row.date) > inputDateKey(filters['to-date'])) return false;
      if (filters.verification && idStateOf(row) !== filters.verification) return false;
      if (filters.expiring && !matchesExpiring(row, filters.expiring)) return false;
      return true;
    },
    /** The rail opens on All, which narrows nothing. */
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'Pending') return statusOf(row) === 'Pending Approval';
      return statusOf(row) === quick;
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'active': return statusOf(row) === 'Active';
        case 'expired': return statusOf(row) === 'Expired';
        case 'vehicles': return row.vehicle !== null;
        case 'revoked': return statusOf(row) === 'Revoked';
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'holder':
          return a.holder.localeCompare(b.holder);
        case 'from':
          return minutesOf(a.validFrom) - minutesOf(b.validFrom) || a.id.localeCompare(b.id);
        case 'expiry':
          return minutesToExpiryOf(a) - minutesToExpiryOf(b) || a.id.localeCompare(b.id);
        case 'verification':
          return idStateOf(a).localeCompare(idStateOf(b)) || a.id.localeCompare(b.id);
        // The `<th>`s sort on columns the menu does not offer.
        case 'type':
          return a.passType.localeCompare(b.passType);
        case 'person':
          return a.personType.localeCompare(b.personType);
        case 'gate':
          return a.gate.localeCompare(b.gate);
        case 'until':
          return minutesOf(a.validUntil) - minutesOf(b.validUntil);
        case 'pass':
        default:
          return a.id.localeCompare(b.id);
      }
    },
    defaultSort: 'pass',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: GatePass) => boolean) => rows.filter(test).length,
    [rows],
  );

  /** Template total − what it seeded + what the roster holds now. */
  const shift = useCallback(
    (base: number, test: (row: GatePass) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Passes', icon: 'ti ti-layout-list', count: shift(VIEW_TOTALS.all, () => true) },
      { id: 'active', label: 'Active Passes', icon: 'ti ti-ticket', count: shift(VIEW_TOTALS.active, isStatus('Active')) },
      { id: 'expired', label: 'Expired Passes', icon: 'ti ti-clock', count: shift(VIEW_TOTALS.expired, isStatus('Expired')) },
      {
        id: 'vehicles', label: 'Vehicle Passes', icon: 'ti ti-car',
        count: shift(VIEW_TOTALS.vehicles, (row) => row.vehicle !== null),
      },
      { id: 'revoked', label: 'Revoked Passes', icon: 'ti ti-shield-x', count: shift(VIEW_TOTALS.revoked, isStatus('Revoked')) },
    ],
    [shift],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: shift(QUICK_TOTALS.all, () => true) },
      { id: 'Active', label: 'Active', icon: 'ti ti-ticket', count: shift(QUICK_TOTALS.active, isStatus('Active')) },
      { id: 'Returned', label: 'Returned', icon: 'ti ti-check', count: shift(QUICK_TOTALS.returned, isStatus('Returned')) },
      { id: 'Expired', label: 'Expired', icon: 'ti ti-clock', count: shift(QUICK_TOTALS.expired, isStatus('Expired')) },
      { id: 'Pending', label: 'Pending', icon: 'ti ti-circle-check', count: shift(QUICK_TOTALS.pending, isStatus('Pending Approval')) },
      { id: 'Revoked', label: 'Revoked', icon: 'ti ti-shield-x', count: shift(QUICK_TOTALS.revoked, isStatus('Revoked')) },
    ],
    [shift],
  );

  /**
   * The strip counts the whole register — 77 passes against the eight this page
   * lists — so the template's figures stand and the roster moves them.
   */
  const summary = useMemo<SummaryItem[]>(
    () => [
      {
        id: 'active', tint: 'primary', icon: 'ti ti-ticket', label: 'Active Passes',
        value: String(shift(SUMMARY_TOTALS.active, isStatus('Active'))), hint: 'valid right now',
      },
      {
        id: 'issued', tint: 'info', icon: 'ti ti-calendar-event', label: 'Issued Today',
        value: String(shift(SUMMARY_TOTALS.issuedToday, (row) => row.date === REGISTER_DATE)),
        hint: `${REGISTER_DATE} · all gates`,
      },
      {
        id: 'expired', tint: 'warning', icon: 'ti ti-clock', label: 'Expired Passes',
        value: String(shift(SUMMARY_TOTALS.expired, isStatus('Expired'))),
        hint: 'window closed, not returned',
      },
      {
        id: 'inside', tint: 'success', icon: 'ti ti-door-enter', label: 'Visitors Inside',
        value: String(shift(SUMMARY_TOTALS.inside, isStatus('Active'))),
        hint: `of ${SUMMARY_TOTALS.active} active passes`,
      },
      {
        id: 'vehicles', tint: 'danger', icon: 'ti ti-car', label: 'Vehicle Passes',
        value: String(shift(SUMMARY_TOTALS.vehicles, (row) => row.vehicle !== null)),
        hint: 'barrier access granted',
      },
    ],
    [shift],
  );

  /* -------------------------------- Mutations ------------------------------- */

  const issuePass = useCallback(
    (draft: GatePassDraft) => {
      if (!draft.holder.trim()) {
        push('Give the pass a holder', 'warning');
        return;
      }
      const [host, hostRole] = draft.host.split('·').map((part) => part.trim());
      const id = draft.passNumber.trim() || `VP-2026-08${90 + rows.length}`;
      const passType: PassType = draft.issueType === 'Vehicle' ? 'Vehicle Pass'
        : draft.issueType === 'Student' ? 'Student Exit Pass'
          : draft.issueType === 'Temporary' ? 'Temporary Pass' : 'Visitor Pass';
      const onFoot = draft.vehicleType.startsWith('None');
      setRows((current) => [
        {
          id, passType,
          icon: passType === 'Vehicle Pass' ? 'ti ti-car'
            : passType === 'Student Exit Pass' ? 'ti ti-school' : 'ti ti-ticket',
          tint: passType === 'Vehicle Pass' ? 'warning'
            : passType === 'Student Exit Pass' ? 'info' : 'primary',
          holder: draft.holder.trim(),
          reference: draft.purpose.trim() || 'Issued at the gate',
          personType: draft.personType as PersonType,
          contact: draft.contact.trim() || 'Not recorded',
          idProof: draft.idProof, idNumber: 'Masked on the register',
          gate: draft.gate, lane: `${draft.gate} · Lane 1`, date: REGISTER_DATE,
          validFrom: draft.validFrom, validUntil: draft.validUntil, returnedAt: '',
          issuedBy: draft.issuedBy.split('·')[0].trim(),
          issuerRole: draft.issuedBy.split('·')[1]?.trim() ?? 'Gate Officer',
          host, hostRole: hostRole ?? 'Not recorded', department: hostRole ?? 'Not recorded',
          purpose: draft.purpose.trim() || 'Not stated',
          accessZones: draft.zones,
          vehicle: onFoot ? null : {
            type: draft.vehicleType,
            registration: draft.registration.trim() || 'Not recorded',
            details: `${draft.vehicleType} · logged at the barrier`,
            barrierAccess: 'Granted',
          },
          pendingApproval: false, revoked: false, revokedAt: '',
          checks: [
            { label: `${draft.idProof} checked at the desk`, state: 'Passed' },
            { label: 'Host confirmation recorded', state: 'Passed' },
            { label: 'Pass return not logged yet', state: 'Pending' },
          ],
          scans: [{ title: 'Issued at the gate', meta: `${draft.validFrom} · ${draft.issuedBy}` }],
          documents: draft.printQr
            ? [{ name: `Gate Pass ${id}.pdf`, meta: `Issued ${draft.validFrom} · valid to ${draft.validUntil}` }]
            : [],
          notes: draft.notes.trim() || 'Issued from the pass register.',
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} issued · valid ${draft.validFrom} to ${draft.validUntil}`);
    },
    [push, rows.length],
  );

  const updatePass = useCallback(
    (draft: GatePassDraft) => {
      const [host, hostRole] = draft.host.split('·').map((part) => part.trim());
      patchRow(
        (row) => ({
          ...row,
          holder: draft.holder.trim() || row.holder,
          personType: draft.personType as PersonType,
          contact: draft.contact.trim() || row.contact,
          gate: draft.gate,
          accessZones: draft.zones,
          validFrom: draft.validFrom,
          validUntil: draft.validUntil,
          host, hostRole: hostRole ?? row.hostRole,
          purpose: draft.purpose.trim() || row.purpose,
          idProof: draft.idProof,
          vehicle: draft.vehicleType.startsWith('None') ? null : {
            type: draft.vehicleType,
            registration: draft.registration.trim() || row.vehicle?.registration || 'Not recorded',
            details: row.vehicle?.details ?? `${draft.vehicleType} · logged at the barrier`,
            barrierAccess: row.vehicle?.barrierAccess ?? 'Granted',
          },
          issuedBy: draft.issuedBy.split('·')[0].trim(),
          issuerRole: draft.issuedBy.split('·')[1]?.trim() ?? row.issuerRole,
          notes: draft.notes.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Pass'} updated`,
      );
    },
    [modalRow, patchRow],
  );

  /** Approving takes the pass off the draft flag and fixes its window. */
  const approve = useCallback(
    (payload: ApprovePayload) => {
      const rejecting = payload.decision === 'Reject';
      const holding = payload.decision === 'Hold';
      patchRow(
        (row) => ({
          ...row,
          pendingApproval: holding,
          revoked: rejecting,
          revokedAt: rejecting ? payload.decisionTime : '',
          validFrom: rejecting ? row.validFrom : payload.validFrom,
          validUntil: rejecting ? row.validUntil : payload.validUntil,
          host: payload.approvedBy.split('·')[0].trim(),
          hostRole: payload.approvedBy.split('·')[1]?.trim() ?? row.hostRole,
          // Approving satisfies the host-confirmation check that was pending.
          checks: rejecting ? row.checks : row.checks.map((check) =>
            /host confirmation/i.test(check.label) && check.state === 'Pending'
              ? { ...check, state: 'Passed' as const } : check),
          scans: [
            {
              title: rejecting ? 'Pass rejected at the desk' : holding ? 'Decision held' : 'Pass approved',
              meta: `${payload.decisionTime} · ${payload.approvedBy.split('·')[0].trim()}`,
            },
            ...row.scans,
          ],
          notes: payload.remarks.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Pass'} ${rejecting ? 'rejected' : holding ? 'held' : 'approved'} at ${payload.decisionTime}`,
      );
    },
    [modalRow, patchRow],
  );

  const verify = useCallback(
    (payload: VerifyPayload) =>
      patchRow(
        (row) => ({
          ...row,
          scans: [
            {
              title: `${payload.method} · ${payload.result}`,
              meta: `${payload.verifiedAt} · ${payload.reader}`,
            },
            ...row.scans,
          ],
          // A clean scan closes any check still outstanding.
          checks: payload.result.startsWith('Valid')
            ? row.checks.map((check) =>
              check.state === 'Pending' ? { ...check, state: 'Passed' as const } : check)
            : row.checks,
          notes: payload.remarks.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Pass'} verified at ${payload.verifiedAt} — ${payload.result.toLowerCase()}`,
      ),
    [modalRow, patchRow],
  );

  /** Extending moves the close of the window, which reopens an expired pass. */
  const extend = useCallback(
    (payload: ExtendPayload) => {
      if (!modalRow) return;
      const added = minutesOf(payload.newValidUntil) - minutesOf(modalRow.validUntil);
      if (added <= 0) {
        push('The new time does not extend the window', 'warning');
        return;
      }
      patchRow(
        (row) => ({
          ...row,
          validUntil: payload.newValidUntil,
          scans: [
            {
              title: `Window extended by ${durationText(added)}`,
              meta: `${REGISTER_TIME} · ${payload.authorisedBy}`,
            },
            ...row.scans,
          ],
          notes: payload.remarks.trim() || row.notes,
        }),
        `${modalRow.id} extended to ${payload.newValidUntil} — ${durationText(added)} longer`,
      );
    },
    [modalRow, patchRow, push],
  );

  const revoke = useCallback(
    (payload: RevokePayload) =>
      patchRow(
        (row) => ({
          ...row,
          revoked: true,
          revokedAt: payload.revokedAt,
          pendingApproval: false,
          accessZones: 'None granted',
          vehicle: row.vehicle ? { ...row.vehicle, barrierAccess: 'Refused' } : null,
          scans: [
            {
              title: `Pass revoked · ${payload.scope.toLowerCase()}`,
              meta: `${payload.revokedAt} · ${payload.authorisedBy}`,
            },
            ...row.scans,
          ],
          notes: payload.remarks.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Pass'} revoked at ${payload.revokedAt} — ${payload.reason.toLowerCase()}`,
      ),
    [modalRow, patchRow],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} gate passes exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: GatePass) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View pass" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit pass" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Verify pass" onClick={() => openModal(row, 'verify')}>
        <i className="ti ti-qrcode" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Extend validity" onClick={() => openModal(row, 'extend')}>
        <i className="ti ti-clock" />
      </ActionLink>
      <ActionLink className="dt-ib danger" ariaLabel="Revoke pass" onClick={() => openModal(row, 'revoke')}>
        <i className="ti ti-shield-x" />
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

  /** The expander's last card offers whatever this pass's state calls for. */
  const primaryAction = (row: GatePass) => {
    const status = statusOf(row);
    if (status === 'Pending Approval') {
      return { modal: 'approve' as GatePassModalId, icon: 'ti ti-circle-check', label: 'Approve Pass' };
    }
    if (status === 'Expired') {
      return { modal: 'extend' as GatePassModalId, icon: 'ti ti-clock', label: 'Extend Validity' };
    }
    if (status === 'Active') {
      return { modal: 'verify' as GatePassModalId, icon: 'ti ti-qrcode', label: 'Verify Pass' };
    }
    return null;
  };

  const renderDetail = (row: GatePass) => {
    const primary = primaryAction(row);
    return (
      <div className="row g-4">
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-ticket text-primary me-1" />Pass Information</h6>
          {pairList(passPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-user text-info me-1" />Holder Details</h6>
          {pairList(holderPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-car text-warning me-1" />Vehicle Information</h6>
          {row.vehicle ? pairList(vehiclePairsOf(row)) : (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-0">
              <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                <i className="ti ti-car-off" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">Pedestrian pass</h6>
                <span className="fs-12 text-muted text-truncate d-block">No vehicle access granted</span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-users text-success me-1" />Host &amp; Department</h6>
          {pairList(hostPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-timeline text-purple me-1" />Validity Timeline</h6>
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
          <h6 className="fs-14 mb-3"><i className="ti ti-shield-check text-danger me-1" />Verification History</h6>
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
          {row.scans.map((scan) => (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${scan.title}-${scan.meta}`}>
              <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                <i className="ti ti-scan" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">{scan.title}</h6>
                <span className="fs-12 text-muted text-truncate d-block">{scan.meta}</span>
              </div>
            </div>
          ))}
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
          <h6 className="fs-14 mb-3"><i className="ti ti-note text-secondary me-1" />Security Notes</h6>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
            <span className={passTypeBadge[row.passType]}>{row.passType}</span>
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
              <i className="ti ti-eye me-1" />View Pass
            </button>
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm"
              onClick={() => setPanelRow(row)}
            >
              <i className="ti ti-ticket me-1" />Gate Pass Panel
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
            title="Gate Pass"
            section="Security"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(
                      rows.find((row) => statusOf(row) === 'Active') ?? rows[0] ?? null, 'verify',
                    )}
                  >
                    <i className="ti ti-qrcode me-2" />Verify Pass
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Print Pass Register" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'issue')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Issue Gate Pass
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
            workspaceId="gpWorkspace"
            searchPlaceholder="Search pass ID or holder name…"
            searchLabel="Search gate passes"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="passes"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Pass register refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-ticket-off"
            emptyTitle="No gate passes match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Gate Pass Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Gate Pass Details"
            labelledById="gp_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Pass Information</h6>
                <div className="d-flex align-items-center mb-3">
                  <span
                    className={`avatar avatar-lg bg-${panelRow.tint}-transparent text-${panelRow.tint} rounded flex-shrink-0`}
                  >
                    <i className={`${panelRow.icon} fs-20`} />
                  </span>
                  <div className="ms-2 overflow-hidden">
                    <h6 className="mb-0 text-truncate">{panelRow.holder}</h6>
                    <span className="fs-12 text-muted">{panelRow.id} · {panelRow.passType}</span>
                  </div>
                  <span className={`${statusBadge[statusOf(panelRow)]} ms-auto`}>{statusOf(panelRow)}</span>
                </div>
                <div className="border rounded p-3 mb-3">{pairList(passPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Holder Details</h6>
                <div className="border rounded p-3 mb-3">{pairList(holderPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Validity Window</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList(windowPairsOf(panelRow))}
                  <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top">
                    <span className="fs-13 fw-medium">State</span>
                    <span className="fs-13 fw-semibold">{validUntilSubLabelOf(panelRow)}</span>
                  </div>
                </div>

                <h6 className="fs-14 mb-2">Host &amp; Access</h6>
                <div className="border rounded p-3 mb-3">{pairList(hostPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Vehicle Details</h6>
                {panelRow.vehicle ? (
                  <div className="border rounded p-3 mb-3">{pairList(vehiclePairsOf(panelRow))}</div>
                ) : (
                  <p className="fs-13 text-muted mb-3">
                    Pedestrian pass — no vehicle access granted.
                  </p>
                )}

                <h6 className="fs-14 mb-2">Validity Timeline</h6>
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

                <h6 className="fs-14 mb-2 mt-3">Reader Scans</h6>
                {panelRow.scans.map((scan) => (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${scan.title}-${scan.meta}`}>
                    <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                      <i className="ti ti-scan" />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0 text-truncate">{scan.title}</h6>
                      <span className="fs-12 text-muted text-truncate d-block">{scan.meta}</span>
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
                  {durationText(windowOf(panelRow))} window ·{' '}
                  {minutesToOpenOf(panelRow) > 0
                    ? `opens in ${durationText(minutesToOpenOf(panelRow))}`
                    : minutesToExpiryOf(panelRow) < 0
                      ? `closed ${durationText(-minutesToExpiryOf(panelRow))} ago`
                      : `expires in ${durationText(minutesToExpiryOf(panelRow))}`}
                </p>

                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'verify'); }}
                  >
                    <i className="ti ti-qrcode me-1" />Verify Pass
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

      <GatePassModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onIssue={issuePass}
        onUpdate={updatePass}
        onApprove={approve}
        onVerify={verify}
        onExtend={extend}
        onRevoke={revoke}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="gpToasts" />
    </>
  );
};

export default GatePassPage;
