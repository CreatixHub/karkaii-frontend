import { useEffect, useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import type { PickupPoint } from '../data/pickupPoints.data';
import {
  areaOptions,
  driverOptions,
  feeLabel,
  importModes,
  operatingDays,
  routeOptions,
  statusPill,
  studentOptions,
  transportDeskPhone,
  vehicleOptions,
  zoneOptions,
} from '../data/pickupPoints.data';

export type PickupModalId =
  | 'add' | 'edit' | 'view' | 'assign-students' | 'assign-vehicle'
  | 'schedule' | 'route' | 'import' | 'delete';

export interface PickupDraft {
  /** The template's own "Pickup Point" text box. */
  name: string;
  /** The template's own Status toggle: on = Active, off = Inactive. */
  active: boolean;
  code: string;
  route: string;
  area: string;
  zone: string;
  address: string;
  landmark: string;
  boarding: string;
  drop: string;
  distance: string;
  vehicle: string;
  driver: string;
  fee: string;
}

export const emptyDraft: PickupDraft = {
  name: '', active: true, code: '', route: routeOptions[0], area: areaOptions[0],
  zone: zoneOptions[0], address: '', landmark: '', boarding: '', drop: '',
  distance: '', vehicle: '', driver: '', fee: '',
};

export const draftOf = (row: PickupPoint): PickupDraft => ({
  name: row.name,
  active: row.status !== 'Inactive',
  code: row.code,
  route: row.route,
  area: row.area,
  zone: row.zone,
  address: row.address,
  landmark: row.landmark,
  boarding: row.boarding,
  drop: row.drop,
  distance: String(row.distance),
  vehicle: row.vehicle === '—' ? '' : row.vehicle,
  driver: row.driver,
  fee: String(row.fee),
});

/** What Assign Students hands back. */
export interface StudentAssignment {
  students: string[];
  boarding: string;
  fee: string;
}

/** What Assign Vehicle hands back. */
export interface VehicleAssignment {
  vehicle: string;
  boarding: string;
  effective: string;
}

/** What Pickup Schedule hands back. */
export interface SchedulePlan {
  boarding: string;
  drop: string;
  days: string[];
}

/** What Route Assignment hands back. */
export interface RoutePlan {
  route: string;
  sequence: string;
  zone: string;
}

export interface PickupPointModalsProps {
  active: PickupModalId | null;
  row: PickupPoint | null;
  /** How many rows the Delete dialog is about to remove. */
  deleteCount: number;
  onClose: () => void;
  onCreate: (draft: PickupDraft) => void;
  onUpdate: (draft: PickupDraft) => void;
  onAssignStudents: (assignment: StudentAssignment) => void;
  onAssignVehicle: (assignment: VehicleAssignment) => void;
  onSaveSchedule: (plan: SchedulePlan) => void;
  onAssignRoute: (plan: RoutePlan) => void;
  onDelete: () => void;
  onImport: (mode: string) => void;
  /** Lets View hand off to Assign Students, as the template's footer does. */
  onOpen: (modal: PickupModalId) => void;
}

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: PickupDraft;
  onField: <K extends keyof PickupDraft>(field: K, value: PickupDraft[K]) => void;
  /** Keeps input ids unique between the Add and Edit dialogs. */
  suffix: string;
}

const PickupForm = ({ draft, onField, suffix }: FormProps) => (
  <div className="row">
    <div className="col-md-12">
      <div className="mb-3">
        <label className="form-label" htmlFor={`pickup-point${suffix}`}>Pickup Point</label>
        <input
          type="text" className="form-control" id={`pickup-point${suffix}`} placeholder="Enter Pickup Point"
          value={draft.name} onChange={(event) => onField('name', event.target.value)}
        />
      </div>

      {/* Everything the redesigned grid prints but the template's form omits. */}
      <div className="row">
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`pickup-code${suffix}`}>Pickup Code</label>
          <input
            type="text" className="form-control" id={`pickup-code${suffix}`} placeholder="PP-N101"
            value={draft.code} onChange={(event) => onField('code', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`pickup-route${suffix}`}>Route</label>
          <select
            className="form-select" id={`pickup-route${suffix}`}
            value={draft.route} onChange={(event) => onField('route', event.target.value)}
          >
            {routeOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`pickup-area${suffix}`}>Area</label>
          <select
            className="form-select" id={`pickup-area${suffix}`}
            value={draft.area} onChange={(event) => onField('area', event.target.value)}
          >
            {areaOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`pickup-zone${suffix}`}>Zone</label>
          <select
            className="form-select" id={`pickup-zone${suffix}`}
            value={draft.zone} onChange={(event) => onField('zone', event.target.value)}
          >
            {zoneOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`pickup-address${suffix}`}>Address</label>
        <input
          type="text" className="form-control" id={`pickup-address${suffix}`}
          placeholder="12 Riverside Main Rd, Riverside Colony"
          value={draft.address} onChange={(event) => onField('address', event.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`pickup-landmark${suffix}`}>Landmark</label>
        <input
          type="text" className="form-control" id={`pickup-landmark${suffix}`} placeholder="Near Riverside Park"
          value={draft.landmark} onChange={(event) => onField('landmark', event.target.value)}
        />
      </div>
      <div className="row">
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`pickup-boarding${suffix}`}>Boarding Time</label>
          <input
            type="text" className="form-control" id={`pickup-boarding${suffix}`} placeholder="07:00 AM"
            value={draft.boarding} onChange={(event) => onField('boarding', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`pickup-drop${suffix}`}>Drop Time</label>
          <input
            type="text" className="form-control" id={`pickup-drop${suffix}`} placeholder="03:30 PM"
            value={draft.drop} onChange={(event) => onField('drop', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`pickup-distance${suffix}`}>Distance from school (km)</label>
          <input
            type="number" className="form-control" id={`pickup-distance${suffix}`} placeholder="14" min={0}
            value={draft.distance} onChange={(event) => onField('distance', event.target.value)}
          />
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`pickup-fee${suffix}`}>Monthly Fee</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number" className="form-control" id={`pickup-fee${suffix}`} placeholder="60" min={0}
              value={draft.fee} onChange={(event) => onField('fee', event.target.value)}
            />
          </div>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`pickup-vehicle${suffix}`}>Vehicle</label>
          <select
            className="form-select" id={`pickup-vehicle${suffix}`}
            value={draft.vehicle} onChange={(event) => onField('vehicle', event.target.value)}
          >
            <option value="">No vehicle assigned</option>
            {vehicleOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div></div>
        <div className="col-md-6"><div className="mb-3">
          <label className="form-label" htmlFor={`pickup-driver${suffix}`}>Driver</label>
          <select
            className="form-select" id={`pickup-driver${suffix}`}
            value={draft.driver} onChange={(event) => onField('driver', event.target.value)}
          >
            <option value="">No driver</option>
            {driverOptions.map((option) => <option key={option}>{option}</option>)}
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
            type="checkbox" id={`pickup-status${suffix}`} className="check"
            checked={draft.active} onChange={(event) => onField('active', event.target.checked)}
          />
          <label htmlFor={`pickup-status${suffix}`} className="checktoggle"> </label>
        </div>
      </div>
    </div>
  </div>
);

/* --------------------------------- Modals ---------------------------------- */

const PickupPointModals = ({
  active, row, deleteCount, onClose, onCreate, onUpdate, onAssignStudents,
  onAssignVehicle, onSaveSchedule, onAssignRoute, onDelete, onImport, onOpen,
}: PickupPointModalsProps) => {
  const [draft, setDraft] = useState<PickupDraft>(emptyDraft);
  const [students, setStudents] = useState<string[]>([]);
  const [boarding, setBoarding] = useState('');
  const [drop, setDrop] = useState('');
  const [fee, setFee] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [effective, setEffective] = useState('08/05/2024');
  const [days, setDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [route, setRoute] = useState('');
  const [sequence, setSequence] = useState('1');
  const [zone, setZone] = useState(zoneOptions[0]);
  const [mode, setMode] = useState(importModes[0]);

  /** Each opening starts from the row being worked on, or a blank sheet for Add. */
  useEffect(() => {
    if (active === 'add') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (active === 'assign-students') {
      setStudents([]);
      setBoarding(row ? row.boarding : '');
      setFee(row ? String(row.fee) : '');
    }
    if (active === 'assign-vehicle') {
      setVehicle(row && row.vehicle !== '—' ? row.vehicle : '');
      setBoarding(row ? row.boarding : '');
      setEffective('08/05/2024');
    }
    if (active === 'schedule') {
      setBoarding(row ? row.boarding : '');
      setDrop(row ? row.drop : '');
      setDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    }
    if (active === 'route') {
      setRoute(row ? row.route : '');
      setSequence('1');
      setZone(row ? row.zone : zoneOptions[0]);
    }
    if (active === 'import') setMode(importModes[0]);
  }, [active, row]);

  const field = <K extends keyof PickupDraft>(key: K, value: PickupDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const toggleDay = (day: string) =>
    setDays((current) => (current.includes(day) ? current.filter((d) => d !== day) : [...current, day]));

  const pointLabel = row ? `${row.name} — ${row.code}` : '';

  return (
    <>
      {/* Add Pickup Point */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Pickup Point"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Pickup Point</button>
          </>
        }
      >
        <PickupForm draft={draft} onField={field} suffix="-2" />
      </Modal>

      {/* Edit Pickup Point */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Pickup Point"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        <PickupForm draft={draft} onField={field} suffix="-3" />
      </Modal>

      {/* Pickup Point Details */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title="Pickup Point Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('assign-students')}>
              Assign Students
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-lg bg-primary-transparent text-primary rounded d-inline-flex align-items-center justify-content-center me-2">
                <i className="ti ti-map-pin fs-20" />
              </span>
              <div>
                <h5 className="mb-0">
                  {row.name}{' '}
                  <span className={`dt-pill ${statusPill[row.status]} ms-1`}>
                    <span className="dt-pill-dot" />{row.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">
                  {row.code} · {row.route} · {row.area} · {row.zone}
                </span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-map-2" />Address</h6>
                <p className="fs-13 mb-0">{row.address}. {row.landmark}.</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-clock-hour-4" />Schedule</h6>
                <p className="fs-13 mb-0">
                  Board {row.boarding} · Drop {row.drop} · {row.distance} km.
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-bus" />Vehicle &amp; Driver</h6>
                {row.driver ? (
                  <div className="d-flex align-items-center gap-2">
                    <span className="avatar avatar-sm">
                      <img src={row.driverAvatar} className="rounded-circle flex-shrink-0" alt={row.driver} />
                    </span>
                    <div>
                      <span className="fw-medium d-block">{row.driver}</span>
                      <span className="fs-12 text-muted">{row.vehicle}</span>
                    </div>
                  </div>
                ) : (
                  <p className="fs-13 mb-0">No vehicle or driver assigned.</p>
                )}
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-users" />Assigned</h6>
                <p className="fs-13 mb-0">{row.students} students · {feeLabel(row)}/month.</p>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Assign Students */}
      <Modal
        open={active === 'assign-students' && row !== null}
        onClose={onClose}
        title="Assign Students"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onAssignStudents({ students, boarding, fee }); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Assign Students</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="pickup-point-4">Pickup Point</label>
            <input type="text" className="form-control" id="pickup-point-4" value={pointLabel} readOnly />
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="students">
              Students <span className="text-danger">*</span>
            </label>
            <select
              className="form-select" id="students" multiple required size={4}
              value={students}
              onChange={(event) =>
                setStudents(Array.from(event.target.selectedOptions, (option) => option.value))
              }
            >
              {studentOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="boarding-time-2">Boarding Time</label>
            <input
              type="text" className="form-control" id="boarding-time-2"
              value={boarding} onChange={(event) => setBoarding(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="monthly-fee">Monthly Fee</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number" className="form-control" id="monthly-fee"
                value={fee} onChange={(event) => setFee(event.target.value)}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Assign Vehicle */}
      <Modal
        open={active === 'assign-vehicle' && row !== null}
        onClose={onClose}
        title="Assign Vehicle"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onAssignVehicle({ vehicle, boarding, effective }); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Assign Vehicle</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="pickup-point-5">Pickup Point</label>
            <input type="text" className="form-control" id="pickup-point-5" value={pointLabel} readOnly />
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
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="boarding-time-3">Boarding Time</label>
            <input
              type="text" className="form-control" id="boarding-time-3"
              value={boarding} onChange={(event) => setBoarding(event.target.value)}
            />
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

      {/* Pickup Schedule */}
      <Modal
        open={active === 'schedule' && row !== null}
        onClose={onClose}
        title="Pickup Schedule"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onSaveSchedule({ boarding, drop, days }); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Schedule</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="pickup-point-6">Pickup Point</label>
            <input type="text" className="form-control" id="pickup-point-6" value={pointLabel} readOnly />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="boarding-time-4">Boarding Time</label>
            <input
              type="text" className="form-control" id="boarding-time-4"
              value={boarding} onChange={(event) => setBoarding(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="drop-time">Drop Time</label>
            <input
              type="text" className="form-control" id="drop-time"
              value={drop} onChange={(event) => setDrop(event.target.value)}
            />
          </div>
          <div className="col-md-12">
            <label className="form-label">Operating Days</label>
            <div className="d-flex flex-wrap gap-3">
              {operatingDays.map((day, index) => (
                <div className="form-check" key={day}>
                  <input
                    className="form-check-input" type="checkbox" id={`pd${index}`}
                    checked={days.includes(day)} onChange={() => toggleDay(day)}
                  />
                  <label className="form-check-label" htmlFor={`pd${index}`}>{day}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Route Assignment */}
      <Modal
        open={active === 'route' && row !== null}
        onClose={onClose}
        title="Route Assignment"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onAssignRoute({ route, sequence, zone }); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Assign Route</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="pickup-point-7">Pickup Point</label>
            <input type="text" className="form-control" id="pickup-point-7" value={pointLabel} readOnly />
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
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="stop-sequence">Stop Sequence</label>
            <input
              type="number" className="form-control" id="stop-sequence" min={1}
              value={sequence} onChange={(event) => setSequence(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="zone-2">Zone</label>
            <select
              className="form-select" id="zone-2"
              value={zone} onChange={(event) => setZone(event.target.value)}
            >
              {zoneOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* Import Pickup Points */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Pickup Points"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onImport(mode); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Import</button>
          </>
        }
      >
        <div className="stacked-dropdown mb-3">
          <i className="ti ti-cloud-upload" />
          <b>Drop your CSV or Excel file here</b>
          <span className="fs-12 text-muted">or click to browse · max 10 MB</span>
          <input type="file" aria-label="Pickup points file" />
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
        <p className="fs-12 text-muted mt-3 mb-0">
          Questions about a stop? The transport desk is on {transportDeskPhone}.
        </p>
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
          You want to delete {deleteCount === 1 ? 'this pickup point' : `all ${deleteCount} marked items`}, this
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

export default PickupPointModals;
