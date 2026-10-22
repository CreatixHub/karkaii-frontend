import { useEffect, useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { RouteStatus, TransportRoute } from '../data/transportRoutes.data';
import {
  DASH,
  academicYearOptions,
  boardingPointOptions,
  destinationOptions,
  driverOptions,
  fleetLabel,
  fleetOptions,
  routeFieldOf,
  routeSummaryOf,
  seatsOf,
  shiftOptions,
  statusOptions,
  statusPill,
  stopsOf,
} from '../data/transportRoutes.data';

export type RouteModalId =
  | 'add' | 'edit' | 'view' | 'stops' | 'assign-vehicle'
  | 'assign-driver' | 'students' | 'schedule' | 'import' | 'delete';

export interface RouteDraft {
  name: string;
  code: string;
  distanceKm: string;
  boardingPoint: string;
  destination: string;
  shift: string;
  duration: string;
  pickup: string;
  drop: string;
  stops: string;
  students: string;
  fee: string;
  academicYear: string;
  status: RouteStatus;
}

export const emptyDraft: RouteDraft = {
  name: '', code: '', distanceKm: '', boardingPoint: boardingPointOptions[0],
  destination: destinationOptions[0], shift: shiftOptions[0], duration: '',
  pickup: '', drop: '', stops: '', students: '0', fee: '', academicYear: academicYearOptions[0],
  status: 'Active',
};

export const draftOf = (row: TransportRoute): RouteDraft => ({
  name: row.name,
  code: row.code,
  distanceKm: String(row.distanceKm),
  boardingPoint: row.boardingPoint,
  destination: row.destination,
  shift: row.shift,
  duration: row.duration,
  pickup: row.pickup,
  drop: row.drop,
  stops: String(row.stops),
  students: String(row.students),
  fee: String(row.fee),
  academicYear: row.academicYear,
  status: row.status,
});

/** The four admissions the template's Student Assignment select offers. */
export const studentOptions = [
  'Janet Daniel — AD202401',
  'Joann Michael — AD202402',
  'Andrew Fischer — AD202409',
  'Ralph Claudia — AD202406',
];

export const importModes = ['Create new routes', 'Update existing by code', 'Create and update'];

/** The template's Operating Days row: Mon–Fri on, Sat off. */
export const operatingDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const defaultDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export interface RouteModalsProps {
  active: RouteModalId | null;
  row: TransportRoute | null;
  /** How many rows the Delete dialog is about to remove. */
  deleteCount: number;
  onClose: () => void;
  onCreate: (draft: RouteDraft) => void;
  onUpdate: (draft: RouteDraft) => void;
  onAssignVehicle: (plate: string, type: string, effectiveDate: string) => void;
  onAssignDriver: (driver: string, shift: string, contact: string) => void;
  onAssignStudents: (students: string[], boardingStop: string, fee: string) => void;
  onSaveSchedule: (shift: string, duration: string, pickup: string, drop: string, days: string[]) => void;
  onAddStop: (name: string) => void;
  onImport: (mode: string) => void;
  onDelete: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** Lets View Route hand off to Route Schedule, as the template's footer does. */
  onOpen: (modal: RouteModalId) => void;
}

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: RouteDraft;
  onField: (field: keyof RouteDraft, value: string) => void;
  /** Keeps input ids unique between the Add and Edit dialogs. */
  suffix: string;
}

const RouteForm = ({ draft, onField, suffix }: FormProps) => {
  const running = draft.status !== 'Suspended' && draft.status !== 'Archived';

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="mb-3">
          <label className="form-label" htmlFor={`route-name${suffix}`}>Route Name</label>
          <input
            type="text" className="form-control" id={`route-name${suffix}`} placeholder="Enter Route Name"
            value={draft.name} onChange={(event) => onField('name', event.target.value)}
          />
        </div>

        {/* Fields the redesigned grid prints but the template's form omits. */}
        <div className="row">
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`route-code${suffix}`}>Route Code</label>
            <input
              type="text" className="form-control" id={`route-code${suffix}`} placeholder="RT-N01"
              value={draft.code} onChange={(event) => onField('code', event.target.value)}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`route-distance${suffix}`}>Distance (km)</label>
            <input
              type="number" className="form-control" id={`route-distance${suffix}`} min={0} placeholder="14"
              value={draft.distanceKm} onChange={(event) => onField('distanceKm', event.target.value)}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`route-boarding${suffix}`}>Boarding Point</label>
            <select
              className="form-select" id={`route-boarding${suffix}`}
              value={draft.boardingPoint} onChange={(event) => onField('boardingPoint', event.target.value)}
            >
              {boardingPointOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`route-destination${suffix}`}>Destination</label>
            <select
              className="form-select" id={`route-destination${suffix}`}
              value={draft.destination} onChange={(event) => onField('destination', event.target.value)}
            >
              {destinationOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`route-shift${suffix}`}>Shift</label>
            <select
              className="form-select" id={`route-shift${suffix}`}
              value={draft.shift} onChange={(event) => onField('shift', event.target.value)}
            >
              {shiftOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`route-duration${suffix}`}>Estimated Duration</label>
            <input
              type="text" className="form-control" id={`route-duration${suffix}`} placeholder="45 min"
              value={draft.duration} onChange={(event) => onField('duration', event.target.value)}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`route-pickup${suffix}`}>Pickup Time</label>
            <input
              type="text" className="form-control" id={`route-pickup${suffix}`} placeholder="07:00 AM"
              value={draft.pickup} onChange={(event) => onField('pickup', event.target.value)}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`route-drop${suffix}`}>Drop Time</label>
            <input
              type="text" className="form-control" id={`route-drop${suffix}`} placeholder="03:30 PM"
              value={draft.drop} onChange={(event) => onField('drop', event.target.value)}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`route-stops${suffix}`}>Total Stops</label>
            <input
              type="number" className="form-control" id={`route-stops${suffix}`} min={1} placeholder="9"
              value={draft.stops} onChange={(event) => onField('stops', event.target.value)}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`route-students${suffix}`}>Assigned Students</label>
            <input
              type="number" className="form-control" id={`route-students${suffix}`} min={0} placeholder="42"
              value={draft.students} onChange={(event) => onField('students', event.target.value)}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`route-fee${suffix}`}>Monthly Fee</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number" className="form-control" id={`route-fee${suffix}`} min={0} placeholder="60"
                value={draft.fee} onChange={(event) => onField('fee', event.target.value)}
              />
            </div>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`route-year${suffix}`}>Academic Year</label>
            <select
              className="form-select" id={`route-year${suffix}`}
              value={draft.academicYear} onChange={(event) => onField('academicYear', event.target.value)}
            >
              {academicYearOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`route-status${suffix}`}>Route Status</label>
            <select
              className="form-select" id={`route-status${suffix}`}
              value={draft.status} onChange={(event) => onField('status', event.target.value)}
            >
              {statusOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
        </div>

        {/* The template's own status toggle, kept verbatim. */}
        <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
          <div className="status-title">
            <h5>Status</h5>
            <p>Change the Status by toggle </p>
          </div>
          <div className="status-toggle modal-status">
            <input
              type="checkbox" id={`route-active${suffix}`} className="check"
              checked={running}
              onChange={(event) => onField('status', event.target.checked ? 'Active' : 'Suspended')}
            />
            <label htmlFor={`route-active${suffix}`} className="checktoggle"> </label>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------- Modals ---------------------------------- */

const RouteModals = ({
  active, row, deleteCount, onClose, onCreate, onUpdate, onAssignVehicle, onAssignDriver,
  onAssignStudents, onSaveSchedule, onAddStop, onImport, onDelete, onToast, onOpen,
}: RouteModalsProps) => {
  const [draft, setDraft] = useState<RouteDraft>(emptyDraft);
  const [vehicle, setVehicle] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('08/05/2024');
  const [driver, setDriver] = useState('');
  const [driverShift, setDriverShift] = useState<string>(shiftOptions[0]);
  const [contact, setContact] = useState('');
  const [students, setStudents] = useState<string[]>([]);
  const [boardingStop, setBoardingStop] = useState('');
  const [fee, setFee] = useState('');
  const [scheduleShift, setScheduleShift] = useState<string>(shiftOptions[0]);
  const [duration, setDuration] = useState('');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [days, setDays] = useState<string[]>(defaultDays);
  const [newStop, setNewStop] = useState('');
  const [mode, setMode] = useState(importModes[0]);

  /** Each opening seeds from the row being acted on, or a blank sheet for Add. */
  useEffect(() => {
    if (active === 'add') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (active === 'assign-vehicle' && row) {
      setVehicle(row.vehicle ? fleetLabel({ plate: row.vehicle, type: row.vehicleType }) : '');
      setEffectiveDate('08/05/2024');
    }
    if (active === 'assign-driver' && row) {
      setDriver(row.driver);
      setDriverShift(row.shift);
      setContact(row.driver ? row.driverPhone : '');
    }
    if (active === 'students' && row) {
      setStudents([]);
      setBoardingStop(row.boardingPoint);
      setFee(String(row.fee));
    }
    if (active === 'schedule' && row) {
      setScheduleShift(row.shift);
      setDuration(row.duration === DASH ? '' : row.duration);
      setPickup(row.pickup === DASH ? '' : row.pickup);
      setDrop(row.drop === DASH ? '' : row.drop);
      setDays(defaultDays);
    }
    if (active === 'stops') setNewStop('');
    if (active === 'import') setMode(importModes[0]);
  }, [active, row]);

  const field = (key: keyof RouteDraft, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const routeField = row ? routeFieldOf(row) : '';
  const chosenFleet = fleetOptions.find((entry) => fleetLabel(entry) === vehicle);

  const toggleDay = (day: string) =>
    setDays((current) => (current.includes(day) ? current.filter((d) => d !== day) : [...current, day]));

  return (
    <>
      {/* Add Route */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Route"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Route</button>
          </>
        }
      >
        <RouteForm draft={draft} onField={field} suffix="" />
      </Modal>

      {/* Edit Route */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Route"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        <RouteForm draft={draft} onField={field} suffix="-2" />
      </Modal>

      {/* View Route */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title="Route Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('schedule')}>Route Schedule</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-lg bg-primary-transparent text-primary rounded d-inline-flex align-items-center justify-content-center me-2">
                <i className="ti ti-map-2 fs-20" />
              </span>
              <div>
                <h5 className="mb-0">
                  {row.name}{' '}
                  <span className={`dt-pill ${statusPill[row.status]} ms-1`}>
                    <span className="dt-pill-dot" />{row.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">{routeSummaryOf(row)}</span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-bus" />Vehicle</h6>
                <p className="fs-13 mb-0">
                  {row.vehicle
                    ? `${row.vehicle} · ${row.vehicleType.replace(/\((\d+)\)/, '($1 seats)')}.`
                    : 'No vehicle assigned.'}
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-steering-wheel" />Driver</h6>
                {row.driver ? (
                  <div className="d-flex align-items-center gap-2">
                    <span className="avatar avatar-sm">
                      <ImageWithBasePath src={row.driverAvatar} className="rounded-circle flex-shrink-0" alt={row.driver} />
                    </span>
                    <div>
                      <span className="fw-medium d-block">{row.driver}</span>
                      <span className="fs-12 text-muted">License Verified</span>
                    </div>
                  </div>
                ) : (
                  <p className="fs-13 mb-0">No driver assigned.</p>
                )}
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-map-pins" />Stops &amp; Students</h6>
                <p className="fs-13 mb-0">
                  {row.stops} stops · {row.students} students · pickup {row.pickup}.
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-cash" />Fee &amp; Schedule</h6>
                <p className="fs-13 mb-0">
                  ${row.fee}/month · {row.duration} · drop {row.drop}.
                </p>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Manage Route Stops */}
      <Modal
        open={active === 'stops' && row !== null}
        onClose={onClose}
        title="Manage Route Stops"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => onAddStop(newStop)}>
              <i className="ti ti-plus me-1" />Add Stop
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
              <i className="ti ti-map-2 fs-16" />
              <span className="fs-13">{row.name} · {row.code} · {row.stops} stops</span>
            </div>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr><th>#</th><th>Stop</th><th>Pickup</th><th className="text-end">Students</th></tr>
                </thead>
                <tbody>
                  {stopsOf(row).map((stop) => (
                    <tr key={stop.order}>
                      <td>{stop.order}</td>
                      <td>{stop.name}</td>
                      <td>{stop.pickup}</td>
                      <td className="text-end">{stop.students}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* The template's Add Stop button links away; here it appends a stop. */}
            <div className="mt-3">
              <label className="form-label" htmlFor="new-stop">New stop name</label>
              <input
                type="text" className="form-control" id="new-stop" placeholder="Enter stop name"
                value={newStop} onChange={(event) => setNewStop(event.target.value)}
              />
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
        onSubmit={(event) => {
          event.preventDefault();
          onAssignVehicle(chosenFleet?.plate ?? '', chosenFleet?.type ?? '', effectiveDate);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Assign Vehicle</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="route-2">Route</label>
            <input type="text" className="form-control" value={routeField} readOnly id="route-2" />
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="vehicle-2">Vehicle <span className="text-danger">*</span></label>
            <select
              className="form-select" required id="vehicle-2"
              value={vehicle} onChange={(event) => setVehicle(event.target.value)}
            >
              <option value="">Select vehicle</option>
              {fleetOptions.map((entry) => (
                <option key={entry.plate}>{fleetLabel(entry)}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="seating-capacity">Seating Capacity</label>
            <input
              type="text" className="form-control" id="seating-capacity" readOnly
              value={chosenFleet ? String(seatsOf(chosenFleet.type)) : ''}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="effective-date">Effective Date</label>
            <div className="input-icon-end position-relative">
              <DateField
                value={effectiveDate}
                onChange={(next: string) => setEffectiveDate(next)}
                format="d/m/Y"
                id="effective-date"
              />
              <span className="input-icon-addon"><i className="ti ti-calendar" /></span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Assign Driver */}
      <Modal
        open={active === 'assign-driver' && row !== null}
        onClose={onClose}
        title="Assign Driver"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onAssignDriver(driver, driverShift, contact); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Assign Driver</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="route-3">Route</label>
            <input type="text" className="form-control" value={routeField} readOnly id="route-3" />
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="driver-2">Driver <span className="text-danger">*</span></label>
            <select
              className="form-select" required id="driver-2"
              value={driver} onChange={(event) => setDriver(event.target.value)}
            >
              <option value="">Select driver</option>
              {driverOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="shift-2">Shift</label>
            <select
              className="form-select" id="shift-2"
              value={driverShift} onChange={(event) => setDriverShift(event.target.value)}
            >
              {shiftOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="contact-number">Contact Number</label>
            <input
              type="text" className="form-control" placeholder="+1 ..." id="contact-number"
              value={contact} onChange={(event) => setContact(event.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Student Assignment */}
      <Modal
        open={active === 'students' && row !== null}
        onClose={onClose}
        title="Student Assignment"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onAssignStudents(students, boardingStop, fee); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Assign Students</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="route-4">Route</label>
            <input type="text" className="form-control" value={routeField} readOnly id="route-4" />
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="students">Students <span className="text-danger">*</span></label>
            <select
              className="form-select" multiple required id="students" size={4}
              value={students}
              onChange={(event) =>
                setStudents(Array.from(event.target.selectedOptions, (option) => option.value))
              }
            >
              {studentOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="boarding-stop">Boarding Stop</label>
            <select
              className="form-select" id="boarding-stop"
              value={boardingStop} onChange={(event) => setBoardingStop(event.target.value)}
            >
              {/* The template lists three fixed stops; here they come off the route. */}
              {(row ? stopsOf(row).map((stop) => stop.name) : []).map((option) => (
                <option key={option}>{option}</option>
              ))}
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

      {/* Route Schedule */}
      <Modal
        open={active === 'schedule' && row !== null}
        onClose={onClose}
        title="Route Schedule"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSaveSchedule(scheduleShift, duration, pickup, drop, days);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Save Schedule</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="route-5">Route</label>
            <input type="text" className="form-control" value={routeField} readOnly id="route-5" />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="shift-3">Shift</label>
            <select
              className="form-select" id="shift-3"
              value={scheduleShift} onChange={(event) => setScheduleShift(event.target.value)}
            >
              {shiftOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="estimated-duration">Estimated Duration</label>
            <input
              type="text" className="form-control" id="estimated-duration" placeholder="45 min"
              value={duration} onChange={(event) => setDuration(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="pickup-time">Pickup Time</label>
            <input
              type="text" className="form-control" id="pickup-time" placeholder="07:00 AM"
              value={pickup} onChange={(event) => setPickup(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="drop-time">Drop Time</label>
            <input
              type="text" className="form-control" id="drop-time" placeholder="03:30 PM"
              value={drop} onChange={(event) => setDrop(event.target.value)}
            />
          </div>
          <div className="col-md-12">
            <label className="form-label">Operating Days</label>
            <div className="d-flex flex-wrap gap-3">
              {operatingDays.map((day, index) => (
                <div className="form-check" key={day}>
                  <input
                    className="form-check-input" type="checkbox" id={`rd${index}`}
                    checked={days.includes(day)} onChange={() => toggleDay(day)}
                  />
                  <label className="form-check-label" htmlFor={`rd${index}`}>{day}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Import Routes */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Routes"
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
          <input type="file" aria-label="Routes file" />
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
          onClick={() => onToast('Route import template downloaded', 'info')}
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
          You want to delete {deleteCount === 1 ? 'this route' : `all ${deleteCount} marked items`}, this
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

export default RouteModals;
