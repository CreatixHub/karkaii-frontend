export type ClassStatus = 'active' | 'new' | 'inactive' | 'archived';

export type ColumnId = 'class' | 'status' | 'category' | 'teacher' | 'students';

export type DensityId = 'compact' | 'default' | 'comfortable';

export type FilterKey =
  | 'category'
  | 'section'
  | 'teacher'
  | 'status'
  | 'room'
  | 'strength'
  | 'subjects'
  | 'year';

export type SortKey = 'name' | 'strength' | 'cat' | 'teacher' | 'status' | 'recent';

/** Which toolbar dropdown is open — only one at a time, as Bootstrap enforced. */
export type ToolbarMenu = 'views' | 'filters' | 'columns' | 'sort' | null;

export type ClassesModalId =
  | 'add'
  | 'edit'
  | 'view'
  | 'import'
  | 'delete'
  | 'assignTeacher'
  | 'assignSubject'
  | 'timetable'
  | 'announce';

export interface StaffLine {
  name: string;
  role: string;
  avatar: string;
}

export interface SubjectBadge {
  label: string;
  badgeClass: string;
}

export interface WeekDay {
  day: string;
  periods: string;
}

export interface HealthFact {
  value: string;
  label: string;
  borderClass: string;
}

export interface EventLine {
  title: string;
  meta: string;
  accent: string;
  icon: string;
}

export interface ClassDetail {
  staff: StaffLine[];
  representative: StaffLine;
  subjects: SubjectBadge[];
  week: WeekDay[];
  health: HealthFact[];
  boys: { count: number; share: string };
  girls: { count: number; share: string };
  events: EventLine[];
  note: string;
}

export interface ClassRow {
  /** Class code, used as the row key. */
  id: string;
  name: string;
  /** Roman numeral shown in the `record-icon-tile`. */
  numeral: string;
  tileAccent: string;
  sections: string;
  room: string;
  status: ClassStatus;
  statusLabel: string;
  /** `.dt-pill` modifier that pairs with `status`. */
  pillClass: string;
  category: string;
  teacher: { name: string; subject: string; avatar: string } | null;
  students: number;
  /** The template's `data-search` haystack, already lowercased. */
  search: string;
  detail: ClassDetail;
}

/* -------------------------------------------------------------------------- */
/*                                    Rows                                    */
/* -------------------------------------------------------------------------- */

const upcomingEvents = (room: string): EventLine[] => [
  {
    title: 'Term Test · Science',
    meta: `25 Jul · ${room}`,
    accent: 'accent-purple',
    icon: 'ti ti-hexagonal-prism-plus',
  },
  { title: 'Annual Science Fair', meta: '27 Jul · Auditorium', accent: 'accent-success', icon: 'ti ti-confetti' },
  { title: 'PTA Meeting', meta: '28 Jul · 4:00 PM', accent: 'accent-info', icon: 'ti ti-users-group' },
];

export const classRows: ClassRow[] = [
  {
    id: 'CLS-2024-001',
    name: 'Class I · Section A',
    numeral: 'I',
    tileAccent: 'accent-primary',
    sections: '3 sections',
    room: 'Room 204',
    status: 'active',
    statusLabel: 'Active',
    pillClass: 's-active',
    category: 'Primary',
    teacher: { name: 'Ms. Teresa Susan', subject: 'Mathematics', avatar: 'assets/img/teachers/teacher-01.jpg' },
    students: 30,
    search: 'class i - section a cls-2024-001 primary ms. teresa susan room 204 active',
    detail: {
      staff: [
        { name: 'Ms. Teresa Susan', role: 'Class Teacher', avatar: 'assets/img/teachers/teacher-01.jpg' },
        { name: 'Mr. Dan Ruiz', role: 'Assistant Teacher', avatar: 'assets/img/teachers/teacher-08.jpg' },
      ],
      representative: {
        name: 'Janet Daniel',
        role: 'Elected · Term II',
        avatar: 'assets/img/students/student-01.jpg',
      },
      subjects: [
        { label: 'Mathematics', badgeClass: 'badge-soft-primary' },
        { label: 'Science', badgeClass: 'badge-soft-success' },
        { label: 'English', badgeClass: 'badge-soft-warning' },
      ],
      week: [
        { day: 'Mon', periods: '7 periods' },
        { day: 'Tue', periods: '7 periods' },
        { day: 'Wed', periods: '6 periods' },
        { day: 'Thu', periods: '7 periods' },
        { day: 'Fri', periods: '6 periods' },
      ],
      health: [
        { value: '30', label: 'Students', borderClass: 'border-primary' },
        { value: '96%', label: 'Attendance', borderClass: 'border-success' },
        { value: 'A+', label: 'Avg grade', borderClass: 'border-info' },
        { value: '03', label: 'Subjects', borderClass: 'border-warning' },
      ],
      boys: { count: 16, share: '53% of the class' },
      girls: { count: 14, share: '47% of the class' },
      events: upcomingEvents('Room 204'),
      note: 'Ms. Teresa Susan requested a projector for Room 204. Two students are pending subject selection for Term III.',
    },
  },
  {
    id: 'CLS-2024-014',
    name: 'Class II · Section B',
    numeral: 'II',
    tileAccent: 'accent-success',
    sections: '3 sections',
    room: 'Room 208',
    status: 'active',
    statusLabel: 'Active',
    pillClass: 's-active',
    category: 'Primary',
    teacher: { name: 'Mr. John Doe', subject: 'Science', avatar: 'assets/img/teachers/teacher-02.jpg' },
    students: 28,
    search: 'class ii - section b cls-2024-014 primary mr. john doe room 208 active',
    detail: {
      staff: [
        { name: 'Mr. John Doe', role: 'Class Teacher', avatar: 'assets/img/teachers/teacher-02.jpg' },
        { name: 'Mr. Dan Ruiz', role: 'Assistant Teacher', avatar: 'assets/img/teachers/teacher-08.jpg' },
      ],
      representative: {
        name: 'Joann Michael',
        role: 'Elected · Term II',
        avatar: 'assets/img/students/student-02.jpg',
      },
      subjects: [
        { label: 'Mathematics', badgeClass: 'badge-soft-primary' },
        { label: 'Science', badgeClass: 'badge-soft-success' },
        { label: 'English', badgeClass: 'badge-soft-warning' },
        { label: 'Geography', badgeClass: 'badge-soft-info' },
      ],
      week: [
        { day: 'Mon', periods: '7 periods' },
        { day: 'Tue', periods: '6 periods' },
        { day: 'Wed', periods: '7 periods' },
        { day: 'Thu', periods: '6 periods' },
        { day: 'Fri', periods: '7 periods' },
      ],
      health: [
        { value: '28', label: 'Students', borderClass: 'border-primary' },
        { value: '94%', label: 'Attendance', borderClass: 'border-success' },
        { value: 'A', label: 'Avg grade', borderClass: 'border-info' },
        { value: '04', label: 'Subjects', borderClass: 'border-warning' },
      ],
      boys: { count: 15, share: '54% of the class' },
      girls: { count: 13, share: '46% of the class' },
      events: upcomingEvents('Room 208'),
      note: 'Lab session moved to Wednesday. One seat still open for the science club.',
    },
  },
  {
    id: 'CLS-2024-021',
    name: 'Class III · Section A',
    numeral: 'III',
    tileAccent: 'accent-info',
    sections: '3 sections',
    room: 'Room 112',
    status: 'new',
    statusLabel: 'New',
    pillClass: 's-transfer',
    category: 'Primary',
    teacher: { name: 'Ms. Rita Owen', subject: 'English', avatar: 'assets/img/teachers/teacher-03.jpg' },
    students: 34,
    search: 'class iii - section a cls-2024-021 primary ms. rita owen room 112 new',
    detail: {
      staff: [
        { name: 'Ms. Rita Owen', role: 'Class Teacher', avatar: 'assets/img/teachers/teacher-03.jpg' },
        { name: 'Ms. Carla Reed', role: 'Assistant Teacher', avatar: 'assets/img/teachers/teacher-07.jpg' },
      ],
      representative: {
        name: 'Emeley Karen',
        role: 'Elected · Term II',
        avatar: 'assets/img/students/student-05.jpg',
      },
      subjects: [
        { label: 'Mathematics', badgeClass: 'badge-soft-primary' },
        { label: 'Science', badgeClass: 'badge-soft-success' },
        { label: 'English', badgeClass: 'badge-soft-warning' },
        { label: 'Geography', badgeClass: 'badge-soft-info' },
        { label: 'Computer', badgeClass: 'badge-soft-danger' },
      ],
      week: [
        { day: 'Mon', periods: '7 periods' },
        { day: 'Tue', periods: '7 periods' },
        { day: 'Wed', periods: '6 periods' },
        { day: 'Thu', periods: '7 periods' },
        { day: 'Fri', periods: '6 periods' },
      ],
      health: [
        { value: '34', label: 'Students', borderClass: 'border-primary' },
        { value: '92%', label: 'Attendance', borderClass: 'border-success' },
        { value: 'A', label: 'Avg grade', borderClass: 'border-info' },
        { value: '05', label: 'Subjects', borderClass: 'border-warning' },
      ],
      boys: { count: 18, share: '53% of the class' },
      girls: { count: 16, share: '47% of the class' },
      events: upcomingEvents('Room 112'),
      note: 'Ms. Rita Owen requested a projector for Room 112. Two students are pending subject selection for Term III.',
    },
  },
  {
    id: 'CLS-2024-035',
    name: 'Class VI · Section B',
    numeral: 'VI',
    tileAccent: 'accent-warning',
    sections: '3 sections',
    room: 'Room 210',
    status: 'active',
    statusLabel: 'Active',
    pillClass: 's-active',
    category: 'Middle',
    teacher: { name: 'Mr. Alan Poe', subject: 'Geography', avatar: 'assets/img/teachers/teacher-04.jpg' },
    students: 26,
    search: 'class vi - section b cls-2024-035 middle mr. alan poe room 210 active',
    detail: {
      staff: [
        { name: 'Mr. Alan Poe', role: 'Class Teacher', avatar: 'assets/img/teachers/teacher-04.jpg' },
        { name: 'Ms. Nina Patel', role: 'Assistant Teacher', avatar: 'assets/img/teachers/teacher-05.jpg' },
      ],
      representative: {
        name: 'Aaron Kimberly',
        role: 'Elected · Term II',
        avatar: 'assets/img/students/student-03.jpg',
      },
      subjects: [
        { label: 'Mathematics', badgeClass: 'badge-soft-primary' },
        { label: 'Science', badgeClass: 'badge-soft-success' },
        { label: 'English', badgeClass: 'badge-soft-warning' },
        { label: 'Geography', badgeClass: 'badge-soft-info' },
        { label: 'Computer', badgeClass: 'badge-soft-danger' },
        { label: 'History', badgeClass: 'badge-soft-primary' },
        { label: 'Physical Ed.', badgeClass: 'badge-soft-success' },
      ],
      week: [
        { day: 'Mon', periods: '7 periods' },
        { day: 'Tue', periods: '7 periods' },
        { day: 'Wed', periods: '7 periods' },
        { day: 'Thu', periods: '6 periods' },
        { day: 'Fri', periods: '7 periods' },
      ],
      health: [
        { value: '26', label: 'Students', borderClass: 'border-primary' },
        { value: '88%', label: 'Attendance', borderClass: 'border-success' },
        { value: 'B+', label: 'Avg grade', borderClass: 'border-info' },
        { value: '07', label: 'Subjects', borderClass: 'border-warning' },
      ],
      boys: { count: 13, share: '50% of the class' },
      girls: { count: 13, share: '50% of the class' },
      events: upcomingEvents('Room 210'),
      note: 'Attendance dipped below 90% this term. A parent meeting is scheduled for the second week.',
    },
  },
  {
    id: 'CLS-2024-048',
    name: 'Class IX · Section A',
    numeral: 'IX',
    tileAccent: 'accent-purple',
    sections: '3 sections',
    room: 'Lab 01',
    status: 'active',
    statusLabel: 'Active',
    pillClass: 's-active',
    category: 'Secondary',
    teacher: { name: 'Ms. Nina Patel', subject: 'Computer Science', avatar: 'assets/img/teachers/teacher-05.jpg' },
    students: 32,
    search: 'class ix - section a cls-2024-048 secondary ms. nina patel lab 01 active',
    detail: {
      staff: [
        { name: 'Ms. Nina Patel', role: 'Class Teacher', avatar: 'assets/img/teachers/teacher-05.jpg' },
        { name: 'Mr. John Doe', role: 'Assistant Teacher', avatar: 'assets/img/teachers/teacher-02.jpg' },
      ],
      representative: {
        name: 'Jacquelin Kim',
        role: 'Elected · Term II',
        avatar: 'assets/img/students/student-06.jpg',
      },
      subjects: [
        { label: 'Mathematics', badgeClass: 'badge-soft-primary' },
        { label: 'Science', badgeClass: 'badge-soft-success' },
        { label: 'English', badgeClass: 'badge-soft-warning' },
        { label: 'Geography', badgeClass: 'badge-soft-info' },
        { label: 'Computer', badgeClass: 'badge-soft-danger' },
        { label: 'Physics', badgeClass: 'badge-soft-primary' },
        { label: 'Chemistry', badgeClass: 'badge-soft-success' },
        { label: 'History', badgeClass: 'badge-soft-warning' },
      ],
      week: [
        { day: 'Mon', periods: '8 periods' },
        { day: 'Tue', periods: '7 periods' },
        { day: 'Wed', periods: '8 periods' },
        { day: 'Thu', periods: '7 periods' },
        { day: 'Fri', periods: '6 periods' },
      ],
      health: [
        { value: '32', label: 'Students', borderClass: 'border-primary' },
        { value: '95%', label: 'Attendance', borderClass: 'border-success' },
        { value: 'A', label: 'Avg grade', borderClass: 'border-info' },
        { value: '08', label: 'Subjects', borderClass: 'border-warning' },
      ],
      boys: { count: 17, share: '53% of the class' },
      girls: { count: 15, share: '47% of the class' },
      events: upcomingEvents('Lab 01'),
      note: 'Board practicals begin next month. Lab 01 is reserved every Thursday afternoon.',
    },
  },
  {
    id: 'CLS-2024-052',
    name: 'Class XII · Section A',
    numeral: 'XII',
    tileAccent: 'accent-danger',
    sections: '3 sections',
    room: 'Room 301',
    status: 'inactive',
    statusLabel: 'Inactive',
    pillClass: 's-inactive',
    category: 'Senior Secondary',
    teacher: { name: 'Ms. Carla Reed', subject: 'Physics', avatar: 'assets/img/teachers/teacher-06.jpg' },
    students: 24,
    search: 'class xii - section a cls-2024-052 senior secondary ms. carla reed room 301 inactive',
    detail: {
      staff: [
        { name: 'Ms. Carla Reed', role: 'Class Teacher', avatar: 'assets/img/teachers/teacher-06.jpg' },
        { name: 'Ms. Teresa Susan', role: 'Assistant Teacher', avatar: 'assets/img/teachers/teacher-01.jpg' },
      ],
      representative: {
        name: 'Nathan Ruiz',
        role: 'Elected · Term II',
        avatar: 'assets/img/students/student-04.jpg',
      },
      subjects: [
        { label: 'Mathematics', badgeClass: 'badge-soft-primary' },
        { label: 'Physics', badgeClass: 'badge-soft-success' },
        { label: 'Chemistry', badgeClass: 'badge-soft-warning' },
        { label: 'English', badgeClass: 'badge-soft-info' },
        { label: 'Computer', badgeClass: 'badge-soft-danger' },
        { label: 'History', badgeClass: 'badge-soft-primary' },
      ],
      week: [
        { day: 'Mon', periods: '7 periods' },
        { day: 'Tue', periods: '8 periods' },
        { day: 'Wed', periods: '7 periods' },
        { day: 'Thu', periods: '7 periods' },
        { day: 'Fri', periods: '6 periods' },
      ],
      health: [
        { value: '24', label: 'Students', borderClass: 'border-primary' },
        { value: '97%', label: 'Attendance', borderClass: 'border-success' },
        { value: 'A+', label: 'Avg grade', borderClass: 'border-info' },
        { value: '06', label: 'Subjects', borderClass: 'border-warning' },
      ],
      boys: { count: 12, share: '50% of the class' },
      girls: { count: 12, share: '50% of the class' },
      events: upcomingEvents('Room 301'),
      note: 'Class is inactive from next term — students move to the senior wing after final results.',
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
  { id: 'all', label: 'All Classes', icon: 'ti ti-layout-list' },
  { id: 'active', label: 'Active Classes', icon: 'ti ti-circle-check' },
  { id: 'new', label: 'New This Year', icon: 'ti ti-sparkles' },
  { id: 'inactive', label: 'Inactive Classes', icon: 'ti ti-circle-x' },
  { id: 'archived', label: 'Archived', icon: 'ti ti-archive' },
];

export const quickFilters: SavedView[] = [
  { id: 'active', label: 'Active', icon: 'ti ti-circle-check' },
  { id: 'new', label: 'New', icon: 'ti ti-sparkles' },
  { id: 'inactive', label: 'Inactive', icon: 'ti ti-circle-x' },
  { id: 'unassigned', label: 'No Teacher', icon: 'ti ti-user-question' },
  { id: 'archived', label: 'Archived', icon: 'ti ti-archive' },
];

export interface FilterField {
  key: FilterKey;
  /** The chip prefix — the template used the `data-filter` attribute value. */
  label: string;
  /** `id` the template gave the `<select>`, kept so the `<label for>` still pairs. */
  domId: string;
  options: string[];
}

export const advancedFilters: FilterField[] = [
  {
    key: 'category',
    label: 'Category',
    domId: 'cls-category',
    options: ['Primary', 'Middle', 'Secondary', 'Senior Secondary'],
  },
  { key: 'section', label: 'Section', domId: 'cls-section', options: ['A', 'B', 'C'] },
  {
    key: 'teacher',
    label: 'Teacher',
    domId: 'cls-class-teacher',
    options: [
      'Ms. Teresa Susan',
      'Mr. John Doe',
      'Ms. Rita Owen',
      'Mr. Alan Poe',
      'Ms. Nina Patel',
      'Ms. Carla Reed',
    ],
  },
  { key: 'status', label: 'Status', domId: 'cls-status', options: ['Active', 'Inactive', 'New', 'Archived'] },
  { key: 'room', label: 'Room', domId: 'cls-class-room', options: ['Ground floor', 'First floor', 'Second floor'] },
  { key: 'strength', label: 'Strength', domId: 'cls-strength', options: ['Under 25', '25–35', 'Over 35'] },
  {
    key: 'subjects',
    label: 'Subjects',
    domId: 'cls-subjects-assigned',
    options: ['Fully assigned', 'Partially assigned', 'Not assigned'],
  },
  { key: 'year', label: 'Year', domId: 'cls-academic-year', options: ['2024/2025', '2023/2024'] },
];

/** The filter panel labels differ from the chip prefixes on three fields. */
export const filterFieldLabels: Record<FilterKey, string> = {
  category: 'Category',
  section: 'Section',
  teacher: 'Class Teacher',
  status: 'Status',
  room: 'Class Room',
  strength: 'Strength',
  subjects: 'Subjects Assigned',
  year: 'Academic Year',
};

export const columnDefs: { id: ColumnId; label: string }[] = [
  { id: 'class', label: 'Class' },
  { id: 'status', label: 'Status' },
  { id: 'category', label: 'Category' },
  { id: 'teacher', label: 'Class Teacher' },
  { id: 'students', label: 'Students' },
];

export const allColumns: Record<ColumnId, boolean> = {
  class: true,
  status: true,
  category: true,
  teacher: true,
  students: true,
};

export const densityOptions: { id: DensityId; icon: string; title: string }[] = [
  { id: 'compact', icon: 'ti ti-baseline-density-small', title: 'Compact' },
  { id: 'default', icon: 'ti ti-baseline-density-medium', title: 'Default' },
  { id: 'comfortable', icon: 'ti ti-baseline-density-large', title: 'Comfortable' },
];

export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'name', label: 'Class name (A–Z)', icon: 'ti ti-abc' },
  { id: 'strength', label: 'Student strength', icon: 'ti ti-users' },
  { id: 'cat', label: 'Category', icon: 'ti ti-category' },
  { id: 'teacher', label: 'Class teacher', icon: 'ti ti-chalkboard' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** Rows-per-page options — `classes.html` L2419–2424. */
export const pageSizes = ['10', '25', '50', '100'];

/** Header cells, in template order. `sort` is absent on the non-sortable ones. */
export const tableHeaders: { id: ColumnId; label: string; sort: SortKey }[] = [
  { id: 'class', label: 'Class', sort: 'name' },
  { id: 'status', label: 'Status', sort: 'status' },
  { id: 'category', label: 'Category', sort: 'cat' },
  { id: 'teacher', label: 'Class Teacher', sort: 'teacher' },
  { id: 'students', label: 'Students', sort: 'strength' },
];

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
  modal?: ClassesModalId;
  danger?: boolean;
}

export const bulkActions: BulkAction[] = [
  { id: 'assign_teacher', label: 'Assign Teacher', icon: 'ti ti-user-plus', modal: 'assignTeacher' },
  { id: 'assign_subject', label: 'Assign Subjects', icon: 'ti ti-book-upload', modal: 'assignSubject' },
  { id: 'generate_timetable', label: 'Generate Timetable', icon: 'ti ti-calendar-plus', modal: 'timetable' },
  { id: 'promote', label: 'Promote Students', icon: 'ti ti-arrow-up-circle' },
  { id: 'announce', label: 'Announce', icon: 'ti ti-speakerphone', modal: 'announce' },
  { id: 'export_csv', label: 'Export', icon: 'ti ti-download' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

export interface RowMenuItem {
  id: string;
  label: string;
  icon: string;
  /** Internal route to navigate to, when the template linked to another page. */
  route?: string;
  modal?: ClassesModalId;
  danger?: boolean;
  /** Renders a `dropdown-divider` before this item. */
  divider?: boolean;
}

/**
 * The per-row overflow menu. Routes replace the template's `.html` hrefs; the
 * `data-cls-action` items keep their ids so they hit the same toast copy.
 */
export const rowMenuItems: RowMenuItem[] = [
  { id: 'students', label: 'Students', icon: 'ti ti-users', route: 'studentList' },
  { id: 'subjects', label: 'Subjects', icon: 'ti ti-book', route: 'classSyllabus' },
  { id: 'teachers', label: 'Teachers', icon: 'ti ti-chalkboard', route: 'teacherList' },
  { id: 'timetable_page', label: 'Time Table', icon: 'ti ti-table', route: 'classTimetable' },
  { id: 'attendance', label: 'Attendance', icon: 'ti ti-calendar-check', route: 'studentAttendance' },
  { id: 'assignments', label: 'Assignments', icon: 'ti ti-file-description', route: 'classHomeWork' },
  { id: 'exams', label: 'Exams', icon: 'ti ti-hexagonal-prism-plus', route: 'examSchedule' },
  { id: 'fees', label: 'Fees', icon: 'ti ti-report-money', route: 'feesMaster' },
  { id: 'performance', label: 'Performance', icon: 'ti ti-chart-line', route: 'studentPerformance' },
  { id: 'promotion', label: 'Promotion', icon: 'ti ti-arrow-up-circle', route: 'studentPromotion' },
  {
    id: 'assign_teacher',
    label: 'Assign Teacher',
    icon: 'ti ti-user-plus',
    modal: 'assignTeacher',
    divider: true,
  },
  { id: 'assign_subject', label: 'Assign Subjects', icon: 'ti ti-book-upload', modal: 'assignSubject' },
  { id: 'generate_timetable', label: 'Generate Timetable', icon: 'ti ti-calendar-plus', modal: 'timetable' },
  { id: 'announce', label: 'Announce', icon: 'ti ti-speakerphone', modal: 'announce' },
  { id: 'duplicate', label: 'Duplicate', icon: 'ti ti-copy', divider: true },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash-x', modal: 'delete', danger: true },
];

/** The right-click menu — `classes.html` L2443–2452. */
export const contextMenuItems: RowMenuItem[] = [
  { id: 'view', label: 'View Class', icon: 'ti ti-eye', modal: 'view' },
  { id: 'edit', label: 'Edit', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'students', label: 'Students', icon: 'ti ti-users', route: 'studentList' },
  { id: 'teachers', label: 'Teachers', icon: 'ti ti-chalkboard', route: 'teacherList' },
  { id: 'attendance', label: 'Attendance', icon: 'ti ti-calendar-check', route: 'studentAttendance' },
  { id: 'timetable_page', label: 'Time Table', icon: 'ti ti-table', route: 'classTimetable' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash-x', modal: 'delete', danger: true, divider: true },
];

/** `classes.js` L411–421, verbatim. */
export const actionToasts: Record<string, string> = {
  refresh: 'Class list refreshed.',
  save_view: 'Current filters saved as a new view.',
  duplicate: 'Class duplicated as a draft.',
  promote: 'Promotion workspace opened for the selected classes.',
  print: 'Sending the class list to the printer…',
  archive: 'Selected classes archived.',
  export_excel: 'Excel workbook queued for download.',
  export_pdf: 'PDF export queued for download.',
  export_csv: 'Preparing export…',
  page: 'Loading the selected page…',
  clear_filters: 'Filters cleared.',
  reset_columns: 'All columns restored.',
};

/** Success copy from each dialog's `data-success` attribute. */
export const modalToasts: Record<string, string> = {
  assignTeacher: 'Class teacher assigned successfully.',
  assignSubject: 'Subjects assigned to the selected class.',
  timetable: 'Timetable generated — no teacher clashes found.',
  announce: 'Announcement sent to the selected classes.',
  import: 'File queued — 42 rows validated.',
};
