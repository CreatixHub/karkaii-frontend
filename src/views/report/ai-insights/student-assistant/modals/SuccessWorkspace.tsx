import { useEffect, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import { ActionLink } from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import {
  AVERAGE_SESSION,
  COHORT_SIZE,
  COHORT_WITH_GAP,
  CONFIDENCE,
  CONFIDENCE_MEAN,
  DAYS_TO_EXAM,
  GOALS,
  LONGEST_SESSION,
  MISSION,
  MISSION_DONE,
  MISSION_STEPS,
  PEERS,
  progressLabel,
  SESSIONS_THIS_WEEK,
  storyBeats,
  STORY_DONE,
  STORY,
  STREAK,
  STUDENT,
  SUBJECTS,
  timeLeftLabel,
} from '../data/assistant.data';

const STAGES = [
  { n: '01', name: 'Discover' },
  { n: '02', name: 'Learn' },
  { n: '03', name: 'Practice' },
  { n: '04', name: 'Review' },
  { n: '05', name: 'Achieve' },
] as const;

type StageName = (typeof STAGES)[number]['name'];

export interface SuccessWorkspaceProps {
  open: boolean;
  onClose: () => void;
  onOpenDialog: (id: string) => void;
}

const Box = ({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
}) => (
  <div className="lrn-box">
    <div className="lrn-box-head">
      <h6 className="fs-15 mb-0">{title}</h6>
      {badge ? <span className="lrn-chip is-ai">{badge}</span> : null}
    </div>
    <div className="lrn-box-body">{children}</div>
  </div>
);

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="lrn-row">
    <span>{label}</span>
    <b>{value}</b>
  </div>
);

const SuccessWorkspace = ({ open, onClose, onOpenDialog }: SuccessWorkspaceProps) => {
  const [stage, setStage] = useState<StageName>('Discover');

  useEffect(() => {
    if (open) setStage('Discover');
  }, [open]);

  if (!open) return null;

  return (
    <Offcanvas
      open={open}
      onClose={onClose}
      title={`${MISSION.focus} · today's mission`}
      className="lrn-ws"
      labelledById="success_workspace_label"
      header={
        <div className="lrn-ws-head">
          <span className="lrn-frame">
            <ImageWithBasePath src={STUDENT.image} alt={STUDENT.name} />
          </span>
          <div>
            <h3 className="mb-1 fs-16 fw-medium" id="success_workspace_label">
              {MISSION.focus}
            </h3>
            <p className="fs-12 text-muted mb-2">
              {STUDENT.name} · {STUDENT.className} · Today’s mission, step {MISSION_DONE + 1} of{' '}
              {MISSION_STEPS}
            </p>
            <div className="d-flex flex-wrap gap-2">
              <span className="lrn-chip is-hot">Priority today</span>
              <span className="lrn-chip is-ai">
                <i className="ti ti-sparkles" />
                {CONFIDENCE[0].value}% confidence
              </span>
              <span className="lrn-chip is-now">About {timeLeftLabel()} left</span>
            </div>
          </div>
          <button
            type="button"
            className="btn-close custom-btn-close ms-auto"
            aria-label="Close"
            onClick={onClose}
          >
            <i className="ti ti-x" />
          </button>
        </div>
      }
      beforeBody={
        <ul className="lrn-quest nav" role="tablist">
          {STAGES.map((entry) => (
            <li role="presentation" key={entry.n}>
              <button
                type="button"
                role="tab"
                aria-selected={stage === entry.name}
                className={`lrn-questbtn ${stage === entry.name ? 'active' : ''}`.trim()}
                onClick={() => setStage(entry.name)}
              >
                <span className="lrn-questbtn-n">{entry.n}</span>
                <span className="lrn-questbtn-txt">
                  <span>Stage {entry.n}</span>
                  <span>{entry.name}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      }
      footer={
        <div className="offcanvas-footer">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <p className="fs-12 text-muted mb-0">
              <i className="ti ti-info-circle me-1" />
              This is your workspace. Your teacher sees your submitted work, not your practice
              attempts or how long anything took you.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenDialog('export_summary')}
              >
                <i className="ti ti-file-export me-1" />
                Export
              </ActionLink>
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenDialog('create_goal')}
              >
                <i className="ti ti-flag me-1" />
                Set a Goal
              </ActionLink>
              <ActionLink
                className="btn btn-primary d-inline-flex align-items-center"
                onClick={() => onOpenDialog('practice_questions')}
              >
                <i className="ti ti-player-play me-1" />
                Start Practice
              </ActionLink>
            </div>
          </div>
        </div>
      }
    >
      {stage === 'Discover' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-4">
            <Box title="Where you are" badge="Priority">
              <Row label="Subject" value="Mathematics" />
              <Row label="Topic" value="Substitution" />
              <Row label="Current band" value="Band D" />
              <Row label="Target band" value="Band B" />
              <Row label="Set completion" value="6 of 9" />
              <Row label="Time left today" value={timeLeftLabel()} />
            </Box>
          </div>
          <div className="col-12 col-xl-4">
            <Box title="Why it matters">
              <Row label="Marks available" value="+12" />
              <Row label="Exam weight" value="High" />
              <Row label="Days to exam" value={DAYS_TO_EXAM} />
              <Row label="Other subjects affected" value="None" />
              <Row label="Effort needed" value="About 20 min a day" />
            </Box>
          </div>
          <div className="col-12 col-xl-4">
            <Box title="What you need" badge="All ready">
              <Row label="Practice questions" value="4, ready" />
              <Row label="Worked example" value="Attached" />
              <Row label="Video walkthrough" value="8 min" />
              <Row label="Study partner" value={PEERS[0].name} />
              <Row label="Quiet time" value="20 min before 5pm" />
            </Box>
          </div>
        </div>
      ) : null}

      {stage === 'Learn' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Box title="Learning profile">
                <Row label="Learns best from" value="Worked examples" />
                <Row label="Weakest format" value="Dense text" />
                <Row label="Retention at 8 weeks" value="Exceptional" />
                <Row label="Best time of day" value="Before 5pm" />
                <Row label="Group size" value="Four or fewer" />
              </Box>
            </div>
            <div className="mb-4">
              <Box title="Study behaviour" badge="Strong">
                <Row label="Study streak" value={`${STREAK} days`} />
                <Row label="Average session" value={`${AVERAGE_SESSION} min`} />
                <Row label="Sessions this week" value={SESSIONS_THIS_WEEK} />
                <Row label="Longest session" value={`${LONGEST_SESSION} min`} />
                <Row label="Skipped days" value="None in three weeks" />
              </Box>
            </div>
            <Box title="Subject focus">
              {SUBJECTS.map((subject) => (
                <Row key={subject.label} label={subject.label} value={`Band ${subject.band}`} />
              ))}
            </Box>
          </div>
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Box title="Assignment progress">
                <Row label="Submitted on time" value="94%" />
                <Row label="Submitted early" value="12 this term" />
                <Row label="Outstanding" value="1 · English" />
                <Row label="Late items" value="4, all long sets" />
                <Row label="Missed entirely" value="None" />
              </Box>
            </div>
            <Box title="How sure the assistant is" badge={`Mean ${CONFIDENCE_MEAN}%`}>
              {CONFIDENCE.map((entry) => (
                <Row key={entry.label} label={entry.label} value={`${entry.value}%`} />
              ))}
            </Box>
          </div>
        </div>
      ) : null}

      {stage === 'Practice' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Box title="Practice activities" badge="4 set">
                <Row label="Substitution set" value="4 questions · 20 min" />
                <Row label="Half algebra paper" value="Timed · 25 min" />
                <Row label="Extension reading" value="1 chapter · 20 min" />
                <Row label="Science light pass" value="Notes only · 10 min" />
              </Box>
            </div>
            <div className="mb-4">
              <Box title="Revision topics">
                <Row label="Substitution" value="Priority" />
                <Row label="Simultaneous equations" value="Next" />
                <Row label="Photosynthesis" value="Light pass" />
                <Row label="Forces" value="Light pass" />
              </Box>
            </div>
            <Box title="Learning resources">
              <Row label="Substitution video" value="8 min" />
              <Row label="Layout sheet" value="1 page" />
              <Row label="Practice set" value="4 questions" />
              <Row label="Extension reading" value="12 titles" />
            </Box>
          </div>
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Box title="What the assistant suggests">
                <p className="lrn-say mb-3">
                  Do the substitution set first, while you are freshest. Everything else today is
                  lighter.
                </p>
                <p className="lrn-say mb-3">
                  Write one line of reasoning before each answer. It is worth six marks you are
                  currently losing.
                </p>
                <p className="lrn-say mb-0">
                  {PEERS[0].name} cleared this exact gap last term. Ask him rather than starting
                  from scratch.
                </p>
              </Box>
            </div>
            <Box title="Learners like you">
              {PEERS.map((peer) => (
                <Row
                  key={peer.name}
                  label={`${peer.name} · ${peer.className}`}
                  value={peer.note}
                />
              ))}
              <Row
                label="Students with this gap"
                value={`${COHORT_WITH_GAP} of ${COHORT_SIZE}`}
              />
            </Box>
          </div>
        </div>
      ) : null}

      {stage === 'Review' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Box title="Progress review" badge="Improving">
                <Row label="Set completion" value="67% to 94%" />
                <Row label="Band movement" value="D to C+" />
                <Row label="Weeks on the goal" value="4 of 8" />
                <Row label="On track" value="Yes" />
              </Box>
            </div>
            <Box title="Still to work on">
              <Row label="Second substitution" value="Main gap" />
              <Row label="Reasoning sentences" value="6 marks" />
              <Row label="Presentation" value="3 marks" />
              <Row label="Long-set timing" value="Start earlier" />
            </Box>
          </div>
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Box title="Feedback from your teacher">
                <p className="lrn-say mb-2">
                  “Concept is secure across the whole set — every question was set up correctly. The
                  marks went on three unfinished questions and on layout, not on understanding.”
                </p>
                <p className="fs-12 text-muted mb-0">— Ms. Mathew</p>
              </Box>
            </div>
            <Box title="Your week" badge="Good week">
              <Row
                label="Sessions completed"
                value={`${SESSIONS_THIS_WEEK} of ${SESSIONS_THIS_WEEK}`}
              />
              <Row label="Practice questions done" value="34" />
              <Row label="Homework submitted" value="2 of 3" />
              <Row label="Reading time" value="1 hr 20 min" />
              <Row label="Streak kept" value="Yes" />
            </Box>
          </div>
        </div>
      ) : null}

      {stage === 'Achieve' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-7">
            <Box title="Achievement timeline" badge={`${STORY_DONE} of ${STORY.length} done`}>
              {storyBeats().map((beat) => (
                <div className={`lrn-beat ${beat.done ? 'is-done' : ''}`.trim()} key={beat.id}>
                  <span className="lrn-beat-ic">
                    <i className={beat.icon} />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="lrn-beat-title">{beat.title}</p>
                    <p className="fs-12 text-muted mb-1">{beat.on}</p>
                    <p className="fs-13 text-muted mb-0">{beat.note}</p>
                  </div>
                </div>
              ))}
            </Box>
          </div>
          <div className="col-12 col-xl-5">
            <div className="mb-4">
              <Box title="Goal completion">
                {GOALS.slice(0, 4).map((goal) => (
                  <Row key={goal.id} label={goal.title} value={progressLabel(goal)} />
                ))}
              </Box>
            </div>
            <div className="mb-4">
              <Box title="Learning growth" badge="Up">
                <Row label="Percentile" value="+16 over 4 terms" />
                <Row label="Homework on time" value="71% to 94%" />
                <Row label="Attendance" value="74% to 96%" />
                <Row label="Study streak" value={`0 to ${STREAK} days`} />
              </Box>
            </div>
            <div className="mb-4">
              <Box title="Next goals">
                <Row label="Finish the algebra track" value="This term" />
                <Row label="Science exhibition entry" value="12 Sep" />
                <Row label="Speak for a group" value="Next term" />
                <Row label="Book 12" value="By December" />
              </Box>
            </div>
            <Box title="Later on">
              <Row label="STEM scholarship" value="You qualify" />
              <Row label="Robotics club" value="8 places left" />
              <Row label="Digital skills course" value="6 weeks" />
              <Row label="Career pathways" value="Lab and design" />
            </Box>
          </div>
        </div>
      ) : null}
    </Offcanvas>
  );
};

export default SuccessWorkspace;
