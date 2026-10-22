import { useEffect, useMemo, useState } from 'react';
import Modal from '@components/ui/Modal';
import DateField from '@components/ui/DateField';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { ActionLink } from '@components/workspace';
import type { AttendanceBand, AttendanceCase } from '../data/attendance.data';
import {
  AWARD_ON,
  ATTENDANCE_CHAMPIONS,
  bandOf,
  bandPill,
  CHRONIC_MONTHS,
  dropOf,
  EARLY_START_DAYS,
  IMPROVED_THIS_MONTH,
  LAST_RUN,
  LIGHTEST_LOAD,
  MEETING_ON,
  PREDICTED_BY,
  reasoningOf,
  RESPONSE_DUE,
  REVIEW_BY,
  ROUTE,
  SIGNAL_COUNT,
  STATUTORY_THRESHOLD,
  STUDENTS_SCORED,
  TEACHER_LOAD,
  UNANSWERED_LETTERS,
  UNDER_OBSERVATION,
} from '../data/attendance.data';

export type AttendanceModalId =
  | 'run_analysis'
  | 'notify_parent'
  | 'assign_teacher'
  | 'parent_meeting'
  | 'recovery_plan'
  | 'parent_letter'
  | 'export_summary'
  | 'attendance_reward'
  | 'attendance_warning'
  | 'generate_summary'
  | 'compare_students'
  | 'explain_prediction'
  | 'all_cases';

export interface AttendanceModalsProps {
  active: AttendanceModalId | null;
  onClose: () => void;
  /** The case the dialog is about, when one is in play. */
  row: AttendanceCase | null;
  rows: AttendanceCase[];
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  onOpenCase: (row: AttendanceCase) => void;
  onOpenDialog: (id: AttendanceModalId) => void;
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

/** Every dialog opens with what the engine has already drafted. */
const Drafted = ({ lead, note }: { lead: React.ReactNode; note?: string }) => (
  <div className="atn-alert mb-3">
    <span className="atn-alert-ic">
      <i className="ti ti-sparkles" />
    </span>
    <div className="flex-fill">
      <p className="fs-13 fw-medium text-dark mb-0">{lead}</p>
      <p className="fs-12 text-muted mb-0">
        {note ?? 'Drafted by the attendance engine · review before sending'}
      </p>
    </div>
  </div>
);

const Footer = ({
  icon,
  label,
  onClose,
}: {
  icon: string;
  label: string;
  onClose: () => void;
}) => (
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

/**
 * One dialog's form state, keyed by field label.
 *
 * The template ships every select with its first option chosen and every text
 * field with a value already in it, so a dialog opens ready to submit. This
 * reproduces that: the shape below is the defaults, and the state resets each
 * time a dialog is opened.
 */
const useForm = <T extends Record<string, string>>(defaults: T, open: boolean) => {
  const [values, setValues] = useState<T>(defaults);
  // Serialised so the effect below depends on the defaults' *content* rather
  // than on the object identity, which changes on every render.
  const initial = JSON.stringify(defaults);

  useEffect(() => {
    if (open) setValues(JSON.parse(initial) as T);
  }, [open, initial]);

  const set = (key: keyof T) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  return [values, set] as const;
};

const AttendanceModals = ({
  active,
  onClose,
  row,
  rows,
  onToast,
  onOpenCase,
  onOpenDialog,
}: AttendanceModalsProps) => {
  const student = row?.student ?? 'this student';
  const firstName = student.split(' ')[0];

  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message, 'success');
    onClose();
  };

  /* ---------------------------------------------------------------- *
   * Detect                                                           *
   * ---------------------------------------------------------------- */

  const [analysis, setAnalysis] = useForm(
    {
      scope: 'All enrolled students',
      window: `Next ${30} days`,
      floor: '80% and above',
      signals: `All ${SIGNAL_COUNT} signals`,
    },
    active === 'run_analysis',
  );

  /* ---------------------------------------------------------------- *
   * Recover                                                          *
   * ---------------------------------------------------------------- */

  const guardian = row?.guardian ?? 'the guardian';
  const [notify, setNotify] = useForm(
    {
      recipient: `Guardian · ${guardian}`,
      channel: 'Email and SMS',
      message: row
        ? `${firstName}’s attendance has fallen to ${row.current}% and is predicted to reach ${row.predicted}% by ${PREDICTED_BY}. Most of the recent late marks trace back to a transport delay on ${ROUTE.name}, which we are reviewing. We would like to agree a short recovery plan with you this week.`
        : '',
    },
    active === 'notify_parent',
  );

  const [assign, setAssign] = useForm(
    {
      teacher: `${LIGHTEST_LOAD.name} · ${LIGHTEST_LOAD.open} open cases`,
      responsibility: 'Own the recovery plan',
      reviewBy: REVIEW_BY,
      notify: 'Teacher and admin',
    },
    active === 'assign_teacher',
  );

  const [meeting, setMeeting] = useForm(
    {
      date: MEETING_ON,
      time: '10:30 AM',
      mode: 'In person',
      attendees: 'Guardian and class teacher',
      agenda: `Review the predicted decline, confirm the transport cause and agree the ${
        row?.plan?.weeks ?? 4
      }-week recovery plan and its checkpoints.`,
    },
    active === 'parent_meeting',
  );

  const [plan, setPlan] = useForm(
    {
      length: '4 weeks',
      target: `${row?.plan?.target ?? 85}%`,
      owner: row?.teacher ?? TEACHER_LOAD[0].name,
      checkpoint: 'Weekly',
      actions: `Week 1 parent letter and transport review. Week 2 confirm route change. Week 3 daily morning check-in. Week 4 review against the ${
        row?.plan?.target ?? 85
      }% target.`,
    },
    active === 'recovery_plan',
  );

  const [warning, setWarning] = useForm(
    {
      level: 'First formal warning',
      delivery: 'Email and printed copy',
      due: RESPONSE_DUE,
      copyTo: 'Class teacher and principal',
      notice: `Attendance has remained below the statutory threshold of ${STATUTORY_THRESHOLD}% for ${CHRONIC_MONTHS} consecutive months despite a letter and a meeting invitation. We are required to record a formal warning.`,
    },
    active === 'attendance_warning',
  );

  /* ---------------------------------------------------------------- *
   * Copilot, Recommend and Track                                     *
   * ---------------------------------------------------------------- */

  const [letter, setLetter] = useForm(
    {
      tone: 'Supportive',
      language: 'English',
      include: 'Prediction and reasoning',
      format: 'PDF letter',
      preview: row
        ? `Dear ${guardian.replace(/^(Mr|Mrs|Ms)\.\s*[A-Z]\.\s*/, '$1. ')}, we are writing about ${firstName}’s attendance, which currently stands at ${row.current}%. Our review suggests the recent absences are linked to a transport delay rather than to anything at school, and we have raised this with the transport office.`
        : '',
    },
    active === 'parent_letter',
  );

  const [exportForm, setExportForm] = useForm(
    {
      contents: 'Full case queue',
      format: 'PDF',
      reasoning: 'Yes, with signals',
      deliver: 'Download',
    },
    active === 'export_summary',
  );

  const [reward, setReward] = useForm(
    {
      reward: 'Certificate of improvement',
      recipients: `Most improved · ${IMPROVED_THIS_MONTH} students`,
      date: AWARD_ON,
      notify: 'Student and guardian',
    },
    active === 'attendance_reward',
  );

  const [summary, setSummary] = useForm(
    {
      audience: 'Class teacher',
      length: 'One page',
      include: 'Reasoning chain',
      format: 'PDF',
    },
    active === 'generate_summary',
  );

  const [compare, setCompare] = useForm(
    {
      matchOn: 'Signal pattern',
      outcome: 'Recovered cases only',
      window: 'Last two terms',
      show: 'Top 8 matches',
    },
    active === 'compare_students',
  );

  const explainCases = rows.slice(0, 3);
  const [explain, setExplain] = useForm(
    {
      target: explainCases[0] ? `${explainCases[0].id} · ${explainCases[0].student}` : '',
      depth: `Full chain · ${reasoningOf(rows.find((entry) => entry.evidence) ?? rows[0]).length} links`,
      weights: 'Yes, per signal',
      format: 'On screen',
    },
    active === 'explain_prediction',
  );

  /* ---------------------------------------------------------------- *
   * All students under observation                                   *
   * ---------------------------------------------------------------- */

  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('All risk levels');
  const [sort, setSort] = useState('Sort: Predicted drop');

  useEffect(() => {
    if (active === 'all_cases') {
      setSearch('');
      setLevel('All risk levels');
      setSort('Sort: Predicted drop');
    }
  }, [active]);

  const listed = useMemo(() => {
    const term = search.trim().toLowerCase();
    const matched = rows.filter((entry) => {
      const matchesTerm =
        !term ||
        `${entry.student} ${entry.classShort} ${entry.id}`.toLowerCase().includes(term);
      const matchesLevel = level === 'All risk levels' || bandOf(entry.predicted) === level;
      return matchesTerm && matchesLevel;
    });
    const compareBy: Record<string, (a: AttendanceCase, b: AttendanceCase) => number> = {
      'Sort: Predicted drop': (a, b) => dropOf(b) - dropOf(a),
      'Sort: Confidence': (a, b) => b.confidence - a.confidence,
      'Sort: Last updated': () => 0,
    };
    return [...matched].sort(compareBy[sort] ?? compareBy['Sort: Predicted drop']);
  }, [rows, search, level, sort]);

  const bands: AttendanceBand[] = ['Critical', 'High', 'Watch'];

  /* ---------------------------------------------------------------- *
   * Render                                                           *
   * ---------------------------------------------------------------- */

  return (
    <>
      <Modal
        open={active === 'run_analysis'}
        onClose={onClose}
        title="Run Attendance Analysis"
        eyebrow={<span className="aix-eyebrow">Detect</span>}
        className="aix-modal"
        dialogClassName="modal-dialog-centered"
        onSubmit={submit('Attendance analysis queued. The queue refreshes when it finishes.')}
        footer={<Footer icon="ti ti-player-play" label="Run analysis" onClose={onClose} />}
      >
        <Drafted
          lead={`The last run finished at ${LAST_RUN} today and scored ${STUDENTS_SCORED.toLocaleString('en-IN')} students.`}
        />
        <div className="row g-3">
          <Field label="Scope">
            <Select
              value={analysis.scope}
              onChange={setAnalysis('scope')}
              options={[
                'All enrolled students',
                `${ROUTE.block} only`,
                'Classes below 85%',
                'Open cases only',
              ]}
            />
          </Field>
          <Field label="Prediction window">
            <Select
              value={analysis.window}
              onChange={setAnalysis('window')}
              options={['Next 30 days', 'Next 14 days', 'Rest of term']}
            />
          </Field>
          <Field label="Confidence floor">
            <Select
              value={analysis.floor}
              onChange={setAnalysis('floor')}
              options={['80% and above', '85% and above', '90% and above']}
            />
          </Field>
          <Field label="Signals">
            <Select
              value={analysis.signals}
              onChange={setAnalysis('signals')}
              options={[
                `All ${SIGNAL_COUNT} signals`,
                'Attendance signals only',
                'Attendance and transport',
              ]}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'notify_parent'}
        onClose={onClose}
        title="Notify Parent"
        eyebrow={<span className="aix-eyebrow">Recover</span>}
        className="aix-modal"
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`Predicted-decline letter sent to ${guardian}.`)}
        footer={<Footer icon="ti ti-send" label="Send notification" onClose={onClose} />}
      >
        <Drafted lead={`A predicted-decline letter has been drafted for ${student}.`} />
        <div className="row g-3">
          <Field label="Recipient">
            <Select
              value={notify.recipient}
              onChange={setNotify('recipient')}
              options={[
                `Guardian · ${guardian}`,
                'Both guardians',
                'Guardian and class teacher',
              ]}
            />
          </Field>
          <Field label="Channel">
            <Select
              value={notify.channel}
              onChange={setNotify('channel')}
              options={['Email and SMS', 'Email only', 'SMS only', 'Printed letter']}
            />
          </Field>
          <Field label="Message" span="col-12">
            <textarea
              rows={4}
              className="form-control"
              value={notify.message}
              onChange={(event) => setNotify('message')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'assign_teacher'}
        onClose={onClose}
        title="Assign Teacher"
        eyebrow={<span className="aix-eyebrow">Recover</span>}
        className="aix-modal"
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`${assign.teacher.split(' · ')[0]} now owns this case.`)}
        footer={<Footer icon="ti ti-user-check" label="Assign teacher" onClose={onClose} />}
      >
        <Drafted
          lead={`${LIGHTEST_LOAD.name} has the lightest open caseload in ${row?.className ?? 'this class'}.`}
        />
        <div className="row g-3">
          <Field label="Teacher">
            <Select
              value={assign.teacher}
              onChange={setAssign('teacher')}
              options={TEACHER_LOAD.map((entry) => `${entry.name} · ${entry.open} open cases`)}
            />
          </Field>
          <Field label="Responsibility">
            <Select
              value={assign.responsibility}
              onChange={setAssign('responsibility')}
              options={[
                'Own the recovery plan',
                'Daily attendance check',
                'Parent liaison',
                'Observation only',
              ]}
            />
          </Field>
          <Field label="Review by">
            <DateField value={assign.reviewBy} onChange={setAssign('reviewBy')} />
          </Field>
          <Field label="Notify">
            <Select
              value={assign.notify}
              onChange={setAssign('notify')}
              options={['Teacher and admin', 'Teacher only', 'Teacher, admin and counselor']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'parent_meeting'}
        onClose={onClose}
        title="Schedule Parent Meeting"
        eyebrow={<span className="aix-eyebrow">Recover</span>}
        className="aix-modal"
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`Meeting scheduled for ${meeting.date} at ${meeting.time}.`)}
        footer={<Footer icon="ti ti-calendar-plus" label="Schedule meeting" onClose={onClose} />}
      >
        <Drafted
          lead={`${UNANSWERED_LETTERS} households have not responded to a first letter.`}
        />
        <div className="row g-3">
          <Field label="Date">
            <DateField value={meeting.date} onChange={setMeeting('date')} />
          </Field>
          <Field label="Time">
            <input
              type="text"
              className="form-control"
              value={meeting.time}
              onChange={(event) => setMeeting('time')(event.target.value)}
            />
          </Field>
          <Field label="Mode">
            <Select
              value={meeting.mode}
              onChange={setMeeting('mode')}
              options={['In person', 'Video call', 'Phone call']}
            />
          </Field>
          <Field label="Attendees">
            <Select
              value={meeting.attendees}
              onChange={setMeeting('attendees')}
              options={[
                'Guardian and class teacher',
                'Guardian, teacher and counselor',
                'Guardian and principal',
              ]}
            />
          </Field>
          <Field label="Agenda" span="col-12">
            <textarea
              rows={3}
              className="form-control"
              value={meeting.agenda}
              onChange={(event) => setMeeting('agenda')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'recovery_plan'}
        onClose={onClose}
        title="Create Recovery Plan"
        eyebrow={<span className="aix-eyebrow">Recover</span>}
        className="aix-modal"
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`${plan.length} recovery plan opened, owned by ${plan.owner}.`)}
        footer={<Footer icon="ti ti-route" label="Create plan" onClose={onClose} />}
      >
        <Drafted
          lead={`A four-week plan lifts attendance by 11 points on average when opened within ${EARLY_START_DAYS} days.`}
        />
        <div className="row g-3">
          <Field label="Plan length">
            <Select
              value={plan.length}
              onChange={setPlan('length')}
              options={['4 weeks', '6 weeks', '8 weeks']}
            />
          </Field>
          <Field label="Target attendance">
            <input
              type="text"
              className="form-control"
              value={plan.target}
              onChange={(event) => setPlan('target')(event.target.value)}
            />
          </Field>
          <Field label="Owner">
            <Select
              value={plan.owner}
              onChange={setPlan('owner')}
              options={TEACHER_LOAD.map((entry) => entry.name)}
            />
          </Field>
          <Field label="Checkpoint">
            <Select
              value={plan.checkpoint}
              onChange={setPlan('checkpoint')}
              options={['Weekly', 'Twice weekly', 'Fortnightly']}
            />
          </Field>
          <Field label="Actions" span="col-12">
            <textarea
              rows={3}
              className="form-control"
              value={plan.actions}
              onChange={(event) => setPlan('actions')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'parent_letter'}
        onClose={onClose}
        title="Generate Parent Letter"
        eyebrow={<span className="aix-eyebrow">Copilot</span>}
        className="aix-modal"
        dialogClassName="modal-dialog-centered"
        onSubmit={submit('Parent letter drafted and held for review.')}
        footer={<Footer icon="ti ti-file-text" label="Generate letter" onClose={onClose} />}
      >
        <Drafted lead="Written from the case record in plain language, at a reading level suited to a general audience." />
        <div className="row g-3">
          <Field label="Tone">
            <Select
              value={letter.tone}
              onChange={setLetter('tone')}
              options={['Supportive', 'Formal', 'Direct']}
            />
          </Field>
          <Field label="Language">
            <Select
              value={letter.language}
              onChange={setLetter('language')}
              options={['English', 'Hindi', 'Tamil', 'Malayalam']}
            />
          </Field>
          <Field label="Include">
            <Select
              value={letter.include}
              onChange={setLetter('include')}
              options={[
                'Prediction and reasoning',
                'Prediction only',
                'Prediction, reasoning and plan',
              ]}
            />
          </Field>
          <Field label="Format">
            <Select
              value={letter.format}
              onChange={setLetter('format')}
              options={['PDF letter', 'Email body', 'Printable A4']}
            />
          </Field>
          <Field label="Preview" span="col-12">
            <textarea
              rows={4}
              className="form-control"
              value={letter.preview}
              onChange={(event) => setLetter('preview')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'export_summary'}
        onClose={onClose}
        title="Export Attendance Summary"
        eyebrow={<span className="aix-eyebrow">Track</span>}
        className="aix-modal"
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`${exportForm.contents} exported as ${exportForm.format}.`)}
        footer={<Footer icon="ti ti-download" label="Export summary" onClose={onClose} />}
      >
        <Drafted lead="Exports carry the reasoning chain and the decision history alongside the figures." />
        <div className="row g-3">
          <Field label="Contents">
            <Select
              value={exportForm.contents}
              onChange={setExportForm('contents')}
              options={[
                'Full case queue',
                'Critical cases only',
                'This case only',
                'Weekly leadership summary',
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
              options={['Yes, with signals', 'Yes, summary only', 'No, figures only']}
            />
          </Field>
          <Field label="Deliver to">
            <Select
              value={exportForm.deliver}
              onChange={setExportForm('deliver')}
              options={['Download', 'Email to me', 'Email to leadership']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'attendance_reward'}
        onClose={onClose}
        title="Attendance Reward"
        eyebrow={<span className="aix-eyebrow">Track</span>}
        className="aix-modal"
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`${reward.reward} issued to ${reward.recipients.toLowerCase()}.`)}
        footer={<Footer icon="ti ti-award" label="Issue reward" onClose={onClose} />}
      >
        <Drafted
          lead={`${IMPROVED_THIS_MONTH} students moved from Watch to Good this month.`}
        />
        <div className="row g-3">
          <Field label="Reward">
            <Select
              value={reward.reward}
              onChange={setReward('reward')}
              options={[
                'Certificate of improvement',
                'Attendance champion badge',
                'Assembly recognition',
                'Letter of appreciation',
              ]}
            />
          </Field>
          <Field label="Recipients">
            <Select
              value={reward.recipients}
              onChange={setReward('recipients')}
              options={[
                `Most improved · ${IMPROVED_THIS_MONTH} students`,
                `Attendance champions · ${ATTENDANCE_CHAMPIONS} students`,
                'This student only',
              ]}
            />
          </Field>
          <Field label="Award date">
            <DateField value={reward.date} onChange={setReward('date')} />
          </Field>
          <Field label="Notify">
            <Select
              value={reward.notify}
              onChange={setReward('notify')}
              options={['Student and guardian', 'Student only', 'Student, guardian and teacher']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'attendance_warning'}
        onClose={onClose}
        title="Attendance Warning"
        eyebrow={<span className="aix-eyebrow">Recover</span>}
        className="aix-modal"
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`${warning.level} recorded, response due ${warning.due}.`)}
        footer={<Footer icon="ti ti-alert-triangle" label="Issue warning" onClose={onClose} />}
      >
        <Drafted lead="Issued only where a letter and a meeting have both gone unanswered." />
        <div className="row g-3">
          <Field label="Warning level">
            <Select
              value={warning.level}
              onChange={setWarning('level')}
              options={['First formal warning', 'Second formal warning', 'Final warning']}
            />
          </Field>
          <Field label="Delivery">
            <Select
              value={warning.delivery}
              onChange={setWarning('delivery')}
              options={['Email and printed copy', 'Printed copy only', 'Registered post']}
            />
          </Field>
          <Field label="Response due">
            <DateField value={warning.due} onChange={setWarning('due')} />
          </Field>
          <Field label="Copy to">
            <Select
              value={warning.copyTo}
              onChange={setWarning('copyTo')}
              options={['Class teacher and principal', 'Class teacher only', 'Principal only']}
            />
          </Field>
          <Field label="Notice" span="col-12">
            <textarea
              rows={3}
              className="form-control"
              value={warning.notice}
              onChange={(event) => setWarning('notice')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'generate_summary'}
        onClose={onClose}
        title="Generate Summary"
        eyebrow={<span className="aix-eyebrow">Copilot</span>}
        className="aix-modal"
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`Summary drafted for ${summary.audience.toLowerCase()}.`)}
        footer={<Footer icon="ti ti-file-text" label="Generate summary" onClose={onClose} />}
      >
        <Drafted lead="One page covering the prediction, the reasoning and the recommended next step." />
        <div className="row g-3">
          <Field label="Audience">
            <Select
              value={summary.audience}
              onChange={setSummary('audience')}
              options={['Class teacher', 'Leadership', 'Guardian', 'Counselor']}
            />
          </Field>
          <Field label="Length">
            <Select
              value={summary.length}
              onChange={setSummary('length')}
              options={['One page', 'Half page', 'Detailed']}
            />
          </Field>
          <Field label="Include">
            <Select
              value={summary.include}
              onChange={setSummary('include')}
              options={['Reasoning chain', 'Reasoning and history', 'Figures only']}
            />
          </Field>
          <Field label="Format">
            <Select
              value={summary.format}
              onChange={setSummary('format')}
              options={['PDF', 'Email body', 'Copy to clipboard']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'compare_students'}
        onClose={onClose}
        title="Compare Similar Students"
        eyebrow={<span className="aix-eyebrow">Recommend</span>}
        className="aix-modal"
        dialogClassName="modal-dialog-centered"
        onSubmit={submit('Matched cases opened for comparison.')}
        footer={<Footer icon="ti ti-users-group" label="Compare cases" onClose={onClose} />}
      >
        <Drafted
          lead={`${row?.evidence?.similarCases ?? 8} students recovered from the same signal pattern in the last two terms.`}
        />
        <div className="row g-3">
          <Field label="Match on">
            <Select
              value={compare.matchOn}
              onChange={setCompare('matchOn')}
              options={['Signal pattern', 'Class and pattern', 'Transport route', 'Attendance band']}
            />
          </Field>
          <Field label="Outcome">
            <Select
              value={compare.outcome}
              onChange={setCompare('outcome')}
              options={['Recovered cases only', 'All cases', 'Cases still open']}
            />
          </Field>
          <Field label="Window">
            <Select
              value={compare.window}
              onChange={setCompare('window')}
              options={['Last two terms', 'This academic year', 'All time']}
            />
          </Field>
          <Field label="Show">
            <Select
              value={compare.show}
              onChange={setCompare('show')}
              options={[
                `Top ${row?.evidence?.similarCases ?? 8} matches`,
                'Top 15 matches',
                'All matches',
              ]}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'explain_prediction'}
        onClose={onClose}
        title="Explain AI Prediction"
        eyebrow={<span className="aix-eyebrow">Understand</span>}
        className="aix-modal"
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`Reasoning chain opened for ${explain.target.split(' · ')[0]}.`)}
        footer={<Footer icon="ti ti-bulb" label="Explain prediction" onClose={onClose} />}
      >
        <Drafted lead="Walks the full signal chain, showing the weight each signal carried." />
        <div className="row g-3">
          <Field label="Case">
            <Select
              value={explain.target}
              onChange={setExplain('target')}
              options={explainCases.map((entry) => `${entry.id} · ${entry.student}`)}
            />
          </Field>
          <Field label="Depth">
            <Select
              value={explain.depth}
              onChange={setExplain('depth')}
              options={[
                `Full chain · ${reasoningOf(rows.find((entry) => entry.evidence) ?? rows[0]).length} links`,
                'Top 3 signals',
                'Summary sentence',
              ]}
            />
          </Field>
          <Field label="Show weights">
            <Select
              value={explain.weights}
              onChange={setExplain('weights')}
              options={['Yes, per signal', 'Yes, grouped', 'No']}
            />
          </Field>
          <Field label="Format">
            <Select
              value={explain.format}
              onChange={setExplain('format')}
              options={['On screen', 'PDF', 'Email']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'all_cases'}
        onClose={onClose}
        title="All Students Under Observation"
        eyebrow={<span className="aix-eyebrow">Detect</span>}
        className="aix-modal"
        dialogClassName="modal-dialog-centered modal-xl"
        footer={
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 w-100">
            <span className="fs-13 text-muted">
              Showing <span className="fw-medium text-dark">{listed.length}</span> of{' '}
              <span className="fw-medium text-dark">{UNDER_OBSERVATION}</span> students
            </span>
            <ActionLink
              className="btn btn-outline-light bg-white d-inline-flex align-items-center"
              onClick={() => onOpenDialog('export_summary')}
            >
              <i className="ti ti-file-export me-1" />
              Export queue
            </ActionLink>
          </div>
        }
      >
        <div className="row g-2 mb-3">
          <div className="col-lg-4 col-md-6">
            <div className="input-icon-start position-relative">
              <span className="input-icon-addon">
                <i className="ti ti-search" />
              </span>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search student, class or case id"
                aria-label="Search student, class or case id"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <select
              className="form-select lh-base"
              aria-label="All risk levels"
              value={level}
              onChange={(event) => setLevel(event.target.value)}
            >
              {['All risk levels', ...bands].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-lg-3 col-md-6">
            <select className="form-select lh-base" aria-label="All classes" defaultValue="All classes">
              {['All classes', 'Block A', ROUTE.block, 'Block C'].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-lg-2 col-md-6">
            <select
              className="form-select lh-base"
              aria-label="Sort order"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              {['Sort: Predicted drop', 'Sort: Confidence', 'Sort: Last updated'].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-nowrap mb-0">
            <thead className="thead-light">
              <tr>
                <th>Case</th>
                <th>Student</th>
                <th>Class</th>
                <th>Current</th>
                <th>Predicted</th>
                <th>Risk</th>
                <th>AI confidence</th>
                <th>Teacher</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {listed.map((entry) => {
                const band = bandOf(entry.predicted);
                return (
                  <tr key={entry.id}>
                    <td>
                      <span className="fs-13 fw-medium text-dark">{entry.id}</span>
                    </td>
                    <td>
                      <span className="d-inline-flex align-items-center gap-2">
                        <span className="avatar avatar-xs avatar-rounded flex-shrink-0">
                          <ImageWithBasePath src={entry.studentImage} alt={entry.student} />
                        </span>
                        <span className="fs-13 text-dark">{entry.student}</span>
                      </span>
                    </td>
                    <td>
                      <span className="fs-13 text-muted">{entry.classShort}</span>
                    </td>
                    <td>
                      <span className="fs-13 fw-medium text-dark">{entry.current}%</span>
                    </td>
                    <td>
                      <span className="fs-13 fw-medium text-dark">{entry.predicted}%</span>
                    </td>
                    <td>
                      <span className={`atn-pill ${bandPill(band)}`}>{band}</span>
                    </td>
                    <td>
                      <span className={`atn-conf aix-p-${entry.confidence}`}>
                        <b>{entry.confidence}%</b>
                      </span>
                    </td>
                    <td>
                      <span className="fs-13 text-muted">{entry.teacher}</span>
                    </td>
                    <td className="text-end">
                      <ActionLink
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        onClick={() => {
                          onClose();
                          onOpenCase(entry);
                        }}
                      >
                        <i className="ti ti-brain me-1" />
                        Open
                      </ActionLink>
                    </td>
                  </tr>
                );
              })}
              {listed.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center text-muted py-4">
                    No student matches that search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
};

export default AttendanceModals;
