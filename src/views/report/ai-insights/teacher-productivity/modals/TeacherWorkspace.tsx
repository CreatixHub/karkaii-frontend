import { useEffect, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import { ActionLink } from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { Teacher } from '../data/teaching.data';
import {
  ADOPTERS,
  ADOPTERS_AHEAD,
  CLASS_SPREAD,
  CLASS_VARIANCE,
  facetToneOf,
  FINDING_CONFIDENCE,
  FINDING_CONFIDENCE_MEAN,
  freePeriodsOf,
  GAIN_WEEKS,
  journeyLegs,
  PERIOD_CEILING,
  periodsOf,
  SHARE_THE_STRUCTURE,
  TEACHERS,
  TEACHERS_REVIEWED,
  workloadToneOf,
} from '../data/teaching.data';

const STAGES = [
  { n: '01', name: 'Teacher Profile' },
  { n: '02', name: 'Teaching Analysis' },
  { n: '03', name: 'AI Insights' },
  { n: '04', name: 'Coaching Plan' },
  { n: '05', name: 'Professional Growth' },
] as const;

type StageName = (typeof STAGES)[number]['name'];

export interface TeacherWorkspaceProps {
  open: boolean;
  onClose: () => void;
  teacher: Teacher | null;
  onOpenDialog: (id: string) => void;
}

const Box = ({
  title,
  badge,
  children,
  className = '',
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`tch-box ${className}`.trim()}>
    <div className="tch-box-head">
      <h6 className="fs-15 mb-0">{title}</h6>
      {badge ? <span className="tch-pill is-ai">{badge}</span> : null}
    </div>
    <div className="tch-box-body">{children}</div>
  </div>
);

const Line = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="tch-line">
    <span>{label}</span>
    <b>{value}</b>
  </div>
);

const Facet = ({ label, value, tone }: { label: string; value: number; tone: string }) => (
  <span className="tch-facet">
    <span>{label}</span>
    <span className={`tch-facet-bar ${tone} aix-p-${value}`.replace(/\s+/g, ' ')} />
    <b>{value}</b>
  </span>
);

const TeacherWorkspace = ({ open, onClose, teacher, onOpenDialog }: TeacherWorkspaceProps) => {
  const [stage, setStage] = useState<StageName>('Teacher Profile');

  useEffect(() => {
    if (open) setStage('Teacher Profile');
  }, [open, teacher?.id]);

  if (!open || !teacher) return null;

  const periods = periodsOf(teacher);
  const free = freePeriodsOf(teacher);
  const overloaded = periods > PERIOD_CEILING;
  const others = TEACHERS.filter((row) => row.id !== teacher.id).slice(0, 3);

  return (
    <Offcanvas
      open={open}
      onClose={onClose}
      title={teacher.name}
      className="tch-ws"
      labelledById="teacher_workspace_label"
      header={
        <div className="tch-ws-head">
          <span className="avatar avatar-xxl avatar-rounded flex-shrink-0">
            <ImageWithBasePath src={teacher.image} alt={teacher.name} />
          </span>
          <div>
            <h3 className="mb-1 fs-16 fw-medium" id="teacher_workspace_label">
              {teacher.name}
            </h3>
            <p className="fs-12 text-muted mb-2">
              {teacher.department} · {teacher.subjects} · {teacher.id} · Joined{' '}
              {teacher.joinedOn.split(' ').slice(1).join(' ')}
            </p>
            <div className="d-flex flex-wrap gap-2">
              <span className="tch-pill is-high">
                <i className="ti ti-flame" />
                Engagement {teacher.engagement}
              </span>
              <span className="tch-pill is-ai">
                <i className="ti ti-sparkles" />
                {teacher.confidence}% confidence
              </span>
              <span className="tch-pill is-note">
                <i className="ti ti-bulb" />
                {teacher.style}
              </span>
            </div>
          </div>
          <span className="tch-card-score ms-auto">
            <span className="tch-lbl">Productivity score</span>
            <b>
              {teacher.score}
              <small>/100</small>
            </b>
          </span>
          <button
            type="button"
            className="btn-close custom-btn-close"
            aria-label="Close"
            onClick={onClose}
          >
            <i className="ti ti-x" />
          </button>
        </div>
      }
      beforeBody={
        <ul className="tch-ribbon nav" role="tablist">
          {STAGES.map((entry) => (
            <li role="presentation" key={entry.n}>
              <button
                type="button"
                role="tab"
                aria-selected={stage === entry.name}
                className={`tch-rib ${stage === entry.name ? 'active' : ''}`.trim()}
                onClick={() => setStage(entry.name)}
              >
                <span>Stage {entry.n}</span>
                <span>{entry.name}</span>
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
              These findings support coaching conversations. They are not an appraisal and are not
              written to a personnel record.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenDialog('export_report')}
              >
                <i className="ti ti-file-export me-1" />
                Export
              </ActionLink>
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenDialog('observation')}
              >
                <i className="ti ti-eye me-1" />
                Schedule Observation
              </ActionLink>
              <ActionLink
                className="btn btn-primary d-inline-flex align-items-center"
                onClick={() => onOpenDialog('coaching_plan')}
              >
                <i className="ti ti-route me-1" />
                Create Coaching Plan
              </ActionLink>
            </div>
          </div>
        </div>
      }
    >
      {stage === 'Teacher Profile' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-4">
            <Box title="Teacher record">
              <Line label="Staff ID" value={teacher.id} />
              <Line label="Department" value={teacher.department} />
              <Line label="Subjects" value={teacher.subjects} />
              <Line label="Joined" value={teacher.joinedOn} />
              <Line label="Classes taught" value={teacher.classes} />
              <Line label="Teaching style" value={teacher.style} />
            </Box>
          </div>
          <div className="col-12 col-xl-4">
            <Box title="Workload" badge={overloaded ? 'Above ceiling' : 'Within policy'}>
              <Line label="Periods per week" value={`${periods} of ${PERIOD_CEILING}`} />
              <Line label="Contact hours" value={`${(periods * 0.84).toFixed(1)}`} />
              <Line label="Non-contact load" value={`${Math.round(periods * 0.27)} hours`} />
              <Line label="Marking turnaround" value={teacher.assessment >= 85 ? '2 days' : '6 days'} />
              <Line label="Free periods" value={free} />
              <Line label="Capacity" value={free > 0 ? 'Available' : 'None'} />
            </Box>
          </div>
          <div className="col-12 col-xl-4">
            <Box title="Teaching profile" badge={teacher.score >= 90 ? 'Top decile' : undefined}>
              <Facet
                label="Engagement"
                value={teacher.engagement}
                tone={facetToneOf(teacher.engagement)}
              />
              <Facet
                label="Lesson planning"
                value={teacher.planning}
                tone={facetToneOf(teacher.planning)}
              />
              <Facet
                label="Assessment"
                value={teacher.assessment}
                tone={facetToneOf(teacher.assessment)}
              />
              <Facet
                label="Consistency"
                value={teacher.consistency}
                tone={facetToneOf(teacher.consistency)}
              />
              <Facet label="Workload" value={teacher.workload} tone={workloadToneOf(teacher)} />
              <p className="fs-13 text-muted mb-0 mt-3">
                Engagement and planning both sit in the top decile. Workload has{' '}
                {free > 0 ? `${free} periods of room` : 'no room left'}, which is why she is the
                natural candidate to lead the department session.
              </p>
            </Box>
          </div>
        </div>
      ) : null}

      {stage === 'Teaching Analysis' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Box title="Teaching behaviour">
                <Line label="Structure" value={teacher.style} />
                <Line label="Adopted" value="Sep 2025" />
                <Line label="Pace" value="Slower start, faster finish" />
                <Line label="Seating" value="Groups of four" />
                <Line label="Questioning" value="Open, whole class" />
              </Box>
            </div>
            <div className="mb-4">
              <Box title="Classroom engagement" badge="Highest in school">
                <Line label="Volunteered contributions" value="3x median" />
                <Line label="Held for" value={`${GAIN_WEEKS} weeks`} />
                <Line
                  label="Weakest class"
                  value={`${CLASS_SPREAD.weakest.name} · ${CLASS_SPREAD.weakest.reading}`}
                />
                <Line
                  label="Strongest class"
                  value={`${CLASS_SPREAD.strongest.name} · ${CLASS_SPREAD.strongest.reading}`}
                />
                <Line label="Class-to-class variance" value={`${CLASS_VARIANCE} points`} />
              </Box>
            </div>
            <Box title="Lesson planning">
              <Line label="Plans filed ahead" value="Every cycle" />
              <Line label="Objectives stated" value="All plans" />
              <Line label="Differentiation noted" value="11 of 12" />
              <Line label="Resources attached" value="All plans" />
              <Line label="Late filings" value="None" />
            </Box>
          </div>
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Box title="Assessment quality" badge="Benchmark">
                <Line label="Papers built fresh" value="Every term" />
                <Line label="Question discrimination" value="Clean spread" />
                <Line label="Rubrics published ahead" value="Yes" />
                <Line label="Turnaround" value="2 days" />
                <Line label="Reused papers" value="None" />
              </Box>
            </div>
            <div className="mb-4">
              <Box title="Student feedback">
                <Line label="Named as clear" value="3rd most often" />
                <Line label="Approachability" value="High" />
                <Line label="Pace comments" value="Two, both positive" />
                <Line label="Requests for more practice" value="4" />
                <Line label="Negative themes" value="None recorded" />
              </Box>
            </div>
            <Box title="AI confidence by finding" badge={`Mean ${FINDING_CONFIDENCE_MEAN}%`}>
              {FINDING_CONFIDENCE.map((entry) => (
                <Line key={entry.label} label={entry.label} value={`${entry.value}%`} />
              ))}
            </Box>
          </div>
        </div>
      ) : null}

      {stage === 'AI Insights' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Box title="Teaching strengths" badge="4 found">
                <Line label="Engagement" value="Top decile" />
                <Line label="Planning" value="Top decile" />
                <Line label="Assessment design" value="Benchmark" />
                <Line label="Consistency" value="Strong" />
              </Box>
            </div>
            <Box title="Improvement areas" badge="4 noted">
              <Line label="Whole-class questioning" value="Could widen" />
              <Line label="Written feedback depth" value="Brief" />
              <Line label="Peer observation given" value="None yet" />
              <Line label="Digital resources" value="Minimal" />
            </Box>
          </div>
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Box title="Supporting evidence">
                <Line label="Observation cycles" value="4" />
                <Line label="Lesson records reviewed" value="96" />
                <Line label="Student feedback responses" value="112" />
                <Line label="Assessment papers analysed" value="11" />
                <Line label="Comparison cohort" value={`${TEACHERS_REVIEWED} teachers`} />
              </Box>
            </div>
            <Box title="Similar teaching profiles">
              {others.map((row) => (
                <Line
                  key={row.id}
                  label={`${row.name} · ${row.department}`}
                  value={row.style}
                />
              ))}
              <Line
                label="Teachers with this structure"
                value={`${SHARE_THE_STRUCTURE} of ${TEACHERS_REVIEWED}`}
              />
            </Box>
          </div>
        </div>
      ) : null}

      {stage === 'Coaching Plan' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-7">
            <div className="mb-4">
              <Box title="AI coaching plan" badge="Drafted">
                <p className="fs-13 text-muted mb-3">
                  This is a lead-others plan rather than an improve-yourself plan. The engine found
                  nothing to correct; it found something to spread. The ask is twenty minutes at the
                  department meeting and two observation slots.
                </p>
                <Line label="Focus" value="Lead, not improve" />
                <Line label="Duration" value="One term" />
                <Line label="Ask" value="20 min department session" />
                <Line label="Observation slots" value="2" />
                <Line label="Owner" value={`Head of ${teacher.department}`} />
              </Box>
            </div>
            <Box title="Weekly goals">
              <Line label="Week 1" value="Prepare department session" />
              <Line label="Week 2" value="Deliver session" />
              <Line label="Week 3" value={`Observe two of the ${ADOPTERS} adopters`} />
              <Line label="Week 4" value="Feedback and adjust" />
            </Box>
          </div>
          <div className="col-12 col-xl-5">
            <div className="mb-4">
              <Box title="Professional development">
                <Line label="Mentoring certification" value="Eligible now" />
                <Line label="Assessment design lead" value="Recommended" />
                <Line label="Digital resources course" value="Optional" />
                <Line label="Completed this year" value="3 of 3" />
              </Box>
            </div>
            <div className="mb-4">
              <Box title="Leadership recommendations" badge="Ready">
                <Line label="Mentoring pair" value="Recommended" />
                <Line label="Department lead" value="Ready in 1 year" />
                <Line label="Assessment working group" value="Recommended" />
                <Line label="Promotion criteria met" value="5 of 5" />
              </Box>
            </div>
            <Box title="Training suggestions">
              <Line label="Mentoring skills" value="2 days" />
              <Line label="Digital resources" value="1 day, optional" />
              <Line label="Assessment design lead" value="Half day" />
              <Line label="Protected periods needed" value="3" />
            </Box>
          </div>
        </div>
      ) : null}

      {stage === 'Professional Growth' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-7">
            <Box title="Growth timeline">
              {journeyLegs().map((leg) => (
                <div className={`tch-leg ${leg.state}`.trim()} key={leg.id}>
                  <span className="tch-leg-n">{leg.n}</span>
                  <div className="flex-fill overflow-hidden">
                    <p className="tch-leg-title">{leg.title}</p>
                    <p className="fs-12 text-muted mb-1">{leg.on}</p>
                    <p className="fs-13 text-muted mb-0">{leg.note}</p>
                  </div>
                </div>
              ))}
            </Box>
          </div>
          <div className="col-12 col-xl-5">
            <div className="mb-4">
              <Box title="Completed goals">
                <Line label="Method change embedded" value={`${GAIN_WEEKS} weeks`} />
                <Line label="Engagement target" value="Exceeded" />
                <Line label="Planning discipline" value="Maintained" />
                <Line label="Training this year" value="3 of 3" />
              </Box>
            </div>
            <div className="mb-4">
              <Box title="Teaching improvements">
                <Line label="Engagement" value={`78 to ${teacher.engagement}`} />
                <Line label="Assessment" value={`84 to ${teacher.assessment}`} />
                <Line label="Class variance" value={`19 to ${CLASS_VARIANCE} points`} />
                <Line label="Marking turnaround" value="4 days to 2" />
              </Box>
            </div>
            <div className="mb-4">
              <Box title="Success indicators" badge="On track">
                <Line
                  label="Adopters above previous best"
                  value={`${ADOPTERS_AHEAD} of ${ADOPTERS}`}
                />
                <Line label="Gain held" value={`${GAIN_WEEKS} weeks`} />
                <Line label="Student feedback" value="Improving" />
                <Line label="Open concerns" value="None" />
              </Box>
            </div>
            <Box title="Career roadmap">
              <Line label="Now" value="Senior teacher" />
              <Line label="Next" value="Mentor, this term" />
              <Line label="12 months" value="Assessment lead" />
              <Line label="24 months" value={`Head of ${teacher.department}`} />
            </Box>
          </div>
        </div>
      ) : null}
    </Offcanvas>
  );
};

export default TeacherWorkspace;
