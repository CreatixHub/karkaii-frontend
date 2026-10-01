export type HostelStatus =
  | 'Available' | 'Nearly Full' | 'Full' | 'Under Maintenance' | 'Closed' | 'Archived';

export type HostelType = 'Boys' | 'Girls' | 'Co-Ed' | 'Staff';

export type Sharing = 'Single' | 'Double Sharing' | 'Triple Sharing' | 'Quad Sharing';

export interface Hostel {
  id: string;
  /** The template's `dt-code`, e.g. "HST-01". */
  code: string;
  name: string;
  /** Bootstrap tint stem shared by the avatar and the building badge. */
  tint: string;
  type: HostelType;
  block: string;
  floors: number;
  warden: string;
  wardenAvatar: string;
  /** The warden's line, printed in the row, the panel and the View dialog. */
  contact: string;
  rooms: number;
  capacity: number;
  occupied: number;
  sharing: Sharing;
  facilities: string[];
  /** Monthly fee in dollars; printed as "$2,100"/mo. */
  fee: number;
  updated: string;
  academicYear: string;
  status: HostelStatus;
}

export const statusPill: Record<HostelStatus, string> = {
  Available: 'is-active',
  'Nearly Full': 'is-pending',
  Full: 'is-emergency',
  'Under Maintenance': 'is-new',
  Closed: 'is-inactive',
  Archived: 'is-archived',
};

/** Available and Closed draw the plain dot; the rest lead with an icon. */
export const statusIcon: Record<HostelStatus, string | null> = {
  Available: null,
  'Nearly Full': 'ti ti-alert-circle',
  Full: 'ti ti-bed',
  'Under Maintenance': 'ti ti-tool',
  Closed: null,
  Archived: 'ti ti-archive',
};

/* ------------------------------ Filter options ------------------------------ */

export const hostelOptions = [
  'Sunrise Boys Hostel', 'Bluebell Girls Hostel', 'Maple Senior Hostel', 'Rose Junior Hostel',
  'Oak International Hostel', 'Cedar Boys Annexe', 'Willow Girls Annexe', 'Pine Staff Quarters',
  'Aspen Transit Hostel', 'Birch Legacy Hostel',
];

export const typeOptions: HostelType[] = ['Boys', 'Girls', 'Co-Ed', 'Staff'];

export const wardenOptions = [
  'Aariv Kumar', 'Teresa Vale', 'Ramsey Fox', 'Hendrita Ray', 'Marcus Lee',
  'Joseph Ray', 'Erickson Poe', 'James Kirk', 'Morgan Hale', 'Mori Sato',
];

export const blockOptions = [
  'Block A', 'Block B', 'Block C', 'Block D', 'Block E',
  'Block F', 'Block G', 'Block H', 'Block I', 'Old Block',
];

/** The Floor select filters on the building's height, not on a single floor. */
export const floorOptions = ['2 Floors', '3 Floors', '4 Floors', '5 Floors', '6 Floors'];

export const occupancyOptions = ['Empty', 'Occupied', 'Nearly Full', 'Full'];

export const availabilityOptions = ['Beds Available', 'No Vacancy'];

export const statusOptions: HostelStatus[] = [
  'Available', 'Nearly Full', 'Full', 'Under Maintenance', 'Closed', 'Archived',
];

export const academicYearOptions = ['2024/2025', '2023/2024'];

/** The Facilities dialog's checkbox row, in the template's order. */
export const facilityOptions = ['WiFi', 'Mess', 'Laundry', 'Gym', 'AC', 'Library', 'Parking'];

/** The Room Type select spells Single out; the row badge shortens it. */
export const roomTypeOptions = ['Single Room', 'Double Sharing', 'Triple Sharing', 'Quad Sharing'];

export const shiftOptions = ['Full Day', 'Day', 'Night'];

export const importModes = ['Create new hostels', 'Update existing by code', 'Create and update'];

/* ------------------------------- Derivations -------------------------------- */

export const availableOf = (row: Hostel): number => Math.max(0, row.capacity - row.occupied);

export const occupancyOf = (row: Hostel): number =>
  row.capacity === 0 ? 0 : Math.round((row.occupied / row.capacity) * 100);

/** Full reads danger, above 85% warning, everything below that success. */
export const occupancyTint = (percent: number): string => {
  if (percent >= 100) return 'danger';
  if (percent > 85) return 'warning';
  return 'success';
};

export const feeLabel = (row: Hostel): string => `$${row.fee.toLocaleString('en-US')}`;

export const floorsLabel = (row: Hostel): string => `${row.floors} Floors`;

/** "Single" in the badge is "Single Room" in the Room Type select. */
export const roomTypeLabel = (sharing: Sharing): string =>
  sharing === 'Single' ? 'Single Room' : sharing;

export const sharingFromRoomType = (roomType: string): Sharing =>
  (roomType === 'Single Room' ? 'Single' : roomType) as Sharing;

export const descriptionOf = (row: Hostel): string =>
  `${row.name} — a ${row.type.toLowerCase()} hostel in ${row.block} with ${row.floors} floors and `
  + `${row.rooms} rooms.`;

export const buildingInfoOf = (row: Hostel): string =>
  `${row.block} · ${row.floors} floors · ${roomTypeLabel(row.sharing)} rooms.`;

export const occupancyLineOf = (row: Hostel): string =>
  `${row.occupied} / ${row.capacity} beds`;

/** The View dialog adds the vacancy to the same line. */
export const occupancySummaryOf = (row: Hostel): string =>
  `${row.occupied} / ${row.capacity} beds · ${availableOf(row)} available`;

export const roomsLineOf = (row: Hostel): string =>
  `${row.rooms} rooms · ${roomTypeLabel(row.sharing)} · ${feeLabel(row)}/mo.`;

export const summaryOf = (row: Hostel): string =>
  `${row.code} · ${row.type} · ${row.block} · ${floorsLabel(row)} · ${row.academicYear}`;

/** The alert line the Manage Rooms dialog opens with. */
export const roomsHeaderOf = (row: Hostel): string =>
  `${row.name} · ${row.block} · ${row.rooms} rooms`;

/** The Notes paragraph is a function of the status alone in all ten rows. */
export const notesOf = (row: Hostel): string => {
  switch (row.status) {
    case 'Full':
      return 'Fully occupied — waitlist in effect.';
    case 'Under Maintenance':
      return 'Under maintenance — reopening after renovation.';
    case 'Closed':
      return 'Closed — not accepting residents this term.';
    case 'Archived':
      return 'Archived — retained for records only.';
    case 'Available':
    case 'Nearly Full':
    default:
      return 'Operational and accepting residents.';
  }
};

/** The medical and security lines are the same on every row of the template. */
export const MEDICAL_PHONE = '+1 546 8548 600';
export const SECURITY_PHONE = '+1 546 8548 601';

/* ---------------------------- Generated dialogs ------------------------------ */

export interface HostelRoom {
  room: string;
  floor: number;
  type: string;
  /** "3/3" — occupants over beds. */
  beds: string;
  status: 'Full' | 'Available' | string;
  tint: string;
}

/** Beds per room, read back out of the sharing type. */
export const bedsPerRoom = (sharing: Sharing): number => {
  switch (sharing) {
    case 'Single': return 1;
    case 'Double Sharing': return 2;
    case 'Quad Sharing': return 4;
    case 'Triple Sharing':
    default: return 3;
  }
};

/**
 * The template lists four fixed rooms for a sixty-room hostel. Generated here
 * instead: rooms are numbered by floor the way the template numbers them
 * (A-101, A-102, A-201…), and the occupancy is spread across them so the beds
 * column adds back up to the row's occupied count.
 */
export const roomsOf = (row: Hostel, limit = 8): HostelRoom[] => {
  const beds = bedsPerRoom(row.sharing);
  const perFloor = Math.max(1, Math.ceil(row.rooms / row.floors));
  const shown = Math.min(limit, row.rooms);
  const letter = row.block.replace(/[^A-Za-z]/g, '').slice(-1).toUpperCase() || 'A';

  let remaining = row.occupied;
  return Array.from({ length: shown }, (_, index) => {
    const floor = Math.floor(index / perFloor) + 1;
    const number = (index % perFloor) + 1;
    const filled = Math.max(0, Math.min(beds, remaining));
    remaining -= filled;
    const vacant = beds - filled;
    return {
      room: `${letter}-${floor}${String(number).padStart(2, '0')}`,
      floor,
      type: row.sharing.replace(' Sharing', ''),
      beds: `${filled}/${beds}`,
      status: vacant === 0 ? 'Full' : filled === 0 ? 'Available' : `${vacant} Vacant`,
      tint: vacant === 0 ? 'danger' : filled === 0 ? 'success' : 'warning',
    };
  });
};

export interface FloorSummary {
  floor: number;
  rooms: number;
  occupied: number;
  available: number;
}

/** Same rule for the Occupancy dialog: the floors add back up to the row. */
export const floorsOf = (row: Hostel): FloorSummary[] => {
  const baseRooms = Math.floor(row.rooms / row.floors);
  const spareRooms = row.rooms - baseRooms * row.floors;
  const baseOccupied = Math.floor(row.occupied / row.floors);
  const spareOccupied = row.occupied - baseOccupied * row.floors;
  const beds = bedsPerRoom(row.sharing);

  return Array.from({ length: row.floors }, (_, index) => {
    const rooms = baseRooms + (index < spareRooms ? 1 : 0);
    const occupied = baseOccupied + (index < spareOccupied ? 1 : 0);
    return { floor: index + 1, rooms, occupied, available: Math.max(0, rooms * beds - occupied) };
  });
};

/* --------------------------------- Sorting ---------------------------------- */

/** Mirrors the template's `data-search` attribute. */
export const searchIndexOf = (row: Hostel): string =>
  [
    row.name, row.code, row.type, row.warden, row.block, `floor ${row.floors}`,
    row.status, availableOf(row) > 0 ? 'beds available' : 'no vacancy',
    row.academicYear, row.sharing, row.facilities.join(' '),
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

/** The Occupancy Status filter, as the four bands the template names. */
export const occupancyBandOf = (row: Hostel): string => {
  const percent = occupancyOf(row);
  if (percent === 0) return 'Empty';
  if (percent >= 100) return 'Full';
  if (percent > 85) return 'Nearly Full';
  return 'Occupied';
};

/* ---------------------------------- Rows ------------------------------------ */

export const hostels: Hostel[] = [
  {
    id: 'HST-01', code: 'HST-01', name: 'Sunrise Boys Hostel', tint: 'primary', type: 'Boys',
    block: 'Block A', floors: 4, warden: 'Aariv Kumar',
    wardenAvatar: 'assets/img/teachers/teacher-09.jpg', contact: '+1 546 8548 620',
    rooms: 60, capacity: 180, occupied: 168, sharing: 'Triple Sharing',
    facilities: ['WiFi', 'Mess', 'Laundry', 'Gym'], fee: 2100,
    updated: '12 May 2024', academicYear: '2024/2025', status: 'Nearly Full',
  },
  {
    id: 'HST-02', code: 'HST-02', name: 'Bluebell Girls Hostel', tint: 'pink', type: 'Girls',
    block: 'Block B', floors: 5, warden: 'Teresa Vale',
    wardenAvatar: 'assets/img/teachers/teacher-05.jpg', contact: '+1 546 8548 621',
    rooms: 75, capacity: 225, occupied: 200, sharing: 'Double Sharing',
    facilities: ['WiFi', 'Mess', 'Laundry', 'Library'], fee: 2400,
    updated: '11 May 2024', academicYear: '2024/2025', status: 'Available',
  },
  {
    id: 'HST-03', code: 'HST-03', name: 'Maple Senior Hostel', tint: 'info', type: 'Boys',
    block: 'Block C', floors: 3, warden: 'Ramsey Fox',
    wardenAvatar: 'assets/img/teachers/teacher-08.jpg', contact: '+1 546 8548 622',
    rooms: 36, capacity: 72, occupied: 72, sharing: 'Double Sharing',
    facilities: ['WiFi', 'Mess', 'AC', 'Study Hall'], fee: 2800,
    updated: '09 May 2024', academicYear: '2024/2025', status: 'Full',
  },
  {
    id: 'HST-04', code: 'HST-04', name: 'Rose Junior Hostel', tint: 'purple', type: 'Girls',
    block: 'Block D', floors: 4, warden: 'Hendrita Ray',
    wardenAvatar: 'assets/img/teachers/teacher-06.jpg', contact: '+1 546 8548 623',
    rooms: 48, capacity: 144, occupied: 96, sharing: 'Triple Sharing',
    facilities: ['WiFi', 'Mess', 'Laundry', 'Playroom'], fee: 1900,
    updated: '10 May 2024', academicYear: '2024/2025', status: 'Available',
  },
  {
    id: 'HST-05', code: 'HST-05', name: 'Oak International Hostel', tint: 'success', type: 'Co-Ed',
    block: 'Block E', floors: 6, warden: 'Marcus Lee',
    wardenAvatar: 'assets/img/teachers/teacher-06.jpg', contact: '+1 546 8548 624',
    rooms: 90, capacity: 180, occupied: 60, sharing: 'Single',
    facilities: ['WiFi', 'Mess', 'AC', 'Gym', 'Cafe'], fee: 3500,
    updated: '08 May 2024', academicYear: '2024/2025', status: 'Available',
  },
  {
    id: 'HST-06', code: 'HST-06', name: 'Cedar Boys Annexe', tint: 'warning', type: 'Boys',
    block: 'Block F', floors: 2, warden: 'Joseph Ray',
    wardenAvatar: 'assets/img/teachers/teacher-03.jpg', contact: '+1 546 8548 625',
    rooms: 24, capacity: 96, occupied: 0, sharing: 'Quad Sharing',
    facilities: ['WiFi', 'Mess'], fee: 1600,
    updated: '02 May 2024', academicYear: '2024/2025', status: 'Under Maintenance',
  },
  {
    id: 'HST-07', code: 'HST-07', name: 'Willow Girls Annexe', tint: 'teal', type: 'Girls',
    block: 'Block G', floors: 3, warden: 'Erickson Poe',
    wardenAvatar: 'assets/img/teachers/teacher-01.jpg', contact: '+1 546 8548 626',
    rooms: 45, capacity: 135, occupied: 120, sharing: 'Triple Sharing',
    facilities: ['WiFi', 'Mess', 'Laundry'], fee: 2000,
    updated: '06 May 2024', academicYear: '2024/2025', status: 'Nearly Full',
  },
  {
    id: 'HST-08', code: 'HST-08', name: 'Pine Staff Quarters', tint: 'dark', type: 'Staff',
    block: 'Block H', floors: 2, warden: 'James Kirk',
    wardenAvatar: 'assets/img/teachers/teacher-04.jpg', contact: '+1 546 8548 627',
    rooms: 20, capacity: 40, occupied: 34, sharing: 'Single',
    facilities: ['WiFi', 'Kitchen', 'Parking'], fee: 2600,
    updated: '04 May 2024', academicYear: '2024/2025', status: 'Available',
  },
  {
    id: 'HST-09', code: 'HST-09', name: 'Aspen Transit Hostel', tint: 'danger', type: 'Co-Ed',
    block: 'Block I', floors: 3, warden: 'Morgan Hale',
    wardenAvatar: 'assets/img/teachers/teacher-10.jpg', contact: '+1 546 8548 628',
    rooms: 30, capacity: 90, occupied: 0, sharing: 'Double Sharing',
    facilities: ['WiFi', 'Mess'], fee: 1800,
    updated: '20 Mar 2024', academicYear: '2024/2025', status: 'Closed',
  },
  {
    id: 'HST-10', code: 'HST-10', name: 'Birch Legacy Hostel', tint: 'secondary', type: 'Boys',
    block: 'Old Block', floors: 2, warden: 'Mori Sato',
    wardenAvatar: 'assets/img/teachers/teacher-02.jpg', contact: '+1 546 8548 629',
    rooms: 18, capacity: 54, occupied: 0, sharing: 'Triple Sharing',
    facilities: ['Mess', 'Laundry'], fee: 1400,
    updated: '18 Nov 2023', academicYear: '2023/2024', status: 'Archived',
  },
];
