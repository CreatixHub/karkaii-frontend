/* -------------------------------------------------------------------------- */
/*                                    Rows                                     */
/* -------------------------------------------------------------------------- */

export interface ParentChild {
  name: string;
  avatar: string;
  classLabel: string;
  admissionNo: string;
  rollNo: string;
  gender: string;
  dateOfJoined: string;
}

export interface ParentRow {
  id: string;
  name: string;
  avatar: string;
  addedOn: string;
  status: string;
  statusClass: string;
  /** The row/detail column shows only the primary child. */
  child: ParentChild;
  /** The View Details dialog lists every linked child (Thomas has two). */
  children: ParentChild[];
  phone: string;
  email: string;
  address: string;
  relationship: string;
  occupation: string;
  level: string;
  section: string;
  year: string;
  childrenCount: string;
  /** The template's `data-search` haystack, kept verbatim. */
  search: string;
}

export const parentRows: ParentRow[] = [
  {
    id: 'P124556',
    name: 'Thomas',
    avatar: 'assets/img/parents/parent-01.jpg',
    addedOn: '25 Mar 2024',
    status: 'Active',
    statusClass: 'is-active',
    child: {
      name: 'Janet',
      avatar: 'assets/img/students/student-01.jpg',
      classLabel: 'III, A',
      admissionNo: 'AD9892434',
      rollNo: '35010',
      gender: 'Female',
      dateOfJoined: '22 Mar 2018',
    },
    children: [
      {
        name: 'Janet',
        avatar: 'assets/img/students/student-01.jpg',
        classLabel: 'III, A',
        admissionNo: 'AD9892434',
        rollNo: '35010',
        gender: 'Female',
        dateOfJoined: '22 Mar 2018',
      },
      {
        name: 'Joann',
        avatar: 'assets/img/students/student-02.jpg',
        classLabel: 'IV, B',
        admissionNo: 'AD9892433',
        rollNo: '35012',
        gender: 'Male',
        dateOfJoined: '18 Mar 2018',
      },
    ],
    phone: '+1 65738 58937',
    email: 'thomas@example.com',
    address: '911 Deer Ridge Drive, USA',
    relationship: 'Father',
    occupation: 'Not specified',
    level: 'III',
    section: 'A',
    year: '2024/2025',
    childrenCount: '2',
    search: 'thomas p124556 janet class iii sec a thomas@example.com active 2024/2025 children-2',
  },
  {
    id: 'P124555',
    name: 'Marquita',
    avatar: 'assets/img/parents/parent-02.jpg',
    addedOn: '18 Mar 2024',
    status: 'Active',
    statusClass: 'is-active',
    child: {
      name: 'Joann',
      avatar: 'assets/img/students/student-02.jpg',
      classLabel: 'IV, B',
      admissionNo: 'AD9892433',
      rollNo: '35012',
      gender: 'Male',
      dateOfJoined: '18 Mar 2018',
    },
    children: [
      {
        name: 'Joann',
        avatar: 'assets/img/students/student-02.jpg',
        classLabel: 'IV, B',
        admissionNo: 'AD9892433',
        rollNo: '35012',
        gender: 'Male',
        dateOfJoined: '18 Mar 2018',
      },
    ],
    phone: '+1 47958 41398',
    email: 'marquita@example.com',
    address: '2972 Westheimer Rd, USA',
    relationship: 'Mother',
    occupation: 'Not specified',
    level: 'IV',
    section: 'B',
    year: '2024/2025',
    childrenCount: '1',
    search: 'marquita p124555 joann class iv sec b marquita@example.com active 2024/2025 children-1',
  },
  {
    id: 'P124554',
    name: 'Johnson',
    avatar: 'assets/img/parents/parent-03.jpg',
    addedOn: '14 Mar 2024',
    status: 'Active',
    statusClass: 'is-active',
    child: {
      name: 'Kathleen',
      avatar: 'assets/img/students/student-03.jpg',
      classLabel: 'III, A',
      admissionNo: 'AD9892432',
      rollNo: '35011',
      gender: 'Female',
      dateOfJoined: '05 Dec 2017',
    },
    children: [
      {
        name: 'Kathleen',
        avatar: 'assets/img/students/student-03.jpg',
        classLabel: 'III, A',
        admissionNo: 'AD9892432',
        rollNo: '35011',
        gender: 'Female',
        dateOfJoined: '05 Dec 2017',
      },
    ],
    phone: '+1 78688 17496',
    email: 'johnson@example.com',
    address: '4517 Washington Ave, USA',
    relationship: 'Father',
    occupation: 'Not specified',
    level: 'III',
    section: 'A',
    year: '2024/2025',
    childrenCount: '1',
    search: 'johnson p124554 kathleen class iii sec a johnson@example.com active 2024/2025 children-1',
  },
  {
    id: 'P124553',
    name: 'Claudia',
    avatar: 'assets/img/parents/parent-04.jpg',
    addedOn: '27 Feb 2024',
    status: 'Active',
    statusClass: 'is-active',
    child: {
      name: 'Gifford',
      avatar: 'assets/img/students/student-04.jpg',
      classLabel: 'I, B',
      admissionNo: 'AD9892431',
      rollNo: '35009',
      gender: 'Male',
      dateOfJoined: '22 Mar 2019',
    },
    children: [
      {
        name: 'Gifford',
        avatar: 'assets/img/students/student-04.jpg',
        classLabel: 'I, B',
        admissionNo: 'AD9892431',
        rollNo: '35009',
        gender: 'Male',
        dateOfJoined: '22 Mar 2019',
      },
    ],
    phone: '+1 72323 05904',
    email: 'claudia@example.com',
    address: '3891 Ranchview Dr, USA',
    relationship: 'Mother',
    occupation: 'Not specified',
    level: 'I',
    section: 'B',
    year: '2024/2025',
    childrenCount: '1',
    search: 'claudia p124553 gifford class i sec b claudia@example.com active 2024/2025 children-1',
  },
  {
    id: 'P124552',
    name: 'Arthur',
    avatar: 'assets/img/parents/parent-05.jpg',
    addedOn: '11 Feb 2024',
    status: 'Inactive',
    statusClass: 'is-inactive',
    child: {
      name: 'Lisa',
      avatar: 'assets/img/students/student-05.jpg',
      classLabel: 'II, B',
      admissionNo: 'AD9892430',
      rollNo: '35008',
      gender: 'Female',
      dateOfJoined: '13 May 2018',
    },
    children: [
      {
        name: 'Lisa',
        avatar: 'assets/img/students/student-05.jpg',
        classLabel: 'II, B',
        admissionNo: 'AD9892430',
        rollNo: '35008',
        gender: 'Female',
        dateOfJoined: '13 May 2018',
      },
    ],
    phone: '+1 74820 48201',
    email: 'arthur@example.com',
    address: '6391 Elgin St, USA',
    relationship: 'Father',
    occupation: 'Not specified',
    level: 'II',
    section: 'B',
    year: '2024/2025',
    childrenCount: '1',
    search: 'arthur p124552 lisa class ii sec b arthur@example.com inactive 2024/2025 children-1',
  },
  {
    id: 'P124551',
    name: 'Colleen',
    avatar: 'assets/img/parents/parent-06.jpg',
    addedOn: '24 Jan 2024',
    status: 'Active',
    statusClass: 'is-active',
    child: {
      name: 'Ralph',
      avatar: 'assets/img/students/student-06.jpg',
      classLabel: 'III, B',
      admissionNo: 'AD9892429',
      rollNo: '35007',
      gender: 'Male',
      dateOfJoined: '20 Jun 2017',
    },
    children: [
      {
        name: 'Ralph',
        avatar: 'assets/img/students/student-06.jpg',
        classLabel: 'III, B',
        admissionNo: 'AD9892429',
        rollNo: '35007',
        gender: 'Male',
        dateOfJoined: '20 Jun 2017',
      },
    ],
    phone: '+1 46169 47202',
    email: 'colleen@example.com',
    address: '2464 Royal Ln, USA',
    relationship: 'Mother',
    occupation: 'Not specified',
    level: 'III',
    section: 'B',
    year: '2024/2025',
    childrenCount: '1',
    search: 'colleen p124551 ralph class iii sec b colleen@example.com active 2024/2025 children-1',
  },
  {
    id: 'P124550',
    name: 'Robert',
    avatar: 'assets/img/parents/parent-07.jpg',
    addedOn: '19 Jan 2024',
    status: 'Active',
    statusClass: 'is-active',
    child: {
      name: 'Julie',
      avatar: 'assets/img/students/student-07.jpg',
      classLabel: 'V, A',
      admissionNo: 'AD9892428',
      rollNo: '35006',
      gender: 'Female',
      dateOfJoined: '18 Sep 2016',
    },
    children: [
      {
        name: 'Julie',
        avatar: 'assets/img/students/student-07.jpg',
        classLabel: 'V, A',
        admissionNo: 'AD9892428',
        rollNo: '35006',
        gender: 'Female',
        dateOfJoined: '18 Sep 2016',
      },
    ],
    phone: '+1 44990 27830',
    email: 'robert@example.com',
    address: '1901 Thornridge Cir, USA',
    relationship: 'Father',
    occupation: 'Not specified',
    level: 'V',
    section: 'A',
    year: '2024/2025',
    childrenCount: '1',
    search: 'robert p124550 julie class v sec a robert@example.com active 2024/2025 children-1',
  },
  {
    id: 'P124549',
    name: 'Jessie',
    avatar: 'assets/img/parents/parent-08.jpg',
    addedOn: '08 Jan 2024',
    status: 'Active',
    statusClass: 'is-active',
    child: {
      name: 'Janet',
      avatar: 'assets/img/students/student-08.jpg',
      classLabel: 'III, A',
      admissionNo: 'AD9892427',
      rollNo: '35005',
      gender: 'Female',
      dateOfJoined: '08 Jan 2018',
    },
    children: [
      {
        name: 'Janet',
        avatar: 'assets/img/students/student-08.jpg',
        classLabel: 'III, A',
        admissionNo: 'AD9892427',
        rollNo: '35005',
        gender: 'Female',
        dateOfJoined: '08 Jan 2018',
      },
    ],
    phone: '+1 84634 04823',
    email: 'jessie@example.com',
    address: '8502 Preston Rd, USA',
    relationship: 'Mother',
    occupation: 'Not specified',
    level: 'III',
    section: 'A',
    year: '2024/2025',
    childrenCount: '1',
    search: 'jessie p124549 janet class iii sec a jessie@example.com active 2024/2025 children-1',
  },
  {
    id: 'P124548',
    name: 'Michael',
    avatar: 'assets/img/parents/parent-09.jpg',
    addedOn: '22 Dec 2024',
    status: 'Inactive',
    statusClass: 'is-inactive',
    child: {
      name: 'Susan',
      avatar: 'assets/img/students/student-09.jpg',
      classLabel: 'VIII, B',
      admissionNo: 'AD9892426',
      rollNo: '35004',
      gender: 'Female',
      dateOfJoined: '26 May 2015',
    },
    children: [
      {
        name: 'Susan',
        avatar: 'assets/img/students/student-09.jpg',
        classLabel: 'VIII, B',
        admissionNo: 'AD9892426',
        rollNo: '35004',
        gender: 'Female',
        dateOfJoined: '26 May 2015',
      },
    ],
    phone: '+1 91038 68460',
    email: 'michael@example.com',
    address: '3517 W Gray St, USA',
    relationship: 'Father',
    occupation: 'Not specified',
    level: 'VIII',
    section: 'B',
    year: '2024/2025',
    childrenCount: '1',
    search: 'michael p124548 susan class viii sec b michael@example.com inactive 2024/2025 children-1',
  },
  {
    id: 'P124547',
    name: 'Mary',
    avatar: 'assets/img/parents/parent-10.jpg',
    addedOn: '15 Dec 2024',
    status: 'Active',
    statusClass: 'is-active',
    child: {
      name: 'Richard',
      avatar: 'assets/img/students/student-10.jpg',
      classLabel: 'VII, B',
      admissionNo: 'AD9892425',
      rollNo: '35003',
      gender: 'Male',
      dateOfJoined: '06 Oct 2016',
    },
    children: [
      {
        name: 'Richard',
        avatar: 'assets/img/students/student-10.jpg',
        classLabel: 'VII, B',
        admissionNo: 'AD9892425',
        rollNo: '35003',
        gender: 'Male',
        dateOfJoined: '06 Oct 2016',
      },
    ],
    phone: '+1 35835 71839',
    email: 'mary@example.com',
    address: '2715 Ash Dr, USA',
    relationship: 'Mother',
    occupation: 'Not specified',
    level: 'VII',
    section: 'B',
    year: '2024/2025',
    childrenCount: '1',
    search: 'mary p124547 richard class vii sec b mary@example.com active 2024/2025 children-1',
  },
  {
    id: 'P124546',
    name: 'Edwin',
    avatar: 'assets/img/parents/parent-11.jpg',
    addedOn: '10 Dec 2023',
    status: 'Active',
    statusClass: 'is-active',
    child: {
      name: 'Veronica',
      avatar: 'assets/img/students/student-11.jpg',
      classLabel: 'IX, A',
      admissionNo: 'AD9892424',
      rollNo: '35002',
      gender: 'Female',
      dateOfJoined: '27 Dec 2014',
    },
    children: [
      {
        name: 'Veronica',
        avatar: 'assets/img/students/student-11.jpg',
        classLabel: 'IX, A',
        admissionNo: 'AD9892424',
        rollNo: '35002',
        gender: 'Female',
        dateOfJoined: '27 Dec 2014',
      },
    ],
    phone: '+1 65738 58940',
    email: 'edw@example.com',
    address: '1234 Spring Hill, USA',
    relationship: 'Father',
    occupation: 'Not specified',
    level: 'IX',
    section: 'A',
    year: '2023/2024',
    childrenCount: '1',
    search: 'edwin p124546 veronica class ix sec a edw@example.com active 2023/2024 children-1',
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
  { id: 'total', accent: 'accent-primary', icon: 'ti ti-users', value: '2847', label: 'Total Parents' },
  { id: 'selected', accent: 'accent-purple', icon: 'ti ti-checkbox', value: '0', label: 'Selected' },
  { id: 'active', accent: 'accent-success', icon: 'ti ti-user-check', value: '9', label: 'Active' },
  { id: 'inactive', accent: 'accent-slate', icon: 'ti ti-user-off', value: '2', label: 'Inactive' },
  { id: 'new', accent: 'accent-warning', icon: 'ti ti-user-plus', value: '318', label: 'New This Year' },
  { id: 'graduated', accent: 'accent-info', icon: 'ti ti-school', value: '1540', label: 'Children Linked' },
  { id: 'filtered', accent: 'accent-teal', icon: 'ti ti-filter', value: '11', label: 'Filtered Results' },
  {
    id: 'stats',
    accent: 'accent-danger',
    icon: 'ti ti-chart-bar',
    value: '92%',
    label: 'Avg Response',
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
  { id: 'all', label: 'All Parents', icon: 'ti ti-layout-list' },
  { id: 'Active', label: 'Active', icon: 'ti ti-circle-check' },
  { id: 'Inactive', label: 'Inactive', icon: 'ti ti-circle-x' },
];

export const quickFilters: SavedView[] = [
  { id: 'Active', label: 'Active', icon: 'ti ti-user-check' },
  { id: 'Inactive', label: 'Inactive', icon: 'ti ti-user-off' },
];

/** Keys of `ParentRow` the advanced filter panel narrows on. */
export type FilterKey = 'level' | 'status' | 'childrenCount' | 'year';

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
  { inputId: 'child-class', key: 'level', fieldLabel: 'Child Class', label: 'Class', options: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'] },
  { inputId: 'status', key: 'status', fieldLabel: 'Status', label: 'Status', options: ['Active', 'Inactive'] },
  { inputId: 'children', key: 'childrenCount', fieldLabel: 'Children', label: 'Children', options: ['1', '2', '3+'] },
  { inputId: 'academic-year', key: 'year', fieldLabel: 'Academic Year', label: 'Year', options: ['2024/2025', '2023/2024'] },
];

export type ColumnId = 'parent' | 'status' | 'child' | 'phone' | 'email' | 'added';

export interface ColumnDef {
  id: ColumnId;
  label: string;
}

export const columnDefs: ColumnDef[] = [
  { id: 'parent', label: 'Parent' },
  { id: 'status', label: 'Status' },
  { id: 'child', label: 'Child' },
  { id: 'phone', label: 'Phone' },
  { id: 'email', label: 'Email' },
  { id: 'added', label: 'Added On' },
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

export type SortKey = 'name' | 'child' | 'recent';

export interface SortOption {
  id: SortKey;
  label: string;
  icon: string;
}

export const sortOptions: SortOption[] = [
  { id: 'name', label: 'Parent name (A–Z)', icon: 'ti ti-abc' },
  { id: 'child', label: 'Child name', icon: 'ti ti-user' },
  { id: 'recent', label: 'Recently added', icon: 'ti ti-clock' },
];

/** Column headers, in template order; `sort` doubles as the `data-cls-sort` key. */
export const tableHeaders: { id: ColumnId; label: string; sort?: SortKey; resize: boolean }[] = [
  { id: 'parent', label: 'Parent', sort: 'name', resize: true },
  { id: 'status', label: 'Status', resize: true },
  { id: 'child', label: 'Child', sort: 'child', resize: true },
  { id: 'phone', label: 'Phone', resize: true },
  { id: 'email', label: 'Email', resize: true },
  { id: 'added', label: 'Added On', resize: false },
];

export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'export_csv', label: 'Export as CSV', icon: 'ti ti-file-type-csv' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
];

export const pageSizes = ['10', '25', '50', '100'];

/* -------------------------------------------------------------------------- */
/*                                Bulk actions                                 */
/* -------------------------------------------------------------------------- */

/** The seven dialogs/actions shipped with `parents.html`. */
export type ParentListModalId = 'import' | 'add' | 'edit' | 'view' | 'delete' | 'message' | 'email';

export interface BulkAction {
  label: string;
  icon: string;
  modal?: ParentListModalId;
  action?: string;
  danger?: boolean;
}

export const bulkActions: BulkAction[] = [
  { label: 'Message', icon: 'ti ti-message', modal: 'message' },
  { label: 'Email', icon: 'ti ti-mail', modal: 'email' },
  { label: 'SMS', icon: 'ti ti-device-mobile-message', action: 'sms' },
  { label: 'Assign', icon: 'ti ti-users-group', action: 'assign_class' },
  { label: 'Export', icon: 'ti ti-download', action: 'export_csv' },
  { label: 'Print', icon: 'ti ti-printer', action: 'print' },
  { label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

/**
 * Toast copy for `data-cls-action` hooks, keyed by action id. Actions absent
 * from the registry raise no toast.
 */
export const actionToasts: Record<string, { message: string; variant: 'success' | 'info' }> = {
  refresh: { message: 'Parent directory refreshed.', variant: 'success' },
  save_view: { message: 'Current filters saved as a new view.', variant: 'success' },
  print: { message: 'Sending the parent list to the printer…', variant: 'info' },
  export_excel: { message: 'Excel workbook queued for download.', variant: 'info' },
  export_pdf: { message: 'PDF export queued for download.', variant: 'info' },
  export_csv: { message: 'Preparing export…', variant: 'info' },
  page: { message: 'Loading the selected page…', variant: 'info' },
  sms: { message: 'SMS queued for the selected parents.', variant: 'info' },
  assign_class: { message: 'Class assignment workspace opened for the selected parents.', variant: 'info' },
};
