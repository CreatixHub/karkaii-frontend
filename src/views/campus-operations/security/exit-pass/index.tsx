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
import PassModals from './modals/PassModals';
import type {
  CheckOutPayload, DecisionPayload, PassDraft, PassModalId, ReturnPayload,
} from './modals/PassModals';
import type { ExitPass, ExitReason, PassStatus, PersonType } from './data/passes.data';
import {
  DASH, QUICK_TOTALS, REGISTER_DATE, REGISTER_FROM, REGISTER_TIME, REGISTER_TO,
  SUMMARY_TOTALS, VIEW_TOTALS, approverLabelOf, auditOf, consentBandOf, consentOptions,
  dateKey, decisionLabelOf, durationLabel, expectedLabelOf, exitLabelOf, exitSubLabelOf,
  gateOptions, guardianPairsOf, minutesOf, minutesUntilReturn, offCampusOf,
  panelPassPairsOf, passes as initialRows, personBadge, personPairsOf, personTypeOptions,
  reasonBadge, reasonOptions, requestPairsOf, returnBadge, returnLabelOf, returnPairsOf,
  returnStatusOf, returnStatusOptions, returnTintOf, searchIndexOf, stagesOf, statusBadge,
  statusOf, statusOptions, statusPill, timelineOf, varianceLabelOf,
} from './data/passes.data';

const routes = all_routes;

/** Ids and options are the template's own; the date window opens committed. */
const filterFields: FilterField[] = [
  { id: 'person-type', label: 'Person Type', kind: 'select', chipLabel: 'Person', options: personTypeOptions },
  { id: 'exit-reason', label: 'Exit Reason', kind: 'select', chipLabel: 'Reason', options: reasonOptions },
  { id: 'approval-status', label: 'Approval Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'gate', label: 'Gate', kind: 'select', chipLabel: 'Gate', options: gateOptions },
  {
    id: 'from-date', label: 'From Date', kind: 'date', chipLabel: 'Date',
    dateFormat: 'd-m-Y', initialValue: REGISTER_FROM,
  },
  {
    id: 'to-date', label: 'To Date', kind: 'date', chipLabel: 'To',
    dateFormat: 'd-m-Y', initialValue: REGISTER_TO,
  },
  { id: 'return-status', label: 'Return Status', kind: 'select', chipLabel: 'Return', allLabel: 'Any', options: returnStatusOptions },
  { id: 'guardian-consent', label: 'Guardian Consent', kind: 'select', chipLabel: 'Consent', allLabel: 'Any', options: consentOptions },
];

const sortOptions: SortOption[] = [
  { id: 'pass', label: 'Pass ID', icon: 'ti ti-hash' },
  { id: 'name', label: 'Name (A–Z)', icon: 'ti ti-abc' },
  { id: 'exit', label: 'Exit time', icon: 'ti ti-door-exit' },
  { id: 'expected', label: 'Expected return', icon: 'ti ti-clock' },
  { id: 'overdue', label: 'Overdue duration', icon: 'ti ti-alert-triangle' },
];

const inputDateKey = (value: string): number => {
  const [day, month, year] = value.split('-').map(Number);
  return Number.isFinite(year) ? year * 10000 + month * 100 + day : 0;
};

/** "31-07-2026" → "31 Jul 2026", the way a row prints a date. */
const toRowDate = (value: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [day, month, year] = value.split('-');
  return months[Number(month) - 1] ? `${Number(day)} ${months[Number(month) - 1]} ${year}` : value;
};

/** A predicate for one derived status, used by the views, rail and strip. */
const isStatus = (status: PassStatus) => (row: ExitPass) => statusOf(row) === status;

/** How far past its return time an open pass has run; zero once closed. */
const overdueOf = (row: ExitPass): number =>
  returnStatusOf(row) === 'Overdue' ? Math.max(0, -minutesUntilReturn(row)) : 0;

const ExitPassPage = () => {
  const [rows, setRows] = useState<ExitPass[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<PassModalId | null>(null);
  const [modalRow, setModalRow] = useState<ExitPass | null>(null);
  const [panelRow, setPanelRow] = useState<ExitPass | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: ExitPass | null, modal: PassModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: ExitPass) => ExitPass, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<ExitPass>[]>(
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
        id: 'name',
        label: 'Name',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="dt-avatar">
              <ImageWithBasePath src={row.avatar} alt={row.name} />
            </span>
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
        id: 'department',
        label: 'Department / Class',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.department}</span>
            <span className="fs-12 text-muted text-nowrap">{row.baseLocation}</span>
          </>
        ),
      },
      {
        id: 'reason',
        label: 'Exit Reason',
        sortable: true,
        render: (row) => (
          <>
            <span className={reasonBadge[row.reason]}>{row.reason}</span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{row.detail}</span>
          </>
        ),
      },
      {
        id: 'exit',
        label: 'Exit Time',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{exitLabelOf(row)}</span>
            <span className="fs-12 text-muted text-nowrap">{exitSubLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'expected',
        label: 'Expected Return',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{expectedLabelOf(row)}</span>
            {/* Returned early, returned late, due in, late by — one derivation. */}
            <span className={`fs-12 text-nowrap ${returnTintOf(row)}`}>{returnLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'approver',
        label: 'Approved By',
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{approverLabelOf(row)}</span>
            <span className="fs-12 text-muted text-nowrap">{decisionLabelOf(row)}</span>
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
        id: 'return',
        label: 'Return Status',
        render: (row) => (
          <span className={returnBadge[returnStatusOf(row)]}>{returnStatusOf(row)}</span>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<ExitPass>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['person-type'] && row.personType !== filters['person-type']) return false;
      if (filters['exit-reason'] && row.reason !== filters['exit-reason']) return false;
      if (filters['approval-status'] && statusOf(row) !== filters['approval-status']) return false;
      if (filters.gate && row.gate !== filters.gate) return false;
      if (filters['from-date'] && dateKey(REGISTER_DATE) < inputDateKey(filters['from-date'])) return false;
      if (filters['to-date'] && dateKey(REGISTER_DATE) > inputDateKey(filters['to-date'])) return false;
      if (filters['return-status'] && returnStatusOf(row) !== filters['return-status']) return false;
      if (filters['guardian-consent'] && consentBandOf(row) !== filters['guardian-consent']) return false;
      return true;
    },
    /** The rail opens on All, which narrows nothing. */
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'Pending') return statusOf(row) === 'Pending Approval';
      if (quick === 'Returned') return returnStatusOf(row).startsWith('Returned');
      if (quick === 'Overdue') return returnStatusOf(row) === 'Overdue';
      return statusOf(row) === quick;
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'active': return statusOf(row) === 'Active';
        case 'pending': return statusOf(row) === 'Pending Approval';
        case 'overdue': return returnStatusOf(row) === 'Overdue';
        case 'students': return row.personType === 'Student';
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'exit':
          return minutesOf(a.exitTime || '23:59') - minutesOf(b.exitTime || '23:59');
        case 'expected':
          return minutesUntilReturn(a) - minutesUntilReturn(b);
        case 'overdue':
          return overdueOf(b) - overdueOf(a) || a.id.localeCompare(b.id);
        // The `<th>`s sort on columns the menu does not offer.
        case 'person':
          return a.personType.localeCompare(b.personType);
        case 'department':
          return a.department.localeCompare(b.department);
        case 'reason':
          return a.reason.localeCompare(b.reason);
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
    (test: (row: ExitPass) => boolean) => rows.filter(test).length,
    [rows],
  );

  /** Template total − what it seeded + what the roster holds now. */
  const shift = useCallback(
    (base: number, test: (row: ExitPass) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Passes Today', icon: 'ti ti-layout-list', count: shift(VIEW_TOTALS.all, () => true) },
      { id: 'active', label: 'Active Passes', icon: 'ti ti-ticket', count: shift(VIEW_TOTALS.active, isStatus('Active')) },
      { id: 'pending', label: 'Pending Approval', icon: 'ti ti-clock', count: shift(VIEW_TOTALS.pending, isStatus('Pending Approval')) },
      {
        id: 'overdue', label: 'Overdue Returns', icon: 'ti ti-alert-triangle',
        count: shift(VIEW_TOTALS.overdue, (row) => returnStatusOf(row) === 'Overdue'),
      },
      {
        id: 'students', label: 'Student Passes', icon: 'ti ti-school',
        count: shift(VIEW_TOTALS.students, (row) => row.personType === 'Student'),
      },
    ],
    [shift],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: shift(QUICK_TOTALS.all, () => true) },
      { id: 'Active', label: 'Active', icon: 'ti ti-ticket', count: shift(QUICK_TOTALS.active, isStatus('Active')) },
      { id: 'Pending', label: 'Pending', icon: 'ti ti-clock', count: shift(QUICK_TOTALS.pending, isStatus('Pending Approval')) },
      {
        id: 'Returned', label: 'Returned', icon: 'ti ti-arrow-back-up',
        count: shift(QUICK_TOTALS.returned, (row) => returnStatusOf(row).startsWith('Returned')),
      },
      {
        id: 'Overdue', label: 'Overdue', icon: 'ti ti-alert-triangle',
        count: shift(QUICK_TOTALS.overdue, (row) => returnStatusOf(row) === 'Overdue'),
      },
      { id: 'Rejected', label: 'Rejected', icon: 'ti ti-circle-x', count: shift(QUICK_TOTALS.rejected, isStatus('Rejected')) },
    ],
    [shift],
  );

  /**
   * The strip counts the whole day — 56 passes against the eight this page lists
   * — so the template's figures stand and the roster moves them.
   */
  const summary = useMemo<SummaryItem[]>(
    () => [
      {
        id: 'active', tint: 'primary', icon: 'ti ti-ticket', label: 'Active Passes',
        value: String(shift(SUMMARY_TOTALS.active, isStatus('Active'))), hint: 'currently off campus',
      },
      {
        id: 'approved', tint: 'success', icon: 'ti ti-circle-check', label: 'Approved Today',
        value: String(shift(SUMMARY_TOTALS.approvedToday, (row) => Boolean(row.approvedAt))),
        hint: REGISTER_DATE,
      },
      {
        id: 'pending', tint: 'warning', icon: 'ti ti-clock', label: 'Pending Approval',
        value: String(shift(SUMMARY_TOTALS.pending, isStatus('Pending Approval'))),
        hint: 'awaiting a decision',
      },
      {
        id: 'returned', tint: 'info', icon: 'ti ti-arrow-back-up', label: 'Returned',
        value: String(shift(SUMMARY_TOTALS.returned, (row) => returnStatusOf(row).startsWith('Returned'))),
        hint: `of ${SUMMARY_TOTALS.approvedToday} approved today`,
      },
      {
        id: 'overdue', tint: 'danger', icon: 'ti ti-alert-triangle', label: 'Overdue Returns',
        value: String(shift(SUMMARY_TOTALS.overdue, (row) => returnStatusOf(row) === 'Overdue')),
        hint: 'past the expected time',
      },
    ],
    [shift],
  );

  /* -------------------------------- Mutations ------------------------------- */

  const issuePass = useCallback(
    (draft: PassDraft) => {
      if (!draft.person) {
        push('Pick the person the pass is for', 'warning');
        return;
      }
      const [name, reference] = draft.person.split('·').map((part) => part.trim());
      const id = `EXP-2026-04${56 + rows.length}`;
      const noReturn = draft.returnExpectedOn === 'No return due';
      const staffPass = draft.holder !== 'Student';
      setRows((current) => [
        {
          id, name, avatar: 'assets/img/students/student-01.jpg',
          reference: reference ?? draft.department,
          personType: draft.holder as PersonType,
          department: draft.department.trim() || reference || 'Not recorded',
          baseLocation: 'Not recorded',
          reason: draft.reason as ExitReason,
          detail: draft.detail.trim() || draft.reason,
          requestedAt: REGISTER_TIME,
          approver: draft.authority.split('·')[0].trim(),
          approvingAuthority: draft.authority.split('·')[1]?.trim() ?? 'Not assigned',
          approvedAt: REGISTER_TIME,
          rejected: false, rejectedAt: '',
          passNumber: draft.printQr ? `SP-2026-03${65 + rows.length}` : '',
          gate: draft.gate, lane: `${draft.gate} · Lane 1`,
          exitTime: '', plannedExit: draft.exitTime,
          expectedDate: draft.returnExpectedOn === 'Next working day' ? '1 Aug 2026' : '',
          expectedTime: noReturn ? '' : draft.expectedReturn,
          actualReturn: '',
          guardian: staffPass ? null : {
            name: draft.collectedBy.trim() || 'Guardian on record',
            relationship: 'Guardian', contact: 'Not recorded',
            method: draft.consent, recorded: REGISTER_TIME,
          },
          gateRegister: '',
          exitOfficer: '', returnOfficer: '',
          documents: draft.printQr
            ? [{ name: `Exit Pass SP-2026-03${65 + rows.length}.pdf`, meta: `Issued ${REGISTER_TIME} · not used` }]
            : [],
          notes: draft.notes.trim() || 'Raised from the exit register.',
          attendance: 'Present 07:45',
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} issued for ${name}`);
    },
    [push, rows.length],
  );

  const updatePass = useCallback(
    (draft: PassDraft) =>
      patchRow(
        (row) => ({
          ...row,
          department: draft.department.trim() || row.department,
          reason: draft.reason as ExitReason,
          detail: draft.detail.trim() || row.detail,
          gate: draft.gate,
          plannedExit: row.exitTime ? row.plannedExit : draft.exitTime,
          // Extending the return is what clears an overdue flag.
          expectedTime: draft.returnExpectedOn === 'No return due' ? '' : draft.expectedReturn,
          expectedDate: draft.returnExpectedOn === 'Specific date' ? row.expectedDate : '',
          approver: draft.authority.split('·')[0].trim(),
          approvingAuthority: draft.authority.split('·')[1]?.trim() ?? row.approvingAuthority,
          guardian: row.guardian
            ? { ...row.guardian, method: draft.consent, name: draft.collectedBy.trim() || row.guardian.name }
            : null,
          notes: draft.notes.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Pass'} updated`,
      ),
    [modalRow, patchRow],
  );

  /** The decision is what moves a request off Pending Approval. */
  const decide = useCallback(
    (payload: DecisionPayload) => {
      const rejecting = payload.decision === 'Reject';
      const holding = payload.decision === 'Hold';
      patchRow(
        (row) => ({
          ...row,
          approver: payload.authority.split('·')[0].trim(),
          approvingAuthority: payload.authority.split('·')[1]?.trim() ?? row.approvingAuthority,
          approvedAt: rejecting || holding ? '' : payload.decisionTime,
          rejected: rejecting,
          rejectedAt: rejecting ? payload.decisionTime : '',
          plannedExit: rejecting ? '' : payload.exitTime,
          expectedTime: rejecting || payload.expectedReturn === 'No return due' ? '' : row.expectedTime,
          passNumber: !rejecting && !holding && payload.issuePass
            ? row.passNumber || `SP-2026-03${70 + rows.length}` : row.passNumber,
          notes: payload.remarks.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Request'} ${rejecting ? 'rejected' : holding ? 'held' : 'approved'} at ${payload.decisionTime}`,
      );
    },
    [modalRow, patchRow, rows.length],
  );

  /** Checking out stamps the exit, which takes the pass from Approved to Active. */
  const checkOut = useCallback(
    (payload: CheckOutPayload) =>
      patchRow(
        (row) => ({
          ...row,
          exitTime: payload.exitTime,
          gate: payload.gate,
          exitOfficer: payload.officer,
          gateRegister: payload.linkGate ? `GT-2026-08${Number(row.id.slice(-2)) + 40}` : row.gateRegister,
          guardian: row.guardian && payload.handoverTo.trim()
            ? { ...row.guardian, name: payload.handoverTo.trim() } : row.guardian,
          notes: payload.remarks.trim() || row.notes,
        }),
        `${modalRow?.name ?? 'Pass holder'} checked out at ${payload.exitTime}`,
      ),
    [modalRow, patchRow],
  );

  /** The return closes the pass, and its lateness follows from the two times. */
  const recordReturn = useCallback(
    (payload: ReturnPayload) => {
      if (!modalRow?.exitTime) {
        push('This pass holder has not checked out yet', 'warning');
        return;
      }
      const late = modalRow.expectedTime
        ? Math.max(0, minutesOf(payload.returnTime) - minutesOf(modalRow.expectedTime))
        : 0;
      patchRow(
        (row) => ({
          ...row,
          actualReturn: payload.returnTime,
          returnOfficer: payload.officer,
          gate: payload.gate,
          notes: payload.remarks.trim() || row.notes,
          documents: [
            { name: 'Return Note.pdf', meta: `${toRowDate(payload.returnDate)} ${payload.returnTime} · ${payload.officer}` },
            ...row.documents,
          ],
        }),
        late > 0
          ? `${modalRow.id} closed — returned ${durationLabel(late)} late (${payload.delayReason.toLowerCase()})`
          : `${modalRow.id} closed — returned on time at ${payload.returnTime}`,
      );
    },
    [modalRow, patchRow, push],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} exit passes exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: ExitPass) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View pass" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit pass" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Approve or reject" onClick={() => openModal(row, 'decision')}>
        <i className="ti ti-circle-check" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Check out" onClick={() => openModal(row, 'checkout')}>
        <i className="ti ti-door-exit" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Record return" onClick={() => openModal(row, 'return')}>
        <i className="ti ti-arrow-back-up" />
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
  const primaryAction = (row: ExitPass) => {
    const status = statusOf(row);
    if (status === 'Pending Approval') {
      return { modal: 'decision' as PassModalId, icon: 'ti ti-circle-check', label: 'Approve / Reject' };
    }
    if (status === 'Approved') {
      return { modal: 'checkout' as PassModalId, icon: 'ti ti-door-exit', label: 'Check-Out' };
    }
    if (status === 'Active' || status === 'Expired') {
      return { modal: 'return' as PassModalId, icon: 'ti ti-arrow-back-up', label: 'Record Return' };
    }
    return null;
  };

  const renderDetail = (row: ExitPass) => {
    const primary = primaryAction(row);
    return (
      <div className="row g-4">
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-user text-primary me-1" />Person Information</h6>
          {pairList(personPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-file-text text-info me-1" />Exit Request Details</h6>
          {pairList(requestPairsOf(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-users text-warning me-1" />Guardian Authorization</h6>
          {row.guardian ? pairList(guardianPairsOf(row)) : (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-0">
              <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                <i className="ti ti-user-off" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">Not applicable</h6>
                <span className="fs-12 text-muted text-truncate d-block">
                  Staff passes need no guardian consent
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-checks text-success me-1" />Approval Timeline</h6>
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
          <h6 className="fs-14 mb-3"><i className="ti ti-shield-check text-purple me-1" />Gate Verification</h6>
          {row.exitTime ? (
            <>
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
                <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                  <i className="ti ti-door-exit" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">Exit scan at the gate</h6>
                  <span className="fs-12 text-muted text-truncate d-block">
                    {row.exitTime} · {row.exitOfficer}
                  </span>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
                <span
                  className={`avatar avatar-sm bg-${row.actualReturn ? 'success' : 'secondary'}-transparent text-${row.actualReturn ? 'success' : 'secondary'} rounded flex-shrink-0`}
                >
                  <i className={row.actualReturn ? 'ti ti-door-enter' : 'ti ti-scan'} />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">
                    {row.actualReturn ? 'Return scan at the gate' : 'Return scan not recorded'}
                  </h6>
                  <span className="fs-12 text-muted text-truncate d-block">
                    {row.actualReturn ? `${row.actualReturn} · ${row.returnOfficer}` : `${row.gate} · ${row.lane}`}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
              <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                <i className="ti ti-scan" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">
                  {row.approvedAt ? 'Not presented at the gate yet' : 'No gate movement recorded'}
                </h6>
                <span className="fs-12 text-muted text-truncate d-block">{row.gate} · {row.lane}</span>
              </div>
            </div>
          )}
          {row.gateRegister ? (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-0">
              <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
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
          <h6 className="fs-14 mb-3"><i className="ti ti-arrow-back-up text-danger me-1" />Return Information</h6>
          {pairList(returnPairsOf(row))}
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
              <i className="ti ti-eye me-1" />View Pass
            </button>
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm"
              onClick={() => setPanelRow(row)}
            >
              <i className="ti ti-ticket me-1" />Exit Pass Panel
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
            title="Exit Pass"
            section="Security"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(
                      rows.find((row) => row.exitTime && !row.actualReturn) ?? rows[0] ?? null, 'return',
                    )}
                  >
                    <i className="ti ti-arrow-back-up me-2" />Record Return
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Print Exit Register" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'issue')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Issue Exit Pass
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
            workspaceId="epWorkspace"
            searchPlaceholder="Search pass ID, student or staff name…"
            searchLabel="Search exit passes"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="passes"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Exit register refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-ticket-off"
            emptyTitle="No exit passes match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Exit Pass Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Exit Pass Details"
            labelledById="ep_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Personal Information</h6>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar avatar-lg rounded flex-shrink-0">
                    <ImageWithBasePath src={panelRow.avatar} className="rounded" alt={panelRow.name} />
                  </span>
                  <div className="ms-2 overflow-hidden">
                    <h6 className="mb-0 text-truncate">{panelRow.name}</h6>
                    <span className="fs-12 text-muted">{panelRow.id} · {panelRow.reference}</span>
                  </div>
                  <span className={`${statusBadge[statusOf(panelRow)]} ms-auto`}>{statusOf(panelRow)}</span>
                </div>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Person Type', value: panelRow.personType },
                    { label: 'Class', value: `${panelRow.department} · ${panelRow.baseLocation}` },
                    { label: 'Approving Authority', value: panelRow.approvingAuthority || 'Not assigned' },
                    { label: 'Attendance', value: panelRow.attendance },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Exit Pass Details</h6>
                <div className="border rounded p-3 mb-3">{pairList(panelPassPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Approval Information</h6>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                  <span
                    className={`avatar avatar-sm bg-${panelRow.rejected ? 'danger' : panelRow.approvedAt ? 'success' : 'warning'}-transparent text-${panelRow.rejected ? 'danger' : panelRow.approvedAt ? 'success' : 'warning'} rounded flex-shrink-0`}
                  >
                    <i className={panelRow.rejected ? 'ti ti-circle-x' : panelRow.approvedAt ? 'ti ti-circle-check' : 'ti ti-clock'} />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0 text-truncate">{approverLabelOf(panelRow)}</h6>
                    <span className="fs-12 text-muted text-truncate d-block">
                      {panelRow.approvingAuthority || 'Not assigned'} · {decisionLabelOf(panelRow).toLowerCase()}
                    </span>
                  </div>
                  <span className={statusBadge[statusOf(panelRow)]}>{statusOf(panelRow)}</span>
                </div>

                <h6 className="fs-14 mb-2">Guardian Contact</h6>
                {panelRow.guardian ? (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                    <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
                      <i className="ti ti-users" />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0 text-truncate">{panelRow.guardian.name}</h6>
                      <span className="fs-12 text-muted text-truncate d-block">
                        {panelRow.guardian.relationship} · {panelRow.guardian.contact}
                      </span>
                    </div>
                    <span className="badge badge-soft-success">{panelRow.guardian.recorded}</span>
                  </div>
                ) : (
                  <p className="fs-13 text-muted mb-3">
                    Not applicable — staff passes need no guardian consent.
                  </p>
                )}

                <h6 className="fs-14 mb-2">Check-Out &amp; Return Timeline</h6>
                <div className="table-responsive mb-3">
                  <table className="table table-sm align-middle mb-0">
                    <thead>
                      <tr>
                        <th className="fs-12">Stage</th>
                        <th className="fs-12">Time</th>
                        <th className="fs-12">By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Five stages, each stamped by the pass's own record. */}
                      {stagesOf(panelRow).map((stage) => (
                        <tr key={stage.stage}>
                          <td className="fs-13">{stage.stage}</td>
                          <td className="fs-13 text-nowrap">{stage.time}</td>
                          <td className="fs-13">{stage.by || DASH}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h6 className="fs-14 mb-2">Security Verification</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'QR Scan', value: panelRow.exitTime ? 'Passed' : 'Not scanned' },
                    { label: 'Guardian ID', value: panelRow.guardian ? 'Matched' : 'Not applicable' },
                    { label: 'Handover', value: panelRow.exitTime ? 'Signed' : 'Pending' },
                    { label: 'Variance', value: varianceLabelOf(panelRow) },
                  ])}
                </div>
                {panelRow.gateRegister ? (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                    <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
                      <i className="ti ti-link" />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0 text-truncate">Gate register {panelRow.gateRegister}</h6>
                      <span className="fs-12 text-muted text-truncate d-block">
                        {panelRow.gate} · {REGISTER_DATE}
                      </span>
                    </div>
                    <span className="badge badge-soft-success">Linked</span>
                  </div>
                ) : null}

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
                  {panelRow.exitTime
                    ? `${durationLabel(offCampusOf(panelRow))} off campus · ${returnStatusOf(panelRow).toLowerCase()}`
                    : `Not checked out · ${statusOf(panelRow).toLowerCase()}`}
                </p>

                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'return'); }}
                  >
                    <i className="ti ti-arrow-back-up me-1" />Record Return
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

      <PassModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onIssue={issuePass}
        onUpdate={updatePass}
        onDecide={decide}
        onCheckOut={checkOut}
        onRecordReturn={recordReturn}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="epToasts" />
    </>
  );
};

export default ExitPassPage;
