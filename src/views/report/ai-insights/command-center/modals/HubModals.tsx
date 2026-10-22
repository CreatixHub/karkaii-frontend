import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import DateField from '@components/ui/DateField';
import { ActionLink } from '@components/workspace';
import {
  AUTOMATION_STARTS,
  AUTOMATIONS,
  AWAITING_APPROVAL,
  LAST_RUN,
  SCOPE,
  SERVICES,
} from '../data/hub.data';

export type HubModalId =
  | 'launch_service'
  | 'configure_analysis'
  | 'create_automation'
  | 'schedule_automation'
  | 'create_workflow'
  | 'executive_summary'
  | 'export_intelligence'
  | 'ai_settings';

export interface HubModalsProps {
  active: HubModalId | null;
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
  <div className="ops-box mb-3">
    <div className="ops-box-body">
      <p className="fs-13 text-muted mb-0">
        <i className="ti ti-sparkles me-2 text-primary" />
        {text}
      </p>
    </div>
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

const SERVICE_NAMES = SERVICES.map((row) => row.name);

const HubModals = ({ active, onClose, onToast }: HubModalsProps) => {
  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message, 'success');
    onClose();
  };

  const [launch, setLaunch] = useForm(
    {
      service: `All ${SERVICES.length} services`,
      scope: 'Whole school',
      year: '2026 · Term 2',
      priority: 'Normal',
      onDone: 'Hold every recommendation',
    },
    active === 'launch_service',
  );

  const [configure, setConfigure] = useForm(
    {
      signals: 'All 14 signals',
      depth: '3 academic years',
      floor: '85% and above',
      window: 'Next 30 days',
    },
    active === 'configure_analysis',
  );

  const [automation, setAutomation] = useForm(
    {
      name: 'Daily attendance scan',
      service: SERVICE_NAMES[1],
      frequency: 'Every weekday',
      runAt: '06:00',
      onFindings: 'Hold for approval · recommended',
      notify: 'Attendance office',
    },
    active === 'create_automation',
  );

  const [schedule, setSchedule] = useForm(
    {
      automation: AUTOMATIONS[0].name,
      frequency: 'Every weekday',
      runAt: '06:00',
      starting: AUTOMATION_STARTS,
      skip: 'School holidays',
      overrun: 'Queue the next run',
    },
    active === 'schedule_automation',
  );

  const [workflow, setWorkflow] = useForm(
    {
      name: 'Attendance recovery · Term 2',
      from: `${AWAITING_APPROVAL} approved recommendations`,
      owner: 'Attendance office',
      due: 'Within one week',
      track: 'AI Command Center',
      notes:
        'Nine students below threshold receive a recovery plan. Fourteen households receive a first letter. Nothing is sent until each is approved.',
    },
    active === 'create_workflow',
  );

  const [summary, setSummary] = useForm(
    {
      audience: 'Principal',
      period: 'Today',
      cover: `All ${SERVICES.length} services`,
      length: 'One page',
      reasoning: 'Yes, summarised',
      opening: `The platform reviewed ${SCOPE.students.toLocaleString('en-IN')} students, ${SCOPE.teachers} teachers, ${SCOPE.families} families and ${SCOPE.assignments.toLocaleString('en-US')} timetable assignments overnight. ${AWAITING_APPROVAL} recommendations are waiting for approval; none has been acted on.`,
    },
    active === 'executive_summary',
  );

  const [exportForm, setExportForm] = useForm(
    {
      contents: 'Everything from this run',
      services: `All ${SERVICES.length} services`,
      format: 'PDF',
      deliver: 'Download',
    },
    active === 'export_intelligence',
  );

  const [settings, setSettings] = useForm(
    {
      modules: 'All modules',
      depth: '3 academic years',
      parentMessages: 'Always need approval',
      publishedReports: 'Always need approval',
      attendanceFloor: '75',
      riskCeiling: '70',
      minConfidence: '80',
      retention: '12 months',
    },
    active === 'ai_settings',
  );

  return (
    <>
      <Modal
        open={active === 'launch_service'}
        onClose={onClose}
        title="Launch AI Service"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Launch</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`${launch.service} queued. Every recommendation will be held.`)}
        footer={<Footer icon="ti ti-player-play" label="Launch service" onClose={onClose} />}
      >
        <Note
          text={`The last sweep finished at ${LAST_RUN}. ${AWAITING_APPROVAL} recommendations from it are still waiting for a person.`}
        />
        <div className="row g-3">
          <Field label="Service" span="col-12">
            <Select
              value={launch.service}
              onChange={setLaunch('service')}
              options={[`All ${SERVICES.length} services`, ...SERVICE_NAMES]}
            />
          </Field>
          <Field label="Scope">
            <Select
              value={launch.scope}
              onChange={setLaunch('scope')}
              options={['Whole school', 'One year group', 'One class', 'Selected students']}
            />
          </Field>
          <Field label="Academic year">
            <Select
              value={launch.year}
              onChange={setLaunch('year')}
              options={['2026 · Term 2', '2026 · Term 3', 'Full year']}
            />
          </Field>
          <Field label="Priority">
            <Select
              value={launch.priority}
              onChange={setLaunch('priority')}
              options={['Normal', 'High · jump the queue', 'Low · overnight']}
            />
          </Field>
          <Field label="On completion">
            <Select
              value={launch.onDone}
              onChange={setLaunch('onDone')}
              options={[
                'Hold every recommendation',
                'Draft communications too',
                'Notify owners only',
              ]}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'configure_analysis'}
        onClose={onClose}
        title="Configure Analysis"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Configure</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit('Configuration saved for the next pass.')}
        footer={<Footer icon="ti ti-check" label="Save configuration" onClose={onClose} />}
      >
        <Note text="These settings apply to every service on the next run, not retrospectively to findings already written." />
        <div className="row g-3">
          <Field label="Signals">
            <Select
              value={configure.signals}
              onChange={setConfigure('signals')}
              options={[
                'All 14 signals',
                'Attendance signals only',
                'Academic signals only',
                'Custom selection',
              ]}
            />
          </Field>
          <Field label="Historical depth">
            <Select
              value={configure.depth}
              onChange={setConfigure('depth')}
              options={['3 academic years', 'Current year only', '5 academic years']}
            />
          </Field>
          <Field label="Confidence floor">
            <Select
              value={configure.floor}
              onChange={setConfigure('floor')}
              options={['85% and above', '90% and above', 'Report everything']}
            />
          </Field>
          <Field label="Prediction window">
            <Select
              value={configure.window}
              onChange={setConfigure('window')}
              options={['Next 30 days', 'Next 14 days', 'Rest of term']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'create_automation'}
        onClose={onClose}
        title="Create AI Automation"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Automation</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`“${automation.name}” created, running ${automation.frequency.toLowerCase()}.`)}
        footer={<Footer icon="ti ti-robot" label="Create automation" onClose={onClose} />}
      >
        <Note text="An automation decides when a service runs, never whether its findings are acted on. That still needs a person." />
        <div className="row g-3">
          <Field label="Name" span="col-12">
            <input
              type="text"
              className="form-control"
              value={automation.name}
              onChange={(event) => setAutomation('name')(event.target.value)}
            />
          </Field>
          <Field label="Service">
            <Select
              value={automation.service}
              onChange={setAutomation('service')}
              options={[...SERVICE_NAMES, 'All services']}
            />
          </Field>
          <Field label="Frequency">
            <Select
              value={automation.frequency}
              onChange={setAutomation('frequency')}
              options={['Every weekday', 'Daily', 'Weekly', 'Monthly', 'Continuous']}
            />
          </Field>
          <Field label="Run at">
            <input
              type="text"
              className="form-control"
              value={automation.runAt}
              onChange={(event) => setAutomation('runAt')(event.target.value)}
            />
          </Field>
          <Field label="On findings">
            <Select
              value={automation.onFindings}
              onChange={setAutomation('onFindings')}
              options={['Hold for approval · recommended', 'Notify owners', 'Draft communications']}
            />
          </Field>
          <Field label="Notify" span="col-12">
            <Select
              value={automation.notify}
              onChange={setAutomation('notify')}
              options={['Attendance office', 'Class teachers', 'Head of year', 'No one']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'schedule_automation'}
        onClose={onClose}
        title="Schedule Automation"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Automation</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`${schedule.automation} rescheduled from ${schedule.starting}.`)}
        footer={<Footer icon="ti ti-calendar-plus" label="Schedule" onClose={onClose} />}
      >
        <Note
          text={`${AUTOMATIONS.filter((row) => row.state === 'Active').length} of ${AUTOMATIONS.length} routines are active. Re-timing one does not touch the others.`}
        />
        <div className="row g-3">
          <Field label="Automation" span="col-12">
            <Select
              value={schedule.automation}
              onChange={setSchedule('automation')}
              options={AUTOMATIONS.map((row) => row.name)}
            />
          </Field>
          <Field label="Frequency">
            <Select
              value={schedule.frequency}
              onChange={setSchedule('frequency')}
              options={['Every weekday', 'Daily', 'Weekly', 'Monthly']}
            />
          </Field>
          <Field label="Run at">
            <input
              type="text"
              className="form-control"
              value={schedule.runAt}
              onChange={(event) => setSchedule('runAt')(event.target.value)}
            />
          </Field>
          <Field label="Starting">
            <DateField value={schedule.starting} onChange={setSchedule('starting')} />
          </Field>
          <Field label="Skip on">
            <Select
              value={schedule.skip}
              onChange={setSchedule('skip')}
              options={['School holidays', 'Weekends only', 'Never skip']}
            />
          </Field>
          <Field label="If a run overruns" span="col-12">
            <Select
              value={schedule.overrun}
              onChange={setSchedule('overrun')}
              options={['Queue the next run', 'Skip the next run', 'Run both']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'create_workflow'}
        onClose={onClose}
        title="Create Workflow"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Action</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Workflow “${workflow.name}” opened for ${workflow.owner}.`)}
        footer={<Footer icon="ti ti-rocket" label="Create workflow" onClose={onClose} />}
      >
        <Note
          text={`${AWAITING_APPROVAL} recommendations are waiting across the ${SERVICES.length} services. A workflow is how a batch of them becomes work someone owns.`}
        />
        <div className="row g-3">
          <Field label="Workflow name" span="col-12">
            <input
              type="text"
              className="form-control"
              value={workflow.name}
              onChange={(event) => setWorkflow('name')(event.target.value)}
            />
          </Field>
          <Field label="From">
            <Select
              value={workflow.from}
              onChange={setWorkflow('from')}
              options={[
                `${AWAITING_APPROVAL} approved recommendations`,
                'Critical only · 9',
                'Selected recommendations',
              ]}
            />
          </Field>
          <Field label="Owner">
            <Select
              value={workflow.owner}
              onChange={setWorkflow('owner')}
              options={['Attendance office', 'Class teachers', 'Head of year', 'Assign individually']}
            />
          </Field>
          <Field label="Due">
            <Select
              value={workflow.due}
              onChange={setWorkflow('due')}
              options={['Within one week', 'Within three days', 'End of term']}
            />
          </Field>
          <Field label="Track in">
            <Select
              value={workflow.track}
              onChange={setWorkflow('track')}
              options={['AI Command Center', 'Attendance Predictor', 'Both']}
            />
          </Field>
          <Field label="Notes" span="col-12">
            <textarea
              rows={3}
              className="form-control"
              value={workflow.notes}
              onChange={(event) => setWorkflow('notes')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'executive_summary'}
        onClose={onClose}
        title="Generate Executive Summary"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Copilot</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Summary drafted for the ${summary.audience.toLowerCase()}, held for approval.`)}
        footer={<Footer icon="ti ti-file-text" label="Generate summary" onClose={onClose} />}
      >
        <Note text="Written from today's run across every service, with each figure cited back to the page that owns it." />
        <div className="row g-3">
          <Field label="Audience">
            <Select
              value={summary.audience}
              onChange={setSummary('audience')}
              options={['Principal', 'Governors', 'Leadership team', 'Heads of department']}
            />
          </Field>
          <Field label="Period">
            <Select
              value={summary.period}
              onChange={setSummary('period')}
              options={['Today', 'This week', 'This term']}
            />
          </Field>
          <Field label="Cover">
            <Select
              value={summary.cover}
              onChange={setSummary('cover')}
              options={[`All ${SERVICES.length} services`, 'Exceptions only', 'Selected services']}
            />
          </Field>
          <Field label="Length">
            <Select
              value={summary.length}
              onChange={setSummary('length')}
              options={['One page', 'Two pages', 'Bullet summary']}
            />
          </Field>
          <Field label="Include reasoning" span="col-12">
            <Select
              value={summary.reasoning}
              onChange={setSummary('reasoning')}
              options={['Yes, summarised', 'Yes, with full evidence', 'Findings only']}
            />
          </Field>
          <Field label="Opening paragraph" span="col-12">
            <textarea
              rows={4}
              className="form-control"
              value={summary.opening}
              onChange={(event) => setSummary('opening')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'export_intelligence'}
        onClose={onClose}
        title="Export Intelligence"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Export</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`${exportForm.contents} exported as ${exportForm.format}.`)}
        footer={<Footer icon="ti ti-file-export" label="Export" onClose={onClose} />}
      >
        <Note text="Exports carry the reasoning and the approval trail alongside the findings." />
        <div className="row g-3">
          <Field label="Contents">
            <Select
              value={exportForm.contents}
              onChange={setExportForm('contents')}
              options={[
                'Everything from this run',
                'Recommendations only',
                'Findings and evidence',
                'Audit log',
              ]}
            />
          </Field>
          <Field label="Services">
            <Select
              value={exportForm.services}
              onChange={setExportForm('services')}
              options={[`All ${SERVICES.length} services`, ...SERVICE_NAMES]}
            />
          </Field>
          <Field label="Format">
            <Select
              value={exportForm.format}
              onChange={setExportForm('format')}
              options={['PDF', 'XLSX', 'CSV', 'Word']}
            />
          </Field>
          <Field label="Deliver to">
            <Select
              value={exportForm.deliver}
              onChange={setExportForm('deliver')}
              options={['Download', 'Email to me', 'Email to leadership', 'Shared drive']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'ai_settings'}
        onClose={onClose}
        title="AI Settings"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Settings</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit('AI settings saved. Approval gates unchanged.')}
        footer={<Footer icon="ti ti-check" label="Save settings" onClose={onClose} />}
      >
        <Note text="These are the approval gates the whole platform runs behind. Loosening one here loosens it on every page." />
        <div className="row g-3">
          <Field label="Modules AI may read">
            <Select
              value={settings.modules}
              onChange={setSettings('modules')}
              options={['All modules', 'Academics and attendance only', 'Selected modules']}
            />
          </Field>
          <Field label="Historical depth">
            <Select
              value={settings.depth}
              onChange={setSettings('depth')}
              options={['3 academic years', 'Current year only', '5 academic years']}
            />
          </Field>
          <Field label="Parent messages">
            <Select
              value={settings.parentMessages}
              onChange={setSettings('parentMessages')}
              options={[
                'Always need approval',
                'Approval above 50 recipients',
                'No approval needed',
              ]}
            />
          </Field>
          <Field label="Published reports">
            <Select
              value={settings.publishedReports}
              onChange={setSettings('publishedReports')}
              options={[
                'Always need approval',
                'Approval for external sharing',
                'No approval needed',
              ]}
            />
          </Field>
          <Field label="Attendance alert below (%)">
            <input
              type="text"
              className="form-control"
              value={settings.attendanceFloor}
              onChange={(event) => setSettings('attendanceFloor')(event.target.value)}
            />
          </Field>
          <Field label="Risk score alert above">
            <input
              type="text"
              className="form-control"
              value={settings.riskCeiling}
              onChange={(event) => setSettings('riskCeiling')(event.target.value)}
            />
          </Field>
          <Field label="Minimum confidence (%)">
            <input
              type="text"
              className="form-control"
              value={settings.minConfidence}
              onChange={(event) => setSettings('minConfidence')(event.target.value)}
            />
          </Field>
          <Field label="Keep generated output">
            <input
              type="text"
              className="form-control"
              value={settings.retention}
              onChange={(event) => setSettings('retention')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>
    </>
  );
};

export default HubModals;
