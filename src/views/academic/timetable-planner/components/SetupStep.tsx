import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DAY_SHORT,
  plannerMessage,
  sectionLabel,
  teachingPeriods,
} from '@services/timetable/planner.api';
import type { AvailabilityKind, BlockedSlot } from '@services/timetable/planner.api';
import type { StepProps } from '../types';

const KINDS: { id: AvailabilityKind; label: string; hint: string }[] = [
  { id: 'staff', label: 'Teachers', hint: 'Part-time days, admin duties, anything that keeps a teacher out of class.' },
  { id: 'section', label: 'Classes', hint: 'Assemblies, sports slots, exam prep — periods the whole class is busy.' },
  { id: 'room', label: 'Rooms', hint: 'Maintenance or events that take a room out of use.' },
];

const SetupStep = ({ api, state, reload, notify, setEdits }: StepProps) => {
  const [groupName, setGroupName] = useState('');
  const [roomBusy, setRoomBusy] = useState(false);

  const [kind, setKind] = useState<AvailabilityKind>('staff');
  const [entityId, setEntityId] = useState('');
  const [blocked, setBlocked] = useState<BlockedSlot[]>([]);
  const [saving, setSaving] = useState(false);

  const entities = useMemo(() => {
    if (kind === 'staff') {
      const subjectNames = new Map(state.lookups.subjects.map((x) => [x.id, x.name]));
      // Name · primary subject · periods planned / weekly maximum (the maximum only when one is set).
      return state.lookups.staff.map((s) => {
        const subject = s.primarySubjectId ? subjectNames.get(s.primarySubjectId) : undefined;
        const load = s.maxPeriodsPerWeek ? `${s.plannedPeriods ?? 0}/${s.maxPeriodsPerWeek}` : '';
        return { id: s.id, label: [s.name, subject, load].filter(Boolean).join(' · ') };
      });
    }
    if (kind === 'section') return state.lookups.sections.filter((s) => !s.excluded).map((s) => ({ id: s.id, label: sectionLabel(state.lookups.sections, s.id) }));
    return state.rooms.map((r) => ({ id: r.id, label: r.name }));
  }, [kind, state.lookups, state.rooms]);

  useEffect(() => {
    if (!entities.some((e) => e.id === entityId)) setEntityId(entities[0]?.id ?? '');
  }, [entities, entityId]);

  const savedAvailability = JSON.stringify(state.availability[kind][entityId] ?? []);
  useEffect(() => {
    setBlocked(JSON.parse(savedAvailability) as BlockedSlot[]);
  }, [savedAvailability, kind, entityId]);

  const days = useMemo(() => [...new Set(state.bell.dayTypes.flatMap((d) => d.days))].sort((a, b) => a - b), [state.bell]);
  const maxPeriods = useMemo(() => Math.max(0, ...days.map((d) => teachingPeriods(state.bell, d).length)), [days, state.bell]);

  const isOff = (day: number, period: number) => blocked.some((b) => b.day === day && b.period === period);
  const toggle = (day: number, period: number) =>
    setBlocked((list) => (list.some((b) => b.day === day && b.period === period) ? list.filter((b) => !(b.day === day && b.period === period)) : [...list, { day, period }]));
  const toggleDay = (day: number) => {
    const count = teachingPeriods(state.bell, day).length;
    const all = Array.from({ length: count }, (_, i) => i + 1);
    const full = all.every((p) => isOff(day, p));
    setBlocked((list) => [...list.filter((b) => b.day !== day), ...(full ? [] : all.map((period) => ({ day, period })))]);
  };

  const dirty = JSON.stringify([...blocked].sort((a, b) => a.day - b.day || a.period - b.period)) !== savedAvailability;

  const save = useCallback(async () => {
    if (!entityId || saving || roomBusy) return false;
    setSaving(true);
    try {
      await api.saveAvailability(kind, entityId, blocked);
      await reload();
      notify('Availability saved.', 'success');
      return true;
    } catch (error) {
      notify(plannerMessage(error, 'Could not save availability.'), 'danger');
      return false;
    } finally {
      setSaving(false);
    }
  }, [api, blocked, entityId, kind, notify, reload, roomBusy, saving]);

  useEffect(() => {
    setEdits(dirty || groupName || saving || roomBusy ? { saving: saving || roomBusy, save: groupName ? undefined : save } : null);
    return () => setEdits(null);
  }, [dirty, groupName, roomBusy, save, saving, setEdits]);

  const changeAvailability = (change: () => void) => {
    if (saving) return;
    if (!dirty || window.confirm('Discard the unsaved availability changes?')) change();
  };

  const run = async (task: () => Promise<unknown>, done: string) => {
    if (roomBusy || saving) return;
    setRoomBusy(true);
    try {
      await task();
      await reload();
      notify(done, 'success');
    } catch (error) {
      notify(plannerMessage(error), 'danger');
    } finally {
      setRoomBusy(false);
    }
  };

  return (
    <div className="row g-3">
      <div className="col-lg-5">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="mb-1">Rooms <span className="text-muted fs-13">(optional)</span></h5>
            <p className="text-muted fs-13">Group active classrooms and shared spaces so a lesson can request any free room in a group.</p>

            <div className="d-flex gap-2 mb-2">
              <input className="form-control form-control-sm" placeholder="New group, e.g. Science Labs" aria-label="New room group" value={groupName} disabled={roomBusy} onChange={(e) => setGroupName(e.target.value)} />
              <button type="button" className="btn btn-sm btn-outline-light bg-white text-nowrap" disabled={roomBusy || saving || !groupName.trim()} onClick={() => void run(async () => { await api.createRoomGroup(groupName.trim()); setGroupName(''); }, 'Group added.')}>
                Add group
              </button>
            </div>
            <div className="d-flex gap-1 flex-wrap mb-3">
              {state.roomGroups.map((g) => (
                <span key={g.id} className="badge badge-soft-info d-inline-flex align-items-center gap-1">
                  {g.name}
                  <button type="button" className="btn btn-link p-0 text-danger" aria-label={`Delete group ${g.name}`} disabled={roomBusy || saving} onClick={() => void run(() => api.deleteRoomGroup(g.id), 'Group deleted.')}>
                    <i className="ti ti-x" />
                  </button>
                </span>
              ))}
            </div>

            <div className="table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr><th>Room</th><th>Group</th><th>Seats</th></tr>
                </thead>
                <tbody>
                  {state.rooms.map((r) => (
                    <tr key={r.id}>
                      <td>{r.name}</td>
                      <td>
                        <select className="form-select form-select-sm" aria-label={`Group of ${r.name}`} value={r.groupId ?? ''} disabled={roomBusy || saving} onChange={(e) => {
                          const groupId = e.currentTarget.value || null;
                          void run(() => api.updateRoom(r.id, groupId), 'Room group updated.');
                        }}>
                          <option value="">No group</option>
                          {state.roomGroups.map((g) => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                          ))}
                        </select>
                      </td>
                      <td>{r.capacity ?? '—'}</td>
                    </tr>
                  ))}
                  {state.rooms.length === 0 ? (
                    <tr><td colSpan={3} className="text-muted text-center py-3">No active rooms are configured for this school. You can still plan lessons without a room requirement.</td></tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-7">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="mb-1">Availability</h5>
            <p className="text-muted fs-13">Click a period to mark it as unavailable (red). The generator never schedules anything into it.</p>
            <div className="d-flex gap-2 mb-3 flex-wrap">
              <div className="btn-group" role="group" aria-label="What to set availability for">
                {KINDS.map((k) => (
                  <button key={k.id} type="button" className={`btn btn-sm ${kind === k.id ? 'btn-primary' : 'btn-outline-light bg-white'}`} onClick={() => { if (k.id !== kind) changeAvailability(() => setKind(k.id)); }}>
                    {k.label}
                  </button>
                ))}
              </div>
              <select className="form-select form-select-sm w-auto" aria-label="Choose who or what to schedule" value={entityId} disabled={!entities.length || saving} onChange={(e) => { const id = e.target.value; changeAvailability(() => setEntityId(id)); }}>
                {!entities.length ? <option value="">None available</option> : null}
                {entities.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.label}
                    {(state.availability[kind][e.id]?.length ?? 0) > 0 ? ` (${state.availability[kind][e.id].length} off)` : ''}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-muted fs-12">{KINDS.find((k) => k.id === kind)?.hint}</p>

            {!entityId ? (
              <p className="text-muted">{kind === 'room' ? 'An active room is required to set room availability.' : kind === 'staff' ? 'Add an active teacher to set their availability.' : 'Include an active class section to set its availability.'}</p>
            ) : maxPeriods === 0 ? (
              <p className="text-muted">Set up the bell schedule first.</p>
            ) : (
              <div className="table-responsive">
                <table className="tp-avail">
                  <thead>
                    <tr>
                      <th />
                      {Array.from({ length: maxPeriods }, (_, i) => (
                        <th key={i}>P{i + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((day) => {
                      const count = teachingPeriods(state.bell, day).length;
                      return (
                        <tr key={day}>
                          <th>
                            <button type="button" className="btn btn-link btn-sm p-0 text-decoration-none" title="Toggle the whole day" onClick={() => toggleDay(day)}>
                              {DAY_SHORT[day]}
                            </button>
                          </th>
                          {Array.from({ length: maxPeriods }, (_, i) =>
                            i < count ? (
                              <td key={i} className={isOff(day, i + 1) ? 'off' : ''} role="button" tabIndex={0} aria-pressed={isOff(day, i + 1)} aria-label={`${DAY_SHORT[day]} period ${i + 1}`} onClick={() => toggle(day, i + 1)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle(day, i + 1))}>
                                {isOff(day, i + 1) ? <i className="ti ti-x" /> : ''}
                              </td>
                            ) : (
                              <td key={i} className="none" />
                            ),
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="d-flex gap-2 mt-3">
              <button type="button" className="btn btn-primary btn-sm" disabled={!dirty || saving || roomBusy || !entityId} onClick={() => void save()}>
                {saving ? 'Saving…' : 'Save availability'}
              </button>
              <button type="button" className="btn btn-outline-light bg-white btn-sm" disabled={blocked.length === 0} onClick={() => setBlocked([])}>
                Clear all
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupStep;
