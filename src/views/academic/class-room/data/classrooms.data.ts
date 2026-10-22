export type RoomStatus = 'Available' | 'Occupied' | 'Maintenance' | 'Reserved' | 'Inactive';

export type ColumnId = 'room' | 'details' | 'facilities' | 'status';

export type DensityId = 'compact' | 'default' | 'comfortable';

export type FilterKey = 'building' | 'floor' | 'type' | 'capacity' | 'status' | 'year';

export type SortKey = 'name' | 'building' | 'capacity' | 'students' | 'status' | 'recent';

export type ToolbarMenu = 'views' | 'filters' | 'columns' | 'sort' | null;

export type ClassroomModalId = 'add' | 'edit' | 'view' | 'import' | 'delete';

export interface Facility {
  icon: string;
  label: string;
}

export interface ClassroomDetail {
  equipment: string;
  /** `.meter` modifier plus the inline width the template hard-codes. */
  meterClass: string;
  meterWidth: string;
  occupancy: string;
  timetable: string;
  maintenance: string;
  bookings: string;
}

export interface ClassroomRow {
  id: string;
  name: string;
  roomNo: string;
  building: string;
  floor: string;
  type: string;
  capacity: number;
  status: RoomStatus;
  /** `.dt-pill` modifier that pairs with `status`. */
  pillClass: string;
  /** Available and Inactive show a dot; the rest show an icon. */
  pillIcon: string | null;
  assignedClass: string;
  teacher: { name: string; avatar: string } | null;
  students: number;
  availableSeats: number;
  year: string;
  facilities: Facility[];
  /** The template's `data-search` haystack, verbatim. */
  search: string;
  detail: ClassroomDetail;
}

const SMART_BOARD: Facility = { icon: 'ti ti-device-tablet', label: 'Smart Board' };
const PROJECTOR: Facility = { icon: 'ti ti-projector', label: 'Projector' };
const WIFI: Facility = { icon: 'ti ti-wifi', label: 'Wi-Fi' };
const AC: Facility = { icon: 'ti ti-air-conditioning', label: 'Air Conditioning' };
const AUDIO: Facility = { icon: 'ti ti-speakerphone', label: 'Audio System' };
const SCIENCE_LAB: Facility = { icon: 'ti ti-flask', label: 'Science Lab' };
const COMPUTER_LAB: Facility = { icon: 'ti ti-device-desktop', label: 'Computer Lab' };

export const classroomRows: ClassroomRow[] = [
  {
    id: 'R167648',
    name: 'Newton Hall',
    roomNo: '101',
    building: 'A',
    floor: '1',
    type: 'Lecture Hall',
    capacity: 50,
    status: 'Available',
    pillClass: 'is-active',
    pillIcon: null,
    assignedClass: 'III, A',
    teacher: { name: 'Teresa', avatar: 'assets/img/teachers/teacher-01.jpg' },
    students: 42,
    availableSeats: 8,
    year: '2024/2025',
    facilities: [SMART_BOARD, PROJECTOR, WIFI, AC],
    search: 'r167648 101 newton hall building a floor 1 lecture hall available cap 50 iii, a teresa 2024/2025',
    detail: {
      equipment: '55" display, podium mic, 48 desks',
      meterClass: 'meter-warning',
      meterWidth: '84%',
      occupancy: '42 of 50 seats used · 84%',
      timetable: 'Mon–Fri · III, A',
      maintenance: 'Serviced 12 May 2025 · AC filter',
      bookings: 'PTM · Fri 3:00 PM',
    },
  },
  {
    id: 'R167647',
    name: 'Curie Lab',
    roomNo: '102',
    building: 'A',
    floor: '1',
    type: 'Science Lab',
    capacity: 40,
    status: 'Occupied',
    pillClass: 'is-new',
    pillIcon: 'ti ti-users',
    assignedClass: 'IV, B',
    teacher: { name: 'Daniel', avatar: 'assets/img/teachers/teacher-02.jpg' },
    students: 38,
    availableSeats: 2,
    year: '2024/2025',
    facilities: [PROJECTOR, WIFI, SCIENCE_LAB, AC],
    search: 'r167647 102 curie lab building a floor 1 science lab occupied cap 40 iv, b daniel 2024/2025',
    detail: {
      equipment: 'Fume hood, 20 lab stations, safety kit',
      meterClass: 'meter-danger',
      meterWidth: '95%',
      occupancy: '38 of 40 seats used · 95%',
      timetable: 'Mon–Fri · IV, B',
      maintenance: 'Serviced 02 Apr 2025 · Gas line',
      bookings: 'Chemistry practical · Mon 10:00 AM',
    },
  },
  {
    id: 'R167646',
    name: 'Turing Lab',
    roomNo: '103',
    building: 'B',
    floor: '2',
    type: 'Computer Lab',
    capacity: 60,
    status: 'Occupied',
    pillClass: 'is-new',
    pillIcon: 'ti ti-users',
    assignedClass: 'V, A',
    teacher: { name: 'Hellana', avatar: 'assets/img/teachers/teacher-03.jpg' },
    students: 55,
    availableSeats: 5,
    year: '2024/2025',
    facilities: [COMPUTER_LAB, SMART_BOARD, WIFI, AC, AUDIO],
    search: 'r167646 103 turing lab building b floor 2 computer lab occupied cap 60 v, a hellana 2024/2025',
    detail: {
      equipment: '40 workstations, server rack, projector',
      meterClass: 'meter-danger',
      meterWidth: '92%',
      occupancy: '55 of 60 seats used · 92%',
      timetable: 'Mon–Fri · V, A',
      maintenance: 'Serviced 20 May 2025 · UPS check',
      bookings: 'Coding club · Wed 2:00 PM',
    },
  },
  {
    id: 'R167645',
    name: 'Darwin Room',
    roomNo: '104',
    building: 'A',
    floor: '2',
    type: 'Standard Classroom',
    capacity: 50,
    status: 'Maintenance',
    pillClass: 'is-pending',
    pillIcon: 'ti ti-tools',
    assignedClass: '—',
    teacher: null,
    students: 0,
    availableSeats: 50,
    year: '2024/2025',
    facilities: [WIFI, PROJECTOR],
    search:
      'r167645 104 darwin room building a floor 2 standard classroom maintenance cap 50 — — 2024/2025',
    detail: {
      equipment: 'Whiteboard, 50 desks',
      meterClass: 'meter-success',
      meterWidth: '0%',
      occupancy: '0 of 50 seats used · 0%',
      timetable: 'Mon–Fri · No class assigned',
      maintenance: 'In progress · Repainting & wiring',
      bookings: '—',
    },
  },
  {
    id: 'R167644',
    name: 'Tesla Room',
    roomNo: '105',
    building: 'B',
    floor: '1',
    type: 'Smart Classroom',
    capacity: 40,
    status: 'Available',
    pillClass: 'is-active',
    pillIcon: null,
    assignedClass: 'II, A',
    teacher: { name: 'Morgan', avatar: 'assets/img/teachers/teacher-05.jpg' },
    students: 30,
    availableSeats: 10,
    year: '2024/2025',
    facilities: [SMART_BOARD, PROJECTOR, WIFI, AC, AUDIO],
    search: 'r167644 105 tesla room building b floor 1 smart classroom available cap 40 ii, a morgan 2024/2025',
    detail: {
      equipment: 'Interactive panel, doc camera',
      meterClass: 'meter-warning',
      meterWidth: '75%',
      occupancy: '30 of 40 seats used · 75%',
      timetable: 'Mon–Fri · II, A',
      maintenance: 'Serviced 08 May 2025 · Panel calibrate',
      bookings: 'STEM demo · Thu 11:00 AM',
    },
  },
  {
    id: 'R167643',
    name: 'Kepler Hall',
    roomNo: '106',
    building: 'C',
    floor: '3',
    type: 'Lecture Hall',
    capacity: 50,
    status: 'Reserved',
    pillClass: 'is-archived',
    pillIcon: 'ti ti-bookmark',
    assignedClass: 'VI, B',
    teacher: { name: 'Aariv', avatar: 'assets/img/teachers/teacher-06.jpg' },
    students: 0,
    availableSeats: 50,
    year: '2024/2025',
    facilities: [PROJECTOR, WIFI, AC],
    search: 'r167643 106 kepler hall building c floor 3 lecture hall reserved cap 50 vi, b aariv 2024/2025',
    detail: {
      equipment: 'Tiered seating, dual projectors',
      meterClass: 'meter-success',
      meterWidth: '0%',
      occupancy: '0 of 50 seats used · 0%',
      timetable: 'Mon–Fri · VI, B',
      maintenance: 'Serviced 28 Apr 2025 · Projector lamp',
      bookings: 'Guest lecture · Tue 9:00 AM',
    },
  },
  {
    id: 'R167642',
    name: 'Da Vinci Studio',
    roomNo: '107',
    building: 'C',
    floor: '1',
    type: 'Art Studio',
    capacity: 40,
    status: 'Available',
    pillClass: 'is-active',
    pillIcon: null,
    assignedClass: 'I, B',
    teacher: { name: 'Jacquelin', avatar: 'assets/img/teachers/teacher-07.jpg' },
    students: 28,
    availableSeats: 12,
    year: '2024/2025',
    facilities: [WIFI, AC],
    search:
      'r167642 107 da vinci studio building c floor 1 art studio available cap 40 i, b jacquelin 2024/2025',
    detail: {
      equipment: 'Easels, kiln, sink stations',
      meterClass: 'meter-warning',
      meterWidth: '70%',
      occupancy: '28 of 40 seats used · 70%',
      timetable: 'Mon–Fri · I, B',
      maintenance: 'Serviced 15 Apr 2025 · Kiln inspection',
      bookings: 'Art exhibition prep · Fri 1:00 PM',
    },
  },
  {
    id: 'R167641',
    name: 'Mozart Room',
    roomNo: '108',
    building: 'B',
    floor: '2',
    type: 'Music Room',
    capacity: 40,
    status: 'Occupied',
    pillClass: 'is-new',
    pillIcon: 'ti ti-users',
    assignedClass: 'VII, A',
    teacher: { name: 'Erickson', avatar: 'assets/img/teachers/teacher-08.jpg' },
    students: 35,
    availableSeats: 5,
    year: '2024/2025',
    facilities: [AUDIO, WIFI, AC],
    search: 'r167641 108 mozart room building b floor 2 music room occupied cap 40 vii, a erickson 2024/2025',
    detail: {
      equipment: 'Piano, mixing desk, acoustic panels',
      meterClass: 'meter-warning',
      meterWidth: '88%',
      occupancy: '35 of 40 seats used · 88%',
      timetable: 'Mon–Fri · VII, A',
      maintenance: 'Serviced 05 May 2025 · Sound check',
      bookings: 'Choir practice · Mon 4:00 PM',
    },
  },
  {
    id: 'R167640',
    name: 'Pascal Room',
    roomNo: '109',
    building: 'A',
    floor: '3',
    type: 'Standard Classroom',
    capacity: 40,
    status: 'Inactive',
    pillClass: 'is-inactive',
    pillIcon: null,
    assignedClass: '—',
    teacher: null,
    students: 0,
    availableSeats: 40,
    year: '2024/2025',
    facilities: [WIFI],
    search: 'r167640 109 pascal room building a floor 3 standard classroom inactive cap 40 — — 2024/2025',
    detail: {
      equipment: 'Whiteboard, 40 desks',
      meterClass: 'meter-success',
      meterWidth: '0%',
      occupancy: '0 of 40 seats used · 0%',
      timetable: 'Mon–Fri · No class assigned',
      maintenance: 'Decommissioned · Awaiting renovation',
      bookings: '—',
    },
  },
  {
    id: 'R167639',
    name: 'Einstein Hall',
    roomNo: '110',
    building: 'C',
    floor: '2',
    type: 'Seminar Room',
    capacity: 50,
    status: 'Available',
    pillClass: 'is-active',
    pillIcon: null,
    assignedClass: 'VIII, B',
    teacher: { name: 'Lisa', avatar: 'assets/img/teachers/teacher-10.jpg' },
    students: 45,
    availableSeats: 5,
    year: '2024/2025',
    facilities: [SMART_BOARD, PROJECTOR, WIFI, AC, AUDIO],
    search: 'r167639 110 einstein hall building c floor 2 seminar room available cap 50 viii, b lisa 2024/2025',
    detail: {
      equipment: 'Conference table, video wall',
      meterClass: 'meter-danger',
      meterWidth: '90%',
      occupancy: '45 of 50 seats used · 90%',
      timetable: 'Mon–Fri · VIII, B',
      maintenance: 'Serviced 18 May 2025 · Video wall',
      bookings: 'Board meeting · Wed 10:30 AM',
    },
  },
];

/* -------------------------------------------------------------------------- */
/*                                  Toolbar                                   */
/* -------------------------------------------------------------------------- */

export interface SavedView {
  id: string;
  label: string;
  icon: string;
}

export const savedViews: SavedView[] = [
  { id: 'all', label: 'All Rooms', icon: 'ti ti-layout-list' },
  { id: 'Available', label: 'Available', icon: 'ti ti-circle-check' },
  { id: 'Occupied', label: 'Occupied', icon: 'ti ti-users' },
  { id: 'Maintenance', label: 'Maintenance', icon: 'ti ti-tools' },
  { id: 'Reserved', label: 'Reserved', icon: 'ti ti-bookmark' },
  { id: 'Inactive', label: 'Inactive', icon: 'ti ti-circle-x' },
];

export const quickFilters: SavedView[] = savedViews.slice(1);

export interface FilterOption {
  /** What the row is matched against — a haystack fragment on three of the facets. */
  value: string;
  label: string;
}

export interface FilterField {
  key: FilterKey;
  /** The chip prefix — the template's `data-filter` attribute value. */
  label: string;
  /** The filter panel's own label, and the `id` the template gave the `<select>`. */
  panelLabel: string;
  domId: string;
  options: FilterOption[];
}

const plain = (values: string[]): FilterOption[] => values.map((value) => ({ value, label: value }));

export const advancedFilters: FilterField[] = [
  {
    key: 'building',
    label: 'Building',
    panelLabel: 'Building',
    domId: 'room-building',
    options: [
      { value: 'building A', label: 'Block A' },
      { value: 'building B', label: 'Block B' },
      { value: 'building C', label: 'Block C' },
    ],
  },
  {
    key: 'floor',
    label: 'Floor',
    panelLabel: 'Floor',
    domId: 'room-floor',
    options: [
      { value: 'floor 1', label: 'Floor 1' },
      { value: 'floor 2', label: 'Floor 2' },
      { value: 'floor 3', label: 'Floor 3' },
    ],
  },
  {
    key: 'type',
    label: 'Type',
    panelLabel: 'Room Type',
    domId: 'room-type',
    options: plain([
      'Lecture Hall',
      'Standard Classroom',
      'Smart Classroom',
      'Seminar Room',
      'Computer Lab',
      'Science Lab',
      'Art Studio',
      'Music Room',
    ]),
  },
  {
    key: 'capacity',
    label: 'Capacity',
    panelLabel: 'Capacity',
    domId: 'room-capacity',
    options: [
      { value: 'cap 40', label: '40 seats' },
      { value: 'cap 50', label: '50 seats' },
      { value: 'cap 60', label: '60 seats' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    panelLabel: 'Status',
    domId: 'room-status',
    options: plain(['Available', 'Occupied', 'Maintenance', 'Reserved', 'Inactive']),
  },
  {
    key: 'year',
    label: 'Year',
    panelLabel: 'Academic Year',
    domId: 'room-academic-year',
    options: plain(['2024/2025', '2023/2024']),
  },
];

export const columnDefs: { id: ColumnId; label: string }[] = [
  { id: 'room', label: 'Classroom' },
  { id: 'details', label: 'Details' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'status', label: 'Status' },
];

export const allColumns: Record<ColumnId, boolean> = {
  room: true,
  details: true,
  facilities: true,
  status: true,
};

export const densityOptions: { id: DensityId; icon: string; title: string }[] = [
  { id: 'compact', icon: 'ti ti-baseline-density-small', title: 'Compact' },
  { id: 'default', icon: 'ti ti-baseline-density-medium', title: 'Default' },
  { id: 'comfortable', icon: 'ti ti-baseline-density-large', title: 'Comfortable' },
];

export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'name', label: 'Room name (A–Z)', icon: 'ti ti-abc' },
  { id: 'building', label: 'Building', icon: 'ti ti-building' },
  { id: 'capacity', label: 'Capacity', icon: 'ti ti-users' },
  { id: 'students', label: 'Students', icon: 'ti ti-user' },
  { id: 'recent', label: 'Recently added', icon: 'ti ti-clock' },
];

/** Only Classroom and Status are sortable in the template's `thead`. */
export const tableHeaders: { id: ColumnId; label: string; sort: SortKey | null }[] = [
  { id: 'room', label: 'Classroom', sort: 'name' },
  { id: 'details', label: 'Details', sort: null },
  { id: 'facilities', label: 'Facilities', sort: null },
  { id: 'status', label: 'Status', sort: 'status' },
];

export const pageSizes = ['10', '25', '50', '100'];

/* -------------------------------------------------------------------------- */
/*                          Header, bulk bar and menus                        */
/* -------------------------------------------------------------------------- */

export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'export_csv', label: 'Export as CSV', icon: 'ti ti-file-type-csv' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
];

export interface BulkAction {
  id: string;
  label: string;
  icon: string;
  modal?: ClassroomModalId;
  danger?: boolean;
}

export const bulkActions: BulkAction[] = [
  { id: 'assign_teacher', label: 'Assign Teacher', icon: 'ti ti-user-plus' },
  { id: 'assign_class', label: 'Assign Class', icon: 'ti ti-school' },
  { id: 'reserve', label: 'Reserve Rooms', icon: 'ti ti-bookmark' },
  { id: 'export_csv', label: 'Export', icon: 'ti ti-download' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

export interface RowMenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  modal?: ClassroomModalId;
  danger?: boolean;
  divider?: boolean;
}

export const rowMenuItems: RowMenuItem[] = [
  { id: 'view', label: 'View Classroom', icon: 'ti ti-eye', modal: 'view' },
  { id: 'edit', label: 'Edit', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'assigned_class', label: 'Assigned Class', icon: 'ti ti-school', route: 'classes' },
  { id: 'timetable', label: 'Timetable', icon: 'ti ti-table', route: 'classTimetable' },
  { id: 'students', label: 'Students', icon: 'ti ti-users', route: 'studentList' },
  { id: 'teacher', label: 'Teacher', icon: 'ti ti-user', route: 'teacherDetails' },
  { id: 'equipment', label: 'Equipment', icon: 'ti ti-device-desktop' },
  { id: 'maintenance', label: 'Maintenance', icon: 'ti ti-tools' },
  { id: 'bookings', label: 'Bookings', icon: 'ti ti-calendar-event' },
  { id: 'attendance', label: 'Attendance', icon: 'ti ti-calendar-check', route: 'studentAttendance' },
  { id: 'reports', label: 'Reports', icon: 'ti ti-chart-bar' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'assign_class', label: 'Assign Class', icon: 'ti ti-school', divider: true },
  { id: 'assign_teacher', label: 'Assign Teacher', icon: 'ti ti-user-plus' },
  { id: 'reserve', label: 'Reserve Room', icon: 'ti ti-bookmark' },
  { id: 'duplicate', label: 'Duplicate', icon: 'ti ti-copy' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash-x', modal: 'delete', danger: true },
];

/** `tables.js` L519–535, verbatim. */
export const actionToasts: Record<string, string> = {
  refresh: 'Classroom list refreshed.',
  save_view: 'Current filters saved as a new view.',
  duplicate: 'Classroom record duplicated as a draft.',
  assign_teacher: 'Teacher assignment workspace opened for the selected rooms.',
  assign_class: 'Class assignment workspace opened for the selected rooms.',
  reserve: 'Reservation workspace opened for the selected rooms.',
  timetable: 'Timetable opened for the selected rooms.',
  maintenance: 'Maintenance log opened for the selected rooms.',
  bookings: 'Bookings opened for the selected rooms.',
  reports: 'Room utilisation report opened.',
  print: 'Sending the classroom list to the printer…',
  archive: 'Selected classrooms archived.',
  export_excel: 'Excel workbook queued for download.',
  export_pdf: 'PDF export queued for download.',
  export_csv: 'Preparing export…',
  page: 'Loading the selected page…',
  clear_filters: 'Filters cleared.',
  reset_columns: 'All columns restored.',
  equipment: 'Equipment list opened for the selected room.',
};

/** `tables.js` L537 — the page's own phrasing for the engine's shared messages. */
export const strings = {
  recentSort: 'Showing the most recently updated classrooms first.',
  filterMatch: ' classroom(s) match the current filters.',
  viewMatch: ' classroom(s) in “',
  csvName: 'classrooms.csv',
};
