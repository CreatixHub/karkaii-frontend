import { useEffect, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import { ActionLink } from '@components/workspace';
import {
  APPROVAL_TARGET,
  BLOCKING,
  CLASSES_IN_SCOPE,
  CONFLICTS,
  DIMENSIONS,
  EFFECTIVE_FROM,
  LABS,
  OPTIMIZATION_ID,
  OPTIMIZED_HEALTH,
  PERIOD_ASSIGNMENTS,
  PERIOD_CEILING,
  PERIODS_MOVED,
  PERIODS_PER_DAY,
  PROPOSED_VERSION,
  QUERIED,
  ROOMS,
  ROOMS_REASSIGNED,
  SCHEDULE_HEALTH,
  SIGNED_OFF,
  TEACHER_REASSIGNMENTS,
  TEACHERS,
  TEACHING_DAYS,
  timelineStops,
  VERSIONS,
} from '../data/timetable.data';

const STAGES = [
  { n: '01', name: 'Analyze' },
  { n: '02', name: 'Detect' },
  { n: '03', name: 'Optimize' },
  { n: '04', name: 'Review' },
  { n: '05', name: 'Publish' },
] as const;

type StageName = (typeof STAGES)[number]['name'];

export interface TimetableWorkspaceProps {
  open: boolean;
  onClose: () => void;
  onOpenDialog: (id: string) => void;
}

const Panel = ({
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
  <div className={`tto-panel ${className}`.trim()}>
    <div className="tto-panel-head">
      <h6 className="fs-15 mb-0">{title}</h6>
      {badge ? <span className="tto-chip is-ai">{badge}</span> : null}
    </div>
    <div className="tto-panel-body">{children}</div>
  </div>
);

const Line = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="tto-line">
    <span>{label}</span>
    <b>{value}</b>
  </div>
);

const TimetableWorkspace = ({ open, onClose, onOpenDialog }: TimetableWorkspaceProps) => {
  const [stage, setStage] = useState<StageName>('Analyze');

  useEffect(() => {
    if (open) setStage('Analyze');
  }, [open]);

  if (!open) return null;

  const overCeiling = 4;
  const withinCeiling = TEACHERS - overCeiling;

  return (
    <Offcanvas
      open={open}
      onClose={onClose}
      title={`Term 2 Timetable · ${OPTIMIZATION_ID}`}
      className="tto-ws"
      labelledById="timetable_workspace_label"
      header={
        <div className="tto-ws-head">
          <span className="tto-ws-ic">
            <i className="ti ti-calendar-time" />
          </span>
          <div>
            <h3 className="mb-1 fs-16 fw-medium" id="timetable_workspace_label">
              Term 2 Timetable · Optimization {OPTIMIZATION_ID}
            </h3>
            <p className="fs-12 text-muted mb-2">
              {PERIOD_ASSIGNMENTS.toLocaleString('en-US')} period assignments · {TEACHERS} teachers
              · {ROOMS} rooms · {LABS} laboratories
            </p>
            <div className="d-flex flex-wrap gap-2">
              <span className="tto-chip is-crit">{CONFLICTS.length} active conflicts</span>
              <span className="tto-chip is-ai">
                <i className="ti ti-sparkles" />
                {QUERIED > 0 ? 94 : 100}% confidence
              </span>
              <span className="tto-chip is-ok">
                Health {SCHEDULE_HEALTH} → {OPTIMIZED_HEALTH}
              </span>
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
        <ul className="tto-seg nav" role="tablist">
          {STAGES.map((entry) => (
            <li role="presentation" key={entry.n}>
              <button
                type="button"
                role="tab"
                aria-selected={stage === entry.name}
                className={`tto-segbtn ${stage === entry.name ? 'active' : ''}`.trim()}
                onClick={() => setStage(entry.name)}
              >
                <span className="tto-segbtn-n">{entry.n}</span>
                <span className="tto-segbtn-txt">
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
              Every proposed change is reversible. Nothing reaches a teacher or a parent until the
              timetable is published.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenDialog('export_timetable')}
              >
                <i className="ti ti-file-export me-1" />
                Export
              </ActionLink>
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenDialog('optimization_report')}
              >
                <i className="ti ti-file-text me-1" />
                Optimization Report
              </ActionLink>
              <ActionLink
                className="btn btn-primary d-inline-flex align-items-center"
                onClick={() => onOpenDialog('publish_timetable')}
              >
                <i className="ti ti-send me-1" />
                Publish Timetable
              </ActionLink>
            </div>
          </div>
        </div>
      }
    >
      {stage === 'Analyze' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-4">
            <Panel title="Optimization scope">
              <Line
                label="Period assignments"
                value={PERIOD_ASSIGNMENTS.toLocaleString('en-US')}
              />
              <Line label="Classes in scope" value={CLASSES_IN_SCOPE} />
              <Line label="Teachers" value={TEACHERS} />
              <Line label="Rooms" value={`${ROOMS} + ${LABS} labs`} />
              <Line label="Periods per day" value={PERIODS_PER_DAY} />
              <Line label="Teaching days" value={TEACHING_DAYS} />
            </Panel>
          </div>
          <div className="col-12 col-xl-4">
            <Panel title="Constraints applied">
              <Line label="Teacher period ceiling" value={PERIOD_CEILING} />
              <Line label="Room capacity" value="Enforced" />
              <Line label="Subject dependencies" value="9 rules" />
              <Line label="Consecutive analytical" value="Discouraged" />
              <Line label="Lab requirements" value="Hard constraint" />
              <Line label="Break windows" value="Fixed" />
            </Panel>
          </div>
          <div className="col-12 col-xl-4">
            <Panel title="Current quality" badge="Needs work">
              <Line label="Schedule health" value={`${SCHEDULE_HEALTH} / 100`} />
              <Line
                label="Conflict-free classes"
                value={`${CLASSES_IN_SCOPE - CONFLICTS.length + 1} of ${CLASSES_IN_SCOPE}`}
              />
              <Line
                label="Teachers within ceiling"
                value={`${withinCeiling} of ${TEACHERS}`}
              />
              <Line
                label="Room utilization"
                value={`${DIMENSIONS.find((d) => d.id === 'rooms')?.current ?? 0}%`}
              />
              <Line
                label="Student gap index"
                value={DIMENSIONS.find((d) => d.id === 'gaps')?.current ?? 0}
              />
              <Line
                label="Publishable"
                value={BLOCKING.length === 0 ? 'Yes' : `No — ${BLOCKING.length} blocking`}
              />
            </Panel>
          </div>
        </div>
      ) : null}

      {stage === 'Detect' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Panel title="Teacher availability">
                <Line label="Within ceiling" value={`${withinCeiling} of ${TEACHERS}`} />
                <Line label="Over ceiling" value={overCeiling} />
                <Line label="Largest excess" value="5 periods" />
                <Line label="Free Friday PM" value="6 teachers" />
                <Line label="Total spare capacity" value="38 periods" />
              </Panel>
            </div>
            <div className="mb-4">
              <Panel title="Room availability">
                <Line label="Rooms idle 50%+" value="2" />
                <Line label="Peak occupancy" value="96%" />
                <Line label="Idle periods total" value="22" />
                <Line label="Labs at capacity" value="Both" />
                <Line label="Music room PM" value="Unused" />
              </Panel>
            </div>
            <Panel title="Resource constraints">
              <Line label="Fume extraction" value="Lab 2 only" />
              <Line label="Dining capacity" value="240 seats" />
              <Line label="Sports ground" value="One, shared" />
              <Line label="Exam hall" value="Mornings only" />
              <Line label="Transport bells" value="2 fixed times" />
            </Panel>
          </div>
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Panel title="Subject dependencies">
                <Line label="Practical before theory" value="3 rules" />
                <Line label="Double periods required" value="Labs, art" />
                <Line label="Analytical spacing" value="One per morning" />
                <Line label="Language pairing" value="Not adjacent" />
                <Line label="Rules satisfied" value="7 of 9" />
              </Panel>
            </div>
            <Panel
              title="AI confidence by finding"
              badge={`Mean ${Math.round(
                CONFLICTS.reduce((total, row) => total + row.confidence, 0) / CONFLICTS.length,
              )}%`}
            >
              {CONFLICTS.map((row) => (
                <Line key={row.id} label={row.kind} value={`${row.confidence}%`} />
              ))}
            </Panel>
          </div>
        </div>
      ) : null}

      {stage === 'Optimize' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-4">
            <Panel title="Resource allocation">
              <Line label="Periods moved" value={PERIODS_MOVED} />
              <Line label="Rooms reassigned" value={ROOMS_REASSIGNED} />
              <Line label="Teachers affected" value="5" />
              <Line label="Classes affected" value="7" />
              <Line label="Labs rebalanced" value="Both" />
            </Panel>
          </div>
          <div className="col-12 col-xl-4">
            <Panel title="Conflict resolution" badge="All clear">
              <Line
                label="Resolved by plan A"
                value={`${CONFLICTS.length} of ${CONFLICTS.length}`}
              />
              <Line label="Blocking cleared" value={BLOCKING.length === 2 ? 'Both' : 'All'} />
              <Line label="New conflicts introduced" value="None" />
              <Line label="Manual overrides needed" value="None" />
              <Line label="Reversible" value="Fully" />
            </Panel>
          </div>
          <div className="col-12 col-xl-4">
            <Panel title="Expected improvements">
              {DIMENSIONS.map((row) => (
                <Line
                  key={row.id}
                  label={row.title}
                  value={`${row.current} → ${row.optimized}`}
                />
              ))}
              <Line label="Publishable" value="Yes" />
            </Panel>
          </div>
        </div>
      ) : null}

      {stage === 'Review' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Panel title="Teacher review" badge={`${TEACHERS - SIGNED_OFF} outstanding`}>
                <Line label="Signed off" value={`${SIGNED_OFF} of ${TEACHERS}`} />
                <Line label="Changes queried" value={QUERIED} />
                <Line label="Awaiting response" value={TEACHERS - SIGNED_OFF - QUERIED} />
                <Line label="Meera Joshi" value="Approved · 29 Jul" />
                <Line label="Daniel Josua" value="Queried · lab slot" />
                <Line label="Rakesh Sharma" value="Approved · 30 Jul" />
              </Panel>
            </div>
            <Panel title="Principal approval">
              <Line label="Status" value="Pending" />
              <Line label="Blocked by" value="Teacher sign-off" />
              <Line label="Workload summary" value="Ready" />
              <Line label="Conflict report" value="Ready" />
              <Line label="Target date" value={APPROVAL_TARGET} />
            </Panel>
          </div>
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Panel title="Change summary">
                <Line label="Periods moved" value={PERIODS_MOVED} />
                <Line label="Rooms reassigned" value={ROOMS_REASSIGNED} />
                <Line label="Teacher reassignments" value={TEACHER_REASSIGNMENTS} />
                <Line label="Break times adjusted" value="1" />
                <Line label="Classes unaffected" value={`11 of ${CLASSES_IN_SCOPE}`} />
              </Panel>
            </div>
            <Panel
              title="Optimization comparison"
              badge={`+${OPTIMIZED_HEALTH - SCHEDULE_HEALTH} points`}
            >
              <Line label="Draft health" value={SCHEDULE_HEALTH} />
              <Line label="Optimized health" value={OPTIMIZED_HEALTH} />
              <Line label="Conflicts before" value={CONFLICTS.length} />
              <Line label="Conflicts after" value={PROPOSED_VERSION.conflicts} />
              <Line
                label="Disruption"
                value={`${PERIODS_MOVED} of ${PERIOD_ASSIGNMENTS.toLocaleString('en-US')} periods`}
              />
            </Panel>
          </div>
        </div>
      ) : null}

      {stage === 'Publish' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Panel title="Publish status" badge={BLOCKING.length ? 'Not ready' : 'Ready'}>
                <Line label="Current state" value="Draft" />
                <Line label="Blocking issues" value={BLOCKING.length} />
                <Line label="Approvals needed" value="2" />
                <Line label="Publish targets" value="Portal, boards, parents" />
                <Line label="Effective from" value={EFFECTIVE_FROM} />
              </Panel>
            </div>
            <Panel title="Timetable history">
              {VERSIONS.map((version) => (
                <Line
                  key={version.id}
                  label={`${version.id} · ${version.on}`}
                  value={version.note}
                />
              ))}
            </Panel>
          </div>
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Panel title="Version comparison">
                {VERSIONS.slice(-2).map((version) => (
                  <Line
                    key={version.id}
                    label={`${version.id} health`}
                    value={`${version.health} · ${version.conflicts} conflicts`}
                  />
                ))}
                <Line
                  label={`${PROPOSED_VERSION.id} proposed`}
                  value={`${PROPOSED_VERSION.health} · ${PROPOSED_VERSION.conflicts} conflicts`}
                />
              </Panel>
            </div>
            <Panel title="Audit timeline">
              {timelineStops().map((stop) => (
                <Line key={stop.id} label={stop.title} value={stop.on} />
              ))}
            </Panel>
          </div>
        </div>
      ) : null}
    </Offcanvas>
  );
};

export default TimetableWorkspace;
