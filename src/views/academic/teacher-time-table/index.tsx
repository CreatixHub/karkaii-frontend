import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import { ACADEMIC_YEAR_ID } from '@services/admissions/admissions.api';
import {
  getMyAssignments,
  getMyStaff,
  getMyTimetable,
  getStaffRecord,
  listStaffAssignments,
} from '@services/staff/staff.api';
import type { MyAssignment, MyTimetableEntry } from '@services/staff/staff.api';
import { listTeachers } from '@services/staff/staff.list';
import type { StaffListItem } from '@services/staff/staff.list';
import { listTeacherLessons } from '@services/timetable/teacher.lessons';

const routes = all_routes;

const DAYS = [
  { n: 1, name: 'Monday' },
  { n: 2, name: 'Tuesday' },
  { n: 3, name: 'Wednesday' },
  { n: 4, name: 'Thursday' },
  { n: 5, name: 'Friday' },
  { n: 6, name: 'Saturday' },
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
    subject: (pick(entry.subject, ['name', 'subjectName', 'code']) as string | undefined) ?? 'Lesson',
    grade: gradeOf(entry.className, entry.sectionName),
  };
}

const uniq = (items: string[]) => [...new Set(items.filter(Boolean))];

/* ---------------------------------- page ---------------------------------- */

const TeacherTimeTable = () => {
  const [searchParams] = useSearchParams();
  const idParam = searchParams.get('id') ?? '';

  const [mode, setMode] = useState<Mode>(idParam ? 'admin' : 'detect');
  const [teacherId, setTeacherId] = useState(idParam);
  const [teachers, setTeachers] = useState<StaffListItem[]>([]);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [assignments, setAssignments] = useState<MyAssignment[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);

  const [state, setState] = useState<Load>('loading');
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0); // bumps to reload

  const reload = useCallback(() => setTick((n) => n + 1), []);

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

    let cancelled = false;
    setState('loading');
    setError('');

    (async () => {
      try {
        if (mode === 'mine') {
          const [staff, mine, assigned] = await Promise.all([
            getMyStaff(),
            getMyTimetable(),
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
          setPeriods(mine.map(fromMine).filter((p): p is Period => p !== null));
        } else {
          const [record, lessons, assigned] = await Promise.all([
            getStaffRecord(teacherId),
            listTeacherLessons(teacherId, ACADEMIC_YEAR_ID),
            listStaffAssignments(teacherId).catch(() => [] as MyAssignment[]),
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
          setPeriods(
            lessons
              .map((row): Period | null => {
                const start = toMin(row.startsAt);
                const end = toMin(row.endsAt);
                if (start === null || end === null || end <= start) return null;
                return {
                  id: String(row.id),
                  day: row.dayOfWeek,
                  start,
                  end,
                  subject: row.subjectName,
                  grade: gradeOf(row.className, row.sectionName),
                };
              })
              .filter((p): p is Period => p !== null),
          );
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
  }, [mode, teacherId, tick]);

  /* -------------------------------- derived -------------------------------- */
  const byDay = useMemo(() => {
    const map = new Map<number, Period[]>();
    for (const day of DAYS) map.set(day.n, []);
    for (const period of periods) map.get(period.day)?.push(period);
    for (const list of map.values()) list.sort((a, b) => a.start - b.start);
    return map;
  }, [periods]);

  const weeklyMinutes = periods.reduce((sum, p) => sum + (p.end - p.start), 0);
  const subjectNames = uniq(assignments.map((a) => String(a.subject?.name ?? '')));
  const classNames = uniq(assignments.map((a) => a.className));
  const noLessons = state === 'ready' && periods.length === 0;
  const today = new Date().getDay() === 0 ? 7 : new Date().getDay();

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

        {/* Teacher header */}
        {state === 'ready' && profile ? (
          <div className="card card-hover mb-3">
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
          <div className="card mb-0">
            <div className="card-body">
              <div className="timetable-grid">
                {DAYS.map((day) => {
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
          <div className="card mb-0">
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