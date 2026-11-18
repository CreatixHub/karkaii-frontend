import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import { ACADEMIC_YEAR_ID } from '@services/admissions/admissions.api';
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

const routes = all_routes;

const DAYS = [
  { n: 1, label: 'Monday' },
  { n: 2, label: 'Tuesday' },
  { n: 3, label: 'Wednesday' },
  { n: 4, label: 'Thursday' },
  { n: 5, label: 'Friday' },
  { n: 6, label: 'Saturday' },
];

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
const todayIso = () => new Date().toISOString().slice(0, 10);

interface Cell {
  day: number;
  dayLabel: string;
  slot: TimeSlot;
}

const ClassTimetable = () => {
  const { toasts, push, dismiss } = useToasts();

  const [classOptions, setClassOptions] = useState<SelectOption[]>([]);
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [assigned, setAssigned] = useState<SectionTeacherRow[]>([]);
  const [entries, setEntries] = useState<TimetableEntry[]>([]);

  const [booting, setBooting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [creatingSlots, setCreatingSlots] = useState(false);

  // The "add a lesson" panel
  const [cell, setCell] = useState<Cell | null>(null);
  const [pick, setPick] = useState(''); // id of a section_teachers row
  const [effectiveFrom, setEffectiveFrom] = useState(todayIso());
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
  const loadSection = useCallback(async (id: string) => {
    if (!id) {
      setAssigned([]);
      setEntries([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const [teachers, lessons] = await Promise.all([
        listSectionTeachers(id, ACADEMIC_YEAR_ID),
        listEntries(id, ACADEMIC_YEAR_ID),
      ]);
      setAssigned(teachers);
      setEntries(lessons);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load this timetable.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSection(sectionId);
  }, [sectionId, loadSection]);

  const onClassChange = (value: string) => {
    setClassId(value);
    setSectionId('');
    setAssigned([]);
    setEntries([]);
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

  /* -------------------------------- the grid -------------------------------- */
  const sortedSlots = useMemo(
    () => [...slots].filter((s) => s.isActive).sort((a, b) => a.sequence - b.sequence),
    [slots],
  );

  const byCell = useMemo(() => {
    const map = new Map<string, TimetableEntry>();
    for (const entry of entries) map.set(`${entry.dayOfWeek}:${entry.timeSlotId}`, entry);
    return map;
  }, [entries]);

  const lessonCount = entries.length;

  /* ------------------------------- add / remove ------------------------------ */
  const openCell = (next: Cell) => {
    setCell(next);
    setPick('');
    setFormError('');
    setEffectiveFrom(todayIso());
  };

  const saveLesson = async () => {
    if (!cell) return;
    const choice = assigned.find((a) => String(a.id) === pick);
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
        academicYearId: ACADEMIC_YEAR_ID,
        effectiveFrom,
      });
      setCell(null);
      await loadSection(sectionId);
      push('Lesson added.');
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
      await loadSection(sectionId);
      push('Lesson removed.');
    } catch (e) {
      push(e instanceof Error ? e.message : 'Could not remove the lesson.');
    }
  };

  /* --------------------------------- render --------------------------------- */
  const noSlots = !booting && sortedSlots.length === 0;

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

          {error ? (
            <div className="alert alert-danger" role="alert">
              {error}
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
                        onChange={(event) => setSectionId(event.target.value)}
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
                          {classLabel} — Section {sectionLabel} · {lessonCount} lessons
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
                    {assigned.length === 0 && !loading ? (
                      <div className="alert alert-warning">
                        No teachers are assigned to this section yet. Open a teacher&apos;s Edit page and add this class
                        and a subject under <b>Classes &amp; Subjects</b>, then come back here.{' '}
                        <Link to={routes.teacherGrid}>Go to teachers</Link>
                      </div>
                    ) : null}

                    <div className="table-responsive">
                      <table className="table table-bordered align-middle mb-0">
                        <thead>
                          <tr>
                            <th style={{ width: 150 }}>Period</th>
                            {DAYS.map((day) => (
                              <th key={day.n}>{day.label}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sortedSlots.map((slot) =>
                            slot.isBreak ? (
                              <tr key={String(slot.id)} className="table-light">
                                <td>
                                  <b>{slot.name}</b>
                                  <div className="fs-12 text-muted">
                                    {hhmm(slot.startsAt)} - {hhmm(slot.endsAt)}
                                  </div>
                                </td>
                                <td colSpan={DAYS.length} className="text-center text-muted">
                                  {slot.name}
                                </td>
                              </tr>
                            ) : (
                              <tr key={String(slot.id)}>
                                <td>
                                  <b>{slot.name}</b>
                                  <div className="fs-12 text-muted">
                                    {hhmm(slot.startsAt)} - {hhmm(slot.endsAt)}
                                  </div>
                                </td>
                                {DAYS.map((day) => {
                                  const entry = byCell.get(`${day.n}:${slot.id}`);
                                  return (
                                    <td key={day.n} style={{ minWidth: 150 }}>
                                      {entry ? (
                                        <div className="d-flex align-items-start justify-content-between gap-1">
                                          <div>
                                            <span className="badge badge-soft-info mb-1">{entry.subjectName}</span>
                                            <div className="fs-12 text-muted">{entry.teacherName ?? '—'}</div>
                                          </div>
                                          <button
                                            type="button"
                                            className="btn btn-link btn-sm text-danger p-0"
                                            aria-label={`Remove ${entry.subjectName}`}
                                            onClick={() => void removeLesson(entry)}
                                          >
                                            <i className="ti ti-x" />
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-outline-light bg-white w-100"
                                          disabled={loading || assigned.length === 0}
                                          onClick={() => openCell({ day: day.n, dayLabel: day.label, slot })}
                                        >
                                          <i className="ti ti-plus me-1" />
                                          Add
                                        </button>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>

      {/* Add a lesson */}
      {cell ? (
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