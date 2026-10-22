export type RoomStatus =
  | 'Available' | 'Partially Occupied' | 'Fully Occupied' | 'Reserved' | 'Maintenance' | 'Out of Service';

export type RoomType = 'Single Room' | 'Double Sharing' | 'Triple Sharing' | 'Quad Sharing';

export interface HostelRoom {
  id: string;
  /** The template's `dt-code`, e.g. "RM-1001". */
  code: string;
  /** The room number alone — the name reads "Room A-101". */
  room: string;
  hostel: string;
  /** Bootstrap tint stem shared by the avatar and the building badge. */
  tint: string;
  block: string;
  floor: number;
  roomType: RoomType;
  capacity: number;
  occupied: number;
  /** Monthly fee in dollars; printed as "$700"/mo. */
  fee: number;
  bathroom: boolean;
  ac: boolean;
  wifi: boolean;
  /** "Bed, Desk, Wardrobe" — the row's furniture line. */
  furniture: string;
  inspected: string;
  status: RoomStatus;
}

export const statusPill: Record<RoomStatus, string> = {
  Available: 'is-active',
  'Partially Occupied': 'is-pending',
  'Fully Occupied': 'is-new',
  Reserved: 'is-exam',
  Maintenance: 'is-archived',
  'Out of Service': 'is-emergency',
};

/** Only Available draws the plain dot. Null means "render the dot". */
export const statusIcon: Record<RoomStatus, string | null> = {
  Available: null,
  'Partially Occupied': 'ti ti-user-check',
  'Fully Occupied': 'ti ti-bed',
  Reserved: 'ti ti-bookmark',
  Maintenance: 'ti ti-tool',
  'Out of Service': 'ti ti-ban',
};

/* ------------------------------ Filter options ------------------------------ */

export const hostelOptions = [
  'Sunrise Boys Hostel', 'Bluebell Girls Hostel', 'Maple Senior Hostel',
  'Oak International Hostel', 'Cedar Boys Annexe', 'Aspen Transit Hostel',
];

export const blockOptions = ['Block A', 'Block B', 'Block C', 'Block E', 'Block F', 'Block I'];

export const floorOptions = ['Floor 1', 'Floor 2', 'Floor 3'];

export const roomTypeOptions: RoomType[] = [
  'Triple Sharing', 'Double Sharing', 'Single Room', 'Quad Sharing',
];

export const statusOptions: RoomStatus[] = [
  'Available', 'Partially Occupied', 'Fully Occupied', 'Reserved', 'Maintenance', 'Out of Service',
];

export const occupancyOptions = ['Empty', 'Partial', 'Full'];

export const availabilityOptions = ['Beds Available', 'No Vacancy'];

/** The Monthly Fee filter is three bands, not a value. */
export const feeBandOptions = ['Up to $700', '$1,000 – $1,500', '$1,500+'];

/** The Add/Edit form's own Room Type list, which predates the four sharing types. */
export const bedTypeOptions = ['One Bed', 'One Bed AC', 'Two Bed', 'Two Bed AC'];

export const conditionOptions = ['Excellent', 'Good', 'Fair', 'Poor'];

export const inspectionChecklist = ['Cleanliness', 'Furniture', 'Electrical', 'Plumbing', 'Safety'];

export const issueOptions = ['Plumbing', 'Electrical', 'Furniture', 'Cleaning', 'Pest Control'];

export const priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];

/** The Room Facilities dialog's checkbox row, in the template's order. */
export const facilityOptions = [
  'Attached Bathroom', 'Air Conditioning', 'Wi-Fi', 'Study Table', 'Wardrobe', 'Balcony',
];

export const studentOptions = [
  'Janet Daniel — AD202401',
  'Joann Michael — AD202402',
  'Andrew Fischer — AD202409',
  'Ralph Claudia — AD202406',
  'Gifford Ramsey — AD202404',
];

export const importModes = ['Create new rooms', 'Update existing by code', 'Create and update'];

/* ------------------------------- Derivations -------------------------------- */

export const availableOf = (row: HostelRoom): number => Math.max(0, row.capacity - row.occupied);

export const occupancyOf = (row: HostelRoom): number =>
  row.capacity === 0 ? 0 : Math.round((row.occupied / row.capacity) * 100);

/** Out of service and maintenance rooms read grey whatever their occupancy. */
export const meterTint = (row: HostelRoom): string => {
  if (row.status === 'Maintenance' || row.status === 'Out of Service') return 'secondary';
  const percent = occupancyOf(row);
  if (percent >= 100) return 'danger';
  if (percent > 0) return 'warning';
  return 'success';
};

/** The percentage figure itself only ever reads danger when the room is full. */
export const percentTint = (row: HostelRoom): string =>
  occupancyOf(row) >= 100 ? 'danger' : 'success';

export const feeLabel = (row: HostelRoom): string => `$${row.fee.toLocaleString('en-US')}`;

export const roomNameOf = (row: HostelRoom): string => `Room ${row.room}`;

export const floorLabel = (row: HostelRoom): string => `Floor ${row.floor}`;

/** "A-101 — Sunrise Boys Hostel", the label every dialog opens with. */
export const roomFieldOf = (row: HostelRoom): string => `${row.room} — ${row.hostel}`;

export const summaryOf = (row: HostelRoom): string =>
  `${row.code} · ${row.hostel} · ${row.block} · ${floorLabel(row)}`;

export const descriptionOf = (row: HostelRoom): string =>
  `${roomNameOf(row)} — a ${row.roomType.toLowerCase()} in ${row.hostel}, ${row.block}, `
  + `${floorLabel(row)}. ${feeLabel(row)}/month.`;

export const occupantsLineOf = (row: HostelRoom): string =>
  `${row.occupied} of ${row.capacity} beds occupied.`;

export const occupancySummaryOf = (row: HostelRoom): string =>
  `${row.occupied} / ${row.capacity} beds · ${availableOf(row)} available · ${row.roomType}`;

export const feeLineOf = (row: HostelRoom): string =>
  `${feeLabel(row)}/month · inspected ${row.inspected}.`;

export const maintenanceLineOf = (row: HostelRoom): string =>
  `Last serviced during the ${row.inspected} inspection.`;

/** Only the out-of-service room reports an unsafe condition. */
export const inspectionLineOf = (row: HostelRoom): string =>
  `Last inspected ${row.inspected} · condition ${row.status === 'Out of Service' ? 'unsafe' : 'satisfactory'}.`;

export const fireExitOf = (row: HostelRoom): string => `Fire exit — end of ${floorLabel(row)}`;

/** The Notes paragraph is a function of the status alone in all ten rows. */
export const notesOf = (row: HostelRoom): string => {
  switch (row.status) {
    case 'Fully Occupied':
      return 'Fully occupied — no free beds.';
    case 'Reserved':
      return 'Reserved — pending confirmed allocation.';
    case 'Maintenance':
      return 'Under maintenance — temporarily unavailable.';
    case 'Out of Service':
      return 'Out of service — do not allocate until repaired.';
    case 'Available':
    case 'Partially Occupied':
    default:
      return 'Beds available for allocation.';
  }
};

/** The panel and the View dialog print the same four amenity badges. */
export const facilityBadgesOf = (row: HostelRoom): string[] => {
  const badges: string[] = [];
  if (row.bathroom) badges.push('Bathroom');
  if (row.ac) badges.push('AC');
  if (row.wifi) badges.push('Wi-Fi');
  if (row.furniture.trim()) badges.push('Furnished');
  return badges;
};

/** The Room Facilities dialog names the same amenities at greater length. */
export const facilitiesOf = (row: HostelRoom): string[] => {
  const checked: string[] = [];
  if (row.bathroom) checked.push('Attached Bathroom');
  if (row.ac) checked.push('Air Conditioning');
  if (row.wifi) checked.push('Wi-Fi');
  if (/desk|table/i.test(row.furniture)) checked.push('Study Table');
  if (/wardrobe|cupboard|locker/i.test(row.furniture)) checked.push('Wardrobe');
  return checked;
};

export interface Bed {
  label: string;
  occupied: boolean;
}

/** The panel's bed list: occupied beds first, then the free ones. */
export const bedsOf = (row: HostelRoom): Bed[] =>
  Array.from({ length: row.capacity }, (_, index) => ({
    label: `Bed ${index + 1}`,
    occupied: index < row.occupied,
  }));

export interface Occupant {
  name: string;
  avatar: string;
  bed: string;
  checkIn: string;
}

const roster = [
  { name: 'Andrew Fischer', avatar: 'assets/img/students/student-09.jpg', checkIn: '12 Apr 2024' },
  { name: 'Ralph Claudia', avatar: 'assets/img/students/student-06.jpg', checkIn: '12 Apr 2024' },
  { name: 'Gifford Ramsey', avatar: 'assets/img/students/student-04.jpg', checkIn: '15 Apr 2024' },
  { name: 'Janet Daniel', avatar: 'assets/img/students/student-01.jpg', checkIn: '18 Apr 2024' },
];

/** As many occupants as the room reports, on the beds the panel lists. */
export const occupantsOf = (row: HostelRoom): Occupant[] =>
  Array.from({ length: row.occupied }, (_, index) => ({
    ...roster[index % roster.length],
    bed: `Bed ${index + 1}`,
  }));

/** The alert line the Occupant Details dialog opens with. */
export const occupantHeaderOf = (row: HostelRoom): string =>
  `${roomNameOf(row)} · ${row.hostel} · ${row.occupied} / ${row.capacity} occupied`;

/* --------------------------------- Sorting ---------------------------------- */

/** The Occupancy filter, as the three bands the template names. */
export const occupancyBandOf = (row: HostelRoom): string => {
  if (row.occupied === 0) return 'Empty';
  return row.occupied >= row.capacity ? 'Full' : 'Partial';
};

/** The Monthly Fee filter's three bands. */
export const feeBandOf = (row: HostelRoom): string => {
  if (row.fee <= 700) return 'Up to $700';
  if (row.fee <= 1500) return '$1,000 – $1,500';
  return '$1,500+';
};

/** Mirrors the template's `data-search` attribute. */
export const searchIndexOf = (row: HostelRoom): string =>
  [
    row.room, row.code, row.hostel, row.block, floorLabel(row), row.roomType, row.status,
    occupancyBandOf(row), availableOf(row) > 0 ? 'beds available' : 'no vacancy', String(row.fee),
    row.furniture,
  ]
    .join(' ')
    .toLowerCase();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Sortable key for the template's "02 May 2024" dates. */
export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/** Beds per room, from the room type — used when a new room is added. */
export const bedsPerRoom = (roomType: RoomType): number => {
  switch (roomType) {
    case 'Single Room': return 1;
    case 'Double Sharing': return 2;
    case 'Quad Sharing': return 4;
    case 'Triple Sharing':
    default: return 3;
  }
};

/* ---------------------------------- Rows ------------------------------------ */

export const hostelRooms: HostelRoom[] = [
  {
    id: 'RM-1001', code: 'RM-1001', room: 'A-101', hostel: 'Sunrise Boys Hostel', tint: 'primary',
    block: 'Block A', floor: 1, roomType: 'Triple Sharing', capacity: 3, occupied: 3, fee: 700,
    bathroom: true, ac: false, wifi: true, furniture: 'Bed, Desk, Wardrobe',
    inspected: '02 May 2024', status: 'Fully Occupied',
  },
  {
    id: 'RM-1002', code: 'RM-1002', room: 'A-102', hostel: 'Sunrise Boys Hostel', tint: 'primary',
    block: 'Block A', floor: 1, roomType: 'Triple Sharing', capacity: 3, occupied: 2, fee: 700,
    bathroom: true, ac: false, wifi: true, furniture: 'Bed, Desk, Wardrobe',
    inspected: '02 May 2024', status: 'Partially Occupied',
  },
  {
    id: 'RM-1003', code: 'RM-1003', room: 'A-201', hostel: 'Sunrise Boys Hostel', tint: 'primary',
    block: 'Block A', floor: 2, roomType: 'Triple Sharing', capacity: 3, occupied: 0, fee: 700,
    bathroom: true, ac: false, wifi: true, furniture: 'Bed, Desk, Wardrobe',
    inspected: '28 Apr 2024', status: 'Available',
  },
  {
    id: 'RM-2001', code: 'RM-2001', room: 'B-105', hostel: 'Bluebell Girls Hostel', tint: 'pink',
    block: 'Block B', floor: 1, roomType: 'Double Sharing', capacity: 2, occupied: 2, fee: 1200,
    bathroom: true, ac: true, wifi: true, furniture: 'Bed, Desk, Wardrobe, Mirror',
    inspected: '03 May 2024', status: 'Fully Occupied',
  },
  {
    id: 'RM-2002', code: 'RM-2002', room: 'B-203', hostel: 'Bluebell Girls Hostel', tint: 'pink',
    block: 'Block B', floor: 2, roomType: 'Double Sharing', capacity: 2, occupied: 1, fee: 1200,
    bathroom: true, ac: true, wifi: true, furniture: 'Bed, Desk, Wardrobe, Mirror',
    inspected: '03 May 2024', status: 'Partially Occupied',
  },
  {
    id: 'RM-3001', code: 'RM-3001', room: 'C-110', hostel: 'Maple Senior Hostel', tint: 'info',
    block: 'Block C', floor: 1, roomType: 'Single Room', capacity: 1, occupied: 0, fee: 1400,
    bathroom: true, ac: true, wifi: true, furniture: 'Bed, Study Table, AC',
    inspected: '01 May 2024', status: 'Reserved',
  },
  {
    id: 'RM-3002', code: 'RM-3002', room: 'C-215', hostel: 'Maple Senior Hostel', tint: 'info',
    block: 'Block C', floor: 2, roomType: 'Single Room', capacity: 1, occupied: 1, fee: 1400,
    bathroom: true, ac: true, wifi: true, furniture: 'Bed, Study Table, AC',
    inspected: '20 Apr 2024', status: 'Fully Occupied',
  },
  {
    id: 'RM-5001', code: 'RM-5001', room: 'E-301', hostel: 'Oak International Hostel', tint: 'success',
    block: 'Block E', floor: 3, roomType: 'Single Room', capacity: 1, occupied: 0, fee: 1800,
    bathroom: true, ac: true, wifi: true, furniture: 'Bed, Desk, AC, Sofa',
    inspected: '08 May 2024', status: 'Available',
  },
  {
    id: 'RM-6001', code: 'RM-6001', room: 'F-101', hostel: 'Cedar Boys Annexe', tint: 'warning',
    block: 'Block F', floor: 1, roomType: 'Quad Sharing', capacity: 4, occupied: 0, fee: 500,
    bathroom: false, ac: false, wifi: true, furniture: 'Bunk Beds, Lockers',
    inspected: '15 Apr 2024', status: 'Maintenance',
  },
  {
    id: 'RM-9001', code: 'RM-9001', room: 'I-102', hostel: 'Aspen Transit Hostel', tint: 'danger',
    block: 'Block I', floor: 1, roomType: 'Double Sharing', capacity: 2, occupied: 0, fee: 600,
    bathroom: true, ac: false, wifi: false, furniture: 'Bed, Cupboard',
    inspected: '10 Mar 2024', status: 'Out of Service',
  },
];

/** The Assign Student dialog lists every room as "A-101 — Sunrise Boys Hostel". */
export const roomChoices = hostelRooms.map((row) => roomFieldOf(row));
