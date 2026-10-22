export type AccountType = 'Asset' | 'Liability' | 'Income' | 'Expense' | 'Equity';
export type LedgerStatus = 'Active' | 'Inactive' | 'Unposted' | 'Locked';
export type BalanceSide = 'Dr' | 'Cr';

export interface LedgerAccount {
  id: string;
  code: string;
  name: string;
  group: string;
  type: AccountType;
  /** Normal balance side; drives the closing-balance arithmetic. */
  side: BalanceSide;
  opening: number;
  debit: number;
  credit: number;
  lastTransaction: string;
  lastTransactionAgo: string;
  status: LedgerStatus;
  financialYear: string;
  costCentre: string;
  notes: string;
}

export const typeTint: Record<AccountType, string> = {
  Asset: 'primary',
  Liability: 'warning',
  Income: 'success',
  Expense: 'danger',
  Equity: 'info',
};

export const statusPill: Record<LedgerStatus, string> = {
  Active: 'is-active',
  Inactive: 'is-inactive',
  Unposted: 'is-pending',
  Locked: 'is-suspended',
};

export const statusBadge: Record<LedgerStatus, string> = {
  Active: 'badge badge-soft-success',
  Inactive: 'badge badge-soft-secondary',
  Unposted: 'badge badge-soft-warning',
  Locked: 'badge badge-soft-dark',
};

export const ledgerAccounts: LedgerAccount[] = [
  { id: 'LGR-4001', code: 'LGR-4001', name: 'Fee Income', group: 'Direct Income', type: 'Income', side: 'Cr', opening: 0, debit: 3180, credit: 196420, lastTransaction: '30 Jul 2026', lastTransactionAgo: 'today', status: 'Active', financialYear: '2026 – 2027', costCentre: 'Academic', notes: 'Primary tuition and term-fee collection account.' },
  { id: 'LGR-4002', code: 'LGR-4002', name: 'Transport Income', group: 'Direct Income', type: 'Income', side: 'Cr', opening: 0, debit: 160, credit: 18940, lastTransaction: '28 Jul 2026', lastTransactionAgo: '2 days ago', status: 'Active', financialYear: '2026 – 2027', costCentre: 'Transport', notes: 'Route fees, net of the mid-term route withdrawal refund.' },
  { id: 'LGR-1001', code: 'LGR-1001', name: 'Operating Bank Account', group: 'Bank Accounts', type: 'Asset', side: 'Dr', opening: 96420, debit: 182540, credit: 64100, lastTransaction: '30 Jul 2026', lastTransactionAgo: 'today', status: 'Active', financialYear: '2026 – 2027', costCentre: 'Finance', notes: 'First National · 8842. Day-to-day collections and payments.' },
  { id: 'LGR-1002', code: 'LGR-1002', name: 'Payroll Bank Account', group: 'Bank Accounts', type: 'Asset', side: 'Dr', opening: 110960, debit: 0, credit: 48620, lastTransaction: '28 Jul 2026', lastTransactionAgo: '2 days ago', status: 'Active', financialYear: '2026 – 2027', costCentre: 'Payroll', notes: 'Union Bank · 5510. Funded monthly ahead of the payroll run.' },
  { id: 'LGR-5001', code: 'LGR-5001', name: 'Salaries & Wages', group: 'Direct Expenses', type: 'Expense', side: 'Dr', opening: 291720, debit: 48620, credit: 0, lastTransaction: '28 Jul 2026', lastTransactionAgo: '2 days ago', status: 'Active', financialYear: '2026 – 2027', costCentre: 'Payroll', notes: 'July cycle posted from the payroll register.' },
  { id: 'LGR-5004', code: 'LGR-5004', name: 'Scholarship Expense', group: 'Indirect Expenses', type: 'Expense', side: 'Dr', opening: 18240, debit: 4660, credit: 0, lastTransaction: '30 Jul 2026', lastTransactionAgo: 'today', status: 'Active', financialYear: '2026 – 2027', costCentre: 'Academic Welfare', notes: 'Concessions granted against approved scholarship awards.' },
  { id: 'LGR-5008', code: 'LGR-5008', name: 'Bank & Gateway Charges', group: 'Indirect Expenses', type: 'Expense', side: 'Dr', opening: 1940, debit: 142, credit: 0, lastTransaction: '29 Jul 2026', lastTransactionAgo: 'yesterday', status: 'Unposted', financialYear: '2026 – 2027', costCentre: 'Finance', notes: 'July gateway charges imported but not yet posted to the ledger.' },
  { id: 'LGR-2001', code: 'LGR-2001', name: 'Fees Received in Advance', group: 'Current Liabilities', type: 'Liability', side: 'Cr', opening: 14600, debit: 8200, credit: 6480, lastTransaction: '30 Jun 2026', lastTransactionAgo: '30 days ago', status: 'Locked', financialYear: '2026 – 2027', costCentre: 'Finance', notes: 'Locked after the Q1 close; reopen via the finance manager.' },
];

/* -------------------------------- Derivations ------------------------------- */

export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

/** Double-entry closing balance, respecting the account's normal side. */
export const closingBalance = (row: LedgerAccount): number =>
  row.side === 'Dr' ? row.opening + row.debit - row.credit : row.opening + row.credit - row.debit;

export const balanceTypeOf = (row: LedgerAccount): string => {
  const closing = closingBalance(row);
  if (closing === 0) return 'Nil balance';
  return row.side === 'Dr' ? 'Debit balance' : 'Credit balance';
};

export const ledgerGroupOptions = [
  'Bank Accounts',
  'Current Assets',
  'Current Liabilities',
  'Direct Income',
  'Indirect Income',
  'Direct Expenses',
  'Indirect Expenses',
  'Capital',
];

export const costCentreOptions = ['Academic', 'Academic Welfare', 'Payroll', 'Finance', 'Transport', 'Hostel'];
