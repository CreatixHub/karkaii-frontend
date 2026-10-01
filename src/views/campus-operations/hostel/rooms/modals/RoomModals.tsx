import { useEffect, useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { HostelRoom, RoomStatus, RoomType } from '../data/hostelRooms.data';
import {
  availableOf,
  bedsOf,
  blockOptions,
  conditionOptions,
  facilitiesOf,
  facilityBadgesOf,
  facilityOptions,
  feeLineOf,
  floorOptions,
  hostelOptions,
  importModes,
  inspectionChecklist,
  issueOptions,
  meterTint,
  occupancyOf,
  occupancySummaryOf,
  occupantHeaderOf,
  occupantsOf,
  priorityOptions,
  roomChoices,
  roomFieldOf,
  roomNameOf,
  roomTypeOptions,
  statusOptions,
  statusPill,
  studentOptions,
  summaryOf,
} from '../data/hostelRooms.data';

export type RoomModalId =
  | 'add' | 'edit' | 'view' | 'assign' | 'occupants'
  | 'inspection' | 'maintenance' | 'facilities' | 'import' | 'delete';

export interface RoomDraft {
  room: string;
  code: string;
  hostel: string;
  block: string;
  floor: string;
  roomType: string;
  capacity: string;
  occupied: string;
  fee: string;
  furniture: string;
  bathroom: boolean;
  ac: boolean;
  wifi: boolean;
  status: RoomStatus;
}

export const emptyDraft: RoomDraft = {
  room: '', code: '', hostel: hostelOptions[0], block: blockOptions[0], floor: '1',
  roomType: roomTypeOptions[0], capacity: '3', occupied: '0', fee: '', furniture: '',
  bathroom: true, ac: false, wifi: true, status: 'Available',
};

export const draftOf = (row: HostelRoom): RoomDraft => ({
  room: row.room,
  code: row.code,
  hostel: row.hostel,
  block: row.block,
  floor: String(row.floor),
  roomType: row.roomType,
  capacity: String(row.capacity),
  occupied: String(row.occupied),
  fee: String(row.fee),
  furniture: row.furniture,
  bathroom: row.bathroom,
  ac: row.ac,
  wifi: row.wifi,
  status: row.status,
});

export interface RoomModalsProps {
  active: RoomModalId | null;
  row: HostelRoom | null;
  /** How many rows the Delete dialog is about to remove. */
  deleteCount: number;
  onClose: () => void;
  onCreate: (draft: RoomDraft) => void;
  onUpdate: (draft: RoomDraft) => void;
  onAssignStudent: (student: string, bed: string, checkIn: string) => void;
  onVacate: (bed: string) => void;
  onSaveInspection: (date: string, condition: string, checks: string[], remarks: string) => void;
  onSubmitMaintenance: (issue: string, priority: string, description: string) => void;
  onSaveFacilities: (facilities: string[], roomType: RoomType, fee: string) => void;
  onImport: (mode: string) => void;
  onDelete: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** Lets View Room hand off to Occupant Details, as the template's footer does. */
  onOpen: (modal: RoomModalId) => void;
}

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: RoomDraft;
  onField: (field: keyof RoomDraft, value: string | boolean) => void;
  /** Keeps input ids unique between the Add and Edit dialogs. */
  suffix: string;
}

const RoomForm = ({ draft, onField, suffix }: FormProps) => (
  <div className="row">
    <div className="col-md-12">
      {/* The template's own controls, in its order. */}
      <div className="mb-3">
        <label className="form-label" htmlFor={`room-no${suffix}`}>Room No</label>
        <input
          type="text" className="form-control" id={`room-no${suffix}`} placeholder="A-101"
          value={draft.room} onChange={(event) => onField('room', event.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`room-hostel${suffix}`}>Hostel Name</label>
        <select
          className="form-select" id={`room-hostel${suffix}`}
          value={draft.hostel} onChange={(event) => onField('hostel', event.target.value)}
        >
          {hostelOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div>
      <div className="row">
        <div className="col-md-6"><div className="mb-3">
          {/* The grid's four sharing types, not the template's bed labels. */}
          <label className="form-label" htmlFor={`room-type${suffix}`}>Room Type</label>
          <select
            className="form-select" id={`room-type${suffix}`}
            value={draft.roomType} onChange={(event) => onField('roomType', event.target.value)}
          >
            {roomTypeOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`room-beds${suffix}`}>No of Bed</label>
          <input
            type="number" className="form-control" id={`room-beds${suffix}`} min={1} placeholder="3"
            value={draft.capacity} onChange={(event) => onField('capacity', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`room-fee${suffix}`}>Cost per Bed</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number" className="form-control" id={`room-fee${suffix}`} min={0} placeholder="700"
              value={draft.fee} onChange={(event) => onField('fee', event.target.value)}
            />
          </div>
        </div></div>

        {/* Fields the redesigned grid prints but the template's form omits. */}
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`room-code${suffix}`}>Room Code</label>
          <input
            type="text" className="form-control" id={`room-code${suffix}`} placeholder="RM-1001"
            value={draft.code} onChange={(event) => onField('code', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`room-block${suffix}`}>Building</label>
          <select
            className="form-select" id={`room-block${suffix}`}
            value={draft.block} onChange={(event) => onField('block', event.target.value)}
          >
            {blockOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`room-floor${suffix}`}>Floor</label>
          <select
            className="form-select" id={`room-floor${suffix}`}
            value={`Floor ${draft.floor}`}
            onChange={(event) => onField('floor', event.target.value.replace('Floor ', ''))}
          >
            {floorOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`room-occupied${suffix}`}>Occupied Beds</label>
          <input
            type="number" className="form-control" id={`room-occupied${suffix}`} min={0} placeholder="0"
            value={draft.occupied} onChange={(event) => onField('occupied', event.target.value)}
          />
        </div></div>
        <div className="col-md-12"><div className="mb-3">
          <label className="form-label" htmlFor={`room-furniture${suffix}`}>Furniture</label>
          <input
            type="text" className="form-control" id={`room-furniture${suffix}`}
            placeholder="Bed, Desk, Wardrobe"
            value={draft.furniture} onChange={(event) => onField('furniture', event.target.value)}
          />
        </div></div>
        <div className="col-md-12"><div className="mb-3">
          <label className="form-label">Amenities</label>
          <div className="d-flex flex-wrap gap-3">
            <div className="form-check">
              <input
                className="form-check-input" type="checkbox" id={`room-bath${suffix}`}
                checked={draft.bathroom} onChange={(event) => onField('bathroom', event.target.checked)}
              />
              <label className="form-check-label" htmlFor={`room-bath${suffix}`}>Attached Bathroom</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input" type="checkbox" id={`room-ac${suffix}`}
                checked={draft.ac} onChange={(event) => onField('ac', event.target.checked)}
              />
              <label className="form-check-label" htmlFor={`room-ac${suffix}`}>Air Conditioning</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input" type="checkbox" id={`room-wifi${suffix}`}
                checked={draft.wifi} onChange={(event) => onField('wifi', event.target.checked)}
              />
              <label className="form-check-label" htmlFor={`room-wifi${suffix}`}>Wi-Fi</label>
            </div>
          </div>
        </div></div>
        <div className="col-md-12"><div className="mb-3">
          <label className="form-label" htmlFor={`room-status${suffix}`}>Status</label>
          <select
            className="form-select" id={`room-status${suffix}`}
            value={draft.status} onChange={(event) => onField('status', event.target.value)}
          >
            {statusOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
      </div>
    </div>
  </div>
);

/* --------------------------------- Modals ---------------------------------- */

const RoomModals = ({
  active, row, deleteCount, onClose, onCreate, onUpdate, onAssignStudent, onVacate,
  onSaveInspection, onSubmitMaintenance, onSaveFacilities, onImport, onDelete, onToast, onOpen,
}: RoomModalsProps) => {
  const [draft, setDraft] = useState<RoomDraft>(emptyDraft);
  const [roomChoice, setRoomChoice] = useState('');
  const [student, setStudent] = useState('');
  const [bed, setBed] = useState('');
  const [checkIn, setCheckIn] = useState('08/05/2024');
  const [inspectionDate, setInspectionDate] = useState('08/05/2024');
  const [condition, setCondition] = useState(conditionOptions[0]);
  const [checks, setChecks] = useState<string[]>(inspectionChecklist);
  const [remarks, setRemarks] = useState('');
  const [issue, setIssue] = useState('');
  const [priority, setPriority] = useState(priorityOptions[0]);
  const [description, setDescription] = useState('');
  const [facilities, setFacilities] = useState<string[]>([]);
  const [roomType, setRoomType] = useState<string>(roomTypeOptions[0]);
  const [fee, setFee] = useState('');
  const [mode, setMode] = useState(importModes[0]);

  /** Each opening seeds from the row being acted on, or a blank sheet for Add. */
  useEffect(() => {
    if (active === 'add') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (active === 'assign' && row) {
      setRoomChoice(roomFieldOf(row));
      setStudent('');
      // The first free bed, which is the one an assignment would take.
      setBed(`Bed ${Math.min(row.capacity, row.occupied + 1)}`);
      setCheckIn('08/05/2024');
    }
    if (active === 'inspection' && row) {
      setInspectionDate('08/05/2024');
      setCondition(row.status === 'Out of Service' ? 'Poor' : conditionOptions[0]);
      setChecks(inspectionChecklist);
      setRemarks('');
    }
    if (active === 'maintenance') {
      setIssue('');
      setPriority(priorityOptions[0]);
      setDescription('');
    }
    if (active === 'facilities' && row) {
      setFacilities(facilitiesOf(row));
      setRoomType(row.roomType);
      setFee(String(row.fee));
    }
    if (active === 'import') setMode(importModes[0]);
  }, [active, row]);

  const field = (key: keyof RoomDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const toggle = (list: string[], value: string): string[] =>
    list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

  const beds = row ? bedsOf(row) : [];
  const percent = row ? occupancyOf(row) : 0;

  return (
    <>
      {/* Add Hostel Room */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Hostel Room"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Room</button>
          </>
        }
      >
        <RoomForm draft={draft} onField={field} suffix="" />
      </Modal>

      {/* Edit Hostel Room */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Hostel Room"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        <RoomForm draft={draft} onField={field} suffix="-2" />
      </Modal>

      {/* View Room */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title="Room Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('occupants')}>
              Manage Occupants
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span
                className={`avatar avatar-lg bg-${row.tint}-transparent text-${row.tint} rounded d-inline-flex align-items-center justify-content-center me-2`}
              >
                <i className="ti ti-door fs-20" />
              </span>
              <div>
                <h5 className="mb-0">
                  {roomNameOf(row)}{' '}
                  <span className={`dt-pill ${statusPill[row.status]} ms-1`}>
                    <span className="dt-pill-dot" />{row.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">{summaryOf(row)}</span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-bed" />Occupancy</h6>
                <div className={`meter meter-${meterTint(row)} mb-1`}>
                  <span style={{ width: `${percent}%` }} />
                </div>
                <p className="fs-12 text-muted mb-0">{occupancySummaryOf(row)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-cash" />Fee</h6>
                <p className="fs-13 mb-0">{feeLineOf(row)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-checklist" />Facilities</h6>
                <div className="d-flex flex-wrap gap-1">
                  {facilityBadgesOf(row).map((badge) => (
                    <span className="badge badge-soft-primary" key={badge}>{badge}</span>
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-armchair" />Furniture</h6>
                <p className="fs-13 mb-0">{row.furniture}.</p>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Assign Student */}
      <Modal
        open={active === 'assign' && row !== null}
        onClose={onClose}
        title="Assign Student"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onAssignStudent(student, bed, checkIn); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Assign Student</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="room">Room</label>
            <select
              className="form-select" id="room"
              value={roomChoice} onChange={(event) => setRoomChoice(event.target.value)}
            >
              <option value="">Select room</option>
              {roomChoices.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="student">
              Student <span className="text-danger">*</span>
            </label>
            <select
              className="form-select" required id="student"
              value={student} onChange={(event) => setStudent(event.target.value)}
            >
              <option value="">Select student</option>
              {studentOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="bed-number">Bed Number</label>
            {/* Beds come off the room, and the taken ones cannot be picked. */}
            <select
              className="form-select" id="bed-number"
              value={bed} onChange={(event) => setBed(event.target.value)}
            >
              {beds.map((entry) => (
                <option key={entry.label} value={entry.label} disabled={entry.occupied}>
                  {entry.label}{entry.occupied ? ' — occupied' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="check-in-date">Check-in Date</label>
            <DateField id="check-in-date" format="d/m/Y" withIcon value={checkIn} onChange={setCheckIn} />
          </div>
          {row && availableOf(row) === 0 ? (
            <div className="col-md-12">
              <span className="fs-12 text-danger">
                <i className="ti ti-alert-circle me-1" />This room is full — vacate a bed first.
              </span>
            </div>
          ) : null}
        </div>
      </Modal>

      {/* Occupant Details */}
      <Modal
        open={active === 'occupants' && row !== null}
        onClose={onClose}
        title="Occupant Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('assign')}>
              <i className="ti ti-user-plus me-1" />Add Occupant
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
              <i className="ti ti-door fs-16" />
              <span className="fs-13">{occupantHeaderOf(row)}</span>
            </div>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Bed</th>
                    <th>Check-in</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {occupantsOf(row).map((occupant) => (
                    <tr key={occupant.bed}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="avatar avatar-xs">
                            <ImageWithBasePath
                              src={occupant.avatar}
                              className="rounded-circle flex-shrink-0"
                              alt={occupant.name}
                            />
                          </span>
                          {occupant.name}
                        </div>
                      </td>
                      <td>{occupant.bed}</td>
                      <td>{occupant.checkIn}</td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-link link-danger fs-12 p-0"
                          onClick={() => onVacate(occupant.bed)}
                        >
                          Vacate
                        </button>
                      </td>
                    </tr>
                  ))}
                  {row.occupied === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted fs-13">
                        No occupants — every bed is free.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Room Inspection */}
      <Modal
        open={active === 'inspection' && row !== null}
        onClose={onClose}
        title="Room Inspection"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSaveInspection(inspectionDate, condition, checks, remarks);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Save Inspection</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="room-2">Room</label>
            <input
              type="text" className="form-control" readOnly id="room-2"
              value={row ? roomFieldOf(row) : ''}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="inspection-date">Inspection Date</label>
            <DateField
              id="inspection-date" format="d/m/Y" withIcon
              value={inspectionDate} onChange={setInspectionDate}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="overall-condition">Overall Condition</label>
            <select
              className="form-select" id="overall-condition"
              value={condition} onChange={(event) => setCondition(event.target.value)}
            >
              {conditionOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-12">
            <label className="form-label">Checklist</label>
            <div className="d-flex flex-wrap gap-3">
              {inspectionChecklist.map((item, index) => (
                <div className="form-check" key={item}>
                  <input
                    className="form-check-input" type="checkbox" id={`ins${index}`}
                    checked={checks.includes(item)}
                    onChange={() => setChecks((current) => toggle(current, item))}
                  />
                  <label className="form-check-label" htmlFor={`ins${index}`}>{item}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="remarks">Remarks</label>
            <textarea
              className="form-control" rows={2} placeholder="Inspection notes" id="remarks"
              value={remarks} onChange={(event) => setRemarks(event.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Maintenance Request */}
      <Modal
        open={active === 'maintenance' && row !== null}
        onClose={onClose}
        title="Maintenance Request"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmitMaintenance(issue, priority, description);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Submit Request</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="room-3">Room</label>
            <input
              type="text" className="form-control" readOnly id="room-3"
              value={row ? roomFieldOf(row) : ''}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="issue-type">
              Issue Type <span className="text-danger">*</span>
            </label>
            <select
              className="form-select" required id="issue-type"
              value={issue} onChange={(event) => setIssue(event.target.value)}
            >
              <option value="">Select issue</option>
              {issueOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="priority">Priority</label>
            <select
              className="form-select" id="priority"
              value={priority} onChange={(event) => setPriority(event.target.value)}
            >
              {priorityOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              className="form-control" rows={2} placeholder="Describe the issue" id="description"
              value={description} onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Room Facilities */}
      <Modal
        open={active === 'facilities' && row !== null}
        onClose={onClose}
        title="Room Facilities"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSaveFacilities(facilities, roomType as RoomType, fee);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Save Changes</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label">Facilities</label>
            <div className="d-flex flex-wrap gap-3">
              {facilityOptions.map((facility, index) => (
                <div className="form-check" key={facility}>
                  <input
                    className="form-check-input" type="checkbox" id={`rf${index}`}
                    checked={facilities.includes(facility)}
                    onChange={() => setFacilities((current) => toggle(current, facility))}
                  />
                  <label className="form-check-label" htmlFor={`rf${index}`}>{facility}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="room-type-4">Room Type</label>
            <select
              className="form-select" id="room-type-4"
              value={roomType} onChange={(event) => setRoomType(event.target.value)}
            >
              {roomTypeOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="monthly-fee-2">Monthly Fee</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number" className="form-control" id="monthly-fee-2" min={0}
                value={fee} onChange={(event) => setFee(event.target.value)}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Import Rooms */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Rooms"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onImport(mode); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Import</button>
          </>
        }
      >
        <div className="stacked-dropdown mb-3">
          <i className="ti ti-cloud-upload" />
          <b>Drop your CSV or Excel file here</b>
          <span className="fs-12 text-muted">or click to browse · max 10 MB</span>
          <input type="file" aria-label="Rooms file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="import-mode">Import mode</label>
          <select
            className="form-select" id="import-mode"
            value={mode} onChange={(event) => setMode(event.target.value)}
          >
            {importModes.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
        <div className="alert alert-light border d-flex align-items-start gap-2 mb-0">
          <i className="ti ti-download fs-16" />
          <span className="fs-12">
            Not sure about the format? Download the template with all required columns and sample rows.
          </span>
        </div>
        <button
          type="button" className="btn btn-link p-0 fs-12 mt-2"
          onClick={() => onToast('Room import template downloaded', 'info')}
        >
          Download template
        </button>
      </Modal>

      {/* Delete */}
      <Modal
        open={active === 'delete'}
        onClose={onClose}
        title="Confirm Deletion"
        hideHeader
        bodyClassName="text-center"
        onSubmit={(event) => { event.preventDefault(); onDelete(); }}
      >
        <span className="delete-icon"><i className="ti ti-trash-x" /></span>
        <h4>Confirm Deletion</h4>
        <p>
          You want to delete {deleteCount === 1 ? 'this room' : `all ${deleteCount} marked items`}, this
          cant be undone once you delete.
        </p>
        <div className="d-flex justify-content-center">
          <button type="button" className="btn btn-light me-3" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-danger">Yes, Delete</button>
        </div>
      </Modal>
    </>
  );
};

export default RoomModals;
