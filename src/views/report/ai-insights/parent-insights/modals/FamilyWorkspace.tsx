import { useEffect, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import { ActionLink } from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { Family } from '../data/family.data';
import {
  ACTION_REVIEW,
  bandOf,
  FAMILIES_MODELLED,
  FINDING_CONFIDENCE,
  FINDING_CONFIDENCE_MEAN,
  HIGHLY_ENGAGED,
  monthsSinceMeetingOf,
  RELATIONSHIP_BEFORE,
  RELATIONSHIP_GROWTH,
  SIMILAR,
  TERMS_ON_RECORD,
  THREAD,
  THREAD_READING,
  TIMELINE,
} from '../data/family.data';

const STAGES = [
  { n: '01', name: 'Family Profile' },
  { n: '02', name: 'Engagement' },
  { n: '03', name: 'AI Insights' },
  { n: '04', name: 'Communication' },
  { n: '05', name: 'Partnership' },
] as const;

type StageName = (typeof STAGES)[number]['name'];

export interface FamilyWorkspaceProps {
  open: boolean;
  onClose: () => void;
  row: Family | null;
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
  <div className={`fam-box ${className}`.trim()}>
    <div className="fam-box-head">
      <h6 className="fs-15 mb-0">{title}</h6>
      {badge ? <span className="fam-chip is-warm">{badge}</span> : null}
    </div>
    <div className="fam-box-body">{children}</div>
  </div>
);

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="fam-row">
    <span>{label}</span>
    <b>{value}</b>
  </div>
);

const FamilyWorkspace = ({ open, onClose, row, onOpenDialog }: FamilyWorkspaceProps) => {
  const [stage, setStage] = useState<StageName>('Family Profile');

  useEffect(() => {
    if (open) setStage('Family Profile');
  }, [open, row?.id]);

  if (!open || !row) return null;

  const band = bandOf(row.score);
  const months = monthsSinceMeetingOf(row);

  return (
    <Offcanvas
      open={open}
      onClose={onClose}
      title={`The ${row.guardian.split(' ').slice(-1)[0]} Family`}
      className="fam-ws"
      labelledById="family_workspace_label"
      header={
        <div className="fam-ws-head">
          <span className="fam-pair">
            <span className="avatar avatar-lg avatar-rounded">
              <ImageWithBasePath src={row.guardianImage} alt={row.guardian} />
            </span>
            <span className="avatar avatar-lg avatar-rounded border border-white border-2">
              <ImageWithBasePath src={row.studentImage} alt={row.student} />
            </span>
          </span>
          <div>
            <h3 className="mb-1 fs-16 fw-medium" id="family_workspace_label">
              The {row.guardian.split(' ').slice(-1)[0]} Family
            </h3>
            <p className="fs-12 text-muted mb-2">
              {row.guardian} · {row.student} · {row.className} · {row.id}
            </p>
            <div className="d-flex flex-wrap gap-2">
              <span className={`fam-chip ${band.tone}`}>{band.band}</span>
              <span className="fam-chip is-warm">
                <i className="ti ti-sparkles" />
                {row.confidence}% confidence
              </span>
              <span className="fam-chip is-cool">{row.prefers}</span>
            </div>
          </div>
          <div className="ms-auto text-end">
            <span className="fam-lbl">Relationship score</span>
            <span className="fam-stat">
              {row.score}
              <small>/100</small>
            </span>
          </div>
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
        <ul className="fam-steps nav" role="tablist">
          {STAGES.map((entry) => (
            <li role="presentation" key={entry.n}>
              <button
                type="button"
                role="tab"
                aria-selected={stage === entry.name}
                className={`fam-step ${stage === entry.name ? 'active' : ''}`.trim()}
                onClick={() => setStage(entry.name)}
              >
                <span className="fam-step-n">{entry.n}</span>
                <span className="fam-step-txt">
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
              Every draft waits for a named approver. Nothing on this page is shared with a family
              automatically.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenDialog('export_family')}
              >
                <i className="ti ti-file-export me-1" />
                Export
              </ActionLink>
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenDialog('schedule_meeting')}
              >
                <i className="ti ti-calendar-plus me-1" />
                Schedule Meeting
              </ActionLink>
              <ActionLink
                className="btn btn-primary d-inline-flex align-items-center"
                onClick={() => onOpenDialog('parent_summary')}
              >
                <i className="ti ti-mail-star me-1" />
                Generate Parent Summary
              </ActionLink>
            </div>
          </div>
        </div>
      }
    >
      {stage === 'Family Profile' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-4">
            <Box title="Household">
              <Row label="Family ID" value={row.id} />
              <Row label="Primary guardian" value={row.guardian} />
              <Row label="Second guardian" value={row.secondGuardian ?? 'Not on file'} />
              <Row label="Siblings at school" value="None" />
              <Row label="Language at home" value="English" />
              <Row label="Address on file" value="Route 04 catchment" />
            </Box>
          </div>
          <div className="col-12 col-xl-4">
            <Box title="Student">
              <Row label="Name" value={row.student} />
              <Row label="Class" value={row.className.replace('Class ', '')} />
              <Row label="Class teacher" value="Teena Mathew" />
              <Row label="Admitted" value="12 Apr 2023" />
              <Row label="Attendance" value="96%" />
              <Row label="Open concerns" value="1 · algebra" />
            </Box>
          </div>
          <div className="col-12 col-xl-4">
            <Box title="Contact" badge={months < 3 ? 'Reachable' : 'Quiet'}>
              <Row label="Preferred channel" value={row.prefers.split(' · ')[0]} />
              <Row label="Best time" value={row.prefers.split(' · ')[1] ?? 'Not set'} />
              <Row label="Channels tried" value={row.channelsTried.join(', ')} />
              <Row label="Last meeting" value={row.lastMeetingOn} />
              <Row
                label="Months since"
                value={months === 0 ? 'Under a month' : `${months} months`}
              />
              <Row label="Opted out of" value="Nothing" />
            </Box>
          </div>
        </div>
      ) : null}

      {stage === 'Engagement' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Box title="Parent participation" badge="Top quartile">
                <Row
                  label="Meetings attended"
                  value={`${row.meetingsAttended} of ${row.meetingsOffered}`}
                />
                <Row label="Events attended" value="4 this year" />
                <Row label="Volunteering" value="Library partner" />
                <Row label="Portal logins" value="Weekly" />
                <Row label="Survey responses" value="3 of 3" />
              </Box>
            </div>
            <div className="mb-4">
              <Box title="Communication preferences">
                <Row label="Channel" value={row.prefers.split(' · ')[0]} />
                <Row label="Fallback" value="Phone call" />
                <Row label="Channels tried" value={row.channelsTried.length} />
                <Row label="Tone preference" value="Direct and brief" />
                <Row label="Language" value="English" />
              </Box>
            </div>
            <Box title="School activities">
              <Row label="Open evenings" value="2 of 2" />
              <Row label="Workshops" value="1 of 2" />
              <Row label="Volunteering" value="Library, weekly" />
              <Row label="Community events" value="1" />
              <Row label="Invitations declined" value="None" />
            </Box>
          </div>
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Box title="Meeting history">
                {TIMELINE.filter((turn) => turn.title.includes('Meeting')).map((turn) => (
                  <Row key={turn.id} label={turn.on} value={turn.title} />
                ))}
                <Row
                  label="Missed"
                  value={`${row.meetingsOffered - row.meetingsAttended} · morning slot`}
                />
              </Box>
            </div>
            <div className="mb-4">
              <Box title="Homework support" badge="Improving">
                <Row label="Completion" value="94%" />
                <Row label="Support consistency" value="High" />
                <Row label="Guidance sheets received" value="All" />
                <Row label="Quiet study space" value="Yes" />
                <Row label="Change since June" value="67% to 94%" />
              </Box>
            </div>
            <Box title="AI confidence by finding" badge={`Mean ${FINDING_CONFIDENCE_MEAN}%`}>
              {FINDING_CONFIDENCE.map((entry) => (
                <Row key={entry.label} label={entry.label} value={`${entry.value}%`} />
              ))}
            </Box>
          </div>
        </div>
      ) : null}

      {stage === 'AI Insights' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Box title="Family strengths" badge="4 found">
                <Row label="Early disclosure" value="Raised transport first" />
                <Row label="Responsiveness" value="Under 12 hours" />
                <Row label="Home support" value="Consistent" />
                <Row
                  label="Attendance at meetings"
                  value={`${row.meetingsAttended} of ${row.meetingsOffered}`}
                />
              </Box>
            </div>
            <Box title="Engagement challenges" badge="4 noted">
              <Row label="Morning slots" value="Cannot attend" />
              <Row label="Second guardian" value="Rarely present" />
              <Row label="Written updates" value="Often unread" />
              <Row label="Community events" value="Low uptake" />
            </Box>
          </div>
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Box title="Supporting evidence">
                <Row label="Messages reviewed" value="48" />
                <Row label="Meetings on record" value={row.meetingsOffered} />
                <Row label="Terms of history" value={TERMS_ON_RECORD} />
                <Row label="Homework records" value="112" />
                <Row label="Comparison cohort" value={`${FAMILIES_MODELLED} families`} />
              </Box>
            </div>
            <Box title="Similar family profiles">
              {SIMILAR.map((match) => (
                <Row key={match.name} label={match.name} value={match.note} />
              ))}
              <Row
                label="Families like this"
                value={`${HIGHLY_ENGAGED} of ${FAMILIES_MODELLED}`}
              />
            </Box>
          </div>
        </div>
      ) : null}

      {stage === 'Communication' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-7">
            <div className="fam-thread-panel mb-4">
              <div className="fam-box-head">
                <h6 className="fs-15 mb-0">Communication timeline</h6>
                <span className="fam-chip is-warm">Responsive</span>
              </div>
              <div className="fam-bubbles">
                {THREAD.map((turn) => (
                  <div className={`fam-bubble ${turn.mine ? 'is-out' : 'is-in'}`} key={turn.id}>
                    <p className="fs-13 mb-1">{turn.text}</p>
                    <span className="fs-11 text-muted">
                      {turn.from} · {turn.at}
                    </span>
                  </div>
                ))}
              </div>
              <p className="fs-12 text-muted mb-0 mt-3">
                <i className="ti ti-sparkles me-1 text-primary" />
                {THREAD_READING}
              </p>
            </div>
            <Box title="Meeting agenda" badge="Drafted">
              <Row label="1. Reading progress" value="5 min" />
              <Row label="2. Algebra notation gap" value="10 min" />
              <Row label="3. Scholarship nomination" value="5 min" />
              <Row label="Suggested slot" value="Evening, 5pm" />
              <Row label="Attendees" value="Both guardians" />
            </Box>
          </div>
          <div className="col-12 col-xl-5">
            <div className="mb-4">
              <Box title="Parent action items">
                <Row label="Four practice questions" value="Over the break" />
                <Row label="Confirm evening slot" value="This week" />
                <Row label="Open evening" value="Optional" />
                <Row label="Nothing else needed" value="—" />
              </Box>
            </div>
            <Box title="Teacher notes">
              <Row label="Teena Mathew" value="“Lead with progress”" />
              <Row label="Counsellor" value="No concerns" />
              <Row label="Transport office" value="Route resolved" />
              <Row label="Next review" value={ACTION_REVIEW} />
            </Box>
          </div>
        </div>
      ) : null}

      {stage === 'Partnership' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-7">
            <Box title="Partnership timeline">
              {TIMELINE.map((turn) => (
                <div className="fam-turn" key={turn.id}>
                  <span className="fam-turn-lbl">{turn.on}</span>
                  <div className="flex-fill overflow-hidden">
                    <p className="fs-14 fw-medium text-dark mb-1">{turn.title}</p>
                    <p className="fs-13 text-muted mb-0">{turn.note}</p>
                  </div>
                </div>
              ))}
            </Box>
          </div>
          <div className="col-12 col-xl-5">
            <div className="mb-4">
              <Box title="Completed goals">
                <Row label="Attendance recovery" value="Closed 29 Jul" />
                <Row label="Channel preference set" value="Jun 2026" />
                <Row label="Transport resolved" value="Jul 2026" />
                <Row label="Homework target" value="Exceeded" />
              </Box>
            </div>
            <div className="mb-4">
              <Box title="Family achievements">
                <Row label="Raised transport issue" value="Before the school did" />
                <Row label="Science exhibition" value="Second place" />
                <Row label="Library volunteering" value="Weekly since May" />
                <Row
                  label="Meeting attendance"
                  value={`${row.meetingsAttended} of ${row.meetingsOffered}`}
                />
              </Box>
            </div>
            <div className="mb-4">
              <Box title="Engagement growth" badge={`+${RELATIONSHIP_GROWTH}`}>
                <Row label="Relationship score" value={`${RELATIONSHIP_BEFORE} to ${row.score}`} />
                <Row label="Response time" value="4 days to 12 hours" />
                <Row label="Events attended" value="1 to 4" />
                <Row label="Portal use" value="Monthly to weekly" />
              </Box>
            </div>
            <Box title="Future recommendations">
              <Row label="Keep leading with progress" value="Ongoing" />
              <Row label="Invite second guardian" value="Next meeting" />
              <Row label="Pair with a new family" value="Sep 2026" />
              <Row label="Scholarship support" value="Six weeks" />
            </Box>
          </div>
        </div>
      ) : null}
    </Offcanvas>
  );
};

export default FamilyWorkspace;
