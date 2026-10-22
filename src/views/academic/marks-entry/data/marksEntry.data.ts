/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type AttendanceState = 'Present' | 'Absent';

/**
 * The four pills the template prints in the Status column — Saved (L1666), Absent (L1738),
 * Missing (L1810) and Below Pass (L1918) — plus the two a live sheet needs: a row edited
 * since the last save, and a mark that is not a number in range.
 */
export type EntryStatusId = 'Saved' | 'Unsaved' | 'Missing' | 'Invalid' | 'Below Pass' | 'Absent';

export type MarksEntryModalId = 'details' | 'history' | 'remarks';

export interface HistoryExam {
  exam: string;
  marks: number;
  max: number;
  enteredOn: string;
}

export interface StudentRow {
  /** Roll number, e.g. "10A-021" — unique per sheet, so it doubles as the row key. */
  id: string;
  name: string;
  avatar: string;
  admissionNo: string;
  attendance: AttendanceState;
  /** Held as typed so a half-entered value survives a re-render. */
  marks: string;
  remarks: string;
  guardian: string;
  contact: string;
  /** Prior examinations for the Marks History dialog; the live sheet is appended there. */
  history: HistoryExam[];
  /** Lower-cased haystack for the toolbar search. */
  search: string;
}

/* -------------------------------------------------------------------------- */
/*                            Exam context selectors                          */
/* -------------------------------------------------------------------------- */

export interface ExamContext {
  year: string;
  examination: string;
  className: string;
  section: string;
  subject: string;
  teacher: string;
}

export type ExamContextKey = keyof ExamContext;

export interface SelectorField {
  key: ExamContextKey;
  label: string;
  /** Prefixed with the page slug — the template's bare ids collide once several pages share one SPA. */
  domId: string;
  options: string[];
}

/** The six selects of the sticky entry toolbar, `marks-entry.html` L1478–1524. */
export const selectorFields: SelectorField[] = [
  { key: 'year', label: 'Academic Year', domId: 'me-academic-year', options: ['2026 / 2027', '2025 / 2026'] },
  {
    key: 'examination',
    label: 'Examination',
    domId: 'me-examination',
    options: ['Half-Yearly Examination', 'Quarterly Examination', 'Annual Examination'],
  },
  { key: 'className', label: 'Class', domId: 'me-class', options: ['Grade 10', 'Grade 9', 'Grade 11'] },
  { key: 'section', label: 'Section', domId: 'me-section', options: ['Section A', 'Section B'] },
  { key: 'subject', label: 'Subject', domId: 'me-subject', options: ['Mathematics', 'Science', 'English Language'] },
  { key: 'teacher', label: 'Teacher', domId: 'me-teacher', options: ['Teresa Getto', 'Marcus Hill'] },
];

export const examContextDefaults: ExamContext = {
  year: '2026 / 2027',
  examination: 'Half-Yearly Examination',
  className: 'Grade 10',
  section: 'Section A',
  subject: 'Mathematics',
  teacher: 'Teresa Getto',
};

/** Changing any of these reloads the roster; year and teacher only relabel the sheet. */
export const rosterKeys: ExamContextKey[] = ['examination', 'className', 'section', 'subject'];

/** The paper itself — Exam Selection Panel L1564–1579 and Exam Information L1603–1605. */
export const examPaper = {
  maxMarks: 100,
  passMarks: 33,
  markingType: 'Numeric',
  gradingMethod: 'CBSE 8-Point',
};

/** "Half-Yearly Examination" prints as "Half-Yearly" in the selection panel (L1550). */
export const shortExamName = (examination: string) => examination.replace(/ Examination$/, '');

/** "Section A" prints as "A" in the dialogs' "Grade 10 · A" line (L2080). */
export const shortSection = (section: string) => section.replace(/^Section /, '');

/* -------------------------------------------------------------------------- */
/*                                   Grading                                  */
/* -------------------------------------------------------------------------- */

export interface GradeBand {
  /** Inclusive lower bound, as a percentage of the maximum. */
  min: number;
  grade: string;
  badge: string;
}

/**
 * CBSE 8-point. The success / info tones on A1–A2 and B1–B2 are the template's own badge
 * classes; the lower bands continue the same ramp down to the danger tone it gives E.
 */
export const gradeScale: GradeBand[] = [
  { min: 91, grade: 'A1', badge: 'badge-soft-success' },
  { min: 81, grade: 'A2', badge: 'badge-soft-success' },
  { min: 71, grade: 'B1', badge: 'badge-soft-info' },
  { min: 61, grade: 'B2', badge: 'badge-soft-info' },
  { min: 51, grade: 'C1', badge: 'badge-soft-primary' },
  { min: 41, grade: 'C2', badge: 'badge-soft-primary' },
  { min: 33, grade: 'D', badge: 'badge-soft-warning' },
  { min: 0, grade: 'E', badge: 'badge-soft-danger' },
];

/** The template's absent row shows "AB" and a blank row shows an em dash (L1736, L1808). */
export const ABSENT_GRADE: GradeBand = { min: 0, grade: 'AB', badge: 'badge-soft-secondary' };
export const BLANK_GRADE: GradeBand = { min: 0, grade: '—', badge: 'badge-soft-secondary' };

export const gradeFor = (percent: number): GradeBand =>
  gradeScale.find((band) => percent >= band.min) ?? gradeScale[gradeScale.length - 1];

/* -------------------------------------------------------------------------- */
/*                                Status pills                                */
/* -------------------------------------------------------------------------- */

export interface StatusPill {
  label: string;
  badge: string;
  icon: string;
  /** Short form for the mobile card, which prints the pill without an icon (L1946). */
  short: string;
}

export const entryStatuses: Record<EntryStatusId, StatusPill> = {
  Saved: { label: 'Saved', badge: 'badge-soft-success', icon: 'ti ti-circle-check', short: 'Saved' },
  Unsaved: { label: 'Unsaved', badge: 'badge-soft-warning', icon: 'ti ti-circle-filled fs-5', short: 'Unsaved' },
  Missing: { label: 'Missing', badge: 'badge-soft-danger', icon: 'ti ti-alert-circle', short: 'Missing' },
  Invalid: { label: 'Invalid', badge: 'badge-soft-danger', icon: 'ti ti-alert-octagon', short: 'Invalid' },
  'Below Pass': {
    label: 'Below Pass',
    badge: 'badge-soft-danger',
    icon: 'ti ti-alert-triangle',
    short: 'Below Pass',
  },
  Absent: { label: 'Absent', badge: 'badge-soft-warning', icon: 'ti ti-user-off', short: 'Absent' },
};

/* -------------------------------------------------------------------------- */
/*                                  The roster                                */
/* -------------------------------------------------------------------------- */

const EXAM_TIMELINE: Omit<HistoryExam, 'marks'>[] = [
  { exam: 'Unit Test I', max: 25, enteredOn: '18 Apr 2026' },
  { exam: 'Quarterly Examination', max: 100, enteredOn: '28 Jul 2026' },
  { exam: 'Unit Test II', max: 25, enteredOn: '14 Sep 2026' },
  { exam: 'Monthly Test', max: 50, enteredOn: '22 Oct 2026' },
];

const student = (
  id: string,
  name: string,
  avatarNo: string,
  admissionNo: string,
  attendance: AttendanceState,
  marks: string,
  remarks: string,
  guardian: string,
  contact: string,
  priorMarks: number[],
): StudentRow => ({
  id,
  name,
  avatar: `assets/img/students/student-${avatarNo}.jpg`,
  admissionNo,
  attendance,
  marks,
  remarks,
  guardian,
  contact,
  history: EXAM_TIMELINE.map((exam, index) => ({ ...exam, marks: priorMarks[index] })),
  search: `${name} ${id} ${admissionNo}`.toLowerCase(),
});

/**
 * The eight rows of the desktop grid, in the order the template prints them. Guardian and
 * contact are only spelled out once in the template (the Student Details dialog, L2084–2085,
 * which hard-codes Aaron Cooper); the other seven follow the same shape. The prior-exam
 * marks likewise extend the one history the template ships (L2116–2119).
 */
export const studentRows: StudentRow[] = [
  student('10A-021', 'Aaron Cooper', '01', 'PRE748210', 'Present', '78', 'Good improvement', 'Daniel Cooper', '+1 806-555-0142', [21, 72, 19, 41]),
  student('10A-022', 'Bianca Reid', '02', 'PRE748214', 'Present', '91', 'Excellent', 'Marianne Reid', '+1 806-555-0158', [24, 89, 23, 47]),
  student('10A-023', 'Carlos Mendez', '03', 'PRE748219', 'Absent', '', 'Medical leave', 'Rosa Mendez', '+1 806-555-0163', [18, 61, 16, 34]),
  student('10A-024', 'Danielle Fox', '04', 'PRE748223', 'Present', '64', '', 'Gregory Fox', '+1 806-555-0177', [17, 66, 18, 33]),
  student('10A-025', 'Ethan Brooks', '05', 'PRE748227', 'Present', '', '', 'Patricia Brooks', '+1 806-555-0184', [15, 54, 14, 28]),
  student('10A-026', 'Farah Siddiqui', '06', 'PRE748231', 'Present', '88', 'Consistent performer', 'Imran Siddiqui', '+1 806-555-0196', [23, 85, 22, 45]),
  student('10A-027', 'George Nelson', '07', 'PRE748235', 'Absent', '', 'State sports meet', 'Warren Nelson', '+1 806-555-0208', [16, 58, 17, 31]),
  student('10A-028', 'Hannah Lopez', '08', 'PRE748239', 'Present', '29', 'Needs remedial support', 'Elena Lopez', '+1 806-555-0215', [9, 31, 11, 19]),
];

/** The template shows eight rows per page in its footer ("Showing 8 of 42 students", L2008). */
export const PAGE_SIZE = 8;

/* -------------------------------------------------------------------------- */
/*                              Row evaluation                                */
/* -------------------------------------------------------------------------- */

export interface RowEvaluation {
  /** What the marks input displays — an em dash while the student is marked absent. */
  value: string;
  numeric: number | null;
  percent: number | null;
  grade: GradeBand;
  status: EntryStatusId;
  /** Drives the template's `is-invalid` class on the marks input. */
  invalid: boolean;
  /** `null` while there is nothing to judge. */
  passed: boolean | null;
  disabled: boolean;
}

const NUMERIC = /^\d+(\.\d+)?$/;

/**
 * A row's whole derived state in one place, so the desktop grid, the mobile card, the
 * summary strips and the dialogs can never disagree about a mark.
 *
 * `dirty` is "edited since the last save"; it never overrides a failing or unusable mark,
 * which matches the template printing Below Pass rather than a save state on Hannah Lopez.
 */
export const evaluateRow = (
  row: StudentRow,
  maxMarks: number,
  passMarks: number,
  dirty: boolean,
  locked: boolean,
): RowEvaluation => {
  if (row.attendance === 'Absent') {
    return {
      value: '—',
      numeric: null,
      percent: null,
      grade: ABSENT_GRADE,
      status: 'Absent',
      invalid: false,
      passed: null,
      disabled: true,
    };
  }

  const typed = row.marks.trim();

  if (typed === '') {
    return {
      value: '',
      numeric: null,
      percent: null,
      grade: BLANK_GRADE,
      status: 'Missing',
      invalid: true,
      passed: null,
      disabled: locked,
    };
  }

  const numeric = Number(typed);
  if (!NUMERIC.test(typed) || Number.isNaN(numeric) || numeric > maxMarks) {
    return {
      value: typed,
      numeric: null,
      percent: null,
      grade: BLANK_GRADE,
      status: 'Invalid',
      invalid: true,
      passed: null,
      disabled: locked,
    };
  }

  const percent = Math.round((numeric / maxMarks) * 1000) / 10;
  const passed = numeric >= passMarks;

  return {
    value: typed,
    numeric,
    percent,
    grade: gradeFor(percent),
    status: passed ? (dirty ? 'Unsaved' : 'Saved') : 'Below Pass',
    invalid: false,
    passed,
    disabled: locked,
  };
};

/** Missing and Invalid are the two states that block publishing. */
export const isPending = (status: EntryStatusId) => status === 'Missing' || status === 'Invalid';

/* -------------------------------------------------------------------------- */
/*                              Menus and copy                                */
/* -------------------------------------------------------------------------- */

export interface RowMenuItem {
  id: string;
  label: string;
  icon: string;
  modal: MarksEntryModalId;
}

/** The three-item row dropdown, `marks-entry.html` L1670–1674. */
export const rowMenuItems: RowMenuItem[] = [
  { id: 'student_details', label: 'Student Details', icon: 'ti ti-user-circle', modal: 'details' },
  { id: 'marks_history', label: 'Marks History', icon: 'ti ti-history', modal: 'history' },
  { id: 'edit_remarks', label: 'Edit Remarks', icon: 'ti ti-message-2', modal: 'remarks' },
];

/** The Quick Remark select of the Edit Remarks dialog, L2149–2152. */
export const quickRemarks = [
  'Good improvement',
  'Consistent performer',
  'Needs remedial support',
  'Absent – medical leave',
];

export const actionToasts: Record<string, string> = {
  refresh: 'Marks sheet refreshed.',
  print: 'Sending the marks sheet to the printer…',
  save_draft: 'Draft saved — marks are not visible to parents yet.',
  publish: 'Marks published — the sheet is locked and parents have been notified.',
  reset: 'Marks sheet reset to the last published values.',
  remark: 'Remark saved.',
  locked: 'This sheet is published and locked. Reset it to make further changes.',
  already_saved: 'Nothing to save — there are no unsaved changes.',
};

/** The template pads its summary counts to two digits ("06", "02"). */
export const pad2 = (value: number) => String(value).padStart(2, '0');

export const strings = {
  publishBlocked: ' entr(ies) still need a mark. Complete them or mark the student absent first.',
  loading: 'Loading the roster for ',
  searchMatch: ' student(s) match this search.',
};
