import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import { useAcademicYear } from '@hooks/useAcademicYear';
import {
  getMyAssignments,
  getMyStaff,
  getMyTimetableSchedule,
  getStaffRecord,
  listStaffAssignments,
} from '@services/staff/staff.api';
import type { MyAssignment, MyTimetableEntry } from '@services/staff/staff.api';
import { listTeachers } from '@services/staff/staff.list';
import type { StaffListItem } from '@services/staff/staff.list';
import { listTeacherLessons } from '@services/timetable/teacher.lessons';
import { schoolWeekday } from '@services/timetable/timetable.api';
import './mobile-schedule.css';

const routes = all_routes;

const DAYS = [
  { n: 1, name: 'Monday' },
  { n: 2, name: 'Tuesday' },
  { n: 3, name: 'Wednesday' },
  { n: 4, name: 'Thursday' },
  { n: 5, name: 'Friday' },
  { n: 6, name: 'Saturday' },
  { n: 7, name: 'Sunday' },
];

const TONES = ['primary', 'info', 'success', 'warning', 'danger', 'secondary'];

/** One lesson, whichever endpoint it came from. */
interface Period {
  id: string;
  day: number;
  start: number; // minutes after midnight
  end: number;
  subject: string;
  grade: string;
  classNames: string[];
  roomCodes: string[];
  sharedSlot?: string;
}

interface Profile {
  id: string | number;
  name: string;
  code: string;
  phone: string | null;
  qualification: string | null;
  status: string | null;
}

type Mode = 'detect' | 'mine' | 'admin';
type Load = 'loading' | 'ready' | 'error';

/* --------------------------------- helpers -------------------------------- */

const toMin = (value: unknown): number | null => {
  if (typeof value !== 'string') return null;
  const m = /^(\d{1,2}):(\d{2})/.exec(value.trim());
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

const hhmm = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

const pick = (obj: Record<string, unknown> | null | undefined, keys: string[]): unknown => {
  if (!obj) return undefined;
  for (const key of keys) if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  return undefined;
};

const duration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
};

const toneOf = (subject: string) => {
  let hash = 0;
  for (const ch of subject) hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  return TONES[hash % TONES.length];
};

const gradeOf = (className?: string, sectionName?: string) =>
  [className, sectionName].filter(Boolean).join(' - ') || '—';

/** /staff/me/timetable entry -> Period (null when the slot has no readable times). */
function fromMine(entry: MyTimetableEntry): Period | null {
  const start = toMin(pick(entry.timeSlot, ['startsAt', 'starts_at', 'startTime', 'start']));
  const end = toMin(pick(entry.timeSlot, ['endsAt', 'ends_at', 'endTime', 'end']));
  if (start === null || end === null || end <= start) return null;
  return {
    id: String(entry.id),
    day: entry.dayOfWeek,
    start,
    end,
    subject: (pick(entry.subject, ['name', 'subjectName', 'code']) as string | undefined) ?? entry.title ?? 'Lesson',
    grade: gradeOf(entry.className, entry.sectionName),
    classNames: [entry.className],
    roomCodes: roomCodesOf(entry.classroom?.code, entry.classroomCodes),
    sharedSlot: entry.source === 'planner' && entry.timeSlot.id != null
      ? sharedSlotKey(entry.dayOfWeek, String(entry.timeSlot.id), entry.subjectId, entry.title)
      : undefined,
  };
}

const uniq = (items: string[]) => [...new Set(items.filter(Boolean))];

const roomCodesOf = (primary: string | null | undefined, others: string[] = []) =>
  uniq([primary ?? '', ...others]);

function sharedSlotKey(day: number, slot: string, subjectId: string | number | null, title: string | null) {
  return JSON.stringify([day, slot, subjectId === null ? null : String(subjectId), subjectId === null ? title : null]);
}

function combineSharedPeriods(periods: Period[]): Period[] {
  const groups = new Map<string, { period: Period; grades: Set<string>; classes: Set<string>; rooms: Set<string> }>();
  for (const period of periods) {
    const key = period.sharedSlot ?? period.id;
    const group = groups.get(key);
    if (group) {
      group.grades.add(period.grade);
      period.classNames.forEach((name) => group.classes.add(name));
      period.roomCodes.forEach((code) => group.rooms.add(code));
    } else {
      groups.set(key, { period, grades: new Set([period.grade]), classes: new Set(period.classNames), rooms: new Set(period.roomCodes) });
    }
  }
  return Array.from(groups.values(), ({ period, grades, classes, rooms }) => ({
    ...period, grade: [...grades].join(', '), classNames: [...classes], roomCodes: [...rooms],
  }));
}

type ScheduleDay = (typeof DAYS)[number];

function MobileDay({ day, today, lessons }: { day: ScheduleDay; today: number | null; lessons: Period[] }) {
  return (
    <>
      <div className="teacher-mobile-day-heading">
        <h4>{day.name}</h4>
        {day.n === today && <span className="teacher-mobile-today">Today</span>}
        <span className="teacher-mobile-period-count">{lessons.length} {lessons.length === 1 ? 'period' : 'periods'}</span>
      </div>
      {lessons.length === 0 ? (
        <p className="teacher-mobile-empty">No lessons scheduled</p>
      ) : (
        <ul className="teacher-mobile-lessons">
          {lessons.map((lesson) => (
            <li className="teacher-mobile-lesson" key={lesson.id}>
              <span className="teacher-mobile-lesson-time">{hhmm(lesson.start)} – {hhmm(lesson.end)}</span>
              <div className="teacher-mobile-lesson-info">
                <strong>{lesson.subject}</strong>
                <span>{lesson.grade}</span>
                {lesson.roomCodes.length > 0 && <span>Room: {lesson.roomCodes.join(', ')}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

interface MobileScheduleProps {
  profile: Profile;
  byDay: Map<number, Period[]>;
  today: number | null;
  subjectNames: string[];
  classNames: string[];
  weeklyMinutes: number;
  totalLessons: number;
}

function MobileSchedule({ profile, byDay, today, subjectNames, classNames, weeklyMinutes, totalLessons }: MobileScheduleProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showWeek, setShowWeek] = useState(false);
  const id = useId();
  const tabs = DAYS.filter(({ n }) => n <= 5 || n === today || (byDay.get(n)?.length ?? 0) > 0);

  const activeDay = tabs.some(({ n }) => n === selected) ? selected : today ?? 1;

  function handleTabKeys(event: KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex(({ n }) => n === activeDay);
    let nextIndex: number;
    switch (event.key) {
      case 'ArrowLeft':
        nextIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case 'ArrowRight':
        nextIndex = (index + 1) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    setSelected(tabs[nextIndex].n);
    event.currentTarget.querySelectorAll<HTMLButtonElement>('button')[nextIndex]?.focus();
  }

  return (
    <div className="teacher-mobile-schedule d-md-none">
      <div className="teacher-mobile-schedule-header">
        <h4 className="teacher-mobile-name">{profile.name}</h4>
        <button
          type="button"
          className="teacher-mobile-action teacher-mobile-week-toggle"
          aria-expanded={showWeek}
          aria-controls={id + '-week'}
          onClick={() => setShowWeek((value) => !value)}
        >
          <i className={showWeek ? 'ti ti-calendar-event' : 'ti ti-calendar-week'} aria-hidden="true" />
          {showWeek ? 'Day view' : 'Full week'}
        </button>
        <details className="teacher-mobile-profile">
          <summary className="teacher-mobile-action">
            <i className="ti ti-user" aria-hidden="true" />
            Profile
            <i className="ti ti-chevron-down teacher-mobile-profile-chevron" aria-hidden="true" />
          </summary>
          <div className="teacher-mobile-profile-content">
            <dl>
              <dt>Employee no.</dt><dd>{profile.code || '—'}</dd>
              <dt>Qualification</dt><dd>{profile.qualification || '—'}</dd>
              <dt>Subjects</dt><dd>{subjectNames.join(', ') || '—'}</dd>
              <dt>Classes</dt><dd>{classNames.join(', ') || '—'}</dd>
              <dt>Weekly teaching</dt><dd>{totalLessons} periods · {duration(weeklyMinutes)}</dd>
            </dl>
            <div className="d-flex flex-wrap gap-2">
              {profile.phone && <a className="teacher-mobile-action" href={'tel:' + profile.phone}>Call</a>}
              <Link className="teacher-mobile-action" to={routes.teacherDetails + '?id=' + profile.id}>View profile</Link>
            </div>
          </div>
        </details>
      </div>

      <div id={id + '-week'} className="teacher-mobile-week" hidden={!showWeek}>
        {showWeek && tabs.map((weekDay) => (
          <section className="teacher-mobile-day" key={weekDay.n}>
            <MobileDay day={weekDay} today={today} lessons={byDay.get(weekDay.n) ?? []} />
          </section>
        ))}
      </div>

      {!showWeek && (
        <>
          <div className="teacher-mobile-tabs" role="tablist" aria-label="Timetable days" onKeyDown={handleTabKeys}>
            {tabs.map((tab) => (
              <button
                key={tab.n}
                type="button"
                role="tab"
                id={id + '-tab-' + tab.n}
                aria-label={tab.name}
                aria-selected={activeDay === tab.n}
                aria-current={today === tab.n ? 'date' : undefined}
                aria-controls={id + '-day-' + tab.n}
                tabIndex={activeDay === tab.n ? 0 : -1}
                onClick={() => setSelected(tab.n)}
              >
                {tab.name.slice(0, 3)}
              </button>
            ))}
          </div>
          {tabs.map((tab) => (
            <section
              className="teacher-mobile-day"
              key={tab.n}
              role="tabpanel"
              tabIndex={0}
              id={id + '-day-' + tab.n}
              aria-labelledby={id + '-tab-' + tab.n}
              hidden={activeDay !== tab.n}
            >
              {activeDay === tab.n && <MobileDay day={tab} today={today} lessons={byDay.get(tab.n) ?? []} />}
            </section>
          ))}
        </>
      )}
    </div>
  );
}

/* ---------------------------------- page ---------------------------------- */

const TeacherTimeTable = () => {
  const [searchParams] = useSearchParams();
  const idParam = searchParams.get('id') ?? '';
  const { yearId, error: yearError } = useAcademicYear();

  const [mode, setMode] = useState<Mode>(idParam ? 'admin' : 'detect');
  const [teacherId, setTeacherId] = useState(idParam);
  const [teachers, setTeachers] = useState<StaffListItem[]>([]);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [assignments, setAssignments] = useState<MyAssignment[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [today, setToday] = useState<number | null>(null);

  const [state, setState] = useState<Load>('loading');
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0); // bumps to reload

  const reload = useCallback(() => setTick((n) => n + 1), []);
  // The year only matters in admin mode; in teacher mode it must not re-run the data load when it arrives.
  const adminYearId = mode === 'admin' ? yearId : null;
  const adminYearError = mode === 'admin' ? yearError : '';

  /* ----- detect whether this is a teacher (own timetable) or an admin ----- */
  useEffect(() => {
    if (idParam) {
      setMode('admin');
      setTeacherId(idParam);
      return;
    }
    let cancelled = false;
    setState('loading');
    getMyStaff()
      .then(() => {
        if (!cancelled) setMode('mine');
      })
      .catch(() => {
        if (!cancelled) setMode('admin');
      });
    return () => {
      cancelled = true;
    };
  }, [idParam]);

  /* ------------------------ admin: the teacher picker ----------------------- */
  useEffect(() => {
    if (mode !== 'admin') return;
    listTeachers()
      .then(setTeachers)
      .catch(() => setTeachers([]));
  }, [mode]);

  /* ------------------------------ load the data ----------------------------- */
  useEffect(() => {
    if (mode === 'detect') return;
    if (mode === 'admin' && !teacherId) {
      setProfile(null);
      setAssignments([]);
      setPeriods([]);
      setState('ready');
      return;
    }
    // Only the admin view is scoped to the academic year: wait for it before asking for lessons.
    if (mode === 'admin' && !adminYearId) {
      if (adminYearError) {
        setError(adminYearError);
        setState('error');
      } else {
        setState('loading');
      }
      return;
    }

    let cancelled = false;
    setState('loading');
    setError('');

    (async () => {
      try {
        if (mode === 'mine') {
          const [staff, mine, assigned] = await Promise.all([
            getMyStaff(),
            getMyTimetableSchedule(),
            getMyAssignments().catch(() => [] as MyAssignment[]),
          ]);
          if (cancelled) return;
          setProfile({
            id: staff.id,
            name: staff.fullName ?? ([staff.firstName, staff.lastName].filter(Boolean).join(' ') || '—'),
            code: staff.employeeNo,
            phone: staff.phone,
            qualification: staff.qualification,
            status: null,
          });
          setAssignments(assigned);
          setPeriods(combineSharedPeriods(mine.data.map(fromMine).filter((p): p is Period => p !== null)));
          setToday(schoolWeekday(typeof mine.meta?.today === 'string' ? mine.meta.today : null));
        } else {
          if (!adminYearId) return; // unreachable: the admin view waits for the year above
          const [record, lessons, assigned] = await Promise.all([
            getStaffRecord(teacherId),
            listTeacherLessons(teacherId, adminYearId),
            listStaffAssignments(teacherId, adminYearId).catch(() => [] as MyAssignment[]),
          ]);
          if (cancelled) return;
          setProfile({
            id: record.id,
            name: [record.firstName, record.lastName].filter(Boolean).join(' ') || '—',
            code: record.employeeNo,
            phone: record.phone,
            qualification: record.qualification,
            status: record.status,
          });
          setAssignments(assigned);
          setPeriods(combineSharedPeriods(
            lessons.entries
              .map((row): Period | null => {
                const start = toMin(row.startsAt);
                const end = toMin(row.endsAt);
                if (start === null || end === null || end <= start) return null;
                return {
                  id: String(row.id),
                  day: row.dayOfWeek,
                  start,
                  end,
                  subject: row.subjectName ?? row.title ?? 'Lesson',
                  grade: gradeOf(row.className, row.sectionName),
                  classNames: [row.className],
                  roomCodes: roomCodesOf(row.classroomCode, row.classroomCodes),
                  sharedSlot: row.source === 'planner'
                    ? sharedSlotKey(row.dayOfWeek, String(row.timeSlotId), row.subjectId, row.title)
                    : undefined,
                };
              })
              .filter((p): p is Period => p !== null),
          ));
          setToday(schoolWeekday(lessons.today));
        }
        setState('ready');
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Could not load the timetable.');
        setState('error');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, teacherId, tick, adminYearId, adminYearError]);

  /* -------------------------------- derived -------------------------------- */
  const byDay = useMemo(() => {
    const map = new Map<number, Period[]>();
    for (const day of DAYS) map.set(day.n, []);
    for (const period of periods) map.get(period.day)?.push(period);
    for (const list of map.values()) list.sort((a, b) => a.start - b.start);
    return map;
  }, [periods]);

  const weeklyMinutes = periods.reduce((sum, p) => sum + (p.end - p.start), 0);
  const subjectNames = uniq([...assignments.map((a) => String(a.subject?.name ?? '')), ...periods.map((p) => p.subject)]);
  const classNames = uniq([...assignments.map((a) => a.className), ...periods.flatMap((p) => p.classNames)]);
  const noLessons = state === 'ready' && periods.length === 0;
  const desktopCard = mode === 'mine' ? ' d-none d-md-block' : '';
  const desktopDays = DAYS.filter(({ n }) => n <= 6 || (byDay.get(n)?.length ?? 0) > 0);

  return (
    <div className="page-wrapper">
      <div className="content timetable-page content-two">
        {/* Page Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Teacher Time Table</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to={routes.teacherGrid}>Teachers</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Time Table
                </li>
              </ol>
            </nav>
          </div>
          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
            <button
              type="button"
              className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
              onClick={reload}
            >
              <i className="ti ti-refresh me-1" />
              Refresh
            </button>
            {mode === 'admin' ? (
              <Link to={routes.classTimetable} className="btn btn-primary mb-2 d-inline-flex align-items-center">
                <i className="ti ti-square-rounded-plus me-1" />
                Assign Timetable
              </Link>
            ) : null}
          </div>
        </div>

        {/* Admin: choose a teacher */}
        {mode === 'admin' ? (
          <div className="card mb-3">
            <div className="card-body">
              <label className="form-label" htmlFor="ttt-teacher">
                Teacher
              </label>
              <select
                id="ttt-teacher"
                className="form-select"
                value={teacherId}
                onChange={(event) => setTeacherId(event.target.value)}
              >
                <option value="">Select a teacher</option>
                {teachers.map((t) => (
                  <option key={String(t.id)} value={String(t.id)}>
                    {t.fullName} ({t.employeeNo})
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}

        {state === 'error' ? (
          <div className="alert alert-danger d-flex align-items-center justify-content-between" role="alert">
            <span>{error || 'Could not load the timetable.'}</span>
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={reload}>
              Try again
            </button>
          </div>
        ) : null}

        {state === 'loading' || mode === 'detect' ? (
          <div className="card">
            <div className="card-body text-center text-muted py-5">Loading…</div>
          </div>
        ) : null}

        {mode === 'admin' && !teacherId && state === 'ready' ? (
          <div className="card">
            <div className="card-body text-center text-muted py-5">
              Choose a teacher to see their weekly timetable.
            </div>
          </div>
        ) : null}

        {mode === 'mine' && state === 'ready' && profile ? (
          <MobileSchedule
            profile={profile}
            byDay={byDay}
            today={today}
            subjectNames={subjectNames}
            classNames={classNames}
            weeklyMinutes={weeklyMinutes}
            totalLessons={periods.length}
          />
        ) : null}

        {/* Teacher header */}
        {state === 'ready' && profile ? (
          <div className={'card card-hover mb-3' + desktopCard}>
            <div className="card-body">
              <div className="d-xl-flex align-items-center justify-content-between">
                <div className="d-sm-flex align-items-center mb-3 mb-xl-0">
                  <span className="avatar avatar-xxl rounded flex-shrink-0 me-sm-3 mb-3 mb-sm-0 bg-light fw-bold text-dark d-flex align-items-center justify-content-center">
                    {profile.name
                      .split(/\s+/)
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0]?.toUpperCase() ?? '')
                      .join('') || '?'}
                  </span>
                  <div>
                    <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
                      <h4 className="mb-0">{profile.name}</h4>
                      <span className="badge bg-primary-transparent text-primary">{profile.code}</span>
                      {profile.status ? (
                        <span
                          className={`badge ${
                            profile.status === 'active' ? 'badge-soft-success' : 'badge-soft-warning'
                          }`}
                        >
                          {profile.status === 'active' ? 'Active' : profile.status}
                        </span>
                      ) : null}
                    </div>
                    <div className="d-flex align-items-center flex-wrap gap-3 gap-xl-4 text-muted fs-13 mb-3">
                      <span>
                        <i className="ti ti-certificate me-1" />
                        Qualification:{' '}
                        <span className="text-dark fw-medium">{profile.qualification || '—'}</span>
                      </span>
                      <span>
                        <i className="ti ti-book me-1" />
                        Subjects:{' '}
                        <span className="text-dark fw-medium">
                          {subjectNames.length > 0 ? subjectNames.join(', ') : '—'}
                        </span>
                      </span>
                      <span>
                        <i className="ti ti-users me-1" />
                        Classes:{' '}
                        <span className="text-dark fw-medium">
                          {classNames.length > 0 ? classNames.join(', ') : '—'}
                        </span>
                      </span>
                    </div>
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      {profile.phone ? (
                        <a
                          href={`tel:${profile.phone}`}
                          className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        >
                          <i className="ti ti-phone me-1" />
                          Call
                        </a>
                      ) : null}
                      <Link
                        to={`${routes.teacherDetails}?id=${profile.id}`}
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                      >
                        <i className="ti ti-user me-1" />
                        Profile
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center flex-wrap gap-4">
                  <div className="stat-fact">
                    <span className="stat-fact-icon bg-primary-transparent text-primary">
                      <i className="ti ti-clock-hour-9" />
                    </span>
                    <div>
                      <div className="stat-fact-value">{periods.length > 0 ? duration(weeklyMinutes) : '—'}</div>
                      <div className="stat-fact-label">Weekly Teaching</div>
                    </div>
                  </div>
                  <div className="stat-fact">
                    <span className="stat-fact-icon bg-success-transparent text-success">
                      <i className="ti ti-calendar-week" />
                    </span>
                    <div>
                      <div className="stat-fact-value">{periods.length}</div>
                      <div className="stat-fact-label">Lessons / Week</div>
                    </div>
                  </div>
                  <div className="stat-fact">
                    <span className="stat-fact-icon bg-info-transparent text-info">
                      <i className="ti ti-users" />
                    </span>
                    <div>
                      <div className="stat-fact-value">{classNames.length}</div>
                      <div className="stat-fact-label">Classes Assigned</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Weekly grid */}
        {state === 'ready' && profile && !noLessons ? (
          <div className={'card mb-0' + desktopCard}>
            <div className="card-body">
              <div className="timetable-grid">
                {desktopDays.map((day) => {
                  const lessons = byDay.get(day.n) ?? [];
                  return (
                    <div className="timetable-day" key={day.n}>
                      <div className="timetable-day-head">
                        <span>
                          <i className="ti ti-calendar-week me-1" />
                          {day.name}
                          {day.n === today ? <span className="badge badge-soft-primary ms-2">Today</span> : null}
                        </span>
                        <span className="timetable-day-count">{lessons.length} periods</span>
                      </div>
                      {lessons.length === 0 ? <p className="text-muted fs-13 mb-0 p-2">No lessons</p> : null}
                      {lessons.map((lesson) => {
                        const tone = toneOf(lesson.subject);
                        return (
                          <div className={`timetable-slot bg-transparent-${tone}`} key={lesson.id}>
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <span className={`timetable-slot-icon text-${tone}`}>
                                <i className="ti ti-book" />
                              </span>
                              <div className="overflow-hidden">
                                <h6 className="timetable-slot-sub mb-0 text-truncate">{lesson.subject}</h6>
                                <span className="timetable-slot-time">
                                  <i className="ti ti-clock me-1" />
                                  {hhmm(lesson.start)} - {hhmm(lesson.end)}
                                </span>
                              </div>
                            </div>
                            <div className="d-flex align-items-center flex-wrap gap-2">
                              <span className="timetable-slot-meta">
                                <i className="ti ti-users me-1" />
                                {lesson.grade}
                              </span>
                              {lesson.roomCodes.length > 0 && (
                                <span className="timetable-slot-meta">
                                  <i className="ti ti-map-pin me-1" aria-hidden="true" />
                                  Room: {lesson.roomCodes.join(', ')}
                                </span>
                              )}
                              <span className="timetable-slot-meta">
                                <i className="ti ti-hourglass me-1" />
                                {lesson.end - lesson.start} min
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {/* No lessons yet */}
        {noLessons && profile ? (
          <div className={'card mb-0' + desktopCard}>
            <div className="card-body text-center py-5">
              <div className="empty-state-art">
                <i className="ti ti-calendar-off" />
              </div>
              <h5 className="mb-1">No Teaching Schedule Found</h5>
              <p className="text-muted mb-3">
                {mode === 'admin'
                  ? 'This teacher has no lessons yet. Add them under Academic → Time Table.'
                  : 'You have no lessons scheduled yet. The school will add them to your timetable.'}
              </p>
              {mode === 'admin' ? (
                <Link to={routes.classTimetable} className="btn btn-primary d-inline-flex align-items-center mx-auto">
                  <i className="ti ti-square-rounded-plus me-1" />
                  Open Time Table
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TeacherTimeTable;