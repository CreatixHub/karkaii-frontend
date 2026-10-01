import { useCallback, useMemo, useState } from 'react';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink,
  ExportMenu,
  PageHeader,
  useWorkspace,
  WorkspaceShell,
} from '@components/workspace';
import type {
  ColumnDef,
  ExportFormat,
  FilterField,
  QuickFilter,
  SavedView,
  SortOption,
  SummaryItem,
  WorkspaceMenu,
} from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import ClassModals from './modals/ClassModals';
import type { ClassModalId } from './modals/ClassModals';
import type { AttendanceBand, ClassSection, SectionLevel } from './data/classAnalytics.data';
import {
  ACADEMIC_YEAR,
  academicYearOptions,
  actionTint,
  attendanceBandOf,
  ATTENTION_LINE,
  avgAbsentOf,
  avgPresentOf,
  bandOptions,
  bandTint,
  belowPassOf,
  classSections as seededSections,
  EXAM,
  evaluatedLabel,
  examOptions,
  gradeOf,
  gradeOptions,
  gradeTint,
  growthOf,
  isCompleteOf,
  labelOf,
  levelOf,
  levelOptions,
  levelPill,
  meanOf,
  needsAttentionOf,
  openActionsOf,
  passPctOf,
  rankMovementOf,
  searchIndexOf,
  sectionOptions,
  spreadOf,
  strongestOf,
  subjectGradeOf,
  subjectOptions,
  teachingLostOf,
  teacherOptions,
  TOTAL_SECTIONS,
  trendOf,
  trendTint,
  weakestOf,
  WORKING_DAYS,
} from './data/classAnalytics.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'grade', label: 'Grade', kind: 'select', chipLabel: 'Grade', options: gradeOptions },
  { id: 'section', label: 'Section', kind: 'select', chipLabel: 'Section', options: sectionOptions },
  {
    id: 'academic-year',
    label: 'Academic Year',
    kind: 'select',
    chipLabel: 'Year',
    options: academicYearOptions,
    defaultValue: '',
    initialValue: ACADEMIC_YEAR,
  },
  {
    id: 'exam',
    label: 'Exam / Term',
    kind: 'select',
    chipLabel: 'Exam',
    options: examOptions,
    defaultValue: '',
    initialValue: EXAM,
  },
  { id: 'subject', label: 'Subject', kind: 'select', chipLabel: 'Subject', options: subjectOptions },
  { id: 'teacher', label: 'Class Teacher', kind: 'select', chipLabel: 'Teacher', options: teacherOptions },
  { id: 'level', label: 'Performance Level', kind: 'select', chipLabel: 'Level', options: levelOptions },
  { id: 'band', label: 'Attendance Band', kind: 'select', chipLabel: 'Band', options: bandOptions },
];

const sortOptions: SortOption[] = [
  { id: 'rank', label: 'School rank', icon: 'ti ti-trophy' },
  { id: 'mean', label: 'Average score', icon: 'ti ti-percentage' },
  { id: 'pass', label: 'Pass percentage', icon: 'ti ti-checkbox' },
  { id: 'attendance', label: 'Attendance', icon: 'ti ti-calendar-check' },
  { id: 'growth', label: 'Growth since Unit Test 1', icon: 'ti ti-trending-up' },
];

const rails: { id: string; label: string; icon: string }[] = [
  { id: 'Excellent', label: 'Excellent', icon: 'ti ti-medal' },
  { id: 'Good', label: 'Good', icon: 'ti ti-thumb-up' },
  { id: 'Average', label: 'Average', icon: 'ti ti-equal' },
  { id: 'Needs Improvement', label: 'Needs Improvement', icon: 'ti ti-alert-circle' },
  { id: 'At Risk', label: 'At Risk', icon: 'ti ti-alert-triangle' },
];

function matchesRail(row: ClassSection, rail: string | null): boolean {
  if (!rail) return true;
  if (rail === 'attention') return needsAttentionOf(row);
  if (rail === 'declining') return trendOf(row) === 'Declining';
  if (rail === 'attendance') return attendanceBandOf(row) !== 'Regular';
  if (rail === 'open-marks') return !isCompleteOf(row);
  return levelOf(row) === (rail as SectionLevel);
}

const ClassAnalytics = () => {
  const [rows, setRows] = useState<ClassSection[]>(seededSections);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<ClassModalId | null>(null);
  const [modalRow, setModalRow] = useState<ClassSection | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: ClassSection | null, modal: ClassModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const openPanel = useCallback((row: ClassSection) => {
    setModalRow(row);
    setPanelOpen(true);
  }, []);

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<ClassSection>[]>(
    () => [
      {
        id: 'class',
        label: 'Class',
        sortable: true,
        toggleable: false,
        render: (row) => (
          <div className="dt-user">
            <ActionLink
              className="dt-avatar d-inline-flex align-items-center justify-content-center bg-primary-transparent text-primary"
              ariaLabel={`View ${labelOf(row)}`}
              onClick={() => openModal(row, 'view')}
            >
              <i className="ti ti-school fs-20" />
            </ActionLink>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>
                {row.grade}
              </ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">
                <span>{EXAM}</span>
                <span className="dt-dot">·</span>
                <span>{ACADEMIC_YEAR}</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'section',
        label: 'Section',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">Section {row.section}</span>
            <span className="fs-12 text-muted">{row.reportRef ?? 'no section report'}</span>
          </>
        ),
      },
      {
        id: 'teacher',
        label: 'Class Teacher',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.teacher}</span>
            <span className="fs-12 text-muted">Class Teacher</span>
          </>
        ),
      },
      {
        id: 'students',
        label: 'Students',
        align: 'center',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.students}</span>
            <span className="fs-12 text-muted">
              {row.subjects.length} {row.subjects.length === 1 ? 'subject' : 'subjects'}
            </span>
          </>
        ),
      },
      {
        id: 'mean',
        label: 'Average Score',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => {
          const growth = growthOf(row);
          return (
            <>
              <span className="fs-13 fw-semibold d-block">{meanOf(row)}</span>
              {isCompleteOf(row) ? (
                <>
                  <span className={`badge badge-soft-${gradeTint(gradeOf(meanOf(row)).grade)}`}>
                    {gradeOf(meanOf(row)).grade} · {gradeOf(meanOf(row)).remark}
                  </span>
                  {growth !== null ? (
                    <span className={`fs-12 d-block mt-1 text-${growth >= 0 ? 'success' : 'danger'}`}>
                      {growth > 0 ? '+' : ''}
                      {growth} vs Unit Test 1
                    </span>
                  ) : null}
                </>
              ) : (
                <>
                  <span className="fs-12 text-muted d-block">
                    {row.subjects.filter((subject) => subject.mean !== null).length} of {row.subjects.length}{' '}
                    subjects in
                  </span>
                  <span className="fs-12 text-muted d-block">provisional, {row.blockedBy?.split(' · ')[0]} open</span>
                </>
              )}
            </>
          );
        },
      },
      {
        id: 'pass',
        label: 'Pass %',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => {
          const pass = passPctOf(row);
          return pass === null ? (
            <>
              <span className="fs-13 fw-semibold d-block">—</span>
              <span className="fs-12 text-muted">a subject is still open</span>
            </>
          ) : (
            <>
              <span className="fs-13 fw-semibold d-block">{pass}%</span>
              <span className="fs-12 text-muted d-block">
                {row.cleared} of {row.students} cleared
              </span>
              <span className="fs-12 text-muted d-block">{belowPassOf(row)} below</span>
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
            <span className="fs-13 fw-semibold d-block">{row.attendancePct}%</span>
            <span className="fs-12 text-muted d-block">
              {avgPresentOf(row)} of {WORKING_DAYS} days
            </span>
            <span className={`badge badge-soft-${bandTint[attendanceBandOf(row)]} mt-1`}>
              {attendanceBandOf(row)}
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
          return row.rank === null ? (
            <>
              <span className="fs-13 fw-semibold d-block">—</span>
              <span className="fs-12 text-muted">Unit Test 1 was {row.previousRank}</span>
            </>
          ) : (
            <>
              <span className="fs-13 fw-semibold d-block">
                {row.rank} of {TOTAL_SECTIONS}
              </span>
              <span className="fs-12 text-muted d-block">sections in the school</span>
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
                : `${row.subjects.filter((s) => s.mean !== null).length} of ${row.subjects.length} subjects in`}
            </span>
          </>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<ClassSection>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.grade && row.grade !== filters.grade) return false;
      if (filters.section && row.section !== filters.section) return false;
      if (filters.subject && !row.subjects.some((subject) => subject.subject === filters.subject)) return false;
      if (filters.teacher && row.teacher !== filters.teacher) return false;
      if (filters.level && levelOf(row) !== filters.level) return false;
      if (filters.band && attendanceBandOf(row) !== (filters.band as AttendanceBand)) return false;
      return true;
    },
    quickMatch: (row, quick) => matchesRail(row, quick),
    viewMatch: (row, view) => matchesRail(row, view === 'all' ? null : view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'mean':
          return meanOf(b) - meanOf(a) || labelOf(a).localeCompare(labelOf(b));
        case 'pass':
          return (passPctOf(b) ?? -1) - (passPctOf(a) ?? -1) || labelOf(a).localeCompare(labelOf(b));
        case 'attendance':
          return b.attendancePct - a.attendancePct || labelOf(a).localeCompare(labelOf(b));
        case 'growth':
          return (growthOf(b) ?? -99) - (growthOf(a) ?? -99) || labelOf(a).localeCompare(labelOf(b));
        case 'class':
          return labelOf(a).localeCompare(labelOf(b));
        case 'rank':
        default:
          return (a.rank ?? 99) - (b.rank ?? 99) || labelOf(a).localeCompare(labelOf(b));
      }
    },
    defaultSort: 'rank',
    pageSize: 8,
  });

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Sections', icon: 'ti ti-layout-list', count: rows.length },
      {
        id: 'Excellent',
        label: 'Excellent',
        icon: 'ti ti-medal',
        count: rows.filter((row) => matchesRail(row, 'Excellent')).length,
      },
      {
        id: 'attention',
        label: 'Requiring Attention',
        icon: 'ti ti-alert-triangle',
        count: rows.filter((row) => matchesRail(row, 'attention')).length,
      },
      {
        id: 'declining',
        label: 'Declining Sections',
        icon: 'ti ti-trending-down',
        count: rows.filter((row) => matchesRail(row, 'declining')).length,
      },
      {
        id: 'attendance',
        label: 'Attendance Concern',
        icon: 'ti ti-calendar-x',
        count: rows.filter((row) => matchesRail(row, 'attendance')).length,
      },
      {
        id: 'open-marks',
        label: 'Open Marks Entry',
        icon: 'ti ti-clock-pause',
        count: rows.filter((row) => matchesRail(row, 'open-marks')).length,
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

  /* ------------------------------ Summary card ------------------------------- */

  const summary = useMemo<SummaryItem[]>(() => {
    const shown = workspace.visible;
    const placed = shown.filter(isCompleteOf);
    const meanScore =
      placed.length === 0
        ? null
        : Math.round((placed.reduce((total, row) => total + meanOf(row), 0) / placed.length) * 10) / 10;
    const withPass = shown.filter((row) => passPctOf(row) !== null);
    const passPct =
      withPass.length === 0
        ? null
        : Math.round((withPass.reduce((total, row) => total + (passPctOf(row) ?? 0), 0) / withPass.length) * 10) /
          10;
    const best = placed.reduce<ClassSection | null>(
      (top, row) => (top && meanOf(top) >= meanOf(row) ? top : row),
      null,
    );

    return [
      {
        id: 'total',
        tint: 'primary',
        icon: 'ti ti-school',
        label: 'Total Classes',
        value: `${shown.length}`,
        hint: `sections, academic year ${ACADEMIC_YEAR}`,
      },
      {
        id: 'score',
        tint: 'info',
        icon: 'ti ti-percentage',
        label: 'Average Class Score',
        value: meanScore === null ? '—' : `${meanScore}%`,
        hint: `${EXAM} across the sections shown`,
      },
      {
        id: 'pass',
        tint: 'success',
        icon: 'ti ti-circle-check',
        label: 'Pass Percentage',
        value: passPct === null ? '—' : `${passPct}%`,
        hint: 'at 33% and above',
      },
      {
        id: 'best',
        tint: 'purple',
        icon: 'ti ti-medal',
        label: 'Highest Performing Class',
        value: best ? labelOf(best) : '—',
        hint: best ? `${meanOf(best)} mean · rank ${best.rank}` : '',
      },
      {
        id: 'attention',
        tint: 'danger',
        icon: 'ti ti-alert-triangle',
        label: 'Requiring Attention',
        value: `${shown.filter(needsAttentionOf).length}`,
        hint: `below the ${ATTENTION_LINE}% section line`,
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

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} sections exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* --------------------------------- Detail ---------------------------------- */

  const renderDetail = (row: ClassSection) => {
    const strongest = strongestOf(row);
    const weakest = weakestOf(row);
    const growth = growthOf(row);

    return (
      <div className="row g-4">
        <div className="col-xl-3 col-md-6">
          <h3 className="fs-14 mb-3 fw-medium">
            <i className="ti ti-school text-primary me-1" />
            Class Overview
          </h3>
          <ul className="list-unstyled fs-12 mb-3">
            {[
              { label: 'Class / Section', value: labelOf(row) },
              { label: 'Class Teacher', value: row.teacher },
              { label: 'Students', value: `${row.students} on roll` },
              { label: 'Subjects', value: `${row.subjects.length} in the scheme` },
              { label: 'Exam / Term', value: EXAM },
              { label: 'Marks Closed', value: row.marksClosedOn },
              {
                label: 'Evaluated',
                value: row.evaluatedOn ? `${row.evaluatedOn} · ${evaluatedLabel(row)}` : 'Blocked',
              },
              { label: 'Section Report', value: row.reportRef ?? 'Not raised' },
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
              const grade = subjectGradeOf(subject);
              return (
                <li className="d-flex align-items-center justify-content-between py-1" key={subject.subject}>
                  <span className="text-muted">{subject.subject}</span>
                  <span className="fw-medium">
                    {subject.mean === null ? (
                      <span className="text-muted">Not entered</span>
                    ) : (
                      <>
                        {subject.mean}
                        <span className={`badge badge-soft-${gradeTint(grade as string)} ms-2`}>{grade}</span>
                      </>
                    )}
                  </span>
                </li>
              );
            })}
            {strongest && weakest ? (
              <>
                <li className="d-flex align-items-center justify-content-between py-1 border-top mt-1 pt-2">
                  <span className="text-muted">Strongest / Weakest</span>
                  <span className="fw-medium">
                    {strongest.subject} {strongest.mean} · {weakest.subject} {weakest.mean}
                  </span>
                </li>
                <li className="d-flex align-items-center justify-content-between py-1">
                  <span className="text-muted">Spread</span>
                  <span className="fw-medium">{spreadOf(row)} marks</span>
                </li>
              </>
            ) : null}
          </ul>

          <h6 className="details-heading">
            <i className="ti ti-users" />
            Top &amp; Bottom Performers
          </h6>
          <span className="fs-12 text-muted d-block mb-1">Top of the section</span>
          <ul className="list-unstyled fs-12 mb-2">
            {row.top.map((performer) => (
              <li className="d-flex align-items-center justify-content-between py-1" key={performer.name}>
                <span className="text-muted">{performer.name}</span>
                <span className="fw-medium">
                  {performer.rank !== null ? `Rank ${performer.rank} · ` : ''}
                  {performer.score}%
                </span>
              </li>
            ))}
          </ul>
          <span className="fs-12 text-muted d-block mb-1">Needs attention</span>
          <ul className="list-unstyled fs-12 mb-0">
            {row.bottom.map((performer) => (
              <li className="d-flex align-items-center justify-content-between py-1" key={performer.name}>
                <span className="text-muted">{performer.name}</span>
                <span className="fw-medium">
                  {performer.rank !== null ? `Rank ${performer.rank} · ` : ''}
                  {performer.score}%
                </span>
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
              { label: 'Section Attendance', value: `${row.attendancePct}%` },
              { label: 'Average Present', value: `${avgPresentOf(row)} days` },
              { label: 'Average Absent', value: `${avgAbsentOf(row)} days` },
              { label: 'Band', value: attendanceBandOf(row) },
              { label: 'Teaching Lost', value: `${teachingLostOf(row)} periods per student` },
              {
                label: 'Students Below Pass',
                value:
                  belowPassOf(row) === null
                    ? 'Placed with the section mean'
                    : `${belowPassOf(row)} of ${row.students}`,
              },
            ].map((item) => (
              <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                <span className="text-muted">{item.label}</span>
                <span className="fw-medium">{item.value}</span>
              </li>
            ))}
          </ul>

          <h6 className="details-heading">
            <i className="ti ti-arrows-diff" />
            Exam Comparison
          </h6>
          <ul className="list-unstyled fs-12 mb-0">
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Unit Test 1</span>
              <span className="fw-medium">
                {row.previousMean} · {row.previousRank} of {TOTAL_SECTIONS}
              </span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">{EXAM}</span>
              <span className="fw-medium">
                {meanOf(row)} · {row.rank === null ? 'provisional' : `${row.rank} of ${TOTAL_SECTIONS}`}
              </span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Unit Test 2</span>
              <span className="fw-medium text-muted">Awaiting marks</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Change</span>
              <span className="fw-medium">
                {growth === null ? 'Not placed' : `${growth > 0 ? '+' : ''}${growth} marks`}
              </span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Trend</span>
              <span className={`badge badge-soft-${trendTint[trendOf(row)]}`}>{trendOf(row)}</span>
            </li>
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
            <i className="ti ti-target-arrow" />
            Improvement Actions
          </h6>
          {row.actions.map((action) => (
            <div className="border rounded p-2 mb-2" key={action.title}>
              <div className="d-flex align-items-center justify-content-between gap-2">
                <h6 className="fs-13 mb-0 fw-medium">{action.title}</h6>
                <span className={`badge badge-soft-${actionTint[action.state]}`}>{action.state}</span>
              </div>
              <span className="fs-12 text-muted d-block">
                {action.owner} · {action.opened}
              </span>
              <p className="fs-12 text-muted mb-0 mt-1">{action.note}</p>
            </div>
          ))}
          <ul className="list-unstyled fs-12 mb-0">
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Open Actions</span>
              <span className="fw-medium">
                {openActionsOf(row)} active of {row.actions.length}
              </span>
            </li>
          </ul>

          <div className="d-flex gap-2 mt-3">
            {!isCompleteOf(row) ? (
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-sm flex-fill"
                onClick={() => openModal(row, 'remarks')}
              >
                <i className="ti ti-message-plus me-1" />
                Add Remark
              </button>
            ) : needsAttentionOf(row) ? (
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-sm flex-fill"
                onClick={() => openModal(row, 'generate')}
              >
                <i className="ti ti-refresh me-1" />
                Rerun Analytics
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-sm flex-fill"
                onClick={() => openModal(row, 'share')}
              >
                <i className="ti ti-share me-1" />
                Share Analytics
              </button>
            )}
            <button type="button" className="btn btn-primary btn-sm flex-fill" onClick={() => openPanel(row)}>
              <i className="ti ti-layout-sidebar-right-expand me-1" />
              Analytics Panel
            </button>
          </div>
        </div>
      </div>
    );
  };

  const rowActions = (row: ClassSection) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Class" ariaLabel="View Class" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Compare Classes" ariaLabel="Compare Classes" onClick={() => openModal(row, 'compare')}>
        <i className="ti ti-arrows-diff" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Generate Analytics" ariaLabel="Generate Analytics" onClick={() => openModal(row, 'generate')}>
        <i className="ti ti-player-play" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Add Remarks" ariaLabel="Add Remarks" onClick={() => openModal(row, 'remarks')}>
        <i className="ti ti-message-plus" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Export" ariaLabel="Export" onClick={() => openModal(row, 'export')}>
        <i className="ti ti-download" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Share Analytics" ariaLabel="Share Analytics" onClick={() => openModal(row, 'share')}>
        <i className="ti ti-share" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Analytics Panel" ariaLabel="Analytics Panel" onClick={() => openPanel(row)}>
        <i className="ti ti-layout-sidebar-right-expand" />
      </ActionLink>
    </div>
  );

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Class Analytics"
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
                    Compare Classes
                  </ActionLink>
                </div>
                <ExportMenu label="Export" onExport={exportAs} />
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'share')}
                  >
                    <i className="ti ti-share me-2" />
                    Share Analytics
                  </ActionLink>
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'generate')}
                  >
                    <i className="ti ti-player-play me-2" />
                    Generate Analytics
                  </ActionLink>
                </div>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={TOTAL_SECTIONS}
            workspaceId="classAnalytics"
            searchPlaceholder="Class, section, teacher or report reference…"
            searchLabel="Search sections"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="sections"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            footerVariant="card-foot"
            pageSizeOptions={[8, 25, 50]}
            footerInfoSuffix={`${EXAM} ${ACADEMIC_YEAR}`}
            onRefresh={() => {
              setRows(seededSections);
              push('Analytics refreshed');
            }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-school-off"
            emptyTitle="No sections match your filters"
            emptyBody="Clear a filter or widen the grade to see more sections."
            summary={summary}
          />
        </div>
      </div>
      {/* /Page Wrapper */}

      <ClassModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        row={modalRow}
        rows={workspace.visible}
        panelOpen={panelOpen}
        onClosePanel={() => setPanelOpen(false)}
        onToast={push}
        onAddRemark={addRemark}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="classAnalyticsToasts" />
    </>
  );
};

export default ClassAnalytics;
