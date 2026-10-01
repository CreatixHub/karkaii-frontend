import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { GateEntry } from '../data/entries.data';
import {
  DASH,
  REGISTER_TIME,
  addMinutes,
  approverOptions,
  checkBadge,
  durationLabel,
  entryTypeOptions,
  escortOptions,
  gateOptions,
  hostOptions,
  idProofOptions,
  minutesOf,
  officerOptions,
  onSiteOf,
  overstayReasonOptions,
  passStatusOf,
  passTypeOptions,
  personTypeOptions,
  returnOptions,
  statusBadge,
  statusOf,
  validityOptions,
  vehicleTypeOptions,
  verificationOptions,
  viewHostPairsOf,
  visitPairsOf,
  whoOptions,
} from '../data/entries.data';

export type EntryModalId = 'new' | 'edit' | 'checkin' | 'checkout' | 'pass' | 'view';

export interface EntryDraft {
  who: string;
  name: string;
  contact: string;
  personType: string;
  entryType: string;
  idProof: string;
  idNumber: string;
  gate: string;
  host: string;
  purpose: string;
  vehicleType: string;
  registration: string;
  party: string;
  notes: string;
  issuePass: boolean;
  notifyHost: boolean;
}

export const emptyDraft: EntryDraft = {
  who: whoOptions[0], name: '', contact: '', personType: personTypeOptions[0],
  entryType: entryTypeOptions[0], idProof: idProofOptions[0], idNumber: '',
  gate: gateOptions[0], host: hostOptions[0], purpose: '',
  vehicleType: vehicleTypeOptions[0], registration: '', party: '0', notes: '',
  issuePass: true, notifyHost: true,
};

export const draftOf = (row: GateEntry): EntryDraft => ({
  who: row.personType === 'Staff' ? 'Staff'
    : row.personType === 'Student' ? 'Student'
      : row.personType === 'Vendor' ? 'Vendor' : 'Visitor',
  name: row.name,
  contact: row.contact,
  personType: row.personType,
  entryType: row.entryType,
  idProof: idProofOptions.find((option) => option === row.idProof) ?? idProofOptions[0],
  idNumber: row.idNumber,
  gate: row.gate,
  host: hostOptions.find((option) => option === row.host) ?? hostOptions[0],
  purpose: row.purpose,
  vehicleType: row.vehicle
    ? vehicleTypeOptions.find((option) => option === row.vehicle?.type) ?? vehicleTypeOptions[1]
    : vehicleTypeOptions[0],
  registration: row.vehicle?.registration ?? '',
  party: '0',
  notes: row.notes,
  issuePass: Boolean(row.passNumber),
  notifyHost: true,
});

export interface CheckInPayload {
  verification: string;
  time: string;
  gate: string;
  officer: string;
  validity: string;
  escort: string;
  belongings: string;
}

export interface CheckOutPayload {
  passReturn: string;
  time: string;
  gate: string;
  officer: string;
  overstayReason: string;
  remarks: string;
}

export interface PassPayload {
  passType: string;
  passNumber: string;
  gate: string;
  validFrom: string;
  validUntil: string;
  approvedBy: string;
  handoverTo: string;
  reason: string;
}

export interface EntryModalsProps {
  active: EntryModalId | null;
  row: GateEntry | null;
  onClose: () => void;
  onCreate: (draft: EntryDraft) => void;
  onUpdate: (draft: EntryDraft) => void;
  onCheckIn: (payload: CheckInPayload) => void;
  onCheckOut: (payload: CheckOutPayload) => void;
  onIssuePass: (payload: PassPayload) => void;
  onOpen: (modal: EntryModalId) => void;
  onOpenPanel: () => void;
}

const Row = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

/** The person strip the action dialogs open with. */
const PersonStrip = ({ row, children }: { row: GateEntry; children?: ReactNode }) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
    {row.avatar ? (
      <span className="avatar avatar-md rounded flex-shrink-0">
        <ImageWithBasePath src={row.avatar} className="rounded" alt={row.name} />
      </span>
    ) : (
      <span className={`avatar avatar-md bg-${row.tint}-transparent text-${row.tint} rounded flex-shrink-0`}>
        <i className={row.icon} />
      </span>
    )}
    <div className="flex-fill overflow-hidden">
      <h5 className="fs-14 mb-0 text-truncate">{row.name}</h5>
      <span className="fs-12 text-muted text-truncate d-block">{row.id} · {row.reference}</span>
    </div>
    {children ?? <span className={statusBadge[statusOf(row)]}>{statusOf(row)}</span>}
  </div>
);

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: EntryDraft;
  onField: (field: keyof EntryDraft, value: string | boolean) => void;
  suffix: string;
  mode: 'new' | 'edit';
}

const EntryForm = ({ draft, onField, suffix, mode }: FormProps) => (
  <>
    {mode === 'new' ? (
      <div className="mb-3">
        <span className="form-label d-block">Who is at the gate</span>
        <div className="d-flex flex-wrap gap-3">
          {whoOptions.map((option) => (
            <div className="form-check" key={option}>
              <input
                className="form-check-input" type="radio" name="who-at-gate"
                id={`nge-${option}${suffix}`} checked={draft.who === option}
                onChange={() => onField('who', option)}
              />
              <label className="form-check-label fs-13" htmlFor={`nge-${option}${suffix}`}>
                <i
                  className={`ti ${option === 'Student' ? 'ti-school' : option === 'Staff' ? 'ti-id-badge-2' : option === 'Vendor' ? 'ti-truck-delivery' : 'ti-user'} me-1`}
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
        <label className="form-label" htmlFor={`ge-name${suffix}`}>Full Name</label>
        <input
          type="text" className="form-control" id={`ge-name${suffix}`} placeholder="e.g. Ms. Hannah Lee"
          value={draft.name} onChange={(event) => onField('name', event.target.value)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`ge-contact${suffix}`}>Contact Number</label>
        <input
          type="text" className="form-control" id={`ge-contact${suffix}`} placeholder="e.g. +1 55 2214 8890"
          value={draft.contact} onChange={(event) => onField('contact', event.target.value)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`ge-person${suffix}`}>Person Type</label>
        <select
          className="form-select" id={`ge-person${suffix}`}
          value={draft.personType} onChange={(event) => onField('personType', event.target.value)}
        >
          {personTypeOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`ge-entry${suffix}`}>Entry Type</label>
        <select
          className="form-select" id={`ge-entry${suffix}`}
          value={draft.entryType} onChange={(event) => onField('entryType', event.target.value)}
        >
          {entryTypeOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
    </div>

    <h6 className="fs-13 mb-2">Identification</h6>
    <div className="row">
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`ge-proof${suffix}`}>ID Proof</label>
        <select
          className="form-select" id={`ge-proof${suffix}`}
          value={draft.idProof} onChange={(event) => onField('idProof', event.target.value)}
        >
          {idProofOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`ge-idno${suffix}`}>ID Number</label>
        <input
          type="text" className="form-control" id={`ge-idno${suffix}`} placeholder="Masked on the register"
          value={draft.idNumber} onChange={(event) => onField('idNumber', event.target.value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`ge-photo${suffix}`}>Photograph</label>
        <input type="file" className="form-control" id={`ge-photo${suffix}`} />
      </div></div>
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`ge-gate${suffix}`}>Gate</label>
        <select
          className="form-select" id={`ge-gate${suffix}`}
          value={draft.gate} onChange={(event) => onField('gate', event.target.value)}
        >
          {gateOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
    </div>

    <h6 className="fs-13 mb-2">Visit &amp; Vehicle</h6>
    <div className="row">
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`ge-host${suffix}`}>Host / Department</label>
        <select
          className="form-select" id={`ge-host${suffix}`}
          value={draft.host} onChange={(event) => onField('host', event.target.value)}
        >
          {hostOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`ge-purpose${suffix}`}>Purpose of Visit</label>
        <input
          type="text" className="form-control" id={`ge-purpose${suffix}`}
          placeholder="e.g. Smart board calibration"
          value={draft.purpose} onChange={(event) => onField('purpose', event.target.value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`ge-vehicle${suffix}`}>Vehicle Type</label>
        <select
          className="form-select" id={`ge-vehicle${suffix}`}
          value={draft.vehicleType} onChange={(event) => onField('vehicleType', event.target.value)}
        >
          {vehicleTypeOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`ge-reg${suffix}`}>Registration No</label>
        <input
          type="text" className="form-control" id={`ge-reg${suffix}`} placeholder="e.g. KA-05-MJ-2218"
          /* No registration to record when nobody drove in. */
          disabled={draft.vehicleType === vehicleTypeOptions[0]}
          value={draft.registration} onChange={(event) => onField('registration', event.target.value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`ge-party${suffix}`}>Accompanying Persons</label>
        <input
          type="number" className="form-control" id={`ge-party${suffix}`} min={0}
          value={draft.party} onChange={(event) => onField('party', event.target.value)}
        />
      </div></div>
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`ge-notes${suffix}`}>Security Notes</label>
        <textarea
          className="form-control" rows={2} id={`ge-notes${suffix}`}
          placeholder="Visible to the security desk only"
          value={draft.notes} onChange={(event) => onField('notes', event.target.value)}
        />
      </div></div>
      <div className="col-md-12">
        <div className="form-check form-switch mb-2">
          <input
            className="form-check-input" type="checkbox" role="switch" id={`gePass${suffix}`}
            checked={draft.issuePass} onChange={(event) => onField('issuePass', event.target.checked)}
          />
          <label className="form-check-label fs-13" htmlFor={`gePass${suffix}`}>
            {mode === 'new'
              ? 'Issue a gate pass and print the visitor badge'
              : 'Clear the overstay flag once the new pass window is saved'}
          </label>
        </div>
        {mode === 'new' ? (
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input" type="checkbox" role="switch" id={`geHost${suffix}`}
              checked={draft.notifyHost} onChange={(event) => onField('notifyHost', event.target.checked)}
            />
            <label className="form-check-label fs-13" htmlFor={`geHost${suffix}`}>
              Notify the host that the visitor has arrived
            </label>
          </div>
        ) : null}
      </div>
    </div>
  </>
);

/* --------------------------------- Modals ---------------------------------- */

const EntryModals = ({
  active, row, onClose, onCreate, onUpdate, onCheckIn, onCheckOut, onIssuePass,
  onOpen, onOpenPanel,
}: EntryModalsProps) => {
  const [draft, setDraft] = useState<EntryDraft>(emptyDraft);

  const [verification, setVerification] = useState(verificationOptions[0]);
  const [inTime, setInTime] = useState(REGISTER_TIME);
  const [inGate, setInGate] = useState(gateOptions[0]);
  const [inOfficer, setInOfficer] = useState(officerOptions[0]);
  const [validity, setValidity] = useState(validityOptions[0]);
  const [escort, setEscort] = useState(escortOptions[0]);
  const [belongings, setBelongings] = useState('');
  const [printBadge, setPrintBadge] = useState(true);
  const [alertDesk, setAlertDesk] = useState(true);

  const [passReturn, setPassReturn] = useState(returnOptions[0]);
  const [outTime, setOutTime] = useState(REGISTER_TIME);
  const [outGate, setOutGate] = useState(gateOptions[0]);
  const [outOfficer, setOutOfficer] = useState(officerOptions[0]);
  const [overstayReason, setOverstayReason] = useState(overstayReasonOptions[0]);
  const [exitRemarks, setExitRemarks] = useState('');
  const [closeAlert, setCloseAlert] = useState(true);
  const [releaseBarrier, setReleaseBarrier] = useState(true);

  const [passType, setPassType] = useState(passTypeOptions[0]);
  const [passNumber, setPassNumber] = useState('');
  const [passGate, setPassGate] = useState(gateOptions[0]);
  const [validFrom, setValidFrom] = useState(REGISTER_TIME);
  const [validUntil, setValidUntil] = useState(addMinutes(REGISTER_TIME, 60));
  const [approvedBy, setApprovedBy] = useState(approverOptions[0]);
  const [handoverTo, setHandoverTo] = useState('');
  const [passReason, setPassReason] = useState('');
  const [printQr, setPrintQr] = useState(true);
  const [smsGuardian, setSmsGuardian] = useState(true);

  useEffect(() => {
    if (active === 'new') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (!row) return;
    if (active === 'checkin') {
      setVerification(verificationOptions[0]);
      setInTime(REGISTER_TIME);
      setInGate(row.gate);
      setValidity(validityOptions[0]);
      setEscort(/not required/i.test(row.escort) ? escortOptions[1] : escortOptions[0]);
      setBelongings('');
    }
    if (active === 'checkout') {
      setPassReturn(returnOptions[0]);
      setOutTime(REGISTER_TIME);
      setOutGate(row.gate);
      setExitRemarks('');
    }
    if (active === 'pass') {
      setPassType(row.personType === 'Student' ? 'Student'
        : row.vehicle ? 'Vehicle' : 'Visitor');
      setPassNumber(row.passNumber || `VP-2026-0${890 + Number(row.id.slice(-2))}`);
      setPassGate(row.gate);
      setValidFrom(row.validFrom || REGISTER_TIME);
      setValidUntil(row.validUntil || addMinutes(REGISTER_TIME, 60));
      setHandoverTo(row.hostContact.split('·')[0].trim());
      setPassReason('');
    }
  }, [active, row]);

  const field = (key: keyof EntryDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  /** The pass window the chosen validity produces from the check-in time. */
  const validityMinutes = validity === '1 hour' ? 60
    : validity === '2 hours' ? 120 : validity === '4 hours' ? 240 : 600;
  const derivedUntil = addMinutes(inTime, validityMinutes);

  /** Recounted from the time being entered, not the template's fixed figure. */
  const timeOnSiteAtExit = row && row.checkIn
    ? Math.max(0, minutesOf(outTime) - minutesOf(row.checkIn))
    : 0;
  const overstayAtExit = row && row.validUntil
    ? Math.max(0, minutesOf(outTime) - minutesOf(row.validUntil))
    : 0;

  return (
    <>
      {/* New Gate Entry */}
      <Modal
        open={active === 'new'}
        onClose={onClose}
        title="New Gate Entry"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Register Entry</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">Register a person arriving at the gate</p>
        <EntryForm draft={draft} onField={field} suffix="" mode="new" />
      </Modal>

      {/* Edit Entry */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Entry"
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
            {statusOf(row) === 'Overstayed' ? (
              <div className="alert alert-warning d-flex align-items-center mb-3">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">
                  Extending the pass window clears the overstay flag and closes the alert raised at
                  the {row.gate.toLowerCase()}.
                </span>
              </div>
            ) : null}
            <EntryForm draft={draft} onField={field} suffix="-2" mode="edit" />
          </>
        ) : null}
      </Modal>

      {/* Check-In */}
      <Modal
        open={active === 'checkin' && row !== null}
        onClose={onClose}
        title="Check-In"
        onSubmit={(event) => {
          event.preventDefault();
          onCheckIn({
            verification, time: inTime, gate: inGate, officer: inOfficer,
            validity, escort, belongings,
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
            <PersonStrip row={row} />
            <div className="border rounded p-3 mb-3">
              <Row label="Host" value={row.hostContact.split('·')[0].trim()} />
              <Row label="Purpose" value={row.purposeDetail.split('·')[0].trim() || row.purpose} />
              <Row label="Expected" value={row.expected ? `${row.expected} · 09:00` : 'Walk in'} last />
            </div>

            {row.checkIn ? (
              <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-info-circle fs-16" />
                <span className="fs-13">This entry was already checked in at {row.checkIn}.</span>
              </div>
            ) : null}

            <div className="mb-3">
              <span className="form-label d-block">Identity verification</span>
              <div className="d-flex flex-wrap gap-3">
                {verificationOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="verification"
                      id={`chi-${option}`} checked={verification === option}
                      onChange={() => setVerification(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`chi-${option}`}>
                      <i
                        className={`ti ${option === 'QR Code' ? 'ti-qrcode' : option === 'Biometric' ? 'ti-fingerprint' : 'ti-id'} me-1`}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="check-in-time">Check-In Time</label>
                <input
                  type="time" className="form-control" id="check-in-time"
                  value={inTime} onChange={(event) => setInTime(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="check-in-gate">Gate</label>
                <select
                  className="form-select" id="check-in-gate"
                  value={inGate} onChange={(event) => setInGate(event.target.value)}
                >
                  {gateOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="check-in-officer">Gate Officer</label>
                <select
                  className="form-select" id="check-in-officer"
                  value={inOfficer} onChange={(event) => setInOfficer(event.target.value)}
                >
                  {officerOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="pass-validity">Pass Validity</label>
                <select
                  className="form-select" id="pass-validity"
                  value={validity} onChange={(event) => setValidity(event.target.value)}
                >
                  {validityOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
                {/* The valid-to time follows from the check-in time and the choice. */}
                <span className="fs-12 text-muted">Pass valid to {derivedUntil}</span>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="check-in-escort">Escort</label>
                <select
                  className="form-select" id="check-in-escort"
                  value={escort} onChange={(event) => setEscort(event.target.value)}
                >
                  {escortOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="visitor-photograph">Visitor Photograph</label>
                <input type="file" className="form-control" id="visitor-photograph" />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="belongings-declared">Belongings Declared</label>
                <textarea
                  className="form-control" rows={2} id="belongings-declared"
                  placeholder="Recorded on the gate register"
                  value={belongings} onChange={(event) => setBelongings(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="chiPass"
                    checked={printBadge} onChange={(event) => setPrintBadge(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="chiPass">
                    Print the visitor badge with the pass number and photograph
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="chiAlert"
                    checked={alertDesk} onChange={(event) => setAlertDesk(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="chiAlert">
                    Alert the security desk if the pass is not returned on time
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
            passReturn, time: outTime, gate: outGate, officer: outOfficer,
            overstayReason, remarks: exitRemarks,
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
            {overstayAtExit > 0 ? (
              <div className="alert alert-warning d-flex align-items-center mb-3">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">
                  This pass expired at {row.validUntil} and is {durationLabel(overstayAtExit)} overdue.
                  Record the reason before closing the entry.
                </span>
              </div>
            ) : null}
            <PersonStrip row={row}>
              <span className="fs-12 text-muted text-nowrap">{passStatusOf(row)}</span>
            </PersonStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Checked In" value={`${row.checkIn || 'Not arrived'} · ${row.gate}`} />
              <Row label="Pass Valid Until" value={row.validUntil || DASH} />
              {/* Recounted against the check-out time being entered. */}
              <Row label="Time On Site" value={durationLabel(timeOnSiteAtExit)} last />
            </div>

            {row.passNumber ? (
              <div className="mb-3">
                <span className="form-label d-block">Pass returned</span>
                <div className="d-flex flex-wrap gap-3">
                  {returnOptions.map((option) => (
                    <div className="form-check" key={option}>
                      <input
                        className="form-check-input" type="radio" name="pass-return"
                        id={`cho-${option}`} checked={passReturn === option}
                        onChange={() => setPassReturn(option)}
                      />
                      <label className="form-check-label fs-13" htmlFor={`cho-${option}`}>{option}</label>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="row">
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="check-out-time">Check-Out Time</label>
                <input
                  type="time" className="form-control" id="check-out-time"
                  value={outTime} onChange={(event) => setOutTime(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="exit-gate">Exit Gate</label>
                <select
                  className="form-select" id="exit-gate"
                  value={outGate} onChange={(event) => setOutGate(event.target.value)}
                >
                  {gateOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="check-out-officer">Gate Officer</label>
                <select
                  className="form-select" id="check-out-officer"
                  value={outOfficer} onChange={(event) => setOutOfficer(event.target.value)}
                >
                  {officerOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              {overstayAtExit > 0 ? (
                <div className="col-md-12"><div className="mb-3">
                  <label className="form-label" htmlFor="overstay-reason">Overstay Reason</label>
                  <select
                    className="form-select" id="overstay-reason"
                    value={overstayReason} onChange={(event) => setOverstayReason(event.target.value)}
                  >
                    {overstayReasonOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </div></div>
              ) : null}
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="exit-remarks">Exit Remarks</label>
                <textarea
                  className="form-control" rows={2} id="exit-remarks"
                  placeholder="Recorded on the gate register"
                  value={exitRemarks} onChange={(event) => setExitRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="choClear"
                    checked={closeAlert} onChange={(event) => setCloseAlert(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="choClear">
                    Close the overstay alert raised at the {row.gate.toLowerCase()}
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="choVehicle"
                    checked={releaseBarrier} onChange={(event) => setReleaseBarrier(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="choVehicle">
                    Release the vehicle barrier record for this entry
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
            passType, passNumber, gate: passGate, validFrom, validUntil,
            approvedBy, handoverTo, reason: passReason,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-id-badge-2 me-1" />Issue Pass
            </button>
          </>
        }
      >
        {row ? (
          <>
            <PersonStrip row={row}>
              <span className="fs-12 text-muted text-nowrap">{row.entryType}</span>
            </PersonStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Pass Type" value={row.entryType} />
              <Row label="Host" value={row.hostContact.split('·')[0].trim()} />
              <Row label="Gate" value={`${row.gate} · ${row.lane.split('·').pop()?.trim()}`} last />
            </div>

            <div className="mb-3">
              <span className="form-label d-block">Pass type</span>
              <div className="d-flex flex-wrap gap-3">
                {passTypeOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="pass-type"
                      id={`igp-${option}`} checked={passType === option}
                      onChange={() => setPassType(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`igp-${option}`}>{option}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="pass-number">Pass Number</label>
                <input
                  type="text" className="form-control" id="pass-number"
                  value={passNumber} onChange={(event) => setPassNumber(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="pass-gate">Gate</label>
                <select
                  className="form-select" id="pass-gate"
                  value={passGate} onChange={(event) => setPassGate(event.target.value)}
                >
                  {gateOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="valid-from">Valid From</label>
                <input
                  type="time" className="form-control" id="valid-from"
                  value={validFrom} onChange={(event) => setValidFrom(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="valid-until">Valid Until</label>
                <input
                  type="time" className="form-control" id="valid-until"
                  value={validUntil} onChange={(event) => setValidUntil(event.target.value)}
                />
                <span className="fs-12 text-muted">
                  Window of {durationLabel(Math.max(0, minutesOf(validUntil) - minutesOf(validFrom)))}
                </span>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="pass-approver">Approved By</label>
                <select
                  className="form-select" id="pass-approver"
                  value={approvedBy} onChange={(event) => setApprovedBy(event.target.value)}
                >
                  {approverOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="handover-to">Handover To</label>
                <input
                  type="text" className="form-control" id="handover-to"
                  value={handoverTo} onChange={(event) => setHandoverTo(event.target.value)}
                />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="pass-reason">Reason</label>
                <textarea
                  className="form-control" rows={2} id="pass-reason"
                  placeholder="Printed on the pass"
                  value={passReason} onChange={(event) => setPassReason(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="igpQr"
                    checked={printQr} onChange={(event) => setPrintQr(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="igpQr">
                    Print a QR code for the exit scan at the gate
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="igpSms"
                    checked={smsGuardian} onChange={(event) => setSmsGuardian(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="igpSms">
                    Send the pass details to the guardian by SMS
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* View Entry */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.id ?? 'Gate entry'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('pass')}>
              <i className="ti ti-id-badge-2 me-1" />Issue Pass
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-shield-check me-1" />Open Security Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.name}  •  {row.reference.split('·')[0].trim()}  •  {row.date}
            </p>

            <PersonStrip row={row} />

            <div className="row g-3 mb-3">
              {[
                { icon: 'ti ti-door-enter', tint: 'success', label: 'Check-In', value: row.checkIn || 'Not arrived' },
                { icon: 'ti ti-door-exit', tint: 'info', label: 'Check-Out', value: row.checkOut || 'Not recorded' },
                { icon: 'ti ti-clock', tint: 'warning', label: 'Time On Site', value: row.checkIn ? durationLabel(onSiteOf(row)) : DASH },
                { icon: 'ti ti-id-badge-2', tint: 'primary', label: 'Gate Pass', value: passStatusOf(row) },
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
                <h6 className="fs-13 mb-2">Visit Detail</h6>
                <div className="border rounded p-3">
                  {visitPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Host</h6>
                <div className="border rounded p-3">
                  {viewHostPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
            </div>

            <h6 className="fs-13 mb-2 mt-3">Security Checks</h6>
            {row.checks.map((check) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={check.label}>
                <span className="avatar avatar-sm bg-light text-muted rounded flex-shrink-0">
                  <i className="ti ti-shield-check" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0">{check.label}</h6>
                </div>
                <span className={checkBadge[check.state]}>{check.state}</span>
              </div>
            ))}

            <h6 className="fs-13 mb-2 mt-3">Security Notes</h6>
            <p className="fs-13 text-muted mb-0">{row.notes}</p>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default EntryModals;
