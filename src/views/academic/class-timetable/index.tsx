import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from '@components/ui/Offcanvas';
import RoleGuard from '@components/routing/RoleGuard';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useAcademicYear } from '@hooks/useAcademicYear';
import { useToasts } from '@hooks/useToasts';
import { listClassOptions } from '@services/staff/staff.api';
import type { SelectOption } from '@services/staff/staff.api';
import {
  createEntry,
  createTimeSlot,
  deleteEntry,
  listAllSections,
  listEntries,
  listSectionTeachers,
  listTimeSlots,
} from '@services/timetable/timetable.api';
import type { SectionRow, SectionTeacherRow, TimeSlot, TimetableEntry } from '@services/timetable/timetable.api';
import TimetableWeek from './components/TimetableWeek';

const routes = all_routes;

// The school day to start from: seven periods, two short breaks and a lunch.
const STANDARD_PERIODS = [
  { name: 'Period 1', startsAt: '09:00', endsAt: '09:45', isBreak: false },
  { name: 'Period 2', startsAt: '09:45', endsAt: '10:30', isBreak: false },
  { name: 'Short Break', startsAt: '10:30', endsAt: '10:45', isBreak: true },
  { name: 'Period 3', startsAt: '10:45', endsAt: '11:30', isBreak: false },
  { name: 'Period 4', startsAt: '11:30', endsAt: '12:15', isBreak: false },
  { name: 'Lunch', startsAt: '12:15', endsAt: '13:30', isBreak: true },
  { name: 'Period 5', startsAt: '13:30', endsAt: '14:15', isBreak: false },
  { name: 'Period 6', startsAt: '14:15', endsAt: '15:00', isBreak: false },
  { name: 'Short Break 2', startsAt: '15:00', endsAt: '15:15', isBreak: true },
  { name: 'Period 7', startsAt: '15:15', endsAt: '16:00', isBreak: false },
];

const hhmm = (t: string) => t.slice(0, 5);

interface Cell {
  day: number;
  dayLabel: string;
  slot: TimeSlot;
}

const ClassTimetable = () => {
  const { toasts, push, dismiss } = useToasts();
  const { yearId, loading: yearLoading, error: yearError } = useAcademicYear();

  const [classOptions, setClassOptions] = useState<SelectOption[]>([]);
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [schedule, setSchedule] = useState<(Awaited<ReturnType<typeof listEntries>> & {
    sectionId: string;
    yearId: string | number;
    assigned: SectionTeacherRow[];
  }) | null>(null);
  const [revision, setRevision] = useState(0);

  const [booting, setBooting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const selected = schedule?.sectionId === sectionId && schedule.yearId === yearId ? schedule : null;
  const busy = loading || yearLoading;
  const assigned = selected?.assigned ?? [];
  const plannerManaged = selected?.plannerManaged === true;

  const [creatingSlots, setCreatingSlots] = useState(false);

  // The "add a lesson" panel
  const [cell, setCell] = useState<Cell | null>(null);
  const [pick, setPick] = useState(''); // id of a section_teachers row
  const [effectiveFrom, setEffectiveFrom] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  /* ------------------------------- first load ------------------------------- */
  const loadBase = useCallback(async () => {
    setError('');
    try {
      const [classes, allSections, periods] = await Promise.all([
        listClassOptions(),
        listAllSections(),
        listTimeSlots(),
      ]);
      setClassOptions(classes);
      setSections(allSections);
      setSlots(periods);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load the timetable setup.');
    } finally {
      setBooting(false);
    }
  }, []);

  useEffect(() => {
    void loadBase();
  }, [loadBase]);

  const classLabel = classOptions.find((c) => c.value === classId)?.label ?? '';

  const sectionsOfClass = useMemo(
    () =>
      sections.filter(
        (s) =>
          (s.classId !== undefined && String(s.classId) === classId) ||
          (s.className !== undefined && classLabel !== '' && s.className === classLabel),
      ),
    [sections, classId, classLabel],
  );

  const sectionLabel = sectionsOfClass.find((s) => String(s.id) === sectionId)?.name ?? '';

  /* ------------------------- load the chosen section ------------------------ */
  useEffect(() => {
    if (!sectionId || !yearId) return;
    let cancelled = false;
    setLoading(true);
    setError('');
    Promise.all([listSectionTeachers(sectionId, yearId), listEntries(sectionId, yearId)])
      .then(([teachers, lessons]) => {
        if (!cancelled) setSchedule({ ...lessons, sectionId, yearId, assigned: teachers });
      })
      .catch((e) => {
        if (cancelled) return;
        setSchedule(null);
        setError(e instanceof Error ? e.message : 'Could not load this timetable.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sectionId, yearId, revision]);

  const onClassChange = (value: string) => {
    setClassId(value);
    setSectionId('');
    setError('');
    setCell(null);
  };

  // Pick the first section automatically once a class is chosen.
  useEffect(() => {
    if (classId && !sectionId && sectionsOfClass.length > 0) setSectionId(String(sectionsOfClass[0].id));
  }, [classId, sectionId, sectionsOfClass]);

  /* ------------------------------- the periods ------------------------------ */
  const createStandardPeriods = async () => {
    setCreatingSlots(true);
    setError('');
    try {
      for (let i = 0; i < STANDARD_PERIODS.length; i++) {
        await createTimeSlot({ ...STANDARD_PERIODS[i], sequence: i + 1 });
      }
      setSlots(await listTimeSlots());
      push('The school day has been set up.');
    } catch (e) {
      setSlots(await listTimeSlots().catch(() => []));
      setError(e instanceof Error ? e.message : 'Could not create the periods.');
    } finally {
      setCreatingSlots(false);
    }
  };

  const activeSlots = slots.filter((slot) => slot.isActive);
  const periodCount = new Set(selected?.entries.map((entry) => `${entry.dayOfWeek}:${entry.timeSlotId}`)).size;

  /* ------------------------------- add / remove ------------------------------ */
  const openCell = (next: Cell) => {
    setCell(next);
    setPick('');
    setFormError('');
    setEffectiveFrom(selected?.today ?? '');
  };

  const saveLesson = async () => {
    if (!cell || !yearId || !selected || plannerManaged || busy) return;
    const choice = assigned.find((a) => String(a.id) === pick);
    if (!effectiveFrom) {
      setFormError('Choose a start date.');
      return;
    }
    if (!choice) {
      setFormError('Choose a subject and teacher.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      await createEntry({
        sectionId,
        subjectId: choice.subjectId,
        teacherId: choice.teacherId,
        timeSlotId: cell.slot.id,
        dayOfWeek: cell.day,
        academicYearId: yearId,
        effectiveFrom,
      });
      setCell(null);
      setRevision((value) => value + 1);
      // The grid shows what is in effect today, so a lesson that starts later is not visible yet.
      const today = selected.today;
      push(today && effectiveFrom > today ? `Lesson added. It will appear in the timetable from ${effectiveFrom}.` : 'Lesson added.');
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Could not add the lesson.');
    } finally {
      setSaving(false);
    }
  };

  const removeLesson = async (entry: TimetableEntry) => {
    if (!window.confirm(`Remove ${entry.subjectName} from this period?`)) return;
    try {
      await deleteEntry(entry.id);
      setRevision((value) => value + 1);
      push('Lesson removed.');
    } catch (e) {
      push(e instanceof Error ? e.message : 'Could not remove the lesson.');
    }
  };

  /* --------------------------------- render --------------------------------- */
  const noSlots = !booting && activeSlots.length === 0;

  return (
    <>
      <div className="page-wrapper">
        <div className="content timetable-page">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Academic Time Table</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Academic</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Time Table
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          {error || yearError ? (
            <div className="alert alert-danger" role="alert">
              {error || yearError}
            </div>
          ) : null}

          {booting ? (
            <div className="card">
              <div className="card-body text-center text-muted py-5">Loading…</div>
            </div>
          ) : null}

          {/* No periods yet: set the school day up once */}
          {noSlots ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <h5 className="mb-2">Set up the school day</h5>
                <p className="text-muted mb-3">
                  Periods have not been created yet. Create a standard day (7 periods, two short breaks and a lunch,
                  09:00 to 16:00). You can change the times later.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={creatingSlots}
                  onClick={() => void createStandardPeriods()}
                >
                  {creatingSlots ? 'Creating…' : 'Create standard periods'}
                </button>
              </div>
            </div>
          ) : null}

          {!booting && !noSlots ? (
            <>
              {/* Class + section */}
              <div className="card mb-3">
                <div className="card-body">
                  <div className="row g-3 align-items-end">
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="tt-class">
                        Class
                      </label>
                      <select
                        id="tt-class"
                        className="form-select"
                        value={classId}
                        onChange={(event) => onClassChange(event.target.value)}
                      >
                        <option value="">Select a class</option>
                        {classOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label" htmlFor="tt-section">
                        Section
                      </label>
                      <select
                        id="tt-section"
                        className="form-select"
                        value={sectionId}
                        disabled={!classId}
                        onChange={(event) => {
                          setSectionId(event.target.value);
                          setCell(null);
                        }}
                      >
                        <option value="">{classId ? 'Select a section' : 'Choose a class first'}</option>
                        {sectionsOfClass.map((section) => (
                          <option key={String(section.id)} value={String(section.id)}>
                            {section.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-4 text-md-end">
                      {sectionId ? (
                        <span className="badge badge-soft-primary">
                          {classLabel} — Section {sectionLabel} · {periodCount} periods
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {classId && sectionsOfClass.length === 0 ? (
                    <p className="text-muted mb-0 mt-3">
                      This class has no section yet. Add a teacher to this class (Teachers → Edit → Classes &
                      Subjects) and a default section &quot;A&quot; is created automatically.
                    </p>
                  ) : null}
                </div>
              </div>

              {/* The weekly grid */}
              {sectionId ? (
                <div className="card">
                  <div className="card-body">
                    {selected && !plannerManaged && assigned.length === 0 && !busy ? (
                      <div className="alert alert-warning">
                        No teachers are assigned to this section yet. Open a teacher&apos;s Edit page and add this class
                        and a subject under <b>Classes &amp; Subjects</b>, then come back here.{' '}
                        <Link to={routes.teacherGrid}>Go to teachers</Link>
                      </div>
                    ) : null}

                    {plannerManaged ? (
                      <div className="alert alert-info">
                        Managed by the timetable planner.{' '}
                        <RoleGuard roles="admin" permission="timetable.edit">
                          <Link to={routes.timetablePlanner}>Open Timetable Planner</Link>
                        </RoleGuard>
                      </div>
                    ) : null}
                    {selected ? (
                      <TimetableWeek
                        slots={activeSlots}
                        entries={selected.entries}
                        plannerManaged={plannerManaged}
                        canAdd={!busy && assigned.length > 0}
                        onAdd={openCell}
                        onRemove={(entry) => void removeLesson(entry)}
                      />
                    ) : busy || !error ? (
                      <p className="text-muted mb-0" role="status">Loading timetable…</p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      {/* Add a lesson */}
      {cell && selected && !plannerManaged ? (
        <Offcanvas open onClose={() => setCell(null)} title="Add lesson" labelledById="tt_add_label">
          <p className="text-muted">
            {classLabel} — Section {sectionLabel}
            <br />
            {cell.dayLabel}, {cell.slot.name} ({hhmm(cell.slot.startsAt)} - {hhmm(cell.slot.endsAt)})
          </p>

          {formError ? (
            <div className="alert alert-danger" role="alert">
              {formError}
            </div>
          ) : null}

          <div className="mb-3">
            <label className="form-label" htmlFor="tt-pick">
              Subject — Teacher
            </label>
            <select id="tt-pick" className="form-select" value={pick} onChange={(event) => setPick(event.target.value)}>
              <option value="">Select</option>
              {assigned.map((a) => (
                <option key={String(a.id)} value={String(a.id)}>
                  {a.subjectName} — {a.teacherName ?? 'Teacher'}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="tt-from">
              Starts from
            </label>
            <input
              id="tt-from"
              type="date"
              className="form-control"
              value={effectiveFrom}
              onChange={(event) => setEffectiveFrom(event.target.value)}
            />
          </div>

          <div className="d-flex gap-2">
            <button type="button" className="btn btn-light flex-fill" onClick={() => setCell(null)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary flex-fill"
              disabled={saving}
              onClick={() => void saveLesson()}
            >
              {saving ? 'Saving…' : 'Add lesson'}
            </button>
          </div>
        </Offcanvas>
      ) : null}

      <ToastStack toasts={toasts} onDismiss={dismiss} id="cttToasts" />
    </>
  );
};

export default ClassTimetable;