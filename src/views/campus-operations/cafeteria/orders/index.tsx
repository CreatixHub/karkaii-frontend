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
import OrderModals, { nameOf, priceOf } from './modals/OrderModals';
import type { OrderDraft, OrderModalId } from './modals/OrderModals';
import type {
  CustomerType, Order, OrderStatus, OrderType, PaymentStatus,
} from './data/orders.data';
import {
  DATE_WINDOW, SUMMARY_TOTALS, auditOf, breakdownPairsOf, counterOptions, customerTint,
  customerTypeOptions, dateKey, itemLineOf, itemSummaryOf, itemsLabel, methodBandOf, methodIcon,
  money, orderStatusOptions, orderTypeOptions, orders as initialRows, payableOf, paymentBadge,
  paymentMethodOptions, paymentStatusOptions, placedAtOf, searchIndexOf, statusBadge, statusPill,
  subtotalOf, timeKey,
} from './data/orders.data';

const routes = all_routes;

/**
 * Ids and options are the template's own. From and To open committed, which is
 * what puts the "Date: 30 – 31 Jul 2026" chip on the rail at load.
 */
const filterFields: FilterField[] = [
  { id: 'customer-type', label: 'Customer Type', kind: 'select', chipLabel: 'Customer', options: customerTypeOptions },
  { id: 'order-type', label: 'Order Type', kind: 'select', chipLabel: 'Type', options: orderTypeOptions },
  { id: 'payment-status', label: 'Payment Status', kind: 'select', chipLabel: 'Payment', options: paymentStatusOptions },
  { id: 'order-status', label: 'Order Status', kind: 'select', chipLabel: 'Status', options: orderStatusOptions },
  {
    id: 'from', label: 'From', kind: 'date', chipLabel: 'From', dateFormat: 'd M Y',
    initialValue: '30 Jul 2026',
  },
  {
    id: 'to', label: 'To', kind: 'date', chipLabel: 'To', dateFormat: 'd M Y',
    initialValue: '31 Jul 2026',
  },
  { id: 'payment-method', label: 'Payment Method', kind: 'select', chipLabel: 'Method', options: paymentMethodOptions },
  { id: 'counter', label: 'Counter', kind: 'select', chipLabel: 'Counter', options: counterOptions },
];

const sortOptions: SortOption[] = [
  { id: 'time', label: 'Order time (newest)', icon: 'ti ti-clock-hour-4' },
  { id: 'id', label: 'Order ID', icon: 'ti ti-hash' },
  { id: 'customer', label: 'Customer name (A–Z)', icon: 'ti ti-abc' },
  { id: 'amount', label: 'Order amount (high to low)', icon: 'ti ti-coin' },
  { id: 'status', label: 'Order status', icon: 'ti ti-package' },
];

const CafeteriaOrders = () => {
  const [rows, setRows] = useState<Order[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<OrderModalId | null>(null);
  const [modalRow, setModalRow] = useState<Order | null>(null);
  const [panelRow, setPanelRow] = useState<Order | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Order | null, modal: OrderModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  /** Applies a change to the row a dialog was opened on. */
  const patchRow = useCallback(
    (change: (row: Order) => Order, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        id: 'id',
        label: 'Order ID',
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
        id: 'items',
        label: 'Ordered Items',
        render: (row) => {
          const summary = itemSummaryOf(row);
          return (
            <>
              <span className="d-block fs-13 fw-medium text-nowrap">{itemsLabel(row)}</span>
              <span className="fs-12 text-muted text-nowrap">
                {summary.first}{summary.more ? <span className="text-muted"> {summary.more}</span> : null}
              </span>
            </>
          );
        },
      },
      {
        id: 'placed',
        label: 'Order Date & Time',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.date}</span>
            <span className="fs-12 text-muted text-nowrap">{row.time}</span>
          </>
        ),
      },
      {
        id: 'amount',
        label: 'Order Amount',
        sortable: true,
        cellClassName: 'fs-13 fw-semibold text-nowrap',
        render: (row) => money(subtotalOf(row)),
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
      {
        id: 'payment',
        label: 'Payment Status',
        render: (row) => <span className={paymentBadge[row.paymentStatus]}>{row.paymentStatus}</span>,
      },
      {
        id: 'status',
        label: 'Order Status',
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

  const workspace = useWorkspace<Order>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['customer-type'] && row.customerType !== filters['customer-type']) return false;
      if (filters['order-type'] && row.orderType !== filters['order-type']) return false;
      if (filters['payment-status'] && row.paymentStatus !== filters['payment-status']) return false;
      if (filters['order-status'] && row.status !== filters['order-status']) return false;
      if (filters.from && dateKey(row.date) < dateKey(filters.from)) return false;
      if (filters.to && dateKey(row.date) > dateKey(filters.to)) return false;
      if (filters['payment-method'] && methodBandOf(row) !== filters['payment-method']) return false;
      if (filters.counter && !row.counter.startsWith(filters.counter.split(' ·')[0])) return false;
      return true;
    },
    /** The rail opens on All Orders, which narrows nothing. */
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'Ready') return row.status === 'Ready for Pickup';
      return row.status === quick;
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'Kitchen': return row.status === 'Preparing' || row.status === 'On Hold';
        case 'Ready': return row.status === 'Ready for Pickup';
        case 'Payment': return row.paymentStatus === 'Failed' || row.paymentStatus === 'Unpaid';
        case 'Staff': return row.customerType === 'Staff';
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'id':
          return a.id.localeCompare(b.id);
        case 'customer':
          return a.customer.localeCompare(b.customer);
        case 'amount':
          return subtotalOf(b) - subtotalOf(a) || a.customer.localeCompare(b.customer);
        case 'status':
          return orderStatusOptions.indexOf(a.status) - orderStatusOptions.indexOf(b.status)
            || timeKey(b) - timeKey(a);
        case 'time':
        default:
          return timeKey(b) - timeKey(a);
      }
    },
    defaultSort: 'time',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: Order) => boolean) => rows.filter(test).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'Today’s Orders', icon: 'ti ti-layout-list', count: rows.length },
      {
        id: 'Kitchen', label: 'Kitchen Queue', icon: 'ti ti-tools-kitchen-2',
        count: countBy((row) => row.status === 'Preparing' || row.status === 'On Hold'),
      },
      {
        id: 'Ready', label: 'Ready for Pickup', icon: 'ti ti-package',
        count: countBy((row) => row.status === 'Ready for Pickup'),
      },
      {
        id: 'Payment', label: 'Payment Issues', icon: 'ti ti-alert-triangle',
        count: countBy((row) => row.paymentStatus === 'Failed' || row.paymentStatus === 'Unpaid'),
      },
      {
        id: 'Staff', label: 'Staff Orders', icon: 'ti ti-briefcase',
        count: countBy((row) => row.customerType === 'Staff'),
      },
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All Orders', icon: 'ti ti-layout-list', count: rows.length },
      {
        id: 'Preparing', label: 'Preparing', icon: 'ti ti-tools-kitchen-2',
        count: countBy((row) => row.status === 'Preparing'),
      },
      {
        id: 'Ready', label: 'Ready', icon: 'ti ti-package',
        count: countBy((row) => row.status === 'Ready for Pickup'),
      },
      {
        id: 'Completed', label: 'Completed', icon: 'ti ti-checks',
        count: countBy((row) => row.status === 'Completed'),
      },
      {
        id: 'Cancelled', label: 'Cancelled', icon: 'ti ti-ban',
        count: countBy((row) => row.status === 'Cancelled'),
      },
    ],
    [countBy, rows.length],
  );

  /**
   * The strip counts the whole day at the counters — 148 orders against the
   * eight this page lists — so the template's figures stand and the roster
   * moves them.
   */
  const summary = useMemo<SummaryItem[]>(() => {
    const seeded = (test: (row: Order) => boolean) => initialRows.filter(test).length;
    const shift = (base: number, test: (row: Order) => boolean) => base - seeded(test) + countBy(test);
    const preparing = (row: Order) => row.status === 'Preparing';
    const ready = (row: Order) => row.status === 'Ready for Pickup';
    const completed = (row: Order) => row.status === 'Completed';
    const cancelled = (row: Order) => row.status === 'Cancelled';
    return [
      {
        id: 'orders', tint: 'primary', icon: 'ti ti-receipt', label: 'Total Orders',
        value: String(shift(SUMMARY_TOTALS.orders, () => true)),
        hint: `${SUMMARY_TOTALS.date} · ${countBy((row) => row.status === 'On Hold')} on hold`,
      },
      {
        id: 'preparing', tint: 'warning', icon: 'ti ti-tools-kitchen-2', label: 'Preparing',
        value: String(shift(SUMMARY_TOTALS.preparing, preparing)),
        hint: `avg. ${SUMMARY_TOTALS.averagePrep} in kitchen`,
      },
      {
        id: 'ready', tint: 'info', icon: 'ti ti-package', label: 'Ready for Pickup',
        value: String(shift(SUMMARY_TOTALS.ready, ready)),
        hint: `oldest waiting ${SUMMARY_TOTALS.oldestWait}`,
      },
      {
        id: 'completed', tint: 'success', icon: 'ti ti-checks', label: 'Completed',
        value: String(shift(SUMMARY_TOTALS.completed, completed)),
        hint: `${money(SUMMARY_TOTALS.collected)} collected`,
      },
      {
        id: 'cancelled', tint: 'danger', icon: 'ti ti-ban', label: 'Cancelled',
        value: String(shift(SUMMARY_TOTALS.cancelled, cancelled)),
        hint: `${countBy((row) => row.paymentStatus === 'Refunded')} refunded · ${countBy((row) => row.paymentStatus === 'Unpaid')} unpaid`,
      },
    ];
  }, [countBy]);

  /* -------------------------------- Mutations ------------------------------- */

  const toNumber = (value: string, fallback = 0): number => {
    const parsed = Number(value.replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) && value.trim() !== '' ? parsed : fallback;
  };

  const itemsFrom = (draft: OrderDraft): Order['items'] => {
    const lines = [{ name: nameOf(draft.itemOne), qty: toNumber(draft.qtyOne, 1), price: priceOf(draft.itemOne) }];
    if (draft.itemTwo !== 'No second item') {
      lines.push({ name: nameOf(draft.itemTwo), qty: toNumber(draft.qtyTwo, 1), price: priceOf(draft.itemTwo) });
    }
    return lines;
  };

  /** "2026-07-31T12:42" → "31 Jul 2026" and "12:42 PM". */
  const stampFrom = (value: string): { date: string; time: string } => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [datePart, timePart = '12:00'] = value.split('T');
    const [year, month, day] = datePart.split('-');
    const [hourText, minute] = timePart.split(':');
    const hour = Number(hourText);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const twelve = hour % 12 === 0 ? 12 : hour % 12;
    return {
      date: months[Number(month) - 1] ? `${day} ${months[Number(month) - 1]} ${year}` : datePart,
      time: `${String(twelve).padStart(2, '0')}:${minute} ${suffix}`,
    };
  };

  const createOrder = useCallback(
    (draft: OrderDraft) => {
      if (!draft.customer) {
        push('Pick the customer placing the order', 'warning');
        return;
      }
      const [customer] = draft.customer.split('·').map((part) => part.trim());
      const stamp = stampFrom(draft.placedAt);
      const id = `ORD-2026-18${48 + rows.length}`;
      const items = itemsFrom(draft);
      setRows((current) => [
        {
          id,
          customer,
          avatar: 'assets/img/students/student-01.jpg',
          customerLine: draft.customerType,
          customerType: draft.customerType as CustomerType,
          items,
          date: stamp.date,
          time: stamp.time,
          method: draft.method,
          paymentStatus: draft.paymentStatus as PaymentStatus,
          status: (draft.toKitchen ? 'Preparing' : draft.orderStatus) as OrderStatus,
          orderType: draft.orderType as OrderType,
          counter: draft.counter,
          prepMinutes: 0,
          credit: toNumber(draft.credit),
          summaryPairs: [
            { label: 'Order Type', value: draft.orderType },
            { label: 'Counter', value: draft.counter },
            { label: 'Meal Plan', value: toNumber(draft.credit) > 0 ? 'Credit applied' : 'Not applied' },
            { label: 'Placed Via', value: 'Counter' },
            { label: 'Token', value: draft.printToken ? `T-0${60 + rows.length}` : 'Not issued' },
          ],
          paymentPairs: [
            { label: 'Method', value: draft.method },
            { label: 'Meal Plan Credit', value: toNumber(draft.credit) > 0 ? money(toNumber(draft.credit)) : 'Not applied' },
            { label: 'Amount Payable', value: money(Math.max(0, items.reduce((total, item) => total + item.qty * item.price, 0) - toNumber(draft.credit))) },
            { label: 'Reference', value: 'Pending settlement' },
          ],
          preparationPairs: [
            { label: 'Order Received', value: stamp.time },
            { label: 'Kitchen Accepted', value: draft.toKitchen ? stamp.time : 'Not accepted' },
            { label: 'Preparation Done', value: 'In progress' },
            { label: 'Elapsed', value: '0 minutes' },
            { label: 'Assigned Chef', value: draft.counter },
          ],
          fulfilmentPairs: [
            { label: 'Fulfilment', value: draft.orderType },
            { label: 'Pickup Window', value: 'To be confirmed' },
            { label: 'Collected By', value: 'Pending collection' },
            { label: 'Location', value: draft.counter.includes('staff') ? 'Staff Dining Room' : 'Main Block Cafeteria' },
          ],
          notes: draft.notes.trim() || 'Order placed at the counter.',
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} created for ${customer}`);
    },
    [push, rows.length],
  );

  const updateOrder = useCallback(
    (draft: OrderDraft) =>
      patchRow(
        (row) => {
          const stamp = stampFrom(draft.placedAt);
          return {
            ...row,
            customerType: draft.customerType as CustomerType,
            orderType: draft.orderType as OrderType,
            counter: draft.counter,
            items: itemsFrom(draft),
            credit: toNumber(draft.credit, row.credit),
            method: draft.method,
            paymentStatus: draft.paymentStatus as PaymentStatus,
            status: draft.orderStatus as OrderStatus,
            date: stamp.date,
            time: stamp.time,
            notes: draft.notes.trim() || row.notes,
          };
        },
        `${modalRow?.id ?? 'Order'} updated`,
      ),
    [modalRow, patchRow],
  );

  /** The kitchen buttons walk the order along and stamp its timeline. */
  const updateStatus = useCallback(
    (status: OrderStatus, counter: string, ready: string) =>
      patchRow(
        (row) => ({
          ...row,
          status,
          counter,
          preparationPairs: row.preparationPairs.map((pair) => {
            if (pair.label === 'Preparation Done' && status !== 'Preparing') {
              return { ...pair, value: ready };
            }
            if (pair.label === 'Assigned Chef') return { ...pair, value: counter };
            return pair;
          }),
          fulfilmentPairs: row.fulfilmentPairs.map((pair) =>
            pair.label === 'Collected By' && status === 'Completed'
              ? { ...pair, value: 'Collected at the counter' }
              : pair,
          ),
        }),
        `${modalRow?.id ?? 'Order'} moved to ${status}`,
      ),
    [modalRow, patchRow],
  );

  const cancelOrder = useCallback(
    (reason: string, by: string, refundMethod: string, amount: string) =>
      patchRow(
        (row) => ({
          ...row,
          status: 'Cancelled',
          paymentStatus: toNumber(amount) > 0 ? 'Refunded' : row.paymentStatus,
          preparationPairs: [
            row.preparationPairs[0],
            { label: 'Kitchen Accepted', value: 'Cancelled before completion' },
            { label: 'Cancelled At', value: '05:00 PM' },
            { label: 'Cancelled By', value: `${by} · ${reason.toLowerCase()}` },
            { label: 'Assigned Chef', value: '—' },
          ],
          fulfilmentPairs: [
            { label: 'Fulfilment', value: 'Cancelled before collection' },
            { label: 'Pickup Window', value: 'Not applicable' },
            { label: 'Collected By', value: '—' },
            row.fulfilmentPairs[3],
          ],
          notes: toNumber(amount) > 0
            ? `${reason}. ${money(toNumber(amount))} refunded — ${refundMethod.toLowerCase()}.`
            : `${reason}. No refund due.`,
        }),
        `${modalRow?.id ?? 'Order'} cancelled`,
      ),
    [modalRow, patchRow],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} orders exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Order) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View order" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Update order status" onClick={() => openModal(row, 'status')}>
        <i className="ti ti-refresh" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Generate receipt" onClick={() => openModal(row, 'receipt')}>
        <i className="ti ti-receipt" />
      </ActionLink>
      <ActionLink className="dt-ib danger" ariaLabel="Cancel order" onClick={() => openModal(row, 'cancel')}>
        <i className="ti ti-ban" />
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

  const renderDetail = (row: Order) => (
    <div className="row g-4">
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-receipt text-primary me-1" />Complete Order Summary</h6>
        {pairList(row.summaryPairs)}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-tools-kitchen-2 text-warning me-1" />Ordered Items</h6>
        {row.items.map((item) => (
          <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={item.name}>
            <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
              <i className="ti ti-tools-kitchen-2" />
            </span>
            <div className="flex-fill overflow-hidden">
              <h6 className="fs-13 mb-0 text-truncate">{item.name}</h6>
              <span className="fs-12 text-muted text-truncate d-block">{itemLineOf(item)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-coin text-success me-1" />Quantity &amp; Price Breakdown</h6>
        {pairList(breakdownPairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-wallet text-info me-1" />Payment Information</h6>
        {pairList(row.paymentPairs)}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-clock-hour-4 text-purple me-1" />Preparation Status</h6>
        {pairList(row.preparationPairs)}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-package text-primary me-1" />Pickup / Delivery Information</h6>
        {pairList(row.fulfilmentPairs)}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-note text-secondary me-1" />Internal Notes</h6>
        <p className="fs-13 text-muted mb-3">{row.notes}</p>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => openModal(row, 'view')}
          >
            <i className="ti ti-eye me-1" />View Order
          </button>
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => setPanelRow(row)}
          >
            <i className="ti ti-receipt me-1" />Order Panel
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
            title="Cafeteria Orders"
            section="Cafeteria"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(rows[0] ?? null, 'edit')}
                  >
                    <i className="ti ti-edit me-2" />Edit Order
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Print Kitchen Docket" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'create')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Create Order
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
            footerInfoSuffix={`orders for ${DATE_WINDOW}`}
            workspaceId="coWorkspace"
            searchPlaceholder="Search order ID, customer or item…"
            searchLabel="Search orders"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="orders"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Orders refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-receipt-off"
            emptyTitle="No orders match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Order Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Order Details"
            labelledById="co_panel_lbl"
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
                <div className="border rounded p-3 mb-3">{pairList(panelRow.summaryPairs)}</div>

                <h6 className="fs-14 mb-2">Order Timeline</h6>
                <div className="border rounded p-3 mb-3">{pairList(panelRow.preparationPairs)}</div>

                <h6 className="fs-14 mb-2">Billing Summary</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    ...breakdownPairsOf(panelRow),
                    { label: 'Amount Payable', value: money(payableOf(panelRow)) },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Payment Details</h6>
                <div className="border rounded p-3 mb-3">{pairList(panelRow.paymentPairs)}</div>

                <h6 className="fs-14 mb-2">Kitchen Status</h6>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                  <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
                    <i className="ti ti-tools-kitchen-2" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0">{panelRow.counter}</h6>
                    <span className="fs-12 text-muted">
                      {panelRow.prepMinutes} min · {placedAtOf(panelRow)}
                    </span>
                  </div>
                </div>

                <h6 className="fs-14 mb-2">Receipt Information</h6>
                <div className="border rounded p-3 mb-3">{pairList(panelRow.fulfilmentPairs)}</div>

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
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'status'); }}
                  >
                    <i className="ti ti-refresh me-1" />Update Status
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

      <OrderModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onCreate={createOrder}
        onUpdate={updateOrder}
        onUpdateStatus={updateStatus}
        onGenerateReceipt={(format, sendTo) => {
          setActiveModal(null);
          push(`Receipt sent to ${sendTo} as ${format}`);
        }}
        onCancel={cancelOrder}
        onToast={push}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="coToasts" />
    </>
  );
};

export default CafeteriaOrders;
