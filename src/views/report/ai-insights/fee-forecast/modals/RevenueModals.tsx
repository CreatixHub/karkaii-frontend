import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import DateField from '@components/ui/DateField';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { ActionLink } from '@components/workspace';
import type { RevenueCase } from '../data/revenue.data';
import {
  bandOf,
  CASES,
  FIRST_INSTALMENT_ON,
  FORECAST_TO,
  money,
  OPEN_CASES,
  outstandingOf,
  PATTERNS,
  PLAN_REVIEW,
  REMINDER_CASES,
  RUN_DATE,
  timingLabelOf,
} from '../data/revenue.data';

export type RevenueModalId =
  | 'generate_forecast'
  | 'generate_reminder'
  | 'collection_plan'
  | 'instalment_plan'
  | 'export_revenue'
  | 'compare_cases'
  | 'parent_communication'
  | 'cash_flow'
  | 'all_cases';

export interface RevenueModalsProps {
  active: RevenueModalId | null;
  onClose: () => void;
  row: RevenueCase | null;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  onOpenRow: (row: RevenueCase) => void;
  onOpenDialog: (id: RevenueModalId) => void;
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

const Drafted = ({ row, note }: { row: RevenueCase | null; note: string }) => (
  <div className="rev-box mb-3">
    <div className="rev-box-head">
      <h6 className="fs-14 mb-0">{row ? `${row.parent} · ${row.id}` : `All ${OPEN_CASES} cases`}</h6>
      <span className="rev-tag is-likely">
        <i className="ti ti-sparkles" />
        {note}
      </span>
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

const RevenueModals = ({
  active,
  onClose,
  row,
  onToast,
  onOpenRow,
  onOpenDialog,
}: RevenueModalsProps) => {
  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message, 'success');
    onClose();
  };

  const outstanding = row ? outstandingOf(row) : 0;
  const surname = row?.parent.replace(/^(Mr|Mrs|Ms)\.\s+\w+\s+/, '') ?? 'there';
  const child = row?.student.split(' ')[0] ?? 'your child';

  const [forecast, setForecast] = useForm(
    {
      horizon: 'To 30 September',
      scope: `All ${OPEN_CASES} cases`,
      streams: 'Tuition, transport and cafeteria separately',
      scenario: 'Expected',
      siblings: 'Chain sibling invoices',
      onDone: 'Hold for review',
    },
    active === 'generate_forecast',
  );

  const [reminder, setReminder] = useForm(
    {
      channel: 'WhatsApp · preferred',
      tone: 'Friendly',
      include: 'Amount and due date',
      lateFee: 'Waive · recommended',
      second: 'Do not schedule · recommended',
      draft: row
        ? `Hello ${row.parent} — a quick note that ${child}’s Term 2 fees of ${money(outstanding)} are still showing as outstanding. No late fee has been applied. If it has already been sent, please ignore this.`
        : '',
    },
    active === 'generate_reminder',
  );

  const [plan, setPlan] = useForm(
    {
      applies: 'This case',
      routing: 'By payment pattern · recommended',
      threshold: 'Day 30',
      lateFees: 'Waive for payday-fixed accounts',
      review: PLAN_REVIEW,
      strategy:
        'Reminder-led accounts receive one message and nothing further. Payday-fixed accounts are not contacted before their pay date. Hardship accounts go to scholarship review before any escalation.',
    },
    active === 'collection_plan',
  );

  const [instalment, setInstalment] = useForm(
    {
      applies: 'This case',
      parts: 'Three parts',
      first: money(Math.round(outstanding / 3)),
      firstDue: FIRST_INSTALMENT_ON,
      fee: 'None',
      remind: 'Three days before each part',
    },
    active === 'instalment_plan',
  );

  const [exportForm, setExportForm] = useForm(
    {
      contents: 'Full revenue report',
      format: 'PDF',
      reasoning: 'Yes, with evidence',
      deliver: 'Download',
    },
    active === 'export_revenue',
  );

  const [compare, setCompare] = useForm(
    {
      on: 'Payment pattern',
      against: 'Same pattern',
      period: 'This term',
      show: `Top ${CASES.length} matches`,
    },
    active === 'compare_cases',
  );

  const [message, setMessage] = useForm(
    {
      purpose: 'Payment reminder',
      channel: 'WhatsApp · preferred',
      tone: 'Friendly',
      language: 'English',
      draft: row
        ? `Hello ${row.parent} — we wanted to check in about ${child}’s Term 2 fees. If the timing is difficult this term, we can set up a payment plan that fits better. Just let us know.`
        : '',
    },
    active === 'parent_communication',
  );

  const [cashFlow, setCashFlow] = useForm(
    {
      period: 'To term end',
      granularity: 'Weekly',
      range: 'Best, expected and low',
      split: 'Tuition, transport, cafeteria',
      audience: 'Finance committee',
    },
    active === 'cash_flow',
  );

  const [patternFilter, setPatternFilter] = useState('All patterns');

  useEffect(() => {
    if (active === 'all_cases') setPatternFilter('All patterns');
  }, [active]);

  const listed = CASES.filter(
    (entry) => patternFilter === 'All patterns' || entry.pattern === patternFilter,
  );

  return (
    <>
      <Modal
        open={active === 'generate_forecast'}
        onClose={onClose}
        title="Generate Revenue Forecast"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Forecast</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit('Forecast queued. Figures are held for review.')}
        footer={
          <Footer icon="ti ti-chart-arrows-vertical" label="Generate forecast" onClose={onClose} />
        }
      >
        <Drafted row={null} note={`${OPEN_CASES} open cases, ${FORECAST_TO}`} />
        <div className="row g-3">
          <Field label="Horizon">
            <Select
              value={forecast.horizon}
              onChange={setForecast('horizon')}
              options={['To 30 September', 'To term end', 'Next 30 days', 'Full academic year']}
            />
          </Field>
          <Field label="Scope">
            <Select
              value={forecast.scope}
              onChange={setForecast('scope')}
              options={[`All ${OPEN_CASES} cases`, 'Overdue only', 'Tuition only', 'One class']}
            />
          </Field>
          <Field label="Streams">
            <Select
              value={forecast.streams}
              onChange={setForecast('streams')}
              options={[
                'Tuition, transport and cafeteria separately',
                'Combined total',
                'Tuition only',
              ]}
            />
          </Field>
          <Field label="Scenario">
            <Select
              value={forecast.scenario}
              onChange={setForecast('scenario')}
              options={['Expected', 'Best case', 'Low case', 'All three']}
            />
          </Field>
          <Field label="Sibling handling">
            <Select
              value={forecast.siblings}
              onChange={setForecast('siblings')}
              options={['Chain sibling invoices', 'Forecast independently']}
            />
          </Field>
          <Field label="On completion">
            <Select
              value={forecast.onDone}
              onChange={setForecast('onDone')}
              options={['Hold for review', 'Draft reminders too', 'Notify the bursar']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'generate_reminder'}
        onClose={onClose}
        title="Generate Reminder"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Collection</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Reminder queued for the bursar’s approval.`)}
        footer={<Footer icon="ti ti-bell" label="Send reminder" onClose={onClose} />}
      >
        <Drafted row={row} note={row ? timingLabelOf(row) : 'Held for approval'} />
        <div className="row g-3">
          <Field label="Channel">
            <Select
              value={reminder.channel}
              onChange={setReminder('channel')}
              options={['WhatsApp · preferred', 'Email', 'SMS', 'Printed notice']}
            />
          </Field>
          <Field label="Tone">
            <Select
              value={reminder.tone}
              onChange={setReminder('tone')}
              options={['Friendly', 'Neutral', 'Formal']}
            />
          </Field>
          <Field label="Include">
            <Select
              value={reminder.include}
              onChange={setReminder('include')}
              options={['Amount and due date', 'Amount, date and payment link', 'Amount only']}
            />
          </Field>
          <Field label="Late fee">
            <Select
              value={reminder.lateFee}
              onChange={setReminder('lateFee')}
              options={['Waive · recommended', 'Apply', 'Mention but do not apply']}
            />
          </Field>
          <Field label="Second reminder" span="col-12">
            <Select
              value={reminder.second}
              onChange={setReminder('second')}
              options={[
                'Do not schedule · recommended',
                'Schedule for day 7',
                'Schedule for day 14',
              ]}
            />
          </Field>
          <Field label="Draft" span="col-12">
            <textarea
              rows={4}
              className="form-control"
              value={reminder.draft}
              onChange={(event) => setReminder('draft')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'collection_plan'}
        onClose={onClose}
        title="Create Collection Plan"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Collection</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Collection plan opened, reviewed ${plan.review}.`)}
        footer={<Footer icon="ti ti-route" label="Create plan" onClose={onClose} />}
      >
        <Drafted row={row} note="Routed by pattern, not by age" />
        <div className="row g-3">
          <Field label="Applies to">
            <Select
              value={plan.applies}
              onChange={setPlan('applies')}
              options={[
                'This case',
                'Reminder-led accounts · 31',
                'All overdue',
                `All ${OPEN_CASES} cases`,
              ]}
            />
          </Field>
          <Field label="Routing">
            <Select
              value={plan.routing}
              onChange={setPlan('routing')}
              options={['By payment pattern · recommended', 'By days overdue', 'By amount']}
            />
          </Field>
          <Field label="Escalation threshold">
            <Select
              value={plan.threshold}
              onChange={setPlan('threshold')}
              options={['Day 30', 'Day 14', 'Never automatic']}
            />
          </Field>
          <Field label="Late fees">
            <Select
              value={plan.lateFees}
              onChange={setPlan('lateFees')}
              options={['Waive for payday-fixed accounts', 'Apply as standard', 'Waive for all']}
            />
          </Field>
          <Field label="Review date">
            <DateField value={plan.review} onChange={setPlan('review')} />
          </Field>
          <Field label="Strategy" span="col-12">
            <textarea
              rows={3}
              className="form-control"
              value={plan.strategy}
              onChange={(event) => setPlan('strategy')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'instalment_plan'}
        onClose={onClose}
        title="Offer Instalment Plan"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Collection</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Instalment plan offered, first part ${instalment.firstDue}.`)}
        footer={<Footer icon="ti ti-layout-rows" label="Offer plan" onClose={onClose} />}
      >
        <Drafted row={row} note={`${money(outstanding)} outstanding`} />
        <div className="row g-3">
          <Field label="Applies to">
            <Select
              value={instalment.applies}
              onChange={setInstalment('applies')}
              options={[
                'This case',
                'Accounts already splitting · 23',
                'All overdue above $1,500',
              ]}
            />
          </Field>
          <Field label="Parts">
            <Select
              value={instalment.parts}
              onChange={setInstalment('parts')}
              options={['Three parts', 'Two parts', 'Four parts', 'Monthly']}
            />
          </Field>
          <Field label="First instalment">
            <input
              type="text"
              className="form-control"
              value={instalment.first}
              onChange={(event) => setInstalment('first')(event.target.value)}
            />
          </Field>
          <Field label="First due date">
            <DateField value={instalment.firstDue} onChange={setInstalment('firstDue')} />
          </Field>
          <Field label="Interest or fee">
            <Select
              value={instalment.fee}
              onChange={setInstalment('fee')}
              options={['None', 'Administration fee', 'Late fee only if missed']}
            />
          </Field>
          <Field label="Auto-remind">
            <Select
              value={instalment.remind}
              onChange={setInstalment('remind')}
              options={['Three days before each part', 'On the day', 'Do not remind']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'export_revenue'}
        onClose={onClose}
        title="Export Revenue Report"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Forecast</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`${exportForm.contents} exported as ${exportForm.format}.`)}
        footer={<Footer icon="ti ti-file-export" label="Export report" onClose={onClose} />}
      >
        <Drafted row={row} note="Exports carry the reasoning behind every figure" />
        <div className="row g-3">
          <Field label="Contents">
            <Select
              value={exportForm.contents}
              onChange={setExportForm('contents')}
              options={[
                'Full revenue report',
                'Forecast summary',
                'This case only',
                'Outstanding by pattern',
              ]}
            />
          </Field>
          <Field label="Format">
            <Select
              value={exportForm.format}
              onChange={setExportForm('format')}
              options={['PDF', 'XLSX', 'CSV']}
            />
          </Field>
          <Field label="Include reasoning">
            <Select
              value={exportForm.reasoning}
              onChange={setExportForm('reasoning')}
              options={['Yes, with evidence', 'Yes, summary only', 'Figures only']}
            />
          </Field>
          <Field label="Deliver to">
            <Select
              value={exportForm.deliver}
              onChange={setExportForm('deliver')}
              options={['Download', 'Email to me', 'Email to the finance committee']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'compare_cases'}
        onClose={onClose}
        title="Compare Revenue Cases"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Analysis</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit('Matched cases opened for comparison.')}
        footer={<Footer icon="ti ti-git-compare" label="Compare" onClose={onClose} />}
      >
        <Drafted row={row} note={`Against ${OPEN_CASES} open cases`} />
        <div className="row g-3">
          <Field label="Compare on">
            <Select
              value={compare.on}
              onChange={setCompare('on')}
              options={[
                'Payment pattern',
                'Days overdue',
                'Amount outstanding',
                'Collection probability',
              ]}
            />
          </Field>
          <Field label="Against">
            <Select
              value={compare.against}
              onChange={setCompare('against')}
              options={['Same pattern', 'Same class', `All ${OPEN_CASES} cases`, 'Last four terms']}
            />
          </Field>
          <Field label="Period">
            <Select
              value={compare.period}
              onChange={setCompare('period')}
              options={['This term', 'This year', 'All four terms']}
            />
          </Field>
          <Field label="Show">
            <Select
              value={compare.show}
              onChange={setCompare('show')}
              options={[`Top ${CASES.length} matches`, 'Top 15 matches', 'All matches']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'parent_communication'}
        onClose={onClose}
        title="Generate Parent Communication"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Collection</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Message drafted for ${surname}, held for approval.`)}
        footer={<Footer icon="ti ti-message-2" label="Generate message" onClose={onClose} />}
      >
        <Drafted row={row} note="Worded for this account's history" />
        <div className="row g-3">
          <Field label="Purpose">
            <Select
              value={message.purpose}
              onChange={setMessage('purpose')}
              options={[
                'Payment reminder',
                'Instalment offer',
                'Scholarship review invitation',
                'Meeting request',
              ]}
            />
          </Field>
          <Field label="Channel">
            <Select
              value={message.channel}
              onChange={setMessage('channel')}
              options={['WhatsApp · preferred', 'Email', 'Phone script', 'Printed letter']}
            />
          </Field>
          <Field label="Tone">
            <Select
              value={message.tone}
              onChange={setMessage('tone')}
              options={['Friendly', 'Neutral', 'Formal']}
            />
          </Field>
          <Field label="Language">
            <Select
              value={message.language}
              onChange={setMessage('language')}
              options={['English', 'Hindi', 'Tamil', 'Malayalam']}
            />
          </Field>
          <Field label="Draft" span="col-12">
            <textarea
              rows={4}
              className="form-control"
              value={message.draft}
              onChange={(event) => setMessage('draft')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'cash_flow'}
        onClose={onClose}
        title="Generate Cash Flow Summary"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Forecast</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`Cash flow summary drafted for the ${cashFlow.audience.toLowerCase()}.`)}
        footer={<Footer icon="ti ti-wave-sine" label="Generate summary" onClose={onClose} />}
      >
        <Drafted row={null} note="With the range around every figure" />
        <div className="row g-3">
          <Field label="Period">
            <Select
              value={cashFlow.period}
              onChange={setCashFlow('period')}
              options={['To term end', 'Next 8 weeks', 'Next quarter', 'Full year']}
            />
          </Field>
          <Field label="Granularity">
            <Select
              value={cashFlow.granularity}
              onChange={setCashFlow('granularity')}
              options={['Weekly', 'Fortnightly', 'Monthly']}
            />
          </Field>
          <Field label="Show range">
            <Select
              value={cashFlow.range}
              onChange={setCashFlow('range')}
              options={['Best, expected and low', 'Expected only', 'Expected and low']}
            />
          </Field>
          <Field label="Split by">
            <Select
              value={cashFlow.split}
              onChange={setCashFlow('split')}
              options={['Tuition, transport, cafeteria', 'Single total', 'By class']}
            />
          </Field>
          <Field label="Audience" span="col-12">
            <Select
              value={cashFlow.audience}
              onChange={setCashFlow('audience')}
              options={['Finance committee', 'Principal', 'Governors', 'Internal only']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'all_cases'}
        onClose={onClose}
        title="All Revenue Cases"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Workspace</span>}
        dialogClassName="modal-dialog-centered modal-xl"
        footer={
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 w-100">
            <span className="fs-13 text-muted">
              Showing <span className="fw-medium text-dark">{listed.length}</span> of{' '}
              <span className="fw-medium text-dark">{OPEN_CASES}</span> cases ·{' '}
              {REMINDER_CASES} answer a first reminder
            </span>
            <ActionLink
              className="btn btn-outline-light bg-white d-inline-flex align-items-center"
              onClick={() => onOpenDialog('export_revenue')}
            >
              <i className="ti ti-file-export me-1" />
              Export all
            </ActionLink>
          </div>
        }
      >
        <div className="row g-2 mb-3">
          <div className="col-lg-4 col-md-6">
            <select
              className="form-select lh-base"
              aria-label="Payment pattern"
              value={patternFilter}
              onChange={(event) => setPatternFilter(event.target.value)}
            >
              {['All patterns', ...PATTERNS].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-nowrap mb-0">
            <thead className="thead-light">
              <tr>
                <th>Parent</th>
                <th>Student</th>
                <th>Outstanding</th>
                <th>Timing</th>
                <th>Pattern</th>
                <th>Probability</th>
                <th>Predicted</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {listed.map((entry) => {
                const band = bandOf(entry.probability);
                return (
                  <tr key={entry.id}>
                    <td>
                      <span className="d-inline-flex align-items-center gap-2">
                        <span className="avatar avatar-xs avatar-rounded flex-shrink-0">
                          <ImageWithBasePath src={entry.parentImage} alt={entry.parent} />
                        </span>
                        <span className="fs-13 text-dark">{entry.parent}</span>
                      </span>
                    </td>
                    <td>
                      <span className="fs-13 text-muted">
                        {entry.student} · {entry.className.replace('Class ', '')}
                      </span>
                    </td>
                    <td>
                      <span className="fs-13 fw-medium text-dark">
                        {money(outstandingOf(entry))}
                      </span>
                    </td>
                    <td>
                      <span className="fs-13 text-muted">{timingLabelOf(entry)}</span>
                    </td>
                    <td>
                      <span className="fs-13 text-muted">{entry.pattern}</span>
                    </td>
                    <td>
                      <span className={`rev-tag ${band.tone}`}>{entry.probability}%</span>
                    </td>
                    <td>
                      <span className="fs-13 text-muted">{entry.predictedOn ?? 'Uncertain'}</span>
                    </td>
                    <td className="text-end">
                      <ActionLink
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        onClick={() => {
                          onClose();
                          onOpenRow(entry);
                        }}
                      >
                        <i className="ti ti-layout-sidebar-right-expand me-1" />
                        Open
                      </ActionLink>
                    </td>
                  </tr>
                );
              })}
              {listed.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">
                    No case carries that pattern.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <p className="fs-12 text-muted mb-0 mt-3">
          <i className="ti ti-info-circle me-1" />
          Days overdue are counted against {RUN_DATE}. Ordering follows collection probability, not
          age — which is the page's whole point.
        </p>
      </Modal>
    </>
  );
};

export default RevenueModals;
