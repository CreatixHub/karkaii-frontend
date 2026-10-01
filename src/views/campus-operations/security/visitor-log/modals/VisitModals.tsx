import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import type { Visit } from '../data/visits.data';
import {
  REGISTER_TIME,
  addMinutes,
  contactPairsOf,
  departmentBadge,
  departmentOptions,
  durationCellOf,
  durationText,
  escortOptions,
  frequencyLabelOf,
  gateOptions,
  hostChoices,
  hostPairsOf,
  idProofOptions,
  identityPairsOf,
  logTypeOptions,
  minutesOf,
  officerOptions,
  overstayReasonOptions,
  printFormatOptions,
  printerOptions,
  returnOptions,
  statusBadge,
  statusOf,
  timelineOf,
  validityOptions,
  verificationOptions,
  visitPairsOf,
  visitorBadge,
  visitorTypeOptions,
  windowOf,
} from '../data/visits.data';

export type VisitModalId = 'log' | 'edit' | 'checkin' | 'checkout' | 'print' | 'view';

export interface VisitDraft {
  logType: string;
  name: string;
  visitorType: string;
  phone: string;
  organisation: string;
  host: string;
  department: string;
  purpose: string;
  detail: string;
  visitDate: string;
  checkIn: string;
  checkOut: string;
  gate: string;
  officer: string;
  idProof: string;
  vehicle: string;
  notes: string;
  linkGate: boolean;
  mergeRecord: boolean;
}

export const emptyDraft: VisitDraft = {
  logType: logTypeOptions[0], name: '', visitorType: visitorTypeOptions[0], phone: '',
  organisation: '', host: hostChoices[0], department: departmentOptions[0],
  purpose: '', detail: '', visitDate: '31-07-2026', checkIn: '09:00', checkOut: '13:00',
  gate: gateOptions[0], officer: officerOptions[0], idProof: idProofOptions[0],
  vehicle: '', notes: '', linkGate: true, mergeRecord: true,
};

export const draftOf = (row: Visit): VisitDraft => ({
  logType: row.checkIn ? logTypeOptions[0] : logTypeOptions[2],
  name: row.name,
  visitorType: row.visitorType,
  phone: row.phone,
  organisation: row.reference.split('·')[0].trim(),
  host: hostChoices.find((choice) => choice.startsWith(row.host)) ?? hostChoices[0],
  department: row.department,
  purpose: row.purpose,
  detail: row.detail,
  visitDate: '31-07-2026',
  checkIn: row.checkIn || row.expected || '09:00',
  checkOut: row.checkOut || REGISTER_TIME,
  gate: row.gate,
  officer: officerOptions.find((option) => option === row.gateOfficer) ?? officerOptions[0],
  idProof: idProofOptions.find((option) => option === row.idProof) ?? idProofOptions[0],
  vehicle: row.vehicle.split('·').pop()?.trim() ?? '',
  notes: row.notes,
  linkGate: Boolean(row.gateRegister),
  mergeRecord: true,
});

export interface CheckInPayload {
  verification: string;
  time: string;
  gate: string;
  officer: string;
  validity: string;
  escort: string;
  remarks: string;
}

export interface CheckOutPayload {
  passReturn: string;
  time: string;
  gate: string;
  officer: string;
  overstayReason: string;
  remarks: string;
}

export interface PrintPayload {
  format: string;
  copies: string;
  printer: string;
  issuedBy: string;
}

export interface VisitModalsProps {
  active: VisitModalId | null;
  row: Visit | null;
  onClose: () => void;
  onLog: (draft: VisitDraft) => void;
  onUpdate: (draft: VisitDraft) => void;
  onCheckIn: (payload: CheckInPayload) => void;
  onCheckOut: (payload: CheckOutPayload) => void;
  onPrint: (payload: PrintPayload) => void;
  onOpen: (modal: VisitModalId) => void;
  onOpenPanel: () => void;
}

const Row = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const VisitorStrip = ({ row, children }: { row: Visit; children?: ReactNode }) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
    <span className={`avatar avatar-md bg-${row.tint}-transparent text-${row.tint} rounded flex-shrink-0`}>
      <i className={row.icon} />
    </span>
    <div className="flex-fill overflow-hidden">
      <h5 className="fs-14 mb-0 text-truncate">{row.name}</h5>
      <span className="fs-12 text-muted text-truncate d-block">{row.id} · {row.verification}</span>
    </div>
    {children ?? <span className={statusBadge[statusOf(row)]}>{statusOf(row)}</span>}
  </div>
);

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: VisitDraft;
  onField: (field: keyof VisitDraft, value: string | boolean) => void;
  suffix: string;
  mode: 'log' | 'edit';
}

const VisitForm = ({ draft, onField, suffix, mode }: FormProps) => {
  /** A scheduled visit has no times to log yet. */
  const scheduled = draft.logType === 'Scheduled';
  const span = Math.max(0, minutesOf(draft.checkOut) - minutesOf(draft.checkIn));

  return (
    <>
      {mode === 'log' ? (
        <div className="mb-3">
          <span className="form-label d-block">Log entry type</span>
          <div className="d-flex flex-wrap gap-3">
            {logTypeOptions.map((option) => (
              <div className="form-check" key={option}>
                <input
                  className="form-check-input" type="radio" name="log-type"
                  id={`lnv-${option}${suffix}`} checked={draft.logType === option}
                  onChange={() => onField('logType', option)}
                />
                <label className="form-check-label fs-13" htmlFor={`lnv-${option}${suffix}`}>
                  <i
                    className={`ti ${option === 'Backdated' ? 'ti-history' : option === 'Scheduled' ? 'ti-calendar-event' : 'ti-door-enter'} me-1`}
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
          <label className="form-label" htmlFor={`vl-name${suffix}`}>Visitor Name</label>
          <input
            type="text" className="form-control" id={`vl-name${suffix}`}
            placeholder="e.g. Mr. Victor Hale"
            value={draft.name} onChange={(event) => onField('name', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`vl-type${suffix}`}>Visitor Type</label>
          <select
            className="form-select" id={`vl-type${suffix}`}
            value={draft.visitorType} onChange={(event) => onField('visitorType', event.target.value)}
          >
            {visitorTypeOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`vl-phone${suffix}`}>Contact Number</label>
          <input
            type="text" className="form-control" id={`vl-phone${suffix}`}
            placeholder="e.g. +1 55 6620 1187"
            value={draft.phone} onChange={(event) => onField('phone', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`vl-org${suffix}`}>Organisation</label>
          <input
            type="text" className="form-control" id={`vl-org${suffix}`}
            placeholder="Leave blank for a personal visit"
            value={draft.organisation} onChange={(event) => onField('organisation', event.target.value)}
          />
        </div></div>
      </div>

      <h6 className="fs-13 mb-2">Host &amp; Purpose</h6>
      <div className="row">
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`vl-host${suffix}`}>Host</label>
          <select
            className="form-select" id={`vl-host${suffix}`}
            value={draft.host} onChange={(event) => onField('host', event.target.value)}
          >
            {hostChoices.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`vl-dept${suffix}`}>Host Department</label>
          <select
            className="form-select" id={`vl-dept${suffix}`}
            value={draft.department} onChange={(event) => onField('department', event.target.value)}
          >
            {departmentOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`vl-purpose${suffix}`}>Visit Purpose</label>
          <input
            type="text" className="form-control" id={`vl-purpose${suffix}`}
            placeholder="e.g. Guardian meeting"
            value={draft.purpose} onChange={(event) => onField('purpose', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`vl-detail${suffix}`}>Purpose Detail</label>
          <input
            type="text" className="form-control" id={`vl-detail${suffix}`}
            placeholder="Reference or short note"
            value={draft.detail} onChange={(event) => onField('detail', event.target.value)}
          />
        </div></div>
      </div>

      <h6 className="fs-13 mb-2">Gate &amp; Timing</h6>
      <div className="row">
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`vl-date${suffix}`}>Visit Date</label>
          <DateField
            id={`vl-date${suffix}`} value={draft.visitDate}
            onChange={(next) => onField('visitDate', next)}
          />
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`vl-in${suffix}`}>
            {scheduled ? 'Expected Arrival' : 'Check-In Time'}
          </label>
          <input
            type="time" className="form-control" id={`vl-in${suffix}`}
            value={draft.checkIn} onChange={(event) => onField('checkIn', event.target.value)}
          />
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`vl-out${suffix}`}>Check-Out Time</label>
          <input
            type="time" className="form-control" id={`vl-out${suffix}`}
            /* Nothing to record on a booking that has not started. */
            disabled={scheduled}
            value={scheduled ? '' : draft.checkOut}
            onChange={(event) => onField('checkOut', event.target.value)}
          />
          {!scheduled ? (
            <span className="fs-12 text-muted">Visit duration {durationText(span)}</span>
          ) : null}
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`vl-gate${suffix}`}>Gate</label>
          <select
            className="form-select" id={`vl-gate${suffix}`}
            value={draft.gate} onChange={(event) => onField('gate', event.target.value)}
          >
            {gateOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`vl-officer${suffix}`}>Gate Officer</label>
          <select
            className="form-select" id={`vl-officer${suffix}`}
            value={draft.officer} onChange={(event) => onField('officer', event.target.value)}
          >
            {officerOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-4"><div className="mb-3">
          <label className="form-label" htmlFor={`vl-proof${suffix}`}>ID Proof</label>
          <select
            className="form-select" id={`vl-proof${suffix}`}
            value={draft.idProof} onChange={(event) => onField('idProof', event.target.value)}
          >
            {idProofOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-12"><div className="mb-3">
          <label className="form-label" htmlFor={`vl-vehicle${suffix}`}>Vehicle Registration</label>
          <input
            type="text" className="form-control" id={`vl-vehicle${suffix}`}
            placeholder="Leave blank if on foot"
            value={draft.vehicle} onChange={(event) => onField('vehicle', event.target.value)}
          />
        </div></div>
        <div className="col-md-12"><div className="mb-3">
          <label className="form-label" htmlFor={`vl-notes${suffix}`}>Security Notes</label>
          <textarea
            className="form-control" rows={2} id={`vl-notes${suffix}`}
            placeholder="Visible to the security desk only"
            value={draft.notes} onChange={(event) => onField('notes', event.target.value)}
          />
        </div></div>
        <div className="col-md-12">
          <div className="form-check form-switch mb-2">
            <input
              className="form-check-input" type="checkbox" role="switch" id={`vlGate${suffix}`}
              checked={draft.linkGate} onChange={(event) => onField('linkGate', event.target.checked)}
            />
            <label className="form-check-label fs-13" htmlFor={`vlGate${suffix}`}>
              {mode === 'log'
                ? 'Create a matching entry on the gate register'
                : 'Close the visit and clear the overstay alert'}
            </label>
          </div>
          {mode === 'log' ? (
            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input" type="checkbox" role="switch" id={`vlMerge${suffix}`}
                checked={draft.mergeRecord} onChange={(event) => onField('mergeRecord', event.target.checked)}
              />
              <label className="form-check-label fs-13" htmlFor={`vlMerge${suffix}`}>
                Match against an existing visitor record if the ID is already known
              </label>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

/* --------------------------------- Modals ---------------------------------- */

const VisitModals = ({
  active, row, onClose, onLog, onUpdate, onCheckIn, onCheckOut, onPrint, onOpen, onOpenPanel,
}: VisitModalsProps) => {
  const [draft, setDraft] = useState<VisitDraft>(emptyDraft);

  const [verification, setVerification] = useState(verificationOptions[0]);
  const [inTime, setInTime] = useState(REGISTER_TIME);
  const [inGate, setInGate] = useState(gateOptions[0]);
  const [inOfficer, setInOfficer] = useState(officerOptions[0]);
  const [validity, setValidity] = useState(validityOptions[0]);
  const [escort, setEscort] = useState(escortOptions[0]);
  const [deskRemarks, setDeskRemarks] = useState('');
  const [printBadge, setPrintBadge] = useState(true);
  const [notifyHost, setNotifyHost] = useState(true);

  const [passReturn, setPassReturn] = useState(returnOptions[0]);
  const [outTime, setOutTime] = useState(REGISTER_TIME);
  const [outGate, setOutGate] = useState(gateOptions[0]);
  const [outOfficer, setOutOfficer] = useState(officerOptions[0]);
  const [overstayReason, setOverstayReason] = useState(overstayReasonOptions[0]);
  const [exitRemarks, setExitRemarks] = useState('');
  const [clearAlert, setClearAlert] = useState(true);
  const [syncGate, setSyncGate] = useState(true);

  const [format, setFormat] = useState(printFormatOptions[0]);
  const [copies, setCopies] = useState('1');
  const [printer, setPrinter] = useState(printerOptions[0]);
  const [issuedBy, setIssuedBy] = useState(officerOptions[0]);
  const [includePhoto, setIncludePhoto] = useState(true);
  const [includeQr, setIncludeQr] = useState(true);
  const [logReprint, setLogReprint] = useState(true);

  useEffect(() => {
    if (active === 'log') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (!row) return;
    if (active === 'checkin') {
      setVerification(verificationOptions[0]);
      setInTime(row.expected || REGISTER_TIME);
      setInGate(row.gate);
      setValidity(validityOptions[0]);
      setEscort(/not admitted|not required/i.test(row.escort) ? escortOptions[1] : escortOptions[0]);
      setDeskRemarks('');
    }
    if (active === 'checkout') {
      setPassReturn(returnOptions[0]);
      setOutTime(REGISTER_TIME);
      setOutGate(row.gate);
      setExitRemarks('');
    }
    if (active === 'print') {
      setFormat(printFormatOptions[0]);
      setCopies('1');
      setIssuedBy(officerOptions.find((option) => option === row.gateOfficer) ?? officerOptions[0]);
    }
  }, [active, row]);

  const field = (key: keyof VisitDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const validityMinutes = validity === '1 hour' ? 60
    : validity === '2 hours' ? 120 : validity === '4 hours' ? 240 : 600;

  /** Recounted from the time being entered, not the template's fixed figures. */
  const durationAtExit = row && row.checkIn
    ? Math.max(0, minutesOf(outTime) - minutesOf(row.checkIn))
    : 0;
  const overAtExit = row && row.passUntil && !row.checkOut
    ? Math.max(0, minutesOf(outTime) - minutesOf(row.passUntil))
    : 0;

  return (
    <>
      {/* Log New Visit */}
      <Modal
        open={active === 'log'}
        onClose={onClose}
        title="Log New Visit"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onLog(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Log Visit</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">Add a visit to the campus visitor log</p>
        <VisitForm draft={draft} onField={field} suffix="" mode="log" />
      </Modal>

      {/* Edit Visitor Log */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Visitor Log"
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
            <div className="alert alert-warning d-flex align-items-center mb-3">
              <i className="ti ti-alert-triangle me-2" />
              <span className="fs-13">
                Editing a logged visit is written to the audit trail with the original values kept
                alongside.
              </span>
            </div>
            <VisitForm draft={draft} onField={field} suffix="-2" mode="edit" />
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
            verification, time: inTime, gate: inGate, officer: inOfficer,
            validity, escort, remarks: deskRemarks,
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
              <Row label="Host" value={`${row.host} · ${row.hostRole}`} />
              <Row label="Purpose" value={row.purpose} />
              <Row label="Appointment" value={row.expected ? `${row.expected} · ${row.date}` : 'Walk in'} last />
            </div>

            {row.checkIn ? (
              <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-info-circle fs-16" />
                <span className="fs-13">This visit was already checked in at {row.checkIn}.</span>
              </div>
            ) : null}

            <div className="mb-3">
              <span className="form-label d-block">Verification at the desk</span>
              <div className="d-flex flex-wrap gap-3">
                {verificationOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="log-verification"
                      id={`lci-${option}`} checked={verification === option}
                      onChange={() => setVerification(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`lci-${option}`}>
                      <i
                        className={`ti ${option === 'QR Invite' ? 'ti-qrcode' : option === 'Biometric' ? 'ti-fingerprint' : 'ti-id'} me-1`}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="log-check-in-time">Check-In Time</label>
                <input
                  type="time" className="form-control" id="log-check-in-time"
                  value={inTime} onChange={(event) => setInTime(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="log-check-in-gate">Gate</label>
                <select
                  className="form-select" id="log-check-in-gate"
                  value={inGate} onChange={(event) => setInGate(event.target.value)}
                >
                  {gateOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="log-check-in-officer">Gate Officer</label>
                <select
                  className="form-select" id="log-check-in-officer"
                  value={inOfficer} onChange={(event) => setInOfficer(event.target.value)}
                >
                  {officerOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="log-pass-validity">Pass Validity</label>
                <select
                  className="form-select" id="log-pass-validity"
                  value={validity} onChange={(event) => setValidity(event.target.value)}
                >
                  {validityOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
                {/* The pass window follows from the check-in and the choice. */}
                <span className="fs-12 text-muted">
                  Pass valid to {addMinutes(inTime, validityMinutes)}
                </span>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="log-escort">Escort</label>
                <select
                  className="form-select" id="log-escort"
                  value={escort} onChange={(event) => setEscort(event.target.value)}
                >
                  {escortOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="log-photograph">Photograph</label>
                <input type="file" className="form-control" id="log-photograph" />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="desk-remarks">Desk Remarks</label>
                <textarea
                  className="form-control" rows={2} id="desk-remarks"
                  placeholder="Recorded on the visit log"
                  value={deskRemarks} onChange={(event) => setDeskRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="lciPass"
                    checked={printBadge} onChange={(event) => setPrintBadge(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="lciPass">
                    Print the visitor badge with the photograph
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="lciHost"
                    checked={notifyHost} onChange={(event) => setNotifyHost(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="lciHost">
                    Notify the host that the visitor has arrived
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Check-Out Visitor */}
      <Modal
        open={active === 'checkout' && row !== null}
        onClose={onClose}
        title="Check-Out Visitor"
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
            {overAtExit > 0 ? (
              <div className="alert alert-warning d-flex align-items-center mb-3">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">
                  This pass expired at {row.passUntil} and the visit is {durationText(overAtExit)} over.
                  Record the reason before closing the log.
                </span>
              </div>
            ) : null}
            <VisitorStrip row={row}>
              <span className="fs-12 text-muted text-nowrap">{row.passNumber || 'No pass'}</span>
            </VisitorStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Checked In" value={row.checkIn ? `${row.checkIn} · ${row.gate}` : 'Not arrived'} />
              <Row label="Pass Valid Until" value={row.passUntil || 'Not issued'} />
              {/* Recounted against the check-out time being entered. */}
              <Row label="Visit Duration" value={durationText(durationAtExit)} last />
            </div>

            {!row.checkIn ? (
              <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-info-circle fs-16" />
                <span className="fs-13">This visitor has not checked in yet.</span>
              </div>
            ) : null}

            {row.passNumber ? (
              <div className="mb-3">
                <span className="form-label d-block">Pass returned</span>
                <div className="d-flex flex-wrap gap-3">
                  {returnOptions.map((option) => (
                    <div className="form-check" key={option}>
                      <input
                        className="form-check-input" type="radio" name="log-pass-return"
                        id={`lco-${option}`} checked={passReturn === option}
                        onChange={() => setPassReturn(option)}
                      />
                      <label className="form-check-label fs-13" htmlFor={`lco-${option}`}>{option}</label>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="row">
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="log-check-out-time">Check-Out Time</label>
                <input
                  type="time" className="form-control" id="log-check-out-time"
                  value={outTime} onChange={(event) => setOutTime(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="log-exit-gate">Exit Gate</label>
                <select
                  className="form-select" id="log-exit-gate"
                  value={outGate} onChange={(event) => setOutGate(event.target.value)}
                >
                  {gateOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="log-verified-by">Verified By</label>
                <select
                  className="form-select" id="log-verified-by"
                  value={outOfficer} onChange={(event) => setOutOfficer(event.target.value)}
                >
                  {officerOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              {overAtExit > 0 ? (
                <div className="col-md-12"><div className="mb-3">
                  <label className="form-label" htmlFor="log-overstay-reason">Overstay Reason</label>
                  <select
                    className="form-select" id="log-overstay-reason"
                    value={overstayReason} onChange={(event) => setOverstayReason(event.target.value)}
                  >
                    {overstayReasonOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </div></div>
              ) : null}
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="log-exit-remarks">Exit Remarks</label>
                <textarea
                  className="form-control" rows={2} id="log-exit-remarks"
                  placeholder="Recorded on the visit log"
                  value={exitRemarks} onChange={(event) => setExitRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="lcoClear"
                    checked={clearAlert} onChange={(event) => setClearAlert(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="lcoClear">
                    Close the visit and clear the overstay alert
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="lcoSync"
                    checked={syncGate} onChange={(event) => setSyncGate(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="lcoSync">
                    Update the matching gate register entry
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Print Visitor Pass */}
      <Modal
        open={active === 'print' && row !== null}
        onClose={onClose}
        title="Print Visitor Pass"
        onSubmit={(event) => {
          event.preventDefault();
          onPrint({ format, copies, printer, issuedBy });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-printer me-1" />Print Pass
            </button>
          </>
        }
      >
        {row ? (
          <>
            <VisitorStrip row={row}>
              <span className="badge badge-soft-secondary">{row.passNumber || 'No pass'}</span>
            </VisitorStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Host" value={`${row.host} · ${row.department}`} />
              {/* The record's own window and duration, not a fixed pair. */}
              <Row label="Visit Window" value={windowOf(row)} />
              <Row label="Visit Duration" value={durationCellOf(row)} last />
            </div>

            {!row.passNumber ? (
              <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
                <i className="ti ti-info-circle fs-16" />
                <span className="fs-13">
                  No pass has been issued for this visit yet, so there is nothing to reprint.
                </span>
              </div>
            ) : null}

            <div className="mb-3">
              <span className="form-label d-block">Print format</span>
              <div className="d-flex flex-wrap gap-3">
                {printFormatOptions.map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="print-format"
                      id={`pvp-${option}`} checked={format === option}
                      onChange={() => setFormat(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`pvp-${option}`}>{option}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="print-copies">Copies</label>
                <input
                  type="number" className="form-control" id="print-copies" min={1}
                  value={copies} onChange={(event) => setCopies(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="print-printer">Printer</label>
                <select
                  className="form-select" id="print-printer"
                  value={printer} onChange={(event) => setPrinter(event.target.value)}
                >
                  {printerOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="print-issued-by">Issued By</label>
                <select
                  className="form-select" id="print-issued-by"
                  value={issuedBy} onChange={(event) => setIssuedBy(event.target.value)}
                >
                  {officerOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="pvpPhoto"
                    checked={includePhoto} onChange={(event) => setIncludePhoto(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="pvpPhoto">
                    Include the visitor photograph on the badge
                  </label>
                </div>
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="pvpQr"
                    checked={includeQr} onChange={(event) => setIncludeQr(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="pvpQr">
                    Include a QR code for the exit scan
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="pvpLog"
                    checked={logReprint} onChange={(event) => setLogReprint(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="pvpLog">
                    Record the reprint on the audit trail
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* View Visit */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.id ?? 'Visit'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('print')}>
              <i className="ti ti-printer me-1" />Print Pass
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-history me-1" />Open Visit Log Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.name}  •  {row.reference.split('·')[0].trim()}  •  {row.date}
            </p>

            <VisitorStrip row={row} />

            <div className="row g-3 mb-3">
              {[
                { icon: 'ti ti-door-enter', tint: 'success', label: 'Check-In', value: row.checkIn || 'Not arrived' },
                { icon: 'ti ti-door-exit', tint: 'info', label: 'Check-Out', value: row.checkOut || 'Not recorded' },
                { icon: 'ti ti-clock', tint: 'warning', label: 'Duration', value: durationCellOf(row) },
                { icon: 'ti ti-users', tint: 'primary', label: 'Frequency', value: frequencyLabelOf(row) },
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
                <h6 className="fs-13 mb-2">Host &amp; Meeting</h6>
                <div className="border rounded p-3">
                  {hostPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Visit Record</h6>
                <div className="border rounded p-3">
                  {visitPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
            </div>

            <h6 className="fs-13 mb-2 mt-3">Entry &amp; Exit Timeline</h6>
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

            <h6 className="fs-13 mb-2 mt-3">Identity &amp; Contact</h6>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="border rounded p-3">
                  {identityPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <div className="border rounded p-3">
                  {contactPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
            </div>

            <h6 className="fs-13 mb-2 mt-3">Security Notes</h6>
            <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
              <span className={visitorBadge[row.visitorType]}>{row.visitorType}</span>
              <span className={departmentBadge[row.department]}>{row.department}</span>
            </div>
            <p className="fs-13 text-muted mb-0">{row.notes}</p>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default VisitModals;
