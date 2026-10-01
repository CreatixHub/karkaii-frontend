export type RoomTypeStatus =
  | 'Available' | 'Active' | 'Fully Occupied' | 'Maintenance' | 'Inactive' | 'Archived';

export type Category = 'Premium' | 'Standard' | 'Economy';

export type GenderAllocation = 'Any' | 'Boys' | 'Girls';

export interface RoomTypeRow {
  id: string;
  /** The template's `dt-code`, e.g. "RT-01". */
  code: string;
  name: string;
  /** Bootstrap tint stem shared by the avatar and the category badge. */
  tint: string;
  category: Category;
  /** Beds per room — the "1-Bed" badge and the "Cap 1" badge are both this. */
  capacity: number;
  gender: GenderAllocation;
  fee: number;
  /** Twice the fee on every row but Transit Twin, so it is stored. */
  deposit: number;
  amenities: string[];
  /** How many hostels offer this type. */
  hostels: number;
  occupied: number;
  available: number;
  createdBy: string;
  createdByAvatar: string;
  updated: string;
  academicYear: string;
  status: RoomTypeStatus;
}

export const statusPill: Record<RoomTypeStatus, string> = {
  Available: 'is-new',
  Active: 'is-active',
  'Fully Occupied': 'is-pending',
  Maintenance: 'is-exam',
  Inactive: 'is-inactive',
  Archived: 'is-archived',
};

/** Active and Inactive draw the plain dot. Null means "render the dot". */
export const statusIcon: Record<RoomTypeStatus, string | null> = {
  Available: 'ti ti-circle-check',
  Active: null,
  'Fully Occupied': 'ti ti-bed',
  Maintenance: 'ti ti-tool',
  Inactive: null,
  Archived: 'ti ti-archive',
};

/* ------------------------------ Filter options ------------------------------ */

export const typeOptions = [
  'Single AC Room', 'Double Sharing', 'Triple Sharing', 'Quad Sharing', 'Deluxe Single',
  'Girls Double AC', 'Dormitory (6-Bed)', 'Staff Studio', 'Transit Twin', 'Legacy Bunk (Old)',
];

export const hostelOptions = [
  'Sunrise Boys Hostel', 'Bluebell Girls Hostel', 'Maple Senior Hostel',
  'Rose Junior Hostel', 'Oak International Hostel',
];

export const blockOptions = ['Block A', 'Block B', 'Block C', 'Block E'];

/** The Capacity filter names bed counts, not numbers. */
export const capacityOptions = ['1 Bed', '2 Beds', '3 Beds', '4 Beds', '6 Beds'];

export const feeBandOptions = ['Up to $700', '$1,000 – $1,500', '$1,500+'];

/** The Facilities filter is a single amenity, not the whole set. */
export const facilityFilterOptions = ['AC', 'Bathroom', 'WiFi', 'Kitchenette'];

export const categoryOptions: Category[] = ['Premium', 'Standard', 'Economy'];

export const statusOptions: RoomTypeStatus[] = [
  'Available', 'Active', 'Fully Occupied', 'Maintenance', 'Inactive', 'Archived',
];

export const genderOptions: GenderAllocation[] = ['Any', 'Boys', 'Girls'];

/** The Configure Facilities dialog's checkbox row, in the template's order. */
export const facilityOptions = [
  'Air Conditioning', 'Attached Bathroom', 'Wi-Fi', 'Study Desk', 'Wardrobe', 'Fridge', 'Balcony',
];

export const billingCycleOptions = ['Monthly', 'Quarterly', 'Term'];

export const academicYearOptions = ['2024/2025', '2023/2024'];

export const importModes = ['Create new room types', 'Update existing by code', 'Create and update'];

/* ------------------------------- Derivations -------------------------------- */

/** Occupied plus available — the room total the panel prints. */
export const totalRoomsOf = (row: RoomTypeRow): number => row.occupied + row.available;

export const occupancyOf = (row: RoomTypeRow): number => {
  const total = totalRoomsOf(row);
  return total === 0 ? 0 : Math.round((row.occupied / total) * 100);
};

/** A type with no rooms configured reads grey; a full one reads danger. */
export const meterTint = (row: RoomTypeRow): string => {
  if (totalRoomsOf(row) === 0) return 'secondary';
  return occupancyOf(row) >= 100 ? 'danger' : 'warning';
};

/** The percentage itself reads danger when full — or when there is nothing. */
export const percentTint = (row: RoomTypeRow): string => {
  if (totalRoomsOf(row) === 0) return 'danger';
  return occupancyOf(row) >= 100 ? 'danger' : 'success';
};

export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

export const feeLabel = (row: RoomTypeRow): string => money(row.fee);

export const depositLabel = (row: RoomTypeRow): string => money(row.deposit);

/** The panel's "Per Bed / Year" line is twelve months of the monthly fee. */
export const yearlyLabel = (row: RoomTypeRow): string => money(row.fee * 12);

export const bedLabel = (row: RoomTypeRow): string => `${row.capacity}-Bed`;

/** "Single AC Room — RT-01", the read-only field every dialog opens with. */
export const typeFieldOf = (row: RoomTypeRow): string => `${row.name} — ${row.code}`;

export const summaryOf = (row: RoomTypeRow): string =>
  `${row.code} · ${row.category} · ${bedLabel(row)} · ${row.gender} Gender · ${row.academicYear}`;

export const descriptionOf = (row: RoomTypeRow): string =>
  `${row.name} — a ${row.category.toLowerCase()} ${row.capacity}-bed room type for `
  + `${row.gender.toLowerCase()} residents at ${feeLabel(row)}/month.`;

/** Beds, then the two fixtures every type has, then whatever the amenities add. */
export const furnitureOf = (row: RoomTypeRow): string => {
  const parts = [`${row.capacity} bed(s)`, 'study desk(s)', 'wardrobe(s)'];
  if (row.amenities.includes('AC')) parts.push('air conditioning');
  if (row.amenities.includes('Fridge')) parts.push('mini fridge');
  return `${parts.join(', ')}.`;
};

export const pricingLineOf = (row: RoomTypeRow): string =>
  `${feeLabel(row)}/month · ${depositLabel(row)} security deposit.`;

export const occupancyLineOf = (row: RoomTypeRow): string =>
  `${row.occupied} of ${totalRoomsOf(row)} rooms`;

export const occupancySummaryOf = (row: RoomTypeRow): string =>
  `${row.occupied} occupied · ${row.available} available across ${row.hostels} hostels`;

/** The alert line the Room Availability dialog opens with. */
export const availabilityHeaderOf = (row: RoomTypeRow): string =>
  `${row.name} · ${row.code} · ${row.available} rooms available`;

/** The Notes paragraph is a function of the status alone in all ten rows. */
export const notesOf = (row: RoomTypeRow): string => {
  switch (row.status) {
    case 'Fully Occupied':
      return 'Fully occupied — waitlist in effect.';
    case 'Maintenance':
      return 'Under maintenance — temporarily unavailable.';
    case 'Inactive':
      return 'Inactive — not offered this term.';
    case 'Archived':
      return 'Archived — retained for records only.';
    case 'Available':
    case 'Active':
    default:
      return 'Active and available for allocation.';
  }
};

/** Both guideline bullets are the same on every row of the template. */
export const usageGuidelines = [
  'Allocated on a first-come, first-served basis.',
  'Deposit refundable on satisfactory checkout.',
];

/**
 * The row's short amenity names ("AC", "Bathroom") and the Configure Facilities
 * dialog's long ones ("Air Conditioning", "Attached Bathroom") are the same set
 * written two ways, so the dialog can be seeded from the row and read back.
 */
const longNames: Record<string, string> = {
  AC: 'Air Conditioning',
  Bathroom: 'Attached Bathroom',
  'Shared Bathroom': 'Attached Bathroom',
  WiFi: 'Wi-Fi',
  'Study Desk': 'Study Desk',
  Wardrobe: 'Wardrobe',
  Fridge: 'Fridge',
  Balcony: 'Balcony',
};

const shortNames: Record<string, string> = {
  'Air Conditioning': 'AC',
  'Attached Bathroom': 'Bathroom',
  'Wi-Fi': 'WiFi',
  'Study Desk': 'Study Desk',
  Wardrobe: 'Wardrobe',
  Fridge: 'Fridge',
  Balcony: 'Balcony',
};

export const facilitiesOf = (row: RoomTypeRow): string[] =>
  row.amenities.map((amenity) => longNames[amenity]).filter(Boolean);

export const amenitiesFrom = (facilities: string[]): string[] =>
  facilities.map((facility) => shortNames[facility] ?? facility);

/* ---------------------------- Generated dialogs ------------------------------ */

export interface HostelAvailability {
  hostel: string;
  total: number;
  occupied: number;
  available: number;
}

/**
 * The availability breakdown, spread across as many hostels as the row claims,
 * with the remainder given to the first ones so the columns total the row.
 */
export const availabilityOf = (row: RoomTypeRow): HostelAvailability[] => {
  const count = Math.max(0, Math.min(row.hostels, hostelOptions.length));
  if (count === 0) return [];

  const baseOccupied = Math.floor(row.occupied / count);
  const spareOccupied = row.occupied - baseOccupied * count;
  const baseAvailable = Math.floor(row.available / count);
  const spareAvailable = row.available - baseAvailable * count;

  return Array.from({ length: count }, (_, index) => {
    const occupied = baseOccupied + (index < spareOccupied ? 1 : 0);
    const available = baseAvailable + (index < spareAvailable ? 1 : 0);
    return { hostel: hostelOptions[index], total: occupied + available, occupied, available };
  });
};

/* --------------------------------- Sorting ---------------------------------- */

export const capacityBandOf = (row: RoomTypeRow): string =>
  `${row.capacity} ${row.capacity === 1 ? 'Bed' : 'Beds'}`;

export const feeBandOf = (row: RoomTypeRow): string => {
  if (row.fee <= 700) return 'Up to $700';
  if (row.fee <= 1500) return '$1,000 – $1,500';
  return '$1,500+';
};

/** Mirrors the template's `data-search` attribute. */
export const searchIndexOf = (row: RoomTypeRow): string =>
  [
    row.name, row.code, row.category, capacityBandOf(row), row.gender, row.createdBy,
    row.status, row.amenities.join(', '), row.available > 0 ? 'rooms available' : 'no rooms',
    String(row.fee),
  ]
    .join(' ')
    .toLowerCase();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Sortable key for the template's "12 May 2024" dates. */
export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/* ---------------------------------- Rows ------------------------------------ */

export const roomTypes: RoomTypeRow[] = [
  {
    id: 'RT-01', code: 'RT-01', name: 'Single AC Room', tint: 'primary', category: 'Premium',
    capacity: 1, gender: 'Any', fee: 1800, deposit: 3600,
    amenities: ['AC', 'Bathroom', 'WiFi', 'Study Desk'],
    hostels: 5, occupied: 38, available: 12,
    createdBy: 'Kevin Larry', createdByAvatar: 'assets/img/profiles/avatar-27.jpg',
    updated: '12 May 2024', academicYear: '2024/2025', status: 'Available',
  },
  {
    id: 'RT-02', code: 'RT-02', name: 'Double Sharing', tint: 'info', category: 'Standard',
    capacity: 2, gender: 'Any', fee: 1200, deposit: 2400,
    amenities: ['Bathroom', 'WiFi', 'Wardrobe'],
    hostels: 6, occupied: 64, available: 8,
    createdBy: 'Kevin Larry', createdByAvatar: 'assets/img/profiles/avatar-27.jpg',
    updated: '11 May 2024', academicYear: '2024/2025', status: 'Active',
  },
  {
    id: 'RT-03', code: 'RT-03', name: 'Triple Sharing', tint: 'success', category: 'Economy',
    capacity: 3, gender: 'Any', fee: 700, deposit: 1400,
    amenities: ['Bathroom', 'WiFi'],
    hostels: 7, occupied: 90, available: 0,
    createdBy: 'Teressa', createdByAvatar: 'assets/img/profiles/avatar-23.jpg',
    updated: '09 May 2024', academicYear: '2024/2025', status: 'Fully Occupied',
  },
  {
    id: 'RT-04', code: 'RT-04', name: 'Quad Sharing', tint: 'warning', category: 'Economy',
    capacity: 4, gender: 'Boys', fee: 500, deposit: 1000,
    amenities: ['Shared Bathroom', 'WiFi'],
    hostels: 3, occupied: 42, available: 6,
    createdBy: 'George', createdByAvatar: 'assets/img/profiles/avatar-25.jpg',
    updated: '10 May 2024', academicYear: '2024/2025', status: 'Available',
  },
  {
    id: 'RT-05', code: 'RT-05', name: 'Deluxe Single', tint: 'purple', category: 'Premium',
    capacity: 1, gender: 'Any', fee: 2200, deposit: 4400,
    amenities: ['AC', 'Bathroom', 'WiFi', 'Sofa', 'Fridge'],
    hostels: 2, occupied: 18, available: 4,
    createdBy: 'Kevin Larry', createdByAvatar: 'assets/img/profiles/avatar-27.jpg',
    updated: '08 May 2024', academicYear: '2024/2025', status: 'Active',
  },
  {
    id: 'RT-06', code: 'RT-06', name: 'Girls Double AC', tint: 'pink', category: 'Premium',
    capacity: 2, gender: 'Girls', fee: 1500, deposit: 3000,
    amenities: ['AC', 'Bathroom', 'WiFi', 'Mirror'],
    hostels: 2, occupied: 30, available: 5,
    createdBy: 'Teressa', createdByAvatar: 'assets/img/profiles/avatar-23.jpg',
    updated: '06 May 2024', academicYear: '2024/2025', status: 'Available',
  },
  {
    id: 'RT-07', code: 'RT-07', name: 'Dormitory (6-Bed)', tint: 'teal', category: 'Economy',
    capacity: 6, gender: 'Boys', fee: 400, deposit: 800,
    amenities: ['Shared Bathroom', 'Lockers'],
    hostels: 1, occupied: 24, available: 0,
    createdBy: 'George', createdByAvatar: 'assets/img/profiles/avatar-25.jpg',
    updated: '04 May 2024', academicYear: '2024/2025', status: 'Maintenance',
  },
  {
    id: 'RT-08', code: 'RT-08', name: 'Staff Studio', tint: 'dark', category: 'Premium',
    capacity: 1, gender: 'Any', fee: 2600, deposit: 5200,
    amenities: ['AC', 'Kitchenette', 'WiFi', 'Parking'],
    hostels: 1, occupied: 17, available: 3,
    createdBy: 'Elisa', createdByAvatar: 'assets/img/profiles/avatar-01.jpg',
    updated: '01 May 2024', academicYear: '2024/2025', status: 'Active',
  },
  {
    id: 'RT-09', code: 'RT-09', name: 'Transit Twin', tint: 'secondary', category: 'Standard',
    capacity: 2, gender: 'Any', fee: 600, deposit: 600,
    amenities: ['Bathroom', 'WiFi'],
    hostels: 1, occupied: 0, available: 0,
    createdBy: 'Elisa', createdByAvatar: 'assets/img/profiles/avatar-01.jpg',
    updated: '20 Mar 2024', academicYear: '2024/2025', status: 'Inactive',
  },
  {
    id: 'RT-10', code: 'RT-10', name: 'Legacy Bunk (Old)', tint: 'danger', category: 'Economy',
    capacity: 4, gender: 'Boys', fee: 350, deposit: 700,
    amenities: ['Shared Bathroom'],
    hostels: 1, occupied: 0, available: 0,
    createdBy: 'Kevin Larry', createdByAvatar: 'assets/img/profiles/avatar-27.jpg',
    updated: '18 Nov 2023', academicYear: '2023/2024', status: 'Archived',
  },
];
