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
import VisitorModals from './modals/VisitorModals';
import type { VisitorDraft, VisitorModalId } from './modals/VisitorModals';
import type { Visitor, VisitStatus, VisitorType } from './data/visitors.data';
import {
  DASH, SUMMARY_TOTALS, dateBandOf, dateRangeOptions, hostelGender, hostelOptions, hostelTintOf,
  idProofBandOf, idProofOptions, isOpen, relationshipTint, searchIndexOf, statusBadge,
  statusOptions, statusPill, studentSummaryOf, timeKey, verifiedBandOf, verifiedByOptions,
  verifierLabel, visitorTypeOptions, visitors as initialRows,
} from './data/visitors.data';

const routes = all_routes;

/** Ids and options are the template's own, verbatim from the filter panel. */
const filterFields: FilterField[] = [
  { id: 'hostel', label: 'Hostel', kind: 'select', chipLabel: 'Hostel', options: hostelOptions },
  { id: 'visitor-type', label: 'Visitor Type', kind: 'select', chipLabel: 'Type', options: visitorTypeOptions },
  { id: 'visit-status', label: 'Visit Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  {
    id: 'date-range', label: 'Date Range', kind: 'select', chipLabel: 'Range',
    options: dateRangeOptions, defaultValue: 'Today',
  },
  { id: 'id-proof', label: 'ID Proof', kind: 'select', chipLabel: 'ID', options: idProofOptions },
  { id: 'verified-by', label: 'Verified By', kind: 'select', chipLabel: 'Verified', options: verifiedByOptions },
];

const sortOptions: SortOption[] = [
  { id: 'checkin', label: 'Check-in time (newest)', icon: 'ti ti-clock-hour-4' },
  { id: 'name', label: 'Visitor name (A–Z)', icon: 'ti ti-abc' },
  { id: 'student', label: 'Visiting student', icon: 'ti ti-school' },
  { id: 'hostel', label: 'Hostel', icon: 'ti ti-building-fortress' },
  { id: 'duration', label: 'Visit duration', icon: 'ti ti-hourglass' },
];

const VisitorLog = () => {
  const [rows, setRows] = useState<Visitor[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<VisitorModalId | null>(null);
  const [modalRow, setModalRow] = useState<Visitor | null>(null);
  const [panelRow, setPanelRow] = useState<Visitor | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Visitor | null, modal: VisitorModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  /** Applies a change to the row a dialog was opened on. */
  const patchRow = useCallback(
    (change: (row: Visitor) => Visitor, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Visitor>[]>(
    () => [
      {
        id: 'visitor-id',
        label: 'Visitor ID',
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
            <span className="dt-avatar">
              <ImageWithBasePath src={row.visitorAvatar} alt={row.visitor} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.visitor}</ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">{row.visitorType}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'student',
        label: 'Visiting Student',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="dt-avatar">
              <ImageWithBasePath src={row.studentAvatar} alt={row.student} />
            </span>
            <div>
              <span className="dt-name">{row.student}</span>
              <div className="dt-sub flex-nowrap text-nowrap">{row.studentLine}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'relationship',
        label: 'Relationship',
        render: (row) => (
          <span className={`badge badge-soft-${relationshipTint(row.relationship)}`}>
            {row.relationship}
          </span>
        ),
      },
      {
        id: 'hostel',
        label: 'Hostel',
        sortable: true,
        render: (row) => (
          <>
            <span className={`badge badge-soft-${hostelTintOf(row)}`}>{row.hostel}</span>
            <span className="d-block fs-12 text-muted mt-1">{hostelGender[row.hostel]}</span>
          </>
        ),
      },
      {
        id: 'checkin',
        label: 'Check-In Time',
        sortable: true,
        cellClassName: 'fs-13 text-nowrap',
        render: (row) => (row.checkIn ? row.checkIn : <span className="text-muted">{DASH}</span>),
      },
      {
        id: 'checkout',
        label: 'Check-Out Time',
        cellClassName: 'fs-13 text-nowrap',
        render: (row) => (row.checkOut ? row.checkOut : <span className="text-muted">{DASH}</span>),
      },
      {
        id: 'idproof',
        label: 'ID Proof',
        render: (row) =>
          row.idProof ? (
            <>
              <span className="badge badge-soft-secondary">{row.idProof}</span>
              <span className="d-block fs-12 text-muted mt-1">{row.idNumber}</span>
            </>
          ) : (
            <span className="d-block fs-13 text-muted">Not produced</span>
          ),
      },
      {
        id: 'status',
        label: 'Visit Status',
        render: (row) => (
          <span className={`dt-pill ${statusPill[row.status]}`}>
            <span className="dt-pill-dot" />{row.status}
          </span>
        ),
      },
      {
        id: 'verified',
        label: 'Verified By',
        render: (row) =>
          row.verifiedBy ? (
            <div className="d-flex align-items-center gap-2">
              <span className="avatar avatar-xs rounded-circle flex-shrink-0">
                <ImageWithBasePath
                  src={row.verifierAvatar}
                  className="rounded-circle flex-shrink-0"
                  alt={row.verifiedBy}
                />
              </span>
              <span className="fs-13 text-nowrap">{row.verifiedBy}</span>
            </div>
          ) : (
            <span className="fs-13 text-muted">Awaiting</span>
          ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Visitor>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.hostel && !filters.hostel.startsWith(row.hostel)) return false;
      if (filters['visitor-type'] && row.visitorType !== filters['visitor-type']) return false;
      if (filters['visit-status'] && row.status !== filters['visit-status']) return false;
      if (filters['date-range'] && filters['date-range'] !== 'Custom range') {
        // "Last 7 days" and "Last 30 days" include everything nearer than they are.
        const bands = ['Today', 'Yesterday', 'Last 7 days', 'Last 30 days'];
        const wanted = bands.indexOf(filters['date-range']);
        const actual = bands.indexOf(dateBandOf(row));
        if (wanted === 0 || wanted === 1 ? actual !== wanted : actual > wanted) return false;
      }
      if (filters['id-proof'] && idProofBandOf(row) !== filters['id-proof']) return false;
      if (filters['verified-by'] && verifiedBandOf(row) !== filters['verified-by']) return false;
      return true;
    },
    /** The rail's first chip is the day, not a status. */
    quickMatch: (row, quick) => {
      if (!quick || quick === 'Today') return true;
      if (quick === 'Pending') return row.status === 'Pending Approval';
      if (quick === 'Inside') return isOpen(row);
      return row.status === quick;
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'Inside': return row.status === 'Inside';
        case 'Pending Approval': return row.status === 'Pending Approval';
        case 'Pass Expired': return row.status === 'Pass Expired';
        case 'Blocked': return row.status === 'Blocked';
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'name':
          return a.visitor.localeCompare(b.visitor);
        case 'student':
          return a.student.localeCompare(b.student) || a.visitor.localeCompare(b.visitor);
        case 'hostel':
          return a.hostel.localeCompare(b.hostel) || a.visitor.localeCompare(b.visitor);
        case 'duration':
          return b.durationPairs.length - a.durationPairs.length || timeKey(b.checkIn) - timeKey(a.checkIn);
        // Not in the sort menu, but the Visitor ID `<th>` is sortable.
        case 'visitor-id':
          return a.id.localeCompare(b.id);
        case 'checkin':
        default:
          return timeKey(b.checkIn) - timeKey(a.checkIn);
      }
    },
    // The template opens newest-first with the Today chip lit.
    defaultSort: 'checkin',
    defaultQuick: 'Today',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: Visitor) => boolean) => rows.filter(test).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'Today’s Log', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'Inside', label: 'Currently Inside', icon: 'ti ti-login', count: countBy((row) => row.status === 'Inside') },
      {
        id: 'Pending Approval', label: 'Pending Approval', icon: 'ti ti-clock',
        count: countBy((row) => row.status === 'Pending Approval'),
      },
      {
        id: 'Pass Expired', label: 'Pass Expired', icon: 'ti ti-alert-triangle',
        count: countBy((row) => row.status === 'Pass Expired'),
      },
      { id: 'Blocked', label: 'Blocked Visitors', icon: 'ti ti-shield-x', count: countBy((row) => row.status === 'Blocked') },
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'Today', label: 'Today', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'Inside', label: 'Inside', icon: 'ti ti-login', count: countBy(isOpen) },
      {
        id: 'Checked Out', label: 'Checked Out', icon: 'ti ti-logout',
        count: countBy((row) => row.status === 'Checked Out'),
      },
      {
        id: 'Pending', label: 'Pending', icon: 'ti ti-clock',
        count: countBy((row) => row.status === 'Pending Approval'),
      },
      { id: 'Blocked', label: 'Blocked', icon: 'ti ti-shield-x', count: countBy((row) => row.status === 'Blocked') },
    ],
    [countBy, rows.length],
  );

  /**
   * The strip counts the whole day at the gate — 24 visitors against the eight
   * rows this page lists — so the template's figures stand, moved by whatever
   * this page records.
   */
  const summary = useMemo<SummaryItem[]>(() => {
    const inside = countBy((row) => row.status === 'Inside');
    const expired = countBy((row) => row.status === 'Pass Expired');
    const out = countBy((row) => row.status === 'Checked Out');
    const pending = countBy((row) => row.status === 'Pending Approval');
    const blocked = countBy((row) => row.status === 'Blocked');
    return [
      {
        id: 'today', tint: 'primary', icon: 'ti ti-users', label: "Today's Visitors",
        value: String(SUMMARY_TOTALS.today), hint: SUMMARY_TOTALS.date,
      },
      {
        id: 'inside', tint: 'success', icon: 'ti ti-login', label: 'Currently Inside',
        value: String(SUMMARY_TOTALS.inside - 2 + inside),
        hint: `${expired} past pass expiry`,
      },
      {
        id: 'out', tint: 'info', icon: 'ti ti-logout', label: 'Checked Out',
        value: String(SUMMARY_TOTALS.checkedOut - 2 + out),
        hint: `avg. stay ${SUMMARY_TOTALS.averageStay}`,
      },
      {
        id: 'pending', tint: 'warning', icon: 'ti ti-clock', label: 'Pending Approval',
        value: String(pending), hint: 'awaiting warden',
      },
      {
        id: 'blocked', tint: 'danger', icon: 'ti ti-shield-x', label: 'Blocked Visitors',
        value: String(SUMMARY_TOTALS.blocked - 1 + blocked), hint: 'on the watchlist',
      },
    ];
  }, [countBy]);

  /* -------------------------------- Mutations ------------------------------- */

  /** "31-07-2026" + "10:15" → "31 Jul, 10:15 AM", the way the grid prints it. */
  const gateStamp = (date: string, time: string): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [day, month] = date.split('-');
    const [hourText, minute] = time.split(':');
    const hour = Number(hourText);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const twelve = hour % 12 === 0 ? 12 : hour % 12;
    const name = months[Number(month) - 1] ?? '';
    return `${day} ${name}, ${String(twelve).padStart(2, '0')}:${minute} ${suffix}`;
  };

  const registerVisitor = useCallback(
    (draft: VisitorDraft, checkedIn: boolean) => {
      if (!draft.name.trim() || !draft.student) {
        push('A visitor name and a student are both required', 'warning');
        return;
      }
      const [student, admission, room] = draft.student.split('·').map((part) => part.trim());
      const hostel = draft.hostel.split('·')[0].trim().replace(' Hostel', '');
      const id = `VIS-2026-04${19 + rows.length}`;
      const stamp = checkedIn ? gateStamp(draft.date, draft.time) : '';
      const warden = draft.verifiedBy.split('·')[0].trim();

      setRows((current) => [
        {
          id,
          visitor: draft.name.trim(),
          visitorAvatar: 'assets/img/profiles/avatar-19.jpg',
          visitorType: draft.visitorType as VisitorType,
          relationship: draft.relationship,
          student,
          studentAvatar: 'assets/img/students/student-01.jpg',
          studentLine: room ? `Hostel · ${room}` : 'Hostel',
          hostel,
          checkIn: stamp,
          checkOut: '',
          idProof: draft.idProof,
          idNumber: draft.idNumber.trim(),
          status: checkedIn && !draft.approval ? 'Inside' : 'Pending Approval',
          verifiedBy: checkedIn && !draft.approval ? warden : '',
          verifierAvatar: checkedIn && !draft.approval ? 'assets/img/teachers/teacher-01.jpg' : '',
          visitorPairs: [
            { label: 'Visitor Type', value: draft.visitorType },
            { label: 'Mobile', value: draft.mobile.trim() || DASH },
            { label: 'Email', value: 'Not provided' },
            { label: 'Vehicle', value: 'Not recorded' },
            { label: 'Visits This Term', value: '1' },
          ],
          studentPairs: [
            { label: 'Student', value: student },
            { label: 'Admission No', value: admission ?? DASH },
            { label: 'Class & Section', value: DASH },
            { label: 'Room · Bed', value: room ?? DASH },
            { label: 'Allocation', value: DASH },
          ],
          contactPairs: [
            { label: 'Primary Mobile', value: draft.mobile.trim() || DASH },
            { label: 'Alternate', value: 'Not provided' },
            { label: 'Address', value: 'Not provided' },
            { label: 'Relationship Proof', value: 'Pending verification' },
          ],
          durationPairs: checkedIn
            ? [
              { label: 'Checked In', value: stamp },
              { label: 'Pass Valid For', value: draft.passValid },
              { label: 'Time Elapsed', value: '0m' },
              { label: 'Meeting Point', value: draft.meetingPoint },
            ]
            : [
              { label: 'Requested Slot', value: 'To be confirmed' },
              { label: 'Requested Duration', value: draft.passValid },
              { label: 'Approver', value: warden },
              { label: 'Status', value: 'Awaiting warden approval' },
            ],
          identity: [
            { title: draft.idProof, meta: `${draft.idNumber.trim() || 'Number pending'} · ${checkedIn ? 'scanned at gate' : 'awaiting gate scan'}` },
            { title: 'Photo Captured', meta: checkedIn ? 'Yes · at check-in' : 'Not yet captured' },
          ],
          history: [
            {
              title: checkedIn ? 'Checked in at the main gate' : 'Visit request submitted',
              meta: checkedIn ? `${stamp} · ${warden}` : '31 Jul 2026 · Front desk',
            },
          ],
          purpose: draft.purpose.trim() || 'Purpose not recorded.',
          remarks: checkedIn ? 'Entry recorded at the gate.' : 'Awaiting warden approval before entry.',
          pass: `VP-04${19 + rows.length}`,
        },
        ...current,
      ]);
      setActiveModal(null);
      push(checkedIn ? `${draft.name.trim()} checked in` : `${draft.name.trim()} registered`);
    },
    [push, rows.length],
  );

  /**
   * Checking in from a pending row closes that request rather than opening a
   * second entry for the same visitor; the header button starts a fresh one.
   */
  const checkIn = useCallback(
    (draft: VisitorDraft) => {
      if (!modalRow) {
        registerVisitor(draft, true);
        return;
      }
      const stamp = gateStamp(draft.date, draft.time);
      const warden = draft.verifiedBy.split('·')[0].trim();
      patchRow(
        (row) => ({
          ...row,
          checkIn: stamp,
          checkOut: '',
          status: 'Inside',
          verifiedBy: warden,
          verifierAvatar: 'assets/img/teachers/teacher-01.jpg',
          idProof: draft.idProof,
          idNumber: draft.idNumber.trim() || row.idNumber,
          durationPairs: [
            { label: 'Checked In', value: stamp },
            { label: 'Pass Valid For', value: draft.passValid },
            { label: 'Time Elapsed', value: '0m' },
            { label: 'Meeting Point', value: draft.meetingPoint },
          ],
          history: [{ title: 'Checked in at the main gate', meta: `${stamp} · ${warden}` }, ...row.history],
        }),
        `${modalRow.visitor} checked in at ${stamp}`,
      );
    },
    [modalRow, patchRow, registerVisitor],
  );

  const checkOut = useCallback(
    (date: string, time: string, passReturned: string, by: string, flag: boolean) => {
      const stamp = gateStamp(date, time);
      const warden = by.split('·')[0].trim();
      patchRow(
        (row) => ({
          ...row,
          checkOut: stamp,
          status: 'Checked Out',
          durationPairs: [
            { label: 'Checked In', value: row.durationPairs[0]?.value ?? DASH },
            { label: 'Checked Out', value: `${stamp.replace(',', ' 2026,')}` },
            { label: 'Total Duration', value: row.durationPairs[2]?.value ?? DASH },
            { label: 'Pass Returned', value: passReturned },
          ],
          history: [
            { title: 'Checked out at the main gate', meta: `${stamp} · ${warden}` },
            ...row.history,
          ],
          remarks: flag
            ? `${row.remarks} Overstay flagged on the visitor record.`
            : 'Visit completed within the pass window.',
        }),
        `${modalRow?.visitor ?? 'Visitor'} checked out at ${stamp}`,
      );
    },
    [modalRow, patchRow],
  );

  const verify = useCallback(
    (decision: string, verifiedBy: string, slot: string, access: string) => {
      const warden = verifiedBy.split('·')[0].trim();
      const status: VisitStatus = /reject/i.test(decision)
        ? 'Blocked'
        : /watchlist/i.test(decision) ? 'Blocked' : 'Pending Approval';
      patchRow(
        (row) => ({
          ...row,
          status: status === 'Blocked' ? 'Blocked' : row.status,
          verifiedBy: warden,
          verifierAvatar: 'assets/img/teachers/teacher-01.jpg',
          durationPairs: row.durationPairs.map((pair) =>
            pair.label === 'Status'
              ? { ...pair, value: status === 'Blocked' ? 'Refused by the warden' : `Approved · ${access}` }
              : pair.label === 'Approver' ? { ...pair, value: warden } : pair,
          ),
          history: [
            { title: decision, meta: `Slot ${slot} · ${warden}` },
            ...row.history,
          ],
          remarks: status === 'Blocked'
            ? `Visit refused by ${warden}. ${row.remarks}`
            : `Approved for ${access.toLowerCase()} at ${slot}.`,
        }),
        `${decision} recorded for ${modalRow?.visitor ?? 'the visitor'}`,
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
      push(`${workspace.visible.length} gate entries exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Visitor) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View visitor details" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Check in visitor" onClick={() => openModal(row, 'check-in')}>
        <i className="ti ti-login" />
      </ActionLink>
      <ActionLink className="dt-ib danger" ariaLabel="Check out visitor" onClick={() => openModal(row, 'check-out')}>
        <i className="ti ti-logout" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Print visitor pass" onClick={() => openModal(row, 'pass')}>
        <i className="ti ti-printer" />
      </ActionLink>
      {row.status === 'Pending Approval' ? (
        <ActionLink className="dt-ib" ariaLabel="Verify visitor" onClick={() => openModal(row, 'verify')}>
          <i className="ti ti-shield-check" />
        </ActionLink>
      ) : null}
    </div>
  );

  const pairList = (pairs: { label: string; value: string }[]) =>
    pairs.map((pair, index) => (
      <div
        className={`d-flex align-items-center justify-content-between ${index === pairs.length - 1 ? 'mb-0' : 'mb-2'}`}
        key={`${pair.label}-${index}`}
      >
        <span className="fs-13 text-muted">{pair.label}</span>
        <span className="fs-13 fw-medium text-end">{pair.value}</span>
      </div>
    ));

  const entryList = (entries: { title: string; meta: string }[], icon: string, tint: string) =>
    entries.map((entry) => (
      <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${entry.title}-${entry.meta}`}>
        <span className={`avatar avatar-sm bg-${tint}-transparent text-${tint} rounded flex-shrink-0`}>
          <i className={icon} />
        </span>
        <div className="flex-fill overflow-hidden">
          <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
          <span className="fs-12 text-muted text-truncate d-block">{entry.meta}</span>
        </div>
      </div>
    ));

  const renderDetail = (row: Visitor) => (
    <div className="row g-4">
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-user text-primary me-1" />Visitor Information</h6>
        {pairList(row.visitorPairs)}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-school text-info me-1" />Student Details</h6>
        {pairList(row.studentPairs)}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-phone text-success me-1" />Contact Information</h6>
        {pairList(row.contactPairs)}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-hourglass text-warning me-1" />Visit Duration</h6>
        {pairList(row.durationPairs)}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-id text-purple me-1" />Identity Proof</h6>
        {entryList(row.identity, 'ti ti-id', 'purple')}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3">
          <i className="ti ti-history text-info me-1" />Check-In / Check-Out History
        </h6>
        {entryList(row.history, 'ti ti-history', 'info')}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-notes text-secondary me-1" />Purpose of Visit</h6>
        <p className="fs-13 text-muted mb-0">{row.purpose}</p>
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-message-dots text-danger me-1" />Warden Remarks</h6>
        <p className="fs-13 text-muted mb-3">{row.remarks}</p>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => openModal(row, 'view')}
          >
            <i className="ti ti-eye me-1" />View Visitor
          </button>
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => setPanelRow(row)}
          >
            <i className="ti ti-user-shield me-1" />Visitor Panel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Visitor Log"
            section="Hostel"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'new')}
                  >
                    <i className="ti ti-user-plus me-2" />New Entry
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Print Gate Register" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'check-in')}
                  >
                    <i className="ti ti-login me-2" />Check In
                  </ActionLink>
                </div>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={rows.length}
            summary={summary}
            footerVariant="card-foot"
            pageSizeOptions={[8, 25, 50, 100]}
            footerInfoSuffix={`register as at ${SUMMARY_TOTALS.date}`}
            workspaceId="vlWorkspace"
            searchPlaceholder="Search visitor, student or ID…"
            searchLabel="Search the visitor log"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="entries"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Visitor log refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-user-off"
            emptyTitle="No visitors match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Visitor Details Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Visitor Details"
            labelledById="vl_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Visitor Profile</h6>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar avatar-lg rounded flex-shrink-0">
                    <ImageWithBasePath src={panelRow.visitorAvatar} className="rounded" alt={panelRow.visitor} />
                  </span>
                  <div className="ms-2">
                    <h6 className="mb-0">{panelRow.visitor}</h6>
                    <span className="fs-12 text-muted">{panelRow.id} · {panelRow.visitorType}</span>
                  </div>
                  <span className={`${statusBadge[panelRow.status]} ms-auto`}>{panelRow.status}</span>
                </div>
                <div className="border rounded p-3 mb-3">{pairList(panelRow.visitorPairs)}</div>

                <h6 className="fs-14 mb-2">Student Information</h6>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                  <span className="avatar avatar-sm rounded flex-shrink-0">
                    <ImageWithBasePath src={panelRow.studentAvatar} className="rounded" alt={panelRow.student} />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0">{panelRow.student}</h6>
                    <span className="fs-12 text-muted">{studentSummaryOf(panelRow)}</span>
                  </div>
                </div>

                <h6 className="fs-14 mb-2">Hostel Details</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Hostel', value: `${panelRow.hostel} Hostel` },
                    { label: 'Type', value: hostelGender[panelRow.hostel] ?? DASH },
                    { label: 'Verified By', value: verifierLabel(panelRow) },
                    { label: 'Visit Status', value: panelRow.status },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Visit Timeline</h6>
                <div className="border rounded p-3 mb-3">{pairList(panelRow.durationPairs)}</div>

                <h6 className="fs-14 mb-2">Security Verification</h6>
                {entryList(panelRow.identity, 'ti ti-id', 'purple')}

                <h6 className="fs-14 mb-2 mt-3">Contact Information</h6>
                <div className="border rounded p-3 mb-3">{pairList(panelRow.contactPairs)}</div>

                <h6 className="fs-14 mb-2">Audit Information</h6>
                {entryList(panelRow.history, 'ti ti-history', 'info')}

                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'check-out'); }}
                  >
                    <i className="ti ti-logout me-1" />Check Out
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'pass'); }}
                  >
                    <i className="ti ti-printer me-1" />Pass
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <VisitorModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onRegister={(draft) => registerVisitor(draft, false)}
        onCheckIn={checkIn}
        onCheckOut={checkOut}
        onVerify={verify}
        onPrintPass={(format, copies) => {
          setActiveModal(null);
          push(`${copies} × ${modalRow?.pass ?? 'pass'} printed as ${format}`);
        }}
        onToast={push}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="vlToasts" />
    </>
  );
};

export default VisitorLog;
