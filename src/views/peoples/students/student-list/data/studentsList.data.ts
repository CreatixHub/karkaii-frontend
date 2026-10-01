import { all_routes } from '@/routes/all_routes';

const routes = all_routes;

/* -------------------------------------------------------------------------- */
/*                                    Rows                                     */
/* -------------------------------------------------------------------------- */

export interface RowBadge {
  className: string;
  /** Two of the detail panels ship an icon-less badge. */
  icon?: string;
  label: string;
}

export interface StudentDetail {
  guardian: string;
  guardianRole: string;
  phone: string;
  email: string;
  address: string;
  rollNo: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  exam: string;
  meterClass: string;
  attendance: number;
  attendanceText: string;
  facilities: RowBadge[];
  fee: { className: string; label: string };
  transportNote: string;
  notes: string;
}

export interface StudentRow {
  id: string;
  name: string;
  avatar: string;
  admissionNo: string;
  classText: string;
  sectionText: string;
  badges: RowBadge[];
  status: string;
  statusClass: string;
  level: string;
  section: string;
  gender: string;
  join: string;
  transport: string;
  hostel: string;
  scholarship: string;
  year: string;
  /** The template's `data-search` haystack, kept verbatim. */
  search: string;
  detail: StudentDetail;
}

export const studentRows: StudentRow[] = [
  {
    id: 'AD9892434',
    name: 'Janet',
    avatar: 'assets/img/students/student-01.jpg',
    admissionNo: 'AD9892434',
    classText: 'Class III',
    sectionText: 'Sec A',
    badges: [
      { className: 'badge badge-soft-warning', icon: 'ti ti-award', label: 'Scholarship' },
      { className: 'badge badge-soft-info', icon: 'ti ti-bus', label: 'Transport' },
    ],
    status: 'Active',
    statusClass: 'is-active',
    level: 'III',
    section: 'A',
    gender: 'Female',
    join: '25 Mar 2024',
    transport: 'Yes',
    hostel: 'No',
    scholarship: 'Yes',
    year: '2024/2025',
    search: 'janet ad9892434 class iii sec a female active transport-yes hostel-no scholarship-yes 2024/2025',
    detail: {
      guardian: 'Robert Fox',
      guardianRole: 'Guardian',
      phone: '+1 5656 466 545',
      email: 'robert.fox@example.com',
      address: '911 Deer Ridge Drive, USA',
      rollNo: '35013',
      dateOfBirth: '10 Jan 2015',
      gender: 'Female',
      bloodGroup: 'O+',
      exam: 'Grade A · 89%',
      meterClass: 'meter-success',
      attendance: 96,
      attendanceText: '96% present',
      facilities: [
        { className: 'badge badge-soft-info', icon: 'ti ti-bus', label: 'Transport' },
        { className: 'badge badge-soft-warning', icon: 'ti ti-award', label: 'Scholarship' },
      ],
      fee: { className: 'badge badge-soft-success', label: 'Paid' },
      transportNote: 'Transport: Route 12 · Bus 04',
      notes: 'Excellent in mathematics.',
    },
  },
  {
    id: 'AD9892433',
    name: 'Joann',
    avatar: 'assets/img/students/student-02.jpg',
    admissionNo: 'AD9892433',
    classText: 'Class IV',
    sectionText: 'Sec B',
    badges: [{ className: 'badge badge-soft-purple', icon: 'ti ti-building', label: 'Hostel' }],
    status: 'Active',
    statusClass: 'is-active',
    level: 'IV',
    section: 'B',
    gender: 'Male',
    join: '18 Mar 2024',
    transport: 'No',
    hostel: 'Yes',
    scholarship: 'No',
    year: '2024/2025',
    search: 'joann ad9892433 class iv sec b male active transport-no hostel-yes scholarship-no 2024/2025',
    detail: {
      guardian: 'Cody Fisher',
      guardianRole: 'Guardian',
      phone: '+1 4547 458 511',
      email: 'cody.fisher@example.com',
      address: '2972 Westheimer Rd, USA',
      rollNo: '35013',
      dateOfBirth: '19 Aug 2014',
      gender: 'Male',
      bloodGroup: 'A+',
      exam: 'Grade B · 78%',
      meterClass: 'meter-warning',
      attendance: 88,
      attendanceText: '88% present',
      facilities: [
        { className: 'badge badge-soft-purple', icon: 'ti ti-building', label: 'Hostel' },
      ],
      fee: { className: 'badge badge-soft-warning', label: 'Due' },
      transportNote: 'Transport: Not assigned',
      notes: 'Needs attention in science.',
    },
  },
  {
    id: 'AD9892432',
    name: 'Kathleen',
    avatar: 'assets/img/students/student-03.jpg',
    admissionNo: 'AD9892432',
    classText: 'Class II',
    sectionText: 'Sec A',
    badges: [{ className: 'badge badge-soft-info', icon: 'ti ti-bus', label: 'Transport' }],
    status: 'Active',
    statusClass: 'is-active',
    level: 'II',
    section: 'A',
    gender: 'Female',
    join: '14 Mar 2024',
    transport: 'Yes',
    hostel: 'No',
    scholarship: 'No',
    year: '2024/2025',
    search: 'kathleen ad9892432 class ii sec a female active transport-yes hostel-no scholarship-no 2024/2025',
    detail: {
      guardian: 'Jerome Bell',
      guardianRole: 'Guardian',
      phone: '+1 8752 456 785',
      email: 'jerome.bell@example.com',
      address: '4517 Washington Ave, USA',
      rollNo: '35011',
      dateOfBirth: '05 Dec 2017',
      gender: 'Female',
      bloodGroup: 'B+',
      exam: 'Grade A · 85%',
      meterClass: 'meter-success',
      attendance: 92,
      attendanceText: '92% present',
      facilities: [{ className: 'badge badge-soft-info', icon: 'ti ti-bus', label: 'Transport' }],
      fee: { className: 'badge badge-soft-success', label: 'Paid' },
      transportNote: 'Transport: Route 12 · Bus 04',
      notes: 'Active in sports.',
    },
  },
  {
    id: 'AD9892431',
    name: 'Gifford',
    avatar: 'assets/img/students/student-04.jpg',
    admissionNo: 'AD9892431',
    classText: 'Class I',
    sectionText: 'Sec B',
    badges: [{ className: 'badge badge-soft-warning', icon: 'ti ti-award', label: 'Scholarship' }],
    status: 'Active',
    statusClass: 'is-active',
    level: 'I',
    section: 'B',
    gender: 'Male',
    join: '27 Feb 2024',
    transport: 'No',
    hostel: 'No',
    scholarship: 'Yes',
    year: '2024/2025',
    search: 'gifford ad9892431 class i sec b male active transport-no hostel-no scholarship-yes 2024/2025',
    detail: {
      guardian: 'Marvin McKinney',
      guardianRole: 'Guardian',
      phone: '+1 4587 154 787',
      email: 'marvin.mckinney@example.com',
      address: '3891 Ranchview Dr, USA',
      rollNo: '35010',
      dateOfBirth: '22 Mar 2018',
      gender: 'Male',
      bloodGroup: 'AB+',
      exam: 'Grade B · 74%',
      meterClass: 'meter-success',
      attendance: 90,
      attendanceText: '90% present',
      facilities: [
        { className: 'badge badge-soft-warning', icon: 'ti ti-award', label: 'Scholarship' },
      ],
      fee: { className: 'badge badge-soft-success', label: 'Paid' },
      transportNote: 'Transport: Not assigned',
      notes: 'Improving steadily.',
    },
  },
  {
    id: 'AD9892430',
    name: 'Lisa',
    avatar: 'assets/img/students/student-05.jpg',
    admissionNo: 'AD9892430',
    classText: 'Class II',
    sectionText: 'Sec B',
    badges: [
      { className: 'badge badge-soft-info', icon: 'ti ti-bus', label: 'Transport' },
      { className: 'badge badge-soft-purple', icon: 'ti ti-building', label: 'Hostel' },
    ],
    status: 'Inactive',
    statusClass: 'is-inactive',
    level: 'II',
    section: 'B',
    gender: 'Female',
    join: '13 Feb 2024',
    transport: 'Yes',
    hostel: 'Yes',
    scholarship: 'No',
    year: '2024/2025',
    search: 'lisa ad9892430 class ii sec b female inactive transport-yes hostel-yes scholarship-no 2024/2025',
    detail: {
      guardian: 'Darlene Robertson',
      guardianRole: 'Guardian',
      phone: '+1 4521 784 111',
      email: 'darlene.robertson@example.com',
      address: '6391 Elgin St, USA',
      rollNo: '35009',
      dateOfBirth: '13 May 2017',
      gender: 'Female',
      bloodGroup: 'O-',
      exam: 'Grade C · 62%',
      meterClass: 'meter-danger',
      attendance: 71,
      attendanceText: '71% present',
      facilities: [
        { className: 'badge badge-soft-info', icon: 'ti ti-bus', label: 'Transport' },
        { className: 'badge badge-soft-purple', icon: 'ti ti-building', label: 'Hostel' },
      ],
      fee: { className: 'badge badge-soft-danger', label: 'Overdue' },
      transportNote: 'Transport: Route 12 · Bus 04',
      notes: 'On temporary leave.',
    },
  },
  {
    id: 'AD9892429',
    name: 'Ralph',
    avatar: 'assets/img/students/student-06.jpg',
    admissionNo: 'AD9892429',
    classText: 'Class III',
    sectionText: 'Sec B',
    badges: [],
    status: 'Active',
    statusClass: 'is-active',
    level: 'III',
    section: 'B',
    gender: 'Male',
    join: '11 Feb 2024',
    transport: 'No',
    hostel: 'No',
    scholarship: 'No',
    year: '2024/2025',
    search: 'ralph ad9892429 class iii sec b male active transport-no hostel-no scholarship-no 2024/2025',
    detail: {
      guardian: 'Kristin Watson',
      guardianRole: 'Guardian',
      phone: '+1 4547 784 522',
      email: 'kristin.watson@example.com',
      address: '2464 Royal Ln, USA',
      rollNo: '35008',
      dateOfBirth: '20 Jun 2015',
      gender: 'Male',
      bloodGroup: 'A-',
      exam: 'Grade A · 88%',
      meterClass: 'meter-success',
      attendance: 94,
      attendanceText: '94% present',
      facilities: [{ className: 'badge badge-soft-dark', label: 'Day Scholar' }],
      fee: { className: 'badge badge-soft-success', label: 'Paid' },
      transportNote: 'Transport: Not assigned',
      notes: 'Class monitor.',
    },
  },
  {
    id: 'AD9892428',
    name: 'Julie',
    avatar: 'assets/img/students/student-07.jpg',
    admissionNo: 'AD9892428',
    classText: 'Class V',
    sectionText: 'Sec A',
    badges: [
      { className: 'badge badge-soft-warning', icon: 'ti ti-award', label: 'Scholarship' },
      { className: 'badge badge-soft-info', icon: 'ti ti-bus', label: 'Transport' },
    ],
    status: 'Active',
    statusClass: 'is-active',
    level: 'V',
    section: 'A',
    gender: 'Female',
    join: '24 Jan 2024',
    transport: 'Yes',
    hostel: 'No',
    scholarship: 'Yes',
    year: '2024/2025',
    search: 'julie ad9892428 class v sec a female active transport-yes hostel-no scholarship-yes 2024/2025',
    detail: {
      guardian: 'Guy Hawkins',
      guardianRole: 'Guardian',
      phone: '+1 4874 445 154',
      email: 'guy.hawkins@example.com',
      address: '1901 Thornridge Cir, USA',
      rollNo: '35007',
      dateOfBirth: '18 Sep 2013',
      gender: 'Female',
      bloodGroup: 'B-',
      exam: 'Grade A · 91%',
      meterClass: 'meter-success',
      attendance: 97,
      attendanceText: '97% present',
      facilities: [
        { className: 'badge badge-soft-info', icon: 'ti ti-bus', label: 'Transport' },
        { className: 'badge badge-soft-warning', icon: 'ti ti-award', label: 'Scholarship' },
      ],
      fee: { className: 'badge badge-soft-success', label: 'Paid' },
      transportNote: 'Transport: Route 12 · Bus 04',
      notes: 'Top of the class.',
    },
  },
  {
    id: 'AD9892427',
    name: 'Ryan',
    avatar: 'assets/img/students/student-08.jpg',
    admissionNo: 'AD9892427',
    classText: 'Class VI',
    sectionText: 'Sec A',
    badges: [{ className: 'badge badge-soft-purple', icon: 'ti ti-building', label: 'Hostel' }],
    status: 'Active',
    statusClass: 'is-active',
    level: 'VI',
    section: 'A',
    gender: 'Male',
    join: '19 Jan 2024',
    transport: 'No',
    hostel: 'Yes',
    scholarship: 'No',
    year: '2024/2025',
    search: 'ryan ad9892427 class vi sec a male active transport-no hostel-yes scholarship-no 2024/2025',
    detail: {
      guardian: 'Theresa Webb',
      guardianRole: 'Guardian',
      phone: '+1 4541 445 847',
      email: 'theresa.webb@example.com',
      address: '8502 Preston Rd, USA',
      rollNo: '35006',
      dateOfBirth: '26 Nov 2012',
      gender: 'Male',
      bloodGroup: 'O+',
      exam: 'Grade B · 76%',
      meterClass: 'meter-warning',
      attendance: 85,
      attendanceText: '85% present',
      facilities: [
        { className: 'badge badge-soft-purple', icon: 'ti ti-building', label: 'Hostel' },
      ],
      fee: { className: 'badge badge-soft-warning', label: 'Due' },
      transportNote: 'Transport: Not assigned',
      notes: 'Interested in music.',
    },
  },
  {
    id: 'AD9892426',
    name: 'Susan',
    avatar: 'assets/img/students/student-09.jpg',
    admissionNo: 'AD9892426',
    classText: 'Class VIII',
    sectionText: 'Sec B',
    badges: [],
    status: 'Inactive',
    statusClass: 'is-inactive',
    level: 'VIII',
    section: 'B',
    gender: 'Female',
    join: '08 Jan 2024',
    transport: 'No',
    hostel: 'No',
    scholarship: 'No',
    year: '2024/2025',
    search: 'susan ad9892426 class viii sec b female inactive transport-no hostel-no scholarship-no 2024/2025',
    detail: {
      guardian: 'Kathryn Murphy',
      guardianRole: 'Guardian',
      phone: '+1 5478 574 845',
      email: 'kathryn.murphy@example.com',
      address: '3517 W Gray St, USA',
      rollNo: '35005',
      dateOfBirth: '26 May 2010',
      gender: 'Female',
      bloodGroup: 'AB-',
      exam: 'Grade C · 59%',
      meterClass: 'meter-danger',
      attendance: 68,
      attendanceText: '68% present',
      facilities: [{ className: 'badge badge-soft-dark', label: 'Day Scholar' }],
      fee: { className: 'badge badge-soft-danger', label: 'Overdue' },
      transportNote: 'Transport: Not assigned',
      notes: 'Requires follow up.',
    },
  },
  {
    id: 'AD9892425',
    name: 'Richard',
    avatar: 'assets/img/students/student-10.jpg',
    admissionNo: 'AD9892425',
    classText: 'Class VII',
    sectionText: 'Sec B',
    badges: [
      { className: 'badge badge-soft-warning', icon: 'ti ti-award', label: 'Scholarship' },
      { className: 'badge badge-soft-info', icon: 'ti ti-bus', label: 'Transport' },
    ],
    status: 'Active',
    statusClass: 'is-active',
    level: 'VII',
    section: 'B',
    gender: 'Male',
    join: '22 Dec 2024',
    transport: 'Yes',
    hostel: 'No',
    scholarship: 'Yes',
    year: '2024/2025',
    search: 'richard ad9892425 class vii sec b male active transport-yes hostel-no scholarship-yes 2024/2025',
    detail: {
      guardian: 'Ronald Richards',
      guardianRole: 'Guardian',
      phone: '+1 4587 111 544',
      email: 'ronald.richards@example.com',
      address: '2715 Ash Dr, USA',
      rollNo: '35004',
      dateOfBirth: '06 Oct 2011',
      gender: 'Male',
      bloodGroup: 'A+',
      exam: 'Grade A · 84%',
      meterClass: 'meter-success',
      attendance: 91,
      attendanceText: '91% present',
      facilities: [
        { className: 'badge badge-soft-info', icon: 'ti ti-bus', label: 'Transport' },
        { className: 'badge badge-soft-warning', icon: 'ti ti-award', label: 'Scholarship' },
      ],
      fee: { className: 'badge badge-soft-success', label: 'Paid' },
      transportNote: 'Transport: Route 12 · Bus 04',
      notes: 'Debate team member.',
    },
  },
  {
    id: 'AD9892424',
    name: 'Veronica',
    avatar: 'assets/img/students/student-11.jpg',
    admissionNo: 'AD9892424',
    classText: 'Class IX',
    sectionText: 'Sec A',
    badges: [{ className: 'badge badge-soft-purple', icon: 'ti ti-building', label: 'Hostel' }],
    status: 'Active',
    statusClass: 'is-active',
    level: 'IX',
    section: 'A',
    gender: 'Female',
    join: '15 Dec 2024',
    transport: 'No',
    hostel: 'Yes',
    scholarship: 'No',
    year: '2024/2025',
    search: 'veronica ad9892424 class ix sec a female active transport-no hostel-yes scholarship-no 2024/2025',
    detail: {
      guardian: 'Jenny Wilson',
      guardianRole: 'Guardian',
      phone: '+1 4574 587 154',
      email: 'jenny.wilson@example.com',
      address: '1234 Spring Hill, USA',
      rollNo: '35003',
      dateOfBirth: '27 Dec 2009',
      gender: 'Female',
      bloodGroup: 'B+',
      exam: 'Grade A · 87%',
      meterClass: 'meter-success',
      attendance: 93,
      attendanceText: '93% present',
      facilities: [
        { className: 'badge badge-soft-purple', icon: 'ti ti-building', label: 'Hostel' },
      ],
      fee: { className: 'badge badge-soft-success', label: 'Paid' },
      transportNote: 'Transport: Not assigned',
      notes: 'School prefect.',
    },
  },
];

/* -------------------------------------------------------------------------- */
/*                                Summary strip                                */
/* -------------------------------------------------------------------------- */

export interface SummaryCard {
  id: string;
  accent: string;
  icon: string;
  value: string;
  label: string;
  /** Only the last card carries a sparkline in the template. */
  spark?: number[];
}

export const summaryCards: SummaryCard[] = [
  { id: 'total', accent: 'accent-primary', icon: 'ti ti-users', value: '3256', label: 'Total Students' },
  { id: 'selected', accent: 'accent-purple', icon: 'ti ti-checkbox', value: '0', label: 'Selected' },
  { id: 'active', accent: 'accent-success', icon: 'ti ti-user-check', value: '9', label: 'Active' },
  { id: 'inactive', accent: 'accent-slate', icon: 'ti ti-user-off', value: '2', label: 'Inactive' },
  { id: 'new', accent: 'accent-warning', icon: 'ti ti-user-plus', value: '184', label: 'New Admissions' },
  { id: 'graduated', accent: 'accent-info', icon: 'ti ti-certificate', value: '212', label: 'Graduated' },
  { id: 'filtered', accent: 'accent-teal', icon: 'ti ti-filter', value: '11', label: 'Filtered Results' },
  {
    id: 'stats',
    accent: 'accent-danger',
    icon: 'ti ti-chart-bar',
    value: '94%',
    label: 'Avg Attendance',
    spark: [40, 65, 50, 80, 70, 95],
  },
];

/* -------------------------------------------------------------------------- */
/*                                   Toolbar                                   */
/* -------------------------------------------------------------------------- */

export interface SavedView {
  id: string;
  label: string;
  icon: string;
}

export const savedViews: SavedView[] = [
  { id: 'all', label: 'All Students', icon: 'ti ti-layout-list' },
  { id: 'Active', label: 'Active', icon: 'ti ti-circle-check' },
  { id: 'Inactive', label: 'Inactive', icon: 'ti ti-circle-x' },
  { id: 'Graduated', label: 'Graduated', icon: 'ti ti-certificate' },
  { id: 'Transfer', label: 'Transfer', icon: 'ti ti-transfer' },
];

export const quickFilters: SavedView[] = [
  { id: 'Active', label: 'Active', icon: 'ti ti-user-check' },
  { id: 'Inactive', label: 'Inactive', icon: 'ti ti-user-off' },
  { id: 'Graduated', label: 'Graduated', icon: 'ti ti-certificate' },
  { id: 'Transfer', label: 'Transfer', icon: 'ti ti-transfer' },
  { id: 'Leave', label: 'On Leave', icon: 'ti ti-plane-departure' },
];

/** Keys of `StudentRow` the advanced filter panel narrows on. */
export type FilterKey =
  | 'level'
  | 'section'
  | 'gender'
  | 'status'
  | 'transport'
  | 'hostel'
  | 'scholarship'
  | 'year';

export interface AdvancedFilter {
  /** The `id`/`for` pair the template gives the control. */
  inputId: string;
  key: FilterKey;
  /** The visible `<label>` copy. */
  fieldLabel: string;
  /** The `data-filter` name, which the engine uses as the chip label. */
  label: string;
  options: string[];
}

export const advancedFilters: AdvancedFilter[] = [
  { inputId: 'class', key: 'level', fieldLabel: 'Class', label: 'Class', options: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'] },
  { inputId: 'section', key: 'section', fieldLabel: 'Section', label: 'Section', options: ['A', 'B', 'C'] },
  { inputId: 'gender', key: 'gender', fieldLabel: 'Gender', label: 'Gender', options: ['Male', 'Female'] },
  { inputId: 'status', key: 'status', fieldLabel: 'Status', label: 'Status', options: ['Active', 'Inactive', 'Transfer', 'Graduated', 'Suspended', 'Leave'] },
  { inputId: 'transport', key: 'transport', fieldLabel: 'Transport', label: 'Transport', options: ['Yes', 'No'] },
  { inputId: 'hostel', key: 'hostel', fieldLabel: 'Hostel', label: 'Hostel', options: ['Yes', 'No'] },
  { inputId: 'scholarship', key: 'scholarship', fieldLabel: 'Scholarship', label: 'Scholarship', options: ['Yes', 'No'] },
  { inputId: 'academic-year', key: 'year', fieldLabel: 'Academic Year', label: 'Year', options: ['2024/2025', '2023/2024'] },
];

export type ColumnId = 'student' | 'status' | 'class' | 'section' | 'gender' | 'join';

export interface ColumnDef {
  id: ColumnId;
  label: string;
}

export const columnDefs: ColumnDef[] = [
  { id: 'student', label: 'Student' },
  { id: 'status', label: 'Status' },
  { id: 'class', label: 'Class' },
  { id: 'section', label: 'Section' },
  { id: 'gender', label: 'Gender' },
  { id: 'join', label: 'Date of Join' },
];

export type DensityId = 'compact' | 'default' | 'comfortable';

export interface DensityOption {
  id: DensityId;
  title: string;
  ariaLabel: string;
  icon: string;
}

export const densityOptions: DensityOption[] = [
  { id: 'compact', title: 'Compact', ariaLabel: 'Compact rows', icon: 'ti ti-baseline-density-small' },
  { id: 'default', title: 'Default', ariaLabel: 'Default rows', icon: 'ti ti-baseline-density-medium' },
  { id: 'comfortable', title: 'Comfortable', ariaLabel: 'Comfortable rows', icon: 'ti ti-baseline-density-large' },
];

export type SortKey = 'name' | 'status' | 'class' | 'section' | 'gender' | 'join' | 'recent';

export interface SortOption {
  id: SortKey;
  label: string;
  icon: string;
}

export const sortOptions: SortOption[] = [
  { id: 'name', label: 'Student name (A–Z)', icon: 'ti ti-abc' },
  { id: 'status', label: 'Status', icon: 'ti ti-flag' },
  { id: 'class', label: 'Class', icon: 'ti ti-school' },
  { id: 'join', label: 'Date of join', icon: 'ti ti-calendar' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** Column headers, in template order; `sort` doubles as the `data-cls-sort` key. */
export const tableHeaders: { id: ColumnId; label: string; sort: SortKey; resize: boolean }[] = [
  { id: 'student', label: 'Student', sort: 'name', resize: true },
  { id: 'status', label: 'Status', sort: 'status', resize: true },
  { id: 'class', label: 'Class', sort: 'class', resize: true },
  { id: 'section', label: 'Section', sort: 'section', resize: true },
  { id: 'gender', label: 'Gender', sort: 'gender', resize: true },
  { id: 'join', label: 'Date of Join', sort: 'join', resize: false },
];

export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'export_csv', label: 'Export as CSV', icon: 'ti ti-file-type-csv' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
];

export const pageSizes = ['10', '25', '50', '100'];

/* -------------------------------------------------------------------------- */
/*                                Row / bulk menus                             */
/* -------------------------------------------------------------------------- */

/** The twelve dialogs shipped with `student-lists.html`. */
export type StudentListModalId =
  | 'import'
  | 'loginDetail'
  | 'delete'
  | 'collectFees'
  | 'message'
  | 'email'
  | 'call'
  | 'swImport'
  | 'info'
  | 'bulk'
  | 'saveView'
  | 'confirm';

/**
 * A row's overflow-menu entry. `to` navigates, `modal` opens a dialog and
 * `action` routes through the workspace action handler.
 */
export interface RowMenuItem {
  label: string;
  icon: string;
  to?: string;
  modal?: StudentListModalId;
  action?: string;
  danger?: boolean;
  /** Renders `<hr class="dropdown-divider">` before this entry. */
  dividerBefore?: boolean;
}

export const rowMenu: RowMenuItem[] = [
  { label: 'Attendance', icon: 'ti ti-calendar-check', to: routes.studentAttendance },
  { label: 'Fees', icon: 'ti ti-cash', to: routes.studentFees },
  { label: 'Results', icon: 'ti ti-chart-bar', to: routes.studentResult },
  { label: 'Time Table', icon: 'ti ti-table', to: routes.studentTimeTable },
  { label: 'Parent', icon: 'ti ti-users', modal: 'info' },
  { label: 'Library', icon: 'ti ti-books', to: routes.studentLibrary },
  { label: 'Transport', icon: 'ti ti-bus', modal: 'info' },
  { label: 'Hostel', icon: 'ti ti-building', modal: 'info' },
  { label: 'ID Card', icon: 'ti ti-id', modal: 'info' },
  { label: 'Promotion', icon: 'ti ti-arrow-ramp-right-2', to: routes.studentPromotion },
  { label: 'Documents', icon: 'ti ti-file-description', to: routes.studentDocuments },
  { label: 'Medical', icon: 'ti ti-heartbeat', modal: 'info' },
  { label: 'Certificate', icon: 'ti ti-certificate', modal: 'info' },
  { label: 'Download', icon: 'ti ti-download', action: 'export_csv' },
  { label: 'Email', icon: 'ti ti-mail', modal: 'email', dividerBefore: true },
  { label: 'Call', icon: 'ti ti-phone', modal: 'call' },
  { label: 'Print', icon: 'ti ti-printer', action: 'print' },
  { label: 'Archive', icon: 'ti ti-archive', action: 'archive', dividerBefore: true },
  { label: 'Suspend', icon: 'ti ti-ban', modal: 'confirm' },
  { label: 'Delete', icon: 'ti ti-trash-x', modal: 'delete', danger: true },
];

export interface BulkAction {
  label: string;
  icon: string;
  modal?: StudentListModalId;
  action?: string;
  danger?: boolean;
}

export const bulkActions: BulkAction[] = [
  { label: 'Attendance', icon: 'ti ti-calendar-check', modal: 'bulk' },
  { label: 'Promotion', icon: 'ti ti-arrow-up-circle', action: 'promote' },
  { label: 'Message', icon: 'ti ti-message', modal: 'message' },
  { label: 'Email', icon: 'ti ti-mail', modal: 'email' },
  { label: 'Assign Class', icon: 'ti ti-users-group', modal: 'bulk' },
  { label: 'Export', icon: 'ti ti-download', action: 'export_csv' },
  { label: 'Print', icon: 'ti ti-printer', action: 'print' },
  { label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

/**
 * `tables.js` toast copy for `student-lists.html`, keyed by `data-cls-action`.
 * Actions absent from the registry raise no toast, exactly as the engine does.
 */
export const actionToasts: Record<string, { message: string; variant: 'success' | 'info' }> = {
  refresh: { message: 'Student list refreshed.', variant: 'success' },
  save_view: { message: 'Current filters saved as a new view.', variant: 'success' },
  duplicate: { message: 'Student record duplicated as a draft.', variant: 'success' },
  promote: { message: 'Promotion workspace opened for the selected students.', variant: 'info' },
  print: { message: 'Sending the class list to the printer…', variant: 'info' },
  archive: { message: 'Selected students archived.', variant: 'success' },
  export_excel: { message: 'Excel workbook queued for download.', variant: 'info' },
  export_pdf: { message: 'PDF export queued for download.', variant: 'info' },
  export_csv: { message: 'Preparing export…', variant: 'info' },
  page: { message: 'Loading the selected page…', variant: 'info' },
};
