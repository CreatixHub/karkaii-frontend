import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { ExitPass } from '../data/passes.data';
import {
  REGISTER_TIME,
  approvalPairsOf,
  authorityOptions,
  consentMethodOptions,
  decisionOptions,
  delayReasonOptions,
  durationLabel,
  expectedLabelOf,
  gateOptions,
  guardianPairsOf,
  holderOptions,
  minutesOf,
  officerOptions,
  personChoices,
  reasonBadge,
  reasonIcon,
  reasonOptions,
  returnConditionOptions,
  returnExpectedOptions,
  returnStatusOf,
  statusBadge,
  statusOf,
  timelineOf,
  verificationOptions,
} from '../data/passes.data';

export type PassModalId = 'issue' | 'edit' | 'decision' | 'checkout' | 'return' | 'view';

export interface PassDraft {
  holder: string;
  person: string;
  department: string;
  reason: string;
  detail: string;
  exitDate: string;
  exitTime: string;
  expectedReturn: string;
  gate: string;
  returnExpectedOn: string;
  authority: string;
  consent: string;
  collectedBy: string;
  notes: string;
  printQr: boolean;
  alertOnReturn: boolean;
}

export const emptyDraft: PassDraft = {
  holder: holderOptions[0], person: '', department: '', reason: reasonOptions[0], detail: '',
  exitDate: '31-07-2026', exitTime: '11:20', expectedReturn: '15:00', gate: gateOptions[0],
  returnExpectedOn: returnExpectedOptions[0], authority: authorityOptions[0],
  consent: consentMethodOptions[0], collectedBy: '', notes: '',
  printQr: true, alertOnReturn: true,
};

export const draftOf = (row: ExitPass): PassDraft => ({
  holder: row.personType,
  person: personChoices.find((choice) => choice.startsWith(row.name)) ?? '',
  department: row.department,
  reason: row.reason,
  detail: row.detail,
  exitDate: '31-07-2026',
  exitTime: row.exitTime || row.plannedExit || REGISTER_TIME,
  expectedReturn: row.expectedTime || '',
  gate: row.gate,
  returnExpectedOn: !row.expectedTime ? 'No return due'
    : row.expectedDate ? 'Specific date' : 'Same day',
  authority: authorityOptions.find((option) => option.startsWith(row.approver)) ?? authorityOptions[0],
  consent: row.guardian
    ? consentMethodOptions.find((option) => option === row.guardian?.method) ?? consentMethodOptions[0]
    : consentMethodOptions[4],
  collectedBy: row.guardian?.name ?? '',
  notes: row.notes,
  printQr: Boolean(row.passNumber),
  alertOnReturn: true,
});

export interface DecisionPayload {
  decision: string;
  authority: string;
  decisionTime: string;
  exitTime: string;
  expectedReturn: string;
  remarks: string;
  issuePass: boolean;
}

export interface CheckOutPayload {
  verification: string;
  exitTime: string;
  gate: string;
  officer: string;
  handoverTo: string;
  remarks: string;
  linkGate: boolean;
}

export interface ReturnPayload {
  condition: string;
  returnDate: string;
  returnTime: string;
  gate: string;
  officer: string;
  delayReason: string;
  remarks: string;
}

export interface PassModalsProps {
  active: PassModalId | null;
  row: ExitPass | null;
  onClose: () => void;
  onIssue: (draft: PassDraft) => void;
  onUpdate: (draft: PassDraft) => void;
  onDecide: (payload: DecisionPayload) => void;
  onCheckOut: (payload: CheckOutPayload) => void;
  onRecordReturn: (payload: ReturnPayload) => void;
  onOpen: (modal: PassModalId) => void;
  onOpenPanel: () => void;
}

const Row = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const PersonStrip = ({ row, children }: { row: ExitPass; children?: ReactNode }) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
    <span className="avatar avatar-md rounded flex-shrink-0">
      <ImageWithBasePath src={row.avatar} className="rounded" alt={row.name} />
    </span>
    <div className="flex-fill overflow-hidden">
      <h5 className="fs-14 mb-0 text-truncate">{row.name}</h5>
      <span className="fs-12 text-muted text-truncate d-block">{row.id} · {row.reference}</span>
    </div>
    {children ?? <span className={statusBadge[statusOf(row)]}>{statusOf(row)}</span>}
  </div>
);

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: PassDraft;
  onField: (field: keyof PassDraft, value: string | boolean) => void;
  suffix: string;
  mode: 'issue' | 'edit';
}

const PassForm = ({ draft, onField, suffix, mode }: FormProps) => {
  /** A staff pass needs no guardian consent, so the field is a statement. */
  const staffPass = draft.holder !== 'Student';
  const noReturn = draft.returnExpectedOn === 'No return due';

  return (
    <>
      {mode === 'issue' ? (
        <div className="mb-3">
          <span className="form-label d-block">Pass holder</span>
          <div className="d-flex flex-wrap gap-3">
            {holderOptions.map((option) => (
              <div className="form-check" key={option}>
                <input
                  className="form-check-input" type="radio" name="pass-holder"
                  id={`iep-${option}${suffix}`} checked={draft.holder === option}
                  onChange={() => onField('holder', option)}
                />
                <label className="form-check-label fs-13" htmlFor={`iep-${option}${suffix}`}>
                  <i
                    className={`ti ${option === 'Student' ? 'ti-school' : option === 'Teacher' ? 'ti-chalkboard' : 'ti-id-badge-2'} me-1`}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="row">
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`ep-person${suffix}`}>Person</label>
          <select
            className="form-select" id={`ep-person${suffix}`}
            value={draft.person} onChange={(event) => onField('person', event.target.value)}
          >
            <option value="">Select person</option>
            {personChoices.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`ep-dept${suffix}`}>Department / Class</label>
          <input
            type="text" className="form-control" id={`ep-dept${suffix}`} placeholder="e.g. Class II B"
            value={draft.department} onChange={(event) => onField('department', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`ep-reason${suffix}`}>Exit Reason</label>
          <select
            className="form-select" id={`ep-reason${suffix}`}
            value={draft.reason} onChange={(event) => onField('reason', event.target.value)}
          >
            {reasonOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`ep-detail${suffix}`}>Reason Detail</label>
          <input
            type="text" className="form-control" id={`ep-detail${suffix}`}
            placeholder="e.g. Specialist appointment"
            value={draft.detail} onChange={(event) => onField('detail', event.target.value)}
          />
        </div></div>
      </div>

      <h6 className="fs-13 mb-2">Exit &amp; Return</h6>
      <div className="row">
        <div className="col-md-3"><div className="mb-3">
          <label className="form-label" htmlFor={`ep-date${suffix}`}>Exit Date</label>
          <DateField
            id={`ep-date${suffix}`} value={draft.exitDate}
            onChange={(next) => onField('exitDate', next)}
          />
        </div></div>
        <div className="col-md-3"><div className="mb-3">
          <label className="form-label" htmlFor={`ep-time${suffix}`}>Exit Time</label>
          <input
            type="time" className="form-control" id={`ep-time${suffix}`}
            value={draft.exitTime} onChange={(event) => onField('exitTime', event.target.value)}
          />
        </div></div>
        <div className="col-md-3"><div className="mb-3">
          <label className="form-label" htmlFor={`ep-return${suffix}`}>Expected Return</label>
          <input
            type="time" className="form-control" id={`ep-return${suffix}`}
            /* Nothing to expect back when the pass closes at the end of the day. */
            disabled={noReturn}
            value={noReturn ? '' : draft.expectedReturn}
            onChange={(event) => onField('expectedReturn', event.target.value)}
          />
        </div></div>
        <div className="col-md-3"><div className="mb-3">
          <label className="form-label" htmlFor={`ep-gate${suffix}`}>Exit Gate</label>
          <select
            className="form-select" id={`ep-gate${suffix}`}
            value={draft.gate} onChange={(event) => onField('gate', event.target.value)}
          >
            {gateOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-12"><div className="mb-3">
          <label className="form-label" htmlFor={`ep-expected-on${suffix}`}>Return Expected On</label>
          <select
            className="form-select" id={`ep-expected-on${suffix}`}
            value={draft.returnExpectedOn}
            onChange={(event) => onField('returnExpectedOn', event.target.value)}
          >
            {returnExpectedOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
      </div>

      <h6 className="fs-13 mb-2">Authorisation</h6>
      <div className="row">
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`ep-authority${suffix}`}>Approving Authority</label>
          <select
            className="form-select" id={`ep-authority${suffix}`}
            value={draft.authority} onChange={(event) => onField('authority', event.target.value)}
          >
            {authorityOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`ep-consent${suffix}`}>Guardian Consent</label>
          {staffPass ? (
            <input
              type="text" className="form-control" id={`ep-consent${suffix}`}
              value="Not applicable · staff pass" readOnly
            />
          ) : (
            <select
              className="form-select" id={`ep-consent${suffix}`}
              value={draft.consent} onChange={(event) => onField('consent', event.target.value)}
            >
              {consentMethodOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          )}
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`ep-collected${suffix}`}>Collected By</label>
          <input
            type="text" className="form-control" id={`ep-collected${suffix}`}
            placeholder="e.g. Mrs. Janet Gourley" disabled={staffPass}
            value={staffPass ? '' : draft.collectedBy}
            onChange={(event) => onField('collectedBy', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`ep-doc${suffix}`}>Supporting Document</label>
          <input type="file" className="form-control" id={`ep-doc${suffix}`} />
        </div></div>
        <div className="col-md-12"><div className="mb-3">
          <label className="form-label" htmlFor={`ep-notes${suffix}`}>Internal Notes</label>
          <textarea
            className="form-control" rows={2} id={`ep-notes${suffix}`}
            placeholder="Visible to the office and the security desk only"
            value={draft.notes} onChange={(event) => onField('notes', event.target.value)}
          />
        </div></div>
        <div className="col-md-12">
          {mode === 'issue' ? (
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input" type="checkbox" role="switch" id={`epQr${suffix}`}
                checked={draft.printQr} onChange={(event) => onField('printQr', event.target.checked)}
              />
              <label className="form-check-label fs-13" htmlFor={`epQr${suffix}`}>
                Print the pass with a QR code for the gate scan
              </label>
            </div>
          ) : null}
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input" type="checkbox" role="switch" id={`epAlert${suffix}`}
              checked={draft.alertOnReturn}
              onChange={(event) => onField('alertOnReturn', event.target.checked)}
            />
            <label className="form-check-label fs-13" htmlFor={`epAlert${suffix}`}>
              {mode === 'issue'
                ? 'Raise an alert if the return is not scanned by the expected time'
                : 'Clear the overdue flag once the new return time is saved'}
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

/* --------------------------------- Modals ---------------------------------- */

const PassModals = ({
  active, row, onClose, onIssue, onUpdate, onDecide, onCheckOut, onRecordReturn,
  onOpen, onOpenPanel,
}: PassModalsProps) => {
  const [draft, setDraft] = useState<PassDraft>(emptyDraft);

  const [decision, setDecision] = useState(decisionOptions[0]);
  const [decisionAuthority, setDecisionAuthority] = useState(authorityOptions[0]);
  const [decisionTime, setDecisionTime] = useState(REGISTER_TIME);
  const [approvedExit, setApprovedExit] = useState('16:00');
  const [decisionReturn, setDecisionReturn] = useState(returnExpectedOptions[0]);
  const [decisionRemarks, setDecisionRemarks] = useState('');
  const [autoIssue, setAutoIssue] = useState(true);
  const [notifyDecision, setNotifyDecision] = useState(true);

  const [verification, setVerification] = useState(verificationOptions[0]);
  const [actualExit, setActualExit] = useState(REGISTER_TIME);
  const [exitGate, setExitGate] = useState(gateOptions[0]);
  const [exitOfficer, setExitOfficer] = useState(officerOptions[0]);
  const [handoverTo, setHandoverTo] = useState('');
  const [gateRemarks, setGateRemarks] = useState('');
  const [linkGate, setLinkGate] = useState(true);
  const [smsDeparture, setSmsDeparture] = useState(true);

  const [condition, setCondition] = useState(returnConditionOptions[0]);
  const [returnDate, setReturnDate] = useState('31-07-2026');
  const [returnTime, setReturnTime] = useState(REGISTER_TIME);
  const [returnGate, setReturnGate] = useState(gateOptions[0]);
  const [verifiedBy, setVerifiedBy] = useState(officerOptions[0]);
  const [delayReason, setDelayReason] = useState(delayReasonOptions[0]);
  const [returnRemarks, setReturnRemarks] = useState('');
  const [closePass, setClosePass] = useState(true);
  const [logDelay, setLogDelay] = useState(false);

  useEffect(() => {
    if (active === 'issue') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (!row) return;
    if (active === 'decision') {
      setDecision(decisionOptions[0]);
      setDecisionTime(REGISTER_TIME);
      setApprovedExit(row.expectedTime || '16:00');
      setDecisionReturn(row.expectedTime ? returnExpectedOptions[0] : returnExpectedOptions[3]);
      setDecisionRemarks('');
    }
    if (active === 'checkout') {
      setVerification(verificationOptions[0]);
      setActualExit(row.plannedExit || REGISTER_TIME);
      setExitGate(row.gate);
      setHandoverTo(row.guardian?.name ?? '');
      setGateRemarks('');
    }
    if (active === 'return') {
      setReturnTime(REGISTER_TIME);
      setReturnGate(row.gate);
      setReturnRemarks('');
    }
  }, [active, row]);

  const field = (key: keyof PassDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  /** Recounted from the return time being entered, not a fixed figure. */
  const offCampusAtReturn = row && row.exitTime
    ? Math.max(0, minutesOf(returnTime) - minutesOf(row.exitTime))
    : 0;
  const lateBy = row && row.exitTime && row.expectedTime
    ? Math.max(0, minutesOf(returnTime) - minutesOf(row.expectedTime))
    : 0;

  const queued = row && !row.approvedAt && !row.rejected
    ? Math.max(0, minutesOf(REGISTER_TIME) - minutesOf(row.requestedAt))
    : 0;

  return (
    <>
      {/* Issue Exit Pass */}
      <Modal
        open={active === 'issue'}
        onClose={onClose}
        title="Issue Exit Pass"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onIssue(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Issue Exit Pass</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">Raise a campus exit authorisation</p>
        <PassForm draft={draft} onField={field} suffix="" mode="issue" />
      </Modal>

      {/* Edit Exit Pass */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Exit Pass"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.id}  •  {row.name}  •  {statusOf(row).toLowerCase()}
            </p>
            {returnStatusOf(row) === 'Overdue' ? (
              <div className="alert alert-warning d-flex align-items-center mb-3">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">
                  Extending the expected return clears the overdue flag and closes the alert raised
                  with administration.
                </span>
              </div>
            ) : null}
            <PassForm draft={draft} onField={field} suffix="-2" mode="edit" />
          </>
        ) : null}
      </Modal>

      {/* Approve / Reject */}
      <Modal
        open={active === 'decision' && row !== null}
        onClose={onClose}
        title="Approve / Reject Request"
        onSubmit={(event) => {
          event.preventDefault();
          onDecide({
            decision, authority: decisionAuthority, decisionTime,
            exitTime: approvedExit, expectedReturn: decisionReturn,
            remarks: decisionRemarks, issuePass: autoIssue,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-circle-check me-1" />Save Decision
            </button>
          </>
        }
      >
        {row ? (
          <>
            <PersonStrip row={row} />
            <div className="border rounded p-3 mb-3">
              <Row label="Exit Reason" value={row.reason} />
              <Row label="Requested At" value={row.requestedAt} />
              <Row label="Guardian Consent" value={row.guardian ? row.guardian.method : 'Not applicable'} />
              {/* How long the request has been waiting, counted from its stamp. */}
              <Row label="In Queue" value={queued > 0 ? durationLabel(queued) : 'Decided'} last />
            </div>

            {row.approvedAt || row.rejected ? (
              <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-info-circle fs-16" />
                <span className="fs-13">
                  This request was already {row.rejected ? 'rejected' : 'approved'} at{' '}
                  {row.rejectedAt || row.approvedAt}.
                </span>
              </div>
            ) : null}

            <div className="mb-3">
              <span className="form-label d-block">Decision</span>
              <div className="d-flex flex-wrap gap-3">
                {decisionOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="decision"
                      id={`apr-${option}`} checked={decision === option}
                      onChange={() => setDecision(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`apr-${option}`}>
                      <i
                        className={`ti ${option === 'Approve' ? 'ti-circle-check' : option === 'Hold' ? 'ti-clock' : 'ti-circle-x'} me-1`}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="decision-authority">Approving Authority</label>
                <select
                  className="form-select" id="decision-authority"
                  value={decisionAuthority} onChange={(event) => setDecisionAuthority(event.target.value)}
                >
                  {authorityOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="decision-time">Decision Time</label>
                <input
                  type="time" className="form-control" id="decision-time"
                  value={decisionTime} onChange={(event) => setDecisionTime(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="approved-exit-time">Approved Exit Time</label>
                <input
                  type="time" className="form-control" id="approved-exit-time"
                  disabled={decision === 'Reject'}
                  value={approvedExit} onChange={(event) => setApprovedExit(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="decision-return">Expected Return</label>
                <select
                  className="form-select" id="decision-return" disabled={decision === 'Reject'}
                  value={decisionReturn} onChange={(event) => setDecisionReturn(event.target.value)}
                >
                  {returnExpectedOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="decision-remarks">Decision Remarks</label>
                <textarea
                  className="form-control" rows={2} id="decision-remarks"
                  placeholder="Recorded on the approval timeline"
                  value={decisionRemarks} onChange={(event) => setDecisionRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="aprIssue"
                    disabled={decision === 'Reject'}
                    checked={autoIssue && decision !== 'Reject'}
                    onChange={(event) => setAutoIssue(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="aprIssue">
                    Issue the exit pass automatically on approval
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="aprNotify"
                    checked={notifyDecision} onChange={(event) => setNotifyDecision(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="aprNotify">
                    Notify the guardian and the security desk of the decision
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Check-Out */}
      <Modal
        open={active === 'checkout' && row !== null}
        onClose={onClose}
        title="Check-Out"
        onSubmit={(event) => {
          event.preventDefault();
          onCheckOut({
            verification, exitTime: actualExit, gate: exitGate,
            officer: exitOfficer, handoverTo, remarks: gateRemarks, linkGate,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-door-exit me-1" />Confirm Check-Out
            </button>
          </>
        }
      >
        {row ? (
          <>
            <PersonStrip row={row}>
              <span className={reasonBadge[row.reason]}>{row.reason}</span>
            </PersonStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Pass Number" value={row.passNumber || 'Not issued'} />
              <Row label="Approved By" value={row.approver || 'Awaiting decision'} />
              <Row label="Planned Exit" value={row.plannedExit || row.exitTime || 'Not set'} last />
            </div>

            {!row.approvedAt ? (
              <div className="alert alert-warning d-flex align-items-center mb-3">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">
                  This request has not been approved yet. Take the decision before checking the pass
                  holder out.
                </span>
              </div>
            ) : null}

            <div className="mb-3">
              <span className="form-label d-block">Gate verification</span>
              <div className="d-flex flex-wrap gap-3">
                {verificationOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="gate-verification"
                      id={`cko-${option}`} checked={verification === option}
                      onChange={() => setVerification(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`cko-${option}`}>
                      <i
                        className={`ti ${option === 'QR Scan' ? 'ti-qrcode' : option === 'ID Card' ? 'ti-id' : 'ti-fingerprint'} me-1`}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="actual-exit-time">Actual Exit Time</label>
                <input
                  type="time" className="form-control" id="actual-exit-time"
                  value={actualExit} onChange={(event) => setActualExit(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="checkout-gate">Exit Gate</label>
                <select
                  className="form-select" id="checkout-gate"
                  value={exitGate} onChange={(event) => setExitGate(event.target.value)}
                >
                  {gateOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="checkout-officer">Gate Officer</label>
                <select
                  className="form-select" id="checkout-officer"
                  value={exitOfficer} onChange={(event) => setExitOfficer(event.target.value)}
                >
                  {officerOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="handover-to">Handover To</label>
                <input
                  type="text" className="form-control" id="handover-to"
                  placeholder="Guardian name for a student pass"
                  disabled={row.personType !== 'Student'}
                  value={row.personType === 'Student' ? handoverTo : ''}
                  onChange={(event) => setHandoverTo(event.target.value)}
                />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="gate-remarks">Gate Remarks</label>
                <textarea
                  className="form-control" rows={2} id="gate-remarks"
                  placeholder="Recorded on the gate register"
                  value={gateRemarks} onChange={(event) => setGateRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="ckoLink"
                    checked={linkGate} onChange={(event) => setLinkGate(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="ckoLink">
                    Create a matching entry on the gate register
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="ckoSms"
                    checked={smsDeparture} onChange={(event) => setSmsDeparture(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="ckoSms">
                    Send a departure confirmation to the guardian
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Record Return */}
      <Modal
        open={active === 'return' && row !== null}
        onClose={onClose}
        title="Record Return"
        onSubmit={(event) => {
          event.preventDefault();
          onRecordReturn({
            condition, returnDate, returnTime, gate: returnGate,
            officer: verifiedBy, delayReason, remarks: returnRemarks,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-arrow-back-up me-1" />Record Return
            </button>
          </>
        }
      >
        {row ? (
          <>
            {lateBy > 0 ? (
              <div className="alert alert-warning d-flex align-items-center mb-3">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">
                  This return was expected at {row.expectedTime} and is {durationLabel(lateBy)} overdue.
                  Record the reason before closing the pass.
                </span>
              </div>
            ) : null}
            <PersonStrip row={row}>
              <span className="fs-12 text-muted text-nowrap">{returnStatusOf(row)}</span>
            </PersonStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Exit Time" value={row.exitTime ? `${row.exitTime} · ${row.lane}` : 'Not checked out'} />
              <Row label="Expected Return" value={expectedLabelOf(row)} />
              {/* Recounted from the return time being entered. */}
              <Row label="Time Off Campus" value={durationLabel(offCampusAtReturn)} last />
            </div>

            {!row.exitTime ? (
              <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-info-circle fs-16" />
                <span className="fs-13">
                  This pass holder has not checked out yet, so there is nothing to return.
                </span>
              </div>
            ) : null}

            <div className="mb-3">
              <span className="form-label d-block">Return condition</span>
              <div className="d-flex flex-wrap gap-3">
                {returnConditionOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="return-condition"
                      id={`rer-${option}`} checked={condition === option}
                      onChange={() => setCondition(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`rer-${option}`}>{option}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="return-date">Return Date</label>
                <DateField id="return-date" value={returnDate} onChange={setReturnDate} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="return-time">Return Time</label>
                <input
                  type="time" className="form-control" id="return-time"
                  value={returnTime} onChange={(event) => setReturnTime(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="return-gate">Return Gate</label>
                <select
                  className="form-select" id="return-gate"
                  value={returnGate} onChange={(event) => setReturnGate(event.target.value)}
                >
                  {gateOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="verified-by">Verified By</label>
                <select
                  className="form-select" id="verified-by"
                  value={verifiedBy} onChange={(event) => setVerifiedBy(event.target.value)}
                >
                  {officerOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              {lateBy > 0 ? (
                <div className="col-md-12"><div className="mb-3">
                  <label className="form-label" htmlFor="delay-reason">Delay Reason</label>
                  <select
                    className="form-select" id="delay-reason"
                    value={delayReason} onChange={(event) => setDelayReason(event.target.value)}
                  >
                    {delayReasonOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </div></div>
              ) : null}
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="return-remarks">Return Remarks</label>
                <textarea
                  className="form-control" rows={2} id="return-remarks"
                  placeholder="Recorded on the exit pass history"
                  value={returnRemarks} onChange={(event) => setReturnRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="rerClose"
                    checked={closePass} onChange={(event) => setClosePass(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="rerClose">
                    Close the pass and clear the overdue alert
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="rerLog"
                    checked={logDelay} onChange={(event) => setLogDelay(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="rerLog">
                    Record the delay on the attendance register
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* View Exit Pass */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.id ?? 'Exit pass'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('return')}>
              <i className="ti ti-arrow-back-up me-1" />Record Return
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-ticket me-1" />Open Exit Pass Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.name}  •  {row.department}  •  31 Jul 2026
            </p>

            <PersonStrip row={row} />

            <div className="row g-3 mb-3">
              {[
                { icon: reasonIcon[row.reason], tint: 'danger', label: 'Reason', value: row.reason },
                { icon: 'ti ti-door-exit', tint: 'info', label: 'Exit Time', value: row.exitTime || 'Not checked out' },
                { icon: 'ti ti-clock', tint: 'warning', label: 'Expected Return', value: expectedLabelOf(row) },
                { icon: 'ti ti-ticket', tint: 'primary', label: 'Pass Number', value: row.passNumber || 'Not issued' },
              ].map((tile) => (
                <div className="col-md-3" key={tile.label}>
                  <div className="border rounded p-3 d-flex align-items-center gap-2">
                    <span className={`avatar avatar-sm bg-${tile.tint}-transparent text-${tile.tint} rounded flex-shrink-0`}>
                      <i className={tile.icon} />
                    </span>
                    <div className="overflow-hidden">
                      <span className="fs-12 text-muted d-block text-truncate">{tile.label}</span>
                      <h6 className="fs-14 mb-0 text-truncate">{tile.value}</h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Approval</h6>
                <div className="border rounded p-3">
                  {approvalPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Guardian Authorisation</h6>
                <div className="border rounded p-3">
                  {row.guardian ? (
                    guardianPairsOf(row).slice(0, 4).map((pair, index, all) => (
                      <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                    ))
                  ) : (
                    <p className="fs-13 text-muted mb-0">
                      Not applicable — staff passes need no guardian consent.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <h6 className="fs-13 mb-2 mt-3">Check-Out &amp; Return Timeline</h6>
            {timelineOf(row).map((entry) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${entry.title}-${entry.meta}`}>
                <span className={`avatar avatar-sm bg-${entry.tint}-transparent text-${entry.tint} rounded flex-shrink-0`}>
                  <i className={entry.icon} />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
                  <span className="fs-12 text-muted text-truncate d-block">{entry.meta}</span>
                </div>
              </div>
            ))}

            <h6 className="fs-13 mb-2 mt-3">Internal Notes</h6>
            <p className="fs-13 text-muted mb-0">{row.notes}</p>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default PassModals;
