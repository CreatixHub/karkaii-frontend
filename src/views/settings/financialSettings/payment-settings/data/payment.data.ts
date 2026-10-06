/* ------------------------------------------------------------------ *
 * The configuration's own facts                                      *
 * ------------------------------------------------------------------ */

export const ENVIRONMENT = 'Production';
export const FINANCIAL_YEAR = '2026 – 2027';
export const LAST_UPDATED = '28 Jul 2026, 4:12 PM';
export const UPDATED_BY = 'Ms. Latha Rao';
export const VALIDATION_RUN = 'Last run 28 Jul, 4:12 PM';

/** Families with an open balance — what publishing reaches. */
export const FAMILIES_AFFECTED = 1284;

export const money = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

/* ------------------------------------------------------------------ *
 * The providers                                                      *
 * ------------------------------------------------------------------ */

export type ProviderState = 'Live' | 'Test mode' | 'Disabled';

export interface Provider {
  id: string;
  name: string;
  note: string;
  icon: string;
  state: ProviderState;
  key: string;
  mode: string;
  fee: string;
  settlement: string;
  /** Share of the year's collection. Null where the provider carries none. */
  share: number | null;
  on: boolean;
  primary?: boolean;
}

export const PROVIDERS: Provider[] = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    note: 'Primary gateway for UPI, cards and net banking',
    icon: 'ti ti-brand-paypal',
    state: 'Live',
    key: 'rzp_live_••••••7K2a',
    mode: 'Production',
    fee: '1.90% + ₹3',
    settlement: 'T + 2 days',
    share: 62,
    on: true,
    primary: true,
  },
  {
    id: 'hdfc',
    name: 'HDFC Payment Gateway',
    note: 'Net banking and school-branded card page',
    icon: 'ti ti-building-bank',
    state: 'Live',
    key: 'hdfc_••••••••41Qe',
    mode: 'Production',
    fee: '1.65% flat',
    settlement: 'T + 1 day',
    share: 21,
    on: true,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    note: 'International cards, used by overseas families',
    icon: 'ti ti-brand-stripe',
    state: 'Test mode',
    key: 'sk_test_••••••9dW1',
    mode: 'Sandbox',
    fee: '2.90% + ₹20',
    settlement: 'T + 7 days',
    share: null,
    on: true,
  },
  {
    id: 'upi',
    name: 'UPI Collect (NPCI)',
    note: 'Direct virtual payment address, no gateway fee',
    icon: 'ti ti-qrcode',
    state: 'Live',
    key: 'karkaii@hdfcbank',
    mode: 'Production',
    fee: 'Nil',
    settlement: 'Same day',
    share: 14,
    on: true,
  },
  {
    id: 'counter',
    name: 'Counter & Cash',
    note: 'Recorded manually by the accounts desk',
    icon: 'ti ti-cash',
    state: 'Live',
    key: 'Receipt book •• series C',
    mode: 'Offline',
    fee: 'Nil',
    settlement: 'On deposit',
    share: 3,
    on: true,
  },
  {
    id: 'payu',
    name: 'PayU',
    note: 'Retired after the 2025–26 year closed',
    icon: 'ti ti-plug-connected-x',
    state: 'Disabled',
    key: 'Credentials removed',
    mode: '—',
    fee: '—',
    settlement: '—',
    share: null,
    on: false,
  },
];

export const providerBadge = (state: ProviderState) =>
  ({ Live: 'is-live', 'Test mode': 'is-test', Disabled: 'is-off' })[state];

/** The routes actually taking money — what the rail's gateway tag counts. */
export const LIVE_PROVIDERS = PROVIDERS.filter((row) => row.state === 'Live').length;

/** The shares the providers carry, which the template expects to make 100. */
export const SHARE_TOTAL = PROVIDERS.reduce((total, row) => total + (row.share ?? 0), 0);

export const shareLabelOf = (row: Provider) => (row.share === null ? '—' : `${row.share}%`);

/* ------------------------------------------------------------------ *
 * The settings rail                                                  *
 * ------------------------------------------------------------------ */

export interface NavLink {
  label: string;
  icon: string;
  /** Route key on `all_routes`, where the page exists. */
  route?: string;
  /** The tag on the right. Null means the area has nothing set yet. */
  tag: string | null;
  /** A tag the template marks as a draft rather than a settled value. */
  draft?: boolean;
  active?: boolean;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Money in',
    links: [
      { label: 'Payment Settings', icon: 'ti ti-credit-card', route: 'paymentSettings', tag: 'Live', active: true },
      {
        label: 'Payment Gateways',
        icon: 'ti ti-plug-connected',
        route: 'paymentGateways',
        tag: String(LIVE_PROVIDERS),
      },
      { label: 'Payment Methods', icon: 'ti ti-wallet', tag: '7' },
      { label: 'Receipt Settings', icon: 'ti ti-receipt-2', tag: 'Set' },
    ],
  },
  {
    title: 'Billing',
    links: [
      { label: 'Invoice Settings', icon: 'ti ti-file-invoice', route: 'invoiceSettings', tag: 'Set' },
      { label: 'Tax Rates', icon: 'ti ti-percentage', route: 'taxRates', tag: '5' },
      { label: 'Currency Settings', icon: 'ti ti-currency-rupee', tag: 'INR' },
      { label: 'Financial Years', icon: 'ti ti-calendar-stats', tag: '2' },
    ],
  },
  {
    title: 'Fee policy',
    links: [
      { label: 'Fee Rules', icon: 'ti ti-report-money', route: 'feeRules', tag: '12' },
      { label: 'Discount Rules', icon: 'ti ti-discount-2', route: 'discountRules', tag: '6' },
      { label: 'Late Fee Rules', icon: 'ti ti-alarm', tag: 'Draft', draft: true },
      { label: 'Scholarship Settings', icon: 'ti ti-school', tag: '3' },
    ],
  },
  {
    title: 'Governance',
    links: [
      { label: 'Refund Settings', icon: 'ti ti-arrow-back-up', tag: 'Set' },
      { label: 'Accounting Settings', icon: 'ti ti-calculator', tag: 'Tally' },
      { label: 'Finance Approvals', icon: 'ti ti-checkup-list', tag: '3' },
      { label: 'Financial Preferences', icon: 'ti ti-adjustments-alt', tag: null },
    ],
  },
];

export const NAV_LINKS = NAV_GROUPS.flatMap((group) => group.links);

/** Areas with something set against them — draft counts, blank does not. */
export const CONFIGURED_AREAS = NAV_LINKS.filter((link) => link.tag !== null).length;
export const TOTAL_AREAS = NAV_LINKS.length;
export const READINESS = Math.floor((CONFIGURED_AREAS / TOTAL_AREAS) * 100);

/* ------------------------------------------------------------------ *
 * The General tab                                                    *
 * ------------------------------------------------------------------ */

export type RowKind = 'select' | 'text' | 'money' | 'switch';

export interface SettingRow {
  key: string;
  note: string;
  kind: RowKind;
  /** Options for a select; the first is the one the template preselects. */
  options?: string[];
  /** Starting value for a text or money field. */
  value?: string;
  /** Starting position for a switch. */
  on?: boolean;
}

export interface SettingCard {
  id: string;
  title: string;
  note: string;
  icon: string;
  /** Tint modifier on the card icon: "is-money", "is-warn" or none. */
  tone?: string;
  /** Badge state: published, or how many rows are still drafts. */
  drafts: number;
  rows: SettingRow[];
}

export const SETTING_CARDS: SettingCard[] = [
  {
    id: 'general',
    title: 'General Configuration',
    note: 'Applies to the whole institution',
    icon: 'ti ti-adjustments',
    drafts: 0,
    rows: [
      {
        key: 'Institution',
        note: 'Configuration applies to this school only',
        kind: 'select',
        options: ['Global International', 'Sunrise Public School', 'Riverside Academy'],
      },
      {
        key: 'Financial year',
        note: 'Payments are posted against this year',
        kind: 'select',
        options: ['2026 – 2027', '2025 – 2026'],
      },
      {
        key: 'Base currency',
        note: 'Every amount below is stored in this currency',
        kind: 'select',
        options: ['INR — Indian Rupee', 'USD — US Dollar'],
      },
      {
        key: 'Settlement account',
        note: 'Where collected money lands',
        kind: 'select',
        options: ['HDFC · A/c …4471', 'ICICI · A/c …9082'],
      },
      {
        key: 'Support email on receipts',
        note: 'Printed on every receipt and payment failure notice',
        kind: 'text',
        value: 'fees@karkaii.edu',
      },
    ],
  },
  {
    id: 'defaults',
    title: 'Default Settings',
    note: 'What a parent sees before choosing',
    icon: 'ti ti-coin',
    tone: 'is-money',
    drafts: 2,
    rows: [
      {
        key: 'Default payment method',
        note: 'Pre-selected when a parent opens the payment screen',
        kind: 'select',
        options: ['UPI', 'Net banking', 'Card', 'Cash at counter'],
      },
      {
        key: 'Minimum payable amount',
        note: 'Payments below this are refused at the gateway',
        kind: 'money',
        value: '100',
      },
      {
        key: 'Maximum single payment',
        note: 'Larger amounts must be split or paid by transfer',
        kind: 'money',
        value: '2,00,000',
      },
      {
        key: 'Part payment',
        note: 'Allow a parent to pay a fee in instalments',
        kind: 'switch',
        on: true,
      },
      {
        key: 'Auto-allocate to oldest due',
        note: 'A payment clears the earliest outstanding invoice first',
        kind: 'switch',
        on: true,
      },
    ],
  },
  {
    id: 'business',
    title: 'Business Rules',
    note: 'Limits applied at collection time',
    icon: 'ti ti-scale',
    drafts: 0,
    rows: [
      {
        key: 'Payment window',
        note: 'Online collection is open during these hours',
        kind: 'select',
        options: ['24 hours', '06:00 – 23:00', 'School hours only'],
      },
      {
        key: 'Convenience fee',
        note: 'Gateway charge passed to the payer',
        kind: 'select',
        options: ['Absorbed by school', 'Passed to payer', 'Split 50/50'],
      },
      {
        key: 'Receipt numbering',
        note: 'Format used for every receipt this year',
        kind: 'text',
        value: 'RCP/2026-27/0000',
      },
      {
        key: 'Duplicate payment guard',
        note: 'Block an identical amount from the same payer within 5 minutes',
        kind: 'switch',
        on: true,
      },
      {
        key: 'Refuse after due date',
        note: 'Stop online payment once a fee is overdue',
        kind: 'switch',
        on: false,
      },
    ],
  },
];

/** What the card footer counts. */
export const settingsLabelOf = (card: SettingCard) =>
  `${card.rows.length} ${card.rows.length === 1 ? 'setting' : 'settings'}`;

/** What the card badge says. */
export const cardBadgeOf = (card: SettingCard) =>
  card.drafts === 0
    ? { tone: 'is-live', label: 'Published' }
    : { tone: 'is-review', label: `${card.drafts} draft` };

/* ------------------------------------------------------------------ *
 * The validation checks                                              *
 * ------------------------------------------------------------------ */

export interface Check {
  label: string;
  note: string;
  passed: boolean;
}

export const CHECKS: Check[] = [
  {
    label: 'Payer name matches the student record',
    note: 'Mismatches are held for counter verification.',
    passed: true,
  },
  {
    label: 'Amount is within the fee balance',
    note: 'Overpayment is refused rather than credited.',
    passed: true,
  },
  {
    label: 'Settlement account not verified for 2026–27',
    note: 'Penny-drop verification expired on 30 Jun 2026. Payments still settle, but the bank name is not being confirmed.',
    passed: false,
  },
  {
    label: 'Gateway signature verified on every callback',
    note: 'Unsigned callbacks are discarded and logged.',
    passed: true,
  },
];

export const WARNINGS = CHECKS.filter((check) => !check.passed).length;

export const warningLabel = () =>
  `${WARNINGS} ${WARNINGS === 1 ? 'warning' : 'warnings'}`;

/* ------------------------------------------------------------------ *
 * The business rules                                                 *
 * ------------------------------------------------------------------ */

export interface Rule {
  condition: string;
  action: string;
  note: string;
  on: boolean;
}

export const RULES: Rule[] = [
  {
    condition: 'Payment fails twice at the gateway',
    action: 'Offer counter payment and email the parent',
    note: 'Applies to online attempts only. Counter receipts are unaffected.',
    on: true,
  },
  {
    condition: 'Amount is above ₹50,000',
    action: 'Route to net banking or transfer',
    note: 'Card networks decline most large education payments, so they are not offered.',
    on: true,
  },
  {
    condition: 'Sibling discount is active',
    action: 'Apply the discount before the payment page loads',
    note: 'The parent never sees the pre-discount amount, which removes a common support call.',
    on: true,
  },
  {
    condition: 'Fee is more than 15 days overdue',
    action: 'Add the late fee to the payable amount',
    note: 'Held off until the late fee rules are published.',
    on: false,
  },
  {
    condition: 'Payer is on a scholarship',
    action: 'Collect the balance only, never the full fee',
    note: 'The scholarship share is posted against the trust ledger, not the parent.',
    on: true,
  },
  {
    condition: 'Payment is made after 11:00 PM',
    action: 'Post it to the next working day',
    note: 'Keeps the daily collection sheet matching the bank statement.',
    on: true,
  },
  {
    condition: 'Refund is requested within 7 days',
    action: 'Return to the original method automatically',
    note: 'Beyond 7 days a refund needs finance approval.',
    on: true,
  },
];

/** The template numbers the rules 01, 02, … in the order they are evaluated. */
export const ruleNumberOf = (index: number) => String(index + 1).padStart(2, '0');

/* ------------------------------------------------------------------ *
 * The automations                                                    *
 * ------------------------------------------------------------------ */

export interface Dependency {
  label: string;
  icon: string;
}

export interface Feature {
  id: string;
  title: string;
  icon: string;
  text: string;
  deps: Dependency[];
  on: boolean;
}

export const FEATURES: Feature[] = [
  {
    id: 'retry',
    title: 'Automatic retry',
    icon: 'ti ti-repeat',
    text: 'A failed payment is retried once after 30 minutes, then the parent is told to use another method.',
    deps: [
      { label: 'Razorpay', icon: 'ti ti-plug-connected' },
      { label: 'Email templates', icon: 'ti ti-mail' },
    ],
    on: true,
  },
  {
    id: 'receipts',
    title: 'Instant receipts',
    icon: 'ti ti-receipt-2',
    text: 'The receipt is generated and emailed the moment the gateway confirms, before settlement.',
    deps: [
      { label: 'Receipt settings', icon: 'ti ti-file-invoice' },
      { label: 'Email templates', icon: 'ti ti-mail' },
    ],
    on: true,
  },
  {
    id: 'reminders',
    title: 'Payment reminders',
    icon: 'ti ti-bell-ringing',
    text: 'Three reminders before the due date and one after, over email and SMS.',
    deps: [
      { label: 'SMS sender id', icon: 'ti ti-message' },
      { label: 'Fee due dates', icon: 'ti ti-calendar' },
    ],
    on: true,
  },
  {
    id: 'reconciliation',
    title: 'Auto reconciliation',
    icon: 'ti ti-refresh-alert',
    text: 'Bank settlement files are matched against receipts each morning; anything unmatched is queued for the accounts desk.',
    deps: [
      { label: 'Bank feed', icon: 'ti ti-building-bank' },
      { label: 'Accounting settings', icon: 'ti ti-calculator' },
    ],
    on: true,
  },
  {
    id: 'refunds',
    title: 'Automatic refunds',
    icon: 'ti ti-arrow-back-up',
    text: 'Refunds inside the 7-day window return to the original method without anyone touching them.',
    deps: [
      { label: 'Finance approvals', icon: 'ti ti-checkup-list' },
      { label: 'Refund settings', icon: 'ti ti-arrow-back-up' },
    ],
    on: false,
  },
  {
    id: 'latefee',
    title: 'Late fee posting',
    icon: 'ti ti-alarm',
    text: 'Late fees are added to the payable amount overnight rather than by hand.',
    deps: [
      { label: 'Late fee rules', icon: 'ti ti-alarm' },
      { label: 'Grace period', icon: 'ti ti-clock' },
    ],
    on: false,
  },
];

/* ------------------------------------------------------------------ *
 * The information centre                                             *
 * ------------------------------------------------------------------ */

export interface Note {
  id: string;
  title: string;
  icon: string;
  tone?: string;
  items: { lead?: string; text: string }[];
}

export const NOTES: Note[] = [
  {
    id: 'notes',
    title: 'Configuration notes',
    icon: 'ti ti-notes',
    items: [
      {
        text: 'Razorpay is the primary route because it is the only provider that settles UPI, cards and net banking on one reconciliation file.',
      },
      {
        text: 'The ₹2,00,000 ceiling exists because card networks decline most larger education payments outright.',
      },
      {
        text: 'Counter payments bypass every gateway rule and are reconciled against the receipt book.',
      },
    ],
  },
  {
    id: 'recommendations',
    title: 'Recommendations',
    icon: 'ti ti-bulb',
    tone: 'is-money',
    items: [
      {
        text: 'Move Stripe out of sandbox before the September intake — four overseas families are already enrolled.',
      },
      {
        text: 'Turn on automatic refunds once the refund settings are published; it removes roughly 20 manual approvals a month.',
      },
      {
        text: 'Consider passing the convenience fee to the payer for card payments only, and absorbing it on UPI, which costs nothing.',
      },
    ],
  },
  {
    id: 'practices',
    title: 'Best practices',
    icon: 'ti ti-shield-check',
    items: [
      { text: 'Keep at least two live providers so a gateway outage never stops collection.' },
      { text: 'Rotate gateway keys every academic year, at the year close rather than mid-term.' },
      { text: 'Never enable a provider in production until a ₹1 test payment has settled end to end.' },
    ],
  },
  {
    id: 'warnings',
    title: 'Warnings',
    icon: 'ti ti-alert-triangle',
    tone: 'is-warn',
    items: [
      {
        lead: 'Settlement account unverified.',
        text: 'Penny-drop verification expired on 30 Jun 2026.',
      },
      {
        lead: 'Late fee rules are a draft.',
        text: 'Two business rules and one automation are waiting on them.',
      },
      { lead: 'Two unmatched bank entries', text: 'from 24 Jul are still queued for the accounts desk.' },
    ],
  },
];

/** The changes held as drafts — the hero badge and the publish dialog count these. */
export interface Delta {
  setting: string;
  from: string;
  to: string;
  by: string;
  on: string;
}

export const DELTAS: Delta[] = [
  {
    setting: 'Maximum single payment',
    from: '₹1,00,000',
    to: '₹2,00,000',
    by: 'Ms. Latha Rao',
    on: '28 Jul',
  },
  {
    setting: 'Convenience fee',
    from: 'Passed to payer',
    to: 'Absorbed by school',
    by: 'Mr. R. Venkatesh',
    on: '22 Jul',
  },
  { setting: 'PayU', from: 'Live', to: 'Disabled', by: 'Ms. Latha Rao', on: '09 Jul' },
];

export const DRAFT_CHANGES = DELTAS.length;

export interface RelatedLink {
  label: string;
  note: string;
  icon: string;
  route?: string;
}

export const RELATED: RelatedLink[] = [
  { label: 'Invoice Settings', note: 'Numbering and templates', icon: 'ti ti-file-invoice', route: 'invoiceSettings' },
  { label: 'Tax Rates', note: 'Applied to payable amounts', icon: 'ti ti-percentage', route: 'taxRates' },
  { label: 'Fee Rules', note: 'What is owed, and when', icon: 'ti ti-report-money', route: 'feeRules' },
  { label: 'Payment Gateways', note: 'Credentials and endpoints', icon: 'ti ti-plug-connected', route: 'paymentGateways' },
];

/* ------------------------------------------------------------------ *
 * The lifecycle                                                      *
 * ------------------------------------------------------------------ */

export interface Stage {
  title: string;
  icon: string;
  meta: string;
  text: string;
  state: 'done' | 'current' | 'ahead';
}

export const LIFECYCLE: Stage[] = [
  {
    title: 'Created',
    icon: 'ti ti-plus',
    meta: '04 Apr 2026',
    text: 'Configuration cloned from the 2025–26 year and reset to template defaults.',
    state: 'done',
  },
  {
    title: 'Modified',
    icon: 'ti ti-pencil',
    meta: '28 Jul 2026',
    text: 'Three settings changed: payment ceiling, convenience fee and PayU disabled.',
    state: 'done',
  },
  {
    title: 'Published',
    icon: 'ti ti-rocket',
    meta: 'Pending',
    text: `${DRAFT_CHANGES} draft changes are waiting. Publishing makes them live for every payer immediately.`,
    state: 'current',
  },
  {
    title: 'Applied',
    icon: 'ti ti-check',
    meta: '—',
    text: 'The gateway configuration refreshes within two minutes of publishing.',
    state: 'ahead',
  },
  {
    title: 'Audited',
    icon: 'ti ti-file-search',
    meta: 'Quarterly',
    text: 'Next finance audit is due 30 Sep 2026, covering the full change history.',
    state: 'ahead',
  },
];

/* ------------------------------------------------------------------ *
 * The provider workspace panel                                       *
 * ------------------------------------------------------------------ */

export const WORKSPACE_USAGE = [
  { label: 'Payments this year', value: '4,182' },
  { label: 'Value collected', value: '₹3,74,60,500' },
  { label: 'Average payment', value: '₹8,957' },
  { label: 'Failure rate', value: '1.8%' },
  { label: 'Refunds processed', value: '37 · ₹2,14,000' },
];

export const WORKSPACE_DETAIL = [
  { label: 'Provider', value: 'Razorpay Software Pvt Ltd' },
  { label: 'Integration', value: 'Standard checkout, hosted' },
  { label: 'Merchant id', value: 'PRSK00291744' },
  { label: 'Environment', value: ENVIRONMENT },
  { label: 'Connected on', value: '04 Apr 2026' },
];

export const WORKSPACE_SETTINGS: SettingRow[] = [
  {
    key: 'Accept this provider',
    note: 'Show it on the parent payment screen',
    kind: 'switch',
    on: true,
  },
  {
    key: 'Methods offered',
    note: 'What the parent may choose',
    kind: 'select',
    options: ['UPI, cards, net banking', 'UPI only', 'Cards only'],
  },
  {
    key: 'Convenience fee',
    note: 'Who pays the gateway charge',
    kind: 'select',
    options: ['Absorbed by school', 'Passed to payer'],
  },
  {
    key: 'Auto-capture',
    note: 'Capture the payment immediately rather than holding it',
    kind: 'switch',
    on: true,
  },
  {
    key: 'Settlement cycle',
    note: 'How quickly money reaches the school account',
    kind: 'select',
    options: ['T + 2 days', 'T + 1 day', 'Weekly'],
  },
];

export const WORKSPACE_CHECKS: Check[] = [
  {
    label: 'Credentials accepted by the gateway',
    note: 'Verified 28 Jul 2026, 4:12 PM.',
    passed: true,
  },
  {
    label: 'Callback signature valid',
    note: 'Last 500 callbacks all signed correctly.',
    passed: true,
  },
  {
    label: 'Settlement account not re-verified',
    note: 'Penny-drop verification expired 30 Jun 2026.',
    passed: false,
  },
  { label: 'Refund endpoint reachable', note: 'Checked hourly.', passed: true },
];

export const WORKSPACE_DEPENDENCIES = [
  'Currency settings',
  'Receipt settings',
  'Accounting mapping',
  'Email templates',
];

export interface AuditEntry {
  date: string;
  time: string;
  what: string;
  who: string;
}

export const WORKSPACE_AUDIT: AuditEntry[] = [
  {
    date: '28 Jul 2026',
    time: '4:12 PM',
    what: 'Payment ceiling raised to ₹2,00,000',
    who: 'Ms. Latha Rao · approved by Principal',
  },
  {
    date: '22 Jul 2026',
    time: '11:40 AM',
    what: 'Convenience fee moved to the school',
    who: 'Mr. R. Venkatesh · trust resolution 2026/14',
  },
  {
    date: '11 Jun 2026',
    time: '9:05 AM',
    what: 'Live keys rotated for the new year',
    who: 'Ms. Latha Rao',
  },
  {
    date: '04 Apr 2026',
    time: '3:22 PM',
    what: 'Provider connected and verified',
    who: 'System · ₹1 test payment settled',
  },
];

/* ------------------------------------------------------------------ *
 * The dialogs' options                                               *
 * ------------------------------------------------------------------ */

export const ENVIRONMENTS = ['Production', 'Staging', 'Sandbox'];

export const IMPORT_SOURCES = [
  'Configuration file (.json)',
  'Sunrise Public School · 2026-27',
  'Riverside Academy · 2026-27',
  'Previous year · 2025-26',
];

export const EXPORT_FORMATS = [
  'JSON — re-importable',
  'PDF — for the finance audit',
  'CSV — settings list only',
];

export const ENABLE_TARGETS = ['Automatic refunds', 'Late fee posting', 'Custom payment provider'];

export const PUBLISH_WHEN = [
  'Immediately',
  'At midnight tonight',
  'On 01 Aug 2026, start of the new month',
];

/** Settings the General tab actually shows. */
export const TOTAL_SETTINGS = SETTING_CARDS.reduce((total, card) => total + card.rows.length, 0);

/**
 * Settings in the whole configuration, which the restore and export dialogs
 * count. It spans areas the workspace does not show — the rail's sixteen — so
 * it stays the template's own figure rather than a count of `SETTING_CARDS`.
 */
export const SETTINGS_ON_RECORD = 21;

/** Automations currently running — what the restore dialog would switch off. */
export const RUNNING_AUTOMATIONS = FEATURES.filter((row) => row.on).length;
