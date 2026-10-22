import { useEffect, useMemo, useState } from 'react';
import Modal from '@components/ui/Modal';
import DateField from '@components/ui/DateField';
import type { RiskCase } from '../data/risk.data';
import {
  bandOf,
  bandTint,
  CLOSURE_THRESHOLD,
  countByBand,
  isCloseableOf,
  liveScoreOf,
  LAST_RUN,
  MONITORED,
  REOPEN_THRESHOLD,
  RUN_DURATION,
} from '../data/risk.data';

export type RiskModalId =
  | 'run_analysis'
  | 'assign_teacher'
  | 'assign_counselor'
  | 'create_intervention'
  | 'generate_parent_summary'
  | 'generate_teacher_notes'
  | 'schedule_meeting'
  | 'export_summary'
  | 'apply_recommendation'
  | 'dismiss_recommendation'
  | 'compare_students'
  | 'close_case'
  | 'weekly_review'
  | 'add_case_note'
  | 'view_all_cases';

export interface RiskModalsProps {
  active: RiskModalId | null;
  onClose: () => void;
  row: RiskCase | null;
  rows: RiskCase[];
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  onCloseCase: (id: string) => void;
  onAddNote: (id: string, title: string) => void;
  onOpenCase: (row: RiskCase) => void;
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
  value?: string;
  onChange?: (value: string) => void;
}) =>
  onChange ? (
    <select className="form-select" value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  ) : (
    <select className="form-select" defaultValue={options[0]}>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );

const Radios = ({ name, options }: { name: string; options: string[] }) => (
  <div className="custom-btn-group custom-btn-group-fill custom-btn-group-sm" role="group">
    {options.map((option, index) => (
      <span key={option}>
        <input type="radio" className="btn-check" name={name} id={`${name}-${index}`} defaultChecked={index === 0} />
        <label className="btn" htmlFor={`${name}-${index}`}>
          {option}
        </label>
      </span>
    ))}
  </div>
);

/** The stage a dialog belongs to, in the library's own caps line. */
const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="aix-eyebrow">{children}</span>
);

const StudentLine = ({ row }: { row: RiskCase }) => (
  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 border rounded p-3 mb-3">
    <div>
      <h6 className="fs-15 mb-0">{row.student}</h6>
      <span className="fs-12 text-muted">
        {row.className} · {row.id} · {row.primaryRisk}
      </span>
    </div>
    <div className="text-end">
      <span className={`badge badge-soft-${bandTint[bandOf(row)]}`}>{bandOf(row)}</span>
      <span className="fs-12 text-muted d-block mt-1">
        Score {liveScoreOf(row)} · {row.confidence}% confidence
      </span>
    </div>
  </div>
);

const RiskModals = ({
  active,
  onClose,
  row,
  rows,
  onToast,
  onCloseCase,
  onAddNote,
  onOpenCase,
}: RiskModalsProps) => {
  const [noteTitle, setNoteTitle] = useState('');
  const [dismissReason, setDismissReason] = useState('');
  const [tableBand, setTableBand] = useState('All risk levels');

  const detail = row ?? rows[0] ?? null;
  const closeable = row ?? rows.find(isCloseableOf) ?? rows[0] ?? null;
  const criticals = countByBand(rows, 'Critical');
  const highs = countByBand(rows, 'High');
  const topRecommendation = detail?.recommendations.find((item) => !item.decision) ?? null;

  useEffect(() => {
    if (active === 'add_case_note') setNoteTitle('');
    if (active === 'dismiss_recommendation') setDismissReason('');
  }, [active]);

  const tableRows = useMemo(
    () =>
      rows
        .filter((item) => tableBand === 'All risk levels' || bandOf(item) === tableBand)
        .sort((a, b) => b.score - a.score),
    [rows, tableBand],
  );

  const footerButtons = (label: string, icon: string, onConfirm: () => void) => (
    <>
      <button type="button" className="btn btn-light me-2" onClick={onClose}>
        Cancel
      </button>
      <button type="button" className="btn btn-primary" onClick={onConfirm}>
        <i className={`${icon} me-1`} />
        {label}
      </button>
    </>
  );

  const confirm = (message: string) => () => {
    onClose();
    onToast(message);
  };

  return (
    <>
      {/* ------------------------------ Run Analysis ----------------------------- */}
      <Modal
        open={active === 'run_analysis'}
        onClose={onClose}
        title="Run AI Analysis"
        footer={footerButtons('Run Analysis', 'ti ti-player-play', confirm('Analysis queued'))}
        className="aix-modal"
        eyebrow={<Eyebrow>Engine</Eyebrow>}
      >
        <p className="fs-13 text-muted mb-3">
          The last run finished today at {LAST_RUN} in {RUN_DURATION}. Re-running replaces every current score.
        </p>
        <div className="row g-3">
          <Field label="Scope" span="col-12">
            <Select
              options={[
                `All enrolled students · ${MONITORED.toLocaleString()}`,
                `Critical and high only · ${criticals + highs}`,
                'Single class',
                'Single student',
              ]}
            />
          </Field>
          <Field label="Signal groups">
            <Select options={['All five groups', 'Attendance only', 'Academics only', 'Finance only']} />
          </Field>
          <Field label="Sensitivity">
            <Select options={['Balanced · recommended', 'Cautious · fewer flags', 'Sensitive · more flags']} />
          </Field>
        </div>
      </Modal>

      {/* ------------------------------ Assign Teacher --------------------------- */}
      <Modal
        open={active === 'assign_teacher'}
        onClose={onClose}
        title="Assign Teacher"
        footer={footerButtons('Assign Mentor', 'ti ti-user-check', confirm('Mentor assigned'))}
        className="aix-modal"
        eyebrow={<Eyebrow>Assignment</Eyebrow>}
      >
        {detail ? (
          <p className="fs-13 text-muted mb-3">
            The engine suggests {detail.teacher} — they teach this class, have capacity, and closed 92% of
            their previous cases.
          </p>
        ) : null}
        {detail ? <StudentLine row={detail} /> : null}
        <div className="row g-3">
          <Field label="Student" span="col-12">
            <Select options={rows.map((item) => `${item.student} · ${item.className}`)} />
          </Field>
          <Field label="Teacher mentor">
            <Select
              options={[
                `${detail?.teacher ?? 'Teena Mathew'} · recommended`,
                'Leela Nambiar',
                'Meera Joshi',
                'Rakesh Sharma',
              ]}
            />
          </Field>
          <Field label="Check-in day">
            <Select options={['Thursday', 'Monday', 'Friday']} />
          </Field>
          <Field label="Start date" span="col-12">
            <DateField value="03-08-2026" onChange={() => undefined} format="d-m-Y" id="rsk-teacher-start" />
          </Field>
        </div>
      </Modal>

      {/* ----------------------------- Assign Counselor -------------------------- */}
      <Modal
        open={active === 'assign_counselor'}
        onClose={onClose}
        title="Assign Counselor"
        footer={footerButtons('Assign Counselor', 'ti ti-user-heart', confirm('Counselor assigned'))}
        className="aix-modal"
        eyebrow={<Eyebrow>Assignment</Eyebrow>}
      >
        {detail ? <StudentLine row={detail} /> : null}
        <div className="row g-3">
          <Field label="Student" span="col-12">
            <Select options={rows.map((item) => `${item.student} · ${item.className}`)} />
          </Field>
          <Field label="Counselor" span="col-12">
            <Select
              options={[
                'Dr. Anjali Rao · behaviour · 6 open',
                'Mr. Vinod Kamath · academic · 4 open',
                'Ms. Kavita Menon · wellness · 9 open',
              ]}
            />
          </Field>
          <Field label="First session">
            <DateField value="05-08-2026" onChange={() => undefined} format="d-m-Y" id="rsk-counselor-date" />
          </Field>
          <Field label="Frequency">
            <Select options={['Weekly', 'Fortnightly', 'Monthly']} />
          </Field>
          <Field label="Handover note" span="col-12">
            <textarea className="form-control" rows={2} defaultValue={detail?.reasoning.slice(0, 180) ?? ''} />
          </Field>
        </div>
      </Modal>

      {/* -------------------------- Create Intervention Plan --------------------- */}
      <Modal
        open={active === 'create_intervention'}
        onClose={onClose}
        title="Create Intervention Plan"
        dialogClassName="modal-lg"
        footer={footerButtons('Create Plan', 'ti ti-target-arrow', confirm('Intervention plan created'))}
        className="aix-modal"
        eyebrow={<Eyebrow>Plan</Eyebrow>}
      >
        {detail ? <StudentLine row={detail} /> : null}
        <div className="alert alert-soft-info fs-13 d-flex align-items-center gap-2">
          <i className="ti ti-sparkles" />
          Copilot has pre-filled this plan from the student’s signals and{' '}
          {detail?.related.length ?? 0} comparable closed cases.
        </div>
        <div className="row g-3">
          <Field label="Plan type">
            <Select
              options={[
                'Attendance recovery',
                'Academic remediation',
                'Behaviour monitoring',
                'Wellness follow-up',
                'Financial assistance',
              ]}
            />
          </Field>
          <Field label="Duration">
            <Select options={['4 weeks', '6 weeks', '8 weeks', 'Until case closed']} />
          </Field>
          <Field label="Lead teacher">
            <Select options={[detail?.teacher ?? 'Teena Mathew', 'Leela Nambiar', 'Meera Joshi']} />
          </Field>
          <Field label="Counselor">
            <Select options={[detail?.counselor ?? 'Dr. Anjali Rao', 'Mr. Vinod Kamath', 'Ms. Kavita Menon']} />
          </Field>
          <Field label="Review frequency">
            <Select options={['Weekly', 'Fortnightly', 'Monthly']} />
          </Field>
          <Field label="Target close date">
            <DateField
              value={detail?.projectedClosure ? '12-08-2026' : '31-08-2026'}
              onChange={() => undefined}
              format="d-m-Y"
              id="rsk-plan-close"
            />
          </Field>
          <Field label="Plan notes" span="col-12">
            <textarea className="form-control" rows={2} defaultValue={detail?.suggestedIntervention ?? ''} />
          </Field>
        </div>
      </Modal>

      {/* --------------------------- Generate Parent Summary --------------------- */}
      <Modal
        open={active === 'generate_parent_summary'}
        onClose={onClose}
        title="Generate Parent Summary"
        footer={footerButtons('Generate Summary', 'ti ti-sparkles', confirm('Parent summary drafted'))}
        className="aix-modal"
        eyebrow={<Eyebrow>Copilot</Eyebrow>}
      >
        {detail ? (
          <div className="border rounded p-3 mb-3">
            <h6 className="fs-14 mb-0">{detail.guardian}</h6>
            <span className="fs-12 text-muted">
              Guardian of {detail.student} · {detail.guardianPhone}
            </span>
          </div>
        ) : null}
        <p className="fs-13 text-muted mb-3">
          Written in plain language at a reading level suited to a general audience. Nothing sends until you
          approve it.
        </p>
        <div className="row g-3">
          <Field label="Tone">
            <Select options={['Supportive · recommended', 'Formal', 'Direct']} />
          </Field>
          <Field label="Language">
            <Select options={['English', 'Hindi', 'Malayalam', 'Tamil']} />
          </Field>
          <Field label="Include">
            <Select options={['Concern, plan and next steps', 'Concern and plan only', 'Progress update only']} />
          </Field>
          <Field label="Delivery">
            <Select options={['Email and SMS', 'Email only', 'Printed copy']} />
          </Field>
          <Field label="Send on" span="col-12">
            <DateField value="01-08-2026" onChange={() => undefined} format="d-m-Y" id="rsk-summary-send" />
          </Field>
        </div>
      </Modal>

      {/* --------------------------- Generate Teacher Notes ---------------------- */}
      <Modal
        open={active === 'generate_teacher_notes'}
        onClose={onClose}
        title="Generate Teacher Notes"
        footer={footerButtons('Generate Notes', 'ti ti-sparkles', confirm('Teacher notes drafted'))}
        className="aix-modal"
        eyebrow={<Eyebrow>Copilot</Eyebrow>}
      >
        <p className="fs-13 text-muted mb-3">
          Classroom-ready notes on what to watch for and how to respond in the moment.
        </p>
        <div className="row g-3">
          <Field label="Student" span="col-12">
            <Select options={rows.map((item) => `${item.student} · ${item.className}`)} />
          </Field>
          <Field label="Audience">
            <Select options={['Class teacher', 'All subject teachers', 'Substitute teacher']} />
          </Field>
          <Field label="Detail level">
            <Select options={['Brief · one page', 'Standard', 'Full context']} />
          </Field>
          <Field label="Focus areas" span="col-12">
            <Select options={['Behaviour cues and responses', 'Academic support only', 'Attendance follow-up']} />
          </Field>
        </div>
      </Modal>

      {/* ---------------------------- Schedule Parent Meeting -------------------- */}
      <Modal
        open={active === 'schedule_meeting'}
        onClose={onClose}
        title="Schedule Parent Meeting"
        footer={footerButtons('Schedule Meeting', 'ti ti-calendar-plus', confirm('Meeting scheduled'))}
        className="aix-modal"
        eyebrow={<Eyebrow>Meeting</Eyebrow>}
      >
        {detail ? (
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 border rounded p-3 mb-3">
            <div>
              <h6 className="fs-14 mb-0">{detail.guardian}</h6>
              <span className="fs-12 text-muted">
                Guardian of {detail.student} · {detail.guardianPhone}
              </span>
            </div>
            {bandOf(detail) === 'Critical' ? <span className="badge badge-soft-danger">Urgent</span> : null}
          </div>
        ) : null}
        <div className="row g-3">
          <Field label="Date">
            <DateField value="05-08-2026" onChange={() => undefined} format="d-m-Y" id="rsk-meeting-date" />
          </Field>
          <Field label="Time">
            <Select options={['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM']} />
          </Field>
          <Field label="Mode" span="col-12">
            <Radios name="rsk-mode" options={['In person · school office', 'Video call', 'Phone call']} />
          </Field>
          <Field label="Staff attending" span="col-12">
            <Select
              options={[
                `${detail?.teacher ?? 'Teena Mathew'} · Lead Teacher`,
                `${detail?.counselor ?? 'Dr. Anjali Rao'} · Counselor`,
                'Leela Nambiar · Vice Principal',
              ]}
            />
          </Field>
          <Field label="Agenda" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              defaultValue={detail ? `${detail.primaryRisk}. ${detail.suggestedIntervention}.` : ''}
            />
          </Field>
        </div>
      </Modal>

      {/* ------------------------------ Export Summary --------------------------- */}
      <Modal
        open={active === 'export_summary'}
        onClose={onClose}
        title="Export AI Summary"
        footer={footerButtons('Export Summary', 'ti ti-file-export', confirm('Summary exported'))}
        className="aix-modal"
        eyebrow={<Eyebrow>Export</Eyebrow>}
      >
        <div className="row g-3">
          <Field label="Include" span="col-12">
            <Select
              options={[
                'Everything on this page',
                'Student intelligence only',
                'Recommendations only',
                'Explanations only',
              ]}
            />
          </Field>
          <Field label="Format">
            <Select options={['PDF', 'Excel', 'CSV']} />
          </Field>
          <Field label="Period">
            <Select options={['This term', 'This month', 'Academic year 2026–27']} />
          </Field>
        </div>
        <div className="alert alert-soft-warning fs-12 d-flex align-items-center gap-2 mt-3 mb-0">
          <i className="ti ti-lock" />
          Contains student names and risk scores. Share only with staff who are part of the care team.
        </div>
      </Modal>

      {/* --------------------------- Apply Recommendation ------------------------ */}
      <Modal
        open={active === 'apply_recommendation'}
        onClose={onClose}
        title="Apply Recommendation"
        footer={footerButtons('Apply Recommendation', 'ti ti-check', confirm('Recommendation applied'))}
        className="aix-modal"
        eyebrow={<Eyebrow>Decide</Eyebrow>}
      >
        {topRecommendation && detail ? (
          <div className="border rounded p-3 mb-3">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <h6 className="fs-14 mb-0">{topRecommendation.title}</h6>
              <span className="badge badge-soft-danger">{topRecommendation.urgency}</span>
            </div>
            <span className="fs-12 text-muted">
              {detail.student} · {detail.className} · {topRecommendation.confidence}% confidence
            </span>
            <p className="fs-12 text-muted mb-0 mt-2">{topRecommendation.reasoning}</p>
          </div>
        ) : null}
        <p className="fs-13 text-muted mb-3">
          Applying this opens the workflow, assigns the owner and notifies everyone involved. Nothing is sent
          until you confirm.
        </p>
        <div className="row g-3">
          <Field label="Assign to" span="col-12">
            <Select
              options={[
                `${detail?.teacher ?? 'Teena Mathew'} · Lead Teacher`,
                `${detail?.counselor ?? 'Dr. Anjali Rao'} · Counselor`,
                'Leela Nambiar · Vice Principal',
              ]}
            />
          </Field>
          <Field label="Start">
            <DateField value="03-08-2026" onChange={() => undefined} format="d-m-Y" id="rsk-apply-start" />
          </Field>
          <Field label="Review cadence">
            <Select options={['Weekly', 'Fortnightly', 'Monthly']} />
          </Field>
          <Field label="Note for the owner" span="col-12">
            <textarea className="form-control" rows={2} defaultValue={topRecommendation?.outcome ?? ''} />
          </Field>
        </div>
      </Modal>

      {/* -------------------------- Dismiss Recommendation ----------------------- */}
      <Modal
        open={active === 'dismiss_recommendation'}
        onClose={onClose}
        title="Dismiss Recommendation"
        footer={footerButtons('Dismiss', 'ti ti-x', () => {
          if (!dismissReason) {
            onToast('Say why — it is what improves the next recommendation', 'warning');
            return;
          }
          onClose();
          onToast('Recommendation dismissed');
        })}
        className="aix-modal"
        eyebrow={<Eyebrow>Decide</Eyebrow>}
      >
        {topRecommendation ? (
          <div className="border rounded p-3 mb-3">
            <h6 className="fs-14 mb-0">{topRecommendation.title}</h6>
            <span className="fs-12 text-muted">Dismissing removes it from the queue</span>
          </div>
        ) : null}
        <p className="fs-13 text-muted mb-3">
          Telling the engine why improves future recommendations. Dismissed items stay in the audit trail.
        </p>
        <div className="row g-3">
          <Field label="Reason" span="col-12">
            <select
              className="form-select"
              value={dismissReason}
              onChange={(event) => setDismissReason(event.target.value)}
            >
              <option value="">Choose a reason</option>
              {[
                'Already actioned outside the system',
                'Not appropriate for this student',
                'Family circumstances already known',
                'Duplicate of another recommendation',
                'Disagree with the reasoning',
              ].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
          <Field label="Notes" span="col-12">
            <textarea className="form-control" rows={2} placeholder="What the engine should know for next time." />
          </Field>
        </div>
      </Modal>

      {/* --------------------------- Compare Similar Students -------------------- */}
      <Modal
        open={active === 'compare_students'}
        onClose={onClose}
        title="Compare Similar Students"
        dialogClassName="modal-lg"
        footer={footerButtons('Compare', 'ti ti-arrows-diff', confirm('Comparison run'))}
        className="aix-modal"
        eyebrow={<Eyebrow>Detect</Eyebrow>}
      >
        <p className="fs-13 text-muted mb-3">
          The engine finds students whose signal signature matches, then shows which intervention worked for
          them.
        </p>
        <div className="row g-3 mb-3">
          <Field label="Reference student">
            <Select options={rows.map((item) => `${item.student} · ${item.className}`)} />
          </Field>
          <Field label="Match on">
            <Select
              options={[
                'All five signal groups',
                'Attendance pattern only',
                'Academic trajectory only',
                'Risk score band only',
              ]}
            />
          </Field>
          <Field label="Include">
            <Select options={['Open and closed cases', 'Closed cases only', 'Open cases only']} />
          </Field>
          <Field label="Result size">
            <Select options={['Closest 6 matches', 'Closest 12 matches', 'Every match above 80%']} />
          </Field>
        </div>
        {detail && detail.related.length > 0 ? (
          <>
            <h6 className="fs-14 mb-2">Closest matches for {detail.student}</h6>
            <div className="table-responsive border rounded mb-0">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Outcome</th>
                    <th className="text-center">Match</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.related.map((related) => (
                    <tr key={related.name}>
                      <td className="fs-13">{related.name}</td>
                      <td className="fs-13">{related.className}</td>
                      <td className="fs-12 text-muted">{related.note}</td>
                      <td className="text-center">
                        <span className="badge badge-soft-info">{related.match}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </Modal>

      {/* -------------------------------- Close Case ----------------------------- */}
      <Modal
        open={active === 'close_case'}
        onClose={onClose}
        title="Close Case"
        footer={footerButtons('Close Case', 'ti ti-circle-check', () => {
          if (!closeable) return;
          if (!isCloseableOf(closeable)) {
            onToast(`${closeable.student} is still above the closure threshold`, 'warning');
            return;
          }
          onCloseCase(closeable.id);
          onClose();
          onToast(`${closeable.id} closed`);
        })}
        className="aix-modal"
        eyebrow={<Eyebrow>Track</Eyebrow>}
      >
        {closeable ? (
          <>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 border rounded p-3 mb-3">
              <div>
                <h6 className="fs-14 mb-0">
                  {closeable.student} · {closeable.id}
                </h6>
                <span className="fs-12 text-muted">
                  Score {liveScoreOf(closeable)} · held below threshold for{' '}
                  {closeable.reviews.filter((review) => review.verdict === 'On track').length} reviews
                </span>
              </div>
              <span
                className={`badge badge-soft-${isCloseableOf(closeable) ? 'success' : 'warning'}`}
              >
                {isCloseableOf(closeable) ? 'Eligible' : 'Not yet eligible'}
              </span>
            </div>
            <p className="fs-13 text-muted mb-3">
              {isCloseableOf(closeable)
                ? 'The engine considers this case eligible for closure. It will keep monitoring and reopen automatically if the score climbs again.'
                : `The score is still at ${liveScoreOf(closeable)}. A case becomes eligible once it sits under ${REOPEN_THRESHOLD} and holds below ${CLOSURE_THRESHOLD} for two reviews.`}
            </p>
          </>
        ) : null}
        <div className="row g-3">
          <Field label="Outcome" span="col-12">
            <Select
              options={[
                'Recovered · risk resolved',
                'Recovered with ongoing monitoring',
                'Closed · student transferred',
                'Closed · no longer applicable',
              ]}
            />
          </Field>
          <Field label="Close date">
            <DateField value="01-08-2026" onChange={() => undefined} format="d-m-Y" id="rsk-close-date" />
          </Field>
          <Field label="Reopen threshold">
            <Select
              options={[
                `Score returns above ${REOPEN_THRESHOLD}`,
                'Score returns above 80',
                'Do not reopen automatically',
              ]}
            />
          </Field>
          <Field label="Closing summary" span="col-12">
            <textarea className="form-control" rows={2} placeholder="What resolved it, and what to watch for." />
          </Field>
        </div>
      </Modal>

      {/* ------------------------------ Weekly Review ---------------------------- */}
      <Modal
        open={active === 'weekly_review'}
        onClose={onClose}
        title="Weekly Review"
        footer={footerButtons('Generate Review', 'ti ti-clipboard-check', confirm('Review pack generated'))}
        className="aix-modal"
        eyebrow={<Eyebrow>Act</Eyebrow>}
      >
        <p className="fs-13 text-muted mb-3">
          Every open case is re-scored before the review. Bring the generated summary to the Friday standup.
        </p>
        <div className="row g-3">
          <Field label="Review scope" span="col-12">
            <Select
              options={[
                `All open cases · ${rows.filter((item) => item.status !== 'Closed').length}`,
                `Critical band only · ${criticals}`,
                `High band only · ${highs}`,
              ]}
            />
          </Field>
          <Field label="Review date">
            <DateField value="07-08-2026" onChange={() => undefined} format="d-m-Y" id="rsk-review-date" />
          </Field>
          <Field label="Attendees">
            <Select options={['Full care team', 'Teachers only', 'Counselors only', 'Leadership only']} />
          </Field>
          <Field label="Agenda notes" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              defaultValue={`${criticals} critical and ${highs} high cases to review.`}
            />
          </Field>
        </div>
      </Modal>

      {/* ------------------------------ Add Case Note ---------------------------- */}
      <Modal
        open={active === 'add_case_note'}
        onClose={onClose}
        title="Add Case Note"
        footer={footerButtons('Save Note', 'ti ti-notes', () => {
          if (!detail) return;
          if (!noteTitle.trim()) {
            onToast('Write the note before saving', 'warning');
            return;
          }
          onAddNote(detail.id, noteTitle.trim());
          onClose();
          onToast(`Note added to ${detail.id}`);
        })}
        className="aix-modal"
        eyebrow={<Eyebrow>Track</Eyebrow>}
      >
        {detail ? (
          <div className="border rounded p-3 mb-3">
            <h6 className="fs-14 mb-0">
              {detail.student} · {detail.id}
            </h6>
            <span className="fs-12 text-muted">Notes are written to the student record</span>
          </div>
        ) : null}
        <div className="row g-3">
          <Field label="Note type">
            <Select options={['Observation', 'Meeting record', 'Phone call', 'Decision', 'Escalation']} />
          </Field>
          <Field label="Date">
            <DateField value="01-08-2026" onChange={() => undefined} format="d-m-Y" id="rsk-note-date" />
          </Field>
          <Field label="Visible to" span="col-12">
            <Select options={['Care team only', 'All teaching staff', 'Leadership only']} />
          </Field>
          <Field label="Note" span="col-12">
            <textarea
              className="form-control"
              rows={3}
              value={noteTitle}
              onChange={(event) => setNoteTitle(event.target.value)}
              placeholder="What happened, and what it means for the case."
            />
          </Field>
        </div>
      </Modal>

      {/* ----------------------------- All Open Cases ---------------------------- */}
      <Modal
        open={active === 'view_all_cases'}
        onClose={onClose}
        title="All Open Cases"
        className="aix-modal"
        eyebrow={<Eyebrow>Detect</Eyebrow>}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={confirm('Case list exported')}>
              <i className="ti ti-file-export me-1" />
              Export
            </button>
          </>
        }
      >
        <div className="row g-3 mb-3">
          <Field label="Risk level">
            <Select
              options={['All risk levels', 'Critical', 'High', 'Medium']}
              value={tableBand}
              onChange={setTableBand}
            />
          </Field>
          <Field label="Stage">
            <Select options={['All stages', ...new Set(rows.map((item) => item.stage))]} />
          </Field>
        </div>
        <div className="table-responsive border rounded mb-0">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Case</th>
                <th>Student</th>
                <th>Class</th>
                <th>Primary risk</th>
                <th className="text-center">Score</th>
                <th>Severity</th>
                <th className="text-center">Confidence</th>
                <th>Stage</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((item) => (
                <tr key={item.id}>
                  <td className="fs-13">{item.id}</td>
                  <td className="fs-13">{item.student}</td>
                  <td className="fs-13">{item.className.replace('Class ', '')}</td>
                  <td className="fs-12 text-muted">{item.primaryRisk}</td>
                  <td className="text-center fs-13 fw-semibold">{item.score}</td>
                  <td>
                    <span className={`badge badge-soft-${bandTint[bandOf(item)]}`}>{bandOf(item)}</span>
                  </td>
                  <td className="text-center fs-13">{item.confidence}%</td>
                  <td className="fs-12 text-muted">{item.stage}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => {
                        onClose();
                        onOpenCase(item);
                      }}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
};

export default RiskModals;
