import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import SelectField from '@components/ui/SelectField';
import type { RouteType, VehicleAssignment } from '../data/vehicleAssignments.data';
import {
  assignmentLabel,
  capacityLabel,
  completeness,
  driverLabel,
  driverOptions,
  occupancyPct,
  routeLabel,
  routeOptions,
  routeTypeOptions,
  seatsFree,
  statusBadge,
  studentsLabel,
  vehicleLabel,
  vehicleOptions,
} from '../data/vehicleAssignments.data';

export type AssignModalId =
  | 'create' | 'edit' | 'view' | 'change-vehicle' | 'change-driver' | 'change-route' | 'remove';

export interface AssignmentDraft {
  vehicle: string;
  driver: string;
  route: string;
  routeType: RouteType;
  morning: string;
  evening: string;
  academicYear: string;
}

export const emptyDraft: AssignmentDraft = {
  vehicle: '', driver: '', route: '', routeType: routeTypeOptions[0],
  morning: '', evening: '', academicYear: '2026 / 2027',
};

export const draftOf = (row: VehicleAssignment): AssignmentDraft => ({
  vehicle: row.vehicle,
  driver: row.driver,
  route: row.routeCode ? `${row.routeCode} · ${row.routeName}` : '',
  routeType: row.routeType,
  morning: row.morning,
  evening: row.evening,
  academicYear: row.academicYear,
});

/** What each "change one leg" dialog hands back. */
export interface SwapResult {
  /** The arriving vehicle / driver / route. */
  value: string;
  reason: string;
}

export interface AssignVehicleModalsProps {
  active: AssignModalId | null;
  row: VehicleAssignment | null;
  onClose: () => void;
  onCreate: (draft: AssignmentDraft) => void;
  onUpdate: (draft: AssignmentDraft) => void;
  onChangeVehicle: (result: SwapResult) => void;
  onChangeDriver: (result: SwapResult) => void;
  onChangeRoute: (result: SwapResult) => void;
  onRemove: (reason: string) => void;
  /** Lets View hand off to Edit, as the template's footer button does. */
  onOpen: (modal: AssignModalId) => void;
}

const reasonOptions = [
  'Vehicle under maintenance',
  'Driver on leave',
  'Route restructured',
  'Capacity rebalanced',
  'Other',
];

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: AssignmentDraft;
  onField: <K extends keyof AssignmentDraft>(field: K, value: AssignmentDraft[K]) => void;
  /** Keeps input ids unique between the Create and Edit dialogs. */
  suffix: string;
}

const AssignmentForm = ({ draft, onField, suffix }: FormProps) => (
  <div className="row">
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`asg-vehicle${suffix}`}>
        Vehicle <span className="text-danger">*</span>
      </label>
      <SelectField
        options={vehicleOptions}
        value={draft.vehicle}
        onChange={(value) => onField('vehicle', value)}
        id={`asg-vehicle${suffix}`}
        blankLabel="Select vehicle"
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`asg-driver${suffix}`}>
        Driver <span className="text-danger">*</span>
      </label>
      <SelectField
        options={driverOptions}
        value={draft.driver}
        onChange={(value) => onField('driver', value)}
        id={`asg-driver${suffix}`}
        blankLabel="Select driver"
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`asg-route${suffix}`}>
        Route <span className="text-danger">*</span>
      </label>
      <SelectField
        options={routeOptions}
        value={draft.route}
        onChange={(value) => onField('route', value)}
        id={`asg-route${suffix}`}
        blankLabel="Select route"
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`asg-route-type${suffix}`}>Route Type</label>
      <SelectField
        options={routeTypeOptions}
        value={draft.routeType}
        onChange={(value) => onField('routeType', value as RouteType)}
        id={`asg-route-type${suffix}`}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`asg-morning${suffix}`}>Morning Shift</label>
      <input
        type="text" className="form-control" id={`asg-morning${suffix}`} placeholder="07:00 – 07:55 AM"
        value={draft.morning} onChange={(event) => onField('morning', event.target.value)}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`asg-evening${suffix}`}>Evening Shift</label>
      <input
        type="text" className="form-control" id={`asg-evening${suffix}`} placeholder="03:40 – 04:25 PM"
        value={draft.evening} onChange={(event) => onField('evening', event.target.value)}
      />
    </div></div>
    <div className="col-md-12"><div className="mb-0">
      <label className="form-label" htmlFor={`asg-year${suffix}`}>Academic Year</label>
      <SelectField
        options={['2026 / 2027', '2025 / 2026']}
        value={draft.academicYear}
        onChange={(value) => onField('academicYear', value)}
        id={`asg-year${suffix}`}
      />
    </div></div>
  </div>
);

/** The read-only Assignment field every swap dialog opens with. */
const assignmentField = (id: string, row: VehicleAssignment) => (
  <div className="col-md-12"><div className="mb-3">
    <label className="form-label" htmlFor={id}>Assignment</label>
    <input type="text" className="form-control" id={id} value={assignmentLabel(row)} readOnly />
  </div></div>
);

const pair = (label: string, value: string) => (
  <div className="d-flex align-items-center justify-content-between mb-2" key={label}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

/* --------------------------------- Modals ---------------------------------- */

const AssignVehicleModals = ({
  active, row, onClose, onCreate, onUpdate, onChangeVehicle, onChangeDriver,
  onChangeRoute, onRemove, onOpen,
}: AssignVehicleModalsProps) => {
  const [draft, setDraft] = useState<AssignmentDraft>(emptyDraft);
  const [swap, setSwap] = useState<SwapResult>({ value: '', reason: reasonOptions[0] });
  const [removeReason, setRemoveReason] = useState(reasonOptions[0]);

  useEffect(() => {
    if (active === 'create') setDraft(emptyDraft);
    if (active === 'edit' && row) setDraft(draftOf(row));
    if (active === 'change-vehicle') setSwap({ value: row?.vehicle ?? '', reason: reasonOptions[0] });
    if (active === 'change-driver') setSwap({ value: row?.driver ?? '', reason: reasonOptions[1] });
    if (active === 'change-route') {
      setSwap({ value: row?.routeCode ? `${row.routeCode} · ${row.routeName}` : '', reason: reasonOptions[2] });
    }
    if (active === 'remove') setRemoveReason(reasonOptions[0]);
  }, [active, row]);

  const field = <K extends keyof AssignmentDraft>(key: K, value: AssignmentDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const cancel = <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>;

  /** The three swap dialogs differ only in label, options and handler. */
  const swapDialog = (
    id: AssignModalId,
    title: string,
    label: string,
    options: readonly string[],
    blank: string,
    submit: (result: SwapResult) => void,
    action: string,
  ) => (
    <Modal
      open={active === id && row !== null}
      onClose={onClose}
      title={title}
      formClassName="validated-form"
      onSubmit={(event) => { event.preventDefault(); submit(swap); }}
      footer={<>{cancel}<button type="submit" className="btn btn-primary">{action}</button></>}
    >
      {row ? (
        <div className="row">
          {assignmentField(`${id}-assignment`, row)}
          <div className="col-md-12"><div className="mb-3">
            <label className="form-label" htmlFor={`${id}-value`}>
              {label} <span className="text-danger">*</span>
            </label>
            <SelectField
              options={options}
              value={swap.value}
              onChange={(value) => setSwap((current) => ({ ...current, value }))}
              id={`${id}-value`}
              blankLabel={blank}
            />
          </div></div>
          <div className="col-md-12"><div className="mb-0">
            <label className="form-label" htmlFor={`${id}-reason`}>Reason</label>
            <SelectField
              options={reasonOptions}
              value={swap.reason}
              onChange={(reason) => setSwap((current) => ({ ...current, reason }))}
              id={`${id}-reason`}
            />
          </div></div>
        </div>
      ) : null}
    </Modal>
  );

  return (
    <>
      {/* Create Assignment */}
      <Modal
        open={active === 'create'}
        onClose={onClose}
        title="Assign Vehicle"
        dialogClassName="modal-lg"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={<>{cancel}<button type="submit" className="btn btn-primary">Assign Vehicle</button></>}
      >
        <AssignmentForm draft={draft} onField={field} suffix="" />
      </Modal>

      {/* Edit Assignment */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Assignment"
        dialogClassName="modal-lg"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={<>{cancel}<button type="submit" className="btn btn-primary">Save Changes</button></>}
      >
        <AssignmentForm draft={draft} onField={field} suffix="-2" />
      </Modal>

      {/* View Assignment */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title="Assignment Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('edit')}>
              <i className="ti ti-edit me-1" />Edit Assignment
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
              <span className="avatar avatar-lg bg-primary-transparent text-primary rounded">
                <i className="ti ti-link fs-20" />
              </span>
              <div>
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  {row.code}
                  <span className={statusBadge[row.status]}>{row.statusLabel}</span>
                </h5>
                <span className="fs-12 text-muted">{routeLabel(row)} · {row.routeType}</span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Vehicle</h6>
                <div className="border rounded p-3">
                  {pair('Vehicle No', vehicleLabel(row))}
                  {pair('Type', row.vehicleKind || '—')}
                  {pair('Model', row.vehicleModel || '—')}
                  {pair('GPS Device', row.gpsDevice)}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Driver</h6>
                <div className="border rounded p-3">
                  {pair('Driver', driverLabel(row))}
                  {pair('Employee ID', row.driverCode || '—')}
                  {pair('Fitness Valid', row.fitnessValid)}
                  {pair('Unit', completeness(row))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Schedule</h6>
                <div className="border rounded p-3">
                  {pair('Morning Shift', row.morning || 'Evening only')}
                  {pair('Evening Shift', row.evening || 'Morning only')}
                  {pair('Academic Year', row.academicYear)}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Capacity</h6>
                <div className="border rounded p-3">
                  {pair('Seats', capacityLabel(row))}
                  {pair('Assigned Students', studentsLabel(row))}
                  {pair('Seats Free', row.capacity === 0 ? '—' : String(seatsFree(row)))}
                  {pair('Occupancy', row.capacity === 0 ? '—' : `${occupancyPct(row)}%`)}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {swapDialog(
        'change-vehicle', 'Change Vehicle', 'New Vehicle',
        vehicleOptions, 'Select vehicle', onChangeVehicle, 'Change Vehicle',
      )}
      {swapDialog(
        'change-driver', 'Change Driver', 'New Driver',
        driverOptions, 'Select driver', onChangeDriver, 'Change Driver',
      )}
      {swapDialog(
        'change-route', 'Change Route', 'New Route',
        routeOptions, 'Select route', onChangeRoute, 'Change Route',
      )}

      {/* Remove Assignment */}
      <Modal
        open={active === 'remove' && row !== null}
        onClose={onClose}
        title="Remove Assignment"
        onSubmit={(event) => { event.preventDefault(); onRemove(removeReason); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Keep Assignment</button>
            <button type="submit" className="btn btn-danger">Remove Assignment</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
              <i className="ti ti-alert-triangle me-2" />
              <span className="fs-13">
                {row.students > 0
                  ? `${row.students} students are riding this unit. They must be re-seated before it is removed.`
                  : 'This unit carries no students and can be removed safely.'}
              </span>
            </div>
            <div className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center">
                <span className="avatar avatar-md bg-primary-transparent text-primary rounded flex-shrink-0">
                  <i className="ti ti-link" />
                </span>
                <div className="ms-2">
                  <h5 className="fs-14 mb-0">{row.code}</h5>
                  <span className="fs-12 text-muted">
                    {vehicleLabel(row)} · {driverLabel(row)} · {routeLabel(row)}
                  </span>
                </div>
                <div className="ms-auto text-end">
                  <span className={statusBadge[row.status]}>{row.statusLabel}</span>
                </div>
              </div>
            </div>
            <div className="mb-0">
              <label className="form-label" htmlFor="remove-reason">Reason</label>
              <SelectField
                options={reasonOptions}
                value={removeReason}
                onChange={setRemoveReason}
                id="remove-reason"
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default AssignVehicleModals;
