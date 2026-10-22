export type RankingStatus = 'Active' | 'Pending' | 'Completed' | 'Inactive' | 'Scheduled';

/**
 * The template names its dialogs `add_item`, `edit_item` and `delete_modal` (L1650, L1668,
 * L1686); normalised here to one union so a single `active` id drives all three.
 */
export type RankingModalId = 'add' | 'edit' | 'delete';

/** The `bg-*-transparent text-*` pair on a card's avatar tile, and on the summary tiles. */
export type RankingTone = 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'secondary';

export interface RankingRecord {
  id: string;
  name: string;
  /** The "PRE748xx" code inside the card's reference line. */
  reference: string;
  /** The muted line under the title — "Reference PRE74820". */
  description: string;
  status: RankingStatus;
  /** Every card in the template uses `ti ti-award`; kept per-record so new ones can differ. */
  icon: string;
  tone: RankingTone;
  members: number;
  /** As printed on the card: "12 May 2026". */
  updated: string;
  /** Sortable form of `updated`; the template had nothing to sort by. */
  updatedAt: string;
}

/** Status → the `badge-soft-*` class the template pairs it with. */
export const statusBadges: Record<RankingStatus, string> = {
  Active: 'badge-soft-success',
  Pending: 'badge-soft-warning',
  Completed: 'badge-soft-info',
  Inactive: 'badge-soft-danger',
  Scheduled: 'badge-soft-secondary',
};

export const rankingRecords: RankingRecord[] = [
  {
    id: 'rank_1',
    name: 'Ranking System 1',
    reference: 'PRE74820',
    description: 'Reference PRE74820',
    status: 'Active',
    icon: 'ti ti-award',
    tone: 'primary',
    members: 120,
    updated: '12 May 2026',
    updatedAt: '2026-05-12',
  },
  {
    id: 'rank_2',
    name: 'Ranking System 2',
    reference: 'PRE74821',
    description: 'Reference PRE74821',
    status: 'Pending',
    icon: 'ti ti-award',
    tone: 'success',
    members: 160,
    updated: '03 Jun 2026',
    updatedAt: '2026-06-03',
  },
  {
    id: 'rank_3',
    name: 'Ranking System 3',
    reference: 'PRE74822',
    description: 'Reference PRE74822',
    status: 'Completed',
    icon: 'ti ti-award',
    tone: 'info',
    members: 200,
    updated: '18 Jun 2026',
    updatedAt: '2026-06-18',
  },
  {
    id: 'rank_4',
    name: 'Ranking System 4',
    reference: 'PRE74823',
    description: 'Reference PRE74823',
    status: 'Active',
    icon: 'ti ti-award',
    tone: 'warning',
    members: 240,
    updated: '24 Jun 2026',
    updatedAt: '2026-06-24',
  },
  {
    id: 'rank_5',
    name: 'Ranking System 5',
    reference: 'PRE74824',
    description: 'Reference PRE74824',
    status: 'Inactive',
    icon: 'ti ti-award',
    tone: 'danger',
    members: 280,
    updated: '01 Jul 2026',
    updatedAt: '2026-07-01',
  },
  {
    id: 'rank_6',
    name: 'Ranking System 6',
    reference: 'PRE74825',
    description: 'Reference PRE74825',
    status: 'Scheduled',
    icon: 'ti ti-award',
    tone: 'secondary',
    members: 320,
    updated: '09 Jul 2026',
    updatedAt: '2026-07-09',
  },
];

/* -------------------------------------------------------------------------- */
/*                               Summary strip                                */
/* -------------------------------------------------------------------------- */

export interface SummaryCard {
  id: string;
  label: string;
  value: string;
  icon: string;
  tone: RankingTone;
}

/**
 * The template hard-codes 1,248 / 1,120 / 86 / 214 into the four tiles (L1482, L1493,
 * L1504, L1515) — placeholder figures that bear no relation to the six cards beneath them
 * and never move. The labels, icons and tones below are the template's verbatim; only the
 * numbers are derived, so adding, editing or deleting a card is visible in the strip.
 *
 * "This Month" counts the records sharing the most recent month present in the data rather
 * than the wall-clock month: the seeded records stop at July 2026 and a tile that always
 * reads zero would be worse than useless.
 */
export const summaryCards = (records: RankingRecord[]): SummaryCard[] => {
  const latestMonth = records.reduce((latest, record) => {
    const month = record.updatedAt.slice(0, 7);
    return month > latest ? month : latest;
  }, '');

  const count = (predicate: (record: RankingRecord) => boolean) =>
    records.filter(predicate).length.toLocaleString();

  return [
    {
      id: 'total',
      label: 'Total Records',
      value: records.length.toLocaleString(),
      icon: 'ti ti-school',
      tone: 'primary',
    },
    {
      id: 'active',
      label: 'Active',
      value: count((record) => record.status === 'Active'),
      icon: 'ti ti-circle-check',
      tone: 'success',
    },
    {
      id: 'pending',
      label: 'Pending',
      value: count((record) => record.status === 'Pending'),
      icon: 'ti ti-clock',
      tone: 'warning',
    },
    {
      id: 'month',
      label: 'This Month',
      value: count((record) => record.updatedAt.slice(0, 7) === latestMonth),
      icon: 'ti ti-calendar',
      tone: 'info',
    },
  ];
};

/* -------------------------------------------------------------------------- */
/*                              Header controls                               */
/* -------------------------------------------------------------------------- */

/**
 * The template's header carries only Refresh and Add (L1470–1471) and offers no way to
 * narrow the grid. These three controls make the six cards filterable and orderable for
 * real; the option copy follows the statuses the cards themselves display.
 */
export const statusFilterOptions: readonly ('All Status' | RankingStatus)[] = [
  'All Status',
  'Active',
  'Pending',
  'Completed',
  'Inactive',
  'Scheduled',
];

export type RankingSortKey = 'recent' | 'oldest' | 'name' | 'members-desc' | 'members-asc';

export const sortOptions: { value: RankingSortKey; label: string }[] = [
  { value: 'recent', label: 'Recently Updated' },
  { value: 'oldest', label: 'Oldest Updated' },
  { value: 'name', label: 'Name (A - Z)' },
  { value: 'members-desc', label: 'Members (High - Low)' },
  { value: 'members-asc', label: 'Members (Low - High)' },
];

/**
 * The Add and Edit dialogs offer Active / Pending / Inactive (L1658, L1676). Completed and
 * Scheduled are appended so editing cards 3 and 6 round-trips their own status instead of
 * silently rewriting it.
 */
export const statusFormOptions: RankingStatus[] = [
  'Active',
  'Pending',
  'Inactive',
  'Completed',
  'Scheduled',
];

/** `ranking-system.html` loads no page script, so this copy matches the sibling Academic pages. */
export const actionToasts: Record<string, string> = {
  refresh: 'Ranking systems refreshed.',
  add: 'Ranking system added successfully.',
  save: 'Ranking system updated.',
  delete: 'Ranking system deleted.',
  clear_filters: 'Filters cleared.',
};
