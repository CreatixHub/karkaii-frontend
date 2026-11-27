import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useAcademicYear } from '@hooks/useAcademicYear';
import { useToasts } from '@hooks/useToasts';
import { createPlannerApi, plannerMessage } from '@services/timetable/planner.api';
import type { PlannerState } from '@services/timetable/planner.api';
import BellStep from './components/BellStep';
import GenerateStep from './components/GenerateStep';
import PlanStep from './components/PlanStep';
import RulesStep from './components/RulesStep';
import SetupStep from './components/SetupStep';
import { STEPS } from './types';
import type { StepEdits, StepId } from './types';
import './planner.css';

const routes = all_routes;

const PlannerPage = ({ yearId, yearError }: { yearId: string | null; yearError: string }) => {
  const { toasts, push, dismiss } = useToasts();
  const api = useMemo(() => yearId ? createPlannerApi(yearId) : null, [yearId]);
  const [state, setState] = useState<PlannerState | null>(null);
  const [error, setError] = useState('');
  const [step, setStep] = useState<StepId>(() => {
    try {
      const saved = window.sessionStorage.getItem('tt-planner-step');
      return STEPS.some((s) => s.id === saved) ? (saved as StepId) : 'bell';
    } catch {
      return 'bell';
    }
  });

  const reload = useCallback(async (signal?: AbortSignal) => {
    if (!api) return;
    try {
      const next = await api.getState(signal);
      if (signal?.aborted) return;
      setState(next);
      setError('');
    } catch (e) {
      if (!signal?.aborted) setError(plannerMessage(e, 'Could not load the timetable planner.'));
    }
  }, [api]);

  useEffect(() => {
    const controller = new AbortController();
    void reload(controller.signal);
    return () => controller.abort();
  }, [reload]);

  const edits = useRef<StepEdits | null>(null);
  const setEdits = useCallback((next: StepEdits | null) => { edits.current = next; }, []);
  const [pending, setPending] = useState<{ action: () => void } | null>(null);
  const [leaving, setLeaving] = useState(false);

  const requestLeave = useCallback((action: () => void) => {
    if (edits.current?.saving) return;
    if (edits.current) setPending({ action });
    else action();
  }, []);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!edits.current) return;
      event.preventDefault();
      event.returnValue = '';
    };
    let replaying = false;
    const protectLink = (event: MouseEvent) => {
      if (replaying || !edits.current || event.defaultPrevented || event.button !== 0 ||
          event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(link instanceof HTMLAnchorElement) || (link.target && link.target !== '_self') ||
          link.download || link.href === window.location.href || link.origin !== window.location.origin) return;
      event.preventDefault();
      event.stopPropagation();
      requestLeave(() => {
        edits.current = null;
        replaying = true;
        try { link.click(); } finally { replaying = false; }
      });
    };
    window.addEventListener('beforeunload', warn);
    document.addEventListener('click', protectLink, true);
    return () => {
      window.removeEventListener('beforeunload', warn);
      document.removeEventListener('click', protectLink, true);
    };
  }, [requestLeave]);

  const commitStep = (next: StepId) => {
    setStep(next);
    try {
      window.sessionStorage.setItem('tt-planner-step', next);
    } catch {
      /* storage can be unavailable; the step simply is not remembered */
    }
  };

  const go = (next: StepId) => {
    if (next !== step) requestLeave(() => commitStep(next));
  };

  const continueTo = async (next: StepId) => {
    const current = edits.current;
    if (current?.saving) return;
    if (current && !current.save) {
      go(next);
      return;
    }
    if (current?.save && !(await current.save())) return;
    if (step === 'bell' && !current && !done.bell) {
      push('Add teaching periods before continuing.', 'warning');
      return;
    }
    commitStep(next);
  };

  const done = useMemo<Record<StepId, boolean>>(
    () => ({
      bell: Boolean(state?.bell.dayTypes.some((d) => d.periods.some((p) => !p.isBreak))),
      setup: Boolean(state && (state.rooms.length > 0 || Object.values(state.availability).some((k) => Object.keys(k).length > 0))),
      plan: Boolean(state && state.lessons.length > 0),
      rules: Boolean(state && Object.keys(state.rules.defaults).length > 0),
      generate: Boolean(state?.versions.some((v) => v.status === 'published')),
    }),
    [state],
  );

  const props = state && api ? { api, state, reload, notify: push, setEdits, go } : null;

  return (
    <>
      <div className="page-wrapper">
        <div className="content timetable-page">
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Timetable Planner</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item"><Link to={routes.adminDashboard}>Dashboard</Link></li>
                  <li className="breadcrumb-item">Academic</li>
                  <li className="breadcrumb-item active" aria-current="page">Timetable Planner</li>
                </ol>
              </nav>
            </div>
            <Link to={routes.classTimetable} className="btn btn-outline-light bg-white">
              <i className="ti ti-table me-1" />
              Class timetable
            </Link>
          </div>

          {yearError ? <div className="alert alert-danger" role="alert">{yearError}</div> : null}
          {error ? (
            <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
              <span>{error}</span>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => void reload()}>Try again</button>
            </div>
          ) : null}

          {!state && !error && !yearError ? <div className="card"><div className="card-body text-center text-muted py-5" role="status">Loading timetable planner…</div></div> : null}

          {props ? (
            <>
              <nav className="tp-steps mb-4" aria-label="Planner steps">
                {STEPS.map((s, i) => (
                  <button key={s.id} type="button" className={`tp-step ${step === s.id ? 'active' : ''} ${done[s.id] && step !== s.id ? 'done' : ''}`} aria-current={step === s.id ? 'step' : undefined} onClick={() => go(s.id)}>
                    <span className="tp-step-no">{done[s.id] && step !== s.id ? <i className="ti ti-check" /> : i + 1}</span>
                    {s.label}
                  </button>
                ))}
              </nav>

              {step === 'bell' ? <BellStep {...props} /> : null}
              {step === 'setup' ? <SetupStep {...props} /> : null}
              {step === 'plan' ? <PlanStep {...props} /> : null}
              {step === 'rules' ? <RulesStep {...props} /> : null}
              {step === 'generate' ? <GenerateStep {...props} /> : null}

              <div className="d-flex justify-content-between mt-4">
                <button type="button" className="btn btn-outline-light bg-white" disabled={step === STEPS[0].id} onClick={() => go(STEPS[Math.max(0, STEPS.findIndex((s) => s.id === step) - 1)].id)}>
                  <i className="ti ti-arrow-left me-1" />
                  Back
                </button>
                <button type="button" className="btn btn-primary" disabled={step === STEPS[STEPS.length - 1].id} onClick={() => void continueTo(STEPS[Math.min(STEPS.length - 1, STEPS.findIndex((s) => s.id === step) + 1)].id)}>
                  Continue
                  <i className="ti ti-arrow-right ms-1" />
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
      <Modal
        open={Boolean(pending)}
        onClose={() => { if (!leaving) setPending(null); }}
        title="Unsaved changes"
        footer={
          <>
            <button type="button" className="btn btn-outline-light" disabled={leaving} onClick={() => setPending(null)}>Stay</button>
            <button type="button" className="btn btn-outline-danger" disabled={leaving} onClick={() => {
              setPending(null);
              pending?.action();
            }}>Discard changes</button>
            {edits.current?.save ? (
              <button type="button" className="btn btn-primary" disabled={leaving} onClick={async () => {
                const save = edits.current?.save;
                if (!save || !pending) return;
                setLeaving(true);
                try {
                  if (await save()) {
                    setPending(null);
                    pending.action();
                  } else {
                    setPending(null);
                  }
                } finally {
                  setLeaving(false);
                }
              }}>{leaving ? 'Saving…' : 'Save and leave'}</button>
            ) : null}
          </>
        }
      >
        <p className="mb-0">Save your changes before leaving, or stay to keep editing.</p>
      </Modal>
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </>
  );
};

const TimetablePlanner = () => {
  const { yearId, error } = useAcademicYear();
  return <PlannerPage key={yearId ?? 'loading'} yearId={yearId} yearError={error} />;
};

export default TimetablePlanner;
