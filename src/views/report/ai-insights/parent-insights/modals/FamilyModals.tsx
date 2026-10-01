import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import DateField from '@components/ui/DateField';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { ActionLink } from '@components/workspace';
import type { Family } from '../data/family.data';
import {
  ACTION_REVIEW,
  bandOf,
  FAMILIES,
  FAMILIES_MODELLED,
  FILTERS,
  matchesFilter,
  MEETING_ON,
  monthsSinceMeetingOf,
  NEEDS_SUPPORT,
  PLAN_REVIEW,
  RECOGNITION_MULTIPLE,
  TERMS_ON_RECORD,
} from '../data/family.data';

export type FamilyModalId =
  | 'generate_insights'
  | 'parent_summary'
  | 'schedule_meeting'
  | 'communication_plan'
  | 'appreciation'
  | 'export_family'
  | 'progress_letter'
  | 'compare_families'
  | 'action_plan'
  | 'all_families';

export interface FamilyModalsProps {
  active: FamilyModalId | null;
  onClose: () => void;
  row: Family | null;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  onOpenRow: (row: Family) => void;
  onOpenDialog: (id: FamilyModalId) => void;
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

/** Every dialog opens by naming who it is addressed to. */
const Addressed = ({ to, note }: { to: string; note: string }) => (
  <div className="fam-box mb-3">
    <div className="fam-box-head">
      <h6 className="fs-14 mb-0">
        <span className="fam-to">To</span> {to}
      </h6>
      <span className="fam-chip is-warm">
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

const FamilyModals = ({
  active,
  onClose,
  row,
  onToast,
  onOpenRow,
  onOpenDialog,
}: FamilyModalsProps) => {
  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message, 'success');
    onClose();
  };

  const guardian = row?.guardian ?? 'the guardian';
  const child = row?.student.split(' ')[0] ?? 'your child';
  const surname = row?.guardian.split(' ').slice(-1)[0] ?? 'Family';
  const channel = row?.prefers.split(' · ')[0] ?? 'Email';

  const [insights, setInsights] = useForm(
    {
      scope: `All ${FAMILIES_MODELLED} families`,
      period: 'This term',
      signals: 'All signals',
      floor: 'Report above 85%',
      onDone: 'Hold for review',
    },
    active === 'generate_insights',
  );

  const [summary, setSummary] = useForm(
    {
      recipient: guardian,
      channel: `${channel} · preferred`,
      tone: 'Warm',
      language: 'English',
      draft: `${child} finished every question in this week’s set — the first time this term. His reading continues to be among the strongest in the class. One area we are working on is the notation side of algebra, and we have attached four short practice questions for it.`,
    },
    active === 'parent_summary',
  );

  const [meeting, setMeeting] = useForm(
    {
      date: MEETING_ON,
      time: '5:30 PM',
      mode: 'In person',
      attendees: 'Both guardians and class teacher',
      invite: `${channel} · preferred`,
      agenda:
        'Reading progress, five minutes. The algebra notation gap and the practice set, ten minutes. The STEM scholarship nomination, five minutes.',
    },
    active === 'schedule_meeting',
  );

  const [plan, setPlan] = useForm(
    {
      cadence: 'Fortnightly',
      channel: 'Preferred channel per family',
      opening: 'Always lead with a positive',
      applies: 'This family',
      review: PLAN_REVIEW,
      notes: `Recognition messages are answered ${RECOGNITION_MULTIPLE} times more often than concern-led ones. Where a family has gone quiet, try a second channel before recording it as disengagement.`,
    },
    active === 'communication_plan',
  );

  const [appreciation, setAppreciation] = useForm(
    {
      recipient: guardian,
      occasion: 'Improved homework completion',
      channel: `${channel} · preferred`,
      copyTo: 'Class teacher',
      message: `We wanted you to know that ${child} finished every question in this week’s set, which is the first time this term. Whatever changed at home, it is working.`,
    },
    active === 'appreciation',
  );

  const [exportForm, setExportForm] = useForm(
    {
      contents: 'Full family report',
      format: 'PDF',
      history: 'Yes, full history',
      deliver: 'Download',
    },
    active === 'export_family',
  );

  const [letter, setLetter] = useForm(
    {
      term: 'Term 2 · 2026',
      include: 'One strength and one focus',
      attach: 'Practice questions',
      delivery: `${channel} · preferred`,
      preview: `Dear ${row?.secondGuardian ? `Mr. and Mrs. ${surname}` : guardian}, ${child} has had a strong term. His reading is among the strongest in his class and his attendance has fully recovered. We would like to focus the coming term on one area: the notation side of mathematics.`,
    },
    active === 'progress_letter',
  );

  const [compare, setCompare] = useForm(
    {
      on: 'Engagement profile',
      against: 'Same class',
      period: 'This term',
      show: `Top ${FAMILIES.length} matches`,
    },
    active === 'compare_families',
  );

  const [actionPlan, setActionPlan] = useForm(
    {
      focus: 'Re-establish contact',
      duration: 'One term',
      owner: 'Teena Mathew · class teacher',
      review: 'Fortnightly',
      reviewOn: ACTION_REVIEW,
      plan: 'School: keep leading with progress, offer evening slots only, invite the second guardian to the next meeting. Family: nothing needs to change at home.',
    },
    active === 'action_plan',
  );

  const [filter, setFilter] = useState(FILTERS[0]);

  useEffect(() => {
    if (active === 'all_families') setFilter(FILTERS[0]);
  }, [active]);

  const listed = FAMILIES.filter((entry) => matchesFilter(entry, filter));

  return (
    <>
      <Modal
        open={active === 'generate_insights'}
        onClose={onClose}
        title="Generate Parent Insights"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Insights</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit('Insights queued. Findings are held for review.')}
        footer={<Footer icon="ti ti-sparkles" label="Generate insights" onClose={onClose} />}
      >
        <Addressed
          to={`All ${FAMILIES_MODELLED} families`}
          note={`${TERMS_ON_RECORD} terms of history`}
        />
        <div className="row g-3">
          <Field label="Scope">
            <Select
              value={insights.scope}
              onChange={setInsights('scope')}
              options={[
                `All ${FAMILIES_MODELLED} families`,
                'Families needing attention',
                'One class',
                'This family only',
              ]}
            />
          </Field>
          <Field label="Period">
            <Select
              value={insights.period}
              onChange={setInsights('period')}
              options={['This term', 'This academic year', `Last ${TERMS_ON_RECORD} terms`]}
            />
          </Field>
          <Field label="Signals">
            <Select
              value={insights.signals}
              onChange={setInsights('signals')}
              options={[
                'All signals',
                'Communication only',
                'Meetings and events',
                'Homework support',
              ]}
            />
          </Field>
          <Field label="Confidence floor">
            <Select
              value={insights.floor}
              onChange={setInsights('floor')}
              options={['Report above 85%', 'Report above 90%', 'Report everything']}
            />
          </Field>
          <Field label="On completion" span="col-12">
            <Select
              value={insights.onDone}
              onChange={setInsights('onDone')}
              options={['Hold for review', 'Draft communications too', 'Notify class teachers']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'parent_summary'}
        onClose={onClose}
        title="Generate Parent Summary"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Communication</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Summary drafted for ${summary.recipient}, held for approval.`)}
        footer={<Footer icon="ti ti-mail-star" label="Send summary" onClose={onClose} />}
      >
        <Addressed to={guardian} note="Opens with something specific" />
        <div className="row g-3">
          <Field label="Recipient">
            <Select
              value={summary.recipient}
              onChange={setSummary('recipient')}
              options={[guardian, 'Both guardians', 'Second guardian only']}
            />
          </Field>
          <Field label="Channel">
            <Select
              value={summary.channel}
              onChange={setSummary('channel')}
              options={[`${channel} · preferred`, 'Email', 'Phone call', 'Printed note']}
            />
          </Field>
          <Field label="Tone">
            <Select
              value={summary.tone}
              onChange={setSummary('tone')}
              options={['Warm', 'Direct and brief', 'Formal']}
            />
          </Field>
          <Field label="Language">
            <Select
              value={summary.language}
              onChange={setSummary('language')}
              options={['English', 'Hindi', 'Tamil', 'Malayalam']}
            />
          </Field>
          <Field label="Draft" span="col-12">
            <textarea
              rows={4}
              className="form-control"
              value={summary.draft}
              onChange={(event) => setSummary('draft')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'schedule_meeting'}
        onClose={onClose}
        title="Schedule Parent Meeting"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Communication</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Meeting scheduled for ${meeting.date} at ${meeting.time}.`)}
        footer={<Footer icon="ti ti-calendar-plus" label="Schedule meeting" onClose={onClose} />}
      >
        <Addressed to={guardian} note="Evening slot — mornings are what families miss" />
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
                'Both guardians and class teacher',
                'Primary guardian and teacher',
                'Guardians, teacher and counsellor',
              ]}
            />
          </Field>
          <Field label="Send invitation by" span="col-12">
            <Select
              value={meeting.invite}
              onChange={setMeeting('invite')}
              options={[`${channel} · preferred`, 'Email', 'Both']}
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
        open={active === 'communication_plan'}
        onClose={onClose}
        title="Create Communication Plan"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Communication</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Communication plan opened, reviewed ${plan.review}.`)}
        footer={<Footer icon="ti ti-route" label="Create plan" onClose={onClose} />}
      >
        <Addressed to={plan.applies} note={`${NEEDS_SUPPORT} families have gone quiet`} />
        <div className="row g-3">
          <Field label="Cadence">
            <Select
              value={plan.cadence}
              onChange={setPlan('cadence')}
              options={['Fortnightly', 'Weekly', 'Monthly', 'Event driven']}
            />
          </Field>
          <Field label="Channel">
            <Select
              value={plan.channel}
              onChange={setPlan('channel')}
              options={[
                'Preferred channel per family',
                'One channel for all',
                'Two channels always',
              ]}
            />
          </Field>
          <Field label="Opening">
            <Select
              value={plan.opening}
              onChange={setPlan('opening')}
              options={['Always lead with a positive', 'Neutral', 'Concern first']}
            />
          </Field>
          <Field label="Applies to">
            <Select
              value={plan.applies}
              onChange={setPlan('applies')}
              options={[
                'This family',
                'Families needing attention',
                `All ${FAMILIES_MODELLED} families`,
              ]}
            />
          </Field>
          <Field label="Review date">
            <DateField value={plan.review} onChange={setPlan('review')} />
          </Field>
          <Field label="Notes" span="col-12">
            <textarea
              rows={3}
              className="form-control"
              value={plan.notes}
              onChange={(event) => setPlan('notes')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'appreciation'}
        onClose={onClose}
        title="Send Appreciation Message"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Communication</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Appreciation message drafted for ${appreciation.recipient}.`)}
        footer={<Footer icon="ti ti-confetti" label="Send message" onClose={onClose} />}
      >
        <Addressed
          to={guardian}
          note={`Answered ${RECOGNITION_MULTIPLE}x more often than a concern`}
        />
        <div className="row g-3">
          <Field label="Recipient">
            <Select
              value={appreciation.recipient}
              onChange={setAppreciation('recipient')}
              options={[guardian, 'Both guardians', 'All families of improved students']}
            />
          </Field>
          <Field label="Occasion">
            <Select
              value={appreciation.occasion}
              onChange={setAppreciation('occasion')}
              options={[
                'Improved homework completion',
                'Attendance recovery',
                'Science exhibition placing',
                'General progress',
              ]}
            />
          </Field>
          <Field label="Channel">
            <Select
              value={appreciation.channel}
              onChange={setAppreciation('channel')}
              options={[`${channel} · preferred`, 'Email', 'Printed certificate']}
            />
          </Field>
          <Field label="Copy to">
            <Select
              value={appreciation.copyTo}
              onChange={setAppreciation('copyTo')}
              options={['Class teacher', 'Class teacher and head of year', 'No one']}
            />
          </Field>
          <Field label="Message" span="col-12">
            <textarea
              rows={4}
              className="form-control"
              value={appreciation.message}
              onChange={(event) => setAppreciation('message')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'export_family'}
        onClose={onClose}
        title="Export Family Report"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Insights</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`${exportForm.contents} exported as ${exportForm.format}.`)}
        footer={<Footer icon="ti ti-file-export" label="Export report" onClose={onClose} />}
      >
        <Addressed to="Whoever you send it to" note="Carries the reasoning too" />
        <div className="row g-3">
          <Field label="Contents">
            <Select
              value={exportForm.contents}
              onChange={setExportForm('contents')}
              options={[
                'Full family report',
                'This family only',
                'Families needing attention',
                'Engagement summary',
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
          <Field label="Include communication history">
            <Select
              value={exportForm.history}
              onChange={setExportForm('history')}
              options={['Yes, full history', 'Yes, summary only', 'No']}
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
        open={active === 'progress_letter'}
        onClose={onClose}
        title="Generate Student Progress Letter"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Communication</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Progress letter drafted for the ${surname} family.`)}
        footer={<Footer icon="ti ti-file-text" label="Generate letter" onClose={onClose} />}
      >
        <Addressed to={row?.secondGuardian ? 'Both guardians' : guardian} note="One strength, one focus" />
        <div className="row g-3">
          <Field label="Term">
            <Select
              value={letter.term}
              onChange={setLetter('term')}
              options={['Term 2 · 2026', 'Term 1 · 2026', 'Full year']}
            />
          </Field>
          <Field label="Include">
            <Select
              value={letter.include}
              onChange={setLetter('include')}
              options={['One strength and one focus', 'Full subject breakdown', 'Focus area only']}
            />
          </Field>
          <Field label="Attach">
            <Select
              value={letter.attach}
              onChange={setLetter('attach')}
              options={['Practice questions', 'Guidance sheet', 'Nothing']}
            />
          </Field>
          <Field label="Delivery">
            <Select
              value={letter.delivery}
              onChange={setLetter('delivery')}
              options={[`${channel} · preferred`, 'Email', 'Printed letter', 'Parent portal']}
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
        open={active === 'compare_families'}
        onClose={onClose}
        title="Compare Family Engagement"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Insights</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit('Matched families opened for comparison.')}
        footer={<Footer icon="ti ti-git-compare" label="Compare" onClose={onClose} />}
      >
        <Addressed to="Comparison view" note={`Against ${FAMILIES_MODELLED} families`} />
        <div className="row g-3">
          <Field label="Compare on">
            <Select
              value={compare.on}
              onChange={setCompare('on')}
              options={[
                'Engagement profile',
                'Communication channel',
                'Meeting attendance',
                'Homework support',
              ]}
            />
          </Field>
          <Field label="Against">
            <Select
              value={compare.against}
              onChange={setCompare('against')}
              options={[
                'Same class',
                'Same year group',
                `All ${FAMILIES_MODELLED} families`,
                'Families needing attention',
              ]}
            />
          </Field>
          <Field label="Period">
            <Select
              value={compare.period}
              onChange={setCompare('period')}
              options={['This term', 'This year', `All ${TERMS_ON_RECORD} terms`]}
            />
          </Field>
          <Field label="Show">
            <Select
              value={compare.show}
              onChange={setCompare('show')}
              options={[`Top ${FAMILIES.length} matches`, 'Top 15 matches', 'All matches']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'action_plan'}
        onClose={onClose}
        title="Create Family Action Plan"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Partnership</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Action plan opened, reviewed ${actionPlan.reviewOn}.`)}
        footer={<Footer icon="ti ti-clipboard-check" label="Create plan" onClose={onClose} />}
      >
        <Addressed to={guardian} note="What the school will do, and what the family can" />
        <div className="row g-3">
          <Field label="Focus">
            <Select
              value={actionPlan.focus}
              onChange={setActionPlan('focus')}
              options={[
                'Re-establish contact',
                'Homework support at home',
                'Meeting attendance',
                'Counselling referral',
              ]}
            />
          </Field>
          <Field label="Duration">
            <Select
              value={actionPlan.duration}
              onChange={setActionPlan('duration')}
              options={['One term', 'Half term', 'Six weeks']}
            />
          </Field>
          <Field label="Owner">
            <Select
              value={actionPlan.owner}
              onChange={setActionPlan('owner')}
              options={['Teena Mathew · class teacher', 'Head of year', 'School counsellor']}
            />
          </Field>
          <Field label="Review">
            <Select
              value={actionPlan.review}
              onChange={setActionPlan('review')}
              options={['Fortnightly', 'Monthly', 'End of term']}
            />
          </Field>
          <Field label="Review date">
            <DateField value={actionPlan.reviewOn} onChange={setActionPlan('reviewOn')} />
          </Field>
          <Field label="Plan" span="col-12">
            <textarea
              rows={3}
              className="form-control"
              value={actionPlan.plan}
              onChange={(event) => setActionPlan('plan')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'all_families'}
        onClose={onClose}
        title="All Families"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Workspace</span>}
        dialogClassName="modal-dialog-centered modal-xl"
        footer={
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 w-100">
            <span className="fs-13 text-muted">
              Showing <span className="fw-medium text-dark">{listed.length}</span> of{' '}
              <span className="fw-medium text-dark">{FAMILIES_MODELLED}</span> families ·{' '}
              {NEEDS_SUPPORT} need someone to reach out
            </span>
            <ActionLink
              className="btn btn-outline-light bg-white d-inline-flex align-items-center"
              onClick={() => onOpenDialog('export_family')}
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
              aria-label="Filter families"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              {FILTERS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-nowrap mb-0">
            <thead className="thead-light">
              <tr>
                <th>Guardian</th>
                <th>Student</th>
                <th>Engagement</th>
                <th>Score</th>
                <th>Prefers</th>
                <th>Channels tried</th>
                <th>Last meeting</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {listed.map((entry) => {
                const band = bandOf(entry.score);
                const months = monthsSinceMeetingOf(entry);
                return (
                  <tr key={entry.id}>
                    <td>
                      <span className="d-inline-flex align-items-center gap-2">
                        <span className="avatar avatar-xs avatar-rounded flex-shrink-0">
                          <ImageWithBasePath src={entry.guardianImage} alt={entry.guardian} />
                        </span>
                        <span className="fs-13 text-dark">{entry.guardian}</span>
                      </span>
                    </td>
                    <td>
                      <span className="fs-13 text-muted">
                        {entry.student} · {entry.className.replace('Class ', '')}
                      </span>
                    </td>
                    <td>
                      <span className={`fam-chip ${band.tone}`}>{band.band}</span>
                    </td>
                    <td>
                      <span className="fs-13 fw-medium text-dark">{entry.score}</span>
                    </td>
                    <td>
                      <span className="fs-13 text-muted">{entry.prefers}</span>
                    </td>
                    <td>
                      <span className="fs-13 text-muted">
                        {entry.channelsTried.length}
                        {entry.channelsTried.length === 1 ? ' · one only' : ''}
                      </span>
                    </td>
                    <td>
                      <span className="fs-13 text-muted">
                        {entry.lastMeetingOn}
                        {months >= 3 ? ` · ${months} months` : ''}
                      </span>
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
                    No family matches that filter.
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

export default FamilyModals;
