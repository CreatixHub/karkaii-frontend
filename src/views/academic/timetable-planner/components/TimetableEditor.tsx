import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DragEvent } from 'react';
import Modal from '@components/ui/Modal';
import {
  DAY_LONG,
  DAY_SHORT,
  plannerMessage,
  sectionLabel,
  teachingPeriods,
} from '@services/timetable/planner.api';
import type { Entry, FitPosition, PlannerState, PublicationPreview, VersionDetail } from '@services/timetable/planner.api';
import TeacherAvailability from './TeacherAvailability';
import { subjectColors } from '../types';
import type { StepProps } from '../types';

type View = 'class' | 'teacher' | 'room';
type Panel = 'none' | 'insights' | 'workload';

interface Card {
  key: string;
  unitKey: string;
  entityId: string;
  blockId: string;
  day: number;
  startNo: number;
  length: number;
  subject: string;
  lines: string[];
  locked: boolean;
}

interface Props extends Pick<StepProps, 'api' | 'notify'> {
  detail: VersionDetail;
  state: PlannerState;
  busy: boolean;
  setBusy: (busy: boolean) => void;
  canCreate: boolean;
  canManage: boolean;
  onChange: (detail: VersionDetail | null) => void;
  reloadState: () => Promise<void>;
}

const TimetableEditor = ({ api, detail, state, busy, setBusy, canCreate, canManage, notify, onChange, reloadState }: Props) => {
  const { sections, staff } = state.lookups;
  const readOnly = detail.version.status !== 'draft';
  const [view, setView] = useState<View>('class');
  const [search, setSearch] = useState('');
  const [panel, setPanel] = useState<Panel>('insights');
  const [selected, setSelected] = useState<string | null>(null);
  const [fitResult, setFitResult] = useState<{ blockId: string; updatedAt: string | undefined; positions: Map<string, FitPosition> | null } | null>(null);
  const fit = fitResult && selected === fitResult.blockId && detail.version.updatedAt === fitResult.updatedAt ? fitResult.positions : undefined;
  const [attempt, setAttempt] = useState<{ blockId: string; day: number; period: number; message: string } | null>(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [dropKey, setDropKey] = useState<string | null>(null);
  const [trayOver, setTrayOver] = useState(false);
  const [budget, setBudget] = useState(3000);
  const [publishing, setPublishing] = useState(false);
  const [preview, setPreview] = useState<PublicationPreview | null>(null);
  const [previewError, setPreviewError] = useState('');
  const [previewAttempt, setPreviewAttempt] = useState(0);
  const [restoring, setRestoring] = useState(false);
  const undo = useRef<{ blockId: string; was: { day: number; startNo: number } | null }[]>([]);
  const [undoCount, setUndoCount] = useState(0);
  const [whoOpen, setWhoOpen] = useState(true);

  const staffName = useMemo(() => new Map(staff.map((s) => [s.id, s.name])), [staff]);
  const roomName = useMemo(() => new Map(state.rooms.map((r) => [r.id, r.name])), [state.rooms]);
  const versionId = detail.version.id;

  // ---------------------------------------------------------------- grid data

  const days = detail.days;
  const maxNo = useMemo(() => Math.max(1, ...days.map((d) => teachingPeriods(detail.bell, d).length)), [days, detail.bell]);
  const headerPeriods = useMemo(() => teachingPeriods(detail.bell, days[0] ?? 1), [detail.bell, days]);

  const secNames = useCallback((entries: Entry[]) => [...new Set(entries.map((e) => sectionLabel(sections, e.sectionId)))].join(' + '), [sections]);

  const { cards, entities } = useMemo(() => {
    const list: Card[] = [];
    const used = new Set<string>();
    const byUnit = new Map<string, Entry[]>();
    for (const e of detail.entries) byUnit.set(e.unitKey, [...(byUnit.get(e.unitKey) ?? []), e]);

    if (view === 'class') {
      for (const e of detail.entries) {
        used.add(e.sectionId);
        list.push({
          key: `${e.sectionId}|${e.day}|${e.startNo}`,
          unitKey: e.unitKey,
          entityId: e.sectionId,
          blockId: e.blockId,
          day: e.day,
          startNo: e.startNo,
          length: e.length,
          subject: e.label ? `${e.subjectName} · ${e.label}` : e.subjectName,
          lines: [e.teacherIds.map((t) => staffName.get(t) ?? t).join(', ') || 'No teacher', e.roomIds.map((r) => roomName.get(r) ?? r).join(', ')].filter(Boolean),
          locked: e.locked,
        });
      }
    } else {
      for (const group of byUnit.values()) {
        const head = group[0];
        const ids = view === 'teacher' ? head.teacherIds : head.roomIds;
        for (const id of ids) {
          used.add(id);
          list.push({
            key: `${id}|${head.day}|${head.startNo}`,
            unitKey: head.unitKey,
            entityId: id,
            blockId: head.blockId,
            day: head.day,
            startNo: head.startNo,
            length: head.length,
            subject: head.label ? `${head.subjectName} · ${head.label}` : head.subjectName,
            lines: [secNames(group), view === 'teacher' ? head.roomIds.map((r) => roomName.get(r) ?? r).join(', ') : head.teacherIds.map((t) => staffName.get(t) ?? t).join(', ')].filter(Boolean),
            locked: head.locked,
          });
        }
      }
    }

    const label = (id: string) => (view === 'class' ? sectionLabel(sections, id) : view === 'teacher' ? staffName.get(id) ?? id : roomName.get(id) ?? id);
    const all =
      view === 'class'
        ? [...new Set([...sections.map((s) => s.id).filter((id) => used.has(id) || detail.unplaced.some((u) => u.sectionIds.includes(id)))])]
        : [...used];
    const q = search.trim().toLowerCase();
    const ents = all.map((id) => ({ id, label: label(id) })).filter((e) => !q || e.label.toLowerCase().includes(q)).sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
    return { cards: list, entities: ents };
  }, [detail.entries, detail.unplaced, view, search, sections, staffName, roomName, secNames]);

  const { placed, covered } = useMemo(() => {
    // Lessons that run at the same time share a cell, so a cell holds a list.
    const p = new Map<string, Card[]>();
    const c = new Set<string>();
    for (const card of cards) {
      p.set(card.key, [...(p.get(card.key) ?? []), card]);
      for (let k = 1; k < card.length; k += 1) c.add(`${card.entityId}|${card.day}|${card.startNo + k}`);
    }
    return { placed: p, covered: c };
  }, [cards]);

  const selectedEntry = selected ? detail.entries.find((e) => e.blockId === selected) : undefined;
  const selectedUnplaced = selected ? detail.unplaced.find((u) => u.blockId === selected) : undefined;

  // ------------------------------------------------------------------ fit map

  useEffect(() => {
    if (!selected || readOnly || selectedEntry?.locked) return undefined;
    let live = true;
    const updatedAt = detail.version.updatedAt;
    setFitResult(null);
    api.getFit(versionId, selected)
      .then((positions) => {
        if (live) setFitResult({ blockId: selected, updatedAt, positions: new Map(positions.map((p) => [`${p.day}|${p.first}`, p])) });
      })
      .catch(() => { if (live) setFitResult({ blockId: selected, updatedAt, positions: null }); });
    return () => {
      live = false;
    };
  }, [api, selected, versionId, readOnly, selectedEntry?.locked, detail.version.updatedAt]);

  useEffect(() => {
    if (!publishing) return undefined;
    let live = true;
    setPreview(null);
    setPreviewError('');
    api.getPublicationPreview(versionId)
      .then((result) => { if (live) setPreview(result); })
      .catch((error) => { if (live) setPreviewError(plannerMessage(error, 'Could not load the publishing preview.')); });
    return () => { live = false; };
  }, [api, publishing, versionId, detail.version.updatedAt, previewAttempt]);

  useEffect(() => {
    if (selected && !selectedEntry && !selectedUnplaced) setSelected(null);
  }, [selected, selectedEntry, selectedUnplaced]);

  // ------------------------------------------------------------------ actions

  const act = async (task: () => Promise<VersionDetail>, success?: string, onError?: (message: string) => void) => {
    if (busy || readOnly) return false;
    setBusy(true);
    setSaveStatus('Saving…');
    try {
      const next = await task();
      onChange(next);
      setSaveStatus('Saved');
      if (success) notify(success, 'success');
      return true;
    } catch (error) {
      setSaveStatus('Change not saved');
      const message = plannerMessage(error);
      if (onError) onError(message);
      else notify(message, 'danger');
      return false;
    } finally {
      setBusy(false);
    }
  };

  const place = async (blockId: string, day: number, no: number) => {
    if (readOnly || busy) return;
    const was = detail.entries.find((e) => e.blockId === blockId);
    setAttempt(null);
    const refusal = (message: string) => setAttempt({ blockId, day, period: no, message });
    if (was?.locked) {
      refusal('Unlock this lesson before moving it.');
      return;
    }
    const position = selected === blockId ? fit?.get(`${day}|${no}`) : undefined;
    if (position && !position.ok) {
      refusal(position.reasons?.join(' ') || position.reason || 'This slot is blocked.');
      return;
    }
    const ok = await act(
      () => (was ? api.moveLesson(versionId, blockId, day, no) : api.placeLesson(versionId, blockId, day, no)),
      undefined,
      refusal,
    );
    if (ok) {
      undo.current.push({ blockId, was: was ? { day: was.day, startNo: was.startNo } : null });
      setUndoCount(undo.current.length);
      setSelected(null);
    }
  };

  const unschedule = async (blockId: string) => {
    const was = detail.entries.find((e) => e.blockId === blockId);
    if (!was) return;
    const ok = await act(() => api.unscheduleLesson(versionId, blockId), 'Moved to the unscheduled lessons.');
    if (ok) {
      undo.current.push({ blockId, was: { day: was.day, startNo: was.startNo } });
      setUndoCount(undo.current.length);
      setSelected(null);
    }
  };

  const undoLast = async () => {
    if (busy || readOnly) return;
    const op = undo.current.pop();
    setUndoCount(undo.current.length);
    if (!op) return;
    const placedNow = detail.entries.some((e) => e.blockId === op.blockId);
    const previous = op.was;
    if (previous) {
      const save = placedNow ? api.moveLesson : api.placeLesson;
      if (await act(() => save(versionId, op.blockId, previous.day, previous.startNo), 'Undone.')) return;
    } else if (!placedNow || await act(() => api.unscheduleLesson(versionId, op.blockId), 'Undone.')) {
      return;
    }
    undo.current.push(op);
    setUndoCount(undo.current.length);
  };

  const regenerate = async (keepPlaced = false) => {
    if (busy || readOnly || !canCreate) return;
    setBusy(true);
    try {
      const next = await api.generate({ versionId, budgetMs: budget, keepPlaced });
      undo.current = [];
      setUndoCount(0);
      onChange(next);
      if (keepPlaced && detail.requiresRegeneration) {
        notify('Draft checked against the current plan. Review unplaced lessons and Critical rules before publishing.', 'success');
        return;
      }
      notify(keepPlaced ? 'Auto-fill finished.' : `Regenerated in ${(next.generation?.ms ?? 0) / 1000}s.`, 'success');
    } catch (error) {
      notify(plannerMessage(error, 'Could not generate.'), 'danger');
    } finally {
      setBusy(false);
    }
  };

  const refreshAfterPublication = async () => {
    const [result] = await Promise.allSettled([api.getVersion(versionId), reloadState()]);
    if (result.status === 'fulfilled') {
      onChange(result.value);
      return;
    }
    onChange(null);
    notify('Could not refresh the timetable after saving. Open it again from the version list.', 'warning');
  };

  const publish = async () => {
    if (!preview || preview.blockers.length || busy || !canManage) return;
    setBusy(true);
    try {
      const { entries } = await api.publishVersion(versionId, { revision: preview.revision });
      setPublishing(false);
      notify(`Timetable published. ${entries} timetable ${entries === 1 ? 'entry' : 'entries'} saved.`, 'success');
      await refreshAfterPublication();
    } catch (error) {
      setPreviewError(plannerMessage(error, 'Could not publish.'));
    } finally {
      setBusy(false);
    }
  };

  const restore = async () => {
    if (busy || !canManage || !detail.version.canRestore) return;
    setBusy(true);
    try {
      await api.restorePublication(versionId);
      setRestoring(false);
      notify('Previous timetable restored.', 'success');
      await refreshAfterPublication();
    } catch (error) {
      notify(plannerMessage(error, 'Could not restore the previous timetable.'), 'danger');
    } finally {
      setBusy(false);
    }
  };

  // ---------------------------------------------------------------- drag/drop

  const onDragStart = (event: DragEvent, blockId: string, locked: boolean) => {
    if (readOnly || locked) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.setData('text/plain', blockId);
    event.dataTransfer.effectAllowed = 'move';
    setSelected(blockId);
  };
  const onDropCell = (event: DragEvent, day: number, no: number) => {
    event.preventDefault();
    setDropKey(null);
    const blockId = event.dataTransfer.getData('text/plain') || selected;
    if (blockId) void place(blockId, day, no);
  };

  const onCellClick = (day: number, no: number) => {
    if (selected && !readOnly) void place(selected, day, no);
  };

  // ------------------------------------------------------------------ render

  const alternativeSlots = [...(fit?.values() ?? [])]
    .filter((slot) => slot.ok && (slot.day !== selectedEntry?.day || slot.first !== selectedEntry.startNo))
    .sort((a, b) => (a.softDelta ?? 0) - (b.softDelta ?? 0) || a.day - b.day || a.first - b.first);
  const slotLabel = (day: number, first: number, length = 1) => {
    const periods = teachingPeriods(detail.bell, day);
    const start = periods[first - 1];
    const end = periods[first + length - 2];
    const time = start && end ? ` (${start.startsAt}–${end.endsAt})` : '';
    return `${DAY_LONG[day]} P${first}${length > 1 ? `–P${first + length - 1}` : ''}${time}`;
  };
  const stats = detail.stats;
  const pct = stats.totalPeriods ? Math.round((stats.placedPeriods / stats.totalPeriods) * 100) : 100;

  const renderCard = (card: Card) => {
    const colors = subjectColors(card.subject.split(' · ')[0]);
    const isSel = selected === card.blockId;
    return (
      <div
        className={`tp-card ${isSel ? 'selected' : ''} ${card.locked || readOnly ? 'locked' : ''}`}
        style={{ background: colors.bg, borderLeftColor: colors.border }}
        draggable={!readOnly && !card.locked}
        role="button"
        tabIndex={0}
        aria-pressed={isSel}
        aria-label={`${card.subject}, ${card.lines.join(', ')}${card.locked ? ', locked' : ''}`}
        title={card.lines.join(' · ')}
        onDragStart={(e) => onDragStart(e, card.blockId, card.locked)}
        onClick={(e) => {
          e.stopPropagation();
          setSelected((s) => (s === card.blockId ? null : card.blockId));
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelected((s) => (s === card.blockId ? null : card.blockId));
          }
          if (e.key === 'Escape') setSelected(null);
        }}
      >
        <b>{card.subject}</b>
        {card.lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
        <span className="tp-tag">
          {card.locked ? <i className="ti ti-lock" aria-hidden="true" /> : null}
          {card.length > 1 ? ` ${card.length}P` : ''}
        </span>
      </div>
    );
  };

  return (
    <div>
      {readOnly ? (
        <div className="alert alert-info d-flex justify-content-between align-items-center">
          <span>
            <i className="ti ti-lock me-1" />
            This timetable is {detail.version.status === 'published' ? 'published' : 'archived'}.
            {canCreate ? ' Make a draft copy to edit it.' : ''}
          </span>
          {detail.version.canRestore && canManage ? (
            <button type="button" className="btn btn-sm btn-outline-primary" disabled={busy} onClick={() => setRestoring(true)}>
              Restore previous timetable
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="card mb-3">
        <div className="card-body d-flex flex-wrap gap-3 align-items-center justify-content-between">
          <div style={{ minWidth: 220 }}>
            <div className="fw-semibold">
              {stats.placedPeriods} of {stats.totalPeriods} periods placed
              {detail.unplaced.length ? <span className="badge badge-soft-danger ms-2">{detail.unplaced.length} unscheduled</span> : <span className="badge badge-soft-success ms-2">All placed</span>}
            </div>
            <div className="progress mt-1" style={{ height: 6 }} role="progressbar" aria-label="Periods placed" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
              <div className={`progress-bar ${detail.unplaced.length ? 'bg-warning' : 'bg-success'}`} style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="btn-group" role="group" aria-label="View">
            {(['class', 'teacher', 'room'] as View[]).map((v) => (
              <button key={v} type="button" className={`btn btn-sm ${view === v ? 'btn-primary' : 'btn-outline-light bg-white'}`} onClick={() => { setView(v); setSelected(null); }}>
                {v === 'class' ? 'Classes' : v === 'teacher' ? 'Teachers' : 'Rooms'}
              </button>
            ))}
          </div>

          <input className="form-control form-control-sm w-auto" placeholder={`Find a ${view}…`} aria-label="Find" value={search} onChange={(e) => setSearch(e.target.value)} />

          <div className="d-flex gap-2 flex-wrap align-items-center">
            {!readOnly ? <span className="text-muted fs-12" role="status">{saveStatus}</span> : null}
            <button type="button" className="btn btn-sm btn-outline-light bg-white" disabled={readOnly || undoCount === 0 || busy} onClick={() => void undoLast()}>
              <i className="ti ti-arrow-back-up me-1" />
              Undo
            </button>
            {!readOnly ? (
              <>
                <select className="form-select form-select-sm w-auto" aria-label="How long to search" value={budget} disabled={busy || !canCreate} onChange={(e) => setBudget(Number(e.target.value))}>
                  <option value={1000}>Quick (1s)</option>
                  <option value={3000}>Standard (3s)</option>
                  <option value={10000}>Thorough (10s)</option>
                </select>
                <button type="button" className="btn btn-sm btn-outline-primary" disabled={busy || !canCreate} onClick={() => void regenerate()}>
                  <i className="ti ti-refresh me-1" />
                  {busy ? 'Working…' : 'Regenerate'}
                </button>
                {detail.entries.length > 0 && detail.unplaced.length > 0 ? (
                  <button type="button" className="btn btn-sm btn-outline-primary" disabled={busy || !canCreate} onClick={() => void regenerate(true)} title="Keep every lesson where it is and place the rest">
                    <i className="ti ti-wand me-1" />
                    Auto-fill the rest
                  </button>
                ) : null}
                <button type="button" className="btn btn-sm btn-success" disabled={busy} onClick={() => { setPreview(null); setPreviewError(''); setPublishing(true); }}>
                  <i className="ti ti-send me-1" />
                  Preview publication
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {detail.requiresRegeneration ? (
        <div className="alert alert-warning d-flex flex-wrap align-items-center justify-content-between gap-2" role="alert">
          <span>This draft needs to be checked against the current plan before publishing.</span>
          <button type="button" className="btn btn-sm btn-outline-primary" disabled={busy || !canCreate} onClick={() => void regenerate(true)}>
            Revalidate and keep valid placements
          </button>
        </div>
      ) : null}
      {detail.criticalViolations?.length ? (
        <div className="alert alert-danger" role="alert">
          <strong>Critical rules need attention</strong>
          <ul className="mb-0">{detail.criticalViolations?.map((message) => <li key={message}>{message}</li>)}</ul>
        </div>
      ) : null}
      {detail.dropped.length ? (
        <div className="alert alert-warning fs-13">
          {detail.dropped.length} lesson{detail.dropped.length === 1 ? '' : 's'} no longer fit{detail.dropped.length === 1 ? 's' : ''} after the plan changed and {detail.dropped.length === 1 ? 'was' : 'were'} moved to unscheduled.
        </div>
      ) : null}
      {detail.generation?.warnings.map((w) => (
        <div key={w} className="alert alert-warning fs-13">{w}</div>
      ))}

      {!readOnly ? (
        <p className="text-muted fs-12 mb-2">
          <i className="ti ti-hand-click me-1" />
          Select a lesson to see suggested slots. Green slots fit. Hover over a red slot or focus it and press Enter for the reason.
        </p>
      ) : null}

      <div className="tp-grid-wrap" style={{ maxHeight: '68vh' }}>
        <table className="tp-grid" aria-label="Timetable">
          <thead>
            <tr>
              <th style={{ left: 0, zIndex: 3 }} />
              {Array.from({ length: maxNo }, (_, i) => (
                <th key={i}>
                  P{i + 1}
                  <small>{headerPeriods[i] ? `${headerPeriods[i].startsAt}–${headerPeriods[i].endsAt}` : ''}</small>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entities.length === 0 ? (
              <tr><td colSpan={maxNo + 1} className="text-center text-muted py-5">Nothing to show here yet.</td></tr>
            ) : null}
            {entities.map((entity) => {
              const count = cards.filter((c) => c.entityId === entity.id).length;
              return [
                <tr key={`h-${entity.id}`} className="tp-entity">
                  <td colSpan={maxNo + 1}>{entity.label} <span className="text-muted fw-normal fs-12">· {count} lesson{count === 1 ? '' : 's'}</span></td>
                </tr>,
                ...days.map((day) => {
                  const open = teachingPeriods(detail.bell, day).length;
                  const cells = [];
                  for (let no = 1; no <= maxNo; no += 1) {
                    const key = `${entity.id}|${day}|${no}`;
                    if (covered.has(key)) continue;
                    if (no > open) {
                      cells.push(<td key={no} className="closed" aria-hidden="true" />);
                      continue;
                    }
                    const here = placed.get(key);
                    const f = selected && !selectedEntry?.locked ? fit?.get(`${day}|${no}`) : undefined;
                    const origin = Boolean(here?.some((c) => c.blockId === selected));
                    const cls = [origin ? 'fit-origin' : '', !here && f ? (f.ok ? 'fit-ok' : 'fit-no') : '', dropKey === key ? 'drop' : ''].join(' ').trim();
                    cells.push(
                      <td
                        key={no}
                        colSpan={here ? Math.max(...here.map((c) => c.length)) : 1}
                        className={cls}
                        title={f && !f.ok ? f.reasons?.join(' ') || f.reason || undefined : f?.ok ? 'This fits' : undefined}
                        tabIndex={f && !here ? 0 : undefined}
                        aria-label={f && !here ? `${slotLabel(day, no)}. ${f.ok ? 'Available' : f.reasons?.join(' ') || f.reason || 'Blocked'}` : undefined}
                        onKeyDown={(event) => {
                          if (!f || event.target !== event.currentTarget || !['Enter', ' '].includes(event.key)) return;
                          event.preventDefault();
                          onCellClick(day, no);
                        }}
                        onDragOver={(e) => { if (!readOnly) { e.preventDefault(); setDropKey(key); } }}
                        onDragLeave={() => setDropKey((k) => (k === key ? null : k))}
                        onDrop={(e) => onDropCell(e, day, no)}
                        onClick={() => onCellClick(day, no)}
                      >
                        {here ? (
                          <div style={{ display: 'flex', gap: 3, height: '100%' }}>
                            {here.map((card) => (
                              <div key={JSON.stringify([card.unitKey, card.entityId])} style={{ flex: 1, minWidth: 0 }}>{renderCard(card)}</div>
                            ))}
                          </div>
                        ) : null}
                      </td>,
                    );
                  }
                  return (
                    <tr key={`${entity.id}-${day}`}>
                      <td className="tp-day" title={DAY_LONG[day]}>{DAY_SHORT[day]}</td>
                      {cells}
                    </tr>
                  );
                }),
              ];
            })}
          </tbody>
        </table>
      </div>

      <div
        className={`tp-tray mt-3 ${trayOver ? 'over' : ''}`}
        onDragOver={(e) => { if (!readOnly) { e.preventDefault(); setTrayOver(true); } }}
        onDragLeave={() => setTrayOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setTrayOver(false);
          const id = e.dataTransfer.getData('text/plain');
          if (id && !readOnly) void unschedule(id);
        }}
      >
        <div className="fw-semibold fs-13 mb-2">
          Unscheduled lessons ({detail.unplaced.length}) <span className="text-muted fw-normal">— pick one, then choose a green slot. Drop a placed lesson here to take it off the timetable.</span>
        </div>
        {detail.unplaced.length === 0 ? <div className="text-muted fs-13">Everything is on the timetable.</div> : null}
        {detail.unplaced.map((u) => {
          const colors = subjectColors(u.subjectName.split(' / ')[0]);
          return (
            <div key={u.blockId} className="d-inline-block align-top" style={{ maxWidth: 320 }}>
              <div
                className={`tp-card ${selected === u.blockId ? 'selected' : ''}`}
                style={{ background: colors.bg, borderLeftColor: colors.border }}
                draggable={!readOnly}
                role="button"
                tabIndex={0}
                aria-pressed={selected === u.blockId}
                onDragStart={(e) => onDragStart(e, u.blockId, false)}
                onClick={() => !readOnly && setSelected((s) => (s === u.blockId ? null : u.blockId))}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !readOnly && (e.preventDefault(), setSelected((s) => (s === u.blockId ? null : u.blockId)))}
              >
                <b>{u.subjectName}{u.length > 1 ? ` (${u.length}P)` : ''}</b>
                <span>{u.sectionIds.map((s) => sectionLabel(sections, s)).join(' + ')}</span>
                <span>{u.teacherIds.map((t) => staffName.get(t) ?? t).join(', ') || 'No teacher'}</span>
                <span className={u.placeable ? 'text-muted' : 'text-danger'} style={{ whiteSpace: 'normal' }}>{u.reasons[0]}</span>
              </div>
            </div>
          );
        })}
      </div>

      {selected && !readOnly ? (
        <div className="tp-sticky-bar mt-3 d-flex flex-wrap gap-3 align-items-center justify-content-between">
          {whoOpen && !selectedEntry?.locked ? (
            <div className="tp-who-pop">
              <TeacherAvailability
                api={api}
                versionId={versionId}
                blockId={selected}
                updatedAt={detail.version.updatedAt}
                subjectName={selectedEntry?.subjectName ?? selectedUnplaced?.subjectName ?? 'this subject'}
                disabled={busy}
                onPlace={(day, no) => void place(selected, day, no)}
              />
            </div>
          ) : null}
          <div className="fs-13">
            <b>{selectedEntry ? selectedEntry.subjectName : selectedUnplaced?.subjectName}</b>
            {selectedEntry ? (
              <span className="text-muted"> · {DAY_LONG[selectedEntry.day]} period {selectedEntry.startNo}{selectedEntry.length > 1 ? `–${selectedEntry.startNo + selectedEntry.length - 1}` : ''}</span>
            ) : (
              <span className="text-muted"> · not on the timetable</span>
            )}
            {attempt?.blockId === selected ? (
              <p className="text-danger mb-1" role="alert">
                {slotLabel(attempt.day, attempt.period, selectedEntry?.length ?? selectedUnplaced?.length)}: {attempt.message}
              </p>
            ) : null}
            <div className="text-muted fs-12" role="status">
              {selectedEntry?.locked ? 'This lesson is locked. Unlock it to move it.' :
                fit === null ? 'Could not check available slots. Select the lesson again to retry.' :
                !fit ? 'Checking available slots…' :
                alternativeSlots.length ? `${alternativeSlots.length} alternative slots available.` : 'No alternative slots fit.'}
            </div>
            {!selectedEntry?.locked && alternativeSlots.length > 0 ? (
              <div className="d-flex flex-wrap gap-2 mt-2" aria-label="Suggested slots" role="group">
                <span className="align-self-center">Suggested slots</span>
                {alternativeSlots.slice(0, 3).map((slot) => (
                  <button
                    type="button"
                    key={`${slot.day}|${slot.first}`}
                    className="btn btn-sm btn-outline-primary"
                    disabled={busy}
                    onClick={() => void place(selected, slot.day, slot.first)}
                  >
                    {slotLabel(slot.day, slot.first, selectedEntry?.length ?? selectedUnplaced?.length)}
                  </button>
                ))}
              </div>
            ) : null}
            {selectedUnplaced ? (
              <ul className={`mb-0 mt-1 fs-12 ps-3 ${selectedUnplaced.placeable ? 'text-muted' : 'text-danger'}`}>
                {selectedUnplaced.reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="d-flex gap-2">
            {selectedEntry ? (
              <>
                <button type="button" className="btn btn-sm btn-outline-light bg-white" disabled={busy} onClick={() => void act(() => api.lockLesson(versionId, selectedEntry.blockId, !selectedEntry.locked), selectedEntry.locked ? 'Unlocked.' : 'Locked. It will stay here when you regenerate.')}>
                  <i className={`ti ${selectedEntry.locked ? 'ti-lock-open' : 'ti-lock'} me-1`} />
                  {selectedEntry.locked ? 'Unlock' : 'Lock'}
                </button>
                <button type="button" className="btn btn-sm btn-outline-danger" disabled={busy || selectedEntry.locked} onClick={() => void unschedule(selectedEntry.blockId)}>
                  Unschedule
                </button>
              </>
            ) : null}
            {!selectedEntry?.locked ? (
              <button type="button" className="btn btn-sm btn-outline-light bg-white" aria-expanded={whoOpen} onClick={() => setWhoOpen((open) => !open)}>
                <i className="ti ti-users me-1" />
                Who is free
              </button>
            ) : null}
            <button type="button" className="btn btn-sm btn-primary" onClick={() => setSelected(null)}>Done</button>
          </div>
        </div>
      ) : null}

      <div className="mt-4">
        <div className="btn-group mb-3" role="group" aria-label="Reports">
          <button type="button" className={`btn btn-sm ${panel === 'insights' ? 'btn-primary' : 'btn-outline-light bg-white'}`} onClick={() => setPanel(panel === 'insights' ? 'none' : 'insights')}>
            Insights {detail.insights.poor ? <span className="badge bg-danger ms-1">{detail.insights.poor}</span> : null}
          </button>
          <button type="button" className={`btn btn-sm ${panel === 'workload' ? 'btn-primary' : 'btn-outline-light bg-white'}`} onClick={() => setPanel(panel === 'workload' ? 'none' : 'workload')}>
            Teacher workload
          </button>
        </div>

        {panel === 'insights' ? (
          <div className="card">
            <div className="card-body">
              <div className="d-flex gap-3 mb-3 flex-wrap">
                <span className="badge badge-soft-success fs-13">Well spread: {detail.insights.perfect}</span>
                <span className="badge badge-soft-danger fs-13">Uneven: {detail.insights.poor}</span>
                <span className="badge badge-soft-secondary fs-13">Checked: {detail.insights.total}</span>
              </div>
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Class</th><th>Subject</th><th>Taught by</th><th>Lessons</th>
                      {detail.insights.days.map((d) => <th key={d} className="text-center">{DAY_SHORT[d]}</th>)}
                      <th>Ideal per day</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.insights.rows.filter((r) => r.poor).slice(0, 40).map((r) => (
                      <tr key={`${r.sectionId}-${r.subjectName}`}>
                        <td>{r.section}</td>
                        <td>{r.subjectName}</td>
                        <td className="fs-13">{r.teachers.join(', ') || '—'}</td>
                        <td>{r.units}{r.unitLength > 1 ? ` × ${r.unitLength}P` : ''}</td>
                        {r.actual.map((n, i) => <td key={i} className="text-center"><span className={`tp-day-cell ${n > 1 ? 'hot' : n === 1 ? 'warm' : ''}`}>{n}</span></td>)}
                        <td className="fs-13">{r.ideal}</td>
                      </tr>
                    ))}
                    {detail.insights.poor === 0 ? <tr><td colSpan={5 + detail.insights.days.length} className="text-center text-muted py-3">Every lesson is evenly spread across the week.</td></tr> : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}

        {panel === 'workload' ? (
          <div className="card">
            <div className="card-body table-responsive">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Teacher</th>
                    {days.map((d) => <th key={d} className="text-center">{DAY_SHORT[d]}</th>)}
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.workload.map((w) => (
                    <tr key={w.teacherId}>
                      <td>{w.name}</td>
                      {w.perDay.map((n, i) => <td key={i} className="text-center"><span className={`tp-day-cell ${n >= 6 ? 'hot' : n >= 5 ? 'warm' : ''}`}>{n}</span></td>)}
                      <td className="text-end fw-semibold">{w.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>

      <Modal
        open={publishing}
        onClose={() => { if (!busy) setPublishing(false); }}
        title="Publishing preview"
        footer={
          <>
            <button type="button" className="btn btn-outline-light bg-white" disabled={busy} onClick={() => setPublishing(false)}>{canManage ? 'Cancel' : 'Close'}</button>
            {canManage ? (
              <button type="button" className="btn btn-success" disabled={busy || !preview || Boolean(previewError) || preview.blockers.length > 0} onClick={() => void publish()}>{busy ? 'Publishing…' : 'Publish'}</button>
            ) : null}
          </>
        }
      >
        <p>Publishing <b>{detail.version.name}</b> updates the Class Timetable and Teacher Timetable.</p>
        {previewError ? (
          <div className="mt-3">
            <p className="text-danger mb-2" role="alert">{previewError}</p>
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setPreviewAttempt((attempt) => attempt + 1)}>
              Refresh preview
            </button>
          </div>
        ) : null}
        {!preview && !previewError ? <p className="mt-3" role="status">Preparing preview…</p> : null}
        {preview ? (
          <div className="mt-3">
            {detail.bell.dayTypes.length ? (
              <details className="mb-3">
                <summary>Review bell times by day type</summary>
                {detail.bell.dayTypes.map((dayType) => (
                  <div key={dayType.id} className="mt-2">
                    <strong>{dayType.name} · {dayType.days.map((day) => DAY_SHORT[day]).join(', ')}</strong>
                    <div>{dayType.periods.map((period) => period.name + ' ' + period.startsAt + '–' + period.endsAt).join(' · ')}</div>
                  </div>
                ))}
              </details>
            ) : null}
            {preview.sectionIds.length ? <p><b>Classes affected</b> · {preview.sectionIds.map((id) => sectionLabel(sections, id)).join(', ')}</p> : null}
            {preview.blockers.length ? (
              <div className="alert alert-danger" role="alert">
                <strong>Fix before publishing</strong>
                <ul className="mb-0">{preview.blockers.map((message) => <li key={message}>{message}</li>)}</ul>
              </div>
            ) : null}
            <ul>
              <li>{preview.classEntries} timetable entries across {preview.classes} classes.</li>
              <li>{preview.teacherEntries} timetable entries across {preview.teachers} teachers.</li>
              <li>{preview.periodRows} bell rows, {preview.plannerEntriesReplaced} planner entries to replace, and {preview.manualEntriesArchived} manual entries to archive.</li>
            </ul>
            {preview.unplaced > 0 && preview.unplaced === detail.unplaced.length ? (
              <details className="mb-3">
                <summary>Review {preview.unplaced} unscheduled {preview.unplaced === 1 ? 'lesson' : 'lessons'}</summary>
                <ul className="mb-0">
                  {detail.unplaced.map((lesson) => (
                    <li key={lesson.blockId}>{lesson.subjectName} · {lesson.sectionIds.map((id) => sectionLabel(sections, id)).join(', ')}</li>
                  ))}
                </ul>
              </details>
            ) : null}
            <p className="mb-0">
              Use Restore previous timetable to undo this publication.
            </p>
          </div>
        ) : null}
      </Modal>
      <Modal
        open={restoring}
        onClose={() => { if (!busy) setRestoring(false); }}
        title="Restore previous timetable"
        footer={
          <>
            <button type="button" className="btn btn-outline-light" disabled={busy} onClick={() => setRestoring(false)}>Cancel</button>
            <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void restore()}>
              {busy ? 'Restoring…' : 'Restore timetable'}
            </button>
          </>
        }
      >
        <p className="mb-0">This archives <b>{detail.version.name}</b> and restores the timetable and calendar that were in use before it was published.</p>
      </Modal>
    </div>
  );
};

export default TimetableEditor;
