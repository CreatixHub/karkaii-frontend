import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { Hostel, HostelStatus, Sharing } from '../data/hostels.data';
import {
  academicYearOptions,
  availableOf,
  blockOptions,
  facilityOptions,
  feeLabel,
  floorsOf,
  hostelOptions,
  importModes,
  occupancyOf,
  occupancySummaryOf,
  occupancyTint,
  roomTypeLabel,
  roomTypeOptions,
  roomsHeaderOf,
  roomsLineOf,
  roomsOf,
  sharingFromRoomType,
  shiftOptions,
  statusOptions,
  statusPill,
  summaryOf,
  typeOptions,
  wardenOptions,
} from '../data/hostels.data';

const routes = all_routes;

export type HostelModalId =
  | 'add' | 'edit' | 'view' | 'assign-warden' | 'rooms'
  | 'facilities' | 'occupancy' | 'import' | 'delete';

export interface HostelDraft {
  name: string;
  code: string;
  type: string;
  block: string;
  floors: string;
  warden: string;
  contact: string;
  rooms: string;
  /** The template's Intake field — the hostel's bed capacity. */
  capacity: string;
  occupied: string;
  roomType: string;
  fee: string;
  academicYear: string;
  status: HostelStatus;
}

export const emptyDraft: HostelDraft = {
  name: '', code: '', type: typeOptions[0], block: blockOptions[0], floors: '2', warden: '',
  contact: '', rooms: '', capacity: '', occupied: '0', roomType: roomTypeOptions[2], fee: '',
  academicYear: academicYearOptions[0], status: 'Available',
};

export const draftOf = (row: Hostel): HostelDraft => ({
  name: row.name,
  code: row.code,
  type: row.type,
  block: row.block,
  floors: String(row.floors),
  warden: row.warden,
  contact: row.contact,
  rooms: String(row.rooms),
  capacity: String(row.capacity),
  occupied: String(row.occupied),
  roomType: roomTypeLabel(row.sharing),
  fee: String(row.fee),
  academicYear: row.academicYear,
  status: row.status,
});

export interface HostelModalsProps {
  active: HostelModalId | null;
  row: Hostel | null;
  /** How many rows the Delete dialog is about to remove. */
  deleteCount: number;
  onClose: () => void;
  onCreate: (draft: HostelDraft) => void;
  onUpdate: (draft: HostelDraft) => void;
  onAssignWarden: (warden: string, contact: string, shift: string) => void;
  onSaveFacilities: (facilities: string[], sharing: Sharing, fee: string) => void;
  onImport: (mode: string) => void;
  onDelete: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
}

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: HostelDraft;
  onField: (field: keyof HostelDraft, value: string) => void;
  /** Keeps input ids unique between the Add and Edit dialogs. */
  suffix: string;
}

const HostelForm = ({ draft, onField, suffix }: FormProps) => {
  const open = draft.status !== 'Closed' && draft.status !== 'Archived';

  return (
    <div className="row">
      <div className="col-md-12">
        {/* The template's own three controls, kept in its order. */}
        <div className="mb-3">
          <label className="form-label" htmlFor={`hostel-name${suffix}`}>Hostel Name</label>
          <input
            type="text" className="form-control" id={`hostel-name${suffix}`} placeholder="Enter Hostel Name"
            value={draft.name} onChange={(event) => onField('name', event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor={`hostel-type${suffix}`}>Hostel Type</label>
          <select
            className="form-select" id={`hostel-type${suffix}`}
            value={draft.type} onChange={(event) => onField('type', event.target.value)}
          >
            {typeOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor={`hostel-intake${suffix}`}>Intake</label>
          <input
            type="number" className="form-control" id={`hostel-intake${suffix}`} min={0} placeholder="180"
            value={draft.capacity} onChange={(event) => onField('capacity', event.target.value)}
          />
        </div>

        {/* Fields the redesigned grid prints but the template's form omits. */}
        <div className="row">
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`hostel-code${suffix}`}>Hostel Code</label>
            <input
              type="text" className="form-control" id={`hostel-code${suffix}`} placeholder="HST-01"
              value={draft.code} onChange={(event) => onField('code', event.target.value)}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`hostel-block${suffix}`}>Building</label>
            <select
              className="form-select" id={`hostel-block${suffix}`}
              value={draft.block} onChange={(event) => onField('block', event.target.value)}
            >
              {blockOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`hostel-floors${suffix}`}>Floors</label>
            <input
              type="number" className="form-control" id={`hostel-floors${suffix}`} min={1} placeholder="4"
              value={draft.floors} onChange={(event) => onField('floors', event.target.value)}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`hostel-rooms${suffix}`}>Total Rooms</label>
            <input
              type="number" className="form-control" id={`hostel-rooms${suffix}`} min={0} placeholder="60"
              value={draft.rooms} onChange={(event) => onField('rooms', event.target.value)}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`hostel-occupied${suffix}`}>Occupied Beds</label>
            <input
              type="number" className="form-control" id={`hostel-occupied${suffix}`} min={0} placeholder="168"
              value={draft.occupied} onChange={(event) => onField('occupied', event.target.value)}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`hostel-roomtype${suffix}`}>Room Type</label>
            <select
              className="form-select" id={`hostel-roomtype${suffix}`}
              value={draft.roomType} onChange={(event) => onField('roomType', event.target.value)}
            >
              {roomTypeOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`hostel-warden${suffix}`}>Warden</label>
            <select
              className="form-select" id={`hostel-warden${suffix}`}
              value={draft.warden} onChange={(event) => onField('warden', event.target.value)}
            >
              <option value="">Select warden</option>
              {wardenOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`hostel-contact${suffix}`}>Contact Number</label>
            <input
              type="text" className="form-control" id={`hostel-contact${suffix}`} placeholder="+1 ..."
              value={draft.contact} onChange={(event) => onField('contact', event.target.value)}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`hostel-fee${suffix}`}>Monthly Fee</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number" className="form-control" id={`hostel-fee${suffix}`} min={0} placeholder="2100"
                value={draft.fee} onChange={(event) => onField('fee', event.target.value)}
              />
            </div>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`hostel-year${suffix}`}>Academic Year</label>
            <select
              className="form-select" id={`hostel-year${suffix}`}
              value={draft.academicYear} onChange={(event) => onField('academicYear', event.target.value)}
            >
              {academicYearOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-12"><div className="mb-3">
            <label className="form-label" htmlFor={`hostel-status${suffix}`}>Status</label>
            <select
              className="form-select" id={`hostel-status${suffix}`}
              value={draft.status} onChange={(event) => onField('status', event.target.value)}
            >
              {statusOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
        </div>

        <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
          <div className="status-title">
            <h5>Status</h5>
            <p>Change the Status by toggle </p>
          </div>
          <div className="status-toggle modal-status">
            <input
              type="checkbox" id={`hostel-open${suffix}`} className="check"
              checked={open}
              onChange={(event) => onField('status', event.target.checked ? 'Available' : 'Closed')}
            />
            <label htmlFor={`hostel-open${suffix}`} className="checktoggle"> </label>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------- Modals ---------------------------------- */

const HostelModals = ({
  active, row, deleteCount, onClose, onCreate, onUpdate, onAssignWarden, onSaveFacilities,
  onImport, onDelete, onToast,
}: HostelModalsProps) => {
  const [draft, setDraft] = useState<HostelDraft>(emptyDraft);
  const [hostel, setHostel] = useState('');
  const [warden, setWarden] = useState('');
  const [contact, setContact] = useState('');
  const [shift, setShift] = useState(shiftOptions[0]);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [roomType, setRoomType] = useState(roomTypeOptions[2]);
  const [fee, setFee] = useState('');
  const [mode, setMode] = useState(importModes[0]);

  /** Each opening seeds from the row being acted on, or a blank sheet for Add. */
  useEffect(() => {
    if (active === 'add') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (active === 'assign-warden' && row) {
      setHostel(row.name);
      setWarden(row.warden);
      setContact(row.contact);
      setShift(shiftOptions[0]);
    }
    if (active === 'facilities' && row) {
      setFacilities(row.facilities);
      setRoomType(roomTypeLabel(row.sharing));
      setFee(String(row.fee));
    }
    if (active === 'import') setMode(importModes[0]);
  }, [active, row]);

  const field = (key: keyof HostelDraft, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const toggleFacility = (facility: string) =>
    setFacilities((current) =>
      current.includes(facility) ? current.filter((item) => item !== facility) : [...current, facility],
    );

  /** The template's seven, plus whatever this hostel already has. */
  const facilityChoices = useMemo(
    () => Array.from(new Set([...facilityOptions, ...(row?.facilities ?? [])])),
    [row],
  );

  const percent = row ? occupancyOf(row) : 0;

  return (
    <>
      {/* Add Hostel */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Hostel"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Hostel</button>
          </>
        }
      >
        <HostelForm draft={draft} onField={field} suffix="" />
      </Modal>

      {/* Edit Hostel */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Hostel"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        <HostelForm draft={draft} onField={field} suffix="-2" />
      </Modal>

      {/* View Hostel */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title="Hostel Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <Link to={routes.hostelRoom} className="btn btn-primary">Manage Rooms</Link>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span
                className={`avatar avatar-lg bg-${row.tint}-transparent text-${row.tint} rounded d-inline-flex align-items-center justify-content-center me-2`}
              >
                <i className="ti ti-building-community fs-20" />
              </span>
              <div>
                <h5 className="mb-0">
                  {row.name}{' '}
                  <span className={`dt-pill ${statusPill[row.status]} ms-1`}>
                    <span className="dt-pill-dot" />{row.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">{summaryOf(row)}</span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-user-star" />Warden</h6>
                <div className="d-flex align-items-center gap-2">
                  <span className="avatar avatar-sm">
                    <ImageWithBasePath
                      src={row.wardenAvatar}
                      className="rounded-circle flex-shrink-0"
                      alt={row.warden}
                    />
                  </span>
                  <div>
                    <span className="fw-medium d-block">{row.warden}</span>
                    <span className="fs-12 text-muted">{row.contact}</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-bed" />Occupancy</h6>
                <div className={`meter meter-${occupancyTint(percent)} mb-1`}>
                  <span style={{ width: `${percent}%` }} />
                </div>
                <p className="fs-12 text-muted mb-0">{occupancySummaryOf(row)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-door" />Rooms</h6>
                <p className="fs-13 mb-0">{roomsLineOf(row)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-checklist" />Facilities</h6>
                <div className="d-flex flex-wrap gap-1">
                  {row.facilities.map((facility) => (
                    <span className="badge badge-soft-primary" key={facility}>{facility}</span>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Assign Warden */}
      <Modal
        open={active === 'assign-warden' && row !== null}
        onClose={onClose}
        title="Assign Warden"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onAssignWarden(warden, contact, shift); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Assign Warden</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="hostel-2">Hostel</label>
            <select
              className="form-select" id="hostel-2"
              value={hostel} onChange={(event) => setHostel(event.target.value)}
            >
              <option value="">Select hostel</option>
              {hostelOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="warden-2">
              Warden <span className="text-danger">*</span>
            </label>
            <select
              className="form-select" required id="warden-2"
              value={warden} onChange={(event) => setWarden(event.target.value)}
            >
              <option value="">Select warden</option>
              {wardenOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="contact-number">Contact Number</label>
            <input
              type="text" className="form-control" placeholder="+1 ..." id="contact-number"
              value={contact} onChange={(event) => setContact(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="shift">Shift</label>
            <select
              className="form-select" id="shift"
              value={shift} onChange={(event) => setShift(event.target.value)}
            >
              {shiftOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* Manage Rooms */}
      <Modal
        open={active === 'rooms' && row !== null}
        onClose={onClose}
        title="Manage Rooms"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <Link to={routes.hostelRoom} className="btn btn-primary">
              <i className="ti ti-plus me-1" />Add Room
            </Link>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
              <i className="ti ti-building-community fs-16" />
              <span className="fs-13">{roomsHeaderOf(row)}</span>
            </div>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Floor</th>
                    <th>Type</th>
                    <th>Beds</th>
                    <th className="text-end">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {roomsOf(row).map((entry) => (
                    <tr key={entry.room}>
                      <td>{entry.room}</td>
                      <td>{entry.floor}</td>
                      <td>{entry.type}</td>
                      <td>{entry.beds}</td>
                      <td className="text-end">
                        <span className={`badge badge-soft-${entry.tint}`}>{entry.status}</span>
                      </td>
                    </tr>
                  ))}
                  {row.rooms === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-muted fs-13">No rooms configured.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
            {row.rooms > 8 ? (
              <p className="fs-12 text-muted mt-2 mb-0">
                Showing the first 8 of {row.rooms} rooms.
              </p>
            ) : null}
          </>
        ) : null}
      </Modal>

      {/* Hostel Facilities & Fee */}
      <Modal
        open={active === 'facilities' && row !== null}
        onClose={onClose}
        title="Hostel Facilities & Fee"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSaveFacilities(facilities, sharingFromRoomType(roomType), fee);
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
              {facilityChoices.map((facility, index) => (
                <div className="form-check" key={facility}>
                  <input
                    className="form-check-input" type="checkbox" id={`fac${index}`}
                    checked={facilities.includes(facility)} onChange={() => toggleFacility(facility)}
                  />
                  <label className="form-check-label" htmlFor={`fac${index}`}>{facility}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="room-type">Room Type</label>
            <select
              className="form-select" id="room-type"
              value={roomType} onChange={(event) => setRoomType(event.target.value)}
            >
              {roomTypeOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="monthly-fee">Monthly Fee</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number" className="form-control" id="monthly-fee" min={0}
                value={fee} onChange={(event) => setFee(event.target.value)}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Occupancy Details */}
      <Modal
        open={active === 'occupancy' && row !== null}
        onClose={onClose}
        title="Occupancy Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>
              <i className="ti ti-printer me-1" />Print Occupancy
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="row g-3 mb-3">
              <div className="col-4">
                <div className="border rounded p-3 text-center">
                  <h4 className="mb-0">{row.capacity}</h4>
                  <span className="fs-12 text-muted">Capacity</span>
                </div>
              </div>
              <div className="col-4">
                <div className="border rounded p-3 text-center">
                  <h4 className="mb-0 text-warning">{row.occupied}</h4>
                  <span className="fs-12 text-muted">Occupied</span>
                </div>
              </div>
              <div className="col-4">
                <div className="border rounded p-3 text-center">
                  <h4 className="mb-0 text-success">{availableOf(row)}</h4>
                  <span className="fs-12 text-muted">Available</span>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Floor</th>
                    <th>Rooms</th>
                    <th>Occupied</th>
                    <th className="text-end">Available</th>
                  </tr>
                </thead>
                <tbody>
                  {floorsOf(row).map((entry) => (
                    <tr key={entry.floor}>
                      <td>Floor {entry.floor}</td>
                      <td>{entry.rooms}</td>
                      <td>{entry.occupied}</td>
                      <td className="text-end">{entry.available}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="fs-12 text-muted mt-2 mb-0">
              {row.name} · {feeLabel(row)}/mo · {roomTypeLabel(row.sharing)}
            </p>
          </>
        ) : null}
      </Modal>

      {/* Import Hostels */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Hostels"
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
          <input type="file" aria-label="Hostels file" />
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
          onClick={() => onToast('Hostel import template downloaded', 'info')}
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
          You want to delete {deleteCount === 1 ? 'this hostel' : `all ${deleteCount} marked items`}, this
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

export default HostelModals;
