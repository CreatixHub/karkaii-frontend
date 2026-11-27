import { useCallback, useEffect, useMemo, useState } from 'react';
import { DAY_SHORT, plannerMessage } from '@services/timetable/planner.api';
import type { Bell, DayType, Period } from '@services/timetable/planner.api';
import type { StepProps } from '../types';

const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
const fromMin = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
let counter = 0;
const tmpId = () => `tmp-${(counter += 1)}`;

const shiftFrom = (periods: Period[], from: number, delta: number): Period[] =>
  periods.map((p, i) => (i >= from && delta ? { ...p, startsAt: fromMin(toMin(p.startsAt) + delta), endsAt: fromMin(toMin(p.endsAt) + delta) } : p));

const BellStep = ({ api, state, reload, notify, setEdits }: StepProps) => {
  const [bell, setBell] = useState<Bell>(() => structuredClone(state.bell));
  const [saving, setSaving] = useState(false);
  const [quick, setQuick] = useState({ start: '08:00', length: 45, count: 8 });

  useEffect(() => setBell(structuredClone(state.bell)), [state.bell]);

  const dirty = useMemo(() => JSON.stringify(bell) !== JSON.stringify(state.bell), [bell, state.bell]);
  const patchType = (index: number, patch: Partial<DayType>) => setBell((b) => ({ ...b, dayTypes: b.dayTypes.map((d, i) => (i === index ? { ...d, ...patch } : d)) }));
  const setPeriods = (index: number, periods: Period[]) => patchType(index, { periods });

  const fill = (index: number) => {
    const periods: Period[] = [];
    let at = toMin(quick.start);
    for (let n = 1; n <= quick.count; n += 1) {
      periods.push({ id: tmpId(), name: `Period ${n}`, startsAt: fromMin(at), endsAt: fromMin(at + quick.length), isBreak: false });
      at += quick.length;
    }
    setPeriods(index, periods);
  };

  const toggleDay = (index: number, day: number) => {
    const type = bell.dayTypes[index];
    const taken = bell.dayTypes.some((d, i) => i !== index && d.days.includes(day));
    if (taken) {
      notify(`${DAY_SHORT[day]} already belongs to another day type. Remove it there first.`, 'warning');
      return;
    }
    patchType(index, { days: type.days.includes(day) ? type.days.filter((d) => d !== day) : [...type.days, day].sort((a, b) => a - b) });
  };

  const addBreakAfter = (index: number, row: number) => {
    const periods = bell.dayTypes[index].periods;
    const at = toMin(periods[row].endsAt);
    const next = [...periods];
    next.splice(row + 1, 0, { id: tmpId(), name: 'Break', startsAt: fromMin(at), endsAt: fromMin(at + 15), isBreak: true });
    setPeriods(index, shiftFrom(next, row + 2, 15));
  };

  const changeEnd = (index: number, row: number, value: string) => {
    const periods = bell.dayTypes[index].periods;
    const delta = value ? toMin(value) - toMin(periods[row].endsAt) : 0;
    const next = periods.map((p, i) => (i === row ? { ...p, endsAt: value } : p));
    setPeriods(index, shiftFrom(next, row + 1, delta));
  };

  const renumber = (periods: Period[]) => {
    let n = 0;
    return periods.map((p) => (p.isBreak || !/^Period \d+$/.test(p.name) ? p : { ...p, name: `Period ${(n += 1)}` }));
  };

  const addDayType = () => {
    const free = [1, 2, 3, 4, 5, 6, 7].filter((d) => !bell.dayTypes.some((t) => t.days.includes(d)));
    if (!free.length) return notify('Every day already belongs to a day type.', 'info');
    const periods = bell.dayTypes[0]?.periods ?? [];
    setBell((b) => ({ ...b, dayTypes: [...b.dayTypes, { id: tmpId(), name: 'Short day', days: [free[free.length - 1]], periods: periods.map((p) => ({ ...p, id: tmpId() })) }] }));
  };

  const save = useCallback(async () => {
    if (saving) return false;
    if (!bell.dayTypes.some((day) => day.days.length && day.periods.some((period) => !period.isBreak))) {
      notify('Add teaching periods before saving the bell schedule.', 'warning');
      return false;
    }
    setSaving(true);
    try {
      await api.saveBell({ ...bell, dayTypes: bell.dayTypes.map((d) => ({ ...d, id: d.id.startsWith('tmp-') ? '' : d.id, periods: d.periods.map((p) => ({ ...p, id: p.id.startsWith('tmp-') ? '' : p.id })) })) });
      await reload();
      notify('Bell schedule saved.', 'success');
      return true;
    } catch (error) {
      notify(plannerMessage(error, 'Could not save the bell schedule.'), 'danger');
      return false;
    } finally {
      setSaving(false);
    }
  }, [api, bell, notify, reload, saving]);

  useEffect(() => {
    setEdits(dirty || saving ? { saving, save } : null);
    return () => setEdits(null);
  }, [dirty, save, saving, setEdits]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h5 className="mb-1">Bell schedule</h5>
          <p className="text-muted mb-0 fs-13">Which days you teach and when each period and break runs. Days that share a timing sit in one day type; give a short Friday its own.</p>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-light bg-white" onClick={addDayType}>
            <i className="ti ti-plus me-1" />
            Add day type
          </button>
          <button type="button" className="btn btn-primary" disabled={!dirty || saving} onClick={() => void save()}>
            {saving ? 'Saving…' : 'Save bell schedule'}
          </button>
        </div>
      </div>

      {bell.dayTypes.map((type, index) => {
        const teaching = type.periods.filter((p) => !p.isBreak).length;
        return (
          <div className="card mb-3" key={type.id}>
            <div className="card-body">
              <div className="row g-3 align-items-end mb-3">
                <div className="col-md-3">
                  <label className="form-label" htmlFor={`dt-name-${index}`}>Day type</label>
                  <input id={`dt-name-${index}`} className="form-control" value={type.name} onChange={(e) => patchType(index, { name: e.target.value })} />
                </div>
                <div className="col-md-5">
                  <div className="form-label">Days it applies to</div>
                  <div className="d-flex gap-1 flex-wrap">
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                      <button key={d} type="button" className={`tp-chip ${type.days.includes(d) ? 'on' : ''}`} aria-pressed={type.days.includes(d)} onClick={() => toggleDay(index, d)}>
                        {DAY_SHORT[d]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-md-4 text-md-end">
                  <span className="badge badge-soft-primary me-2">{teaching} teaching periods</span>
                  {bell.dayTypes.length > 1 ? (
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setBell((b) => ({ ...b, dayTypes: b.dayTypes.filter((_, i) => i !== index) }))}>
                      Remove
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="border rounded p-3 mb-3 bg-light">
                <div className="fw-semibold fs-13 mb-2">Quick setup — answer three questions, then adjust</div>
                <div className="row g-2 align-items-end">
                  <div className="col-6 col-md-3">
                    <label className="form-label fs-12" htmlFor={`q-start-${index}`}>First period starts</label>
                    <input id={`q-start-${index}`} type="time" className="form-control form-control-sm" value={quick.start} onChange={(e) => setQuick({ ...quick, start: e.target.value })} />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label fs-12" htmlFor={`q-len-${index}`}>Each period lasts (min)</label>
                    <input id={`q-len-${index}`} type="number" min={10} max={180} className="form-control form-control-sm" value={quick.length} onChange={(e) => setQuick({ ...quick, length: Math.max(10, Number(e.target.value) || 45) })} />
                  </div>
                  <div className="col-6 col-md-3">
                    <label className="form-label fs-12" htmlFor={`q-count-${index}`}>Periods a day</label>
                    <input id={`q-count-${index}`} type="number" min={1} max={14} className="form-control form-control-sm" value={quick.count} onChange={(e) => setQuick({ ...quick, count: Math.min(14, Math.max(1, Number(e.target.value) || 8)) })} />
                  </div>
                  <div className="col-6 col-md-3">
                    <button type="button" className="btn btn-sm btn-primary w-100" onClick={() => fill(index)}>
                      Fill the day
                    </button>
                  </div>
                </div>
                <div className="text-muted fs-12 mt-2">This replaces the rows below. Add breaks and lunch afterwards with “+ break” on the row they follow.</div>
              </div>

              {type.periods.length === 0 ? <p className="text-muted mb-0">No periods yet. Use quick setup, or add the first row.</p> : null}
              <div className="tp-bell-scroll">
              {type.periods.map((p, row) => (
                <div key={p.id} className={`tp-bell-row ${p.isBreak ? 'break' : ''}`}>
                  <span className="text-muted fs-12">{row + 1}</span>
                  <input className="form-control form-control-sm" aria-label={`Name of row ${row + 1}`} value={p.name} onChange={(e) => setPeriods(index, type.periods.map((x, i) => (i === row ? { ...x, name: e.target.value } : x)))} />
                  <input type="time" className="form-control form-control-sm" aria-label={`Start of ${p.name}`} value={p.startsAt} onChange={(e) => setPeriods(index, type.periods.map((x, i) => (i === row ? { ...x, startsAt: e.target.value } : x)))} />
                  <input type="time" className="form-control form-control-sm" aria-label={`End of ${p.name}`} value={p.endsAt} onChange={(e) => changeEnd(index, row, e.target.value)} />
                  <div className="d-flex gap-1">
                    <button type="button" className="btn btn-sm btn-outline-light bg-white" title="Turn this row into a break or back into a period" onClick={() => setPeriods(index, renumber(type.periods.map((x, i) => (i === row ? { ...x, isBreak: !x.isBreak, name: !x.isBreak ? 'Break' : 'Period 0' } : x))))}>
                      {p.isBreak ? 'Break' : 'Period'}
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-light bg-white" title="Insert a 15 minute break after this row" onClick={() => addBreakAfter(index, row)}>
                      + break
                    </button>
                  </div>
                  <button type="button" className="btn btn-sm btn-link text-danger p-0" aria-label={`Delete ${p.name}`} onClick={() => setPeriods(index, renumber(type.periods.filter((_, i) => i !== row)))}>
                    <i className="ti ti-trash" />
                  </button>
                </div>
              ))}
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-light bg-white mt-2"
                onClick={() => {
                  const last = type.periods[type.periods.length - 1];
                  const at = last ? toMin(last.endsAt) : toMin(quick.start);
                  setPeriods(index, renumber([...type.periods, { id: tmpId(), name: 'Period 99', startsAt: fromMin(at), endsAt: fromMin(at + quick.length), isBreak: false }]));
                }}
              >
                <i className="ti ti-plus me-1" />
                Add period
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BellStep;
