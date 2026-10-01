import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import type { GatePass } from '../data/passes.data';
import {
  REGISTER_TIME,
  addMinutes,
  checkBadge,
  checkIcon,
  checkSummaryOf,
  decisionOptions,
  durationText,
  extensionAuthorityOptions,
  extensionOptions,
  extensionReasonOptions,
  gateOptions,
  holderPairsOf,
  hostChoices,
  hostPairsOf,
  idBadge,
  idProofOptions,
  idStateOf,
  issueTypeOptions,
  minutesOf,
  minutesToExpiryOf,
  minutesToOpenOf,
  officerOptions,
  passPairsOf,
  passTypeBadge,
  personTypeOptions,
  readerOptions,
  resultOptions,
  revokeAuthorityOptions,
  revokeReasonOptions,
  revokeScopeOptions,
  statusBadge,
  statusOf,
  timelineOf,
  vehicleTypeOptions,
  verifyMethodOptions,
  windowOf,
  windowPairsOf,
  zoneOptions,
} from '../data/passes.data';

export type GatePassModalId =
  | 'issue' | 'edit' | 'approve' | 'verify' | 'extend' | 'revoke' | 'view';

export interface GatePassDraft {
  issueType: string;
  passNumber: string;
  holder: string;
  personType: string;
  contact: string;
  gate: string;
  zones: string;
  validDate: string;
  validFrom: string;
  validUntil: string;
  host: string;
  purpose: string;
  vehicleType: string;
  registration: string;
  idProof: string;
  issuedBy: string;
  notes: string;
  printQr: boolean;
  alertOnReturn: boolean;
}

export const emptyDraft: GatePassDraft = {
  issueType: issueTypeOptions[0], passNumber: '', holder: '',
  personType: personTypeOptions[0], contact: '', gate: gateOptions[0], zones: zoneOptions[0],
  validDate: '31-07-2026', validFrom: '16:30', validUntil: '18:30',
  host: hostChoices[0], purpose: '', vehicleType: vehicleTypeOptions[0], registration: '',
  idProof: idProofOptions[0], issuedBy: officerOptions[0], notes: '',
  printQr: true, alertOnReturn: true,
};

export const draftOf = (row: GatePass): GatePassDraft => ({
  issueType: row.passType === 'Vehicle Pass' ? 'Vehicle'
    : row.passType === 'Student Exit Pass' ? 'Student'
      : row.passType === 'Temporary Pass' ? 'Temporary' : 'Visitor',
  passNumber: row.id,
  holder: row.holder,
  personType: row.personType,
  contact: row.contact,
  gate: row.gate,
  zones: zoneOptions.find((option) => option === row.accessZones) ?? zoneOptions[0],
  validDate: '31-07-2026',
  validFrom: row.validFrom,
  validUntil: row.validUntil,
  host: hostChoices.find((choice) => choice.startsWith(row.host)) ?? hostChoices[0],
  purpose: row.purpose,
  vehicleType: row.vehicle
    ? vehicleTypeOptions.find((option) => option === row.vehicle?.type) ?? vehicleTypeOptions[1]
    : vehicleTypeOptions[0],
  registration: row.vehicle?.registration ?? '',
  idProof: idProofOptions.find((option) => option === row.idProof) ?? idProofOptions[0],
  issuedBy: officerOptions.find((option) => option.startsWith(row.issuedBy)) ?? officerOptions[0],
  notes: row.notes,
  printQr: true,
  alertOnReturn: true,
});

export interface ApprovePayload {
  decision: string;
  approvedBy: string;
  decisionTime: string;
  validFrom: string;
  validUntil: string;
  remarks: string;
  printPass: boolean;
}

export interface VerifyPayload {
  method: string;
  verifiedAt: string;
  reader: string;
  verifiedBy: string;
  result: string;
  remarks: string;
}

export interface ExtendPayload {
  preset: string;
  newValidUntil: string;
  authorisedBy: string;
  reason: string;
  remarks: string;
  clearAlert: boolean;
}

export interface RevokePayload {
  scope: string;
  revokedAt: string;
  authorisedBy: string;
  reason: string;
  remarks: string;
  blockReaders: boolean;
}

export interface GatePassModalsProps {
  active: GatePassModalId | null;
  row: GatePass | null;
  onClose: () => void;
  onIssue: (draft: GatePassDraft) => void;
  onUpdate: (draft: GatePassDraft) => void;
  onApprove: (payload: ApprovePayload) => void;
  onVerify: (payload: VerifyPayload) => void;
  onExtend: (payload: ExtendPayload) => void;
  onRevoke: (payload: RevokePayload) => void;
  onOpen: (modal: GatePassModalId) => void;
  onOpenPanel: () => void;
}

const Row = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const PassStrip = ({ row, children }: { row: GatePass; children?: ReactNode }) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
    <span className={`avatar avatar-md bg-${row.tint}-transparent text-${row.tint} rounded flex-shrink-0`}>
      <i className={row.icon} />
    </span>
    <div className="flex-fill overflow-hidden">
      <h5 className="fs-14 mb-0 text-truncate">{row.holder}</h5>
      <span className="fs-12 text-muted text-truncate d-block">{row.id} · {row.passType}</span>
    </div>
    {children ?? <span className={statusBadge[statusOf(row)]}>{statusOf(row)}</span>}
  </div>
);

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: GatePassDraft;
  onField: (field: keyof GatePassDraft, value: string | boolean) => void;
  suffix: string;
  mode: 'issue' | 'edit';
}

const GatePassForm = ({ draft, onField, suffix, mode }: FormProps) => {
  /** The window the two times produce, printed so it cannot go unnoticed. */
  const span = Math.max(0, minutesOf(draft.validUntil) - minutesOf(draft.validFrom));
  const onFoot = draft.vehicleType === vehicleTypeOptions[0];

  return (
    <>
      {mode === 'issue' ? (
        <div className="mb-3">
          <span className="form-label d-block">Pass type</span>
          <div className="d-flex flex-wrap gap-3">
            {issueTypeOptions.map((option) => (
              <div className="form-check" key={option}>
                <input
                  className="form-check-input" type="radio" name="issue-type"
                  id={`igp-${option}${suffix}`} checked={draft.issueType === option}
                  onChange={() => onField('issueType', option)}
                />
                <label className="form-check-label fs-13" htmlFor={`igp-${option}${suffix}`}>
                  <i
                    className={`ti ${option === 'Vehicle' ? 'ti-car' : option === 'Student' ? 'ti-school' : option === 'Temporary' ? 'ti-clock' : 'ti-ticket'} me-1`}
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
          <label className="form-label" htmlFor={`gp-no${suffix}`}>Pass Number</label>
          <input
            type="text" className="form-control" id={`gp-no${suffix}`}
            placeholder="Generated on issue"
            value={draft.passNumber} onChange={(event) => onField('passNumber', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`gp-holder${suffix}`}>Holder Name</label>
          <input
            type="text" className="form-control" id={`gp-holder${suffix}`}
            placeholder="e.g. Ms. Beatriz Alonso"
            value={draft.holder} onChange={(event) => onField('holder', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`gp-person${suffix}`}>Person Type</label>
          <select
            className="form-select" id={`gp-person${suffix}`}
            value={draft.personType} onChange={(event) => onField('personType', event.target.value)}
          >
            {personTypeOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`gp-contact${suffix}`}>Contact Number</label>
          <input
            type="text" className="form-control" id={`gp-contact${suffix}`}
            placeholder="e.g. +1 55 3372 9908"
            value={draft.contact} onChange={(event) => onField('contact', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`gp-gate${suffix}`}>Gate</label>
          <select
            className="form-select" id={`gp-gate${suffix}`}
            value={draft.gate} onChange={(event) => onField('gate', event.target.value)}
          >
            {gateOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`gp-zones${suffix}`}>Access Zones</label>
          <select
            className="form-select" id={`gp-zones${suffix}`}
            value={draft.zones} onChange={(event) => onField('zones', event.target.value)}
          >
            {zoneOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`gp-date${suffix}`}>Valid Date</label>
          <DateField
            id={`gp-date${suffix}`} value={draft.validDate}
            onChange={(next) => onField('validDate', next)}
          />
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`gp-from${suffix}`}>Valid From</label>
          <input
            type="time" className="form-control" id={`gp-from${suffix}`}
            value={draft.validFrom} onChange={(event) => onField('validFrom', event.target.value)}
          />
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`gp-until${suffix}`}>Valid Until</label>
          <input
            type="time" className="form-control" id={`gp-until${suffix}`}
            value={draft.validUntil} onChange={(event) => onField('validUntil', event.target.value)}
          />
          {/* The window the two times produce. */}
          <span className={`fs-12 ${span === 0 ? 'text-danger' : 'text-muted'}`}>
            {span === 0 ? 'The window has no length' : `${durationText(span)} window`}
          </span>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`gp-host${suffix}`}>Host</label>
          <select
            className="form-select" id={`gp-host${suffix}`}
            value={draft.host} onChange={(event) => onField('host', event.target.value)}
          >
            {hostChoices.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`gp-purpose${suffix}`}>Purpose</label>
          <input
            type="text" className="form-control" id={`gp-purpose${suffix}`}
            placeholder="e.g. Admission interview"
            value={draft.purpose} onChange={(event) => onField('purpose', event.target.value)}
          />
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`gp-vehicle${suffix}`}>Vehicle Type</label>
          <select
            className="form-select" id={`gp-vehicle${suffix}`}
            value={draft.vehicleType} onChange={(event) => onField('vehicleType', event.target.value)}
          >
            {vehicleTypeOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`gp-reg${suffix}`}>Registration No</label>
          <input
            type="text" className="form-control" id={`gp-reg${suffix}`}
            placeholder="Leave blank if on foot" disabled={onFoot}
            value={onFoot ? '' : draft.registration}
            onChange={(event) => onField('registration', event.target.value)}
          />
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`gp-proof${suffix}`}>ID Proof</label>
          <select
            className="form-select" id={`gp-proof${suffix}`}
            value={draft.idProof} onChange={(event) => onField('idProof', event.target.value)}
          >
            {idProofOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`gp-issuer${suffix}`}>Issued By</label>
          <select
            className="form-select" id={`gp-issuer${suffix}`}
            value={draft.issuedBy} onChange={(event) => onField('issuedBy', event.target.value)}
          >
            {officerOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`gp-photo${suffix}`}>Photograph</label>
          <input type="file" className="form-control" id={`gp-photo${suffix}`} />
        </div></div>
        <div className="col-md-12"><div className="mb-3">
          <label className="form-label" htmlFor={`gp-notes${suffix}`}>Security Notes</label>
          <textarea
            className="form-control" rows={2} id={`gp-notes${suffix}`}
            placeholder="Visible to the security desk only"
            value={draft.notes} onChange={(event) => onField('notes', event.target.value)}
          />
        </div></div>
        <div className="col-md-12">
          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input" type="checkbox" role="switch" id={`gpQr${suffix}`}
              checked={draft.printQr} onChange={(event) => onField('printQr', event.target.checked)}
            />
            <label className="form-check-label fs-13" htmlFor={`gpQr${suffix}`}>
              {mode === 'issue'
                ? 'Print a QR code for gate and corridor readers'
                : 'Notify the gate and the host of the revised details'}
            </label>
          </div>
          {mode === 'issue' ? (
            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input" type="checkbox" role="switch" id={`gpAlert${suffix}`}
                checked={draft.alertOnReturn}
                onChange={(event) => onField('alertOnReturn', event.target.checked)}
              />
              <label className="form-check-label fs-13" htmlFor={`gpAlert${suffix}`}>
                Alert the security desk if the pass is not returned on time
              </label>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

/* --------------------------------- Modals ---------------------------------- */

const GatePassModals = ({
  active, row, onClose, onIssue, onUpdate, onApprove, onVerify, onExtend, onRevoke,
  onOpen, onOpenPanel,
}: GatePassModalsProps) => {
  const [draft, setDraft] = useState<GatePassDraft>(emptyDraft);

  const [decision, setDecision] = useState(decisionOptions[0]);
  const [approvedBy, setApprovedBy] = useState(hostChoices[0]);
  const [decisionTime, setDecisionTime] = useState(REGISTER_TIME);
  const [confirmedFrom, setConfirmedFrom] = useState('16:30');
  const [confirmedUntil, setConfirmedUntil] = useState('18:30');
  const [approveRemarks, setApproveRemarks] = useState('');
  const [printOnApproval, setPrintOnApproval] = useState(true);
  const [notifyDecision, setNotifyDecision] = useState(true);

  const [verifyMethod, setVerifyMethod] = useState(verifyMethodOptions[0]);
  const [verifiedAt, setVerifiedAt] = useState(REGISTER_TIME);
  const [reader, setReader] = useState(readerOptions[0]);
  const [verifiedBy, setVerifiedBy] = useState(officerOptions[0]);
  const [result, setResult] = useState(resultOptions[0]);
  const [verifyRemarks, setVerifyRemarks] = useState('');
  const [addToHistory, setAddToHistory] = useState(true);

  const [preset, setPreset] = useState(extensionOptions[1]);
  const [newUntil, setNewUntil] = useState(REGISTER_TIME);
  const [extendAuthority, setExtendAuthority] = useState(extensionAuthorityOptions[0]);
  const [extendReason, setExtendReason] = useState(extensionReasonOptions[0]);
  const [extendRemarks, setExtendRemarks] = useState('');
  const [clearAlert, setClearAlert] = useState(true);
  const [reprintPass, setReprintPass] = useState(false);

  const [scope, setScope] = useState(revokeScopeOptions[0]);
  const [revokedAt, setRevokedAt] = useState(REGISTER_TIME);
  const [revokeAuthority, setRevokeAuthority] = useState(revokeAuthorityOptions[0]);
  const [revokeReason, setRevokeReason] = useState(revokeReasonOptions[0]);
  const [revokeRemarks, setRevokeRemarks] = useState('');
  const [sendEscort, setSendEscort] = useState(false);
  const [blockReaders, setBlockReaders] = useState(true);

  useEffect(() => {
    if (active === 'issue') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (!row) return;
    if (active === 'approve') {
      setDecision(decisionOptions[0]);
      setApprovedBy(hostChoices.find((choice) => choice.startsWith(row.host)) ?? hostChoices[0]);
      setDecisionTime(REGISTER_TIME);
      setConfirmedFrom(row.validFrom);
      setConfirmedUntil(row.validUntil);
      setApproveRemarks('');
    }
    if (active === 'verify') {
      setVerifyMethod(verifyMethodOptions[0]);
      setVerifiedAt(REGISTER_TIME);
      setReader(readerOptions.find((option) => option.startsWith(row.gate)) ?? readerOptions[0]);
      setVerifyRemarks('');
      // A pass outside its window cannot be a plain valid scan.
      setResult(minutesToExpiryOf(row) < 0 || minutesToOpenOf(row) > 0
        ? resultOptions[2] : resultOptions[0]);
    }
    if (active === 'extend') {
      setPreset(extensionOptions[1]);
      setNewUntil(addMinutes(row.validUntil, 60));
      setExtendRemarks('');
    }
    if (active === 'revoke') {
      setScope(revokeScopeOptions[0]);
      setRevokedAt(REGISTER_TIME);
      setRevokeRemarks('');
    }
  }, [active, row]);

  const field = (key: keyof GatePassDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  /** Each preset lengthens the window from its current close. */
  const presetMinutes = preset === '30 min' ? 30
    : preset === '1 hour' ? 60 : preset === '2 hours' ? 120 : 0;
  const presetUntil = row
    ? (preset === 'End of day' ? '18:00' : addMinutes(row.validUntil, presetMinutes))
    : newUntil;
  const addedMinutes = row
    ? Math.max(0, minutesOf(newUntil) - minutesOf(row.validUntil))
    : 0;

  const confirmedSpan = Math.max(0, minutesOf(confirmedUntil) - minutesOf(confirmedFrom));

  return (
    <>
      {/* Issue Gate Pass */}
      <Modal
        open={active === 'issue'}
        onClose={onClose}
        title="Issue Gate Pass"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onIssue(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Issue Pass</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">Raise a gate pass and open its validity window</p>
        <GatePassForm draft={draft} onField={field} suffix="" mode="issue" />
      </Modal>

      {/* Edit Gate Pass */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Gate Pass"
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
              {row.id}  •  {row.holder}  •  {statusOf(row).toLowerCase()}
            </p>
            <GatePassForm draft={draft} onField={field} suffix="-2" mode="edit" />
          </>
        ) : null}
      </Modal>

      {/* Approve Pass */}
      <Modal
        open={active === 'approve' && row !== null}
        onClose={onClose}
        title="Approve Pass"
        onSubmit={(event) => {
          event.preventDefault();
          onApprove({
            decision, approvedBy, decisionTime,
            validFrom: confirmedFrom, validUntil: confirmedUntil,
            remarks: approveRemarks, printPass: printOnApproval,
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
            <PassStrip row={row}>
              <span className={idBadge[idStateOf(row)]}>{idStateOf(row)}</span>
            </PassStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Identity" value={checkSummaryOf(row)} />
              <Row label="Host" value={`${row.host} · ${row.hostRole}`} />
              <Row label="Draft Window" value={`${row.validFrom} – ${row.validUntil}`} last />
            </div>

            {!row.pendingApproval ? (
              <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-info-circle fs-16" />
                <span className="fs-13">This pass has already been issued — it is {statusOf(row).toLowerCase()}.</span>
              </div>
            ) : null}

            <div className="mb-3">
              <span className="form-label d-block">Decision</span>
              <div className="d-flex flex-wrap gap-3">
                {decisionOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="pass-decision"
                      id={`apg-${option}`} checked={decision === option}
                      onChange={() => setDecision(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`apg-${option}`}>
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
                <label className="form-label" htmlFor="pass-approved-by">Approved By</label>
                <select
                  className="form-select" id="pass-approved-by"
                  value={approvedBy} onChange={(event) => setApprovedBy(event.target.value)}
                >
                  {hostChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="pass-decision-time">Decision Time</label>
                <input
                  type="time" className="form-control" id="pass-decision-time"
                  value={decisionTime} onChange={(event) => setDecisionTime(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="confirmed-valid-from">Confirmed Valid From</label>
                <input
                  type="time" className="form-control" id="confirmed-valid-from"
                  disabled={decision === 'Reject'}
                  value={confirmedFrom} onChange={(event) => setConfirmedFrom(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="confirmed-valid-until">Confirmed Valid Until</label>
                <input
                  type="time" className="form-control" id="confirmed-valid-until"
                  disabled={decision === 'Reject'}
                  value={confirmedUntil} onChange={(event) => setConfirmedUntil(event.target.value)}
                />
                <span className="fs-12 text-muted">{durationText(confirmedSpan)} window</span>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="pass-decision-remarks">Decision Remarks</label>
                <textarea
                  className="form-control" rows={2} id="pass-decision-remarks"
                  placeholder="Recorded on the validity timeline"
                  value={approveRemarks} onChange={(event) => setApproveRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="apgPrint"
                    disabled={decision !== 'Approve'}
                    checked={printOnApproval && decision === 'Approve'}
                    onChange={(event) => setPrintOnApproval(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="apgPrint">
                    Print the pass at the reception desk on approval
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="apgNotify"
                    checked={notifyDecision} onChange={(event) => setNotifyDecision(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="apgNotify">
                    Notify the holder and the gate of the decision
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Verify Pass */}
      <Modal
        open={active === 'verify' && row !== null}
        onClose={onClose}
        title="Verify Pass"
        onSubmit={(event) => {
          event.preventDefault();
          onVerify({
            method: verifyMethod, verifiedAt, reader, verifiedBy, result, remarks: verifyRemarks,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-qrcode me-1" />Record Verification
            </button>
          </>
        }
      >
        {row ? (
          <>
            <PassStrip row={row} />
            <div className="border rounded p-3 mb-3">
              <Row label="Window" value={`${row.validFrom} – ${row.validUntil}`} />
              <Row label="Access Zones" value={row.accessZones} />
              <Row
                label="Window State"
                value={minutesToOpenOf(row) > 0 ? `Opens in ${durationText(minutesToOpenOf(row))}`
                  : minutesToExpiryOf(row) < 0 ? `Closed ${durationText(-minutesToExpiryOf(row))} ago`
                    : `Expires in ${durationText(minutesToExpiryOf(row))}`}
                last
              />
            </div>

            <div className="mb-3">
              <span className="form-label d-block">Verification method</span>
              <div className="d-flex flex-wrap gap-3">
                {verifyMethodOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="verify-method"
                      id={`vfp-${option}`} checked={verifyMethod === option}
                      onChange={() => setVerifyMethod(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`vfp-${option}`}>
                      <i
                        className={`ti ${option === 'ID Check' ? 'ti-id' : option === 'Biometric' ? 'ti-fingerprint' : 'ti-qrcode'} me-1`}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="verified-at">Verified At</label>
                <input
                  type="time" className="form-control" id="verified-at"
                  value={verifiedAt} onChange={(event) => setVerifiedAt(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="reader-checkpoint">Reader / Checkpoint</label>
                <select
                  className="form-select" id="reader-checkpoint"
                  value={reader} onChange={(event) => setReader(event.target.value)}
                >
                  {readerOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="pass-verified-by">Verified By</label>
                <select
                  className="form-select" id="pass-verified-by"
                  value={verifiedBy} onChange={(event) => setVerifiedBy(event.target.value)}
                >
                  {officerOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="verification-result">Verification Result</label>
                <select
                  className="form-select" id="verification-result"
                  value={result} onChange={(event) => setResult(event.target.value)}
                >
                  {resultOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="verification-remarks">Verification Remarks</label>
                <textarea
                  className="form-control" rows={2} id="verification-remarks"
                  placeholder="Written to the verification history"
                  value={verifyRemarks} onChange={(event) => setVerifyRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="vfpHistory"
                    checked={addToHistory} onChange={(event) => setAddToHistory(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="vfpHistory">
                    Add the scan to the pass verification history
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Extend Validity */}
      <Modal
        open={active === 'extend' && row !== null}
        onClose={onClose}
        title="Extend Validity"
        onSubmit={(event) => {
          event.preventDefault();
          onExtend({
            preset, newValidUntil: newUntil, authorisedBy: extendAuthority,
            reason: extendReason, remarks: extendRemarks, clearAlert,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-clock me-1" />Extend Validity
            </button>
          </>
        }
      >
        {row ? (
          <>
            {minutesToExpiryOf(row) < 0 && !row.returnedAt ? (
              <div className="alert alert-warning d-flex align-items-center mb-3">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">
                  This window closed at {row.validUntil}, {durationText(-minutesToExpiryOf(row))} ago,
                  with no return scan. Extending it reopens the pass.
                </span>
              </div>
            ) : null}
            <PassStrip row={row} />
            <div className="border rounded p-3 mb-3">
              <Row label="Current Window" value={`${row.validFrom} – ${row.validUntil}`} />
              <Row label="Window Length" value={durationText(windowOf(row))} />
              <Row label="Gate" value={`${row.gate} · ${row.lane}`} last />
            </div>

            <div className="mb-3">
              <span className="form-label d-block">Extend by</span>
              <div className="d-flex flex-wrap gap-3">
                {extensionOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="extension-preset"
                      id={`exv-${option}`} checked={preset === option}
                      onChange={() => {
                        setPreset(option);
                        // The new close follows from the preset, not a free guess.
                        setNewUntil(option === 'End of day' ? '18:00'
                          : addMinutes(row.validUntil,
                            option === '30 min' ? 30 : option === '1 hour' ? 60 : 120));
                      }}
                    />
                    <label className="form-check-label fs-13" htmlFor={`exv-${option}`}>{option}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="new-valid-until">New Valid Until</label>
                <input
                  type="time" className="form-control" id="new-valid-until"
                  value={newUntil} onChange={(event) => setNewUntil(event.target.value)}
                />
                <span className={`fs-12 ${addedMinutes === 0 ? 'text-warning' : 'text-muted'}`}>
                  {addedMinutes === 0
                    ? 'The new time does not extend the window'
                    : `${durationText(addedMinutes)} longer · preset gives ${presetUntil}`}
                </span>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="extend-authority">Authorised By</label>
                <select
                  className="form-select" id="extend-authority"
                  value={extendAuthority} onChange={(event) => setExtendAuthority(event.target.value)}
                >
                  {extensionAuthorityOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="extension-reason">Extension Reason</label>
                <select
                  className="form-select" id="extension-reason"
                  value={extendReason} onChange={(event) => setExtendReason(event.target.value)}
                >
                  {extensionReasonOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="extend-remarks">Remarks</label>
                <textarea
                  className="form-control" rows={2} id="extend-remarks"
                  placeholder="Written to the validity timeline"
                  value={extendRemarks} onChange={(event) => setExtendRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="exvClear"
                    checked={clearAlert} onChange={(event) => setClearAlert(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="exvClear">
                    Clear the overstay alert raised at the {row.gate.toLowerCase()}
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="exvReprint"
                    checked={reprintPass} onChange={(event) => setReprintPass(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="exvReprint">
                    Reprint the pass with the revised window
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Revoke Pass */}
      <Modal
        open={active === 'revoke' && row !== null}
        onClose={onClose}
        title="Revoke Pass"
        onSubmit={(event) => {
          event.preventDefault();
          onRevoke({
            scope, revokedAt, authorisedBy: revokeAuthority,
            reason: revokeReason, remarks: revokeRemarks, blockReaders,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-danger">
              <i className="ti ti-shield-x me-1" />Revoke Pass
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-warning d-flex align-items-center mb-3">
              <i className="ti ti-alert-triangle me-2" />
              <span className="fs-13">
                Revoking withdraws access at every reader and is written to the security audit trail.
              </span>
            </div>
            <PassStrip row={row} />
            <div className="border rounded p-3 mb-3">
              <Row label="Window" value={`${row.validFrom} – ${row.validUntil}`} />
              <Row label="Holder" value={`${row.holder} · ${row.personType}`} />
              <Row label="Access Zones" value={row.accessZones} last />
            </div>

            {row.revoked ? (
              <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-info-circle fs-16" />
                <span className="fs-13">This pass was already revoked at {row.revokedAt}.</span>
              </div>
            ) : null}

            <div className="mb-3">
              <span className="form-label d-block">Revocation scope</span>
              <div className="d-flex flex-wrap gap-3">
                {revokeScopeOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="revoke-scope"
                      id={`rvp-${option}`} checked={scope === option}
                      onChange={() => setScope(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`rvp-${option}`}>{option}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="revoked-at">Revoked At</label>
                <input
                  type="time" className="form-control" id="revoked-at"
                  value={revokedAt} onChange={(event) => setRevokedAt(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="revoke-authority">Authorised By</label>
                <select
                  className="form-select" id="revoke-authority"
                  value={revokeAuthority} onChange={(event) => setRevokeAuthority(event.target.value)}
                >
                  {revokeAuthorityOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="revoke-reason">Reason</label>
                <select
                  className="form-select" id="revoke-reason"
                  value={revokeReason} onChange={(event) => setRevokeReason(event.target.value)}
                >
                  {revokeReasonOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="revocation-remarks">Revocation Remarks</label>
                <textarea
                  className="form-control" rows={2} id="revocation-remarks"
                  placeholder="Written to the security audit trail"
                  value={revokeRemarks} onChange={(event) => setRevokeRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="rvpEscort"
                    checked={sendEscort} onChange={(event) => setSendEscort(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="rvpEscort">
                    Send a gate officer to escort the holder off campus
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="rvpBlock"
                    checked={blockReaders} onChange={(event) => setBlockReaders(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="rvpBlock">
                    Block the pass at every gate and corridor reader
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* View Gate Pass */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.id ?? 'Gate pass'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('verify')}>
              <i className="ti ti-qrcode me-1" />Verify Pass
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-ticket me-1" />Open Gate Pass Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.holder}  •  {row.reference.split('·')[0].trim()}  •  {row.date}
            </p>

            <PassStrip row={row} />

            <div className="row g-3 mb-3">
              {[
                { icon: 'ti ti-ticket', tint: 'primary', label: 'Valid From', value: row.validFrom },
                { icon: 'ti ti-clock', tint: 'warning', label: 'Valid Until', value: row.pendingApproval ? 'On approval' : row.validUntil },
                { icon: 'ti ti-hourglass', tint: 'info', label: 'Window', value: durationText(windowOf(row)) },
                { icon: 'ti ti-shield-check', tint: 'success', label: 'Verification', value: idStateOf(row) },
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
                <h6 className="fs-13 mb-2">Pass Information</h6>
                <div className="border rounded p-3">
                  {passPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Holder Details</h6>
                <div className="border rounded p-3">
                  {holderPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Host &amp; Department</h6>
                <div className="border rounded p-3">
                  {hostPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Validity Window</h6>
                <div className="border rounded p-3">
                  {windowPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
            </div>

            <h6 className="fs-13 mb-2 mt-3">Validity Timeline</h6>
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

            <h6 className="fs-13 mb-2 mt-3">Verification History</h6>
            {row.checks.map((check) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={check.label}>
                <span className="avatar avatar-sm bg-light text-muted rounded flex-shrink-0">
                  <i className={checkIcon[check.state]} />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0">{check.label}</h6>
                </div>
                <span className={checkBadge[check.state]}>{check.state}</span>
              </div>
            ))}

            <h6 className="fs-13 mb-2 mt-3">Security Notes</h6>
            <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
              <span className={passTypeBadge[row.passType]}>{row.passType}</span>
              <span className={idBadge[idStateOf(row)]}>{idStateOf(row)}</span>
            </div>
            <p className="fs-13 text-muted mb-0">{row.notes}</p>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default GatePassModals;
