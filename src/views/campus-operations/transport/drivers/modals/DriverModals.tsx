import { useEffect, useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { Driver, DriverStatus, LicenseType, Verification } from '../data/drivers.data';
import { ActionLink } from '@components/workspace';
import {
  licenseTypeOptions,
  routeOptions,
  shiftOptions,
  statusOptions,
  statusPill,
  statusIcon,
  subtitleOf,
  vehicleOptions,
  verificationOptions,
} from '../data/drivers.data';

export type DriverModalId =
  | 'add' | 'edit' | 'view' | 'assign-vehicle' | 'assign-route'
  | 'documents' | 'license' | 'import' | 'delete';

export interface DriverDraft {
  name: string;
  code: string;
  phone: string;
  email: string;
  licenseNo: string;
  licenseType: LicenseType;
  issued: string;
  expires: string;
  verification: Verification;
  /** The template's Address field; the redesigned grid has no column for it. */
  address: string;
  vehicle: string;
  route: string;
  experience: string;
  joined: string;
  emergency: string;
  status: DriverStatus;
}

export const emptyDraft: DriverDraft = {
  name: '', code: '', phone: '', email: '', licenseNo: '',
  licenseType: licenseTypeOptions[0], issued: '', expires: '', verification: 'Pending',
  address: '', vehicle: '', route: '', experience: '', joined: '', emergency: '',
  status: 'Active',
};

export const draftOf = (row: Driver): DriverDraft => ({
  name: row.name,
  code: row.code,
  phone: row.phone,
  email: row.email,
  licenseNo: row.licenseNo,
  licenseType: row.licenseType,
  issued: row.issued,
  expires: row.expires,
  verification: row.verification,
  address: '',
  vehicle: row.vehicle,
  route: row.route,
  experience: String(row.experience),
  joined: row.joined,
  emergency: row.emergency,
  status: row.status,
});

export const importModes = [
  'Create new drivers',
  'Update existing by employee ID',
  'Create and update',
];

/** What Assign Vehicle and Assign Route hand back to the page. */
export interface AssignVehicleDraft {
  vehicle: string;
  shift: string;
  effective: string;
}

export interface AssignRouteDraft {
  route: string;
  vehicle: string;
  shift: string;
}

/** What License Verification hands back to the page. */
export interface LicenseDraft {
  licenseNo: string;
  licenseType: LicenseType;
  issued: string;
  expires: string;
  verification: Verification;
}

/* ------------------------------ Date helpers -------------------------------- */

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "14 Mar 2019" → "14/03/2019", the form's own `datetimepicker-dmy` format. */
export const toSlashDate = (value: string): string => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return value;
  return `${day}/${String(index + 1).padStart(2, '0')}/${year}`;
};

/** "14/03/2019" → "14 Mar 2019", back into the shape the grid prints. */
export const fromSlashDate = (value: string, fallback: string): string => {
  const parts = value.split('/');
  if (parts.length !== 3) return fallback;
  const month = months[Number(parts[1]) - 1];
  if (!month) return fallback;
  return `${parts[0]} ${month} ${parts[2]}`;
};

/* ------------------------------- Documents ---------------------------------- */

export interface DriverDocument {
  label: string;
  icon: string;
  reference: string;
  expiry: string;
  status: 'Verified' | 'Pending';
}

/**
 * The template's four document rows, with the licence row read off the driver
 * instead of hard-coded to DRV-1001.
 */
export const documentsOf = (row: Driver): DriverDocument[] => [
  {
    label: 'Driving License', icon: 'ti ti-id me-1 text-primary',
    reference: row.licenseNo, expiry: row.expires,
    status: row.verification === 'Verified' ? 'Verified' : 'Pending',
  },
  {
    label: 'Police Verification', icon: 'ti ti-file-certificate me-1 text-info',
    reference: `PV-2024-${row.code.replace(/\D/g, '').slice(-4)}`, expiry: '—', status: 'Verified',
  },
  {
    label: 'Medical Fitness', icon: 'ti ti-heartbeat me-1 text-danger',
    reference: `MF-${row.licenseNo.replace(/\D/g, '').slice(-5)}`, expiry: '15 Jun 2027', status: 'Verified',
  },
  {
    label: 'Training Certificate', icon: 'ti ti-certificate me-1 text-warning',
    reference: 'TR-DEF-2023', expiry: '—', status: 'Pending',
  },
];

const documentBadge: Record<DriverDocument['status'], string> = {
  Verified: 'badge badge-soft-success',
  Pending: 'badge badge-soft-warning',
};

/* ---------------------------------- Props ----------------------------------- */

export interface DriverModalsProps {
  active: DriverModalId | null;
  row: Driver | null;
  /** How many rows the Delete dialog is about to remove. */
  deleteCount: number;
  onClose: () => void;
  onCreate: (draft: DriverDraft) => void;
  onUpdate: (draft: DriverDraft) => void;
  onAssignVehicle: (draft: AssignVehicleDraft) => void;
  onAssignRoute: (draft: AssignRouteDraft) => void;
  onVerify: (draft: LicenseDraft) => void;
  onDelete: () => void;
  onImport: (mode: string) => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** Lets the preview footer hand off to Documents and Edit, as the template does. */
  onOpen: (modal: DriverModalId) => void;
}

/* ---------------------------------- Form ------------------------------------ */

interface FormProps {
  draft: DriverDraft;
  onField: (field: keyof DriverDraft, value: string) => void;
  /** Keeps input ids unique between the Add and Edit dialogs. */
  suffix: string;
  /** The template ships one toggle id per dialog. */
  toggleId: string;
}

const DriverForm = ({ draft, onField, suffix, toggleId }: FormProps) => (
  <div className="row">
    <div className="col-md-12">
      <div className="mb-3">
        <label className="form-label" htmlFor={`name${suffix}`}>Name</label>
        <input
          type="text" className="form-control" id={`name${suffix}`} placeholder="Enter Name"
          value={draft.name} onChange={(event) => onField('name', event.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`phone-number${suffix}`}>Phone Number</label>
        <input
          type="text" className="form-control" id={`phone-number${suffix}`} placeholder="Enter Phone Number"
          value={draft.phone} onChange={(event) => onField('phone', event.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`driving-license-number${suffix}`}>Driving License Number</label>
        <input
          type="text" className="form-control" id={`driving-license-number${suffix}`}
          placeholder="Enter Driving License Number"
          value={draft.licenseNo} onChange={(event) => onField('licenseNo', event.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`address${suffix}`}>Address</label>
        <input
          type="text" className="form-control" id={`address${suffix}`} placeholder="Enter Address"
          value={draft.address} onChange={(event) => onField('address', event.target.value)}
        />
      </div>

      {/* Roster fields the redesigned grid prints but the template's form omits. */}
      <div className="row">
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`employee-id${suffix}`}>Employee ID</label>
          <input
            type="text" className="form-control" id={`employee-id${suffix}`} placeholder="DRV-1011"
            value={draft.code} onChange={(event) => onField('code', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`email${suffix}`}>Email</label>
          <input
            type="text" className="form-control" id={`email${suffix}`} placeholder="name@example.com"
            value={draft.email} onChange={(event) => onField('email', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`license-type${suffix}`}>License Type</label>
          <select
            className="form-select" id={`license-type${suffix}`}
            value={draft.licenseType} onChange={(event) => onField('licenseType', event.target.value)}
          >
            {licenseTypeOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`verification${suffix}`}>Verification</label>
          <select
            className="form-select" id={`verification${suffix}`}
            value={draft.verification} onChange={(event) => onField('verification', event.target.value)}
          >
            {verificationOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`issue-on${suffix}`}>License Issued</label>
          <div className="input-icon-end position-relative">
            <DateField
              value={draft.issued}
              onChange={(next: string) => onField('issued', next)}
              format="d/m/Y"
              id={`issue-on${suffix}`}
              placeholder="14 Mar 2019"
            />
            <span className="input-icon-addon"><i className="ti ti-calendar" /></span>
          </div>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`expires-on${suffix}`}>License Expiry</label>
          <div className="input-icon-end position-relative">
            <DateField
              value={draft.expires}
              onChange={(next: string) => onField('expires', next)}
              format="d/m/Y"
              id={`expires-on${suffix}`}
              placeholder="20 Aug 2026"
            />
            <span className="input-icon-addon"><i className="ti ti-calendar" /></span>
          </div>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`vehicle${suffix}`}>Vehicle</label>
          <select
            className="form-select" id={`vehicle${suffix}`}
            value={draft.vehicle} onChange={(event) => onField('vehicle', event.target.value)}
          >
            <option value="">No vehicle</option>
            {vehicleOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`route${suffix}`}>Route</label>
          <select
            className="form-select" id={`route${suffix}`}
            value={draft.route} onChange={(event) => onField('route', event.target.value)}
          >
            <option value="">No route</option>
            {routeOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`experience${suffix}`}>Experience (yrs)</label>
          <input
            type="text" className="form-control" id={`experience${suffix}`} placeholder="9"
            value={draft.experience} onChange={(event) => onField('experience', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`joined${suffix}`}>Joined</label>
          <div className="input-icon-end position-relative">
            <DateField
              value={draft.joined}
              onChange={(next: string) => onField('joined', next)}
              format="d/m/Y"
              id={`joined${suffix}`}
              placeholder="12 Jun 2019"
            />
            <span className="input-icon-addon"><i className="ti ti-calendar" /></span>
          </div>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`emergency${suffix}`}>Emergency Contact</label>
          <input
            type="text" className="form-control" id={`emergency${suffix}`} placeholder="+1 546 8548 610"
            value={draft.emergency} onChange={(event) => onField('emergency', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`driver-status${suffix}`}>Driver Status</label>
          <select
            className="form-select" id={`driver-status${suffix}`}
            value={draft.status} onChange={(event) => onField('status', event.target.value)}
          >
            {statusOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
      </div>
    </div>

    {/* The template's own toggle, wired to the same status as the select above. */}
    <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
      <div className="status-title">
        <h5>Status</h5>
        <p>Change the Status by toggle </p>
      </div>
      <div className="status-toggle modal-status">
        <input
          type="checkbox" id={toggleId} className="check"
          checked={draft.status !== 'Inactive'}
          onChange={(event) => onField('status', event.target.checked ? 'Active' : 'Inactive')}
        />
        <label htmlFor={toggleId} className="checktoggle"> </label>
      </div>
    </div>
  </div>
);

/* --------------------------------- Modals ----------------------------------- */

const DriverModals = ({
  active, row, deleteCount, onClose, onCreate, onUpdate, onAssignVehicle,
  onAssignRoute, onVerify, onDelete, onImport, onToast, onOpen,
}: DriverModalsProps) => {
  const [draft, setDraft] = useState<DriverDraft>(emptyDraft);
  const [vehicle, setVehicle] = useState('');
  const [route, setRoute] = useState('');
  const [shift, setShift] = useState(shiftOptions[0]);
  const [effective, setEffective] = useState('24/07/2026');
  const [license, setLicense] = useState<LicenseDraft>({
    licenseNo: '', licenseType: 'Heavy (HMV)', issued: '', expires: '', verification: 'Verified',
  });
  const [mode, setMode] = useState(importModes[0]);

  /** Each opening starts from the row being worked on, or a blank sheet for Add. */
  useEffect(() => {
    if (active === 'add') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));
    if (active === 'assign-vehicle') {
      setVehicle(row?.vehicle ?? '');
      setShift(shiftOptions[0]);
      setEffective('24/07/2026');
    }
    if (active === 'assign-route') {
      setRoute(row?.route ?? '');
      setVehicle(row?.vehicle ?? '');
      setShift(shiftOptions[0]);
    }
    if (active === 'license' && row) {
      setLicense({
        licenseNo: row.licenseNo,
        licenseType: row.licenseType,
        issued: toSlashDate(row.issued),
        expires: toSlashDate(row.expires),
        verification: row.verification,
      });
    }
    if (active === 'import') setMode(importModes[0]);
  }, [active, row]);

  const field = (key: keyof DriverDraft, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const licenseField = (key: keyof LicenseDraft, value: string) =>
    setLicense((current) => ({ ...current, [key]: value }));

  const driverLabel = row ? `${row.name} — ${row.code}` : '';

  return (
    <>
      {/* Add Driver */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add New Driver"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Driver</button>
          </>
        }
      >
        <DriverForm draft={draft} onField={field} suffix="" toggleId="user1" />
      </Modal>

      {/* Edit Driver */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Driver"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        <DriverForm draft={draft} onField={field} suffix="-2" toggleId="user2" />
      </Modal>

      {/* Driver Profile Preview */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title="Driver Profile"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button
              type="button" className="btn btn-outline-primary me-2"
              onClick={() => onOpen('documents')}
            >
              Documents
            </button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('edit')}>
              Edit Profile
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-lg me-2 flex-shrink-0">
                <ImageWithBasePath src={row.avatar} className="rounded-circle flex-shrink-0" alt={row.name} />
              </span>
              <div>
                <h5 className="mb-0">
                  {row.name}{' '}
                  <span className={`dt-pill ${statusPill[row.status]} ms-1`}>
                    {statusIcon[row.status]
                      ? <i className={statusIcon[row.status] as string} />
                      : <span className="dt-pill-dot" />}
                    {row.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">{subtitleOf(row)}</span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-phone" />Contact</h6>
                <p className="fs-13 mb-0">{row.phone} · {row.email}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-id" />License</h6>
                <p className="fs-13 mb-0">
                  {row.licenseNo} · Expires {row.expires} · {row.verification}.
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-bus" />Assigned Vehicle</h6>
                <p className="fs-13 mb-0">
                  {row.vehicle ? `${row.vehicle} · ${row.route || 'no route'}.` : 'No vehicle currently assigned.'}
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-urgent" />Emergency</h6>
                <p className="fs-13 mb-0">{row.emergency}.</p>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Assign Vehicle */}
      <Modal
        open={active === 'assign-vehicle' && row !== null}
        onClose={onClose}
        title="Assign Vehicle"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onAssignVehicle({ vehicle, shift, effective }); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Assign Vehicle</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="driver-2">Driver</label>
            <input type="text" className="form-control" id="driver-2" value={driverLabel} readOnly />
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="vehicle-2">
              Vehicle <span className="text-danger">*</span>
            </label>
            <select
              className="form-select" id="vehicle-2" required
              value={vehicle} onChange={(event) => setVehicle(event.target.value)}
            >
              <option value="">Select vehicle</option>
              {vehicleOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
            <div className="invalid-feedback">Select a vehicle.</div>
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
          <div className="col-md-6">
            <label className="form-label" htmlFor="effective-date">Effective Date</label>
            <div className="input-icon-end position-relative">
              <DateField
                value={effective}
                onChange={(next: string) => setEffective(next)}
                format="d/m/Y"
                id="effective-date"
              />
              <span className="input-icon-addon"><i className="ti ti-calendar" /></span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Assign Route */}
      <Modal
        open={active === 'assign-route' && row !== null}
        onClose={onClose}
        title="Assign Route"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onAssignRoute({ route, vehicle, shift }); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Assign Route</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="driver-3">Driver</label>
            <input type="text" className="form-control" id="driver-3" value={driverLabel} readOnly />
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="route-2">
              Route <span className="text-danger">*</span>
            </label>
            <select
              className="form-select" id="route-2" required
              value={route} onChange={(event) => setRoute(event.target.value)}
            >
              <option value="">Select route</option>
              {routeOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
            <div className="invalid-feedback">Select a route.</div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="vehicle-3">Vehicle</label>
            <select
              className="form-select" id="vehicle-3"
              value={vehicle} onChange={(event) => setVehicle(event.target.value)}
            >
              <option value="">Select vehicle</option>
              {vehicleOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="shift-2">Shift</label>
            <select
              className="form-select" id="shift-2"
              value={shift} onChange={(event) => setShift(event.target.value)}
            >
              {shiftOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* Driver Documents */}
      <Modal
        open={active === 'documents' && row !== null}
        onClose={onClose}
        title="Driver Documents"
        dialogClassName="modal-lg"
        footer={<button type="button" className="btn btn-light" onClick={onClose}>Close</button>}
      >
        {row ? (
          <>
            <div className="table-responsive">
              <table className="table table-nowrap mb-3">
                <thead>
                  <tr>
                    <th>Document</th><th>Reference</th><th>Expiry</th><th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {documentsOf(row).map((doc) => (
                    <tr key={doc.label}>
                      <td><i className={doc.icon} />{doc.label}</td>
                      <td>{doc.reference}</td>
                      <td>{doc.expiry}</td>
                      <td><span className={documentBadge[doc.status]}>{doc.status}</span></td>
                      <td className="text-end">
                        <ActionLink
                          className="dt-ib"
                          title="Download"
                          ariaLabel={`Download ${doc.label}`}
                          onClick={() => onToast(`${doc.label} downloaded for ${row.code}`)}
                        >
                          <i className="ti ti-download" />
                        </ActionLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="stacked-dropdown">
              <i className="ti ti-cloud-upload" />
              <b>Upload a new document</b>
              <span className="fs-12 text-muted">PDF, JPG or PNG · max 10 MB</span>
              <input type="file" aria-label="Driver document" />
            </div>
          </>
        ) : null}
      </Modal>

      {/* License Verification */}
      <Modal
        open={active === 'license' && row !== null}
        onClose={onClose}
        title="License Verification"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onVerify(license); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Save Verification</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="driver-4">Driver</label>
            <input type="text" className="form-control" id="driver-4" value={driverLabel} readOnly />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="license-number">
              License Number <span className="text-danger">*</span>
            </label>
            <input
              type="text" className="form-control" id="license-number" required
              value={license.licenseNo} onChange={(event) => licenseField('licenseNo', event.target.value)}
            />
            <div className="invalid-feedback">Enter the license number.</div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="license-type-2">License Type</label>
            <select
              className="form-select" id="license-type-2"
              value={license.licenseType} onChange={(event) => licenseField('licenseType', event.target.value)}
            >
              {licenseTypeOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="issue-date">Issue Date</label>
            <div className="input-icon-end position-relative">
              <DateField
                value={license.issued}
                onChange={(next: string) => licenseField('issued', next)}
                format="d/m/Y"
                id="issue-date"
              />
              <span className="input-icon-addon"><i className="ti ti-calendar" /></span>
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="expiry-date">Expiry Date</label>
            <div className="input-icon-end position-relative">
              <DateField
                value={license.expires}
                onChange={(next: string) => licenseField('expires', next)}
                format="d/m/Y"
                id="expiry-date"
              />
              <span className="input-icon-addon"><i className="ti ti-calendar" /></span>
            </div>
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="verification-status">Verification Status</label>
            <select
              className="form-select" id="verification-status"
              value={license.verification} onChange={(event) => licenseField('verification', event.target.value)}
            >
              {verificationOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* Import Drivers */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Drivers"
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
          <input type="file" aria-label="Drivers file" />
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
          You want to delete {deleteCount === 1 ? 'this driver' : `all ${deleteCount} marked items`}, this
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

export default DriverModals;
