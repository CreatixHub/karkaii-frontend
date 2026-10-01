import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import type { Verification } from '../data/verifications.data';
import {
  REGISTER_TIME,
  addMinutes,
  appointmentLabelOf,
  appointmentPairsOf,
  approvalBadge,
  approvalOf,
  checkBadge,
  checkCompletionOptions,
  checkIcon,
  checkSummaryOf,
  clearanceOptions,
  confirmationOptions,
  decisionOptions,
  departmentBadge,
  departmentOptions,
  durationLabel,
  escortOptions,
  gateOptions,
  hostChoices,
  hostPairsOf,
  idBadge,
  idProofOptions,
  idStateOf,
  methodOptions,
  minutesUntilSlot,
  officerOptions,
  overstayOf,
  passStateOf,
  passTypeOptions,
  pendingCountOf,
  validityOptions,
  visitorTypeOptions,
  zoneOptions,
} from '../data/verifications.data';

export type VerificationModalId =
  | 'verify' | 'edit' | 'decision' | 'pass' | 'checkin' | 'view';

export interface VerificationDraft {
  method: string;
  name: string;
  visitorType: string;
  contact: string;
  email: string;
  idProof: string;
  idNumber: string;
  host: string;
  department: string;
  purpose: string;
  gate: string;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
  requestHost: boolean;
  screenList: boolean;
}

export const emptyDraft: VerificationDraft = {
  method: methodOptions[0], name: '', visitorType: visitorTypeOptions[0], contact: '', email: '',
  idProof: idProofOptions[0], idNumber: '', host: hostChoices[0], department: departmentOptions[0],
  purpose: '', gate: gateOptions[0], appointmentDate: '31-07-2026', appointmentTime: '16:30',
  notes: '', requestHost: true, screenList: true,
};

export const draftOf = (row: Verification): VerificationDraft => ({
  method: methodOptions[0],
  name: row.name,
  visitorType: row.visitorType,
  contact: row.contact,
  email: row.email,
  idProof: idProofOptions.find((option) => row.checks[0]?.label.includes(option)) ?? idProofOptions[0],
  idNumber: row.checks[0]?.detail ?? '',
  host: hostChoices.find((choice) => choice.startsWith(row.host)) ?? hostChoices[0],
  department: row.department,
  purpose: row.purpose,
  gate: row.gate,
  appointmentDate: '31-07-2026',
  appointmentTime: row.appointmentTime || '16:30',
  notes: row.notes,
  requestHost: row.approval === 'Pending Host',
  screenList: true,
});

export interface DecisionPayload {
  decision: string;
  confirmedBy: string;
  decisionTime: string;
  method: string;
  clearance: string;
  remarks: string;
  issuePass: boolean;
}

export interface PassPayload {
  passType: string;
  passNumber: string;
  gate: string;
  validFrom: string;
  validUntil: string;
  zones: string;
  issuedBy: string;
  remarks: string;
  voidPrevious: boolean;
}

export interface CheckInPayload {
  completion: string;
  date: string;
  time: string;
  gate: string;
  officer: string;
  validity: string;
  escort: string;
  belongings: string;
}

export interface VerificationModalsProps {
  active: VerificationModalId | null;
  row: Verification | null;
  onClose: () => void;
  onVerify: (draft: VerificationDraft) => void;
  onUpdate: (draft: VerificationDraft) => void;
  onDecide: (payload: DecisionPayload) => void;
  onIssuePass: (payload: PassPayload) => void;
  onCheckIn: (payload: CheckInPayload) => void;
  onOpen: (modal: VerificationModalId) => void;
  onOpenPanel: () => void;
}

const Row = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const VisitorStrip = ({ row, children }: { row: Verification; children?: ReactNode }) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
    <span className={`avatar avatar-md bg-${row.tint}-transparent text-${row.tint} rounded flex-shrink-0`}>
      <i className={row.icon} />
    </span>
    <div className="flex-fill overflow-hidden">
      <h5 className="fs-14 mb-0 text-truncate">{row.name}</h5>
      <span className="fs-12 text-muted text-truncate d-block">{row.id} · {row.reference}</span>
    </div>
    {children ?? <span className={approvalBadge[approvalOf(row)]}>{approvalOf(row)}</span>}
  </div>
);

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: VerificationDraft;
  onField: (field: keyof VerificationDraft, value: string | boolean) => void;
  suffix: string;
  mode: 'verify' | 'edit';
}

const VerificationForm = ({ draft, onField, suffix, mode }: FormProps) => (
  <>
    {mode === 'verify' ? (
      <div className="mb-3">
        <span className="form-label d-block">Verification method</span>
        <div className="d-flex flex-wrap gap-3">
          {methodOptions.map((option) => (
            <div className="form-check" key={option}>
              <input
                className="form-check-input" type="radio" name="verification-method"
                id={`vv-${option}${suffix}`} checked={draft.method === option}
                onChange={() => onField('method', option)}
              />
              <label className="form-check-label fs-13" htmlFor={`vv-${option}${suffix}`}>
                <i
                  className={`ti ${option === 'QR Invite' ? 'ti-qrcode' : option === 'Biometric' ? 'ti-fingerprint' : option === 'Manual' ? 'ti-shield-check' : 'ti-id'} me-1`}
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
        <label className="form-label" htmlFor={`vv-name${suffix}`}>Visitor Name</label>
        <input
          type="text" className="form-control" id={`vv-name${suffix}`}
          placeholder="e.g. Ms. Beatriz Alonso"
          value={draft.name} onChange={(event) => onField('name', event.target.value)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`vv-type${suffix}`}>Visitor Type</label>
        <select
          className="form-select" id={`vv-type${suffix}`}
          value={draft.visitorType} onChange={(event) => onField('visitorType', event.target.value)}
        >
          {visitorTypeOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`vv-contact${suffix}`}>Contact Number</label>
        <input
          type="text" className="form-control" id={`vv-contact${suffix}`}
          placeholder="e.g. +1 55 3372 9908"
          value={draft.contact} onChange={(event) => onField('contact', event.target.value)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`vv-email${suffix}`}>Email</label>
        <input
          type="email" className="form-control" id={`vv-email${suffix}`}
          placeholder="e.g. visitor@example.com"
          value={draft.email} onChange={(event) => onField('email', event.target.value)}
        />
      </div></div>
    </div>

    <h6 className="fs-13 mb-2">Identity</h6>
    <div className="row">
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`vv-proof${suffix}`}>ID Proof</label>
        <select
          className="form-select" id={`vv-proof${suffix}`}
          value={draft.idProof} onChange={(event) => onField('idProof', event.target.value)}
        >
          {idProofOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`vv-idno${suffix}`}>ID Number</label>
        <input
          type="text" className="form-control" id={`vv-idno${suffix}`}
          placeholder="Masked on the register"
          value={draft.idNumber} onChange={(event) => onField('idNumber', event.target.value)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`vv-photo${suffix}`}>Photograph</label>
        <input type="file" className="form-control" id={`vv-photo${suffix}`} />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`vv-copy${suffix}`}>ID Copy</label>
        <input type="file" className="form-control" id={`vv-copy${suffix}`} />
      </div></div>
    </div>

    <h6 className="fs-13 mb-2">Appointment</h6>
    <div className="row">
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`vv-host${suffix}`}>Host</label>
        <select
          className="form-select" id={`vv-host${suffix}`}
          value={draft.host} onChange={(event) => onField('host', event.target.value)}
        >
          {hostChoices.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`vv-dept${suffix}`}>Host Department</label>
        <select
          className="form-select" id={`vv-dept${suffix}`}
          value={draft.department} onChange={(event) => onField('department', event.target.value)}
        >
          {departmentOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`vv-purpose${suffix}`}>Visit Purpose</label>
        <input
          type="text" className="form-control" id={`vv-purpose${suffix}`}
          placeholder="e.g. Admission interview"
          value={draft.purpose} onChange={(event) => onField('purpose', event.target.value)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`vv-gate${suffix}`}>Gate</label>
        <select
          className="form-select" id={`vv-gate${suffix}`}
          value={draft.gate} onChange={(event) => onField('gate', event.target.value)}
        >
          {gateOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`vv-date${suffix}`}>Appointment Date</label>
        <DateField
          id={`vv-date${suffix}`} value={draft.appointmentDate}
          onChange={(next) => onField('appointmentDate', next)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`vv-time${suffix}`}>Appointment Time</label>
        <input
          type="time" className="form-control" id={`vv-time${suffix}`}
          value={draft.appointmentTime}
          onChange={(event) => onField('appointmentTime', event.target.value)}
        />
      </div></div>
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`vv-notes${suffix}`}>Security Notes</label>
        <textarea
          className="form-control" rows={2} id={`vv-notes${suffix}`}
          placeholder="Visible to the security desk only"
          value={draft.notes} onChange={(event) => onField('notes', event.target.value)}
        />
      </div></div>
      <div className="col-md-12">
        <div className="form-check form-switch mb-2">
          <input
            className="form-check-input" type="checkbox" role="switch" id={`vvHost${suffix}`}
            checked={draft.requestHost} onChange={(event) => onField('requestHost', event.target.checked)}
          />
          <label className="form-check-label fs-13" htmlFor={`vvHost${suffix}`}>
            {mode === 'verify'
              ? 'Request host confirmation before the pass is issued'
              : 'Re-run the identity checks once the details are saved'}
          </label>
        </div>
        {mode === 'verify' ? (
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input" type="checkbox" role="switch" id={`vvWatch${suffix}`}
              checked={draft.screenList} onChange={(event) => onField('screenList', event.target.checked)}
            />
            <label className="form-check-label fs-13" htmlFor={`vvWatch${suffix}`}>
              Screen the name against the restricted visitor list
            </label>
          </div>
        ) : null}
      </div>
    </div>
  </>
);

/* --------------------------------- Modals ---------------------------------- */

const VerificationModals = ({
  active, row, onClose, onVerify, onUpdate, onDecide, onIssuePass, onCheckIn,
  onOpen, onOpenPanel,
}: VerificationModalsProps) => {
  const [draft, setDraft] = useState<VerificationDraft>(emptyDraft);

  const [decision, setDecision] = useState(decisionOptions[0]);
  const [confirmedBy, setConfirmedBy] = useState(hostChoices[0]);
  const [decisionTime, setDecisionTime] = useState(REGISTER_TIME);
  const [confirmationMethod, setConfirmationMethod] = useState(confirmationOptions[0]);
  const [clearance, setClearance] = useState(clearanceOptions[0]);
  const [decisionRemarks, setDecisionRemarks] = useState('');
  const [autoIssue, setAutoIssue] = useState(true);
  const [notifyDecision, setNotifyDecision] = useState(true);

  const [passType, setPassType] = useState(passTypeOptions[0]);
  const [passNumber, setPassNumber] = useState('');
  const [passGate, setPassGate] = useState(gateOptions[0]);
  const [validFrom, setValidFrom] = useState(REGISTER_TIME);
  const [passValidity, setPassValidity] = useState(validityOptions[0]);
  const [zones, setZones] = useState(zoneOptions[0]);
  const [issuedBy, setIssuedBy] = useState(officerOptions[0]);
  const [passRemarks, setPassRemarks] = useState('');
  const [printQr, setPrintQr] = useState(true);
  const [voidPrevious, setVoidPrevious] = useState(true);

  const [completion, setCompletion] = useState(checkCompletionOptions[0]);
  const [inDate, setInDate] = useState('31-07-2026');
  const [inTime, setInTime] = useState(REGISTER_TIME);
  const [inGate, setInGate] = useState(gateOptions[0]);
  const [inOfficer, setInOfficer] = useState(officerOptions[0]);
  const [inValidity, setInValidity] = useState(validityOptions[0]);
  const [escort, setEscort] = useState(escortOptions[0]);
  const [belongings, setBelongings] = useState('');
  const [printBadge, setPrintBadge] = useState(true);
  const [linkGate, setLinkGate] = useState(true);

  useEffect(() => {
    if (active === 'verify') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (!row) return;
    if (active === 'decision') {
      setDecision(decisionOptions[0]);
      setConfirmedBy(hostChoices.find((choice) => choice.startsWith(row.host)) ?? hostChoices[0]);
      setDecisionTime(REGISTER_TIME);
      setClearance(clearanceOptions[0]);
      setDecisionRemarks('');
    }
    if (active === 'pass') {
      setPassType(passTypeOptions[0]);
      setPassNumber(`VP-2026-08${89 + Number(row.id.slice(-2) || 0) % 10}`);
      setPassGate(row.gate);
      setValidFrom(REGISTER_TIME);
      setPassValidity(validityOptions[0]);
      setPassRemarks('');
    }
    if (active === 'checkin') {
      setCompletion(checkCompletionOptions[0]);
      setInTime(row.appointmentTime || REGISTER_TIME);
      setInGate(row.gate);
      setInValidity(validityOptions[0]);
      setEscort(/restricted|escorted/i.test(row.clearance) ? escortOptions[0] : escortOptions[1]);
      setBelongings('');
    }
  }, [active, row]);

  const field = (key: keyof VerificationDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const minutesFor = (validity: string) => (validity === '1 hour' ? 60
    : validity === '2 hours' ? 120 : validity === '4 hours' ? 240 : 600);

  /** The window each validity choice produces from the start time. */
  const passUntil = addMinutes(validFrom, minutesFor(passValidity));
  const checkInUntil = addMinutes(inTime, minutesFor(inValidity));

  return (
    <>
      {/* Verify Visitor */}
      <Modal
        open={active === 'verify'}
        onClose={onClose}
        title="Verify Visitor"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onVerify(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Run Verification</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">Run the identity checks and raise a verification record</p>
        <VerificationForm draft={draft} onField={field} suffix="" mode="verify" />
      </Modal>

      {/* Edit Visitor Details */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Visitor Details"
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
              {row.id}  •  {row.name}  •  {checkSummaryOf(row)}
            </p>
            {idStateOf(row) === 'Failed' ? (
              <div className="alert alert-warning d-flex align-items-center mb-3">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">
                  Correcting a failed check re-runs the verification. The rejection stays on the audit
                  log either way.
                </span>
              </div>
            ) : null}
            <VerificationForm draft={draft} onField={field} suffix="-2" mode="edit" />
          </>
        ) : null}
      </Modal>

      {/* Approve / Reject Visit */}
      <Modal
        open={active === 'decision' && row !== null}
        onClose={onClose}
        title="Approve / Reject Visit"
        onSubmit={(event) => {
          event.preventDefault();
          onDecide({
            decision, confirmedBy, decisionTime, method: confirmationMethod,
            clearance, remarks: decisionRemarks, issuePass: autoIssue,
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
            <VisitorStrip row={row}>
              <span className={idBadge[idStateOf(row)]}>{idStateOf(row)}</span>
            </VisitorStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Identity" value={checkSummaryOf(row)} />
              <Row label="Host" value={row.host} />
              <Row label="Purpose" value={row.purpose} />
              <Row
                label="Appointment"
                value={row.appointmentTime
                  ? `${appointmentLabelOf(row)} · in ${durationLabel(Math.max(0, minutesUntilSlot(row)))}`
                  : 'Walk in'}
                last
              />
            </div>

            {idStateOf(row) === 'Failed' ? (
              <div className="alert alert-warning d-flex align-items-center mb-3">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">
                  {row.checks.filter((check) => check.state === 'Failed').length} identity check(s)
                  failed. Approving needs the failed checks corrected first.
                </span>
              </div>
            ) : null}

            <div className="mb-3">
              <span className="form-label d-block">Decision</span>
              <div className="d-flex flex-wrap gap-3">
                {decisionOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="visit-decision"
                      id={`apv-${option}`} checked={decision === option}
                      onChange={() => setDecision(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`apv-${option}`}>
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
                <label className="form-label" htmlFor="confirmed-by">Confirmed By</label>
                <select
                  className="form-select" id="confirmed-by"
                  value={confirmedBy} onChange={(event) => setConfirmedBy(event.target.value)}
                >
                  {hostChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="visit-decision-time">Decision Time</label>
                <input
                  type="time" className="form-control" id="visit-decision-time"
                  value={decisionTime} onChange={(event) => setDecisionTime(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="confirmation-method">Confirmation Method</label>
                <select
                  className="form-select" id="confirmation-method"
                  value={confirmationMethod}
                  onChange={(event) => setConfirmationMethod(event.target.value)}
                >
                  {confirmationOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="security-clearance">Security Clearance</label>
                <select
                  className="form-select" id="security-clearance" disabled={decision === 'Reject'}
                  value={clearance} onChange={(event) => setClearance(event.target.value)}
                >
                  {clearanceOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="visit-decision-remarks">Decision Remarks</label>
                <textarea
                  className="form-control" rows={2} id="visit-decision-remarks"
                  placeholder="Recorded on the verification timeline"
                  value={decisionRemarks} onChange={(event) => setDecisionRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="apvIssue"
                    disabled={decision !== 'Approve'}
                    checked={autoIssue && decision === 'Approve'}
                    onChange={(event) => setAutoIssue(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="apvIssue">
                    Issue the visitor pass automatically on approval
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="apvNotify"
                    checked={notifyDecision} onChange={(event) => setNotifyDecision(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="apvNotify">
                    Notify the visitor and the gate of the decision
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Issue Visitor Pass */}
      <Modal
        open={active === 'pass' && row !== null}
        onClose={onClose}
        title="Issue Visitor Pass"
        onSubmit={(event) => {
          event.preventDefault();
          onIssuePass({
            passType, passNumber, gate: passGate, validFrom, validUntil: passUntil,
            zones, issuedBy, remarks: passRemarks, voidPrevious,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-ticket me-1" />Issue Pass
            </button>
          </>
        }
      >
        {row ? (
          <>
            {overstayOf(row) > 0 ? (
              <div className="alert alert-warning d-flex align-items-center mb-3">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">
                  The previous pass {row.passNumber} expired at {row.passUntil} with no exit scan.
                  Reissuing extends the window.
                </span>
              </div>
            ) : null}
            <VisitorStrip row={row}>
              <span className="fs-12 text-muted text-nowrap">{passStateOf(row)}</span>
            </VisitorStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Checked In" value={row.arrival ? `${row.arrival} · ${row.gate}` : 'Not arrived'} />
              <Row label="Identity" value={`${idStateOf(row)} · ${checkSummaryOf(row)}`} />
              <Row
                label={overstayOf(row) > 0 ? 'Over By' : 'Purpose'}
                value={overstayOf(row) > 0 ? durationLabel(overstayOf(row)) : row.purpose}
                last
              />
            </div>

            <div className="mb-3">
              <span className="form-label d-block">Pass type</span>
              <div className="d-flex flex-wrap gap-3">
                {passTypeOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="visitor-pass-type"
                      id={`ivp-${option}`} checked={passType === option}
                      onChange={() => setPassType(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`ivp-${option}`}>{option}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="visitor-pass-number">Pass Number</label>
                <input
                  type="text" className="form-control" id="visitor-pass-number"
                  value={passNumber} onChange={(event) => setPassNumber(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="visitor-pass-gate">Gate</label>
                <select
                  className="form-select" id="visitor-pass-gate"
                  value={passGate} onChange={(event) => setPassGate(event.target.value)}
                >
                  {gateOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="visitor-valid-from">Valid From</label>
                <input
                  type="time" className="form-control" id="visitor-valid-from"
                  value={validFrom} onChange={(event) => setValidFrom(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="visitor-pass-validity">Validity</label>
                <select
                  className="form-select" id="visitor-pass-validity"
                  value={passValidity} onChange={(event) => setPassValidity(event.target.value)}
                >
                  {validityOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
                {/* The end of the window follows from the start and the choice. */}
                <span className="fs-12 text-muted">Valid to {passUntil}</span>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="visitor-zones">Access Zones</label>
                <select
                  className="form-select" id="visitor-zones"
                  value={zones} onChange={(event) => setZones(event.target.value)}
                >
                  {zoneOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="visitor-issued-by">Issued By</label>
                <select
                  className="form-select" id="visitor-issued-by"
                  value={issuedBy} onChange={(event) => setIssuedBy(event.target.value)}
                >
                  {officerOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="visitor-pass-remarks">Pass Remarks</label>
                <textarea
                  className="form-control" rows={2} id="visitor-pass-remarks"
                  placeholder="Printed on the pass"
                  value={passRemarks} onChange={(event) => setPassRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="ivpQr"
                    checked={printQr} onChange={(event) => setPrintQr(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="ivpQr">
                    Print a QR code for the exit scan
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="ivpVoid"
                    checked={voidPrevious} onChange={(event) => setVoidPrevious(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="ivpVoid">
                    Void the expired pass and close the overstay alert
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Check-In Visitor */}
      <Modal
        open={active === 'checkin' && row !== null}
        onClose={onClose}
        title="Check-In Visitor"
        onSubmit={(event) => {
          event.preventDefault();
          onCheckIn({
            completion, date: inDate, time: inTime, gate: inGate,
            officer: inOfficer, validity: inValidity, escort, belongings,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-door-enter me-1" />Confirm Check-In
            </button>
          </>
        }
      >
        {row ? (
          <>
            <VisitorStrip row={row} />
            <div className="border rounded p-3 mb-3">
              <Row label="Host" value={row.host} />
              <Row
                label="Identity"
                value={pendingCountOf(row) > 0
                  ? `${pendingCountOf(row)} checks pending` : checkSummaryOf(row)}
              />
              <Row label="Appointment" value={row.appointmentTime ? appointmentLabelOf(row) : 'Walk in'} last />
            </div>

            {row.arrival ? (
              <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-info-circle fs-16" />
                <span className="fs-13">This visitor was already checked in at {row.arrival}.</span>
              </div>
            ) : null}

            <div className="mb-3">
              <span className="form-label d-block">Checks completed at the desk</span>
              <div className="d-flex flex-wrap gap-3">
                {checkCompletionOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="check-completion"
                      id={`civ-${option}`} checked={completion === option}
                      onChange={() => setCompletion(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`civ-${option}`}>{option}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="visitor-check-in-date">Check-In Date</label>
                <DateField id="visitor-check-in-date" value={inDate} onChange={setInDate} />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="visitor-check-in-time">Check-In Time</label>
                <input
                  type="time" className="form-control" id="visitor-check-in-time"
                  value={inTime} onChange={(event) => setInTime(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="visitor-check-in-gate">Gate</label>
                <select
                  className="form-select" id="visitor-check-in-gate"
                  value={inGate} onChange={(event) => setInGate(event.target.value)}
                >
                  {gateOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="visitor-check-in-officer">Gate Officer</label>
                <select
                  className="form-select" id="visitor-check-in-officer"
                  value={inOfficer} onChange={(event) => setInOfficer(event.target.value)}
                >
                  {officerOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="visitor-check-in-validity">Pass Validity</label>
                <select
                  className="form-select" id="visitor-check-in-validity"
                  value={inValidity} onChange={(event) => setInValidity(event.target.value)}
                >
                  {validityOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
                <span className="fs-12 text-muted">Pass valid to {checkInUntil}</span>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="visitor-escort">Escort</label>
                <select
                  className="form-select" id="visitor-escort"
                  value={escort} onChange={(event) => setEscort(event.target.value)}
                >
                  {escortOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="visitor-belongings">Belongings Declared</label>
                <textarea
                  className="form-control" rows={2} id="visitor-belongings"
                  placeholder="Recorded on the gate register"
                  value={belongings} onChange={(event) => setBelongings(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="civPass"
                    checked={printBadge} onChange={(event) => setPrintBadge(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="civPass">
                    Print the visitor badge with the photograph
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="civGate"
                    checked={linkGate} onChange={(event) => setLinkGate(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="civGate">
                    Create a matching entry on the gate register
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* View Verification */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.id ?? 'Verification'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('pass')}>
              <i className="ti ti-ticket me-1" />Issue Pass
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-user-check me-1" />Open Verification Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.name}  •  {row.reference.split('·')[0].trim()}  •  31 Jul 2026
            </p>

            <VisitorStrip row={row} />

            <div className="row g-3 mb-3">
              {[
                { icon: 'ti ti-id', tint: 'info', label: 'Identity', value: checkSummaryOf(row) },
                { icon: 'ti ti-calendar-event', tint: 'warning', label: 'Appointment', value: row.appointmentTime ? appointmentLabelOf(row) : 'Walk in' },
                { icon: 'ti ti-clock', tint: 'primary', label: 'Arrival', value: row.arrival || 'Not arrived' },
                { icon: 'ti ti-ticket', tint: 'success', label: 'Pass', value: passStateOf(row) },
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
                <h6 className="fs-13 mb-2">Host Information</h6>
                <div className="border rounded p-3">
                  {hostPairsOf(row).slice(0, 4).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Appointment Details</h6>
                <div className="border rounded p-3">
                  {appointmentPairsOf(row).slice(0, 4).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
            </div>

            <h6 className="fs-13 mb-2 mt-3">Identity Documents</h6>
            {row.checks.map((check) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={check.label}>
                <span className="avatar avatar-sm bg-light text-muted rounded flex-shrink-0">
                  <i className={checkIcon[check.state]} />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{check.label}</h6>
                  <span className="fs-12 text-muted text-truncate d-block">{check.detail}</span>
                </div>
                <span className={checkBadge[check.state]}>{check.state}</span>
              </div>
            ))}

            <h6 className="fs-13 mb-2 mt-3">Security Notes</h6>
            <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
              <span className={departmentBadge[row.department]}>{row.department}</span>
              <span className="badge badge-soft-secondary">{row.clearance}</span>
            </div>
            <p className="fs-13 text-muted mb-0">{row.notes}</p>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default VerificationModals;
