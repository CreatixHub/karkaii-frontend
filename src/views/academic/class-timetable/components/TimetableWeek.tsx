import type { TimeSlot, TimetableEntry } from '@services/timetable/timetable.api';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const clock = (time: string) => time.slice(0, 5);

interface Cell {
  day: number;
  dayLabel: string;
  slot: TimeSlot;
}

interface TimetableWeekProps {
  slots: TimeSlot[];
  entries: TimetableEntry[];
  plannerManaged: boolean;
  canAdd: boolean;
  onAdd: (cell: Cell) => void;
  onRemove: (entry: TimetableEntry) => void;
}

const cellKey = (day: number, slotId: TimeSlot['id']) => `${day}:${slotId}`;

function TimetableWeek({ slots, entries, plannerManaged, canAdd, onAdd, onRemove }: TimetableWeekProps) {
  const days = weekdays.map((label, index) => ({
    label,
    n: index + 1,
    slots: slots.filter((slot) => slot.days.includes(index + 1))
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt) || a.sequence - b.sequence),
  })).filter((day) => day.slots.length > 0);

  // Separate parallel subjects and titled activities while collapsing each lesson's teacher rows.
  const byCell = new Map<string, Map<string, TimetableEntry[]>>();
  for (const entry of entries) {
    const key = cellKey(entry.dayOfWeek, entry.timeSlotId);
    const lessons = byCell.get(key) ?? new Map<string, TimetableEntry[]>();
    const subject = entry.subjectId === null ? `title:${entry.title}` : `subject:${entry.subjectId}`;
    const lesson = entry.source === 'planner' ? subject : `manual:${entry.id}`;
    const rows = lessons.get(lesson) ?? [];
    rows.push(entry);
    lessons.set(lesson, rows);
    byCell.set(key, lessons);
  }

  const periodRows = Math.max(0, ...days.map((day) => day.slots.length));

  return (
    <div className="table-responsive">
      <table className="table table-bordered align-middle mb-0">
        <thead>
          <tr>
            {days.map((day) => <th scope="col" key={day.n}>{day.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: periodRows }, (_, row) => (
            <tr key={row}>
              {days.map((day) => {
                const slot = day.slots[row];
                if (!slot) return <td key={day.n} className="table-light" />;
                const lessons = byCell.get(cellKey(day.n, slot.id));
                return (
                  <td key={day.n} className={slot.isBreak ? 'table-light' : undefined} style={{ minWidth: 150 }}>
                    <div className="fw-semibold">{slot.name}</div>
                    <div className="fs-12 text-muted">{clock(slot.startsAt)} – {clock(slot.endsAt)}</div>
                    {lessons ? (
                      <ul className="list-unstyled d-grid gap-1 mt-2 mb-0">
                        {Array.from(lessons.values(), (rows) => {
                          const entry = rows[0];
                          const label = entry.subjectName ?? entry.title ?? 'Lesson';
                          const teachers = [...new Set(rows.flatMap((row) => row.teacherName ? [row.teacherName] : []))];
                          const rooms = [...new Set(rows.flatMap((row) => [
                            ...(row.classroomCode ? [row.classroomCode] : []), ...row.classroomCodes,
                          ]))];
                          return (
                            <li key={entry.id} className="border rounded p-2 d-flex justify-content-between gap-1">
                              <div>
                                <div className="fw-semibold text-primary">{label}</div>
                                {teachers.length > 0 && <div className="fs-12 text-muted">{teachers.join(', ')}</div>}
                                {rooms.length > 0 && <div className="fs-12 text-muted">{rooms.join(', ')}</div>}
                              </div>
                              {!plannerManaged && entry.source === 'manual' && (
                                <button
                                  type="button"
                                  className="btn btn-link btn-sm text-danger p-0 align-self-start"
                                  aria-label={`Remove ${label}`}
                                  onClick={() => onRemove(entry)}
                                >
                                  <i className="ti ti-x" aria-hidden="true" />
                                </button>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    ) : !slot.isBreak && !plannerManaged ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white w-100 mt-2"
                        disabled={!canAdd}
                        onClick={() => onAdd({ day: day.n, dayLabel: day.label, slot })}
                      >
                        <i className="ti ti-plus me-1" aria-hidden="true" />
                        Add
                      </button>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TimetableWeek;
