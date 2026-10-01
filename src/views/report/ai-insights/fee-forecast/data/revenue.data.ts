import { addDays, daysBetween } from '../../data/dates';
import { LAST_RUN, RUN_DATE } from '../../data/registers';

export { LAST_RUN, RUN_DATE };

/* ------------------------------------------------------------------ *
 * The forecast                                                       *
 * ------------------------------------------------------------------ */

/** Open cases the engine reads. */
export const OPEN_CASES = 128;
/** Terms of payment behaviour behind every figure. */
export const TERMS_ON_RECORD = 4;

/** The term-end forecast, and the range around it. */
export const FORECAST = { expected: 1_840_000, best: 1_910_000, low: 1_720_000 };
/** What the same term actually collected a year ago. */
export const LAST_TERM_ACTUAL = 1_732_000;

/** The window the forecast runs to. */
export const FORECAST_TO = '30 Sep 2026';

/** How the school reads today. */
export const REVENUE_HEALTH = 86;
export const CASHFLOW_CONFIDENCE = 92;
export const FORECAST_ACCURACY = 94.2;

/** What the ledger carries as risk, and what is actually at risk. */
export const LEDGER_RISK = 412_000;
export const TRUE_EXPOSURE = 84_000;

/** The nine cases that carry a third of the balance and answer a first reminder. */
export const REMINDER_WINS = 312_000;
export const REMINDER_CASES = 9;

/** Money in dollars, written the way the page writes it. */
export const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

/** The same, shortened — $1.84M, $312K. */
export const shortMoney = (amount: number) => {
  const sign = amount < 0 ? '−' : '';
  const value = Math.abs(amount);
  if (value >= 1_000_000) return `${sign}$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${sign}$${Math.round(value / 1_000)}K`;
  return `${sign}$${value}`;
};

/** Growth on last term, from the two figures rather than beside them. */
export const REVENUE_GROWTH =
  Math.round(((FORECAST.expected - LAST_TERM_ACTUAL) / LAST_TERM_ACTUAL) * 1000) / 10;

/** How wide the forecast range is once the largest cases resolve. */
export const FORECAST_SPREAD = FORECAST.best - FORECAST.low;

/* ------------------------------------------------------------------ *
 * The bands                                                          *
 * ------------------------------------------------------------------ */

/** What a collection probability means, and how it is drawn. */
export const PROBABILITY_BANDS = [
  { floor: 90, band: 'Likely', tone: 'is-likely' },
  { floor: 70, band: 'Watch', tone: 'is-watch' },
  { floor: 50, band: 'Slow', tone: 'is-slow' },
  { floor: 0, band: 'At risk', tone: 'is-risk' },
];

export const bandOf = (probability: number) =>
  PROBABILITY_BANDS.find((entry) => probability >= entry.floor) ?? PROBABILITY_BANDS[3];

/** Segments in a probability bar. */
export const PROB_SEGMENTS = 10;

export const probBarOf = (probability: number) => {
  const lit = Math.round((probability / 100) * PROB_SEGMENTS);
  return Array.from({ length: PROB_SEGMENTS }, (_, index) => (index < lit ? 'on' : ''));
};

/* ------------------------------------------------------------------ *
 * A case                                                             *
 * ------------------------------------------------------------------ */

export interface RevenueCase {
  id: string;
  parent: string;
  parentImage: string;
  student: string;
  className: string;
  /** Billed this term, and paid against it. */
  billed: number;
  paid: number;
  raisedOn: string;
  dueOn: string;
  /** Where the engine expects it to land, or null when it cannot say. */
  predictedOn: string | null;
  probability: number;
  confidence: number;
  behaviour: string;
  pattern: 'Prompt' | 'Reminder-led' | 'Payday-fixed' | 'Hardship';
  strategy: string;
  /** Terms on record, and how many were paid in full. */
  termsOnRecord: number;
  termsPaidInFull: number;
}

const seeded: RevenueCase[] = [
  {
    id: 'REV-2041',
    parent: 'Mr. James Walker',
    parentImage: 'assets/img/parents/parent-01.jpg',
    student: 'Liam Walker',
    className: 'Class IV-B',
    billed: 1250,
    paid: 0,
    raisedOn: '01 Jul 2026',
    dueOn: '15 Jul 2026',
    predictedOn: '18 Aug 2026',
    probability: 90,
    confidence: 96,
    behaviour: 'Pays after first reminder',
    pattern: 'Reminder-led',
    strategy: 'One friendly reminder by WhatsApp. This family has never needed a second.',
    termsOnRecord: 8,
    termsPaidInFull: 8,
  },
  {
    id: 'REV-1876',
    parent: 'Mrs. Anita Sethi',
    parentImage: 'assets/img/parents/parent-02.jpg',
    student: 'Kabir Sethi',
    className: 'Class VIII-A',
    billed: 2400,
    paid: 0,
    raisedOn: '01 Jul 2026',
    dueOn: '07 Aug 2026',
    predictedOn: '14 Aug 2026',
    probability: 100,
    confidence: 97,
    behaviour: 'Pays early, every term',
    pattern: 'Prompt',
    strategy: 'No action needed. Sending a reminder here has historically achieved nothing.',
    termsOnRecord: 8,
    termsPaidInFull: 8,
  },
  {
    id: 'REV-1655',
    parent: 'Mr. Peter Kettut',
    parentImage: 'assets/img/parents/parent-03.jpg',
    student: 'George Kettut',
    className: 'Class II-A',
    billed: 980,
    paid: 0,
    raisedOn: '01 Jul 2026',
    dueOn: '29 Jul 2026',
    predictedOn: '22 Aug 2026',
    probability: 70,
    confidence: 93,
    behaviour: 'Pays on the 22nd, every month',
    pattern: 'Payday-fixed',
    strategy: 'Wait until the 22nd before contacting. The pattern has held for eleven months.',
    termsOnRecord: 6,
    termsPaidInFull: 6,
  },
  {
    id: 'REV-1420',
    parent: 'Mrs. Carmen Reyes',
    parentImage: 'assets/img/parents/parent-04.jpg',
    student: 'Sophia Reyes',
    className: 'Class VIII-A',
    billed: 1850,
    paid: 0,
    raisedOn: '01 Jul 2026',
    dueOn: '11 Jul 2026',
    predictedOn: '02 Sep 2026',
    probability: 60,
    confidence: 90,
    behaviour: 'Splits payments unprompted',
    pattern: 'Reminder-led',
    strategy: 'Offer a three-part instalment. She has already been paying in parts without one.',
    termsOnRecord: 4,
    termsPaidInFull: 4,
  },
  {
    id: 'REV-1198',
    parent: 'Mr. Ravi Menon',
    parentImage: 'assets/img/parents/parent-05.jpg',
    student: 'Aarav Menon',
    className: 'Class VI-B',
    billed: 3100,
    paid: 0,
    raisedOn: '01 Jun 2026',
    dueOn: '28 Jun 2026',
    predictedOn: null,
    probability: 30,
    confidence: 88,
    behaviour: 'Two terms late, no contact',
    pattern: 'Hardship',
    strategy: 'Scholarship review before escalation. The hardship criteria are already met.',
    termsOnRecord: 5,
    termsPaidInFull: 3,
  },
  {
    id: 'REV-1042',
    parent: 'Mrs. Lucia Fernandes',
    parentImage: 'assets/img/parents/parent-06.jpg',
    student: 'Maria Fernandes',
    className: 'Class IX-C',
    billed: 2750,
    paid: 0,
    raisedOn: '01 Jun 2026',
    dueOn: '15 Jun 2026',
    predictedOn: null,
    probability: 20,
    confidence: 86,
    behaviour: 'No response on any channel',
    pattern: 'Hardship',
    strategy: 'Try phone and post before escalating. Every digital channel has gone unanswered.',
    termsOnRecord: 5,
    termsPaidInFull: 2,
  },
];

/** The cases, ordered the way the queue shows them: strongest prospect first. */
export const CASES: RevenueCase[] = [...seeded].sort((a, b) => b.probability - a.probability);

/** The case the page's findings and workspace are written about. */
export const FEATURED = CASES.find((row) => row.id === 'REV-2041') ?? CASES[0];

/** What is still owed on a case. */
export const outstandingOf = (row: RevenueCase) => Math.max(0, row.billed - row.paid);

/** Days past the due date, negative when it has not fallen due yet. */
export const daysOverdueOf = (row: RevenueCase) => daysBetween(row.dueOn, RUN_DATE);

/** The chip the card carries about timing. */
export const timingLabelOf = (row: RevenueCase) => {
  const days = daysOverdueOf(row);
  if (days > 0) return `Overdue ${days} days`;
  if (days === 0) return 'Due today';
  return `Due in ${Math.abs(days)} days`;
};

/** Whether a case is only slow, or genuinely exposed. */
export const isTrueRiskOf = (row: RevenueCase) => row.termsPaidInFull < row.termsOnRecord;

/** What the roster owes between them. */
export const OUTSTANDING_TOTAL = CASES.reduce((total, row) => total + outstandingOf(row), 0);

/** Of that, what is genuinely at risk rather than merely late. */
export const ROSTER_EXPOSURE = CASES.filter(isTrueRiskOf).reduce(
  (total, row) => total + outstandingOf(row),
  0,
);

/** The four patterns every account resolves into. */
export const PATTERNS = ['Prompt', 'Reminder-led', 'Payday-fixed', 'Hardship'];

/** How many of the roster carry each pattern. */
export const countByPattern = (pattern: string) =>
  CASES.filter((row) => row.pattern === pattern).length;

/* ------------------------------------------------------------------ *
 * The findings                                                       *
 * ------------------------------------------------------------------ */

export interface Finding {
  id: string;
  icon: string;
  observation: string;
  /** The probability the finding is read at, which sets its band. */
  probability: number;
  why: string;
  evidence: { label: string; value: string }[];
  amount: number;
  amountNote: string;
  confidence: number;
  action: string;
}

export const FINDINGS: Finding[] = [
  {
    id: 'reminder-led',
    icon: 'ti ti-bell',
    observation: 'Parent usually pays after reminders',
    probability: 90,
    why: 'The Walker account has settled within six days of a first reminder in eight consecutive terms, and has never required a second. The delay is not reluctance; it is that the invoice is simply not seen until it is pointed at.',
    evidence: [
      { label: 'Terms following this pattern', value: '8 of 8' },
      { label: 'Median days after reminder', value: '6' },
      { label: 'Second reminders ever needed', value: '0' },
      { label: 'Channel that works', value: 'WhatsApp' },
    ],
    amount: 1250,
    amountNote: 'Recovered within 6 days',
    confidence: 96,
    action: 'Send one WhatsApp reminder and schedule nothing after it.',
  },
  {
    id: 'seasonal',
    icon: 'ti ti-calendar-repeat',
    observation: 'Seasonal payment trend detected',
    probability: 75,
    why: 'Collections dip 22% in the first three weeks of every term and recover fully by week five. The dip has appeared in all four terms on record and correlates with household expenses at term start rather than with any change in willingness.',
    evidence: [
      { label: 'Terms showing the dip', value: '4 of 4' },
      { label: 'Average dip', value: '22%' },
      { label: 'Full recovery by', value: 'Week 5' },
      { label: 'Cases affected', value: '61 of 128' },
    ],
    amount: 412_000,
    amountNote: 'Timing, not risk',
    confidence: 94,
    action: 'Hold a three-week buffer at term start rather than year-round.',
  },
  {
    id: 'late-history',
    icon: 'ti ti-history',
    observation: 'Previous late payment history',
    probability: 60,
    why: 'The Reyes account has paid every term in full but never on time, averaging nineteen days late across four terms. The amount always arrives; only the date moves. Treating this as a default risk has cost three unnecessary escalations.',
    evidence: [
      { label: 'Terms paid in full', value: '4 of 4' },
      { label: 'Average days late', value: '19' },
      { label: 'Escalations raised', value: '3, all unnecessary' },
      { label: 'Amount ever written off', value: '$0' },
    ],
    amount: 1850,
    amountNote: 'Predictable, not risky',
    confidence: 91,
    action: 'Reclassify as slow-but-certain and stop escalating it.',
  },
  {
    id: 'instalment',
    icon: 'ti ti-layout-rows',
    observation: 'Instalment preference identified',
    probability: 75,
    why: 'Payments on this account arrive in two or three parts without any plan in place. The parent is already instalment-paying; the school has simply never offered the structure that would make it predictable.',
    evidence: [
      { label: 'Payments arriving in parts', value: '3 of 4 terms' },
      { label: 'Typical split', value: '2 to 3 parts' },
      { label: 'Formal plan on file', value: 'None' },
      { label: 'Expected gain from a plan', value: '4 weeks earlier' },
    ],
    amount: 1850,
    amountNote: 'Recovers 4 weeks earlier',
    confidence: 90,
    action: 'Offer a three-part plan matched to the split already happening.',
  },
  {
    id: 'siblings',
    icon: 'ti ti-users',
    observation: 'Sibling fee pattern recognized',
    probability: 92,
    why: 'Where two children attend, the second invoice is settled a median of nine days after the first, never before it. Nineteen households on the ledger have siblings, and forecasting them independently has been the largest single source of error.',
    evidence: [
      { label: 'Households with siblings', value: '19' },
      { label: 'Median gap between payments', value: '9 days' },
      { label: 'Second invoice paid first', value: 'Never' },
      { label: 'Forecast error reduced', value: '31%' },
    ],
    amount: 96_000,
    amountNote: 'Improves 19 forecasts',
    confidence: 89,
    action: 'Chain sibling invoices rather than forecasting them apart.',
  },
  {
    id: 'scholarship',
    icon: 'ti ti-award',
    observation: 'Scholarship adjustment expected',
    probability: 30,
    why: 'The Menon account meets four of five published hardship criteria on the record already held. The outstanding balance is likely to be adjusted rather than collected, so carrying it as receivable overstates the term forecast.',
    evidence: [
      { label: 'Hardship criteria met', value: '4 of 5' },
      { label: 'Terms overdue', value: '2' },
      { label: 'Contact attempts', value: '6, no response' },
      { label: 'Similar cases adjusted', value: '11 of 14' },
    ],
    amount: 3100,
    amountNote: 'Reduces true exposure',
    confidence: 88,
    action: 'Send for scholarship review before any escalation is raised.',
  },
];

/* ------------------------------------------------------------------ *
 * The intelligence centre                                            *
 * ------------------------------------------------------------------ */

export const INTELLIGENCE = [
  {
    id: 'opportunity',
    figure: shortMoney(REMINDER_WINS),
    title: 'Collection Opportunity',
    finding: `${REMINDER_CASES} cases carry a third of the outstanding balance, and all ${REMINDER_CASES} respond to a first reminder.`,
    recommendation: `Send those ${REMINDER_CASES} reminders before anything else is actioned.`,
    outcome: 'A third of the outstanding balance clears in a week.',
  },
  {
    id: 'behaviour',
    figure: `${PATTERNS.length} types`,
    title: 'Payment Behaviour',
    finding: `Every account falls into one of ${PATTERNS.length} patterns: prompt, reminder-led, payday-fixed, or hardship.`,
    recommendation: 'Route reminders by pattern rather than by days overdue.',
    outcome: 'Unnecessary escalations fall to almost none.',
  },
  {
    id: 'risk',
    figure: shortMoney(TRUE_EXPOSURE),
    title: 'Outstanding Risk',
    finding: `True exposure is ${shortMoney(TRUE_EXPOSURE)}, not the ${shortMoney(LEDGER_RISK)} on the ledger. Most of the gap is timing rather than default.`,
    recommendation: 'Separate slow-but-certain accounts from genuine risk.',
    outcome: 'The finance committee sees a real number.',
  },
  {
    id: 'cashflow',
    figure: `${CASHFLOW_CONFIDENCE}%`,
    title: 'Cash Flow Stability',
    finding:
      'Confidence is high everywhere except the first three weeks of term, where every forecast widens.',
    recommendation: 'Hold a three-week buffer at term start rather than year-round.',
    outcome: 'Frees working capital for the rest of the year.',
  },
  {
    id: 'instalment',
    figure: '23 accounts',
    title: 'Instalment Pattern',
    finding: 'Twenty-three accounts already pay in parts without a plan. None has ever been offered one.',
    recommendation: 'Offer formal plans matched to the splits already happening.',
    outcome: 'Recovery arrives around four weeks earlier.',
  },
  {
    id: 'discount',
    figure: shortMoney(-18_000),
    title: 'Discount Impact',
    finding:
      'Early-payment discounts cost $18K and moved payment dates by a median of two days.',
    recommendation: 'Withdraw the discount and reinvest it in reminder timing.',
    outcome: '$18K returned with no measurable effect on timing.',
  },
  {
    id: 'scholarship',
    figure: shortMoney(62_000),
    title: 'Scholarship Influence',
    finding:
      'Fourteen accounts meet hardship criteria. Eleven comparable cases were adjusted rather than collected.',
    recommendation: 'Review all fourteen before any escalation is raised.',
    outcome: 'Forecast stops counting money that will not arrive.',
  },
  {
    id: 'department',
    figure: shortMoney(FORECAST.expected),
    title: 'Department Revenue',
    finding: 'Tuition is predictable to within 2%. Transport and cafeteria carry almost all the variance.',
    recommendation: 'Forecast the three streams separately, not as one figure.',
    outcome: 'Overall forecast error falls by roughly a third.',
  },
];

/* ------------------------------------------------------------------ *
 * The collection centre                                              *
 * ------------------------------------------------------------------ */

export interface Recommendation {
  id: string;
  title: string;
  note: string;
  confidence: number;
  /** Dollars the engine expects it to move. */
  value: number;
  /** Hours of finance time it asks for. */
  hours: number;
  expected: string;
  timeline: string;
  modal: string;
}

const recommendations: Recommendation[] = [
  {
    id: 'reminder',
    title: 'Send Friendly Reminder',
    note: `${REMINDER_CASES} accounts settle within six days of a first reminder and have never needed a second.`,
    confidence: 90,
    value: 312_000,
    hours: 1,
    expected: shortMoney(312_000),
    timeline: 'This week',
    modal: 'generate_reminder',
  },
  {
    id: 'instalment',
    title: 'Offer Instalment Plan',
    note: 'Twenty-three accounts already pay in parts. A formal plan makes the timing predictable.',
    confidence: 80,
    value: 96_000,
    hours: 3,
    expected: shortMoney(96_000),
    timeline: 'Two weeks',
    modal: 'instalment_plan',
  },
  {
    id: 'scholarship',
    title: 'Apply Scholarship Review',
    note: 'Fourteen accounts meet hardship criteria on the record we already hold.',
    confidence: 80,
    value: 62_000,
    hours: 4,
    expected: `${shortMoney(62_000)} adjusted`,
    timeline: 'This month',
    modal: 'collection_plan',
  },
  {
    id: 'meeting',
    title: 'Schedule Parent Meeting',
    note: 'Four accounts have been overdue two terms with no contact. A conversation precedes any escalation.',
    confidence: 60,
    value: 41_000,
    hours: 3,
    expected: shortMoney(41_000),
    timeline: 'Within 5 days',
    modal: 'parent_communication',
  },
  {
    id: 'personalized',
    title: 'Personalized Follow-up',
    note: 'Reminders naming the child and the term are opened twice as often as generic notices.',
    confidence: 70,
    value: 28_000,
    hours: 2.5,
    expected: shortMoney(28_000),
    timeline: 'Ongoing',
    modal: 'parent_communication',
  },
  {
    id: 'incentive',
    title: 'Payment Incentive',
    note: 'The early-payment discount cost $18K and moved dates by two days. Test a non-cash incentive instead.',
    confidence: 40,
    value: 18_000,
    hours: 2,
    expected: `${shortMoney(18_000)} saved`,
    timeline: 'Next term',
    modal: 'collection_plan',
  },
  {
    id: 'escalate',
    title: 'Escalate Collection',
    note: 'Only two accounts meet every escalation criterion after the reclassification. The rest were timing.',
    confidence: 20,
    value: 12_000,
    hours: 2,
    expected: shortMoney(12_000),
    timeline: 'Last resort',
    modal: 'collection_plan',
  },
  {
    id: 'waive',
    title: 'Waive Late Fee',
    note: 'Late fees on payday-fixed accounts generate complaints and no earlier payment whatsoever.',
    confidence: 70,
    value: 4_000,
    hours: 1,
    expected: shortMoney(-4_000),
    timeline: 'Immediate',
    modal: 'collection_plan',
  },
];

/** Money moved against the finance hours it asks for. */
export const yieldOf = (row: Recommendation) => row.value / row.hours;

export const RECOMMENDATIONS = [...recommendations].sort((a, b) => yieldOf(b) - yieldOf(a));

/** The priority an offer carries, from where it ranks. */
export const PRIORITY_BANDS = [
  { upTo: 2, band: 'High', tone: 'is-likely' },
  { upTo: 5, band: 'Normal', tone: 'is-watch' },
  { upTo: Infinity, band: 'Low', tone: 'is-slow' },
];

export const priorityOf = (rank: number) =>
  PRIORITY_BANDS.find((entry) => rank <= entry.upTo) ?? PRIORITY_BANDS[2];

/* ------------------------------------------------------------------ *
 * The opportunity studio, the copilot and the insights               *
 * ------------------------------------------------------------------ */

export const OPPORTUNITIES = [
  {
    id: 'probability',
    badge: shortMoney(312_000),
    title: 'High Collection Probability',
    text: 'Nine accounts sit above 90% probability and share one trait: they settle after a first reminder and have never needed a second.',
  },
  {
    id: 'delayed',
    badge: shortMoney(186_000),
    title: 'Delayed Payments',
    text: 'Sixty-one accounts are late but not at risk. Every one has paid in full every term; only the date moves, by a median of nineteen days.',
  },
  {
    id: 'defaulters',
    badge: shortMoney(TRUE_EXPOSURE),
    title: 'Potential Defaulters',
    text: 'Only two accounts meet every escalation criterion once timing is separated from risk. The ledger has been carrying five times that number as risk.',
  },
  {
    id: 'upcoming',
    badge: shortMoney(424_000),
    title: 'Upcoming Due Dates',
    text: 'Forty-one invoices fall due in the next three weeks. Thirty-one are prompt payers who need nothing more than the invoice itself.',
  },
  {
    id: 'instalments',
    badge: shortMoney(96_000),
    title: 'Instalment Opportunities',
    text: 'Twenty-three accounts already split payments without a plan. Formalising what they are doing anyway pulls recovery forward four weeks.',
  },
  {
    id: 'recovery',
    badge: shortMoney(62_000),
    title: 'Recovery Opportunities',
    text: 'Fourteen accounts meet hardship criteria. Adjusting them recovers nothing in cash but removes revenue that was never going to arrive.',
  },
  {
    id: 'improvements',
    badge: '18 days',
    title: 'Collection Improvements',
    text: 'Routing reminders by payment pattern rather than by days overdue would cut median collection time from forty-one days to twenty-three.',
  },
  {
    id: 'growth',
    badge: shortMoney(18_000),
    title: 'Revenue Growth Suggestions',
    text: 'Withdrawing the early-payment discount returns $18K a term. It moved payment dates by a median of two days, which is inside the noise.',
  },
];

export const COPILOT = [
  { n: '01', title: 'Generate Collection Strategy', note: 'Routes every open case by payment pattern, not by days overdue', modal: 'collection_plan' },
  { n: '02', title: 'Generate Parent Reminder', note: 'One message per account, worded for that account’s history', modal: 'generate_reminder' },
  { n: '03', title: 'Generate Cash Flow Summary', note: 'Week by week to term end, with the range around each figure', modal: 'cash_flow' },
  { n: '04', title: 'Generate Monthly Forecast', note: 'The month ahead split by tuition, transport and cafeteria', modal: 'generate_forecast' },
  { n: '05', title: 'Compare Collection Trends', note: 'This term against the last four, like for like', modal: 'compare_cases' },
  { n: '06', title: 'Generate Recovery Plan', note: 'For the accounts where adjustment beats collection', modal: 'collection_plan' },
  { n: '07', title: 'Generate Revenue Insights', note: 'One page for the finance committee, in plain language', modal: 'export_revenue' },
];

export const PROGRAMMES = [
  { id: 'instalments', title: 'Instalment Plans', note: 'eligible now', figure: '23 accounts' },
  { id: 'scholarship', title: 'Scholarship Review', note: 'meet hardship criteria', figure: '14 accounts' },
  { id: 'recovery', title: 'Fee Recovery', note: 'recoverable this term', figure: shortMoney(62_000) },
  { id: 'campaigns', title: 'Collection Campaigns', note: 'ready to launch', figure: '3 campaigns' },
  { id: 'seasonal', title: 'Seasonal Forecasts', note: 'of pattern on record', figure: `${TERMS_ON_RECORD} terms` },
  { id: 'optimization', title: 'Revenue Optimization', note: 'returned by one change', figure: shortMoney(18_000) },
  { id: 'assistance', title: 'Financial Assistance', note: 'awaiting review', figure: '9 families' },
  { id: 'success', title: 'Collection Success Stories', note: 'recovered this term', figure: '11 accounts' },
];

export const INSIGHTS = [
  {
    id: 'growth',
    figure: `+${REVENUE_GROWTH}%`,
    title: 'Expected Revenue Growth',
    text: `Term-end collection is forecast at ${shortMoney(FORECAST.expected)} against ${shortMoney(LAST_TERM_ACTUAL)} last term. Almost all of the gain comes from earlier collection rather than from higher fees.`,
  },
  {
    id: 'risks',
    figure: shortMoney(TRUE_EXPOSURE),
    title: 'Collection Risks',
    text: `True exposure is ${shortMoney(TRUE_EXPOSURE)}, not the ${shortMoney(LEDGER_RISK)} carried on the ledger. The difference is accounts that always pay late and always pay in full.`,
  },
  {
    id: 'behaviour',
    figure: String(PATTERNS.length),
    title: 'Payment Behaviour Trends',
    text: 'Every account resolves into four patterns: prompt, reminder-led, payday-fixed and hardship. Days overdue tells you almost nothing on its own.',
  },
  {
    id: 'recovery',
    figure: shortMoney(62_000),
    title: 'High Recovery Opportunities',
    text: 'Fourteen hardship accounts and twenty-three unstructured instalment payers together account for most of what looks like bad debt.',
  },
  {
    id: 'signals',
    figure: '61',
    title: 'Outstanding Fee Signals',
    text: `Sixty-one of the overdue accounts fall inside the term-start dip, which has appeared in all ${TERMS_ON_RECORD} terms on record and always recovers by week five.`,
  },
  {
    id: 'optimization',
    figure: '18 days',
    title: 'Revenue Optimization Suggestions',
    text: 'Routing reminders by pattern rather than by age would cut median collection from forty-one days to twenty-three without a single extra message.',
  },
  {
    id: 'accuracy',
    figure: `${FORECAST_ACCURACY}%`,
    title: 'Finance Highlights',
    text: `Forecast accuracy across the last ${TERMS_ON_RECORD} terms. The residual error is concentrated in sibling households, which the engine now chains rather than forecasting separately.`,
  },
];

/* ------------------------------------------------------------------ *
 * The featured case's journey                                        *
 * ------------------------------------------------------------------ */

export interface Stop {
  id: string;
  title: string;
  note: string;
  /** Days after the invoice was raised, or null when it has not happened. */
  offsetDays: number | null;
  amount: number | null;
  state: 'is-done' | 'is-now' | '';
}

export const JOURNEY: Stop[] = [
  {
    id: 'raised',
    title: 'Fee Generated',
    note: 'Term 2 tuition raised against the Walker account and issued to the parent portal.',
    offsetDays: 0,
    amount: 1250,
    state: 'is-done',
  },
  {
    id: 'due',
    title: 'Due Reminder',
    note: 'Automatic due notice sent by email. Not opened, consistent with this account’s history.',
    offsetDays: 14,
    amount: null,
    state: 'is-done',
  },
  {
    id: 'forecast',
    title: 'AI Forecast Created',
    note: 'Engine predicted settlement on 18 August at 90% probability, based on eight terms of reminder response.',
    offsetDays: 28,
    amount: 1250,
    state: 'is-done',
  },
  {
    id: 'recommended',
    title: 'Collection Recommendation',
    note: 'One friendly WhatsApp reminder proposed. Escalation explicitly ruled out for this pattern.',
    offsetDays: 29,
    amount: null,
    state: 'is-done',
  },
  {
    id: 'contact',
    title: 'Parent Contact',
    note: 'Reminder approved by the bursar and queued. Awaiting response within the expected six-day window.',
    offsetDays: 30,
    amount: null,
    state: 'is-now',
  },
  {
    id: 'payment',
    title: 'Payment Received',
    note: 'Forecast settlement date. The account has never exceeded this window in eight terms.',
    offsetDays: null,
    amount: 1250,
    state: '',
  },
  {
    id: 'closed',
    title: 'Revenue Closed',
    note: 'Closes when the balance clears and the forecast is scored against the actual date.',
    offsetDays: null,
    amount: 0,
    state: '',
  },
];

/** The journey, dated from the day the invoice was raised. */
export const journeyStops = (row: RevenueCase) =>
  JOURNEY.map((stop) => ({
    ...stop,
    on:
      stop.offsetDays === null
        ? stop.id === 'payment' && row.predictedOn
          ? `Expected ${row.predictedOn.split(' ').slice(0, 2).join(' ')}`
          : 'Pending'
        : addDays(row.raisedOn, stop.offsetDays),
  }));

/** How far through the forecast window the case has run. */
export const elapsedOf = (row: RevenueCase) => daysBetween(row.raisedOn, RUN_DATE);
export const windowOf = (row: RevenueCase) =>
  row.predictedOn ? daysBetween(row.raisedOn, row.predictedOn) : null;

/** The workspace's confidence rows, and the mean above them. */
export const CASE_CONFIDENCE = [
  { label: 'Payment date', value: 96 },
  { label: 'Amount', value: 99 },
  { label: 'Channel preference', value: 94 },
  { label: 'Pattern classification', value: 96 },
  { label: 'Escalation not needed', value: 93 },
];

export const CASE_CONFIDENCE_MEAN = Math.round(
  CASE_CONFIDENCE.reduce((total, entry) => total + entry.value, 0) / CASE_CONFIDENCE.length,
);

/** The dates the dialogs propose, offset from the register clock. */
export const PLAN_REVIEW = addDays(RUN_DATE, 60);
export const REMINDER_ON = RUN_DATE;
export const FIRST_INSTALMENT_ON = addDays(RUN_DATE, 17);
