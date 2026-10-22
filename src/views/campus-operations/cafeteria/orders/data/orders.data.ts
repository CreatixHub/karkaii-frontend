export type OrderStatus =
  | 'Preparing' | 'Ready for Pickup' | 'Completed' | 'On Hold' | 'Cancelled';

export type PaymentStatus = 'Paid' | 'Pending' | 'Unpaid' | 'Failed' | 'Refunded';

export type CustomerType = 'Student' | 'Staff' | 'Hostel Resident' | 'Guest';

export type OrderType = 'Dine-in' | 'Takeaway' | 'Pre-order' | 'Hostel delivery';

export interface Pair {
  label: string;
  value: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  customer: string;
  avatar: string;
  /** "II B · A-104" or "Chief Warden · EMP-2019-014". */
  customerLine: string;
  customerType: CustomerType;
  items: OrderItem[];
  /** "31 Jul 2026" and "12:42 PM", as the two lines of the date cell. */
  date: string;
  time: string;
  /** Payment method label, e.g. "Meal Plan + Wallet". */
  method: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;

  orderType: OrderType;
  counter: string;
  /** Minutes the kitchen has had it, for the View dialog's Prep Time tile. */
  prepMinutes: number;
  /** Meal-plan credit applied to the order, in dollars. */
  credit: number;

  /** The panel's four varying sections, verbatim. */
  summaryPairs: Pair[];
  paymentPairs: Pair[];
  preparationPairs: Pair[];
  fulfilmentPairs: Pair[];
  notes: string;
}

export const statusPill: Record<OrderStatus, string> = {
  Preparing: 'is-review',
  'Ready for Pickup': 'is-pending',
  Completed: 'is-active',
  'On Hold': 'is-suspended',
  Cancelled: 'is-blocked',
};

export const statusBadge: Record<OrderStatus, string> = {
  Preparing: 'badge badge-soft-info',
  'Ready for Pickup': 'badge badge-soft-warning',
  Completed: 'badge badge-soft-success',
  'On Hold': 'badge badge-soft-secondary',
  Cancelled: 'badge badge-soft-danger',
};

export const paymentBadge: Record<PaymentStatus, string> = {
  Paid: 'badge badge-soft-success',
  Pending: 'badge badge-soft-warning',
  Unpaid: 'badge badge-soft-danger',
  Failed: 'badge badge-soft-danger',
  Refunded: 'badge badge-soft-info',
};

export const customerTint: Record<CustomerType, string> = {
  Student: 'primary',
  Staff: 'success',
  'Hostel Resident': 'purple',
  Guest: 'info',
};

/* ------------------------------ Filter options ------------------------------ */

export const customerTypeOptions: CustomerType[] = [
  'Student', 'Staff', 'Hostel Resident', 'Guest',
];

export const orderTypeOptions: OrderType[] = [
  'Dine-in', 'Takeaway', 'Pre-order', 'Hostel delivery',
];

export const paymentStatusOptions: PaymentStatus[] = [
  'Paid', 'Pending', 'Unpaid', 'Failed', 'Refunded',
];

export const orderStatusOptions: OrderStatus[] = [
  'Preparing', 'Ready for Pickup', 'Completed', 'On Hold', 'Cancelled',
];

export const paymentMethodOptions = [
  'Wallet', 'Meal Plan', 'Card', 'UPI', 'Cash', 'Payroll deduction',
];

export const counterOptions = [
  'Counter 1', 'Counter 2', 'Counter 4', 'Counter 5 · staff', 'Hostel Mess',
];

/* --------------------------- Dialog option lists ----------------------------- */

export const customerChoices = [
  'Lisa Gourley · AD9892431 · Student',
  'Joann Michael · AD9892433 · Student',
  'Janet Daniel · AD9892434 · Student',
  'Mrs. Alice Ray · EMP-2019-014 · Staff',
  'Mr. David Kim · EMP-2020-027 · Staff',
];

export const menuChoices = [
  'Vegetable Pulao · $1.80',
  'Masala Dosa · $1.20',
  'Grilled Paneer Wrap · $1.50',
  'Rajma Chawal · $2.10',
  'Fresh Fruit Smoothie · $1.10',
];

export const createMethodOptions = [
  'Wallet', 'Meal Plan + Wallet', 'Card', 'UPI', 'Cash', 'Payroll deduction',
];

export const createPaymentStatusOptions: PaymentStatus[] = ['Paid', 'Pending', 'Unpaid'];

export const createOrderStatusOptions: OrderStatus[] = [
  'Preparing', 'Ready for Pickup', 'Completed', 'On Hold',
];

export const cancelReasonOptions = [
  'Item unavailable', 'Customer request', 'Payment declined',
  'Kitchen unable to fulfil', 'Duplicate order',
];

export const cancelledByOptions = [
  'Kitchen · Counter 1', 'Cafeteria Manager', 'Customer', 'System',
];

export const refundMethodOptions = ['Back to wallet', 'Original payment method', 'No refund due'];

export const receiptFormatOptions = ['Thermal · 80 mm', 'A5 · PDF', 'Email · HTML'];

/** The three states the Update Status dialog's button group offers. */
export const kitchenStates: OrderStatus[] = ['Preparing', 'Ready for Pickup', 'Completed'];

/* ------------------------------- Derivations -------------------------------- */

export const DASH = '—';

export const money = (value: number): string => `$${value.toFixed(2)}`;

export const itemCountOf = (row: Order): number =>
  row.items.reduce((total, item) => total + item.qty, 0);

export const subtotalOf = (row: Order): number =>
  row.items.reduce((total, item) => total + item.qty * item.price, 0);

/** What the order actually charges once the meal-plan credit comes off. */
export const payableOf = (row: Order): number => Math.max(0, subtotalOf(row) - row.credit);

export const itemsLabel = (row: Order): string => {
  const count = itemCountOf(row);
  return `${count} ${count === 1 ? 'item' : 'items'}`;
};

/** "Vegetable Pulao +1 more" — the second line of the items cell. */
export const itemSummaryOf = (row: Order): { first: string; more: string } => {
  const [first, ...rest] = row.items;
  return {
    first: first?.name ?? DASH,
    more: rest.length > 0 ? `+${rest.length} more` : '',
  };
};

/** The payment method decides its own icon. */
export const methodIcon = (method: string): string => {
  if (/payroll/i.test(method)) return 'ti ti-briefcase';
  if (/card/i.test(method)) return 'ti ti-credit-card';
  if (/upi/i.test(method)) return 'ti ti-device-mobile';
  if (/cash/i.test(method)) return 'ti ti-cash';
  return 'ti ti-wallet';
};

/** "ORD-2026-1842 · 3 items · Token T-046" — the dialogs' order line. */
export const compactOf = (row: Order): string => {
  const token = row.summaryPairs.find((pair) => pair.label === 'Token')?.value ?? DASH;
  return `${row.id} · ${itemsLabel(row)} · Token ${token}`;
};

export const placedAtOf = (row: Order): string => `${row.date}, ${row.time}`;

export const breakdownPairsOf = (row: Order): Pair[] => [
  { label: 'Subtotal', value: money(subtotalOf(row)) },
  { label: 'Meal Plan Credit', value: row.credit > 0 ? `−${money(row.credit)}` : DASH },
  { label: 'Items', value: String(itemCountOf(row)) },
];

export const itemLineOf = (item: OrderItem): string => `${item.qty} × ${money(item.price)}`;

export interface AuditEntry {
  title: string;
  meta: string;
}

/**
 * The panel's audit trail, built from the order's own timeline rather than the
 * three fixed lines the template ships.
 */
export const auditOf = (row: Order): AuditEntry[] => {
  const entries: AuditEntry[] = [
    { title: 'Order placed', meta: `${placedAtOf(row)} · ${row.summaryPairs.find((pair) => pair.label === 'Placed Via')?.value ?? 'Counter'}` },
    { title: `Payment ${row.paymentStatus.toLowerCase()}`, meta: `${row.method} · ${money(payableOf(row))}` },
  ];
  const last = row.preparationPairs[row.preparationPairs.length - 2];
  if (last) entries.push({ title: last.label, meta: `${last.value} · ${row.counter}` });
  return entries;
};

/* --------------------------------- Filters ---------------------------------- */

export const methodBandOf = (row: Order): string => {
  if (/payroll/i.test(row.method)) return 'Payroll deduction';
  if (/card/i.test(row.method)) return 'Card';
  if (/upi/i.test(row.method)) return 'UPI';
  if (/cash/i.test(row.method)) return 'Cash';
  if (/meal plan/i.test(row.method)) return 'Meal Plan';
  return 'Wallet';
};

export const searchIndexOf = (row: Order): string =>
  [
    row.id, row.customer, row.customerLine, row.customerType, row.orderType, row.counter,
    row.method, row.paymentStatus, row.status, row.date,
    row.items.map((item) => item.name).join(' '),
  ]
    .join(' ')
    .toLowerCase();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Sortable key for the template's "31 Jul 2026" plus "12:42 PM". */
export const timeKey = (row: Order): number => {
  const [day, month, year] = row.date.split(' ');
  const index = months.indexOf(month);
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(row.time.trim());
  let minutes = 0;
  if (match) {
    let hour = Number(match[1]) % 12;
    if (match[3].toUpperCase() === 'PM') hour += 12;
    minutes = hour * 60 + Number(match[2]);
  }
  return (Number(year) * 10000 + (index + 1) * 100 + Number(day)) * 10000 + minutes;
};

/** Sortable key for a plain "31 Jul 2026" date, used by the date filters. */
export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/* --------------------------------- Summary ---------------------------------- */

/**
 * The strip counts the whole day at the counters — 148 orders against the eight
 * this page lists — so the template's figures stand and the roster moves them.
 */
export const SUMMARY_TOTALS = {
  orders: 148,
  date: '31 Jul 2026',
  onHold: 3,
  preparing: 12,
  averagePrep: '8 min',
  ready: 9,
  oldestWait: '6 min',
  completed: 121,
  collected: 342.6,
  cancelled: 3,
  refunded: 2,
  unpaid: 1,
};

/** The date window the template shows as its one filter chip. */
export const DATE_WINDOW = '30 – 31 Jul 2026';

/* ---------------------------------- Rows ------------------------------------ */

export const orders: Order[] = [
  {
    id: 'ORD-2026-1841', customer: 'Lisa Gourley', avatar: 'assets/img/students/student-04.jpg',
    customerLine: 'II B · A-104', customerType: 'Student',
    items: [
      { name: 'Vegetable Pulao', qty: 1, price: 1.8 },
      { name: 'Fresh Fruit Smoothie', qty: 1, price: 1.1 },
    ],
    date: '31 Jul 2026', time: '12:42 PM', method: 'Meal Plan + Wallet',
    paymentStatus: 'Paid', status: 'Ready for Pickup',
    orderType: 'Takeaway', counter: 'Counter 2', prepMinutes: 9, credit: 1.8,
    summaryPairs: [
      { label: 'Order Type', value: 'Takeaway' },
      { label: 'Counter', value: 'Counter 2' },
      { label: 'Meal Plan', value: 'Standard Student Weekly' },
      { label: 'Placed Via', value: 'Student app' },
      { label: 'Token', value: 'T-041' },
    ],
    paymentPairs: [
      { label: 'Method', value: 'Meal Plan + Wallet' },
      { label: 'Meal Plan Credit', value: '$1.80 · lunch covered' },
      { label: 'Wallet Charged', value: '$1.10' },
      { label: 'Wallet Balance', value: '$18.40' },
      { label: 'Reference', value: 'PAY-2026-9911' },
    ],
    preparationPairs: [
      { label: 'Order Received', value: '12:42 PM' },
      { label: 'Kitchen Accepted', value: '12:44 PM' },
      { label: 'Preparation Done', value: '12:51 PM' },
      { label: 'Ready Since', value: '6 minutes' },
      { label: 'Assigned Chef', value: 'Counter 2 · Ramesh' },
    ],
    fulfilmentPairs: [
      { label: 'Fulfilment', value: 'Counter pickup' },
      { label: 'Pickup Window', value: 'Until 01:30 PM' },
      { label: 'Collected By', value: 'Student · ID scan' },
      { label: 'Location', value: 'Main Block Cafeteria' },
    ],
    notes: 'Lunch covered by the weekly meal plan; only the beverage was charged to the wallet.',
  },
  {
    id: 'ORD-2026-1842', customer: 'Joann Michael', avatar: 'assets/img/students/student-02.jpg',
    customerLine: 'IV B · B-118', customerType: 'Student',
    items: [
      { name: 'Vegetable Pulao', qty: 2, price: 1.8 },
      { name: 'Grilled Paneer Wrap', qty: 1, price: 1.5 },
    ],
    date: '31 Jul 2026', time: '12:55 PM', method: 'Wallet',
    paymentStatus: 'Paid', status: 'Preparing',
    orderType: 'Dine-in', counter: 'Counter 1', prepMinutes: 9, credit: 0,
    summaryPairs: [
      { label: 'Order Type', value: 'Dine-in' },
      { label: 'Counter', value: 'Counter 1' },
      { label: 'Meal Plan', value: 'Not applied · guest portion' },
      { label: 'Placed Via', value: 'Cafeteria kiosk' },
      { label: 'Token', value: 'T-046' },
    ],
    paymentPairs: [
      { label: 'Method', value: 'Wallet' },
      { label: 'Meal Plan Credit', value: 'Not applied' },
      { label: 'Wallet Charged', value: '$5.10' },
      { label: 'Wallet Balance', value: '$12.75' },
      { label: 'Reference', value: 'PAY-2026-9914' },
    ],
    preparationPairs: [
      { label: 'Order Received', value: '12:55 PM' },
      { label: 'Kitchen Accepted', value: '12:56 PM' },
      { label: 'Preparation Done', value: 'In progress' },
      { label: 'Elapsed', value: '9 minutes' },
      { label: 'Assigned Chef', value: 'Counter 1 · Suresh' },
    ],
    fulfilmentPairs: [
      { label: 'Fulfilment', value: 'Dine-in · table service' },
      { label: 'Table', value: 'Table 14' },
      { label: 'Seats', value: '3' },
      { label: 'Location', value: 'Main Block Cafeteria' },
    ],
    notes: 'Ordered two extra portions for visiting family. Meal plan credit deliberately not applied.',
  },
  {
    id: 'ORD-2026-1843', customer: 'Mrs. Alice Ray', avatar: 'assets/img/teachers/teacher-01.jpg',
    customerLine: 'Chief Warden · EMP-2019-014', customerType: 'Staff',
    items: [
      { name: 'Vegetable Pulao', qty: 1, price: 2.1 },
      { name: 'Grilled Paneer Wrap', qty: 1, price: 1.8 },
    ],
    date: '31 Jul 2026', time: '12:15 PM', method: 'Payroll Deduction',
    paymentStatus: 'Pending', status: 'Preparing',
    orderType: 'Dine-in', counter: 'Counter 5 · staff', prepMinutes: 11, credit: 0,
    summaryPairs: [
      { label: 'Order Type', value: 'Dine-in' },
      { label: 'Counter', value: 'Counter 5 · staff' },
      { label: 'Rate Applied', value: 'Staff rate · +$0.30 / item' },
      { label: 'Placed Via', value: 'Staff portal' },
      { label: 'Token', value: 'T-038' },
    ],
    paymentPairs: [
      { label: 'Method', value: 'Payroll deduction' },
      { label: 'Deduction Cycle', value: 'August 2026 salary' },
      { label: 'Amount', value: '$3.90' },
      { label: 'Month to Date', value: '$46.20' },
      { label: 'Reference', value: 'PYD-2026-0418' },
    ],
    preparationPairs: [
      { label: 'Order Received', value: '12:15 PM' },
      { label: 'Kitchen Accepted', value: '12:17 PM' },
      { label: 'Preparation Done', value: 'In progress' },
      { label: 'Elapsed', value: '11 minutes' },
      { label: 'Assigned Chef', value: 'Counter 5 · Anita' },
    ],
    fulfilmentPairs: [
      { label: 'Fulfilment', value: 'Dine-in · staff dining' },
      { label: 'Table', value: 'Table 4' },
      { label: 'Seats', value: '2' },
      { label: 'Location', value: 'Staff Dining Room' },
    ],
    notes: 'Staff orders settle against the August payroll run; nothing is charged at the counter.',
  },
  {
    id: 'ORD-2026-1844', customer: 'Richard Soley', avatar: 'assets/img/students/student-08.jpg',
    customerLine: 'V B · C-012', customerType: 'Student',
    items: [{ name: 'Masala Dosa', qty: 1, price: 1.2 }],
    date: '31 Jul 2026', time: '11:20 AM', method: 'Wallet · declined',
    paymentStatus: 'Unpaid', status: 'Cancelled',
    orderType: 'Takeaway', counter: 'Counter 2', prepMinutes: 0, credit: 0,
    summaryPairs: [
      { label: 'Order Type', value: 'Takeaway' },
      { label: 'Counter', value: 'Counter 2' },
      { label: 'Meal Plan', value: 'Suspended · fee hold' },
      { label: 'Placed Via', value: 'Student app' },
      { label: 'Token', value: 'Not issued' },
    ],
    paymentPairs: [
      { label: 'Method', value: 'Wallet · declined' },
      { label: 'Decline Reason', value: 'Account on fee hold' },
      { label: 'Amount Due', value: '$1.20' },
      { label: 'Wallet Balance', value: '$0.00' },
      { label: 'Reference', value: 'PAY-2026-9908 · failed' },
    ],
    preparationPairs: [
      { label: 'Order Received', value: '11:20 AM' },
      { label: 'Kitchen Accepted', value: 'Not accepted' },
      { label: 'Cancelled At', value: '11:22 AM' },
      { label: 'Cancelled By', value: 'System · payment declined' },
      { label: 'Assigned Chef', value: '—' },
    ],
    fulfilmentPairs: [
      { label: 'Fulfilment', value: 'Cancelled before preparation' },
      { label: 'Pickup Window', value: 'Not applicable' },
      { label: 'Collected By', value: '—' },
      { label: 'Location', value: 'Main Block Cafeteria' },
    ],
    notes: 'Wallet blocked while $1,800 remains outstanding on INV-2026-0474. Clear the hostel fee to restore ordering.',
  },
  {
    id: 'ORD-2026-1845', customer: 'Janet Daniel', avatar: 'assets/img/students/student-01.jpg',
    customerLine: 'III A · C-115', customerType: 'Student',
    items: [
      { name: 'Masala Dosa', qty: 1, price: 1.2 },
      { name: 'Fresh Fruit Smoothie', qty: 1, price: 1.1 },
    ],
    date: '31 Jul 2026', time: '08:05 AM', method: 'Wallet',
    paymentStatus: 'Paid', status: 'Completed',
    orderType: 'Takeaway', counter: 'Counter 2', prepMinutes: 14, credit: 0,
    summaryPairs: [
      { label: 'Order Type', value: 'Takeaway' },
      { label: 'Counter', value: 'Counter 2' },
      { label: 'Meal Plan', value: 'Not enrolled · pay per meal' },
      { label: 'Placed Via', value: 'Cafeteria kiosk' },
      { label: 'Token', value: 'T-012' },
    ],
    paymentPairs: [
      { label: 'Method', value: 'Wallet' },
      { label: 'Meal Plan Credit', value: 'Not applied' },
      { label: 'Wallet Charged', value: '$2.30' },
      { label: 'Wallet Balance', value: '$24.90' },
      { label: 'Reference', value: 'PAY-2026-9902' },
    ],
    preparationPairs: [
      { label: 'Order Received', value: '08:05 AM' },
      { label: 'Kitchen Accepted', value: '08:06 AM' },
      { label: 'Preparation Done', value: '08:14 AM' },
      { label: 'Collected At', value: '08:19 AM' },
      { label: 'Assigned Chef', value: 'Counter 2 · Ramesh' },
    ],
    fulfilmentPairs: [
      { label: 'Fulfilment', value: 'Counter pickup' },
      { label: 'Pickup Window', value: 'Closed 08:19 AM' },
      { label: 'Collected By', value: 'Student · ID scan' },
      { label: 'Location', value: 'Main Block Cafeteria' },
    ],
    notes: 'Completed in 14 minutes end to end. Receipt RCP-2026-1845 emailed to the guardian.',
  },
  {
    id: 'ORD-2026-1846', customer: 'Mr. David Kim', avatar: 'assets/img/teachers/teacher-04.jpg',
    customerLine: 'Warden · EMP-2020-027', customerType: 'Staff',
    items: [{ name: 'Grilled Paneer Wrap', qty: 2, price: 1.8 }],
    date: '31 Jul 2026', time: '04:12 PM', method: 'Card',
    paymentStatus: 'Paid', status: 'Ready for Pickup',
    orderType: 'Takeaway', counter: 'Counter 5 · staff', prepMinutes: 9, credit: 0,
    summaryPairs: [
      { label: 'Order Type', value: 'Takeaway' },
      { label: 'Counter', value: 'Counter 5 · staff' },
      { label: 'Rate Applied', value: 'Staff rate · +$0.30 / item' },
      { label: 'Placed Via', value: 'Counter' },
      { label: 'Token', value: 'T-052' },
    ],
    paymentPairs: [
      { label: 'Method', value: 'Card · ending 4471' },
      { label: 'Meal Plan Credit', value: 'Not applicable' },
      { label: 'Amount Charged', value: '$3.60' },
      { label: 'Approval Code', value: 'A-88231' },
      { label: 'Reference', value: 'PAY-2026-9921' },
    ],
    preparationPairs: [
      { label: 'Order Received', value: '04:12 PM' },
      { label: 'Kitchen Accepted', value: '04:13 PM' },
      { label: 'Preparation Done', value: '04:21 PM' },
      { label: 'Ready Since', value: '3 minutes' },
      { label: 'Assigned Chef', value: 'Counter 5 · Anita' },
    ],
    fulfilmentPairs: [
      { label: 'Fulfilment', value: 'Counter pickup' },
      { label: 'Pickup Window', value: 'Until 05:00 PM' },
      { label: 'Collected By', value: 'Pending collection' },
      { label: 'Location', value: 'Staff Dining Room' },
    ],
    notes: 'Second wrap is for the night-shift warden. Holding time on wraps is capped at 20 minutes.',
  },
  {
    id: 'ORD-2026-1847', customer: 'Julie Scott', avatar: 'assets/img/students/student-06.jpg',
    customerLine: 'VI A · B-208', customerType: 'Student',
    items: [{ name: 'Whole Wheat Sandwich', qty: 2, price: 0.9 }],
    date: '31 Jul 2026', time: '04:35 PM', method: 'Wallet',
    paymentStatus: 'Refunded', status: 'Cancelled',
    orderType: 'Pre-order', counter: 'Counter 1', prepMinutes: 0, credit: 0,
    summaryPairs: [
      { label: 'Order Type', value: 'Pre-order' },
      { label: 'Counter', value: 'Counter 1' },
      { label: 'Meal Plan', value: 'Standard Student Weekly' },
      { label: 'Placed Via', value: 'Student app' },
      { label: 'Token', value: 'Withdrawn' },
    ],
    paymentPairs: [
      { label: 'Method', value: 'Wallet' },
      { label: 'Wallet Charged', value: '$1.80' },
      { label: 'Refunded', value: '$1.80 · 04:41 PM' },
      { label: 'Wallet Balance', value: '$31.20' },
      { label: 'Reference', value: 'REF-2026-0088' },
    ],
    preparationPairs: [
      { label: 'Order Received', value: '04:35 PM' },
      { label: 'Kitchen Accepted', value: 'Not accepted' },
      { label: 'Cancelled At', value: '04:39 PM' },
      { label: 'Cancelled By', value: 'Kitchen · item unavailable' },
      { label: 'Assigned Chef', value: '—' },
    ],
    fulfilmentPairs: [
      { label: 'Fulfilment', value: 'Cancelled before preparation' },
      { label: 'Pickup Window', value: 'Not applicable' },
      { label: 'Collected By', value: '—' },
      { label: 'Location', value: 'Main Block Cafeteria' },
    ],
    notes: 'Whole Wheat Sandwich is out of stock today after the missed bread delivery. Wallet refunded in full.',
  },
  {
    id: 'ORD-2026-1839', customer: 'Kathleen Dison', avatar: 'assets/img/students/student-03.jpg',
    customerLine: 'III A · not assigned', customerType: 'Student',
    items: [
      { name: 'Vegetable Pulao', qty: 1, price: 1.8 },
      { name: 'Fresh Fruit Smoothie', qty: 1, price: 1.1 },
    ],
    date: '30 Jul 2026', time: '01:10 PM', method: 'UPI',
    paymentStatus: 'Failed', status: 'On Hold',
    orderType: 'Takeaway', counter: 'Counter 1', prepMinutes: 0, credit: 0,
    summaryPairs: [
      { label: 'Order Type', value: 'Takeaway' },
      { label: 'Counter', value: 'Counter 1' },
      { label: 'Meal Plan', value: 'Not enrolled · waiting list' },
      { label: 'Placed Via', value: 'Student app' },
      { label: 'Token', value: 'Held' },
    ],
    paymentPairs: [
      { label: 'Method', value: 'UPI' },
      { label: 'Gateway Response', value: 'Timed out at the bank' },
      { label: 'Amount Due', value: '$2.90' },
      { label: 'Retry Window', value: 'Open until 01 Aug' },
      { label: 'Reference', value: 'PAY-2026-9887 · failed' },
    ],
    preparationPairs: [
      { label: 'Order Received', value: '01:10 PM' },
      { label: 'Kitchen Accepted', value: 'Held pending payment' },
      { label: 'Preparation Done', value: '—' },
      { label: 'Held For', value: '1 day 4 hours' },
      { label: 'Assigned Chef', value: '—' },
    ],
    fulfilmentPairs: [
      { label: 'Fulfilment', value: 'Held · awaiting payment' },
      { label: 'Pickup Window', value: 'Reopens on payment' },
      { label: 'Collected By', value: '—' },
      { label: 'Location', value: 'Main Block Cafeteria' },
    ],
    notes: 'UPI gateway timed out. Order held rather than cancelled so the student can retry before 01 Aug.',
  },
];
