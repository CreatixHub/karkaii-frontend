/** The cards in the `.summary-strip`, in template order. Every figure is computed from real teachers. */
export interface SummaryCard {
  id: string;
  accent: string;
  icon: string;
  /** Shown only until the live figure arrives. */
  value: string;
  label: string;
  spark?: string[];
}

export const summaryCards: SummaryCard[] = [
  { id: 'total', accent: 'accent-primary', icon: 'ti ti-users', value: '0', label: 'Total Teachers' },
  { id: 'selected', accent: 'accent-purple', icon: 'ti ti-checkbox', value: '0', label: 'Selected' },
  { id: 'active', accent: 'accent-success', icon: 'ti ti-user-check', value: '0', label: 'Active' },
  { id: 'inactive', accent: 'accent-slate', icon: 'ti ti-user-off', value: '0', label: 'Inactive' },
  { id: 'new', accent: 'accent-warning', icon: 'ti ti-user-plus', value: '0', label: 'New This Year' },
  { id: 'graduated', accent: 'accent-info', icon: 'ti ti-book', value: '0', label: 'Subjects' },
  { id: 'filtered', accent: 'accent-teal', icon: 'ti ti-filter', value: '0', label: 'Filtered Results' },
];

export interface TeacherCard {
  /** The teacher's database id (used in every link). */
  key: string;
  /** Employee number printed in the card header. */
  id: string;
  name: string;
  initials: string;
  status: 'Active' | 'Inactive';
  statusBadge: string;
  employment: { label: string; className: string };
  qualification: string;
  /** "Maths, English" or "—" */
  subject: string;
  subjectNames: string[];
  /** "Grade 6, Grade 7" or "—" */
  classes: string;
  classNames: string[];
  /** "Grade 6 - A" ... */
  sections: string[];
  phone: string;
  email: string;
  experience: string;
  address: string;
  joined: string;
  joinedYear: number | null;
  /** Lower-case haystack for the toolbar search. */
  search: string;
}