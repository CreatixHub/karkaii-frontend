export type Availability = 'Available' | 'Limited Stock' | 'Weekend Only' | 'Out of Stock' | 'Archived';

export type MealType = 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner' | 'Beverages' | 'Special Menu';

export type MenuCategory =
  | 'Main Course' | 'Rice' | 'Bread' | 'Snack' | 'Salad' | 'Soup' | 'Dessert' | 'Beverage';

export interface Ingredient {
  name: string;
  /** "120 g", "100 ml" — the amount as the template prints it. */
  amount: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
}

export interface Tag {
  label: string;
  tint: string;
}

export interface MenuItem {
  id: string;
  /** "MNU-BF-014" — the code the panel prints. */
  code: string;
  name: string;
  /** "South Indian · served with sambar" — the line under the name. */
  subtitle: string;
  category: MenuCategory;
  mealType: MealType;
  /** Short day names the item is served on. */
  days: string[];
  /** 24-hour serving window, e.g. "07:30" and "09:00". */
  from: string;
  to: string;
  /** Student price in dollars. */
  price: number;
  /** Staff price, which the template prints $0.30 above the student's. */
  staffPrice: number;
  /** "330 g" — the served portion, which is not the ingredient total. */
  portion: string;
  availability: Availability;
  updated: string;

  description: string;
  ingredients: Ingredient[];
  nutrition: Nutrition;
  /** "Mustard · groundnut oil" — the allergens declared. */
  contains: string;
  freeFrom: string;
  tags: Tag[];
  prep: string;
  remarks: string;

  /** "South Indian · Counter 2" — where the item is served from. */
  counter: string;
  /** Portions the kitchen can put out in a day. */
  capacity: number;
}

export const statusPill: Record<Availability, string> = {
  Available: 'is-active',
  'Limited Stock': 'is-review',
  'Weekend Only': 'is-pending',
  'Out of Stock': 'is-blocked',
  Archived: 'is-archived',
};

/** The View dialog and the panel print availability as a soft badge instead. */
export const statusBadge: Record<Availability, string> = {
  Available: 'badge badge-soft-success',
  'Limited Stock': 'badge badge-soft-info',
  'Weekend Only': 'badge badge-soft-warning',
  'Out of Stock': 'badge badge-soft-danger',
  Archived: 'badge badge-soft-secondary',
};

export interface MealStyle {
  icon: string;
  tint: string;
  /** The period card's serving window, which the items share. */
  window: string;
  /** "1 breakfast credit" — what the panel prints against a meal plan. */
  credit: string;
  /** The code segment: MNU-BF-014. */
  segment: string;
}

/** One meal type decides the icon, the tint, the card and the plan credit. */
export const mealStyle: Record<MealType, MealStyle> = {
  Breakfast: {
    icon: 'ti ti-coffee', tint: 'warning', window: '07:30 – 09:00 AM',
    credit: '1 breakfast credit', segment: 'BF',
  },
  Lunch: {
    icon: 'ti ti-tools-kitchen-2', tint: 'primary', window: '12:30 – 02:00 PM',
    credit: '1 lunch credit', segment: 'LN',
  },
  Snacks: {
    icon: 'ti ti-cookie', tint: 'info', window: '04:00 – 05:00 PM',
    credit: '1 snack credit', segment: 'SN',
  },
  Dinner: {
    icon: 'ti ti-soup', tint: 'purple', window: '07:30 – 09:00 PM',
    credit: '1 dinner credit', segment: 'DN',
  },
  Beverages: {
    icon: 'ti ti-glass-full', tint: 'success', window: '07:00 AM – 06:00 PM',
    credit: 'Beverage credit', segment: 'BV',
  },
  'Special Menu': {
    icon: 'ti ti-star', tint: 'danger', window: 'Weekends & festivals',
    credit: 'Special counter · paid', segment: 'SP',
  },
};

/**
 * Category badge tints. The template colours six of the eight categories; Salad
 * and Soup never appear in its eight rows, so they take the two tints the set
 * has not used.
 */
export const categoryTint: Record<MenuCategory, string> = {
  'Main Course': 'primary',
  Rice: 'warning',
  Bread: 'secondary',
  Snack: 'info',
  Salad: 'success',
  Soup: 'purple',
  Dessert: 'danger',
  Beverage: 'success',
};

/* ------------------------------ Filter options ------------------------------ */

export const mealTypeOptions: MealType[] = [
  'Breakfast', 'Lunch', 'Snacks', 'Dinner', 'Beverages', 'Special Menu',
];

export const categoryOptions: MenuCategory[] = [
  'Main Course', 'Rice', 'Bread', 'Snack', 'Salad', 'Soup', 'Dessert', 'Beverage',
];

export const dayOptions = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];

export const availabilityOptions: Availability[] = [
  'Available', 'Limited Stock', 'Weekend Only', 'Out of Stock', 'Archived',
];

export const dietaryOptions = ['Veg', 'Vegan', 'Jain', 'Non-Veg', 'Gluten-Free', 'Egg-Free'];

export const allergenOptions = [
  'Excludes dairy', 'Excludes gluten', 'Excludes nuts', 'Excludes egg', 'Excludes soy',
];

export const priceOptions = ['Under $1.00', '$1.00 – $2.00', '$2.00 – $3.00', 'Over $3.00'];

export const calorieOptions = [
  'Under 250 kcal', '250 – 400 kcal', '400 – 550 kcal', 'Over 550 kcal',
];

/* --------------------------- Dialog option lists ----------------------------- */

export const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const allergenChoices = ['None', 'Dairy', 'Gluten', 'Nuts', 'Egg', 'Soy'];

export const plannerAppliesOptions = [
  'Students & staff', 'Students only', 'Staff only', 'Hostel residents only',
];

export const plannerCopyOptions = ['Previous week', 'Same week last term', 'Start from blank'];

export const archiveReasonOptions = [
  'Revised sugar policy', 'Low demand', 'Ingredient unavailable', 'Cost increase', 'Seasonal item',
];

export const replacementOptions = ['Fruit Custard', 'Fresh Fruit Bowl', 'No replacement'];

/* ------------------------------- Derivations -------------------------------- */

export const money = (value: number): string => `$${value.toFixed(2)}`;

export const priceLabel = (row: MenuItem): string => money(row.price);

export const caloriesLabel = (row: MenuItem): string => `${row.nutrition.calories} kcal`;

/** "07:30" → "07:30 AM"; the meridiem is dropped when both halves share it. */
const twelveHour = (time: string): { text: string; suffix: string } => {
  const [hourText, minute] = time.split(':');
  const hour = Number(hourText);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return { text: `${String(twelve).padStart(2, '0')}:${minute}`, suffix };
};

export const servingLabel = (row: MenuItem): string => {
  const start = twelveHour(row.from);
  const end = twelveHour(row.to);
  return start.suffix === end.suffix
    ? `${start.text} – ${end.text} ${end.suffix}`
    : `${start.text} ${start.suffix} – ${end.text} ${end.suffix}`;
};

/** The View dialog's Serving tile prints the opening time alone. */
export const openingLabel = (row: MenuItem): string => {
  const start = twelveHour(row.from);
  return `${start.text} ${start.suffix}`;
};

const longDays: Record<string, string> = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
  Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
};

/**
 * The Day column summarises the list rather than joining it: seven days read
 * "Daily", the working week "Mon – Fri", one day is spelled out in full.
 */
export const dayLabel = (row: MenuItem): string => {
  if (row.days.length === 7) return 'Daily';
  if (row.days.length === 1) return longDays[row.days[0]] ?? row.days[0];
  const weekdays = shortDays.slice(0, 5);
  if (row.days.length === 5 && weekdays.every((day) => row.days.includes(day))) return 'Mon – Fri';
  return shortDays.filter((day) => row.days.includes(day)).join(', ');
};

export const daysPerWeek = (row: MenuItem): string =>
  `${row.days.length} / week`;

export const nutritionPairsOf = (row: MenuItem): { label: string; value: string }[] => [
  { label: 'Calories', value: `${row.nutrition.calories} kcal` },
  { label: 'Protein', value: `${row.nutrition.protein} g` },
  { label: 'Carbohydrates', value: `${row.nutrition.carbs} g` },
  { label: 'Fat', value: `${row.nutrition.fat} g` },
  { label: 'Fibre', value: `${row.nutrition.fibre} g` },
];

export const allergenPairsOf = (row: MenuItem): { label: string; value: string }[] => [
  { label: 'Contains', value: row.contains },
  { label: 'Free From', value: row.freeFrom },
];

/** "Breakfast  •  Main Course  •  Mon, Wed, Fri" — the View dialog's sub-line. */
export const summaryOf = (row: MenuItem): string =>
  `${row.mealType}  •  ${row.category}  •  ${dayLabel(row)}`;

/** "Special Menu · Sunday · $3.20 · 620 kcal" — the Duplicate dialog's line. */
export const compactOf = (row: MenuItem): string =>
  `${row.mealType} · ${dayLabel(row)} · ${priceLabel(row)} · ${caloriesLabel(row)}`;

export interface AuditEntry {
  title: string;
  meta: string;
}

/**
 * The panel's audit trail. The template writes three fixed lines; here they are
 * the item's own history — created, priced and planned — off the row.
 */
export const auditOf = (row: MenuItem): AuditEntry[] => [
  { title: 'Menu item created', meta: `${row.code} · Catering Office` },
  { title: `Price revised to ${priceLabel(row)}`, meta: `${row.updated} · Catering Office` },
  {
    title: row.availability === 'Archived' ? 'Withdrawn from the weekly plan' : 'Added to the weekly plan',
    meta: `${row.updated} · ${row.mealType} rotation`,
  },
];

/* --------------------------------- Filters ---------------------------------- */

export const priceBandOf = (row: MenuItem): string => {
  if (row.price < 1) return 'Under $1.00';
  if (row.price <= 2) return '$1.00 – $2.00';
  if (row.price <= 3) return '$2.00 – $3.00';
  return 'Over $3.00';
};

export const calorieBandOf = (row: MenuItem): string => {
  const { calories } = row.nutrition;
  if (calories < 250) return 'Under 250 kcal';
  if (calories <= 400) return '250 – 400 kcal';
  if (calories <= 550) return '400 – 550 kcal';
  return 'Over 550 kcal';
};

/** "Excludes dairy" matches an item whose Free From line names dairy. */
export const excludes = (row: MenuItem, option: string): boolean => {
  const allergen = option.replace(/^excludes\s+/i, '').toLowerCase();
  return row.freeFrom.toLowerCase().includes(allergen);
};

/** The dietary filter reads the tag list, where "Jain option" answers for Jain. */
export const hasDietaryTag = (row: MenuItem, tag: string): boolean =>
  row.tags.some((entry) => entry.label.toLowerCase().includes(tag.toLowerCase()));

export const servesOn = (row: MenuItem, day: string): boolean =>
  row.days.some((short) => longDays[short] === day);

export const searchIndexOf = (row: MenuItem): string =>
  [
    row.name, row.code, row.subtitle, row.category, row.mealType, dayLabel(row),
    row.availability, row.description, row.ingredients.map((item) => item.name).join(' '),
    row.tags.map((tag) => tag.label).join(' '),
  ]
    .join(' ')
    .toLowerCase();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Sortable key for the template's "28 Jul 2026" dates. */
export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/* ------------------------------- Meal periods -------------------------------- */

export interface MealPeriod {
  meal: MealType;
  /** Items on the whole menu, which runs to 74 rows behind this page's eight. */
  items: number;
  available: number;
}

/**
 * The six cards above the grid count the whole menu — the footer says this page
 * holds 8 of 74 items — so the template's figures stand and the roster moves
 * them (see `periodsOf` in the page).
 */
export const mealPeriods: MealPeriod[] = [
  { meal: 'Breakfast', items: 14, available: 12 },
  { meal: 'Lunch', items: 18, available: 16 },
  { meal: 'Snacks', items: 11, available: 9 },
  { meal: 'Dinner', items: 17, available: 15 },
  { meal: 'Beverages', items: 10, available: 9 },
  { meal: 'Special Menu', items: 4, available: 2 },
];

/** The week the planner opens on, which the template shows as a filter chip. */
export const PLANNER_WEEK = '27 Jul – 02 Aug 2026';

/* ---------------------------------- Rows ------------------------------------ */

export const menuItems: MenuItem[] = [
  {
    id: 'MNU-BF-014', code: 'MNU-BF-014', name: 'Masala Dosa',
    subtitle: 'South Indian · served with sambar',
    category: 'Main Course', mealType: 'Breakfast', days: ['Mon', 'Wed', 'Fri'],
    from: '07:30', to: '09:00', price: 1.2, staffPrice: 1.5, portion: '330 g', availability: 'Available', updated: '28 Jul 2026',
    description:
      'Crisp fermented rice and lentil crepe filled with spiced potato, served with coconut chutney and sambar.',
    ingredients: [
      { name: 'Rice & urad dal batter', amount: '120 g' },
      { name: 'Potato masala filling', amount: '80 g' },
      { name: 'Coconut chutney', amount: '30 g' },
      { name: 'Sambar', amount: '100 ml' },
      { name: 'Groundnut oil', amount: '8 ml' },
    ],
    nutrition: { calories: 285, protein: 6, carbs: 42, fat: 9, fibre: 3 },
    contains: 'Mustard · groundnut oil', freeFrom: 'Gluten · egg · dairy',
    tags: [
      { label: 'Veg', tint: 'success' },
      { label: 'Vegan', tint: 'success' },
      { label: 'Gluten-Free', tint: 'info' },
    ],
    prep: 'Batter fermented overnight. Griddle held at 190°C. Prepared to order in batches of 20.',
    remarks: 'Highest rated breakfast item. Consider adding to the Tuesday rotation from next term.',
    counter: 'South Indian · Counter 2', capacity: 180,
  },
  {
    id: 'MNU-LN-021', code: 'MNU-LN-021', name: 'Vegetable Pulao',
    subtitle: 'Basmati rice · seasonal vegetables',
    category: 'Rice', mealType: 'Lunch', days: ['Tue', 'Thu'],
    from: '12:30', to: '14:00', price: 1.8, staffPrice: 2.1, portion: '338 g', availability: 'Available', updated: '29 Jul 2026',
    description:
      'Long grain basmati cooked with seasonal vegetables and whole spices, served with raita and papad.',
    ingredients: [
      { name: 'Basmati rice', amount: '150 g' },
      { name: 'Mixed vegetables', amount: '90 g' },
      { name: 'Curd raita', amount: '80 g' },
      { name: 'Whole spices', amount: '6 g' },
      { name: 'Ghee', amount: '12 g' },
    ],
    nutrition: { calories: 410, protein: 9, carbs: 62, fat: 13, fibre: 5 },
    contains: 'Dairy · ghee and raita', freeFrom: 'Gluten · egg · nuts',
    tags: [
      { label: 'Veg', tint: 'success' },
      { label: 'Jain option', tint: 'purple' },
      { label: 'Gluten-Free', tint: 'info' },
    ],
    prep: 'Rice soaked 30 minutes before cooking. Jain variant prepared without onion or garlic on request.',
    remarks: 'Jain variant runs about 12 portions per service. Pre-order list closes at 11:00 AM.',
    counter: 'Main Kitchen · Counter 1', capacity: 220,
  },
  {
    id: 'MNU-SN-008', code: 'MNU-SN-008', name: 'Grilled Paneer Wrap',
    subtitle: 'Whole wheat wrap · mint yoghurt',
    category: 'Snack', mealType: 'Snacks', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    from: '16:00', to: '17:00', price: 1.5, staffPrice: 1.8, portion: '241 g', availability: 'Limited Stock', updated: '31 Jul 2026',
    description:
      'Grilled paneer with peppers and onion in a whole wheat wrap, finished with mint yoghurt dressing.',
    ingredients: [
      { name: 'Whole wheat wrap', amount: '70 g' },
      { name: 'Paneer', amount: '80 g' },
      { name: 'Peppers & onion', amount: '50 g' },
      { name: 'Mint yoghurt', amount: '35 g' },
      { name: 'Olive oil', amount: '6 ml' },
    ],
    nutrition: { calories: 320, protein: 14, carbs: 34, fat: 14, fibre: 4 },
    contains: 'Gluten · dairy', freeFrom: 'Egg · nuts · soy',
    tags: [
      { label: 'Veg', tint: 'success' },
      { label: 'Contains Dairy', tint: 'warning' },
      { label: 'Contains Gluten', tint: 'warning' },
    ],
    prep: 'Paneer marinated for 2 hours. Wraps grilled to order; holding time capped at 20 minutes.',
    remarks: 'Only 24 portions left for today. Paneer delivery is due 01 Aug — reorder raised with the supplier.',
    counter: 'Snack Bar · Counter 4', capacity: 120,
  },
  {
    id: 'MNU-DN-017', code: 'MNU-DN-017', name: 'Rajma Chawal',
    subtitle: 'Kidney bean curry · steamed rice',
    category: 'Main Course', mealType: 'Dinner', days: ['Wed', 'Sat'],
    from: '19:30', to: '21:00', price: 2.1, staffPrice: 2.4, portion: '360 g', availability: 'Available', updated: '27 Jul 2026',
    description:
      'Slow cooked kidney beans in a tomato and onion gravy, served with steamed rice and a wedge of lime.',
    ingredients: [
      { name: 'Kidney beans', amount: '110 g' },
      { name: 'Steamed rice', amount: '150 g' },
      { name: 'Tomato onion gravy', amount: '90 g' },
      { name: 'Spice blend', amount: '8 g' },
      { name: 'Sunflower oil', amount: '10 ml' },
    ],
    nutrition: { calories: 465, protein: 16, carbs: 74, fat: 11, fibre: 12 },
    contains: 'None declared', freeFrom: 'Gluten · dairy · egg · nuts',
    tags: [
      { label: 'Veg', tint: 'success' },
      { label: 'Vegan', tint: 'success' },
      { label: 'High Protein', tint: 'primary' },
    ],
    prep: 'Beans soaked 8 hours and pressure cooked. Gravy prepared fresh each service, never carried over.',
    remarks: 'Most requested dinner item on the hostel feedback form. Portion size raised to 150 g in June.',
    counter: 'Main Kitchen · Counter 1', capacity: 200,
  },
  {
    id: 'MNU-BV-005', code: 'MNU-BV-005', name: 'Fresh Fruit Smoothie',
    subtitle: 'Seasonal fruit · no added sugar',
    category: 'Beverage', mealType: 'Beverages',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    from: '07:00', to: '18:00', price: 1.1, staffPrice: 1.4, portion: '290 g', availability: 'Available', updated: '30 Jul 2026',
    description:
      'Blended seasonal fruit with yoghurt and a splash of honey. No added sugar or artificial colour.',
    ingredients: [
      { name: 'Seasonal fruit', amount: '160 g' },
      { name: 'Yoghurt', amount: '80 g' },
      { name: 'Honey', amount: '10 g' },
      { name: 'Ice', amount: '40 g' },
    ],
    nutrition: { calories: 180, protein: 4, carbs: 34, fat: 3, fibre: 3 },
    contains: 'Dairy · yoghurt base', freeFrom: 'Gluten · egg · nuts',
    tags: [
      { label: 'Veg', tint: 'success' },
      { label: 'No Added Sugar', tint: 'info' },
      { label: 'Contains Dairy', tint: 'warning' },
    ],
    prep: 'Blended to order. Vegan variant available with oat milk in place of yoghurt at the same price.',
    remarks: 'Fruit selection rotates weekly with market availability. Mango runs 01 Jul to 31 Aug.',
    counter: 'Beverage Bar · Counter 5', capacity: 260,
  },
  {
    id: 'MNU-SP-003', code: 'MNU-SP-003', name: 'Chicken Biryani',
    subtitle: 'Dum cooked · served with raita',
    category: 'Main Course', mealType: 'Special Menu', days: ['Sun'],
    from: '12:30', to: '14:00', price: 3.2, staffPrice: 3.5, portion: '435 g', availability: 'Weekend Only', updated: '26 Jul 2026',
    description:
      'Dum cooked basmati layered with marinated chicken, saffron and fried onion. Served with raita and salan.',
    ingredients: [
      { name: 'Basmati rice', amount: '170 g' },
      { name: 'Marinated chicken', amount: '140 g' },
      { name: 'Fried onion & saffron', amount: '30 g' },
      { name: 'Curd raita', amount: '80 g' },
      { name: 'Ghee', amount: '15 g' },
    ],
    nutrition: { calories: 620, protein: 32, carbs: 78, fat: 20, fibre: 4 },
    contains: 'Dairy · ghee and raita', freeFrom: 'Gluten · egg · nuts',
    tags: [
      { label: 'Non-Veg', tint: 'danger' },
      { label: 'Contains Dairy', tint: 'warning' },
      { label: 'High Protein', tint: 'primary' },
    ],
    prep: 'Chicken marinated 6 hours. Dum sealed and cooked 45 minutes. Served from the special counter only.',
    remarks: 'Sunday special. Head count confirmed by Saturday 06:00 PM so procurement can be finalised.',
    counter: 'Special Counter · Counter 6', capacity: 150,
  },
  {
    id: 'MNU-BF-022', code: 'MNU-BF-022', name: 'Whole Wheat Sandwich',
    subtitle: 'Grilled · vegetable filling',
    category: 'Bread', mealType: 'Breakfast', days: ['Tue', 'Thu'],
    from: '07:30', to: '09:00', price: 0.9, staffPrice: 1.2, portion: '173 g', availability: 'Out of Stock', updated: '31 Jul 2026',
    description: 'Grilled whole wheat sandwich with cucumber, tomato, lettuce and a light herb spread.',
    ingredients: [
      { name: 'Whole wheat bread', amount: '80 g' },
      { name: 'Vegetable filling', amount: '70 g' },
      { name: 'Herb spread', amount: '15 g' },
      { name: 'Butter', amount: '8 g' },
    ],
    nutrition: { calories: 240, protein: 9, carbs: 36, fat: 6, fibre: 6 },
    contains: 'Gluten · dairy', freeFrom: 'Egg · nuts · soy',
    tags: [
      { label: 'Veg', tint: 'success' },
      { label: 'Contains Gluten', tint: 'warning' },
      { label: 'Contains Dairy', tint: 'warning' },
    ],
    prep: 'Bread delivered daily at 05:30 AM. Sandwiches grilled in batches of 30 through the service window.',
    remarks: 'Bread delivery missed on 31 Jul. Item withdrawn for the day; supplier credit note requested.',
    counter: 'Snack Bar · Counter 4', capacity: 140,
  },
  {
    id: 'MNU-SP-009', code: 'MNU-SP-009', name: 'Gulab Jamun',
    subtitle: 'Warm milk solids · rose syrup',
    category: 'Dessert', mealType: 'Special Menu', days: ['Fri'],
    from: '19:30', to: '21:00', price: 0.8, staffPrice: 1.1, portion: '145 g', availability: 'Archived', updated: '22 Jul 2026',
    description: 'Warm milk solid dumplings soaked in cardamom and rose syrup. Served two pieces per portion.',
    ingredients: [
      { name: 'Milk solids', amount: '60 g' },
      { name: 'Refined flour', amount: '15 g' },
      { name: 'Sugar syrup', amount: '70 g' },
    ],
    nutrition: { calories: 310, protein: 4, carbs: 46, fat: 12, fibre: 0 },
    contains: 'Dairy · gluten', freeFrom: 'Egg · nuts',
    tags: [
      { label: 'Veg', tint: 'success' },
      { label: 'High Sugar', tint: 'danger' },
      { label: 'Contains Dairy', tint: 'warning' },
    ],
    prep: 'Prepared in the morning and held warm in syrup. Not reheated more than once.',
    remarks: 'Archived on 22 Jul following the revised sugar policy. Replaced by fruit custard on Fridays.',
    counter: 'Special Counter · Counter 6', capacity: 90,
  },
];
