import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import {
  SUBJECT_TYPES,
  createSubject,
  deleteSubject,
  listAllClasses,
  listAllSubjects,
  listClassSubjects,
  setClassSubjects,
  updateSubject,
} from '@services/subjects/subjects.api';
import type {
  ClassRecord,
  ClassSubjectInput,
  ClassSubjectRow,
  SubjectRecord,
  SubjectStatus,
  SubjectType,
} from '@services/subjects/subjects.api';

const routes = all_routes;

const TYPE_TONE: Record<SubjectType, string> = {
  core: 'badge-soft-success',
  language: 'badge-soft-primary',
  elective: 'badge-soft-warning',
  co_curricular: 'badge-soft-info',
  practical: 'badge-soft-success',
};

const typeLabel = (type: string) => SUBJECT_TYPES.find((t) => t.value === type)?.label ?? type;

/* ---------------------------------- drafts --------------------------------- */

interface SubjectDraft {
  code: string;
  name: string;
  subjectType: SubjectType;
  credits: string;
  status: SubjectStatus;
}

interface ClassDraft {
  on: boolean;
  periods: string;
  exam: string;
  internal: string;
  pass: string;
}

const EMPTY_SUBJECT: SubjectDraft = { code: '', name: '', subjectType: 'core', credits: '', status: 'active' };
const DEFAULT_CLASS: ClassDraft = { on: false, periods: '5', exam: '80', internal: '20', pass: '35' };

type Drawer =
  | { kind: 'subject'; editing: SubjectRecord | null }
  | { kind: 'classes'; subject: SubjectRecord }
  | null;

const key = (id: string | number) => String(id);
const num = (value: string): number => (value.trim() === '' ? NaN : Number(value));

/* ---------------------------------- page ---------------------------------- */

const ClassSubject = () => {
  const { toasts, push, dismiss } = useToasts();

  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [byClass, setByClass] = useState<Record<string, ClassSubjectRow[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [drawer, setDrawer] = useState<Drawer>(null);
  const [subjectDraft, setSubjectDraft] = useState<SubjectDraft>(EMPTY_SUBJECT);
  const [classDrafts, setClassDrafts] = useState<Record<string, ClassDraft>>({});
  const [baseline, setBaseline] = useState<Record<string, ClassDraft>>({});
  const [busy, setBusy] = useState(false);
  const [drawerError, setDrawerError] = useState('');

  const reload = useCallback(() => setTick((n) => n + 1), []);

  /* ------------------------------- load the data ------------------------------ */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    (async () => {
      try {
        const [subjectList, classList] = await Promise.all([listAllSubjects(), listAllClasses()]);
        const perClass = await Promise.all(
          classList.map((c) => listClassSubjects(c.id).catch(() => [] as ClassSubjectRow[])),
        );
        if (cancelled) return;
        const map: Record<string, ClassSubjectRow[]> = {};
        classList.forEach((c, index) => {
          map[key(c.id)] = perClass[index];
        });
        setSubjects(subjectList);
        setClasses(classList);
        setByClass(map);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load the subjects.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tick]);

  /* ---------------------------------- derived --------------------------------- */
  /** subjectId -> the classes that teach it. */
  const usage = useMemo(() => {
    const map = new Map<string, { className: string; periods: number | null }[]>();
    for (const cls of classes) {
      for (const row of byClass[key(cls.id)] ?? []) {
        const list = map.get(key(row.subjectId)) ?? [];
        list.push({ className: cls.name, periods: row.periodsPerWeek });
        map.set(key(row.subjectId), list);
      }
    }
    return map;
  }, [classes, byClass]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return subjects.filter((s) => {
      if (typeFilter && s.subjectType !== typeFilter) return false;
      if (statusFilter && s.status !== statusFilter) return false;
      if (term && !`${s.name} ${s.code}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [subjects, search, typeFilter, statusFilter]);

  /* ------------------------------- subject drawer ------------------------------ */
  const openSubject = (editing: SubjectRecord | null) => {
    setDrawerError('');
    setSubjectDraft(
      editing
        ? {
            code: editing.code,
            name: editing.name,
            subjectType: editing.subjectType,
            credits: editing.credits == null ? '' : String(Number(editing.credits)),
            status: editing.status,
          }
        : EMPTY_SUBJECT,
    );
    setDrawer({ kind: 'subject', editing });
  };

  const saveSubject = async (event: FormEvent) => {
    event.preventDefault();
    if (drawer?.kind !== 'subject') return;
    const credits = subjectDraft.credits.trim() === '' ? null : Number(subjectDraft.credits);
    if (credits !== null && (!Number.isFinite(credits) || credits < 0 || credits > 99.9)) {
      setDrawerError('Credits must be a number between 0 and 99.9.');
      return;
    }
    setBusy(true);
    setDrawerError('');
    try {
      const payload = {
        code: subjectDraft.code.trim().toUpperCase(),
        name: subjectDraft.name.trim(),
        subjectType: subjectDraft.subjectType,
        credits,
        status: subjectDraft.status,
      };
      if (drawer.editing) await updateSubject(drawer.editing.id, payload);
      else await createSubject(payload);
      push(drawer.editing ? 'Subject updated' : 'Subject added');
      setDrawer(null);
      reload();
    } catch (e) {
      setDrawerError(e instanceof Error ? e.message : 'Could not save the subject.');
    } finally {
      setBusy(false);
    }
  };

  /* ------------------------------- classes drawer ------------------------------ */
  const openClasses = (subject: SubjectRecord) => {
    setDrawerError('');
    const drafts: Record<string, ClassDraft> = {};
    for (const cls of classes) {
      const row = (byClass[key(cls.id)] ?? []).find((r) => key(r.subjectId) === key(subject.id));
      drafts[key(cls.id)] = row
        ? {
            on: true,
            periods: row.periodsPerWeek == null ? '' : String(row.periodsPerWeek),
            exam: String(Number(row.examMarks)),
            internal: String(Number(row.internalMarks)),
            pass: row.passMarks == null ? '' : String(Number(row.passMarks)),
          }
        : { ...DEFAULT_CLASS };
    }
    setClassDrafts(drafts);
    setBaseline(JSON.parse(JSON.stringify(drafts)) as Record<string, ClassDraft>);
    setDrawer({ kind: 'classes', subject });
  };

  const patchDraft = (classId: string, patch: Partial<ClassDraft>) =>
    setClassDrafts((current) => ({ ...current, [classId]: { ...current[classId], ...patch } }));

  const saveClasses = async () => {
    if (drawer?.kind !== 'classes') return;
    const subjectId = key(drawer.subject.id);

    // validate the ticked classes
    for (const cls of classes) {
      const d = classDrafts[key(cls.id)];
      if (!d?.on) continue;
      const periods = d.periods.trim() === '' ? 0 : num(d.periods);
      const exam = num(d.exam);
      const internal = num(d.internal);
      const pass = d.pass.trim() === '' ? null : num(d.pass);
      if (!Number.isInteger(periods) || periods < 0 || periods > 60) {
        setDrawerError(`${cls.name}: periods per week must be a whole number from 0 to 60.`);
        return;
      }
      if (!Number.isFinite(exam) || !Number.isFinite(internal) || exam < 0 || internal < 0) {
        setDrawerError(`${cls.name}: enter the exam and internal marks.`);
        return;
      }
      if (pass !== null && (!Number.isFinite(pass) || pass < 0 || pass > exam + internal)) {
        setDrawerError(`${cls.name}: pass marks cannot be more than exam + internal marks.`);
        return;
      }
    }

    setBusy(true);
    setDrawerError('');
    try {
      let changed = 0;
      for (const cls of classes) {
        const id = key(cls.id);
        const draft = classDrafts[id];
        if (!draft || JSON.stringify(draft) === JSON.stringify(baseline[id])) continue;

        const others = (byClass[id] ?? []).filter((r) => key(r.subjectId) !== subjectId);
        const keep: ClassSubjectInput[] = others.map((r) => ({
          subjectId: key(r.subjectId),
          isElective: r.isElective,
          periodsPerWeek: r.periodsPerWeek,
          displayOrder: r.displayOrder,
          examMarks: Number(r.examMarks),
          internalMarks: Number(r.internalMarks),
          passMarks: r.passMarks == null ? null : Number(r.passMarks),
        }));

        if (draft.on) {
          const existing = (byClass[id] ?? []).find((r) => key(r.subjectId) === subjectId);
          keep.push({
            subjectId,
            isElective: existing?.isElective ?? drawer.subject.subjectType === 'elective',
            periodsPerWeek: draft.periods.trim() === '' ? null : Number(draft.periods),
            displayOrder: existing?.displayOrder ?? others.reduce((m, r) => Math.max(m, r.displayOrder), 0) + 1,
            examMarks: Number(draft.exam),
            internalMarks: Number(draft.internal),
            passMarks: draft.pass.trim() === '' ? null : Number(draft.pass),
          });
        }

        await setClassSubjects(cls.id, keep);
        changed += 1;
      }
      push(changed === 0 ? 'Nothing to change' : `Saved for ${changed} class${changed === 1 ? '' : 'es'}`);
      setDrawer(null);
      reload();
    } catch (e) {
      setDrawerError(e instanceof Error ? e.message : 'Could not save the classes.');
    } finally {
      setBusy(false);
    }
  };

  /* ---------------------------------- delete ---------------------------------- */
  const remove = async (subject: SubjectRecord) => {
    if ((usage.get(key(subject.id)) ?? []).length > 0) {
      setError(`${subject.name} is still taught in some classes. Remove it from those classes first.`);
      return;
    }
    if (!window.confirm(`Delete ${subject.name}? This cannot be undone.`)) return;
    try {
      await deleteSubject(subject.id);
      push('Subject deleted');
      reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete the subject.');
    }
  };

  /* ----------------------------------- view ----------------------------------- */
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Class Subject</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="#">Academic</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Class Subject
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
            <button
              type="button"
              className="btn btn-primary mb-2 d-inline-flex align-items-center"
              onClick={() => openSubject(null)}
            >
              <i className="ti ti-square-rounded-plus me-1" />
              Add Subject
            </button>
          </div>
        </div>

        {error ? (
          <div className="alert alert-danger d-flex align-items-center justify-content-between" role="alert">
            <span>{error}</span>
            <button type="button" className="btn-close" aria-label="Dismiss" onClick={() => setError('')} />
          </div>
        ) : null}

        <div className="card">
          <div className="card-header border-bottom">
            <div className="row g-2 align-items-center">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by subject name or code…"
                  aria-label="Search subjects"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  aria-label="Filter by type"
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                >
                  <option value="">All types</option>
                  {SUBJECT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  aria-label="Filter by status"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="">All status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="col-md-2 text-md-end text-muted fs-13">
                {visible.length} of {subjects.length} subjects
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            {loading ? (
              <div className="text-center text-muted py-5">Loading…</div>
            ) : visible.length === 0 ? (
              <div className="text-center py-5">
                <h5 className="mb-1">{subjects.length === 0 ? 'No subjects yet' : 'No subjects match your filters'}</h5>
                <p className="text-muted mb-3">
                  {subjects.length === 0
                    ? 'Add your first subject, then choose the classes that teach it.'
                    : 'Try a different search or clear the filters.'}
                </p>
                {subjects.length === 0 ? (
                  <button type="button" className="btn btn-primary" onClick={() => openSubject(null)}>
                    <i className="ti ti-square-rounded-plus me-1" />
                    Add Subject
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Type</th>
                      <th>Credits</th>
                      <th>Classes</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((subject) => {
                      const taught = usage.get(key(subject.id)) ?? [];
                      return (
                        <tr key={key(subject.id)}>
                          <td>
                            <div className="fw-medium text-dark">{subject.name}</div>
                            <div className="text-muted fs-12">{subject.code}</div>
                          </td>
                          <td>
                            <span className={`badge ${TYPE_TONE[subject.subjectType] ?? 'badge-soft-secondary'}`}>
                              {typeLabel(subject.subjectType)}
                            </span>
                          </td>
                          <td>{subject.credits == null ? '—' : Number(subject.credits)}</td>
                          <td>
                            {taught.length === 0 ? (
                              <span className="text-muted fs-13">Not assigned</span>
                            ) : (
                              <div className="d-flex flex-wrap gap-1">
                                {taught.map((t) => (
                                  <span className="badge badge-soft-secondary" key={t.className}>
                                    {t.className}
                                    {t.periods != null ? ` · ${t.periods}/wk` : ''}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td>
                            <span
                              className={`badge ${subject.status === 'active' ? 'badge-soft-success' : 'badge-soft-danger'}`}
                            >
                              {subject.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="d-inline-flex gap-1">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-light bg-white"
                                title="Classes"
                                onClick={() => openClasses(subject)}
                              >
                                <i className="ti ti-school me-1" />
                                Classes
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-light bg-white"
                                title="Edit"
                                aria-label={`Edit ${subject.name}`}
                                onClick={() => openSubject(subject)}
                              >
                                <i className="ti ti-edit" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-light bg-white text-danger"
                                title="Delete"
                                aria-label={`Delete ${subject.name}`}
                                onClick={() => remove(subject)}
                              >
                                <i className="ti ti-trash" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit subject */}
      <Offcanvas
        open={drawer?.kind === 'subject'}
        onClose={() => setDrawer(null)}
        title={drawer?.kind === 'subject' && drawer.editing ? 'Edit Subject' : 'Add Subject'}
        labelledById="subject-drawer-title"
      >
        <form onSubmit={saveSubject}>
          {drawerError ? <div className="alert alert-danger">{drawerError}</div> : null}
          <div className="mb-3">
            <label className="form-label" htmlFor="sj-name">
              Name
            </label>
            <input
              id="sj-name"
              className="form-control"
              required
              minLength={2}
              maxLength={100}
              value={subjectDraft.name}
              onChange={(event) => setSubjectDraft({ ...subjectDraft, name: event.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="sj-code">
              Code
            </label>
            <input
              id="sj-code"
              className="form-control"
              required
              minLength={2}
              maxLength={20}
              placeholder="e.g. MATH"
              value={subjectDraft.code}
              onChange={(event) => setSubjectDraft({ ...subjectDraft, code: event.target.value.toUpperCase() })}
            />
            <div className="form-text">2–20 letters, digits, - or _. Must be unique in the school.</div>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="sj-type">
              Type
            </label>
            <select
              id="sj-type"
              className="form-select"
              value={subjectDraft.subjectType}
              onChange={(event) => setSubjectDraft({ ...subjectDraft, subjectType: event.target.value as SubjectType })}
            >
              {SUBJECT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="sj-credits">
              Credits (optional)
            </label>
            <input
              id="sj-credits"
              type="number"
              step="0.1"
              min={0}
              max={99.9}
              className="form-control"
              value={subjectDraft.credits}
              onChange={(event) => setSubjectDraft({ ...subjectDraft, credits: event.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="form-label" htmlFor="sj-status">
              Status
            </label>
            <select
              id="sj-status"
              className="form-select"
              value={subjectDraft.status}
              onChange={(event) => setSubjectDraft({ ...subjectDraft, status: event.target.value as SubjectStatus })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-light" onClick={() => setDrawer(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </Offcanvas>

      {/* Which classes teach it */}
      <Offcanvas
        open={drawer?.kind === 'classes'}
        onClose={() => setDrawer(null)}
        title={drawer?.kind === 'classes' ? `Classes — ${drawer.subject.name}` : 'Classes'}
        labelledById="classes-drawer-title"
      >
        {drawerError ? <div className="alert alert-danger">{drawerError}</div> : null}
        {classes.length === 0 ? (
          <p className="text-muted">There are no classes yet. Add classes first.</p>
        ) : (
          <>
            <p className="text-muted fs-13">
              Tick the classes that teach this subject, and set periods per week and marks for each.
            </p>
            {classes.map((cls) => {
              const id = key(cls.id);
              const d = classDrafts[id] ?? DEFAULT_CLASS;
              return (
                <div className="border rounded p-2 mb-2" key={id}>
                  <div className="form-check">
                    <input
                      id={`cs-${id}`}
                      type="checkbox"
                      className="form-check-input"
                      checked={d.on}
                      onChange={(event) => patchDraft(id, { on: event.target.checked })}
                    />
                    <label className="form-check-label fw-medium" htmlFor={`cs-${id}`}>
                      {cls.name}
                    </label>
                  </div>
                  {d.on ? (
                    <div className="row g-2 mt-1">
                      <div className="col-3">
                        <label className="form-label fs-12 mb-1" htmlFor={`cs-p-${id}`}>
                          Periods/wk
                        </label>
                        <input
                          id={`cs-p-${id}`}
                          type="number"
                          min={0}
                          max={60}
                          className="form-control form-control-sm"
                          value={d.periods}
                          onChange={(event) => patchDraft(id, { periods: event.target.value })}
                        />
                      </div>
                      <div className="col-3">
                        <label className="form-label fs-12 mb-1" htmlFor={`cs-e-${id}`}>
                          Exam
                        </label>
                        <input
                          id={`cs-e-${id}`}
                          type="number"
                          min={0}
                          className="form-control form-control-sm"
                          value={d.exam}
                          onChange={(event) => patchDraft(id, { exam: event.target.value })}
                        />
                      </div>
                      <div className="col-3">
                        <label className="form-label fs-12 mb-1" htmlFor={`cs-i-${id}`}>
                          Internal
                        </label>
                        <input
                          id={`cs-i-${id}`}
                          type="number"
                          min={0}
                          className="form-control form-control-sm"
                          value={d.internal}
                          onChange={(event) => patchDraft(id, { internal: event.target.value })}
                        />
                      </div>
                      <div className="col-3">
                        <label className="form-label fs-12 mb-1" htmlFor={`cs-s-${id}`}>
                          Pass
                        </label>
                        <input
                          id={`cs-s-${id}`}
                          type="number"
                          min={0}
                          className="form-control form-control-sm"
                          value={d.pass}
                          onChange={(event) => patchDraft(id, { pass: event.target.value })}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
            <div className="d-flex justify-content-end gap-2 mt-3">
              <button type="button" className="btn btn-light" onClick={() => setDrawer(null)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" disabled={busy} onClick={saveClasses}>
                {busy ? 'Saving…' : 'Save'}
              </button>
            </div>
          </>
        )}
      </Offcanvas>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="subjectToasts" />
    </div>
  );
};

export default ClassSubject;