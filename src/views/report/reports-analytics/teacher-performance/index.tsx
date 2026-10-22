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
import TeacherModals from './modals/TeacherModals';
import type { TeacherModalId } from './modals/TeacherModals';
import type { EvaluationStatus, Rating, Teacher } from './data/teacherPerformance.data';
import {
  ACADEMIC_YEAR,
  academicYearOptions,
  attendanceBelowOptions,
  classCalloutOf,
  classGradeOf,
  classesBandOf,
  classesOptions,
  departmentOptions,
  developmentBandOf,
  developmentOptions,
  employmentOptions,
  experienceBandOf,
  experienceOptions,
  gradeTint,
  hasOpenActionOf,
  leaveTakenOf,
  MAX_PERIODS,
  observationAverageOf,
  PERIOD,
  periodOptions,
  presentOf,
  ratingOf,
  ratingOptions,
  ratingTint,
  REGISTER_TOTAL,
  REQUIRED_HOURS,
  REQUIRED_MODULES,
  reviewerOf,
  reviewerOptions,
  searchIndexOf,
  spreadOf,
  statusOf,
  statusOptions,
  statusPill,
  subjectOptions,
  teachers as seededTeachers,
  trainingStatusOf,
  trainingTint,
  WORKING_DAYS,
  workloadIndexOf,
  workloadTint,
} from './data/teacherPerformance.data';

const routes = all_routes;

/** Band 1's scope group, which narrows the register by what is being reviewed. */
const scopes: ReportScope[] = [
  { id: 'all', label: 'Performance', icon: 'ti ti-chart-bar' },
  { id: 'effectiveness', label: 'Effectiveness', icon: 'ti ti-target-arrow' },
  { id: 'attendance', label: 'Attendance', icon: 'ti ti-calendar-check' },
  { id: 'workload', label: 'Workload', icon: 'ti ti-layout-grid' },
  { id: 'development', label: 'Development', icon: 'ti ti-school' },
];

/**
 * The scope group narrows rather than decorating.
 *
 * Effectiveness shows the teachers whose classes sit below the eighty line,
 * Attendance those under ninety-five per cent, Workload the heavy timetables,
 * and Development anyone short of the training requirement.
 */
const matchesScope = (row: Teacher, scope: string) => {
  switch (scope) {
    case 'effectiveness':
      return row.classAverage < 80;
    case 'attendance':
      return row.attendancePct < 95;
    case 'workload':
      return workloadIndexOf(row) === 'Heavy' || workloadIndexOf(row) === 'Overloaded';
    case 'development':
      return row.modulesCompleted < REQUIRED_MODULES || row.trainingHours < REQUIRED_HOURS;
    default:
      return true;
  }
};

const filterFields: FilterField[] = [
  {
    id: 'date-range',
    label: 'Date Range',
    kind: 'daterange',
    surface: 'band',
    span: 'col-xxl-3 col-lg-4 col-md-6',
    chipLabel: 'Range',
    rangeFormat: 'd M Y',
  },
  {
    id: 'department',
    label: 'Department',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Dept',
    allLabel: 'All Departments',
    options: departmentOptions,
  },
  {
    id: 'subject',
    label: 'Subject',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Subject',
    allLabel: 'All Subjects',
    options: subjectOptions,
  },
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
    id: 'period',
    label: 'Evaluation Period',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Period',
    options: periodOptions,
    defaultValue: '',
    initialValue: PERIOD,
  },
  {
    id: 'rating',
    label: 'Performance Rating',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Rating',
    allLabel: 'All Ratings',
    options: ratingOptions,
  },
  {
    id: 'employment',
    label: 'Employment Status',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Employment',
    allLabel: 'All Status',
    options: employmentOptions,
  },
  {
    id: 'evaluation-status',
    label: 'Evaluation Status',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Status',
    allLabel: 'All Status',
    options: statusOptions,
  },
  {
    id: 'evaluated-by',
    label: 'Evaluated By',
    kind: 'select',
    surface: 'band',
    chipLabel: 'Reviewer',
    allLabel: 'All Reviewers',
    options: reviewerOptions,
  },

  { id: 'score-from', label: 'Score From', kind: 'number', chipLabel: 'Score ≥', defaultValue: '0' },
  { id: 'score-to', label: 'Score To', kind: 'number', chipLabel: 'Score ≤', defaultValue: '5' },
  {
    id: 'attendance-below',
    label: 'Attendance Below',
    kind: 'select',
    chipLabel: 'Below',
    allLabel: 'Any',
    options: attendanceBelowOptions,
  },
  { id: 'classes', label: 'Classes Assigned', kind: 'select', chipLabel: 'Classes', allLabel: 'Any', options: classesOptions },
  { id: 'experience', label: 'Experience', kind: 'select', chipLabel: 'Experience', allLabel: 'Any', options: experienceOptions },
  { id: 'development', label: 'Development Status', kind: 'select', chipLabel: 'Development', options: developmentOptions },
  {
    id: 'open-action',
    label: 'Open action',
    kind: 'toggle',
    chipLabel: 'Open',
    switchLabel: 'Only teachers carrying an open improvement plan or review action',
  },
];

const sortOptions: SortOption[] = [
  { id: 'score', label: 'Performance score', icon: 'ti ti-star' },
  { id: 'name', label: 'Teacher (A–Z)', icon: 'ti ti-abc' },
  { id: 'attendance', label: 'Attendance %', icon: 'ti ti-calendar-check' },
  { id: 'student', label: 'Student performance', icon: 'ti ti-users' },
  { id: 'review', label: 'Last review date', icon: 'ti ti-calendar-event' },
  { id: 'id', label: 'Employee ID', icon: 'ti ti-hash' },
];

const rails: { id: string; label: string; icon: string }[] = [
  { id: 'Outstanding', label: 'Outstanding', icon: 'ti ti-star' },
  { id: 'Meets Expectations', label: 'Meets', icon: 'ti ti-check' },
  { id: 'Needs Improvement', label: 'Needs Improvement', icon: 'ti ti-alert-circle' },
  { id: 'review-due', label: 'Review Due', icon: 'ti ti-clock' },
  { id: 'plan', label: 'Improvement Plan', icon: 'ti ti-target-arrow' },
];

function matchesRail(row: Teacher, rail: string | null): boolean {
  if (!rail) return true;
  if (rail === 'review-due') return statusOf(row) !== 'Completed';
  if (rail === 'plan') return row.plan.state === 'Active';
  if (rail === 'probation') return row.employment === 'Probation';
  return ratingOf(row) === (rail as Rating);
}

const dayOf = (value?: string) => {
  if (!value) return 0;
  const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
  const [day, month, year] = value.split(' ');
  return Number(year) * 10000 + (months.indexOf(month) + 1) * 100 + Number(day);
};

const TeacherPerformance = () => {
  const [rows, setRows] = useState<Teacher[]>(seededTeachers);
  const [scope, setScope] = useState('all');
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<TeacherModalId | null>(null);
  const [modalRow, setModalRow] = useState<Teacher | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Teacher | null, modal: TeacherModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const openPanel = useCallback((row: Teacher | null) => {
    setModalRow(row);
    setPanelOpen(true);
  }, []);

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Teacher>[]>(
    () => [
      {
        id: 'teacher',
        label: 'Teacher',
        sortable: true,
        toggleable: false,
        render: (row) => (
          <div className="dt-user">
            <ActionLink className="dt-avatar" ariaLabel={`View ${row.name}`} onClick={() => openModal(row, 'history')}>
              <ImageWithBasePath src={row.image} alt={row.name} />
            </ActionLink>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'history')}>
                {row.name}
              </ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">
                <span>{row.designation}</span>
                <span className="dt-dot">•</span>
                <span>{row.experience} years</span>
              </div>
              {row.flag ? (
                <span className={`badge badge-soft-${row.flag.tint} mt-1`}>{row.flag.label}</span>
              ) : null}
            </div>
          </div>
        ),
      },
      {
        id: 'id',
        label: 'Employee ID',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.id}</span>
            <span className="fs-12 text-muted">{row.employment}</span>
          </>
        ),
      },
      {
        id: 'department',
        label: 'Department',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.department}</span>
            <span className="fs-12 text-muted">{row.departmentRole}</span>
          </>
        ),
      },
      {
        id: 'subject',
        label: 'Subject',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.subject}</span>
            <span className="fs-12 text-muted">{row.classRange}</span>
          </>
        ),
      },
      {
        id: 'classes',
        label: 'Classes Assigned',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.classes} classes</span>
            <span className="fs-12 text-muted">
              {row.students} students · {row.periods} periods
            </span>
            <span className={`badge badge-soft-${workloadTint[workloadIndexOf(row)]} mt-1`}>
              {workloadIndexOf(row)}
            </span>
          </>
        ),
      },
      {
        id: 'student',
        label: 'Student Performance',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-semibold d-block">{row.classAverage}%</span>
            <span className="fs-12 text-muted">Pass rate {row.passRate}%</span>
          </>
        ),
      },
      {
        id: 'attendance',
        label: 'Attendance %',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-semibold d-block">{row.attendancePct}%</span>
            <span className="fs-12 text-muted">
              {leaveTakenOf(row)} {leaveTakenOf(row) === 1 ? 'day' : 'days'} leave
            </span>
          </>
        ),
      },
      {
        id: 'rating',
        label: 'Performance Rating',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className={`badge badge-soft-${ratingTint[ratingOf(row)]}`}>{ratingOf(row)}</span>
            <span className="fs-12 text-muted d-block mt-1">{row.score.toFixed(1)} / 5.0</span>
          </>
        ),
      },
      {
        id: 'status',
        label: 'Evaluation Status',
        render: (row) => (
          <>
            <span className={`dt-pill ${statusPill[statusOf(row)]}`}>
              <span className="dt-pill-dot" />
              {statusOf(row)}
            </span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{row.statusNote}</span>
          </>
        ),
      },
      {
        id: 'review',
        label: 'Last Review',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.reviewHeldOn ?? row.remarkDate}</span>
            <span className="fs-12 text-muted">{row.signedOffBy ?? 'Annual review'}</span>
          </>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Teacher>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.department && row.department !== filters.department) return false;
      if (filters.subject && row.subject !== filters.subject) return false;
      if (filters.rating && ratingOf(row) !== filters.rating) return false;
      if (filters.employment && row.employment !== filters.employment) return false;
      if (filters['evaluation-status'] && statusOf(row) !== (filters['evaluation-status'] as EvaluationStatus))
        return false;
      if (filters['evaluated-by'] && reviewerOf(row) !== filters['evaluated-by']) return false;
      if (filters.classes && classesBandOf(row) !== filters.classes) return false;
      if (filters.experience && experienceBandOf(row) !== filters.experience) return false;
      if (filters.development && developmentBandOf(row) !== filters.development) return false;
      if (filters['open-action'] && !hasOpenActionOf(row)) return false;

      if (filters['attendance-below']) {
        const ceiling = Number(filters['attendance-below'].replace('%', ''));
        if (row.attendancePct >= ceiling) return false;
      }
      if (row.score < Number(filters['score-from'] || 0)) return false;
      if (row.score > Number(filters['score-to'] || 5)) return false;

      return matchesScope(row, scope);
    },
    quickMatch: (row, quick) => matchesRail(row, quick),
    viewMatch: (row, view) => matchesRail(row, view === 'all' ? null : view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'attendance':
          return b.attendancePct - a.attendancePct || a.name.localeCompare(b.name);
        case 'student':
          return b.classAverage - a.classAverage || a.name.localeCompare(b.name);
        case 'review':
          return dayOf(b.reviewHeldOn) - dayOf(a.reviewHeldOn) || a.name.localeCompare(b.name);
        case 'id':
          return a.id.localeCompare(b.id);
        case 'score':
        default:
          return b.score - a.score || a.name.localeCompare(b.name);
      }
    },
    defaultSort: 'score',
    pageSize: 8,
  });

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Teachers', icon: 'ti ti-layout-list', count: rows.length },
      ...rails.map((rail) => ({
        ...rail,
        label:
          rail.id === 'review-due'
            ? 'Review Pending'
            : rail.id === 'plan'
              ? 'On Improvement Plan'
              : rail.label,
        count: rows.filter((row) => matchesRail(row, rail.id)).length,
      })),
    ],
    [rows],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () =>
      [
        { id: 'all', label: 'All', icon: 'ti ti-layout-list' },
        ...rails,
        { id: 'probation', label: 'Probation', icon: 'ti ti-user-question' },
      ].map((rail) => ({
        ...rail,
        count: rows.filter((row) => matchesRail(row, rail.id === 'all' ? null : rail.id)).length,
      })),
    [rows],
  );

  /* ------------------------------ Summary strip ------------------------------ */

  const summary = useMemo<SummaryStripItem[]>(() => {
    const shown = workspace.visible;
    const rated = (rating: Rating) => shown.filter((row) => ratingOf(row) === rating).length;
    const avgScore =
      shown.length === 0
        ? null
        : Math.round((shown.reduce((total, row) => total + row.score, 0) / shown.length) * 100) / 100;
    const avgAttendance =
      shown.length === 0
        ? null
        : Math.round((shown.reduce((total, row) => total + row.attendancePct, 0) / shown.length) * 10) / 10;

    return [
      { id: 'total', accent: 'primary', icon: 'ti ti-users', value: `${shown.length}`, label: 'Total Teachers' },
      { id: 'outstanding', accent: 'success', icon: 'ti ti-star', value: `${rated('Outstanding')}`, label: 'Outstanding' },
      {
        id: 'meets',
        accent: 'info',
        icon: 'ti ti-check',
        value: `${rated('Meets Expectations') + rated('Exceeds Expectations')}`,
        label: 'Meets Expectations',
      },
      {
        id: 'needs',
        accent: 'warning',
        icon: 'ti ti-alert-circle',
        value: `${rated('Needs Improvement') + rated('Unsatisfactory')}`,
        label: 'Needs Improvement',
      },
      {
        id: 'score',
        accent: 'teal',
        icon: 'ti ti-chart-dots',
        value: avgScore === null ? '—' : `${avgScore}`,
        label: 'Avg Performance Score',
      },
      {
        id: 'attendance',
        accent: 'purple',
        icon: 'ti ti-calendar-check',
        value: avgAttendance === null ? '—' : `${avgAttendance}%`,
        label: 'Average Attendance',
      },
      {
        id: 'classes',
        accent: 'slate',
        icon: 'ti ti-layout-grid',
        value: `${shown.reduce((total, row) => total + row.classes, 0)}`,
        label: 'Classes Handled',
      },
      {
        id: 'development',
        accent: 'danger',
        icon: 'ti ti-school',
        value: `${shown.filter((row) => row.modulesCompleted >= REQUIRED_MODULES).length}`,
        label: 'Development Completed',
      },
    ];
  }, [workspace.visible]);

  /* -------------------------------- Mutations -------------------------------- */

  /** Saving an evaluation stamps the review; the status is a reading of it. */
  const saveEvaluation = useCallback((id: string, score: number) => {
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              score,
              reviewHeldOn: '31 Jul 2026',
              signedOffOn: '31 Jul 2026',
              signedOffBy: 'Dr. S. Balakrishnan',
              statusNote: 'Signed off',
              audit: [{ title: 'Evaluation signed off', detail: '31 Jul 2026 · Principal' }, ...row.audit],
            }
          : row,
      ),
    );
  }, []);

  const openPlan = useCallback((id: string, goals: string[], mentor: string) => {
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              plan: {
                state: 'Active',
                window: 'Aug to Nov 2026',
                goals,
                mentor,
                goalsMet: 0,
                goalsTotal: goals.length,
              },
              statusNote: 'Improvement plan opened',
              audit: [{ title: 'Improvement plan opened', detail: '31 Jul 2026 · Principal' }, ...row.audit],
            }
          : row,
      ),
    );
  }, []);

  const bulkActions = useMemo<ReportBulkAction[]>(
    () => [
      { id: 'pdf', label: 'Bulk Export PDF', icon: 'ti ti-file-type-pdf', onClick: () => openModal(null, 'export') },
      { id: 'xls', label: 'Bulk Export Excel', icon: 'ti ti-file-type-xls', onClick: () => openModal(null, 'export') },
      {
        id: 'schedule',
        label: 'Schedule Review',
        icon: 'ti ti-calendar-plus',
        onClick: () => openModal(null, 'schedule'),
      },
      { id: 'print', label: 'Print', icon: 'ti ti-printer', onClick: () => openModal(null, 'print') },
      { id: 'share', label: 'Share', icon: 'ti ti-share', onClick: () => openModal(null, 'share') },
    ],
    [openModal],
  );

  /* --------------------------------- Detail ---------------------------------- */

  const renderDetail = (row: Teacher) => {
    const callout = classCalloutOf(row);

    return (
      <div className="row g-4">
        <div className="col-xl-3 col-md-6">
          <h3 className="fs-14 mb-3 fw-medium">
            <i className="ti ti-user text-primary me-1" />
            Teacher Profile
          </h3>
          <ul className="list-unstyled fs-12 mb-3">
            {[
              { label: 'Employee ID', value: row.id },
              { label: 'Designation', value: row.role },
              { label: 'Qualification', value: row.qualification },
              { label: 'Experience', value: `${row.experience} years · ${row.experienceHere} here` },
              { label: 'Employment', value: row.employmentNote ?? row.employment },
              { label: 'Reports To', value: row.reportsTo },
            ].map((item) => (
              <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                <span className="text-muted">{item.label}</span>
                <span className="fw-medium">{item.value}</span>
              </li>
            ))}
          </ul>

          <h6 className="details-heading">
            <i className="ti ti-layout-grid" />
            Teaching Workload
          </h6>
          <ul className="list-unstyled fs-12 mb-0">
            {[
              { label: 'Classes Assigned', value: `${row.classes}` },
              { label: 'Students Taught', value: `${row.students}` },
              { label: 'Periods A Week', value: `${row.periods} of ${MAX_PERIODS}` },
              { label: 'Class Teacher', value: row.classTeacherOf },
              { label: 'Extra Duties', value: row.extraDuties },
            ].map((item) => (
              <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                <span className="text-muted">{item.label}</span>
                <span className="fw-medium">{item.value}</span>
              </li>
            ))}
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Workload Index</span>
              <span className={`badge badge-soft-${workloadTint[workloadIndexOf(row)]}`}>
                {workloadIndexOf(row)}
              </span>
            </li>
          </ul>
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading">
            <i className="ti ti-list-numbers" />
            Subject-wise Performance
          </h6>
          <ul className="list-unstyled fs-12 mb-3">
            {row.subjectClasses.map((item) => {
              const grade = classGradeOf(item.average);
              return (
                <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                  <span className="text-muted">{item.label}</span>
                  <span className="fw-medium">
                    {item.average}%
                    <span className={`badge badge-soft-${gradeTint(grade)} ms-2`}>{grade}</span>
                  </span>
                </li>
              );
            })}
            <li className="d-flex align-items-center justify-content-between py-1 border-top mt-1 pt-2">
              <span className="text-muted">{callout.label}</span>
              <span className="fw-medium">
                {callout.item.label} {callout.item.average}%
              </span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Spread</span>
              <span className="fw-medium">{spreadOf(row)} points</span>
            </li>
          </ul>

          <h6 className="details-heading">
            <i className="ti ti-users" />
            Student Academic Results
          </h6>
          <ul className="list-unstyled fs-12 mb-0">
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Class Average</span>
              <span className="fw-medium">{row.classAverage}%</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Pass Rate</span>
              <span className="fw-medium">{row.passRate}%</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Scored Above 90%</span>
              <span className="fw-medium">
                {row.above90} of {row.students}
              </span>
            </li>
            {row.resultFacts.map((fact) => (
              <li className="d-flex align-items-center justify-content-between py-1" key={fact.title}>
                <span className="text-muted">{fact.title}</span>
                <span className="fw-medium">{fact.detail}</span>
              </li>
            ))}
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
              { label: 'Present', value: `${presentOf(row)}` },
              { label: 'Leave Taken', value: `${leaveTakenOf(row)} · ${row.leaveNote}` },
              { label: 'Late Arrivals', value: row.lateArrivals === 0 ? 'None' : `${row.lateArrivals}` },
              { label: 'Periods Missed', value: `${row.periodsMissed} · ${row.periodsMissedNote}` },
              { label: 'Attendance', value: `${row.attendancePct}%` },
            ].map((item) => (
              <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                <span className="text-muted">{item.label}</span>
                <span className="fw-medium">{item.value}</span>
              </li>
            ))}
          </ul>

          <h6 className="details-heading">
            <i className="ti ti-eye" />
            Classroom Observations
          </h6>
          {row.observations.map((observation) => (
            <div className="border rounded p-2 mb-2" key={`${observation.label}-${observation.date}`}>
              <h6 className="fs-13 mb-0 fw-medium">
                {observation.label} · {observation.score} / 5
              </h6>
              <span className="fs-12 text-muted">
                {observation.date} · {observation.by}
              </span>
            </div>
          ))}
          <ul className="list-unstyled fs-12 mb-3">
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Observations</span>
              <span className="fw-medium">{row.observationCount} this term</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Listed Average</span>
              <span className="fw-medium">{observationAverageOf(row)} / 5</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Appraisal Score</span>
              <span className="fw-medium">{row.score.toFixed(1)} / 5</span>
            </li>
          </ul>

          <h6 className="details-heading">
            <i className="ti ti-school" />
            Professional Development
          </h6>
          <div className="border rounded p-2 mb-2">
            <h6 className="fs-13 mb-0 fw-medium">{row.latestModule.title}</h6>
            <span className="fs-12 text-muted">{row.latestModule.detail}</span>
          </div>
          <ul className="list-unstyled fs-12 mb-0">
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Modules Completed</span>
              <span className="fw-medium">
                {row.modulesCompleted} of {REQUIRED_MODULES}
              </span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Training Hours</span>
              <span className="fw-medium">
                {row.trainingHours} of {REQUIRED_HOURS} required
              </span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Status</span>
              <span className={`badge badge-soft-${trainingTint(row)}`}>{trainingStatusOf(row)}</span>
            </li>
          </ul>
        </div>

        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading">
            <i className="ti ti-award" />
            Awards &amp; Recognition
          </h6>
          {row.awards.map((award) => (
            <div className="border rounded p-2 mb-2" key={award.title}>
              <h6 className="fs-13 mb-0 fw-medium">{award.title}</h6>
              <span className="fs-12 text-muted">{award.detail}</span>
            </div>
          ))}
          {row.awards.length === 0 ? (
            <p className="fs-12 text-muted mb-2">No awards on record</p>
          ) : null}
          <ul className="list-unstyled fs-12 mb-3">
            {row.awardFacts.map((fact) => (
              <li className="d-flex align-items-center justify-content-between py-1" key={fact.title}>
                <span className="text-muted">{fact.title}</span>
                <span className="fw-medium">{fact.detail}</span>
              </li>
            ))}
          </ul>

          <h6 className="details-heading">
            <i className="ti ti-message-2" />
            Principal Remarks
          </h6>
          <div className="border rounded p-2 mb-2">
            <h6 className="fs-13 mb-0 fw-medium">{row.remarkBy}</h6>
            <span className="fs-12 text-muted d-block">
              {row.remarkRole} · {row.remarkDate}
            </span>
            <p className="fs-12 text-muted mb-0 mt-1">{row.remark}</p>
          </div>
          <div className="d-flex flex-wrap gap-1 mb-3">
            {row.remarkTags.map((tag) => (
              <span className="badge badge-soft-secondary" key={tag}>
                {tag}
              </span>
            ))}
          </div>

          <h6 className="details-heading">
            <i className="ti ti-target-arrow" />
            Improvement Plan
          </h6>
          {row.plan.state === 'Active' ? (
            <>
              <span className="badge badge-soft-warning mb-2">Active · {row.plan.window}</span>
              <ul className="list-unstyled fs-12 mb-2">
                {row.plan.goals.map((goal, index) => (
                  <li className="d-flex align-items-center justify-content-between py-1" key={goal}>
                    <span className="text-muted">Goal {index + 1}</span>
                    <span className="fw-medium">{goal}</span>
                  </li>
                ))}
                {row.plan.mentor ? (
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Mentor</span>
                    <span className="fw-medium">{row.plan.mentor}</span>
                  </li>
                ) : null}
                {row.plan.reviewPoints ? (
                  <li className="d-flex align-items-center justify-content-between py-1">
                    <span className="text-muted">Review Points</span>
                    <span className="fw-medium">{row.plan.reviewPoints}</span>
                  </li>
                ) : null}
              </ul>
            </>
          ) : (
            <ul className="list-unstyled fs-12 mb-2">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Plan</span>
                <span className="fw-medium">{row.plan.state}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Development Goals</span>
                <span className="fw-medium">
                  {row.plan.goalsMet} of {row.plan.goalsTotal} met
                </span>
              </li>
              {row.plan.openGoal ? (
                <li className="d-flex align-items-center justify-content-between py-1">
                  <span className="text-muted">Next Goal</span>
                  <span className="fw-medium">{row.plan.openGoal}</span>
                </li>
              ) : null}
              {row.plan.target ? (
                <li className="d-flex align-items-center justify-content-between py-1">
                  <span className="text-muted">Target</span>
                  <span className="fw-medium">{row.plan.target}</span>
                </li>
              ) : null}
            </ul>
          )}

          <h6 className="details-heading">
            <i className="ti ti-history" />
            Evaluation History
          </h6>
          <ul className="list-unstyled fs-12 mb-3">
            {row.history.map((entry) => (
              <li className="d-flex align-items-center justify-content-between py-1" key={entry.period}>
                <span className="text-muted">{entry.period}</span>
                <span className="fw-medium">
                  {entry.score === null ? '—' : entry.score.toFixed(1)}
                  <span className="text-muted ms-1">{entry.rating}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="d-flex gap-2 mt-3">
            {statusOf(row) === 'Pending' ? (
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-sm flex-fill"
                onClick={() => openModal(row, 'evaluation')}
              >
                <i className="ti ti-clipboard-check me-1" />
                Add Evaluation
              </button>
            ) : row.plan.state === 'Active' ? (
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-sm flex-fill"
                onClick={() => openModal(row, 'plan')}
              >
                <i className="ti ti-target-arrow me-1" />
                Update Plan
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-sm flex-fill"
                onClick={() => openModal(row, 'history')}
              >
                <i className="ti ti-history me-1" />
                Full History
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
  };

  const rowActions = (row: Teacher) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="Performance History" ariaLabel="Performance History" onClick={() => openModal(row, 'history')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Add Evaluation" ariaLabel="Add Evaluation" onClick={() => openModal(row, 'evaluation')}>
        <i className="ti ti-clipboard-check" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Principal Remarks" ariaLabel="Principal Remarks" onClick={() => openModal(row, 'remarks')}>
        <i className="ti ti-message-plus" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Improvement Plan" ariaLabel="Improvement Plan" onClick={() => openModal(row, 'plan')}>
        <i className="ti ti-target-arrow" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Compare" ariaLabel="Compare" onClick={() => openModal(row, 'compare')}>
        <i className="ti ti-arrows-diff" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Schedule Review" ariaLabel="Schedule Review" onClick={() => openModal(row, 'schedule')}>
        <i className="ti ti-calendar-plus" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Analysis" ariaLabel="Analysis" onClick={() => openPanel(row)}>
        <i className="ti ti-chart-histogram" />
      </ActionLink>
    </div>
  );

  const filterSummary = [
    workspace.filters.period || PERIOD,
    workspace.filters['academic-year'] || ACADEMIC_YEAR,
    workspace.filters.department || 'all departments',
    workspace.filters.rating || 'all ratings',
  ].join(' · ');

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <ReportPageHeader
            title="Teacher Performance"
            section="Reports"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => (rows[0] ? openModal(rows[0], 'history') : undefined)}
                  >
                    <i className="ti ti-history me-2" />
                    Performance History
                  </ActionLink>
                </div>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'compare')}
                  >
                    <i className="ti ti-arrows-diff me-2" />
                    Compare Teachers
                  </ActionLink>
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openPanel(null)}
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
            workspaceId="teacherPerformance"
            scopeLabel="Report on:"
            scopeAriaLabel="Report focus"
            scopes={scopes}
            scope={scope}
            onScope={setScope}
            scopeCount={`${REGISTER_TOTAL} teachers`}
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
            searchLabel="Search teachers"
            searchPlaceholder="Teacher name, employee ID, department or subject"
            filterSummary={filterSummary}
            filterFields={filterFields}
            savedViews={savedViews}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="teachers"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            summary={summary}
            bulkActions={bulkActions}
            selectionNoun="teacher"
            caption="Teacher performance report with department, subject, classes assigned, student performance, attendance, performance rating and evaluation status for each teacher"
            selectAllLabel="Select all teachers"
            renderDetail={renderDetail}
            renderActions={rowActions}
            footerInfoSuffix={`${PERIOD} · academic year ${ACADEMIC_YEAR}`}
            emptyIcon="ti ti-user-off"
            emptyTitle="No teachers match this view"
            emptyBody="Clear a filter, widen the score range or switch the report focus to see more."
            onRefresh={() => {
              setRows(seededTeachers);
              push('Appraisals refreshed');
            }}
            onSaveView={() => openModal(null, 'template')}
            onToast={push}
            onResetExtra={() => setScope('all')}
          />
        </div>
      </div>
      {/* /Page Wrapper */}

      <TeacherModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        row={modalRow}
        rows={workspace.visible}
        selected={rows.filter((row) => workspace.selected.includes(row.id))}
        panelOpen={panelOpen}
        onClosePanel={() => setPanelOpen(false)}
        onToast={push}
        onSaveEvaluation={saveEvaluation}
        onOpenPlan={openPlan}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="teacherPerformanceToasts" />
    </>
  );
};

export default TeacherPerformance;
