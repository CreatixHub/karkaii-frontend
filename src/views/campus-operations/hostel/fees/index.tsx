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
import FeeModals from './modals/FeeModals';
import type { FeeModalId, PlanDraft } from './modals/FeeModals';
import type { HostelFee, PaymentStatus } from './data/hostelFees.data';
import {
  DASH, SUMMARY_TOTALS, academicYearOptions, chargePairsOf, concessionOptions, dateKey,
  dueAmountOptions, dueBandOf, dueLabel, dueTint, feePlanOptions, hostelFees as initialRows,
  hostelGender, hostelKeyOf, hostelOptions, hostelTintOf, money, openFinesOf, paymentTermOptions,
  planKeyOf, roomTypeOptions, roomTypeTint, searchIndexOf, statusBadge, statusOptions, statusPill,
  studentLineOf, studentPairsOf, termOf,
} from './data/hostelFees.data';

const routes = all_routes;

/** Ids and options are the template's own, verbatim from the filter panel. */
const filterFields: FilterField[] = [
  { id: 'hostel', label: 'Hostel', kind: 'select', chipLabel: 'Hostel', options: hostelOptions },
  { id: 'room-type', label: 'Room Type', kind: 'select', chipLabel: 'Type', options: roomTypeOptions },
  { id: 'fee-plan', label: 'Fee Plan', kind: 'select', chipLabel: 'Plan', options: feePlanOptions },
  { id: 'payment-status', label: 'Payment Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Year', options: academicYearOptions },
  { id: 'payment-term', label: 'Payment Term', kind: 'select', chipLabel: 'Term', options: paymentTermOptions },
  { id: 'due-amount', label: 'Due Amount', kind: 'select', chipLabel: 'Due', allLabel: 'Any', options: dueAmountOptions },
  { id: 'concession', label: 'Concession', kind: 'select', chipLabel: 'Concession', options: concessionOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Student name (A–Z)', icon: 'ti ti-abc' },
  { id: 'due', label: 'Due amount (high to low)', icon: 'ti ti-coin' },
  { id: 'duedate', label: 'Due date', icon: 'ti ti-calendar-event' },
  { id: 'plan', label: 'Fee plan', icon: 'ti ti-file-dollar' },
  { id: 'hostel', label: 'Hostel', icon: 'ti ti-building-fortress' },
];

const HostelFees = () => {
  const [rows, setRows] = useState<HostelFee[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<FeeModalId | null>(null);
  const [modalRow, setModalRow] = useState<HostelFee | null>(null);
  const [panelRow, setPanelRow] = useState<HostelFee | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: HostelFee | null, modal: FeeModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  /** Applies a change to the row a dialog was opened on. */
  const patchRow = useCallback(
    (change: (row: HostelFee) => HostelFee, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<HostelFee>[]>(
    () => [
      {
        id: 'student',
        label: 'Student',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="dt-avatar">
              <ImageWithBasePath src={row.avatar} alt={row.student} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.student}</ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">
                {row.classSection}<span className="dt-dot">•</span>Roll {row.roll}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'admission',
        label: 'Admission No.',
        cellClassName: 'fs-13',
        render: (row) => row.admission,
      },
      {
        id: 'hostel',
        label: 'Hostel',
        sortable: true,
        render: (row) =>
          row.hostel ? (
            <>
              <span className={`badge badge-soft-${hostelTintOf(row)}`}>{row.hostel}</span>
              <span className="d-block fs-12 text-muted mt-1">{hostelGender[row.hostel]}</span>
            </>
          ) : (
            <>
              <span className="d-block fs-13 text-muted">{DASH}</span>
              <span className="fs-12 text-muted">Not assigned</span>
            </>
          ),
      },
      {
        id: 'room',
        label: 'Room No.',
        sortable: true,
        render: (row) =>
          row.room
            ? <span className="badge badge-soft-secondary">{row.room}</span>
            : <span className="text-muted">{DASH}</span>,
      },
      {
        id: 'roomtype',
        label: 'Room Type',
        sortable: true,
        render: (row) => (
          <span className={`badge badge-soft-${roomTypeTint[row.roomType]}`}>{row.roomType}</span>
        ),
      },
      {
        id: 'plan',
        label: 'Fee Plan',
        sortable: true,
        render: (row) => (
          <ActionLink className="fs-13 fw-medium" onClick={() => openModal(row, 'edit-plan')}>
            {row.plan}
          </ActionLink>
        ),
      },
      {
        id: 'fee',
        label: 'Hostel Fee',
        sortable: true,
        cellClassName: 'fs-13 fw-medium',
        render: (row) => money(row.fee),
      },
      {
        id: 'due',
        label: 'Due Amount',
        sortable: true,
        render: (row) => (
          <span className={`fs-13 fw-semibold text-${dueTint(row)}`}>{dueLabel(row)}</span>
        ),
      },
      {
        id: 'duedate',
        label: 'Due Date',
        sortable: true,
        cellClassName: 'fs-13',
        render: (row) => (row.dueDate ? row.dueDate : <span className="text-muted">{DASH}</span>),
      },
      {
        id: 'status',
        label: 'Payment Status',
        render: (row) => (
          <span className={`dt-pill ${statusPill[row.status]}`}>
            <span className="dt-pill-dot" />{row.status}
          </span>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<HostelFee>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.hostel && hostelKeyOf(row) !== filters.hostel) return false;
      if (filters['room-type'] && row.roomType !== filters['room-type']) return false;
      if (filters['fee-plan'] && planKeyOf(row) !== filters['fee-plan']) return false;
      if (filters['payment-status'] && row.status !== filters['payment-status']) return false;
      if (filters['academic-year'] && row.academicYear !== filters['academic-year']) return false;
      if (filters['payment-term'] && termOf(row) !== filters['payment-term']) return false;
      if (filters['due-amount'] && dueBandOf(row) !== filters['due-amount']) return false;
      if (filters.concession && row.concession !== filters.concession) return false;
      return true;
    },
    /** The rail opens on All, which narrows nothing; Concession is not a status. */
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'Concession') return row.concession !== 'None';
      if (quick === 'Pending') return row.status === 'Pending' || row.status === 'Partially Paid';
      return row.status === quick;
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'Paid': return row.status === 'Paid';
        case 'Pending': return row.status === 'Pending' || row.status === 'Partially Paid';
        case 'Overdue': return row.status === 'Overdue';
        case 'Concession': return row.concession !== 'None';
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'due':
          return (b.due ?? -Infinity) - (a.due ?? -Infinity) || a.student.localeCompare(b.student);
        case 'duedate':
          return dateKey(a.dueDate) - dateKey(b.dueDate) || a.student.localeCompare(b.student);
        case 'plan':
          return a.plan.localeCompare(b.plan) || a.student.localeCompare(b.student);
        case 'hostel':
          return a.hostel.localeCompare(b.hostel) || a.student.localeCompare(b.student);
        // Not in the sort menu, but seven of the ten `<th>`s are sortable.
        case 'fee':
          return b.fee - a.fee || a.student.localeCompare(b.student);
        case 'room':
          return (a.room || 'zz').localeCompare(b.room || 'zz');
        case 'roomtype':
          return a.roomType.localeCompare(b.roomType) || a.student.localeCompare(b.student);
        case 'name':
        default:
          return a.student.localeCompare(b.student);
      }
    },
    defaultSort: 'name',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: HostelFee) => boolean) => rows.filter(test).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Hostel Fees', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'Paid', label: 'Paid in Full', icon: 'ti ti-circle-check', count: countBy((row) => row.status === 'Paid') },
      {
        id: 'Pending', label: 'Pending Payments', icon: 'ti ti-clock',
        count: countBy((row) => row.status === 'Pending' || row.status === 'Partially Paid'),
      },
      { id: 'Overdue', label: 'Overdue', icon: 'ti ti-alert-triangle', count: countBy((row) => row.status === 'Overdue') },
      {
        id: 'Concession', label: 'Concession Applied', icon: 'ti ti-discount',
        count: countBy((row) => row.concession !== 'None'),
      },
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'Paid', label: 'Paid', icon: 'ti ti-circle-check', count: countBy((row) => row.status === 'Paid') },
      {
        id: 'Pending', label: 'Pending', icon: 'ti ti-clock',
        count: countBy((row) => row.status === 'Pending' || row.status === 'Partially Paid'),
      },
      { id: 'Overdue', label: 'Overdue', icon: 'ti ti-alert-triangle', count: countBy((row) => row.status === 'Overdue') },
      { id: 'Concession', label: 'Concession', icon: 'ti ti-discount', count: countBy((row) => row.concession !== 'None') },
    ],
    [countBy, rows.length],
  );

  /**
   * The strip counts the whole register — 186 paid students against the eight
   * rows this page holds — so the template's figures stand, moved by whatever
   * this page settles.
   */
  const summary = useMemo<SummaryItem[]>(() => {
    const paidHere = countBy((row) => row.status === 'Paid');
    const pendingHere = countBy((row) => row.status === 'Pending' || row.status === 'Partially Paid');
    const overdueHere = countBy((row) => row.status === 'Overdue');
    return [
      {
        id: 'plans', tint: 'primary', icon: 'ti ti-file-dollar', label: 'Hostel Fee Plans',
        value: String(SUMMARY_TOTALS.plans), hint: `${SUMMARY_TOTALS.hostels} hostels covered`,
      },
      {
        id: 'paid', tint: 'success', icon: 'ti ti-circle-check', label: 'Paid Students',
        value: String(SUMMARY_TOTALS.paid - 1 + paidHere), hint: `${SUMMARY_TOTALS.paidShare}% of billed`,
      },
      {
        id: 'pending', tint: 'warning', icon: 'ti ti-clock', label: 'Pending Payments',
        value: String(SUMMARY_TOTALS.pending - 4 + pendingHere), hint: 'Term II due 05 Aug',
      },
      {
        id: 'overdue', tint: 'danger', icon: 'ti ti-alert-triangle', label: 'Overdue Payments',
        value: String(SUMMARY_TOTALS.overdue - 1 + overdueHere),
        hint: `${money(SUMMARY_TOTALS.outstanding)} outstanding`,
      },
      {
        id: 'collected', tint: 'info', icon: 'ti ti-report-money', label: 'Total Collection',
        value: money(SUMMARY_TOTALS.collected), hint: '2026 / 2027 to date',
      },
    ];
  }, [countBy]);

  /* -------------------------------- Mutations ------------------------------- */

  const toNumber = (value: string, fallback = 0): number => {
    const parsed = Number(value.replace(/[^0-9.-]/g, ''));
    return Number.isFinite(parsed) && value.trim() !== '' ? parsed : fallback;
  };

  /** A plan edit re-rates every record billed on that plan. */
  const updatePlan = useCallback(
    (draft: PlanDraft) => {
      if (!modalRow) return;
      const breakdown = {
        rent: toNumber(draft.rent),
        mess: toNumber(draft.mess),
        maintenance: toNumber(draft.maintenance),
        laundry: toNumber(draft.laundry),
      };
      const fee = breakdown.rent + breakdown.mess + breakdown.maintenance + breakdown.laundry;
      const name = draft.name.trim() || modalRow.plan;
      const target = modalRow.plan;
      setRows((current) =>
        current.map((row) =>
          row.plan === target
            ? {
              ...row,
              plan: name,
              breakdown,
              fee,
              deposit: toNumber(draft.deposit, row.deposit),
              paymentTerm: draft.term,
              academicYear: draft.academicYear,
            }
            : row,
        ),
      );
      setActiveModal(null);
      const affected = rows.filter((row) => row.plan === target).length;
      push(`${name} updated — ${affected} ${affected === 1 ? 'record' : 'records'} re-rated`);
    },
    [modalRow, push, rows],
  );

  const assignPlan = useCallback(
    (planChoice: string, term: string, concession: string, value: string, _due: string, payable: string) => {
      if (!planChoice) {
        push('Pick a fee plan to assign', 'warning');
        return;
      }
      const name = planChoice.split('·')[0].trim();
      const fee = toNumber(payable, modalRow?.fee ?? 0);
      patchRow(
        (row) => ({
          ...row,
          plan: name,
          fee,
          paymentTerm: term,
          concession,
          due: fee,
          status: 'Pending',
          dueDate: row.dueDate || '05 Aug 2026',
          discount:
            concession === 'None'
              ? `No concession applied. Full plan rate billed for ${row.academicYear}.`
              : `${concession} of ${toNumber(value)}% applied from the next instalment.`,
        }),
        `${name} assigned to ${modalRow?.student ?? 'the student'}`,
      );
    },
    [modalRow, patchRow, push],
  );

  /** A payment reduces what is due, and the status follows the balance. */
  const recordPayment = useCallback(
    (amount: string, term: string, method: string, date: string) => {
      const paid = toNumber(amount);
      if (paid <= 0) {
        push('Enter the amount collected', 'warning');
        return;
      }
      const [day, month, year] = date.split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const printed = months[Number(month) - 1] ? `${day} ${months[Number(month) - 1]} ${year}` : date;

      patchRow(
        (row) => {
          const outstanding = Math.max(0, (row.due ?? row.fee) - paid);
          const status: PaymentStatus = outstanding === 0 ? 'Paid' : 'Partially Paid';
          return {
            ...row,
            due: outstanding,
            status,
            payments: [
              ...row.payments.filter((entry) => !entry.title.startsWith(term)),
              { title: `${term} — ${money(paid)}`, meta: `${printed} · paid` },
            ],
            notes: `${row.notes} ${money(paid)} received by ${method.toLowerCase()} on ${printed}.`.trim(),
          };
        },
        `${money(paid)} recorded against ${modalRow?.invoice ?? 'the invoice'}`,
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
      push(`${workspace.visible.length} fee records exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: HostelFee) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View fee details" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink
        className="dt-ib success" ariaLabel="Record payment"
        onClick={() => openModal(row, 'record-payment')}
      >
        <i className="ti ti-cash" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Generate receipt" onClick={() => openModal(row, 'receipt')}>
        <i className="ti ti-receipt" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit fee plan" onClick={() => openModal(row, 'edit-plan')}>
        <i className="ti ti-edit" />
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

  const renderDetail = (row: HostelFee) => (
    <div className="row g-4">
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-user text-primary me-1" />Student Information</h6>
        {pairList(studentPairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3">
          <i className="ti ti-building-fortress text-info me-1" />Hostel &amp; Room Details
        </h6>
        {pairList(row.hostelPairs)}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-file-dollar text-success me-1" />Fee Breakdown</h6>
        {pairList(chargePairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-cash text-warning me-1" />Payment History</h6>
        {row.payments.length === 0 ? (
          <p className="fs-13 text-muted mb-0">{row.paymentsEmpty}</p>
        ) : (
          row.payments.map((entry) => (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={entry.title}>
              <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
                <i className="ti ti-cash" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
                <span className="fs-12 text-muted text-truncate d-block">{entry.meta}</span>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3">
          <i className="ti ti-discount text-purple me-1" />Discounts / Scholarship
        </h6>
        <p className="fs-13 text-muted mb-0">{row.discount}</p>
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-alert-triangle text-danger me-1" />Fine Details</h6>
        {row.fines.length === 0 ? (
          <p className="fs-13 text-muted mb-0">{row.finesEmpty}</p>
        ) : (
          row.fines.map((fine) => (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={fine.title}>
              <span className="avatar avatar-sm bg-danger-transparent text-danger rounded flex-shrink-0">
                <i className="ti ti-alert-triangle" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">{fine.title}</h6>
                <span className="fs-12 text-muted text-truncate d-block">{fine.meta}</span>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-note text-secondary me-1" />Internal Notes</h6>
        <p className="fs-13 text-muted mb-3">{row.notes}</p>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => openModal(row, 'view')}
          >
            <i className="ti ti-eye me-1" />View Fee Details
          </button>
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => setPanelRow(row)}
          >
            <i className="ti ti-file-dollar me-1" />Fee Panel
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
            title="Hostel Fees"
            section="Hostel"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <ExportMenu printLabel="Print Fee Register" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'add-plan')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Add Hostel Fee
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
            workspaceId="hfWorkspace"
            searchPlaceholder="Search student, invoice or fee plan…"
            searchLabel="Search hostel fees"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="fee records"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Fee records refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-file-off"
            emptyTitle="No fee records match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Fee Details Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Fee Details"
            labelledById="hf_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Fee Plan Details</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Fee Plan', value: panelRow.plan },
                    { label: 'Room Type', value: panelRow.roomType },
                    { label: 'Annual Fee', value: money(panelRow.fee) },
                    { label: 'Payment Term', value: panelRow.paymentTerm },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Student Information</h6>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar avatar-lg rounded flex-shrink-0">
                    <ImageWithBasePath src={panelRow.avatar} className="rounded" alt={panelRow.student} />
                  </span>
                  <div className="ms-2">
                    <h6 className="mb-0">{panelRow.student}</h6>
                    <span className="fs-12 text-muted">{studentLineOf(panelRow)}</span>
                  </div>
                  <span className={`${statusBadge[panelRow.status]} ms-auto`}>{panelRow.status}</span>
                </div>

                <h6 className="fs-14 mb-2">Hostel Information</h6>
                <div className="border rounded p-3 mb-3">{pairList(panelRow.hostelPairs)}</div>

                <h6 className="fs-14 mb-2">Payment Schedule</h6>
                {panelRow.payments.length === 0 ? (
                  <p className="fs-13 text-muted mb-3">{panelRow.paymentsEmpty}</p>
                ) : (
                  panelRow.payments.map((entry) => (
                    <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={entry.title}>
                      <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
                        <i className="ti ti-calendar-event" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <h6 className="fs-13 mb-0">{entry.title}</h6>
                        <span className="fs-12 text-muted">{entry.meta}</span>
                      </div>
                    </div>
                  ))
                )}

                <h6 className="fs-14 mb-2 mt-3">Outstanding Balance</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Hostel Fee Due', value: dueLabel(panelRow) },
                    { label: 'Open Fines', value: money(openFinesOf(panelRow)) },
                    { label: 'Security Deposit Held', value: money(panelRow.deposit) },
                    { label: 'Invoice', value: panelRow.invoice },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Audit Information</h6>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
                  <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                    <i className="ti ti-file-dollar" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0">Fee plan assigned</h6>
                    <span className="fs-12 text-muted">{panelRow.plan} · Accounts Office</span>
                  </div>
                </div>
                {panelRow.payments.map((entry) => (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`audit-${entry.title}`}>
                    <span className="avatar avatar-sm bg-success-transparent text-success rounded flex-shrink-0">
                      <i className="ti ti-cash" />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0">{entry.title}</h6>
                      <span className="fs-12 text-muted">{entry.meta}</span>
                    </div>
                  </div>
                ))}

                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'record-payment'); }}
                  >
                    <i className="ti ti-cash me-1" />Record Payment
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'receipt'); }}
                  >
                    <i className="ti ti-receipt me-1" />Receipt
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <FeeModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onCreatePlan={(draft) => {
          setActiveModal(null);
          push(`${draft.name.trim() || 'Fee plan'} created — assign it to bill a student`);
        }}
        onUpdatePlan={updatePlan}
        onAssignPlan={assignPlan}
        onRecordPayment={recordPayment}
        onGenerateReceipt={(format, sendTo) => {
          setActiveModal(null);
          push(`Receipt sent to ${sendTo} as ${format}`);
        }}
        onToast={push}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="hfToasts" />
    </>
  );
};

export default HostelFees;
