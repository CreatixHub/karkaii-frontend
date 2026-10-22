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
import InvoiceModals from './modals/InvoiceModals';
import type { InvoiceDraft, InvoiceModalId } from './modals/InvoiceModals';
import type { BillStatus, CustomerType, Invoice } from './data/invoices.data';
import {
  BILLING_PERIOD, DASH, SUMMARY_TOTALS, auditOf, balanceOf, billingPeriodOptions,
  breakdownPairsOf, customerTint, customerTypeOptions, dateKey, daysOverdueOf, discountBandOf,
  discountLabel, discountOptions, discountPairsOf, invoices as initialRows, lineLabelOf,
  lineSummaryOf, methodBandOf, methodIcon, money, netBandOf, netAmountOptions, netOf, paidOf,
  paymentMethodOptions, periodBandOf, receiptPairsOf, searchIndexOf, statusBadge, statusOptions,
  statusPill, summaryPairsOf, taxOf, taxPairsOf, taxableOf, totalOf,
} from './data/invoices.data';

const routes = all_routes;

/**
 * Ids and options are the template's own. Billing Period opens committed, which
 * is what puts the "Billing Period: July 2026" chip on the rail at load.
 */
const filterFields: FilterField[] = [
  { id: 'customer-type', label: 'Customer Type', kind: 'select', chipLabel: 'Customer', options: customerTypeOptions },
  {
    id: 'billing-period', label: 'Billing Period', kind: 'select', chipLabel: 'Billing Period',
    options: billingPeriodOptions, initialValue: BILLING_PERIOD,
  },
  { id: 'payment-status', label: 'Payment Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'payment-method', label: 'Payment Method', kind: 'select', chipLabel: 'Method', options: paymentMethodOptions },
  { id: 'from', label: 'From', kind: 'date', chipLabel: 'From', dateFormat: 'd M Y' },
  { id: 'to', label: 'To', kind: 'date', chipLabel: 'To', dateFormat: 'd M Y' },
  { id: 'discount-applied', label: 'Discount Applied', kind: 'select', chipLabel: 'Discount', options: discountOptions },
  { id: 'net-amount', label: 'Net Amount', kind: 'select', chipLabel: 'Net', allLabel: 'Any', options: netAmountOptions },
];

const sortOptions: SortOption[] = [
  { id: 'invoice', label: 'Invoice no.', icon: 'ti ti-hash' },
  { id: 'customer', label: 'Customer name (A–Z)', icon: 'ti ti-abc' },
  { id: 'net', label: 'Net amount (high to low)', icon: 'ti ti-coin' },
  { id: 'date', label: 'Billing date', icon: 'ti ti-calendar-event' },
  { id: 'overdue', label: 'Days overdue', icon: 'ti ti-alert-triangle' },
];

const CafeteriaBilling = () => {
  const [rows, setRows] = useState<Invoice[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<InvoiceModalId | null>(null);
  const [modalRow, setModalRow] = useState<Invoice | null>(null);
  const [panelRow, setPanelRow] = useState<Invoice | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Invoice | null, modal: InvoiceModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  /** Applies a change to the row a dialog was opened on. */
  const patchRow = useCallback(
    (change: (row: Invoice) => Invoice, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Invoice>[]>(
    () => [
      {
        id: 'invoice',
        label: 'Invoice No.',
        sortable: true,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>{row.id}</ActionLink>
        ),
      },
      {
        id: 'customer',
        label: 'Customer',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="dt-avatar">
              <ImageWithBasePath src={row.avatar} alt={row.customer} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.customer}</ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">{row.customerLine}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'customer-type',
        label: 'Customer Type',
        render: (row) => (
          <span className={`badge badge-soft-${customerTint[row.customerType]}`}>{row.customerType}</span>
        ),
      },
      {
        id: 'date',
        label: 'Billing Date',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.billingDate}</span>
            <span className="fs-12 text-muted text-nowrap">{row.period}</span>
          </>
        ),
      },
      {
        id: 'total',
        label: 'Total Amount',
        sortable: true,
        cellClassName: 'fs-13 text-nowrap',
        render: (row) => money(totalOf(row)),
      },
      {
        id: 'discount',
        label: 'Discount',
        render: (row) => (
          <span className={`fs-13 text-nowrap ${row.discount > 0 ? 'text-success' : 'text-muted'}`}>
            {discountLabel(row)}
          </span>
        ),
      },
      {
        id: 'tax',
        label: 'Tax',
        cellClassName: 'fs-13 text-nowrap',
        render: (row) => money(taxOf(row)),
      },
      {
        id: 'net',
        label: 'Net Amount',
        sortable: true,
        cellClassName: 'fs-13 fw-semibold text-nowrap',
        render: (row) => money(netOf(row)),
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
      {
        id: 'method',
        label: 'Payment Method',
        render: (row) => (
          <span className="fs-13 text-nowrap">
            <i className={`${methodIcon(row.method)} text-muted me-1`} />{row.method}
          </span>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Invoice>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['customer-type'] && row.customerType !== filters['customer-type']) return false;
      if (filters['billing-period'] && filters['billing-period'] !== 'Custom range'
        && periodBandOf(row) !== filters['billing-period']) return false;
      if (filters['payment-status'] && row.status !== filters['payment-status']) return false;
      if (filters['payment-method'] && methodBandOf(row) !== filters['payment-method']) return false;
      if (filters.from && dateKey(row.billingDate) < dateKey(filters.from)) return false;
      if (filters.to && dateKey(row.billingDate) > dateKey(filters.to)) return false;
      if (filters['discount-applied'] && discountBandOf(row) !== filters['discount-applied']) return false;
      if (filters['net-amount'] && netBandOf(row) !== filters['net-amount']) return false;
      return true;
    },
    /** The rail opens on All Bills, which narrows nothing. */
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'Paid') return row.status === 'Paid';
      if (quick === 'Pending') return row.status === 'Pending' || row.status === 'Partially Paid';
      return row.status === quick;
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'Paid': return row.status === 'Paid';
        case 'Pending': return row.status === 'Pending' || row.status === 'Partially Paid';
        case 'Overdue': return row.status === 'Overdue';
        case 'Staff': return row.customerType === 'Staff';
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'customer':
          return a.customer.localeCompare(b.customer);
        case 'net':
          return netOf(b) - netOf(a) || a.customer.localeCompare(b.customer);
        case 'date':
          return dateKey(b.billingDate) - dateKey(a.billingDate) || a.id.localeCompare(b.id);
        case 'overdue':
          return daysOverdueOf(b) - daysOverdueOf(a) || a.id.localeCompare(b.id);
        // Not in the sort menu, but the Total `<th>` is sortable.
        case 'total':
          return totalOf(b) - totalOf(a);
        case 'invoice':
        default:
          return a.id.localeCompare(b.id);
      }
    },
    defaultSort: 'invoice',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: Invoice) => boolean) => rows.filter(test).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'July Billing Run', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'Paid', label: 'Paid Bills', icon: 'ti ti-circle-check', count: countBy((row) => row.status === 'Paid') },
      {
        id: 'Pending', label: 'Pending Bills', icon: 'ti ti-clock',
        count: countBy((row) => row.status === 'Pending' || row.status === 'Partially Paid'),
      },
      { id: 'Overdue', label: 'Overdue Bills', icon: 'ti ti-alert-triangle', count: countBy((row) => row.status === 'Overdue') },
      { id: 'Staff', label: 'Staff Invoices', icon: 'ti ti-briefcase', count: countBy((row) => row.customerType === 'Staff') },
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All Bills', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'Paid', label: 'Paid', icon: 'ti ti-circle-check', count: countBy((row) => row.status === 'Paid') },
      {
        id: 'Pending', label: 'Pending', icon: 'ti ti-clock',
        count: countBy((row) => row.status === 'Pending' || row.status === 'Partially Paid'),
      },
      { id: 'Overdue', label: 'Overdue', icon: 'ti ti-alert-triangle', count: countBy((row) => row.status === 'Overdue') },
      { id: 'Waived', label: 'Waived', icon: 'ti ti-discount', count: countBy((row) => row.status === 'Waived') },
    ],
    [countBy, rows.length],
  );

  /**
   * The strip counts the whole July run — 214 invoices against the eight this
   * page lists — so the template's figures stand and the roster moves them.
   */
  const summary = useMemo<SummaryItem[]>(() => {
    const seeded = (test: (row: Invoice) => boolean) => initialRows.filter(test).length;
    const shift = (base: number, test: (row: Invoice) => boolean) => base - seeded(test) + countBy(test);
    const paid = (row: Invoice) => row.status === 'Paid';
    const pending = (row: Invoice) => row.status === 'Pending' || row.status === 'Partially Paid';
    const overdue = (row: Invoice) => row.status === 'Overdue';
    const owing = (list: Invoice[]) => list
      .filter((row) => row.status === 'Overdue')
      .reduce((total, row) => total + balanceOf(row), 0);
    const outstanding = SUMMARY_TOTALS.outstanding - owing(initialRows) + owing(rows);
    return [
      {
        id: 'bills', tint: 'primary', icon: 'ti ti-file-invoice', label: 'Total Bills',
        value: String(shift(SUMMARY_TOTALS.bills, () => true)), hint: SUMMARY_TOTALS.run,
      },
      {
        id: 'paid', tint: 'success', icon: 'ti ti-circle-check', label: 'Paid Bills',
        value: String(shift(SUMMARY_TOTALS.paid, paid)), hint: `${SUMMARY_TOTALS.paidShare}% of the run`,
      },
      {
        id: 'pending', tint: 'warning', icon: 'ti ti-clock', label: 'Pending Bills',
        value: String(shift(SUMMARY_TOTALS.pending, pending)), hint: `due by ${SUMMARY_TOTALS.dueBy}`,
      },
      {
        id: 'overdue', tint: 'danger', icon: 'ti ti-alert-triangle', label: 'Overdue Bills',
        value: String(shift(SUMMARY_TOTALS.overdue, overdue)),
        hint: `${money(outstanding)} outstanding`,
      },
      {
        id: 'collection', tint: 'info', icon: 'ti ti-cash', label: 'Today’s Collection',
        value: money(SUMMARY_TOTALS.collectedToday),
        hint: `${countBy((row) => row.paidOn === '31 Jul 2026')} invoices settled`,
      },
    ];
  }, [countBy, rows]);

  /* -------------------------------- Mutations ------------------------------- */

  const toNumber = (value: string, fallback = 0): number => {
    const parsed = Number(value.replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) && value.trim() !== '' ? parsed : fallback;
  };

  /** "31-07-2026" → "31 Jul 2026", the way the row prints dates. */
  const toRowDate = (value: string): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [day, month, year] = value.split('-');
    return months[Number(month) - 1] ? `${day} ${months[Number(month) - 1]} ${year}` : value;
  };

  const generateInvoice = useCallback(
    (draft: InvoiceDraft) => {
      if (!draft.customer) {
        push('Pick the customer to bill', 'warning');
        return;
      }
      const [customer, , type] = draft.customer.split('·').map((part) => part.trim());
      const id = `CB-2026-04${25 + rows.length}`;
      const total = toNumber(draft.total);
      const lines = total > 0
        ? [{ name: 'Cafeteria orders in the period', qty: toNumber(draft.orders, 1), price: Number((total / Math.max(1, toNumber(draft.orders, 1))).toFixed(2)) }]
        : [];
      setRows((current) => [
        {
          id,
          customer,
          avatar: 'assets/img/students/student-01.jpg',
          customerLine: type ?? draft.customerType,
          customerType: draft.customerType as CustomerType,
          billingDate: toRowDate(draft.billingDate),
          period: draft.period === 'July 2026' ? '01 – 31 Jul 2026' : draft.period,
          dueDate: toRowDate(draft.dueDate),
          lines,
          discount: toNumber(draft.discount),
          discountType: draft.discountType,
          discountBasis: `${draft.discountType} applied on generation`,
          taxRate: toNumber(draft.taxRate, 5),
          taxCode: 'CAF-GST-05',
          taxExemption: 'None',
          status: draft.status as BillStatus,
          method: draft.method,
          mealPlan: draft.discountType === 'Meal plan credit' ? 'Standard Student Weekly' : 'Not enrolled',
          payments: [],
          paymentsEmpty: 'No payment recorded — invoice just raised.',
          receiptNo: 'Not issued',
          receiptStatus: draft.email ? 'Emailed on generation · receipt on settlement' : 'Raised on settlement',
          paidOn: DASH,
          notes: draft.notes.trim() || 'Invoice generated from the cafeteria orders in the period.',
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} generated for ${customer}`);
    },
    [push, rows.length],
  );

  const updateInvoice = useCallback(
    (draft: InvoiceDraft) =>
      patchRow(
        (row) => ({
          ...row,
          customerType: draft.customerType as CustomerType,
          billingDate: toRowDate(draft.billingDate),
          dueDate: toRowDate(draft.dueDate),
          discount: toNumber(draft.discount, row.discount),
          discountType: draft.discountType === 'No discount' ? 'No discount applied' : draft.discountType,
          taxRate: toNumber(draft.taxRate, row.taxRate),
          method: draft.method,
          status: draft.status as BillStatus,
          notes: draft.notes.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Invoice'} updated`,
      ),
    [modalRow, patchRow],
  );

  /** A payment moves the balance, and the status follows what is left. */
  const recordPayment = useCallback(
    (amount: string, date: string, reference: string, collectedBy: string) => {
      const paid = toNumber(amount);
      if (paid <= 0) {
        push('Enter the amount collected', 'warning');
        return;
      }
      const printed = toRowDate(date);
      patchRow(
        (row) => {
          const settled = paidOf(row) + paid;
          const status: BillStatus = settled >= netOf(row) ? 'Paid' : 'Partially Paid';
          return {
            ...row,
            payments: [
              ...row.payments,
              {
                title: `${money(paid)} · ${row.method}`,
                meta: `${printed} · ${reference.trim() || collectedBy}`,
                amount: paid,
              },
            ],
            status,
            paidOn: printed,
            receiptNo: status === 'Paid' ? `RCP-${row.id.replace('CB-', '')}` : row.receiptNo,
            receiptStatus: status === 'Paid'
              ? `Issued ${printed} · emailed to the guardian`
              : 'Part receipt issued · final receipt on settlement',
          };
        },
        `${money(paid)} recorded against ${modalRow?.id ?? 'the invoice'}`,
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
      push(`${workspace.visible.length} invoices exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Invoice) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View invoice" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Record payment" onClick={() => openModal(row, 'payment')}>
        <i className="ti ti-cash" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Print invoice" onClick={() => openModal(row, 'print')}>
        <i className="ti ti-printer" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Email invoice" onClick={() => openModal(row, 'email')}>
        <i className="ti ti-mail" />
      </ActionLink>
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

  const renderDetail = (row: Invoice) => (
    <div className="row g-4">
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-file-invoice text-primary me-1" />Invoice Summary</h6>
        {pairList(summaryPairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-tools-kitchen-2 text-warning me-1" />Ordered Items</h6>
        {row.lines.map((line) => (
          <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={line.name}>
            <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
              <i className="ti ti-tools-kitchen-2" />
            </span>
            <div className="flex-fill overflow-hidden">
              <h6 className="fs-13 mb-0 text-truncate">{line.name}</h6>
              <span className="fs-12 text-muted text-truncate d-block">{lineLabelOf(line)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-coin text-success me-1" />Billing Breakdown</h6>
        {pairList(breakdownPairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-discount text-purple me-1" />Discount Details</h6>
        {pairList(discountPairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-receipt-tax text-info me-1" />Tax Details</h6>
        {pairList(taxPairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-cash text-success me-1" />Payment History</h6>
        {row.payments.length === 0 ? (
          <p className="fs-13 text-muted mb-0">{row.paymentsEmpty}</p>
        ) : (
          row.payments.map((payment) => (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={payment.meta}>
              <span className="avatar avatar-sm bg-success-transparent text-success rounded flex-shrink-0">
                <i className="ti ti-cash" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">{payment.title}</h6>
                <span className="fs-12 text-muted text-truncate d-block">{payment.meta}</span>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-receipt text-primary me-1" />Receipt Information</h6>
        {pairList(receiptPairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-note text-secondary me-1" />Internal Notes</h6>
        <p className="fs-13 text-muted mb-3">{row.notes}</p>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => openModal(row, 'view')}
          >
            <i className="ti ti-eye me-1" />View Invoice
          </button>
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => setPanelRow(row)}
          >
            <i className="ti ti-file-invoice me-1" />Billing Panel
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
            title="Cafeteria Billing"
            section="Cafeteria"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(rows[0] ?? null, 'edit')}
                  >
                    <i className="ti ti-edit me-2" />Edit Invoice
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Print Billing Register" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'generate')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Generate Bill
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
            footerInfoSuffix={`${BILLING_PERIOD} run`}
            workspaceId="cbWorkspace"
            searchPlaceholder="Search invoice no. or customer…"
            searchLabel="Search invoices"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="invoices"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Billing register refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-file-off"
            emptyTitle="No invoices match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Billing Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Invoice Details"
            labelledById="cb_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Customer Information</h6>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar avatar-lg rounded flex-shrink-0">
                    <ImageWithBasePath src={panelRow.avatar} className="rounded" alt={panelRow.customer} />
                  </span>
                  <div className="ms-2">
                    <h6 className="mb-0">{panelRow.customer}</h6>
                    <span className="fs-12 text-muted">{panelRow.id} · {panelRow.customerLine}</span>
                  </div>
                  <span className={`${statusBadge[panelRow.status]} ms-auto`}>{panelRow.status}</span>
                </div>

                <h6 className="fs-14 mb-2">Invoice Details</h6>
                <div className="border rounded p-3 mb-3">{pairList(summaryPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Payment Summary</h6>
                <div className="border rounded p-3 mb-3">{pairList(breakdownPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Outstanding Balance</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Net Amount', value: money(netOf(panelRow)) },
                    { label: 'Settled', value: money(paidOf(panelRow)) },
                    { label: 'Balance', value: money(balanceOf(panelRow)) },
                    { label: 'Taxable Amount', value: money(taxableOf(panelRow)) },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Receipt Preview</h6>
                <div className="border rounded p-3 mb-3">{pairList(receiptPairsOf(panelRow))}</div>
                <p className="fs-12 text-muted mb-3">{lineSummaryOf(panelRow)}</p>

                <h6 className="fs-14 mb-2">Audit Information</h6>
                {auditOf(panelRow).map((entry) => (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={entry.title}>
                    <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                      <i className="ti ti-history" />
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
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'print'); }}
                  >
                    <i className="ti ti-printer me-1" />Print Invoice
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'email'); }}
                  >
                    <i className="ti ti-mail me-1" />Email
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <InvoiceModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onGenerate={generateInvoice}
        onUpdate={updateInvoice}
        onRecordPayment={recordPayment}
        onPrint={(size, copies) => {
          setActiveModal(null);
          push(`${copies} × ${modalRow?.id ?? 'invoice'} printed as ${size}`);
        }}
        onEmail={(to, subject) => {
          setActiveModal(null);
          push(`Invoice emailed to ${to} — ${subject}`);
        }}
        onToast={push}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="cbToasts" />
    </>
  );
};

export default CafeteriaBilling;
