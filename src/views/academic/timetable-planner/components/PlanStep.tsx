import { useCallback, useEffect, useMemo, useState } from 'react';
import Modal from '@components/ui/Modal';
import {
  plannerMessage,
  sectionLabel,
  teachingPeriods,
} from '@services/timetable/planner.api';
import type { Lesson, LessonInput, PlannerState, RoomRuleType } from '@services/timetable/planner.api';
import ChipPicker from './ChipPicker';
import type { StepProps } from '../types';

const LENGTH_NAME: Record<number, string> = { 1: 'single', 2: 'double', 3: 'triple', 4: 'quad' };

function patternText(pattern: { count: number; length: number }[]): string {
  return pattern.map((p) => `${p.count} ${LENGTH_NAME[p.length] ?? `${p.length}-period`}${p.count > 1 ? 's' : ''}`).join(', ');
}
const patternPeriods = (pattern: { count: number; length: number }[]) => pattern.reduce((n, x) => n + x.count * x.length, 0);
const periodsOf = (parts: { pattern: { count: number; length: number }[] }[]) => parts.reduce((t, p) => t + patternPeriods(p.pattern), 0);

interface DraftPart {
  id?: string;
  label: string;
  isPractical?: boolean;
  pattern: { count: number; length: number }[];
  teacherIds: string[];
  mode: 'together' | 'one_of';
  roomType: RoomRuleType;
  roomIds: string[];
  groupId: string;
}
interface Draft {
  id?: string;
  sectionIds: string[];
  kind: 'subject' | 'activity';
  subjectId: string;
  activityName: string;
  syncGroup: string;
  parts: DraftPart[];
}

const blankPart = (): DraftPart => ({ label: '', pattern: [{ count: 5, length: 1 }], teacherIds: [], mode: 'together', roomType: 'none', roomIds: [], groupId: '' });
const blankDraft = (sectionIds: string[] = []): Draft => ({ sectionIds, kind: 'subject', subjectId: '', activityName: '', syncGroup: '', parts: [blankPart()] });

const toDraft = (l: Lesson): Draft => ({
  id: l.id,
  sectionIds: l.sectionIds,
  kind: l.subjectId ? 'subject' : 'activity',
  subjectId: l.subjectId ?? '',
  activityName: l.activityName ?? '',
  syncGroup: l.syncGroup ?? '',
  parts: l.parts.map((p) => ({ id: p.id, label: p.label, isPractical: p.isPractical, pattern: p.pattern.map((x) => ({ ...x })), teacherIds: p.teacherIds, mode: p.mode, roomType: p.room.type, roomIds: p.room.roomIds ?? [], groupId: p.room.groupId ?? '' })),
});

function roomRequirement(part: DraftPart): LessonInput['parts'][number]['room'] {
  const type = part.roomType;
  if (type === 'fixed') return { type, roomIds: part.roomIds };
  if (type === 'oneOf') return { type, roomIds: part.roomIds, groupId: part.groupId || null };
  return { type };
}

const toInput = (d: Draft): LessonInput => ({
  sectionIds: d.sectionIds,
  subjectId: d.kind === 'subject' ? d.subjectId || null : null,
  activityName: d.kind === 'activity' ? d.activityName : null,
  syncGroup: d.syncGroup.trim() || null,
  parts: d.parts.map((p) => ({
    id: p.id ?? '',
    label: p.label,
    isPractical: p.isPractical,
    pattern: p.pattern.filter((x) => x.count > 0),
    teacherIds: p.teacherIds,
    mode: p.teacherIds.length > 1 ? p.mode : 'together',
    room: roomRequirement(p),
  })),
});

function roomSummary(l: Lesson, state: PlannerState): string {
  const names = new Map(state.rooms.map((r) => [r.id, r.name]));
  const groups = new Map(state.roomGroups.map((g) => [g.id, g.name]));
  const bits = l.parts
    .map((p) => {
      const { type, roomIds = [], groupId } = p.room;
      if (type === 'none') return '';
      const list = roomIds.map((id) => names.get(id) ?? id).join(', ');
      if (type === 'fixed') return list;
      const where = [list, groupId ? `any ${groups.get(groupId) ?? 'group'}` : ''].filter(Boolean).join(' / ');
      return type === 'any' ? 'any room that fits' : `one of ${where}`;
    })
    .filter(Boolean);
  return bits.length ? [...new Set(bits)].join('; ') : '—';
}

const PlanStep = ({ api, state, reload, notify, setEdits }: StepProps) => {
  const { sections, staff, subjects } = state.lookups;
  const [filter, setFilter] = useState('all');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [copying, setCopying] = useState<Lesson | null>(null);
  const [copyTo, setCopyTo] = useState<string[]>([]);
  const [toggling, setToggling] = useState<string | null>(null);
  const [showEveryone, setShowEveryone] = useState(false);

  const excludedIds = useMemo(() => new Set(sections.filter((s) => s.excluded).map((s) => s.id)), [sections]);
  const includedCount = sections.length - excludedIds.size;

  const toggleExcluded = async (id: string, excluded: boolean) => {
    setToggling(id);
    try {
      await api.setSectionExcluded(id, excluded);
      await reload();
      notify(excluded ? `${sectionLabel(sections, id)} will be left out of the timetable. Its lessons are kept.` : `${sectionLabel(sections, id)} is back in the timetable.`, 'success');
    } catch (error) {
      notify(plannerMessage(error, 'Could not change this class.'), 'danger');
    } finally {
      setToggling(null);
    }
  };

  const staffName = useMemo(() => new Map(staff.map((s) => [s.id, s.name])), [staff]);
  const subjectName = useMemo(() => new Map(subjects.map((s) => [s.id, s.name])), [subjects]);
  const capacity = useMemo(() => {
    const days = [...new Set(state.bell.dayTypes.flatMap((d) => d.days))];
    return days.reduce((t, d) => t + teachingPeriods(state.bell, d).length, 0);
  }, [state.bell]);

  const planned = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of state.lessons) for (const sid of l.sectionIds) map.set(sid, (map.get(sid) ?? 0) + periodsOf(l.parts));
    return map;
  }, [state.lessons]);

  const visible = state.lessons.filter((l) => filter === 'all' || l.sectionIds.includes(filter));
  const groupsInUse = [...new Set(state.lessons.map((l) => l.syncGroup).filter((g): g is string => Boolean(g)))];

  const updatePart = (index: number, patch: Partial<DraftPart>) => setDraft((d) => (d ? { ...d, parts: d.parts.map((p, i) => (i === index ? { ...p, ...patch } : p)) } : d));

  const save = useCallback(async () => {
    if (!draft || saving) return false;
    setSaving(true);
    try {
      const input = toInput(draft);
      if (draft.id) await api.updateLesson(draft.id, input);
      else await api.createLesson(input);
      await reload();
      setDraft(null);
      notify('Teaching plan saved.', 'success');
      return true;
    } catch (error) {
      notify(plannerMessage(error, 'Could not save this lesson.'), 'danger');
      return false;
    } finally {
      setSaving(false);
    }
  }, [api, draft, notify, reload, saving]);

  useEffect(() => {
    setEdits(draft || saving ? { saving, save } : null);
    return () => setEdits(null);
  }, [draft, save, saving, setEdits]);

  const remove = async (l: Lesson) => {
    const title = l.subjectId ? subjectName.get(l.subjectId) ?? 'Subject' : l.activityName;
    const classes = l.sectionIds.map((sid) => sectionLabel(sections, sid)).join(' + ');
    // Removing a lesson changes the plan, so every draft will then need regenerating.
    if (!window.confirm(`Delete the lesson "${title}"${classes ? ` for ${classes}` : ''}? Every draft timetable will then need to be regenerated.`)) return;
    try {
      await api.deleteLesson(l.id);
      await reload();
      notify('Lesson removed from the plan.', 'success');
    } catch (error) {
      notify(plannerMessage(error), 'danger');
    }
  };

  const doCopy = async () => {
    if (!copying) return;
    try {
      await api.copyLesson(copying.id, copyTo);
      await reload();
      setCopying(null);
      setCopyTo([]);
      notify('Copied.', 'success');
    } catch (error) {
      notify(plannerMessage(error), 'danger');
    }
  };

  // A class that is left out cannot be given new lessons, but one already on a lesson stays visible.
  const sectionOptions = sections
    .filter((s) => !s.excluded || draft?.sectionIds.includes(s.id))
    .map((s) => ({ id: s.id, label: sectionLabel(sections, s.id) + (s.excluded ? ' (left out)' : '') }));
  // Teachers who can teach the lesson's subject come first (primary before additional); with nobody listed yet, everyone shows.
  const lessonSubjectId = draft?.kind === 'subject' ? draft.subjectId : '';
  const lessonSubjectName = subjectName.get(lessonSubjectId) ?? 'this subject';
  const practicalSubject = subjects.some((subject) => subject.id === lessonSubjectId && subject.subjectType === 'practical');
  const listedForSubject = lessonSubjectId ? staff.filter((s) => s.subjectIds?.includes(lessonSubjectId)) : [];
  const filtering = Boolean(lessonSubjectId) && !showEveryone && listedForSubject.length > 0;
  const staffOptions = (filtering ? listedForSubject : staff)
    .slice()
    .sort((a, b) => Number(b.primarySubjectId === lessonSubjectId) - Number(a.primarySubjectId === lessonSubjectId))
    .map((s) => ({
      id: s.id,
      label: `${s.name}${filtering ? (s.primarySubjectId === lessonSubjectId ? ' · Primary' : ' · Additional') : ''}${s.maxPeriodsPerWeek ? ` · ${s.plannedPeriods ?? 0}/${s.maxPeriodsPerWeek}` : ''}`,
    }));
  // A teacher already on the lesson stays visible even when the filter would hide them.
  const withSelected = (selected: string[]) => [
    ...staffOptions,
    ...selected.filter((id) => !staffOptions.some((o) => o.id === id)).map((id) => ({ id, label: staffName.get(id) ?? id })),
  ];
  const notListed = (selected: string[]) =>
    lessonSubjectId ? staff.filter((s) => selected.includes(s.id) && (s.subjectIds?.length ?? 0) > 0 && !s.subjectIds?.includes(lessonSubjectId)) : [];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h5 className="mb-1">Teaching plan</h5>
          <p className="text-muted mb-0 fs-13">What each class studies, how often, who teaches it and where. This is everything the generator needs.</p>
        </div>
        <div className="d-flex gap-2">
          <select className="form-select" aria-label="Filter by class" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All classes</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>{sectionLabel(sections, s.id)}{s.excluded ? ' (left out)' : ''}</option>
            ))}
          </select>
          <button type="button" className="btn btn-primary text-nowrap" disabled={includedCount === 0 || excludedIds.has(filter)} onClick={() => setDraft(blankDraft(filter === 'all' ? [] : [filter]))}>
            <i className="ti ti-plus me-1" />
            Add teaching
          </button>
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="alert alert-info">This school needs an active class section before you can plan lessons.</div>
      ) : (
        <div className="row g-2 mb-3">
          {sections.filter((s) => filter === 'all' || s.id === filter).map((s) => {
            const n = planned.get(s.id) ?? 0;
            const pct = capacity ? Math.min(100, Math.round((n / capacity) * 100)) : 0;
            const label = sectionLabel(sections, s.id);
            return (
              <div className="col-6 col-md-4 col-xl-3" key={s.id}>
                <div className={`border rounded p-2 ${s.excluded ? 'bg-light' : 'bg-white'}`} data-excluded={s.excluded ? 'true' : undefined}>
                  <div className="d-flex justify-content-between align-items-center fs-13">
                    <b className={s.excluded ? 'text-muted' : undefined}>{label}</b>
                    <div className="form-check form-switch mb-0 min-h-0" title={s.excluded ? 'Turn on to include this class in the timetable again.' : 'Turn off to leave this class out of timetabling. Its lessons are kept.'}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id={`include-${s.id}`}
                        aria-label={`Include ${label} in the timetable`}
                        checked={!s.excluded}
                        disabled={toggling === s.id}
                        onChange={() => void toggleExcluded(s.id, !s.excluded)}
                      />
                    </div>
                  </div>
                  {s.excluded ? (
                    <div className="text-muted fs-12 mt-1">Left out of the timetable{n ? ` · ${n} planned periods kept` : ''}</div>
                  ) : (
                    <>
                      <div className={`text-end fs-12 ${n > capacity ? 'text-danger' : 'text-muted'}`}>{n} / {capacity}</div>
                      <div className="progress" style={{ height: 6 }} role="progressbar" aria-label={`${label} periods planned`} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                        <div className={`progress-bar ${n > capacity ? 'bg-danger' : ''}`} style={{ width: `${pct}%` }} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="card">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Class</th>
                <th>Subject</th>
                <th>Taught by</th>
                <th>Per week</th>
                <th>Room</th>
                <th style={{ width: 130 }} />
              </tr>
            </thead>
            <tbody>
              {visible.map((l) => (
                <tr key={l.id} className={l.sectionIds.every((sid) => excludedIds.has(sid)) ? 'text-muted' : undefined}>
                  <td className="fs-13">
                    {l.sectionIds.map((sid) => sectionLabel(sections, sid)).join(' + ')}
                    {l.sectionIds.length > 1 ? <span className="badge badge-soft-warning ms-1">together</span> : null}
                    {l.sectionIds.some((sid) => excludedIds.has(sid)) ? (
                      <span className="badge badge-soft-secondary ms-1">{l.sectionIds.every((sid) => excludedIds.has(sid)) ? 'class left out' : 'one class left out'}</span>
                    ) : null}
                  </td>
                  <td>
                    <b>{l.subjectId ? subjectName.get(l.subjectId) ?? 'Subject' : l.activityName}</b>
                    {!l.subjectId ? <span className="badge badge-soft-secondary ms-1">activity</span> : null}
                    {l.syncGroup ? <span className="badge badge-soft-info ms-1" title={`Runs at the same time as other lessons in "${l.syncGroup}"`}>same time</span> : null}
                  </td>
                  <td className="fs-13">
                    {l.parts.map((p) => (
                      <div key={p.id}>
                        {p.label ? <span className="text-muted">{p.label}: </span> : null}
                        {p.teacherIds.length ? p.teacherIds.map((t) => staffName.get(t) ?? t).join(p.mode === 'one_of' ? ' or ' : ' + ') : <span className="text-warning">no teacher yet</span>}
                        {p.teacherIds.length > 1 ? <span className="badge badge-soft-primary ms-1">{p.mode === 'one_of' ? 'share periods' : 'team teach'}</span> : null}
                      </div>
                    ))}
                  </td>
                  <td className="fs-13">
                    {l.parts.map((p) => (
                      <div key={p.id}>{patternText(p.pattern)}</div>
                    ))}
                    <span className="text-muted">{periodsOf(l.parts)} periods</span>
                  </td>
                  <td className="fs-13">{roomSummary(l, state)}</td>
                  <td className="text-end text-nowrap">
                    <button type="button" className="btn btn-sm btn-link" aria-label="Edit lesson" onClick={() => setDraft(toDraft(l))}><i className="ti ti-edit" /></button>
                    <button type="button" className="btn btn-sm btn-link" aria-label="Copy to other classes" onClick={() => { setCopying(l); setCopyTo([]); }}><i className="ti ti-copy" /></button>
                    <button type="button" className="btn btn-sm btn-link text-danger" aria-label="Delete lesson" onClick={() => void remove(l)}><i className="ti ti-trash" /></button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-muted py-4">Nothing planned yet. Choose “Add teaching”.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={draft !== null}
        onClose={() => setDraft(null)}
        title={draft?.id ? 'Edit teaching' : 'Add teaching'}
        dialogClassName="modal-xl modal-dialog-scrollable"
        footer={
          <>
            <button type="button" className="btn btn-outline-light bg-white" onClick={() => setDraft(null)}>Cancel</button>
            <button type="button" className="btn btn-primary" disabled={saving} onClick={() => void save()}>{saving ? 'Saving…' : 'Save'}</button>
          </>
        }
      >
        {draft ? (
          <div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <div className="form-label">Classes <span className="text-muted fs-12">(choose several for a lesson they attend together)</span></div>
                <ChipPicker ariaLabel="classes" options={sectionOptions} selected={draft.sectionIds} onChange={(ids) => setDraft({ ...draft, sectionIds: ids })} />
              </div>
              <div className="col-md-6">
                <div className="btn-group mb-2" role="group" aria-label="Subject or activity">
                  <button type="button" className={`btn btn-sm ${draft.kind === 'subject' ? 'btn-primary' : 'btn-outline-light bg-white'}`} onClick={() => setDraft({ ...draft, kind: 'subject' })}>Subject</button>
                  <button type="button" className={`btn btn-sm ${draft.kind === 'activity' ? 'btn-primary' : 'btn-outline-light bg-white'}`} onClick={() => setDraft({ ...draft, kind: 'activity' })}>Activity (no subject)</button>
                </div>
                {draft.kind === 'subject' ? (
                  <select className="form-select" aria-label="Subject" value={draft.subjectId} onChange={(e) => setDraft({ ...draft, subjectId: e.target.value })}>
                    <option value="">Choose a subject…</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                ) : (
                  <input className="form-control" aria-label="Activity name" placeholder="Library, Tutor time, Assembly…" value={draft.activityName} onChange={(e) => setDraft({ ...draft, activityName: e.target.value })} />
                )}
                <label className="form-label mt-3 mb-1" htmlFor="sync-group">Same-time group <span className="text-muted fs-12">(optional)</span></label>
                <input id="sync-group" list="sync-groups" className="form-control" placeholder="e.g. second-language-6A" value={draft.syncGroup} onChange={(e) => setDraft({ ...draft, syncGroup: e.target.value })} />
                <datalist id="sync-groups">
                  {groupsInUse.map((g) => (
                    <option key={g} value={g} />
                  ))}
                </datalist>
                <div className="text-muted fs-12 mt-1">Lessons with the same group name run at the same time, for example French and Hindi when a class splits by language.</div>
              </div>
            </div>

            {draft.parts.map((part, index) => (
              <div className="border rounded p-3 mb-3" key={part.id ?? `new-${index}`}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <input className="form-control form-control-sm w-auto" aria-label="Part name" placeholder={draft.parts.length > 1 ? 'Part name, e.g. Theory' : 'Part name (optional)'} value={part.label} onChange={(e) => updatePart(index, { label: e.target.value })} />
                  {draft.parts.length > 1 ? (
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setDraft({ ...draft, parts: draft.parts.filter((_, i) => i !== index) })}>Remove part</button>
                  ) : null}
                </div>

                <div className="row g-3">
                  <div className="col-lg-4">
                    <div className="form-label">How often per week</div>
                    <div className="form-check mb-2">
                      <input className="form-check-input" type="checkbox" id={`practical-part-${index}`} checked={practicalSubject || Boolean(part.isPractical)} disabled={practicalSubject} onChange={(e) => updatePart(index, { isPractical: e.target.checked })} />
                      <label className="form-check-label" htmlFor={`practical-part-${index}`}>Practical <span className="text-muted">(allows consecutive periods)</span></label>
                    </div>
                    {part.pattern.map((p, i) => (
                      <div className="d-flex gap-2 mb-2 align-items-center" key={i}>
                        <input type="number" min={1} max={12} className="form-control form-control-sm" style={{ width: 70 }} aria-label="Lessons per week" value={p.count} onChange={(e) => updatePart(index, { pattern: part.pattern.map((x, j) => (j === i ? { ...x, count: Number(e.target.value) } : x)) })} />
                        <span>×</span>
                        <select className="form-select form-select-sm" aria-label="Lesson length" value={p.length} onChange={(e) => updatePart(index, { pattern: part.pattern.map((x, j) => (j === i ? { ...x, length: Number(e.target.value) } : x)) })}>
                          <option value={1}>Single period</option>
                          <option value={2} disabled={!practicalSubject && !part.isPractical}>Double period</option>
                          <option value={3} disabled={!practicalSubject && !part.isPractical}>Triple period</option>
                        </select>
                        {part.pattern.length > 1 ? (
                          <button type="button" className="btn btn-sm btn-link text-danger p-0" aria-label="Remove length" onClick={() => updatePart(index, { pattern: part.pattern.filter((_, j) => j !== i) })}><i className="ti ti-x" /></button>
                        ) : null}
                      </div>
                    ))}
                    <button type="button" className="btn btn-sm btn-link p-0" onClick={() => updatePart(index, { pattern: [...part.pattern, { count: 1, length: practicalSubject || part.isPractical ? 2 : 1 }] })}>+ another length</button>
                    <div className="alert alert-light border py-1 px-2 mt-2 mb-0 fs-12">{patternPeriods(part.pattern)} periods a week</div>
                  </div>

                  <div className="col-lg-4">
                    <div className="form-label">Who teaches</div>
                    <ChipPicker ariaLabel="teachers" options={withSelected(part.teacherIds)} selected={part.teacherIds} onChange={(ids) => updatePart(index, { teacherIds: ids })} />
                    {lessonSubjectId ? (
                      <div className="form-check mt-2">
                        <input className="form-check-input" type="checkbox" id={`everyone-${index}`} checked={showEveryone || !listedForSubject.length} disabled={!listedForSubject.length} onChange={(e) => setShowEveryone(e.target.checked)} />
                        <label className="form-check-label fs-12" htmlFor={`everyone-${index}`}>
                          {listedForSubject.length ? 'Show everyone' : `No teacher lists ${lessonSubjectName} yet, so everyone is shown`}
                        </label>
                      </div>
                    ) : null}
                    {notListed(part.teacherIds).map((s) => (
                      <div key={s.id} className="text-warning fs-12 mt-1">{s.name} is not listed as teaching {lessonSubjectName}.</div>
                    ))}
                    {part.teacherIds.length > 1 ? (
                      <div className="mt-2">
                        <div className="form-check">
                          <input className="form-check-input" type="radio" id={`m-t-${index}`} name={`mode-${index}`} checked={part.mode === 'together'} onChange={() => updatePart(index, { mode: 'together' })} />
                          <label className="form-check-label fs-13" htmlFor={`m-t-${index}`}>All of them, every lesson <span className="text-muted">(team teaching)</span></label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" id={`m-o-${index}`} name={`mode-${index}`} checked={part.mode === 'one_of'} onChange={() => updatePart(index, { mode: 'one_of' })} />
                          <label className="form-check-label fs-13" htmlFor={`m-o-${index}`}>One of them each lesson <span className="text-muted">(they share the periods)</span></label>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="col-lg-4">
                    <div className="form-label">Where</div>
                    <select className="form-select form-select-sm mb-2" aria-label="Room rule" value={part.roomType} onChange={(e) => updatePart(index, { roomType: e.target.value as RoomRuleType })}>
                      <option value="none">No room needed</option>
                      <option value="fixed">These rooms</option>
                      <option value="oneOf">Any one of…</option>
                      <option value="any">Any room that fits</option>
                    </select>
                    {part.roomType === 'fixed' || part.roomType === 'oneOf' ? (
                      <ChipPicker ariaLabel="rooms" options={state.rooms.map((r) => ({ id: r.id, label: r.name }))} selected={part.roomIds} onChange={(ids) => updatePart(index, { roomIds: ids })} />
                    ) : null}
                    {part.roomType === 'oneOf' ? (
                      <select className="form-select form-select-sm mt-2" aria-label="Room group" value={part.groupId} onChange={(e) => updatePart(index, { groupId: e.target.value })}>
                        <option value="">…or a whole group</option>
                        {state.roomGroups.map((g) => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>
                    ) : null}
                    {state.rooms.length === 0 && part.roomType !== 'none' ? (
                      <div className="text-warning fs-12 mt-1">No active rooms are configured for this school. Choose “No room needed” to plan this lesson without a room.</div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-sm btn-outline-light bg-white" onClick={() => setDraft({ ...draft, parts: [...draft.parts, blankPart()] })}>
              <i className="ti ti-plus me-1" />
              Add another part <span className="text-muted">(e.g. theory and lab with different teachers or rooms)</span>
            </button>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={copying !== null}
        onClose={() => setCopying(null)}
        title="Copy to other classes"
        footer={
          <>
            <button type="button" className="btn btn-outline-light bg-white" onClick={() => setCopying(null)}>Cancel</button>
            <button type="button" className="btn btn-primary" disabled={copyTo.length === 0} onClick={() => void doCopy()}>Copy to {copyTo.length || ''} class{copyTo.length === 1 ? '' : 'es'}</button>
          </>
        }
      >
        <p className="text-muted fs-13">Each class gets its own copy with the same teachers, pattern and rooms. Change the teacher afterwards where it differs.</p>
        <ChipPicker ariaLabel="classes to copy to" options={sectionOptions.filter((o) => !copying?.sectionIds.includes(o.id))} selected={copyTo} onChange={setCopyTo} />
      </Modal>
    </div>
  );
};

export default PlanStep;
