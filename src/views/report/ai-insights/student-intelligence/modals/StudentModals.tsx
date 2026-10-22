import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import DateField from '@components/ui/DateField';
import { ActionLink } from '@components/workspace';
import {
  ATTENDANCE,
  COHORT,
  CURRENT_PERCENTILE,
  FIRST_PERCENTILE,
  MEETING_ON,
  MENTOR_START,
  ordinal,
  PLAN_REVIEW,
  PLAN_TARGET_MARKS,
  PROPOSED_MENTOR,
  SIMILAR,
  STUDENT,
  TERMS_ON_RECORD,
} from '../data/student.data';

export type StudentModalId =
  | 'student_summary'
  | 'compare_students'
  | 'parent_report'
  | 'learning_plan'
  | 'assign_mentor'
  | 'parent_meeting'
  | 'export_intelligence';

export interface StudentModalsProps {
  active: StudentModalId | null;
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

/** Every dialog opens by naming the student and what was drafted. */
const Drafted = ({ note }: { note: string }) => (
  <div className="sdt-box mb-3">
    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
      <p className="sdt-box-title mb-0">
        {STUDENT.name} · {STUDENT.className}
      </p>
      <span className="sdt-tag is-ai">
        <i className="ti ti-sparkles" />
        {note}
      </span>
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

const StudentModals = ({ active, onClose, onToast }: StudentModalsProps) => {
  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message, 'success');
    onClose();
  };

  const firstName = STUDENT.name.split(' ')[0];

  const [summary, setSummary] = useForm(
    {
      audience: 'Class teacher',
      length: 'One page',
      include: 'Reasoning and evidence',
      format: 'PDF',
      opening: `${firstName} has moved from the ${ordinal(FIRST_PERCENTILE)} to the ${ordinal(
        CURRENT_PERCENTILE,
      )} percentile across ${TERMS_ON_RECORD} terms. Reading and science are compounding; symbolic algebra has not moved in two terms and now sets the ceiling on her overall standing.`,
    },
    active === 'student_summary',
  );

  const [compare, setCompare] = useForm(
    {
      matchOn: 'Learning profile',
      cohort: 'Same class',
      outcome: 'Students who closed the gap',
      show: `Top ${SIMILAR.length} matches`,
    },
    active === 'compare_students',
  );

  const [report, setReport] = useForm(
    {
      tone: 'Warm',
      language: 'English',
      include: 'Strengths and one focus area',
      delivery: 'Email',
      preview: `Dear ${STUDENT.guardian.replace('Mr. & Mrs.', 'Mr. and Mrs.')}, ${firstName} has had a strong year. Her reading and science are among the strongest in her class, and her attendance has fully recovered since the bus schedule was corrected. We would like to focus the coming term on one area: the symbolic side of mathematics.`,
    },
    active === 'parent_report',
  );

  const [plan, setPlan] = useForm(
    {
      focus: 'Symbolic algebra notation',
      duration: 'One term · 8 weeks',
      owner: `${STUDENT.teacher} · class teacher`,
      checkpoint: 'Weekly',
      target: `+${PLAN_TARGET_MARKS} marks by term end`,
      review: PLAN_REVIEW,
      plan: 'Weeks 1–2 notation drills twice weekly using worked examples. Weeks 3–4 paired work with the assigned mentor. Weeks 5–6 a short weekly algebra check. Weeks 7–8 a full paper under timed conditions.',
    },
    active === 'learning_plan',
  );

  const [mentor, setMentor] = useForm(
    {
      mentor: PROPOSED_MENTOR
        ? `${PROPOSED_MENTOR.name} · ${PROPOSED_MENTOR.className} · ${PROPOSED_MENTOR.note}`
        : '',
      focus: 'Symbolic algebra',
      frequency: 'Twice weekly',
      start: MENTOR_START,
      review: 'Six weeks',
      notify: 'Both students and guardians',
    },
    active === 'assign_mentor',
  );

  const [meeting, setMeeting] = useForm(
    {
      date: MEETING_ON,
      time: '10:30 AM',
      mode: 'In person',
      attendees: 'Guardian and class teacher',
      agenda:
        'Review the year, confirm the mathematics plan and its checkpoints, discuss the STEM scholarship nomination, and agree one counselling session ahead of the term exams.',
    },
    active === 'parent_meeting',
  );

  const [exportForm, setExportForm] = useForm(
    {
      contents: 'Full intelligence record',
      format: 'PDF',
      evidence: 'Yes, full evidence',
      deliver: 'Download',
    },
    active === 'export_intelligence',
  );

  return (
    <>
      <Modal
        open={active === 'student_summary'}
        onClose={onClose}
        title="Generate Student Summary"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Copilot</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Summary drafted for ${summary.audience.toLowerCase()}.`)}
        footer={<Footer icon="ti ti-file-text" label="Generate summary" onClose={onClose} />}
      >
        <Drafted note={`Drafted from ${TERMS_ON_RECORD} terms of record`} />
        <div className="row g-3">
          <Field label="Audience">
            <Select
              value={summary.audience}
              onChange={setSummary('audience')}
              options={['Class teacher', 'Leadership', 'Counselor', 'Incoming teacher']}
            />
          </Field>
          <Field label="Length">
            <Select
              value={summary.length}
              onChange={setSummary('length')}
              options={['One page', 'Half page', 'Detailed briefing']}
            />
          </Field>
          <Field label="Include">
            <Select
              value={summary.include}
              onChange={setSummary('include')}
              options={['Reasoning and evidence', 'Findings only', 'Findings and recommendations']}
            />
          </Field>
          <Field label="Format">
            <Select
              value={summary.format}
              onChange={setSummary('format')}
              options={['PDF', 'Email body', 'Copy to clipboard']}
            />
          </Field>
          <Field label="Opening paragraph" span="col-12">
            <textarea
              rows={3}
              className="form-control"
              value={summary.opening}
              onChange={(event) => setSummary('opening')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'compare_students'}
        onClose={onClose}
        title="Compare Students"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Insights</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit('Matched records opened for comparison.')}
        footer={<Footer icon="ti ti-users-group" label="Compare" onClose={onClose} />}
      >
        <Drafted note={`${SIMILAR.length} close matches in the current cohort`} />
        <div className="row g-3">
          <Field label="Match on">
            <Select
              value={compare.matchOn}
              onChange={setCompare('matchOn')}
              options={[
                'Learning profile',
                'Subject pattern',
                'Notation gap',
                'Participation pattern',
              ]}
            />
          </Field>
          <Field label="Cohort">
            <Select
              value={compare.cohort}
              onChange={setCompare('cohort')}
              options={['Same class', 'Same year group', 'Whole school']}
            />
          </Field>
          <Field label="Outcome filter">
            <Select
              value={compare.outcome}
              onChange={setCompare('outcome')}
              options={['Students who closed the gap', 'All matches', 'Still open']}
            />
          </Field>
          <Field label="Show">
            <Select
              value={compare.show}
              onChange={setCompare('show')}
              options={[`Top ${SIMILAR.length} matches`, 'Top 8 matches', 'All matches']}
            />
          </Field>
          <div className="col-12">
            <span className="sdt-lbl mb-2">Closest matches on record</span>
            {SIMILAR.map((match) => (
              <div className="sdt-ev" key={match.name}>
                <i className="ti ti-user-check" />
                <span>
                  {match.name} · {match.className} — {match.note}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      <Modal
        open={active === 'parent_report'}
        onClose={onClose}
        title="Generate Parent Report"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Copilot</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Parent report drafted for ${STUDENT.guardian}.`)}
        footer={<Footer icon="ti ti-mail-star" label="Generate report" onClose={onClose} />}
      >
        <Drafted note="Plain language, no scores without context" />
        <div className="row g-3">
          <Field label="Tone">
            <Select
              value={report.tone}
              onChange={setReport('tone')}
              options={['Warm', 'Formal', 'Direct']}
            />
          </Field>
          <Field label="Language">
            <Select
              value={report.language}
              onChange={setReport('language')}
              options={['English', 'Hindi', 'Tamil', 'Malayalam']}
            />
          </Field>
          <Field label="Include">
            <Select
              value={report.include}
              onChange={setReport('include')}
              options={['Strengths and one focus area', 'Full findings', 'Focus area only']}
            />
          </Field>
          <Field label="Delivery">
            <Select
              value={report.delivery}
              onChange={setReport('delivery')}
              options={['Email', 'Printed letter', 'Parent portal']}
            />
          </Field>
          <Field label="Preview" span="col-12">
            <textarea
              rows={4}
              className="form-control"
              value={report.preview}
              onChange={(event) => setReport('preview')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'learning_plan'}
        onClose={onClose}
        title="Create Learning Plan"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Recommendations</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Learning plan opened, reviewed ${plan.review}.`)}
        footer={<Footer icon="ti ti-route" label="Create plan" onClose={onClose} />}
      >
        <Drafted note="Targeted at the one open constraint" />
        <div className="row g-3">
          <Field label="Focus">
            <Select
              value={plan.focus}
              onChange={setPlan('focus')}
              options={[
                'Symbolic algebra notation',
                'Whole-class confidence',
                'Exam technique',
                'Reading extension',
              ]}
            />
          </Field>
          <Field label="Duration">
            <Select
              value={plan.duration}
              onChange={setPlan('duration')}
              options={['One term · 8 weeks', 'Half term · 4 weeks', 'Full year']}
            />
          </Field>
          <Field label="Owner">
            <Select
              value={plan.owner}
              onChange={setPlan('owner')}
              options={[
                `${STUDENT.teacher} · class teacher`,
                'Mathematics department',
                'Assigned mentor',
              ]}
            />
          </Field>
          <Field label="Checkpoint">
            <Select
              value={plan.checkpoint}
              onChange={setPlan('checkpoint')}
              options={['Weekly', 'Fortnightly', 'Twice weekly']}
            />
          </Field>
          <Field label="Target">
            <input
              type="text"
              className="form-control"
              value={plan.target}
              onChange={(event) => setPlan('target')(event.target.value)}
            />
          </Field>
          <Field label="Review date">
            <DateField value={plan.review} onChange={setPlan('review')} />
          </Field>
          <Field label="Plan" span="col-12">
            <textarea
              rows={3}
              className="form-control"
              value={plan.plan}
              onChange={(event) => setPlan('plan')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'assign_mentor'}
        onClose={onClose}
        title="Assign Mentor"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Recommendations</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`Mentor assigned, starting ${mentor.start}.`)}
        footer={<Footer icon="ti ti-user-plus" label="Assign mentor" onClose={onClose} />}
      >
        <Drafted
          note={`${PROPOSED_MENTOR?.name ?? 'A peer mentor'} is the closest match on record`}
        />
        <div className="row g-3">
          <Field label="Mentor" span="col-12">
            <Select
              value={mentor.mentor}
              onChange={setMentor('mentor')}
              options={[
                ...COHORT.filter((entry) => entry.name !== STUDENT.name).map(
                  (entry) => `${entry.name} · ${entry.className} · ${entry.note}`,
                ),
                'Staff mentor · Mathematics dept',
              ]}
            />
          </Field>
          <Field label="Focus">
            <Select
              value={mentor.focus}
              onChange={setMentor('focus')}
              options={['Symbolic algebra', 'Study routine', 'Exam confidence', 'General academic']}
            />
          </Field>
          <Field label="Frequency">
            <Select
              value={mentor.frequency}
              onChange={setMentor('frequency')}
              options={['Twice weekly', 'Weekly', 'Fortnightly']}
            />
          </Field>
          <Field label="Start date">
            <DateField value={mentor.start} onChange={setMentor('start')} />
          </Field>
          <Field label="Review after">
            <Select
              value={mentor.review}
              onChange={setMentor('review')}
              options={['Six weeks', 'One term', 'Four weeks']}
            />
          </Field>
          <Field label="Notify" span="col-12">
            <Select
              value={mentor.notify}
              onChange={setMentor('notify')}
              options={['Both students and guardians', 'Students only', 'Teachers only']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'parent_meeting'}
        onClose={onClose}
        title="Schedule Parent Meeting"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Recommendations</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`Meeting scheduled for ${meeting.date} at ${meeting.time}.`)}
        footer={<Footer icon="ti ti-calendar-plus" label="Schedule meeting" onClose={onClose} />}
      >
        <Drafted note={`Guardians not briefed since the ${ATTENDANCE.route} recovery`} />
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
                'Guardian and head of year',
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
        open={active === 'export_intelligence'}
        onClose={onClose}
        title="Export Student Intelligence"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Growth</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`${exportForm.contents} exported as ${exportForm.format}.`)}
        footer={<Footer icon="ti ti-file-export" label="Export intelligence" onClose={onClose} />}
      >
        <Drafted note="Exports carry the reasoning, not only the figures" />
        <div className="row g-3">
          <Field label="Contents">
            <Select
              value={exportForm.contents}
              onChange={setExportForm('contents')}
              options={[
                'Full intelligence record',
                'Findings and recommendations',
                'Journey and growth story',
                'Learning profile only',
              ]}
            />
          </Field>
          <Field label="Format">
            <Select
              value={exportForm.format}
              onChange={setExportForm('format')}
              options={['PDF', 'XLSX', 'CSV', 'Word']}
            />
          </Field>
          <Field label="Include evidence">
            <Select
              value={exportForm.evidence}
              onChange={setExportForm('evidence')}
              options={['Yes, full evidence', 'Yes, summary only', 'No']}
            />
          </Field>
          <Field label="Deliver to">
            <Select
              value={exportForm.deliver}
              onChange={setExportForm('deliver')}
              options={['Download', 'Email to me', 'Email to guardian', 'Student record']}
            />
          </Field>
        </div>
      </Modal>
    </>
  );
};

export default StudentModals;
