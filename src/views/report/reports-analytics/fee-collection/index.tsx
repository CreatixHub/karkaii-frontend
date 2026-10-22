import { useCallback, useMemo, useState } from 'react';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink,
  ReportPageHeader,
  ReportWorkspaceShell,
  useWorkspace,
} from '@components/workspace';
import type {
  ColumnDef,
  FilterField,
  QuickFilter,
  ReportBulkAction,
  ReportScope,
  SavedView,
  SortOption,
  SummaryStripItem,
  WorkspaceMenu,
} from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import FeeModals from './modals/FeeModals';
import type { FeeModalId } from './modals/FeeModals';
import type { CollectionStatus, FeeRecord } from './data/feeCollection.data';
import {
  ACADEMIC_YEAR,
  academicYearOptions,
  annualFeeOf,
  averageDelayLabelOf,
  balanceOf,
  categoryOptions,
  chargeableDaysOf,
  classLabelOf,
  classOptions,
  collectionRateOf,
  concessionOf,
  concessionOptions,
  concessionTypeOf,
  counterOf,
  counterOptions,
  daysOverdueOf,
  dueNoteOf,
  feeRecords as seededRecords,
  fineChargedOf,
  fineOf,
  fineOptions,
  fineStateOf,
  fineWaivedOf,
  futureInstallmentsOf,
  graceLabelOf,
  installmentOptions,
  isOverdueOf,
  LATE_FEE_PER_DAY,
  methodOptions,
  overdueBandOf,
  overdueOptions,
  paidToDateOf,
  paymentRatingOf,
  ratingTint,
  REGISTER_TOTAL,
  REPORT_RANGE,
  rupees,
  scholarshipOf,
  scholarshipOptions,
  scholarshipTypeOf,
  searchIndexOf,
  sectionOptions,
  shortRupees,
  statusOf,
  statusOptions,
  statusPill,
  totalPayableOf,
} from './data/feeCollection.data';

const routes = all_routes;

/** Band 1's scope group, which narrows the ledger by what the report is about. */
const scopes: ReportScope[] = [
  { id: 'all', label: 'Collection', icon: 'ti ti-cash' },
  { id: 'outstanding', label: 'Outstanding', icon: 'ti ti-receipt-off' },
  { id: 'defaulters', label: 'Defaulters', icon: 'ti ti-alert-triangle' },
  { id: 'concessions', label: 'Concessions', icon: 'ti ti-discount' },
  { id: 'scholarships', label: 'Scholarships', icon: 'ti ti-award' },
];

const matchesScope = (row: FeeRecord, scope: string) => {
  switch (scope) {
    case 'outstanding':
      return balanceOf(row) > 0;
    case 'defaulters':
      return isOverdueOf(row);
    case 'concessions':
      return concessionOf(row) > 0;
    case 'scholarships':
      return scholarshipOf(row) > 0;
    default:
      return true;
  }
};

const filterFields: FilterField[] = [
  {
    id: 'date-range',
    label: 'Date Range',
    kind: 'daterange',
    surface: 'band',
    span: 'col-xxl-3 col-lg-4 col-md-6',
    chipLabel: 'Range',
    rangeFormat: 'd M Y',
    initialValue: REPORT_RANGE,
  },
  {
    id: 'academic-year',
    label: 'Academic Year',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Year',
    options: academicYearOptions,
    defaultValue: '',
    initialValue: ACADEMIC_YEAR,
  },
  {
    id: 'fee-category',
    label: 'Fee Category',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Category',
    allLabel: 'All Categories',
    options: categoryOptions,
  },
  {
    id: 'payment-method',
    label: 'Payment Method',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Method',
    allLabel: 'All Methods',
    options: methodOptions,
  },
  { id: 'class', label: 'Class', kind: 'select', surface: 'band', chipLabel: 'Class', allLabel: 'All Classes', options: classOptions },
  { id: 'section', label: 'Section', kind: 'select', surface: 'band', chipLabel: 'Section', allLabel: 'All Sections', options: sectionOptions },
  {
    id: 'collection-status',
    label: 'Collection Status',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Status',
    allLabel: 'All Status',
    options: statusOptions,
  },
  {
    id: 'installment',
    label: 'Installment',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Installment',
    allLabel: 'All Installments',
    options: installmentOptions,
  },
  {
    id: 'collected-by',
    label: 'Collected By',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Counter',
    allLabel: 'All Counters',
    options: counterOptions,
  },

  { id: 'balance-from', label: 'Balance From', kind: 'number', chipLabel: 'Balance ≥', defaultValue: '0' },
  { id: 'balance-to', label: 'Balance To', kind: 'number', chipLabel: 'Balance ≤', defaultValue: '200000' },
  { id: 'days-overdue', label: 'Days Overdue', kind: 'select', chipLabel: 'Overdue', allLabel: 'Any', options: overdueOptions },
  { id: 'concession', label: 'Concession Type', kind: 'select', chipLabel: 'Concession', options: concessionOptions },
  { id: 'scholarship', label: 'Scholarship', kind: 'select', chipLabel: 'Scholarship', options: scholarshipOptions },
  { id: 'fine', label: 'Fine Applied', kind: 'select', chipLabel: 'Fine', options: fineOptions },
  {
    id: 'balance-only',
    label: 'Balance',
    kind: 'toggle',
    chipLabel: 'Balance',
    switchLabel: 'Only records carrying an outstanding balance',
  },
];

const sortOptions: SortOption[] = [
  { id: 'due', label: 'Due date', icon: 'ti ti-calendar-event' },
  { id: 'student', label: 'Student (A–Z)', icon: 'ti ti-abc' },
  { id: 'balance', label: 'Balance', icon: 'ti ti-receipt-off' },
  { id: 'paid', label: 'Paid amount', icon: 'ti ti-cash' },
  { id: 'receipt', label: 'Receipt no.', icon: 'ti ti-hash' },
  { id: 'admission', label: 'Admission no.', icon: 'ti ti-id' },
];

const rails: { id: string; label: string; icon: string }[] = [
  { id: 'Paid', label: 'Paid', icon: 'ti ti-circle-check' },
  { id: 'Partially Paid', label: 'Partial', icon: 'ti ti-progress' },
  { id: 'Pending', label: 'Pending', icon: 'ti ti-clock' },
  { id: 'Overdue', label: 'Overdue', icon: 'ti ti-alert-triangle' },
];

function matchesRail(row: FeeRecord, rail: string | null): boolean {
  if (!rail) return true;
  if (rail === 'concession') return concessionOf(row) > 0;
  if (rail === 'scholarship') return scholarshipOf(row) > 0;
  return statusOf(row) === (rail as CollectionStatus);
}

const FeeCollectionReport = () => {
  const [rows, setRows] = useState<FeeRecord[]>(seededRecords);
  const [scope, setScope] = useState('all');
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<FeeModalId | null>(null);
  const [modalRow, setModalRow] = useState<FeeRecord | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: FeeRecord | null, modal: FeeModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const openPanel = useCallback((row: FeeRecord | null) => {
    setModalRow(row);
    setPanelOpen(true);
  }, []);

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<FeeRecord>[]>(
    () => [
      {
        id: 'student',
        label: 'Student',
        sortable: true,
        toggleable: false,
        render: (row) => (
          <div className="dt-user">
            <ActionLink className="dt-avatar" ariaLabel={`View ${row.student}`} onClick={() => openModal(row, 'ledger')}>
              <ImageWithBasePath src={row.image} alt={row.student} />
            </ActionLink>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'ledger')}>
                {row.student}
              </ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">
                <span>{row.roll}</span>
                <span className="dt-dot">•</span>
                <span>{row.guardian}</span>
              </div>
              {row.flags.length > 0 ? (
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {row.flags.map((flag) => (
                    <span
                      className={`badge badge-soft-${flag === 'Defaulter' ? 'danger' : flag === 'Scholarship' ? 'success' : 'secondary'}`}
                      key={flag}
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ),
      },
      {
        id: 'admission',
        label: 'Admission No.',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.admission}</span>
            <span className="fs-12 text-muted">{row.admitted}</span>
          </>
        ),
      },
      {
        id: 'class',
        label: 'Class',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.className}</span>
            <span className="fs-12 text-muted">Section {row.section}</span>
          </>
        ),
      },
      {
        id: 'category',
        label: 'Fee Category',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.feeCategory}</span>
            <span className="fs-12 text-muted">{row.feeNote}</span>
          </>
        ),
      },
      {
        id: 'total',
        label: 'Total Fee',
        sortable: true,
        align: 'end',
        render: (row) => <span className="fs-13 fw-medium">{rupees(row.billed)}</span>,
      },
      {
        id: 'paid',
        label: 'Paid Amount',
        sortable: true,
        align: 'end',
        render: (row) => (
          <span className={`fs-13 fw-medium ${row.paid > 0 ? 'text-success' : 'text-muted'}`}>
            {rupees(row.paid)}
          </span>
        ),
      },
      {
        id: 'balance',
        label: 'Balance',
        sortable: true,
        align: 'end',
        render: (row) => (
          <span className={`fs-13 fw-semibold ${balanceOf(row) > 0 ? 'text-danger' : ''}`}>
            {rupees(balanceOf(row))}
          </span>
        ),
      },
      {
        id: 'due',
        label: 'Due Date',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.extensionTo ?? row.dueDate}</span>
            <span className={`fs-12 ${isOverdueOf(row) ? 'text-danger' : 'text-muted'}`}>{dueNoteOf(row)}</span>
          </>
        ),
      },
      {
        id: 'method',
        label: 'Payment Method',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.method}</span>
            <span className="fs-12 text-muted">{row.methodNote}</span>
          </>
        ),
      },
      {
        id: 'status',
        label: 'Collection Status',
        render: (row) => (
          <>
            <span className={`dt-pill ${statusPill[statusOf(row)]}`}>
              <span className="dt-pill-dot" />
              {statusOf(row)}
            </span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{row.statusNote}</span>
          </>
        ),
      },
      {
        id: 'receipt',
        label: 'Receipt No.',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) =>
          row.receipt ? (
            <>
              <ActionLink className="dt-name fs-13" onClick={() => openModal(row, 'receipt')}>
                {row.receipt}
              </ActionLink>
              <span className="fs-12 text-muted d-block">{row.receiptDate}</span>
            </>
          ) : (
            <>
              <span className="fs-13 fw-medium d-block">—</span>
              <span className="fs-12 text-muted">No receipt yet</span>
            </>
          ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<FeeRecord>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['fee-category'] && !row.feeCategory.includes(filters['fee-category'].split(' ')[0]))
        return false;
      if (filters['payment-method'] && !filters['payment-method'].includes(row.method)) return false;
      if (filters.class && row.className !== filters.class) return false;
      if (filters.section && row.section !== filters.section) return false;
      if (filters['collection-status'] && statusOf(row) !== filters['collection-status']) return false;
      if (filters.installment && !row.feeNote.includes(filters.installment.split(' · ')[0])) return false;
      if (filters['collected-by'] && counterOf(row) !== filters['collected-by']) return false;
      if (filters['days-overdue'] && overdueBandOf(row) !== filters['days-overdue']) return false;
      if (filters.concession && concessionTypeOf(row) !== filters.concession) return false;
      if (filters.scholarship && scholarshipTypeOf(row) !== filters.scholarship) return false;
      if (filters.fine && fineStateOf(row) !== filters.fine) return false;
      if (filters['balance-only'] && balanceOf(row) === 0) return false;

      const balance = balanceOf(row);
      if (balance < Number(filters['balance-from'] || 0)) return false;
      if (balance > Number(filters['balance-to'] || 10000000)) return false;

      return matchesScope(row, scope);
    },
    quickMatch: (row, quick) => matchesRail(row, quick),
    viewMatch: (row, view) => matchesRail(row, view === 'all' ? null : view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'student':
          return a.student.localeCompare(b.student);
        case 'balance':
          return balanceOf(b) - balanceOf(a) || a.student.localeCompare(b.student);
        case 'paid':
          return b.paid - a.paid || a.student.localeCompare(b.student);
        case 'receipt':
          return (a.receipt ?? 'zz').localeCompare(b.receipt ?? 'zz');
        case 'admission':
          return a.admission.localeCompare(b.admission);
        case 'due':
        default:
          return b.daysFromDue - a.daysFromDue || a.student.localeCompare(b.student);
      }
    },
    defaultSort: 'due',
    pageSize: 8,
  });

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Records', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'Paid', label: 'Fully Paid', icon: 'ti ti-circle-check', count: rows.filter((r) => matchesRail(r, 'Paid')).length },
      {
        id: 'Partially Paid',
        label: 'Partially Paid',
        icon: 'ti ti-progress',
        count: rows.filter((r) => matchesRail(r, 'Partially Paid')).length,
      },
      { id: 'Overdue', label: 'Overdue', icon: 'ti ti-alert-triangle', count: rows.filter((r) => matchesRail(r, 'Overdue')).length },
      {
        id: 'concession',
        label: 'With Concession',
        icon: 'ti ti-discount',
        count: rows.filter((r) => matchesRail(r, 'concession')).length,
      },
      {
        id: 'scholarship',
        label: 'Scholarship Holders',
        icon: 'ti ti-award',
        count: rows.filter((r) => matchesRail(r, 'scholarship')).length,
      },
    ],
    [rows],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () =>
      [
        { id: 'all', label: 'All', icon: 'ti ti-layout-list' },
        ...rails,
        { id: 'concession', label: 'Concession', icon: 'ti ti-discount' },
        { id: 'scholarship', label: 'Scholarship', icon: 'ti ti-award' },
      ].map((rail) => ({
        ...rail,
        count: rows.filter((row) => matchesRail(row, rail.id === 'all' ? null : rail.id)).length,
      })),
    [rows],
  );

  /* ------------------------------ Summary strip ------------------------------ */

  const summary = useMemo<SummaryStripItem[]>(() => {
    const shown = workspace.visible;
    const billed = shown.reduce((total, row) => total + row.billed, 0);
    const collected = shown.reduce((total, row) => total + row.paid + (row.waived ?? 0), 0);
    const outstanding = shown.reduce((total, row) => total + balanceOf(row), 0);
    const rate = collectionRateOf(shown);
    return [
      { id: 'billed', accent: 'primary', icon: 'ti ti-report-money', value: shortRupees(billed), label: 'Total Fees' },
      { id: 'collected', accent: 'success', icon: 'ti ti-cash', value: shortRupees(collected), label: 'Amount Collected' },
      {
        id: 'outstanding',
        accent: 'danger',
        icon: 'ti ti-receipt-off',
        value: shortRupees(outstanding),
        label: 'Outstanding Balance',
      },
      {
        id: 'rate',
        accent: 'teal',
        icon: 'ti ti-percentage',
        value: rate === null ? '—' : `${rate}%`,
        label: 'Collection Rate',
      },
      {
        id: 'pending',
        accent: 'warning',
        icon: 'ti ti-clock',
        value: `${shown.filter((row) => balanceOf(row) > 0).length}`,
        label: 'Pending Payments',
      },
      {
        id: 'concession',
        accent: 'info',
        icon: 'ti ti-discount',
        value: shortRupees(shown.reduce((total, row) => total + concessionOf(row), 0)),
        label: 'Concessions',
      },
      {
        id: 'scholarship',
        accent: 'purple',
        icon: 'ti ti-award',
        value: shortRupees(shown.reduce((total, row) => total + scholarshipOf(row), 0)),
        label: 'Scholarships',
      },
      {
        id: 'overdue',
        accent: 'slate',
        icon: 'ti ti-alert-triangle',
        value: `${shown.filter(isOverdueOf).length}`,
        label: 'Overdue Accounts',
      },
    ];
  }, [workspace.visible]);

  /* -------------------------------- Mutations -------------------------------- */

  const sendReminder = useCallback((id: string) => {
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              statusNote: `${
                Number(row.statusNote.match(/^(\d+)/)?.[1] ?? 0) + 1 || 3
              } reminders sent`,
              audit: [{ title: 'Reminder sent', detail: '31 Jul 2026 · SMS and email' }, ...row.audit],
            }
          : row,
      ),
    );
  }, []);

  const bulkActions = useMemo<ReportBulkAction[]>(
    () => [
      { id: 'pdf', label: 'Bulk Export PDF', icon: 'ti ti-file-type-pdf', onClick: () => openModal(null, 'export') },
      { id: 'xls', label: 'Bulk Export Excel', icon: 'ti ti-file-type-xls', onClick: () => openModal(null, 'export') },
      { id: 'receipts', label: 'Print Receipts', icon: 'ti ti-receipt', onClick: () => openModal(null, 'print') },
      { id: 'share', label: 'Share', icon: 'ti ti-share', onClick: () => openModal(null, 'share') },
      {
        id: 'reminder',
        label: 'Send Reminder',
        icon: 'ti ti-bell',
        onClick: () => openModal(null, 'outstanding'),
      },
    ],
    [openModal],
  );

  /* --------------------------------- Detail ---------------------------------- */

  const renderDetail = (row: FeeRecord) => (
    <div className="row g-4">
      <div className="col-xl-3 col-md-6">
        <h3 className="fs-14 mb-3 fw-medium">
          <i className="ti ti-user text-primary me-1" />
          Student Fee Profile
        </h3>
        <ul className="list-unstyled fs-12 mb-3">
          {[
            { label: 'Admission No.', value: row.admission },
            { label: 'Class / Section', value: `${classLabelOf(row)} · ${row.roll}` },
            { label: 'Fee Plan', value: row.plan },
            { label: 'Annual Fee', value: rupees(annualFeeOf(row)) },
            {
              label: scholarshipOf(row) > 0 ? 'Guardian Share' : 'Paid To Date',
              value:
                scholarshipOf(row) > 0
                  ? rupees(annualFeeOf(row) - scholarshipOf(row))
                  : rupees(paidToDateOf(row)),
            },
            { label: 'Guardian', value: row.guardian },
          ].map((item) => (
            <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
              <span className="text-muted">{item.label}</span>
              <span className="fw-medium">{item.value}</span>
            </li>
          ))}
        </ul>

        <h6 className="details-heading">
          <i className="ti ti-history" />
          Complete Payment History
        </h6>
        {row.payments.map((payment) => (
          <div className="border rounded p-2 mb-2" key={`${payment.receipt}-${payment.date}`}>
            <h6 className="fs-13 mb-0 fw-medium">
              {rupees(payment.amount)} · {payment.method}
            </h6>
            <span className="fs-12 text-muted">
              {payment.date}
              {payment.receipt ? ` · ${payment.receipt}` : ''}
              {payment.note ? ` · ${payment.note}` : ''}
            </span>
          </div>
        ))}
        <ul className="list-unstyled fs-12 mb-0">
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Payments Made</span>
            <span className="fw-medium">
              {row.payments.length} of {row.installments}
            </span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Last Payment</span>
            <span className="fw-medium">{row.payments[0]?.date ?? '—'}</span>
          </li>
        </ul>
      </div>

      <div className="col-xl-3 col-md-6">
        <h6 className="details-heading">
          <i className="ti ti-calendar-repeat" />
          Installment Schedule
        </h6>
        <ul className="list-unstyled fs-12 mb-3">
          {row.schedule.map((item) => (
            <li className="d-flex align-items-center justify-content-between py-1" key={`${item.label}-${item.due}`}>
              <span className="text-muted">
                {item.label} · {item.due}
              </span>
              <span className="fw-medium">
                {rupees(item.amount)}
                <span className="badge badge-soft-secondary ms-2">{item.state}</span>
              </span>
            </li>
          ))}
          <li className="d-flex align-items-center justify-content-between py-1 border-top mt-1 pt-2">
            <span className="text-muted">Next Due</span>
            <span className="fw-medium">{row.nextDue}</span>
          </li>
        </ul>

        <h6 className="details-heading">
          <i className="ti ti-receipt-off" />
          Outstanding Breakdown
        </h6>
        {balanceOf(row) === 0 ? (
          <span className="badge badge-soft-success mb-2">Nothing outstanding</span>
        ) : isOverdueOf(row) ? (
          <span className="badge badge-soft-danger mb-2">{daysOverdueOf(row)} days overdue</span>
        ) : (
          <span className="badge badge-soft-info mb-2">{dueNoteOf(row)}</span>
        )}
        <ul className="list-unstyled fs-12 mb-0">
          {row.breakdown.map((line) => (
            <li className="d-flex align-items-center justify-content-between py-1" key={line.label}>
              <span className="text-muted">{line.label}</span>
              <span className="fw-medium">
                {line.amount === null ? line.note : rupees(line.amount)}
                {line.amount !== null && line.note ? <span className="text-muted ms-1">· {line.note}</span> : null}
              </span>
            </li>
          ))}
          {fineOf(row) > 0 ? (
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Late Fine</span>
              <span className="fw-medium">{rupees(fineOf(row))}</span>
            </li>
          ) : null}
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Total Payable</span>
            <span className="fw-medium">{rupees(totalPayableOf(row))}</span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Future Installments</span>
            <span className="fw-medium">{rupees(futureInstallmentsOf(row))}</span>
          </li>
        </ul>
      </div>

      <div className="col-xl-3 col-md-6">
        <h6 className="details-heading">
          <i className="ti ti-discount" />
          Concessions &amp; Scholarships
        </h6>
        {row.concessionLabel ? (
          <div className="border rounded p-2 mb-2">
            <h6 className="fs-13 mb-0 fw-medium">{row.concessionLabel}</h6>
            <span className="fs-12 text-muted">
              {row.concessionNote} · {rupees(concessionOf(row))} a year
            </span>
          </div>
        ) : null}
        {row.scholarshipLabel ? (
          <div className="border rounded p-2 mb-2">
            <h6 className="fs-13 mb-0 fw-medium">{row.scholarshipLabel}</h6>
            <span className="fs-12 text-muted">
              {row.scholarshipNote} · {rupees(scholarshipOf(row))} a year
            </span>
          </div>
        ) : null}
        {!row.concessionLabel && !row.scholarshipLabel ? (
          <span className="badge badge-soft-secondary mb-2">No concession applied</span>
        ) : null}
        <ul className="list-unstyled fs-12 mb-3">
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Concession Total</span>
            <span className="fw-medium">{rupees(concessionOf(row))}</span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Scholarship</span>
            <span className="fw-medium">
              {scholarshipOf(row) === 0 ? 'None' : rupees(scholarshipOf(row))}
            </span>
          </li>
          {row.approvedBy ? (
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Approved By</span>
              <span className="fw-medium">{row.approvedBy}</span>
            </li>
          ) : null}
        </ul>

        <h6 className="details-heading">
          <i className="ti ti-alert-circle" />
          Fine &amp; Penalty Details
        </h6>
        <ul className="list-unstyled fs-12 mb-0">
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Late Fee Rate</span>
            <span className="fw-medium">{rupees(LATE_FEE_PER_DAY)} a day</span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Grace Period</span>
            <span className="fw-medium">{graceLabelOf(row)}</span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Chargeable Days</span>
            <span className="fw-medium">{chargeableDaysOf(row)}</span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Fine Charged</span>
            <span className="fw-medium">{rupees(fineChargedOf(row))}</span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Fine Waived</span>
            <span className="fw-medium">{rupees(fineWaivedOf(row))}</span>
          </li>
        </ul>
      </div>

      <div className="col-xl-3 col-md-6">
        <h6 className="details-heading">
          <i className="ti ti-receipt" />
          Receipt History
        </h6>
        {row.receipts.map((receipt) => (
          <div className="border rounded p-2 mb-2" key={receipt.title}>
            <h6 className="fs-13 mb-0 fw-medium">{receipt.title}</h6>
            <span className="fs-12 text-muted">{receipt.detail}</span>
          </div>
        ))}

        <h6 className="details-heading">
          <i className="ti ti-timeline" />
          Payment Timeline
        </h6>
        <ul className="list-unstyled fs-12 mb-3">
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Average Delay</span>
            <span className="fw-medium">{averageDelayLabelOf(row)}</span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Preferred Method</span>
            <span className="fw-medium">{row.preferredMethod}</span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Payment Rating</span>
            <span className={`badge badge-soft-${ratingTint[paymentRatingOf(row)]}`}>
              {paymentRatingOf(row)}
            </span>
          </li>
        </ul>

        <h6 className="details-heading">
          <i className="ti ti-message-2" />
          Finance Notes
        </h6>
        {row.notes.map((note) => (
          <div className="border rounded p-2 mb-2" key={`${note.author}-${note.date}`}>
            <h6 className="fs-13 mb-0 fw-medium">{note.author}</h6>
            <span className="fs-12 text-muted d-block">
              {note.role} · {note.date}
            </span>
            <p className="fs-12 text-muted mb-0 mt-1">{note.body}</p>
          </div>
        ))}
        <div className="d-flex flex-wrap gap-1 mb-3">
          {row.noteTags.map((tag) => (
            <span className="badge badge-soft-secondary" key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <h6 className="details-heading">
          <i className="ti ti-history" />
          Audit History
        </h6>
        {row.audit.map((entry) => (
          <div className="border rounded p-2 mb-2" key={`${entry.title}-${entry.detail}`}>
            <h6 className="fs-13 mb-0 fw-medium">{entry.title}</h6>
            <span className="fs-12 text-muted">{entry.detail}</span>
          </div>
        ))}

        <div className="d-flex gap-2 mt-3">
          {balanceOf(row) > 0 ? (
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-sm flex-fill"
              onClick={() => openModal(row, 'outstanding')}
            >
              <i className="ti ti-receipt-off me-1" />
              Outstanding
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-sm flex-fill"
              onClick={() => openModal(row, 'receipt')}
            >
              <i className="ti ti-receipt me-1" />
              View Receipt
            </button>
          )}
          <button type="button" className="btn btn-primary btn-sm flex-fill" onClick={() => openModal(row, 'ledger')}>
            <i className="ti ti-book me-1" />
            Fee Ledger
          </button>
        </div>
      </div>
    </div>
  );

  const rowActions = (row: FeeRecord) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="Fee Ledger" ariaLabel="Fee Ledger" onClick={() => openModal(row, 'ledger')}>
        <i className="ti ti-book" />
      </ActionLink>
      <ActionLink className="dt-ib" title="View Receipt" ariaLabel="View Receipt" onClick={() => openModal(row, 'receipt')}>
        <i className="ti ti-receipt" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Payment Details" ariaLabel="Payment Details" onClick={() => openModal(row, 'payment')}>
        <i className="ti ti-cash" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Outstanding" ariaLabel="Outstanding" onClick={() => openModal(row, 'outstanding')}>
        <i className="ti ti-receipt-off" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Print" ariaLabel="Print" onClick={() => openModal(row, 'print')}>
        <i className="ti ti-printer" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Share" ariaLabel="Share" onClick={() => openModal(row, 'share')}>
        <i className="ti ti-share" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Revenue Analysis" ariaLabel="Revenue Analysis" onClick={() => openPanel(row)}>
        <i className="ti ti-chart-histogram" />
      </ActionLink>
    </div>
  );

  const filterSummary = [
    workspace.filters['date-range'] || REPORT_RANGE,
    workspace.filters['academic-year'] || ACADEMIC_YEAR,
    workspace.filters.class || 'all classes',
    workspace.filters['fee-category'] || 'all fee categories',
  ].join(' · ');

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <ReportPageHeader
            title="Fee Collection Reports"
            section="Reports"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => (rows[0] ? openModal(rows[0], 'ledger') : undefined)}
                  >
                    <i className="ti ti-book me-2" />
                    Fee Ledger
                  </ActionLink>
                </div>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'compare')}
                  >
                    <i className="ti ti-arrows-diff me-2" />
                    Compare Reports
                  </ActionLink>
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openPanel(null)}
                  >
                    <i className="ti ti-chart-histogram me-2" />
                    Revenue Analysis
                  </ActionLink>
                </div>
              </>
            }
          />

          <ReportWorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={rows.length}
            workspaceId="feeCollection"
            scopeLabel="Report on:"
            scopeAriaLabel="Report scope"
            scopes={scopes}
            scope={scope}
            onScope={setScope}
            scopeCount={`${REGISTER_TOTAL.toLocaleString()} records`}
            bandActions={
              <>
                <ActionLink
                  className="btn btn-sm btn-primary d-inline-flex align-items-center"
                  onClick={() => openModal(null, 'generate')}
                >
                  <i className="ti ti-player-play me-1" />
                  Generate Report
                </ActionLink>
                <ActionLink
                  className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                  onClick={() => openModal(null, 'template')}
                >
                  <i className="ti ti-bookmark-plus me-1" />
                  Save Template
                </ActionLink>
                <ActionLink className="btn btn-sm btn-outline-light bg-white btn-icon" title="Export PDF" ariaLabel="Export PDF" onClick={() => openModal(null, 'export')}>
                  <i className="ti ti-file-type-pdf" />
                </ActionLink>
                <ActionLink className="btn btn-sm btn-outline-light bg-white btn-icon" title="Export Excel" ariaLabel="Export Excel" onClick={() => openModal(null, 'export')}>
                  <i className="ti ti-file-type-xls" />
                </ActionLink>
                <ActionLink className="btn btn-sm btn-outline-light bg-white btn-icon" title="Print" ariaLabel="Print" onClick={() => openModal(null, 'print')}>
                  <i className="ti ti-printer" />
                </ActionLink>
                <ActionLink className="btn btn-sm btn-outline-light bg-white btn-icon" title="Share" ariaLabel="Share" onClick={() => openModal(null, 'share')}>
                  <i className="ti ti-share" />
                </ActionLink>
              </>
            }
            searchLabel="Search records"
            searchPlaceholder="Student, admission no., receipt or guardian"
            filterSummary={filterSummary}
            filterFields={filterFields}
            savedViews={savedViews}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="records"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            summary={summary}
            bulkActions={bulkActions}
            selectionNoun="record"
            caption="Fee collection report with total fee, paid amount, balance, due date, payment method and collection status for each student"
            selectAllLabel="Select all records"
            renderDetail={renderDetail}
            renderActions={rowActions}
            footerInfoSuffix={`${REPORT_RANGE.replace(' - ', ' – ')} · academic year ${ACADEMIC_YEAR}`}
            emptyIcon="ti ti-receipt-off"
            emptyTitle="No records match this report"
            emptyBody="Clear a filter, widen the balance range or switch the report scope to see more."
            onRefresh={() => {
              setRows(seededRecords);
              push('Ledger refreshed');
            }}
            onSaveView={() => openModal(null, 'template')}
            onToast={push}
            onResetExtra={() => setScope('all')}
          />
        </div>
      </div>
      {/* /Page Wrapper */}

      <FeeModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        row={modalRow}
        rows={workspace.visible}
        selected={rows.filter((row) => workspace.selected.includes(row.id))}
        registerTotal={REGISTER_TOTAL}
        panelOpen={panelOpen}
        onClosePanel={() => setPanelOpen(false)}
        onToast={push}
        onSendReminder={sendReminder}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="feeCollectionToasts" />
    </>
  );
};

export default FeeCollectionReport;
