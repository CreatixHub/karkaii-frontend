import { useCallback, useMemo, useState } from 'react';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink,
  ReportPageHeader,
  ReportWorkspaceShell,
  useWorkspace,
} from '@components/workspace';
import type {
  ColumnDef,
  FilterField,
  QuickFilter,
  ReportBulkAction,
  ReportScope,
  SavedView,
  SortOption,
  SummaryStripItem,
  WorkspaceMenu,
} from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import GradeModals from './modals/GradeModals';
import type { GradeModalId } from './modals/GradeModals';
import type { GradeEntry, PerformanceLevel, ResultStatus } from './data/grades.data';
import {
  ACADEMIC_YEAR,
  academicYearOptions,
  ATTENDANCE_POLICY,
  bestPaperOf,
  breakdownOf,
  classLabelOf,
  classOptions,
  EXAM,
  EXAM_REF,
  examOptions,
  gpaBandOf,
  gpaBandOptions,
  gpaChangeOf,
  gradeEntries as seededEntries,
  gradeOf,
  gradeOptions,
  gradeTint,
  growthOf,
  isBelowPass,
  isDistinction,
  levelOf,
  levelOptions,
  levelPill,
  marksOf,
  movedGradeOf,
  nameBadgeOf,
  overallGradeOf,
  overallPctOf,
  PASS_MARK,
  rankMovementOf,
  rankNoteOf,
  REGISTER_TOTAL,
  SCALE_NAME,
  scaleOptions,
  searchIndexOf,
  sectionOptions,
  spreadLabelOf,
  statusOf,
  statusOptions,
  subjectOptions,
  subjectsAtPassOf,
  teacherOptions,
} from './data/grades.data';

const routes = all_routes;

/** Band 1's scope group, which narrows the register by what the row grades. */
const scopes: ReportScope[] = [
  { id: 'all', label: 'All', icon: 'ti ti-layout-list' },
  { id: 'student', label: 'Student', icon: 'ti ti-user' },
  { id: 'class', label: 'Class', icon: 'ti ti-users' },
  { id: 'subject', label: 'Subject', icon: 'ti ti-book' },
  { id: 'exam', label: 'Exam', icon: 'ti ti-file-certificate' },
];

/**
 * The scope group narrows by what kind of paper the row grades.
 *
 * The template renders five inert radios; here Student shows the sheets where
 * the graded paper is the student's own best, Class the core papers a whole
 * section sits, Subject the electives and second languages, and Exam everything
 * already published.
 */
const matchesScope = (row: GradeEntry, scope: string) => {
  switch (scope) {
    case 'student':
      return bestPaperOf(row).subject === row.subject;
    case 'class':
      return row.subjectKind === 'Core subject';
    case 'subject':
      return row.subjectKind !== 'Core subject';
    case 'exam':
      return statusOf(row) === 'Published';
    default:
      return true;
  }
};

const filterFields: FilterField[] = [
  {
    id: 'academic-year',
    label: 'Academic Year',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Year',
    options: academicYearOptions,
    defaultValue: '',
    initialValue: ACADEMIC_YEAR,
  },
  {
    id: 'exam',
    label: 'Exam / Term',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Exam',
    options: examOptions,
    defaultValue: '',
    initialValue: EXAM,
  },
  {
    id: 'scale',
    label: 'Grade Scale',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Scale',
    options: scaleOptions,
    defaultValue: '',
    initialValue: SCALE_NAME,
  },
  { id: 'grade', label: 'Grade Range', kind: 'select', surface: 'band', chipLabel: 'Grade', allLabel: 'All Grades', options: gradeOptions },
  { id: 'class', label: 'Class', kind: 'select', surface: 'band', chipLabel: 'Class', allLabel: 'All Classes', options: classOptions },
  { id: 'section', label: 'Section', kind: 'select', surface: 'band', chipLabel: 'Section', allLabel: 'All Sections', options: sectionOptions },
  { id: 'subject', label: 'Subject', kind: 'select', surface: 'band', chipLabel: 'Subject', allLabel: 'All Subjects', options: subjectOptions },
  { id: 'teacher', label: 'Teacher', kind: 'select', surface: 'band', chipLabel: 'Teacher', allLabel: 'All Teachers', options: teacherOptions },
  {
    id: 'result-status',
    label: 'Result Status',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Status',
    allLabel: 'All Status',
    options: statusOptions,
  },

  { id: 'level', label: 'Performance Level', kind: 'select', chipLabel: 'Level', options: levelOptions },
  { id: 'gpa-band', label: 'GPA Band', kind: 'select', chipLabel: 'GPA', options: gpaBandOptions },
  { id: 'marks-from', label: 'Marks From', kind: 'number', chipLabel: 'Marks ≥', defaultValue: '0' },
  { id: 'marks-to', label: 'Marks To', kind: 'number', chipLabel: 'Marks ≤', defaultValue: '100' },
  { id: 'rank-from', label: 'Rank From', kind: 'number', chipLabel: 'Rank ≥', defaultValue: '1' },
  { id: 'rank-to', label: 'Rank To', kind: 'number', chipLabel: 'Rank ≤', defaultValue: '50' },
  {
    id: 'moved-grade',
    label: 'Movement',
    kind: 'toggle',
    chipLabel: 'Moved',
    switchLabel: 'Only entries that moved a grade since the last exam',
  },
];

const sortOptions: SortOption[] = [
  { id: 'rank', label: 'Rank', icon: 'ti ti-trophy' },
  { id: 'student', label: 'Student (A–Z)', icon: 'ti ti-abc' },
  { id: 'marks', label: 'Marks', icon: 'ti ti-percentage' },
  { id: 'grade', label: 'Grade', icon: 'ti ti-award' },
  { id: 'gpa', label: 'GPA', icon: 'ti ti-chart-dots' },
  { id: 'subject', label: 'Subject', icon: 'ti ti-book' },
];

const rails: { id: string; label: string; icon: string }[] = [
  { id: 'distinction', label: 'Distinction', icon: 'ti ti-medal' },
  { id: 'Published', label: 'Published', icon: 'ti ti-circle-check' },
  { id: 'Pending Review', label: 'Pending Review', icon: 'ti ti-eye-check' },
  { id: 'below-pass', label: 'Below Pass', icon: 'ti ti-alert-triangle' },
  { id: 'support', label: 'Needs Support', icon: 'ti ti-lifebuoy' },
];

function matchesRail(row: GradeEntry, rail: string | null): boolean {
  if (!rail) return true;
  if (rail === 'distinction') return isDistinction(row);
  if (rail === 'below-pass') return isBelowPass(row);
  if (rail === 'support') return levelOf(row) === 'Needs Support';
  if (rail === 'improved') return growthOf(row) > 0;
  return statusOf(row) === (rail as ResultStatus);
}

const GradeReports = () => {
  const [rows, setRows] = useState<GradeEntry[]>(seededEntries);
  const [scope, setScope] = useState('all');
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<GradeModalId | null>(null);
  const [modalRow, setModalRow] = useState<GradeEntry | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: GradeEntry | null, modal: GradeModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const openPanel = useCallback((row: GradeEntry | null) => {
    setModalRow(row);
    setPanelOpen(true);
  }, []);

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<GradeEntry>[]>(
    () => [
      {
        id: 'student',
        label: 'Student',
        sortable: true,
        toggleable: false,
        render: (row) => {
          const badge = nameBadgeOf(row);
          return (
            <div className="dt-user">
              <ActionLink className="dt-avatar" ariaLabel={`View ${row.student}`} onClick={() => openModal(row, 'view')}>
                <ImageWithBasePath src={row.image} alt={row.student} />
              </ActionLink>
              <div>
                <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>
                  {row.student}
                </ActionLink>
                <div className="dt-sub flex-nowrap text-nowrap">
                  <span>{row.roll}</span>
                  <span className="dt-dot">•</span>
                  <span>{row.classTeacher}</span>
                </div>
                {badge ? (
                  <span className={`badge badge-soft-${badge.tint} mt-1`}>{badge.label}</span>
                ) : null}
              </div>
            </div>
          );
        },
      },
      {
        id: 'admission',
        label: 'Admission No.',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.admission}</span>
            <span className="fs-12 text-muted">{row.admitted}</span>
          </>
        ),
      },
      {
        id: 'class',
        label: 'Class',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.className}</span>
            <span className="fs-12 text-muted">
              Section {row.section} · {row.sectionStrength} students
            </span>
          </>
        ),
      },
      {
        id: 'subject',
        label: 'Subject',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.subject}</span>
            <span className="fs-12 text-muted">{row.subjectKind}</span>
          </>
        ),
      },
      {
        id: 'exam',
        label: 'Exam / Term',
        cellClassName: 'text-nowrap',
        render: () => (
          <>
            <span className="fs-13 fw-medium d-block">{EXAM}</span>
            <span className="fs-12 text-muted">{EXAM_REF}</span>
          </>
        ),
      },
      {
        id: 'marks',
        label: 'Marks',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-semibold d-block">{marksOf(row)} of 100</span>
            <span className="fs-12 text-muted">{marksOf(row).toFixed(1)}%</span>
          </>
        ),
      },
      {
        id: 'grade',
        label: 'Grade',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => {
          const grade = gradeOf(marksOf(row));
          return (
            <>
              <span className={`badge badge-soft-${gradeTint(grade.grade)}`}>{grade.grade}</span>
              <span className="fs-12 text-muted d-block mt-1">{grade.remark}</span>
            </>
          );
        },
      },
      {
        id: 'gpa',
        label: 'GPA',
        sortable: true,
        align: 'center',
        render: (row) => (
          <>
            <span className="fs-13 fw-semibold d-block">{row.gpa.toFixed(1)}</span>
            <span className={`fs-12 text-${gpaChangeOf(row) >= 0 ? 'success' : 'danger'}`}>
              {gpaChangeOf(row) > 0 ? '+' : ''}
              {gpaChangeOf(row)}
            </span>
          </>
        ),
      },
      {
        id: 'rank',
        label: 'Rank',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => {
          const movement = rankMovementOf(row);
          return (
            <>
              <span className="fs-13 fw-semibold d-block">
                {row.rank} of {row.sectionStrength}
              </span>
              <span className="fs-12 text-muted d-block">{rankNoteOf(row)}</span>
              <span className={`badge badge-soft-${movement.tint} mt-1`}>
                <i className={`${movement.icon} me-1`} />
                {movement.label}
              </span>
            </>
          );
        },
      },
      {
        id: 'level',
        label: 'Performance Level',
        render: (row) => (
          <>
            <span className={`dt-pill ${levelPill[levelOf(row)]}`}>
              <span className="dt-pill-dot" />
              {levelOf(row)}
            </span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{rankNoteOf(row)}</span>
          </>
        ),
      },
      {
        id: 'status',
        label: 'Status',
        render: (row) => (
          <>
            <span className={`badge badge-soft-${statusOf(row) === 'Published' ? 'success' : statusOf(row) === 'Withheld' ? 'danger' : 'warning'}`}>
              {statusOf(row)}
            </span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{row.statusNote}</span>
          </>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<GradeEntry>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.grade && gradeOf(marksOf(row)).grade !== filters.grade) return false;
      if (filters.class && row.className !== filters.class) return false;
      if (filters.section && row.section !== filters.section) return false;
      if (filters.subject && row.subject !== filters.subject) return false;
      if (filters.teacher && row.classTeacher !== filters.teacher) return false;
      if (filters['result-status'] && statusOf(row) !== filters['result-status']) return false;
      if (filters.level && levelOf(row) !== (filters.level as PerformanceLevel)) return false;
      if (filters['gpa-band'] && gpaBandOf(row) !== filters['gpa-band']) return false;
      if (filters['moved-grade'] && !movedGradeOf(row)) return false;

      const marks = marksOf(row);
      if (marks < Number(filters['marks-from'] || 0)) return false;
      if (marks > Number(filters['marks-to'] || 100)) return false;
      if (row.rank < Number(filters['rank-from'] || 1)) return false;
      if (row.rank > Number(filters['rank-to'] || 999)) return false;

      return matchesScope(row, scope);
    },
    quickMatch: (row, quick) => matchesRail(row, quick),
    viewMatch: (row, view) => matchesRail(row, view === 'all' ? null : view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'student':
          return a.student.localeCompare(b.student);
        case 'marks':
          return marksOf(b) - marksOf(a) || a.student.localeCompare(b.student);
        case 'grade':
          return gradeOf(marksOf(b)).point - gradeOf(marksOf(a)).point || marksOf(b) - marksOf(a);
        case 'gpa':
          return b.gpa - a.gpa || a.student.localeCompare(b.student);
        case 'subject':
          return a.subject.localeCompare(b.subject) || a.student.localeCompare(b.student);
        case 'rank':
        default:
          return a.rank - b.rank || a.student.localeCompare(b.student);
      }
    },
    defaultSort: 'rank',
    pageSize: 8,
  });

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Results', icon: 'ti ti-layout-list', count: rows.length },
      ...rails.map((rail) => ({ ...rail, count: rows.filter((row) => matchesRail(row, rail.id)).length })),
    ],
    [rows],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () =>
      [
        { id: 'all', label: 'All', icon: 'ti ti-layout-list' },
        ...rails,
        { id: 'improved', label: 'Improved', icon: 'ti ti-trending-up' },
      ].map((rail) => ({
        ...rail,
        count: rows.filter((row) => matchesRail(row, rail.id === 'all' ? null : rail.id)).length,
      })),
    [rows],
  );

  /* ------------------------------ Summary strip ------------------------------ */

  const summary = useMemo<SummaryStripItem[]>(() => {
    const shown = workspace.visible;
    const avgGpa =
      shown.length === 0
        ? null
        : Math.round((shown.reduce((total, row) => total + row.gpa, 0) / shown.length) * 100) / 100;
    const passPct =
      shown.length === 0
        ? null
        : Math.round((shown.filter((row) => !isBelowPass(row)).length / shown.length) * 1000) / 10;
    const improvement =
      shown.length === 0
        ? null
        : Math.round((shown.reduce((total, row) => total + growthOf(row), 0) / shown.length) * 10) / 10;
    /* Highest and lowest grade in the report, read off the graded papers. */
    const sortedPoints = shown.map((row) => gradeOf(marksOf(row))).sort((a, b) => b.point - a.point);

    return [
      { id: 'total', accent: 'primary', icon: 'ti ti-users', value: `${shown.length}`, label: 'Students Evaluated' },
      { id: 'gpa', accent: 'info', icon: 'ti ti-chart-dots', value: avgGpa === null ? '—' : `${avgGpa}`, label: 'Average GPA' },
      {
        id: 'pass',
        accent: 'success',
        icon: 'ti ti-circle-check',
        value: passPct === null ? '—' : `${passPct}%`,
        label: 'Pass Percentage',
      },
      {
        id: 'distinction',
        accent: 'teal',
        icon: 'ti ti-medal',
        value: `${shown.filter(isDistinction).length}`,
        label: 'Distinction',
      },
      {
        id: 'highest',
        accent: 'purple',
        icon: 'ti ti-arrow-up-circle',
        value: sortedPoints[0]?.grade ?? '—',
        label: 'Highest Grade',
      },
      {
        id: 'lowest',
        accent: 'slate',
        icon: 'ti ti-arrow-down-circle',
        value: sortedPoints[sortedPoints.length - 1]?.grade ?? '—',
        label: 'Lowest Grade',
      },
      {
        id: 'improvement',
        accent: 'warning',
        icon: 'ti ti-trending-up',
        value: improvement === null ? '—' : `${improvement > 0 ? '+' : ''}${improvement}%`,
        label: 'Grade Improvement',
      },
      {
        id: 'support',
        accent: 'danger',
        icon: 'ti ti-lifebuoy',
        value: `${shown.filter((row) => levelOf(row) === 'Needs Support').length}`,
        label: 'Requiring Support',
      },
    ];
  }, [workspace.visible]);

  /* -------------------------------- Mutations -------------------------------- */

  /** Publishing stamps a date; the status is a reading of the record. */
  const publish = useCallback(
    (ids: string[]) => {
      setRows((current) =>
        current.map((row) =>
          ids.includes(row.id) && row.attendancePct >= ATTENDANCE_POLICY
            ? { ...row, submitted: true, publishedOn: '31 Jul 2026', statusNote: '31 Jul 2026' }
            : row,
        ),
      );
      workspace.clearSelection();
    },
    [workspace],
  );

  const bulkActions = useMemo<ReportBulkAction[]>(
    () => [
      { id: 'pdf', label: 'Bulk Export PDF', icon: 'ti ti-file-type-pdf', onClick: () => openModal(null, 'export') },
      { id: 'xls', label: 'Bulk Export Excel', icon: 'ti ti-file-type-xls', onClick: () => openModal(null, 'export') },
      { id: 'publish', label: 'Publish', icon: 'ti ti-send', onClick: () => openModal(null, 'publish') },
      { id: 'print', label: 'Print', icon: 'ti ti-printer', onClick: () => openModal(null, 'print') },
      { id: 'share', label: 'Share', icon: 'ti ti-share', onClick: () => openModal(null, 'share') },
    ],
    [openModal],
  );

  /* --------------------------------- Detail ---------------------------------- */

  const renderDetail = (row: GradeEntry) => (
    <div className="row g-4">
      <div className="col-xl-3 col-md-6">
        <h3 className="fs-14 mb-3 fw-medium">
          <i className="ti ti-user text-primary me-1" />
          Student Academic Profile
        </h3>
        <ul className="list-unstyled fs-12 mb-3">
          {[
            { label: 'Admission No.', value: row.admission },
            { label: 'Class / Section', value: `${classLabelOf(row)} · ${row.roll}` },
            { label: 'Class Teacher', value: row.classTeacher },
            { label: 'Scheme', value: row.scheme },
            { label: 'Overall Percentage', value: `${overallPctOf(row)}%` },
            { label: 'Attendance', value: `${row.attendancePct}%` },
          ].map((item) => (
            <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
              <span className="text-muted">{item.label}</span>
              <span className="fw-medium">{item.value}</span>
            </li>
          ))}
        </ul>

        <h6 className="details-heading">
          <i className="ti ti-list-numbers" />
          Subject-wise Grades
        </h6>
        <ul className="list-unstyled fs-12 mb-0">
          {row.subjects.map((subject) => {
            const grade = gradeOf(subject.marks);
            return (
              <li className="d-flex align-items-center justify-content-between py-1" key={subject.subject}>
                <span className="text-muted">{subject.subject}</span>
                <span className="fw-medium">
                  {subject.marks}
                  <span className={`badge badge-soft-${gradeTint(grade.grade)} ms-2`}>{grade.grade}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="col-xl-3 col-md-6">
        <h6 className="details-heading">
          <i className="ti ti-chart-dots" />
          GPA History
        </h6>
        <ul className="list-unstyled fs-12 mb-3">
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Current GPA</span>
            <span className="fw-medium">{row.gpa.toFixed(1)}</span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Previous GPA</span>
            <span className="fw-medium">
              {row.previousGpa.toFixed(1)} · Unit Test 1
            </span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Change</span>
            <span className={`fw-medium text-${gpaChangeOf(row) >= 0 ? 'success' : 'danger'}`}>
              {gpaChangeOf(row) > 0 ? '+' : ''}
              {gpaChangeOf(row)}
            </span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Cumulative GPA</span>
            <span className="fw-medium">
              {row.cumulativeGpa.toFixed(1)} across {row.cumulativeExams} exams
            </span>
          </li>
        </ul>

        <h6 className="details-heading">
          <i className="ti ti-award" />
          Grade Distribution
        </h6>
        <ul className="list-unstyled fs-12 mb-0">
          {breakdownOf(row).map((item) => (
            <li className="d-flex align-items-center justify-content-between py-1" key={item.grade}>
              <span className={`badge badge-soft-${gradeTint(item.grade)}`}>{item.grade}</span>
              <span className="text-muted">
                {item.count} {item.count === 1 ? 'subject' : 'subjects'}
              </span>
            </li>
          ))}
          <li className="d-flex align-items-center justify-content-between py-1 border-top mt-1 pt-2">
            <span className="text-muted">Overall Grade</span>
            <span className="fw-medium">{overallGradeOf(row).grade}</span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Subjects At Pass Mark</span>
            <span className="fw-medium">
              {subjectsAtPassOf(row)} of {row.subjects.length} · {PASS_MARK}% of the paper
            </span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Above Section Mean</span>
            <span className="fw-medium">
              {row.aboveSectionMean} of {row.subjects.length} subjects
            </span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Spread</span>
            <span className="fw-medium">{spreadLabelOf(row)}</span>
          </li>
        </ul>
      </div>

      <div className="col-xl-3 col-md-6">
        <h6 className="details-heading">
          <i className="ti ti-trophy" />
          Rank History
        </h6>
        <ul className="list-unstyled fs-12 mb-3">
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Rank</span>
            <span className="fw-medium">
              {row.rank} of {row.sectionStrength}
            </span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Unit Test 1</span>
            <span className="fw-medium">
              {row.previousRank} of {row.sectionStrength}
            </span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Movement</span>
            <span className={`badge badge-soft-${rankMovementOf(row).tint}`}>
              <i className={`${rankMovementOf(row).icon} me-1`} />
              {rankMovementOf(row).label}
            </span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Grade Rank</span>
            <span className="fw-medium">
              {row.gradeRank} of {row.gradeRankOf}
            </span>
          </li>
        </ul>

        <h6 className="details-heading">
          <i className="ti ti-arrows-diff" />
          Exam Comparison
        </h6>
        <ul className="list-unstyled fs-12 mb-3">
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Unit Test 1</span>
            <span className="fw-medium">
              {row.previousPct}% · {gradeOf(Math.round(row.previousPct)).grade}
            </span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">{EXAM}</span>
            <span className="fw-medium">
              {overallPctOf(row)}% · {overallGradeOf(row).grade}
            </span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Unit Test 2</span>
            <span className="fw-medium text-muted">Awaiting marks</span>
          </li>
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Change</span>
            <span className="fw-medium">
              {growthOf(row) === 0
                ? 'No change'
                : `${growthOf(row) > 0 ? 'Up' : 'Down'} ${Math.abs(growthOf(row))} points`}
              {movedGradeOf(row) ? <span className="text-muted ms-1">· moved a band</span> : null}
            </span>
          </li>
        </ul>

        <h6 className="details-heading">
          <i className="ti ti-sparkles" />
          Strengths &amp; Improvement Areas
        </h6>
        <span className="fs-12 text-muted d-block mb-1">Strengths</span>
        <div className="d-flex flex-wrap gap-1 mb-2">
          {row.strengths.map((item) => (
            <span className="badge badge-soft-success" key={item}>
              {item}
            </span>
          ))}
        </div>
        <span className="fs-12 text-muted d-block mb-1">Improvement areas</span>
        <div className="d-flex flex-wrap gap-1 mb-0">
          {row.improvements.map((item) => (
            <span className="badge badge-soft-warning" key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="col-xl-3 col-md-6">
        <h6 className="details-heading">
          <i className="ti ti-message-2" />
          Teacher Remarks
        </h6>
        {row.remarks.map((remark) => (
          <div className="border rounded p-2 mb-2" key={`${remark.author}-${remark.date}-${remark.role}`}>
            <h6 className="fs-13 mb-0 fw-medium">{remark.author}</h6>
            <span className="fs-12 text-muted d-block">
              {remark.role} · {remark.date}
            </span>
            <p className="fs-12 text-muted mb-0 mt-1">{remark.body}</p>
          </div>
        ))}

        <h6 className="details-heading">
          <i className="ti ti-award" />
          Academic Awards
        </h6>
        {row.awards.map((award) => (
          <div className="border rounded p-2 mb-2" key={award.title}>
            <h6 className="fs-13 mb-0 fw-medium">{award.title}</h6>
            <span className="fs-12 text-muted">{award.detail}</span>
          </div>
        ))}
        <ul className="list-unstyled fs-12 mb-3">
          {row.awardsNote.map((note) => (
            <li className="d-flex align-items-center justify-content-between py-1" key={note.title}>
              <span className="text-muted">{note.title}</span>
              <span className="fw-medium">{note.detail}</span>
            </li>
          ))}
        </ul>

        <h6 className="details-heading">
          <i className="ti ti-users-group" />
          Parent Meeting History
        </h6>
        {row.meetings.map((meeting) => (
          <div className="border rounded p-2 mb-2" key={meeting.title}>
            <h6 className="fs-13 mb-0 fw-medium">{meeting.title}</h6>
            <span className="fs-12 text-muted">{meeting.detail}</span>
          </div>
        ))}
        <ul className="list-unstyled fs-12 mb-3">
          <li className="d-flex align-items-center justify-content-between py-1">
            <span className="text-muted">Next Meeting</span>
            <span className="fw-medium">{row.nextMeeting}</span>
          </li>
        </ul>

        <h6 className="details-heading">
          <i className="ti ti-history" />
          Audit History
        </h6>
        {row.audit.map((entry) => (
          <div className="border rounded p-2 mb-2" key={entry.title}>
            <h6 className="fs-13 mb-0 fw-medium">{entry.title}</h6>
            <span className="fs-12 text-muted">{entry.detail}</span>
          </div>
        ))}

        <div className="d-flex gap-2 mt-3">
          {statusOf(row) === 'Draft' || statusOf(row) === 'Pending Review' ? (
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-sm flex-fill"
              onClick={() => openModal(row, 'publish')}
            >
              <i className="ti ti-send me-1" />
              Publish Result
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-sm flex-fill"
              onClick={() => openModal(row, 'view')}
            >
              <i className="ti ti-file-text me-1" />
              Academic Record
            </button>
          )}
          <button type="button" className="btn btn-primary btn-sm flex-fill" onClick={() => openPanel(row)}>
            <i className="ti ti-chart-histogram me-1" />
            Analysis
          </button>
        </div>
      </div>
    </div>
  );

  const rowActions = (row: GradeEntry) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Record" ariaLabel="View Record" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Publish" ariaLabel="Publish" onClick={() => openModal(row, 'publish')}>
        <i className="ti ti-send" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Compare" ariaLabel="Compare" onClick={() => openModal(row, 'compare')}>
        <i className="ti ti-arrows-diff" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Export" ariaLabel="Export" onClick={() => openModal(row, 'export')}>
        <i className="ti ti-download" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Print" ariaLabel="Print" onClick={() => openModal(row, 'print')}>
        <i className="ti ti-printer" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Share" ariaLabel="Share" onClick={() => openModal(row, 'share')}>
        <i className="ti ti-share" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Analysis" ariaLabel="Analysis" onClick={() => openPanel(row)}>
        <i className="ti ti-chart-histogram" />
      </ActionLink>
    </div>
  );

  const filterSummary = [
    workspace.filters.exam || 'all exams',
    workspace.filters['academic-year'] || ACADEMIC_YEAR,
    workspace.filters.scale || SCALE_NAME,
    workspace.filters.class || 'all classes',
  ].join(' · ');

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <ReportPageHeader
            title="Grade Reports"
            section="Reports"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'scale')}
                  >
                    <i className="ti ti-list-numbers me-2" />
                    Grade Scale
                  </ActionLink>
                </div>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'compare')}
                  >
                    <i className="ti ti-arrows-diff me-2" />
                    Compare Reports
                  </ActionLink>
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openPanel(null)}
                  >
                    <i className="ti ti-chart-histogram me-2" />
                    Analysis
                  </ActionLink>
                </div>
              </>
            }
          />

          <ReportWorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={rows.length}
            workspaceId="gradeReport"
            scopeLabel="Report on:"
            scopeAriaLabel="Report scope"
            scopes={scopes}
            scope={scope}
            onScope={setScope}
            scopeCount={`${REGISTER_TOTAL.toLocaleString()} entries`}
            bandActions={
              <>
                <ActionLink
                  className="btn btn-sm btn-primary d-inline-flex align-items-center"
                  onClick={() => openModal(null, 'generate')}
                >
                  <i className="ti ti-player-play me-1" />
                  Generate Report
                </ActionLink>
                <ActionLink
                  className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                  onClick={() => openModal(null, 'template')}
                >
                  <i className="ti ti-bookmark-plus me-1" />
                  Save Template
                </ActionLink>
                <ActionLink className="btn btn-sm btn-outline-light bg-white btn-icon" title="Export PDF" ariaLabel="Export PDF" onClick={() => openModal(null, 'export')}>
                  <i className="ti ti-file-type-pdf" />
                </ActionLink>
                <ActionLink className="btn btn-sm btn-outline-light bg-white btn-icon" title="Export Excel" ariaLabel="Export Excel" onClick={() => openModal(null, 'export')}>
                  <i className="ti ti-file-type-xls" />
                </ActionLink>
                <ActionLink className="btn btn-sm btn-outline-light bg-white btn-icon" title="Print" ariaLabel="Print" onClick={() => openModal(null, 'print')}>
                  <i className="ti ti-printer" />
                </ActionLink>
                <ActionLink className="btn btn-sm btn-outline-light bg-white btn-icon" title="Share" ariaLabel="Share" onClick={() => openModal(null, 'share')}>
                  <i className="ti ti-share" />
                </ActionLink>
              </>
            }
            searchLabel="Search entries"
            searchPlaceholder="Student, admission no., class or subject"
            filterSummary={filterSummary}
            filterFields={filterFields}
            savedViews={savedViews}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="entries"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            summary={summary}
            bulkActions={bulkActions}
            selectionNoun="entry"
            caption="Grade report with marks, grade, GPA, rank and performance level for each student and subject"
            selectAllLabel="Select all entries"
            renderDetail={renderDetail}
            renderActions={rowActions}
            footerInfoSuffix={`${EXAM} · academic year ${ACADEMIC_YEAR}`}
            emptyIcon="ti ti-award-off"
            emptyTitle="No entries match this view"
            emptyBody="Clear a filter, widen the mark range or switch the report scope to see more."
            onRefresh={() => {
              setRows(seededEntries);
              push('Grades refreshed');
            }}
            onSaveView={() => openModal(null, 'template')}
            onToast={push}
            onResetExtra={() => setScope('all')}
          />
        </div>
      </div>
      {/* /Page Wrapper */}

      <GradeModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        row={modalRow}
        rows={workspace.visible}
        selected={rows.filter((row) => workspace.selected.includes(row.id))}
        registerTotal={REGISTER_TOTAL}
        panelOpen={panelOpen}
        onClosePanel={() => setPanelOpen(false)}
        onToast={push}
        onPublish={publish}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="gradeReportToasts" />
    </>
  );
};

export default GradeReports;
