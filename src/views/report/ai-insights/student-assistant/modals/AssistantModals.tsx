import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import DateField from '@components/ui/DateField';
import { ActionLink } from '@components/workspace';
import {
  BLOCKS,
  DAYS_TO_EXAM,
  EXAM_ON,
  GOAL_TARGET,
  GOALS,
  MINUTES_LEFT,
  timeLeftLabel,
  WEEK_STARTS,
} from '../data/assistant.data';

export type AssistantModalId =
  | 'study_plan'
  | 'weekly_plan'
  | 'exam_strategy'
  | 'create_goal'
  | 'practice_questions'
  | 'roadmap'
  | 'export_summary'
  | 'compare_progress';

export interface AssistantModalsProps {
  active: AssistantModalId | null;
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

/** Each dialog opens with what the assistant already knows. */
const Says = ({ text }: { text: string }) => <p className="lrn-say mb-3">{text}</p>;

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

const AssistantModals = ({ active, onClose, onToast }: AssistantModalsProps) => {
  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message, 'success');
    onClose();
  };

  const firstUndone = BLOCKS.find((block) => !block.done);

  const [plan, setPlan] = useForm(
    {
      forDay: 'Today',
      time: `About ${Math.round(MINUTES_LEFT / 60)} hours`,
      focus: 'What needs it most · algebra',
      startAt: `${firstUndone?.at ?? '15:45'} · after school`,
      breaks: 'Yes, every 25 minutes',
    },
    active === 'study_plan',
  );

  const [weekly, setWeekly] = useForm(
    {
      week: `Monday ${WEEK_STARTS.split(' ').slice(0, 2).join(' ')}`,
      hours: '1 to 2 hours',
      weekend: 'One short session',
      priority: 'Algebra and comprehension',
      protect: 'Wednesday · busiest day',
    },
    active === 'weekly_plan',
  );

  const [exam, setExam] = useForm(
    {
      period: `Term 2 exams · ${EXAM_ON.split(' ').slice(0, 2).join(' ')}`,
      approach: 'Recover the most marks',
      daily: '45 minutes',
      include: 'Past papers and timing',
      rest: 'One a week',
    },
    active === 'exam_strategy',
  );

  const [goal, setGoal] = useForm(
    {
      goal: GOALS[0].title,
      type: 'Academic',
      target: GOAL_TARGET,
      milestones: 'Let the assistant set them',
      remind: 'Weekly',
      share: 'Only me',
    },
    active === 'create_goal',
  );

  const [practice, setPractice] = useForm(
    {
      topic: 'Substitution · second step',
      count: '4',
      difficulty: 'Matched to me',
      format: 'Worked example, then practice',
      timing: 'Untimed',
    },
    active === 'practice_questions',
  );

  const [roadmap, setRoadmap] = useForm(
    {
      horizon: 'This term',
      builtAround: 'My strengths',
      direction: 'Laboratory and design',
      include: 'Goals, skills and opportunities',
      review: 'Every term',
    },
    active === 'roadmap',
  );

  const [exportForm, setExportForm] = useForm(
    {
      contents: 'Everything',
      format: 'PDF',
      include: 'Progress and goals',
      share: 'Nobody · download only',
    },
    active === 'export_summary',
  );

  const [compare, setCompare] = useForm(
    {
      compare: 'This term against last',
      subject: 'All subjects',
      show: 'Progress and habits',
      include: 'What changed and why',
    },
    active === 'compare_progress',
  );

  return (
    <>
      <Modal
        open={active === 'study_plan'}
        onClose={onClose}
        title="Generate Study Plan"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Plan</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit('Your plan is built. The hard part is first.')}
        footer={<Footer icon="ti ti-calendar-plus" label="Build my plan" onClose={onClose} />}
      >
        <Says
          text={`You have about ${timeLeftLabel()} left today. The plan puts the hard work where you concentrate best rather than filling every minute.`}
        />
        <div className="row g-3">
          <Field label="For">
            <Select
              value={plan.forDay}
              onChange={setPlan('forDay')}
              options={['Today', 'Tomorrow', 'The rest of this week']}
            />
          </Field>
          <Field label="Time available">
            <Select
              value={plan.time}
              onChange={setPlan('time')}
              options={[
                `About ${Math.round(MINUTES_LEFT / 60)} hours`,
                'About 1 hour',
                '30 minutes',
                'As long as it takes',
              ]}
            />
          </Field>
          <Field label="Focus on">
            <Select
              value={plan.focus}
              onChange={setPlan('focus')}
              options={[
                'What needs it most · algebra',
                'What is due soonest',
                'An even spread',
                'Let me choose',
              ]}
            />
          </Field>
          <Field label="Start at">
            <Select
              value={plan.startAt}
              onChange={setPlan('startAt')}
              options={[`${firstUndone?.at ?? '15:45'} · after school`, '16:30', '18:00']}
            />
          </Field>
          <Field label="Include breaks" span="col-12">
            <Select
              value={plan.breaks}
              onChange={setPlan('breaks')}
              options={['Yes, every 25 minutes', 'Yes, every 45 minutes', 'No breaks']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'weekly_plan'}
        onClose={onClose}
        title="Create Weekly Plan"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Plan</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit('Weekly plan created, weighted to what you actually need.')}
        footer={<Footer icon="ti ti-calendar-week" label="Create weekly plan" onClose={onClose} />}
      >
        <Says text="Wednesday is your lightest day, so the plan keeps it clear in case something slips." />
        <div className="row g-3">
          <Field label="Week starting">
            <Select
              value={weekly.week}
              onChange={setWeekly('week')}
              options={[
                `Monday ${WEEK_STARTS.split(' ').slice(0, 2).join(' ')}`,
                'Monday 10 Aug',
                'Monday 17 Aug',
              ]}
            />
          </Field>
          <Field label="Hours per weekday">
            <Select
              value={weekly.hours}
              onChange={setWeekly('hours')}
              options={['1 to 2 hours', 'Under 1 hour', '2 to 3 hours']}
            />
          </Field>
          <Field label="Weekend">
            <Select
              value={weekly.weekend}
              onChange={setWeekly('weekend')}
              options={['One short session', 'Both days', 'Keep it free']}
            />
          </Field>
          <Field label="Priority">
            <Select
              value={weekly.priority}
              onChange={setWeekly('priority')}
              options={['Algebra and comprehension', 'Exam subjects only', 'Even across everything']}
            />
          </Field>
          <Field label="Protect" span="col-12">
            <Select
              value={weekly.protect}
              onChange={setWeekly('protect')}
              options={['Wednesday · busiest day', 'Friday evening', 'Nothing']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'exam_strategy'}
        onClose={onClose}
        title="Generate Exam Strategy"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Exams</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Exam plan built across the ${DAYS_TO_EXAM} days you have.`)}
        footer={<Footer icon="ti ti-file-certificate" label="Build exam plan" onClose={onClose} />}
      >
        <Says
          text={`${DAYS_TO_EXAM} days until the first paper. Algebra carries the most marks you can still recover, so the plan starts there.`}
        />
        <div className="row g-3">
          <Field label="Exam period">
            <Select
              value={exam.period}
              onChange={setExam('period')}
              options={[
                `Term 2 exams · ${EXAM_ON.split(' ').slice(0, 2).join(' ')}`,
                'Mock exams',
                'End of year',
              ]}
            />
          </Field>
          <Field label="Approach">
            <Select
              value={exam.approach}
              onChange={setExam('approach')}
              options={['Recover the most marks', 'Even coverage', 'Strengthen what is strong']}
            />
          </Field>
          <Field label="Daily revision">
            <Select
              value={exam.daily}
              onChange={setExam('daily')}
              options={['45 minutes', '30 minutes', '1 hour']}
            />
          </Field>
          <Field label="Include">
            <Select
              value={exam.include}
              onChange={setExam('include')}
              options={['Past papers and timing', 'Topic revision only', 'Both plus a mock']}
            />
          </Field>
          <Field label="Rest days" span="col-12">
            <Select
              value={exam.rest}
              onChange={setExam('rest')}
              options={['One a week', 'Two a week', 'None']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'create_goal'}
        onClose={onClose}
        title="Create Learning Goal"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Goals</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Goal set, target ${goal.target}. Shared with: ${goal.share.toLowerCase()}.`)}
        footer={<Footer icon="ti ti-flag" label="Create goal" onClose={onClose} />}
      >
        <Says text="Goals are yours by default. Nobody sees one unless you choose to share it." />
        <div className="row g-3">
          <Field label="Goal" span="col-12">
            <input
              type="text"
              className="form-control"
              value={goal.goal}
              onChange={(event) => setGoal('goal')(event.target.value)}
            />
          </Field>
          <Field label="Type">
            <Select
              value={goal.type}
              onChange={setGoal('type')}
              options={['Academic', 'Attendance', 'Skill', 'Reading', 'Assignment', 'Personal growth']}
            />
          </Field>
          <Field label="Target date">
            <DateField value={goal.target} onChange={setGoal('target')} />
          </Field>
          <Field label="Milestones">
            <Select
              value={goal.milestones}
              onChange={setGoal('milestones')}
              options={['Let the assistant set them', 'I will set my own', 'Five evenly spaced']}
            />
          </Field>
          <Field label="Remind me">
            <Select
              value={goal.remind}
              onChange={setGoal('remind')}
              options={['Weekly', 'Daily', 'Only when I fall behind']}
            />
          </Field>
          <Field label="Share with" span="col-12">
            <Select
              value={goal.share}
              onChange={setGoal('share')}
              options={['Only me', 'My class teacher', 'My teacher and guardians']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'practice_questions'}
        onClose={onClose}
        title="Generate Practice Questions"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Practice</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`${practice.count} questions ready on ${practice.topic.toLowerCase()}.`)}
        footer={<Footer icon="ti ti-math-symbols" label="Generate questions" onClose={onClose} />}
      >
        <Says text="Four questions on the one step where your working stops. Nothing else in the set." />
        <div className="row g-3">
          <Field label="Topic">
            <Select
              value={practice.topic}
              onChange={setPractice('topic')}
              options={[
                'Substitution · second step',
                'Simultaneous equations',
                'Word problems',
                'Mixed revision',
              ]}
            />
          </Field>
          <Field label="How many">
            <input
              type="text"
              className="form-control"
              value={practice.count}
              onChange={(event) => setPractice('count')(event.target.value)}
            />
          </Field>
          <Field label="Difficulty">
            <Select
              value={practice.difficulty}
              onChange={setPractice('difficulty')}
              options={['Matched to me', 'A little easier', 'A little harder', 'Building up']}
            />
          </Field>
          <Field label="Format">
            <Select
              value={practice.format}
              onChange={setPractice('format')}
              options={['Worked example, then practice', 'Practice only', 'With answers to check']}
            />
          </Field>
          <Field label="Timing" span="col-12">
            <Select
              value={practice.timing}
              onChange={setPractice('timing')}
              options={['Untimed', 'Timed · exam conditions']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'roadmap'}
        onClose={onClose}
        title="Build Learning Roadmap"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Roadmap</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Roadmap built for ${roadmap.horizon.toLowerCase()}.`)}
        footer={<Footer icon="ti ti-route" label="Build roadmap" onClose={onClose} />}
      >
        <Says text="Built from what you are already good at rather than from a list everyone gets." />
        <div className="row g-3">
          <Field label="Horizon">
            <Select
              value={roadmap.horizon}
              onChange={setRoadmap('horizon')}
              options={['This term', 'This academic year', 'Two years']}
            />
          </Field>
          <Field label="Built around">
            <Select
              value={roadmap.builtAround}
              onChange={setRoadmap('builtAround')}
              options={['My strengths', 'My weakest areas', 'A career direction', 'A balance']}
            />
          </Field>
          <Field label="Direction">
            <Select
              value={roadmap.direction}
              onChange={setRoadmap('direction')}
              options={['Laboratory and design', 'Not sure yet', 'Something else']}
            />
          </Field>
          <Field label="Include">
            <Select
              value={roadmap.include}
              onChange={setRoadmap('include')}
              options={['Goals, skills and opportunities', 'Academic goals only', 'Everything']}
            />
          </Field>
          <Field label="Review" span="col-12">
            <Select
              value={roadmap.review}
              onChange={setRoadmap('review')}
              options={['Every term', 'Twice a term', 'Once a year']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'export_summary'}
        onClose={onClose}
        title="Export Learning Summary"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Export</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Summary exported as ${exportForm.format}.`)}
        footer={<Footer icon="ti ti-file-export" label="Export summary" onClose={onClose} />}
      >
        <Says text="This is your record. It goes nowhere unless you choose to send it." />
        <div className="row g-3">
          <Field label="Contents">
            <Select
              value={exportForm.contents}
              onChange={setExportForm('contents')}
              options={['Everything', 'Goals and progress', 'This term only', 'One subject']}
            />
          </Field>
          <Field label="Format">
            <Select
              value={exportForm.format}
              onChange={setExportForm('format')}
              options={['PDF', 'Printable page', 'Email to me']}
            />
          </Field>
          <Field label="Include">
            <Select
              value={exportForm.include}
              onChange={setExportForm('include')}
              options={['Progress and goals', 'Progress, goals and plan', 'Achievements only']}
            />
          </Field>
          <Field label="Share with">
            <Select
              value={exportForm.share}
              onChange={setExportForm('share')}
              options={['Nobody · download only', 'My guardians', 'My class teacher']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'compare_progress'}
        onClose={onClose}
        title="Compare Learning Progress"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Review</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit('Comparison ready — honestly, including what slipped.')}
        footer={<Footer icon="ti ti-git-compare" label="Compare" onClose={onClose} />}
      >
        <Says text="This shows what went backwards as well as what went forwards." />
        <div className="row g-3">
          <Field label="Compare">
            <Select
              value={compare.compare}
              onChange={setCompare('compare')}
              options={[
                'This term against last',
                'This month against last',
                'Across the whole year',
              ]}
            />
          </Field>
          <Field label="Subject">
            <Select
              value={compare.subject}
              onChange={setCompare('subject')}
              options={['All subjects', 'Mathematics', 'Science', 'English']}
            />
          </Field>
          <Field label="Show">
            <Select
              value={compare.show}
              onChange={setCompare('show')}
              options={['Progress and habits', 'Progress only', 'Habits only']}
            />
          </Field>
          <Field label="Include">
            <Select
              value={compare.include}
              onChange={setCompare('include')}
              options={['What changed and why', 'Figures only']}
            />
          </Field>
        </div>
      </Modal>
    </>
  );
};

export default AssistantModals;
