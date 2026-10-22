import { useEffect, useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { Warden, WardenStatus } from '../data/wardens.data';
import {
  assignBlockOptions,
  assignHostelOptions,
  blockOptions,
  contactPairsOf,
  coverWardenOptions,
  designationOptions,
  documentTypeOptions,
  employmentPairsOf,
  experienceLabel,
  floorResponsibilityOptions,
  formHostelOptions,
  genderOptions,
  hostelKeyOf,
  placementOf,
  relationOptions,
  reportsToOptions,
  residenceOptions,
  shiftOptions,
  statusBadge,
  statusOptions,
  summaryOf,
  wardenLineOf,
  weeklyOffOptions,
} from '../data/wardens.data';

export type WardenModalId = 'add' | 'edit' | 'assign' | 'shift' | 'documents' | 'view';

export interface WardenDraft {
  name: string;
  employeeId: string;
  gender: string;
  dob: string;
  joined: string;
  email: string;
  contact: string;
  designation: string;
  experience: string;
  residence: string;
  hostel: string;
  block: string;
  shift: string;
  emergencyName: string;
  relation: string;
  emergencyMobile: string;
  status: WardenStatus;
}

export const emptyDraft: WardenDraft = {
  name: '', employeeId: '', gender: genderOptions[0], dob: '', joined: '', email: '', contact: '',
  designation: designationOptions[1], experience: '', residence: residenceOptions[0],
  hostel: formHostelOptions[2], block: blockOptions[0], shift: shiftOptions[0],
  emergencyName: '', relation: relationOptions[0], emergencyMobile: '', status: 'Active',
};

/** "14 Mar 1984" → "14-03-1984", the form's own date format. */
const toPickerDate = (value: string): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  return index === -1 ? value : `${day}-${String(index + 1).padStart(2, '0')}-${year}`;
};

export const draftOf = (row: Warden): WardenDraft => ({
  name: row.name,
  employeeId: row.employeeId,
  gender: row.gender,
  dob: toPickerDate(row.dob),
  joined: toPickerDate(row.joined),
  email: row.email,
  contact: row.contact,
  designation: row.designation,
  experience: experienceLabel(row),
  residence: row.residence.startsWith('Off campus') ? residenceOptions[1] : residenceOptions[0],
  hostel: row.hostel ? hostelKeyOf(row) : formHostelOptions[2],
  block: row.block || blockOptions[0],
  shift: row.shift === 'Rotational'
    ? shiftOptions[2]
    : row.shift === 'Night Shift' ? shiftOptions[1] : shiftOptions[0],
  emergencyName: row.emergencyPairs[0]?.value ?? '',
  relation: row.emergencyPairs[1]?.value ?? relationOptions[0],
  emergencyMobile: row.emergencyPairs[2]?.value ?? '',
  status: row.status,
});

export interface WardenModalsProps {
  active: WardenModalId | null;
  row: Warden | null;
  /** Every warden but the one being edited, for the Cover Warden list. */
  coverChoices: string[];
  onClose: () => void;
  onCreate: (draft: WardenDraft) => void;
  onUpdate: (draft: WardenDraft) => void;
  onAssign: (hostel: string, block: string, floors: string, reportsTo: string) => void;
  onChangeShift: (start: string, end: string, weeklyOff: string, cover: string) => void;
  onUploadDocument: (type: string, validUntil: string, verified: boolean) => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** The View dialog hands off to Change Shift and to the offcanvas. */
  onOpen: (modal: WardenModalId) => void;
  onOpenPanel: () => void;
}

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: WardenDraft;
  onField: (field: keyof WardenDraft, value: string) => void;
  /** Keeps input ids unique between the Add and Edit dialogs. */
  suffix: string;
}

const WardenForm = ({ draft, onField, suffix }: FormProps) => (
  <div className="row">
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`warden-name${suffix}`}>Warden Name</label>
      <input
        type="text" className="form-control" id={`warden-name${suffix}`} placeholder="Mrs. Alice Ray"
        value={draft.name} onChange={(event) => onField('name', event.target.value)}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`employee-id${suffix}`}>Employee ID</label>
      <input
        type="text" className="form-control" id={`employee-id${suffix}`} placeholder="EMP-2026-001"
        value={draft.employeeId} onChange={(event) => onField('employeeId', event.target.value)}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`warden-gender${suffix}`}>Gender</label>
      <select
        className="form-select" id={`warden-gender${suffix}`}
        value={draft.gender} onChange={(event) => onField('gender', event.target.value)}
      >
        {genderOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`warden-dob${suffix}`}>Date of Birth</label>
      <DateField
        id={`warden-dob${suffix}`} value={draft.dob} onChange={(value) => onField('dob', value)}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`warden-joined${suffix}`}>Joining Date</label>
      <DateField
        id={`warden-joined${suffix}`} value={draft.joined} onChange={(value) => onField('joined', value)}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`warden-email${suffix}`}>Email</label>
      <input
        type="email" className="form-control" id={`warden-email${suffix}`} placeholder="name@karkaii.com"
        value={draft.email} onChange={(event) => onField('email', event.target.value)}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`warden-contact${suffix}`}>Contact Number</label>
      <input
        type="text" className="form-control" id={`warden-contact${suffix}`} placeholder="+1 ..."
        value={draft.contact} onChange={(event) => onField('contact', event.target.value)}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`warden-designation${suffix}`}>Designation</label>
      <select
        className="form-select" id={`warden-designation${suffix}`}
        value={draft.designation} onChange={(event) => onField('designation', event.target.value)}
      >
        {designationOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`warden-experience${suffix}`}>Experience</label>
      <input
        type="text" className="form-control" id={`warden-experience${suffix}`} placeholder="7 years"
        value={draft.experience} onChange={(event) => onField('experience', event.target.value)}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`warden-residence${suffix}`}>Residence</label>
      <select
        className="form-select" id={`warden-residence${suffix}`}
        value={draft.residence} onChange={(event) => onField('residence', event.target.value)}
      >
        {residenceOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`warden-hostel${suffix}`}>Hostel</label>
      <select
        className="form-select" id={`warden-hostel${suffix}`}
        value={draft.hostel} onChange={(event) => onField('hostel', event.target.value)}
      >
        {formHostelOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`warden-block${suffix}`}>Block</label>
      <select
        className="form-select" id={`warden-block${suffix}`}
        value={draft.block} onChange={(event) => onField('block', event.target.value)}
      >
        {blockOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`warden-shift${suffix}`}>Shift</label>
      <select
        className="form-select" id={`warden-shift${suffix}`}
        value={draft.shift} onChange={(event) => onField('shift', event.target.value)}
      >
        {shiftOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`warden-emergency${suffix}`}>Emergency Contact</label>
      <input
        type="text" className="form-control" id={`warden-emergency${suffix}`} placeholder="Contact name"
        value={draft.emergencyName} onChange={(event) => onField('emergencyName', event.target.value)}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`warden-relation${suffix}`}>Relation</label>
      <select
        className="form-select" id={`warden-relation${suffix}`}
        value={draft.relation} onChange={(event) => onField('relation', event.target.value)}
      >
        {relationOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`warden-emergency-mobile${suffix}`}>Emergency Mobile</label>
      <input
        type="text" className="form-control" id={`warden-emergency-mobile${suffix}`} placeholder="+1 ..."
        value={draft.emergencyMobile}
        onChange={(event) => onField('emergencyMobile', event.target.value)}
      />
    </div></div>
    {/* The grid prints a status pill the template's form never collected. */}
    <div className="col-md-6"><div className="mb-0">
      <label className="form-label" htmlFor={`warden-status${suffix}`}>Status</label>
      <select
        className="form-select" id={`warden-status${suffix}`}
        value={draft.status} onChange={(event) => onField('status', event.target.value)}
      >
        {statusOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div></div>
  </div>
);

/* --------------------------------- Modals ---------------------------------- */

const WardenModals = ({
  active, row, coverChoices, onClose, onCreate, onUpdate, onAssign, onChangeShift,
  onUploadDocument, onToast, onOpen, onOpenPanel,
}: WardenModalsProps) => {
  const [draft, setDraft] = useState<WardenDraft>(emptyDraft);
  const [assignHostel, setAssignHostel] = useState('');
  const [assignBlock, setAssignBlock] = useState(assignBlockOptions[0]);
  const [floors, setFloors] = useState(floorResponsibilityOptions[0]);
  const [effectiveFrom, setEffectiveFrom] = useState('05-08-2026');
  const [reportsTo, setReportsTo] = useState(reportsToOptions[0]);
  const [assignRemarks, setAssignRemarks] = useState('');
  const [quarters, setQuarters] = useState(true);
  const [notifyAssign, setNotifyAssign] = useState(true);

  const [start, setStart] = useState('06:00');
  const [end, setEnd] = useState('18:00');
  const [weeklyOff, setWeeklyOff] = useState(weeklyOffOptions[0]);
  const [shiftFrom, setShiftFrom] = useState('01-08-2026');
  const [cover, setCover] = useState('');
  const [shiftReason, setShiftReason] = useState('');
  const [republish, setRepublish] = useState(true);

  const [documentType, setDocumentType] = useState(documentTypeOptions[0]);
  const [validUntil, setValidUntil] = useState('30-06-2027');
  const [documentRemarks, setDocumentRemarks] = useState('');
  const [verified, setVerified] = useState(false);

  /** Each opening seeds from the row being acted on, or a blank sheet for Add. */
  useEffect(() => {
    if (active === 'add') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (active === 'assign' && row) {
      setAssignHostel(row.hostel ? assignHostelOptions.find((option) => option.startsWith(row.hostel)) ?? '' : '');
      setAssignBlock(row.block ? row.block : assignBlockOptions[0]);
      setFloors(floorResponsibilityOptions[0]);
      setEffectiveFrom('05-08-2026');
      setReportsTo(reportsToOptions[0]);
      setAssignRemarks('');
    }
    if (active === 'shift' && row) {
      // The dialog opens on the warden's own hours, not the template's fixed pair.
      const night = row.shift === 'Night Shift';
      setStart(night ? '18:00' : '06:00');
      setEnd(night ? '06:00' : '18:00');
      setWeeklyOff(weeklyOffOptions[0]);
      setShiftFrom('01-08-2026');
      setCover('');
      setShiftReason('');
    }
    if (active === 'documents') {
      setDocumentType(documentTypeOptions[0]);
      setValidUntil('30-06-2027');
      setDocumentRemarks('');
      setVerified(false);
    }
  }, [active, row]);

  const field = (key: keyof WardenDraft, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));

  return (
    <>
      {/* Add Warden */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Warden"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Warden</button>
          </>
        }
      >
        <WardenForm draft={draft} onField={field} suffix="" />
      </Modal>

      {/* Edit Warden */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Warden"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        <WardenForm draft={draft} onField={field} suffix="-2" />
      </Modal>

      {/* Assign Hostel */}
      <Modal
        open={active === 'assign' && row !== null}
        onClose={onClose}
        title="Assign Hostel"
        onSubmit={(event) => {
          event.preventDefault();
          onAssign(assignHostel, assignBlock, floors, reportsTo);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Assign Hostel</button>
          </>
        }
      >
        {row ? (
          <>
            {row.status === 'Pending Assignment' ? (
              <div className="alert alert-warning d-flex align-items-center mb-3" role="alert">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">
                  Police verification is still pending — the assignment takes effect once it clears.
                </span>
              </div>
            ) : null}
            <div className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center">
                <span className="avatar avatar-md rounded flex-shrink-0">
                  <ImageWithBasePath src={row.avatar} className="rounded" alt={row.name} />
                </span>
                <div className="ms-2">
                  <h5 className="fs-14 mb-0">{row.name}</h5>
                  <span className="fs-12 text-muted">{wardenLineOf(row)}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="hostel-4">Hostel</label>
                <select
                  className="form-select" id="hostel-4"
                  value={assignHostel} onChange={(event) => setAssignHostel(event.target.value)}
                >
                  <option value="">Select hostel</option>
                  {assignHostelOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="block-3">Block</label>
                <select
                  className="form-select" id="block-3"
                  value={assignBlock} onChange={(event) => setAssignBlock(event.target.value)}
                >
                  {assignBlockOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="floor-responsibility">Floor Responsibility</label>
                <select
                  className="form-select" id="floor-responsibility"
                  value={floors} onChange={(event) => setFloors(event.target.value)}
                >
                  {floorResponsibilityOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="effective-from">Effective From</label>
                <DateField id="effective-from" value={effectiveFrom} onChange={setEffectiveFrom} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="reports-to">Reports To</label>
                <select
                  className="form-select" id="reports-to"
                  value={reportsTo} onChange={(event) => setReportsTo(event.target.value)}
                >
                  {reportsToOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="remarks">Remarks</label>
                <textarea
                  className="form-control" rows={2} id="remarks"
                  placeholder="Recorded on the warden profile"
                  value={assignRemarks} onChange={(event) => setAssignRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="ahQuarters"
                    checked={quarters} onChange={(event) => setQuarters(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="ahQuarters">
                    Allocate on-campus warden quarters
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="ahNotify"
                    checked={notifyAssign} onChange={(event) => setNotifyAssign(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="ahNotify">
                    Notify the warden and the hostel director
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Change Shift */}
      <Modal
        open={active === 'shift' && row !== null}
        onClose={onClose}
        title="Change Shift"
        onSubmit={(event) => { event.preventDefault(); onChangeShift(start, end, weeklyOff, cover); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Change Shift</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center">
                <span className="avatar avatar-md rounded flex-shrink-0">
                  <ImageWithBasePath src={row.avatar} className="rounded" alt={row.name} />
                </span>
                <div className="ms-2">
                  <h5 className="fs-14 mb-0">{row.name}</h5>
                  <span className="fs-12 text-muted">{placementOf(row)}</span>
                </div>
                <span className="badge badge-soft-secondary ms-auto">{row.shift}</span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="start-time">Start Time</label>
                {/* The template uses a native `type="time"` here, not the flatpickr field. */}
                <input
                  type="time" className="form-control" id="start-time"
                  value={start} onChange={(event) => setStart(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="end-time">End Time</label>
                <input
                  type="time" className="form-control" id="end-time"
                  value={end} onChange={(event) => setEnd(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="weekly-off">Weekly Off</label>
                <select
                  className="form-select" id="weekly-off"
                  value={weeklyOff} onChange={(event) => setWeeklyOff(event.target.value)}
                >
                  {weeklyOffOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="effective-from-2">Effective From</label>
                <DateField id="effective-from-2" value={shiftFrom} onChange={setShiftFrom} />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="cover-warden">Cover Warden</label>
                <select
                  className="form-select" id="cover-warden"
                  value={cover} onChange={(event) => setCover(event.target.value)}
                >
                  <option value="">Select cover</option>
                  {(coverChoices.length > 0 ? coverChoices : coverWardenOptions).map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="reason">Reason</label>
                <textarea
                  className="form-control" rows={2} id="reason"
                  placeholder="Recorded on the duty roster"
                  value={shiftReason} onChange={(event) => setShiftReason(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="csRoster"
                    checked={republish} onChange={(event) => setRepublish(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="csRoster">
                    Republish the duty roster to all wardens
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Upload Documents */}
      <Modal
        open={active === 'documents' && row !== null}
        onClose={onClose}
        title="Upload Documents"
        onSubmit={(event) => {
          event.preventDefault();
          onUploadDocument(documentType, validUntil, verified);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Upload Document</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
              <span className="avatar avatar-sm rounded flex-shrink-0">
                <ImageWithBasePath src={row.avatar} className="rounded" alt={row.name} />
              </span>
              <div className="flex-fill overflow-hidden">
                <h5 className="fs-13 mb-0">{row.name}</h5>
                <span className="fs-12 text-muted">{row.id} · {row.employeeId}</span>
              </div>
            </div>

            {/* The row's own documents, not the template's fixed pair. */}
            {row.documents.map((document) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={document.name}>
                <span className="avatar avatar-sm bg-light text-dark rounded flex-shrink-0">
                  <i className="ti ti-file-text" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{document.name}</h6>
                  <span className="fs-12 text-muted">{document.meta}</span>
                </div>
                <span className={`badge badge-soft-${/pending/i.test(document.meta) ? 'warning' : 'success'}`}>
                  {/pending/i.test(document.meta) ? 'Pending' : 'Verified'}
                </span>
              </div>
            ))}

            <div className="row mt-3">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="document-type">Document Type</label>
                <select
                  className="form-select" id="document-type"
                  value={documentType} onChange={(event) => setDocumentType(event.target.value)}
                >
                  {documentTypeOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="valid-until">Valid Until</label>
                <DateField id="valid-until" value={validUntil} onChange={setValidUntil} />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="choose-file">Choose File</label>
                <input type="file" className="form-control" id="choose-file" />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="remarks-2">Remarks</label>
                <textarea
                  className="form-control" rows={2} id="remarks-2"
                  placeholder="Visible to the HR office"
                  value={documentRemarks} onChange={(event) => setDocumentRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="udVerified"
                    checked={verified} onChange={(event) => setVerified(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="udVerified">
                    Mark this document as verified by the HR office
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* View Profile */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.name ?? 'Warden'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('shift')}>
              <i className="ti ti-clock-hour-4 me-1" />Change Shift
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-user-shield me-1" />Open Warden Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="mb-3 fs-12 text-muted">{summaryOf(row)}</p>
            <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
              <span className="avatar avatar-lg rounded flex-shrink-0">
                <ImageWithBasePath src={row.avatar} className="rounded" alt={row.name} />
              </span>
              <div>
                <h5 className="mb-0 fs-15">{row.name}</h5>
                <span className="fs-12 text-muted">{placementOf(row)}</span>
              </div>
              <span className={`${statusBadge[row.status]} ms-auto`}>{row.status}</span>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Personal &amp; Contact</h6>
                <div className="border rounded p-3">
                  {contactPairsOf(row).map((pair, index, all) => (
                    <div
                      className={`d-flex align-items-center justify-content-between ${index === all.length - 1 ? 'mb-0' : 'mb-2'}`}
                      key={pair.label}
                    >
                      <span className="fs-13 text-muted">{pair.label}</span>
                      <span className="fs-13 fw-medium">{pair.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Employment</h6>
                <div className="border rounded p-3">
                  {employmentPairsOf(row).map((pair, index, all) => (
                    <div
                      className={`d-flex align-items-center justify-content-between ${index === all.length - 1 ? 'mb-0' : 'mb-2'}`}
                      key={pair.label}
                    >
                      <span className="fs-13 text-muted">{pair.label}</span>
                      <span className="fs-13 fw-medium">{pair.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <h6 className="fs-13 mb-2">Duty Schedule</h6>
            <div className="border rounded p-3 mb-3">
              {row.dutyPairs.map((pair, index, all) => (
                <div
                  className={`d-flex align-items-center justify-content-between ${index === all.length - 1 ? 'mb-0' : 'mb-2'}`}
                  key={pair.label}
                >
                  <span className="fs-13 text-muted">{pair.label}</span>
                  <span className="fs-13 fw-medium">{pair.value}</span>
                </div>
              ))}
            </div>

            <h6 className="fs-13 mb-2">Qualification</h6>
            <p className="fs-13 text-muted mb-3">{row.qualification}</p>

            <h6 className="fs-13 mb-2">Documents</h6>
            {row.documents.map((document) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={document.name}>
                <span className="avatar avatar-sm bg-light text-dark rounded flex-shrink-0">
                  <i className="ti ti-file-text" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0">{document.name}</h6>
                  <span className="fs-12 text-muted">{document.meta}</span>
                </div>
                <span className={`badge badge-soft-${/pending/i.test(document.meta) ? 'warning' : 'success'}`}>
                  {/pending/i.test(document.meta) ? 'Pending' : 'Verified'}
                </span>
              </div>
            ))}

            <button
              type="button" className="btn btn-link p-0 fs-12 mt-2"
              onClick={() => onToast(`Duty roster printed for ${row.name}`, 'info')}
            >
              Print the duty roster
            </button>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default WardenModals;
