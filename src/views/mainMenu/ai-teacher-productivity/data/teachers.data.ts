/** `is-high` / `is-mid` / `is-low` tint the bar; the template leaves most bare. */
export type FacetTone = '' | 'is-high' | 'is-mid' | 'is-low';

export interface TeacherFacet {
  label: string;
  value: number;
  tone: FacetTone;
}

export interface ProductivityTeacher {
  id: string;
  name: string;
  department: string;
  avatar: string;
  /** Productivity score out of 100, shown in `.tch-card-score`. */
  score: number;
  /** The `ti-book` pill — the subjects column in the All Teachers table. */
  subjects: string;
  /** The `ti-bulb` pill — the teaching-style column in the table. */
  style: string;
  facets: TeacherFacet[];
  /** The single-line AI note under the profile bars. */
  note: string;
  confidence: number;
  /** "Today" / "Yesterday" / "2 days ago" — the card prefixes it with "Reviewed". */
  reviewed: string;
}

export const teachers: ProductivityTeacher[] = [
  {
    id: 'teena-mathew',
    name: 'Teena Mathew',
    department: 'Mathematics',
    avatar: 'assets/img/teachers/teacher-01.jpg',
    score: 94,
    subjects: 'Algebra, Geometry',
    style: 'Worked example first',
    facets: [
      { label: 'Engagement', value: 95, tone: 'is-high' },
      { label: 'Lesson planning', value: 92, tone: '' },
      { label: 'Assessment', value: 90, tone: '' },
      { label: 'Workload', value: 68, tone: '' },
    ],
    note: 'Highest engagement in the school',
    confidence: 96,
    reviewed: 'Today',
  },
  {
    id: 'meera-joshi',
    name: 'Meera Joshi',
    department: 'Languages',
    avatar: 'assets/img/teachers/teacher-02.jpg',
    score: 89,
    subjects: 'English, Literature',
    style: 'Discussion led',
    facets: [
      { label: 'Engagement', value: 91, tone: 'is-high' },
      { label: 'Lesson planning', value: 86, tone: '' },
      { label: 'Assessment', value: 88, tone: '' },
      { label: 'Workload', value: 94, tone: 'is-low' },
    ],
    note: 'Carrying 31 periods against a 26 ceiling',
    confidence: 94,
    reviewed: 'Today',
  },
  {
    id: 'daniel-josua',
    name: 'Daniel Josua',
    department: 'Science',
    avatar: 'assets/img/teachers/teacher-03.jpg',
    score: 86,
    subjects: 'Physics, Chemistry',
    style: 'Practical first',
    facets: [
      { label: 'Engagement', value: 88, tone: 'is-high' },
      { label: 'Lesson planning', value: 84, tone: '' },
      { label: 'Assessment', value: 79, tone: 'is-mid' },
      { label: 'Workload', value: 86, tone: 'is-mid' },
    ],
    note: 'Assignment reviews running eight days late',
    confidence: 92,
    reviewed: 'Yesterday',
  },
  {
    id: 'leela-nambiar',
    name: 'Leela Nambiar',
    department: 'Science',
    avatar: 'assets/img/teachers/teacher-04.jpg',
    score: 83,
    subjects: 'Biology',
    style: 'Enquiry based',
    facets: [
      { label: 'Engagement', value: 79, tone: '' },
      { label: 'Lesson planning', value: 88, tone: '' },
      { label: 'Assessment', value: 85, tone: '' },
      { label: 'Workload', value: 61, tone: '' },
    ],
    note: 'Strongest lesson planning, lightest timetable',
    confidence: 90,
    reviewed: 'Yesterday',
  },
  {
    id: 'priya-sundaram',
    name: 'Priya Sundaram',
    department: 'Mathematics',
    avatar: 'assets/img/teachers/teacher-05.jpg',
    score: 78,
    subjects: 'Statistics',
    style: 'Structured drill',
    facets: [
      { label: 'Engagement', value: 71, tone: '' },
      { label: 'Lesson planning', value: 82, tone: '' },
      { label: 'Assessment', value: 86, tone: '' },
      { label: 'Workload', value: 79, tone: '' },
    ],
    note: 'Participation below department median',
    confidence: 88,
    reviewed: '2 days ago',
  },
  {
    id: 'rakesh-sharma',
    name: 'Rakesh Sharma',
    department: 'Humanities',
    avatar: 'assets/img/teachers/teacher-06.jpg',
    score: 74,
    subjects: 'History, Civics',
    style: 'Narrative led',
    facets: [
      { label: 'Engagement', value: 76, tone: '' },
      { label: 'Lesson planning', value: 68, tone: '' },
      { label: 'Assessment', value: 72, tone: 'is-mid' },
      { label: 'Workload', value: 52, tone: '' },
    ],
    note: 'Lesson plans filed late in nine of twelve weeks',
    confidence: 86,
    reviewed: '3 days ago',
  },
];

/** The engine reviewed 42 teachers; six of them ship as records. */
export const TOTAL_TEACHERS = 42;

/** Page-header dropdown, and the department filter in the All Teachers dialog. */
export const departments = [
  'All departments',
  'Mathematics',
  'Science',
  'Languages',
  'Humanities',
];

/** All Teachers dialog — teaching-style filter. */
export const teachingStyles = [
  'All teaching styles',
  'Worked example first',
  'Discussion led',
  'Practical first',
  'Enquiry based',
];

export type TeacherSort = 'Sort: Productivity' | 'Sort: Engagement' | 'Sort: Workload';

/** All Teachers dialog — sort control. */
export const teacherSorts: TeacherSort[] = [
  'Sort: Productivity',
  'Sort: Engagement',
  'Sort: Workload',
];

/** The engagement bar doubles as the table's Engagement column. */
export const engagementOf = (teacher: ProductivityTeacher) =>
  teacher.facets.find((facet) => facet.label === 'Engagement')?.value ?? 0;

/** Workload is the sort key behind "Sort: Workload". */
export const workloadOf = (teacher: ProductivityTeacher) =>
  teacher.facets.find((facet) => facet.label === 'Workload')?.value ?? 0;
