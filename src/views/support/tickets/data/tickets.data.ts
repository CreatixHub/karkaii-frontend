/* ------------------------------------------------------------------ *
 * The counts                                                         *
 * ------------------------------------------------------------------ */

export const OPEN = 42;
export const RESOLVED = 186;
export const PENDING = 20;

/** Every ticket the desk holds, however it stands. */
export const TOTAL = OPEN + RESOLVED + PENDING;

export interface StatTile {
  id: string;
  tint: string;
  icon: string;
  priority: string;
  value: number;
  label: string;
  /** The bar under the figure: what it measures and how far along it is. */
  sla: { label: string; percent: number };
}

export const STATS: StatTile[] = [
  {
    id: 'total',
    tint: 'primary',
    icon: 'ti ti-ticket',
    priority: 'All',
    value: TOTAL,
    label: 'Total Tickets',
    sla: { label: 'SLA Met', percent: 92 },
  },
  {
    id: 'open',
    tint: 'warning',
    icon: 'ti ti-alert-triangle',
    priority: 'High',
    value: OPEN,
    label: 'Open Tickets',
    sla: { label: 'SLA Risk', percent: 38 },
  },
  {
    id: 'resolved',
    tint: 'success',
    icon: 'ti ti-checks',
    priority: 'Closed',
    value: RESOLVED,
    label: 'Resolved',
    sla: { label: 'SLA Met', percent: 96 },
  },
  {
    id: 'pending',
    tint: 'info',
    icon: 'ti ti-clock-hour-4',
    priority: 'Low',
    value: PENDING,
    label: 'Pending',
    sla: { label: 'SLA Due', percent: 60 },
  },
];

/* ------------------------------------------------------------------ *
 * The tickets                                                        *
 * ------------------------------------------------------------------ */

export type Priority = 'High' | 'Medium' | 'Low';
export type TicketState = 'Open' | 'InProgress' | 'Closed' | 'Reopened';

export interface Ticket {
  id: string;
  department: string;
  priority: Priority;
  /** The template opens every card's visibility select on "Mark as Private". */
  private: boolean;
  photo: string;
  ref: string;
  title: string;
  state: TicketState;
  assignee: string;
  assigneePhoto: string;
  updated: string;
  comments: number;
}

export const TICKETS: Ticket[] = [
  {
    id: 'laptop',
    department: 'IT Support',
    priority: 'High',
    private: true,
    photo: 'assets/img/students/student-11.jpg',
    ref: '#TK0003',
    title: 'Laptop Issue',
    state: 'Open',
    assignee: 'Daniel',
    assigneePhoto: 'assets/img/teachers/teacher-02.jpg',
    updated: 'Updated 22 hours ago',
    comments: 9,
  },
  {
    id: 'air-conditioning',
    department: 'Maintenance',
    priority: 'Low',
    private: true,
    photo: 'assets/img/students/student-01.jpg',
    ref: '#TK0004',
    title: 'Air Conditioning Problem in Classroom',
    state: 'InProgress',
    assignee: 'Teresa',
    assigneePhoto: 'assets/img/teachers/teacher-01.jpg',
    updated: 'Updated 20 hours ago',
    comments: 15,
  },
  {
    id: 'bus-route',
    department: 'Transportation Issue',
    priority: 'Medium',
    private: true,
    photo: 'assets/img/students/student-05.jpg',
    ref: '#TK0003',
    title: 'School Bus Route Issue',
    state: 'Closed',
    assignee: 'James',
    assigneePhoto: 'assets/img/teachers/teacher-06.jpg',
    updated: 'Updated 15 hours ago',
    comments: 12,
  },
  {
    id: 'library-book',
    department: 'Library',
    priority: 'Medium',
    private: true,
    photo: 'assets/img/students/student-09.jpg',
    ref: '#TK0002',
    title: 'Library Book Request',
    state: 'Reopened',
    assignee: 'Reopened',
    assigneePhoto: 'assets/img/teachers/teacher-09.jpg',
    updated: 'Updated 05 hours ago',
    comments: 13,
  },
];

/** A priority's colour follows from the priority. */
export const priorityTint = (priority: Priority) =>
  ({ High: 'danger', Medium: 'warning', Low: 'success' })[priority];

/** So does a state's. */
export const stateTint = (state: TicketState) =>
  ({ Open: 'danger', InProgress: 'warning', Closed: 'success', Reopened: 'info' })[state];

/* ------------------------------------------------------------------ *
 * The sidebar                                                        *
 * ------------------------------------------------------------------ */

export interface Tally {
  id: string;
  label: string;
  /** Photo, where the row is a person. */
  photo?: string;
  /** Open against this row, and closed. Zero counts are not printed. */
  open: number;
  closed: number;
}

export const CATEGORIES: Tally[] = [
  { id: 'internet', label: 'Internet Issue', open: 2, closed: 0 },
  { id: 'computer', label: 'Computer', open: 2, closed: 1 },
  { id: 'redistribute', label: 'Redistribute', open: 0, closed: 1 },
  { id: 'payment', label: 'Payment', open: 0, closed: 2 },
  { id: 'complaint', label: 'Complaint', open: 3, closed: 1 },
];

export const AGENTS: Tally[] = [
  { id: 'hellana', label: 'Hellana', photo: 'assets/img/teachers/teacher-03.jpg', open: 2, closed: 0 },
  { id: 'teresa', label: 'Teresa', photo: 'assets/img/teachers/teacher-01.jpg', open: 2, closed: 1 },
  { id: 'daniel', label: 'Daniel', photo: 'assets/img/teachers/teacher-02.jpg', open: 0, closed: 1 },
  { id: 'willie', label: 'Willie', photo: 'assets/img/teachers/teacher-04.jpg', open: 0, closed: 2 },
];

/* ------------------------------------------------------------------ *
 * The controls                                                       *
 * ------------------------------------------------------------------ */

export const STATE_FILTERS: (TicketState | 'All')[] = [
  'All',
  'Open',
  'InProgress',
  'Closed',
  'Reopened',
];

export const assigneeOptions = [...new Set(TICKETS.map((row) => row.assignee))];
export const priorityOptions: Priority[] = ['High', 'Medium', 'Low'];
export const dateOptions = ['22 May 2024', '23 May 2024', '24 May 2024'];
