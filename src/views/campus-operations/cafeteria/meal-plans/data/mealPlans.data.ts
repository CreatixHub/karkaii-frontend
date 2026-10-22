export type PlanStatus = 'Active' | 'Scheduled' | 'Draft' | 'Archived';

export type Duration = 'Daily' | 'Weekly' | 'Monthly';

export type Audience = 'Students' | 'Staff' | 'Hostel Residents' | 'Students & Staff';

export type MealName = 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';

export interface MealSlot {
  included: boolean;
  /** "07:30 – 09:00 AM", or '' when the meal is not part of the plan. */
  window: string;
  /** The dish the plan serves at that meal. */
  dish: string;
  /** What the grid prints under the tick: "285 kcal" or a price. */
  note: string;
}

export interface Tag {
  label: string;
  tint: string;
}

export interface MealPlan {
  id: string;
  /** "MP-2026-014" — the code under the plan name. */
  code: string;
  name: string;
  duration: Duration;
  audience: Audience;
  /** "Day scholars · 842 enrolled" — the line under the audience badge. */
  audienceNote: string;
  /** Members on the plan, or null where the template records none. */
  enrolled: number | null;
  /** The four meals, in the order the grid prints them. */
  meals: Record<MealName, MealSlot>;
  /** The beverage line the panel adds under the four meals, if any. */
  beverage?: { dish: string; note: string };
  /** "Mon – Fri", "Mon – Sat", "Mon – Sun". */
  daysCovered: string;
  effectiveFrom: string;
  effectiveTo: string;
  updated: string;
  status: PlanStatus;

  /** Printed as the template writes them, qualifiers and all. */
  energy: string;
  protein: string;
  carbs: string;
  fat: string;
  /** "$4.60 / day · $92 / month". */
  rate: string;

  dietary: Tag[];
  contains: string;
  freeFrom: string;

  cafeteria: string;
  counters: string;
  capacity: string;
  servingMode: string;
  /** "Monthly · $92" — how the plan is billed. */
  billing: string;
  billingDays: string;
  nextReview: string;
  notes: string;
}

export const statusPill: Record<PlanStatus, string> = {
  Active: 'is-active',
  Scheduled: 'is-pending',
  Draft: 'is-review',
  Archived: 'is-archived',
};

/** The View dialog and the panel print the status as a soft badge instead. */
export const statusBadge: Record<PlanStatus, string> = {
  Active: 'badge badge-soft-success',
  Scheduled: 'badge badge-soft-warning',
  Draft: 'badge badge-soft-info',
  Archived: 'badge badge-soft-secondary',
};

export const durationStyle: Record<Duration, { icon: string; tint: string }> = {
  Daily: { icon: 'ti ti-calendar', tint: 'warning' },
  Weekly: { icon: 'ti ti-calendar-repeat', tint: 'primary' },
  Monthly: { icon: 'ti ti-calendar-stats', tint: 'info' },
};

export const audienceTint: Record<Audience, string> = {
  Students: 'primary',
  Staff: 'success',
  'Hostel Residents': 'purple',
  'Students & Staff': 'info',
};

/* ------------------------------ Filter options ------------------------------ */

export const durationOptions: Duration[] = ['Daily', 'Weekly', 'Monthly'];

export const audienceOptions: Audience[] = [
  'Students', 'Staff', 'Hostel Residents', 'Students & Staff',
];

export const mealFilterOptions = [
  'Includes Breakfast', 'Includes Lunch', 'Includes Snacks', 'Includes Dinner', 'Full board',
];

export const statusOptions: PlanStatus[] = ['Active', 'Scheduled', 'Draft', 'Archived'];

export const dietaryOptions = ['Vegetarian', 'Vegan', 'Jain', 'Non-Veg', 'Gluten-Free'];

export const cafeteriaOptions = ['Main Block Cafeteria', 'Hostel Mess', 'Staff Dining Room'];

/* --------------------------- Dialog option lists ----------------------------- */

export const mealNames: MealName[] = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

export const daysCoveredOptions = ['Mon – Fri', 'Mon – Sat', 'Mon – Sun'];

export const targetGroupOptions = [
  'All hostel residents · 262', 'Nightingale Hostel · 134', 'Everest Hostel · 128',
  'Day scholars · 842', 'Staff · 96',
];

export const billingModeOptions = [
  'Bundled into the hostel fee', 'Billed separately · monthly', 'Prepaid wallet', 'Pay per meal',
];

export const archiveReasonOptions = [
  'Term ended', 'Superseded by a new plan', 'Low enrolment', 'Cost revision', 'Menu policy change',
];

export const duplicateStatusOptions: PlanStatus[] = ['Draft', 'Scheduled', 'Active'];

/* ------------------------------- Derivations -------------------------------- */

export const DASH = '—';

export const includedMeals = (row: MealPlan): MealName[] =>
  mealNames.filter((meal) => row.meals[meal].included);

export const mealsIncluded = (row: MealPlan): number => includedMeals(row).length;

/** "3 of 4" — the tile the View dialog prints. */
export const mealsLabel = (row: MealPlan): string => `${mealsIncluded(row)} of 4`;

export const isFullBoard = (row: MealPlan): boolean => mealsIncluded(row) === 4;

/** The short day names behind "Mon – Fri". */
export const daysOf = (row: MealPlan): string[] => {
  const week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  if (row.daysCovered.includes('Sun')) return week;
  if (row.daysCovered.includes('Sat')) return week.slice(0, 6);
  return week.slice(0, 5);
};

/** "MP-2026-014 · Monthly · $198 / month" — the line the dialogs print. */
export const compactOf = (row: MealPlan): string =>
  `${row.code} · ${row.duration} · ${row.rate.split('·').pop()?.trim() ?? row.rate}`;

/** "Standard Student Weekly  •  Weekly  •  Students" — the View sub-line. */
export const summaryOf = (row: MealPlan): string =>
  `${row.code}  •  ${row.duration}  •  ${row.audience}`;

export const schedulePairsOf = (row: MealPlan): { label: string; value: string }[] => [
  ...mealNames.map((meal) => ({
    label: meal,
    value: row.meals[meal].included ? row.meals[meal].window : 'Not included',
  })),
  { label: 'Days Covered', value: row.daysCovered },
];

export const nutritionPairsOf = (row: MealPlan): { label: string; value: string }[] => [
  { label: 'Energy per Day', value: row.energy },
  { label: 'Protein', value: row.protein },
  { label: 'Carbohydrates', value: row.carbs },
  { label: 'Fat', value: row.fat },
  { label: 'Rate', value: row.rate },
];

export const cafeteriaPairsOf = (row: MealPlan): { label: string; value: string }[] => [
  { label: 'Cafeteria', value: row.cafeteria },
  { label: 'Counters', value: row.counters },
  { label: 'Capacity', value: row.capacity },
  { label: 'Serving Mode', value: row.servingMode },
];

export interface MenuLine {
  meal: string;
  dish: string;
  note: string;
}

/** The panel's Daily Menu: the included meals, then the beverage if there is one. */
export const dailyMenuOf = (row: MealPlan): MenuLine[] => {
  const lines: MenuLine[] = includedMeals(row).map((meal) => ({
    meal,
    dish: row.meals[meal].dish,
    note: row.meals[meal].note,
  }));
  if (row.beverage) lines.push({ meal: 'Beverage', dish: row.beverage.dish, note: row.beverage.note });
  return lines;
};

export interface AuditEntry {
  title: string;
  meta: string;
}

/**
 * The panel's audit trail. The template writes three fixed lines; here they are
 * the plan's own history — created, enrolled and last revised.
 */
export const auditOf = (row: MealPlan): AuditEntry[] => [
  { title: 'Meal plan created', meta: `${row.effectiveFrom} · Catering Office` },
  {
    title: row.enrolled === null ? 'Open to walk-in diners' : `${row.enrolled} members enrolled`,
    meta: `${row.audienceNote} · ${row.cafeteria}`,
  },
  { title: `Plan last revised`, meta: `${row.updated} · ${row.status}` },
];

/* --------------------------------- Filters ---------------------------------- */

export const matchesMealFilter = (row: MealPlan, option: string): boolean => {
  if (option === 'Full board') return isFullBoard(row);
  const meal = option.replace('Includes ', '') as MealName;
  return row.meals[meal]?.included ?? false;
};

export const hasDietary = (row: MealPlan, tag: string): boolean =>
  row.dietary.some((entry) => entry.label.toLowerCase().includes(tag.toLowerCase()));

export const servesFrom = (row: MealPlan, cafeteria: string): boolean =>
  row.cafeteria.toLowerCase().includes(cafeteria.split(' ')[0].toLowerCase());

export const searchIndexOf = (row: MealPlan): string =>
  [
    row.name, row.code, row.duration, row.audience, row.audienceNote, row.status,
    row.cafeteria, row.rate, row.dietary.map((tag) => tag.label).join(' '),
    dailyMenuOf(row).map((line) => line.dish).join(' '),
  ]
    .join(' ')
    .toLowerCase();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Sortable key for the template's "27 Jul 2026" dates. */
export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/* ------------------------------ Overview cards ------------------------------- */

export interface OverviewCard {
  id: string;
  label: string;
  icon: string;
  tint: string;
  /** Meals the whole catalogue serves under this heading. */
  meals: number;
  /** Plans the whole catalogue holds — this page lists eight of them. */
  active: number;
  matches: (row: MealPlan) => boolean;
}

/**
 * The six cards count three different things — duration for the first three,
 * audience for the next two and dietary preference for the last — so each
 * carries the test the roster is counted with.
 */
export const overviewCards: OverviewCard[] = [
  {
    id: 'daily', label: 'Daily Plans', icon: 'ti ti-calendar', tint: 'warning',
    meals: 18, active: 6, matches: (row) => row.duration === 'Daily',
  },
  {
    id: 'weekly', label: 'Weekly Plans', icon: 'ti ti-calendar-repeat', tint: 'primary',
    meals: 84, active: 4, matches: (row) => row.duration === 'Weekly',
  },
  {
    id: 'monthly', label: 'Monthly Plans', icon: 'ti ti-calendar-stats', tint: 'info',
    meals: 360, active: 3, matches: (row) => row.duration === 'Monthly',
  },
  {
    id: 'hostel', label: 'Hostel Menu', icon: 'ti ti-building-fortress', tint: 'purple',
    meals: 168, active: 2, matches: (row) => row.audience === 'Hostel Residents',
  },
  {
    id: 'staff', label: 'Staff Menu', icon: 'ti ti-briefcase', tint: 'success',
    meals: 28, active: 2, matches: (row) => row.audience === 'Staff',
  },
  {
    id: 'special', label: 'Special Diet Plans', icon: 'ti ti-leaf', tint: 'danger',
    meals: 105, active: 5,
    matches: (row) =>
      row.dietary.some((tag) => /jain|vegan|gluten|low oil|no root/i.test(tag.label)),
  },
];

/** The academic year the template shows as its one filter chip. */
export const ACADEMIC_YEAR = '2026 / 2027';

/* ---------------------------------- Rows ------------------------------------ */

const slot = (window: string, dish: string, note: string): MealSlot => ({
  included: true, window, dish, note,
});

const noSlot: MealSlot = { included: false, window: '', dish: '', note: 'Not included' };

export const mealPlans: MealPlan[] = [
  {
    id: 'MP-2026-014', code: 'MP-2026-014', name: 'Standard Student Weekly',
    duration: 'Weekly', audience: 'Students', audienceNote: 'Day scholars · 842 enrolled',
    enrolled: 842,
    meals: {
      Breakfast: slot('07:30 – 09:00 AM', 'Masala Dosa', '285 kcal'),
      Lunch: slot('12:30 – 02:00 PM', 'Vegetable Pulao', '410 kcal'),
      Snacks: slot('04:00 – 05:00 PM', 'Grilled Paneer Wrap', '320 kcal'),
      Dinner: noSlot,
    },
    beverage: { dish: 'Fresh Fruit Smoothie', note: '180 kcal' },
    daysCovered: 'Mon – Fri', effectiveFrom: '27 Jul 2026', effectiveTo: '31 Mar 2027',
    updated: '29 Jul 2026', status: 'Active',
    energy: '1,195 kcal', protein: '33 g', carbs: '172 g', fat: '39 g',
    rate: '$4.60 / day · $92 / month',
    dietary: [
      { label: 'Vegetarian', tint: 'success' },
      { label: 'Egg-Free', tint: 'info' },
      { label: 'Jain option', tint: 'purple' },
    ],
    contains: 'Dairy · gluten · mustard', freeFrom: 'Nuts · egg · soy',
    cafeteria: 'Main Block Cafeteria', counters: 'Counter 1, 2 and 4', capacity: '420 seats',
    servingMode: 'Counter service', billing: 'Monthly · $92', billingDays: '20 per month',
    nextReview: '01 Oct 2026',
    notes: 'Default plan for day scholars. Billed monthly at $92 across 20 school days.',
  },
  {
    id: 'MP-2026-021', code: 'MP-2026-021', name: 'Hostel Full Board',
    duration: 'Monthly', audience: 'Hostel Residents', audienceNote: 'Nightingale & Everest · 262',
    enrolled: 262,
    meals: {
      Breakfast: slot('07:30 – 09:00 AM', 'Masala Dosa', '285 kcal'),
      Lunch: slot('12:30 – 02:00 PM', 'Vegetable Pulao', '410 kcal'),
      Snacks: slot('04:00 – 05:00 PM', 'Grilled Paneer Wrap', '320 kcal'),
      Dinner: slot('07:30 – 09:00 PM', 'Rajma Chawal', '465 kcal'),
    },
    beverage: { dish: 'Fresh Fruit Smoothie', note: '180 kcal' },
    daysCovered: 'Mon – Sun', effectiveFrom: '01 Jul 2026', effectiveTo: '31 Mar 2027',
    updated: '28 Jul 2026', status: 'Active',
    energy: '1,660 kcal', protein: '49 g', carbs: '246 g', fat: '50 g',
    rate: '$6.60 / day · $198 / month',
    dietary: [
      { label: 'Vegetarian', tint: 'success' },
      { label: 'Vegan option', tint: 'success' },
      { label: 'Jain option', tint: 'purple' },
    ],
    contains: 'Dairy · gluten · mustard', freeFrom: 'Nuts · egg · soy',
    cafeteria: 'Hostel Mess · both wings', counters: 'Mess counters 1 – 3', capacity: '280 seats',
    servingMode: 'Buffet · seated', billing: 'Bundled · $198 / month', billingDays: '30 per month',
    nextReview: '01 Oct 2026',
    notes: 'Bundled into the hostel fee. Runs all seven days including holidays and exam weeks.',
  },
  {
    id: 'MP-2026-009', code: 'MP-2026-009', name: 'Staff Lunch Plan',
    duration: 'Weekly', audience: 'Staff', audienceNote: 'Teaching & admin · 96',
    enrolled: 96,
    meals: {
      Breakfast: noSlot,
      Lunch: slot('12:00 – 01:30 PM', 'Vegetable Pulao', '410 kcal'),
      Snacks: slot('04:00 – 05:00 PM', 'Grilled Paneer Wrap', '320 kcal'),
      Dinner: noSlot,
    },
    daysCovered: 'Mon – Sat', effectiveFrom: '27 Jul 2026', effectiveTo: '31 Mar 2027',
    updated: '26 Jul 2026', status: 'Active',
    energy: '730 kcal', protein: '23 g', carbs: '96 g', fat: '27 g',
    rate: '$3.00 / day · $60 / month',
    dietary: [
      { label: 'Vegetarian', tint: 'success' },
      { label: 'Non-Veg option', tint: 'danger' },
      { label: 'Egg-Free', tint: 'info' },
    ],
    contains: 'Dairy · gluten', freeFrom: 'Nuts · egg · soy',
    cafeteria: 'Staff Dining Room', counters: 'Counter 5', capacity: '60 seats',
    servingMode: 'Plated service', billing: 'Payroll deduction · $60', billingDays: '20 per month',
    nextReview: '01 Nov 2026',
    notes: 'Staff lunch window opens 30 minutes ahead of the student service to avoid the queue.',
  },
  {
    id: 'MP-2026-031', code: 'MP-2026-031', name: 'Daily Walk-in Menu',
    duration: 'Daily', audience: 'Students & Staff', audienceNote: 'Pay per meal · no enrolment',
    enrolled: null,
    meals: {
      Breakfast: slot('07:30 – 09:00 AM', 'Masala Dosa', '$1.20'),
      Lunch: slot('12:30 – 02:00 PM', 'Vegetable Pulao', '$1.80'),
      Snacks: slot('04:00 – 05:00 PM', 'Grilled Paneer Wrap', '$1.50'),
      Dinner: slot('07:30 – 09:00 PM', 'Rajma Chawal', '$2.10'),
    },
    daysCovered: 'Mon – Sun', effectiveFrom: '31 Jul 2026', effectiveTo: '31 Mar 2027',
    updated: '31 Jul 2026', status: 'Active',
    energy: 'Up to 1,660 kcal', protein: 'Up to 49 g', carbs: 'Up to 246 g', fat: 'Up to 50 g',
    rate: 'À la carte · from $0.80',
    dietary: [
      { label: 'Vegetarian', tint: 'success' },
      { label: 'Non-Veg', tint: 'danger' },
      { label: 'Vegan option', tint: 'success' },
    ],
    contains: 'Varies by item selected', freeFrom: 'Declared per item on the board',
    cafeteria: 'Main Block Cafeteria', counters: 'All counters', capacity: '420 seats',
    servingMode: 'Counter service', billing: 'Pay per meal', billingDays: 'Not billed',
    nextReview: 'Reviewed weekly',
    notes: 'Rebuilt each morning from the published daily menu. No enrolment or monthly billing.',
  },
  {
    id: 'MP-2026-018', code: 'MP-2026-018', name: 'Jain Special Diet',
    duration: 'Weekly', audience: 'Hostel Residents', audienceNote: 'Opt-in · 34 residents',
    enrolled: 34,
    meals: {
      Breakfast: slot('07:30 – 09:00 AM', 'Jain Dosa', '260 kcal'),
      Lunch: slot('12:30 – 02:00 PM', 'Jain Pulao', '395 kcal'),
      Snacks: slot('04:00 – 05:00 PM', 'Jain Wrap', '305 kcal'),
      Dinner: slot('07:30 – 09:00 PM', 'Jain Dal Rice', '400 kcal'),
    },
    beverage: { dish: 'Fresh Fruit Smoothie', note: '180 kcal' },
    daysCovered: 'Mon – Sun', effectiveFrom: '27 Jul 2026', effectiveTo: '31 Mar 2027',
    updated: '30 Jul 2026', status: 'Active',
    energy: '1,540 kcal', protein: '44 g', carbs: '232 g', fat: '44 g',
    rate: '$6.90 / day · $207 / month',
    dietary: [
      { label: 'Jain', tint: 'purple' },
      { label: 'Vegetarian', tint: 'success' },
      { label: 'No Root Vegetables', tint: 'info' },
    ],
    contains: 'Dairy', freeFrom: 'Onion · garlic · root vegetables · egg',
    cafeteria: 'Hostel Mess · both wings', counters: 'Dedicated Jain counter', capacity: '40 seats',
    servingMode: 'Plated · pre-ordered', billing: 'Bundled · $207 / month', billingDays: '30 per month',
    nextReview: '01 Oct 2026',
    notes: 'Prepared in a separate section with dedicated utensils. Pre-order list closes at 11:00 AM.',
  },
  {
    id: 'MP-2026-026', code: 'MP-2026-026', name: 'Gluten-Free Plan',
    duration: 'Weekly', audience: 'Students', audienceNote: 'Medical opt-in · 12',
    enrolled: 12,
    meals: {
      Breakfast: slot('07:30 – 09:00 AM', 'Masala Dosa', '285 kcal'),
      Lunch: slot('12:30 – 02:00 PM', 'Vegetable Pulao', '410 kcal'),
      Snacks: noSlot,
      Dinner: noSlot,
    },
    beverage: { dish: 'Fresh Fruit Smoothie', note: '180 kcal' },
    daysCovered: 'Mon – Fri', effectiveFrom: '03 Aug 2026', effectiveTo: '31 Mar 2027',
    updated: '30 Jul 2026', status: 'Scheduled',
    energy: '1,110 kcal', protein: '25 g', carbs: '162 g', fat: '32 g',
    rate: '$5.40 / day · $108 / month',
    dietary: [
      { label: 'Gluten-Free', tint: 'info' },
      { label: 'Vegetarian', tint: 'success' },
      { label: 'Egg-Free', tint: 'info' },
    ],
    contains: 'Dairy', freeFrom: 'Gluten · nuts · egg · soy',
    cafeteria: 'Main Block Cafeteria', counters: 'Counter 2 · allergen safe', capacity: '420 seats',
    servingMode: 'Plated · pre-ordered', billing: 'Monthly · $108', billingDays: '20 per month',
    nextReview: '01 Dec 2026',
    notes: 'Goes live 03 Aug 2026. Requires a medical certificate on file before a student can be assigned.',
  },
  {
    id: 'MP-2026-034', code: 'MP-2026-034', name: 'Exam Week Light Menu',
    duration: 'Weekly', audience: 'Students', audienceNote: 'Exam period only',
    enrolled: null,
    meals: {
      Breakfast: slot('07:00 – 08:30 AM', 'Whole Wheat Sandwich', '240 kcal'),
      Lunch: slot('12:00 – 01:30 PM', 'Light Pulao', '395 kcal'),
      Snacks: slot('04:00 – 05:00 PM', 'Fruit & Nut Bowl', '305 kcal'),
      Dinner: slot('07:00 – 08:30 PM', 'Khichdi', '380 kcal'),
    },
    daysCovered: 'Mon – Sat', effectiveFrom: '10 Aug 2026', effectiveTo: '22 Aug 2026',
    updated: '29 Jul 2026', status: 'Draft',
    energy: '1,320 kcal', protein: '38 g', carbs: '196 g', fat: '36 g',
    rate: '$5.20 / day · $36.40 / week',
    dietary: [
      { label: 'Vegetarian', tint: 'success' },
      { label: 'Low Oil', tint: 'info' },
      { label: 'High Fibre', tint: 'primary' },
    ],
    contains: 'Dairy · gluten · nuts', freeFrom: 'Egg · soy',
    cafeteria: 'Main Block & Hostel Mess', counters: 'All counters', capacity: '700 seats combined',
    servingMode: 'Counter service', billing: 'Weekly · $36.40', billingDays: '6 per week',
    nextReview: 'Before 10 Aug 2026',
    notes: 'Draft for the 10 – 22 Aug exam window. Meal times shifted 30 minutes earlier. Awaiting sign-off.',
  },
  {
    id: 'MP-2026-004', code: 'MP-2026-004', name: 'Summer Term Plan',
    duration: 'Monthly', audience: 'Students & Staff', audienceNote: 'Apr – Jun 2026',
    enrolled: null,
    meals: {
      Breakfast: slot('07:00 – 08:30 AM', 'Masala Dosa', '285 kcal'),
      Lunch: slot('12:00 – 01:30 PM', 'Vegetable Pulao', '410 kcal'),
      Snacks: noSlot,
      Dinner: noSlot,
    },
    daysCovered: 'Mon – Fri', effectiveFrom: '01 Apr 2026', effectiveTo: '30 Jun 2026',
    updated: '30 Jun 2026', status: 'Archived',
    energy: '695 kcal', protein: '15 g', carbs: '104 g', fat: '22 g',
    rate: '$2.90 / day · $58 / month',
    dietary: [
      { label: 'Vegetarian', tint: 'success' },
      { label: 'Egg-Free', tint: 'info' },
    ],
    contains: 'Dairy · mustard', freeFrom: 'Nuts · egg · soy',
    cafeteria: 'Main Block Cafeteria', counters: 'Counter 1 and 2', capacity: '420 seats',
    servingMode: 'Counter service', billing: 'Closed · $58 / month', billingDays: '20 per month',
    nextReview: 'Closed',
    notes: 'Closed at the end of the summer term on 30 Jun 2026. Superseded by the standard weekly plan.',
  },
];
