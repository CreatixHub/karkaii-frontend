import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { GenderAllocation, RoomTypeRow, RoomTypeStatus } from '../data/roomTypes.data';
import {
  academicYearOptions,
  availabilityHeaderOf,
  availabilityOf,
  bedLabel,
  billingCycleOptions,
  categoryOptions,
  facilitiesOf,
  facilityOptions,
  genderOptions,
  hostelOptions,
  importModes,
  meterTint,
  occupancyOf,
  occupancySummaryOf,
  pricingLineOf,
  statusOptions,
  statusPill,
  summaryOf,
  typeFieldOf,
} from '../data/roomTypes.data';

export type RoomTypeModalId =
  | 'add' | 'edit' | 'view' | 'assign-hostels' | 'facilities'
  | 'fees' | 'availability' | 'import' | 'delete';

export interface RoomTypeDraft {
  name: string;
  code: string;
  category: string;
  capacity: string;
  gender: string;
  fee: string;
  deposit: string;
  hostels: string;
  occupied: string;
  available: string;
  academicYear: string;
  status: RoomTypeStatus;
}

export const emptyDraft: RoomTypeDraft = {
  name: '', code: '', category: categoryOptions[1], capacity: '2', gender: genderOptions[0],
  fee: '', deposit: '', hostels: '1', occupied: '0', available: '0',
  academicYear: academicYearOptions[0], status: 'Available',
};

export const draftOf = (row: RoomTypeRow): RoomTypeDraft => ({
  name: row.name,
  code: row.code,
  category: row.category,
  capacity: String(row.capacity),
  gender: row.gender,
  fee: String(row.fee),
  deposit: String(row.deposit),
  hostels: String(row.hostels),
  occupied: String(row.occupied),
  available: String(row.available),
  academicYear: row.academicYear,
  status: row.status,
});

export interface RoomTypeModalsProps {
  active: RoomTypeModalId | null;
  row: RoomTypeRow | null;
  /** How many rows the Delete dialog is about to remove. */
  deleteCount: number;
  onClose: () => void;
  onCreate: (draft: RoomTypeDraft) => void;
  onUpdate: (draft: RoomTypeDraft) => void;
  onAssignHostels: (hostels: string[]) => void;
  onSaveFacilities: (facilities: string[], gender: GenderAllocation) => void;
  onSaveFees: (fee: string, deposit: string, lateFee: string, cycle: string) => void;
  onImport: (mode: string) => void;
  onDelete: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** Lets View hand off to Assign Hostels, as the template's footer does. */
  onOpen: (modal: RoomTypeModalId) => void;
}

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: RoomTypeDraft;
  onField: (field: keyof RoomTypeDraft, value: string) => void;
  /** Keeps input ids unique between the Add and Edit dialogs. */
  suffix: string;
}

const RoomTypeForm = ({ draft, onField, suffix }: FormProps) => (
  <div className="row">
    <div className="col-md-12">
      {/* The template's own two controls, the cost corrected to a number. */}
      <div className="mb-3">
        <label className="form-label" htmlFor={`rt-name${suffix}`}>Room Type</label>
        <input
          type="text" className="form-control" id={`rt-name${suffix}`} placeholder="Enter Room Type"
          value={draft.name} onChange={(event) => onField('name', event.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`rt-fee${suffix}`}>Cost per Bed</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          <input
            type="number" className="form-control" id={`rt-fee${suffix}`} min={0} placeholder="1800"
            value={draft.fee} onChange={(event) => onField('fee', event.target.value)}
          />
        </div>
      </div>

      {/* Fields the redesigned grid prints but the template's form omits. */}
      <div className="row">
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`rt-code${suffix}`}>Type Code</label>
          <input
            type="text" className="form-control" id={`rt-code${suffix}`} placeholder="RT-01"
            value={draft.code} onChange={(event) => onField('code', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`rt-category${suffix}`}>Category</label>
          <select
            className="form-select" id={`rt-category${suffix}`}
            value={draft.category} onChange={(event) => onField('category', event.target.value)}
          >
            {categoryOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`rt-capacity${suffix}`}>Beds per Room</label>
          <input
            type="number" className="form-control" id={`rt-capacity${suffix}`} min={1} placeholder="1"
            value={draft.capacity} onChange={(event) => onField('capacity', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`rt-gender${suffix}`}>Gender Allocation</label>
          <select
            className="form-select" id={`rt-gender${suffix}`}
            value={draft.gender} onChange={(event) => onField('gender', event.target.value)}
          >
            {genderOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`rt-deposit${suffix}`}>Security Deposit</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number" className="form-control" id={`rt-deposit${suffix}`} min={0} placeholder="3600"
              value={draft.deposit} onChange={(event) => onField('deposit', event.target.value)}
            />
          </div>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`rt-hostels${suffix}`}>Applicable Hostels</label>
          <input
            type="number" className="form-control" id={`rt-hostels${suffix}`} min={0} placeholder="5"
            value={draft.hostels} onChange={(event) => onField('hostels', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`rt-occupied${suffix}`}>Occupied Rooms</label>
          <input
            type="number" className="form-control" id={`rt-occupied${suffix}`} min={0} placeholder="38"
            value={draft.occupied} onChange={(event) => onField('occupied', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`rt-available${suffix}`}>Available Rooms</label>
          <input
            type="number" className="form-control" id={`rt-available${suffix}`} min={0} placeholder="12"
            value={draft.available} onChange={(event) => onField('available', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`rt-year${suffix}`}>Academic Year</label>
          <select
            className="form-select" id={`rt-year${suffix}`}
            value={draft.academicYear} onChange={(event) => onField('academicYear', event.target.value)}
          >
            {academicYearOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`rt-status${suffix}`}>Status</label>
          <select
            className="form-select" id={`rt-status${suffix}`}
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

const RoomTypeModals = ({
  active, row, deleteCount, onClose, onCreate, onUpdate, onAssignHostels, onSaveFacilities,
  onSaveFees, onImport, onDelete, onToast, onOpen,
}: RoomTypeModalsProps) => {
  const [draft, setDraft] = useState<RoomTypeDraft>(emptyDraft);
  const [hostels, setHostels] = useState<string[]>([]);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [gender, setGender] = useState<GenderAllocation>('Any');
  const [fee, setFee] = useState('');
  const [deposit, setDeposit] = useState('');
  const [lateFee, setLateFee] = useState('10');
  const [cycle, setCycle] = useState(billingCycleOptions[0]);
  const [mode, setMode] = useState(importModes[0]);

  /** Each opening seeds from the row being acted on, or a blank sheet for Add. */
  useEffect(() => {
    if (active === 'add') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (active === 'assign-hostels' && row) {
      // The type already covers this many hostels, so those come pre-selected.
      setHostels(hostelOptions.slice(0, Math.min(row.hostels, hostelOptions.length)));
    }
    if (active === 'facilities' && row) {
      setFacilities(facilitiesOf(row));
      setGender(row.gender);
    }
    if (active === 'fees' && row) {
      setFee(String(row.fee));
      setDeposit(String(row.deposit));
      setLateFee('10');
      setCycle(billingCycleOptions[0]);
    }
    if (active === 'import') setMode(importModes[0]);
  }, [active, row]);

  const field = (key: keyof RoomTypeDraft, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const toggleFacility = (facility: string) =>
    setFacilities((current) =>
      current.includes(facility) ? current.filter((item) => item !== facility) : [...current, facility],
    );

  const percent = row ? occupancyOf(row) : 0;

  return (
    <>
      {/* Add Room Type */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Room Type"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Room Type</button>
          </>
        }
      >
        <RoomTypeForm draft={draft} onField={field} suffix="" />
      </Modal>

      {/* Edit Room Type */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Room Type"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        <RoomTypeForm draft={draft} onField={field} suffix="-2" />
      </Modal>

      {/* View Room Type */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title="Room Type Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('assign-hostels')}>
              Assign Hostels
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
                <i className="ti ti-bed fs-20" />
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
                <h6 className="details-heading"><i className="ti ti-cash" />Pricing</h6>
                <p className="fs-13 mb-0">{pricingLineOf(row)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-bed" />Occupancy</h6>
                <div className={`meter meter-${meterTint(row)} mb-1`}>
                  <span style={{ width: `${percent}%` }} />
                </div>
                <p className="fs-12 text-muted mb-0">{occupancySummaryOf(row)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-checklist" />Facilities</h6>
                <div className="d-flex flex-wrap gap-1">
                  {row.amenities.map((amenity) => (
                    <span className="badge badge-soft-primary" key={amenity}>{amenity}</span>
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-user" />Created By</h6>
                <div className="d-flex align-items-center gap-2">
                  <span className="avatar avatar-sm">
                    <ImageWithBasePath
                      src={row.createdByAvatar}
                      className="rounded-circle flex-shrink-0"
                      alt={row.createdBy}
                    />
                  </span>
                  <div>
                    <span className="fw-medium d-block">{row.createdBy}</span>
                    <span className="fs-12 text-muted">Updated {row.updated}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Assign Hostels */}
      <Modal
        open={active === 'assign-hostels' && row !== null}
        onClose={onClose}
        title="Assign Hostels"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onAssignHostels(hostels); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Assign Hostels</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="room-type-4">Room Type</label>
            <input
              type="text" className="form-control" readOnly id="room-type-4"
              value={row ? typeFieldOf(row) : ''}
            />
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="applicable-hostels">
              Applicable Hostels <span className="text-danger">*</span>
            </label>
            <select
              className="form-select" multiple required id="applicable-hostels" size={5}
              value={hostels}
              onChange={(event) =>
                setHostels(Array.from(event.target.selectedOptions, (option) => option.value))
              }
            >
              {hostelOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-12">
            <span className="fs-12 text-muted">
              <i className="ti ti-info-circle me-1" />Hold Ctrl / Cmd to select multiple hostels.
            </span>
          </div>
        </div>
      </Modal>

      {/* Configure Facilities */}
      <Modal
        open={active === 'facilities' && row !== null}
        onClose={onClose}
        title="Configure Facilities"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onSaveFacilities(facilities, gender); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Save Facilities</button>
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
                    className="form-check-input" type="checkbox" id={`cf${index}`}
                    checked={facilities.includes(facility)} onChange={() => toggleFacility(facility)}
                  />
                  <label className="form-check-label" htmlFor={`cf${index}`}>{facility}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="gender-allocation">Gender Allocation</label>
            <select
              className="form-select" id="gender-allocation"
              value={gender} onChange={(event) => setGender(event.target.value as GenderAllocation)}
            >
              {genderOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* Fee Configuration */}
      <Modal
        open={active === 'fees' && row !== null}
        onClose={onClose}
        title="Fee Configuration"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onSaveFees(fee, deposit, lateFee, cycle); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Save Fees</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="room-type-5">Room Type</label>
            <input
              type="text" className="form-control" readOnly id="room-type-5"
              value={row ? typeFieldOf(row) : ''}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="monthly-fee">
              Monthly Fee <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number" className="form-control" id="monthly-fee" min={0} required
                value={fee} onChange={(event) => setFee(event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="security-deposit">Security Deposit</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number" className="form-control" id="security-deposit" min={0}
                value={deposit} onChange={(event) => setDeposit(event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="late-fee-day">Late Fee / Day</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number" className="form-control" id="late-fee-day" min={0}
                value={lateFee} onChange={(event) => setLateFee(event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="billing-cycle">Billing Cycle</label>
            <select
              className="form-select" id="billing-cycle"
              value={cycle} onChange={(event) => setCycle(event.target.value)}
            >
              {billingCycleOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* Room Availability */}
      <Modal
        open={active === 'availability' && row !== null}
        onClose={onClose}
        title="Room Availability"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>
              <i className="ti ti-printer me-1" />Print Availability
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
              <i className="ti ti-bed fs-16" />
              <span className="fs-13">{availabilityHeaderOf(row)}</span>
            </div>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Hostel</th>
                    <th>Total</th>
                    <th>Occupied</th>
                    <th className="text-end">Available</th>
                  </tr>
                </thead>
                <tbody>
                  {availabilityOf(row).map((entry) => (
                    <tr key={entry.hostel}>
                      <td>{entry.hostel}</td>
                      <td>{entry.total}</td>
                      <td>{entry.occupied}</td>
                      <td className="text-end">{entry.available}</td>
                    </tr>
                  ))}
                  {availabilityOf(row).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted fs-13">
                        This room type is not configured in any hostel.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
            <p className="fs-12 text-muted mt-2 mb-0">{bedLabel(row)} · {row.category}</p>
          </>
        ) : null}
      </Modal>

      {/* Import Room Types */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Room Types"
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
          <input type="file" aria-label="Room types file" />
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
          onClick={() => onToast('Room type import template downloaded', 'info')}
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
          You want to delete {deleteCount === 1 ? 'this room type' : `all ${deleteCount} marked items`}, this
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

export default RoomTypeModals;
