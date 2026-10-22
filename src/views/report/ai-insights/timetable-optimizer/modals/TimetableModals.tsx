import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import DateField from '@components/ui/DateField';
import { ActionLink } from '@components/workspace';
import {
  BLOCKING,
  CONFLICTS,
  EFFECTIVE_FROM,
  OPTIMIZED_HEALTH,
  PERIOD_ASSIGNMENTS,
  PERIODS_MOVED,
  PERIODS_PER_DAY,
  PROPOSED_VERSION,
  SCHEDULE_HEALTH,
  TEACHING_DAYS,
  TERMS,
  VERSIONS,
} from '../data/timetable.data';

export type TimetableModalId =
  | 'run_optimization'
  | 'generate_timetable'
  | 'resolve_conflict'
  | 'assign_teacher'
  | 'allocate_classroom'
  | 'publish_timetable'
  | 'export_timetable'
  | 'optimization_report';

export interface TimetableModalsProps {
  active: TimetableModalId | null;
  onClose: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
}

const Field = ({
  label,
  children,
  span = 'col-md-6',
}: {
  label: string;
  children: React.ReactNode;
  span?: string;
}) => (
  <div className={span}>
    <label className="form-label">{label}</label>
    {children}
  </div>
);

const Select = ({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <select className="form-select" value={value} onChange={(event) => onChange(event.target.value)}>
    {options.map((option) => (
      <option key={option}>{option}</option>
    ))}
  </select>
);

const Note = ({ text }: { text: string }) => (
  <div className="tto-note mb-3">
    <p className="tto-note-title mb-1">
      <i className="ti ti-sparkles me-2" />
      What the engine has already worked out
    </p>
    <p className="fs-13 text-muted mb-0">{text}</p>
  </div>
);

const Footer = ({ icon, label, onClose }: { icon: string; label: string; onClose: () => void }) => (
  <>
    <ActionLink className="btn btn-light me-2" onClick={onClose}>
      Cancel
    </ActionLink>
    <button type="submit" className="btn btn-primary d-inline-flex align-items-center">
      <i className={`${icon} me-1`} />
      {label}
    </button>
  </>
);

const useForm = <T extends Record<string, string>>(defaults: T, open: boolean) => {
  const [values, setValues] = useState<T>(defaults);
  // Serialised so the effect depends on the defaults' content, not their identity.
  const initial = JSON.stringify(defaults);

  useEffect(() => {
    if (open) setValues(JSON.parse(initial) as T);
  }, [open, initial]);

  const set = (key: keyof T) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  return [values, set] as const;
};

const TimetableModals = ({ active, onClose, onToast }: TimetableModalsProps) => {
  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message, 'success');
    onClose();
  };

  const conflictOptions = CONFLICTS.map((row) => `${row.subject} · ${row.where}`);

  const [optimization, setOptimization] = useForm(
    {
      objective: 'Minimize conflicts',
      scope: 'Whole school',
      limit: `Up to ${PERIODS_MOVED + 2} periods moved`,
      respect: 'All hard constraints',
      preserve: 'Teacher preferences where possible',
    },
    active === 'run_optimization',
  );

  const [generate, setGenerate] = useForm(
    {
      term: TERMS[0],
      basis: 'Constraints only',
      periods: String(PERIODS_PER_DAY),
      days: String(TEACHING_DAYS),
      breaks: 'Three sittings',
      alternatives: 'Three alternatives',
    },
    active === 'generate_timetable',
  );

  const [resolve, setResolve] = useForm(
    {
      conflict: conflictOptions[0],
      resolution: 'Move Class VIII-A to Room 207 (recommended)',
      applyTo: 'Every week this term',
      notify: 'Both teachers and classes',
      note: CONFLICTS[0].resolution,
    },
    active === 'resolve_conflict',
  );

  const [assign, setAssign] = useForm(
    {
      from: 'Meera Joshi · 31 periods',
      to: 'Rakesh Sharma · 17 periods',
      periods: 'Thursday P6 and Friday P6',
      match: 'Same syllabus required',
      effective: EFFECTIVE_FROM,
      notify: 'Both teachers and the class',
    },
    active === 'assign_teacher',
  );

  const [allocate, setAllocate] = useForm(
    {
      session: 'Physics theory · Thu P3',
      moveTo: 'Room 207 · free, seats 34',
      check: 'No lab equipment needed',
      applyTo: 'Every week this term',
      effective: EFFECTIVE_FROM,
    },
    active === 'allocate_classroom',
  );

  const [publish, setPublish] = useForm(
    {
      version: `${PROPOSED_VERSION.id} · optimized`,
      effective: EFFECTIVE_FROM,
      publishTo: 'Portal, notice boards and parents',
      notify: 'All teachers, students and parents',
      archive: 'Archive the previous version',
      note: `Term 2 timetable, effective ${EFFECTIVE_FROM}. ${PERIODS_MOVED} periods have moved to clear ${CONFLICTS.length} scheduling conflicts. Every change is reversible.`,
    },
    active === 'publish_timetable',
  );

  const [exportForm, setExportForm] = useForm(
    {
      contents: 'Full timetable',
      version: `${PROPOSED_VERSION.id} · optimized`,
      format: 'PDF',
      deliver: 'Download',
    },
    active === 'export_timetable',
  );

  const [report, setReport] = useForm(
    {
      report: 'Optimization summary',
      audience: 'Principal',
      reasoning: 'Yes, with evidence',
      format: 'PDF',
      compare: 'Previous version',
    },
    active === 'optimization_report',
  );

  return (
    <>
      <Modal
        open={active === 'run_optimization'}
        onClose={onClose}
        title="Run AI Optimization"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Optimize</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit('Optimization queued. Nothing is applied until you approve the plan.')}
        footer={<Footer icon="ti ti-player-play" label="Run optimization" onClose={onClose} />}
      >
        <Note
          text={`${CONFLICTS.length} conflicts across ${PERIOD_ASSIGNMENTS.toLocaleString('en-US')} assignments, ${BLOCKING.length} of them blocking publication.`}
        />
        <div className="row g-3">
          <Field label="Objective">
            <Select
              value={optimization.objective}
              onChange={setOptimization('objective')}
              options={[
                'Minimize conflicts',
                'Balance teacher load',
                'Maximize room utilization',
                'Reduce student gaps',
              ]}
            />
          </Field>
          <Field label="Scope">
            <Select
              value={optimization.scope}
              onChange={setOptimization('scope')}
              options={['Whole school', 'Senior school only', 'Junior school only', 'Selected classes']}
            />
          </Field>
          <Field label="Disruption limit">
            <Select
              value={optimization.limit}
              onChange={setOptimization('limit')}
              options={[
                `Up to ${PERIODS_MOVED + 2} periods moved`,
                'Up to 10 periods moved',
                'No limit',
              ]}
            />
          </Field>
          <Field label="Respect">
            <Select
              value={optimization.respect}
              onChange={setOptimization('respect')}
              options={[
                'All hard constraints',
                'Hard constraints and preferences',
                'Hard constraints only',
              ]}
            />
          </Field>
          <Field label="Preserve" span="col-12">
            <Select
              value={optimization.preserve}
              onChange={setOptimization('preserve')}
              options={[
                'Teacher preferences where possible',
                'Current room assignments',
                'Nothing — rebuild freely',
              ]}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'generate_timetable'}
        onClose={onClose}
        title="Generate Timetable"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Optimize</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`${generate.alternatives} drafted for ${generate.term}.`)}
        footer={<Footer icon="ti ti-sparkles" label="Generate timetable" onClose={onClose} />}
      >
        <Note
          text={`A full week is ${TEACHING_DAYS} days of ${PERIODS_PER_DAY} periods. Building from constraints ignores the current draft entirely.`}
        />
        <div className="row g-3">
          <Field label="Term">
            <Select value={generate.term} onChange={setGenerate('term')} options={TERMS} />
          </Field>
          <Field label="Basis">
            <Select
              value={generate.basis}
              onChange={setGenerate('basis')}
              options={['Constraints only', 'Last term as a starting point', 'Current draft']}
            />
          </Field>
          <Field label="Periods per day">
            <input
              type="text"
              className="form-control"
              value={generate.periods}
              onChange={(event) => setGenerate('periods')(event.target.value)}
            />
          </Field>
          <Field label="Teaching days">
            <input
              type="text"
              className="form-control"
              value={generate.days}
              onChange={(event) => setGenerate('days')(event.target.value)}
            />
          </Field>
          <Field label="Break pattern">
            <Select
              value={generate.breaks}
              onChange={setGenerate('breaks')}
              options={['Three sittings', 'Two sittings', 'Single sitting']}
            />
          </Field>
          <Field label="Generate">
            <Select
              value={generate.alternatives}
              onChange={setGenerate('alternatives')}
              options={['Three alternatives', 'One best plan', 'Five alternatives']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'resolve_conflict'}
        onClose={onClose}
        title="Resolve Conflict"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Detect</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`${resolve.conflict} resolved. The change is reversible.`)}
        footer={<Footer icon="ti ti-wand" label="Resolve conflict" onClose={onClose} />}
      >
        <Note text={`${CONFLICTS.length} conflicts are open. ${BLOCKING.length} block publication.`} />
        <div className="row g-3">
          <Field label="Conflict">
            <Select
              value={resolve.conflict}
              onChange={setResolve('conflict')}
              options={conflictOptions}
            />
          </Field>
          <Field label="Resolution">
            <Select
              value={resolve.resolution}
              onChange={setResolve('resolution')}
              options={[
                'Move Class VIII-A to Room 207 (recommended)',
                'Move Class VII-B to Room 204',
                'Move both to a later period',
                'Split across two rooms',
              ]}
            />
          </Field>
          <Field label="Apply to">
            <Select
              value={resolve.applyTo}
              onChange={setResolve('applyTo')}
              options={['This occurrence', 'Every week this term', 'Rest of the year']}
            />
          </Field>
          <Field label="Notify">
            <Select
              value={resolve.notify}
              onChange={setResolve('notify')}
              options={['Both teachers and classes', 'Teachers only', 'No one until published']}
            />
          </Field>
          <Field label="Note for the record" span="col-12">
            <textarea
              rows={3}
              className="form-control"
              value={resolve.note}
              onChange={(event) => setResolve('note')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'assign_teacher'}
        onClose={onClose}
        title="Assign Teacher"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Optimize</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`Periods reassigned, effective ${assign.effective}.`)}
        footer={<Footer icon="ti ti-user-check" label="Assign teacher" onClose={onClose} />}
      >
        <Note text="Four teachers sit above the ceiling; six sit below eighteen periods." />
        <div className="row g-3">
          <Field label="Reassign from">
            <Select
              value={assign.from}
              onChange={setAssign('from')}
              options={[
                'Meera Joshi · 31 periods',
                'Daniel Josua · 29 periods',
                'Priya Sundaram · 28 periods',
              ]}
            />
          </Field>
          <Field label="Reassign to">
            <Select
              value={assign.to}
              onChange={setAssign('to')}
              options={[
                'Rakesh Sharma · 17 periods',
                'Leela Nambiar · 24 periods',
                'Teena Mathew · 16 periods',
              ]}
            />
          </Field>
          <Field label="Periods">
            <Select
              value={assign.periods}
              onChange={setAssign('periods')}
              options={['Thursday P6 and Friday P6', 'Thursday P6 only', 'Select manually']}
            />
          </Field>
          <Field label="Subject match">
            <Select
              value={assign.match}
              onChange={setAssign('match')}
              options={['Same syllabus required', 'Same department', 'Any qualified teacher']}
            />
          </Field>
          <Field label="Effective from">
            <DateField value={assign.effective} onChange={setAssign('effective')} />
          </Field>
          <Field label="Notify">
            <Select
              value={assign.notify}
              onChange={setAssign('notify')}
              options={['Both teachers and the class', 'Teachers only', 'Head of department too']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'allocate_classroom'}
        onClose={onClose}
        title="Allocate Classroom"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Optimize</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`${allocate.session} moved to ${allocate.moveTo.split(' · ')[0]}.`)}
        footer={<Footer icon="ti ti-building" label="Allocate classroom" onClose={onClose} />}
      >
        <Note text="Rooms 204 and 207 sit idle for 22 of 40 periods while both labs run at capacity." />
        <div className="row g-3">
          <Field label="Session">
            <Select
              value={allocate.session}
              onChange={setAllocate('session')}
              options={[
                'Physics theory · Thu P3',
                'Chemistry theory · Mon P2',
                'Biology theory · Wed P4',
                'All four sessions',
              ]}
            />
          </Field>
          <Field label="Move to">
            <Select
              value={allocate.moveTo}
              onChange={setAllocate('moveTo')}
              options={[
                'Room 207 · free, seats 34',
                'Room 204 · free, seats 34',
                'Music room · free after P5',
              ]}
            />
          </Field>
          <Field label="Requirement check">
            <Select
              value={allocate.check}
              onChange={setAllocate('check')}
              options={['No lab equipment needed', 'Projector required', 'No requirement']}
            />
          </Field>
          <Field label="Apply to">
            <Select
              value={allocate.applyTo}
              onChange={setAllocate('applyTo')}
              options={['Every week this term', 'This occurrence only', 'Rest of the year']}
            />
          </Field>
          <Field label="Effective from" span="col-12">
            <DateField value={allocate.effective} onChange={setAllocate('effective')} />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'publish_timetable'}
        onClose={onClose}
        title="Publish Timetable"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Publish</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`${publish.version} published, effective ${publish.effective}.`)}
        footer={<Footer icon="ti ti-send" label="Publish timetable" onClose={onClose} />}
      >
        <Note
          text={
            BLOCKING.length
              ? `${BLOCKING.length} blocking conflicts are still open. Publishing now carries them into the term.`
              : 'No blocking conflicts remain.'
          }
        />
        <div className="row g-3">
          <Field label="Version">
            <Select
              value={publish.version}
              onChange={setPublish('version')}
              options={[
                `${PROPOSED_VERSION.id} · optimized`,
                `${VERSIONS[VERSIONS.length - 1].id} · current draft`,
              ]}
            />
          </Field>
          <Field label="Effective from">
            <DateField value={publish.effective} onChange={setPublish('effective')} />
          </Field>
          <Field label="Publish to">
            <Select
              value={publish.publishTo}
              onChange={setPublish('publishTo')}
              options={[
                'Portal, notice boards and parents',
                'Staff portal only',
                'Staff and students',
              ]}
            />
          </Field>
          <Field label="Notify">
            <Select
              value={publish.notify}
              onChange={setPublish('notify')}
              options={[
                'All teachers, students and parents',
                'Affected classes only',
                'Teachers only',
              ]}
            />
          </Field>
          <Field label="Archive" span="col-12">
            <Select
              value={publish.archive}
              onChange={setPublish('archive')}
              options={[
                'Archive the previous version',
                'Keep both live',
                'Replace without archiving',
              ]}
            />
          </Field>
          <Field label="Publication note" span="col-12">
            <textarea
              rows={3}
              className="form-control"
              value={publish.note}
              onChange={(event) => setPublish('note')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'export_timetable'}
        onClose={onClose}
        title="Export Timetable"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Review</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`${exportForm.contents} exported as ${exportForm.format}.`)}
        footer={<Footer icon="ti ti-file-export" label="Export timetable" onClose={onClose} />}
      >
        <Note
          text={`Health ${SCHEDULE_HEALTH} on the current draft against ${OPTIMIZED_HEALTH} on the optimized plan.`}
        />
        <div className="row g-3">
          <Field label="Contents">
            <Select
              value={exportForm.contents}
              onChange={setExportForm('contents')}
              options={[
                'Full timetable',
                'Changed periods only',
                'Per-teacher timetables',
                'Per-class timetables',
              ]}
            />
          </Field>
          <Field label="Version">
            <Select
              value={exportForm.version}
              onChange={setExportForm('version')}
              options={[
                `${PROPOSED_VERSION.id} · optimized`,
                `${VERSIONS[VERSIONS.length - 1].id} · current draft`,
                'Both, side by side',
              ]}
            />
          </Field>
          <Field label="Format">
            <Select
              value={exportForm.format}
              onChange={setExportForm('format')}
              options={['PDF', 'XLSX', 'CSV', 'ICS calendar']}
            />
          </Field>
          <Field label="Deliver to">
            <Select
              value={exportForm.deliver}
              onChange={setExportForm('deliver')}
              options={['Download', 'Email to me', 'Email to all staff']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'optimization_report'}
        onClose={onClose}
        title="Generate Optimization Report"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Review</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`${report.report} drafted for the ${report.audience.toLowerCase()}.`)}
        footer={<Footer icon="ti ti-file-text" label="Generate report" onClose={onClose} />}
      >
        <Note
          text={`${PERIODS_MOVED} periods move to clear ${CONFLICTS.length} conflicts and lift health ${SCHEDULE_HEALTH} to ${OPTIMIZED_HEALTH}.`}
        />
        <div className="row g-3">
          <Field label="Report">
            <Select
              value={report.report}
              onChange={setReport('report')}
              options={[
                'Optimization summary',
                'Conflict report',
                'Teacher workload summary',
                'Classroom utilization report',
              ]}
            />
          </Field>
          <Field label="Audience">
            <Select
              value={report.audience}
              onChange={setReport('audience')}
              options={['Principal', 'Teaching staff', 'Governors', 'Head of department']}
            />
          </Field>
          <Field label="Include reasoning">
            <Select
              value={report.reasoning}
              onChange={setReport('reasoning')}
              options={['Yes, with evidence', 'Yes, summary only', 'No, outcomes only']}
            />
          </Field>
          <Field label="Format">
            <Select
              value={report.format}
              onChange={setReport('format')}
              options={['PDF', 'XLSX', 'Email body']}
            />
          </Field>
          <Field label="Compare against" span="col-12">
            <Select
              value={report.compare}
              onChange={setReport('compare')}
              options={['Previous version', 'Last term', 'No comparison']}
            />
          </Field>
        </div>
      </Modal>
    </>
  );
};

export default TimetableModals;
