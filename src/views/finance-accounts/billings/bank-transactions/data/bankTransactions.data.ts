export type ReconStatus = 'Reconciled' | 'Pending' | 'In Clearing' | 'Unmatched';
export type TxnType = 'Credit' | 'Debit';

export interface InfoLine {
  label: string;
  value: string;
}

export interface BankTxn {
  id: string;
  txnId: string;
  date: string;
  time: string;
  account: string;
  accountMask: string;
  description: string;
  referenceNo: string;
  paymentMethod: string;
  /** Positive for a credit, negative for a debit. */
  amount: number;
  balance: number;
  status: ReconStatus;
  /** Detail panel. */
  details: InfoLine[];
  bankReference: InfoLine[];
  linked: { title: string; note: string } | null;
  student: { name: string; meta: string } | null;
  notes: string;
}

export const statusPill: Record<ReconStatus, string> = {
  Reconciled: 'is-active',
  Pending: 'is-pending',
  'In Clearing': 'is-review',
  Unmatched: 'is-blocked',
};

export const statusBadge: Record<ReconStatus, string> = {
  Reconciled: 'badge badge-soft-success',
  Pending: 'badge badge-soft-warning',
  'In Clearing': 'badge badge-soft-info',
  Unmatched: 'badge badge-soft-danger',
};

export const bankTransactions: BankTxn[] = [
  {
    id: 'TXN-2026-1184', txnId: 'TXN-2026-1184', date: '30 Jul 2026', time: '10:26 AM',
    account: 'Operating Account', accountMask: '•••• 8842',
    description: 'Fee collection — Counter deposit', referenceNo: 'CASH-0521',
    paymentMethod: 'Cash', amount: 1900, balance: 214860, status: 'Reconciled',
    details: [
      { label: 'Value Date', value: '30 Jul 2026' },
      { label: 'Posted By', value: 'Sarah Rose' },
      { label: 'Channel', value: 'Branch deposit' },
      { label: 'Currency', value: 'USD' },
    ],
    bankReference: [
      { label: 'Bank', value: 'First National Bank' },
      { label: 'Statement Ref', value: 'ST-2026-0730-014' },
      { label: 'UTR / Trace', value: 'FNB88421073' },
      { label: 'Branch', value: 'Main Branch · 0021' },
    ],
    linked: { title: 'Receipt · RCP-2026-0521', note: 'Invoice INV-2026-0441 · Tuition Fee' },
    student: { name: 'Janet Daniel', meta: 'III A · AD9892434' },
    notes: 'Counter deposit matched against the statement on the same day.',
  },
  {
    id: 'TXN-2026-1183', txnId: 'TXN-2026-1183', date: '29 Jul 2026', time: '03:14 PM',
    account: 'Operating Account', accountMask: '•••• 8842',
    description: 'Online fee payment — Parent portal', referenceNo: 'UPI-88213470',
    paymentMethod: 'UPI', amount: 640, balance: 212960, status: 'Reconciled',
    details: [
      { label: 'Value Date', value: '29 Jul 2026' },
      { label: 'Posted By', value: 'Gateway' },
      { label: 'Channel', value: 'Payment gateway' },
      { label: 'Currency', value: 'USD' },
    ],
    bankReference: [
      { label: 'Bank', value: 'First National Bank' },
      { label: 'Statement Ref', value: 'ST-2026-0729-108' },
      { label: 'UTR / Trace', value: 'RZP70051993' },
      { label: 'Gateway', value: 'RazorPay' },
    ],
    linked: { title: 'Receipt · RCP-2026-0520', note: 'Invoice INV-2026-0332 · Tuition Fee' },
    student: { name: 'Kathleen Dison', meta: 'III A · AD9892432' },
    notes: 'Auto-matched by the gateway settlement file.',
  },
  {
    id: 'TXN-2026-1182', txnId: 'TXN-2026-1182', date: '29 Jul 2026', time: '03:14 PM',
    account: 'Operating Account', accountMask: '•••• 8842',
    description: 'Payment gateway charges — July', referenceNo: 'RZP-FEE-0729',
    paymentMethod: 'Auto Debit', amount: -6.4, balance: 212954, status: 'Pending',
    details: [
      { label: 'Value Date', value: '29 Jul 2026' },
      { label: 'Posted By', value: 'Gateway' },
      { label: 'Channel', value: 'Auto debit' },
      { label: 'Currency', value: 'USD' },
    ],
    bankReference: [
      { label: 'Bank', value: 'First National Bank' },
      { label: 'Statement Ref', value: 'ST-2026-0729-109' },
      { label: 'UTR / Trace', value: 'RZP70051994' },
      { label: 'Gateway', value: 'RazorPay' },
    ],
    linked: null,
    student: null,
    notes: 'Imported from statement. Awaiting allocation to the gateway charges ledger.',
  },
  {
    id: 'TXN-2026-1179', txnId: 'TXN-2026-1179', date: '29 Jul 2026', time: '11:08 AM',
    account: 'Operating Account', accountMask: '•••• 8842',
    description: 'Fee collection — NEFT inward', referenceNo: 'NEFT-4471209',
    paymentMethod: 'Bank Transfer', amount: 880, balance: 212960, status: 'Reconciled',
    details: [
      { label: 'Value Date', value: '29 Jul 2026' },
      { label: 'Posted By', value: 'Sarah Rose' },
      { label: 'Channel', value: 'NEFT inward' },
      { label: 'Currency', value: 'USD' },
    ],
    bankReference: [
      { label: 'Bank', value: 'First National Bank' },
      { label: 'Statement Ref', value: 'ST-2026-0729-041' },
      { label: 'UTR / Trace', value: 'N447120926' },
      { label: 'Remitter', value: 'Mark Boswell' },
    ],
    linked: { title: 'Receipt · RCP-2026-0519', note: 'Invoice INV-2026-0418 · Tuition Fee' },
    student: { name: 'Susan Boswell', meta: 'IV A · AD9892428' },
    notes: 'Remitter name matched to the guardian on file.',
  },
  {
    id: 'TXN-2026-1175', txnId: 'TXN-2026-1175', date: '28 Jul 2026', time: '06:40 PM',
    account: 'Payroll Account', accountMask: '•••• 5510',
    description: 'Salary disbursement — July payroll', referenceNo: 'PAY-JUL-2026',
    paymentMethod: 'Bulk Transfer', amount: -48620, balance: 62340, status: 'Reconciled',
    details: [
      { label: 'Value Date', value: '28 Jul 2026' },
      { label: 'Posted By', value: 'Finance Manager' },
      { label: 'Channel', value: 'Bulk transfer' },
      { label: 'Currency', value: 'USD' },
    ],
    bankReference: [
      { label: 'Bank', value: 'Union Bank' },
      { label: 'Statement Ref', value: 'ST-2026-0728-002' },
      { label: 'UTR / Trace', value: 'UB55108842' },
      { label: 'Branch', value: 'Corporate · 0104' },
    ],
    linked: { title: 'Payroll Run · PR-2026-07', note: '84 employees · July 2026 cycle' },
    student: null,
    notes: 'Matched against the July payroll register.',
  },
  {
    id: 'TXN-2026-1171', txnId: 'TXN-2026-1171', date: '27 Jul 2026', time: '02:52 PM',
    account: 'Operating Account', accountMask: '•••• 8842',
    description: 'Cheque deposit — Exam fee', referenceNo: 'CHQ-220148',
    paymentMethod: 'Cheque', amount: 310, balance: 110960, status: 'In Clearing',
    details: [
      { label: 'Value Date', value: '02 Aug 2026' },
      { label: 'Posted By', value: 'Sarah Rose' },
      { label: 'Channel', value: 'Cheque deposit' },
      { label: 'Currency', value: 'USD' },
    ],
    bankReference: [
      { label: 'Bank', value: 'First National Bank' },
      { label: 'Statement Ref', value: 'Pending' },
      { label: 'Cheque No', value: 'CHQ-220148' },
      { label: 'Drawn On', value: 'Union Bank' },
    ],
    linked: { title: 'Receipt · RCP-2026-0516', note: 'Invoice INV-2026-0447 · Exam Fee' },
    student: { name: 'Ralph Claudia', meta: 'V A · AD9892430' },
    notes: 'Cheque in clearing; expected value date 02 Aug 2026.',
  },
  {
    id: 'TXN-2026-1166', txnId: 'TXN-2026-1166', date: '26 Jul 2026', time: '09:20 AM',
    account: 'Operating Account', accountMask: '•••• 8842',
    description: 'Refund issued — Duplicate hostel payment', referenceNo: 'PAY-70051822-R',
    paymentMethod: 'Online', amount: -1050, balance: 110650, status: 'Reconciled',
    details: [
      { label: 'Value Date', value: '26 Jul 2026' },
      { label: 'Posted By', value: 'Finance Manager' },
      { label: 'Channel', value: 'Gateway refund' },
      { label: 'Currency', value: 'USD' },
    ],
    bankReference: [
      { label: 'Bank', value: 'First National Bank' },
      { label: 'Statement Ref', value: 'ST-2026-0726-077' },
      { label: 'UTR / Trace', value: 'STR70051822R' },
      { label: 'Gateway', value: 'Stripe' },
    ],
    linked: { title: 'Receipt · RCP-2026-0509', note: 'Invoice INV-2026-0429 · Hostel Fee' },
    student: { name: 'Lisa Gourley', meta: 'II B · AD9892431' },
    notes: 'Duplicate payment refunded to source and matched on the same statement.',
  },
  {
    id: 'TXN-2026-1158', txnId: 'TXN-2026-1158', date: '24 Jul 2026', time: '08:05 AM',
    account: 'Operating Account', accountMask: '•••• 8842',
    description: 'Unidentified inward credit', referenceNo: 'NEFT-9930447',
    paymentMethod: 'Bank Transfer', amount: 1240, balance: 111700, status: 'Unmatched',
    details: [
      { label: 'Value Date', value: '24 Jul 2026' },
      { label: 'Posted By', value: 'Statement import' },
      { label: 'Channel', value: 'NEFT inward' },
      { label: 'Currency', value: 'USD' },
    ],
    bankReference: [
      { label: 'Bank', value: 'First National Bank' },
      { label: 'Statement Ref', value: 'ST-2026-0724-019' },
      { label: 'UTR / Trace', value: 'N993044726' },
      { label: 'Remitter', value: 'R. K. Enterprises' },
    ],
    linked: null,
    student: null,
    notes: 'Imported from statement. Remitter not matched to any student or vendor record.',
  },
];

/* -------------------------------- Derivations ------------------------------- */

export const money = (value: number): string =>
  `$${Math.abs(value).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

export const txnType = (row: BankTxn): TxnType => (row.amount >= 0 ? 'Credit' : 'Debit');

export const amountBand = (row: BankTxn): string => {
  const value = Math.abs(row.amount);
  if (value < 500) return 'Under $500';
  if (value <= 2000) return '$500 – $2,000';
  if (value <= 10000) return '$2,000 – $10,000';
  return 'Over $10,000';
};

export const linkedBand = (row: BankTxn): string => {
  if (!row.linked) return 'Not linked';
  if (row.linked.title.startsWith('Receipt')) return 'Linked to receipt';
  if (row.linked.title.startsWith('Payroll')) return 'Linked to payroll';
  return 'Linked to invoice';
};

export const accountOptions = [
  'Operating Account · 8842',
  'Payroll Account · 5510',
  'Reserve Account · 3307',
];

/** "Operating Account" + "•••• 8842" → "Operating Account · 8842". */
export const accountKey = (row: BankTxn): string =>
  `${row.account} · ${row.accountMask.replace(/[^0-9]/g, '')}`;
