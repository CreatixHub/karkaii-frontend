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
import PerformanceModals from './modals/PerformanceModals';
import type { PerformanceModalId } from './modals/PerformanceModals';
import type { AttendanceBand, PerformanceLevel, PlanState, StudentPerformance } from './data/performance.data';
import {
  ACADEMIC_YEAR,
  absentOf,
  academicYearOptions,
  atPassMarkOf,
  attendanceBandOf,
  attendancePctOf,
  bandOptions,
  bandTint,
  belowPassLabelOf,
  belowPassOf,
  belowPassOptions,
  bestPaperOf,
  breakdownOf,
  classLabelOf,
  classOptions,
  EXAM,
  EXAM_REF,
  EXAM_WINDOW,
  evaluatedLabel,
  examOptions,
  gradeOptions,
  gradeTint,
  growthLabelOf,
  growthOf,
  growthOptions,
  isCompleteOf,
  isTopPerformer,
  levelOf,
  levelOptions,
  levelPill,
  maximumOf,
  needsAttentionOf,
  obtainedOf,
  overallGradeOf,
  papersOf,
  PASS_MARK,
  periodsLostOf,
  planOptions,
  PREVIOUS_EXAM,
  rankBandOf,
  rankFilterOptions,
  rankMovementOf,
  REGISTER_TOTAL,
  scoreOf,
  searchIndexOf,
  sectionOptions,
  studentPerformances as seededStudents,
  subjectGradeOf,
  teacherOptions,
  trendOf,
  trendTint,
  weakestPaperOf,
  WORKING_DAYS,
} from './data/performance.data';

const routes = all_routes;

/**
 * Band 1's scope group. The template renders five inert radios above a grid
 * holding everything; each one narrows the register here, and an All choice is
 * added at the head so the page still opens on all eight students.
 */
const scopes: ReportScope[] = [
  { id: 'all', label: 'Overall', icon: 'ti ti-layout-list' },
  { id: 'subject', label: 'Subject', icon: 'ti ti-book' },
  { id: 'attendance', label: 'Attendance', icon: 'ti ti-calendar-check' },
  { id: 'growth', label: 'Growth', icon: 'ti ti-trending-up' },
  { id: 'risk', label: 'At Risk', icon: 'ti ti-alert-triangle' },
];

const matchesScope = (row: StudentPerformance, scope: string) => {
  switch (scope) {
    case 'subject':
      return belowPassOf(row) > 0 || (weakestPaperOf(row)?.marks ?? 100) < 60;
    case 'attendance':
      return attendanceBandOf(row) !== 'Regular';
    case 'growth':
      return trendOf(row) === 'Improving' || trendOf(row) === 'Declining';
    case 'risk':
      return ['Needs Improvement', 'At Risk', 'Under Review'].includes(levelOf(row));
    default:
      return true;
  }
};

const filterFields: FilterField[] = [
  {
    id: 'assessed-between',
    label: 'Assessed Between',
    kind: 'daterange',
    surface: 'band',
    span: 'col-xxl-3 col-lg-4 col-md-6',
    chipLabel: 'Assessed',
    rangeFormat: 'd M Y',
  },
  {
    id: 'academic-year',
    label: 'Academic Year',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Year',
    options: academicYearOptions,
    defaultValue: ACADEMIC_YEAR,
  },
  {
    id: 'exam',
    label: 'Exam / Term',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Exam',
    allLabel: 'All Exams',
    options: examOptions,
    initialValue: EXAM,
  },
  { id: 'class', label: 'Class', kind: 'select', surface: 'band', chipLabel: 'Class', allLabel: 'All Classes', options: classOptions },
  { id: 'section', label: 'Section', kind: 'select', surface: 'band', chipLabel: 'Section', allLabel: 'All Sections', options: sectionOptions },
  {
    id: 'level',
    label: 'Performance Level',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Level',
    allLabel: 'All Levels',
    options: levelOptions,
  },
  { id: 'grade', label: 'Grade', kind: 'select', surface: 'band', chipLabel: 'Grade', allLabel: 'All Grades', options: gradeOptions },
  {
    id: 'attendance-band',
    label: 'Attendance Band',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Band',
    allLabel: 'All Bands',
    options: bandOptions,
  },
  {
    id: 'plan',
    label: 'Improvement Plan',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Plan',
    options: planOptions,
  },

  { id: 'score-from', label: 'Score From', kind: 'number', chipLabel: 'Score ≥', defaultValue: '0' },
  { id: 'score-to', label: 'Score To', kind: 'number', chipLabel: 'Score ≤', defaultValue: '100' },
  { id: 'class-rank', label: 'Class Rank', kind: 'select', chipLabel: 'Rank', allLabel: 'Any', options: rankFilterOptions },
  {
    id: 'growth',
    label: `Growth Since ${PREVIOUS_EXAM}`,
    kind: 'select',
    chipLabel: 'Growth',
    allLabel: 'Any',
    options: growthOptions,
  },
  {
    id: 'below-pass',
    label: 'Subjects Below Pass',
    kind: 'select',
    chipLabel: 'Below pass',
    allLabel: 'Any',
    options: belowPassOptions,
  },
  { id: 'teacher', label: 'Class Teacher', kind: 'select', chipLabel: 'Teacher', allLabel: 'Anyone', options: teacherOptions },
  {
    id: 'needs-attention',
    label: 'Attention',
    kind: 'toggle',
    chipLabel: 'Attention',
    switchLabel: 'Only students needing academic attention',
  },
];

const sortOptions: SortOption[] = [
  { id: 'score', label: 'Overall score', icon: 'ti ti-percentage' },
  { id: 'name', label: 'Student (A–Z)', icon: 'ti ti-abc' },
  { id: 'rank', label: 'Class rank', icon: 'ti ti-trophy' },
  { id: 'attendance', label: 'Attendance', icon: 'ti ti-calendar-check' },
  { id: 'growth', label: `Growth since ${PREVIOUS_EXAM}`, icon: 'ti ti-trending-up' },
];

const rails: { id: string; label: string; icon: string }[] = [
  { id: 'Excellent', label: 'Excellent', icon: 'ti ti-medal' },
  { id: 'Good', label: 'Good', icon: 'ti ti-thumb-up' },
  { id: 'Average', label: 'Average', icon: 'ti ti-equal' },
  { id: 'Needs Improvement', label: 'Needs Improvement', icon: 'ti ti-alert-circle' },
  { id: 'At Risk', label: 'At Risk', icon: 'ti ti-alert-triangle' },
];

function matchesRail(row: StudentPerformance, rail: string | null): boolean {
  if (!rail) return true;
  if (rail === 'top') return isTopPerformer(row);
  if (rail === 'plans') return row.plan.state !== 'Not required';
  if (rail === 'attendance') return attendanceBandOf(row) !== 'Regular';
  return levelOf(row) === (rail as PerformanceLevel);
}

const StudentPerformancePage = () => {
  const [rows, setRows] = useState<StudentPerformance[]>(seededStudents);
  const [scope, setScope] = useState('all');
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<PerformanceModalId | null>(null);
  const [modalRow, setModalRow] = useState<StudentPerformance | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: StudentPerformance | null, modal: PerformanceModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const openPanel = useCallback((row: StudentPerformance) => {
    setModalRow(row);
    setPanelOpen(true);
  }, []);

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<StudentPerformance>[]>(
    () => [
      {
        id: 'student',
        label: 'Student',
        sortable: true,
        toggleable: false,
        render: (row) => (
          <div className="dt-user">
            <ActionLink className="dt-avatar" ariaLabel={`View ${row.name}`} onClick={() => openModal(row, 'view')}>
              <ImageWithBasePath src={row.image} alt={row.name} />
            </ActionLink>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>
                {row.name}
              </ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">
                <span>Roll {row.roll}</span>
                <span className="dt-dot">·</span>
                <span>{row.classTeacher}</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'admission',
        label: 'Admission No.',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.id}</span>
            <span className="fs-12 text-muted">Roll {row.roll}</span>
          </>
        ),
      },
      {
        id: 'class',
        label: 'Class',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{classLabelOf(row)}</span>
            <span className="fs-12 text-muted">
              {row.sectionStrength} students · {row.classTeacher}
            </span>
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
            <span className="fs-12 text-muted">
              {EXAM_REF} · {EXAM_WINDOW}
            </span>
          </>
        ),
      },
      {
        id: 'score',
        label: 'Overall Score',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-semibold d-block">{scoreOf(row)}%</span>
            <span className="fs-12 text-muted d-block">
              {isCompleteOf(row)
                ? `${obtainedOf(row)} of ${maximumOf(row)} marks`
                : `provisional, ${weakestPaperOf(row) ? '' : ''}${
                    row.subjects.find((subject) => subject.marks === null)?.subject
                  } not entered`}
            </span>
            {isCompleteOf(row) ? (
              <span className={`fs-12 text-${growthOf(row) >= 0 ? 'success' : 'danger'}`}>
                {growthOf(row) > 0 ? '+' : ''}
                {growthOf(row)} vs {PREVIOUS_EXAM}
              </span>
            ) : null}
          </>
        ),
      },
      {
        id: 'grade',
        label: 'Grade',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => {
          const grade = overallGradeOf(row);
          return grade ? (
            <>
              <span className={`badge badge-soft-${gradeTint(grade.grade)}`}>{grade.grade}</span>
              <span className="fs-12 text-muted d-block mt-1">{grade.remark}</span>
            </>
          ) : (
            <>
              <span className="fs-13 fw-semibold d-block">Withheld</span>
              <span className="fs-12 text-muted">a subject is still open</span>
            </>
          );
        },
      },
      {
        id: 'rank',
        label: 'Rank',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => {
          const movement = rankMovementOf(row);
          return row.rank === null ? (
            <>
              <span className="fs-13 fw-semibold d-block">—</span>
              <span className="fs-12 text-muted">
                {PREVIOUS_EXAM} was {row.previousRank}
              </span>
            </>
          ) : (
            <>
              <span className="fs-13 fw-semibold d-block">
                {row.rank} of {row.sectionStrength}
              </span>
              <span className="fs-12 text-muted d-block">{classLabelOf(row)}</span>
              {movement ? (
                <span className={`badge badge-soft-${movement.tint} mt-1`}>
                  <i className={`${movement.icon} me-1`} />
                  {movement.label}
                </span>
              ) : null}
            </>
          );
        },
      },
      {
        id: 'attendance',
        label: 'Attendance %',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-semibold d-block">{attendancePctOf(row)}%</span>
            <span className="fs-12 text-muted d-block">
              {row.present} of {WORKING_DAYS} days
            </span>
            <span className={`badge badge-soft-${bandTint[attendanceBandOf(row)]} mt-1`}>
              {attendanceBandOf(row)}
            </span>
          </>
        ),
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
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">
              {isCompleteOf(row)
                ? `${trendOf(row)} · ${evaluatedLabel(row)}`
                : `${papersOf(row)} of ${row.subjects.length} subjects in`}
            </span>
          </>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<StudentPerformance>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.class && row.className !== filters.class) return false;
      if (filters.section && row.section !== filters.section) return false;
      if (filters.level && levelOf(row) !== filters.level) return false;
      if (filters.grade && overallGradeOf(row)?.grade !== filters.grade) return false;
      if (filters['attendance-band'] && attendanceBandOf(row) !== (filters['attendance-band'] as AttendanceBand))
        return false;
      if (filters.plan && row.plan.state !== (filters.plan as PlanState)) return false;
      if (filters['class-rank'] && rankBandOf(row) !== filters['class-rank']) return false;
      if (filters.growth && growthLabelOf(row) !== filters.growth) return false;
      if (filters['below-pass'] && belowPassLabelOf(row) !== filters['below-pass']) return false;
      if (filters.teacher && row.classTeacher !== filters.teacher) return false;
      if (filters['needs-attention'] && !needsAttentionOf(row)) return false;

      const score = scoreOf(row);
      if (score < Number(filters['score-from'] || 0)) return false;
      if (score > Number(filters['score-to'] || 100)) return false;

      return matchesScope(row, scope);
    },
    quickMatch: (row, quick) => matchesRail(row, quick),
    viewMatch: (row, view) => matchesRail(row, view === 'all' ? null : view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rank':
          return (a.rank ?? 999) - (b.rank ?? 999) || a.name.localeCompare(b.name);
        case 'attendance':
          return attendancePctOf(b) - attendancePctOf(a) || a.name.localeCompare(b.name);
        case 'growth':
          return growthOf(b) - growthOf(a) || a.name.localeCompare(b.name);
        case 'score':
        default:
          return scoreOf(b) - scoreOf(a) || a.name.localeCompare(b.name);
      }
    },
    defaultSort: 'score',
    pageSize: 8,
  });

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Students', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'top', label: 'Top Performers', icon: 'ti ti-medal', count: rows.filter(isTopPerformer).length },
      {
        id: 'Needs Improvement',
        label: 'Needs Improvement',
        icon: 'ti ti-alert-circle',
        count: rows.filter((row) => matchesRail(row, 'Needs Improvement')).length,
      },
      {
        id: 'At Risk',
        label: 'At Risk',
        icon: 'ti ti-alert-triangle',
        count: rows.filter((row) => matchesRail(row, 'At Risk')).length,
      },
      {
        id: 'plans',
        label: 'Improvement Plans',
        icon: 'ti ti-target-arrow',
        count: rows.filter((row) => matchesRail(row, 'plans')).length,
      },
      {
        id: 'attendance',
        label: 'Attendance Concern',
        icon: 'ti ti-calendar-x',
        count: rows.filter((row) => matchesRail(row, 'attendance')).length,
      },
    ],
    [rows],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () =>
      [{ id: 'all', label: 'All', icon: 'ti ti-layout-list' }, ...rails].map((rail) => ({
        ...rail,
        count: rows.filter((row) => matchesRail(row, rail.id === 'all' ? null : rail.id)).length,
      })),
    [rows],
  );

  /* ------------------------------ Summary strip ------------------------------ */

  const summary = useMemo<SummaryStripItem[]>(() => {
    const shown = workspace.visible;
    const level = (name: PerformanceLevel) => shown.filter((row) => levelOf(row) === name).length;
    return [
      { id: 'total', accent: 'primary', icon: 'ti ti-users', value: `${shown.length}`, label: 'Students Evaluated' },
      { id: 'excellent', accent: 'success', icon: 'ti ti-medal', value: `${level('Excellent')}`, label: 'Excellent' },
      { id: 'good', accent: 'info', icon: 'ti ti-thumb-up', value: `${level('Good')}`, label: 'Good' },
      { id: 'average', accent: 'teal', icon: 'ti ti-equal', value: `${level('Average')}`, label: 'Average' },
      {
        id: 'needs',
        accent: 'warning',
        icon: 'ti ti-alert-circle',
        value: `${level('Needs Improvement')}`,
        label: 'Needs Improvement',
      },
      { id: 'risk', accent: 'danger', icon: 'ti ti-alert-triangle', value: `${level('At Risk')}`, label: 'At Risk' },
      {
        id: 'top',
        accent: 'purple',
        icon: 'ti ti-trophy',
        value: `${shown.filter(isTopPerformer).length}`,
        label: 'Top Performers',
      },
      {
        id: 'plans',
        accent: 'slate',
        icon: 'ti ti-target-arrow',
        value: `${shown.filter((row) => row.plan.state !== 'Not required').length}`,
        label: 'Improvement Plans',
      },
    ];
  }, [workspace.visible]);

  /* -------------------------------- Mutations -------------------------------- */

  const addRemark = useCallback((id: string, author: string, role: string, body: string) => {
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? { ...row, remarks: [{ author, role, date: '31 Jul 2026', body }, ...row.remarks] }
          : row,
      ),
    );
  }, []);

  /** Opening or closing a plan moves the rail, the strip and the row together. */
  const setPlan = useCallback((id: string, state: PlanState, target: string) => {
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              plan: { reference: row.plan.reference ?? 'IMP-2026-0091', state, target },
            }
          : row,
      ),
    );
  }, []);

  const bulkActions = useMemo<ReportBulkAction[]>(
    () => [
      { id: 'pdf', label: 'Bulk Export PDF', icon: 'ti ti-file-type-pdf', onClick: () => push('Export queued') },
      { id: 'xls', label: 'Bulk Export Excel', icon: 'ti ti-file-type-xls', onClick: () => push('Export queued') },
      {
        id: 'cards',
        label: 'Generate Report Cards',
        icon: 'ti ti-file-certificate',
        onClick: () => openModal(null, 'reportcard'),
      },
      { id: 'plan', label: 'Improvement Plan', icon: 'ti ti-target-arrow', onClick: () => openModal(null, 'plan') },
      { id: 'share', label: 'Share', icon: 'ti ti-share', onClick: () => openModal(null, 'share') },
    ],
    [openModal, push],
  );

  /* --------------------------------- Detail ---------------------------------- */

  const renderDetail = (row: StudentPerformance) => {
    const grade = overallGradeOf(row);
    const best = bestPaperOf(row);
    const weakest = weakestPaperOf(row);

    return (
      <div className="row g-4">
        <div className="col-xl-3 col-md-6">
          <h3 className="fs-14 mb-3 fw-medium">
            <i className="ti ti-user text-primary me-1" />
            Student Profile
          </h3>
          <ul className="list-unstyled fs-12 mb-3">
            {[
              { label: 'Admission No.', value: row.id },
              { label: 'Class / Section', value: classLabelOf(row) },
              { label: 'Roll Number', value: `${row.roll}` },
              { label: 'Class Teacher', value: row.classTeacher },
              { label: 'Section Strength', value: `${row.sectionStrength} students` },
              { label: 'Academic Year', value: ACADEMIC_YEAR },
              { label: 'Exam / Term', value: EXAM },
            ].map((item) => (
              <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                <span className="text-muted">{item.label}</span>
                <span className="fw-medium">{item.value}</span>
              </li>
            ))}
          </ul>

          <h6 className="details-heading">
            <i className="ti ti-notes" />
            Internal Notes
          </h6>
          <div className="d-flex flex-wrap gap-1 mb-2">
            {row.noteTags.map((tag) => (
              <span className="badge badge-soft-secondary" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <p className="fs-12 text-muted mb-0">{row.note}</p>
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading">
            <i className="ti ti-list-numbers" />
            Subject-wise Performance
          </h6>
          <ul className="list-unstyled fs-12 mb-3">
            {row.subjects.map((subject) => {
              const subjectGrade = subjectGradeOf(subject);
              return (
                <li className="d-flex align-items-center justify-content-between py-1" key={subject.subject}>
                  <span className="text-muted">{subject.subject}</span>
                  <span className="fw-medium">
                    {subject.marks === null ? (
                      <span className="text-muted">Not entered</span>
                    ) : (
                      <>
                        {subject.marks} / 100
                        <span className={`badge badge-soft-${gradeTint(subjectGrade as string)} ms-2`}>
                          {subjectGrade}
                        </span>
                      </>
                    )}
                  </span>
                </li>
              );
            })}
            {best && weakest ? (
              <li className="d-flex align-items-center justify-content-between py-1 border-top mt-1 pt-2">
                <span className="text-muted">Best / Weakest</span>
                <span className="fw-medium">
                  {best.subject} {best.marks} · {weakest.subject} {weakest.marks}
                </span>
              </li>
            ) : null}
          </ul>

          <h6 className="details-heading">
            <i className="ti ti-award" />
            Grade Breakdown
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
              <span className="fw-medium">
                {grade ? `${grade.grade} · ${grade.remark}` : 'Withheld'}
              </span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Performance Level</span>
              <span className="fw-medium">{levelOf(row)}</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">At Pass Mark</span>
              <span className="fw-medium">
                {atPassMarkOf(row)} of {papersOf(row)} · {PASS_MARK}% of the paper
              </span>
            </li>
          </ul>
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading">
            <i className="ti ti-calendar-check" />
            Attendance Summary
          </h6>
          <ul className="list-unstyled fs-12 mb-3">
            {[
              { label: 'Working Days', value: `${WORKING_DAYS}` },
              { label: 'Present', value: `${row.present} days` },
              { label: 'Absent', value: `${absentOf(row)} days` },
              { label: 'Late Marks', value: `${row.lateMarks}` },
              { label: 'Attendance', value: `${attendancePctOf(row)}%` },
              { label: 'Band', value: attendanceBandOf(row) },
              { label: 'Teaching Lost', value: `${periodsLostOf(row)} periods` },
            ].map((item) => (
              <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                <span className="text-muted">{item.label}</span>
                <span className="fw-medium">{item.value}</span>
              </li>
            ))}
          </ul>

          <h6 className="details-heading">
            <i className="ti ti-sparkles" />
            Strengths &amp; Areas for Improvement
          </h6>
          <span className="fs-12 text-muted d-block mb-1">Strengths</span>
          <div className="d-flex flex-wrap gap-1 mb-2">
            {row.strengths.map((item) => (
              <span className="badge badge-soft-success" key={item}>
                {item}
              </span>
            ))}
          </div>
          <span className="fs-12 text-muted d-block mb-1">Areas for improvement</span>
          <div className="d-flex flex-wrap gap-1 mb-3">
            {row.improvements.map((item) => (
              <span className="badge badge-soft-warning" key={item}>
                {item}
              </span>
            ))}
          </div>

          <ul className="list-unstyled fs-12 mb-0">
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Improvement Plan</span>
              <span className="fw-medium">{row.plan.reference ?? row.plan.state}</span>
            </li>
            {row.plan.reference ? (
              <>
                <li className="d-flex align-items-center justify-content-between py-1">
                  <span className="text-muted">Plan Status</span>
                  <span className="fw-medium">{row.plan.state}</span>
                </li>
                <li className="py-1">
                  <span className="text-muted d-block">Target</span>
                  <span className="fw-medium">{row.plan.target}</span>
                </li>
              </>
            ) : (
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Growth</span>
                <span className={`badge badge-soft-${trendTint[trendOf(row)]}`}>{trendOf(row)}</span>
              </li>
            )}
          </ul>
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
            <i className="ti ti-users-group" />
            Parent Meeting History
          </h6>
          {row.meetings.map((meeting) => (
            <div className="border rounded p-2 mb-2" key={meeting.title}>
              <div className="d-flex align-items-center justify-content-between gap-2">
                <h6 className="fs-13 mb-0 fw-medium">{meeting.title}</h6>
                <span className={`badge badge-soft-${meeting.held === 'Held' ? 'success' : 'info'}`}>
                  {meeting.held}
                </span>
              </div>
              <span className="fs-12 text-muted d-block">
                {meeting.date} · {meeting.by}
              </span>
              <p className="fs-12 text-muted mb-0 mt-1">{meeting.note}</p>
            </div>
          ))}
          <ul className="list-unstyled fs-12 mb-0">
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Meetings This Term</span>
              <span className="fw-medium">
                {row.meetings.filter((meeting) => meeting.held === 'Held').length} held
              </span>
            </li>
          </ul>

          <div className="d-flex gap-2 mt-3">
            {row.plan.state === 'Active' || row.plan.state === 'Proposed' ? (
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-sm flex-fill"
                onClick={() => openModal(row, 'plan')}
              >
                <i className="ti ti-target-arrow me-1" />
                Improvement Plan
              </button>
            ) : isCompleteOf(row) ? (
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-sm flex-fill"
                onClick={() => openModal(row, 'reportcard')}
              >
                <i className="ti ti-file-certificate me-1" />
                Generate Report Card
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-sm flex-fill"
                onClick={() => openModal(row, 'remarks')}
              >
                <i className="ti ti-message-plus me-1" />
                Add Remark
              </button>
            )}
            <button type="button" className="btn btn-primary btn-sm flex-fill" onClick={() => openPanel(row)}>
              <i className="ti ti-layout-sidebar-right-expand me-1" />
              Performance Panel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const rowActions = (row: StudentPerformance) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Performance" ariaLabel="View Performance" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Compare" ariaLabel="Compare" onClick={() => openModal(row, 'compare')}>
        <i className="ti ti-arrows-diff" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Add Remarks" ariaLabel="Add Remarks" onClick={() => openModal(row, 'remarks')}>
        <i className="ti ti-message-plus" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Improvement Plan" ariaLabel="Improvement Plan" onClick={() => openModal(row, 'plan')}>
        <i className="ti ti-target-arrow" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Generate Report Card" ariaLabel="Generate Report Card" onClick={() => openModal(row, 'reportcard')}>
        <i className="ti ti-file-certificate" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Share" ariaLabel="Share" onClick={() => openModal(row, 'share')}>
        <i className="ti ti-share" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Performance Panel" ariaLabel="Performance Panel" onClick={() => openPanel(row)}>
        <i className="ti ti-layout-sidebar-right-expand" />
      </ActionLink>
    </div>
  );

  const filterSummary = [
    workspace.filters.exam || 'all exams',
    workspace.filters['academic-year'] || ACADEMIC_YEAR,
    workspace.filters.class || 'all classes',
    workspace.filters.level || 'all levels',
  ].join(' · ');

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <ReportPageHeader
            title="Student Performance"
            section="Reports"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'compare')}
                  >
                    <i className="ti ti-arrows-diff me-2" />
                    Compare
                  </ActionLink>
                </div>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'plan')}
                  >
                    <i className="ti ti-target-arrow me-2" />
                    Improvement Plans
                  </ActionLink>
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => (rows[0] ? openPanel(rows[0]) : undefined)}
                  >
                    <i className="ti ti-chart-histogram me-2" />
                    Performance Analysis
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
            workspaceId="studentPerformance"
            scopeLabel="Report on:"
            scopeAriaLabel="Report focus"
            scopes={scopes}
            scope={scope}
            onScope={setScope}
            scopeCount={`${REGISTER_TOTAL.toLocaleString()} students`}
            bandActions={
              <>
                <ActionLink
                  className="btn btn-sm btn-primary d-inline-flex align-items-center"
                  onClick={() => openModal(null, 'reportcard')}
                >
                  <i className="ti ti-player-play me-1" />
                  Generate Report
                </ActionLink>
                <ActionLink
                  className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                  onClick={() => openModal(null, 'remarks')}
                >
                  <i className="ti ti-message-plus me-1" />
                  Add Remarks
                </ActionLink>
                <ActionLink className="btn btn-sm btn-outline-light bg-white btn-icon" title="Export PDF" ariaLabel="Export PDF" onClick={() => push('Export queued')}>
                  <i className="ti ti-file-type-pdf" />
                </ActionLink>
                <ActionLink className="btn btn-sm btn-outline-light bg-white btn-icon" title="Export Excel" ariaLabel="Export Excel" onClick={() => push('Export queued')}>
                  <i className="ti ti-file-type-xls" />
                </ActionLink>
                <ActionLink className="btn btn-sm btn-outline-light bg-white btn-icon" title="Print" ariaLabel="Print" onClick={() => window.print()}>
                  <i className="ti ti-printer" />
                </ActionLink>
                <ActionLink className="btn btn-sm btn-outline-light bg-white btn-icon" title="Share" ariaLabel="Share" onClick={() => openModal(null, 'share')}>
                  <i className="ti ti-share" />
                </ActionLink>
              </>
            }
            searchLabel="Search students"
            searchPlaceholder="Student name, admission no. or class"
            filterSummary={filterSummary}
            filterFields={filterFields}
            savedViews={savedViews}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="students"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            summary={summary}
            bulkActions={bulkActions}
            selectionNoun="student"
            caption="Student performance with overall score, grade, class rank, attendance and performance level"
            selectAllLabel="Select all students"
            renderDetail={renderDetail}
            renderActions={rowActions}
            footerInfoSuffix={`${EXAM} ${ACADEMIC_YEAR}`}
            emptyIcon="ti ti-user-off"
            emptyTitle="No students match this view"
            emptyBody="Clear a filter, widen the score range or switch the report focus to see more."
            onRefresh={() => {
              setRows(seededStudents);
              push('Performance refreshed');
            }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            onResetExtra={() => setScope('all')}
          />
        </div>
      </div>
      {/* /Page Wrapper */}

      <PerformanceModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        row={modalRow}
        rows={workspace.visible}
        registerTotal={REGISTER_TOTAL}
        panelOpen={panelOpen}
        onClosePanel={() => setPanelOpen(false)}
        onToast={push}
        onAddRemark={addRemark}
        onSetPlan={setPlan}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="studentPerformanceToasts" />
    </>
  );
};

export default StudentPerformancePage;
