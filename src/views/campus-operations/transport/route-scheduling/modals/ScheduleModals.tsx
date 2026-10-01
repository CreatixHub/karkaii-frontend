import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import SelectField from '@components/ui/SelectField';
import TimeField from '@components/ui/TimeField';
import type { RouteType, Schedule } from '../data/schedules.data';
import {
  capacityLabel,
  corridorOptions,
  driverLabel,
  driverOptions,
  routeLabel,
  routeTypeOptions,
  shiftOptions,
  statusBadge,
  stopsLabel,
  studentsLabel,
  vehicleLabel,
  vehicleOptions,
} from '../data/schedules.data';

export type ScheduleModalId =
  | 'add' | 'edit' | 'view' | 'assign-vehicle' | 'assign-driver' | 'print';

export interface ScheduleDraft {
  name: string;
  code: string;
  routeType: RouteType;
  corridor: string;
  vehicle: string;
  driver: string;
  morningTime: string;
  morningStop: string;
  eveningTime: string;
  eveningStop: string;
  stops: string;
  academicYear: string;
}

export const emptyDraft: ScheduleDraft = {
  name: '', code: '', routeType: routeTypeOptions[0], corridor: corridorOptions[0],
  vehicle: '', driver: '', morningTime: '', morningStop: '', eveningTime: '',
  eveningStop: '', stops: '', academicYear: '2026 / 2027',
};

export const draftOf = (row: Schedule): ScheduleDraft => ({
  name: row.name,
  code: row.code,
  routeType: row.routeType,
  corridor: row.corridor,
  vehicle: row.vehicle,
  driver: row.driver,
  morningTime: row.morningTime,
  morningStop: row.morningStop,
  eveningTime: row.eveningTime,
  eveningStop: row.eveningStop,
  stops: String(row.stops),
  academicYear: row.academicYear,
});

/** What Assign Vehicle and Assign Driver hand back. */
export interface AssignResult {
  value: string;
  shift: string;
  effective: string;
}

export interface ScheduleModalsProps {
  active: ScheduleModalId | null;
  row: Schedule | null;
  onClose: () => void;
  onCreate: (draft: ScheduleDraft) => void;
  onUpdate: (draft: ScheduleDraft) => void;
  onAssignVehicle: (result: AssignResult) => void;
  onAssignDriver: (result: AssignResult) => void;
  onPrint: (scope: string) => void;
  /** Lets View hand off to Edit, as the template's footer button does. */
  onOpen: (modal: ScheduleModalId) => void;
}

const printScopes = [
  'This route only',
  'All active schedules',
  'Morning trips only',
  'Evening trips only',
];

const pair = (label: string, value: string) => (
  <div className="d-flex align-items-center justify-content-between mb-2" key={label}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: ScheduleDraft;
  onField: <K extends keyof ScheduleDraft>(field: K, value: ScheduleDraft[K]) => void;
  /** Keeps input ids unique between the Add and Edit dialogs. */
  suffix: string;
}

const ScheduleForm = ({ draft, onField, suffix }: FormProps) => (
  <div className="row">
    <div className="col-md-8"><div className="mb-3">
      <label className="form-label" htmlFor={`rs-name${suffix}`}>
        Route Name <span className="text-danger">*</span>
      </label>
      <input
        type="text" className="form-control" id={`rs-name${suffix}`} placeholder="North Corridor"
        value={draft.name} onChange={(event) => onField('name', event.target.value)}
      />
    </div></div>
    <div className="col-md-4"><div className="mb-3">
      <label className="form-label" htmlFor={`rs-code${suffix}`}>Route Code</label>
      <input
        type="text" className="form-control" id={`rs-code${suffix}`} placeholder="RT-01"
        value={draft.code} onChange={(event) => onField('code', event.target.value)}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`rs-type${suffix}`}>Route Type</label>
      <SelectField
        options={routeTypeOptions}
        value={draft.routeType}
        onChange={(value) => onField('routeType', value as RouteType)}
        id={`rs-type${suffix}`}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`rs-corridor${suffix}`}>Corridor</label>
      <SelectField
        options={corridorOptions}
        value={draft.corridor}
        onChange={(value) => onField('corridor', value)}
        id={`rs-corridor${suffix}`}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`rs-vehicle${suffix}`}>Vehicle</label>
      <SelectField
        options={vehicleOptions}
        value={draft.vehicle}
        onChange={(value) => onField('vehicle', value)}
        id={`rs-vehicle${suffix}`}
        blankLabel="Select vehicle"
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`rs-driver${suffix}`}>Driver</label>
      <SelectField
        options={driverOptions}
        value={draft.driver}
        onChange={(value) => onField('driver', value)}
        id={`rs-driver${suffix}`}
        blankLabel="Select driver"
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`rs-am-time${suffix}`}>Morning Pickup</label>
      <TimeField
        value={draft.morningTime}
        onChange={(value) => onField('morningTime', value)}
        id={`rs-am-time${suffix}`}
        withIcon
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`rs-am-stop${suffix}`}>Morning First Stop</label>
      <input
        type="text" className="form-control" id={`rs-am-stop${suffix}`} placeholder="Green Park Gate"
        value={draft.morningStop} onChange={(event) => onField('morningStop', event.target.value)}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`rs-pm-time${suffix}`}>Evening Drop</label>
      <TimeField
        value={draft.eveningTime}
        onChange={(value) => onField('eveningTime', value)}
        id={`rs-pm-time${suffix}`}
        withIcon
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`rs-pm-stop${suffix}`}>Evening Last Stop</label>
      <input
        type="text" className="form-control" id={`rs-pm-stop${suffix}`} placeholder="School Main Gate"
        value={draft.eveningStop} onChange={(event) => onField('eveningStop', event.target.value)}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`rs-stops${suffix}`}>Total Stops</label>
      <input
        type="text" className="form-control" id={`rs-stops${suffix}`} placeholder="9"
        value={draft.stops} onChange={(event) => onField('stops', event.target.value)}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-0">
      <label className="form-label" htmlFor={`rs-year${suffix}`}>Academic Year</label>
      <SelectField
        options={['2026 / 2027', '2025 / 2026']}
        value={draft.academicYear}
        onChange={(value) => onField('academicYear', value)}
        id={`rs-year${suffix}`}
      />
    </div></div>
  </div>
);

/* --------------------------------- Modals ---------------------------------- */

const ScheduleModals = ({
  active, row, onClose, onCreate, onUpdate, onAssignVehicle, onAssignDriver, onPrint, onOpen,
}: ScheduleModalsProps) => {
  const [draft, setDraft] = useState<ScheduleDraft>(emptyDraft);
  const [assign, setAssign] = useState<AssignResult>({
    value: '', shift: shiftOptions[2], effective: '',
  });
  const [scope, setScope] = useState(printScopes[0]);

  useEffect(() => {
    if (active === 'add') setDraft(emptyDraft);
    if (active === 'edit' && row) setDraft(draftOf(row));
    if (active === 'assign-vehicle') {
      setAssign({ value: row?.vehicle ?? '', shift: shiftOptions[2], effective: '' });
    }
    if (active === 'assign-driver') {
      setAssign({ value: row?.driver ?? '', shift: shiftOptions[2], effective: '' });
    }
    if (active === 'print') setScope(printScopes[0]);
  }, [active, row]);

  const field = <K extends keyof ScheduleDraft>(key: K, value: ScheduleDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const cancel = <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>;

  /** The read-only Route field the assignment dialogs open with. */
  const routeField = (id: string, schedule: Schedule) => (
    <div className="col-md-12"><div className="mb-3">
      <label className="form-label" htmlFor={id}>Route</label>
      <input type="text" className="form-control" id={id} value={routeLabel(schedule)} readOnly />
    </div></div>
  );

  /** Assign Vehicle and Assign Driver differ only in label and options. */
  const assignDialog = (
    id: ScheduleModalId,
    title: string,
    label: string,
    options: readonly string[],
    blank: string,
    submit: (result: AssignResult) => void,
  ) => (
    <Modal
      open={active === id && row !== null}
      onClose={onClose}
      title={title}
      formClassName="validated-form"
      onSubmit={(event) => { event.preventDefault(); submit(assign); }}
      footer={<>{cancel}<button type="submit" className="btn btn-primary">{title}</button></>}
    >
      {row ? (
        <div className="row">
          {routeField(`${id}-route`, row)}
          <div className="col-md-12"><div className="mb-3">
            <label className="form-label" htmlFor={`${id}-value`}>
              {label} <span className="text-danger">*</span>
            </label>
            <SelectField
              options={options}
              value={assign.value}
              onChange={(value) => setAssign((current) => ({ ...current, value }))}
              id={`${id}-value`}
              blankLabel={blank}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`${id}-shift`}>Shift</label>
            <SelectField
              options={shiftOptions}
              value={assign.shift}
              onChange={(shift) => setAssign((current) => ({ ...current, shift }))}
              id={`${id}-shift`}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-0">
            <label className="form-label" htmlFor={`${id}-effective`}>Effective From</label>
            <TimeField
              value={assign.effective}
              onChange={(effective) => setAssign((current) => ({ ...current, effective }))}
              id={`${id}-effective`}
              placeholder="First trip"
              withIcon
            />
          </div></div>
        </div>
      ) : null}
    </Modal>
  );

  return (
    <>
      {/* Add Schedule */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Schedule"
        dialogClassName="modal-lg"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={<>{cancel}<button type="submit" className="btn btn-primary">Add Schedule</button></>}
      >
        <ScheduleForm draft={draft} onField={field} suffix="" />
      </Modal>

      {/* Edit Schedule */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Schedule"
        dialogClassName="modal-lg"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={<>{cancel}<button type="submit" className="btn btn-primary">Save Changes</button></>}
      >
        <ScheduleForm draft={draft} onField={field} suffix="-2" />
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
            <button type="button" className="btn btn-primary" onClick={() => onOpen('edit')}>
              <i className="ti ti-edit me-1" />Edit Schedule
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
              <span className={`avatar avatar-lg bg-${row.tint}-transparent text-${row.tint} rounded`}>
                <i className="ti ti-route fs-20" />
              </span>
              <div>
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  {row.name}
                  <span className={statusBadge[row.status]}>{row.statusLabel}</span>
                </h5>
                <span className="fs-12 text-muted">
                  {row.code} · {row.routeType} · {stopsLabel(row)}
                </span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Unit</h6>
                <div className="border rounded p-3">
                  {pair('Vehicle', vehicleLabel(row))}
                  {pair('Type', row.vehicleKind || '—')}
                  {pair('Driver', driverLabel(row))}
                  {pair('Employee ID', row.driverCode || '—')}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Timings</h6>
                <div className="border rounded p-3">
                  {pair('Morning Pickup', row.morningTime || 'Evening only')}
                  {pair('First Stop', row.morningStop || '—')}
                  {pair('Evening Drop', row.eveningTime || 'Morning only')}
                  {pair('Last Stop', row.eveningStop || '—')}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Load</h6>
                <div className="border rounded p-3">
                  {pair('Capacity', capacityLabel(row))}
                  {pair('Assigned Students', studentsLabel(row))}
                  {pair('Total Stops', stopsLabel(row))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Schedule</h6>
                <div className="border rounded p-3">
                  {pair('Corridor', row.corridor)}
                  {pair('Academic Year', row.academicYear)}
                  {pair('Last Updated', row.updated)}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {assignDialog(
        'assign-vehicle', 'Assign Vehicle', 'Vehicle',
        vehicleOptions, 'Select vehicle', onAssignVehicle,
      )}
      {assignDialog(
        'assign-driver', 'Assign Driver', 'Driver',
        driverOptions, 'Select driver', onAssignDriver,
      )}

      {/* Print Schedule */}
      <Modal
        open={active === 'print'}
        onClose={onClose}
        title="Print Schedule"
        onSubmit={(event) => { event.preventDefault(); onPrint(scope); }}
        footer={
          <>
            {cancel}
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-printer me-1" />Print Schedule
            </button>
          </>
        }
      >
        {row ? (
          <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
            <i className="ti ti-route fs-16" />
            <span className="fs-13">{routeLabel(row)} · {row.routeType}</span>
          </div>
        ) : null}
        <div className="mb-0">
          <label className="form-label" htmlFor="print-scope">What to print</label>
          <SelectField options={printScopes} value={scope} onChange={setScope} id="print-scope" />
        </div>
      </Modal>
    </>
  );
};

export default ScheduleModals;
