import { useEffect, useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { Visitor } from '../data/visitors.data';
import {
  accessLevelOptions,
  checkedOutByOptions,
  decisionOptions,
  hostelOptions,
  idProofTypeOptions,
  meetingPointOptions,
  passFormatOptions,
  passReturnedOptions,
  passValidOptions,
  relationshipOptions,
  statusBadge,
  studentChoices,
  studentSummaryOf,
  summaryOf,
  visitorTypeOptions,
  wardenChoices,
} from '../data/visitors.data';

export type VisitorModalId = 'new' | 'check-in' | 'check-out' | 'verify' | 'pass' | 'view';

export interface VisitorDraft {
  name: string;
  visitorType: string;
  mobile: string;
  student: string;
  relationship: string;
  hostel: string;
  purpose: string;
  meetingPoint: string;
  idProof: string;
  idNumber: string;
  /** Gate fields, collected by Check-In only. */
  date: string;
  time: string;
  passValid: string;
  verifiedBy: string;
  approval: boolean;
  notify: boolean;
}

export const emptyDraft: VisitorDraft = {
  name: '', visitorType: visitorTypeOptions[0], mobile: '', student: '',
  relationship: relationshipOptions[0], hostel: hostelOptions[0], purpose: '',
  meetingPoint: meetingPointOptions[0], idProof: idProofTypeOptions[0], idNumber: '',
  date: '31-07-2026', time: '10:15', passValid: passValidOptions[0], verifiedBy: wardenChoices[0],
  approval: true, notify: true,
};

export const draftOf = (row: Visitor): VisitorDraft => ({
  name: row.visitor,
  visitorType: row.visitorType,
  mobile: row.visitorPairs.find((pair) => pair.label === 'Mobile')?.value ?? '',
  student: studentChoices.find((choice) => choice.startsWith(row.student)) ?? '',
  relationship: row.relationship,
  hostel: hostelOptions.find((option) => option.startsWith(row.hostel)) ?? hostelOptions[0],
  purpose: row.purpose,
  meetingPoint: meetingPointOptions[0],
  idProof: row.idProof || idProofTypeOptions[0],
  idNumber: row.idNumber,
  date: '31-07-2026',
  time: '10:15',
  passValid: passValidOptions[0],
  verifiedBy: wardenChoices[0],
  approval: true,
  notify: true,
});

export interface VisitorModalsProps {
  active: VisitorModalId | null;
  row: Visitor | null;
  onClose: () => void;
  onRegister: (draft: VisitorDraft) => void;
  onCheckIn: (draft: VisitorDraft) => void;
  onCheckOut: (date: string, time: string, passReturned: string, by: string, flag: boolean) => void;
  onVerify: (decision: string, verifiedBy: string, slot: string, access: string) => void;
  onPrintPass: (format: string, copies: string) => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** The View dialog hands off to Check-Out, Print Pass and the offcanvas. */
  onOpen: (modal: VisitorModalId) => void;
  onOpenPanel: () => void;
}

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: VisitorDraft;
  onField: (field: keyof VisitorDraft, value: string | boolean) => void;
  /** Check-In adds the gate fields the New Entry form leaves out. */
  gate: boolean;
  suffix: string;
}

const VisitorForm = ({ draft, onField, gate, suffix }: FormProps) => (
  <div className="row">
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`visitor-name${suffix}`}>Visitor Name</label>
      <input
        type="text" className="form-control" id={`visitor-name${suffix}`} placeholder="Janet Gourley"
        value={draft.name} onChange={(event) => onField('name', event.target.value)}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`visitor-type${suffix}`}>Visitor Type</label>
      <select
        className="form-select" id={`visitor-type${suffix}`}
        value={draft.visitorType} onChange={(event) => onField('visitorType', event.target.value)}
      >
        {visitorTypeOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`visitor-mobile${suffix}`}>Mobile</label>
      <input
        type="text" className="form-control" id={`visitor-mobile${suffix}`} placeholder="+1 ..."
        value={draft.mobile} onChange={(event) => onField('mobile', event.target.value)}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`visitor-student${suffix}`}>Student</label>
      <select
        className="form-select" id={`visitor-student${suffix}`}
        value={draft.student} onChange={(event) => onField('student', event.target.value)}
      >
        <option value="">Select student</option>
        {studentChoices.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`visitor-relationship${suffix}`}>Relationship</label>
      <select
        className="form-select" id={`visitor-relationship${suffix}`}
        value={draft.relationship} onChange={(event) => onField('relationship', event.target.value)}
      >
        {relationshipOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`visitor-hostel${suffix}`}>Hostel</label>
      <select
        className="form-select" id={`visitor-hostel${suffix}`}
        value={draft.hostel} onChange={(event) => onField('hostel', event.target.value)}
      >
        {hostelOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`visitor-meeting${suffix}`}>Meeting Point</label>
      <select
        className="form-select" id={`visitor-meeting${suffix}`}
        value={draft.meetingPoint} onChange={(event) => onField('meetingPoint', event.target.value)}
      >
        {meetingPointOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`visitor-idtype${suffix}`}>ID Proof Type</label>
      <select
        className="form-select" id={`visitor-idtype${suffix}`}
        value={draft.idProof} onChange={(event) => onField('idProof', event.target.value)}
      >
        {idProofTypeOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`visitor-idnumber${suffix}`}>ID Number</label>
      <input
        type="text" className="form-control" id={`visitor-idnumber${suffix}`} placeholder="DL-44••••71"
        value={draft.idNumber} onChange={(event) => onField('idNumber', event.target.value)}
      />
    </div></div>

    {gate ? (
      <>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`visitor-date${suffix}`}>Check-In Date</label>
          <DateField
            id={`visitor-date${suffix}`} value={draft.date}
            onChange={(value) => onField('date', value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`visitor-time${suffix}`}>Check-In Time</label>
          <input
            type="time" className="form-control" id={`visitor-time${suffix}`}
            value={draft.time} onChange={(event) => onField('time', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`visitor-pass${suffix}`}>Pass Valid For</label>
          <select
            className="form-select" id={`visitor-pass${suffix}`}
            value={draft.passValid} onChange={(event) => onField('passValid', event.target.value)}
          >
            {passValidOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`visitor-verified${suffix}`}>Verified By</label>
          <select
            className="form-select" id={`visitor-verified${suffix}`}
            value={draft.verifiedBy} onChange={(event) => onField('verifiedBy', event.target.value)}
          >
            {wardenChoices.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
      </>
    ) : null}

    <div className="col-md-12"><div className="mb-3">
      <label className="form-label" htmlFor={`visitor-purpose${suffix}`}>Purpose of Visit</label>
      <textarea
        className="form-control" rows={2} id={`visitor-purpose${suffix}`}
        placeholder="Recorded on the gate register"
        value={draft.purpose} onChange={(event) => onField('purpose', event.target.value)}
      />
    </div></div>
    <div className="col-md-12">
      <div className="form-check form-switch mb-2">
        <input
          className="form-check-input" type="checkbox" role="switch" id={`nvApproval${suffix}`}
          checked={draft.approval} onChange={(event) => onField('approval', event.target.checked)}
        />
        <label className="form-check-label fs-13" htmlFor={`nvApproval${suffix}`}>
          Send to the warden for approval before entry
        </label>
      </div>
      <div className="form-check form-switch mb-0">
        <input
          className="form-check-input" type="checkbox" role="switch" id={`nvNotify${suffix}`}
          checked={draft.notify} onChange={(event) => onField('notify', event.target.checked)}
        />
        <label className="form-check-label fs-13" htmlFor={`nvNotify${suffix}`}>
          Notify the student and the registered guardian
        </label>
      </div>
    </div>
  </div>
);

/** The label/value line the dialogs share. */
const Row = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

/* --------------------------------- Modals ---------------------------------- */

const VisitorModals = ({
  active, row, onClose, onRegister, onCheckIn, onCheckOut, onVerify, onPrintPass,
  onToast, onOpen, onOpenPanel,
}: VisitorModalsProps) => {
  const [draft, setDraft] = useState<VisitorDraft>(emptyDraft);
  const [outDate, setOutDate] = useState('31-07-2026');
  const [outTime, setOutTime] = useState('17:10');
  const [passReturned, setPassReturned] = useState(passReturnedOptions[0]);
  const [checkedOutBy, setCheckedOutBy] = useState(checkedOutByOptions[0]);
  const [outRemarks, setOutRemarks] = useState('');
  const [flagOverstay, setFlagOverstay] = useState(false);
  const [notifyOut, setNotifyOut] = useState(true);

  const [decision, setDecision] = useState(decisionOptions[0]);
  const [verifiedBy, setVerifiedBy] = useState(wardenChoices[0]);
  const [slot, setSlot] = useState('11:00');
  const [access, setAccess] = useState(accessLevelOptions[0]);
  const [verifyNotes, setVerifyNotes] = useState('');
  const [notifySms, setNotifySms] = useState(true);

  const [format, setFormat] = useState(passFormatOptions[0]);
  const [copies, setCopies] = useState('1');
  const [withQr, setWithQr] = useState(true);
  const [withPhoto, setWithPhoto] = useState(true);

  /** Each opening seeds from the row being acted on, or a blank sheet for New. */
  useEffect(() => {
    if (active === 'new') setDraft(emptyDraft);
    else if (active === 'check-in' && row) setDraft(draftOf(row));

    if (active === 'check-out' && row) {
      setOutDate('31-07-2026');
      setOutTime('17:10');
      setPassReturned(passReturnedOptions[0]);
      setCheckedOutBy(checkedOutByOptions[0]);
      setOutRemarks('');
      // Only an expired pass is an overstay worth flagging.
      setFlagOverstay(row.status === 'Pass Expired');
      setNotifyOut(true);
    }
    if (active === 'verify' && row) {
      setDecision(decisionOptions[0]);
      setVerifiedBy(wardenChoices[0]);
      setSlot('11:00');
      setAccess(accessLevelOptions[0]);
      setVerifyNotes('');
    }
    if (active === 'pass') {
      setFormat(passFormatOptions[0]);
      setCopies('1');
      setWithQr(true);
      setWithPhoto(true);
    }
  }, [active, row]);

  const field = (key: keyof VisitorDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  return (
    <>
      {/* New Visitor Entry */}
      <Modal
        open={active === 'new'}
        onClose={onClose}
        title="New Visitor Entry"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onRegister(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Register Visitor</button>
          </>
        }
      >
        <VisitorForm draft={draft} onField={field} gate={false} suffix="" />
      </Modal>

      {/* Check-In Visitor */}
      <Modal
        open={active === 'check-in'}
        onClose={onClose}
        title="Check-In Visitor"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onCheckIn(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Check In</button>
          </>
        }
      >
        <VisitorForm draft={draft} onField={field} gate suffix="-2" />
      </Modal>

      {/* Check-Out Visitor */}
      <Modal
        open={active === 'check-out' && row !== null}
        onClose={onClose}
        title="Check-Out Visitor"
        onSubmit={(event) => {
          event.preventDefault();
          onCheckOut(outDate, outTime, passReturned, checkedOutBy, flagOverstay);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Check Out</button>
          </>
        }
      >
        {row ? (
          <>
            {row.status === 'Pass Expired' ? (
              <div className="alert alert-warning d-flex align-items-center mb-3" role="alert">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">
                  {row.durationPairs.find((pair) => pair.label === 'Overstay')?.value ?? 'Pass expired'} —
                  the visit is closing outside its pass window.
                </span>
              </div>
            ) : null}
            <div className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center">
                <span className="avatar avatar-md rounded flex-shrink-0">
                  <ImageWithBasePath src={row.visitorAvatar} className="rounded" alt={row.visitor} />
                </span>
                <div className="ms-2">
                  <h5 className="fs-14 mb-0">{row.visitor}</h5>
                  <span className="fs-12 text-muted">{studentSummaryOf(row)}</span>
                </div>
                <span className={`${statusBadge[row.status]} ms-auto`}>{row.status}</span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="check-out-date">Check-Out Date</label>
                <DateField id="check-out-date" value={outDate} onChange={setOutDate} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="check-out-time">Check-Out Time</label>
                <input
                  type="time" className="form-control" id="check-out-time"
                  value={outTime} onChange={(event) => setOutTime(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="pass-returned">Pass Returned</label>
                <select
                  className="form-select" id="pass-returned"
                  value={passReturned} onChange={(event) => setPassReturned(event.target.value)}
                >
                  {passReturnedOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="checked-out-by">Checked Out By</label>
                <select
                  className="form-select" id="checked-out-by"
                  value={checkedOutBy} onChange={(event) => setCheckedOutBy(event.target.value)}
                >
                  {checkedOutByOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="warden-remarks">Warden Remarks</label>
                <textarea
                  className="form-control" rows={2} id="warden-remarks"
                  placeholder="Recorded on the gate register"
                  value={outRemarks} onChange={(event) => setOutRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="coFlag"
                    checked={flagOverstay} onChange={(event) => setFlagOverstay(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="coFlag">
                    Flag the overstay on the visitor record
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="coNotify"
                    checked={notifyOut} onChange={(event) => setNotifyOut(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="coNotify">
                    Notify the registered guardian of the completed visit
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Verify Visitor */}
      <Modal
        open={active === 'verify' && row !== null}
        onClose={onClose}
        title="Verify Visitor"
        onSubmit={(event) => { event.preventDefault(); onVerify(decision, verifiedBy, slot, access); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Decision</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center">
                <span className="avatar avatar-md rounded flex-shrink-0">
                  <ImageWithBasePath src={row.visitorAvatar} className="rounded" alt={row.visitor} />
                </span>
                <div className="ms-2">
                  <h5 className="fs-14 mb-0">{row.visitor}</h5>
                  <span className="fs-12 text-muted">{studentSummaryOf(row)}</span>
                </div>
                <span className={`${statusBadge[row.status]} ms-auto`}>{row.status}</span>
              </div>
            </div>
            <div className="border rounded p-3 mb-3">
              {row.durationPairs.map((pair, index, all) => (
                <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
              ))}
            </div>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="decision">Decision</label>
                <select
                  className="form-select" id="decision"
                  value={decision} onChange={(event) => setDecision(event.target.value)}
                >
                  {decisionOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="verified-by-3">Verified By</label>
                <select
                  className="form-select" id="verified-by-3"
                  value={verifiedBy} onChange={(event) => setVerifiedBy(event.target.value)}
                >
                  {wardenChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="approved-slot">Approved Slot</label>
                <input
                  type="time" className="form-control" id="approved-slot"
                  value={slot} onChange={(event) => setSlot(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="access-level">Access Level</label>
                <select
                  className="form-select" id="access-level"
                  value={access} onChange={(event) => setAccess(event.target.value)}
                >
                  {accessLevelOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="verification-notes">Verification Notes</label>
                <textarea
                  className="form-control" rows={2} id="verification-notes"
                  placeholder="Recorded against the visit request"
                  value={verifyNotes} onChange={(event) => setVerifyNotes(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="vvNotify"
                    checked={notifySms} onChange={(event) => setNotifySms(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="vvNotify">
                    Notify the visitor of the decision by SMS
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Print Visitor Pass */}
      <Modal
        open={active === 'pass' && row !== null}
        onClose={onClose}
        title="Print Visitor Pass"
        onSubmit={(event) => { event.preventDefault(); onPrintPass(format, copies); }}
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
            <div className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center">
                <span className="avatar avatar-md bg-primary-transparent text-primary rounded flex-shrink-0">
                  <i className="ti ti-id-badge-2" />
                </span>
                <div className="ms-2">
                  <h5 className="fs-14 mb-0">Visitor Pass {row.pass}</h5>
                  <span className="fs-12 text-muted">{row.visitor} · {row.id}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="pass-format">Pass Format</label>
                <select
                  className="form-select" id="pass-format"
                  value={format} onChange={(event) => setFormat(event.target.value)}
                >
                  {passFormatOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="copies">Copies</label>
                <input
                  type="number" className="form-control" id="copies" min={1}
                  value={copies} onChange={(event) => setCopies(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="ppQr"
                    checked={withQr} onChange={(event) => setWithQr(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="ppQr">
                    Include the QR code for gate scanning
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="ppPhoto"
                    checked={withPhoto} onChange={(event) => setWithPhoto(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="ppPhoto">
                    Print the captured visitor photograph
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* View Visitor */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.visitor ?? 'Visitor'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('pass')}>
              <i className="ti ti-printer me-1" />Print Pass
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-user-shield me-1" />Open Visitor Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="mb-3 fs-12 text-muted">{summaryOf(row)}</p>
            <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
              <span className="avatar avatar-lg rounded flex-shrink-0">
                <ImageWithBasePath src={row.visitorAvatar} className="rounded" alt={row.visitor} />
              </span>
              <div>
                <h5 className="mb-0 fs-15">{row.visitor}</h5>
                <span className="fs-12 text-muted">{row.visitorType} · {row.relationship}</span>
              </div>
              <span className={`${statusBadge[row.status]} ms-auto`}>{row.status}</span>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Visitor &amp; Contact</h6>
                <div className="border rounded p-3">
                  {row.contactPairs.map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Student Being Visited</h6>
                <div className="border rounded p-3">
                  {row.studentPairs.map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
            </div>

            <h6 className="fs-13 mb-2">Purpose of Visit</h6>
            <p className="fs-13 text-muted mb-3">{row.purpose}</p>

            <h6 className="fs-13 mb-2">Security Verification</h6>
            {row.identity.map((entry) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={entry.title}>
                <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                  <i className="ti ti-id" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0">{entry.title}</h6>
                  <span className="fs-12 text-muted">{entry.meta}</span>
                </div>
              </div>
            ))}

            <button
              type="button" className="btn btn-link p-0 fs-12 mt-2"
              onClick={() => onToast(`Gate register printed for ${row.visitor}`, 'info')}
            >
              Print the gate register entry
            </button>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default VisitorModals;
