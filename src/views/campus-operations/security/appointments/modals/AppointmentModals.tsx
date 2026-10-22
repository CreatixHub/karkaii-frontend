import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import type { AppointmentRequest } from '../data/appointments.data';
import {
  REGISTER_TIME,
  appointmentPairsOf,
  checkBadge,
  checkIcon,
  checkSummaryOf,
  decisionOptions,
  departmentBadge,
  departmentOptions,
  durationText,
  escortOptions,
  gateOptions,
  hostChoices,
  hostPairsOf,
  idBadge,
  idProofOptions,
  idStateOf,
  minutesOf,
  minutesToStartOf,
  notifyOptions,
  officerOptions,
  passPairsOf,
  passZoneOptions,
  personTypeOptions,
  rejectReasonOptions,
  rescheduleReasonOptions,
  requestedSubLabelOf,
  statusBadge,
  statusOf,
  timelineOf,
  typeBadge,
  typeIcon,
  visitorPairsOf,
} from '../data/appointments.data';

export type AppointmentModalId =
  | 'schedule' | 'edit' | 'decision' | 'reschedule' | 'pass' | 'view';

export interface AppointmentDraft {
  quickType: string;
  requestId: string;
  visitor: string;
  personType: string;
  contact: string;
  email: string;
  visitDate: string;
  slotFrom: string;
  slotUntil: string;
  host: string;
  department: string;
  purpose: string;
  reference: string;
  idProof: string;
  idNumber: string;
  partySize: string;
  gate: string;
  escort: string;
  notes: string;
  sendToHost: boolean;
  prepareDraftPass: boolean;
}

export const emptyDraft: AppointmentDraft = {
  quickType: 'Parent', requestId: '', visitor: '', personType: personTypeOptions[0],
  contact: '', email: '', visitDate: '05-08-2026', slotFrom: '10:00', slotUntil: '11:00',
  host: hostChoices[0], department: departmentOptions[0], purpose: '', reference: '',
  idProof: idProofOptions[0], idNumber: '', partySize: '1 person', gate: gateOptions[0],
  escort: escortOptions[1], notes: '', sendToHost: true, prepareDraftPass: true,
};

const partySizeOptions = ['1 person', '2 people', '3 people', '4 people or more'];

export const draftOf = (row: AppointmentRequest): AppointmentDraft => ({
  quickType: row.appointmentType === 'Admission Interview' ? 'Admission'
    : row.appointmentType === 'Vendor Visit' ? 'Vendor'
      : row.appointmentType === 'Official Visit' ? 'Official' : 'Parent',
  requestId: row.id,
  visitor: row.visitor,
  personType: personTypeOptions.find((option) => option === row.personType) ?? personTypeOptions[0],
  contact: row.contact,
  email: '',
  visitDate: '31-07-2026',
  slotFrom: row.slotFrom,
  slotUntil: row.slotUntil,
  host: hostChoices.find((choice) => choice.startsWith(row.host)) ?? hostChoices[0],
  department: row.department,
  purpose: row.purpose,
  reference: row.purposeDetail,
  idProof: idProofOptions.find((option) => option === row.idProof) ?? idProofOptions[0],
  idNumber: row.idNumber,
  partySize: partySizeOptions[Math.min(3, Math.max(0, row.partySize - 1))],
  gate: row.gate,
  escort: row.escortRequired ? escortOptions[0] : escortOptions[1],
  notes: row.notes,
  sendToHost: !row.decision,
  prepareDraftPass: row.passStatus === 'Draft Prepared',
});

export interface DecisionPayload {
  decision: string;
  decidedBy: string;
  confirmedFrom: string;
  confirmedUntil: string;
  rejectionReason: string;
  remarks: string;
  releasePass: boolean;
}

export interface ReschedulePayload {
  requestedBy: string;
  newDate: string;
  newFrom: string;
  newUntil: string;
  host: string;
  reason: string;
  remarks: string;
  carryChecks: boolean;
}

export interface PassPayload {
  passType: string;
  passNumber: string;
  gate: string;
  issuedBy: string;
  validFrom: string;
  validUntil: string;
  zones: string;
  printQr: boolean;
  holdAtDesk: boolean;
}

export interface AppointmentModalsProps {
  active: AppointmentModalId | null;
  row: AppointmentRequest | null;
  onClose: () => void;
  onSchedule: (draft: AppointmentDraft) => void;
  onUpdate: (draft: AppointmentDraft) => void;
  onDecide: (payload: DecisionPayload) => void;
  onReschedule: (payload: ReschedulePayload) => void;
  onIssuePass: (payload: PassPayload) => void;
  onOpen: (modal: AppointmentModalId) => void;
  onOpenPanel: () => void;
}

const Row = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const RequestStrip = ({ row, children }: { row: AppointmentRequest; children?: ReactNode }) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
    <span className="avatar avatar-md bg-primary-transparent text-primary rounded flex-shrink-0">
      <i className={typeIcon[row.appointmentType]} />
    </span>
    <div className="flex-fill overflow-hidden">
      <h5 className="fs-14 mb-0 text-truncate">{row.visitor}</h5>
      <span className="fs-12 text-muted text-truncate d-block">{row.id} · {row.reference}</span>
    </div>
    {children ?? <span className={statusBadge[statusOf(row)]}>{statusOf(row)}</span>}
  </div>
);

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: AppointmentDraft;
  onField: (field: keyof AppointmentDraft, value: string | boolean) => void;
  suffix: string;
  mode: 'schedule' | 'edit';
}

const AppointmentForm = ({ draft, onField, suffix, mode }: FormProps) => {
  /** The slot the two times produce, printed so it cannot go unnoticed. */
  const span = Math.max(0, minutesOf(draft.slotUntil) - minutesOf(draft.slotFrom));

  return (
    <>
      {mode === 'schedule' ? (
        <div className="mb-3">
          <span className="form-label d-block">Appointment type</span>
          <div className="d-flex flex-wrap gap-3">
            {['Parent', 'Admission', 'Vendor', 'Official'].map((option) => (
              <div className="form-check" key={option}>
                <input
                  className="form-check-input" type="radio" name="appointment-quick-type"
                  id={`sap-${option}${suffix}`} checked={draft.quickType === option}
                  onChange={() => onField('quickType', option)}
                />
                <label className="form-check-label fs-13" htmlFor={`sap-${option}${suffix}`}>
                  <i
                    className={`ti ${option === 'Admission' ? 'ti-school' : option === 'Vendor' ? 'ti-package' : option === 'Official' ? 'ti-building' : 'ti-users'} me-1`}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="row">
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`ap-id${suffix}`}>Request ID</label>
          <input
            type="text" className="form-control" id={`ap-id${suffix}`}
            placeholder="Generated on save"
            value={draft.requestId} onChange={(event) => onField('requestId', event.target.value)}
          />
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`ap-visitor${suffix}`}>Visitor Name</label>
          <input
            type="text" className="form-control" id={`ap-visitor${suffix}`}
            placeholder="e.g. Ms. Beatriz Alonso"
            value={draft.visitor} onChange={(event) => onField('visitor', event.target.value)}
          />
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`ap-person${suffix}`}>Person Type</label>
          <select
            className="form-select" id={`ap-person${suffix}`}
            value={draft.personType} onChange={(event) => onField('personType', event.target.value)}
          >
            {personTypeOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`ap-contact${suffix}`}>Contact Number</label>
          <input
            type="text" className="form-control" id={`ap-contact${suffix}`}
            placeholder="e.g. +1 55 3372 9908"
            value={draft.contact} onChange={(event) => onField('contact', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`ap-email${suffix}`}>Email</label>
          <input
            type="email" className="form-control" id={`ap-email${suffix}`}
            placeholder="e.g. name@example.com"
            value={draft.email} onChange={(event) => onField('email', event.target.value)}
          />
        </div></div>
      </div>

      <h6 className="fs-13 mb-2">Slot &amp; Host</h6>
      <div className="row">
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`ap-date${suffix}`}>Visit Date</label>
          <DateField
            id={`ap-date${suffix}`} value={draft.visitDate}
            onChange={(next) => onField('visitDate', next)}
          />
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`ap-from${suffix}`}>From</label>
          <input
            type="time" className="form-control" id={`ap-from${suffix}`}
            value={draft.slotFrom} onChange={(event) => onField('slotFrom', event.target.value)}
          />
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`ap-until${suffix}`}>Until</label>
          <input
            type="time" className="form-control" id={`ap-until${suffix}`}
            value={draft.slotUntil} onChange={(event) => onField('slotUntil', event.target.value)}
          />
          {/* The slot the two times produce. */}
          <span className={`fs-12 ${span === 0 ? 'text-danger' : 'text-muted'}`}>
            {span === 0 ? 'The slot has no length' : `${durationText(span)} slot`}
          </span>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`ap-host${suffix}`}>Host</label>
          <select
            className="form-select" id={`ap-host${suffix}`}
            value={draft.host} onChange={(event) => onField('host', event.target.value)}
          >
            {hostChoices.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`ap-dept${suffix}`}>Host Department</label>
          <select
            className="form-select" id={`ap-dept${suffix}`}
            value={draft.department} onChange={(event) => onField('department', event.target.value)}
          >
            {departmentOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`ap-purpose${suffix}`}>Purpose of Visit</label>
          <input
            type="text" className="form-control" id={`ap-purpose${suffix}`}
            placeholder="e.g. Grade VI admission interview"
            value={draft.purpose} onChange={(event) => onField('purpose', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`ap-ref${suffix}`}>Reference</label>
          <input
            type="text" className="form-control" id={`ap-ref${suffix}`}
            placeholder="Booking, order or service reference"
            value={draft.reference} onChange={(event) => onField('reference', event.target.value)}
          />
        </div></div>
      </div>

      <h6 className="fs-13 mb-2">Identity &amp; Entry</h6>
      <div className="row">
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`ap-proof${suffix}`}>ID Proof</label>
          <select
            className="form-select" id={`ap-proof${suffix}`}
            value={draft.idProof} onChange={(event) => onField('idProof', event.target.value)}
          >
            {idProofOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`ap-idno${suffix}`}>ID Number</label>
          <input
            type="text" className="form-control" id={`ap-idno${suffix}`} placeholder="Masked on save"
            value={draft.idNumber} onChange={(event) => onField('idNumber', event.target.value)}
          />
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`ap-party${suffix}`}>Party Size</label>
          <select
            className="form-select" id={`ap-party${suffix}`}
            value={draft.partySize} onChange={(event) => onField('partySize', event.target.value)}
          >
            {partySizeOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`ap-gate${suffix}`}>Entry Gate</label>
          <select
            className="form-select" id={`ap-gate${suffix}`}
            value={draft.gate} onChange={(event) => onField('gate', event.target.value)}
          >
            {gateOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`ap-escort${suffix}`}>Escort</label>
          <select
            className="form-select" id={`ap-escort${suffix}`}
            value={draft.escort} onChange={(event) => onField('escort', event.target.value)}
          >
            {escortOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-12"><div className="mb-3">
          <label className="form-label" htmlFor={`ap-doc${suffix}`}>Supporting Document</label>
          <input type="file" className="form-control" id={`ap-doc${suffix}`} />
        </div></div>
        <div className="col-md-12"><div className="mb-3">
          <label className="form-label" htmlFor={`ap-notes${suffix}`}>Internal Notes</label>
          <textarea
            className="form-control" rows={2} id={`ap-notes${suffix}`}
            placeholder="Visible to the host and the security desk only"
            value={draft.notes} onChange={(event) => onField('notes', event.target.value)}
          />
        </div></div>
        <div className="col-md-12">
          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input" type="checkbox" role="switch" id={`apHost${suffix}`}
              checked={draft.sendToHost} onChange={(event) => onField('sendToHost', event.target.checked)}
            />
            <label className="form-check-label fs-13" htmlFor={`apHost${suffix}`}>
              {mode === 'schedule'
                ? 'Send the request to the host for approval'
                : 'Notify the visitor and the host of the revised details'}
            </label>
          </div>
          {mode === 'schedule' ? (
            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input" type="checkbox" role="switch" id={`apPass${suffix}`}
                checked={draft.prepareDraftPass}
                onChange={(event) => onField('prepareDraftPass', event.target.checked)}
              />
              <label className="form-check-label fs-13" htmlFor={`apPass${suffix}`}>
                Prepare a draft gate pass for the visit day
              </label>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

/* --------------------------------- Modals ---------------------------------- */

const AppointmentModals = ({
  active, row, onClose, onSchedule, onUpdate, onDecide, onReschedule, onIssuePass,
  onOpen, onOpenPanel,
}: AppointmentModalsProps) => {
  const [draft, setDraft] = useState<AppointmentDraft>(emptyDraft);

  const [decision, setDecision] = useState(decisionOptions[0]);
  const [decidedBy, setDecidedBy] = useState(hostChoices[0]);
  const [confirmedFrom, setConfirmedFrom] = useState('16:30');
  const [confirmedUntil, setConfirmedUntil] = useState('18:30');
  const [rejectionReason, setRejectionReason] = useState(rejectReasonOptions[0]);
  const [decisionRemarks, setDecisionRemarks] = useState('');
  const [releasePass, setReleasePass] = useState(true);
  const [notifyVisitor, setNotifyVisitor] = useState(notifyOptions[2]);

  const [requestedBy, setRequestedBy] = useState('Host');
  const [newDate, setNewDate] = useState('06-08-2026');
  const [newFrom, setNewFrom] = useState('11:00');
  const [newUntil, setNewUntil] = useState('11:45');
  const [newHost, setNewHost] = useState(hostChoices[0]);
  const [rescheduleReason, setRescheduleReason] = useState(rescheduleReasonOptions[0]);
  const [rescheduleRemarks, setRescheduleRemarks] = useState('');
  const [carryChecks, setCarryChecks] = useState(true);
  const [sendNewSlot, setSendNewSlot] = useState(true);

  const [passType, setPassType] = useState('Visitor');
  const [passNumber, setPassNumber] = useState('');
  const [passGate, setPassGate] = useState(gateOptions[0]);
  const [issuedBy, setIssuedBy] = useState(officerOptions[0]);
  const [passFrom, setPassFrom] = useState('10:00');
  const [passUntil, setPassUntil] = useState('13:00');
  const [zones, setZones] = useState(passZoneOptions[0]);
  const [printQr, setPrintQr] = useState(true);
  const [holdAtDesk, setHoldAtDesk] = useState(true);

  useEffect(() => {
    if (active === 'schedule') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (!row) return;
    if (active === 'decision') {
      setDecision(decisionOptions[0]);
      setDecidedBy(hostChoices.find((choice) => choice.startsWith(row.host)) ?? hostChoices[0]);
      setConfirmedFrom(row.slotFrom);
      setConfirmedUntil(row.slotUntil);
      setDecisionRemarks('');
    }
    if (active === 'reschedule') {
      setRequestedBy('Host');
      setNewFrom(row.slotFrom);
      setNewUntil(row.slotUntil);
      setNewHost(hostChoices.find((choice) => choice.startsWith(row.host)) ?? hostChoices[0]);
      setRescheduleRemarks('');
    }
    if (active === 'pass') {
      setPassType(row.appointmentType === 'Vendor Visit' ? 'Vehicle' : 'Visitor');
      setPassNumber(row.passNumber || `VP-2026-09${12 + Number(row.id.slice(-2)) % 10}`);
      setPassGate(row.gate);
      setPassFrom(row.slotFrom);
      setPassUntil(row.slotUntil);
    }
  }, [active, row]);

  const field = (key: keyof AppointmentDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const confirmedSpan = Math.max(0, minutesOf(confirmedUntil) - minutesOf(confirmedFrom));
  const rescheduleSpan = Math.max(0, minutesOf(newUntil) - minutesOf(newFrom));
  const passSpan = Math.max(0, minutesOf(passUntil) - minutesOf(passFrom));

  return (
    <>
      {/* Schedule Appointment */}
      <Modal
        open={active === 'schedule'}
        onClose={onClose}
        title="Schedule Appointment"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onSchedule(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Schedule Appointment</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">Raise an appointment request and send it to the host</p>
        <AppointmentForm draft={draft} onField={field} suffix="" mode="schedule" />
      </Modal>

      {/* Edit Appointment */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Appointment"
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
              {row.id}  •  {row.visitor}  •  {statusOf(row).toLowerCase()}
            </p>
            <AppointmentForm draft={draft} onField={field} suffix="-2" mode="edit" />
          </>
        ) : null}
      </Modal>

      {/* Approve / Reject Request */}
      <Modal
        open={active === 'decision' && row !== null}
        onClose={onClose}
        title="Approve / Reject Request"
        onSubmit={(event) => {
          event.preventDefault();
          onDecide({
            decision, decidedBy, confirmedFrom, confirmedUntil,
            rejectionReason, remarks: decisionRemarks, releasePass,
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
            <RequestStrip row={row}>
              <span className={idBadge[idStateOf(row)]}>{idStateOf(row)}</span>
            </RequestStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Requested" value={requestedSubLabelOf(row)} />
              <Row label="Identity" value={checkSummaryOf(row)} />
              <Row label="Requested Slot" value={`${row.slotFrom} – ${row.slotUntil} · ${row.visitDate}`} last />
            </div>

            {idStateOf(row) === 'Failed' ? (
              <div className="alert alert-warning d-flex align-items-center mb-3">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">
                  Identity checks have failed on this request. Approving needs them corrected first.
                </span>
              </div>
            ) : null}

            <div className="mb-3">
              <span className="form-label d-block">Decision</span>
              <div className="d-flex flex-wrap gap-3">
                {decisionOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="appointment-decision"
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
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="apt-decided-by">Decided By</label>
                <select
                  className="form-select" id="apt-decided-by"
                  value={decidedBy} onChange={(event) => setDecidedBy(event.target.value)}
                >
                  {hostChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="apt-confirmed-from">Confirmed From</label>
                <input
                  type="time" className="form-control" id="apt-confirmed-from"
                  disabled={decision === 'Reject'}
                  value={confirmedFrom} onChange={(event) => setConfirmedFrom(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="apt-confirmed-until">Confirmed Until</label>
                <input
                  type="time" className="form-control" id="apt-confirmed-until"
                  disabled={decision === 'Reject'}
                  value={confirmedUntil} onChange={(event) => setConfirmedUntil(event.target.value)}
                />
                <span className="fs-12 text-muted">{durationText(confirmedSpan)} slot</span>
              </div></div>
              {/* The reason only applies to a rejection. */}
              {decision === 'Reject' ? (
                <div className="col-md-12"><div className="mb-3">
                  <label className="form-label" htmlFor="apt-rejection-reason">Rejection Reason</label>
                  <select
                    className="form-select" id="apt-rejection-reason"
                    value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)}
                  >
                    {rejectReasonOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </div></div>
              ) : null}
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="apt-decision-remarks">Decision Remarks</label>
                <textarea
                  className="form-control" rows={2} id="apt-decision-remarks"
                  placeholder="Recorded on the approval timeline"
                  value={decisionRemarks} onChange={(event) => setDecisionRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="apt-notify">Notify The Visitor By</label>
                <select
                  className="form-select" id="apt-notify"
                  value={notifyVisitor} onChange={(event) => setNotifyVisitor(event.target.value)}
                >
                  {notifyOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="aprRelease"
                    disabled={decision !== 'Approve'}
                    checked={releasePass && decision === 'Approve'}
                    onChange={(event) => setReleasePass(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="aprRelease">
                    Release the draft gate pass to the reception desk
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Reschedule Appointment */}
      <Modal
        open={active === 'reschedule' && row !== null}
        onClose={onClose}
        title="Reschedule Appointment"
        onSubmit={(event) => {
          event.preventDefault();
          onReschedule({
            requestedBy, newDate, newFrom, newUntil, host: newHost,
            reason: rescheduleReason, remarks: rescheduleRemarks, carryChecks,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-calendar-time me-1" />Reschedule
            </button>
          </>
        }
      >
        {row ? (
          <>
            <RequestStrip row={row} />
            <div className="border rounded p-3 mb-3">
              <Row label="Current Slot" value={`${row.visitDate} · ${row.slotFrom} – ${row.slotUntil}`} />
              <Row label="Host" value={`${row.host} · ${row.hostRole}`} />
              <Row
                label="Starts In"
                value={minutesToStartOf(row) > 0
                  ? durationText(minutesToStartOf(row)) : 'The slot has already begun'}
                last
              />
            </div>

            <div className="mb-3">
              <span className="form-label d-block">Requested by</span>
              <div className="d-flex flex-wrap gap-3">
                {['Host', 'Visitor', 'Administration'].map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="reschedule-by"
                      id={`rsa-${option}`} checked={requestedBy === option}
                      onChange={() => setRequestedBy(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`rsa-${option}`}>
                      <i
                        className={`ti ${option === 'Visitor' ? 'ti-users' : option === 'Administration' ? 'ti-building' : 'ti-user'} me-1`}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="new-visit-date">New Visit Date</label>
                <DateField id="new-visit-date" value={newDate} onChange={setNewDate} />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="new-from">New From</label>
                <input
                  type="time" className="form-control" id="new-from"
                  value={newFrom} onChange={(event) => setNewFrom(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="new-until">New Until</label>
                <input
                  type="time" className="form-control" id="new-until"
                  value={newUntil} onChange={(event) => setNewUntil(event.target.value)}
                />
                <span className={`fs-12 ${rescheduleSpan === 0 ? 'text-danger' : 'text-muted'}`}>
                  {rescheduleSpan === 0 ? 'The slot has no length' : `${durationText(rescheduleSpan)} slot`}
                </span>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="reschedule-host">Host</label>
                <select
                  className="form-select" id="reschedule-host"
                  value={newHost} onChange={(event) => setNewHost(event.target.value)}
                >
                  {hostChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="reschedule-reason">Reason</label>
                <select
                  className="form-select" id="reschedule-reason"
                  value={rescheduleReason} onChange={(event) => setRescheduleReason(event.target.value)}
                >
                  {rescheduleReasonOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="reschedule-remarks">Remarks</label>
                <textarea
                  className="form-control" rows={2} id="reschedule-remarks"
                  placeholder="Written to the approval timeline"
                  value={rescheduleRemarks} onChange={(event) => setRescheduleRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="rsaCarry"
                    checked={carryChecks} onChange={(event) => setCarryChecks(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="rsaCarry">
                    Carry the completed identity checks over to the new slot
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="rsaSend"
                    checked={sendNewSlot} onChange={(event) => setSendNewSlot(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="rsaSend">
                    Send the new slot to the visitor for confirmation
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Issue Gate Pass */}
      <Modal
        open={active === 'pass' && row !== null}
        onClose={onClose}
        title="Issue Gate Pass"
        onSubmit={(event) => {
          event.preventDefault();
          onIssuePass({
            passType, passNumber, gate: passGate, issuedBy,
            validFrom: passFrom, validUntil: passUntil, zones, printQr, holdAtDesk,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-ticket me-1" />Issue Gate Pass
            </button>
          </>
        }
      >
        {row ? (
          <>
            <RequestStrip row={row}>
              <span className={typeBadge[row.appointmentType]}>{row.appointmentType}</span>
            </RequestStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Approved Slot" value={`${row.visitDate} · ${row.slotFrom} – ${row.slotUntil}`} />
              <Row label="Party Size" value={`${row.partySize} ${row.partySize === 1 ? 'person' : 'people'}`} />
              <Row label="Escort" value={row.escortRequired ? 'Required' : 'Not required'} last />
            </div>

            {statusOf(row) === 'Pending Approval' ? (
              <div className="alert alert-warning d-flex align-items-center mb-3">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">
                  This request has not been approved yet. The pass stays a draft until the host
                  confirms the slot.
                </span>
              </div>
            ) : null}

            <div className="mb-3">
              <span className="form-label d-block">Pass type</span>
              <div className="d-flex flex-wrap gap-3">
                {['Visitor', 'Vehicle', 'Temporary'].map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="apt-pass-type"
                      id={`igp-${option}`} checked={passType === option}
                      onChange={() => setPassType(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`igp-${option}`}>
                      <i
                        className={`ti ${option === 'Vehicle' ? 'ti-car' : option === 'Temporary' ? 'ti-clock' : 'ti-ticket'} me-1`}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="apt-pass-number">Pass Number</label>
                <input
                  type="text" className="form-control" id="apt-pass-number"
                  value={passNumber} onChange={(event) => setPassNumber(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="apt-pass-gate">Entry Gate</label>
                <select
                  className="form-select" id="apt-pass-gate"
                  value={passGate} onChange={(event) => setPassGate(event.target.value)}
                >
                  {gateOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="apt-issued-by">Issued By</label>
                <select
                  className="form-select" id="apt-issued-by"
                  value={issuedBy} onChange={(event) => setIssuedBy(event.target.value)}
                >
                  {officerOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="apt-pass-from">Valid From</label>
                <input
                  type="time" className="form-control" id="apt-pass-from"
                  value={passFrom} onChange={(event) => setPassFrom(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="apt-pass-until">Valid Until</label>
                <input
                  type="time" className="form-control" id="apt-pass-until"
                  value={passUntil} onChange={(event) => setPassUntil(event.target.value)}
                />
                <span className="fs-12 text-muted">{durationText(passSpan)} window</span>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="apt-pass-zones">Access Zones</label>
                <select
                  className="form-select" id="apt-pass-zones"
                  value={zones} onChange={(event) => setZones(event.target.value)}
                >
                  {passZoneOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="igpQr"
                    checked={printQr} onChange={(event) => setPrintQr(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="igpQr">
                    Print a QR code for the gate and corridor readers
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="igpHold"
                    checked={holdAtDesk} onChange={(event) => setHoldAtDesk(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="igpHold">
                    Hold the printed passes at the reception desk
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* View Appointment */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.id ?? 'Appointment'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('reschedule')}>
              <i className="ti ti-calendar-time me-1" />Reschedule
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-calendar-event me-1" />Open Appointment Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.visitor}  •  {row.appointmentType}  •  {row.visitDate}
            </p>

            <RequestStrip row={row} />

            <div className="row g-3 mb-3">
              {[
                { icon: 'ti ti-calendar-event', tint: 'info', label: 'Slot', value: `${row.slotFrom} – ${row.slotUntil}` },
                { icon: 'ti ti-users', tint: 'warning', label: 'Party', value: `${row.partySize} ${row.partySize === 1 ? 'person' : 'people'}` },
                { icon: 'ti ti-shield-check', tint: 'success', label: 'Identity', value: checkSummaryOf(row) },
                { icon: 'ti ti-ticket', tint: 'primary', label: 'Gate Pass', value: row.passStatus },
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
                <h6 className="fs-13 mb-2">Visitor Information</h6>
                <div className="border rounded p-3">
                  {visitorPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Appointment Details</h6>
                <div className="border rounded p-3">
                  {appointmentPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Host Information</h6>
                <div className="border rounded p-3">
                  {hostPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Gate Pass Preparation</h6>
                <div className="border rounded p-3">
                  {passPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
            </div>

            <h6 className="fs-13 mb-2 mt-3">Approval Timeline</h6>
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

            <h6 className="fs-13 mb-2 mt-3">Identity Verification</h6>
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

            <h6 className="fs-13 mb-2 mt-3">Internal Notes</h6>
            <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
              <span className={typeBadge[row.appointmentType]}>{row.appointmentType}</span>
              <span className={departmentBadge[row.department]}>{row.department}</span>
            </div>
            <p className="fs-13 text-muted mb-0">{row.notes}</p>
            <p className="fs-12 text-muted mb-0 mt-2">Register as at {REGISTER_TIME}</p>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default AppointmentModals;
